//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Keyboard, View, Text, Animated, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Modal, TextInput, Platform, KeyboardAvoidingView } from 'react-native';

//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import PushNotification from 'react-native-push-notification';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
import RnBgTask from 'react-native-bg-thread';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import fetch_blob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';
import RNShareFile from 'react-native-share-pdf';
import PDFView from 'react-native-view-pdf';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
//#endregion

//#region Chaves de filtragem
const KEYS_TO_FILTERS_LEADS = ['nome', 'ocupacao.nome', 'identificador.subLocal.descricao']
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Vendas, D4Sign } from "../../../services";
//#endregion

//#region Redux
import { DadosLeadActions, TelaAtualActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
//#endregion

//#region Componentes
import { Container, Logo, NomeEmpresa, Header } from '../../../components';
import { ModalCadastroDoLead, ModalLoading, ModalEnviandoArquivos, ModalDeletandoArquivos, ModalSucesso, ModalFalha } from '../../Modais';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
//#endregion

//#endregion

class ContratosPendentes extends Component {
  _isMounted = false;
  //#region Funcoes do componente
  componentDidMount = async () => {
    this._isMounted = true;

    try {
      if(Platform.OS === "ios" && !Platform.isPad && !Platform.isTVOS)
      {
        const deviceId = getDeviceId()

        const numberId = deviceId.replace("iPhone", "").substr(0, 2)
        
        if (numberId == 'X' || numberId == "X,") 
        {
          this.setState({ID: "X"})
        }
        else
        {
          const ID = parseInt(numberId)
          this.setState({ID: ID})
        }
      }
      else
      {
        const ID = ""
        this.setState({ID: ID})
      }

    } catch {}

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      // await this.refreshListaLeads()
    })
    await this.setVisibilidadeLoading(true)
    await this.pegandoListaDeLeadsNoBancoDeDados()
  }
  //#endregion

  //#region Component Unmount
  componentWillUnmount() {
    this._isMounted = false;
  }
  //#endregion

  //#region Model
  state = {
    opacidadeHeader: new Animated.Value(1),
    escalaHeader: new Animated.ValueXY({x: 0, y: 1}),
    VisibilidadeModalCadastroDoLead: false,
    VisibilidadeModalLoading: false,
    VisibilidadeModalEnviandoArquivos: false,
    VisibilidadeModalDeleltandoArquivos: false,
    VisibilidadeModalSucesso: false,
    VisibilidadeModalFalha: false,
    VisibilidadeModalPDF: false,
    VisibilidadeModalFiltrosGAVResorts: false,
    VisibilidadeModalOpcoesContrato: false,
    PDFContrato: "",
    PDFDescricaoContrato: "",
    PDFExtensaoContrato: "",
    ListaLeads: [],
    ListaOriginal: [],
    ListaFiltrada: [],
    ListaExibida: [],
    LocaisDeCaptacao: [],
    FiltrosAplicaveis: [],
    refs: [],
    quantItem: 20,
    distanceEnd: null,
    distanceEndInitial: null,
    loadMore: false,
    TermLeads: '',
    searchTermLeads: '',
    Nome: null,
    Email: null,
    TelefoneP: null,
    finalidade: null,
    IdLead: 0,
    dadosLead: [],
    ID: "",
    showMinDate: false,
    showMaxDate: false,
    MinDate: null,
    MaxDate: null,
    scrollFlatY: new Animated.Value(0),
    contratoSelecionado: null,
  };
  //#endregion

  //#region View
  render() {

    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
        <Modal // Compartilhar ou mostrar PDF do contrato
          animationType = 'slide'
          visible = {this.state.VisibilidadeModalPDF}
          transparent = {false}
        >
          <View style = {{flex: 1}}>
            <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Icon 
                  style = {{ marginLeft: 30, marginTop: 40 }}
                  name = 'close'
                  size = {40} 
                  color = {'rgba(0, 0, 0, 0.5)'}
                  onPress = {() => {this.setVisibilidadeModalPDF(false)}}
                />
              </View>
              <View>
                <Icon 
                  style = {{ marginRight: 30, marginTop: 40 }}
                  name = 'share' 
                  size = {40} 
                  color = {'rgba(0, 0, 0, 0.5)'}
                  onPress = {async () => { const showError = await RNShareFile.sharePDF(this.state.PDFContrato, `${this.state.PDFDescricaoContrato}.${this.state.PDFExtensaoContrato}`) }}
                />
              </View>
            </View>
            <PDFView
              fadeInDuration = {250}
              style = {{flex: 1}}
              resource = {this.state.PDFContrato}
              resourceType = {"base64"}
              onLoad = {() => {}}
              onError = {() => {}}
            />
          </View>
        </Modal>
        <Modal // Filtros Gav Resorts
          animationType = 'slide'
          visible = {this.state.VisibilidadeModalFiltrosGAVResorts}
          transparent = {false}>
          <KeyboardAvoidingView
            style = {{flex: 1}} behavior = {Platform.OS === "ios" ? "padding" : "height"}>
            <View
              style = {{
                backgroundColor: this.props.StyleGlobal.cores.background, 
                height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 72,
                marginBottom: 10,
                justifyContent: "center"
            }}>
              <View 
                style = {{
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10
              }}>
                <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40} style = {{}}
                  onPress = {() => {this.setState({VisibilidadeModalFiltrosGAVResorts: false})}}/>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#FFFFFF'
                }}>Filtros aplicáveis</Text>              
                <View style = {{width: 40}}></View>
              </View>
            </View>
            <ScrollView
              ref = { (ref) => this.ScrollViewFiltroGAV = ref } showsVerticalScrollIndicator = {false}
              scrollEventThrottle = {16}>
                <View
                  style = {{
                    minHeight: Dimensions.get('window').height - 190, 
                    borderTopWidth: 0, marginBottom: 20, marginHorizontal: 10,
                    justifyContent: "center"
                }}>
                  {this.state.FiltrosAplicaveis.map((filtros, index) => (
                  <View key = {String(index)}>
                    {filtros.tipo.id == 5 && 
                      <View key = {String(index)} style = {{height: 50, marginBottom: 10}}>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 13,
                            color: '#677367',
                            paddingBottom: 10,
                            backgroundColor: "#FFFFFF"
                        }}>{filtros.nome}</Text>
                        <View 
                            style = {{
                              flexDirection: 'row', alignItems: 'center', backgroundColor: "#FFFFFF"
                          }}>
                            <View
                              style = {{
                                flex: 1,
                                backgroundColor: '#FFFFFF',
                                paddingHorizontal: 3,
                                borderWidth: 1,
                                borderColor: 'rgba(16, 22, 26, 0.15)',
                                marginBottom: 5,
                                borderRadius: 5, 
                                marginRight: 5,
                                height: 50,
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                              <TouchableOpacity activeOpacity = {0.5}
                                onPress = {async () => {
                                  await this.setState({showMinDate: true})
                                }}
                                style = {{height: "100%", alignItems: 'center', justifyContent: 'center'}}>
                                  <Text style = {{color: "#696969"}}>{moment(this.state.MinDate == null ? filtros.regraGeral.opcoes[2].descricao : this.state.MinDate, true).format('DD/MM/YYYY')}</Text>
                              </TouchableOpacity>
                              <DateTimePickerModal
                                ref = {(component) => {
                                  if (component != null && this.state.refs.indexOf(component) == -1 && this.state.refs.length < (this.props.EmpresaLogada[0] == 4 ? (this.state.FiltrosAplicaveis.length) : this.state.FiltrosAplicaveis.length))
                                  {
                                    this.state.refs.push(component)
                                  }
                                }}
                                isVisible = {this.state.showMinDate}
                                mode = {"date"}
                                locale = {"pt-BR"}
                                date = {this.state.MinDate == null ? new Date(filtros.regraGeral.opcoes[2].descricao) : new Date(this.state.MinDate)}
                                minimumDate = {new Date(filtros.regraGeral.opcoes[0].descricao)}
                                maximumDate = {new Date(filtros.regraGeral.opcoes[1].descricao)}
                                headerTextIOS = {"Data mínima"}
                                cancelTextIOS = {"Cancelar"}
                                confirmTextIOS = {"Confirmar"}
                                onConfirm = { async (date) => { this.setState({MinDate: date, showMinDate: false}) }}
                                onCancel = { async () => { this.setState({showMinDate: false}) }}
                              />
                            </View>
                            <Text style = {{marginRight: 5, fontWeight: "normal"}}>à</Text>
                            <View
                              style = {{
                                flex: 1,
                                backgroundColor: '#FFFFFF',
                                paddingHorizontal: 3,
                                borderWidth: 1,
                                borderColor: 'rgba(16, 22, 26, 0.15)',
                                marginBottom: 5,
                                borderRadius: 10,
                                height: 50,
                                alignItems: "center",
                                justifyContent: "center"
                              }}>
                              <TouchableOpacity activeOpacity = {0.5}
                                onPress = {async () => {
                                  await this.setState({showMaxDate: true})
                                }}
                                style = {{height: "100%", alignItems: 'center', justifyContent: 'center'}}>
                                  <Text style = {{color: "#696969"}}>{moment(this.state.MaxDate == null ? filtros.regraGeral.opcoes[3].descricao : this.state.MaxDate, true).format('DD/MM/YYYY')}</Text>
                              </TouchableOpacity>
                              <DateTimePickerModal
                                isVisible = {this.state.showMaxDate}
                                mode = {"date"}
                                locale = {"pt-BR"}
                                date = { this.state.MaxDate == null ? new Date(filtros.regraGeral.opcoes[3].descricao) : new Date(this.state.MaxDate) }
                                minimumDate = { new Date(filtros.regraGeral.opcoes[0].descricao) }
                                maximumDate = { new Date(filtros.regraGeral.opcoes[1].descricao) }
                                headerTextIOS = {"Data máxima"}
                                cancelTextIOS = {"Cancelar"}
                                confirmTextIOS = {"Confirmar"}
                                onConfirm = { async (date) => { await this.setState({MaxDate: date, showMaxDate: false}) }}
                                onCancel = { async () => {  await this.setState({showMaxDate: false}) }}
                              />
                            </View>
                        </View>
                      </View>
                    }
                    {filtros.tipo.id == 4 &&
                      <View key = {String(index)}>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 13,
                            color: '#677367',
                            paddingBottom: 10,
                            backgroundColor: "#ffffff"
                          }}>{filtros.nome}</Text>
                        <View 
                          style={{
                            flex: 1,
                            backgroundColor: '#FFFFFF',
                            paddingVertical: 8,
                            paddingHorizontal: 3,
                            marginBottom: 5,
                            borderRadius: 5
                        }}> 
                          <View style = {{marginBottom: filtros.selectedItems.length == 0 ? 0 : 10, flexDirection: "row", width: "100%", flexWrap: "wrap"}}>
                            {(filtros.selectedItems).map((Item, index) => (
                              <View
                                style = {{
                                  backgroundColor: this.props.StyleGlobal.cores.background,
                                  paddingHorizontal: 8,
                                  paddingVertical: 12,
                                  borderRadius: 5,
                                  alignItems: 'center',
                                  flexDirection: "row",
                                  maxWidth: "50%",
                                  marginVertical: 3,
                                  marginRight: 5,
                                  justifyContent: "space-between"
                              }}>
                                <Text 
                                  style = {{
                                    fontSize: 12, 
                                    color: "#FFFFFF",
                                    fontWeight: "bold",
                                    maxWidth: "90%"
                                }} numberOfLines = {1} ellipsizeMode = {"tail"}>{Item}</Text>
                                <Icon name = "close" color = "#FFFFFF" size = {20}
                                  onPress = { async () => {
                                    filtros.selectedItems =  await (filtros.selectedItems).filter((item) => item != Item)
                                    await this.setState({Renderizar: true})
                                }}/>
                              </View>
                            ))}
                          </View>
                          <MultiSelect
                            styleSelectorContainer = {{maxHeight: 300, flex: 1}}
                            hideTags
                            searchIcon = {<Icon name = 'search' size = {20} color = {this.props.StyleGlobal.cores.background}/>}
                            items = {filtros.regraGeral.opcoes}
                            uniqueKey = "descricao"
                            ref = {(component) => {

                              if (component != null && this.state.refs.indexOf(component) == -1 && this.state.refs.length < (this.state.FiltrosAplicaveis.length))
                              {
                                this.state.refs.push(component)
                              }

                            }}
                            filterMethod = {"full"}
                            onSelectedItemsChange = { (selectedItems) => {
                              filtros.selectedItems = selectedItems
                              this.setState({Renderizar: true})
                            }}
                            onClearSelector = {() => console.log("aaaaa")}
                            selectedItems = {filtros.selectedItems}
                            selectText = {filtros.selectedItems.length == 0 ? "Selecione a empresa" : "Items selecionados"}
                            searchInputPlaceholderText = "Procurando Itens..."
                            styleItemsContainer = {{ marginVertical: 10 }}
                            onChangeInput = {() => {  }}
                            tagRemoveIconColor = {this.props.StyleGlobal.cores.background}
                            tagBorderColor = {this.props.StyleGlobal.cores.background}
                            tagTextColor = {this.props.StyleGlobal.cores.background}
                            selectedItemTextColor = {"#696969"}
                            selectedItemIconColor = {"#696969"}
                            itemTextColor = {this.props.StyleGlobal.cores.background}
                            displayKey = "descricao"
                            searchInputStyle = {{ color: this.props.StyleGlobal.cores.background }}
                            submitButtonColor = {this.props.StyleGlobal.cores.background}
                            submitButtonText = "Selecionar"
                          />
                        </View>
                      </View>
                    }
                  </View>
                  ))}
                </View>
            </ScrollView>
          </KeyboardAvoidingView> 
            <View
              style = {{ marginHorizontal: 24, justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style = {{
                  width: '100%', 
                  backgroundColor: this.props.StyleGlobal.cores.background,
                  height: 58,
                  alignItems: 'center',
                  justifyContent: "center",
                  marginBottom: 23,
                  borderRadius: 5
              }}
              onPress = { async() => {

                let FiltroSala = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "Sala")[0].selectedItems ?? []
                let FiltroCliente = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "Cliente")[0].selectedItems ?? []
                let FiltroUnidade = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "Unidade")[0].selectedItems ?? []
                let FiltroRespCadastro = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "Resp. pelo cadastro")[0].selectedItems ?? []


                let ContratosFiltrados = this.state.ListaLeads.filter((Item) => ((FiltroUnidade.length == 0 || FiltroUnidade.filter((_item) => _item == Item.Identificador.SubLocal.Descricao).length > 0) 
                && (FiltroSala.length == 0 || FiltroSala.filter((_item) => _item == Item.SalaDeVenda).length > 0)
                && (FiltroCliente.length == 0 || FiltroCliente.filter((_item) => _item == Item.Prospects[0].Nome).length > 0)
                && (FiltroRespCadastro.length == 0 || FiltroRespCadastro.filter((_item) => _item == Item.RespCadastroNome).length > 0) 
                && (this.state.MinDate == null || moment(Item.dataDaVenda) >= moment(this.state.MinData))
                && (this.state.MaxDate == null || moment(Item.dataDaVenda) <= moment(this.state.MaxDate))))

                this.state.ListaFiltrada = ContratosFiltrados
                this.state.ListaExibida = [];

                if (ContratosFiltrados.length >= 20)
                {
                  this.state.ListaExibida = ContratosFiltrados.slice(0, 20)
                }
                else
                {
                  this.state.ListaExibida = ContratosFiltrados.slice(0, ContratosFiltrados.length)
                }

                await this.setState({VisibilidadeModalFiltrosGAVResorts: false})
              }}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    alignSelf: 'center'
                }}>Filtrar</Text>
              </TouchableOpacity>
            </View>
        </Modal>
        <Modal // Option Contrato
          visible = {this.state.VisibilidadeModalOpcoesContrato}
          transparent = {false}
          animationType = {"slide"}>
          <View
            style = {{
              backgroundColor: this.props.StyleGlobal.cores.background,
              height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 72,
              marginBottom: 10,
              justifyContent: "center"
          }}>
            <View 
              style = {{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40} style = {{}}
                onPress = {() => {this.setState({VisibilidadeModalOpcoesContrato: false})}}/>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#FFFFFF'
              }}>Opções</Text>     
              <View style = {{width: 40}}></View>
            </View>
          </View>
          <ScrollView ref = { (ref) => this.ScrollViewFiltroOpcoes = ref } 
            showsVerticalScrollIndicator = {false}
            scrollEventThrottle = {16}>
            <View
              style = {{
                minHeight: Dimensions.get('window').height - 85,
                borderTopWidth: 0, 
                marginHorizontal: 10,
                justifyContent: "flex-start",
                alignItems: 'center'
            }}>
              <TouchableOpacity activeOpacity = {0.75}
                style = {{
                  marginHorizontal: 8,
                  backgroundColor: '#F8F8F8',
                  width: '100%',
                  borderWidth: 1,
                  borderColor: '#F5F6F8',
                  marginVertical: 15,
                  borderRadius: 5,
                  height: 58,
                  alignItems: "center",
                  justifyContent: "center"
              }}
              onPress = { async () => {
                await this.emitirContrato(this.state.contratoSelecionado)
                await this.setState({VisibilidadeModalOpcoesContrato: false})
              }}>
                <Text 
                  style = {{
                    paddingVertical: 0,
                    fontSize: 13,
                    color: '#262825',
                    fontWeight: 'normal',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                }}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity = {0.75}
                style = {{
                  marginHorizontal: 8,
                  backgroundColor: '#F8F8F8',
                  width: '100%',
                  borderWidth: 1,
                  borderColor: '#F5F6F8',
                  marginVertical: 5,
                  borderRadius: 15,
                  height: 58,
                  alignItems: "center",
                  justifyContent: "center"
              }}
              onPress = { async () => {
                await this.pegarEspelhoDeVendas(this.state.contratoSelecionado)
              }}>
                <Text 
                  style = {{
                    paddingVertical: 0,
                    fontSize: 13,
                    color: '#262825',
                    fontWeight: 'normal',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                }}>Espelho de vendas</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity = {0.75}
                style = {{
                  marginHorizontal: 8,
                  backgroundColor: '#F8F8F8',
                  width: '100%',
                  borderWidth: 1,
                  borderColor: '#F5F6F8',
                  marginVertical: 15,
                  borderRadius: 5,
                  height: 58,
                  alignItems: "center",
                  justifyContent: "center"
              }}
              onPress = { async () => {
                await this.submeterAssinatura(this.state.contratoSelecionado)
              }}>
                <Text 
                  style = {{
                    paddingVertical: 0,
                    fontSize: 13,
                    color: '#262825',
                    fontWeight: 'normal',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                }}>Submeter a assinatura</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
        <ModalLoading visibilidade = {this.state.VisibilidadeModalLoading} onPress = {() => {this.setVisibilidadeLoading(false)}}/>
        {this.state.VisibilidadeModalLoading == false && <>
        <View
          style = {{
            backgroundColor: this.props.StyleGlobal.cores.background, 
            height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 178 : 168,
            justifyContent: "center"
        }}>
          <View 
            style = {{
              flexDirection: 'row', 
              alignItems: 'center', 
              width: '100%',
              justifyContent: 'space-between',
              marginTop: 10
          }}>
            <Icon name = {'keyboard-arrow-left'} color = {'#FFF'} size = {40} style = {{}}
              onPress = {() => {this.props.navigation.goBack()}}/>
            <Text
              style = {{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 14,
                textAlign: 'center',
                color: '#FFFFFF'
            }}>Meus contratos</Text>
            <View style = {{width: 40}}></View>
          </View>
          <View
            style = {{
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent:'space-between', 
              backgroundColor: '#FFFFFF', 
              marginHorizontal: 8, 
              height: 58,
              marginVertical: 5,
              borderRadius: 5
          }}>
            <SearchInput
              onChangeText = {(term) => {this.searchUpdateLeads(term)}}
              style = {{
                paddingHorizontal: 16,
                height: 58,
                fontSize: 14,
                width: Dimensions.get('window').width * 0.88
              }}
              placeholder = 'Pesquise aqui pelo identificador...'
              placeholderTextColor = '#696969'
            />
            <Icon name = 'search' size = {30} color = {'#696969'} style = {{marginRight: 5}}/>
          </View>
          <View style = {{alignItems: 'flex-end', marginTop: 10}}>
            {/* {this.props.EmpresaLogada[0] == 8 &&
            <TouchableOpacity activeOpacity = {1} style = {{flexDirection: 'row', alignItems: 'center', marginRight: 8, width: 155, borderRadius: 5}}
              onPress = {async () => {}}>
              <Icon name = 'list' size = {25} color = {'#FFFFFF'} style = {{marginRight: 5, marginLeft: 5}}/>
              <Text style = {{color: '#FFFFFF', fontSize: 15, fontWeight: "bold"}}>Filtros aplicáveis</Text>
            </TouchableOpacity>} */}
            {this.props.EmpresaLogada[0] == 4 &&
            <TouchableOpacity activeOpacity = {1} style = {{flexDirection: 'row', alignItems: 'center', marginRight: 8, width: 155, borderRadius: 5}}
              onPress = {async () => {
                this.setState({VisibilidadeModalFiltrosGAVResorts: true})
            }}>
              <Icon name = 'list' size = {25} color = {'#FFFFFF'} style = {{marginRight: 5, marginLeft: 5}}/>
              <Text style = {{color: '#FFFFFF', fontSize: 15, fontWeight: "bold"}}>Filtros aplicáveis</Text>
            </TouchableOpacity>}
          </View>
        </View>
        <Animated.FlatList
          ref = {(ref) => this.flatList = ref}
          style = {{ marginVertical: 10, marginHorizontal: 8 }}
          onScroll = {Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollFlatY}}}],
            {useNativeDriver: true}
          )}
          showsVerticalScrollIndicator = {false}
          onEndReached = {async () => {
            this.setState({loadMore: true})
            const quantAnterior = this.state.quantItem;
            const ListaAdd = [];
            this.state.quantItem = (this.state.quantItem + 20);
            if ((this.state.ListaFiltrada.length > this.state.quantItem)) {
              try {
                for (var i = (quantAnterior); i <= (this.state.quantItem - 1); i++) {
                  ListaAdd.push(this.state.ListaFiltrada[i])
                }
                await this.setState({ListaExibida: this.state.ListaExibida.concat(ListaAdd)})
                await this.setState({loadMore: false})
              } catch {}
            } else if (this.state.ListaFiltrada.length < this.state.quantItem) {
              try {
                for (var i = (quantAnterior); i <= (this.state.ListaFiltrada.length - 1); i++) {
                  ListaAdd.push(this.state.ListaFiltrada[i])
                }
                this.state.quantItem = this.state.ListaFiltrada.length;
                await this.setState({ListaExibida: this.state.ListaExibida.concat(ListaAdd)})
                await this.setState({loadMore: false})
              } catch {await this.setState({isLoadingFooter: true})}
            }
          }}
          onEndReachedThreshold = {0.1}
          data = {this.state.ListaExibida}
          keyExtractor = {item => String(item.Numero)}
          renderItem = {({ item, index }) => {
            
            const inputRange = [
              -1,
              0,
              (120 * index),
              (120 * (index + 2))
            ]

            const scale = this.state.scrollFlatY.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 0]
            })

            const opacityInputRange = [
              -1,
              0,
              (120 * index),
              (120 * (index + 1))
            ]

            const opacity = this.state.scrollFlatY.interpolate({
              inputRange: opacityInputRange,
              outputRange: [1, 1, 1, 0]
            })
            
            return (
              <>
                <Animated.View key = {item.Numero}
                  style = {[{
                    backgroundColor: '#FFFFFF',
                    paddingHorizontal: 16,
                    width: '100%',
                    height: 100,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: 'rgba(16, 22, 26, 0.15)',
                    justifyContent: "center",
                    marginVertical: 2,
                    opacity
                  }, {transform: [{scale}]}
                ]}>
                  <TouchableOpacity activeOpacity = {1}
                    onPress = { async () => {
          
                  }}>
                    <View
                      style = {{ width: '100%' }}>
                      <View
                        style = {{
                          width: '100%', 
                          justifyContent: 'center',
                      }}>
                        {item.Identificador.SubLocal != '' && item.Identificador.SubLocal != null &&
                        <Text 
                          style = {{
                            fontSize: 12,
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            color: '#262825',
                            flexWrap: 'wrap'
                        }}>{item.Identificador.SubLocal.Descricao}</Text>}
                      </View>
                      <View 
                        style = {{
                          flexDirection: 'row',
                          width: '100%', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 5,
                      }}>
                        <View>
                          {item.Prospects != '' && item.Prospects[0].Nome != '' && item.Prospects[0].Nome != null &&
                          <Text 
                            style = {{
                              fontSize: 10,
                              fontStyle: 'normal',
                              fontWeight: 'normal',
                              color: '#8F998F',
                          }} numberOfLines = {1} ellipsizeMode = {'tail'}>{item.Prospects[0].Nome}</Text>}
                          {item.Identificador.ValorAVista != '' && item.Identificador.ValorAVista != null &&
                          <Text 
                            style = {{
                              fontSize: 10,
                              fontStyle: 'normal',
                              fontWeight: 'normal',
                              color: '#8F998F',
                          }} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.FormatarTexto((item.Identificador.ValorAVista))}</Text>}
                        </View>
                        <View 
                          style = {{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            paddingRight: 10,
                          }}>
                          <TouchableOpacity
                            style = {{
                              paddingVertical: 6,
                              paddingHorizontal: 10,
                              marginRight: 10, 
                              backgroundColor: this.props.StyleGlobal.cores.background,
                              flexDirection: 'row',
                              borderWidth: 1,
                              borderColor: this.props.StyleGlobal.cores.background,
                              borderRadius: 5,
                          }}
                          onPress = { async () => {
                            if(this.props.EmpresaLogada[0] == 4) 
                            {
                              this.state.contratoSelecionado = item
                              await this.setState({VisibilidadeModalOpcoesContrato: true})
                            }
                            else
                            {
                              await this.emitirContrato(item)
                            }
                          }}>
                            <Text
                              style = {{
                                fontSize: 12, 
                                color: "#FFFFFF",
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                alignSelf: 'center',
                                marginVertical: 4,
                                marginHorizontal: 0,
                            }}>Download</Text>
                          </TouchableOpacity>
                          {false &&
                          <TouchableOpacity
                            style = {{
                              paddingVertical: 6,
                              paddingHorizontal: 10,
                              marginRight: 10, 
                              backgroundColor: this.props.StyleGlobal.cores.botao,
                              flexDirection: 'row',
                              borderWidth: 1,
                              borderColor: this.ptops.StyleGlobal.cores.botao
                          }} onPress = {async () => {

                          }}>
                            <Text 
                              style = {{
                                fontSize: 12, 
                                color: '#FFFFFF',
                                fontStyle: 'normal',
                                fontWeight: '500',
                                textAlign: 'center',
                                alignSelf: 'center',
                                marginVertical: 4,
                                marginHorizontal: 0
                            }}>Contrato Inter.</Text>
                          </TouchableOpacity>}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </>
          )}}
          refreshing = {true}
        />
        </>}
      </Container>
    );
  }
  //#endregion

  //#region Controller

  //#region Manipulação de estado do Keyboard
  UNSAFE_componentWillMount = async () => {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
  }

  componentWillUnmount() {
    this.focusListener.remove()
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow = async () => {
    this.state.keyboardDidShow == false ? await this.setState({keyboardDidShow: true}) : await this.setState({keyboardDidShow: true})
  }

  _keyboardDidHide = async () => {
    
    this.setState({isLoadingHeader: true, keyboardDidShow: false, loadMore: false})
    
    RnBgTask.runInBackground(async () => {this.searchUpdateLeads(this.state.TermLeads)})
  }
  //#endregion

  //#region Emitir contrato pendente
  emitirContrato = async (item) => {
    await this.setVisibilidadeLoading(true)
    const response = await Vendas.consultarcompactarcontratos(this.props.token[0].token, this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, item.Numero, false)
    if(response != null && response != undefined && response != "")
    {
      await this.setState({PDFContrato: response.arquivo, PDFDescricaoContrato: response.descricao, PDFExtensaoContrato: response.extensao})
      await this.setVisibilidadeLoading(false)
      await this.setVisibilidadeModalPDF(true)
    }
    else
    {
      await this.setVisibilidadeLoading(false)
    }
  }
  //#endregion

  //#region D4Sign
  submeterAssinatura = async (item) => {
    await this.setVisibilidadeLoading(true)
    let Response = await D4Sign.submeterAssinatura(this.props.token[0].token, item)
    if(Math.floor(Response.status / 100) == 2)
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Contrato submetido a assinatura..`
      })
      await this.setVisibilidadeLoading(false)
      await this.setState({VisibilidadeModalOpcoesContrato: false})
    }
    else
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Aviso: ${Response.request._response}`
      })
      await this.setVisibilidadeLoading(false)
    }
  }
  //#endregion

  //#region Espelho de vendas
  pegarEspelhoDeVendas = async (item) => {
    await this.setVisibilidadeLoading(true)
    let Response = await Vendas.consultarDocumentosDoContrato(this.props.token[0].token, this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, item.Numero, "21. Espelho da Venda")
    if(Math.floor(Response.status / 100) == 2)
    {
      await this.setVisibilidadeLoading(false)
    }
    else
    {
      await this.setVisibilidadeLoading(false)
    }
  }
  //#endregion

  //#region Emitir contrato de intermediação pendente
  emitirContratoInter = async (item) => {
    await this.setVisibilidadeLoading(true)
    const response = await Vendas.consultarcontratos(this.props.token[0].token, this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, item.numero)
    if(response != null && response != undefined && response != "")
    {
      await this.setState({PDFContrato: response.arquivo, PDFDescricaoContrato: response.descricao, PDFExtensaoContrato: response.extensao})
      await this.setVisibilidadeLoading(false)
      await this.setVisibilidadeModalPDF(true)
    }
    else
    {
      await this.setVisibilidadeLoading(false)
    }
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeLoading = async (value) => {
    await this.setState({ VisibilidadeModalLoading: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de PDF
  setVisibilidadeModalPDF(value) {
    this.setState({VisibilidadeModalPDF: value})
  }
  //#endregion

  //#region Pegando a lista de contratos no Banco de dados
  pegandoListaDeLeadsNoBancoDeDados = async () => {
    const response = await Vendas.contratospendentes(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    if(response != null && response != undefined) 
    {

      this.state.FiltrosAplicaveis = response.filtros
      for(var i = 0; i < (this.state.FiltrosAplicaveis.length); i++) {
        var selectedItems = {selectedItems: []}
        Object.assign(this.state.FiltrosAplicaveis[i], selectedItems)
      }

      await this.setState({ListaLeads: response.dados})
      const Lista = this.state.ListaLeads
      await this.setState({ListaLeads: Lista});
      await this.setState({ListaOriginal: Lista, ListaFiltrada: Lista});
      try {
        const vendas = await AsyncStorage.getItem('@Vendas')
        if (vendas != null) {
          this.state.vendaAsync = JSON.parse(vendas)
          this.state.ListaOriginal.unshift(...this.state.vendaAsync)
        } else {}
      } catch(err) { console.log(err) }
      this.state.ListaExibida = [];
      const ListaAdd = [];
      if (Lista.length >= 20) {
        for(var i = 0; i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd})
      } else {
        for(var i = 0; i <=(Lista.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingFooter: true}) 
      }
      await this.setVisibilidadeLoading(false)
    }
    else 
    {
      await this.setVisibilidadeLoading(false)
      await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Filtrando contratos
  searchUpdateLeads = async (Term) => {
    this.setState({searchTermLeads: Term})
    if (Term == '') {
      this.state.ListaFiltrada = [];
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      await this.setState({ListaFiltrada: this.state.ListaOriginal})
      const ListaAdd = [];
      if (this.state.ListaFiltrada.length >= 20) {
        for(var i = 0; i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, distanceEnd: this.state.distanceEndInitial})
      } else {
        for(var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, isLoadingFooter: true, distanceEnd: this.state.distanceEndInitial})
      }
    } else {
      this.state.ListaFiltrada = [];
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      const ListaAdd = [];
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(createFilter(this.state.searchTermLeads, KEYS_TO_FILTERS_LEADS))
      if (this.state.ListaFiltrada.length >= 20) {
        for (var i = 0; i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, distanceEnd: this.state.distanceEndInitial})
      } else {
        for (var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, isLoadingFooter: true, distanceEnd: this.state.distanceEndInitial})
      }
    }
  }
  //#endregion

  //#region Carregando mais contratos da lista
  carregandoMaisLeadsParaLista = async () => {
    this.setState({loadMore: true})
    const quantAnterior = this.state.quantItem;
    const ListaAdd = [];
    this.state.quantItem = (this.state.quantItem + 20);
    if ((this.state.ListaFiltrada.length > this.state.quantItem)) {
      try {
        for (var i = (quantAnterior); i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: this.state.ListaExibida.concat(ListaAdd)})
        await this.setState({loadMore: false})
      } catch {}
    } else if (this.state.ListaFiltrada.length < this.state.quantItem) {
      try {
        for (var i = (quantAnterior); i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.quantItem = this.state.ListaFiltrada.length;
        await this.setState({ListaExibida: this.state.ListaExibida.concat(ListaAdd)})
        await this.setState({loadMore: false})
      } catch {await this.setState({isLoadingFooter: true})}
    }
  }
  //#endregion

  //#endregion

}

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  empresa: state.dadosEmpreendimento.filter(emp => emp.empresa),
  centrodecusto: state.dadosEmpreendimento.filter(emp => emp.centrodecusto),
  StyleGlobal: state.StyleGlobal,
  EmpresaLogada: state.EmpresaLogada,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ... DadosLeadActions, ...TelaAtualActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ContratosPendentes);