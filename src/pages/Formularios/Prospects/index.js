//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Modal, Keyboard, View, Text, Animated, ScrollView, Dimensions, FlatList, TouchableOpacity, Platform } from 'react-native';
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
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
//#endregion

//#region Chaves de filtragem
const KEYS_TO_FILTERS_PROSPECT = ['nome', 'ocupacao.nome', 'telefones.numero', 'telefones.ddd']
const KEYS_TO_FILTERS_LOCAIS = ['localDeCaptacao']
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Identificador, Formularios } from "../../../services";
//#endregion

//#region Redux
import { DadosLeadActions, TelaAtualActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
import LoaderGrey from '../../../effects/loadergrey.json';
//#endregion

//#region Componentes
import { Container, Logo, NomeEmpresa, Header, TextInputPadrao } from '../../../components';
import { ModalLoadingGoBack, ModalReservaConfirmada, ModalLoading, ModalEnviandoArquivos, ModalDeletandoArquivos, ModalSucesso, ModalFalha, ModalLocalDeCaptacao } from '../../Modais';
import ModalAtualizandoProspect from "../../Modais/AtualizandoProspect";
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';

//#endregion

//#endregion

class Prospects extends Component {
  _isMounted = false;
  
  //#region Funcoes do componente
  componentDidMount = async () => {
    this._isMounted = true;

    this.state.EmpresaLogada = this.props.EmpresaLogada[0]
    
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

    })
    const navegar = await this.props.navigation.getParam('Prospects', 'null')
    const navegarProposta = await this.props.navigation.getParam('ProspectsProposta', 'null')
    if (navegar != null && navegar != 'null')
    {
      await this.setState({IconAdd: navegar.iconAdd})
    }
    if (navegarProposta != null && navegarProposta != 'null')
    {
      await this.setState({IconAdd: navegarProposta.iconAdd})
    }
    // await this.setVisibilidadeLoadingGoBack(true)
    await this.pegandoListaDeProspectsNoBancoDeDados()
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
    OptionsRadioButton: [
      {
        id: 0,
        descricao: "Email",
        checked: false
      },
      {
        id: 1,
        descricao: "Telefone",
        checked: false
      }
    ],
    ComponentesFormularios: [],
    OptionSelecionada: null,
    EmpresaLogada: null,
    showDate: false,
    Tempo: null,
    VisibilidadeModalAtualizacaoDoProspect: false,
    VisibilidadeModalLoading: false,
    VisibilidadeModalLoadingGoBack: false,
    VisibilidadeModalEnviandoArquivos: false,
    VisibilidadeModalDeleltandoArquivos: false,
    VisibilidadeModalSucesso: false,
    VisibilidadeModalFalha: false,
    VisibilidadeModalReservaConfirmada: false,
    VisibilidadeModalLocalDeCaptacao: false,
    ListaProspects: [],
    ListaOriginal: [],
    ListaFiltrada: [],
    ListaExibida: [],
    LocaisDeCaptacao: [],
    LoadingProspects: true,
    quantItem: 20,
    distanceEnd: null,
    distanceEndInitial: null,
    loadMore: false,
    lotereservado: [],
    TermProspect: '',
    searchTermProspect: '',
    searchTermLocal: '',
    Nome: null,
    Email: null,
    TelefoneP: null,
    finalidade: null,
    IdLead: 0,
    dadosProspect: [],
    IconAdd: false,
    isLoadingFooter: false,
    ID: "",
    scrollFlatY: new Animated.Value(0),
  };
  //#endregion

  //#region View
  render() {

    const filteredLocaisDeCaptacao = this.state.LocaisDeCaptacao.filter(createFilter(this.state.searchTermLocal, KEYS_TO_FILTERS_LOCAIS))
    
    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
        
        <Modal // Modal prospect
          animationType = "slide"
          transparent = {false}
          visible = {this.state.VisibilidadeModalAtualizacaoDoProspect}>
          <View
            style = {{
              flex: 1,
              backgroundColor: '#F6F8F5', 
              justifyContent: 'flex-start'
          }}>
            <View
              style = {{
                backgroundColor: this.props.StyleGlobal.cores.background, 
                height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 72,
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
                  onPress = {() => {this.setVisibilidadeCadastroDoLead(false)}}/>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 16,
                    textAlign: 'center',
                    color: '#FFFFFF'
                }}>Prospect</Text>
                <View style = {{width: 40}}/>
              </View>
            </View>
            <View
              style = {{
                marginHorizontal: 24, 
                marginTop: 24, 
                height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 127) : (Dimensions.get('window').height - 107),
                justifyContent: 'space-between'
              }}>
                <View>
                  
                  <View style = {{marginBottom: 8}}>
                    <Text
                      style = {{
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: 13,
                        color: '#677367'
                    }}>Nome</Text>
                    <TextInputPadrao 
                      onChangeText = {this.setNome}
                      onSubmitEditing = {() => { try {this.focoInputEmail()} catch {} }}
                      returnKeyType = {'go'}
                      keyboardType = {'default'}
                      value = {this.state.Nome}
                      id = {value => this.setIdInputNome(value)}
                    />         
                  </View>
                  
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367',
                      marginBottom: 5
                  }}>Meio de contato</Text>
                  <View
                    style = {{flexDirection: "row", alignItems: "center", marginBottom: 5, marginLeft: 5}}>
                    {this.state.OptionsRadioButton.map((item, index) => (
                      <View key = {item.id} style = {{flexDirection: 'row', alignItems: 'center', marginRight: 5, marginBottom: 5}}>
                        <TouchableOpacity
                          style = {[{
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: '#677367',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 5
                          }]}
                          onPress = {() => {
                            item.checked = true
                            this.state.OptionsRadioButton.map((Item, Index) => {
                              if (Item.id != item.id)
                              {
                                Item.checked = false
                              }
                            })
                            this.setState({OptionsRadioButton: this.state.OptionsRadioButton, OptionSelecionada: item})
                        }}>
                          {
                            item.checked ?
                              <View
                                style = {{
                                  height: 10,
                                  width: 10,
                                  borderRadius: 6,
                                  backgroundColor: '#677367',
                              }}/>
                            : null
                          }
                        </TouchableOpacity>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 13,
                            color: '#677367',
                        }}>{item.descricao}</Text>
                      </View>
                    ))}
                  </View>

                  {this.state.OptionSelecionada && this.state.OptionSelecionada.id == 0 &&
                  <View style = {{marginBottom: 8}}>
                    <Text
                      style = {{
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: 13,
                        color: '#677367'
                    }}>Email</Text>
                    <TextInputPadrao
                      onChangeText = {this.setEmail}
                      onSubmitEditing = {() => { try {this.focoInputTelefone()} catch {} }}
                      autoCapitalize = {'none'}
                      returnKeyType = {'go'}
                      keyboardType = {'email-address'}
                      value = {this.state.Email}
                      id = {value => this.setIdInputEmail(value)}
                    />                
                  </View>}

                  {this.state.OptionSelecionada && this.state.OptionSelecionada.id == 1 &&
                  <View style = {{marginBottom: 8}}>
                    <Text
                      style = {{
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: 13,
                        color: '#677367'
                    }}>Telefone</Text>
                    <TextInputPadrao
                      onChangeText = {this.setTelefone}
                      onSubmitEditing = {() => {}}
                      returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                      keyboardType = {'numeric'}
                      value = {this.state.TelefoneP}
                      id = {value => this.setIdInputTelefone(value)}
                    />                   
                  </View>}

                  {this.props.EmpresaLogada[0] == 5 &&
                  <View style = {{marginBottom: 8}}>
                    <Text 
                      style = {{
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: 13,
                        color: '#677367'
                    }}>Local de Captação</Text>
                    <TouchableOpacity activeOpacity = {1}
                      onPress = {async () => { await this.setVisibilidadeModalLocalDeCaptacao(true) }}
                      style = {{
                        flexDirection: 'column',
                        paddingVertical: 24,
                        paddingHorizontal: 16,
                        height: 65,
                        backgroundColor: '#FFFFFF',
                        borderWidth: 1,
                        borderColor: 'rgba(16, 22, 26, 0.15)',
                        marginTop: 4,
                        borderRadius: 5,
                    }}>
                      <Text
                        style = {{
                          color: '#262825',
                          fontStyle: 'normal',
                          fontWeight: 'normal',
                          fontSize: 14
                      }}>{(this.state.finalidade == "" || this.state.finalidade == null) ? "Selecione o local de captação" : this.state.finalidade}</Text>
                    </TouchableOpacity>
                  </View>}

                  {this.state.ComponentesFormularios.map((item, index) => (
                    <>
                      {item.classificacao.id == 1 && <View style = {{marginBottom: 8}}>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 13,
                            color: '#677367'
                        }}>{item.titulo}</Text>
                        <TextInputPadrao
                          multilines = {false}
                          onChangeText = {(value) => { 

                            let ListaDeTiposDeComponentesFormulario = [...this.state.ComponentesFormularios];

                            let ItemFiltrado = ListaDeTiposDeComponentesFormulario.filter((Item, Index) => Item.id == item.id)[0]

                            ItemFiltrado.resposta = value;

                            ListaDeTiposDeComponentesFormulario.map((Item, Index) => {
                                if(Item.id == ItemFiltrado.id)
                                {
                                    Item = ItemFiltrado
                                }
                            })

                            this.setState({ComponentesFormularios: ListaDeTiposDeComponentesFormulario})

                          }}
                          onSubmitEditing = {() => { }}
                          returnKeyType = {"go"}
                          keyboardType = {"default"}
                          value = {item.resposta}
                        />
                      </View>}
                      {item.classificacao.id == 2 && <View style = {{marginBottom: 8}}>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 13,
                            color: '#677367'
                        }}>{item.titulo}</Text>
                        <TextInputPadrao
                          multilines = {true}
                          onChangeText = {(value) => {

                            let ListaDeTiposDeComponentesFormulario = [...this.state.ComponentesFormularios];

                            let ItemFiltrado = ListaDeTiposDeComponentesFormulario.filter((Item, Index) => Item.id == item.id)[0]

                            ItemFiltrado.resposta = value;

                            ListaDeTiposDeComponentesFormulario.map((Item, Index) => {
                                if(Item.id == ItemFiltrado.id)
                                {
                                    Item = ItemFiltrado
                                }
                            })

                            this.setState({ComponentesFormularios: ListaDeTiposDeComponentesFormulario})

                          }}
                          onSubmitEditing = {() => {}}
                          returnKeyType = {"go"}
                          keyboardType = {"default"}
                          value = {""}
                        />
                      </View>}
                      {item.classificacao.id == 3 && <View style = {{marginBottom: 8, flexDirection: "row", alignItems: "center"}}>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 13,
                            color: '#677367'
                        }}>{item.titulo}</Text>
                        <Switch 
                          style = {{ transform: [{ scaleX: .6 }, { scaleY: .6 }] }}
                          value = {false}
                          thumbColor = {this.props.StyleGlobal.cores.background}
                          trackColor = {{
                            true: "#CCCCCC",
                            false: this.props.StyleGlobal.cores.background
                          }}
                        />
                      </View>}
                      {item.classificacao.id == 4 && <View style = {{marginBottom: 8}}>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 13,
                            color: '#677367'
                        }}>{item.titulo}</Text>
                        <TextInputPadrao
                          multilines = {false}
                          onChangeText = {(value) => {

                            let ListaDeTiposDeComponentesFormulario = [...this.state.ComponentesFormularios];

                            let ItemFiltrado = ListaDeTiposDeComponentesFormulario.filter((Item, Index) => Item.id == item.id)[0]

                            ItemFiltrado.resposta = value;

                            ListaDeTiposDeComponentesFormulario.map((Item, Index) => {
                                if(Item.id == ItemFiltrado.id)
                                {
                                    Item = ItemFiltrado
                                }
                            })

                            this.setState({ComponentesFormularios: ListaDeTiposDeComponentesFormulario})

                          }}
                          onSubmitEditing = {() => {}}
                          returnKeyType = {"go"}
                          keyboardType = {"default"}
                          value = {formatoDeTexto.Data(item.resposta)}
                        />
                      </View>}
                      {item.classificacao.id == 5 && <View style = {{marginBottom: 8}}>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 13,
                            color: '#677367',
                            marginBottom: 5
                        }}>{item.titulo}</Text>
                        <View
                          style = {{
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 3,
                            borderWidth: 1,
                            borderColor: 'rgba(16, 22, 26, 0.15)',
                            marginBottom: 5,
                            borderRadius: 5,
                            height: 65,
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                          <TouchableOpacity activeOpacity = {0.9}
                            onPress = { async () => { this.setState({showDate: true}) }}
                            style = {{
                              height: 65, 
                              width: "100%", 
                              justifyContent: 'center'
                            }}>
                              <Text style = {{color: "#696969", marginLeft: 10}}>{moment(this.state.Tempo == null ? new Date() : this.state.Tempo, true).format('HH:mm:ss')}</Text>
                          </TouchableOpacity>
                          <DateTimePickerModal
                            isVisible = {this.state.showDate}
                            mode = {"time"}
                            locale = {"pt-BR"}
                            headerTextIOS = {`${item.titulo}`}
                            cancelTextIOS = {"Cancelar"}
                            confirmTextIOS = {"Confirmar"}
                            onConfirm = { async (date) => { this.setState({Tempo: date, showDate: false}) }}
                            onCancel = { async () => { this.setState({showDate: false}) }}
                          />
                        </View>
                      </View>}
                    </>
                  ))}

                  <ModalLocalDeCaptacao 
                    visibilidade = {this.state.VisibilidadeModalLocalDeCaptacao}
                    keyExtractorFlatList = {item => item.localDeCaptacao}
                    renderLocal = {this.renderLocalDeCaptacao}
                    filteredLocal = {filteredLocaisDeCaptacao}
                    idFlatList = { (ref) => { this.FlatList = ref }}
                    onChangeSearch = {(term) => {this.searchUpdateLocalDeCaptacao(term)}}
                    onPressVisibilidade = { async () => { await this.setVisibilidadeModalLocalDeCaptacao(true) }}
                    colorempreendimento = {this.props.StyleGlobal.cores.background}
                  />

                </View>
                <TouchableOpacity
                  style = {{
                    width: '100%', 
                    backgroundColor: this.props.StyleGlobal.cores.background,
                    paddingHorizontal: 0,
                    height: 58,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5
                }}
                  onPress = {this.validandoAtualizacaoDoProspect}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 14,
                      textAlign: 'center',
                      color: '#FFFFFF',
                      alignSelf: 'center',
                  }}>Confirmar</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ModalLoading 
          visibilidade = {this.state.VisibilidadeModalLoading} 
          onPress = { async () => {
            await Identificador.cancelRequest(true)
            this.setState({VisibilidadeModalLoading: false})
          }}/>

        <ModalLoadingGoBack 
          visibilidade = {this.state.VisibilidadeModalLoadingGoBack} 
          onPress = { async () => {
            await Prospect.cancelRequest(true)
            await Lead.cancelRequest(true)
            await this.props.navigation.goBack(false)
          }}/>

        <ModalEnviandoArquivos visibilidade = {this.state.VisibilidadeModalEnviandoArquivos}/>

        <ModalDeletandoArquivos visibilidade = {this.state.VisibilidadeModalDeleltandoArquivos}/>

        <ModalSucesso visibilidade = {this.state.VisibilidadeModalSucesso}/>

        <ModalFalha visibilidade = {this.state.VisibilidadeModalFalha}/>

        <ModalReservaConfirmada 
          onPressIcon = {async () => {await this.pressionandoBotaoObrigado()}}
          visibilidade = {this.state.VisibilidadeModalReservaConfirmada}
          textBotaoEsquerdo = {'Reserva novo lote'}
          textBotaoDireito = {'Obrigado'}
          onPressReservarNovoLote = {async () => {await this.pressionandoBotaoNovoLote()}}
          onPressObrigado = {async () => {await this.pressionandoBotaoObrigado()}}
        />

        {this.state.VisibilidadeModalLoading == false && this.state.VisibilidadeModalLoadingGoBack == false && <>
        <View
          style = {{
            backgroundColor: this.props.StyleGlobal.cores.background, 
            height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 158 : 128,
            justifyContent: "center"
        }}>
          <View 
            style = {{
              flexDirection: 'row', 
              alignItems: 'center', 
              width: '100%', 
              justifyContent: 'space-between'
          }}>
            <Icon name = {'keyboard-arrow-left'} color = {'#FFFFFF'} size = {40} style = {{marginTop: 10}}
            onPress = {() => {this.props.navigation.goBack()}}/>
            <Text
              style = {{
                marginTop: 6,
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 14,
                textAlign: 'center',
                color: "#FFFFFF"
            }}>Prospect</Text>
            {(this.state.IconAdd == true) &&
            <Icon name = {'add'} color = {'#FFFFFF'} size = {35} style = {{marginRight: 10}}
              onPress = {() => {this.setVariaveisParaCadastroDoLead()}}/>}
            {this.state.IconAdd != true && <View style = {{width: 50}}></View>}
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
              onChangeText = {(term) => {this.searchUpdateProspect(term)}}
              style = {{
                paddingVertical: 12,
                paddingHorizontal: 16,
                height: 58,
                fontSize: 14,
                width: Dimensions.get('window').width * 0.88
              }}
              placeholder = 'Buscar prospect pelo nome...'
              placeholderTextColor = '#8F998F'
            />
            <Icon name = 'search' size = {30} color = {'#8F998F'} style = {{marginRight: 5, paddingRight: 5}}/>
          </View>
        </View>
        {this.state.LoadingProspects == true && <>
          <View 
            style = {{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
          }}>
            <View style = {{width: 100, height: 100}}>
              <Lottie
                resizeMode = {"contain"}
                source = {LoaderGrey}
                autoPlay
                loop
              />
            </View>
            <Text style = {{color: this.props.StyleGlobal.cores.background, textAlign: 'center'}}>Carregando dados dos prospects...</Text>
          </View>
        </>}
        {this.state.ListaExibida.length > 0 && this.state.LoadingProspects == false && <>
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
          keyExtractor = {item => String(item.id)}
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
              <Animated.View 
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
                  onPress = {() => {
                    if(item.status == -2) {
                      PushNotification.localNotification({
                        largeIcon: 'icon',
                        smallIcon: 'icon',
                        vibrate: true,
                        vibration: 300,
                        title: 'My Broker',
                        message: `Acesso negado, permitido somente a captação, para ser feito a conclusão da venda!`
                      })
                    } else {
                      this.state.Nome = item.nome
                      this.state.TelefoneP = formatoDeTexto.Telefone(item.telefones[0].ddd + item.telefones[0].numero)
                      this.state.Email = item.emails[0].descricao
                      this.state.finalidade = item.localDeCaptacao
                      this.state.IdLead = item.id
                      this.setVisibilidadeCadastroDoLead(true)
                    }
                  }}>
                  <View 
                    style ={{
                      width: '100%',
                  }}>
                    <View 
                      style = {{
                        width: '100%', 
                        flexDirection: 'column', 
                        alignItems: 'flex-start'
                    }}>
                      {item.nome != '' && item.nome != null && 
                      <Text
                        style = {{
                          fontSize: 12,
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          color: '#262825',
                          flexWrap: 'wrap'
                      }}>{(item.nome).toUpperCase()}</Text>}
                    </View>
                    <View
                      style = {{
                        flexDirection: 'row', 
                        width: '100%',
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                    }}>
                      <View
                        style = {{}}>
                        {item.telefones != '' &&
                        <Text
                          style = {{
                            fontSize: 10,
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            color: '#8F998F',
                          }} numberOfLines = {1} ellipsizeMode = {'tail'}>{item.telefones != "" ? formatoDeTexto.Telefone(item.telefones[0].ddd + item.telefones[0].numero) : ""}</Text>}
                        {item.emails != '' &&
                        <Text
                          style = {{
                            fontSize: 10,
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            color: '#8F998F',
                          }} numberOfLines = {1} ellipsizeMode = {'tail'}>{item.emails != "" ? item.emails[0].descricao : ""}</Text>}
                      </View>
                      <View
                        style = {{
                          flexDirection: 'row', 
                          justifyContent: 'flex-end', 
                          alignItems: 'center'
                        }}>
                        {this.state.IconAdd != true &&
                        <TouchableOpacity
                          activeOpacity = {1}
                          style = {{
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            marginRight: 10, 
                            backgroundColor: '#FFFFFF',
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: this.props.StyleGlobal.cores.botao
                        }}
                          onPress = {async () => {await this.rejeitarProspect(item.id)}}>
                          <Text
                            style = {{
                              fontSize: 12, 
                              color: this.props.StyleGlobal.cores.botao,
                              fontStyle: 'normal',
                              fontWeight: '500',
                              textAlign: 'center',
                              alignSelf: 'center',
                              marginVertical: 4,
                              marginHorizontal: 0
                        }}>Rejeitar</Text>
                        </TouchableOpacity>}
                        <TouchableOpacity
                          activeOpacity = {1}
                          style = {{
                            paddingVertical: 6,
                            paddingHorizontal: 10, 
                            backgroundColor: this.props.StyleGlobal.cores.botao,
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: this.props.StyleGlobal.cores.botao
                          }}
                          onPress = {async () => {this.captarProspect(item)}}
                        >
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
                        }}>Atender</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </>
          )
          }}
          refreshing = {true}
        /></>}
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
    
    RnBgTask.runInBackground(async () => {this.searchUpdateProspect(this.state.TermProspect)})
  }
  //#endregion
  
  //#region Renderizando lista de local de captacao
  renderLocalDeCaptacao = ({ item }) => (
    <TouchableOpacity key = {item.localDeCaptacao} style = {{marginHorizontal: 8}} activeOpacity = {1}
      onPress = {async () => {
        if (this.state.finalidade != item.localDeCaptacao) {
          this.state.finalidade = item.localDeCaptacao
          await this.setVisibilidadeModalLocalDeCaptacao(false)
        } else {
          await this.setVisibilidadeModalLocalDeCaptacao(false)
        }
      }}>
      <View 
        style = {{
          backgroundColor: item.localDeCaptacao == this.state.finalidade ? this.props.StyleGlobal.cores.background : '#FFFFFF',
          paddingHorizontal: 16,
          width: '100%',
          borderWidth: 1,
          borderColor: 'rgba(16, 22, 26, 0.15)',
          marginVertical: 5,
          borderRadius: 5,
          height: 58,
          alignItems: "center",
          justifyContent: "center"
      }}>
        <Text 
          style = {{
            paddingVertical: 0,
            fontSize: 12,
            color: item.localDeCaptacao == this.state.finalidade ? '#FFFFFF' : '#262825',
            fontWeight: item.localDeCaptacao == this.state.finalidade ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.localDeCaptacao}</Text>
      </View>
    </TouchableOpacity>
  );
  //#endregion

  //#region Filtrando a lista de locais de captação
  searchUpdateLocalDeCaptacao(term) {
    this.setState({searchTermLocal: term})
  }
  //#endregion

  //#region Setando a visibilidade da modal de cadastro do prospect
  setVisibilidadeCadastroDoLead = async (value) => {
    await this.setState({ VisibilidadeModalAtualizacaoDoProspect: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de local de captacao
  setVisibilidadeModalLocalDeCaptacao = async (value) => {
    await this.setState({ VisibilidadeModalLocalDeCaptacao: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeLoading = async (value) => {
    await this.setState({ VisibilidadeModalLoading: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading go back
  setVisibilidadeLoadingGoBack = async (value) => {
    await this.setState({ VisibilidadeModalLoadingGoBack: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de envio dos arquivos do prospect
  setVisibilidadeEnviandoArquivos = async (value) => {
    await this.setState({ VisibilidadeModalEnviandoArquivos: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de deletando arquivos do prospect
  setVisibilidadeDeletandoArquivos = async (value) => {
    await this.setState({ VisibilidadeModalDeleltandoArquivos: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de sucesso
  setVisibilidadeSucesso = async (value) => {
    await this.setState({ VisibilidadeModalSucesso: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de falha
  setVisibilidadeFalha = async (value) => {
    await this.setState({ VisibilidadeModalFalha: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de reserva confirmada
  setVisibilidadeModalReservaConfirmada = async (value) => {
    this.setState({VisibilidadeModalReservaConfirmada: value})
  }
  //#endregion

  //#region Pegando a lista de prospects no Banco de dados
  pegandoListaDeProspectsNoBancoDeDados = async () => {
    const response = await Prospect.lista(String(this.props.token[0].token))
    if(response != null && response != undefined) 
    {
      this.state.ListaProspects = response
      const Lista = this.state.ListaProspects

      this.state.ListaProspects = Lista
      this.state.ListaOriginal = Lista
      this.state.ListaFiltrada = Lista
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
        this.state.ListaExibida = ListaAdd 
      } else {
        for(var i = 0; i <=(Lista.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        await this.setState({isLoadingFooter: true}) 
      }
      await this.pegandoLocaisDeCaptacao()
    }
    else
    {
      await this.setVisibilidadeLoadingGoBack(false)
      await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando a Lista de locais de captação no Banco de dados
  pegandoLocaisDeCaptacao = async () => {
    try{
      const response = await Lead.LocaisDeCaptacao(String(this.props.token[0].token))
      if(response != null && response != undefined) {
        this.state.LocaisDeCaptacao = response[0].locaisDeCaptacao
        await this.pegandoComponentesDoFormulario()
      }
      else 
      {
        await this.setVisibilidadeLoadingGoBack(false)
        await this.props.navigation.goBack()
      }
    } catch(err) {
        await this.setVisibilidadeLoadingGoBack(false)
        await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando a lista de componentes do formulario
  pegandoComponentesDoFormulario = async () => {
    let Response = await Formularios.Get(String(this.props.token[0].token), this.props.EmpresaLogada[0])
    if(Response != null && Response != undefined) 
    {
      this.state.ComponentesFormularios = Response[0].perguntas
      await this.setVisibilidadeLoadingGoBack(false)
      this.setState({LoadingProspects: false})
    }
    else
    {
      await this.setVisibilidadeLoadingGoBack(false)
    }
  }
  //#endregion

  //#region Setando Nome do prospect
  setNome = async (value) => {
    await this.setState({ Nome: value })
  }
  //#endregion

  //#region Setando Email do prospect
  setEmail = async (value) => {
    await this.setState({Email: value})
  }
  //#endregion

  //#region Setando Telefone do prospect
  setTelefone = async (value) => {
    await this.setState({TelefoneP: formatoDeTexto.Telefone(value)})
  }
  //#endregion

  //#region Setando a referencia do input do nome
  setIdInputNome(value) {
    this.InputNome = value
  }
  //#endregion

  //#region Setando a referencia do input do email
  setIdInputEmail(value) {
    this.InputEmail = value
  }
  //#endregion

  //#region Setando a referencia do input do telefone
  setIdInputTelefone(value) {
    this.InputTelefone = value
  }
  //#endregion

  //#region Focando o input nome
  focoInputNome() {
    this.InputNome.focus()
  }
  //#endregion

  //#region Focando o input email
  focoInputEmail() {
    this.InputEmail.focus()
  }
  //#endregion

  //#region Focando o input telefone
  focoInputTelefone() {
    this.InputTelefone.focus()
  }
  //#endregion

  //#region Validando email
  IsEmail = (email) => {
    var str = email;
    var filtro = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if(filtro.test(str)) {
        return true;
    } else {
        return false;
    }
  }
  //#endregion

  //#region Validando telefone
  Telefone_validation(telefone) {
    telefone = telefone.replace(/\D/g, '');
    telefone = telefone.replace("(","");
    telefone = telefone.replace(")", "");
    telefone = telefone.replace("-", "");
    telefone = telefone.replace(" ", "").trim();
    if (!(telefone.length >= 10 && telefone.length <= 11)) return false;
    if (telefone.length == 11 && parseInt(telefone.substring(2, 3)) != 9) return false;
    for (var n = 0; n < 10; n++) {
        if (telefone == new Array(11).join(n) || telefone == new Array(12).join(n)) return false;
    }
    var codigosDDD = [11, 12, 13, 14, 15, 16, 17, 18, 19,
        21, 22, 24, 27, 28, 31, 32, 33, 34,
        35, 37, 38, 41, 42, 43, 44, 45, 46,
        47, 48, 49, 51, 53, 54, 55, 61, 62,
        64, 63, 65, 66, 67, 68, 69, 71, 73,
        74, 75, 77, 79, 81, 82, 83, 84, 85,
        86, 87, 88, 89, 91, 92, 93, 94, 95,
        96, 97, 98, 99];
    if (codigosDDD.indexOf(parseInt(telefone.substring(0, 2))) == -1) return false;
    if (new Date().getFullYear() < 2017) return true;
    if (telefone.length == 10 && [2, 3, 4, 5, 7].indexOf(parseInt(telefone.substring(2, 3))) == -1) return false;
    return true;
  }
  //#endregion

  //#region Validando atualização do prospect
  validandoAtualizacaoDoProspect = async () => {
    if(await Validacoes.ModalAtualizarProspect(this.state, this) == true) 
    {
      if(this.state.IdLead > 0)
       {
        await this.setState({VisibilidadeCadastroDoLead: false})
        await this.setVisibilidadeEnviandoArquivos(true) 
        await this.dadosProspect()
        await this.atualizandoprospect()
       }
       else
       {
        await this.setState({VisibilidadeCadastroDoLead: false})
        await this.setVisibilidadeEnviandoArquivos(true)
        await this.dadosProspect()
        await this.adicionandoprospect()
       }
    }
  }
  //#endregion

  //#region Adicionando dados do prospect no Banco de dados
  adicionandoprospect = async () => {
    try
    {
      const response = await Prospect.cadastrar(String(this.props.token[0].token), this.state.dadosProspect)

      if (response.status == 200 || response.status == 201)
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Prospect atualizado com sucesso`
        })
        await this.atualizandoListaDosProspects()
      }
    }
    catch
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Falha ao tentar atualizar os dados do prospect, tente novamente!`
      })
      this.state.VisibilidadeModalEnviandoArquivos = false
      await this.setVisibilidadeFalha(true)
      setTimeout(() => {
        this.setVisibilidadeFalha(false)
      },2000)
    }
  }
  //#endregion

  //#region Atualizando dados do prospect no Banco de dados
  atualizandoprospect = async () => {
    try
    {
      const response = await Prospect.alterar(String(this.props.token[0].token), this.state.dadosProspect)

      if (Math.floor(response.status / 100) == 2)
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Prospect atualizado com sucesso`
        })
        await this.atualizandoListaDosProspects()
      }
      else
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Não foi possível atualizar os dados do prospect, entre em contato com a equipe de desenvolvimento.`
        })
        await this.setVisibilidadeEnviandoArquivos(false)
        await this.setVisibilidadeFalha(true)
        setTimeout(() => {
          this.setVisibilidadeFalha(false)
        },2000)
      }
    }
    catch
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Não foi possível atualizar os dados do prospect, entre em contato com a equipe de desenvolvimento.`
      })
      await this.setVisibilidadeEnviandoArquivos(false)
      await this.setVisibilidadeFalha(true)
      setTimeout(() => {
        this.setVisibilidadeFalha(false)
      },2000)
    }
  }
  //#endregion

  //#region Atualizando lista dos prospects
  atualizandoListaDosProspects = async () => {
    
    let Response = await Prospect.lista(String(this.props.token[0].token))
    
    if(Response != null && Response != undefined) 
    {
      
      this.state.ListaProspects = Response
      const Lista = this.state.ListaProspects
      this.state.ListaOriginal = Response
      this.state.ListaFiltrada = Response
      
      try {
        const vendas = await AsyncStorage.getItem('@Vendas')
        if (vendas != null) {
          this.state.vendaAsync = JSON.parse(vendas)
          this.state.ListaOriginal.unshift(...this.state.vendaAsync)
        } else {}
      } catch(err) { console.log(err) }

      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      this.state.distanceEnd = null;
      this.state.distanceEndInitial = null;
      this.state.loadMore = false;
      const ListaAdd = [];
      if (Lista.length >= 20) {
        for(var i = 0; i <= (this.state.quantItem - 1); i++) {
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
      this.state.VisibilidadeModalEnviandoArquivos = false
      this.state.VisibilidadeModalDeleltandoArquivos = false
      this.state.VisibilidadeModalAtualizacaoDoProspect = false
      await this.setVisibilidadeSucesso(true)
      setTimeout(() => {
        this.setVisibilidadeSucesso(false)
      },2000)
      this.state.Nome = null
      this.state.Email = null
      this.state.TelefoneP = null
      this.state.IdLead = 0
    }
    else 
    {
      
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Não foi possível atualizar a lista dos propspects, por favor acesse os prospects novamente.`
      })

      this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Selecionado botão reservar no lote
  pressionandoBotaoNovoLote = async () => {
    const navegar = await this.props.navigation.getParam('Prospects', 'null')
    const navegarProposta = await this.props.navigation.getParam('ProspectsProposta', 'null')
    if (navegar != null && navegar != 'null')
    {
      await this.setVisibilidadeModalReservaConfirmada(false)
      return await navegar.onConfirm()
    }
    if (navegarProposta != null && navegarProposta != 'null')
    {
      const { addToTela, addToLead } = this.props;
      await addToTela('@tela_vendadireta');
      await addToLead(this.state.lotereservado);
      await this.setVisibilidadeModalReservaConfirmada(false)
      return await navegarProposta.onReservaNovo()
    }
  }
  //#endregion

  //#region Selecionando botão obrigado
  pressionandoBotaoObrigado = async () => {
    const navegar = await this.props.navigation.getParam('Prospects', 'null')
    const navegarProposta = await this.props.navigation.getParam('ProspectsProposta', 'null')
    if (navegar != null && navegar != 'null')
    {
      await this.setVisibilidadeModalReservaConfirmada(false)
      return await navegar.onConfirm()
    }
    if (navegarProposta != null && navegarProposta != 'null')
    {
      const { addToTela, addToLead } = this.props;
      await addToTela('@tela_vendadireta');
      await addToLead(this.state.lotereservado);
      if(this.props.Corretagem != "" && this.props.EmpresaLogada[0] == 5)
      {
        await this.setVisibilidadeModalReservaConfirmada(false)
        return await navegarProposta.onIntermediacao()
      }
      else
      {
        await this.setVisibilidadeModalReservaConfirmada(false)
        return await navegarProposta.onConfirm()
      }
    }
  }
  //#endregion

  //#region Rejeitando o prospect
  rejeitarProspect = async (IDItem) => {
    this.setVisibilidadeDeletandoArquivos(true)
    try {

      let Response = await Prospect.delete(this.props.token[0].token, parseInt(IDItem))
      
      if (Math.floor(Response.status / 100) == 2) {
        
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Prospect rejeitado com sucesso`
        })
        await this.atualizandoListaDosProspects();
      }
    } catch(err) {
      console.log(err)

      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Não foi possível rejeitar o prospect, entre em contato com nossa equipe de desenvolvimento.`
      })

      await this.setVisibilidadeDeletandoArquivos(false)
      await this.setVisibilidadeFalha(true)
      setTimeout(() => {
        this.setVisibilidadeFalha(false)
      },2000)
    }
  }
  //#endregion

  //#region Atendendo o prospect
  captarProspect = async (item) => {
    if(this.state.IconAdd != true)
    {
        const { addToTela, addToLead } = this.props;
        await addToTela('@tela_vendadireta');
        await addToLead(item);
        const navegar = await this.props.navigation.getParam('Prospects', 'null')
        if (navegar != null && navegar != 'null')
        {
          return navegar.onConfirm()
        }
    }
    else
    {
      if (this.props.Lote[0].status == 2)
      {
        try {
          await this.setVisibilidadeLoading(true)
          const response = await Identificador.deletar(String(this.props.token[0].token), this.props.Lote)
          if(response != null && response != undefined && response != "")
          {
            this.props.Lote[0].status = 0
            this.props.Lote[0].reservaVinculada.prospectId = null
            this.props.Lote[0].reservaVinculada.prospectNome = null
            this.props.Lote[0].reservaVinculada.prospectVinculado = null
            this.props.Lote[0].reservaVinculada.vendedorId = null
            this.props.Lote[0].reservaVinculada.vendedorNome = null
            this.props.Lote[0].reservaVinculada.vendedorVinculado = null
            try {
              await this.setVisibilidadeLoading(true)
              const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), item.id, this.props.Lote)
              if(response != null && response != undefined && response != "")
              {
                PushNotification.localNotification({
                  largeIcon: 'icon',
                  smallIcon: 'icon',
                  vibrate: true,
                  vibration: 300,
                  title: 'My Broker',
                  message: `Reserva realizada com sucesso`
                })
                this.state.lotereservado = item
                await this.setVisibilidadeLoading(false)
                await this.setVisibilidadeModalReservaConfirmada(true)
              }
              else
              {
                PushNotification.localNotification({
                  largeIcon: 'icon',
                  smallIcon: 'icon',
                  vibrate: true,
                  vibration: 300,
                  title: 'My Broker',
                  message: `Não foi possível realizar a reserva, entre em contato com a equipe de desenvolvimento.`
                })
                this.state.lotereservado = item
                await this.setVisibilidadeLoading(false)
              }
            } catch {
              PushNotification.localNotification({
                largeIcon: 'icon',
                smallIcon: 'icon',
                vibrate: true,
                vibration: 300,
                title: 'My Broker',
                message: `Falha ao tentar realizar a reserva, tente novamente!`
              })
              await this.setVisibilidadeLoading(false)
            }
          }
        } catch {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Não foi possível realizar a reserva, entre em contato com a equipe de desenvolvimento.`
          })
          await this.setVisibilidadeLoading(false)
        }
      }
      else
      {
        try {
          await this.setVisibilidadeLoading(true)
          const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), item.id, this.props.Lote)
          if(response != null && response != undefined && response != "")
          {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Reserva realizada com sucesso`
            })
            this.state.lotereservado = item
            await this.setVisibilidadeLoading(false)
            await this.setVisibilidadeModalReservaConfirmada(true)
          }
          else
          {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Não foi possível realizar a reserva, entre em contato com a equipe de desenvolvimento`
            })
            this.state.lotereservado = item
            await this.setVisibilidadeLoading(false)
          }
        } catch {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Não foi possível realizar a reserva, entre em contato com a equipe de desenvolvimento.`
            })
            await this.setVisibilidadeLoading(false)
        }
      }
    }
  }
  //#endregion

  //#region Montando o array com os dados do lead
  dadosProspect() {
    if(this.state.IdLead > 0)
    {
      const Telefone = formatoDeTexto.TelefoneOriginal(this.state.TelefoneP);
      const ddd = Telefone.substr(0, 2);
      const number = Telefone.substr(2, 9);
      this.state.dadosProspect = {
        "id": this.state.IdLead,
        "nome": this.state.Nome,
        "idade": null,
        "fotoDoLead": null,
        "ocupacao": null,
        "dadosDosVeiculos": null,
        "dependentes": null,
        "estadoCivil": null,
        "documentoDeEstadoCivil": null,
        "endereco": null,
        "emails":  [
          {
            "classificacao": 1,
            "descricao": this.state.Email
          }
        ],
        "documentoEndereco": null,
        "telefones": [
          {
            "classificacao": 1,
            "ddi": "55",
            "ddd": ddd,
            "numero": number,
            "observacao": "Telefone principal"
          }
        ],
        "localDeCaptacao": this.state.finalidade,
        "status": 0,
        "alturaDoItem": 0
      }
    }
    else
    {
      const Telefone = formatoDeTexto.TelefoneOriginal(this.state.TelefoneP);
      const ddd = Telefone.substr(0, 2);
      const number = Telefone.substr(2, 9);
      this.state.dadosProspect = {
        "id": 0,
        "nome": this.state.Nome,
        "idade": null,
        "fotoDoLead": null,
        "ocupacao": null,
        "dadosDosVeiculos": null,
        "dependentes": null,
        "estadoCivil": null,
        "documentoDeEstadoCivil": null,
        "endereco": null,
        "emails":  [
          {
            "classificacao": 1,
            "descricao": this.state.Email
          }
        ],
        "documentoEndereco": null,
        "telefones": [
          {
            "classificacao": 1,
            "ddi": "55",
            "ddd": ddd,
            "numero": number,
            "observacao": "Telefone principal"
          }
        ],
        "localDeCaptacao": this.state.finalidade,
        "status": 0,
        "alturaDoItem": 0
      }
    }
  }
  //#endregion

  //#region Filtrando prospect
  searchUpdateProspect = async (Term) => {
    await this.setState({searchTermProspect: Term, TermProspect: Term})
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
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(createFilter(this.state.searchTermProspect, KEYS_TO_FILTERS_PROSPECT))
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

  //#region Carregando mais prospects da lista
  carregandoMaisProspectsParaLista = async () => {
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

  //#region Setando as variaveis do cadastro de um novo prospect
  setVariaveisParaCadastroDoLead = async () => {
    this.state.IdLead = 0
    this.state.Nome = null
    this.state.Email = null
    this.state.finalidade = null
    this.state.TelefoneP = null
    await this.setVisibilidadeCadastroDoLead(true)
  }
  //#endregion

  //#endregion

}

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  tela: String(state.telaAtual),
  Lote: state.dadosLotes,
  ConfigCss: state.configcssApp,
  StyleGlobal: state.StyleGlobal,
  EmpresaLogada: state.EmpresaLogada,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({...TelaAtualActions, ...DadosLeadActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Prospects);