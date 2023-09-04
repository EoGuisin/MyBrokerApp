//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Switch, Modal, View, Text, Animated, TouchableOpacity, Dimensions, ScrollView, FlatList, Platform, Linking } from 'react-native';
//#endregion

//#region Externas
import Toast from 'react-native-toast-message';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import Icon from 'react-native-vector-icons/MaterialIcons';
import PushNotification from 'react-native-push-notification';
import Lottie from 'lottie-react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
import Collapsible from 'react-native-collapsible';
import fetch_blob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';
import RNShareFile from 'react-native-share-pdf';
import PDFView from 'react-native-view-pdf';
import Clipboard from '@react-native-clipboard/clipboard';
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { CentroDeCusto, BoletosAPI, Vendas } from '../../../services';
//#endregion

//#region Redux
import {DadosEmpreendimentoActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
import Loader from '../../../effects/loader.json';
//#endregion

//#region Componentes
import { Container } from '../../../components';
import { ModalEmpreendimento, ModalLoading, ModalLoadingGoBack, ModalListaLotes } from '../../Modais';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
import moment from 'moment';
//#endregion

//#region Chaves de filtragem
const KEYS_TO_FILTERS_EMPRESA = ['empresa.nomeFantasia'];
const KEYS_TO_FILTERS_EMPREENDIMENTO = ['descricao']
const KEYS_TO_FILTERS_YEARS = ['descricao'];
//#endregion

//#region ArquivosPdf
import cessaoBase64 from "./cessaoBase64.json";
import escrituraBase64 from './escritura.json';
import { thisExpression } from '@babel/types';
//#endregion

//#endregion

class OpcoesContratos extends Component {
  _isMounted = false;
  constructor(props)
  {
    super(props);
  }

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

    this.setVisibilidadeModalLoadingGoBack(true)
    await this.pegandoDadosDoContrato()
  }
  //#endregion

  //#region Component Unmount
  componentWillUnmount() {
    this._isMounted = false;
  }
  //#endregion

  //#region Model
  state = {
    VisibilidadeModalEmpreendimento: false,
    VisibilidadeModalLoading: false,
    VisibilidadeModalLoadingGoBack: false,
    VisibilidadeModalCheckList: false,
    VisibilidadeModalPDF: false,
    VisibilidadeModalListaLotes: false,
    VisibilidadeModalBoletos: false,
    VisibilidadeModalDate: false,
    tituloModalPDF: '',
    Years: [],
    TituloPage: '',
    selectedYear: null,
    searchTermYears: '',
    Empreendimentos: [],
    ContratoSelecionado: null,
    ListaDeContratos: [],
    ListaDeBoletos: [],
    ListaDeObservacoes: [],
    ListaUnidades: [],
    ListaOriginal: [],
    ListaExibida: [],
    ListaFiltrada: [],
    PDFContrato: "",
    PDFDescricaoContrato: "",
    PDFExtensaoContrato: "",
    ItemBoleto: null,
    searchTermEmpreendimentos: '',
    Empreendimento: null,
    Empreendimento_descricao: null,
    EmpresaId: null,
    Empresa_nomeFantasia: null,
    ID: "",
    OptionSelected: 'Resumo',
    Titulo: 'solicitar uma renegociação',
    opacityButton: new Animated.Value(0),
    opacityScrollView: new Animated.Value(0), 
    translateYButton: new Animated.Value(40),
    translateYScrollView: new Animated.Value(40),
    expandCollapsideContratos: true,
    valueSwitchTermos: false,
    CopyText: false
  };
  //#endregion

  //#region View
  render() {

    const filteredYears = this.state.Years.filter(createFilter(this.state.searchTermYears, KEYS_TO_FILTERS_YEARS))
    
    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'space-between' }}>
        <ModalListaLotes
          visibilidade={this.state.VisibilidadeModalListaLotes}
          keyExtractorFlatList={item => item.id}
          renderEmpreendimento={this.renderItem}
          filteredEmpreendimento={this.state.ListaDeContratos}
          idFlatList={(ref) => { this.FlatList = ref }}
          onChangeSearch={(term) => { this.searchUpdateUnidades(term) }}
          onPressVisibilidade={() => { this.setVisibilidadeModalListaLotes(false) }}
          colorlotes={this.props.StyleGlobal.cores.background}
        />
        <Modal // Modal de boletos
          animationType = 'slide'
          transparent = {false}
          visible = {this.state.VisibilidadeModalBoletos}>
          <View 
            style = {{ 
              flex: 1,
              backgroundColor: "#F6F8F5"
          }}>
            <View
              style = {{
                backgroundColor:  this.props.StyleGlobal.cores.background, 
                height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
                justifyContent: "center"
            }}>
              <View 
                style = {{
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
              }}>
                <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40} style = {{}}
                  onPress = {() => {
                    this.setState({VisibilidadeModalBoletos: false})
                  }}/>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#FFFFFF'
                }}>Selecione o boleto</Text>
                <View style = {{width: 40}}></View>
              </View>
            </View>
              <View 
                style = {{
                  minHeight: Dimensions.get('window').height - 190, 
                  borderTopWidth: 0,
                  marginBottom: 20
              }}>
                <FlatList
                  ref={(ref) => this.flatList = ref}
                  style={{ marginBottom: 10, marginHorizontal: 8 }}
                  data={this.state.ListaDeBoletos}
                  keyExtractor={item => parseInt(item.numeroDoDocumento)}
                  renderItem={this.renderItemBoletos}
                  showsVerticalScrollIndicator={false}
                  refreshing={true}
                />
              </View>
          </View>
        </Modal>
        <Modal // Modal Anos
          visible = {this.state.VisibilidadeModalDate}
          animationType = "slide"
          transparent = {false}>
          <View
            style = {{
              flex: 1,
              backgroundColor: "#F6F8F5"
          }}>
            <View 
              style = {{
                backgroundColor: this.props.StyleGlobal.cores.background,
                height: 148,
                justifyContent: "center"
            }}>
              <View 
                style = {{
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
              }}>
                <Icon style = {{paddingLeft: 10, paddingTop: 5, height: 50, width: 60, alignItems: 'center', justifyContent: 'center'}} name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40}
                  onPress = {async () => {this.setState({VisibilidadeModalDate: false})}}/>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#FFFFFF'
                }}>Selecione o ano</Text>
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
                  borderRadius: 5,
              }}>
                <SearchInput
                  onChangeText = {(term) => {this.searchUpdateYears(term)}}
                  style = {{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    height: 58,
                    fontSize: 14,
                    width: Dimensions.get('window').width * 0.88
                  }}
                  keyboardType = {"number-pad"}
                  returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                  placeholder = 'Pesquisar pelo ano...'
                  placeholderTextColor = '#8F998F'
                />
                <Icon name = 'search' size = {30} color = {'#8F998F'} style = {{marginRight: 5}}/>
              </View>
            </View>
            <FlatList
              contentContainerStyle = {{
                marginTop: 8,
                width: Dimensions.get('window').width, 
                paddingHorizontal: 10,
                paddingBottom: 20
              }}
              showsVerticalScrollIndicator = {false}
              ref = {(ref) => { this.FlatList = ref }}
              data = {filteredYears}
              keyExtractor = {item => item.id}
              renderItem = {({ item, index }) => (
                <>
                  <TouchableOpacity activeOpacity = {0.75} key = {item.id} style = {{paddingHorizontal: 5}}
                    onPress = {async () => {
                      if (this.state.selectedYear != item.descricao)
                      {
                        this.state.selectedYear = item.descricao
                        this.state.TituloPage = `Informe de rendimentos ${item.descricao}`
                        await this.setState({VisibilidadeModalDate: false, VisibilidadeModalLoading: true})
                        await this.getInformeDeRendimentos();
                      }
                      else
                      {
                        this.state.TituloPage = `Informe de rendimentos ${item.descricao}`
                        await this.setState({VisibilidadeModalDate: false, VisibilidadeModalLoading: true})
                        await this.getInformeDeRendimentos();
                      }
                    }}>
                    <View 
                      style = {{
                        backgroundColor: item.descricao == this.state.selectedYear ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                        width: '100%',
                        borderWidth: 1,
                        borderColor: 'rgba(16, 22, 26, 0.15)',
                        marginBottom: 4, 
                        borderRadius: 5,
                        marginVertical: 5,
                        height: 58,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                      <Text 
                        style = {{
                          paddingVertical: 0,
                          fontSize: 13,
                          color: item.descricao == this.state.selectedYear ? "#FFFFFF" : '#262825',
                          fontWeight: item.descricao == this.state.selectedYear ? 'bold' : 'normal',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                      }}>{item.descricao}</Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
              refreshing = {true}
            />
          </View>
        </Modal>
        <Modal // Compartilhar ou mostrar PDF do contrato
          animationType='slide'
          visible={this.state.VisibilidadeModalPDF}
          transparent={false}>
          <View style={{ flex: 1 }}>
              <View style={{ height: 85,justifyContent: 'space-between', flexDirection: 'row',  alignItems: 'flex-end', backgroundColor: this.props.StyleGlobal.cores.background, paddingBottom: 10}}>
                  <View>
                    <Icon
                      style={{ marginLeft: 20 }}
                      name='close'
                      size={40}
                      color={'#FFFFFF'}
                      onPress={() => { this.setVisibilidadeModalPDF(false) }}
                    />
                  </View>
                  <Text style = {{ fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, textAlign: 'center', color: '#FFFFFF', paddingBottom: 10 }}>{`${this.state.TituloPage}`}</Text>
                  <View>
                      <Icon
                        style = {{ marginRight: 20 }}
                        name = {'share'}
                        size = {40}
                        color = {'#FFFFFF'}
                        onPress = {async () => { const showError = await RNShareFile.sharePDF(this.state.PDFContrato, `${this.state.TituloPage}.${'pdf'}`) }}
                      />
                  </View>
              </View>
              <PDFView
                fadeInDuration = {250}
                style = {{ flex: 1 }}
                resource = {this.state.PDFContrato}
                resourceType = {"base64"}
                onLoad = {() => { }}
                onError = {() => { }}
              />
          </View>
        </Modal>
        <ModalLoading visibilidade = {this.state.VisibilidadeModalLoading} 
          onPress = { async () => {
            await CentroDeCusto.cancelRequest(true)
            await this.props.navigation.goBack()
        }}/>
        <ModalLoadingGoBack visibilidade = {this.state.VisibilidadeModalLoadingGoBack}
          onPress = { async () => { 
            await CentroDeCusto.cancelRequest(true)
            await this.setState({VisibilidadeModalLoadingGoBack: false})
        }}/>
        <Modal // Mostrar PDF de confirmação
          animationType = {'slide'}
          visible = {this.state.VisibilidadeModalCheckList}
          transparent = {false}>
            <View style = {{ flex: 1 }}>
                <View style = {{ height: 85, flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', backgroundColor: this.props.StyleGlobal.cores.background }}>
                    <View>
                      <Icon
                        style = {{ marginLeft: 20 }}
                        name = {'close'}
                        size = {40}
                        color = {'#FFFFFF'}
                        onPress = {() => {  this.setState({ VisibilidadeModalCheckList: false }) }}
                      />
                    </View>
                    <Text style = {{ fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, textAlign: 'center', color: '#FFFFFF' }}>{`Termos`}</Text>
                    <View style = {{width: 40}}/>
                </View>
                <PDFView
                  fadeInDuration={250}
                  style={{ flex: 1 }}
                  resource={this.state.Titulo.includes('escritura') ? escrituraBase64.base64 : cessaoBase64.base64}
                  resourceType={"base64"}
                  onLoad={() => { }}
                  onError={() => { }}
                />
                <View style={{ height: 120, alignItems: 'center', justifyContent: "center", backgroundColor: this.props.StyleGlobal.cores.background }}>
                  <View style = {{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style = {{marginLeft: 10}}>
                      <Switch
                        trackColor = {{false: '#CCCCCC99', true: "#FFFFFF"}}
                        onValueChange = {() => {
                          if(this.state.valueSwitchTermos == false)
                          {
                            this.setState({valueSwitchTermos: true})
                          }
                        }}
                        value = {this.state.valueSwitchTermos}
                      />
                    </View>
                    <Text 
                      style = {{
                        width: "80%",
                        flexWrap: "wrap",
                        color: "#FFFFFF", 
                        fontWeight: "bold",
                        marginLeft: 10,
                    }}>{`Eu estou de acordo com todos os termos acima citados.`}</Text>
                  </View>
                    <TouchableOpacity
                      style = {{
                        backgroundColor: "#FFFFFF",
                        paddingHorizontal: 16,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: "center",
                        marginBottom: 20,
                        marginTop: 10,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: "#FFFFFF"
                      }}
                      activeOpacity = {1}
                      onPress = {async () => {
                        if (this.state.valueSwitchTermos == true) {
                          this.setState({VisibilidadeModalCheckList: false})
                          let supported = await  Linking.canOpenURL(`https://wa.me/5562996842423?text=Olá meu nome é *${(this.props.token[0].pessoa.nome).toUpperCase()}*, gostaria de *${`${(this.state.Titulo).toUpperCase()}`}* do meu contrato da unidade *${(`${this.state.ContratoSelecionado.subLocal['descricao']}`).toUpperCase()}*, do empreendimento *${(`${this.state.ContratoSelecionado.centroDeCusto.descricao}`).toUpperCase()}*, da empresa *${(`${this.state.ContratoSelecionado.empresa.nomeFantasia}`).toUpperCase()}*`)
                  
                          if (supported)
                          {
        
                            await  Linking.openURL(`https://wa.me/5562996842423?text=Olá meu nome é *${(this.props.token[0].pessoa.nome).toUpperCase()}*, gostaria de *${`${(this.state.Titulo).toUpperCase()}`}* do meu contrato da unidade *${(`${this.state.ContratoSelecionado.subLocal['descricao']}`).toUpperCase()}*, do empreendimento *${(`${this.state.ContratoSelecionado.centroDeCusto.descricao}`).toUpperCase()}*, da empresa *${(`${this.state.ContratoSelecionado.empresa.nomeFantasia}`).toUpperCase()}*`)
                          }
                          else
                          {
                            PushNotification.localNotification({
                              largeIcon: 'icon',
                              smallIcon: 'icon',
                              vibrate: true,
                              vibration: 300,
                              title: 'My Broker',
                              message: `O whatsapp não pode ser acessado!`
                            })
                          }
                        }
                        else {
                          PushNotification.localNotification({
                            largeIcon: 'icon',
                            smallIcon: 'icon',
                            vibrate: true,
                            vibration: 300,
                            title: 'My Broker',
                            message: `É necessário aceitar os termos!`
                          })
                        }
                      }}>
                        <Text 
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 16,
                            textAlign: 'center',
                            color: this.props.StyleGlobal.cores.background,
                            alignSelf: 'center',
                      }}>{`Confirmar`}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        {this.state.VisibilidadeModalLoading == false && this.state.VisibilidadeModalLoadingGoBack == false && <>
        <View>
          <View 
            style = {{
              backgroundColor: this.props.StyleGlobal.cores.background, 
              minHeight: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 65 : 45,
              justifyContent: "flex-start",
              paddingTop: 30
          }}>

            {/** OPCAO SELECIONADA */}
            <View
              style = {{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'flex-start',
                borderBottomWidth: 1,
                borderColor: '#00000020',
                paddingBottom: 10
            }}>
              <Icon name = {'arrow-back'} color = {'#FFF'} size = {35} style = {{}}
                onPress = {() => {this.props.navigation.goBack()}}/>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 18,
                  textAlign: 'left',
                  color: '#FFFFFF',
                  marginLeft: 30
              }}>{this.state.OptionSelected}</Text>
            </View>
            
          </View>
          <View 
            style = {{
              maxHeight: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? Dimensions.get('window').height - 190 : Dimensions.get('window').height - 155, 
              minHeight: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? Dimensions.get('window').height - 190 : Dimensions.get('window').height - 155,
          }}>
          <ScrollView ref = {(ref) => this.ScrollViewEmpresa = ref}
            showsVerticalScrollIndicator = {false}
            pagingEnabled
            onMomentumScrollEnd = {async (e) => {}}>
              <View
                style = {{
                  minHeight: Dimensions.get('window').height - 195, 
                  borderTopWidth: 0, 
                  marginBottom: 20,
                  width: Dimensions.get('window').width,
              }}>
                <View style = {{paddingBottom: 10, width: "100%", backgroundColor: this.props.StyleGlobal.cores.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <View
                    style = {{
                      justifyContent: 'flex-start',
                      marginTop: 5
                  }}>
                    <Text
                      style = {{
                        fontStyle: 'normal',
                        fontSize: 13,
                        textAlign: 'left',
                        color: '#FFFFFF',
                        marginLeft: 30,
                      }}
                    >Loteamento</Text>
                    <Text
                      style = {{
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: 16,
                        textAlign: 'left',
                        color: '#FFFFFF',
                        marginLeft: 30,
                        paddingRight: 50
                    }}>{this.state.ContratoSelecionado != null ? this.state.ContratoSelecionado.centroDeCusto['descricao'] : ''}</Text>
                    <Text
                      style = {{
                        fontStyle: 'normal',
                        fontSize: 13,
                        textAlign: 'left',
                        color: '#FFFFFF',
                        marginLeft: 30
                    }}>Nome do contrato</Text>
                    <Text
                      style = {{
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: 16,
                        textAlign: 'left',
                        color: '#FFFFFF',
                        marginLeft: 30
                    }}>{this.state.ContratoSelecionado != null ? this.state.ContratoSelecionado.subLocal['descricao'] : ''}</Text>
                  </View>
                  <View style = {{marginRight: 15}}>
                    <Icon name = {'expand-more'} color = {'#FFF'} size = {35} onPress = {() => { this.state.expandCollapsideContratos == true ? this.setState({expandCollapsideContratos: false}) : this.setState({expandCollapsideContratos: true}) }}/>
                  </View>
                </View>
                
                <Collapsible
                  collapsed = {this.state.expandCollapsideContratos}
                  style = {{
                    backgroundColor: this.props.StyleGlobal.cores.background,
                    borderBottomColor: this.props.StyleGlobal.cores.background,
                    borderBottomWidth: 4,
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                    paddingBottom: 10
                }}>
                  {this.state.ListaDeContratos.length > 1 &&
                  <View style = {{paddingHorizontal: 30, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity
                      style = {{
                        backgroundColor: '#FFFFFF',
                        height: 45,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: "100%"
                      }}
                      activeOpacity = {0.75}
                      onPress = {async () => {
                        this.state.expandCollapsideContratos = true
                        this.setVisibilidadeModalListaLotes(true)
                      }}>
                        <Text style = {{fontWeight: 'bold'}}>Trocar Contrato</Text>
                    </TouchableOpacity>
                  </View>}
                </Collapsible>
                {this.state.OptionSelected == 'Resumo' && <>
                  <View style = {{marginTop: 10, paddingHorizontal: 30, borderBottomWidth: 2, borderBottomColor: '#00000040', paddingBottom: 10}}>
                    <Text style = {{fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: this.props.StyleGlobal.cores.background}}>Financiamento ativo</Text>
                    <Text style = {{color: '#00000080'}}>{`Valores válidos para ${moment(new Date(), true).format('DD/MM/YYYY')}`}</Text>
                  </View>
                  <View style = {{marginHorizontal: 25, padding: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderRadius: 5, borderColor: this.props.StyleGlobal.cores.background + "40"}}>
                    <View>
                      <Text style = {{fontSize: 12, marginBottom: 5, color: this.props.StyleGlobal.cores.background}}>Carnê disponível</Text>
                      <Text style = {{color: '#00000080', fontSize: 18, fontWeight: 'bold'}}>{`${parseFloat((this.state.ListaDeBoletos).filter(element => element.carteira).reduce((acumulador, boleto, index) => acumulador + boleto.titulosDoBoleto[0].principal, 0)).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`}</Text>
                    </View>
                    <View>
                      <Text style = {{fontSize: 12, marginBottom: 5, color: this.props.StyleGlobal.cores.background}}>Prestações restantes</Text>
                      <Text style = {{color: '#00000080', fontSize: 18, fontWeight: 'bold', textAlign: 'right'}}>{formatoDeTexto.NumeroInteiro(this.state.ListaDeBoletos.length)}</Text>
                    </View>
                  </View>
                  
                  <View style = {{marginHorizontal: 22}}>
                    <Text style = {{fontSize: 12, textAlign: 'center'}}>Valor sujeito a alteração.</Text>
                  </View>

                  <View style = {{marginTop: 20, marginHorizontal: 25}}>

                    <Text style = {{fontWeight: 'bold', fontSize: 18, color: this.props.StyleGlobal.cores.background}}>Próximo vencimento</Text>

                    <View style = {{ borderLeftWidth: 3, borderLeftColor: this.props.StyleGlobal.cores.background, padding: 10, marginTop: 5, flexDirection: 'column', justifyContent: 'space-between', borderWidth: 1, borderRadius: 5, borderColor: this.props.StyleGlobal.cores.background + "40"}}>
                      <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View>
                          <Text style = {{fontSize: 14, fontWeight: 'bold', color: '#00000080', textAlign: 'center'}}>{`${this.state.ListaDeBoletos.length > 0 ? moment(this.state.ListaDeBoletos[0].titulosDoBoleto[0].dataDeVencimento, true).format(`DD/MMM`).toUpperCase() : ''}`}</Text>
                        </View>
                        <View>
                          <Text style = {{fontSize: 14, fontWeight: 'bold', color: '#00000080'}}>{`${(this.state.ListaDeBoletos.length > 0 ? this.state.ListaDeBoletos[0].titulosDoBoleto[0].principal : 0).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`}</Text>
                        </View>
                      </View>
                      <View style = {{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity
                          activeOpacity = {0.75}
                          style = {{
                            height: 30,
                            backgroundColor: this.props.StyleGlobal.cores.background,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 15,
                            borderRadius: 2,
                            marginTop: 10,
                            marginRight: 5
                          }}
                          onPress = {async () => {
                            try {
                              this.setVisibilidadeModalLoading(true)
                              
                              let Response = await BoletosAPI.reimprimirBoleto(String(this.props.token[0].token), this.state.ListaDeBoletos.length > 0 ? this.state.ListaDeBoletos[this.state.ListaDeBoletos.length - 1] : {})
                              if (Math.round(Response.status / 100) == 2) {
                                  this.setState({ PDFContrato: (Response.data)[0].pdf, ItemBoleto: this.state.ListaDeBoletos.length > 0 ? this.state.ListaDeBoletos[this.state.ListaDeBoletos.length - 1] : {}, TituloPage: `Boleto - ${this.state.ListaDeBoletos[this.state.ListaDeBoletos.length - 1] != null ? this.state.ListaDeBoletos[this.state.ListaDeBoletos.length - 1].titulosDoBoleto[0].classificacao.descricao : ""} ${this.state.ListaDeBoletos[this.state.ListaDeBoletos.length - 1] != null ? this.state.ListaDeBoletos[this.state.ListaDeBoletos.length - 1].titulosDoBoleto[0].numero : ""}`})
                                  this.setVisibilidadeModalLoading(false)
                                  this.setVisibilidadeModalPDF(true)
                              } else {
                                  PushNotification.localNotification({
                                      largeIcon: 'icon',
                                      smallIcon: 'icon',
                                      vibrate: true,
                                      vibration: 300,
                                      title: 'My Broker',
                                      message: `Não foi possível imprimir o boleto, entre em contato com a equipe de desenvolvimento.`
                                  })
                              }
                          } catch {
                  
                          }
                          }}>
                          <Text style = {{fontWeight: 'bold', fontSize: 14, color: '#FFFFFF'}}>Boleto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity = {0.75}
                          style = {{
                            height: 30,
                            backgroundColor: this.props.StyleGlobal.cores.background,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 15,
                            borderRadius: 2,
                            marginTop: 10,
                            marginLeft: 5,
                          }}
                          onPress = {async () => {
                            try {
                              Toast.show({
                                type: 'success',
                                text1: 'Copiando código do boleto',
                                position: "top",
                              })
                              let Response = await BoletosAPI.reimprimirBoleto(String(this.props.token[0].token), this.state.ListaDeBoletos.length > 0 ? this.state.ListaDeBoletos[this.state.ListaDeBoletos.length - 1] : {})
                              if (Math.round(Response.status / 100) == 2) {
                                  Clipboard.setString(Response.data[0].codigoDeBarras)
                                  this.setState({CopyText: true})
                                  Toast.show({
                                    type: 'success',
                                    text1: 'Código do boleto copiado',
                                    position: "top",
                                  })
                              } else {
                                  PushNotification.localNotification({
                                      largeIcon: 'icon',
                                      smallIcon: 'icon',
                                      vibrate: true,
                                      vibration: 300,
                                      title: 'My Broker',
                                      message: `Não foi possível copiar o código de barras, entre em contato com a equipe de desenvolvimento.`
                                  })
                              }
                          } catch {
                  
                          }
                          }}>
                          <Text style = {{fontWeight: 'bold', fontSize: 14, color: '#FFFFFF'}}>Copiar código de barras</Text>
                        </TouchableOpacity>
                      </View>
                      {this.state.CopyText == true &&
                      <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                        <Text style={{color: this.props.StyleGlobal.cores.background}}>Código copiado!</Text> 
                      </View>}
                    </View>

                  </View>

                  <View style = {{marginTop: 20, marginHorizontal: 25}}>
                    <Text style = {{marginBottom: 5, fontWeight: 'bold', fontSize: 18, color: this.props.StyleGlobal.cores.background}}>Detalhes do contrato</Text>
                    
                     <View style = {{paddingHorizontal: 15, paddingVertical: 10, borderWidth: 2, borderColor: this.props.StyleGlobal.cores.background + "40", borderRadius: 5}}>
                       {this.state.ListaDeObservacoes.map(obs => (
                          <View style = {{marginBottom: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Text style = {{fontSize: 12}}>{obs.id}</Text>
                            <Text style = {{fontSize: 12}}>{obs.descricao}</Text>
                          </View>
                       ))}
                     </View>

                  </View>
                
                </>}
                
                {this.state.OptionSelected == 'Serviços' && <>
                  
                  {/** RENEGOCIACAO */}
                  <View style = {{paddingHorizontal: 20, marginTop: 20}}>
                    <TouchableOpacity 
                      style = {{
                        paddingHorizontal: 15, 
                        borderRadius: 4, 
                        width: "100%", 
                        height: 80, 
                        backgroundColor: '#FFFFFF', 
                        borderWidth: 1, 
                        borderColor: this.props.StyleGlobal.cores.background + "20",
                        borderLeftColor: this.state.expandCollapsideContratos == true ? this.props.StyleGlobal.cores.background : ("#FFFFFF00"),
                        borderLeftWidth: 5,
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        shadowColor: '#000'
                      }} 
                      onPress = { async () => {
                        this.setState({Titulo: 'solicitar uma renegociação'})
                        let supported = await  Linking.canOpenURL(`https://wa.me/5562996842423?text=Olá meu nome é *${(this.props.token[0].pessoa.nome).toUpperCase()}*, gostaria de *${`${(this.state.Titulo).toUpperCase()}`}* do meu contrato da unidade *${(`${this.state.ContratoSelecionado.subLocal['descricao']}`).toUpperCase()}*, do empreendimento *${(`${this.state.ContratoSelecionado.centroDeCusto.descricao}`).toUpperCase()}*, da empresa *${(`${this.state.ContratoSelecionado.empresa.nomeFantasia}`).toUpperCase()}*`)

                        if (supported)
                        {
                          await  Linking.openURL(`https://wa.me/5562999099934?text=Olá meu nome é *${(this.props.token[0].pessoa.nome).toUpperCase()}*, gostaria de *${`${(this.state.Titulo).toUpperCase()}`}* do meu contrato da unidade *${(`${this.state.ContratoSelecionado.subLocal['descricao']}`).toUpperCase()}*, do empreendimento *${(`${this.state.ContratoSelecionado.centroDeCusto.descricao}`).toUpperCase()}*, da empresa *${(`${this.state.ContratoSelecionado.empresa.nomeFantasia}`).toUpperCase()}*`)
                        }
                        else 
                        {
                          PushNotification.localNotification({
                            largeIcon: 'icon',
                            smallIcon: 'icon',
                            vibrate: true,
                            vibration: 300,
                            title: 'My Broker',
                            message: `Não foi possível acessar o whatsapp`
                          })
                        }
                      }}
                      activeOpacity = {1}>
                        <View style = {{flexDirection: "row", alignItems: "center"}}>
                          <Icon name = {'forum'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                          <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#000000', textAlign: 'center'}}>{'Renegociação'}</Text>
                        </View>
                        <View>
                          <Icon name = {'navigate-next'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                        </View>
                    </TouchableOpacity>
                  </View>

                  {/** CESSAO DE DIREITOS */}
                  <View style = {{paddingHorizontal: 20, marginTop: 10}}>
                    <TouchableOpacity 
                      style = {{
                        paddingHorizontal: 15, 
                        borderRadius: 4, 
                        width: "100%", 
                        height: 80, 
                        backgroundColor: '#FFFFFF', 
                        borderWidth: 1, 
                        borderColor: this.props.StyleGlobal.cores.background + "20",
                        borderLeftColor: this.state.expandCollapsideContratos == true ? this.props.StyleGlobal.cores.background : ("#FFFFFF00"),
                        borderLeftWidth: 5,
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        shadowColor: '#000'
                      }} 
                      onPress = { async () => { this.setState({Titulo: 'solicitar uma cessão de direitos', VisibilidadeModalCheckList: true}) }}
                      activeOpacity = {1}>
                        <View style = {{flexDirection: "row", alignItems: "center"}}>
                          <Icon name = {'forum'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                          <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#000000', textAlign: 'center'}}>{'Cessão de direitos'}</Text>
                        </View>
                        <View>
                          <Icon name = {'navigate-next'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                        </View>
                    </TouchableOpacity>
                  </View>

                  {/** AUTORIZACAO DE ESCRITURA */}
                  <View style = {{paddingHorizontal: 20, marginTop: 10}}>
                    <TouchableOpacity 
                      style = {{
                        paddingHorizontal: 15, 
                        borderRadius: 4, 
                        width: "100%", 
                        height: 80, 
                        backgroundColor: '#FFFFFF', 
                        borderWidth: 1, 
                        borderColor: this.props.StyleGlobal.cores.background + "20",
                        borderLeftColor: this.state.expandCollapsideContratos == true ? this.props.StyleGlobal.cores.background : ("#FFFFFF00"),
                        borderLeftWidth: 5,
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        shadowColor: '#000'
                      }} 
                      onPress = { async () => { this.setState({Titulo: 'solicitar a autorização de escritura', VisibilidadeModalCheckList: true}) }}
                      activeOpacity = {1}>
                        <View style = {{flexDirection: "row", alignItems: "center"}}>
                          <Icon name = {'description'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                          <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#000000', textAlign: 'center'}}>{`Autorização de escritura`}</Text>
                        </View>
                        <View>
                          <Icon name = {'navigate-next'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                        </View>
                    </TouchableOpacity>
                  </View>

                  {/** BOLETOS */}
                  <View style = {{paddingHorizontal: 20, marginTop: 10}}>
                    <TouchableOpacity 
                      style = {{
                        paddingHorizontal: 15, 
                        borderRadius: 4, 
                        width: "100%", 
                        height: 80, 
                        backgroundColor: '#FFFFFF', 
                        borderWidth: 1, 
                        borderColor: this.props.StyleGlobal.cores.background + "20",
                        borderLeftColor: this.state.expandCollapsideContratos == true ? this.props.StyleGlobal.cores.background : ("#FFFFFF00"),
                        borderLeftWidth: 5,
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        shadowColor: '#000'
                      }} 
                      onPress = {() => { this.setState({VisibilidadeModalBoletos: true}) }}
                      activeOpacity = {1}>
                        <View style = {{flexDirection: "row", alignItems: "center"}}>
                          <View style = {{transform: [{rotate: "90deg"}]}}>
                            <Icon name = {"line-weight"} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                          </View>
                          <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#000000', textAlign: 'center'}}>{'Boletos'}</Text>
                        </View>
                        <View>
                          <Icon name = {'navigate-next'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                        </View>
                    </TouchableOpacity>
                  </View>

                  {/** ATENDIMENTO */}
                  <View style = {{paddingHorizontal: 20, marginTop: 10}}>
                    <TouchableOpacity 
                      style = {{
                        paddingHorizontal: 15, 
                        borderRadius: 4, 
                        width: "100%", 
                        height: 80, 
                        backgroundColor: '#FFFFFF', 
                        borderWidth: 1, 
                        borderColor: this.props.StyleGlobal.cores.background + "20",
                        borderLeftColor: this.state.expandCollapsideContratos == true ? this.props.StyleGlobal.cores.background : ("#FFFFFF00"),
                        borderLeftWidth: 5,
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        shadowColor: '#000'
                      }} 
                      onPress = {async () => {
                        if(1 == 1)
                        {
                          PushNotification.localNotification({
                            largeIcon: 'icon',
                            smallIcon: 'icon',
                            vibrate: true,
                            vibration: 300,
                            title: 'My Broker',
                            message: `Funcionalidade em desenvolvimento.`
                          })
                        }
                        else
                        {
                          this.setState({Titulo: 'solicitar um atendimento referente'})
                          let supported = await  Linking.canOpenURL(`https://wa.me/5562996842423?text=Olá meu nome é *${(this.props.token[0].pessoa.nome).toUpperCase()}*, gostaria de *${`${(this.state.Titulo).toUpperCase()}`}* do meu contrato da unidade *${(`${this.state.ContratoSelecionado.subLocal['descricao']}`).toUpperCase()}*, do empreendimento *${(`${this.state.ContratoSelecionado.centroDeCusto.descricao}`).toUpperCase()}*, da empresa *${(`${this.state.ContratoSelecionado.empresa.nomeFantasia}`).toUpperCase()}*`)
  
                          if (supported)
                          {
                            await  Linking.openURL(`https://wa.me/5562996842423?text=Olá meu nome é *${(this.props.token[0].pessoa.nome).toUpperCase()}*, gostaria de *${`${(this.state.Titulo).toUpperCase()}`}* do meu contrato da unidade *${(`${this.state.ContratoSelecionado.subLocal['descricao']}`).toUpperCase()}*, do empreendimento *${(`${this.state.ContratoSelecionado.centroDeCusto.descricao}`).toUpperCase()}*, da empresa *${(`${this.state.ContratoSelecionado.empresa.nomeFantasia}`).toUpperCase()}*`)
                          }
                          else
                          {
                            PushNotification.localNotification({
                              largeIcon: 'icon',
                              smallIcon: 'icon',
                              vibrate: true,
                              vibration: 300,
                              title: 'My Broker',
                              message: `Não foi possível acessar o whatsapp.`
                            })
                          }
                        }
                      }}
                      activeOpacity = {1}>
                        <View style = {{flexDirection: "row", alignItems: "center"}}>
                          <Icon name = {'forum'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                          <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#000000', textAlign: 'center'}}>{'Atendimento'}</Text>
                        </View>
                        <View>
                          <Icon name = {'navigate-next'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                        </View>
                    </TouchableOpacity>
                  </View>

                  {/** PERGUNTAS E RESPOSTAS */}
                  <View style = {{paddingHorizontal: 20, marginTop: 10}}>
                    <TouchableOpacity 
                      style = {{
                        paddingHorizontal: 15, 
                        borderRadius: 4, 
                        width: "100%", 
                        height: 80, 
                        backgroundColor: '#FFFFFF', 
                        borderWidth: 1, 
                        borderColor: this.props.StyleGlobal.cores.background + "20",
                        borderLeftColor: this.state.expandCollapsideContratos == true ? this.props.StyleGlobal.cores.background : ("#FFFFFF00"),
                        borderLeftWidth: 5,
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        shadowColor: '#000'
                      }} 
                      onPress = {async () => {
                          PushNotification.localNotification({
                            largeIcon: 'icon',
                            smallIcon: 'icon',
                            vibrate: true,
                            vibration: 300,
                            title: 'My Broker',
                            message: `Funcionalidade em desenvolvimento.`
                          })
                      }}
                      activeOpacity = {1}>
                        <View style = {{flexDirection: "row", alignItems: "center"}}>
                          <Icon name = {'help'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                          <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#000000', textAlign: 'center'}}>{'Perguntas e respostas'}</Text>
                        </View>
                        <View>
                          <Icon name = {'navigate-next'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                        </View>
                    </TouchableOpacity>
                  </View>

                </>}

                {this.state.OptionSelected == 'Documentos' && <>

                  {/** IMPOSTO DE RENDA */}
                  <View style = {{paddingHorizontal: 20, marginTop: 20}}>
                    <TouchableOpacity 
                      style = {{
                        paddingHorizontal: 15, 
                        borderRadius: 4, 
                        width: "100%", 
                        height: 80, 
                        backgroundColor: '#FFFFFF', 
                        borderWidth: 1, 
                        borderColor: this.props.StyleGlobal.cores.background + "20",
                        borderLeftColor: this.state.expandCollapsideContratos == true ? this.props.StyleGlobal.cores.background : ("#FFFFFF00"),
                        borderLeftWidth: 5,
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        shadowColor: '#000'
                      }} 
                      onPress = {() => {
                        this.setState({VisibilidadeModalDate: true})
                      }}
                      activeOpacity = {1}>
                        <View style = {{flexDirection: "row", alignItems: "center"}}>
                          <Icon name = {'account-balance'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                          <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#000000', textAlign: 'center'}}>{'Imposto de Renda'}</Text>
                        </View>
                        <View>
                          <Icon name = {'navigate-next'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                        </View>
                    </TouchableOpacity>
                  </View>

                  {/** EXTRATOS */}
                  <View style = {{paddingHorizontal: 20, marginTop: 10}}>
                    <TouchableOpacity 
                      style = {{
                        paddingHorizontal: 15, 
                        borderRadius: 4, 
                        width: "100%", 
                        height: 80, 
                        backgroundColor: '#FFFFFF', 
                        borderWidth: 1, 
                        borderColor: this.props.StyleGlobal.cores.background + "20",
                        borderLeftColor: this.state.expandCollapsideContratos == true ? this.props.StyleGlobal.cores.background : ("#FFFFFF00"),
                        borderLeftWidth: 5,
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        shadowColor: '#000'
                      }} 
                      onPress = {async () => {
                        await this.setVisibilidadeModalLoading(true)
                        await this.getDemonstrativoDePagamentos()
                      }}
                      activeOpacity = {1}>
                        <View style = {{flexDirection: "row", alignItems: "center"}}>
                          <Icon name = {'receipt'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                          <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#000000', textAlign: 'center'}}>{'Extratos'}</Text>
                        </View>
                        <View>
                          <Icon name = {'navigate-next'} size = {35} color = {this.props.StyleGlobal.cores.background}/>
                        </View>
                    </TouchableOpacity>
                  </View>
                
                </>}
              
              </View>
          </ScrollView>
          </View>
        </View>
        <Animated.View 
          style = {{
            height: 100,
            backgroundColor: "#FFFFFF",
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 10
        }}>
          <TouchableOpacity
            activeOpacity = {1}
            style = {{
              width: '33%',
              height: 100,
              alignItems: 'center',
              justifyContent: "center",
              borderTopWidth: 2,
              borderTopColor: this.state.OptionSelected == 'Resumo' ? this.props.StyleGlobal.cores.background : '#FFFFFF'
            }}
            onPress = {() => {this.setState({OptionSelected: 'Resumo'})}}>
            <Icon name = 'home' size = {35} color = {this.state.OptionSelected == 'Resumo' ? this.props.StyleGlobal.cores.background : '#00000040'} />
            <Text
              style = {{
                fontStyle: 'normal',
                fontSize: 14,
                textAlign: 'center',
                color: this.state.OptionSelected == 'Resumo' ? this.props.StyleGlobal.cores.background : '#00000040',
                alignSelf: 'center',
            }}>Resumo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity = {1}
            style = {{
              width: '33%',
              height: 100,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: "center",
              borderTopWidth: 2,
              borderTopColor: this.state.OptionSelected == 'Serviços' ? this.props.StyleGlobal.cores.background : '#FFFFFF'
            }}
            onPress = {() => {this.setState({OptionSelected: 'Serviços'})}}>
            <Icon name = 'room-service' size = {35} color = {this.state.OptionSelected == 'Serviços' ? this.props.StyleGlobal.cores.background : '#00000040'} />
            <Text
              style = {{
                fontStyle: 'normal',
                fontSize: 14,
                textAlign: 'center',
                color: this.state.OptionSelected == 'Serviços' ? this.props.StyleGlobal.cores.background : '#00000040',
                alignSelf: 'center',
            }}>Serviços</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity = {1}
            style = {{
              width: '33%',
              height: 100,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: "center",
              borderTopWidth: 2,
              borderTopColor: this.state.OptionSelected == 'Documentos' ? this.props.StyleGlobal.cores.background : '#FFFFFF'
            }}
            onPress = {() => {this.setState({OptionSelected: 'Documentos'})}}>
            <Icon name = 'description' size = {35} color = {this.state.OptionSelected == 'Documentos' ? this.props.StyleGlobal.cores.background : '#00000040'} />
            <Text
              style = {{
                fontStyle: 'normal',
                fontSize: 14,
                textAlign: 'center',
                color: this.state.OptionSelected == 'Documentos' ? this.props.StyleGlobal.cores.background : '#00000040',
                alignSelf: 'center',
            }}>Documentos</Text>
          </TouchableOpacity>
        </Animated.View>
        </>}
        <Toast/>
      </Container>
    );
  }
  //#endregion

  //#region Controller

  //#region GET informe de rendimentos
  getInformeDeRendimentos = async () => {
    try {
      console.log(this.props.token[0].token, this.state.ContratoSelecionado.empresa.id, this.state.ContratoSelecionado.centroDeCusto.sigla, parseInt(this.state.selectedYear))
      let Response = await Vendas.gerarInformeDeRendimento(this.props.token[0].token, this.state.ContratoSelecionado.empresa.id, this.state.ContratoSelecionado.centroDeCusto.sigla, parseInt(this.state.selectedYear))
      console.log("gerarInformeDeRendimento", Response)
      if(Response != null && Response != undefined && Response != "")
      {
        if (Response.arquivo != "") {
          await this.setState({PDFContrato: Response.arquivo, PDFDescricaoDoContrato: Response.descricao, PDFExtensao: Response.extensao});
          await this.setVisibilidadeModalLoading(false);
          await this.setVisibilidadeModalPDF(true)
        }
        else {

          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Não consta rendimentos no ano ${this.state.selectedYear}, selecione outro ano.`
          })
    
          this.setVisibilidadeModalLoading(false)
          this.setState({VisibilidadeModalDate: true})
        }

      }

    }
    catch {
      
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Não foi possível acessar os informes de rendimento, selecione outro ano ou entre em contato com a equipe de desenvolvimento.`
      })

      this.setVisibilidadeModalLoading(false)
      this.setState({VisibilidadeModalDate: true})

    }
  }
  //#endregion
  
  //#region GET demonstrativo de pagamentos
  getDemonstrativoDePagamentos = async () => {
    try {
      console.log(this.props.token[0].token, this.state.ContratoSelecionado.empresa.id, this.state.ContratoSelecionado.centroDeCusto.sigla, this.state.ContratoSelecionado.local['id'], this.state.ContratoSelecionado.subLocal['id'])
      let Response = await Vendas.gerarDemonstrativoDePagamento(this.props.token[0].token, this.state.ContratoSelecionado.empresa.id, this.state.ContratoSelecionado.centroDeCusto.sigla, this.state.ContratoSelecionado.local['id'], this.state.ContratoSelecionado.subLocal['id'])
      console.log("gerarDemonstrativoDePagamento", Response)
      if(Response != null && Response != undefined && Response != "")
      {
        await this.setState({PDFContrato: Response.arquivo, PDFDescricaoDoContrato: Response.descricao, PDFExtensao: Response.extensao, TituloPage: `Demonstrativo pagamentos`});
        await this.setVisibilidadeModalLoading(false);
        this.setVisibilidadeModalPDF(true)
      }
    }
    catch {
      
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Não foi possível acessar os informes de pagamentos, entre em contato com a equipe de desenvolvimento.`
      })

      await this.setVisibilidadeModalLoading(false)
      await this.setVisibilidadeModalListaLotes(true)

      this.props.navigation.goBack()

    }
  }
  //#endregion

  //#region Pegando lista de empreendimentos no Banco de dados
  pegandoListaDeEmpreendimentos = async () => {
    try {

      const response = await CentroDeCusto.grupoDeEmpresas(this.props.token[0].token, this.props.EmpresaLogada[0], 'VENDA')
      if(response != null && response != undefined) 
      {
        this.state.Empreendimentos = response
        await this.setVisibilidadeModalLoadingGoBack(false)
      }
      
    } catch(err) {
        await this.setVisibilidadeModalLoadingGoBack(false)
        await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando todos os dados referentes a uma unidade
  pegandoDadosDoContrato = async () => {
    let ResponseListaBoletos = await BoletosAPI.consultaBoletosEmitidos(String(this.props.token[0].token), this.props.Contratos[0].ContratoSelecionado.empresa.id ?? 24, this.props.Contratos[0].ContratoSelecionado.centroDeCusto.sigla, this.props.Contratos[0].ContratoSelecionado.local['id'], this.props.Contratos[0].ContratoSelecionado.subLocal['id'])

    if (ResponseListaBoletos != null && ResponseListaBoletos != undefined) 
    {
      this.setState({ListaDeBoletos: ResponseListaBoletos})

      let ListaDeObservacoes = []
      this.props.Contratos[0].ContratoSelecionado.observacoes.map(obs => {
        let Obser = obs.split(':');
  
        ListaDeObservacoes.push({
          id: Obser[0],
          descricao: Obser[1]
        })
      })

      this.state.Years = [];
      
      for (var i = 1990; i < (new Date).getFullYear(); i++)
      {

        this.state.Years.push({
          "id": String(this.state.Years.length),
          "descricao": i
        })

      }
      
      this.state.Years.reverse();
  
      this.setState({ListaDeObservacoes: ListaDeObservacoes, ContratoSelecionado: this.props.Contratos[0].ContratoSelecionado, ListaDeContratos: this.props.Contratos[1].ListaDeContratos})

      this.setVisibilidadeModalLoadingGoBack(false)
    }
  }
  //#endregion

  //#region Pegando todos os dados referentes a uma unidade da lista de troca
  pegandoDadosDoContratoPelaTroca = async (item) => {
    let ResponseListaBoletos = await BoletosAPI.consultaBoletosEmitidos(String(this.props.token[0].token), item.empresa.id, item.centroDeCusto.sigla, item.local['id'], item.subLocal['id'])
    
    if (ResponseListaBoletos != null && ResponseListaBoletos != undefined) 
    {
      this.setState({ListaDeBoletos: ResponseListaBoletos})

      let ListaDeObservacoes = []

      item.observacoes.map(obs => {
        let Obser = obs.split(':');
  
        ListaDeObservacoes.push({
          id: Obser[0],
          descricao: Obser[1]
        })
      })
  
      this.setState({ListaDeObservacoes: ListaDeObservacoes, ContratoSelecionado: item, ListaDeContratos: this.props.Contratos[1].ListaDeContratos})

      this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

  //#region Setando a visibilidade da modal de PDF
  setVisibilidadeModalPDF(value) {
    this.setState({ VisibilidadeModalPDF: value })
  }
  //#endregion

  //#region Filtrando a lista de empreendimento
  searchUpdateEmpreendimento(term) {
    this.setState({searchTermEmpreendimentos: term})
  }
  //#endregion

  //#region Setando a visibilidade da modal de empreendimento
  setVisibilidadeModalEmpreendimento(value) {
    this.setState({VisibilidadeModalEmpreendimento: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeModalLoading(value) {
    this.setState({VisibilidadeModalLoading: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading go back
  setVisibilidadeModalLoadingGoBack(value) {
    this.setState({VisibilidadeModalLoadingGoBack: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de lista de lotes
  setVisibilidadeModalListaLotes(value) {
    this.setState({ VisibilidadeModalListaLotes: value })
  }
  //#endregion

  //#region Renderizando lista de empreendimento
  renderEmpreendimentos = ({ item }) => (
    <TouchableOpacity key = {item.sigla} style = {{marginHorizontal: 8}} activeOpacity = {0.5}
      onPress = {async () => {
        if(this.state.Empreendimento != item.sigla) {
          
          this.state.Empreendimento = item.sigla
          this.state.Empreendimento_descricao = item.descricao
          this.state.EmpresaId = item.empresa.id
          this.state.Empresa_nomeFantasia = item.empresa.nomeFantasia
          
          await this.setState({Renderizar: true})

          await this.animacaoButton();
        
        } else {}
    }}>
      <View 
        style = {{
          backgroundColor: item.sigla == this.state.Empreendimento ? this.props.StyleGlobal.cores.background : '#FFFFFF',
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
            fontSize: 13,
            color: item.sigla == this.state.Empreendimento ? '#FFFFFF' : '#262825',
            fontWeight: item.sigla == this.state.Empreendimento ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>
    </TouchableOpacity>
  );
  //#endregion

  //#region Renderizando lista de unidades disponiveis
  renderItem = ({ item, index }) => item.indice != -1 && (
    <>
      <View 
        style={{
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 16,
            width: '100%',
            height: 100,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: 'rgba(16, 22, 26, 0.15)',
            marginVertical: 5,
            justifyContent: "center",
        }}>
          <TouchableOpacity activeOpacity={1} onPress={async () => {}}>
              <View style={{ width: '100%' }}>
                  <View style={{ width: '100%', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Text style={{ fontSize: 12, fontStyle: 'normal', fontWeight: 'bold', color: '#262825', flexWrap: 'wrap'}}> {(item.subLocal['descricao'] != "" || item.subLocal['descricao'] != null) ? item.subLocal['descricao'] : ""} </Text>
                  </View>
                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                      <View style={{ marginRight: 30 }} > 
                          {item.area != '' && item.area != null && <Text style={{ fontSize: 10, fontStyle: 'normal', fontWeight: 'normal', color: '#8F998F' }} numberOfLines={1} ellipsizeMode={'tail'} > Área: {(item.area != "" && item.area != null) ? item.area : ""}m² </Text>} 
                          {item.valorAVista != '' && item.valorAVista != null && <Text style = {{ fontSize: 10, fontStyle: 'normal', fontWeight: 'normal', color: '#8F998F' }} numberOfLines={1} ellipsizeMode={'tail'} > Valor a vista: {(item.valorAVista != "" && item.valorAVista != null) ? formatoDeTexto.FormatarTexto((item.valorAVista)) : ""} </Text>} 
                          {item.intermediacao != '' && item.intermediacao != null && <Text style = {{ fontSize: 10, fontStyle: 'normal', fontWeight: 'normal', color: '#8F998F' }} numberOfLines={1} ellipsizeMode={'tail'} > Intermediação: {(item.intermediacao != "" && item.intermediacao != null) ? formatoDeTexto.FormatarTexto((item.intermediacao)) : ""} </Text>}
                      </View>
                      <View style = {{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 10 }}>
                          <TouchableOpacity
                              disabled = {false}
                              style = {{
                                  paddingVertical: 6,
                                  paddingHorizontal: 10,
                                  backgroundColor: this.props.StyleGlobal.cores.background,
                                  flexDirection: 'row',
                                  borderWidth: 1,
                                  borderColor: this.props.StyleGlobal.cores.background,
                                  borderRadius: 5,
                              }}
                              onPress = {async () => {
                                  await this.setVisibilidadeModalListaLotes(false);
                                  await this.setVisibilidadeModalLoading(true);
                                  await this.pegandoDadosDoContratoPelaTroca(item);
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
                                  }}>Selecione</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </View>
          </TouchableOpacity>
      </View>
    </>
  );
  //#endregion
  
  //#region Renderização a lista de boletos
  renderItemBoletos = ({ item, index }) => (
    <>
      <View style = {{ height: 60, borderLeftWidth: 3, borderLeftColor: this.props.StyleGlobal.cores.background, padding: 10, marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 5, borderColor: this.props.StyleGlobal.cores.background + "40"}}>
        <View>
          <Text style = {{fontSize: 14, fontWeight: 'bold', color: '#00000080', textAlign: 'center'}}>{`${moment(item.titulosDoBoleto[0].dataDeVencimento, true).format(`DD/MMM`).toUpperCase()}`}</Text>
        </View>
        <View>
          <Text style = {{fontSize: 14, fontWeight: 'bold', color: '#00000080'}}>{`${(item.titulosDoBoleto[0].principal).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`}</Text>
        </View>
        <TouchableOpacity
          activeOpacity = {0.75}
          style = {{
            height: 30,
            backgroundColor: this.props.StyleGlobal.cores.background,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 15,
            borderRadius: 2,
          }}
          onPress = {async () => {
            await this.setState({VisibilidadeModalBoletos: false})
            await this.reimprimirBoleto(item) 
          }}>
          <Text style = {{fontWeight: 'bold', fontSize: 14, color: '#FFFFFF'}}>Boleto</Text>
        </TouchableOpacity>
      </View>
    </>
  );
  //#endregion

  //#region Filtrando unidades
  searchUpdateUnidades = async (Term) => {
    this.setState({ searchTermUnidades: Term })
    if (Term == '') {
        
    } else {
        
    }
  }
  //#endregion

  //#region Filtrando anos
  searchUpdateYears(Term) {
    this.setState({searchTermYears: Term})
  }
  //#endregion

  //#region Acessando tela de Tabela de preços
  acessandoProximaTela = async () => {
    const { addToEmpresaCentroDeCusto } = this.props;
    addToEmpresaCentroDeCusto({empresa : this.state.EmpresaId}, {centrodecusto: this.state.Empreendimento});

    const navegar = this.props.navigation.getParam('Empreendimento', 'null')
    if(navegar != null && navegar != 'null')
    {
      return navegar.onConfirm()
    }
  }
  //#endregion

  //#region Animacao no botão confirmar
  animacaoButton = async () => {
    Animated.parallel([
      Animated.timing(this.state.opacityButton, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.translateYButton, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      })
    ]).start()
  }
  //#endregion

  //#region Acessando a tela para autorização de escritura
  acessandoTelaDeAutorizacaoDeEscritura = async () => {
    
    const Informativos = {titleMensagem: 'solicitar a autorização de escritura', termos: true, onConfirm: () => {}}

    const Empreendimento = {titleMensagem: 'solicitar a autorização de escritura', onConfirm: () => {this.props.navigation.navigate('Informativos', {Informativos: Informativos})}}

    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})
  }
  //#endregion

  //#region Acessando a tela de renegociacao
  acessandoTelaDeRenegociacao = async () => {

    const Informativos = {titleMensagem: 'solicitar uma renegociação', termos: false, onConfirm: () => {}}

    const Empreendimento = {titleMensagem: 'solicitar uma renegociação', onConfirm: () => {this.props.navigation.navigate('Informativos', {Informativos: Informativos})}}

    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})

  }
  //#endregion

  //#region Acessando a tela de cessao de direitos
  acessandoTelaDeCessaoDeDireitos = async () => {

    const Informativos = {titleMensagem: 'solicitar uma cessão de direitos', termos: true,  onConfirm: () => {}}

    const Empreendimento = {titleMensagem: 'solicitar uma cessão de direitos', onConfirm: () => {this.props.navigation.navigate('Informativos', {Informativos: Informativos})}}

    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})

  }
  //#endregion

  //#region Acessando a tela de boletos
  acessandoTelaDeBoletos = async () => {

    const Boletos = {title: '', onConfirm: () => {}}

    const Empreendimento = {title: '', onConfirm: () => {this.props.navigation.navigate('Boletos')}}
  
    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})
  }
  //#endregion

  //#region Acessando a tela de demonstrativo de pagamento
  acessandoTelaDeDemonstrativoDePagamento = async () => {

    const Demonstrativo = {title: `Dem. de pagamentos`, onConfirm: () => {}}

    const Empreendimento = {title: `Dem. de pagamentos`, onConfirm: () => {this.props.navigation.navigate('DemonstrativoIR', {Demonstrativo: Demonstrativo})}}
   
    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})

  }
  //#endregion

  //#region Acessando a tela de demonstrativo de imposto de renda
  acessandoTelaDeDemonstrativoDeImpostoDeRenda = async () => {
    
    const Demonstrativo = {title: `Informe de rendimentos de ${(new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())).getFullYear()}`, onConfirm: () => {}}

    const Empreendimento = {title: `Informe de rendimentos de ${(new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())).getFullYear()}`, onConfirm: () => {this.props.navigation.navigate('DemonstrativoIR', {Demonstrativo: Demonstrativo})}}
    
    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})

  }
  //#endregion

  //#region Reimprimir o boleto
  reimprimirBoleto = async (item) => {
    try {
        await this.setVisibilidadeModalLoading(true)
        let Response = await BoletosAPI.reimprimirBoleto(String(this.props.token[0].token), item)
        if (Math.round(Response.status / 100) == 2) {
            await this.setState({ PDFContrato: (Response.data)[0].pdf, ItemBoleto: item, TituloPage: `Boleto - ${item != null ? item.titulosDoBoleto[0].classificacao.descricao : ""} ${item != null ? item.titulosDoBoleto[0].numero : ""}` })
            await this.setVisibilidadeModalLoading(false)
            await this.setVisibilidadeModalPDF(true)
        } else {
            PushNotification.localNotification({
                largeIcon: 'icon',
                smallIcon: 'icon',
                vibrate: true,
                vibration: 300,
                title: 'My Broker',
                message: `Não foi possível imprimir o boleto, entre em contato com a equipe de desenvolvimento.`
            })
        }
    } catch {

    }
  }
  //#endregion

  //#endregion

}

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  tela: String(state.telaAtual),
  ConfigCss: state.configcssApp,
  StyleGlobal: state.StyleGlobal,
  EmpresaLogada: state.EmpresaLogada,
  Contratos: state.dadosContratos
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({...DadosEmpreendimentoActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OpcoesContratos);