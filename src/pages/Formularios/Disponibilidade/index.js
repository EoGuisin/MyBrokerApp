//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import {Keyboard, View, Text, Animated, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Modal, TextInput, Linking, Platform, KeyboardAvoidingView } from 'react-native';
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
import Collapsible from 'react-native-collapsible';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
//#endregion

//#region Chaves de filtragem
const KEYS_TO_FILTERS_LEADS = ['subLocal.descricao']
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Vendas, Identificador, TabelaDeVendas } from "../../../services";
//#endregion

//#region Redux
import { DadosLeadActions, TelaAtualActions, LotesActions, DadosIntermediacaoActions, DadosCorretagemActions, DadosFinanciamentoActions, TabelaDeVendasActions  } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
import EfeitoSwipeDown from '../../../effects/swipearrowdown.json';
import EfeitoSwipeUp from '../../../effects/swipearrowup.json';
//#endregion

//#region Componentes
import { Container, Logo, NomeEmpresa, Header } from '../../../components';
import { ModalLoadingGoBack, ModalCadastroDoLead, ModalLoading, ModalEnviandoArquivos, ModalDeletandoArquivos, ModalSucesso, ModalFalha, ModalListaProspect, ModalOption, ModalReservaConfirmada } from '../../Modais';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
//#endregion

//#endregion

class Disponibilidade extends Component {
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
      if (this.state.ListaUnidades != "")
      {
        await this.setVisibilidadeModalLoading(true)
        await this.pegandoListaDeUnidadesRefresh()
      }
    })
      if(this.state.ListaUnidades == "")
      {
        await this.setVisibilidadeModalLoadingGoBack(true)
        await this.pegandoListaDeUnidades()
      }
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
    VisibilidadeModalLoadingGoBack: false,
    VisibilidadeModalEnviandoArquivos: false,
    VisibilidadeModalDeleltandoArquivos: false,
    VisibilidadeModalSucesso: false,
    VisibilidadeModalFalha: false,
    VisibilidadeModalPDF: false,
    VisibilidadeModalFiltros: false,
    VisibilidadeModalFiltrosGAVResorts: false,
    VisibilidadeModalProspect: false,
    VisibilidadeModalTabelaDePrecos: false,
    VisibilidadeModalOption: false,
    VisibilidadeModalReservaConfirmada: false,
    FiltrosAplicaveis: [],
    FiltroEmpreendimento: '',
    CampoFiltrado: '',
    ListaUnidades: [],
    ListaOriginal: [],
    ListaFiltrada: [],
    ListaExibida: [],
    LocaisDeCaptacao: [],
    selectedItems: [],
    refs: [],
    quantItem: 20,
    distanceEnd: null,
    distanceEndInitial: null,
    loadMore: false,
    TermLotes: '',
    searchTermLotes: '',
    Nome: null,
    Email: null,
    TelefoneP: null,
    finalidade: null,
    IdProspect: [],
    dadosProspect: [],
    NomeDaUnidade: null,
    Local: null,
    SubLocal: null,
    identificador: [],
    LoteSelecionado: null,
    NomeDoIconeParaAbrirOpcoes: 'keyboard-arrow-down',
    FiltroPavimentoMin: '',
    FiltroPavimentoMax: '',
    FiltroQtdequartosMin: '',
    FiltroQtdequartosMax: '',
    FiltroDescricao: '',
    lotereservado: [],
    tabelaDeVendas: [],
    tabelaCorretagem: [],
    tabelaIntermediacao: [],
    tabelaFinanciamento: [],
    tabelaFinanciamenteOriginal: [],
    tabelaEntradas: [],
    tabelaIntermediarias: [],
    tabelaCompleta: [],
    tabelaCorretagemExiste: false,
    tabelaIntermediacaoExiste: false,
    tabelaFinaciamentoExiste: false,
    tabelaIntermediariasExiste: false,
    tabelaEntradasExiste: false,
    juros: null,
    primeiroVencimentoFinanciamento: null,
    DadosFinanciamento: [],
    valorCorretagem: null,
    valorImobiliaria: null,
    valorFinancimento: null,
    valorParcelaDoFinancimento: null,
    valorDasIntermediarias: null,
    valorDasEntradas: null,
    IdCorretagem: null,
    IdIntermediacao: null,
    IdFinanciamento: null,
    IdIntermediarias: null,
    IdEntradas: null,
    primeiroVencimentoParcela: null,
    numeroDaTabelaDeVenda: null,
    formaPagamento: [],
    calendarioMeses: [],
    simulacaoCorretagem: [],
    simulacaoIntermediacao: [],
    Lote: [],
    isLoadingFooter: false,
    isLoadingHeader: false,
    ID: "",
    nomeDoFiltro:  null,
    scrollFlatY: new Animated.Value(0),
  };
  //#endregion

  //#region View
  render() {

    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
        <Modal // Filtros Silva Branco
          animationType = 'slide'
          visible = {this.state.VisibilidadeModalFiltros}
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
                  onPress = {() => {this.setState({VisibilidadeModalFiltros: false})}}/>
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
              scrollEventThrottle = {16}
            >
                <View
                  style = {{
                    minHeight: Dimensions.get('window').height - 190, 
                    borderTopWidth: 0, marginBottom: 20, marginHorizontal: 10,
                    justifyContent: "center"
                }}>
                  {this.state.FiltrosAplicaveis.map((filtros, index) => filtros.nome != "Unidade" && (
                  <View key = {String(index)}>
                    {filtros.tipo.id == 4 &&
                      <View key = {String(index)}>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 13,
                            color: '#677367',
                            paddingBottom: 10,
                            backgroundColor: "#FFFFFF"
                        }}>{filtros.nome === "UnidadeDisponivel" ? "Unidade" : filtros.nome}</Text>
                        <View 
                          style={{
                            flex: 1,
                            backgroundColor: '#FFFFFF',
                            paddingVertical: 8,
                            paddingHorizontal: 3,
                            marginBottom: 5,
                            borderRadius: 10
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
                                    marginLeft: 5,
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
                                    onPress = {async () => {
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
                            ref = {(component) => { this.state.refs[index] = component }}
                            filterMethod = {"full"}
                            onSelectedItemsChange = { selectedItems => {
                              filtros.selectedItems = selectedItems
                              this.setState({Renderizar: true})
                            }}
                            selectedItems = {filtros.selectedItems}
                            selectText = { filtros.selectedItems.length == 0 ? "Selecione a empresa" : "Items selecionados"}
                            searchInputPlaceholderText = "Procurando Itens..."
                            styleItemsContainer = {{marginVertical: 10 }}
                            onChangeInput = { (text) => {}}
                            tagRemoveIconColor = {this.props.StyleGlobal.cores.background}
                            tagBorderColor = {this.props.StyleGlobal.cores.background}
                            tagTextColor = {this.props.StyleGlobal.cores.background}
                            selectedItemTextColor=  "#CCCCCC"
                            selectedItemIconColor = "#CCCCCC"
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
              style = {{ marginHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                style = {{
                  width: '100%', 
                  backgroundColor: this.props.StyleGlobal.cores.background,
                  paddingVertical: 16,
                  paddingHorizontal: 0,
                  height: 58,
                  alignItems: 'center',
                  justifyContent: "center",
                  marginBottom: 23,
                  borderRadius: 5
              }}
              onPress = { async() => {

                let FiltroIdentificador = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "Empreendimento")[0].selectedItems ?? []

                let UnidadesFiltradas = this.state.ListaOriginal.filter((Item) => ((FiltroIdentificador.length == 0 || FiltroIdentificador.filter((_item) => Item.subLocal.descricao.includes((_item))).length > 0)))

                this.state.ListaFiltrada = UnidadesFiltradas
                this.state.ListaExibida = [];

                if (UnidadesFiltradas.length >= 20)
                {
                  this.state.ListaExibida = UnidadesFiltradas.slice(0, 20)
                }
                else
                {
                  this.state.ListaExibida = UnidadesFiltradas.slice(0, UnidadesFiltradas.length)
                }
                await this.setState({VisibilidadeModalFiltros: false})
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
                <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40} style = {{ }}
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
              scrollEventThrottle = {16}
            >
                <View
                  style = {{
                    minHeight: Dimensions.get('window').height - 190, 
                    borderTopWidth: 0, marginBottom: 20, marginHorizontal: 10,
                    justifyContent: "center"
                }}>
                  {this.state.FiltrosAplicaveis.map((filtros, index) => filtros.nome != "Unidade" && (
                  <View key = {String(index)} style = {{}}>
                    {filtros.tipo.id == 4 &&
                      <View key = {String(index)}>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 13,
                            color: '#677367',
                            paddingBottom: 10,
                            backgroundColor: "#FFFFFF"
                        }}>{filtros.nome === "UnidadeDisponivel" ? "Unidade" : filtros.nome}</Text>
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: '#FFFFFF',
                            paddingVertical: 8,
                            paddingHorizontal: 3,
                            marginBottom: 5,
                            borderRadius: 10,
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
                                    marginLeft: 5,
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
                                    onPress = {async () => {
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
                              ref = {(component) => { this.state.refs[index] = component }}
                              filterMethod = {"full"}
                              onSelectedItemsChange = { selectedItems => {
                                filtros.selectedItems = selectedItems
                                this.setState({Renderizar: true})
                              }}
                              selectedItems = {filtros.selectedItems}
                              selectText = { filtros.selectedItems.length == 0 ? "Selecione a empresa" : "Items selecionados"}
                              searchInputPlaceholderText = "Procurando Itens..."
                              styleItemsContainer = {{marginVertical: 10 }}
                              onChangeInput = { (text) => {}}
                              tagRemoveIconColor = {this.props.StyleGlobal.cores.background}
                              tagBorderColor = {this.props.StyleGlobal.cores.background}
                              tagTextColor = {this.props.StyleGlobal.cores.background}
                              selectedItemTextColor=  "#CCCCCC"
                              selectedItemIconColor = "#CCCCCC"
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
              style = {{ marginHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                style = {{
                  width: '100%', 
                  backgroundColor: this.props.StyleGlobal.cores.background,
                  paddingVertical: 16,
                  paddingHorizontal: 0,
                  height: 58,
                  alignItems: 'center',
                  justifyContent: "center",
                  marginBottom: 23,
                  borderRadius: 5
              }}
              onPress = { async() => {

                let FiltroIdentificador = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "UnidadeDisponivel")[0].selectedItems ?? []
                let FiltroPavimento = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "Pavimento")[0].selectedItems ?? []
                let FiltroQuantidadeDeQuartos = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "Quantidade de quartos")[0].selectedItems ?? []
                let FiltroDescricao = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "Descrição")[0].selectedItems ?? []

                let UnidadesFiltradas = this.state.ListaOriginal.filter((Item) => ((FiltroIdentificador.length == 0 || FiltroIdentificador.filter((_item) => _item === Item.subLocal.descricao).length > 0) 
                && (FiltroQuantidadeDeQuartos.length == 0 || FiltroQuantidadeDeQuartos.filter((_item) => Item.observacoes.includes(("Qtde. de quartos: ").concat(_item))).length > 0)
                && (FiltroPavimento.length == 0 || FiltroPavimento.filter((_item) => Item.observacoes.includes(("Pavimento: ").concat(_item))).length > 0)
                && (FiltroDescricao.length == 0 || FiltroDescricao.filter((_item) => Item.observacoes.includes(("Descrição: ").concat(_item))).length > 0)))

                this.state.ListaFiltrada = UnidadesFiltradas
                this.state.ListaExibida = [];

                if (UnidadesFiltradas.length >= 20)
                {
                  this.state.ListaExibida = UnidadesFiltradas.slice(0, 20)
                }
                else
                {
                  this.state.ListaExibida = UnidadesFiltradas.slice(0, UnidadesFiltradas.length)
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
        <Modal // Tabela de precos
          visible = {this.state.VisibilidadeModalTabelaDePrecos}
          transparent = {false}
          animationType = {"slide"}
        >
          <View style = {{flex: 1, justifyContent: 'space-between'}}>
            <ScrollView  ref = {(ref) => this.ScrollViewTabelaPrecos = ref} showsVertiscalScrollIndicator = {false}
            >
              <View 
                style = {{
                  minHeight: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 245) : (Dimensions.get('window').height - 195),
              }}>
                <View 
                  style = {{ 
                    height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 82 : 52, 
                    backgroundColor: '#FFFFFF',
                    justifyContent: "center"
                }}>
                  <View
                    style = {{
                      flexDirection: 'row', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                  }}>
                    <Icon name = {'close'} color = {this.props.StyleGlobal.cores.background} size = {30} style = {{marginTop: 10, marginLeft: 10}}
                      onPress = { () => { this.setVisibilidadeModalTabelaDePrecos(false)}}/>
                    <Text
                      style = {{
                        marginTop: 6,
                        fontStyle: 'normal',
                        fontWeight: '500',
                        fontSize: 12,
                        textAlign: 'center',
                        color: this.props.StyleGlobal.cores.background
                    }}>Tabela de Preços</Text>
                    <View style = {{width: 30}}></View>
                  </View>
                </View>
                <View style = {{ paddingHorizontal: 24, marginBottom: 15 }}>
                  <View // nome da unidade e area
                    style = {{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <View style = {{flex: 1, marginRight: 20}}>
                      <Text style = {{color: this.props.StyleGlobal.cores.background, fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, fontWeight: 'bold', fontStyle: 'normal'}}>{'Selecione a unidade'}</Text>
                      <TouchableOpacity style = {{marginTop: 8, marginLeft: 5, paddingVertical: 2, justifyContent: 'center', borderWidth: 1, borderColor: '#cdcdcd'}}
                        onPress = {() => {}}>
                        <Text style = {{marginLeft: 5, fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, fontStyle: 'normal', fontWeight: 'normal', flexWrap: 'wrap'}}>{this.state.NomeDaUnidade}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style = {{ marginTop: 5}}>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 15, paddingHorizontal: 20, backgroundColor: this.props.StyleGlobal.cores.background, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                        <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: 10}}>{'Área (m²)'}</Text>
                      </View>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#dadce8', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                        <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{this.state.identificador != "" ? this.state.identificador.area : ""}</Text>
                      </View>
                    </View>
                  </View>
                  <View // Status e valor do lote
                    style = {{flexDirection: 'row', marginTop: 9}}>
                    <View>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 10, backgroundColor: this.props.StyleGlobal.cores.background, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                        <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{'Status da unidade:'}</Text>
                      </View>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#dadce8', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                        <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, fontWeight: 'bold'}}>{(this.state.identificador != "") ? (this.state.identificador.status == 0 ? 'Disponível' : 'Reservado') : ""}</Text>
                      </View>
                    </View>
                    <View style = {{flex: 1, marginLeft: 20}}>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 10, backgroundColor: this.props.StyleGlobal.cores.background, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                        <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{'Valor do lote à vista'}</Text>
                      </View>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#d9ebd5', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                        <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 12}}>{this.state.identificador != "" ? formatoDeTexto.FormatarTexto((this.state.identificador.valorAVista)) : ""}</Text>
                      </View>
                    </View>
                  </View>
                  <View style = {{flexDirection: 'row', marginTop: 5}}>
                    {this.state.tabelaIntermediacaoExiste == true &&
                    <View // Comissão imobiliária
                      >
                      <Text style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5, fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, color: '#3c3d41'}}>{`Comissão${'\n'}imobiliária:`}</Text>
                      <View // total intermediação
                        style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5}}>
                        <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 5, backgroundColor: '#808080', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                          <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{'Total intermediação'}</Text>
                        </View>
                        <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                          <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{(this.state.tabelaCorretagem != "" && this.state.tabelaIntermediacao != "") ? formatoDeTexto.FormatarTexto((this.state.tabelaIntermediacao[this.state.tabelaIntermediacao.length - 1].valorTotal) + parseInt(this.state.tabelaCorretagem[this.state.tabelaCorretagem.length - 1].valorTotal)) : ""}</Text>
                        </View>
                      </View>
                      <View // corretor
                        style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5}}>
                        <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 5, backgroundColor: '#808080', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                          <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{'Corretor'}</Text>
                        </View>
                        {this.state.tabelaCorretagem.map(corretor => (
                          <View key = {corretor.qtdeDeTitulos} style = {{height: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                            <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{formatoDeTexto.FormatarTexto((corretor.principal))}</Text>
                          </View>
                        ))}
                      </View>
                      <View // imobiliaria à vista
                        style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5}}>
                        <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 5, backgroundColor: '#808080', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                          <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{'Imobiliária à vista'}</Text>
                        </View>
                        <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                          <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{this.state.tabelaIntermediacao != "" ? formatoDeTexto.FormatarTexto((this.state.tabelaIntermediacao[parseInt(this.state.tabelaIntermediacao.length - 1)].valorTotal * 100)) : ""}</Text>
                        </View>
                      </View>
                      <View // imobiliaria em X vezes
                        style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5}}>
                        <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 5, backgroundColor: '#808080', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                          <Text style = {{color: '#FFFFFF',  fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{this.state.tabelaIntermediacao != "" ? `ou imobiliária em ${this.state.tabelaIntermediacao.length}x` : ""}</Text>
                        </View>
                        <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                          <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{this.state.tabelaIntermediacao != "" ? formatoDeTexto.FormatarTexto(((this.state.tabelaIntermediacao[parseInt(this.state.tabelaIntermediacao.length - 1)].principal))) : ""}</Text>
                        </View>
                      </View>
                      <View // observacoes sobre a comissao
                        style = {{backgroundColor: '#f2f2f2', paddingVertical: 9, paddingLeft: 10}}>
                        <Text style = {{ fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 8 : 10, lineHeight: 14}}>{`* A comissão${'\n'}imobiliária não${'\n'}integra o valor do${'\n'}lote e será paga em${'\n'}contrato específico.`}</Text>
                      </View>
                      {this.props.EmpresaLogada[0] == 5 &&
                      <TouchableOpacity style = {{marginLeft: 8, marginTop: 8, backgroundColor: '#dbdee7', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 5, marginRight: 8, borderColor: '#85868a', borderWidth: 1}}
                        onPress = {() => {this.openLinking('http://harmoniaurbanismo.ddns.net:2601/mapas/MapaVillaImperial.pdf')}}>
                        <Text style = {{ fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 8 : 10, lineHeight: 14, textAlign: 'center'}}>Acessar o Mapa</Text>
                      </TouchableOpacity>}
                    </View>}
                    <View // Planos de parcelamento
                      style = {{flex: 1, marginLeft: this.state.tabelaIntermediacaoExiste == true ? 20 : 0}}>
                      <View // Comissão imobiliária
                        >
                        <Text style = {{ fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, color: '#3c3d41'}}>{`Planos de parcelamento`}</Text>
                        <Text style = {{marginBottom: Dimensions.get('window').height <= 650 ? 2 : 5, marginLeft: 4, fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 12, color: '#4d5256'}}>{`Taxa de juros: ${this.state.juros * 100}% a.m`}</Text>
                        {this.state.tabelaFinanciamento.map(parcelamento => (
                          <View // Parcelamento X vezes
                            key = {parcelamento.qtdeDeTitulos} style = {{flexDirection: 'row'}}>
                            <View // numero parcelas
                              style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5, marginRight: 10, width: '40%'}}>
                              <View style = {{paddingHorizontal: 0, backgroundColor: this.props.StyleGlobal.cores.background, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                                <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, flexWrap: 'wrap', textAlign: 'center', paddingVertical: 3}}>{parcelamento.descricao}</Text>
                              </View>
                              <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#d9ebd5', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                                <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.FormatarTexto((parcelamento.principal))}</Text>
                              </View>
                            </View>
                            <View // valor total parcelado
                              style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5, flex: 1, width: '60%'}}>
                              <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 0, backgroundColor: this.props.StyleGlobal.cores.background, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                                <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}} numberOfLines = {1} ellipsizeMode = {'tail'}>Total do lote em {parcelamento.qtdeDeTitulos}x</Text>
                              </View>
                              <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                                <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.FormatarTexto((parcelamento.valorTotal))}</Text>
                              </View>
                            </View>
                          </View>
                        ))}
                        <Text style = {{fontSize: Dimensions.get('window').height <= 650 ? 8 : 10, marginTop: 5, textAlign: 'right'}}>Tabela de venda válida até {new Date().getMonth() < 9 ? (( new Date().getDate() <= 9 ? "0" + new Date().getDate() : new Date().getDate())+"/"+"0"+(new Date().getMonth() + 1) + "/" + new Date().getFullYear()) : (( new Date().getDate() <= 9 ? "0" + new Date().getDate() : new Date().getDate())+"/"+(new Date().getMonth() + 1) + "/" + new Date().getFullYear())}</Text>
                      </View>
                    </View>
                  </View>
                  <View style = {{marginTop: 2}}>
                    <Text style = {{fontSize: Dimensions.get('window').height <= 650 ? 8 : 10, textAlign: 'right'}}>{`* As parcelas mensais serão corrigidas a cada 12 meses pelo IGPM Todos os valores em reais`}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View // Botoes de reserva e proposta
              style = {{
                paddingHorizontal: 24, 
                flexDirection: 'row', 
                marginBottom: Dimensions.get('window').height <= 650 ? 15 : 15, 
                justifyContent: 'center'
            }}>
              {(this.state.identificador.status == 0 || (this.state.identificador.status == 2 && (this.state.identificador.reservaVinculada.vendedorId == this.props.token[0].pessoa.id))) &&
              <TouchableOpacity
                style = {{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: this.props.StyleGlobal.cores.botao,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: Dimensions.get('window').height <= 650 ? 5 : 10,
                  width: '25%',
                  borderRadius: 5,
              }}
                onPress = {async () => {
                  this.state.lotereservado = this.state.identificador
                  await this.disponibilizando_reservando_Lote()
                }}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: Dimensions.get('window').height <= 650 ? 10 : 12,
                    textAlign: 'center',
                    color: this.props.StyleGlobal.cores.botao,
                    alignSelf: 'center',
                }}>{this.state.identificador.status == 2 ? "Disponibilizar" : "Reservar"}</Text>
              </TouchableOpacity>}
              {(this.props.tela != "@tela_reserva") && (this.state.identificador.status == 0 || (this.state.identificador.status == 2 && (this.state.identificador.reservaVinculada.vendedorId == this.props.token[0].pessoa.id))) &&
              <TouchableOpacity
                style = {{
                  flex: 1,
                  backgroundColor: this.props.StyleGlobal.cores.botao,
                  alignItems: 'center',
                  justifyContent: 'center',                
                  marginLeft: (this.state.identificador.status == 0 || this.state.identificador.status == 2 ) ? 40 : 0,
                  padding: Dimensions.get('window').height <= 650 ? 5 : 10,
                  width: '25%',
                  borderRadius: 5
              }}
                onPress = {this.armazenandoTabelasCorretagemIntermediacao}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: Dimensions.get('window').height <= 650 ? 10 : 12,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    alignSelf: 'center',
                }}>Proposta</Text>
              </TouchableOpacity>}
            </View>
          </View>
        </Modal>
        <ModalLoading visibilidade = {this.state.VisibilidadeModalLoading} 
          onPress = {async () => {
            await Identificador.cancelRequest(true)
            await this.setVisibilidadeModalLoading(false)
        }}/>
        <ModalLoadingGoBack 
          visibilidade = {this.state.VisibilidadeModalLoadingGoBack}
          onPress = {async () => {
            await Identificador.cancelRequest(true)
            await this.setVisibilidadeModalLoadingGoBack(false)
            await this.props.navigation.goBack()
        }}/>
        <ModalOption 
          visibilidade = {this.state.VisibilidadeModalOption}
          onPressNao = {async () => {this.pressionandoNao(this.state.lotereservado)}}
          onPressSim = {async () => {this.pressionandoSim(this.state.lotereservado)}}
          textomensagem = {'Deseja vincular o lote a um prospect?'}
          onPressIcon = {async () => {this.setVisibilidadeModalOption(false)}}
        />
        <ModalReservaConfirmada 
          onPressIcon = {async () => {
            this.state.VisibilidadeModalLoading = true
            await this.setVisibilidadeModalReservaConfirmada(false)
            await this.pegandoListaDeUnidadesRefresh()
          }}
          textBotaoEsquerdo = {'Reservar novo lote'}
          textBotaoDireito = {'Obrigado'}
          visibilidade = {this.state.VisibilidadeModalReservaConfirmada} 
          onPressReservarNovoLote = { async () => {            
            this.state.VisibilidadeModalLoading = true
            await this.setVisibilidadeModalReservaConfirmada(false)
            await this.pegandoListaDeUnidadesRefresh()
          }}
          onPressObrigado = { async () => {
            this.state.VisibilidadeModalLoading = true
            await this.setVisibilidadeModalReservaConfirmada(false)
            await this.pegandoListaDeUnidadesRefresh()
          }}
        />
        {this.state.VisibilidadeModalLoading == false && this.state.VisibilidadeModalLoadingGoBack == false && <>
        <View
          style = {{
            backgroundColor: this.props.StyleGlobal.cores.background, 
            height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 178 : 158,
            justifyContent: "center" 
        }}>
          <View 
            style = {{
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
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
            }}>Disponibilidade</Text>
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
              onChangeText = {async (term) => { await this.searchUpdateLotes(term) }}
              style = {{
                paddingHorizontal: 16,
                height: 58,
                fontSize: 14,
                width: Dimensions.get('window').width * 0.88
              }}
              fuzzy = {true}
              placeholder = 'Pesquise aqui pelo identificador...'
              placeholderTextColor = '#8F998F'
            />
            <Icon name = 'search' size = {30} color = {'#8F998F'} style = {{marginRight: 5}}/>
          </View>
          <View style = {{alignItems: 'flex-end', marginTop: 10}}>
            {this.props.EmpresaLogada[0] == 8 &&
            <TouchableOpacity activeOpacity = {1} style = {{flexDirection: 'row', alignItems: 'center', marginRight: 8, marginLeft: 8, width: 155, borderRadius: 5}}
              onPress = {async () => {
                this.setState({VisibilidadeModalFiltros: true})
            }}>
              <Icon name = 'list' size = {25} color = {'#FFFFFF'} style = {{marginRight: 5, marginLeft: 5}}/>
              <Text style = {{color: '#FFFFFF', fontSize: 15, marginRight: 8, fontWeight: "bold"}}>Filtros aplicáveis</Text>
            </TouchableOpacity>}
            {this.props.EmpresaLogada[0] == 4 &&
            <TouchableOpacity activeOpacity = {1} style = {{flexDirection: 'row', alignItems: 'center', marginRight: 8, marginLeft: 8, width: 155, borderRadius: 5}}
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
          style = {{marginVertical: 10, marginHorizontal: 8}}
          showsVerticalScrollIndicator = {false}
          onScroll = {Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollFlatY}}}],
            {useNativeDriver: true}
          )}
          data = {this.state.ListaExibida}
          onEndReached = { async () => {
            this.state.loadMore = true
            const quantAnterior = this.state.quantItem;
            const ListaAdd = [];
            this.state.quantItem = (this.state.quantItem + 20);
            if ((this.state.ListaFiltrada.length > this.state.quantItem)) {
              try {
                for (var i = (quantAnterior); i <= (this.state.quantItem - 1); i++) {
                  ListaAdd.push(this.state.ListaFiltrada[i])
                }
                this.state.ListaExibida = this.state.ListaExibida.concat(ListaAdd)
                await this.setState({loadMore: false})
              } catch {}
            } else if (this.state.ListaFiltrada.length < this.state.quantItem) {
              try {
                for (var i = (quantAnterior); i <= (this.state.ListaFiltrada.length - 1); i++) {
                  ListaAdd.push(this.state.ListaFiltrada[i])
                }
                this.state.quantItem = this.state.ListaFiltrada.length;
                this.state.ListaExibida = this.state.ListaExibida.concat(ListaAdd)
                await this.setState({loadMore: false})
              } catch {await this.setState({isLoadingFooter: true})}
            }
          }}
          onEndReachedThreshold = {0.1}
          keyExtractor = {item => String(item.indice)}
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
              <Animated.View key = {item.indice}
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
                  onPress = {async () => {
                    if(this.state.LoteSelecionado == null || (this.state.LoteSelecionado != item.indice))
                    {
                      this.setState({LoteSelecionado: item.indice})
                    }
                    else
                    {
                      this.setState({LoteSelecionado: null})
                    }
                  }}>
                  <View
                    style ={{
                      width: '100%',
                  }}>
                    <View style = {{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                      <View
                        style = {{
                          maxWidth: '100%', 
                          flexDirection: 'column', 
                          alignItems: 'flex-start',
                          marginLeft: 30
                      }}>
                        <Text
                          style = {{
                            fontSize: 14,
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            color: '#262825',
                            flexWrap: 'wrap',
                            textAlign: 'left'
                        }}>{(item.subLocal['descricao'] != "" || item.subLocal['descricao'] != null) ? item.subLocal['descricao'] : ""}</Text>
                      </View>
                    </View>
                    <View
                      style = {{
                        flexDirection: 'row', 
                        width: '100%',
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                    }}>
                      <View
                        style = {{
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}>                  
                        <View style = {{marginBottom: 20, marginRight: 10, width: 20, borderRadius: 20, backgroundColor: item.status == 2 ? '#BC3908' : '#3C896D', alignItems: 'center'}}>
                          <Text style = {{color: '#FFFFFF'}}>{item.status == 2 ? 'R' : 'D'}</Text>
                        </View>
                        <View>
                          {item.observacoes != '' && item.observacoes != null &&
                          <Text
                            style = {{
                              fontSize: 10,
                              fontStyle: 'normal',
                              fontWeight: 'normal',
                              color: '#8F998F',
                            }} numberOfLines = {1} ellipsizeMode = {'tail'}>{(item.observacoes != "" && item.observacoes != null) ? item.observacoes[item.observacoes.length - 1] : ""}</Text>}
                          {item.valorAVista != '' && item.valorAVista != null && 
                          <Text
                            style = {{
                              fontSize: 10,
                              fontStyle: 'normal',
                              fontWeight: 'normal',
                              color: '#8F998F',
                            }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor a vista: {(item.valorAVista != "" && item.valorAVista != null) ? formatoDeTexto.FormatarTexto((item.valorAVista)) : ""}</Text>}
                          {(item.intermediacao != "" && item.intermediacao != null) &&
                          <Text
                            style = {{
                              fontSize: 10,
                              fontStyle: 'normal',
                              fontWeight: 'normal',
                              color: '#8F998F',
                          }} numberOfLines = {1} ellipsizeMode = {'tail'}>Intermediação: {(item.intermediacao != "" && item.intermediacao != null) ? formatoDeTexto.FormatarTexto((item.intermediacao)) : ""}</Text>}
                        </View>
                      </View>
                      <View
                        style ={{
                          flexDirection: 'row', 
                          justifyContent: 'flex-end', 
                          alignItems: 'center',
                          paddingRight: 10
                        }}>
                        {((this.props.EmpresaLogada[0] == 5 || this.props.EmpresaLogada[0] == 4 || this.props.EmpresaLogada[0] == 8) && (((item.status == 0) || (item.status == 2 && (item.reservaVinculada.vendedorId == this.props.token[0].pessoa.id))))) &&
                        <TouchableOpacity
                          style = {{
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            marginRight: 10, 
                            backgroundColor: '#FFFFFF',
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderColor: this.props.StyleGlobal.cores.botao,
                            borderRadius: 5,
                        }}
                          onPress = {async () => {
                            this.state.lotereservado = item
                            await this.reserva_disponibilizacao(item)
                          }}>
                          <Text
                            style = {{
                              fontSize: 10, 
                              color: this.props.StyleGlobal.cores.botao,
                              fontStyle: 'normal',
                              fontWeight: '500',
                              textAlign: 'center',
                              alignSelf: 'center',
                              marginVertical: 4,
                              marginHorizontal: 0
                        }}>{item.status == 2 ? 'Disponibilizar' : 'Reservar'}</Text>
                        </TouchableOpacity>}
                        {(this.props.EmpresaLogada[0] == 5 || this.props.EmpresaLogada[0] == 4  || this.props.EmpresaLogada[0] == 8) &&
                        <TouchableOpacity
                          disabled = {false}
                          style = {{
                            paddingVertical: 6,
                            paddingHorizontal: 10, 
                            backgroundColor: this.props.StyleGlobal.cores.botao,
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderColor: this.props.StyleGlobal.cores.botao,
                            borderRadius: 5
                          }}
                          onPress = { async () => {
                            this.state.NomeDaUnidade = item.subLocal['descricao']
                            this.state.Local = item.local['id']
                            this.state.SubLocal = item.subLocal['id']
                            await this.setVisibilidadeModalLoading(true)
                            await this.pegandoTabelaDePrecos();
                        }}>
                          <Text
                            style = {{
                              fontSize: 10, 
                              color: '#FFFFFF',
                              fontStyle: 'normal',
                              fontWeight: '500',
                              textAlign: 'center',
                              alignSelf: 'center',
                              marginVertical: 4,
                              marginHorizontal: 0
                        }}>Tabela</Text>
                        </TouchableOpacity>}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
              <Collapsible collapsed = {this.state.LoteSelecionado == item.indice ? false : true}>
                <View 
                  style = {{
                    backgroundColor: '#FFFFFF',        
                    marginBottom: 4,
                    paddingLeft: 45,
                    borderBottomWidth: 1,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderColor: '#E2F2E3',
                  }}>
                  <View style = {{flexDirection: 'row', flexWrap: 'wrap', maxWidth: Dimensions.get('window').width * 0.80, marginRight: 5}}>
                    {item.observacoes.map((item, index) => (
                      <Text
                        style = {{
                          fontSize: 9,
                          width: '30%',
                          paddingBottom: 5,
                          fontStyle: 'normal',
                          fontWeight: 'normal',
                          color: this.props.StyleGlobal.cores.background,
                          textAlign: 'left'
                      }}>{item}</Text>
                    ))}
                  </View>
                </View>
              </Collapsible>
              <TouchableOpacity
                style = {{
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  marginTop: -20,
                  height: 20
                }} 
                activeOpacity = {1}
                onPress = {async () => {
                  if(this.state.LoteSelecionado == null || (this.state.LoteSelecionado != item.indice))
                  {
                    this.setState({LoteSelecionado: item.indice})
                  }
                  else
                  {
                    this.setState({LoteSelecionado: null})
                  }
                }}>
                <Lottie 
                  resizeMode = 'contain'
                  source = {this.state.LoteSelecionado == item.indice ? EfeitoSwipeUp : EfeitoSwipeDown}
                  autoPlay
                  loop
                />
              </TouchableOpacity>
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
    
    RnBgTask.runInBackground(async () => {this.searchUpdateLotes(this.state.TermLotes)})
  }
  //#endregion

  //#region Pegando a tabela de preços de uma unidade em especifico no banco de dados
  pegandoTabelaDePrecos = async () => {
    const response = await TabelaDeVendas.consulta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, this.state.Local, this.state.SubLocal)
    if(response != null && response != undefined) 
    {
      const tabela = response
      const titulosDaTabelaDeVendas = tabela.classificacoesDosTitulosDaTabelaDeVenda
      for(var i = 0; i < titulosDaTabelaDeVendas.length; i++) {
        if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Corretagem') {
            this.state.tabelaCorretagemExiste = true 
            this.state.tabelaCorretagem = titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda
        } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Intermediação') {
            this.state.tabelaIntermediacaoExiste = true 
            this.state.tabelaIntermediacao = titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda
        } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Parcela') {
            this.state.tabelaFinaciamentoExiste = true
            this.state.tabelaFinanciamento = titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda 
            this.state.tabelaFinanciamenteOriginal = titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda
            this.state.primeiroVencimentoFinanciamento = (titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda[0].primeiroVencimento).replace('T00:00:00', '')
        } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Entrada') {
            this.state.tabelaEntradasExiste = true 
            this.state.tabelaEntradas = titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda
        } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Intermediaria') {
            this.state.tabelaIntermediariasExiste = true 
            this.state.tabelaIntermediarias = titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda
        }
      }
      if(await this.state.tabelaCorretagemExiste == true) {
        const positionCorretagem = (this.state.tabelaCorretagem).length - 1;
        this.state.valorCorretagem = this.state.tabelaCorretagem[positionCorretagem].valorTotal 
        this.state.IdCorretagem = this.state.tabelaCorretagem[positionCorretagem].qtdeDeTitulos
      }
      if(await this.state.tabelaIntermediacaoExiste == true) {
        const positionIntermediacao = (this.state.tabelaIntermediacao).length - 1;
        this.state.valorImobiliaria = this.state.tabelaIntermediacao[positionIntermediacao].valorTotal 
        this.state.IdIntermediacao = this.state.tabelaIntermediacao[positionIntermediacao].qtdeDeTitulos
      }
      if(await this.state.tabelaFinaciamentoExiste == true) {
        const positionFinanciamento = (this.state.tabelaFinanciamento).length - 1;
        this.state.valorFinancimento = this.state.tabelaFinanciamento[positionFinanciamento].valorTotal 
        this.state.IdFinanciamento = this.state.tabelaFinanciamento[positionFinanciamento].qtdeDeTitulos
        this.state.valorParcelaDoFinancimento = this.state.tabelaFinanciamento[positionFinanciamento].principal
        const position = 0;
        for(var i = 0; i <= positionFinanciamento; i++) {
          const proximaposition = position + i;
          if(this.state.tabelaFinanciamento[i].jurosDeTabela >= this.state.tabelaFinanciamento[proximaposition].jurosDeTabela)
          {
            this.state.juros = this.state.tabelaFinanciamento[i].jurosDeTabela
          }
        }
      }
      if(await this.state.tabelaEntradasExiste == true) {
        const positionEntradas = (this.state.tabelaEntradas).length - 1;
        this.state.valorDasEntradas = this.state.tabelaEntradas[positionEntradas].valorTotal 
        this.state.IdEntradas = this.state.tabelaEntradas[positionEntradas].qtdeDeTitulos
      }
      if(await this.state.tabelaIntermediariasExiste == true) {
        const positionIntermediarias = (this.state.tabelaIntermediarias).length - 1;
        this.state.valorDasIntermediarias = this.state.tabelaIntermediarias[positionIntermediarias].valorTotal 
        this.state.IdIntermediarias = this.state.tabelaIntermediarias[positionIntermediarias].qtdeDeTitulos
      }
      this.state.identificador = tabela.identificador
      this.state.tabelaCompleta = tabela
      this.state.dadosLote = this.state.identificador.subLocal
      this.state.numeroDaTabelaDeVenda = tabela.numero
      await this.setVisibilidadeModalLoading(false)
      await this.setVisibilidadeModalTabelaDePrecos(true)
    }
    else 
    {
      await this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

  //#region Pegando a lista de unidades no Banco de dados
  pegandoListaDeUnidades = async () => {
    try {
      const response = (await Identificador.consulta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto))
    
      if(response != null && response != undefined) 
      {
        let UnidadesFiltradas = (response).filter((Item) => (Item.status == 0 || (Item.status == 2 && (Item.reservaVinculada.vendedorId == this.props.token[0].pessoa.id))))
        
        this.state.ListaUnidades = UnidadesFiltradas
        this.state.ListaOriginal = UnidadesFiltradas
        this.state.ListaFiltrada = UnidadesFiltradas
        this.state.ListaExibida = [];
  
        if (this.state.ListaFiltrada.length >= 20) {
          this.state.ListaExibida = this.state.ListaFiltrada.slice(0, this.state.quantItem)
        } 
        else {
          this.state.ListaExibida = this.state.ListaFiltrada.slice(0, this.state.ListaFiltrada.length)
          
        }
  
        await this.pegandoFiltrosAplicaveis();
  
      }
      else
      {
        await this.setVisibilidadeModalLoadingGoBack(false)
        await this.props.navigation.goBack()
      }
    } catch {
        await this.setVisibilidadeModalLoadingGoBack(false)
        await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando a lista de filtros aplicaveis
  pegandoFiltrosAplicaveis = async () => {
    try {
      const response = await Identificador.filtrosAplicaveis(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
      if(response != null && response != undefined && response != "")
      {
        this.state.FiltrosAplicaveis = response
        for(var i = 0; i < (this.state.FiltrosAplicaveis.length); i++) {
          var selectedItens = {selectedItems: []}
          Object.assign(this.state.FiltrosAplicaveis[i], selectedItens)
        }
        
        await this.setVisibilidadeModalLoadingGoBack(false)
      }
      else
      {
        if (this.props.EmpresaLogada[0] == 8)
        {
          
          await this.setVisibilidadeModalLoadingGoBack(false)
          await this.props.navigation.goBack()
        }
        else
        {
          
          await this.setVisibilidadeModalLoadingGoBack(false)
        }
      }
    } catch {
        if (this.props.EmpresaLogada[0] == 8)
        {
          await this.setVisibilidadeModalLoadingGoBack(false)
          await this.props.navigation.goBack()
        }
        else
        {
          await this.setVisibilidadeModalLoadingGoBack(false)
        }
    }
  }
  //#endregion  

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeModalLoading = async (value) => {
    await this.setState({ VisibilidadeModalLoading: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading go back
  setVisibilidadeModalLoadingGoBack = async (value) => {
    await this.setState({VisibilidadeModalLoadingGoBack: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de Prospect
  setVisibilidadeModalProspect = async (value) => {
    await this.setState({ VisibilidadeModalProspect: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de PDF
  setVisibilidadeModalPDF(value) {
    this.setState({VisibilidadeModalPDF: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal da tabela de preços
  setVisibilidadeModalTabelaDePrecos(value) {
    this.setState({VisibilidadeModalTabelaDePrecos: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de option
  setVisibilidadeModalOption = async (value) => {
    this.setState({VisibilidadeModalOption: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de reserva confirmada
  setVisibilidadeModalReservaConfirmada = async (value) => {
    this.setState({VisibilidadeModalReservaConfirmada: value})
  }
  //#endregion

  //#region Filtrando unidades
  searchUpdateLotes = async (Term) => {
    await this.setState({searchTermLotes: Term, TermLotes: Term})
    if (Term == '') {
      this.state.ListaFiltrada = [];
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      this.state.ListaFiltrada = this.state.ListaOriginal
      await this.setState({ListaFiltrada: this.state.ListaOriginal})
      const ListaAdd = [];
      if (this.state.ListaFiltrada.length >= 20) {
        for(var i = 0; i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        this.state.isLoadingHeader = false
        await this.setState({distanceEnd: this.state.distanceEndInitial})
      } else {
        for(var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        this.state.isLoadingHeader = false
        this.state.isLoadingFooter = true
        await this.setState({distanceEnd: this.state.distanceEndInitial})
      }
    } else {
      this.state.ListaFiltrada = [];
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      const ListaAdd = [];
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(lote => ((lote.subLocal['descricao']).toUpperCase()).includes((this.state.searchTermLotes).toUpperCase()))
      if (this.state.ListaFiltrada.length >= 20) {
        for (var i = 0; i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        this.state.isLoadingHeader = false
        await this.setState({distanceEnd: this.state.distanceEndInitial})
      } else {
        for (var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        this.state.isLoadingHeader = false
        this.state.isLoadingFooter = true
        await this.setState({distanceEnd: this.state.distanceEndInitial})
      }
    }
  }
  //#endregion

  //#region Filtro de unidade avançado
  advancedFilter = async () => {
    if (this.state.FiltroPavimento == '' && this.state.FiltroQtdequartos == '' && this.state.FiltroDescricao == '') {
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
      console.log(`Qtde. de quartos: ${this.state.FiltroQtdequartos}`)
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(lote => lote.observacoes.includes(`Qtde. de quartos: ${this.state.FiltroQtdequartosMin}`) || lote.observacoes.includes(`Qtde. de quartos: ${this.state.FiltroQtdequartosMax}`))
      // this.state.ListaFiltrada = this.state.ListaOriginal.filter(createFilter(this.state.searchTermLotes, KEYS_TO_FILTERS_LEADS))
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
    await this.setState({VisibilidadeModalFiltros: false})
  }
  //#endregion

  //#region Filtro Silva Branco
  filtroSilva = async () => {
    if (this.state.FiltroEmpreendimento == '') {
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
      // this.state.ListaFiltrada = this.state.ListaOriginal.filter(lote => lote.observacoes.includes(`Qtde. de quartos: ${this.state.FiltroQtdequartosMin}`) || lote.observacoes.includes(`Qtde. de quartos: ${this.state.FiltroQtdequartosMax}`))
      // this.state.ListaFiltrada = this.state.ListaOriginal.filter(lote => (lote.subLocal['descricao']).includes(this.state.FiltroEmpreendimento))
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(createFilter(this.state.FiltroEmpreendimento, [this.state.CampoFiltrado]))
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
    await this.setState({VisibilidadeModalFiltros: false})
  }
  //#endregion

  //#region Carregando mais unidades para lista
  carregandoMaisReservasParaLista = async () => {
    this.state.loadMore = true
    const quantAnterior = this.state.quantItem;
    const ListaAdd = [];
    this.state.quantItem = (this.state.quantItem + 20);
    if ((this.state.ListaFiltrada.length > this.state.quantItem)) {
      try {
        for (var i = (quantAnterior); i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = this.state.ListaExibida.concat(ListaAdd)
        await this.setState({loadMore: false})
      } catch {}
    } else if (this.state.ListaFiltrada.length < this.state.quantItem) {
      try {
        for (var i = (quantAnterior); i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.quantItem = this.state.ListaFiltrada.length;
        this.state.ListaExibida = this.state.ListaExibida.concat(ListaAdd)
        await this.setState({loadMore: false})
      } catch {await this.setState({isLoadingFooter: true})}
    }
  }
  //#endregion

  //#region Atualizando a lista de unidades no Banco de dados
  pegandoListaDeUnidadesRefresh = async () => {
    try {
      const response = await Identificador.consulta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
      if(response != null && response != undefined)
      {
        this.state.ListaUnidades = response
        const Lista = this.state.ListaUnidades
        this.state.ListaUnidades = Lista
        this.state.ListaOriginal = Lista
        this.state.ListaFiltrada = Lista
        this.state.ListaExibida = [];
        const ListaAdd = [];
        if (Lista.length >= 20) {
          for(var i = 0; i <= this.state.quantItem - 1; i++) {
            ListaAdd.push(this.state.ListaFiltrada[i])
          }
          this.state.ListaExibida = ListaAdd
        } else {
          for(var i = 0; i <=(Lista.length - 1); i++) {
            ListaAdd.push(this.state.ListaFiltrada[i])
          }
          this.state.ListaExibida = ListaAdd
          this.state.isLoadingFooter = true
        }
        await this.setVisibilidadeModalLoading(false)
      }
      else
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `A tabela não pode ser atualizada.`
        })
        await this.setVisibilidadeModalLoading(false)
      }
    } catch {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `A tabela não pode ser atualizada.`
        })
        await this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

  //#region Atualizando a lista de unidades no Banco de dados Tabela
  pegandoListaDeUnidadesRefreshTabela = async () => {
    const response = await Identificador.consulta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    if(response != null && response != undefined) 
    {
      this.state.ListaUnidades = response
      const Lista = this.state.ListaUnidades
      this.state.ListaUnidades = Lista
      this.state.ListaOriginal = Lista
      this.state.ListaFiltrada = Lista
      this.state.ListaExibida = [];
      const ListaAdd = [];
      if (Lista.length >= 20) {
        for(var i = 0; i <= this.state.quantItem - 1; i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
      } else {
        for(var i = 0; i <=(Lista.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        await this.setState({isLoadingFooter: true}) 
      }
    }
    else
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `A tabela não pode ser atualizada.`
      })
      await this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

  //#region Armazenando a tabela de corretagem, intermediação e da tabela de vendas no redux
  armazenandoTabelasCorretagemIntermediacao = async () => {

    if(this.state.identificador.status == 0) {
      const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
      addToCorretagem(this.state.tabelaCorretagem)
      addToIntermediacao(this.state.tabelaIntermediacao)
      addToFinanciamento(this.state.tabelaFinanciamento)
      addToLotes(this.state.identificador)
      addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })
      const navegar = await this.props.navigation.getParam('Disponibilidade', 'null')
      if(navegar != null && navegar != 'null')
      {
        await this.setVisibilidadeModalTabelaDePrecos(false)
        return await navegar.onProposta()
      }
    }
    else if (this.state.identificador.status == 2)
    {
      const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
      addToCorretagem(this.state.tabelaCorretagem)
      addToIntermediacao(this.state.tabelaIntermediacao)
      addToFinanciamento(this.state.tabelaFinanciamento)
      addToLotes(this.state.identificador)
      addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })

      if(this.state.identificador.reservaVinculada.prospectId == null) 
      {
        const navegarProposta = await this.props.navigation.getParam('Disponibilidade', 'null')
        if(navegarProposta != null && navegarProposta != 'null')
        {
          await this.setVisibilidadeModalTabelaDePrecos(false)
          return await navegarProposta.onProposta()
        }
      } 
      else
      {
        try {
          await this.setVisibilidadeModalLoading(true)
          const response = await Prospect.consulta(String(this.props.token[0].token), parseInt(this.state.identificador.reservaVinculada.prospectId))
          if(response != null && response != undefined && response != "")
          {
            const { addToLead } = this.props;
            addToLead(response);
            const navegar = await this.props.navigation.getParam('Disponibilidade', 'null')
            {
              if(this.state.tabelaCorretagemExiste == true && this.props.EmpresaLogada[0] == 5)
              {
                this.state.VisibilidadeModalTabelaDePrecos = false
                await this.setVisibilidadeModalLoading(false)
                return await navegar.onIntermediacao()
              }
              else
              {
                this.state.VisibilidadeModalTabelaDePrecos = false
                await this.setVisibilidadeModalLoading(false)
                return await navegar.onReservado()
              }
            }
          }
          else
          {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Não foi possível continuar, entre em contato com a equipe de desenvolvimento.`
            })
          }
        } catch {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Não foi possível continuar, entre em contato com a equipe de desenvolvimento.`
            })
            await this.setVisibilidadeModalLoading(false)
        }
      }
    }
  }
  //#endregion
  
  //#region Executando a reserva ou disponibilização do lote
  disponibilizando_reservando_Lote = async () => {
    const { addToLotes } = this.props;

    if(this.state.identificador.status == 2) 
    {
      if(this.state.identificador.reservaVinculada.vendedorId == this.props.token[0].pessoa.id)
      {
        try {
          await this.setVisibilidadeModalLoading(true)
          const response = await Identificador.deletar(String(this.props.token[0].token), [this.state.identificador])
          if (response != null && response != "" && response != undefined) 
          {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Lote disponibilizado com sucesso`
            })
            await this.setVisibilidadeModalTabelaDePrecos(false)
            await this.pegandoListaDeUnidadesRefreshTabela()
            await this.pegandoTabelaDePrecos()
          }
          else
          {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Não foi possível disponibilizar, lote está reservado em nome de outra pessoa.`
            })
          }
        } catch {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Não foi possível disponibilizar, lote está reservado em nome de outra pessoa.`
          })
          await this.setVisibilidadeModalLoading(false)
        }
      }
      else
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Não é possível disponibilizar o lote, ele está reservado em nome de outra pessoa.`
        })
        await this.setVisibilidadeModalLoading(false)
      }
    }
    else
    {
      await this.setVisibilidadeModalOption(true)
    }
  }
  //#endregion

  //#region Pressionando o botão sim na modal de option
  pressionandoSim = async (item) => {
    const { addToLotes } = this.props;

      if(item.status == 2) 
      {
        try {
          await this.setVisibilidadeModalLoading(true)
          const response = await Identificador.deletar(String(this.props.token[0].token), [item])
          if (response != null && response != "" && response != undefined) 
          {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Lote disponibilizado com sucesso`
            })
            await this.pegandoListaDeUnidadesRefresh()
          }
        } catch {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Não foi possível disponibilizar, lote está reservado em nome de outra pessoa.`
          })
          await this.setVisibilidadeModalLoading(false)
        }
      }
      else
      {
        const navegar = await this.props.navigation.getParam('Disponibilidade', 'null')
        if(navegar != null && navegar != 'null')
        {
          addToLotes(item)
          this.state.VisibilidadeModalTabelaDePrecos = false
          await this.setVisibilidadeModalOption(false)
          return await navegar.onConfirm()
        }
      }
    }
  //#endregion

  //#region Pressionando o botão não na modal de option
  pressionandoNao = async (item) => {
    const { addToLotes } = this.props;

    if(item.status == 2) 
    {
      try {
        await this.setVisibilidadeModalLoading(true)
        const response = await Identificador.deletar(String(this.props.token[0].token), [item])
        if (response != null && response != "" && response != undefined) 
        {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Lote disponibilizado com sucesso`
          })
          await this.pegandoListaDeUnidadesRefresh()
        }
        else
        {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Não foi possível disponibilizar, lote está reservado em nome de outra pessoa.`
          })
        }
      } catch {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Não foi possível disponibilizar, lote está reservado em nome de outra pessoa.`
        })
        await this.setVisibilidadeModalLoading(false)
      }
    }
    else
    {
      try {
        this.state.VisibilidadeModalOption = false
        this.state.VisibilidadeModalTabelaDePrecos = false
        await this.setVisibilidadeModalLoading(true)
        const response = await Identificador.cadastrarReservaCorretor(String(this.props.token[0].token), [item])
        if (response != null && response != "" && response != undefined) 
        {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Lote reservado com sucesso`
          })
          await this.setVisibilidadeModalReservaConfirmada(true)
        }
      } catch {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Não foi possível reservar, tente novamente mais tarde.`
        })
        await this.setVisibilidadeModalLoading(false)
      }
    }
  }
  //#endregion

  //#region Reservando ou disponibilizando lote
  reserva_disponibilizacao = async (item) => {
    const { addToLotes } = this.props;
    if(item.status == 2) 
    {
      if(item.reservaVinculada.vendedorId == this.props.token[0].pessoa.id)
      {
        try {
          await this.setVisibilidadeModalLoading(true)
          const response = await Identificador.deletar(String(this.props.token[0].token), [item])
          if (response != null && response != "" && response != undefined) 
          {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Lote disponibilizado com sucesso`
            })
            await this.pegandoListaDeUnidadesRefresh()
          }
        } catch {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Não foi possível disponibilizar, tente novamente!`
            })
          await this.setVisibilidadeModalLoading(false)
        }
      }
      else
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Não é possível disponibilizar o lote, ele está reservado em nome de outra pessoa.`
        })
        await this.setVisibilidadeModalLoading(false)
      }
    }
    else
    {
      await this.setVisibilidadeModalOption(true)
    }
  }
  //#endregion

  //#region Abrindo link do mapa
  openLinking = async (url) => {
    const supported = await Linking.canOpenURL(url)
    if(supported) 
    {
      await Linking.openURL(url)
    }
    else
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `O mapa não pode ser aberto no momento!`
      })
    }
  }
  //#endregion

  //#endregion

}

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  empresa: state.dadosEmpreendimento.filter(emp => emp.empresa),
  centrodecusto: state.dadosEmpreendimento.filter(emp => emp.centrodecusto),
  ConfigCss: state.configcssApp,
  EmpresaLogada: state.EmpresaLogada,
  StyleGlobal: state.StyleGlobal
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...DadosLeadActions, ...TelaAtualActions, ...LotesActions, ...DadosIntermediacaoActions, ...DadosCorretagemActions, ...DadosFinanciamentoActions, ...TabelaDeVendasActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Disponibilidade);