//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Keyboard, View, Text, Animated, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Chaves de filtragem
const KEYS_TO_FILTERS_LEADS = ['nome', 'ocupacao.nome', 'identificador.subLocal.descricao']
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Vendas } from "../../../services";
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

class Pagamentos extends Component {

  //#region Funcoes do componente
  componentDidMount = async () => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      // await this.refreshListaLeads()
    })
    // await this.setVisibilidadeLoading(true)
    // await this.pegandoListaDeLeadsNoBancoDeDados()
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
    PDFContrato: "",
    PDFDescricaoContrato: "",
    PDFExtensaoContrato: "",
    ListaLeads: [],
    ListaOriginal: [],
    ListaFiltrada: [],
    ListaExibida: [],
    LocaisDeCaptacao: [],
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
  };
  //#endregion

  //#region View
  render() {
    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity style = {{borderWidth: 1, borderColor: '#000', width: 150, padding: 5}} onPress = {this.extraindoCodigoDeBarras}>
          <Text style = {{alignItems: 'center', justifyContent: 'center', textAlign: 'center', textAlignVertical: 'center'}}>ExtractBarCode</Text>
        </TouchableOpacity>
      </Container>
    );
  }
  //#endregion

  //#region Controller

  //#region Puxando dados do boleto na API
  extraindoCodigoDeBarras = async () => {
    // const request = require('request')

    var servicesUrl = "https://azure.leadtools.com/api/";

    //The first page in the file to mark for processing
    var firstPage = 1;

    //Sending a value of -1 will indicate to the services that the rest of the pages in the file should be processed.
    var lastPage = -1;

    //We will be uploading the file via a URL.  Files can also be passed by adding a PostFile to the request.  Only 1 file will be accepted per request.
    //The services will use the following priority when determining what a request is trying to do GUID > URL > Request Body Content
    var fileURL = 'http://demo.leadtools.com/images/tiff/barcode1.tif';

    //A comma separated string of barcode symbologies. Passing an empty string will cause to service to use Popular by default.
    var symbologies = "";

    var recognitionUrl = servicesUrl + 'Recognition/ExtractAllBarcodes?firstPage=' + firstPage + '&lastPage=' + lastPage + '&fileurl=' + fileURL + '&symbologies=' + symbologies;

    // axios.post(getRequestOptions(recognitionUrl), recognitionCallBack)

    const response = await axios({
      method: 'POST',
      baseURL: recognitionUrl,
      headers: {
        'Content-Length': 0
      },
      auth: {
        username: 'Pagamentos',
        password: '{QDaVNY4pBZb8)*#NJf:Knl9'
      },
    })

    if(response.status === 200 || response.status === 201)
    {
      // console.log(response.data)
      await queryServices(String(response.data))
    }
    else
    {
      console.log('There is not exists bar code in file')
    }

    async function queryServices(result) 
    {
      var queryUrl = servicesUrl + 'Query?id=' + result;
      
      const responseQuery = await axios({
        method: 'POST',
        baseURL: queryUrl,
        headers: {
          'Content-Length': 0
        },
        auth: {
          username: 'Pagamentos',
          password: '{QDaVNY4pBZb8)*#NJf:Knl9'
        },
      })

      if(responseQuery.status == 200 || responseQuery.status == 201)
      {
        console.log(responseQuery.data)
      }
      else
      {
        console.log('Errror xxx')
      }
    }

    function parseJson(jsonObject) {
      //Function to decode the JSON object that was returned by the LEADTOOLS CloudServices.
      for (let i = 0; i < jsonObject.length; i++) {
        var currentRequest = jsonObject[i];
        console.log("Service Type: " + currentRequest['ServiceType']);
        if (currentRequest['ServiceType'] === 'Recognition' && currentRequest['RecognitionType'] === 'Barcode') {
          console.log("Recognition Method: " + currentRequest['RecognitionType']);
          console.log("Barcode Data: \n");
          currentRequest['data'].forEach(barcode => {
            console.log("Symbology: " + barcode['Symbology']);
            console.log("Value: " + barcode['Value']);
            console.log("Bounds: " + barcode['Bounds']);
            console.log("Rotation Angle: " + barcode['RotationAngle']);
            console.log("------------------------------------");
          });
        }
      }
    }
  }
  //#endregion

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

  //#region Renderização a lista de contratos
  renderItem = ({ item, index }) => item.numero >= 0 && (
    <>
      <View key = {item.numero} 
        style = {{
          backgroundColor: '#FFFFFF',
          padding: 16,
          width: '100%',
          height: 78.37,
          borderWidth: 1,
          borderColor: '#E2F2E3',
          marginBottom: 4
        }}>
        <TouchableOpacity onPress = { async () => {}}>
          <View
            style ={{
              width: '100%', 
              justifyContent: 'space-between', 
              flexDirection: 'row'
          }}>
            <View
              style = {{
                maxWidth: '50%', 
                justifyContent: 'center',
            }}>
              <Text 
                style = {{
                  fontSize: 12,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#262825'
              }} numberOfLines = {1} ellipsizeMode = {'tail'}>{item.identificador.subLocal.descricao}</Text>
              <Text 
                style = {{
                  fontSize: 10,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#8F998F',
              }} numberOfLines = {1} ellipsizeMode = {'tail'}>{item.prospects[0].nome}</Text>
              <Text 
                style = {{
                  fontSize: 10,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#8F998F',
              }} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.Moeda(parseInt(item.identificador.valorAVista * 100))}</Text>
            </View>
            <View style = {{flexDirection: 'row', maxWidth: '50%', justifyContent: 'center'}}>
              <TouchableOpacity
                style = {{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  marginRight: 10, 
                  backgroundColor: '#FFFFFF',
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#4C773C'
              }} onPress = {async () => {await this.emitirContrato(item)}}
                >
                <Text
                  style = {{
                    fontSize: 12, 
                    color: '#4C773C',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    textAlign: 'center',
                    alignSelf: 'center',
                    marginVertical: 4,
                    marginHorizontal: 0
                }}>Contrato</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style = {{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  marginRight: 10, 
                  backgroundColor: '#4C773C',
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#4C773C'
              }} onPress = {async () => {await this.emitirContratoInter(item)}}
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
                }}>Contrato Inter.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
  //#endregion

  //#region Emitir contrato pendente
  emitirContrato = async (item) => {
    await this.setVisibilidadeLoading(true)
    const response = await Vendas.consultarcontratos(this.props.token[0].token, this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, item.numero)
    if(response != null && response != undefined && response != "")
    {
      await this.setState({PDFContrato: response.arquivo, PDFDescricaoContrato: response.descricao, PDFExtensaoContrato: response.extensao})
      await this.setVisibilidadeLoading(false)
      await this.setVisibilidadeModalPDF(true)
      // const showError = await RNShareFile.sharePDF(response.arquivo, `${response.descricao}.${response.extensao}`);
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
      await this.setState({ListaLeads: response})
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
        for(var i = 0; i <= this.state.quantItem; i++) {
          this.state.ListaFiltrada[i].alturaDoItem = new Animated.Value(70)
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd})
      } else {
        for(var i = 0; i <=(Lista.length - 1); i++) {
          this.state.ListaFiltrada[i].alturaDoItem = new Animated.Value(70)
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
          this.state.ListaFiltrada[i].alturaDoItem = new Animated.Value(70)
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: this.state.ListaExibida.concat(ListaAdd)})
        await this.setState({loadMore: false})
      } catch {}
    } else if (this.state.ListaFiltrada.length < this.state.quantItem) {
      try {
        for (var i = (quantAnterior); i <= (this.state.ListaFiltrada.length - 1); i++) {
          this.state.ListaFiltrada[i].alturaDoItem = new Animated.Value(70)
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
  StyleGlobal: state.StyleGlobal
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ... DadosLeadActions, ...TelaAtualActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Pagamentos);