//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Keyboard, View, Text, Animated, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Modal, TextInput, Linking, Platform, ActionSheetIOS } from 'react-native';
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
import moment from 'moment';
import fetch_blob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';
import RNShareFile from 'react-native-share-pdf';
import PDFView from 'react-native-view-pdf';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Chaves de filtragem
const KEYS_TO_FILTERS_LOTES = ['subLocal.descricao']
const KEYS_TO_FILTERS_YEARS = ['descricao'];
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Identificador, TabelaDeVendas, Vendas } from "../../../services";
//#endregion

//#region Redux
import { DadosLeadActions, TelaAtualActions, DadosIntermediacaoActions, DadosCorretagemActions, DadosFinanciamentoActions, LotesActions, TabelaDeVendasActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
//#endregion

//#region Componentes
import { Container } from '../../../components';
import { ModalListaLotes, ModalLoading, ModalReservaConfirmada } from '../../Modais';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
//#endregion

//#endregion

class DemonstrativoIR extends Component {

  //#region Funcoes do componente
  componentDidMount = async () => {

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

    const navegar = await this.props.navigation.getParam('Demonstrativo', 'null')
    await this.setState({TituloPage: navegar.title})
    if (this.state.TituloPage.includes("pagamentos"))
    {
      await this.setVisibilidadeModalLoading(true);
      await this.pegandoListaDeUnidades();
    }
    else
    {

      this.state.Years = [];
      
      for (var i = 1990; i < (new Date).getFullYear(); i++)
      {

        this.state.Years.push({
          "id": String(this.state.Years.length),
          "descricao": i
        })

      }
      
      this.state.Years.reverse();

      await this.setState({VisibilidadeModalDate: true})
    }
  }
  //#endregion

  //#region Model
  state = {
    Years: [],
    selectedYear: null,
    DadosParcelamento: [
      {
        'id': 0,
        'numparcelas': 180,
        'valorparcela': 'R$ 637,96',
        'total': 'R$ 114.832,04'
      },
      {
        'id': 1,
        'numparcelas': 120,
        'valorparcela': 'R$ 839,31',
        'total': 'R$ 100.717,80'
      },
      {
        'id': 2,
        'numparcelas': 60,
        'valorparcela': 'R$ 1.461,56',
        'total': 'R$ 87.693,59'
      },
      {
        'id': 3,
        'numparcelas': 36,
        'valorparcela': 'R$ 2.299,90',
        'total': 'R$ 82.796,34'
      },
      {
        'id': 4,
        'numparcelas': 24,
        'valorparcela': 'R$ 3.350,64',
        'total': 'R$ 80.415,32'
      },
      {
        'id': 5,
        'numparcelas': 12,
        'valorparcela': 'R$ 6.300,00',
        'total': 'R$ 75.600,00'
      },      
    ],
    VisibilidadeModalListaLotes: false,
    VisibilidadeModalLoading: false,
    VisiblidadeModalReservaConfirmada: false,
    VisibilidadeModalDateTimePicker: false,
    VisibilidadeModalDate: false,
    ListaUnidades: [],
    ListaOriginal: [],
    ListaExibida: [],
    ListaFiltrada: [],
    TituloPage: '',
    DadosRecebidos: [],
    PDFContrato: "",
    PDFDescricaoDoContrato: "",
    PDFExtensao: "",
    NomeDaUnidade: null,
    Local: null,
    SubLocal: null,
    quantItem: 20,
    distanceEnd: null,
    distanceEndInitial: null,
    loadMore: false,
    TermUnidades: '',
    searchTermUnidades: '',
    searchTermYears: '',
    identificador: [],
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
    ID: "",
    DataImpostoDeRenda: null
  };
  //#endregion

  //#region View
  render() {

    const filteredYears = this.state.Years.filter(createFilter(this.state.searchTermYears, KEYS_TO_FILTERS_YEARS))

    return (
      <Container
        style = {{
          paddingBottom: 0,
          justifyContent: 'space-between', 
          backgroundColor: '#FFFFFF' 
      }}>
        <Modal 
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
                <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40}
                  onPress = {async () => {
                    await this.props.navigation.goBack()
                }}/>
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
        <ModalListaLotes 
          visibilidade = {this.state.VisibilidadeModalListaLotes}
          keyExtractorFlatList = {item => item.id}
          colorlotes = {this.props.StyleGlobal.cores.background}
          renderEmpreendimento = {this.renderItem}
          filteredEmpreendimento = {this.state.ListaExibida}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onChangeSearch = {(term) => {this.searchUpdateUnidades(term)}}
          onPressVisibilidade = {() => {
            this.setVisibilidadeModalListaLotes(false)
            this.props.navigation.goBack()
          }}
          onScroll = {(e) => {
            if ((e.nativeEvent.contentOffset.y >= this.state.distanceEnd) && this.state.loadMore == false) {
              this.setState({isLoadingFooter: true})
              this.carregandoMaisUnidadesParaLista()
              this.state.distanceEnd = e.nativeEvent.contentOffset.y + this.state.distanceEndInitial
            }
          }}
          onlayout = {async (e) => {await this.setState({distanceEnd: e.nativeEvent.layout.height, distanceEndInitial: e.nativeEvent.layout.height})}}
        />
        <ModalReservaConfirmada 
          visibilidade = {this.state.VisiblidadeModalReservaConfirmada}
          onPressIcon = {() => {this.setVisibilidadeModalReservaConfirmada(false)}}
          onPressReservarNovoLote = {async () => {
            await this.setVisibilidadeModalReservaConfirmada(false)
            await this.setVisibilidadeModalLoading(true)
            await this.pegandoListaDeUnidades()
          }}
          onPressObrigado = {() => {this.props.navigation.navigate('Menu')}}
        />
        <ModalLoading visibilidade = {this.state.VisibilidadeModalLoading} onPress = {() => {this.props.navigation.goBack()}}/>
        {this.state.VisibilidadeModalLoading == false && this.state.PDFContrato != "" &&
        <>
          <View>
            <View 
              style = {{
                backgroundColor: this.props.StyleGlobal.cores.background,
                height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
                justifyContent: "center"
            }}>
              <View
                style = {{
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  width: '100%', 
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Icon name = {'keyboard-arrow-left'} color = {'#FFFFFF'} size = {40} style = {{}}
                onPress = {() => {
                  if (this.state.TituloPage.includes("pagamentos"))
                  {
                    this.setVisibilidadeModalListaLotes(true)
                  }
                  else
                  {
                    this.setState({VisibilidadeModalDate: true})
                  } 
                }}/>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#FFFFFF'
                }}>{this.state.TituloPage}</Text>
                <Icon 
                  style = {{ marginRight: 10 }}
                  name = 'share'
                  size = {30} 
                  color = {'#FFFFFF'}
                  onPress = { async () => { const showError = await RNShareFile.sharePDF(this.state.PDFContrato, `${this.state.PDFDescricaoDoContrato}.${this.state.PDFExtensao}`) }}
                />
              </View>
            </View>
          </View>
          <PDFView
            fadeInDuration = {250}
            style = {{ flex: 1 }}
            resource = {this.state.PDFContrato}
            resourceType = {"base64"}
            onLoad = {() => {}}
            onError = {() => {}}
          />
        </>}
      </Container>
    );
  }
  //#endregion

  //#region Controller
   
  //#region GET informe de rendimentos
  getInformeDeRendimentos = async () => {
    try {

      let Response = await Vendas.gerarInformeDeRendimento(this.props.token[0].token, this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, parseInt(this.state.selectedYear))
      if(Response != null && Response != undefined && Response != "")
      {
        if (Response.arquivo != "") {
          await this.setState({PDFContrato: Response.arquivo, PDFDescricaoDoContrato: Response.descricao, PDFExtensao: Response.extensao});
          await this.setVisibilidadeModalLoading(false);
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
      let Response = await Vendas.gerarDemonstrativoDePagamento(this.props.token[0].token, this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, parseInt(this.state.Local), parseInt(this.state.SubLocal))
      if(Response != null && Response != undefined && Response != "")
      {
        await this.setState({PDFContrato: Response.arquivo, PDFDescricaoDoContrato: Response.descricao, PDFExtensao: Response.extensao});
        await this.setVisibilidadeModalLoading(false);
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

  //#region Setando a visibilidade da modal de confirmação de dados
  setVisibilidadeModalConfirmarDados(value) {
    this.setState({VisibilidadeModalConfirmarDados: value})
  }
  //#endregion
  
  //#region Setando a visibilidade da modal de reserva confirmada
  setVisibilidadeModalReservaConfirmada(value) {
    this.setState({VisiblidadeModalReservaConfirmada: value})
  }
  //#endregion

  //#region Pegando a lista de unidades no Banco de dados
  pegandoListaDeUnidades = async () => {
    let Response = await Identificador.consulta(this.props.token[0].token, this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    
    if(Response != null && Response != undefined) 
    {
      this.state.ListaUnidades = Response
      const Lista = this.state.ListaUnidades
      this.state.ListaUnidades = Lista
      this.state.ListaOriginal = Lista
      this.state.ListaFiltrada = Lista
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
      if((this.state.DadosRecebidos != "") && (this.state.DadosRecebidos.filter(lotes => (lotes.id != -1 && lotes.status != 2)) == "")) {
        await this.setState({value: true});
      }
      await this.setVisibilidadeModalLoading(false)
      await this.setVisibilidadeModalListaLotes(true)
    }
    else if (Response == null || Response.length == 0) {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Não há unidades disponíveis, caso contrário, entre em contato com a equipe de desenvolvimento.`
      })
      await this.setVisibilidadeModalLoading(false)
      await this.props.navigation.goBack()
    }
    else
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Não há unidades disponíveis, caso contrário, entre em contato com a equipe de desenvolvimento.`
      })
      await this.setVisibilidadeModalLoading(false)
      await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Setando a visibilidade da modal de lista de lotes
  setVisibilidadeModalListaLotes(value) {
    this.setState({VisibilidadeModalListaLotes: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeModalLoading(value) {
    this.setState({VisibilidadeModalLoading: value})
  }
  //#endregion

  //#region Renderizando lista de unidades disponiveis
  renderItem = ({ item, index }) => item.indice != -1 && (
    <>
      <View
        style = {[{
          backgroundColor: item.status == 2 ? '#CCCCCC50' : '#FFFFFF',
          paddingHorizontal: 16,
          width: '100%',
          height: 100,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: 'rgba(16, 22, 26, 0.15)',
          marginVertical: 5,
          justifyContent: "center",
      }
    ]}>
      <TouchableOpacity activeOpacity = {1}
        onPress = {async () => {}}>
        <View
          style ={{
            width: '100%',
        }}>
          <View
            style = {{
              width: '100%', 
              flexDirection: 'column', 
              alignItems: 'flex-start',
          }}>
            <Text
              style = {{
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 'bold',
                color: '#262825',
                flexWrap: 'wrap'
            }}>{(item.subLocal['descricao'] != "" || item.subLocal['descricao'] != null) ? item.subLocal['descricao'] : ""}</Text>
          </View>
          <View
            style = {{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: 5,
          }}>
            <View style = {{marginRight: 30}}>
              {item.area != '' && item.area != null &&
              <Text
                style = {{
                  fontSize: 10,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#8F998F',
                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Área: {(item.area != "" && item.area != null) ? item.area : ""} m²</Text>}
              {item.valorAVista != '' && item.valorAVista != null &&
              <Text
                style = {{
                  fontSize: 10,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#8F998F',
                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor a vista: {(item.valorAVista != "" && item.valorAVista != null) ? formatoDeTexto.FormatarTexto((item.valorAVista)) : ""}</Text>}
              {item.intermediacao != '' && item.intermediacao != null &&
              <Text
                style = {{
                  fontSize: 10,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#8F998F',
                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Intermediação: {(item.intermediacao != "" && item.intermediacao != null) ? formatoDeTexto.FormatarTexto((item.intermediacao)) : ""}</Text>}
            </View>
            <View 
              style = {{
                flexDirection: 'row',
                justifyContent: 'flex-end', 
                alignItems: 'center',
                paddingRight: 10
              }}>
              {false &&
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

                }}>
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
              }}>Reservar</Text>
              </TouchableOpacity>}
              <TouchableOpacity
                disabled = {false}
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
                onPress = {async () => {
                  this.state.NomeDaUnidade = item.subLocal['descricao']
                  this.state.Local = item.local['id']
                  this.state.SubLocal = item.subLocal['id']
                  await this.setVisibilidadeModalListaLotes(false)
                  await this.setVisibilidadeModalLoading(true)
                  await this.getDemonstrativoDePagamentos()
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
 
  //#region Filtrando unidades
  searchUpdateUnidades = async (Term) => {
    await this.setState({searchTermUnidades: Term})
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
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(createFilter(this.state.searchTermUnidades, KEYS_TO_FILTERS_LOTES))
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

  //#region Filtrando anos
  searchUpdateYears(Term) {
    this.setState({searchTermYears: Term})
  }
  //#endregion

  //#region Carregando mais unidades para a lista
  carregandoMaisUnidadesParaLista = async () => {
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

  //#region Pegando a tabela de preços de uma unidade em especifico no banco de dados
  pegandoTabelaDePrecos = async () => {
    const response = await TabelaDeVendas.consulta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, this.state.Local, this.state.SubLocal)
    if(response != null && response != undefined) 
    {
      const tabela = response
      const titulosDaTabelaDeVendas = tabela.classificacoesDosTitulosDaTabelaDeVenda
      for(var i = 0; i < titulosDaTabelaDeVendas.length; i++) {
        if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Corretagem') {
            await this.setState({tabelaCorretagemExiste: true, tabelaCorretagem: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
        } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Intermediação') {
            await this.setState({tabelaIntermediacaoExiste: true, tabelaIntermediacao: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
        } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Parcela') {
            await this.setState({tabelaFinaciamentoExiste: true, tabelaFinanciamento: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda, tabelaFinanciamenteOriginal: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda, primeiroVencimentoFinanciamento: (titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda[0].primeiroVencimento).replace('T00:00:00', '')})
        } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Entrada') {
            await this.setState({tabelaEntradasExiste: true, tabelaEntradas: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
        } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Intermediaria') {
          await this.setState({tabelaIntermediariasExiste: true, tabelaIntermediarias: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
        }
      }
      if(await this.state.tabelaCorretagemExiste == true) {
        const positionCorretagem = (this.state.tabelaCorretagem).length - 1;
        await this.setState({valorCorretagem: this.state.tabelaCorretagem[positionCorretagem].valorTotal, IdCorretagem: this.state.tabelaCorretagem[positionCorretagem].qtdeDeTitulos})
      }
      if(await this.state.tabelaIntermediacaoExiste == true) {
        const positionIntermediacao = (this.state.tabelaIntermediacao).length - 1;
        await this.setState({valorImobiliaria: this.state.tabelaIntermediacao[positionIntermediacao].valorTotal, IdIntermediacao: this.state.tabelaIntermediacao[positionIntermediacao].qtdeDeTitulos})
      }
      if(await this.state.tabelaFinaciamentoExiste == true) {
        const positionFinanciamento = (this.state.tabelaFinanciamento).length - 1;
        await this.setState({valorFinancimento: this.state.tabelaFinanciamento[positionFinanciamento].valorTotal, IdFinanciamento: this.state.tabelaFinanciamento[positionFinanciamento].qtdeDeTitulos, valorParcelaDoFinancimento: this.state.tabelaFinanciamento[positionFinanciamento].principal})
        const position = 0;
        for(var i = 0; i <= positionFinanciamento; i++) {
          const proximaposition = position + i;
          if(this.state.tabelaFinanciamento[i].jurosDeTabela >= this.state.tabelaFinanciamento[proximaposition].jurosDeTabela)
          {
            await this.setState({juros: this.state.tabelaFinanciamento[i].jurosDeTabela})
          }
        }
      }
      if(await this.state.tabelaEntradasExiste == true) {
        const positionEntradas = (this.state.tabelaEntradas).length - 1;
        await this.setState({valorDasEntradas: this.state.tabelaEntradas[positionEntradas].valorTotal, IdEntradas: this.state.tabelaEntradas[positionEntradas].qtdeDeTitulos})
      }
      if(await this.state.tabelaIntermediariasExiste == true) {
        const positionIntermediarias = (this.state.tabelaIntermediarias).length - 1;
        await this.setState({valorDasIntermediarias: this.state.tabelaIntermediarias[positionIntermediarias].valorTotal, IdIntermediarias: this.state.tabelaIntermediarias[positionIntermediarias].qtdeDeTitulos})
      }
      await this.setState({identificador: tabela.identificador})
      await this.setState({tabelaCompleta: tabela, dadosLote: this.state.identificador.subLocal, numeroDaTabelaDeVenda: tabela.numero})
      await this.setVisibilidadeModalLoading(false)
      await this.setVisibilidadeModalListaLotes(false)
    }
    else 
    {
      await this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

  //#region Carregando os dados da tabela de venda do lote escolhido
  carregandoDadosDoLote = async () => {
    const Lote = await this.props.navigation.getParam('Lote', 'null');
    const local = await this.props.navigation.getParam('local', 'null');
    const sublocal = await this.props.navigation.getParam('subLocal', 'null')
    const tabela = await this.props.navigation.getParam('TabelaDeVendas', 'null');
    const titulosDaTabelaDeVendas = tabela.classificacoesDosTitulosDaTabelaDeVenda
    for(var i = 0; i < titulosDaTabelaDeVendas.length; i++) {
      if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Corretagem') {
          await this.setState({tabelaCorretagemExiste: true, tabelaCorretagem: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
      } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Intermediação') {
          await this.setState({tabelaIntermediacaoExiste: true, tabelaIntermediacao: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
      } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Parcela') {
          await this.setState({tabelaFinaciamentoExiste: true, tabelaFinanciamento: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda, tabelaFinanciamenteOriginal: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda, primeiroVencimentoFinanciamento: (titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda[0].primeiroVencimento).replace('T00:00:00', '')})
      } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Entrada') {
          await this.setState({tabelaEntradasExiste: true, tabelaEntradas: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
      } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Intermediaria') {
         await this.setState({tabelaIntermediariasExiste: true, tabelaIntermediarias: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
      }
    }
    if(await this.state.tabelaCorretagemExiste == true) {
      const positionCorretagem = (this.state.tabelaCorretagem).length - 1;
      await this.setState({valorCorretagem: this.state.tabelaCorretagem[positionCorretagem].valorTotal, IdCorretagem: this.state.tabelaCorretagem[positionCorretagem].qtdeDeTitulos})
    }
    if(await this.state.tabelaIntermediacaoExiste == true) {
      const positionIntermediacao = (this.state.tabelaIntermediacao).length - 1;
      await this.setState({valorImobiliaria: this.state.tabelaIntermediacao[positionIntermediacao].valorTotal, IdIntermediacao: this.state.tabelaIntermediacao[positionIntermediacao].qtdeDeTitulos})
    }
    if(await this.state.tabelaFinaciamentoExiste == true) {
      const positionFinanciamento = (this.state.tabelaFinanciamento).length - 1;
      await this.setState({valorFinancimento: this.state.tabelaFinanciamento[positionFinanciamento].valorTotal, IdFinanciamento: this.state.tabelaFinanciamento[positionFinanciamento].qtdeDeTitulos, valorParcelaDoFinancimento: this.state.tabelaFinanciamento[positionFinanciamento].principal})
      await this.setState({juros: this.state.tabelaFinanciamento[0].jurosDeTabela})
    }
    if(await this.state.tabelaEntradasExiste == true) {
      const positionEntradas = (this.state.tabelaEntradas).length - 1;
      await this.setState({valorDasEntradas: this.state.tabelaEntradas[positionEntradas].valorTotal, IdEntradas: this.state.tabelaEntradas[positionEntradas].qtdeDeTitulos})
    }
    if(await this.state.tabelaIntermediariasExiste == true) {
      const positionIntermediarias = (this.state.tabelaIntermediarias).length - 1;
      await this.setState({valorDasIntermediarias: this.state.tabelaIntermediarias[positionIntermediarias].valorTotal, IdIntermediarias: this.state.tabelaIntermediarias[positionIntermediarias].qtdeDeTitulos})
    }
    await this.setState({identificador: tabela.identificador})
    await this.setState({tabelaCompleta: tabela, Lote: Lote, dadosLote: this.state.identificador.subLocal, SubLocal: sublocal, Local: local, numeroDaTabelaDeVenda: tabela.numero})
    
  }
  //#endregion

  //#region Armazenando a tabela de corretagem, intermediação e da tabela de vendas no redux
  armazenandoTabelasCorretagemIntermediacao = async () => {

      if(this.state.identificador.status == 0) 
      {
        await this.setVisibilidadeModalLoading(true)
        const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), parseInt(this.props.Prospect[0].id), [this.state.identificador])
        if (response != null || response != undefined || response != "")
        {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Reserva realizada com sucesso`
          })
          const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
          addToCorretagem(this.state.tabelaCorretagem)
          addToIntermediacao(this.state.tabelaIntermediacao)
          addToFinanciamento(this.state.tabelaFinanciamento)
          addToLotes(this.state.identificador)
          addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })
          await this.setVisibilidadeModalLoading(false)
          const navegar = await this.props.navigation.getParam('TabelaDePrecos', 'null')
          if(navegar != null && navegar != 'null')
          {
            return await navegar.onConfirm()
          }
          // await this.props.navigation.navigate('Intermediacao')
        }
      }
      else
      {
        const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
        addToCorretagem(this.state.tabelaCorretagem)
        addToIntermediacao(this.state.tabelaIntermediacao)
        addToFinanciamento(this.state.tabelaFinanciamento)
        addToLotes(this.state.identificador)
        addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })
        await this.setVisibilidadeModalLoading(false)
        const navegar = await this.props.navigation.getParam('TabelaDePrecos', 'null')
        if(navegar != null && navegar != 'null')
        {
          return await navegar.onConfirm()
        }
        // await this.props.navigation.navigate('Intermediacao')
      }

    // if(this.props.tela == '@tela_vendadireta')
    // {
    //   if(this.state.identificador.status == 0) 
    //   {
    //     await this.setVisibilidadeModalLoading(true)
    //     const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), parseInt(this.props.Prospect[0].id), [this.state.identificador])
    //     if (response != null || response != undefined || response != "")
    //     {
    //       PushNotification.localNotification({
    //         largeIcon: 'icon',
    //         smallIcon: 'icon',
    //         vibrate: true,
    //         vibration: 300,
    //         title: 'My Broker',
    //         message: `Reserva realizada com sucesso`
    //       })
    //       const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
    //       addToCorretagem(this.state.tabelaCorretagem)
    //       addToIntermediacao(this.state.tabelaIntermediacao)
    //       addToFinanciamento(this.state.tabelaFinanciamento)
    //       addToLotes(this.state.identificador)
    //       addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })
    //       await this.setVisibilidadeModalLoading(false)
    //       await this.props.navigation.navigate('Intermediacao')
    //     }
    //   }
    //   else
    //   {
    //     const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
    //     addToCorretagem(this.state.tabelaCorretagem)
    //     addToIntermediacao(this.state.tabelaIntermediacao)
    //     addToFinanciamento(this.state.tabelaFinanciamento)
    //     addToLotes(this.state.identificador)
    //     addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })
    //     await this.setVisibilidadeModalLoading(false)
    //     await this.props.navigation.navigate('Intermediacao')
    //   }
    // }
    // else
    // {
    //   PushNotification.localNotification({
    //     largeIcon: 'icon',
    //     smallIcon: 'icon',
    //     vibrate: true,
    //     vibration: 300,
    //     title: 'My Broker',
    //     message: `Permitido somente a reserva do lote.`
    //   })
    // }
  }
  //#endregion

  //#region Executando a reserva do lote
  reservandoLote = async () => {
    await this.setVisibilidadeModalLoading(true)
    const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), parseInt(this.props.Prospect[0].id), [this.state.identificador])
    if (response != null || response != undefined || response != "")
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Reserva realizada com sucesso`
      })
      await this.setVisibilidadeModalLoading(false)
      await this.props.navigation.navigate('Menu')
    }
  }
  //#endregion

  //#region Executando a reserva por meio da lista de lotes
  reservandoListaLote = async (item) => {
    await this.setVisibilidadeModalLoading(true)
    const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), parseInt(this.props.Prospect[0].id), [item])
    if (response != null || response != undefined || response != "")
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Reserva realizada com sucesso"`
      })
      await this.setVisibilidadeModalLoading(false)
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
        message: `Falha ao tentar realizar a reserva, tente novamente!`
      })
      await this.setVisibilidadeModalLoading(false)
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
  tela: String(state.telaAtual),
  empresa: state.dadosEmpreendimento.filter(emp => emp.empresa),
  centrodecusto: state.dadosEmpreendimento.filter(emp => emp.centrodecusto),
  Prospect: state.dadosLead,
  LotesReservados: state.dadosLotes,
  StyleGlobal: state.StyleGlobal,
  EmpresaLogada: state.EmpresaLogada,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({...DadosIntermediacaoActions, ...DadosCorretagemActions, ...DadosFinanciamentoActions, ...LotesActions, ...TabelaDeVendasActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DemonstrativoIR);