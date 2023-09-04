//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { FlatList, Switch, View, Text, Animated, Image, TouchableOpacity, Dimensions, StyleSheet, ScrollView, TextInput, Modal, Alert, Platform, PermissionsAndroid, KeyboardAvoidingView } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Search, { createFilter } from 'react-native-search-filter';
import DocumentPicker from 'react-native-document-picker';
import PushNotification from 'react-native-push-notification';
import Lottie from 'lottie-react-native';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
var PMT = require('formula-pmt');
import { pv } from 'financial';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { RNCamera } from 'react-native-camera';
import Carousel from 'react-native-snap-carousel';
import PDFView from 'react-native-view-pdf';
//#endregion

//#region Services
import { CentroDeCusto, TabelaDeVendas, Titulo, Calendario, Validacoes, Vendas } from '../../../services';
//#endregion

//#region Redux
import { DadosEmpreendimentoActions, DadosTabelaParcelasActions, DadosPropostaDeVendaActions, DocumentosPropostaListaActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
import Loader from '../../../effects/loader.json';
import addMonths from 'date-fns/addMonths';
import moment from 'moment';
import "moment/locale/pt-br";
//#endregion

//#region Componentes
import { Container, TextInputPicker, TextInputPickerSala } from '../../../components';
import { ModalEntradas, ModalOption, ModalCondicoesTabelaDeVenda, ModalSala, ModalTlmkt, ModalPromotor, ModalLiner, ModalCloser, ModalPEP, ModalSubGerente, ModalGerente, ModalFinalidadesDeCompra, ModalFinanciamento, ModalFinanciamentoPersonalizado, ModalLoading, ModalCalculator, ModalFormaDePagamento, ModalEntradasPersonalizadas } from '../../Modais';
// import { EntradasView, FinanciamentoView } from './styles';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
import ImagemCamera from '../../../assets/cam.png';
//#endregion

//#region Data
import DataBanco from '../../../Data/Banco';
import DataMaquina from '../../../Data/Maquina';
import DataOperacao from '../../../Data/Operacao';
import DataBandeira from '../../../Data/Bandeira';
//#endregion

//#endregion

class PropostaDePagamento extends Component {
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
    this.state.EmpresaLogada = this.props.EmpresaLogada[0]
    await this.setVisibilidadeModalLoading(true);
    await this.pegandoTabelasFinanciamento();
  }
  //#endregion

  //#region Component Unmount
  componentWillUnmount() {
    this._isMounted = false;
  }
  //#endregion

  //#region Model
  state = {
    alturaScrollView: 190,
    EmpresaLogada: null,
    VisibilidadeModalEntradas: false,
    VisibilidadeModalFinanciamento: false,
    VisibilidadeModalFinanciamentoPersonalizado: false,
    VisibilidadeModalLoading: false,
    VisibilidadeModalCalculator: false,
    VisibilidadeModalFormaDePagamento: false,
    VisibilidadeModalEntradasPersonalizadas: false,
    VisibilidadeModalCondicoesDaTabelaDeVenda: false,
    VisibilidadeModalPeriodicidade: false,
    VisibilidadeModalOption: false,
    VisibilidadeModalSalas: false,
    VisibilidadeModalAssessorTlmkt: false,
    VisibilidadeModalCaptadorPromotor: false,
    VisibilidadeModalLiners: false,
    VisibilidadeModalClosers: false,
    VisibilidadeModalPEP: false,
    VisibilidadeModalSubGerenteSala: false,
    VisibilidadeModalGerenteSala: false,
    VisibilidadeModalFinalidades: false,
    VisibilidadeMeioPagamentoEntradas: false,
    VisibilidadeMeioPagamentoIntermediaria: false, 
    VisibilidadeMeioPagamentoSinal: false,
    VisibilidadeMeioPagamentoFinanciamento: false,
    VisibilidadeModalAnexos: false,
    VisibilidadePickerDateProposta: false,
    ModalOptionMensagem: '',
    Renderizar: true,
    EmpresaId: null,
    ListaPeriocidades: [],
    PropostaDeVenda: [],
    CondicoesDaTabelaDeVenda: [],
    ListaPickerCondicoesDaTabelaDeVenda: [],
    ItemPickerCondicoesDaTabelaDeVenda: [],
    DescricaoItemPickerCondicoesDaTabelaDeVenda: '',
    DescricaoItemPickerPeriodicidade: '',
    DescricaoItemPickerSala: '',
    DescricaoItemPickerTlmkt: '',
    DescricaoItemPickerPromotor: '',
    DescricaoItemPickerCloser: '',
    DescricaoItemPickerLiner: '',
    DescricaoItemPickerPEP: '',
    DescricaoItemPickerSubGerenteDeSala: '',
    DescricaoItemPickerGerenteDeSala: '',
    DescricaoItemPickerFinalidadeDeCompra: '',
    IdCasal: null,
    ListaPickerSala: [],
    ListaPickerAssessorTlmkt: [],
    ListaPickerPromotor: [],
    ListaPickerCloser: [],
    ListaPickerLiner: [],
    ListaPickerPEP: [],
    ListaPickerSubGerenteDeSala: [],
    ListaPickerGerenteDeSala: [],
    ListaPickerFinalidadeDeCompra: [],
    ItemPickerSala: [],
    ItemPickerTlmkt: [],
    ItemPickerPromotor: [],
    ItemPickerCloser: [],
    ItemPickerLiner: [],
    ItemPickerPEP: [],
    ItemPickerSubGerenteDeSala: [],
    ItemPickerGerenteDeSala: [],
    ItemPickerFinalidadeDeCompra: [],
    EntradasQtde: 0,
    EntradaValorTotal: 0,
    ListaBanco: DataBanco,
    ListaMaquina: DataMaquina,
    ListaOperacao: DataOperacao,
    ListaBandeira: DataBandeira,
    EntradaExiste: false,
    ListaDeEntradas: [],
    SinalQtde: 0,
    SinalValorTotal: 0,
    SinalExiste: false,
    ListaDeSinais: [],
    IntermediariasQtde: 0,
    IntermediariaExiste: false,
    ListaDeIntermediarias: [],
    ParcelaValor: 0,
    ParcelaValorPMT: 0,
    ParcelaValorTotal: 0,
    ParcelaValorTotalJuros: 0,
    ParcelaQtde: 0,
    ParcelaVencimento: undefined,
    ParcelaPickerVencimento: false,
    ParcelaObraValor: 0,
    ParcelaObraValorPMT: 0,
    ParcelaObraQtde: 0,
    ParcelaObraValorTotal: 0,
    ParcelaObraValorTotalJuros: 0,
    ParcelaObraVencimento: undefined,
    ParcelaObraPickerVencimento: false,
    ParcelaObraExiste: false,
    ParcelaBancoValor: 0,
    ParcelaBancoQtde: 0,
    ParcelaBancoValorTotal: 0,
    ParcelaBancoVencimento: undefined,
    ParcelaBancoPickerVencimento: false,
    ParcelaBancoExiste: false,
    ValorExtra: 0,
    ValorTotal: 0,
    ValorGerado: 0,
    TextoEntradas: '',
    TextoSinais: '',
    scrollCarouselEnabled: true,
    anexosDocumentos:[],
    anexo_atual: null,
    imageurl: null,
    cameraType: 'back',
    indicatorCamera: false,
    FlashCamera: RNCamera.Constants.FlashMode.off,
    FichaNegociacao: {
      "id": "Ficha de Negociacao",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
      "isPDF": false
    },
    FichaAtendimento: {
      "id": "Ficha de Atendimento",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
      "isPDF": false
    },
    ComprovanteEntrada: {
      "id": "Comprovante Entrada",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
      "isPDF": false
    },
    CheckListCadastro: {
      "id": "Check List Cadastro",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
      "isPDF": false
    },
    FichaNegociacaoPDF: null,
    FichaAtendimentoPDF: null,
    ComprovanteEntradaPDF: null,
    CheckListCadastroPDF: null,
    DocumentosPropostaLista: [],
    FormasDePagamento: [],
    CalendarioMeses: [],
    TabelaFinanciamento: [],
    TabelaEntradas: [],
    DadosFinanciamento: [],
    IDFormaPagamento: null,
    IDTemporariaFormaPagamento: null,
    DescricaoFormaPagamento: null,
    DescricaoTemporariaFormaPagamento: null,
    IndexEscolhaTemporaria: null,
    IndexEscolha: null,
    ValorTotalFinanciamento: null,
    PrimeiroVencimentoFinanciamento: null,
    ParcelasFinanciamento: null,
    ValorDaParcelaFinanciamento: null,
    ValorTotalTemporarioFinanciamento: null,
    PrimeiroVencimentoTemporarioFinanciamento: null,
    ParcelasTemporarioFinanciamento: null,
    ValorDaParcelaTemporarioFinanciamento: null,
    ID: "",
    fichaDeNegociacao: null,
    DataDaProposta: new Date(),
  };
  //#endregion

  //#region View
  render() {
    return (
        <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
          <ModalLoading 
            visibilidade = {this.state.VisibilidadeModalLoading} 
            onPress = {() => {this.setVisibilidadeModalLoading(false)}}
          />
          <ModalCalculator 
            visibilidade = {this.state.VisibilidadeModalCalculator} 
            onPress = {() => {this.setVisibilidadeModalCalculator(false)}}
          />
          <ModalFormaDePagamento
            visibilidade = {this.state.VisibilidadeModalFormaDePagamento}
            keyExtractorFlatList = {item => String(item.id)}
            renderFormaPagamento = {this.renderFormaPagamento}
            dataFormaPagamento = {this.state.FormasDePagamento}
            idFlatList = {(ref) => { this.FlatList = ref }}
            onPressVisibilidade = {() => {this.setVisibilidadeModalFormasDePagamento(false)}}
          />
          <ModalEntradas 
            visibilidade = {this.state.VisibilidadeModalEntradas}
            fimdaanimacao = {this.fechandoModalEntradas}
            onPressConfirmar = {this.validandoDadosModalEntradas}
            personalizar = {() => {this.setVisibilidadeModalEntradasPersonalizadas(true)}}
          />
          <ModalEntradasPersonalizadas
            visibilidade = {this.state.VisibilidadeModalEntradasPersonalizadas}
            fimdaanimacao = {this.fechandoModalEntradasPersonalizadas}
            onPressConfirmar = {this.validandoDadosModalEntradasPersonalizadas}
          />
          <ModalFinanciamento 
            visibilidade = {this.state.VisibilidadeModalFinanciamento}
            fimdaanimacao = {this.setandoOutraEscolhaAnteriorFinanciamento}
            personalizar = {this.transicaoPersonalizacao}
            value = {this.state.PrimeiroVencimentoTemporarioFinanciamento}
            juros = {this.state.jurosDetabela}
            onChangeTextFinanciamento = {(value) => {this.setState({PrimeiroVencimentoTemporarioFinanciamento: formatoDeTexto.Data(value)})}}
            keyExtractorFlatList = {item => String(item.qtdeDeTitulos)}
            renderFlatList = {this.renderItemFinanciamento}
            dataFlatList = {this.state.TabelaFinanciamento}
            idFlatList = {(ref) => { this.FlatList = ref }}
            valueFinanciamento = {this.state.PrimeiroVencimentoTemporarioFinanciamento}
            onPressConfirmar = {this.setandoParaEscolhaFinanciamento}
          />
          <ModalFinanciamentoPersonalizado 
            visibilidade = {this.state.VisibilidadeModalFinanciamentoPersonalizado}
            onPressIcon = {() => {this.setVisibilidadeModalFinanciamentoPersonalizado(false)}}
            onPressConfirmar = {this.validandoDadosDoFinanciamentoPersonalizado}
            idPrimeiroVencimento = {value => this.setIdInputPrimeiroVencimentoFinanciamento(value)}
            idParcelas = {value => this.setIdInputParcelasFinanciamento(value)}
            idValorDaParcela = {value => this.setIdInputValorDaParcelaFinanciamento(value)}
            returnKeyTypePrimeiroVencimento = {'go'}
            returnKeyTypeParcelas = {'go'}
            returnKeyTypeValorDaParcela = {'go'}
            keyboardPrimeiroVencimento = {'numeric'}
            keyboardParcelas = {'numeric'}
            keyboardValorDaParcela = {'numeric'}
            onChangePrimeiroVencimento = {this.setPrimeiroVencimentoFinanciamento}
            onChangeParcelas = {this.setParcelasFinancimento}
            onChangeValorDaParcela = {this.setValorDaParcelaFinanciamento}
            valuePrimeiroVencimento = {this.state.PrimeiroVencimentoTemporarioFinanciamento}
            valueParcelas = {this.state.ParcelasTemporarioFinanciamento}
            valueValorDaParcela = {this.state.ValorDaParcelaTemporarioFinanciamento}
            onSubmitPrimeiroVencimento = {() => { this.submitInputDataFinanciamento() }}
            onSubmitParcelas = {() => { this.submitInputParcelasFinanciamento() }}
            onSubmitValorDaParcela = {() => {this.submitInputValorFinanciamento()}}
            valortotal = {formatoDeTexto.FormatarTexto((this.state.ValorTotalFinanciamento))}
          />
          <ModalCondicoesTabelaDeVenda
            visibilidade = {this.state.VisibilidadeModalCondicoesDaTabelaDeVenda}
            keyExtractorFlatList = {item => item.descricao}
            renderCondicoes = {this.renderCondicoesTabelaDeVenda}
            dataCondicoes = {this.state.ListaPickerCondicoesDaTabelaDeVenda}
            idFlatList = {(ref) => {this.FlatListCondicoes = ref}}
            onPressVisibilidade ={() => {this.setVisibilidadeModalCondicoesTabelaDeVendas(false)}}
          />
          <ModalSala
            visibilidade = {this.state.VisibilidadeModalSalas}
            keyExtractorFlatList = {item => item.descricao}
            renderSalas = {this.renderSalas}
            dataSalas = {this.state.ListaPickerSala}
            idFlatList = {(ref) => {this.FlatListSalas = ref}}
            onPressVisibilidade ={() => {this.setVisibilidadeModalSalas(false)}}
          />
          <ModalLiner
            visibilidade = {this.state.VisibilidadeModalLiners}
            keyExtractorFlatList = {(item, index)=> String(index)}
            renderLiner = {this.renderLiner}
            dataLiner = {this.state.ListaPickerLiner}
            idFlatList = {(ref) => {this.FlatListLiner = ref}}
            onPressVisibilidade ={() => {this.setVisibilidadeModalLiners(false)}}
          />
          <ModalTlmkt
            visibilidade = {this.state.VisibilidadeModalAssessorTlmkt}
            keyExtractorFlatList = {(item, index)=> String(index)}
            renderTlmkt = {this.renderTlmkt}
            dataTlmkt = {this.state.ListaPickerAssessorTlmkt}
            idFlatList = {(ref) => {this.FlatListTlmkt = ref}}
            onPressVisibilidade ={() => {this.setVisibilidadeModalTlmkt(false)}}
          />
          <ModalPromotor
            visibilidade = {this.state.VisibilidadeModalCaptadorPromotor}
            keyExtractorFlatList = {(item, index)=> String(index)}
            renderPromotor = {this.renderPromotor}
            dataPromotor= {this.state.ListaPickerPromotor}
            idFlatList = {(ref) => {this.FlatListPromotor = ref}}
            onPressVisibilidade ={() => {this.setVisibilidadeModalPromotor(false)}}
          />
          <ModalCloser
            visibilidade = {this.state.VisibilidadeModalClosers}
            keyExtractorFlatList = {(item, index)=> String(index)}
            renderCloser = {this.renderCloser}
            dataCloser = {this.state.ListaPickerCloser}
            idFlatList = {(ref) => {this.FlatListCloser = ref}}
            onPressVisibilidade ={() => {this.setVisibilidadeModalClosers(false)}}
          />
          <ModalPEP
            visibilidade = {this.state.VisibilidadeModalPEP}
            keyExtractorFlatList = {(item, index)=> String(index)}
            renderPEP = {this.renderPEP}
            dataPEP = {this.state.ListaPickerPEP}
            idFlatList = {(ref) => {this.FlatListPEP = ref}}
            onPressVisibilidade ={() => {this.setVisibilidadeModalPEP(false)}}
          />
          <ModalSubGerente
            visibilidade = {this.state.VisibilidadeModalSubGerenteSala}
            keyExtractorFlatList = {(item, index)=> String(index)}
            renderSubGerenteSala = {this.renderSubGerente}
            dataSubGerenteSala = {this.state.ListaPickerSubGerenteDeSala}
            idFlatList = {(ref) => {this.FlatListSubGerenteSala = ref}}
            onPressVisibilidade ={() => {this.setVisibilidadeModalSubGerenteSala(false)}}
          />
          <ModalGerente
            visibilidade = {this.state.VisibilidadeModalGerenteSala}
            keyExtractorFlatList = {(item, index)=> String(index)}
            renderGerenteSala = {this.renderGerente}
            dataGerenteSala = {this.state.ListaPickerGerenteDeSala}
            idFlatList = {(ref) => {this.FlatListGerenteSala = ref}}
            onPressVisibilidade ={() => {this.setVisibilidadeModalGerenteSala(false)}}
          />
          <ModalFinalidadesDeCompra
            visibilidade = {this.state.VisibilidadeModalFinalidades}
            keyExtractorFlatList = {(item, index)=> String(index)}
            renderFinalidades = {this.renderFinalidades}
            dataFinalidades = {this.state.ListaPickerFinalidadeDeCompra}
            idFlatList = {(ref) => {this.FlatListFinalidades = ref}}
            onPressVisibilidade ={() => {this.setVisibilidadeModalFinalidades(false)}}
          />
          <ModalOption
            visibilidade = {this.state.VisibilidadeModalOption}
            textomensagem = {this.state.ModalOptionMensagem}
            onPressIcon = {() => {this.setVisibilidadeModalOption(false)}}
            onPressSim = {() => {this.setandoOpcaoSimNaModalOption()}}
            onPressNao = {() => {this.setandoOpcaoNaoNaModalOption()}}
          />
          {this.state.VisibilidadeModalLoading == false && <>
          <View 
            style = {{
              backgroundColor: '#FFFFFF',
              paddingTop: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 25 : 0
            }}>
            <View 
              style = {{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10
            }}>
              <Icon name = {'keyboard-arrow-left'} color = {this.props.StyleGlobal.cores.background} size = {40} style = {{}}
              onPress = {() => {this.props.navigation.goBack()}}/>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 16,
                  textAlign: 'center',
                  color: this.props.StyleGlobal.cores.background
              }}>Proposta de pagamento</Text>       
              <View style = {{width: 40}}></View>
            </View>
          </View>
          <View onLayout = {event => { this.frameViewHeight = event.nativeEvent.layout.height}} style = {{maxHeight: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 210) : (Dimensions.get('window').height - 190), minHeight: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 210) : (Dimensions.get('window').height - 190)}}>
            <View style = {{paddingHorizontal: 23, backgroundColor: '#FFFFFF', alignItems: 'flex-start', flexDirection: 'column', justifyContent: 'space-between', paddingVertical: 5}}>
              <View style = {{ width: '80%'}}>
                <View style = {{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                  <View style = {{marginRight: 4, justifyContent: 'center'}}>
                    <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color:'#8F998F', textAlign: 'left'}} numberOfLines = {1} ellipsizeMode = {'tail'}>Identificador</Text>
                    <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color: this.props.StyleGlobal.cores.background, textAlign: 'left', flexWrap: 'wrap'}}>{this.props.LotesReservados[0].subLocal['descricao']}</Text>
                  </View>
                </View>
              </View>
              <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                {false &&
                <View style = {{flexDirection: 'row', alignItems: 'center', marginRight: 5}}>
                  <View style = {{justifyContent: 'center'}}>
                    <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color:'#8F998F', textAlign: 'center'}} numberOfLines = {1} ellipsizeMode = {'tail'}>Área (m²)</Text>
                    <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 13, color: this.props.StyleGlobal.cores.background, textAlign: 'center'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{this.props.LotesReservados[0].area}</Text>
                  </View>
                </View>}
                <View>
                  <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color:'#8F998F',
                  }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor do lote à vista</Text>
                  <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: this.props.StyleGlobal.cores.background
                  }} numberOfLines = {1} ellipsizeMode = {'tail'}>{(this.props.LotesReservados[0].valorAVista != undefined && this.props.LotesReservados != "") ? formatoDeTexto.FormatarTexto((this.props.LotesReservados[0].valorAVista)) : ""}</Text>
                </View>
                {this.props.EmpresaLogada[0] != 5 &&
                <View>
                  <Text style ={{textAlign: 'right', fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color: '#8F998F'}}>{this.state.ItemPickerCondicoesDaTabelaDeVenda != "" ? ((this.props.LotesReservados[0].valorAVista - ((this.state.IntermediariaExiste == true ? ((this.state.ListaDeIntermediarias).reduce((total, intermediaria) => (total + (intermediaria.Qtde * intermediaria.Valor)), 0)) : 0) + (this.state.ParcelaBancoExiste == true ? (this.state.ParcelaBancoQtde * this.state.ParcelaBancoValor) : 0) + (this.state.ParcelaObraExiste == true ? (this.state.ParcelaObraQtde * this.state.ParcelaObraValor) : 0) + (this.state.ParcelaQtde * this.state.ParcelaValor) + (this.state.SinalExiste == true ? ((this.state.ListaDeSinais).reduce((total, sinal) => total + (sinal.Valor), 0)) : 0) + (this.state.EntradaExiste == true ? ((this.state.ListaDeEntradas).reduce((total, entrada) => total + (entrada.Valor), 0)) : 0) + (((this.props.Corretagem != "" ? this.props.Corretagem[0].valorTotal : 0))) + (this.props.Intermediacao != "" ? this.props.Intermediacao[0].valorTotal : 0))) >= 0 ? 'Valor à distribuir' : 'Valor excedido') : 'Valor à distribuir'}</Text>
                  <Text
                    style = {{
                      fontStyle: 'normal', 
                      fontWeight: 'normal', 
                      fontSize: 14,
                      color: this.state.ItemPickerCondicoesDaTabelaDeVenda != "" ? ((this.props.LotesReservados[0].valorAVista - ((this.state.IntermediariaExiste == true ? ((this.state.ListaDeIntermediarias).reduce((total, intermediaria) => (total + (intermediaria.Qtde * intermediaria.Valor)), 0)) : 0) + (this.state.ParcelaBancoExiste == true ? (this.state.ParcelaBancoQtde * this.state.ParcelaBancoValor) : 0) + (this.state.ParcelaObraExiste == true ? (this.state.ParcelaObraQtde * this.state.ParcelalObraValor) : 0) + (this.state.ParcelaQtde * this.state.ParcelaValor) + (this.state.SinalExiste == true ? ((this.state.ListaDeSinais).reduce((total, sinal) => total + (sinal.Valor), 0)) : 0) + (this.state.EntradaExiste == true ? ((this.state.ListaDeEntradas).reduce((total, entrada) => total + (entrada.Valor), 0)) : 0) + (((this.props.Corretagem != "" ? this.props.Corretagem[0].valorTotal : 0))) + (this.props.Intermediacao != "" ? this.props.Intermediacao[0].valorTotal : 0))) >= 0 ? '#F00' : this.props.StyleGlobal.cores.botao) : '#F00',
                      textAlign: 'right',
                  }}>{this.state.ItemPickerCondicoesDaTabelaDeVenda != "" ? formatoDeTexto.FormatarTexto(this.props.LotesReservados[0].valorAVista - ((this.state.IntermediariaExiste == true ? ((this.state.ListaDeIntermediarias).reduce((total, intermediaria) => (total + (intermediaria.Qtde * intermediaria.Valor)), 0)) : 0) + (this.state.ParcelaBancoExiste == true ? (this.state.ParcelaBancoQtde * this.state.ParcelaBancoValor) : 0) + (this.state.ParcelaObraExiste == true ? (this.state.ParcelaObraQtde * this.state.ParcelaObraValor) : 0) + (this.state.ParcelaQtde * this.state.ParcelaValor) + (this.state.SinalExiste == true ? ((this.state.ListaDeSinais).reduce((total, sinal) => total + (sinal.Valor), 0)) : 0) + (this.state.EntradaExiste == true ? ((this.state.ListaDeEntradas).reduce((total, entrada) => total + (entrada.Valor), 0)) : 0) + (((this.props.Corretagem != "" ? this.props.Corretagem[0].valorTotal : 0))) + (this.props.Intermediacao != "" ? this.props.Intermediacao[0].valorTotal : 0))) : formatoDeTexto.FormatarTexto(this.props.LotesReservados[0].valorAVista)}</Text>
                </View>}
              </View>
            </View>
            <ScrollView
              ref = {(ref) => this.ScrollViewFinanciamento = ref} 
              showsVertiscalScrollIndicator = {false}
              scrollEventThrottle = {16}>
              <View style = {{ minHeight: Dimensions.get('window').height - 190 }}>
                <View>
                  <TouchableOpacity
                    activeOpacity = {1}
                    style = {{ marginTop: 20, marginHorizontal: 20 }}
                    onPress = { async () => { this.setVisibilidadeModalCondicoesTabelaDeVendas(true) }}>
                    <TextInputPicker
                      title = {'Condição da tabela de venda'}
                      value = {this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda == "" ? "Selecione a condição da tabela de venda" : this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda}
                    />
                  </TouchableOpacity>
                  {(this.state.ParcelaBancoExiste == true && this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda != '') &&
                  <View
                    >
                    <View
                      style = {{
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        paddingHorizontal: 23,
                        marginTop: 24,
                    }}>
                      <View>
                        <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: this.props.StyleGlobal.cores.background}}>Financiamento bancário</Text>
                      </View>
                      {false &&
                      <View style = {{flexDirection: 'row'}}>
                        <TouchableOpacity style = {{flexDirection: 'row', padding: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: this.props.StyleGlobal.cores.background, alignItems: 'center', marginRight: 8}}
                          onPress = {() => {this.setVisibilidadeModalFinanciamento(true)}}>
                          <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 12, textAlign: 'center', color: this.props.StyleGlobal.cores.background}}>Selecione</Text>
                        </TouchableOpacity>
                      </View>}
                    </View>
                    <View style = {{marginBottom: 8, marginHorizontal: 24, marginTop: 18}}>
                      <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
                        <Text style = {{width: '30%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Vencimento</Text>
                        <Text style = {{width: '30%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor total</Text>
                      </View>
                    </View>
                    <TouchableOpacity activeOpacity = {1}>
                      <View  style = {{width: '100%', flexDirection: 'row', backgroundColor: '#FFFFFF', height: 62, alignItems: 'center', paddingHorizontal: 24}}>
                        <View style = {{flexDirection: 'row', alignItems: 'center', width: '30%'}}>
                          <View>
                            <DateTimePickerModal
                              isVisible = {this.state.ParcelaBancoPickerVencimento}
                              mode = {"date"}
                              locale = {"pt-BR"}
                              is24Hour = {true}
                              date = {this.state.ParcelaBancoVencimento}
                              maximumDate = {new Date((new Date().getFullYear() + 2).toString() + "-01-01")}
                              headerTextIOS = {"Vencimento"}
                              cancelTextIOS = {"Cancelar"}
                              confirmTextIOS = {"Confirmar"}
                              onConfirm = { async (date) => {
                                const currentDate = date || this.state.ParcelaBancoVencimento
                                this.setState({ParcelaBancoVencimento: currentDate, ParcelaBancoPickerVencimento: false})
                              }}
                              onCancel = {  async () => {
                                this.state.ParcelaBancoPickerVencimento = false
                                await this.setState({Renderizar: this.state.Renderizar})
                              }}
                            />
                            <TouchableOpacity onPress = {async() => {
                              this.state.ParcelaBancoPickerVencimento == false ? await this.setState({ParcelaBancoPickerVencimento: true}) : await this.setState({ParcelaBancoPickerVencimento: false})
                            }} activeOpacity = {1}>
                              {true &&
                                <>
                                <View style = {{}}>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text
                                      style = {{
                                        flexDirection: 'column',
                                        borderColor: this.props.StyleGlobal.cores.background,
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 11,
                                        textAlignVertical: 'center',
                                    }}>{this.state.ParcelaBancoVencimento == undefined ? 'DD/MM/YYYY' : format(new Date(this.state.ParcelaBancoVencimento), 'dd/MM/yyyy')}</Text>
                                    <Icon name = "event" size = {10} color = {this.props.StyleGlobal.cores.background} style = {{marginLeft: 5}}/>
                                  </View>
                                </View>
                                </>
                              }
                            </TouchableOpacity>
                          </View>
                        </View>
                        <TextInput editable = {true} placeholder = {"R$ 0,00"} placeholderTextColor = {'#8f998f'} keyboardType = {'numeric'}
                          value = {formatoDeTexto.FormatarTexto(this.state.ParcelaBancoValorTotal)} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                          style = {{width: '30%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#262825', height: 52}} 
                          numberOfLines = {1} ellipsizeMode = {'tail'}
                          onChangeText = {async (value) => {
                            this.state.ParcelaBancoValorTotal = formatoDeTexto.DesformatarTexto(value) ?? 0;
                            this.state.ParcelaBancoValor = this.state.ParcelaBancoQtde > 0 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((this.state.ParcelaBancoValorTotal / this.state.ParcelaBancoQtde))) : 0;
                            this.setState({Renderizar: true})
                          }}/>
                      </View>
                    </TouchableOpacity>
                  </View>}
                  {(this.state.EntradaExiste == true && this.props.disponibilidadeEntradas[0].disponibilidadeEntradas == true && this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda != '') &&
                  <View>
                    <View
                      style = {{
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        paddingHorizontal: 23,
                        marginTop: 24,
                      }}>
                      <View>
                        <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginBottom: 8}}>{this.state.ListaDeEntradas.length > 1 ? 'Entradas': 'Entrada'}</Text>
                        {false && <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color: '#8F998F'}}>Pagamento em: {this.state.DescricaoFormaPagamento}</Text>}
                      </View>
                      {false &&
                      <View style = {{flexDirection: 'row'}}>
                        <TouchableOpacity style = {{flexDirection: 'row', padding: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: this.props.StyleGlobal.cores.background, alignItems: 'center', marginRight: 8}}
                          onPress = {() => {this.setVisibilidadeModalEntradas(true)}}>
                          <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 12, textAlign: 'center', color: this.props.StyleGlobal.cores.background}}>Selecione</Text>
                        </TouchableOpacity>
                      </View>}
                    </View>
                    <View style = {{marginBottom: 8, marginHorizontal: 24, marginTop: 18}}>
                      <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
                        {this.props.EmpresaLogada[0] != 8 && <Text style = {{width: '20%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Qtde</Text>}
                        <Text style = {{width: '40%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor total</Text>
                        {false && <Text style = {{width: '40%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Vencimento</Text>}
                      </View>
                    </View>
                    <View style = {{width: '100%', flexDirection: 'row', backgroundColor: '#FFFFFF', height: 62, alignItems: 'center', paddingHorizontal: 24}}>
                    {this.props.EmpresaLogada[0] != 8 &&
                      <TextInput editable = {true} placeholder = {formatoDeTexto.NumeroInteiro("0")} placeholderTextColor = {'#8F998F'}
                        value = {formatoDeTexto.NumeroInteiro(this.state.EntradasQtde)}
                        style = {{ width: '20%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#8F998F', height: 52}}
                        numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                        onChangeText = {async (value) => {
                          var ListaDeEntradas = [];
                          var EntradaValor = this.state.EntradaValorTotal ?? 0;
                          var EntradaQtde = value > 12 ? '12' : value;
                          var EntradaVencimento = new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 3)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.primeiroVencimento ?? new Date());
                          this.state.EntradasQtde = parseInt(EntradaQtde) > 12 ? 12 : parseInt(EntradaQtde)

                          for (let i = 0; i < EntradaQtde; i++) {
                              let Vencimento = new Date(EntradaVencimento);
                              Vencimento.setUTCHours(23);
                              Vencimento.setMonth(Vencimento.getMonth() + (i == 0 ? 0 : 1));
                              ListaDeEntradas.push({
                                  Valor: (i == EntradaQtde - 1) ? (EntradaValor - (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((EntradaValor/EntradaQtde)))) * (EntradaQtde - 1)) : (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((EntradaValor/EntradaQtde)))),
                                  Vencimento: Vencimento,
                                  PickerDate: false,
                                  MeioDePagamento: "",
                                  ModalMeioDePagamento: false,
                                  ModalBanco: false,
                                  ModalBanderia: false,
                                  ModalMaquina: false,
                                  ModalOperacao: false,
                                  ModalPagamentos: false,
                                  ModalReplicarDados: false,
                                  Banco: { chave: '', Valor: '' },
                                  Agencia: '',
                                  Conta: '',
                                  DigitoDaConta: '',
                                  Titular: '',
                                  NumeroCheque: '',
                                  Maquina: { chave: '', Valor: '' },
                                  Bandeira: { chave: '', Valor: '' },
                                  DigitoCartao: '',
                                  Operacao: {chave: '', Valor: ''},
                                  NSU: '',
                                  NumeroDaOperacao: ''
                              });
                              EntradaVencimento = Vencimento;
                          }
                          this.state.ListaDeEntradas = ListaDeEntradas

                          var ListaDeSinais = [];
                          var SinalValor = this.state.SinalValorTotal ?? 0;
                          var SinalQtde = this.state.SinalQtde ?? 0;
                          var SinalVencimento = this.state.EntradaExiste == true ? new Date(EntradaVencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 2)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.primeiroVencimento ?? new Date());

                          this.state.SinalQtde = SinalQtde

                          for (let i = 0; i < SinalQtde; i++) {
                              let Vencimento = new Date(SinalVencimento);
                              Vencimento.setUTCHours(23);
                              Vencimento.setDate((this.state.ListaDeSinais[i].Vencimento).getDate())
                              Vencimento.setMonth(SinalVencimento.getMonth() + 1);
                              ListaDeSinais.push({
                                  Valor: this.state.ListaDeSinais[i].Valor,
                                  Vencimento: Vencimento,
                                  PickerDate: false,
                                  MeioDePagamento: this.state.ListaDeSinais[i].MeioDePagamento,
                                  ModalMeioDePagamento: false,
                                  ModalPagamentos: false,
                                  ModalBanco: false,
                                  ModalBanderia: false,
                                  ModalMaquina: false,
                                  ModalOperacao: false,
                                  ModalReplicarDados: false,
                                  Banco: this.state.ListaDeSinais[i].Banco, 
                                  Agencia: this.state.ListaDeSinais[i].Agencia,
                                  Conta: this.state.ListaDeSinais[i].Conta,
                                  DigitoDaConta: this.state.ListaDeSinais[i].DigitaDaConta,
                                  Titular: this.state.ListaDeSinais[i].Titular,
                                  NumeroCheque: this.state.ListaDeSinais[i].NumeroCheque,
                                  Maquina: this.state.ListaDeSinais[i].Maquina,
                                  Bandeira: this.state.ListaDeSinais[i].Bandeira,
                                  DigitoCartao: this.state.ListaDeSinais[i].DigitoCartao,
                                  Operacao: this.state.ListaDeSinais[i].Operacao,
                                  NSU: this.state.ListaDeSinais[i].NSU,
                                  NumeroDaOperacao: this.state.ListaDeSinais[i].NumeroDaOperacao
                              });
                              SinalVencimento = Vencimento;
                          }
                          this.state.ListaDeSinais = ListaDeSinais

                          if((this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))) != undefined)
                          {
                            var ParcelaBancoQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
                            var ParcelaBancoVencimento = this.state.SinalExiste == true ? new Date(SinalVencimento) : (this.state.EntradaExiste == true ? new Date(EntradaVencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.primeiroVencimento ?? new Date()));
                            ParcelaBancoVencimento.setUTCHours(23);
                            ParcelaBancoVencimento.setMonth(ParcelaBancoVencimento.getMonth() + 1);
                            ParcelaBancoVencimento.setDate((this.state.ParcelaBancoVencimento).getDate())
                            // this.state.ParcelaBancoValor = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.principal ?? 0
                            // this.state.ParcelaBancoQtde = ParcelaBancoQtde
                            this.state.ParcelaBancoVencimento = this.state.ItemPickerCondicoesDaTabelaDeVenda.descricao.includes("À Vista") ? new Date() : new Date(ParcelaBancoVencimento) 
                            this.state.ParcelaBancoExiste = true
                          }
                          else
                          {
                            this.state.ParcelaBancoExiste = false
                          }    

                          if((this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))) != undefined) {
                            var ParcelaObraQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
                            var ParcelaObraVencimento = this.state.ParcelaBancoExiste == true ? new Date(ParcelaBancoVencimento) : (this.state.SinalExiste == true ? new Date(SinalVencimento) : (this.state.EntradaExiste == true ? new Date(EntradaVencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.primeiroVencimento ?? new Date())));
                            ParcelaObraVencimento.setUTCHours(23);
                            ParcelaObraVencimento.setMonth(ParcelaObraVencimento.getMonth() + (this.state.ParcelaBancoExiste == true ? parseInt(ParcelaBancoQtde) : 1));
                            ParcelaObraVencimento.setDate((this.state.ParcelaObraVencimento).getDate())
                            // this.state.ParcelaObraValor = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.principal ?? 0
                            // this.state.ParcelaObraQtde = ParcelaObraQtde
                            this.state.ParcelaObraVencimento = this.state.ItemPickerCondicoesDaTabelaDeVenda.descricao.includes("À Vista") ? new Date() : new Date(ParcelaObraVencimento) 
                            this.state.ParcelaObraExiste = true
                          } 
                          else
                          {
                            this.state.ParcelaObraExiste = false
                          }

                          var ParcelaQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
                          var ParcelaVencimento = this.state.ParcelaObraExiste == true ? new Date(ParcelaObraVencimento) : (this.state.ParcelaBancoExiste == true ? new Date(ParcelaBancoVencimento) : (this.state.SinalExiste == true ? new Date(SinalVencimento) : (this.state.EntradaExiste == true ? new Date(EntradaVencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 14)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.primeiroVencimento ?? new Date()))));
                          // this.state.ParcelaValor = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.principal ?? 0
                          // this.state.ParcelaQtde = ParcelaQtde

                          if (this.state.ItemPickerCondicoesDaTabelaDeVenda.descricao.includes("Anual") == true) {
                            ParcelaVencimento = new Date();
                            ParcelaVencimento.setUTCHours(23);
                            ParcelaVencimento.setMonth(ParcelaVencimento.getMonth() + 12);
                            ParcelaVencimento.setDate((this.state.ParcelaVencimento).getDate())
                            this.state.ParcelaVencimento = new Date(ParcelaVencimento)
                          }
                          else {
                            ParcelaVencimento.setUTCHours(23);
                            ParcelaVencimento.setMonth(ParcelaVencimento.getMonth() + (this.state.ParcelaObraExiste == true ? parseInt(ParcelaObraQtde) : (this.state.ParcelaBancoExiste == true ? parseInt(ParcelaBancoQtde) : 1)));
                            ParcelaVencimento.setDate((this.state.ParcelaVencimento).getDate())
                            this.state.ParcelaVencimento = this.state.ItemPickerCondicoesDaTabelaDeVenda.descricao.includes("À Vista") ? new Date() : new Date(ParcelaVencimento)
                          }

                          await this.setState({Renderizar: true})
                        }}/>}
                      <TextInput editable = {this.props.EmpresaLogada[0] == 4 ? false : true} placeholder = {'R$ 0,00'} placeholderTextColor = {'#8F998F'}
                        value = {formatoDeTexto.FormatarTexto(this.state.EntradaValorTotal)}
                        style = {{paddingLeft: 5, width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: (this.props.EmpresaLogada[0] == 4) ? '#26282575' : '#262825', height: 62, backgroundColor: (this.props.EmpresaLogada[0] == 4) ? '#CCCCCC50' : '#FFFFFF', borderRadius: (this.props.EmpresaLogada[0] == 4) ? 5 : 0}} 
                        numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                        onChangeText = {async (value) => {
                          this.state.EntradaValorTotal = formatoDeTexto.DesformatarTexto(value) ?? 0.00;
                          var ListaDeEntradas = [];
                          var EntradaValor = this.state.EntradaValorTotal ?? 0;
                          var EntradaQtde = this.state.EntradasQtde ?? 0;
                          this.state.EntradasQtde = parseInt(EntradaQtde) > 12 ? 12 : parseInt(EntradaQtde)

                          for (let i = 0; i < EntradaQtde; i++) {
                              let Vencimento = new Date(this.state.ListaDeEntradas[i].Vencimento);
                              ListaDeEntradas.push({
                                  Valor: (i == EntradaQtde - 1) ? (EntradaValor - (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((EntradaValor/EntradaQtde)))) * (EntradaQtde - 1)) : (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((EntradaValor/EntradaQtde)))),
                                  Vencimento: Vencimento,
                                  PickerDate: false,
                                  MeioDePagamento: this.state.ListaDeEntradas[i].MeioDePagamento,
                                  ModalMeioDePagamento: false,
                                  ModalPagamentos: false,
                                  ModalBanco: false,
                                  ModalBanderia: false,
                                  ModalMaquina: false,
                                  ModalOperacao: false,
                                  ModalReplicarDados: false,
                                  Banco: this.state.ListaDeEntradas[i].Banco,
                                  Agencia: this.state.ListaDeEntradas[i].Agencia,
                                  Conta: this.state.ListaDeEntradas[i].Conta,
                                  DigitoDaConta: this.state.ListaDeEntradas[i].DigitoDaConta,
                                  Titular: this.state.ListaDeEntradas[i].Titular,
                                  NumeroCheque: this.state.ListaDeEntradas[i].NumeroCheque,
                                  Maquina: this.state.ListaDeEntradas[i].Maquina,
                                  Bandeira: this.state.ListaDeEntradas[i].Bandeira,
                                  DigitoCartao: this.state.ListaDeEntradas[i].DigitoCartao,
                                  Operacao: this.state.ListaDeEntradas[i].Operacao,
                                  NSU: this.state.ListaDeEntradas[i].NSU,
                                  NumeroDaOperacao: this.state.ListaDeEntradas[i].NumeroDaOperacao
                              });
                          }
                          this.state.ListaDeEntradas = ListaDeEntradas
                          this.setState({Renderizar: true})
                        }}/>
                      {false && <TextInput editable = {false} style = {{width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 13, color: '#262825'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{'25/08/2020'}</TextInput>}
                    </View>
                    {this.state.ListaDeEntradas != "" &&
                    <View style = {{marginBottom: 8, marginHorizontal: 24, marginTop: 18}}>
                      <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
                        <Text style = {{width: '20%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Nº</Text>
                        <Text style = {{width: '27%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor parcela</Text>
                        <Text style = {{width: '27%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Venc.</Text>
                        <Text style = {{width: '30%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Meio de pag.</Text>
                      </View>
                    </View>}
                    {this.state.ListaDeEntradas.map((entrada, index) =>
                      <View key = {index}>
                        <View
                          style = {{
                            paddingHorizontal: 23,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            height: 62,
                        }}>
                          <View style = {{flexDirection: 'row', alignItems: 'center', width: '20%'}}>
                            <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: this.props.StyleGlobal.cores.background}}>{formatoDeTexto.NumeroInteiro(index + 1)}ª</Text>
                          </View>
                          <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                            <View style = {{flexDirection: 'row', alignItems: 'center', width: '30%', height: 52, backgroundColor: this.props.EmpresaLogada[0] == 8 ? '#CCCCCC50' : '#FFFFFF', borderRadius: this.props.EmpresaLogada[0] == 8? 5 : 0}}>
                              <TextInput editable = {this.props.EmpresaLogada[0] == 8 ? false : true} placeholder = {'R$ 0,00'} placeholderTextColor = {'#8F998F'}
                                value = {formatoDeTexto.FormatarTexto((entrada.Valor))}
                                style = {{textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: this.props.EmpresaLogada[0] == 8 ? '#26282575' : '#262825', height: 52}}
                                numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                onChangeText = {async (value) => {
                                  let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                  ListaDeEntradas[index].Valor = (formatoDeTexto.DesformatarTexto(value) ?? 0.00);
                                  this.setState({ListaDeEntradas: ListaDeEntradas})
                              }}/>
                            </View>
                            <View style = {{flexDirection: 'row', alignItems: 'center', width: '30%'}}>
                              <View>
                                <DateTimePickerModal
                                  isVisible = {entrada.PickerDate}
                                  mode = {"date"}
                                  locale = {"pt-BR"}
                                  is24Hour = {true}
                                  date = {entrada.Vencimento}
                                  maximumDate = {new Date((new Date().getFullYear() + 2).toString() + "-01-01")}
                                  headerTextIOS = {"Vencimento"}
                                  cancelTextIOS = {"Cancelar"}
                                  confirmTextIOS = {"Confirmar"}
                                  onConfirm = { async (date) => {
                                    const currentDate = date || entrada.Vencimento
                                    let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                    ListaDeEntradas[index].Vencimento = currentDate;
                                    entrada.PickerDate = false
                                    this.setState({ListaDeEntradas: ListaDeEntradas});
                                  }}
                                  onCancel = {  async () => {
                                    entrada.PickerDate = false
                                    await this.setState({Renderizar: this.state.Renderizar})
                                  }}
                                />
                                <TouchableOpacity 
                                  onPress = { async () => {
                                    entrada.PickerDate == false ? entrada.PickerDate = true : entrada.PickerDate = false
                                    await this.setState({Renderizar: this.state.Renderizar})
                                  }} 
                                  activeOpacity = {1}>
                                  {true &&
                                    <>
                                    <View>
                                      <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text
                                          style = {{
                                            flexDirection: 'column',
                                            borderColor: this.props.StyleGlobal.cores.background,
                                            color: '#262825',
                                            fontStyle: 'normal',
                                            fontWeight: 'normal',
                                            fontSize: 11,
                                            textAlignVertical: 'center',
                                        }}>{moment(entrada.Vencimento, true).format('DD/MM/YYYY')}</Text>
                                        <Icon name = "event" size = {10} color = {this.props.StyleGlobal.cores.background} style = {{marginLeft: 5}}/>
                                      </View>
                                    </View>
                                    </>
                                  }
                                </TouchableOpacity>
                              </View>
                            </View>
                            <View style = {{flexDirection: 'row', alignItems: 'center', width: '30%', justifyContent: 'space-between'}}>
                              <TouchableOpacity
                                onPress = {async () => {
                                  entrada.ModalPagamentos = true
                                  await this.setState({Renderizar: true})
                                }}>
                                <Text style = {{fontSize: 11}} numberOfLines = {1} ellipsizeMode = {'tail'}>{entrada.MeioDePagamento == '' ? 'Selecione' : entrada.MeioDePagamento}</Text>
                              </TouchableOpacity>
                              {entrada.MeioDePagamento != '' && (entrada.MeioDePagamento == 'Cheque' || entrada.MeioDePagamento == 'Cartao' || entrada.MeioDePagamento == 'Deposito' || entrada.MeioDePagamento == 'Transferencia' || entrada.MeioDePagamento == "PIX") &&
                              <Icon name = 'add-circle' color = {this.props.StyleGlobal.cores.background} size = {15} style = {{marginLeft: 5, marginTop: 2}}
                                onPress = { async () => {
                                  entrada.ModalMeioDePagamento = true;
                                  this.setState({Renderizar: true})
                              }}/>}
                              <Modal // Modal meio de pagamento entradas
                                visible = {entrada.ModalPagamentos == true ? true : false}
                                transparent = {false}
                                animationType = {'slide'}
                              >
                                <View 
                                  style = {{ 
                                    backgroundColor: this.props.StyleGlobal.cores.background, 
                                    height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
                                    justifyContent: "center",
                                    shadowColor: '#00000050', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 1
                                  }}>
                                  <View 
                                    style = {{
                                      flexDirection: 'row', 
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      marginTop: 10,
                                  }}>
                                    <Icon name = {'keyboard-arrow-down'} color = {'#FFFFFF'} size = {40} style = {{}}
                                      onPress = {async () => {
                                        entrada.ModalPagamentos = false
                                        await this.setState({Renderizar: false})
                                      }}/>
                                    <Text
                                      style = {{
                                        fontStyle: 'normal',
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        textAlign: 'center',
                                        color: '#FFFFFF'
                                    }}>Meio de pagamento</Text>
                                    <View style = {{width: 40}}></View>
                                  </View>
                                </View>
                                <ScrollView ref = {(ref) => this.ScrollViewEntradas = ref}
                                  showsHorizontalScrollIndicator = {false}
                                  horizontal = {true}
                                  pagingEnabled
                                  onMomentumScrollEnd = {async (e) => {}}>
                                  <View 
                                    style = {{
                                      minHeight: Dimensions.get('window').height - 190, 
                                      borderTopWidth: 0, 
                                      marginBottom: 20,
                                      backgroundColor: "#F6F8F5"
                                  }}>
                                    <FlatList
                                      contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                                      showsVerticalScrollIndicator = {false}
                                      ref = {(ref) => {this.FlatListEntradas = ref}}
                                      data = {this.state.FormasDePagamento}
                                      keyExtractor = {item => String(item.id)}
                                      renderItem = {({ item }) => (
                                        <>
                                          <TouchableOpacity activeOpacity = {0.75} key = {item.id} style = {{paddingHorizontal: 5}}
                                            onPress = {async () => {
                                              let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                              if(entrada.MeioDePagamento != item.descricao)
                                              {
                                                ListaDeEntradas[index].MeioDePagamento = item.descricao;
                                                ListaDeEntradas[index].Banco = { chave: '', Valor: '' };
                                                ListaDeEntradas[index].Agencia = '';
                                                ListaDeEntradas[index].Conta = '';
                                                ListaDeEntradas[index].DigitoDaConta = '';
                                                ListaDeEntradas[index].Titular = '';
                                                ListaDeEntradas[index].NumeroCheque = '';
                                                ListaDeEntradas[index].Maquina = { chave: '', Valor: '' };
                                                ListaDeEntradas[index].Bandeira = { chave: '', Valor: '' };
                                                ListaDeEntradas[index].DigitoCartao = '';
                                                ListaDeEntradas[index].Operacao = {chave: '', Valor: ''};
                                                ListaDeEntradas[index].NSU = '';
                                                ListaDeEntradas[index].NumeroDaOperacao = '';
                                                entrada.ModalPagamentos = false;
                                                this.setState({ListaDeEntradas: ListaDeEntradas})
                                              }
                                              else
                                              {
                                                entrada.ModalPagamentos = false;
                                                this.setState({ListaDeEntradas: ListaDeEntradas})
                                              }
                                            }}>
                                            <View 
                                              style = {{
                                                backgroundColor: item.descricao == entrada.MeioDePagamento ? this.props.StyleGlobal.cores.background : '#FFFFFF',
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
                                                  color: item.descricao == entrada.MeioDePagamento ? "#FFFFFF" : '#262825',
                                                  fontWeight: item.descricao == entrada.MeioDePagamento ? 'bold' : 'normal',
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
                                </ScrollView>
                              </Modal>
                            </View>
                          </View>
                        </View>
                        <Modal // Modal meio de pagamento CHEQUE
                          visible = {(entrada.MeioDePagamento == "Cheque" && entrada.ModalMeioDePagamento == true) ? true : false}
                          transparent = {false}
                          animationType = {'slide'}
                        >
                          <View
                            style = {{ flex: 1}}>
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
                                  justifyContent: 'space-between',
                                  marginTop: 10
                              }}>
                                <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'} style = {{}}
                                  onPress = {async () => {
                                    entrada.ModalMeioDePagamento = false
                                    await this.setState({Renderizar: true})
                                }}/>
                                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                  <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>{formatoDeTexto.NumeroInteiro(index + 1)}ª</Text>
                                  <Text style = {{textAlign: 'left', color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, marginRight: 5}} numberOfLines = {1} ellipsizeMode = {'tail'}>Entrada</Text>
                                </View>
                                <View style = {{width: 40}}></View>
                              </View>
                            </View>
                            <ScrollView ref = {(ref) => this.ScrollViewModalCheque = ref}
                              showsVerticalScrollIndicator = {false}
                              pagingEnabled
                              onMomentumScrollEnd = {async (e) => {}}>
                            <View 
                              style = {{
                                paddingHorizontal: 15, 
                                paddingTop: 10,
                                minHeight: Dimensions.get('window').height - 190,
                                backgroundColor: "#F6F8F5"
                            }}>

                              <View // Valor
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F', 
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor da parcela</Text>
                                <View 
                                  style = {{
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                    width: '100%',
                                }}>
                                  <TextInput editable = {true} placeholder = {'R$ 0,00'} placeholderTextColor = {'#8F998F'}
                                    value = {formatoDeTexto.FormatarTexto((entrada.Valor))}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                      ListaDeEntradas[index].Valor = (formatoDeTexto.DesformatarTexto(value) ?? 0.00);
                                      this.setState({ListaDeEntradas: ListaDeEntradas})
                                    }}/>
                                </View>
                              </View>
                              <View // Meio de pagamento
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F', 
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                              }}>Meio de pagamento</Text>
                                <TextInput
                                  editable = {false}
                                  value = {entrada.MeioDePagamento}
                                  style = {{
                                    flexDirection: 'column',
                                    width: '100%',
                                    padding: 10,
                                    backgroundColor: '#CCCCCC50',
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    color: '#262825',
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    fontSize: 14,
                                    borderRadius: 5
                              }}/>
                              </View>
                              <View // Banco
                                style = {{
                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }}>Banco</Text>
                                <TouchableOpacity 
                                  activeOpacity = {1}
                                  style = {{
                                    width: '100%',
                                    paddingVertical: 10,
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    borderRadius: 5,
                                    backgroundColor: '#FFFFFF',
                                  }}
                                  onPress = { async () => {
                                    entrada.ModalBanco = true
                                    await this.setState({Renderizar: true})
                                  }}>
                                    <Text
                                      style = {{
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 14,
                                        marginLeft: 10
                                    }}>{entrada.Banco.chave == "" ? "Selecione o banco" : String(entrada.Banco.chave).concat(": ").concat(entrada.Banco.Valor)}</Text>
                                </TouchableOpacity>
                              </View>
                              <View // agencia
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Agência</Text>
                                <View 
                                  style = {{
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                  <TextInput editable = {true} placeholder = {'00000'} placeholderTextColor = {'#8F998F'}
                                    value = {entrada.Agencia}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                      ListaDeEntradas[index].Agencia = value;
                                      this.setState({ListaDeEntradas: ListaDeEntradas});
                                    }}/>
                                </View>
                              </View>
                              <View // conta // digito da conta
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Conta</Text>
                                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                  <View 
                                    style = {{
                                      width: '50%'
                                  }}>
                                    <TextInput editable = {true} placeholder = {'00000'} placeholderTextColor = {'#8F998F'}
                                      value = {entrada.Conta}
                                      style = {{
                                        flexDirection: 'column',
                                        padding: 10,
                                        backgroundColor: '#FFFFFF',
                                        borderWidth: 1,
                                        borderColor: 'rgba(16, 22, 26, 0.15)',
                                        marginTop: 4,
                                        marginBottom: 8,
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 14,
                                        borderRadius: 5
                                      }}
                                      numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                      onChangeText = {async (value) => {
                                        let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                        ListaDeEntradas[index].Conta = value;
                                        this.setState({ListaDeEntradas: ListaDeEntradas});
                                      }}/>
                                  </View>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text 
                                      style = {{
                                        textAlign: 'left', 
                                        color: '#8F998F',
                                        fontStyle: 'normal', 
                                        fontWeight: 'bold', 
                                        fontSize: 14,
                                        marginLeft: 5
                                    }} numberOfLines = {1} ellipsizeMode = {'tail'}>- </Text>
                                    <View 
                                      style = {{
                                        width: '50%'
                                    }}>
                                      <TextInput editable = {true} placeholder = {'00'} placeholderTextColor = {'#8F998F'}
                                        value = {entrada.DigitoDaConta}
                                        style = {{
                                          flexDirection: 'column',
                                          width: '100%',
                                          padding: 10,
                                          backgroundColor: '#FFFFFF',
                                          borderWidth: 1,
                                          borderColor: 'rgba(16, 22, 26, 0.15)',
                                          marginTop: 4,
                                          marginBottom: 8,
                                          color: '#262825',
                                          fontStyle: 'normal',
                                          fontWeight: 'normal',
                                          fontSize: 14,
                                          borderRadius: 5
                                        }}
                                        numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                        onChangeText = {async (value) => {
                                          let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                          ListaDeEntradas[index].DigitoDaConta = value;
                                          this.setState({ListaDeEntradas: ListaDeEntradas});
                                        }}/>
                                    </View>
                                  </View>
                                </View>
                              </View>
                              <View // titular
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Titular</Text>
                                <View 
                                  style = {{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                  <TextInput editable = {true} placeholder = {'Informe o nominal'} placeholderTextColor = {'#8F998F'}
                                    value = {entrada.Titular}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                      ListaDeEntradas[index].Titular = value;
                                      this.setState({ListaDeEntradas: ListaDeEntradas});
                                    }}/>
                                </View>
                              </View>
                              <View // N° do cheque
                                style = {{
                                  
                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>N° do cheque</Text>
                                <View 
                                  style = {{
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                  <TextInput editable = {true} placeholder = {'Informe o número'} placeholderTextColor = {'#8F998F'}
                                    value = {entrada.NumeroCheque}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                      ListaDeEntradas[index].NumeroCheque = value;
                                      this.setState({ListaDeEntradas: ListaDeEntradas});
                                    }}/>
                                </View>
                              </View>

                            </View>
                            </ScrollView>
                            <View style = {{paddingHorizontal: 20, backgroundColor: '#FFFFFF'}}>
                              <TouchableOpacity
                                style = {{
                                  width: '100%', 
                                  backgroundColor: this.props.StyleGlobal.cores.botao,
                                  paddingHorizontal: 16,
                                  height: 58,
                                  borderRadius: 5,
                                  alignItems: 'center',
                                  justifyContent: "center",
                                  marginBottom: 20
                              }}
                                onPress = {async () => {
                                  if(entrada.Banco.Valor != '' || entrada.Agencia != '' || entrada.Conta != '' || entrada.DigitoDaConta != '' || entrada.Titular != '' || entrada.NumeroCheque != '')
                                  {
                                    let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                    let EntradasVazias = []
                                    EntradasVazias = ListaDeEntradas.filter((Item_, Index_) => (Index_ > index && Item_.MeioDePagamento == entrada.MeioDePagamento && (Item_.Banco.Valor ?? "") == "" && (Item_.Agencia ?? "") == "" && (Item_.Conta ?? "") == "" && (Item_.DigitoDaConta ?? "") == "" && (Item_.Titular ?? "") == "" && (Item_.NumeroCheque ?? "") == ""))
                                    this.state.TextoEntradas = `Existe mais de uma entrada com o meio de pagamento ${String(entrada.MeioDePagamento).toLowerCase()}, deseja manter os mesmos dados de pagamentos?\n`;
                                    ListaDeEntradas.map((Item__, Index__) => {
                                        if ((Index__ > index && Item__.MeioDePagamento == entrada.MeioDePagamento && (Item__.Banco.Valor ?? "") == "" && (Item__.Agencia ?? "") == "" && (Item__.Conta ?? "") == "" && (Item__.DigitoDaConta ?? "") == "" && (Item__.Titular ?? "") == "" && (Item__.NumeroCheque ?? "") == ""))
                                        {
                                          this.state.TextoEntradas +=  `\nEntrada ${formatoDeTexto.NumeroInteiro(Index__ + 1)}, Vencimento: ${moment(Item__.Vencimento, true).format("DD/MM/YYYY")}, Valor: ${formatoDeTexto.FormatarTexto(Item__.Valor)}\n`;
                                        }
                                    })
                                    this.state.TextoEntradas += "\n";
                                    if(EntradasVazias.length > 0)
                                    {
                                      Alert.alert(
                                        'Caro Usuário',
                                        `${this.state.TextoEntradas}`,
                                        [
                                          {
                                            text: 'Não',
                                            onPress: async () => {
                                              let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                              ListaDeEntradas[index].ModalMeioDePagamento = false;
                                              await this.setState({ListaDeEntradas: ListaDeEntradas})
                                            },
                                            style: 'cancel',
                                          },
                                          { 
                                            text: 'Sim',
                                            onPress: async () => {
                                              let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                              ListaDeEntradas.map(async (Item_, Index_) => {
                                                  if(Index_ > index && Item_.MeioDePagamento == entrada.MeioDePagamento && (Item_.Banco.Valor ?? "") == "" && (Item_.Agencia ?? "") == "" && (Item_.Conta ?? "") == "" && (Item_.DigitoDaConta ?? "") == "" && (Item_.Titular ?? "") == "" && (Item_.NumeroCheque ?? "") == "")
                                                  {
                                                      Item_.Banco = entrada.Banco
                                                      Item_.Agencia = entrada.Agencia
                                                      Item_.Conta = entrada.Conta
                                                      Item_.DigitoDaConta = entrada.DigitoDaConta
                                                      Item_.Titular = entrada.Titular
                                                      Item_.NumeroCheque = entrada.NumeroCheque
                                                      entrada.ModalMeioDePagamento = false
                                                  }
                                              }),
                                              ListaDeEntradas[index].ModalMeioDePagamento = false;
                                              await this.setState({ListaDeEntradas: ListaDeEntradas})
                                            }}
                                        ],
                                        {cancelable: false},
                                      )
                                    }
                                    else
                                    {
                                      let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                      entrada.ModalMeioDePagamento = false
                                      await this.setState({ListaDeEntradas: ListaDeEntradas})
                                    }
                                  }
                                  else
                                  {
                                    entrada.ModalMeioDePagamento = false
                                    this.setState({Renderizar: true})
                                  }
                                }}>
                                <Text
                                  style = {{
                                    fontStyle: 'normal',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    textAlign: 'center',
                                    color: '#FFFFFF',
                                    alignSelf: 'center',
                                }}>Recolher informações</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Modal // Banco
                            visible = {(entrada.ModalBanco === true ? true : false)}
                            transparent = {false}
                            animationType = {"slide"}>
                            <View style = {{flex: 1}}>
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
                                    justifyContent: 'space-between',
                                }}>
                                  <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'}
                                    onPress = {async () => {
                                      entrada.ModalBanco = false
                                      await this.setState({Renderizar: true})
                                  }}/>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>Banco</Text>
                                  </View>
                                <View style = {{width: 40}}></View>
                                </View> 
                              </View>
                              <ScrollView ref = {(ref) => this.ScrollViewBanco = ref}
                                showsHorizontalScrollIndicator = {false}
                                horizontal = {true}
                                pagingEnabled
                                onMomentumScrollEnd = {async (e) => {}}>
                                <View
                                  style = {{
                                    minHeight: Dimensions.get('window').height - 190, 
                                    borderTopWidth: 0, 
                                    marginBottom: 20,
                                    backgroundColor: "#F6F8F5"
                                }}>
                                  <FlatList
                                    contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                                    showsVerticalScrollIndicator = {false}
                                    ref = {(ref) => {this.FlatListBanco = ref}}
                                    data = {this.state.ListaBanco}
                                    keyExtractor = {(item) => String(item.chave)}
                                    renderItem = {({item, index}) => (
                                      <TouchableOpacity activeOpacity = {0.75} key = {item.chave} style = {{paddingHorizontal: 8}}
                                        onPress = { async () => {
                                          if(item.Valor != entrada.Banco.Valor)
                                          {
                                            entrada.Banco.chave = item.chave;
                                            entrada.Banco.Valor = item.Valor;
                                            entrada.ModalBanco = false;
                                            await this.setState({Renderizar: true})
                                          }
                                          else
                                          {
                                            entrada.ModalBanco = false;
                                            await this.setState({Renderizar: true})
                                          }
                                        }}>
                                          <View 
                                            style = {{
                                              backgroundColor: item.Valor == entrada.Banco.Valor ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                                              paddingHorizontal: 16,
                                              width: '100%',
                                              borderWidth: 1,
                                              borderColor: 'rgba(16, 22, 26, 0.15)',
                                              borderRadius: 5,
                                              height: 58,
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginVertical: 5,
                                          }}>
                                            <Text 
                                              style = {{
                                                paddingVertical: 0,
                                                fontSize: 12,
                                                color: item.Valor == entrada.Banco.Valor ? '#FFFFFF' : '#262825',
                                                fontWeight: item.Valor == entrada.Banco.Valor ? 'bold' : 'normal',
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                            }}>{String(item.chave).concat(": ").concat(item.Valor)}</Text>
                                          </View>
                                      </TouchableOpacity>
                                    )}
                                    refreshing = {true}
                                  />
                                </View>
                              </ScrollView>
                            </View>
                          </Modal>
                        </Modal>
                        <Modal // Modal meio de pagamento CARTÃO
                          visible = {(entrada.MeioDePagamento == "Cartao" && entrada.ModalMeioDePagamento == true) ? true : false}
                          transparent = {false}
                          animationType = {'slide'}>
                          <View style = {{ flex: 1 }}>
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
                                  justifyContent: 'space-between',
                                  marginTop: 10,
                              }}>
                                <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'} style = {{}}
                                  onPress = {() => {
                                    entrada.ModalMeioDePagamento = false
                                    this.setState({Renderizar: true})
                                }}/>
                                <View
                                  style = {{flexDirection: 'row', alignItems: 'center'}}>
                                  <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>{formatoDeTexto.NumeroInteiro(index + 1)}ª</Text>
                                  <Text style = {{textAlign: 'left', color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, marginRight: 5}} numberOfLines = {1} ellipsizeMode = {'tail'}>Entrada</Text>
                                </View>
                                <View style = {{width: 40}}></View>
                              </View>
                            </View>
                            <ScrollView ref = {(ref) => this.ScrollViewModalCartao = ref}
                              showsVerticalScrollIndicator = {false}
                              pagingEnabled
                              onMomentumScrollEnd = {async (e) => {}}>
                            <View 
                              style = {{
                                paddingHorizontal: 15, 
                                paddingTop: 10,
                                minHeight: Dimensions.get('window').height - 190,
                                backgroundColor: "#F6F8F5"
                            }}>

                              <View // Valor
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor da parcela</Text>
                                <View 
                                  style = {{
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                  <TextInput editable = {true} placeholder = {'R$ 0,00'} placeholderTextColor = {'#8F998F'}
                                    value = {formatoDeTexto.FormatarTexto((entrada.Valor))}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                      ListaDeEntradas[index].Valor = (formatoDeTexto.DesformatarTexto(value) ?? 0.00);
                                      this.setState({ListaDeEntradas: ListaDeEntradas})
                                    }}/>
                                </View>
                              </View>
                              <View // Meio de pagamento
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                              }}>Meio de pagamento</Text>
                                <TextInput
                                  editable = {false}
                                  value = {entrada.MeioDePagamento}
                                  style = {{
                                    flexDirection: 'column',
                                    width: '100%',
                                    padding: 10,
                                    backgroundColor: '#CCCCCC50',
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    color: '#262825',
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    fontSize: 14,
                                    borderRadius: 5
                                }}/>
                              </View>
                              <View // Maquina
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                              }}>Máquina</Text>
                                <TouchableOpacity 
                                  activeOpacity = {1}
                                  style = {{
                                    width: '100%',
                                    paddingVertical: 10,
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    borderRadius: 5,
                                    backgroundColor: "#FFFFFF"
                                  }}
                                  onPress = { async () => {
                                    entrada.ModalMaquina = true
                                    await this.setState({Renderizar: true})
                                  }}>
                                    <Text
                                      style = {{
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 14,
                                        marginLeft: 10
                                    }}>{entrada.Maquina.chave == "" ? "Selecione a máquina" : String(entrada.Maquina.Valor)}</Text>
                                </TouchableOpacity>
                              </View>
                              <View // Dígito do cartão
                                style = {{
                                  
                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Dígito do cartão</Text>
                                <TextInput editable = {true} placeholder = {'Informe os últimos 04 dígitos do cartão'} placeholderTextColor = {'#8F998F'}
                                  value = {entrada.DigitoCartao}
                                  style = {{
                                    flexDirection: 'column',
                                    width: '100%',
                                    padding: 10,
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    color: '#262825',
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    fontSize: 14,
                                    borderRadius: 5
                                  }}
                                  numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                  onChangeText = {async (value) => {
                                    let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                    ListaDeEntradas[index].DigitoCartao = value;
                                    this.setState({ListaDeEntradas: ListaDeEntradas});
                                  }}/>
                              </View>
                              <View // Bandeira
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                              }}>Bandeira</Text>
                                <TouchableOpacity 
                                  activeOpacity = {1}
                                  style = {{
                                    width: '100%',
                                    paddingVertical: 10,
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    borderRadius: 5,
                                    backgroundColor: "#FFFFFF"
                                  }}
                                  onPress = { async () => {
                                    entrada.ModalBandeira = true
                                    await this.setState({Renderizar: true})
                                  }}>
                                    <Text
                                      style = {{
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 14,
                                        marginLeft: 10
                                    }}>{entrada.Bandeira.chave == "" ? "Selecione a bandeira" : String(entrada.Bandeira.Valor)}</Text>
                                </TouchableOpacity>
                              </View>
                              <View // Operacao
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }}>Operação</Text>
                                <TouchableOpacity 
                                  activeOpacity = {1}
                                  style = {{
                                    width: '100%',
                                    paddingVertical: 10,
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    borderRadius: 5,
                                    backgroundColor: "#FFFFFF"
                                  }}
                                  onPress = { async () => {
                                    entrada.ModalOperacao = true
                                    await this.setState({Renderizar: true})
                                  }}>
                                    <Text
                                      style = {{
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 14,
                                        marginLeft: 10
                                    }}>{entrada.Operacao.Valor == "" ? "Selecione a operação" : String(entrada.Operacao.Valor)}</Text>
                                </TouchableOpacity>
                              </View>
                              <View // NSU
                                style = {{
                                  
                                }}>
                                  <Text 
                                    style = {{
                                      textAlign: 'left', 
                                      color: '#8F998F',
                                      fontStyle: 'normal', 
                                      fontWeight: 'bold',
                                      fontSize: 14,
                                      marginBottom: 5
                                  }} numberOfLines = {1} ellipsizeMode = {'tail'}>NSU</Text>
                                  <TextInput editable = {true} placeholder = {"Informe O NSU"} placeholderTextColor = {'#8F998F'}
                                    value = {entrada.NSU}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                      ListaDeEntradas[index].NSU = value;
                                      this.setState({ListaDeEntradas: ListaDeEntradas});
                                    }}/>
                              </View>                          
                            
                            </View>
                            </ScrollView>
                            <View style = {{paddingHorizontal: 20, backgroundColor: '#FFFFFF'}}>
                              <TouchableOpacity
                                style = {{
                                  width: '100%', 
                                  backgroundColor: this.props.StyleGlobal.cores.botao,
                                  paddingHorizontal: 16,
                                  borderRadius: 5,
                                  height: 58,
                                  alignItems: 'center',
                                  justifyContent: "center",
                                  marginBottom: 20
                              }}
                                onPress = {async () => {
                                    if(entrada.Maquina.Valor != '' || entrada.DigitoCartao != '' || entrada.Bandeira.Valor != '' || entrada.Operacao.Valor != '' || entrada.NSU != '')
                                    {
                                      let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                      let EntradasVazias = []
                                      EntradasVazias = ListaDeEntradas.filter((Item_, Index_) => (Index_ > index && Item_.MeioDePagamento == entrada.MeioDePagamento && (Item_.Maquina.Valor ?? "") == "" && (Item_.DigitoCartao ?? "") == "" && (Item_.Bandeira.Valor ?? "") == "" && (Item_.Operacao.Valor ?? "") == "" && (Item_.NSU ?? "") == ""))
                                      this.state.TextoEntradas = `Existe mais de uma entrada com o meio de pagamento ${String(entrada.MeioDePagamento).toLowerCase()}, deseja manter os mesmos dados de pagamentos?\n`;
                                      ListaDeEntradas.map((Item__, Index__) => {
                                          if ((Index__ > index && Item__.MeioDePagamento == entrada.MeioDePagamento && (Item__.Maquina.Valor ?? "") == "" && (Item__.DigitoCartao ?? "") == "" && (Item__.Bandeira.Valor ?? "") == "" && (Item__.Operacao.Valor ?? "") == "" && (Item__.NSU ?? "") == ""))
                                          {
                                            this.state.TextoEntradas +=  `\nEntrada ${formatoDeTexto.NumeroInteiro(Index__ + 1)}, Vencimento: ${moment(Item__.Vencimento, true).format("DD/MM/YYYY")}, Valor: ${formatoDeTexto.FormatarTexto(Item__.Valor)}\n`;
                                          }
                                      })
                                      this.state.TextoEntradas += "\n";
                                      if(EntradasVazias.length > 0)
                                      {
                                        Alert.alert(
                                          'Caro Usuário',
                                          `${this.state.TextoEntradas}`,
                                          [
                                            {
                                              text: 'Não',
                                              onPress: async () => {
                                                let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                                ListaDeEntradas[index].ModalMeioDePagamento = false;
                                                await this.setState({ListaDeEntradas: ListaDeEntradas})
                                              },
                                              style: 'cancel',
                                            },
                                            { text: 'Sim',
                                              onPress: async () => {
                                                let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                                ListaDeEntradas.map(async (Item_, Index_) => {
                                                    if(Index_ > index && Item_.MeioDePagamento == entrada.MeioDePagamento && (Item_.Maquina.Valor ?? "") == "" && (Item_.DigitoCartao ?? "") == "" && (Item_.Bandeira.Valor ?? "") == "" && (Item_.Operacao.Valor ?? "") == "" && (Item_.NSU ?? "") == "")
                                                    {
                                                        Item_.Maquina = entrada.Maquina
                                                        Item_.DigitoCartao = entrada.DigitoCartao
                                                        Item_.Bandeira = entrada.Bandeira
                                                        Item_.Operacao = entrada.Operacao
                                                        Item_.NSU = entrada.NSU
                                                        entrada.ModalMeioDePagamento = false
                                                    }
                                                });
                                                ListaDeEntradas[index].ModalMeioDePagamento = false;
                                                await this.setState({ListaDeEntradas: ListaDeEntradas})
                                              }}
                                          ],
                                          {cancelable: false},
                                        )
                                      }
                                      else
                                      {
                                        let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                        entrada.ModalMeioDePagamento = false
                                        await this.setState({ListaDeEntradas: ListaDeEntradas})
                                      }
                                    }
                                    else
                                    {
                                      entrada.ModalMeioDePagamento = false
                                      this.setState({Renderizar: true})
                                    }
                                }}>
                                <Text
                                  style = {{
                                    fontStyle: 'normal',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    textAlign: 'center',
                                    color: '#FFFFFF',
                                    alignSelf: 'center',
                                }}>Recolher informações</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Modal // Maquina
                            visible = {(entrada.ModalMaquina === true ? true : false)}
                            transparent = {false}
                            animationType = {"slide"}>
                            <View style = {{flex: 1}}>
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
                                    justifyContent: 'space-between'
                                }}>
                                  <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'}
                                    onPress = {async () => {
                                      entrada.ModalMaquina = false
                                      await this.setState({Renderizar: true})
                                  }}/>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>Máquina</Text>
                                  </View>
                                <View style = {{width: 40}}/>
                                </View> 
                              </View>
                              <ScrollView ref = {(ref) => this.ScrollViewMaquina = ref}
                                showsHorizontalScrollIndicator = {false}
                                horizontal = {true}
                                pagingEnabled
                                onMomentumScrollEnd = {async (e) => {}}>
                                <View
                                  style = {{
                                    minHeight: Dimensions.get('window').height - 190, 
                                    borderTopWidth: 0, 
                                    marginBottom: 20,
                                    backgroundColor: "#F6F8F5"
                                }}>
                                  <FlatList
                                    contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                                    showsVerticalScrollIndicator = {false}
                                    ref = {(ref) => {this.FlatListMaquina = ref}}
                                    data = {this.state.ListaMaquina}
                                    keyExtractor = {(item) => String(item.chave)}
                                    renderItem = {({item, index}) => (
                                      <TouchableOpacity activeOpacity = {0.75} key = {item.chave} style = {{paddingHorizontal: 8}}
                                        onPress = { async () => {
                                          if(item.Valor != entrada.Maquina.Valor)
                                          {
                                            entrada.Maquina.chave = item.chave;
                                            entrada.Maquina.Valor = item.Valor;
                                            entrada.ModalMaquina = false;
                                            await this.setState({Renderizar: true})
                                          }
                                          else
                                          {
                                            entrada.ModalMaquina = false;
                                            await this.setState({Renderizar: true})
                                          }
                                        }}>
                                          <View 
                                            style = {{
                                              backgroundColor: item.Valor == entrada.Maquina.Valor ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                                              paddingHorizontal: 16,
                                              width: '100%',
                                              borderWidth: 1,
                                              borderColor: 'rgba(16, 22, 26, 0.15)',
                                              borderRadius: 5,
                                              height: 58,
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginVertical: 5,
                                          }}>
                                            <Text 
                                              style = {{
                                                paddingVertical: 0,
                                                fontSize: 12,
                                                color: item.Valor == entrada.Maquina.Valor ? '#FFFFFF' : '#262825',
                                                fontWeight: item.Valor == entrada.Maquina.Valor ? 'bold' : 'normal',
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                            }}>{String(item.Valor)}</Text>
                                          </View>
                                      </TouchableOpacity>
                                    )}
                                    refreshing = {true}
                                  />
                                </View>
                              </ScrollView>
                            </View>
                          </Modal>
                          <Modal // Bandeira
                            visible = {(entrada.ModalBandeira === true ? true : false)}
                            transparent = {false}
                            animationType = {"slide"}>
                            <View style = {{flex: 1}}>
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
                                    justifyContent: 'space-between'
                                }}>
                                  <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'}
                                    onPress = {async () => {
                                      entrada.ModalBandeira = false
                                      await this.setState({Renderizar: true})
                                  }}/>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>Bandeira</Text>
                                  </View>
                                <View style = {{width: 40}}></View>
                                </View> 
                              </View>
                              <ScrollView ref = {(ref) => this.ScrollViewBandeira = ref}
                                showsHorizontalScrollIndicator = {false}
                                horizontal = {true}
                                pagingEnabled
                                onMomentumScrollEnd = {async (e) => {}}>
                                <View
                                  style = {{
                                    minHeight: Dimensions.get('window').height - 190, 
                                    borderTopWidth: 0, 
                                    marginBottom: 20,
                                    backgroundColor: "#F6F8F5"
                                }}>
                                  <FlatList
                                    contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                                    showsVerticalScrollIndicator = {false}
                                    ref = {(ref) => {this.FlatListBandera = ref}}
                                    data = {this.state.ListaBandeira}
                                    keyExtractor = {(item) => String(item.chave)}
                                    renderItem = {({item, index}) => (
                                      <TouchableOpacity activeOpacity = {0.75} key = {item.chave} style = {{paddingHorizontal: 8}}
                                        onPress = { async () => {
                                          if(item.Valor != entrada.Bandeira.Valor)
                                          {
                                            entrada.Bandeira.chave = item.chave;
                                            entrada.Bandeira.Valor = item.Valor;
                                            entrada.ModalBandeira = false;
                                            await this.setState({Renderizar: true})
                                          }
                                          else
                                          {
                                            entrada.ModalBandeira = false;
                                            await this.setState({Renderizar: true})
                                          }
                                        }}>
                                          <View 
                                            style = {{
                                              backgroundColor: item.Valor == entrada.Bandeira.Valor ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                                              padding: 16,
                                              width: '100%',
                                              borderWidth: 1,
                                              borderColor: 'rgba(16, 22, 26, 0.15)',
                                              borderRadius: 5,
                                              height: 58,
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginVertical: 5
                                          }}>
                                            <Text 
                                              style = {{
                                                paddingVertical: 0,
                                                fontSize: 12,
                                                color: item.Valor == entrada.Bandeira.Valor ? '#FFFFFF' : '#262825',
                                                fontWeight: item.Valor == entrada.Bandeira.Valor ? 'bold' : 'normal',
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                            }}>{String(item.Valor)}</Text>
                                          </View>
                                      </TouchableOpacity>
                                    )}
                                    refreshing = {true}
                                  />
                                </View>
                              </ScrollView>
                            </View>
                          </Modal>
                          <Modal // Operacao
                            visible = {(entrada.ModalOperacao === true ? true : false)}
                            transparent = {false}
                            animationType = {"slide"}>
                            <View style = {{flex: 1}}>
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
                                    justifyContent: 'space-between'
                                }}>
                                  <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'}
                                    onPress = {async () => {
                                      entrada.ModalOperacao = false
                                      await this.setState({Renderizar: true})
                                  }}/>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>Operação</Text>
                                  </View>
                                <View style = {{width: 40}}></View>
                                </View> 
                              </View>
                              <ScrollView ref = {(ref) => this.ScrollViewOperacao = ref}
                                showsHorizontalScrollIndicator = {false}
                                horizontal = {true}
                                pagingEnabled
                                onMomentumScrollEnd = {async (e) => {}}>
                                <View
                                  style = {{
                                    minHeight: Dimensions.get('window').height - 190, 
                                    borderTopWidth: 0, 
                                    marginBottom: 20,
                                    backgroundColor: "#F6F8F5"
                                }}>
                                  <FlatList
                                    contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                                    showsVerticalScrollIndicator = {false}
                                    ref = {(ref) => {this.FlatListOperacao = ref}}
                                    data = {this.state.ListaOperacao}
                                    keyExtractor = {(item) => String(item.chave)}
                                    renderItem = {({item, index_}) => (
                                      <TouchableOpacity activeOpacity = {0.75} key = {item.chave} style = {{paddingHorizontal: 5}}
                                        onPress = { async () => {
                                          if(item.Valor != entrada.Operacao.Valor)
                                          {
                                            let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                            entrada.Operacao.chave = item.chave;
                                            entrada.Operacao.Valor = item.Valor;

                                            if (entrada.MeioDePagamento == "Cartao" && entrada.Operacao.Valor == "Débito") { 
                                              const EhDiaUtil = require('eh-dia-util');
                                              let Vencimento = new Date();
                                              Vencimento.setDate(Vencimento.getDate() + 1);
                                              while (EhDiaUtil(Vencimento) == false) {
                                                Vencimento.setDate(Vencimento.getDate() + 1);
                                              }
                                              ListaDeEntradas[index].Vencimento = Vencimento;
                                            }
                                            if (entrada.MeioDePagamento == "Cartao" && entrada.Operacao.Valor != "Débito") {
                                              ListaDeEntradas.map((Item_, Index_) => {
                                                  if (Index_ >= index) {
                                                      let Vencimento = new Date(this.state.DataDaProposta);
                                                      Vencimento.setDate(Vencimento.getDate() + (1 + Index_ - index) * 30);
                                                      Item_.Vencimento = Vencimento;
                                                  }
                                              });
                                            }
                                            else {
                                              ListaDeEntradas[index].Vencimento = ListaDeEntradas[index].Vencimento;
                                            }

                                            entrada.ModalOperacao = false;
                                            await this.setState({Renderizar: true})
                                          }
                                          else
                                          {
                                            entrada.ModalOperacao = false;
                                            await this.setState({Renderizar: true})
                                          }
                                        }}>
                                          <View 
                                            style = {{
                                              backgroundColor: item.Valor == entrada.Operacao.Valor ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                                              paddingHorizontal: 16,
                                              width: '100%',
                                              borderWidth: 1,
                                              borderColor: 'rgba(16, 22, 26, 0.15)',
                                              borderRadius: 5,
                                              height: 58,
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginVertical: 5
                                          }}>
                                            <Text 
                                              style = {{
                                                paddingVertical: 0,
                                                fontSize: 12,
                                                color: item.Valor == entrada.Operacao.Valor ? '#FFFFFF': '#262825',
                                                fontWeight: item.Valor == entrada.Operacao.Valor ? 'bold' : 'normal',
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                            }}>{String(item.Valor)}</Text>
                                          </View>
                                      </TouchableOpacity>
                                    )}
                                    refreshing = {true}
                                  />
                                </View>
                              </ScrollView>
                            </View>
                          </Modal>
                        </Modal>
                        <Modal // Modal meio de pagamento DEPOSITO ou TRANSFERENCIA ou PIX
                          visible = {((entrada.MeioDePagamento == "Deposito" || entrada.MeioDePagamento == "Transferencia" || entrada.MeioDePagamento == "PIX") && entrada.ModalMeioDePagamento == true) ? true : false}
                          transparent = {false}
                          animationType = {'slide'}
                        >
                          <View style = {{flex: 1}}>
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
                                  justifyContent: 'space-between',
                                  marginTop: 10
                              }}>
                                <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'} style = {{}}
                                  onPress = {() => {
                                    entrada.ModalMeioDePagamento = false
                                    this.setState({Renderizar: true})
                                }}/>
                                <View
                                  style = {{flexDirection: 'row', alignItems: 'center'}}>
                                  <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>{formatoDeTexto.NumeroInteiro(index + 1)}ª</Text>
                                  <Text style = {{textAlign: 'left', color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, marginRight: 5}} numberOfLines = {1} ellipsizeMode = {'tail'}>Entrada</Text>
                                </View>
                                <View style = {{width: 40}}></View>
                              </View>
                            </View>
                            <ScrollView ref = {(ref) => this.ScrollViewModalDepositoTrans = ref}
                              showsVerticalScrollIndicator = {false}
                              pagingEnabled
                              onMomentumScrollEnd = {async (e) => {}}>
                            <View 
                              style = {{
                                paddingHorizontal: 15, 
                                paddingTop: 10,
                                minHeight: Dimensions.get('window').height - 190,
                                backgroundColor: "#F6F8F5"
                            }}>
                              <View // Valor
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor da parcela</Text>
                                <View 
                                  style = {{
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                  <TextInput editable = {true} placeholder = {'R$ 0,00'} placeholderTextColor = {'#8F998F'}
                                    value = {formatoDeTexto.FormatarTexto((entrada.Valor))}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                      ListaDeEntradas[index].Valor = (formatoDeTexto.DesformatarTexto(value) ?? 0.00);
                                      this.setState({ListaDeEntradas: ListaDeEntradas})
                                    }}/>
                                </View>
                              </View>
                              <View // Meio de pagamento
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                              }}>Meio de pagamento</Text>
                                <TextInput
                                  editable = {false}
                                  value = {entrada.MeioDePagamento}
                                  style = {{
                                    flexDirection: 'column',
                                    width: '100%',
                                    padding: 10,
                                    backgroundColor: '#CCCCCC50',
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    color: '#262825',
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    fontSize: 14,
                                    borderRadius: 5
                                }}/>
                              </View>
                              <View // Numero da operacao
                                style = {{

                                }}>
                                  <Text 
                                    style = {{
                                      textAlign: 'left', 
                                      color: '#8F998F',
                                      fontStyle: 'normal', 
                                      fontWeight: 'bold',
                                      fontSize: 14,
                                      marginBottom: 5
                                  }} numberOfLines = {1} ellipsizeMode = {'tail'}>N° da operação</Text>
                                  <TextInput editable = {true} placeholder = {"00000"} placeholderTextColor = {'#8F998F'}
                                    value = {entrada.NumeroDaOperacao}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                      ListaDeEntradas[index].NumeroDaOperacao = value;
                                      this.setState({ListaDeEntradas: ListaDeEntradas});
                                    }}/>
                              </View>                                  
                            </View>
                            </ScrollView>
                            <View style = {{paddingHorizontal: 20, backgroundColor: '#FFFFFF'}}>
                              <TouchableOpacity
                                style = {{
                                  width: '100%', 
                                  backgroundColor: this.props.StyleGlobal.cores.botao,
                                  paddingHorizontal: 16,
                                  height: 58,
                                  alignItems: 'center',
                                  justifyContent: "center",
                                  marginBottom: 20,
                                  borderRadius: 5
                              }}
                                onPress = {async () => {
                                    if(entrada.NumeroDaOperacao != '')
                                    {
                                      let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                      let EntradasVazias = []
                                      EntradasVazias = ListaDeEntradas.filter((Item_, Index_) => (Index_ > index && Item_.MeioDePagamento == entrada.MeioDePagamento && (Item_.NumeroDaOperacao ?? "") == ""))
                                      this.state.TextoEntradas = `Existe mais de uma entrada com o meio de pagamento ${String(entrada.MeioDePagamento).toLowerCase()}, deseja manter os mesmos dados de pagamentos?\n`;
                                      ListaDeEntradas.map((Item__, Index__) => {
                                          if ((Index__ > index && Item__.MeioDePagamento == entrada.MeioDePagamento && (Item__.NumeroDaOperacao ?? "") == ""))
                                          {
                                            this.state.TextoEntradas +=  `\nEntrada ${formatoDeTexto.NumeroInteiro(Index__ + 1)}, Vencimento: ${moment(Item__.Vencimento, true).format("DD/MM/YYYY")}, Valor: ${formatoDeTexto.FormatarTexto(Item__.Valor)}\n`;
                                          }
                                      })
                                      this.state.TextoEntradas += "\n";
                                      if(EntradasVazias.length > 0)
                                      {
                                        Alert.alert(
                                          'Caro Usuário',
                                          `${this.state.TextoEntradas}`,
                                          [
                                            {
                                              text: 'Não',
                                              onPress: async () => {
                                                let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                                ListaDeEntradas[index].ModalMeioDePagamento = false;
                                                await this.setState({ListaDeEntradas: ListaDeEntradas})
                                              },
                                              style: 'cancel',
                                            },
                                            { text: 'Sim',
                                              onPress: async () => {
                                                let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                                ListaDeEntradas.map(async (Item_, Index_) => {
                                                    if(Index_ > index && Item_.MeioDePagamento == entrada.MeioDePagamento && (Item_.NumeroDaOperacao ?? "") == "")
                                                    {
                                                        Item_.NumeroDaOperacao = entrada.NumeroDaOperacao
                                                        entrada.ModalMeioDePagamento = false
                                                    }
                                                });
                                                ListaDeEntradas[index].ModalMeioDePagamento = false;
                                                await this.setState({ListaDeEntradas: ListaDeEntradas})
                                              }}
                                          ],
                                          {cancelable: false},
                                        )
                                      }
                                      else
                                      {
                                        let ListaDeEntradas = [...this.state.ListaDeEntradas];
                                        entrada.ModalMeioDePagamento = false
                                        await this.setState({ListaDeEntradas: ListaDeEntradas})
                                      }
                                    }
                                    else
                                    {
                                      entrada.ModalMeioDePagamento = false
                                      this.setState({Renderizar: true})
                                    }
                                }}>
                                <Text
                                  style = {{
                                    fontStyle: 'normal',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    textAlign: 'center',
                                    color: '#FFFFFF',
                                    alignSelf: 'center',
                                }}>Recolher informações</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Modal>
                        
                      </View>
                    )}
                  </View>}
                  {(this.state.IntermediariaExiste == true && this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda != '') &&
                  <View
                    >
                    <View
                      style = {{
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        paddingHorizontal: 23,
                        marginTop: 24,
                      }}>
                      <View>
                        <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginBottom: 8}}>{(this.state.ListaDeIntermediarias.find(intermediaria => intermediaria.Qtde > 1) || this.state.ListaDeIntermediarias.length > 1) ? "Parcelas intermediárias" : 'Parcela intermediária'}</Text>
                        {false && <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color: '#8F998F'}}>Pagamento em: {this.state.DescricaoFormaPagamento}</Text>}
                      </View>
                      {false &&
                      <View style = {{flexDirection: 'row'}}>
                        <TouchableOpacity style = {{flexDirection: 'row', padding: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: this.props.StyleGlobal.cores.background, alignItems: 'center', marginRight: 8}}
                          onPress = {() => {}}>
                          <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 12, textAlign: 'center', color: this.props.StyleGlobal.cores.background}}>Selecione</Text>
                        </TouchableOpacity>
                      </View>}
                    </View>
                    {this.state.ListaDeIntermediarias != "" &&
                    <View style = {{marginBottom: 8, marginHorizontal: 24, marginTop: 18}}>
                      <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
                        <Text style = {{width: '20%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Qtde</Text>
                        <Text style = {{width: '20%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Dia</Text>
                        <Text style = {{width: '30%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Mês referência</Text>
                        <Text style = {{width: '30%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor principal</Text>
                      </View>
                    </View>}
                    {this.state.ListaDeIntermediarias.map((intermediaria, index) =>
                      <View key = {index}>
                        <View
                          style = {{
                            paddingHorizontal: 23,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            height: 62,
                        }}>
                          <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                            <TextInput editable = {true} placeholder = {'00'} placeholderTextColor = {'#8F998F'}
                              value = {formatoDeTexto.NumeroInteiro(intermediaria.Qtde)}
                              style = {{width: '20%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#262825', height: 52}}
                              numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                              onChangeText = {async (value) => {
                                let ListaDeIntermediarias = [...this.state.ListaDeIntermediarias];
                                ListaDeIntermediarias[index].Qtde = ((value) ?? 0);
                                ListaDeIntermediarias[index].ValorPMT = ListaDeIntermediarias[index].Qtde > 0 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(Math.abs(PMT(0.01, parseInt(ListaDeIntermediarias[index].Qtde), parseFloat(ListaDeIntermediarias[index].Qtde * ListaDeIntermediarias[index].Valor), 0, 0)))) : 0;
                                ListaDeIntermediarias[index].Valor = (ListaDeIntermediarias[index].Qtde > 0 ? ListaDeIntermediarias[index].Valor : 0);
                                ListaDeIntermediarias[index].ValorTotalJuros = ListaDeIntermediarias[index].Qtde > 0 ? (ListaDeIntermediarias[index].Qtde * ListaDeIntermediarias[index].ValorPMT) : 0;
                                this.setState({ListaDeIntermediarias: ListaDeIntermediarias})
                            }}/>
                            <TextInput editable = {true} placeholder = {'00'} placeholderTextColor = {'#8F998F'}
                              value = {formatoDeTexto.NumeroInteiro(intermediaria.DiaVencimento)}
                              style = {{width: '20%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#262825', height: 52}}
                              numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                              onChangeText = {async (value) => {
                                let ListaDeIntermediarias = [...this.state.ListaDeIntermediarias];
                                ListaDeIntermediarias[index].DiaVencimento = (value ?? 0);
                                this.setState({ListaDeIntermediarias: ListaDeIntermediarias})
                            }}/>
                            <TouchableOpacity 
                              activeOpacity = {1}
                              style = {{width: '30%'}}
                              onPress = {async () => {
                                intermediaria.ModalCalendario = true
                                this.setState({Renderizar: true})
                            }}>
                              <TextInput editable = {false} placeholder = {'Selecione'} placeholderTextColor = {'#8F998F'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                value = {intermediaria.MesReferencia.descricao}
                                style = {{textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#262825'}} 
                                numberOfLines = {1} ellipsizeMode = {'tail'}
                                onChangeText = {async (value) => {}}
                              />
                            </TouchableOpacity>
                            <TextInput editable = {true} placeholder = {"R$ 0,00"} placeholderTextColor = {'#8f998f'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                              value = {formatoDeTexto.FormatarTexto((intermediaria.Valor))}
                              style = {{ width: '30%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#262825', height: 52}} 
                              numberOfLines = {1} ellipsizeMode = {'tail'} 
                              onChangeText = {async (value) => {
                                let ListaDeIntermediarias = [...this.state.ListaDeIntermediarias];
                                ListaDeIntermediarias[index].Valor = (formatoDeTexto.DesformatarTexto(value) ?? 0);
                                ListaDeIntermediarias[index].ValorPMT = ListaDeIntermediarias[index].Qtde > 0 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(Math.abs(PMT(0.01, parseInt(ListaDeIntermediarias[index].Qtde), parseFloat(ListaDeIntermediarias[index].Qtde * ListaDeIntermediarias[index].Valor), 0, 0)))) : 0;
                                ListaDeIntermediarias[index].ValorTotalJuros = (ListaDeIntermediarias[index].Qtde * ListaDeIntermediarias[index].ValorPMT)
                                this.setState({ListaDeIntermediarias: ListaDeIntermediarias})
                              }}
                            />                     
                          </View>
                          <View 
                            style = {{
                              alignItems: 'flex-end',
                              elevation: 10,
                              marginLeft: -10,
                          }}>
                            {this.state.ListaDeIntermediarias.length > 1 &&
                            <Icon name = {'close'} color = {this.props.StyleGlobal.cores.background} size = {10} 
                              style = {{
                                marginRight: 10,
                                backgroundColor: "#CCCCCC50",
                                padding: 6,
                                alignItems: 'center',
                              }}
                              onPress = {async () => {
                                if(this.state.ListaDeIntermediarias.length > 1) {
                                  this.state.ListaDeIntermediarias = this.state.ListaDeIntermediarias.filter(filtro => filtro.id != intermediaria.id)
                                  await this.state.ListaDeIntermediarias.map(async b => {
                                    if(b.id >= intermediaria.id) {
                                      b.id = b.id - 1;
                                    }
                                  })
                                }
                                this.setState({Renderizar: true})
                              }}
                            />}
                          </View>
                        </View>
                        {this.props.EmpresaLogada[0] == 8 &&
                          <View style = {{width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginBottom: 8}}>
                            <View style = {{width: '28%'}}>
                              <View style = {{marginBottom: 8, marginTop: 4}}>
                                <Text style = {{textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, paddingLeft: 5}} numberOfLines = {1} ellipsizeMode = {'tail'}>C/juros</Text>
                              </View>
                              <View  style = {{flexDirection: 'row', backgroundColor: '#CCCCCC50', height: 52, alignItems: 'center', borderTopLeftRadius: 5, borderBottomLeftRadius: 5, paddingLeft: 5, borderLeftWidth: 1.5, borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: this.props.StyleGlobal.cores.background}}>
                                <TextInput editable = {false} placeholder = {"R$ 0,00"} placeholderTextColor = {'#8f998f'} keyboardType = {'numeric'}
                                  value = {formatoDeTexto.FormatarTexto(intermediaria.ValorPMT)}
                                  style = {{textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#26282575'}} 
                                  numberOfLines = {1} ellipsizeMode = {'tail'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                  onChangeText = {async (value) => {
                                    let ListaDeIntermediarias = [...this.state.ListaDeIntermediarias];
                                    ListaDeIntermediarias[index].ValorPMT = (formatoDeTexto.DesformatarTexto(value) ?? 0);
                                    ListaDeIntermediarias[index].Valor = this.props.EmpresaLogada[0] == 8 ? (ListaDeIntermediarias[index].Qtde > 0 ? (((ListaDeIntermediarias[index].ValorPMT) * (Math.pow(1.01, parseInt(ListaDeIntermediarias[index].Qtde)) - 1))/(0.01 * Math.pow(1.01, parseInt(ListaDeIntermediarias[index].Qtde))))/ListaDeIntermediarias[index].Qtde : 0) : ListaDeIntermediarias[index].Valor;
                                    ListaDeIntermediarias[index].ValorTotalJuros = (ListaDeIntermediarias[index].Qtde * ListaDeIntermediarias[index].ValorPMT)
                                    this.setState({ListaDeIntermediarias: ListaDeIntermediarias})
                                  }}/>
                              </View>
                            </View> 
                            <View style = {{width: '32%'}}>
                              <View style = {{marginBottom: 8, marginTop: 4}}>
                                <Text style = {{textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Total C/juros</Text>
                              </View>
                              <View  style = {{flexDirection: 'row', backgroundColor: '#CCCCCC50', height: 52, alignItems: 'center', borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: this.props.StyleGlobal.cores.background}}>
                                <TextInput editable = {false} placeholder = {"R$ 0,00"} placeholderTextColor = {'#8f998f'} keyboardType = {'numeric'}
                                  value = {formatoDeTexto.FormatarTexto(intermediaria.ValorTotalJuros)}
                                  style = {{textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#26282575'}} 
                                  numberOfLines = {1} ellipsizeMode = {'tail'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                  onChangeText = {async (value) => {
                                    let ListaDeIntermediarias = [...this.state.ListaDeIntermediarias];
                                    // ListaDeIntermediarias[index].ValorTotal = formatoDeTexto.DesformatarTexto(value) ?? 0;
                                    // ListaDeIntermediarias[index].Valor = ListaDeIntermediarias[index].Qtde > 0 ? (this.props.EmpresaLogada[0] == 8 ? Math.abs(PMT(0.01, parseInt(ListaDeIntermediarias[index].Qtde), parseFloat(ListaDeIntermediarias[index].ValorTotal), 0, 0)) : (ListaDeIntermediarias[index].ValorTotal / ListaDeIntermediarias[index].Qtde)) : 0;
                                    // ListaDeIntermediarias[index].ValorTotalJuros = (ListaDeIntermediarias[index].Qtde * ListaDeIntermediarias[index].Valor)
                                    this.setState({ListaDeIntermediarias: ListaDeIntermediarias})
                                  }}/>
                              </View>
                            </View>
                          </View>}                   
                        <Modal // Modal calendario
                          visible = {intermediaria.ModalCalendario == true ? true : false}
                          transparent = {false}
                          animationType = {'slide'}
                        >
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
                                justifyContent: 'space-between'
                            }}>
                              <Icon name = {'keyboard-arrow-down'} color = {'#FFFFFF'} size = {40} style = {{ marginTop: 10 }}
                                onPress = {async () => {
                                  intermediaria.ModalCalendario = false
                                  this.setState({Renderizar: true})
                                }}/>
                              <Text
                                style = {{
                                  marginTop: 6,
                                  fontStyle: 'normal',
                                  fontWeight: '500',
                                  fontSize: 14,
                                  textAlign: 'center',
                                  color: '#FFFFFF'
                              }}>Calendário</Text>
                              <View style = {{width: 40}}></View>
                            </View>
                          </View>
                          <ScrollView ref = {(ref) => this.ScrollViewCalendario = ref}
                            showsHorizontalScrollIndicator = {false}
                            horizontal = {true}
                            pagingEnabled
                            onMomentumScrollEnd = {async (e) => {}}>
                            <View 
                              style = {{
                                minHeight: Dimensions.get('window').height - 190, 
                                borderTopWidth: 0, 
                                marginBottom: 20,
                                backgroundColor: "#F6F8F5"
                            }}>
                              <FlatList
                                contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                                showsVerticalScrollIndicator = {false}
                                ref = {(ref) => {this.FlatListModalCalendario = ref}}
                                data = {this.state.CalendarioMeses}
                                keyExtractor = {item => item.id}
                                renderItem = {({ item }) => (
                                  <>
                                    <TouchableOpacity key = {item.id}
                                      onPress = {async () => {
                                        let ListaDeIntermediarias = [...this.state.ListaDeIntermediarias];
                                        ListaDeIntermediarias[index].MesReferencia.id = item.id;
                                        ListaDeIntermediarias[index].MesReferencia.descricao = item.descricao;
                                        intermediaria.ModalCalendario = false;
                                        this.setState({ListaDeIntermediarias: ListaDeIntermediarias})
                                      }}>
                                      <View 
                                        style = {{
                                          backgroundColor: '#FFFFFF',
                                          padding: 16,
                                          width: '100%',
                                          borderWidth: 1,
                                          borderColor: 'rgba(16, 22, 26, 0.15)',
                                          marginBottom: 4
                                      }}>
                                        <Text 
                                          style = {{
                                            paddingVertical: 0,
                                            fontSize: 12,
                                            color: item.descricao == intermediaria.MesReferencia.descricao ? this.props.StyleGlobal.cores.background : '#262825',
                                            fontWeight: item.descricao == intermediaria.MesReferencia.descricao ? 'bold' : 'normal',
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
                          </ScrollView>
                        </Modal>                      
                      </View>                    
                    )}
                    <View 
                      style = {{
                        marginTop: 10,
                        alignItems: 'flex-end',
                        elevation: 10,
                    }}>
                      <Icon name = {'add'} color = {this.props.StyleGlobal.cores.background} size = {20} 
                        style = {{
                          marginRight: 10,
                          backgroundColor: "#CCCCCC50",
                          padding: 6,
                          alignItems: 'center',
                        }}
                        onPress = {async () => {
                          var IntermediariaVencimento = new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 14)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.primeiroVencimento ?? new Date());

                          let Vencimento = new Date(IntermediariaVencimento)
                          Vencimento.setUTCHours(23);
                          Vencimento.setMonth(Vencimento.getMonth() + 12);
                          this.state.ListaDeIntermediarias.push({
                            id: this.state.ListaDeIntermediarias.length,
                            Valor: 0,
                            ValorTotal: 0,
                            ValorTotalJuros: 0,
                            Vencimento: this.state.ItemPickerCondicoesDaTabelaDeVenda.descricao.includes("À Vista") ? new Date() : Vencimento,
                            PickerDate: false,
                            Qtde: 1,
                            MeioDePagamento: "Boleto",
                            MesReferencia: {id: 0, descricao: ''},
                            DiaVencimento: Vencimento.getDate(),
                            ModalMeioDePagamento: false,
                            ModalCalendario: false,
                            Banco: { chave: '', Valor: '' }, 
                            Agencia: '',
                            Conta: '',
                            DigitoDaConta: '',
                            Titular: '',
                            NumeroCheque: '',
                            Maquina: { chave: '', Valor: '' },
                            Bandeira: { chave: '', Valor: '' },
                            DigitoCartao: '',
                            Operacao: {chave: '', Valor: ''},
                            NSU: '',
                            NumeroDaOperacao: ''
                          })
                          this.setState({Renderizar: true})
                        }}
                      />
                    </View>
                  </View>}
                  {(this.state.SinalExiste == true && true && this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda != '') &&
                  <View
                    >
                    <View
                      style = {{
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        paddingHorizontal: 23,
                        marginTop: 24,
                    }}>
                      <View>
                        <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginBottom: 8}}>Sinal</Text>
                      </View>
                      {false &&
                      <View style = {{flexDirection: 'row'}}>
                        <TouchableOpacity style = {{flexDirection: 'row', padding: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: this.props.StyleGlobal.cores.background, alignItems: 'center', marginRight: 8}}
                          onPress = {() => {this.setVisibilidadeModalEntradas(true)}}>
                          <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 12, textAlign: 'center', color: this.props.StyleGlobal.cores.background}}>Selecione</Text>
                        </TouchableOpacity>
                      </View>}
                    </View>
                    <View style = {{marginBottom: 8, marginHorizontal: 24, marginTop: 18}}>
                      <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
                        <Text style = {{width: '20%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Qtde</Text>
                        <Text style = {{width: '30%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor total</Text>
                        {false && <Text style = {{width: '40%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Vencimento</Text>}
                      </View>
                    </View>
                    <View style = {{width: '100%', flexDirection: 'row', backgroundColor: '#FFFFFF', height: 62, alignItems: 'center', paddingHorizontal: 24}}>
                      <TextInput editable = {true} placeholder = {formatoDeTexto.NumeroInteiro("0")} placeholderTextColor = {'#8F998F'}
                        value = {formatoDeTexto.NumeroInteiro(this.state.SinalQtde)}
                        style = {{ width: '20%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#8F998F', height: 52}}
                        numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                        onChangeText = {async (value) => {
                          var ListaDeSinais = [];
                          var SinalValor = this.state.SinalValorTotal ?? 0;
                          var SinalQtde = value > 12 ? '12' : value;
                          var SinalVencimento = this.state.EntradaExiste == true ?  new Date(this.state.ListaDeEntradas[this.state.ListaDeEntradas.length - 1].Vencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 2)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.primeiroVencimento ?? new Date());

                          this.state.SinalQtde = parseInt(SinalQtde) > 12 ? 12 : parseInt(SinalQtde)

                          for (let i = 0; i < SinalQtde; i++) {
                              let Vencimento = new Date(SinalVencimento);
                              Vencimento.setUTCHours(23);
                              Vencimento.setMonth(SinalVencimento.getMonth() + 1);
                              ListaDeSinais.push({
                                  Valor: (i == SinalQtde - 1) ? (SinalValor - (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((SinalValor/SinalQtde)))) * (SinalQtde - 1)) : (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((SinalValor/SinalQtde)))),
                                  Vencimento: Vencimento,
                                  PickerDate: false,
                                  MeioDePagamento: "Boleto",
                                  ModalMeioDePagamento: false,
                                  ModalPagamentos: false,
                                  ModalBanco: false,
                                  ModalBanderia: false,
                                  ModalMaquina: false,
                                  ModalOperacao: false,
                                  ModalReplicarDados: false,                   
                                  Banco: { chave: '', Valor: '' }, 
                                  Agencia: '',
                                  Conta: '',
                                  DigitoDaConta: '',
                                  Titular: '',
                                  NumeroCheque: '',
                                  Maquina: { chave: '', Valor: '' },
                                  Bandeira: { chave: '', Valor: '' },
                                  DigitoCartao: '',
                                  Operacao: {chave: '', Valor: ''},
                                  NSU: '',
                                  NumeroDaOperacao: ''
                              });
                              SinalVencimento = Vencimento;
                          }
                          this.state.ListaDeSinais = ListaDeSinais

                          if((this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))) != undefined)
                          {
                            var ParcelaBancoQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
                            var ParcelaBancoVencimento = this.state.ListaDeSinais != "" ? new Date(SinalVencimento) : (this.state.ListaDeEntradas != "" ? new Date(EntradaVencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.primeiroVencimento ?? new Date()));
                            ParcelaBancoVencimento.setUTCHours(23);
                            ParcelaBancoVencimento.setMonth(ParcelaBancoVencimento.getMonth() + 1);
                            ParcelaBancoVencimento.setDate((this.state.ParcelaBancoVencimento).getDate())
                            // this.state.ParcelaBancoValor = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.principal ?? 0
                            // this.state.ParcelaBancoQtde = ParcelaBancoQtde
                            this.state.ParcelaBancoVencimento = this.state.ItemPickerCondicoesDaTabelaDeVenda.descricao.includes("À Vista") ? new Date() : new Date(ParcelaBancoVencimento) 
                            this.state.ParcelaBancoExiste = true
                          } 
                          else
                          {
                            this.state.ParcelaBancoExiste = false
                          }

                          if((this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))) != undefined) {
                            var ParcelaObraQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
                            var ParcelaObraVencimento = this.state.ParcelaBancoExiste == true ? new Date(ParcelaBancoVencimento) : (this.state.SinalExiste == true ? new Date(SinalVencimento) : (this.state.EntradaExiste == true ? new Date(EntradaVencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.primeiroVencimento ?? new Date())));
                            ParcelaObraVencimento.setUTCHours(23);
                            ParcelaObraVencimento.setMonth(ParcelaObraVencimento.getMonth() + (this.state.ParcelaBancoExiste == true ? parseInt(ParcelaBancoQtde) : 1));
                            ParcelaObraVencimento.setDate((this.state.ParcelaObraVencimento).getDate())
                            // this.state.ParcelaObraValor = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.principal ?? 0
                            // this.state.ParcelaObraQtde = ParcelaObraQtde
                            this.state.ParcelaObraVencimento = this.state.ItemPickerCondicoesDaTabelaDeVenda.descricao.includes("À Vista") ? new Date() : new Date(ParcelaObraVencimento) 
                            this.state.ParcelaObraExiste = true
                          } 
                          else
                          {
                            this.state.ParcelaObraExiste = false
                          }

                          var ParcelaQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
                          var ParcelaVencimento = this.state.ParcelaObraExiste == true ? new Date(ParcelaObraVencimento) : (this.state.ParcelaBancoExiste == true ? new Date(ParcelaBancoVencimento) : (this.state.SinalExiste == true ? new Date(SinalVencimento) : (this.state.EntradaExiste == true ? new Date(EntradaVencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 14)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.primeiroVencimento ?? new Date()))));
                          // this.state.ParcelaValor = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.principal ?? 0
                          // this.state.ParcelaQtde = ParcelaQtde
                          
                          if (this.state.ItemPickerCondicoesDaTabelaDeVenda.descricao.includes("Anual") == true) {
                            ParcelaVencimento = new Date();
                            ParcelaVencimento.setUTCHours(23);
                            ParcelaVencimento.setMonth(ParcelaVencimento.getMonth() + 12);
                            ParcelaVencimento.setDate((this.state.ParcelaVencimento).getDate())
                            this.state.ParcelaVencimento = new Date(ParcelaVencimento)
                          }
                          else {
                            ParcelaVencimento.setUTCHours(23);
                            ParcelaVencimento.setMonth(ParcelaVencimento.getMonth() + (this.state.ParcelaObraExiste == true ? parseInt(ParcelaObraQtde) : (this.state.ParcelaBancoExiste == true ? parseInt(ParcelaBancoQtde) : 1)));
                            ParcelaVencimento.setDate((this.state.ParcelaVencimento).getDate())
                            this.state.ParcelaVencimento = this.state.ItemPickerCondicoesDaTabelaDeVenda.descricao.includes("À Vista") ? new Date() : new Date(ParcelaVencimento)
                          }
                          await this.setState({Renderizar: true})
                        }}/>
                      <TextInput editable = {true} placeholder = {'R$ 0,00'} placeholderTextColor = {'#8F998F'}
                        value = {formatoDeTexto.FormatarTexto(this.state.SinalValorTotal)}
                        style = {{paddingLeft: 5, width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: (this.props.EmpresaLogada[0] == 4) ? '#26282575' : '#262825', height: 62, backgroundColor: (this.props.EmpresaLogada[0] == 4) ? '#CCCCCC50' : '#FFFFFF', borderRadius: (this.props.EmpresaLogada[0] == 4) ? 5 : 0}} 
                        numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                        onChangeText = {async (value) => {
                          this.state.SinalValorTotal = formatoDeTexto.DesformatarTexto(value) ?? 0.00;
                          var ListaDeSinais = [];
                          var SinalValor = this.state.SinalValorTotal ?? 0;
                          var SinalQtde = this.state.SinalQtde ?? 0;
                          this.state.SinalQtde = parseInt(SinalQtde) > 12 ? 12 : parseInt(SinalQtde)

                          for (let i = 0; i < SinalQtde; i++) {
                              let Vencimento = new Date(this.state.ListaDeSinais[i].Vencimento);
                              ListaDeSinais.push({
                                  Valor: (i == SinalQtde - 1) ? (SinalValor - (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((SinalValor/SinalQtde)))) * (SinalQtde - 1)) : (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((SinalValor/SinalQtde)))),
                                  Vencimento: Vencimento,
                                  PickerDate: false,
                                  MeioDePagamento: "Boleto",
                                  ModalMeioDePagamento: false,
                                  ModalPagamentos: false,
                                  ModalBanco: false,
                                  ModalBanderia: false,
                                  ModalMaquina: false,
                                  ModalOperacao: false,
                                  ModalReplicarDados: false,                  
                                  Banco: { chave: '', Valor: '' }, 
                                  Agencia: '',
                                  Conta: '',
                                  DigitoDaConta: '',
                                  Titular: '',
                                  NumeroCheque: '',
                                  Maquina: { chave: '', Valor: '' },
                                  Bandeira: { chave: '', Valor: '' },
                                  DigitoCartao: '',
                                  Operacao: {chave: '', Valor: ''},
                                  NSU: '',
                                  NumeroDaOperacao: ''
                              });
                          }
                          this.state.ListaDeSinais = ListaDeSinais

                          this.setState({Renderizar: true})
                        }}/>
                      {false && <TextInput editable = {false} style = {{width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 13, color: '#262825'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{'25/08/2020'}</TextInput>}
                    </View>
                    {this.state.ListaDeSinais != "" &&
                    <View style = {{marginBottom: 8, marginHorizontal: 24, marginTop: 18}}>
                      <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
                        <Text style = {{width: '20%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Nº</Text>
                        <Text style = {{width: '27%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor parcela</Text>                      
                        <Text style = {{width: '27%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Venc.</Text>
                        <Text style = {{width: '30%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Meio de pag.</Text>
                      </View>
                    </View>}
                    {this.state.ListaDeSinais.map((sinal, index) =>
                      <View key = {index}>
                        <View
                          style = {{
                            paddingHorizontal: 23,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            height: 62,
                        }}>
                          <View style = {{flexDirection: 'row', alignItems: 'center', width: '20%'}}>
                            <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: this.props.StyleGlobal.cores.background}}>{formatoDeTexto.NumeroInteiro(index + 1)}ª</Text>
                          </View>
                          <View style = {{ flexDirection: 'row', alignItems: 'center'}}>
                            <View style = {{flexDirection: 'row', alignItems: 'center', width: '30%'}}>
                              <TextInput editable = {true} placeholder = {'R$ 0,00'} placeholderTextColor = {'#8F998F'}
                                value = {formatoDeTexto.FormatarTexto((sinal.Valor))}
                                style = {{textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#262825', height: 52}}
                                numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                onChangeText = {async (value) => {
                                  let ListaDeSinais = [...this.state.ListaDeSinais];
                                  ListaDeSinais[index].Valor = (formatoDeTexto.DesformatarTexto(value) ?? 0.00);
                                  this.setState({ListaDeSinais: ListaDeSinais})
                                }}/>
                            </View>
                            <View style = {{flexDirection: 'row', alignItems: 'center', width: '30%'}}>
                              <View>
                                <DateTimePickerModal
                                  isVisible = {sinal.PickerDate}
                                  mode = {"date"}
                                  locale = {"pt-BR"}
                                  is24Hour = {true}
                                  date = {sinal.Vencimento}
                                  maximumDate = {new Date((new Date().getFullYear() + 2).toString() + "-01-01")}
                                  headerTextIOS = {"Vencimento"}
                                  cancelTextIOS = {"Cancelar"}
                                  confirmTextIOS = {"Confirmar"}
                                  onConfirm = { async (date) => {
                                    const currentDate = date || sinal.Vencimento
                                    let ListaDeSinais = [...this.state.ListaDeSinais];
                                    ListaDeSinais[index].Vencimento = currentDate;
                                    sinal.PickerDate = false
                                    this.setState({ListaDeSinais: ListaDeSinais});
                                  }}
                                  onCancel = {  async () => {
                                    sinal.PickerDate = false
                                    await this.setState({Renderizar: this.state.Renderizar})
                                  }}
                                />
                                <TouchableOpacity 
                                  onPress = {async() => {
                                    sinal.PickerDate == false ? sinal.PickerDate = true : sinal.PickerDate = false
                                    await this.setState({Renderizar: this.state.Renderizar})
                                }} activeOpacity = {1}>
                                  {true &&
                                    <>
                                    <View style = {{}}>
                                      <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text
                                          style = {{
                                            flexDirection: 'column',
                                            borderColor: this.props.StyleGlobal.cores.background,
                                            color: '#262825',
                                            fontStyle: 'normal',
                                            fontWeight: 'normal',
                                            fontSize: 11,
                                            textAlignVertical: 'center',
                                        }}>{format(sinal.Vencimento, 'dd/MM/yyyy')}</Text>
                                        <Icon name = "event" size = {10} color = {this.props.StyleGlobal.cores.background} style = {{marginLeft: 5}}/>
                                      </View>
                                    </View>
                                    </>
                                  }
                                </TouchableOpacity>
                              </View>
                            </View>
                            <View style = {{flexDirection: 'row', alignItems: 'center', width: '30%', justifyContent: 'space-between'}}>
                              <TouchableOpacity
                                onPress = {async () => {
                                  sinal.ModalPagamentos = true
                                  await this.setState({Renderizar: true})
                                }}>
                                <Text style = {{fontSize: 11}}>{sinal.MeioDePagamento == '' ? 'Selecione' : sinal.MeioDePagamento}</Text>
                              </TouchableOpacity>
                              {sinal.MeioDePagamento != '' && (sinal.MeioDePagamento == 'Cheque' || sinal.MeioDePagamento == 'Cartao' || sinal.MeioDePagamento == 'Deposito' || sinal.MeioDePagamento == 'Transferencia' || sinal.MeioDePagamento == "PIX") &&
                              <Icon name = 'add-circle' color = {this.props.StyleGlobal.cores.background} size = {15} style = {{marginLeft: 5, marginTop: 2}}
                                onPress = { async () => { 
                                  sinal.ModalMeioDePagamento = true;
                                  this.setState({Renderizar: true})
                              }}/>}
                              <Modal // Modal meio de pagamento sinal
                                visible = {sinal.ModalPagamentos == true ? true : false}
                                transparent = {false}
                                animationType = {'slide'}
                              >
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
                                      justifyContent: 'space-between',
                                      marginTop: 10,
                                  }}>
                                    <Icon name = {'keyboard-arrow-down'} color = {'#FFFFFF'} size = {40} style = {{}}
                                      onPress = {async () => {
                                        sinal.ModalPagamentos = false
                                        await this.setState({Renderizar: false})
                                      }}/>
                                    <Text
                                      style = {{
                                        fontStyle: 'normal',
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        textAlign: 'center',
                                        color: '#FFFFFF'
                                    }}>Meio de pagamento</Text>
                                    <View style = {{width: 40}}></View>
                                  </View>
                                </View>
                                <ScrollView ref = {(ref) => this.ScrollViewEntradas = ref}
                                  showsHorizontalScrollIndicator = {false}
                                  horizontal = {true}
                                  pagingEnabled
                                  onMomentumScrollEnd = {async (e) => {}}>
                                  <View 
                                    style = {{
                                      minHeight: Dimensions.get('window').height - 190, 
                                      borderTopWidth: 0, 
                                      marginBottom: 20,
                                      backgroundColor: "#F6F8F5"
                                  }}>
                                    <FlatList
                                      contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                                      showsVerticalScrollIndicator = {false}
                                      ref = {(ref) => {this.FlatListEntradas = ref}}
                                      data = {this.state.FormasDePagamento}
                                      keyExtractor = {item => String(item.id)}
                                      renderItem = {({ item }) => (
                                        <>
                                          <TouchableOpacity activeOpacity = {0.75} key = {item.id} style = {{paddingHorizontal: 5}}
                                            onPress = {async () => {
                                              let ListaDeSinais = [...this.state.ListaDeSinais];
                                              if(ListaDeSinais[index].MeioDePagamento != item.descricao)
                                              {
                                                ListaDeSinais[index].MeioDePagamento = item.descricao;
                                                ListaDeSinais[index].Banco = { chave: '', Valor: '' };
                                                ListaDeSinais[index].Agencia = '';
                                                ListaDeSinais[index].Conta = '';
                                                ListaDeSinais[index].DigitoDaConta = '';
                                                ListaDeSinais[index].Titular = '';
                                                ListaDeSinais[index].NumeroCheque = '';
                                                ListaDeSinais[index].Maquina = { chave: '', Valor: '' };
                                                ListaDeSinais[index].Bandeira = { chave: '', Valor: '' };
                                                ListaDeSinais[index].DigitoCartao = '';
                                                ListaDeSinais[index].Operacao = {chave: '', Valor: ''};
                                                ListaDeSinais[index].NSU = '';
                                                ListaDeSinais[index].NumeroDaOperacao = '';
                                                sinal.ModalPagamentos = false;
                                                await this.setState({ListaDeSinais: ListaDeSinais})
                                              }
                                              else
                                              {                     
                                                sinal.ModalPagamentos = false;
                                                await this.setState({ListaDeSinais: ListaDeSinais})
                                              }
                                            }}>
                                            <View 
                                              style = {{
                                                backgroundColor: item.descricao == sinal.MeioDePagamento ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                                                paddingHorizontal: 16,
                                                width: '100%',
                                                borderWidth: 1,
                                                borderColor: 'rgba(16, 22, 26, 0.15)',
                                                borderRadius: 5,
                                                marginVertical: 5,
                                                height: 58,
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                              <Text 
                                                style = {{
                                                  paddingVertical: 0,
                                                  fontSize: 12,
                                                  color: item.descricao == sinal.MeioDePagamento ? "#FFFFFF" : '#262825',
                                                  fontWeight: item.descricao == sinal.MeioDePagamento ? 'bold' : 'normal',
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
                                </ScrollView>
                              </Modal>
                            </View>
                          </View>
                        </View>
                        <Modal // Modal meio de pagamento CHEQUE
                          visible = {(sinal.MeioDePagamento == "Cheque" && sinal.ModalMeioDePagamento == true) ? true : false}
                          transparent = {false}
                          animationType = {'slide'}
                        >
                          <View 
                            style = {{ flex: 1}}>
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
                                  justifyContent: 'space-between',
                                  marginTop: 10
                              }}>
                                <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'} style = {{}}
                                  onPress = {() => {
                                    sinal.ModalMeioDePagamento = false
                                    this.setState({Renderizar: true})
                                }}/>
                                <View
                                  style = {{flexDirection: 'row', alignItems: 'center'}}>
                                  <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>{formatoDeTexto.NumeroInteiro(index + 1)}ª</Text>
                                  <Text style = {{textAlign: 'left', color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, marginRight: 5}} numberOfLines = {1} ellipsizeMode = {'tail'}>Sinal</Text>
                                </View>
                                <View style = {{width: 40}}></View>
                              </View>
                            </View>
                            <ScrollView ref = {(ref) => this.ScrollViewModalChequeSinal = ref}
                              showsVerticalScrollIndicator = {false}
                              pagingEnabled
                              onMomentumScrollEnd = {async (e) => {}}>
                            <View 
                              style = {{
                                paddingHorizontal: 15, 
                                paddingTop: 10,
                                minHeight: Dimensions.get('window').height - 190,
                                backgroundColor: "#F6F8F5"
                            }}>

                              <View // Valor
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor da parcela</Text>
                                <View 
                                  style = {{
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                  <TextInput editable = {true} placeholder = {'R$ 0,00'} placeholderTextColor = {'#8F998F'}
                                    value = {formatoDeTexto.FormatarTexto(sinal.Valor)}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeSinais = [...this.state.ListaDeSinais];
                                      ListaDeSinais[index].Valor = (formatoDeTexto.DesformatarTexto(value) ?? 0.00);
                                      this.setState({ListaDeSinais: ListaDeSinais})
                                    }}/>
                                </View>
                              </View>
                              <View // Meio de pagamento
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F', 
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                              }}>Meio de pagamento</Text>
                                <TextInput
                                  editable = {false}
                                  value = {sinal.MeioDePagamento}
                                  style = {{
                                    flexDirection: 'column',
                                    width: '100%',
                                    padding: 10,
                                    backgroundColor: '#CCCCCC50',
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    color: '#262825',
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    fontSize: 14,
                                    borderRadius: 5
                              }}/>
                              </View>
                              <View // Banco
                                style = {{
                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F', 
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                              }}>Banco</Text>
                                <TouchableOpacity 
                                  activeOpacity = {1}
                                  style = {{
                                    width: '100%',
                                    paddingVertical: 10,
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    borderRadius: 5
                                  }}
                                  onPress = { async () => {
                                    sinal.ModalBanco = true
                                    await this.setState({Renderizar: true})
                                  }}>
                                    <Text
                                      style = {{
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 14,
                                        marginLeft: 10
                                    }}>{sinal.Banco.chave == "" ? "Selecione o banco" : String(sinal.Banco.chave).concat(": ").concat(sinal.Banco.Valor)}</Text>
                                </TouchableOpacity>
                              </View>
                              <View // agencia
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Agência</Text>
                                <View 
                                  style = {{
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                  <TextInput editable = {true} placeholder = {'00000'} placeholderTextColor = {'#8F998F'}
                                    value = {sinal.Agencia}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeSinais = [...this.state.ListaDeSinais];
                                      ListaDeSinais[index].Agencia = value;
                                      this.setState({ListaDeSinais: ListaDeSinais});
                                    }}/>
                                </View>
                              </View>
                              <View // conta // digito da conta
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Conta</Text>
                                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                  <View 
                                    style = {{
                                      width: '50%'
                                  }}>
                                    <TextInput editable = {true} placeholder = {'00000'} placeholderTextColor = {'#8F998F'}
                                      value = {sinal.Conta}
                                      style = {{
                                        flexDirection: 'column',
                                        padding: 10,
                                        backgroundColor: '#FFFFFF',
                                        borderWidth: 1,
                                        borderColor: 'rgba(16, 22, 26, 0.15)',
                                        marginTop: 4,
                                        marginBottom: 8,
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 14,
                                        borderRadius: 5
                                      }}
                                      numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                      onChangeText = {async (value) => {
                                        let ListaDeSinais = [...this.state.ListaDeSinais];
                                        ListaDeSinais[index].Conta = value;
                                        this.setState({ListaDeSinais: ListaDeSinais});
                                      }}/>
                                  </View>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text 
                                      style = {{
                                        textAlign: 'left', 
                                        color: '#8F998F',
                                        fontStyle: 'normal', 
                                        fontWeight: 'bold', 
                                        fontSize: 14,
                                        marginLeft: 5
                                    }} numberOfLines = {1} ellipsizeMode = {'tail'}>- </Text>
                                    <View 
                                      style = {{
                                        width: '50%'
                                    }}>
                                      <TextInput editable = {true} placeholder = {'00'} placeholderTextColor = {'#8F998F'}
                                        value = {sinal.DigitoDaConta}
                                        style = {{
                                          flexDirection: 'column',
                                          width: '100%',
                                          padding: 10,
                                          backgroundColor: '#FFFFFF',
                                          borderWidth: 1,
                                          borderColor: 'rgba(16, 22, 26, 0.15)',
                                          marginTop: 4,
                                          marginBottom: 8,
                                          color: '#262825',
                                          fontStyle: 'normal',
                                          fontWeight: 'normal',
                                          fontSize: 14,
                                          borderRadius: 5
                                        }}
                                        numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'}
                                        onChangeText = {async (value) => {
                                          let ListaDeSinais = [...this.state.ListaDeSinais];
                                          ListaDeSinais[index].DigitoDaConta = value;
                                          this.setState({ListaDeSinais: ListaDeSinais});
                                        }}/>
                                    </View>
                                  </View>
                                </View>
                              </View>
                              <View // titular
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Titular</Text>
                                <View 
                                  style = {{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                  <TextInput editable = {true} placeholder = {'Informe o nominal'} placeholderTextColor = {'#8F998F'}
                                    value = {sinal.Titular}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeSinais = [...this.state.ListaDeSinais];
                                      ListaDeSinais[index].Titular = value;
                                      this.setState({ListaDeSinais: ListaDeSinais});
                                    }}/>
                                </View>
                              </View>
                              <View // N° do cheque
                                style = {{
                                  
                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F', 
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>N° do cheque</Text>
                                <View 
                                  style = {{
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                  <TextInput editable = {true} placeholder = {'Informe o número'} placeholderTextColor = {'#8F998F'}
                                    value = {sinal.NumeroCheque}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeSinais = [...this.state.ListaDeSinais];
                                      ListaDeSinais[index].NumeroCheque = value;
                                      this.setState({ListaDeSinais: ListaDeSinais});
                                    }}/>
                                </View>
                              </View>

                            </View>
                            </ScrollView>
                            <View style = {{paddingHorizontal: 20, backgroundColor: '#FFFFFF'}}>
                              <TouchableOpacity
                                style = {{
                                  width: '100%', 
                                  backgroundColor: this.props.StyleGlobal.cores.botao,
                                  paddingHorizontal: 16,
                                  height: 58,
                                  alignItems: 'center',
                                  justifyContent: "center",
                                  marginBottom: 20,
                                  borderRadius: 5
                              }}
                                onPress = {async () => {
                                    if(sinal.Banco.Valor != '' || sinal.Agencia != '' || sinal.Conta != '' || sinal.DigitoDaConta != '' || sinal.Titular != '' || sinal.NumeroCheque != '')
                                    {
                                      let ListaDeSinais = [...this.state.ListaDeSinais];
                                      let SinaisVazios = []
                                      SinaisVazios = ListaDeSinais.filter((Item_, Index_) => (Index_ > index && Item_.MeioDePagamento == sinal.MeioDePagamento && (Item_.Banco.Valor ?? "") == "" && (Item_.Agencia ?? "") == "" && (Item_.Conta ?? "") == "" && (Item_.DigitoDaConta ?? "") == "" && (Item_.Titular ?? "") == "" && (Item_.NumeroCheque ?? "") == ""))
                                      this.state.TextoSinais = `Existe mais de um sinal com o meio de pagamento ${String(sinal.MeioDePagamento).toLowerCase()}, deseja manter os mesmos dados de pagamentos?\n`;
                                      ListaDeSinais.map((Item__, Index__) => {
                                          if ((Index__ > index && Item__.MeioDePagamento == sinal.MeioDePagamento && (Item__.Banco.Valor ?? "") == "" && (Item__.Agencia ?? "") == "" && (Item__.Conta ?? "") == "" && (Item__.DigitoDaConta ?? "") == "" && (Item__.Titular ?? "") == "" && (Item__.NumeroCheque ?? "") == ""))
                                          {
                                            this.state.TextoSinais +=  `\nSinal ${formatoDeTexto.NumeroInteiro(Index__ + 1)}, Vencimento: ${moment(Item__.Vencimento, true).format("DD/MM/YYYY")}, Valor: ${formatoDeTexto.FormatarTexto(Item__.Valor)}\n`;
                                          }
                                      })
                                      this.state.TextoSinais += "\n";
                                      if(SinaisVazios.length > 0)
                                      {
                                        Alert.alert(
                                          'Caro Usuário',
                                          `${this.state.TextoSinais}`,
                                          [
                                            {
                                              text: 'Não',
                                              onPress: async () => {
                                                let ListaDeSinais = [...this.state.ListaDeSinais];
                                                ListaDeSinais[index].ModalMeioDePagamento = false;
                                                await this.setState({ListaDeSinais: ListaDeSinais})
                                              },
                                              style: 'cancel',
                                            },
                                            { text: 'Sim',
                                              onPress: async () => {
                                                let ListaDeSinais = [...this.state.ListaDeSinais];
                                                ListaDeSinais.map(async (Item_, Index_) => {
                                                    if(Index_ > index && Item_.MeioDePagamento == sinal.MeioDePagamento && (Item_.Banco.Valor ?? "") == "" && (Item_.Agencia ?? "") == "" && (Item_.Conta ?? "") == "" && (Item_.DigitoDaConta ?? "") == "" && (Item_.Titular ?? "") == "" && (Item_.NumeroCheque ?? "") == "")
                                                    {
                                                        Item_.Banco = sinal.Banco
                                                        Item_.Agencia = sinal.Agencia
                                                        Item_.Conta = sinal.Conta
                                                        Item_.DigitoDaConta = sinal.DigitoDaConta
                                                        Item_.Titular = sinal.Titular
                                                        Item_.NumeroCheque = sinal.NumeroCheque
                                                        sinal.ModalMeioDePagamento = false
                                                    }
                                                });
                                                ListaDeSinais[index].ModalMeioDePagamento = false;
                                                await this.setState({ListaDeSinais: ListaDeSinais})
                                              }}
                                          ],
                                          {cancelable: false},
                                        )
                                      }
                                      else
                                      {
                                        let ListaDeSinais = [...this.state.ListaDeSinais];
                                        sinal.ModalMeioDePagamento = false
                                        await this.setState({ListaDeSinais: ListaDeSinais})
                                      }
                                    }
                                    else
                                    {
                                      sinal.ModalMeioDePagamento = false
                                      this.setState({Renderizar: true})
                                    }
                                }}>
                                <Text
                                  style = {{
                                    fontStyle: 'normal',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    textAlign: 'center',
                                    color: '#FFFFFF',
                                    alignSelf: 'center',
                                }}>Recolher informações</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Modal // Banco
                            visible = {(sinal.ModalBanco === true ? true : false)}
                            transparent = {false}
                            animationType = {"slide"}>
                            <View style = {{flex: 1}}>
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
                                    justifyContent: 'space-between'
                                }}>
                                  <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'}
                                    onPress = {async () => {
                                      sinal.ModalBanco = false
                                      await this.setState({Renderizar: true})
                                  }}/>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>Banco</Text>
                                  </View>
                                <View style = {{width: 40}}></View>
                                </View> 
                              </View>
                              <ScrollView ref = {(ref) => this.ScrollViewSinalBanco = ref}
                                showsHorizontalScrollIndicator = {false}
                                horizontal = {true}
                                pagingEnabled
                                onMomentumScrollEnd = {async (e) => {}}>
                                <View
                                  style = {{
                                    minHeight: Dimensions.get('window').height - 190, 
                                    borderTopWidth: 0, 
                                    marginBottom: 20,
                                    backgroundColor: "#F6F8F5"
                                }}>
                                  <FlatList
                                    contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                                    showsVerticalScrollIndicator = {false}
                                    ref = {(ref) => {this.FlatListSinalBanco = ref}}
                                    data = {this.state.ListaBanco}
                                    keyExtractor = {(item) => String(item.chave)}
                                    renderItem = {({item, index}) => (
                                      <TouchableOpacity activeOpacity = {0.75} key = {item.chave} style = {{paddingHorizontal: 8}}
                                        onPress = { async () => {
                                          if(item.Valor != sinal.Banco.Valor)
                                          {
                                            sinal.Banco.chave = item.chave;
                                            sinal.Banco.Valor = item.Valor;
                                            sinal.ModalBanco = false;
                                            await this.setState({Renderizar: true})
                                          }
                                          else
                                          {
                                            sinal.ModalBanco = false;
                                            await this.setState({Renderizar: true})
                                          }
                                        }}>
                                          <View 
                                            style = {{
                                              backgroundColor: '#FFFFFF',
                                              paddingHorizontal: 16,
                                              width: '100%',
                                              borderWidth: 1,
                                              borderColor: 'rgba(16, 22, 26, 0.15)',
                                              borderRadius: 5,
                                              height: 58,
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginVertical: 5,
                                          }}>
                                            <Text 
                                              style = {{
                                                paddingVertical: 0,
                                                fontSize: 12,
                                                color: item.Valor == sinal.Banco.Valor ? this.props.StyleGlobal.cores.background : '#262825',
                                                fontWeight: item.Valor == sinal.Banco.Valor ? 'bold' : 'normal',
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                            }}>{String(item.chave).concat(": ").concat(item.Valor)}</Text>
                                          </View>
                                      </TouchableOpacity>
                                    )}
                                    refreshing = {true}
                                  />
                                </View>
                              </ScrollView>
                            </View>
                          </Modal>
                        </Modal>
                        <Modal // Modal meio de pagamento CARTÃO
                          visible = {(sinal.MeioDePagamento == "Cartao" && sinal.ModalMeioDePagamento == true) ? true : false}
                          transparent = {false}
                          animationType = {'slide'}
                        >
                          <View style = {{ flex: 1 }}>
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
                                  justifyContent: 'space-between',
                                  marginTop: 10,
                              }}>
                                <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'} style = {{}}
                                  onPress = {() => {
                                    sinal.ModalMeioDePagamento = false
                                    this.setState({Renderizar: true})
                                }}/>
                                <View
                                  style = {{flexDirection: 'row', alignItems: 'center'}}>
                                  <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>{formatoDeTexto.NumeroInteiro(index + 1)}ª</Text>
                                  <Text style = {{textAlign: 'left', color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, marginRight: 5}} numberOfLines = {1} ellipsizeMode = {'tail'}>Sinal</Text>
                                </View>
                                <View style = {{width: 40}}></View>
                              </View>
                            </View>
                            <ScrollView ref = {(ref) => this.ScrollViewModalCartaoSinal = ref}
                              showsVerticalScrollIndicator = {false}
                              pagingEnabled
                              onMomentumScrollEnd = {async (e) => {

                              }}>
                            <View 
                              style = {{
                                paddingHorizontal: 15, 
                                paddingTop: 10,
                                minHeight: Dimensions.get('window').height - 190,
                                backgroundColor: "#F6F8F5"
                            }}>

                              <View // Valor
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor da parcela</Text>
                                <View 
                                  style = {{
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                  <TextInput editable = {true} placeholder = {'R$ 0,00'} placeholderTextColor = {'#8F998F'}
                                    value = {formatoDeTexto.FormatarTexto((sinal.Valor))}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeSinais = [...this.state.ListaDeSinais];
                                      ListaDeSinais[index].Valor = (formatoDeTexto.DesformatarTexto(value) ?? 0.00);
                                      this.setState({ListaDeSinais: ListaDeSinais})
                                    }}/>
                                </View>
                              </View>
                              <View // Meio de pagamento
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                              }}>Meio de pagamento</Text>
                                <TextInput
                                  editable = {false}
                                  value = {sinal.MeioDePagamento}
                                  style = {{
                                    flexDirection: 'column',
                                    width: '100%',
                                    padding: 10,
                                    backgroundColor: '#CCCCCC50',
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    color: '#262825',
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    fontSize: 14,
                                    borderRadius: 5
                                }}/>
                              </View>
                              <View // Maquina
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                              }}>Máquina</Text>
                                <TouchableOpacity 
                                  activeOpacity = {1}
                                  style = {{
                                    width: '100%',
                                    paddingVertical: 10,
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    borderRadius: 5,
                                    backgroundColor: "#FFFFFF"
                                  }}
                                  onPress = { async () => {
                                    sinal.ModalMaquina = true
                                    await this.setState({Renderizar: true})
                                  }}>
                                    <Text
                                      style = {{
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 14,
                                        marginLeft: 10
                                    }}>{sinal.Maquina.chave == "" ? "Selecione a máquina" : String(sinal.Maquina.Valor)}</Text>
                                </TouchableOpacity>
                              </View>
                              <View // Dígito do cartão
                                style = {{
                                  
                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Dígito do cartão</Text>
                                <TextInput editable = {true} placeholder = {'Informe os últimos 04 dígitos do cartão'} placeholderTextColor = {'#8F998F'}
                                  value = {sinal.DigitoCartao}
                                  style = {{
                                    flexDirection: 'column',
                                    width: '100%',
                                    padding: 10,
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    color: '#262825',
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    fontSize: 14,
                                    borderRadius: 5
                                  }}
                                  numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                  onChangeText = {async (value) => {
                                    let ListaDeSinais = [...this.state.ListaDeSinais];
                                    ListaDeSinais[index].DigitoCartao = value;
                                    this.setState({ListaDeSinais: ListaDeSinais});
                                  }}/>
                              </View>
                              <View // Bandeira
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                              }}>Bandeira</Text>
                                <TouchableOpacity 
                                  activeOpacity = {1}
                                  style = {{
                                    width: '100%',
                                    paddingVertical: 10,
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    borderRadius: 5,
                                    backgroundColor: "#FFFFFF"
                                  }}
                                  onPress = { async () => {
                                    sinal.ModalBandeira = true
                                    await this.setState({Renderizar: true})
                                  }}>
                                    <Text
                                      style = {{
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 14,
                                        marginLeft: 10
                                    }}>{sinal.Bandeira.chave == "" ? "Selecione a bandeira" : String(sinal.Bandeira.Valor)}</Text>
                                </TouchableOpacity>
                              </View>
                              <View // Operacao
                                style = {{}}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }}>Operação</Text>
                                <TouchableOpacity 
                                  activeOpacity = {1}
                                  style = {{
                                    width: '100%',
                                    paddingVertical: 10,
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    borderRadius: 5,
                                    backgroundColor: "#FFFFFF"
                                  }}
                                  onPress = { async () => {
                                    sinal.ModalOperacao = true
                                    await this.setState({Renderizar: true})
                                  }}>
                                    <Text
                                      style = {{
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 14,
                                        marginLeft: 10
                                    }}>{sinal.Operacao.Valor == "" ? "Selecione a operação" : String(sinal.Operacao.Valor)}</Text>
                                </TouchableOpacity>
                              </View>
                              <View // NSU
                                style = {{
                                  
                                }}>
                                  <Text 
                                    style = {{
                                      textAlign: 'left', 
                                      color: '#8F998F',
                                      fontStyle: 'normal', 
                                      fontWeight: 'bold',
                                      fontSize: 14,
                                      marginBottom: 5
                                  }} numberOfLines = {1} ellipsizeMode = {'tail'}>NSU</Text>
                                  <TextInput editable = {true} placeholder = {"Informe O NSU"} placeholderTextColor = {'#8F998F'}
                                    value = {sinal.NSU}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeSinais = [...this.state.ListaDeSinais];
                                      ListaDeSinais[index].NSU = value;
                                      this.setState({ListaDeSinais: ListaDeSinais});
                                    }}/>
                              </View>                          
                            
                            </View>
                            </ScrollView>
                            <View style = {{paddingHorizontal: 20, backgroundColor: '#FFFFFF'}}>
                              <TouchableOpacity
                                style = {{
                                  width: '100%', 
                                  backgroundColor: this.props.StyleGlobal.cores.botao,
                                  paddingHorizontal: 16,
                                  height: 58,
                                  alignItems: 'center',
                                  justifyContent: "center",
                                  marginBottom: 20,
                                  borderRadius: 5,
                              }}
                                onPress = {async () => {
                                  if(sinal.Maquina.Valor != '' || sinal.DigitoCartao != '' || sinal.Bandeira.Valor != '' || sinal.Operacao.Valor != '' || sinal.NSU != '')
                                    {
                                      let ListaDeSinais = [...this.state.ListaDeSinais];
                                      let SinaisVazios = []
                                      SinaisVazios = ListaDeSinais.filter((Item_, Index_) => (Index_ > index && Item_.MeioDePagamento == sinal.MeioDePagamento && (Item_.Maquina.Valor ?? "") == "" && (Item_.DigitoCartao ?? "") == "" && (Item_.Bandeira.Valor ?? "") == "" && (Item_.Operacao.Valor ?? "") == "" && (Item_.NSU ?? "") == ""))
                                      this.state.TextoSinais = `Existe mais de um sinal com o meio de pagamento ${String(sinal.MeioDePagamento).toLowerCase()}, deseja manter os mesmos dados de pagamentos?\n`;
                                      ListaDeSinais.map((Item__, Index__) => {
                                          if ((Index__ > index && Item__.MeioDePagamento == sinal.MeioDePagamento && (Item__.Maquina.Valor ?? "") == "" && (Item__.DigitoCartao ?? "") == "" && (Item__.Bandeira.Valor ?? "") == "" && (Item__.Operacao.Valor ?? "") == "" && (Item__.NSU ?? "") == ""))
                                          {
                                            this.state.TextoSinais +=  `\nSinal ${formatoDeTexto.NumeroInteiro(Index__ + 1)}, Vencimento: ${moment(Item__.Vencimento, true).format("DD/MM/YYYY")}, Valor: ${formatoDeTexto.FormatarTexto(Item__.Valor)}\n`;
                                          }
                                      })
                                      this.state.TextoSinais += "\n";
                                      if(SinaisVazios.length > 0)
                                      {
                                        Alert.alert(
                                          'Caro Usuário',
                                          `${this.state.TextoSinais}`,
                                          [
                                            {
                                              text: 'Não',
                                              onPress: async () => {
                                                let ListaDeSinais = [...this.state.ListaDeSinais];
                                                ListaDeSinais[index].ModalMeioDePagamento = false;
                                                await this.setState({ListaDeSinais: ListaDeSinais})
                                              },
                                              style: 'cancel',
                                            },
                                            { text: 'Sim',
                                              onPress: async () => {
                                                let ListaDeSinais = [...this.state.ListaDeSinais];
                                                ListaDeSinais.map(async (Item_, Index_) => {
                                                    if(Index_ > index && Item_.MeioDePagamento == sinal.MeioDePagamento && (Item_.Maquina.Valor ?? "") == "" && (Item_.DigitoCartao ?? "") == "" && (Item_.Bandeira.Valor ?? "") == "" && (Item_.Operacao.Valor ?? "") == "" && (Item_.NSU ?? "") == "")
                                                    {
                                                        Item_.Maquina = sinal.Maquina
                                                        Item_.DigitoCartao = sinal.DigitoCartao
                                                        Item_.Bandeira = sinal.Bandeira
                                                        Item_.Operacao = sinal.Operacao
                                                        Item_.NSU = sinal.NSU
                                                        sinal.ModalMeioDePagamento = false
                                                    }
                                                });
                                                ListaDeSinais[index].ModalMeioDePagamento = false;
                                                await this.setState({ListaDeSinais: ListaDeSinais})
                                              }}
                                          ],
                                          {cancelable: false},
                                        )
                                      }
                                      else
                                      {
                                        let ListaDeSinais = [...this.state.ListaDeSinais];
                                        sinal.ModalMeioDePagamento = false
                                        await this.setState({ListaDeSinais: ListaDeSinais})
                                      }
                                    }
                                    else
                                    {
                                      sinal.ModalMeioDePagamento = false
                                      this.setState({Renderizar: true})
                                    }
                                    // sinal.ModalMeioDePagamento = false
                                    // await this.setState({Renderizar: true})
                                }}>
                                <Text
                                  style = {{
                                    fontStyle: 'normal',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    textAlign: 'center',
                                    color: '#FFFFFF',
                                    alignSelf: 'center',
                                }}>Recolher informações</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Modal // Maquina
                            visible = {(sinal.ModalMaquina === true ? true : false)}
                            transparent = {false}
                            animationType = {"slide"}>
                            <View style = {{flex: 1}}>
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
                                    justifyContent: 'space-between'
                                }}>
                                  <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'}
                                    onPress = {async () => {
                                      sinal.ModalMaquina = false
                                      await this.setState({Renderizar: true})
                                  }}/>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>Máquina</Text>
                                  </View>
                                <View style = {{width: 40}}></View>
                                </View> 
                              </View>
                              <ScrollView ref = {(ref) => this.ScrollViewMaquina = ref}
                                showsHorizontalScrollIndicator = {false}
                                horizontal = {true}
                                pagingEnabled
                                onMomentumScrollEnd = {async (e) => {}}>
                                <View
                                  style = {{
                                    minHeight: Dimensions.get('window').height - 190, 
                                    borderTopWidth: 0, 
                                    marginBottom: 20,
                                    backgroundColor: "#F6F8F5"
                                }}>
                                  <FlatList
                                    contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                                    showsVerticalScrollIndicator = {false}
                                    ref = {(ref) => {this.FlatListMaquina = ref}}
                                    data = {this.state.ListaMaquina}
                                    keyExtractor = {(item) => String(item.chave)}
                                    renderItem = {({item, index}) => (
                                      <TouchableOpacity activeOpacity = {0.75} key = {item.chave} style = {{paddingHorizontal: 8}}
                                        onPress = { async () => {
                                          if(item.Valor != sinal.Maquina.Valor)
                                          {
                                            sinal.Maquina.chave = item.chave;
                                            sinal.Maquina.Valor = item.Valor;
                                            sinal.ModalMaquina = false;
                                            await this.setState({Renderizar: true})
                                          }
                                          else
                                          {
                                            sinal.ModalMaquina = false;
                                            await this.setState({Renderizar: true})
                                          }
                                        }}>
                                          <View 
                                            style = {{
                                              backgroundColor: item.Valor == sinal.Maquina.Valor ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                                              paddingHorizontal: 16,
                                              width: '100%',
                                              borderWidth: 1,
                                              borderColor: 'rgba(16, 22, 26, 0.15)',
                                              borderRadius: 5,
                                              height: 58,
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginVertical: 5,
                                          }}>
                                            <Text 
                                              style = {{
                                                paddingVertical: 0,
                                                fontSize: 12,
                                                color: item.Valor == sinal.Maquina.Valor ? '#FFFFFF' : '#262825',
                                                fontWeight: item.Valor == sinal.Maquina.Valor ? 'bold' : 'normal',
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                            }}>{String(item.Valor)}</Text>
                                          </View>
                                      </TouchableOpacity>
                                    )}
                                    refreshing = {true}
                                  />
                                </View>
                              </ScrollView>
                            </View>
                          </Modal>
                          <Modal // Bandeira
                            visible = {(sinal.ModalBandeira === true ? true : false)}
                            transparent = {false}
                            animationType = {"slide"}>
                            <View style = {{flex: 1}}>
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
                                    justifyContent: 'space-between'
                                }}>
                                  <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'}
                                    onPress = {async () => {
                                      sinal.ModalBandeira = false
                                      await this.setState({Renderizar: true})
                                  }}/>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>Bandeira</Text>
                                  </View>
                                <View style = {{width: 40}}></View>
                                </View> 
                              </View>
                              <ScrollView ref = {(ref) => this.ScrollViewBandeira = ref}
                                showsHorizontalScrollIndicator = {false}
                                horizontal = {true}
                                pagingEnabled
                                onMomentumScrollEnd = {async (e) => {}}>
                                <View
                                  style = {{
                                    minHeight: Dimensions.get('window').height - 190, 
                                    borderTopWidth: 0, 
                                    marginBottom: 20,
                                    backgroundColor: "#F6F8F5"
                                }}>
                                  <FlatList
                                    contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                                    showsVerticalScrollIndicator = {false}
                                    ref = {(ref) => {this.FlatListBandera = ref}}
                                    data = {this.state.ListaBandeira}
                                    keyExtractor = {(item) => String(item.chave)}
                                    renderItem = {({item, index}) => (
                                      <TouchableOpacity activeOpacity = {0.75} key = {item.chave} style = {{paddingHorizontal: 8}}
                                        onPress = { async () => {
                                          if(item.Valor != sinal.Bandeira.Valor)
                                          {
                                            sinal.Bandeira.chave = item.chave;
                                            sinal.Bandeira.Valor = item.Valor;
                                            sinal.ModalBandeira = false;
                                            await this.setState({Renderizar: true})
                                          }
                                          else
                                          {
                                            sinal.ModalBandeira = false;
                                            await this.setState({Renderizar: true})
                                          }
                                        }}>
                                          <View 
                                            style = {{
                                              backgroundColor: item.Valor == sinal.Bandeira.Valor ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                                              paddingHorizontal: 16,
                                              width: '100%',
                                              borderWidth: 1,
                                              borderColor: 'rgba(16, 22, 26, 0.15)',
                                              borderRadius: 5,
                                              height: 58,
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginVertical: 5,
                                          }}>
                                            <Text 
                                              style = {{
                                                paddingVertical: 0,
                                                fontSize: 12,
                                                color: item.Valor == sinal.Bandeira.Valor ? '#FFFFFF' : '#262825',
                                                fontWeight: item.Valor == sinal.Bandeira.Valor ? 'bold' : 'normal',
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                            }}>{String(item.Valor)}</Text>
                                          </View>
                                      </TouchableOpacity>
                                    )}
                                    refreshing = {true}
                                  />
                                </View>
                              </ScrollView>
                            </View>
                          </Modal>
                          <Modal // Operacao
                            visible = {(sinal.ModalOperacao === true ? true : false)}
                            transparent = {false}
                            animationType = {"slide"}>
                            <View style = {{flex: 1}}>
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
                                    justifyContent: 'space-between'
                                }}>
                                  <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'}
                                    onPress = {async () => {
                                      sinal.ModalOperacao = false
                                      await this.setState({Renderizar: true})
                                  }}/>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>Operação</Text>
                                  </View>
                                <View style = {{width: 40}}></View>
                                </View> 
                              </View>
                              <ScrollView ref = {(ref) => this.ScrollViewOperacao = ref}
                                showsHorizontalScrollIndicator = {false}
                                horizontal = {true}
                                pagingEnabled
                                onMomentumScrollEnd = {async (e) => {}}>
                                <View
                                  style = {{
                                    minHeight: Dimensions.get('window').height - 190, 
                                    borderTopWidth: 0, 
                                    marginBottom: 20,
                                    backgroundColor: "#F6F8F5"
                                }}>
                                  <FlatList
                                    contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                                    showsVerticalScrollIndicator = {false}
                                    ref = {(ref) => {this.FlatListOperacao = ref}}
                                    data = {this.state.ListaOperacao}
                                    keyExtractor = {(item) => String(item.chave)}
                                    renderItem = {({item, index_}) => (
                                      <TouchableOpacity activeOpacity = {0.75} key = {item.chave} style = {{paddingHorizontal: 8}}
                                        onPress = { async () => {
                                          if(item.Valor != sinal.Operacao.Valor)
                                          {
                                            let ListaDeSinais = [...this.state.ListaDeSinais];
                                            
                                            sinal.Operacao.chave = item.chave;
                                            sinal.Operacao.Valor = item.Valor;

                                            if (sinal.MeioDePagamento == "Cartao" && sinal.Operacao.Valor == "Débito") { 
                                              const EhDiaUtil = require('eh-dia-util');
                                              let Vencimento = new Date();
                                              Vencimento.setDate(Vencimento.getDate() + 1);
                                              while (EhDiaUtil(Vencimento) == false) {
                                                Vencimento.setDate(Vencimento.getDate() + 1);
                                              }
                                              ListaDeSinais[index].Vencimento = Vencimento;
                                            }
                                            if (sinal.MeioDePagamento == "Cartao" && sinal.Operacao.Valor != "Débito") {
                                              ListaDeSinais.map((Item_, Index_) => {
                                                  if (Index_ >= index) {
                                                    let Vencimento = new Date(this.state.DataDaProposta);
                                                    Vencimento.setDate(Vencimento.getDate() + (1 + Index_ - index) * 30);
                                                    Item_.Vencimento = Vencimento;
                                                  }
                                              });
                                            }
                                            else {
                                              ListaDeSinais[index].Vencimento = ListaDeSinais[index].Vencimento;
                                            }

                                            sinal.ModalOperacao = false;
                                            await this.setState({Renderizar: true})
                                          }
                                          else
                                          {
                                            sinal.ModalOperacao = false;
                                            await this.setState({Renderizar: true})
                                          }
                                        }}>
                                          <View
                                            style = {{
                                              backgroundColor: item.Valor == sinal.Operacao.Valor ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                                              paddingHorizontal: 16,
                                              width: '100%',
                                              borderWidth: 1,
                                              borderColor: 'rgba(16, 22, 26, 0.15)',
                                              borderRadius: 5,
                                              height: 58,
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginVertical: 5,
                                          }}>
                                            <Text 
                                              style = {{
                                                paddingVertical: 0,
                                                fontSize: 12,
                                                color: item.Valor == sinal.Operacao.Valor ? '#FFFFFF' : '#262825',
                                                fontWeight: item.Valor == sinal.Operacao.Valor ? 'bold' : 'normal',
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                            }}>{String(item.Valor)}</Text>
                                          </View>
                                      </TouchableOpacity>
                                    )}
                                    refreshing = {true}
                                  />
                                </View>
                              </ScrollView>
                            </View>
                          </Modal>
                        </Modal>
                        <Modal // Modal meio de pagamento DEPOSITO ou TRANSFERENCIA ou PIX
                          visible = {((sinal.MeioDePagamento == "Deposito" || sinal.MeioDePagamento == "Transferencia" || sinal.MeioDePagamento == "PIX") && sinal.ModalMeioDePagamento == true) ? true : false}
                          transparent = {false}
                          animationType = {'slide'}
                        >
                          <View style = {{flex: 1}}>
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
                                  justifyContent: 'space-between',
                                  marginTop: 10
                              }}>
                                <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'} style = {{}}
                                  onPress = {() => {
                                    sinal.ModalMeioDePagamento = false
                                    this.setState({Renderizar: true})
                                }}/>
                                <View
                                  style = {{flexDirection: 'row', alignItems: 'center'}}>
                                  <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, color: '#FFFFFF', marginRight: 5}}>{formatoDeTexto.NumeroInteiro(index + 1)}ª</Text>
                                  <Text style = {{textAlign: 'left', color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, marginRight: 5}} numberOfLines = {1} ellipsizeMode = {'tail'}>Sinal</Text>
                                </View>
                                <View style = {{width: 40}}></View>
                              </View>
                            </View>
                            <ScrollView ref = {(ref) => this.ScrollViewModalDepositoTransSinal = ref}
                              showsVerticalScrollIndicator = {false}
                              pagingEnabled
                              onMomentumScrollEnd = {async (e) => {}}>
                            <View 
                              style = {{
                                paddingHorizontal: 15, 
                                paddingTop: 10,
                                minHeight: Dimensions.get('window').height - 190,
                                backgroundColor: "#F6F8F5"
                            }}>
                              <View // Valor
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F',
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor da parcela</Text>
                                <View 
                                  style = {{
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                    width: '100%'
                                }}>
                                  <TextInput editable = {true} placeholder = {'R$ 0,00'} placeholderTextColor = {'#8F998F'}
                                    value = {formatoDeTexto.FormatarTexto((sinal.Valor))}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeSinais = [...this.state.ListaDeSinais];
                                      ListaDeSinais[index].Valor = (formatoDeTexto.DesformatarTexto(value) ?? 0.00);
                                      this.setState({ListaDeSinais: ListaDeSinais})
                                    }}/>
                                </View>
                              </View>
                              <View // Meio de pagamento
                                style = {{

                              }}>
                                <Text 
                                  style = {{
                                    textAlign: 'left', 
                                    color: '#8F998F', 
                                    fontStyle: 'normal', 
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginBottom: 5
                              }}>Meio de pagamento</Text>
                                <TextInput
                                  editable = {false}
                                  value = {sinal.MeioDePagamento}
                                  style = {{
                                    flexDirection: 'column',
                                    width: '100%',
                                    padding: 10,
                                    backgroundColor: '#CCCCCC50',
                                    borderWidth: 1,
                                    borderColor: 'rgba(16, 22, 26, 0.15)',
                                    marginTop: 4,
                                    marginBottom: 8,
                                    color: '#262825',
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    fontSize: 14,
                                    borderRadius: 5
                                }}/>
                              </View>
                              <View // Numero da operacao
                                style = {{

                                }}>
                                  <Text 
                                    style = {{
                                      textAlign: 'left', 
                                      color: '#8F998F', 
                                      fontStyle: 'normal', 
                                      fontWeight: 'bold',
                                      fontSize: 14,
                                      marginBottom: 5
                                  }} numberOfLines = {1} ellipsizeMode = {'tail'}>N° da operação</Text>
                                  <TextInput editable = {true} placeholder = {"00000"} placeholderTextColor = {'#8F998F'}
                                    value = {sinal.NumeroDaOperacao}
                                    style = {{
                                      flexDirection: 'column',
                                      width: '100%',
                                      padding: 10,
                                      backgroundColor: '#FFFFFF',
                                      borderWidth: 1,
                                      borderColor: 'rgba(16, 22, 26, 0.15)',
                                      marginTop: 4,
                                      marginBottom: 8,
                                      color: '#262825',
                                      fontStyle: 'normal',
                                      fontWeight: 'normal',
                                      fontSize: 14,
                                      borderRadius: 5
                                    }}
                                    numberOfLines = {1} ellipsizeMode = {'tail'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                                    onChangeText = {async (value) => {
                                      let ListaDeSinais = [...this.state.ListaDeSinais];
                                      ListaDeSinais[index].NumeroDaOperacao = value;
                                      this.setState({ListaDeSinais: ListaDeSinais});
                                    }}/>
                              </View>                                  
                            </View>
                            </ScrollView>
                            <View style = {{paddingHorizontal: 20, backgroundColor: '#FFFFFF'}}>
                              <TouchableOpacity
                                style = {{
                                  width: '100%', 
                                  backgroundColor: this.props.StyleGlobal.cores.botao,
                                  paddingHorizontal: 16,
                                  height: 58,
                                  alignItems: 'center',
                                  justifyContent: "center",
                                  marginBottom: 20,
                                  borderRadius: 5,
                              }}
                                onPress = {async () => {
                                    if(sinal.NumeroDaOperacao != '')
                                      {
                                        let ListaDeSinais = [...this.state.ListaDeSinais];
                                        let SinaisVazios = []
                                        SinaisVazios = ListaDeSinais.filter((Item_, Index_) => (Index_ > index && Item_.MeioDePagamento == sinal.MeioDePagamento && (Item_.NumeroDaOperacao ?? "") == ""))
                                        this.state.TextoSinais = `Existe mais de um sinal com o meio de pagamento ${String(sinal.MeioDePagamento).toLowerCase()}, deseja manter os mesmos dados de pagamentos?\n`;
                                        ListaDeSinais.map((Item__, Index__) => {
                                            if ((Index__ > index && Item__.MeioDePagamento == sinal.MeioDePagamento && (Item__.NumeroDaOperacao ?? "") == ""))
                                            {
                                              this.state.TextoSinais +=  `\nSinal ${formatoDeTexto.NumeroInteiro(Index__ + 1)}, Vencimento: ${moment(Item__.Vencimento, true).format("DD/MM/YYYY")}, Valor: ${formatoDeTexto.FormatarTexto(Item__.Valor)}\n`;
                                            }
                                        })
                                        this.state.TextoSinais += "\n";
                                        if(SinaisVazios.length > 0)
                                        {
                                          Alert.alert(
                                            'Caro Usuário',
                                            `${this.state.TextoSinais}`,
                                            [
                                              {
                                                text: 'Não',
                                                onPress: async () => {
                                                  let ListaDeSinais = [...this.state.ListaDeSinais];
                                                  ListaDeSinais[index].ModalMeioDePagamento = false;
                                                  await this.setState({ListaDeSinais: ListaDeSinais})
                                                },
                                                style: 'cancel',
                                              },
                                              { text: 'Sim',
                                                onPress: async () => {
                                                  let ListaDeSinais = [...this.state.ListaDeSinais];
                                                  ListaDeSinais.map(async (Item_, Index_) => {
                                                      if(Index_ > index && Item_.MeioDePagamento == sinal.MeioDePagamento && (Item_.NumeroDaOperacao ?? "") == "")
                                                      {
                                                          Item_.NumeroDaOperacao = sinal.NumeroDaOperacao
                                                          sinal.ModalMeioDePagamento = false
                                                      }
                                                  });
                                                  ListaDeSinais[index].ModalMeioDePagamento = false;
                                                  await this.setState({ListaDeSinais: ListaDeSinais})
                                                }}
                                            ],
                                            {cancelable: false},
                                          )
                                        }
                                        else
                                        {
                                          let ListaDeSinais = [...this.state.ListaDeSinais];
                                          sinal.ModalMeioDePagamento = false
                                          await this.setState({ListaDeSinais: ListaDeSinais})
                                        }
                                      }
                                      else
                                      {
                                        sinal.ModalMeioDePagamento = false
                                        this.setState({Renderizar: true})
                                      }
                                }}>
                                <Text
                                  style = {{
                                    fontStyle: 'normal',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    textAlign: 'center',
                                    color: '#FFFFFF',
                                    alignSelf: 'center',
                                }}>Recolher informações</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Modal>
                      </View>
                    )}
                  </View>}
                  {(this.state.ParcelaObraExiste == true && this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda != '') &&
                  <View
                    >
                    <View
                      style = {{
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        paddingHorizontal: 23,
                        marginTop: 24,
                      }}>
                      <View>
                        <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: this.props.StyleGlobal.cores.background}}>{this.state.ParcelaObraQtde > 1 ? "Parcelas obra" : 'Parcela obra'}</Text>
                      </View>
                      {false &&
                      <View style = {{flexDirection: 'row'}}>
                        <TouchableOpacity style = {{flexDirection: 'row', padding: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: this.props.StyleGlobal.cores.background, alignItems: 'center', marginRight: 8}}
                          onPress = {() => {this.setVisibilidadeModalFinanciamento(true)}}>
                          <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 12, textAlign: 'center', color: this.props.StyleGlobal.cores.background}}>Selecione</Text>
                        </TouchableOpacity>
                      </View>}
                    </View>
                    <View style = {{marginBottom: 8, marginHorizontal: 24, marginTop: 18}}>
                      <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
                        <Text style = {{width: '20%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Qtde</Text>
                        <Text style = {{width: '28%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Vencimento</Text>
                        <Text style = {{width: '26%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor principal</Text>
                        <Text style = {{width: '30%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor total</Text>                      
                      </View>
                    </View>
                    <TouchableOpacity activeOpacity = {1}>
                      <View  style = {{width: '100%', flexDirection: 'row', backgroundColor: '#FFFFFF', height: 62, alignItems: 'center', paddingHorizontal: 24}}>
                        <TextInput editable = {true} placeholder = {formatoDeTexto.NumeroInteiro("0")} placeholderTextColor = {'#8F998F'} 
                          value = {formatoDeTexto.NumeroInteiro(this.state.ParcelaObraQtde)} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                          style = {{width: '20%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#8F998F'}} numberOfLines = {1} ellipsizeMode = {'tail'}
                          onChangeText = {async (value) => {
                            var ParcelaObraQtde = value ?? 0;
                            var ParcelaObraValor = ParcelaObraQtde > 0 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(this.state.ParcelaObraValorTotal/ParcelaObraQtde)) : 0;
                            this.state.ParcelaObraQtde = ParcelaObraQtde
                            this.state.ParcelaObraValor = ParcelaObraValor
                            this.state.ParcelaObraValorPMT = this.state.ParcelaObraQtde > 0 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(Math.abs(PMT(0.01, parseInt(this.state.ParcelaObraQtde), parseFloat(this.state.ParcelaObraValorTotal), 0, 0)))) : 0;
                            this.state.ParcelaObraValorTotalJuros = (this.state.ParcelaObraQtde * this.state.ParcelaObraValorPMT)

                            var ParcelaQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
                            var ParcelaVencimento = this.state.ParcelaObraExiste == true ? new Date(this.state.ParcelaObraVencimento) : (this.state.ParcelaBancoExiste == true ? new Date(this.state.ParcelaBancoVencimento) : (this.state.SinalExiste == true ? new Date(this.state.ListaDeSinais[this.state.ListaDeSinais.length - 1].Vencimento) : (this.state.EntradaExiste == true ? new Date(this.state.ListaDeEntradas[this.state.ListaDeEntradas.length - 1].Vencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 14)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.primeiroVencimento ?? new Date()))));
                            // this.state.ParcelaValor = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.principal ?? 0
                            // this.state.ParcelaQtde = ParcelaQtde

                            if (this.state.ItemPickerCondicoesDaTabelaDeVenda.descricao.includes("Anual") == true) {
                              ParcelaVencimento = new Date();
                              ParcelaVencimento.setUTCHours(23);
                              ParcelaVencimento.setMonth(ParcelaVencimento.getMonth() + 12);
                              ParcelaVencimento.setDate((this.state.ParcelaVencimento).getDate())
                              this.state.ParcelaVencimento = new Date(ParcelaVencimento)
                            }
                            else 
                            {
                              ParcelaVencimento.setUTCHours(23);
                              ParcelaVencimento.setMonth(ParcelaVencimento.getMonth() + (this.state.ParcelaObraExiste == true ? parseInt(ParcelaObraQtde) : (this.state.ParcelaBancoExiste == true ? parseInt(ParcelaBancoQtde) : 1)));
                              ParcelaVencimento.setDate((this.state.ParcelaVencimento).getDate())
                              this.state.ParcelaVencimento = this.state.ItemPickerCondicoesDaTabelaDeVenda.descricao.includes("À Vista") ? new Date() : new Date(ParcelaVencimento)
                            }

                            this.setState({Renderizar: true});
                        }}/>
                        <View style = {{flexDirection: 'row', alignItems: 'center', width: '28%'}}>
                          <View>
                            <DateTimePickerModal
                              isVisible = {this.state.ParcelaObraPickerVencimento}
                              mode = {"date"}
                              locale = {"pt-BR"}
                              is24Hour = {true}
                              date = {this.state.ParcelaObraVencimento}
                              maximumDate = {new Date((new Date().getFullYear() + 2).toString() + "-01-01")}
                              headerTextIOS = {"Vencimento"}
                              cancelTextIOS = {"Cancelar"}
                              confirmTextIOS = {"Confirmar"}
                              onConfirm = { async (date) => {
                                const currentDate = date || this.state.ParcelaObraVencimento
                                this.setState({ParcelaObraVencimento: currentDate, ParcelaObraPickerVencimento: false})
                              }}
                              onCancel = {  async () => {
                                this.state.ParcelaObraPickerVencimento = false
                                await this.setState({Renderizar: this.state.Renderizar})
                              }}
                            />
                            <TouchableOpacity onPress = {async() => {
                              this.state.ParcelaObraPickerVencimento == false ? await this.setState({ParcelaObraPickerVencimento: true}) : await this.setState({ParcelaObraPickerVencimento: false})
                            }} activeOpacity = {1}>
                              {true &&
                                <>
                                <View style = {{}}>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text
                                      style = {{
                                        flexDirection: 'column',
                                        borderColor: this.props.StyleGlobal.cores.background,
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 11,
                                        textAlignVertical: 'center',
                                    }}>{this.state.ParcelaObraVencimento == undefined ? 'DD/MM/YYYY' : format(new Date(this.state.ParcelaObraVencimento), 'dd/MM/yyyy')}</Text>
                                    <Icon name = "event" size = {10} color = {this.props.StyleGlobal.cores.background} style = {{marginLeft: 5}}/>
                                  </View>
                                </View>
                                </>
                              }
                            </TouchableOpacity>
                          </View>
                        </View>
                        <TextInput editable = {this.props.EmpresaLogada[0] == 8 ? false : true} placeholder = {"R$ 0,00"} placeholderTextColor = {'#8F998F'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                          value = {formatoDeTexto.FormatarTexto(this.state.ParcelaObraValor)}
                          style = {{width: '26%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: this.props.EmpresaLogada[0] == 8 ? '#26282575' : '#262825', height: 52, backgroundColor: this.props.EmpresaLogada[0] == 8 ? '#CCCCCC50' : '#FFFFFF', borderRadius: this.props.EmpresaLogada[0] == 8? 5 : 0}} 
                          numberOfLines = {1} ellipsizeMode = {'tail'} 
                          onChangeText = {async (value) => {
                            this.state.ParcelaObraValor = (formatoDeTexto.DesformatarTexto(value) ?? 0.00)
                            this.state.ParcelaObraValorTotal = (this.state.ParcelaObraQtde * this.state.ParcelaObraValor)
                            this.state.ParcelaObraValorPMT = this.state.ParcelaObraQtde > 0 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(Math.abs(PMT(0.01, parseInt(this.state.ParcelaObraQtde), parseFloat(this.state.ParcelaObraValorTotal), 0, 0)))) : 0;
                            this.state.ParcelaObraValorTotalJuros = (this.state.ParcelaObraQtde * this.state.ParcelaObraValorPMT)
                            this.setState({Renderizar: true})
                          }}/>
                        <TextInput editable = {true} placeholder = {"R$ 0,00"} placeholderTextColor = {'#8f998f'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                          value = {formatoDeTexto.FormatarTexto(this.state.ParcelaObraValorTotal)}
                          style = {{width: '30%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#262825'}} 
                          numberOfLines = {1} ellipsizeMode = {'tail'}
                          onChangeText = { async (value) => {
                            this.state.ParcelaObraValorTotal = formatoDeTexto.DesformatarTexto(value) ?? 0;
                            this.state.ParcelaObraValor = this.state.ParcelaObraQtde > 0 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((this.state.ParcelaObraValorTotal / this.state.ParcelaObraQtde))) : 0;
                            this.state.ParcelaObraValorPMT = this.state.ParcelaObraQtde > 0 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(Math.abs(PMT(0.01, parseInt(this.state.ParcelaObraQtde), parseFloat(this.state.ParcelaObraValorTotal), 0, 0)))) : 0;
                            this.state.ParcelaObraValorTotalJuros = (this.state.ParcelaObraQtde * this.state.ParcelaObraValorPMT)
                            this.setState({Renderizar: true})
                          }}/>
                      </View>
                      {this.props.EmpresaLogada[0] == 8 &&
                      <View style = {{width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginBottom: 8}}>
                        <View style = {{width: '24%'}}>
                          <View style = {{marginBottom: 8, marginTop: 4}}>
                            <Text style = {{textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, paddingLeft: 5}} numberOfLines = {1} ellipsizeMode = {'tail'}>C/juros</Text>
                          </View>
                          <View  style = {{flexDirection: 'row', backgroundColor: '#CCCCCC50', height: 52, alignItems: 'center', paddingLeft: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftWidth: 1.5, borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: this.props.StyleGlobal.cores.background}}>
                          <TextInput editable = {false} placeholder = {"R$ 0,00"} placeholderTextColor = {'#8F998F'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                            value = {formatoDeTexto.FormatarTexto(this.state.ParcelaObraValorPMT)}
                            style = {{textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#26282575'}} 
                            numberOfLines = {1} ellipsizeMode = {'tail'}
                            onChangeText = {async () => {}}/>
                          </View>
                        </View>
                        <View style = {{width: '28%'}}>
                          <View style = {{marginBottom: 8, marginTop: 4}}>
                            <Text style = {{textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Total C/juros</Text>
                          </View>
                          <View style = {{flexDirection: 'row', backgroundColor: '#CCCCCC50', height: 52, alignItems: 'center', borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: this.props.StyleGlobal.cores.background}}>
                            <TextInput editable = {false} placeholder = {"R$ 0,00"} placeholderTextColor = {'#8f998f'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                              value = {formatoDeTexto.FormatarTexto(this.state.ParcelaObraValorTotalJuros)}
                              style = {{textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#26282575'}} 
                              numberOfLines = {1} ellipsizeMode = {'tail'}
                              onChangeText = {async () => {}}/>
                          </View>
                        </View>
                      </View>}
                    </TouchableOpacity>
                  </View>}
                  {(this.props.disponibilidadeFinanciamento[0].disponibilidadeFinanciamento == true && this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda != '') &&
                  <View
                    >
                    <View
                      style = {{
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        paddingHorizontal: 23,
                        marginTop: 24,
                      }}>
                      <View>
                        <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: this.props.StyleGlobal.cores.background}}>Saldo a financiar</Text>
                      </View>
                      {false &&
                      <View style = {{flexDirection: 'row'}}>
                        <TouchableOpacity style = {{flexDirection: 'row', padding: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: this.props.StyleGlobal.cores.background, alignItems: 'center', marginRight: 8}}
                          onPress = {() => {this.setVisibilidadeModalFinanciamento(true)}}>
                          <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 12, textAlign: 'center', color: this.props.StyleGlobal.cores.background}}>Selecione</Text>
                        </TouchableOpacity>
                      </View>}
                    </View>
                    <View style = {{marginBottom: 8, marginHorizontal: 24, marginTop: 18}}>
                      <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
                        <Text style = {{width: '20%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Qtde</Text>
                        <Text style = {{width: '28%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Vencimento</Text>
                        <Text style = {{width: '26%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor parcela</Text>
                        <Text style = {{width: '40%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor total</Text>
                      </View>
                    </View>
                    <TouchableOpacity activeOpacity = {1}>
                      <View  style = {{width: '100%', flexDirection: 'row', backgroundColor: '#FFFFFF', height: 62, alignItems: 'center', paddingHorizontal: 24}}>
                        <TextInput editable = {this.props.EmpresaLogada[0] == 5 ? false : true} placeholder = {formatoDeTexto.NumeroInteiro("0")} placeholderTextColor = {'#8F998F'} 
                          value = {formatoDeTexto.NumeroInteiro(this.state.ParcelaQtde)} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                          style = {{width: '20%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#8F998F', height: 52, backgroundColor: '#FFFFFF', borderRadius: 0}} numberOfLines = {1} ellipsizeMode = {'tail'}
                          onChangeText = {async (value) => {
                            var ParcelaQtde = value ?? 0;
                            var ParcelaValor = ParcelaQtde > 0 ? (this.props.EmpresaLogada[0] == 4 ? ((this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.qtdeDeTitulos ?? 0) * (this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.principal ?? 0) / ParcelaQtde) : formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((this.state.ParcelaValorTotal/ParcelaQtde)))) : 0;
                            this.state.ParcelaQtde = ParcelaQtde
                            this.state.ParcelaValor = ParcelaValor
                            this.state.ParcelaValorPMT = this.state.ParcelaQtde > 0 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(Math.abs(PMT(0.01, parseInt(this.state.ParcelaQtde), parseFloat(this.state.ParcelaValorTotal), 0, 0)))) : 0;
                            this.state.ParcelaValorTotalJuros = (this.state.ParcelaQtde * this.state.ParcelaValorPMT)
                            await this.setState({Renderizar: true});
                        }}/>
                        <View style = {{flexDirection: 'row', alignItems: 'center', width: '28%'}}>
                          <View>
                            <DateTimePickerModal
                              isVisible = {this.state.ParcelaPickerVencimento}
                              mode = {"date"}
                              locale = {"pt-BR"}
                              is24Hour = {true}
                              date = {this.state.ParcelaVencimento}
                              maximumDate = {new Date((new Date().getFullYear() + 2).toString() + "-01-01")}
                              headerTextIOS = {"Vencimento"}
                              cancelTextIOS = {"Cancelar"}
                              confirmTextIOS = {"Confirmar"}
                              onConfirm = { async (date) => {
                                const currentDate = date || this.state.ParcelaVencimento
                                this.setState({ParcelaVencimento: currentDate, ParcelaPickerVencimento: false})
                              }}
                              onCancel = {  async () => {
                                this.state.ParcelaPickerVencimento = false
                                await this.setState({Renderizar: this.state.Renderizar})
                              }}
                            />
                            <TouchableOpacity 
                              onPress = {async() => {
                                this.state.ParcelaPickerVencimento == false ? await this.setState({ParcelaPickerVencimento: true}) : await this.setState({ParcelaPickerVencimento: false})
                            }} activeOpacity = {1}>
                              {true &&
                                <>
                                <View style = {{}}>
                                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text
                                      style = {{
                                        flexDirection: 'column',
                                        borderColor: this.props.StyleGlobal.cores.background,
                                        color: '#262825',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 11,
                                        textAlignVertical: 'center',
                                    }}>{this.state.ParcelaVencimento == undefined ? 'DD/MM/YYYY' : format(new Date(this.state.ParcelaVencimento), 'dd/MM/yyyy')}</Text>
                                    <Icon name = "event" size = {10} color = {this.props.StyleGlobal.cores.background} style = {{marginLeft: 5}}/>
                                  </View>
                                </View>
                                </>
                              }
                            </TouchableOpacity>
                          </View>
                        </View>
                        <TextInput editable = {(this.props.EmpresaLogada[0] == 5 || this.props.EmpresaLogada[0] == 8) ? false : true} placeholder = {"R$ 0,00"} placeholderTextColor = {'#8F998F'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                          value = {formatoDeTexto.FormatarTexto(this.state.ParcelaValor)} 
                          style = {{width: '26%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: (this.props.EmpresaLogada[0] == 8) ? '#26282575' : '#262825', height: 52, backgroundColor: (this.props.EmpresaLogada[0] == 8) ? '#CCCCCC50' : '#FFFFFF', borderRadius: (this.props.EmpresaLogada[0] == 8 || this.props.EmpresaLogada[0] == 'Harmonia Urbanismo') ? 5 : 0}} 
                          numberOfLines = {1} ellipsizeMode = {'tail'}
                          onChangeText = {async (value) => {
                            this.state.ParcelaValor = (formatoDeTexto.DesformatarTexto(value) ?? 0.00)
                            this.state.ParcelaValorTotal = this.props.EmpresaLogada[0] == 4 ? this.state.ParcelaValorTotal : (this.state.ParcelaQtde * this.state.ParcelaValor)
                            this.state.ParcelaValorPMT = this.state.ParcelaQtde > 0 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(Math.abs(PMT(0.01, parseInt(this.state.ParcelaQtde), parseFloat(this.state.ParcelaValorTotal), 0, 0)))) : 0;
                            this.state.ParcelaValorTotalJuros = (this.state.ParcelaQtde * this.state.ParcelaValorPMT)
                            this.setState({Renderizar: true})
                          }}/>
                        <TextInput editable = {this.props.EmpresaLogada[0] == 8 ? true : false} placeholder = {"R$ 0,00"} placeholderTextColor = {'#8f998f'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                          value = {formatoDeTexto.FormatarTexto(this.state.ParcelaValorTotal)}
                          style = {{paddingLeft: 5, width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: (this.props.EmpresaLogada[0] == 4) ? '#26282575' : '#262825', height: 62, backgroundColor: (this.props.EmpresaLogada[0] == 4) ? '#CCCCCC50' : '#FFFFFF', borderRadius: (this.props.EmpresaLogada[0] == 4) ? 5 : 0}} 
                          numberOfLines = {1} ellipsizeMode = {'tail'}
                          onChangeText = {async (value) => {
                            this.state.ParcelaValorTotal = formatoDeTexto.DesformatarTexto(value) ?? 0;
                            this.state.ParcelaValor = this.state.ParcelaQtde > 0 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((this.state.ParcelaValorTotal / this.state.ParcelaQtde))) : 0;
                            this.state.ParcelaValorPMT = this.state.ParcelaQtde > 0 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(Math.abs(PMT(0.01, parseInt(this.state.ParcelaQtde), parseFloat(this.state.ParcelaValorTotal), 0, 0)))) : 0;
                            this.state.ParcelaValorTotalJuros = (this.state.ParcelaQtde * this.state.ParcelaValorPMT)
                            this.setState({Renderizar: true})
                          }}/>
                      </View>
                      {this.props.EmpresaLogada[0] == 8 &&
                      <View style = {{width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginBottom: 8}}>
                        <View style = {{width: '24%'}}>
                          <View style = {{marginBottom: 8, marginTop: 4}}>
                            <Text style = {{textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, paddingLeft: 5}} numberOfLines = {1} ellipsizeMode = {'tail'}>C/juros</Text>
                          </View>
                          <View  style = {{flexDirection: 'row', backgroundColor: '#CCCCCC50', height: 52, alignItems: 'center', paddingLeft: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderLeftWidth: 1.5, borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: this.props.StyleGlobal.cores.background}}>
                          <TextInput editable = {false} placeholder = {"R$ 0,00"} placeholderTextColor = {'#8F998F'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                            value = {formatoDeTexto.FormatarTexto(this.state.ParcelaValorPMT)}
                            style = {{textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#26282575'}} 
                            numberOfLines = {1} ellipsizeMode = {'tail'}
                            onChangeText = {async (value) => {}}/>
                          </View>
                        </View>
                        <View style = {{width: '28%'}}>
                          <View style = {{marginBottom: 8, marginTop: 4}}>
                            <Text style = {{textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Total C/juros</Text>
                          </View>
                          <View style = {{flexDirection: 'row', backgroundColor: '#CCCCCC50', height: 52, alignItems: 'center', borderTopWidth: 1.5, borderBottomWidth: 1.5, borderColor: this.props.StyleGlobal.cores.background}}>
                            <TextInput editable = {false} placeholder = {"R$ 0,00"} placeholderTextColor = {'#8f998f'} keyboardType = {'numeric'} returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                              value = {formatoDeTexto.FormatarTexto(this.state.ParcelaValorTotalJuros)}
                              style = {{textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 11, color: '#26282575'}} 
                              numberOfLines = {1} ellipsizeMode = {'tail'}
                              onChangeText = {async (value) => {}}/>
                          </View>
                        </View>
                      </View>}
                    </TouchableOpacity>
                    <Text style = {{marginHorizontal: 24, marginTop: 8, fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color: '#8F998F', marginBottom: 5}}>OBS: Estas parcelas serão reajustas pelo IGPM</Text> 
                  </View>}
                  {this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda != "" && (this.props.empresa[0].empresa == 20 || this.props.empresa[0].empresa == 21 || this.props.empresa[0].empresa == 22 || this.props.empresa[0].empresa == 23) &&
                  <View>
                    <View
                      style = {{
                        marginTop: 5,
                        marginHorizontal: 20,
                        elevation: 10,
                    }}>
                      <Text 
                        style = {{
                          fontStyle: 'normal', 
                          fontWeight: 'normal', 
                          fontSize: 14, 
                          color: this.props.StyleGlobal.cores.background,
                          marginBottom: 10
                      }}>Informações Complementares</Text>
                    </View>
                    <View
                      style = {{
                        marginTop: 10,
                        marginHorizontal: 30,
                        elevation: 10,
                    }}>
                      <Text
                        style = {{
                          fontStyle: 'normal', 
                          fontWeight: 'normal', 
                          fontSize: 14, 
                          color: this.props.StyleGlobal.fontes.corpadrao,
                          marginBottom: 10
                      }}>{"IdCasal"}</Text>
                      <TextInput
                        style = {{
                          flexDirection: 'column',
                          paddingHorizontal: 16,
                          backgroundColor: '#FFFFFF',
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          borderRadius: 5,
                          marginTop: 4,
                          marginBottom: 8,
                          color: '#262825',
                          fontStyle: 'normal',
                          fontWeight: 'normal',
                          fontSize: 12,
                          height: 52
                        }}
                        placeholder = {"Informe o 'IdCasal' presente no TSE"}
                        placeholdercolor = {'#8F998F'}
                        keyboardType = {'numeric'}
                        returnKeyType = {Platform.OS === "ios" ? "done" : "go"}
                        autoCapitalize = {'none'}
                        editable = {true}
                        id = {(ref) => {}}
                        value = {this.state.IdCasal}
                        onChangeText = {(value) => {
                          this.setState({IdCasal: value})
                      }}
                      />
                    </View>
                    <TouchableOpacity activeOpacity = {1}
                      style = {{
                        marginTop: 10,
                        marginHorizontal: 30,
                        marginBottom: 10
                      }}
                      onPress = { async () => { this.setVisibilidadeModalSalas(true) }}>
                      <TextInputPicker
                        title = {'Sala'}
                        placeholder = {'Selecione a sala'}
                        placeholdercolor = {this.props.StyleGlobal.cores.background}
                        keyboardType = {'default'}
                        returnKeyType = {'go'}
                        autoCapitalize = {'none'}
                        editable = {false}
                        id = {(ref) => {}}
                        value = {this.state.DescricaoItemPickerSala  == "" ? "Selecione a sala" : this.state.DescricaoItemPickerSala}
                      />
                    </TouchableOpacity>
                    {this.state.DescricaoItemPickerSala != "" &&
                    <TouchableOpacity activeOpacity = {1}
                      disabled = {this.state.ListaPickerPromotor != "" ? false : true}
                      style = {{
                        marginTop: 10,
                        marginHorizontal: 30,
                      }}
                      onPress = { async () => { this.setVisibilidadeModalPromotor(true) }}>
                      <TextInputPicker
                        title = {'Captador/Promotor'}
                        placeholder = {'Selecione o captador/promotor'}
                        placeholdercolor = {this.props.StyleGlobal.cores.background}
                        keyboardType = {'default'}
                        returnKeyType = {'go'}
                        autoCapitalize = {'none'}
                        editable = {false}
                        id = {(ref) => {}}
                        value = {this.state.DescricaoItemPickerPromotor == "" ? "Selecione o captador/promotor" : this.state.DescricaoItemPickerPromotor}
                      />
                    </TouchableOpacity>}
                    {this.state.DescricaoItemPickerSala != "" &&
                    <TouchableOpacity activeOpacity = {1}
                      disabled = {this.state.ListaPickerAssessorTlmkt != "" ? false : true}
                      style = {{
                        marginTop: 10,
                        marginHorizontal: 30,
                      }}
                      onPress = { async () => { this.setVisibilidadeModalTlmkt(true) }}>
                      <TextInputPicker
                        title = {'Assessor Tlmkt'}
                        placeholder = {'Selecione o assessor Tlmkt'}
                        placeholdercolor = {this.props.StyleGlobal.cores.background}
                        keyboardType = {'default'}
                        returnKeyType = {'go'}
                        autoCapitalize = {'none'}
                        editable = {false}
                        id = {(ref) => {}}
                        value = {this.state.DescricaoItemPickerTlmkt == "" ? "Selecione o assessor Tlmkt" : this.state.DescricaoItemPickerTlmkt}
                      />
                    </TouchableOpacity>}
                    {this.state.DescricaoItemPickerSala != "" &&
                    <TouchableOpacity activeOpacity = {1}
                      style = {{
                        marginTop: 10,
                        marginHorizontal: 30,
                      }}
                      onPress = { async () => { this.setVisibilidadeModalLiners(true) }}>
                      <TextInputPicker
                        title = {'Liner'}
                        placeholder = {'Selecione o liner'}
                        placeholdercolor = {this.props.StyleGlobal.cores.background}
                        keyboardType = {'default'}
                        returnKeyType = {'go'}
                        autoCapitalize = {'none'}
                        editable = {false}
                        id = {(ref) => {}}
                        value = {this.state.DescricaoItemPickerLiner == "" ? "Selecione o liner" : this.state.DescricaoItemPickerLiner}
                      />
                    </TouchableOpacity>}
                    {this.state.DescricaoItemPickerSala != "" &&
                    <TouchableOpacity activeOpacity = {1}
                      style = {{
                        marginTop: 10,
                        marginHorizontal: 30,
                      }}
                      onPress = { async () => { this.setVisibilidadeModalClosers(true) }}>
                      <TextInputPicker
                        title = {'Closer'}
                        placeholder = {'Selecione o closer'}
                        placeholdercolor = {this.props.StyleGlobal.cores.background}
                        keyboardType = {'default'}
                        returnKeyType = {'go'}
                        autoCapitalize = {'none'}
                        editable = {false}
                        id = {(ref) => {}}
                        value = {this.state.DescricaoItemPickerCloser == "" ? "Selecione o Closer" : this.state.DescricaoItemPickerCloser}
                      />
                    </TouchableOpacity>}
                    {this.state.DescricaoItemPickerSala != "" &&
                    <TouchableOpacity activeOpacity = {1}
                      style = {{
                        marginTop: 10,
                        marginHorizontal: 30,
                      }}
                      onPress = {async () => { this.setVisibilidadeModalPEP(true) }}>
                      <TextInputPicker
                        title = {'PEP'}
                        placeholder = {'Selecione o PEP'}
                        placeholdercolor = {this.props.StyleGlobal.cores.background}
                        keyboardType = {'default'}
                        returnKeyType = {'go'}
                        autoCapitalize = {'none'}
                        editable = {false}
                        id = {(ref) => {}}
                        value = {this.state.DescricaoItemPickerPEP == "" ? "Selecione o PEP" : this.state.DescricaoItemPickerPEP}
                      />
                    </TouchableOpacity>}
                    {this.state.DescricaoItemPickerSala != "" &&
                    <TouchableOpacity activeOpacity = {1}
                      disabled = {this.state.ListaPickerSubGerenteDeSala != "" ? false : true}
                      style = {{
                        marginTop: 10,
                        marginHorizontal: 30,
                      }}
                      onPress = {async () => { this.setVisibilidadeModalSubGerenteSala(true) }}>
                      <TextInputPicker
                        title = {'Sub gerente de sala'}
                        placeholder = {this.state.ListaPickerSubGerenteDeSala != "" ? 'Selecione o sub gerente de sala' : 'Não é necessário selecionar sub gerente'}
                        placeholdercolor = {this.props.StyleGlobal.cores.background}
                        keyboardType = {'default'}
                        returnKeyType = {'go'}
                        autoCapitalize = {'none'}
                        editable = {false}
                        id = {(ref) => {}}
                        value = {this.state.DescricaoItemPickerSubGerenteDeSala == "" ? "Selecione o sub gerente da sala" : this.state.DescricaoItemPickerSubGerenteDeSala}
                      />
                    </TouchableOpacity>}
                    {this.state.DescricaoItemPickerSala != "" &&
                    <TouchableOpacity activeOpacity = {1}
                      style = {{
                        marginTop: 10,
                        marginHorizontal: 30,
                      }}
                      onPress = {async () => { this.setVisibilidadeModalGerenteSala(true) }}>
                      <TextInputPicker
                        title = {'Gerente de sala'}
                        placeholder = {'Selecione o gerente de sala'}
                        placeholdercolor = {this.props.StyleGlobal.cores.background}
                        keyboardType = {'default'}
                        returnKeyType = {'go'}
                        autoCapitalize = {'none'}
                        editable = {false}
                        id = {(ref) => {}}
                        value = {this.state.DescricaoItemPickerGerenteDeSala == "" ? "Selecione o gerente de sala" : this.state.DescricaoItemPickerGerenteDeSala}
                      />
                    </TouchableOpacity>}
                </View>}
                  {this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda != '' && this.state.ListaPickerFinalidadeDeCompra.length > 0 &&
                  <TouchableOpacity activeOpacity = {1}
                    style = {{
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}
                    onPress = { async () => {
                      this.setVisibilidadeModalFinalidades(true)
                  }}>
                    <TextInputPicker
                      title = {'Finalidade de compra'}
                      placeholder = {'Selecione a finalidade'}
                      placeholdercolor = {this.props.StyleGlobal.cores.background}
                      keyboardType = {'default'}
                      returnKeyType = {'go'}
                      autoCapitalize = {'none'}
                      editable = {false}
                      id = {(ref) => {}}
                      value = {this.state.DescricaoItemPickerFinalidadeDeCompra == "" ? "Selecione a finalidade" : this.state.DescricaoItemPickerFinalidadeDeCompra}
                    />
                  </TouchableOpacity>}
                  {this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda != '' &&
                  <View style = {{flexDirection: 'row', alignItems: 'center', flex: 1, width: Dimensions.get("window").width}}>
                    <View style = {{width: Dimensions.get("window").width}}>
                      <DateTimePickerModal
                        isVisible = {this.state.VisibilidadePickerDateProposta}
                        mode = {"date"}
                        locale = {"pt-BR"}
                        is24Hour = {true}
                        date = {this.state.DataDaProposta}
                        maximumDate = {new Date((new Date().getFullYear() + 2).toString() + "-01-01")}
                        headerTextIOS = {"Vencimento"}
                        cancelTextIOS = {"Cancelar"}
                        confirmTextIOS = {"Confirmar"}
                        onConfirm = { async (date) => {
                          const currentDate = date || this.state.DataDaProposta
                          this.state.DataDaProposta = currentDate
                          this.setState({VisibilidadePickerDateProposta: false})
                        }}
                        onCancel = {  async () => {
                          this.setState({VisibilidadePickerDateProposta: false})
                        }}
                      />
                      <TouchableOpacity
                        onPress = { async () => {
                          this.state.VisibilidadePickerDateProposta == false ? this.state.VisibilidadePickerDateProposta = true : this.state.VisibilidadePickerDateProposta = false
                          await this.setState({Renderizar: this.state.Renderizar})
                        }} activeOpacity = {1}
                        style = {{
                          marginTop: 10,
                          marginHorizontal: 20,
                          marginBottom: 10
                      }}>
                        {true &&
                          <>
                            <View>
                              <Text
                                style = {{
                                  fontStyle: 'normal', 
                                  fontWeight: 'normal', 
                                  fontSize: 14, 
                                  color: this.props.StyleGlobal.cores.background,
                                  marginBottom: 10
                              }}>{"Data da proposta"}</Text>
                              <View
                                style = {{
                                  backgroundColor: '#FFFFFF',
                                  borderColor: 'rgba(16, 22, 26, 0.15)',
                                  borderWidth: 1,
                                  height: 52,
                                  paddingHorizontal: 16,
                                  borderRadius: 5,
                                  flexDirection: 'row', 
                                  alignItems: 'center'
                              }}>
                                <Text
                                  style = {{
                                    flexDirection: 'column',
                                    borderColor: this.props.StyleGlobal.cores.background,
                                    color: '#262825',
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    fontSize: 11,
                                    textAlignVertical: 'center',
                                }}>{moment(this.state.DataDaProposta, true).format('DD/MM/YYYY')}</Text>
                                <Icon name = "event" size = {10} color = {this.props.StyleGlobal.cores.background} style = {{marginLeft: 5}}/>
                              </View>
                            </View>
                          </>
                        }
                      </TouchableOpacity>
                    </View>
                  </View>}
                </View>
              </View>
            </ScrollView> 
          </View>
          <View
            style = {{
              paddingHorizontal: 20, 
              backgroundColor: '#FFFFFF',
          }}>
            <View 
              style = {{
                flexDirection: 'row', 
                justifyContent: 'space-between'
            }}>
              <View>
                <Text style ={{textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color: '#8F998F', marginTop: 15}}>Valor total do lote</Text>
                <Text 
                  style = {{
                    fontStyle: 'normal', 
                    fontWeight: 'normal', 
                    fontSize: 18, 
                    color: this.props.StyleGlobal.cores.botao, 
                    marginBottom: 15,
                    textAlign: 'left',
                }}>{this.state.ItemPickerCondicoesDaTabelaDeVenda != "" ? formatoDeTexto.FormatarTexto(((this.state.IntermediariaExiste == true ? ( this.props.EmpresaLogada[0] == 8 ? ((this.state.ListaDeIntermediarias).reduce((total, intermediaria) => (total + (intermediaria.Qtde * intermediaria.ValorPMT)), 0)) : ((this.state.ListaDeIntermediarias).reduce((total, intermediaria) => (total + (intermediaria.Qtde * intermediaria.Valor)), 0))) : 0) + (this.state.ParcelaBancoExiste == true ? (this.state.ParcelaBancoQtde * this.state.ParcelaBancoValor) : 0) + (this.state.ParcelaObraExiste == true ? (this.props.EmpresaLogada[0] == 8 ? (this.state.ParcelaObraQtde * this.state.ParcelaObraValorPMT) : (this.state.ParcelaObraQtde * this.state.ParcelaObraValor)) : 0) + (this.props.EmpresaLogada[0] == 8 ? (this.state.ParcelaQtde * this.state.ParcelaValorPMT) : (this.state.ParcelaQtde * this.state.ParcelaValor)) + (this.state.SinalExiste == true ? ((this.state.ListaDeSinais).reduce((total, sinal) => total + (sinal.Valor), 0)) : 0) + (this.state.EntradaExiste == true ? ((this.state.ListaDeEntradas).reduce((total, entrada) => total + (entrada.Valor), 0)) : 0) + (((this.props.Corretagem != "" ? this.props.Corretagem[0].valorTotal : 0))) + (this.props.Intermediacao != "" ? this.props.Intermediacao[0].valorTotal : 0))) : formatoDeTexto.FormatarTexto(this.props.LotesReservados[0].valorAVista)}</Text>
              </View>
            </View>
            <View
              style = {{
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <TouchableOpacity
                style = {{
                  flex: 1,
                  backgroundColor: this.props.StyleGlobal.cores.background,
                  padding: 16,
                  alignItems: 'center',
                  marginBottom: 20,
                  borderRadius: 5,
              }}
                onPress = {this.prosseguirParaProximaTela}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    alignSelf: 'center',
                }}>Prosseguir</Text>
              </TouchableOpacity>
            </View>
          </View>
          </>}
        </Container>
    );
  }
  //#endregion

  //#region Controller
  
  //#region Setando a visibilidade da modal de loading
  setVisibilidadeModalLoading(value) {
    this.setState({VisibilidadeModalLoading: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de calculator
  setVisibilidadeModalCalculator(value) {
    this.setState({VisibilidadeModalCalculator: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal das entradas
  setVisibilidadeModalEntradas(value) {
    this.setState({VisibilidadeModalEntradas: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal do financiamento
  setVisibilidadeModalFinanciamento(value) {
    this.setState({VisibilidadeModalFinanciamento: value, PrimeiroVencimentoTemporarioFinanciamento: this.state.PrimeiroVencimentoFinanciamento})
  }
  //#endregion

  //#region Setando a visibilidade da modal de financiamento personalizado
  setVisibilidadeModalFinanciamentoPersonalizado(value) {
    this.setState({VisibilidadeModalFinaciamentoPersonalizado: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de formas de pagamento
  setVisibilidadeModalFormasDePagamento(value) {
    this.setState({VisibilidadeModalFormaDePagamento: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de entradas personalizadas
  setVisibilidadeModalEntradasPersonalizadas(value) {
    this.setState({VisibilidadeModalEntradasPersonalizadas: value})
  }
  //#endregion

  //#region Fazer a transição entre a modal de financiamento e a personalizada
  transicaoPersonalizacao = async () => {
    await this.setVisibilidadeModalFinanciamento(false)
    await this.setVisibilidadeModalFinanciamentoPersonalizado(true)
  }
  //#endregion

  //#region Setando Primeiro vencimento do financiamento
  setPrimeiroVencimentoFinanciamento = async (value) => {
    await this.setState({ PrimeiroVencimentoTemporarioFinanciamento: value })
  }
  //#endregion

  //#region Setando Parcelas do financiamento
  setParcelasFinancimento = async (value) => {
    await this.setState({ParcelasTemporarioFinanciamento: value})
  }
  //#endregion

  //#region Setando Valor da parcela do financiamento
  setValorDaParcelaFinanciamento = async (value) => {
    await this.setState({ValorDaParcelaTemporarioFinanciamento: formatoDeTexto.Moeda(value)})
  }
  //#endregion

  //#region Setando a referencia do input do primeiro vencimento do financiamento
  setIdInputPrimeiroVencimentoFinanciamento(value) {
    this.InputPrimeiroVencimentoFinanciamento = value
  }
  //#endregion

  //#region Setando a referencia do input das parcelas do financiamento
  setIdInputParcelasFinanciamento(value) {
    this.InputParcelasFinanciamento = value
  }
  //#endregion

  //#region Setando a referencia do input do valor da parcela do financiamento
  setIdInputValorDaParcelaFinanciamento(value) {
    this.InputValorDaParcelaFinanciamento = value
  }
  //#endregion

  //#region Focando o input do primeiro vencimento do financiamento
  focoInputPrimeiroVencimentoFinanciamento() {
    this.InputPrimeiroVencimentoFinanciamento.focus()
  }
  //#endregion

  //#region Submit no input da data do financiamento
  submitInputDataFinanciamento = async  () => {
    if(await Validacoes.Data(this.state.PrimeiroVencimentoTemporarioFinanciamento) == true) {
      if(this.state.ParcelasTemporarioFinanciamento == null || this.state.ParcelasTemporarioFinanciamento == "") {
        this.InputQtdeParcelasPersonalizadas.focus()
      } else {
        if(this.state.ParcelasTemporarioFinanciamento != null && this.state.ParcelasTemporarioFinanciamento != "" && this.state.ParcelasTemporarioFinanciamento > 0) {
          await this.setVisibilidadeModalCalculator(true)
          await this.simulandoTabelaDeParcelasPorQtdeTitulos()
        } else if (this.state.ValorTotalTemporarioFinanciamento != null && this.state.ValorTotalTemporarioFinanciamento != "" && this.state.ValorTotalTemporarioFinanciamento > 0) {
          await this.setVisibilidadeModalCalculator(true)
          await this.simulandoTabelaDeParcelasPorValorDaParcela()
        }
      }
    }
    this.InputParcelasFinanciamento.focus()
  }
  //#endregion

  //#region Submit nas parcelas do financiamento
  submitInputParcelasFinanciamento = async () => {
    if(parseInt(this.state.ParcelasTemporarioFinanciamento) > 0 && this.state.ParcelasTemporarioFinanciamento != null) {
      await this.setVisibilidadeModalCalculator(true)
      await this.simulandoTabelaDeParcelasPorQtdeTitulos()
    }
    this.InputValorDaParcelaFinanciamento.focus()
  }
  //#endregion

  //#region Submit no valor do financiamento
  submitInputValorFinanciamento = async () => {
    await this.setVisibilidadeModalCalculator(true)
    await this.simulandoTabelaDeParcelasPorValorDaParcela()
  }
  //#endregion

  //#region Validando dados do financiamento personalizado
  validandoDadosDoFinanciamentoPersonalizado = async () => {
    if(this.state.PrimeiroVencimentoFinanciamento != null && this.state.PrimeiroVencimentoFinanciamento != "" && this.state.ParcelasFinanciamento != null && this.state.ParcelasFinanciamento != "" && this.state.ValorDaParcelaFinanciamento != null && this.state.ValorDaParcelaFinanciamento != "") 
    {
      this.setState({
        ValorTotalFinanciamento: this.state.ValorTotalTemporarioFinanciamento,
        PrimeiroVencimentoFinanciamento: this.state.PrimeiroVencimentoTemporarioFinanciamento,
        ParcelasFinanciamento: this.state.ParcelasTemporarioFinanciamento,
        ValorDaParcelaFinanciamento: formatoDeTexto.MoedaOriginal(this.state.ValorDaParcelaTemporarioFinanciamento),
      })
      await this.setVisibilidadeModalFinanciamentoPersonalizado(false)
    }
    else
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Aviso: "Os dados do financiamento personalizado não foram preenchidos corretamente"`
      })
    }
  }
  //#endregion

  //#region Validando selecao do financiamento
  validandoSelecaoDoFinanciamento = async () => {
    if(this.state.PrimeiroVencimentoFinanciamento != null && this.state.PrimeiroVencimentoFinanciamento != "" && this.state.ParcelasFinanciamento != null && this.state.ParcelasFinanciamento != "" && this.state.ValorDaParcelaFinanciamento != null && this.state.ValorDaParcelaFinanciamento != "") 
    {
      this.setVisibilidadeModalFinanciamento(false)
    }
    else
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Aviso: "Os dados do financiamento personalizado não foram preenchidos corretamente"`
      })
    }
  }
  //#endregion

  //#region Pegando tabela de financiamento no redux
  pegandoTabelasFinanciamento = async () => {
    this.setState({TabelaFinanciamento: this.props.tabelaFinanciamento[0]})
    this.setState({
      CondicoesDaTabelaDeVenda: this.props.tabelaDeVendas[0].tabelaCompleta.classificacoesDosTitulosDaTabelaDeVenda,
      ListaPickerCondicoesDaTabelaDeVenda: (this.props.tabelaDeVendas[0].tabelaCompleta.classificacoesDosTitulosDaTabelaDeVenda.filter(tabela => tabela.classificacao.descricao == 'Parcela'))[0].condicoesDaTabelaDeVenda,
      IndexEscolha: this.state.TabelaFinanciamento.length - 1,
      IndexEscolhaTemporaria: this.state.TabelaFinanciamento.length - 1,
      ValorTotalFinanciamento: this.props.tabelaFinanciamento[0][0].valorTotal,
      PrimeiroVencimentoFinanciamento: formatoDeTexto.DataInvertendoJSON((this.props.tabelaFinanciamento[0][0].primeiroVencimento).replace('T00:00:00', '')),
      ValorDaParcelaFinanciamento: this.state.TabelaFinanciamento[this.state.TabelaFinanciamento.length - 1].principal,
      ParcelasFinanciamento: this.state.TabelaFinanciamento[this.state.TabelaFinanciamento.length - 1].qtdeDeTitulos,
      EmpresaId: this.props.empresa[0].empresa  
    })
    console.log('Picker Condicoes', this.state.CondicoesDaTabelaDeVenda)
    await this.pegandoListaFormasDePagamentos()
  }
  //#endregion

  //#region Renderizando tabela de financiamento
  renderItemFinanciamento =  ({ item, index }) => (
    <>
      <TouchableOpacity activeOpacity = {1} onPress = {async () => {
        await this.setState({IndexEscolhaTemporaria: index})
        this.setandoOutraEscolhaTemporariaFinanciamento(item.qtdeDeTitulos, this.state.PrimeiroVencimentoTemporarioFinanciamento, item.principal, item.valorTotal, index)
        }}>
        <View key = {item.qtdeDeTitulos} style = {{width: '100%', flexDirection: 'row', backgroundColor: index == this.state.IndexEscolhaTemporaria ? '#00482D' : '#FFFFFF', height: 62, alignItems: 'center', paddingHorizontal: 24}}>
          <Text style = {{width: '20%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: item.status == true ? '#FFFFFF' : '#8F998F'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{item.qtdeDeTitulos}x</Text>
          <Text style = {{width: '35%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: item.status == true ? '#FFFFFF' : '#262825'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.Moeda(parseInt(item.principal * 100))}</Text>
          <Text style = {{width: '45%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: item.status == true ? '#FFFFFF' : '#00482D'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.Moeda(parseInt(item.valorTotal * 100))}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
  //#endregion

  //#region Setando outra escolha temporaria para o financiamento
  setandoOutraEscolhaTemporariaFinanciamento = async (qtdeParcelas, vencimento, valor, valorTotal, posicao) => {
    this.state.TabelaFinanciamento.map((financiamento, index) => {
      if(posicao == index)
      {
        financiamento.status = true
      }
      else
      {
        financiamento.status = false
      }
    })
    this.state.ParcelasTemporarioFinanciamento = qtdeParcelas
    this.state.PrimeiroVencimentoFinanciamento = vencimento
    this.state.ValorDaParcelaTemporarioFinanciamento = valor
    await this.setState({ ValorTotalTemporarioFinanciamento: valorTotal })
  }
  //#endregion

  //#region Setando outra escolha para financiamento
  setandoOutraEscolhaAnteriorFinanciamento = async () => {
    this.state.TabelaFinanciamento.map((financiamento, index) => {
      if(index == this.state.IndexEscolha)
      {
        financiamento.status = true
      }
      else
      {
        financiamento.status = false
      }
    })
    this.state.IndexEscolhaTemporaria = this.state.IndexEscolha
    this.state.ParcelasTemporarioFinanciamento = null
    this.state.PrimeiroVencimentoTemporarioFinanciamento = this.state.PrimeiroVencimentoFinanciamento
    this.state.ValorDaParcelaTemporarioFinanciamento = null
    await this.setState({ ValorTotalTemporarioFinanciamento: null })
    this.setVisibilidadeModalFinanciamento(false)
  }
  //#endregion

  //#region Setando para a escolha final do financimento
  setandoParaEscolhaFinanciamento = async () => {
    await this.setVisibilidadeModalCalculator(true)
    await this.pegandoTabelaDeParcelasPorQtdeTitulosREDUX()
  }
  //#endregion

  //#region Setando a visibilidade da modal das condições da tabela de vendas
  setVisibilidadeModalCondicoesTabelaDeVendas(value) {
    this.setState({VisibilidadeModalCondicoesDaTabelaDeVenda: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal das salas
  setVisibilidadeModalSalas(value) {
    this.setState({VisibilidadeModalSalas: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal das tlmkt
  setVisibilidadeModalTlmkt(value) {
    this.setState({VisibilidadeModalAssessorTlmkt: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal das captador promotor
  setVisibilidadeModalPromotor(value) {
    this.setState({VisibilidadeModalCaptadorPromotor: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal dos liners
  setVisibilidadeModalLiners(value) {
    this.setState({VisibilidadeModalLiners: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal dos closers
  setVisibilidadeModalClosers(value) {
    this.setState({VisibilidadeModalClosers: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal do PEP
  setVisibilidadeModalPEP(value) {
    this.setState({VisibilidadeModalPEP: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal dos Subs gerentes de sala
  setVisibilidadeModalSubGerenteSala(value) {
    this.setState({VisibilidadeModalSubGerenteSala: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal dos gerentes de sala
  setVisibilidadeModalGerenteSala(value) {
    this.setState({VisibilidadeModalGerenteSala: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal das finalidades
  setVisibilidadeModalFinalidades(value) {
    this.setState({VisibilidadeModalFinalidades: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal option
  setVisibilidadeModalOption = async (value) => {
    this.setState({VisibilidadeModalOption: value})
  }
  //#endregion

  //#region Renderizando a lista das condições da tabela de vendas
  renderCondicoesTabelaDeVenda = ({ item, index }) => (
    <>
      <TouchableOpacity activeOpacity = {0.75} key = {item.descricao} style = {{paddingHorizontal: 5}}
        onPress = { async () => {
          if(item.descricao != this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda)
          {
            this.state.EntradaExiste = false
            this.state.SinalExiste = false
            this.state.ParcelaObraExiste = false
            this.state.ParcelaBancoExiste = false
            this.state.ListaDeEntradas = []
            this.state.ListaDeSinais = []
            this.state.ListaDeIntermediarias = []
            this.state.EntradasQtde = 0
            this.state.EntradaValorTotal = 0
            this.state.SinalQtde = 0
            this.state.SinalValorTotal = 0
            this.state.IntermediariasQtde = 0
            this.state.ParcelaValor = 0
            this.state.ParcelaValorPMT = 0
            this.state.ParcelaValorTotal = 0
            this.state.ParcelaValorTotalJuros = 0
            this.state.ParcelaQtde = 0
            this.state.ParcelaVencimento = undefined
            this.state.ParcelaPickerVencimento = false
            this.state.ParcelaObraValor = 0
            this.state.ParcelaObraValorPMT = 0,
            this.state.ParcelaObraValorTotal = 0
            this.state.ParcelaObraValorTotalJuros = 0
            this.state.ParcelaObraQtde = 0
            this.state.ParcelaObraVencimento = undefined
            this.state.ParcelaObraPickerVencimento = false
            this.state.ParcelaBancoValor = 0
            this.state.ParcelaBancoValorTotal = 0
            this.state.ParcelaBancoQtde = 0
            this.state.ParcelaBancoVencimento = undefined
            this.state.ParcelaBancoPickerVencimento = false

            try {
              this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda = item.descricao
              this.state.ItemPickerCondicoesDaTabelaDeVenda = item

              var ListaDeEntradas = [];
              var EntradaValor = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 3)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.valorTotal ?? 0;
              var EntradaQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 3)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
              var EntradaVencimento = new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 3)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.primeiroVencimento ?? new Date());
              this.state.EntradasQtde = EntradaQtde
              this.state.EntradaValorTotal = EntradaValor

              for (let i = 0; i < EntradaQtde; i++) {
                  let Vencimento = new Date(EntradaVencimento)
                  Vencimento.setUTCHours(23);
                  Vencimento.setMonth(Vencimento.getMonth() + (i == 0 ? 0 : 1));
                  ListaDeEntradas.push({
                      Valor: (i == EntradaQtde - 1) ? (EntradaValor - (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((EntradaValor/EntradaQtde)))) * (EntradaQtde - 1)) : (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((EntradaValor/EntradaQtde)))),
                      Vencimento: item.descricao.includes("À Vista") ? new Date() : Vencimento,
                      PickerDate: false,
                      MeioDePagamento: "",
                      ModalMeioDePagamento: false,
                      ModalBanco: false,
                      ModalBanderia: false,
                      ModalMaquina: false,
                      ModalOperacao: false,
                      ModalPagamentos: false,
                      ModalReplicarDados: false,
                      Banco: { chave: '', Valor: '' }, 
                      Agencia: '',
                      Conta: '',
                      DigitoDaConta: '',
                      Titular: '',
                      NumeroCheque: '',
                      Maquina: { chave: '', Valor: '' },
                      Bandeira: { chave: '', Valor: '' },
                      DigitoCartao: '',
                      Operacao: { chave: '', Valor: ''},
                      NSU: '',
                      NumeroDaOperacao: ''
                  });
                  EntradaVencimento = Vencimento;
              }
              this.state.ListaDeEntradas = ListaDeEntradas
              this.state.ListaDeEntradas != "" ? this.state.EntradaExiste = true : this.state.EntradaExiste = false
              
              var ListaDeSinais = [];
              var SinalValor = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 2)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.valorTotal ?? 0;
              var SinalQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 2)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
              var SinalVencimento = this.state.ListaEntradas != "" ? new Date(EntradaVencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 2)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.primeiroVencimento ?? new Date());

              this.state.SinalQtde = SinalQtde
              this.state.SinalValorTotal = SinalValor

              for (let i = 0; i < SinalQtde; i++) {
                  let Vencimento = new Date(SinalVencimento);
                  Vencimento.setUTCHours(23);
                  Vencimento.setMonth(SinalVencimento.getMonth() + 1);
                  ListaDeSinais.push({
                      Valor: (i == SinalQtde - 1) ? (SinalValor - (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((SinalValor/SinalQtde)))) * (SinalQtde - 1)) : (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((SinalValor/SinalQtde)))),
                      Vencimento: item.descricao.includes("À Vista") ? new Date() : Vencimento,
                      PickerDate: false,
                      MeioDePagamento: "Boleto",
                      ModalMeioDePagamento: false,
                      ModalBanco: false,
                      ModalBanderia: false,
                      ModalMaquina: false,
                      ModalOperacao: false,
                      ModalPagamentos: false,
                      ModalReplicarDados: false,                 
                      Banco: { chave: '', Valor: '' }, 
                      Agencia: '',
                      Conta: '',
                      DigitoDaConta: '',
                      Titular: '',
                      NumeroCheque: '',
                      Maquina: { chave: '', Valor: '' },
                      Bandeira: { chave: '', Valor: '' },
                      DigitoCartao: '',
                      Operacao: { chave: '', Valor: ''},
                      NSU: '',
                      NumeroDaOperacao: ''
                  });
                  SinalVencimento = Vencimento;
              }
              this.state.ListaDeSinais = ListaDeSinais
              this.state.ListaDeSinais != "" ? this.state.SinalExiste = true : this.state.SinalExiste = false

              var ListaDeIntermediarias = []
              if((this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 14)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))) != undefined)
              {
                var IntermediariaQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 14)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
                var IntermediariaValorTotalJuros =  this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 14)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.valorTotal ?? 0;
                // var IntermediariaValor = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 14)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.valorTotal ?? 0;
                var IntermediariaValor = this.props.EmpresaLogada[0] == 8 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(pv(0.01, IntermediariaQtde, - formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(IntermediariaValorTotalJuros/IntermediariaQtde))))) : this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 14)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.valorTotal ?? 0;
                var IntermediariaVencimento = new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 14)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.primeiroVencimento ?? new Date());
                var IntermediariaValorPMT = this.props.EmpresaLogada[0] == 8 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(IntermediariaValorTotalJuros/IntermediariaQtde)) : formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(IntermediariaValor/IntermediariaQtde))
                // var IntermediariaValorPMT = this.props.EmpresaLogada[0] == 8 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(Math.abs(PMT(0.01, parseInt(IntermediariaQtde), parseFloat(IntermediariaValor), 0, 0)))) : formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(IntermediariaValor/IntermediariaQtde))
                this.state.IntermediariasQtde = IntermediariaQtde

                const Present = pv(0.01, 3, -(1079.57))
                let Vencimento = new Date(IntermediariaVencimento)
                Vencimento.setUTCHours(23);
                Vencimento.setMonth(Vencimento.getMonth() + 12);
                ListaDeIntermediarias = [
                    {
                      id: 0,
                      Valor: formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((IntermediariaValor/IntermediariaQtde))),
                      ValorPMT: IntermediariaValorPMT,
                      ValorTotal: (IntermediariaValor),
                      ValorTotalJuros: (IntermediariaValorPMT * IntermediariaQtde),
                      Vencimento: item.descricao.includes("À Vista") ? new Date() : Vencimento,
                      PickerDate: false,
                      Qtde: IntermediariaQtde,
                      MeioDePagamento: "Boleto",
                      MesReferencia: this.state.CalendarioMeses.filter(meses => (meses.id == (item.descricao.includes("À Vista") ? (new Date().getMonth() + 1) : (Vencimento.getMonth() + 1))))[0],
                      DiaVencimento: Vencimento.getDate(),
                      ModalMeioDePagamento: false,
                      ModalBanco: false,
                      ModalBanderia: false,
                      ModalMaquina: false,
                      ModalOperacao: false,
                      ModalCalendario: false,
                      Banco: { chave: '', Valor: '' }, 
                      Agencia: '',
                      Conta: '',
                      DigitoDaConta: '',
                      Titular: '',
                      NumeroCheque: '',
                      Maquina: { chave: '', Valor: '' },
                      Bandeira: { chave: '', Valor: '' },
                      DigitoCartao: '',
                      Operacao: { chave: '', Valor: ''},
                      NSU: '',
                      NumeroDaOperacao: ''
                    }
                ];

                this.state.ListaDeIntermediarias = ListaDeIntermediarias
                this.state.ListaDeIntermediarias != "" ? this.state.IntermediariaExiste = true : this.state.IntermediariaExiste = false
                this.state.ListaDeIntermediarias != "" ? this.state.DescricaoItemPickerPeriodicidade = 'Anual' : this.state.DescricaoItemPickerPeriodicidade = ''
              }
              else
              {
                this.state.IntermediariaExiste = false
              }

              if((this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))) != undefined)
              {
                var ParcelaBancoQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
                var ParcelaBancoVencimento = this.state.ListaDeSinais != "" ? new Date(SinalVencimento) : (this.state.ListaDeEntradas != "" ? new Date(EntradaVencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.primeiroVencimento ?? new Date()));
                var ParcelaBancoValorTotal = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.valorTotal ?? 0;
                
                ParcelaBancoVencimento.setUTCHours(23);
                ParcelaBancoVencimento.setMonth(ParcelaBancoVencimento.getMonth() + 1);
                this.state.ParcelaBancoValor = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.principal ?? 0
                this.state.ParcelaBancoValorTotal = ParcelaBancoValorTotal
                this.state.ParcelaBancoQtde = ParcelaBancoQtde
                this.state.ParcelaBancoVencimento = item.descricao.includes("À Vista") ? new Date() : new Date(ParcelaBancoVencimento) 
                this.state.ParcelaBancoExiste = true
              } 
              else
              {
                this.state.ParcelaBancoExiste = false
              }

              if((this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))) != undefined) {
                var ParcelaObraQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
                var ParcelaObraVencimento = this.state.ParcelaBancoExiste == true ? new Date(ParcelaBancoVencimento) : (this.state.ListaDeSinais != "" ? new Date(SinalVencimento) : (this.state.ListaDeEntradas != "" ? new Date(EntradaVencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.primeiroVencimento ?? new Date())));
                var ParcelaObraValorTotalJuros = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.valorTotal ?? 0;
                // var ParcelaObraValorTotal = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.valorTotal ?? 0;
                var ParcelaObraValorTotal = this.props.EmpresaLogada[0] == 8 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(pv(0.01, ParcelaObraQtde, -formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ParcelaObraValorTotalJuros/ParcelaObraQtde))))) : this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.valorTotal ?? 0;
                
                ParcelaObraVencimento.setUTCHours(23);
                ParcelaObraVencimento.setMonth(ParcelaObraVencimento.getMonth() + (this.state.ParcelaBancoExiste == true ? parseInt(ParcelaBancoQtde) : 1));
                this.state.ParcelaObraValor = this.props.EmpresaLogada[0] == 8 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ParcelaObraValorTotal/ParcelaObraQtde)) : formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.principal ?? 0));
                this.state.ParcelaObraValorPMT = formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ParcelaObraValorTotalJuros/ParcelaObraQtde))
                // this.state.ParcelaObraValorPMT = formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(Math.abs(PMT(0.01, parseInt(ParcelaObraQtde), parseFloat(ParcelaObraValorTotal), 0, 0))))
                this.state.ParcelaObraQtde = ParcelaObraQtde
                this.state.ParcelaObraValorTotal = ParcelaObraValorTotal
                this.state.ParcelaObraValorTotalJuros = (this.state.ParcelaObraValorPMT * this.state.ParcelaObraQtde)
                this.state.ParcelaObraVencimento = item.descricao.includes("À Vista") ? new Date() : new Date(ParcelaObraVencimento) 
                this.state.ParcelaObraExiste = true
              } 
              else
              {
                this.state.ParcelaObraExiste = false
              }

              var ParcelaQtde = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.qtdeDeTitulos ?? 0;
              var ParcelaVencimento = this.state.ParcelaObraExiste == true ? new Date(ParcelaObraVencimento) : (this.state.ParcelaBancoExiste == true ? new Date(ParcelaBancoVencimento) : (this.state.ListaDeSinais != "" ? new Date(SinalVencimento) : (this.state.ListaDeEntradas != "" ? new Date(EntradaVencimento) : new Date(this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 14)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.primeiroVencimento ?? new Date()))));
              var ParcelaValorTotalJuros = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.valorTotal ?? 0;
              // var ParcelaValorTotal = this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.valorTotal ?? 0;
              // var ParcelaValorTotal = this.props.EmpresaLogada[0] == 8 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(pv(0.01, ParcelaQtde, -formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ParcelaValorTotalJuros/ParcelaQtde))))) :  this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.valorTotal ?? 0;
              
              var ParcelaValorTotal = this.props.EmpresaLogada[0] == 8 ? formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(pv(0.01, ParcelaQtde, - formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ParcelaValorTotalJuros/ParcelaQtde))))) : (formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto((this.state.CondicoesDaTabelaDeVenda.find((Item) => Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((Item) => Item.descricao.includes(item?.descricao ?? ""))?.principal ?? 0))) * (this.state.CondicoesDaTabelaDeVenda.find((Item) => Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao  ?? ""))?.qtdeDeTitulos ?? 0))

              this.state.ParcelaValor = this.props.EmpresaLogada[0] == 8 ?  formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ParcelaValorTotal/ParcelaQtde)) : ((this.state.CondicoesDaTabelaDeVenda.find((_Item) => _Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((_Item) => _Item.descricao.includes(item?.descricao ?? ""))?.principal ?? 0))
              this.state.ParcelaValorPMT = formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ParcelaValorTotalJuros/ParcelaQtde))
              // this.state.ParcelaValorPMT = formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(Math.abs(PMT(0.01, parseInt(ParcelaQtde), parseFloat(ParcelaValorTotal), 0, 0))))
              this.state.ParcelaQtde = ParcelaQtde
              this.state.ParcelaValorTotal = ParcelaValorTotal
              this.state.ParcelaValorTotalJuros = (this.state.ParcelaValorPMT * this.state.ParcelaQtde)

              if (item.descricao.includes("Anual") == true) {
                ParcelaVencimento = new Date();
                ParcelaVencimento.setUTCHours(23);
                ParcelaVencimento.setMonth(ParcelaVencimento.getMonth() + 12);
                this.state.ParcelaVencimento = new Date(ParcelaVencimento)
              }
              else {
                ParcelaVencimento.setUTCHours(23);
                ParcelaVencimento.setMonth(ParcelaVencimento.getMonth() + (this.state.ParcelaObraExiste == true ? parseInt(ParcelaObraQtde) : (this.state.ParcelaBancoExiste == true ? parseInt(ParcelaBancoQtde) : 1)));
                this.state.ParcelaVencimento = item.descricao.includes("À Vista") ? new Date() : new Date(ParcelaVencimento)
              }
              this.setVisibilidadeModalCondicoesTabelaDeVendas(false)

            } catch {this.setVisibilidadeModalCondicoesTabelaDeVendas(false)}
          }
          else {this.setVisibilidadeModalCondicoesTabelaDeVendas(false)}
      }}>
        <View 
          style = {{
            backgroundColor: item.descricao == this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda ? this.props.StyleGlobal.cores.background : '#FFFFFF',
            width: '100%',
            borderWidth: 1,
            borderColor: 'rgba(16, 22, 26, 0.15)',
            borderRadius: 5,
            height: 58,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5
        }}>
          <Text 
            style = {{
              paddingVertical: 0,
              fontSize: 12,
              color: item.descricao == this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda ? "#FFFFFF" : '#262825',
              fontWeight: item.descricao == this.state.DescricaoItemPickerCondicoesDaTabelaDeVenda ? 'bold' : 'normal',
              textAlign: 'center',
              textAlignVertical: 'center',
          }}>{item.descricao}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
  //#endregion

  //#region Renderizando a lista das salas
  renderSalas = ({ item, index }) => (
    <>
      <TouchableOpacity activeOpacity = {0.75} key = {item.descricao} style = {{marginHorizontal: 8}}
        onPress = { async () => {
          if(item.descricao != this.state.DescricaoItemPickerSala)
          {
            this.state.ItemPickerSala = item
            this.state.DescricaoItemPickerSala = item.descricao
            this.state.ListaPickerCloser = item.closer
            this.state.ListaPickerAssessorTlmkt = item.assessorTlmkt
            this.state.ListaPickerPromotor = item.promotor
            this.state.ListaPickerLiner = item.liner
            this.state.ListaPickerPEP = item.pep
            this.state.ListaPickerSubGerenteDeSala = item.subGerenteDeSala
            this.state.ListaPickerGerenteDeSala = item.gerenteDeSala
            this.state.ItemPickerSubGerenteDeSala = item.subGerenteDeSala[0]
            this.state.ItemPickerGerenteDeSala = item.gerenteDeSala[0]
            this.state.DescricaoItemPickerSubGerenteDeSala = item.subGerenteDeSala != "" ? item.subGerenteDeSala[0].descricao : ''
            this.state.DescricaoItemPickerGerenteDeSala = item.gerenteDeSala != "" ? item.gerenteDeSala[0].descricao : ''
            // console.log(this.state.ListaPickerPromotor)
            await this.setVisibilidadeModalSalas(false)
          }
          else
          {
            await this.setVisibilidadeModalSalas(false)
          }
      }}>
        <View 
          style = {{
            backgroundColor: item.descricao == this.state.DescricaoItemPickerSala ? this.props.StyleGlobal.cores.background : '#FFFFFF',
            paddingHorizontal: 16,
            width: '100%',
            height: 58,
            borderWidth: 1,
            borderColor: 'rgba(16, 22, 26, 0.15)',
            marginVertical: 5,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <Text 
            style = {{
              paddingVertical: 0,
              fontSize: 12,
              color: item.descricao == this.state.DescricaoItemPickerSala ? "#FFFFFF" : '#262825',
              fontWeight: item.descricao == this.state.DescricaoItemPickerSala ? 'bold' : 'normal',
              textAlign: 'center',
              textAlignVertical: 'center',
          }}>{item.descricao}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
  //#endregion
  
  //#region Renderizando a lista de Tlmkt
  renderTlmkt = ({ item, index }) => (
    <>
      <TouchableOpacity activeOpacity = {0.75} key = {item.descricao} style = {{marginHorizontal: 8}}
        onPress = {async () => {
          if(item.descricao != this.state.DescricaoItemPickerTlmkt)
          {
            this.state.ItemPickerTlmkt = item
            this.state.DescricaoItemPickerTlmkt = item.descricao
            await this.setVisibilidadeModalTlmkt(false)
          }
          else
          {
            await this.setVisibilidadeModalTlmkt(false)
          }
      }}>
        <View 
          style = {{
            backgroundColor: item.descricao == this.state.DescricaoItemPickerTlmkt ? this.props.StyleGlobal.cores.background : '#FFFFFF',
            paddingHorizontal: 16,
            width: '100%',
            height: 58,
            borderWidth: 1,
            borderColor: 'rgba(16, 22, 26, 0.15)',
            marginVertical: 5,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <Text
            style = {{
              paddingVertical: 0,
              fontSize: 12,
              color: item.descricao == this.state.DescricaoItemPickerTlmkt ? "#FFFFFF" : '#262825',
              fontWeight: item.descricao == this.state.DescricaoItemPickerTlmkt ? 'bold' : 'normal',
              textAlign: 'center',
              textAlignVertical: 'center',
          }}>{item.descricao}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
  //#endregion
  
  //#region Renderizando a lista de Promotor
  renderPromotor = ({ item, index }) => (
    <>
      <TouchableOpacity activeOpacity = {0.75} key = {item.descricao} style = {{marginHorizontal: 8}}
        onPress = {async () => {
          if(item.descricao != this.state.DescricaoItemPickerPromotor)
          {
            this.state.ItemPickerPromotor = item
            this.state.DescricaoItemPickerPromotor = item.descricao
            await this.setVisibilidadeModalPromotor(false)
          }
          else
          {
            await this.setVisibilidadeModalPromotor(false)
          }
      }}>
        <View 
          style = {{
            backgroundColor: item.descricao == this.state.DescricaoItemPickerPromotor ? this.props.StyleGlobal.cores.background : '#FFFFFF',
            paddingHorizontal: 16,
            width: '100%',
            height: 58,
            borderWidth: 1,
            borderColor: 'rgba(16, 22, 26, 0.15)',
            marginVertical: 5,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <Text
            style = {{
              paddingVertical: 0,
              fontSize: 12,
              color: item.descricao == this.state.DescricaoItemPickerPromotor ? "#FFFFFF" : '#262825',
              fontWeight: item.descricao == this.state.DescricaoItemPickerPromotor ? 'bold' : 'normal',
              textAlign: 'center',
              textAlignVertical: 'center',
          }}>{item.descricao}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
  //#endregion

  //#region Renderizando a lista de liners
  renderLiner = ({ item, index }) => (
    <>
      <TouchableOpacity activeOpacity = {0.75} key = {item.descricao} style = {{marginHorizontal: 8}}
        onPress = {async () => {
          if(item.descricao != this.state.DescricaoItemPickerLiner)
          {
            this.state.ItemPickerLiner = item
            this.state.DescricaoItemPickerLiner = item.descricao
            await this.setVisibilidadeModalLiners(false)
          }
          else
          {
            await this.setVisibilidadeModalLiners(false)
          }
      }}>
        <View 
          style = {{
            backgroundColor: item.descricao == this.state.DescricaoItemPickerLiner ? this.props.StyleGlobal.cores.background : '#FFFFFF',
            paddingHorizontal: 16,
            width: '100%',
            height: 58,
            borderWidth: 1,
            borderColor: 'rgba(16, 22, 26, 0.15)',
            marginVertical: 5,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <Text
            style = {{
              paddingVertical: 0,
              fontSize: 12,
              color: item.descricao == this.state.DescricaoItemPickerLiner ? "#FFFFFF" : '#262825',
              fontWeight: item.descricao == this.state.DescricaoItemPickerLiner ? 'bold' : 'normal',
              textAlign: 'center',
              textAlignVertical: 'center',
          }}>{item.descricao}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
  //#endregion

  //#region Renderizando a lista de closers
  renderCloser = ({ item, index }) => (
    <>
      <TouchableOpacity activeOpacity = {0.75} key = {item.descricao}  style = {{marginHorizontal: 8}}
        onPress = {async () => {
          if(item.descricao != this.state.DescricaoItemPickerCloser)
          {
            this.state.ItemPickerCloser = item
            this.state.DescricaoItemPickerCloser = item.descricao
            await this.setVisibilidadeModalClosers(false)
          }
          else
          {
            await this.setVisibilidadeModalClosers(false)
          }
      }}>
        <View 
          style = {{
            backgroundColor: item.descricao == this.state.DescricaoItemPickerCloser ? this.props.StyleGlobal.cores.background : '#FFFFFF',
            paddingHorizontal: 16,
            width: '100%',
            height: 58,
            borderWidth: 1,
            borderColor: 'rgba(16, 22, 26, 0.15)',
            marginVertical: 5,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <Text 
            style = {{
              paddingVertical: 0,
              fontSize: 12,
              color: item.descricao == this.state.DescricaoItemPickerCloser ? "#FFFFFF" : '#262825',
              fontWeight: item.descricao == this.state.DescricaoItemPickerCloser ? 'bold' : 'normal',
              textAlign: 'center',
              textAlignVertical: 'center',
          }}>{item.descricao}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
  //#endregion

  //#region Renderizando a lista de PEP
  renderPEP = ({ item, index }) => (
    <>
      <TouchableOpacity activeOpacity = {0.75} key = {item.descricao}  style = {{marginHorizontal: 8}}
        onPress = {async () => {
          if(item.descricao != this.state.DescricaoItemPickerPEP)
          {
            this.state.ItemPickerPEP = item
            this.state.DescricaoItemPickerPEP = item.descricao
            await this.setVisibilidadeModalPEP(false)
          }
          else
          {
            await this.setVisibilidadeModalPEP(false)
          }
      }}>
        <View 
          style = {{
            backgroundColor: item.descricao == this.state.DescricaoItemPickerPEP ? this.props.StyleGlobal.cores.background : '#FFFFFF',
            paddingHorizontal: 16,
            width: '100%',
            height: 58,
            borderWidth: 1,
            borderColor: 'rgba(16, 22, 26, 0.15)',
            marginVertical: 5,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <Text 
            style = {{
              paddingVertical: 0,
              fontSize: 12,
              color: item.descricao == this.state.DescricaoItemPickerPEP ? "#FFFFFF" : '#262825',
              fontWeight: item.descricao == this.state.DescricaoItemPickerPEP ? 'bold' : 'normal',
              textAlign: 'center',
              textAlignVertical: 'center',
          }}>{item.descricao}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
  //#endregion

  //#region Renderizando a lista de Sub Gerente
  renderSubGerente = ({ item, index }) => (
    <>
      <TouchableOpacity activeOpacity = {0.75} key = {item.descricao}  style = {{marginHorizontal: 8}}
        onPress = {async () => {
          if(item.descricao != this.state.DescricaoItemPickerSubGerenteDeSala)
          {
            this.state.ItemPickerSubGerenteDeSala = item
            this.state.DescricaoItemPickerSubGerenteDeSala = item.descricao
            await this.setVisibilidadeModalSubGerenteSala(false)
          }
          else
          {
            await this.setVisibilidadeModalSubGerenteSala(false)
          }
      }}>
        <View 
          style = {{
            backgroundColor: item.descricao == this.state.DescricaoItemPickerSubGerenteDeSala ? this.props.StyleGlobal.cores.background : '#FFFFFF',
            paddingHorizontal: 16,
            width: '100%',
            height: 58,
            borderWidth: 1,
            borderColor: 'rgba(16, 22, 26, 0.15)',
            marginVertical: 5,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <Text 
            style = {{
              paddingVertical: 0,
              fontSize: 12,
              color: item.descricao == this.state.DescricaoItemPickerSubGerenteDeSala ? "#FFFFFF" : '#262825',
              fontWeight: item.descricao == this.state.DescricaoItemPickerSubGerenteDeSala ? 'bold' : 'normal',
              textAlign: 'center',
              textAlignVertical: 'center',
          }}>{item.descricao}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
  //#endregion

  //#region Renderizando a lista de Gerente
  renderGerente = ({ item, index }) => (
    <>
      <TouchableOpacity activeOpacity = {0.75} key = {item.descricao}  style = {{marginHorizontal: 8}}
        onPress = {async () => {
          if(item.descricao != this.state.DescricaoItemPickerGerenteDeSala)
          {
            this.state.ItemPickerGerenteDeSala = item
            this.state.DescricaoItemPickerGerenteDeSala = item.descricao
            await this.setVisibilidadeModalGerenteSala(false)
          }
          else
          {
            await this.setVisibilidadeModalGerenteSala(false)
          }
      }}>
        <View 
          style = {{
            backgroundColor: item.descricao == this.state.DescricaoItemPickerGerenteDeSala ? this.props.StyleGlobal.cores.background : '#FFFFFF',
            paddingHorizontal: 16,
            width: '100%',
            height: 58,
            borderWidth: 1,
            borderColor: 'rgba(16, 22, 26, 0.15)',
            marginVertical: 5,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <Text 
            style = {{
              paddingVertical: 0,
              fontSize: 12,
              color: item.descricao == this.state.DescricaoItemPickerGerenteDeSala ? "#FFFFFF" : '#262825',
              fontWeight: item.descricao == this.state.DescricaoItemPickerGerenteDeSala ? 'bold' : 'normal',
              textAlign: 'center',
              textAlignVertical: 'center',
          }}>{item.descricao}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
  //#endregion
  
  //#region Renderizando a lista de finalidades
  renderFinalidades = ({ item, index }) => (
    <>
      <TouchableOpacity activeOpacity = {0.75} key = {item.descricao} style = {{marginHorizontal: 8}}
        onPress = {async () => {
          if(item.descricao != this.state.DescricaoItemPickerFinalidadeDeCompra)
          {
            this.state.ItemPickerFinalidadeDeCompra = item
            this.state.DescricaoItemPickerFinalidadeDeCompra = item.descricao
            await this.setVisibilidadeModalFinalidades(false)
          }
          else
          {
            await this.setVisibilidadeModalFinalidades(false)
          }
      }}>
        <View 
          style = {{
            backgroundColor: item.descricao == this.state.DescricaoItemPickerFinalidadeDeCompra ? this.props.StyleGlobal.cores.background : '#FFFFFF',
            paddingHorizontal: 16,
            width: '100%',
            height: 58,
            borderWidth: 1,
            borderColor: 'rgba(16, 22, 26, 0.15)',
            marginVertical: 5,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          <Text
            style = {{
              paddingVertical: 0,
              fontSize: 12,
              color: item.descricao == this.state.DescricaoItemPickerFinalidadeDeCompra ? "#FFFFFF" : '#262825',
              fontWeight: item.descricao == this.state.DescricaoItemPickerFinalidadeDeCompra ? 'bold' : 'normal',
              textAlign: 'center',
              textAlignVertical: 'center',
          }}>{item.descricao}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
  //#endregion

  //#region Pegando a tabela de parcelas pela quantidade de titulos
  pegandoTabelaDeParcelasPorQtdeTitulos = async () => {
    const response = await TabelaDeVendas.simularTitulosDeParcelaPorQtdeDeTitulos(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, this.props.LotesReservados[0].local['id'], this.props.LotesReservados[0].subLocal['id'], this.props.numeroTabelaDeVenda[0].numeroTabelaDeVenda, parseInt(this.state.ParcelasFinanciamento), formatoDeTexto.DataJSON(this.state.PrimeiroVencimentoFinanciamento), 0)
    if (response != null && response != undefined)
    {
      await this.setState({DadosFinanciamento: response})
      await this.pegandoListaFormasDePagamentos()
    }
    else
    {
      await this.setVisibilidadeModalLoading(false)
      this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando a tabela de parcelas pela quantidade de titulos pro REDUX
  pegandoTabelaDeParcelasPorQtdeTitulosREDUX = async () => {
    const response = await TabelaDeVendas.simularTitulosDeParcelaPorQtdeDeTitulos(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, this.props.LotesReservados[0].local['id'], this.props.LotesReservados[0].subLocal['id'], this.props.numeroTabelaDeVenda[0].numeroTabelaDeVenda, parseInt(this.state.ParcelasTemporarioFinanciamento), formatoDeTexto.DataJSON(this.state.PrimeiroVencimentoTemporarioFinanciamento), 0)
    if (response != null && response != undefined)
    {
      this.state.DadosFinanciamento = response
      this.state.IndexEscolha = this.state.IndexEscolhaTemporaria,
      this.state.ParcelasFinanciamento = response.qtdeDeTitulos,
      this.state.ParcelasTemporarioFinanciamento = response.qtdeDeTitulos,
      this.state.PrimeiroVencimentoFinanciamento = formatoDeTexto.DataInvertendoJSON((response.titulosDeParcela[0].vencimento).replace('T00:00:00', '')),
      this.state.PrimeiroVencimentoTemporarioFinanciamento = formatoDeTexto.DataInvertendoJSON((response.titulosDeParcela[0].vencimento).replace('T00:00:00', '')),
      this.state.ValorDaParcelaFinanciamento = response.principal,
      this.state.ValorDaParcelaTemporarioFinanciamento = response.principal,
      this.state.ValorTotalFinanciamento = response.valorTotal,
      this.state.ValorTotalTemporarioFinanciamento = response.valorTotal
      this.state.setVisibilidadeModalCalculator = false
      await this.setVisibilidadeModalFinanciamento(false)
    }
    else
    {
      await this.setVisibilidadeModalCalculator(false)
    }
  }
  //#endregion

  //#region Pegando a tabela de parcelas pelo valor dos titulos
  pegandoTabelaDeParcelasPorValorDaParcela = async () => {
    const response = await TabelaDeVendas.simularTitulosDeParcelaPorValorDaParcela(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, this.props.LotesReservados[0].local['id'], this.props.LotesReservados[0].subLocal['id'], this.props.numeroTabelaDeVenda[0].numeroTabelaDeVenda, formatoDeTexto.MoedaOriginal(this.state.ValorDaParcelaFinanciamento), formatoDeTexto.DataJSON(this.state.PrimeiroVencimentoFinanciamento), 0)
    if(response != null && response != undefined)
    {
      
    }
    else
    {
      this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Simulando a tabela de parcelas pela quantidade de titulos
  simulandoTabelaDeParcelasPorQtdeTitulos = async () => {
    const response = await TabelaDeVendas.simularTitulosDeParcelaPorQtdeDeTitulos(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, this.props.LotesReservados[0].local['id'], this.props.LotesReservados[0].subLocal['id'], this.props.numeroTabelaDeVenda[0].numeroTabelaDeVenda, parseInt(this.state.ParcelasFinanciamento), formatoDeTexto.DataJSON(this.state.PrimeiroVencimentoFinanciamento), 0)
    if (response != null && response != undefined)
    {
      this.state.ValorDaParcelaTemporarioFinanciamento = formatoDeTexto.Moeda(parseInt(response.principal * 100)) 
      this.state.ValorTotalTemporarioFinanciamento = response.valorTotal
      this.state.DadosFinanciamento = response
      await this.setVisibilidadeModalCalculator(false)
    }
    else
    {
      await this.setVisibilidadeModalCalculator(false)
    }
  }
  //#endregion

  //#region Simulando a tabela de parcelas pelo valor dos titulos
  simulandoTabelaDeParcelasPorValorDaParcela = async () => {
    const response = await TabelaDeVendas.simularTitulosDeParcelaPorValorDaParcela(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, this.props.LotesReservados[0].local['id'], this.props.LotesReservados[0].subLocal['id'], this.props.numeroTabelaDeVenda[0].numeroTabelaDeVenda, formatoDeTexto.MoedaOriginal(this.state.ValorDaParcelaTemporarioFinanciamento), formatoDeTexto.DataJSON(this.state.PrimeiroVencimentoTemporarioFinanciamento), 0)
    if(response != null && response != undefined)
    {
      this.state.ParcelasTemporarioFinanciamento = formatoDeTexto.NumeroInteiro(response.qtdeDeTitulos) 
      this.state.ValorTotalTemporarioFinanciamento = response.valorTotal
      this.state.DadosFinanciamento = response
      await this.setVisibilidadeModalCalculator(false)
    }
    else
    {
      await this.setVisibilidadeModalCalculator(false)
    }
  }
  //#endregion

  //#region Pegando lista de formas de pagamentos no banco de dados
  pegandoListaFormasDePagamentos = async () => {
    const response = await Titulo.formadepagamento(String(this.props.token[0].token))
    if (response != null && response != undefined)
    {
      await this.setState({FormasDePagamento: response})
      await this.pegandoInfoComplementar();
    }
    else
    {
      await this.setVisibilidadeModalLoading(false)
      this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando informações complementares
  pegandoInfoComplementar = async () => {
    const response = await (await axios.create({baseURL: 'http://vendadigital.gavresorts.com.br:83'})
    .get(`/Identificador/VisaoGAV02/${"NzAyNjEyMzExNDZjMjl6Skc1bGRETXk="}`)).data
    if(response != "" && response != null && response != undefined)
    {
      await this.setState({ListaPickerSala: response})
      await this.pegandoPeriocidadesIntermediarias()
    }
    else
    {
      await this.setVisibilidadeModalLoading(false)
      this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando periocidades das intermediarias no banco de dados
  pegandoPeriocidadesIntermediarias = async () => {
    try{
      const response = await Calendario.PeriodicidadeDosBaloes(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
      if(response != "" && response != null && response != undefined)
      {
        await this.setState({ListaPeriocidades: response})
        await this.pegandoCalendarioMeses()
      }
      else
      {
        await this.setVisibilidadeModalLoading(false)
        this.props.navigation.goBack()
      }
    } catch {
        await this.setVisibilidadeModalLoading(false)
        this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando meses do calendario no banco de dados
  pegandoCalendarioMeses = async () => {
    try {
      const response = await Calendario.consulta(String(this.props.token[0].token))
      if(response != "" &&  response != null && response != undefined)
      {
        await this.setState({CalendarioMeses: response})
        await this.pegandoFinalidadesDeCompra()
      } 
      else
      {
        await this.setVisibilidadeModalLoading(false)
        this.props.navigation.goBack()
      }
    } catch {
        await this.setVisibilidadeModalLoading(false)
        this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando finalidades de compra
  pegandoFinalidadesDeCompra = async () => {
    try {
      let Response = await Vendas.FinalidadesDeCompra(this.props.token[0].token, this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, this.props.LotesReservados[0].identificadorVinculado?.softwareExterno.token)
      if(Math.floor(Response.status / 100) == 2)
      {
        this.setState({ListaPickerFinalidadeDeCompra: Response.data})
        await this.setVisibilidadeModalLoading(false)
      }
      else
      {
        await this.setVisibilidadeModalLoading(false)
        this.props.navigation.goBack()
      }
    } catch {
      await this.setVisibilidadeModalLoading(false)
      this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Renderizando lista de formas de pagamento
  renderFormaPagamento = ({ item }) => (
    <TouchableOpacity key = {item.id}
      onPress = {async () => {
        this.state.IDFormaPagamento = item.id 
        this.state.DescricaoTemporariaFormaPagamento = item.descricao
        await this.setVisibilidadeModalFormasDePagamento(false)
    }}>
      <View 
        style = {{
          backgroundColor: '#FFFFFF',
          padding: 16,
          width: '100%',
          borderWidth: 1,
          borderColor: '#E2F2E3',
          marginBottom: 4
      }}>
        <Text 
          style = {{
            paddingVertical: 0,
            fontSize: 12,
            color: item.descricao == this.state.DescricaoTemporariaFormaPagamento ? '#8d4055' : '#262825',
            fontWeight: item.descricao == this.state.DescricaoTemporariaFormaPagamento ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>
    </TouchableOpacity>
  );
  //#endregion

  //#region Confirmando dados entradas
  validandoDadosModalEntradas = async () => {
    this.state.DescricaoFormaPagamento = this.state.DescricaoTemporariaFormaPagamento 
    this.state.IDFormaPagamento = this.state.IDTemporariaFormaPagamento
    this.setVisibilidadeModalEntradas(false)
  }
  //#endregion

  //#region Fechando modal das entradas
  fechandoModalEntradas = async () => {
    this.state.DescricaoTemporariaFormaPagamento = this.state.DescricaoFormaPagamento 
    this.state.IDTemporariaFormaPagamento = this.state.IDFormaPagamento
    this.setVisibilidadeModalEntradas(false)
  }
  //#endregion

  //#region Confirmando dados entradas personalizadas
  validandoDadosModalEntradasPersonalizadas = async () => {
    this.setVisibilidadeModalEntradasPersonalizadas(false)
  }
  //#endregion

  //#region Fechando modal das entradas personalizadas
  fechandoModalEntradasPersonalizadas = async () => {
    this.setVisibilidadeModalEntradasPersonalizadas(false)
  }
  //#endregion

  //#region Prosseguir para a proxima tela
  prosseguirParaProximaTela = async () => {
    if(await Validacoes.TelaPropostaDePagamento(this.state) == true)
    {
      await this.verificandoValores()
    }
  }
  //#endregion

  //#region Verificando valores
  verificandoValores = async () => {
    
    this.state.ValorExtra = 0;
    this.state.ValorTotal = 0;
    this.state.ValorGerado = 0;
    var ValorSomadoEntrada = 0;
    var ValorSomadoSinal = 0;
    var ValorSomadoIntermediaria = 0;
    var ValorAVista = this.props.LotesReservados[0].valorAVista;
    var ValorTotal = 0;

    this.state.ListaDeEntradas.map(entrada => ValorSomadoEntrada += entrada.Valor);
    this.state.ListaDeSinais.map(sinal => ValorSomadoSinal += sinal.Valor);
    this.state.ListaDeIntermediarias.map(intermediaria => { ValorSomadoIntermediaria += (intermediaria.Qtde * intermediaria.Valor)});
    
    var ValorSomadoCorretagem = this.props.Corretagem != "" ? parseFloat(this.props.Corretagem[0].valorTotal): 0;
    var ValorSomadoIntermediacao = this.props.Intermediacao != "" ? parseFloat(this.props.Intermediacao[0].valorTotal) : 0;
    var ValorTotalEntrada = this.state.CondicoesDaTabelaDeVenda.find((Item) => Item.classificacao.id == 3)?.condicoesDaTabelaDeVenda.find((Item) => Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.valorTotal ?? 0;
    var ValorTotalSinal = this.state.CondicoesDaTabelaDeVenda.find((Item) => Item.classificacao.id == 2)?.condicoesDaTabelaDeVenda.find((Item) => Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.valorTotal ?? 0;
    var ValorTotalFinanciamento =  this.state.CondicoesDaTabelaDeVenda.find((Item) => Item.classificacao.id == 6)?.condicoesDaTabelaDeVenda.find((Item) => Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.valorTotal ?? 0;
    var ValorSomadoFinanciamento = (this.state.ParcelaBancoQtde * this.state.ParcelaBancoValor);
    var ValorTotalParcelaObra = this.state.CondicoesDaTabelaDeVenda.find((Item) => Item.classificacao.id == 13)?.condicoesDaTabelaDeVenda.find((Item) => Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.valorTotal ?? 0;
    var ValorSomadoParcelaObra = (this.state.ParcelaObraQtde * this.state.ParcelaObraValor);
    var ValorTotalParcela = this.state.CondicoesDaTabelaDeVenda.find((Item) => Item.classificacao.id == 4)?.condicoesDaTabelaDeVenda.find((Item) => Item.descricao.includes(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao ?? ""))?.valorTotal ?? 0;
    var ValorSomadoParcela = (this.state.ParcelaQtde * this.state.ParcelaValor);

    ValorTotal = ValorSomadoCorretagem + ValorSomadoIntermediacao + ValorSomadoEntrada + ValorSomadoIntermediaria + ValorSomadoSinal + ValorSomadoFinanciamento + ValorSomadoParcelaObra + ValorSomadoParcela;
    this.state.ValorTotal = formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ValorAVista))
    this.state.ValorGerado = formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ValorTotal))
    
    if (this.props.Corretagem != "" || this.props.Intermediacao != "")
    {

      await this.documentosProposta();

      const { addToTabelaParcelas, addToPropostaDeVenda, addToDocumentosPropostaLista } = this.props;
      addToTabelaParcelas(this.state.DadosFinanciamento)
      addToPropostaDeVenda(await this.MontarPropostaDeVenda())
      addToDocumentosPropostaLista(this.state.DocumentosPropostaLista)
      
      const navegar = this.props.navigation.getParam('PropostaDePagamento', 'null')
      if (navegar != null && navegar != 'null')
      {
        return navegar.onConfirm()
      }

    }
    else
    {

      if(this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao.toLowerCase().includes("vista") == false && ((ValorTotal - ValorAVista) > 0)) {
        this.state.ValorExtra = formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ValorTotal - ValorAVista));
        const DadosProposta = await this.MontarPropostaDeVenda();
        if(this.state.ValorExtra > DadosProposta.titulosDeParcela[(DadosProposta.titulosDeParcela).length - 1].valor)
        {
          this.state.ModalOptionMensagem = `O valor à vista da proposta é de ${formatoDeTexto.FormatarTexto(ValorAVista)} e o valor gerado sem os juros foi de ${formatoDeTexto.FormatarTexto(ValorTotal)}. O valor gerado sem os juros ultrapassou o valor à vista em ${formatoDeTexto.FormatarTexto(((ValorTotal - ValorAVista)))}, o valor será descontado do valor total da venda, deseja prosseguir?`
          await this.setVisibilidadeModalOption(true)
        }
        else
        {
          this.state.ModalOptionMensagem = `O valor à vista da proposta é de ${formatoDeTexto.FormatarTexto(ValorAVista)} e o valor gerado sem os juros foi de ${formatoDeTexto.FormatarTexto(ValorTotal)}. O valor gerado sem os juros ultrapassou o valor à vista em ${formatoDeTexto.FormatarTexto(((ValorTotal - ValorAVista)))}, deseja subtrair esse valor da última parcela do saldo a financiar?`
          await this.setVisibilidadeModalOption(true)
        }
      }
      else if (this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao.toLowerCase().includes("vista") == false && ((ValorAVista - ValorTotal) > 0))
      {
        if(this.props.EmpresaLogada[0] == 8) {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `O valor à vista da proposta é de ${formatoDeTexto.FormatarTexto(ValorAVista)} e o valor gerado sem os juros foi de ${formatoDeTexto.FormatarTexto(ValorTotal)}. O valor gerado sem os juros está abaixo do valor à vista em ${formatoDeTexto.FormatarTexto(((ValorAVista - ValorTotal)))}. Adicione o que falta para prosseguir.`
          })
        }
        else
        {
          this.state.ValorExtra = formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(ValorAVista - ValorTotal));
          const DadosProposta = await this.MontarPropostaDeVenda();
          this.state.ModalOptionMensagem = `O valor à vista da proposta é de ${formatoDeTexto.FormatarTexto(ValorAVista)} e o valor gerado sem os juros foi de ${formatoDeTexto.FormatarTexto(ValorTotal)}. O valor gerado sem os juros está abaixo do valor à vista em ${formatoDeTexto.FormatarTexto(((ValorAVista - ValorTotal)))}, deseja adicionar esse valor na última parcela do saldo a financiar?`
          await this.setVisibilidadeModalOption(true)
        }
      }
      else
      {

        await this.documentosProposta();

        const { addToTabelaParcelas, addToPropostaDeVenda, addToDocumentosPropostaLista } = this.props;
        addToTabelaParcelas(this.state.DadosFinanciamento)
        addToPropostaDeVenda(await this.MontarPropostaDeVenda())
        addToDocumentosPropostaLista(this.state.DocumentosPropostaLista)

        const navegar = this.props.navigation.getParam('PropostaDePagamento', 'null')
        if (navegar != null && navegar != 'null')
        {
          return navegar.onConfirm()
        }

      }

    }

  }
  //#endregion

  //#region Escolhendo a option Sim
  setandoOpcaoSimNaModalOption = async () => {
    const DadosProposta = await this.MontarPropostaDeVenda();
    if(this.state.ValorTotal < this.state.ValorGerado)
    {
      if(DadosProposta.titulosDeParcela[(DadosProposta.titulosDeParcela).length - 1].valor < this.state.ValorExtra)
      {

        await this.documentosProposta();

        const { addToTabelaParcelas, addToPropostaDeVenda, addToDocumentosPropostaLista } = this.props;
        
        addToTabelaParcelas(this.state.DadosFinanciamento)
        addToPropostaDeVenda(DadosProposta)
        addToDocumentosPropostaLista(this.state.DocumentosPropostaLista)

        const navegar = this.props.navigation.getParam('PropostaDePagamento', 'null')
        if (navegar != null && navegar != 'null')
        {
          this.setVisibilidadeModalOption(false)
          return navegar.onConfirm()
        }

      }
      else
      {

        await this.documentosProposta();

        DadosProposta.titulosDeParcela[(DadosProposta.titulosDeParcela).length - 1].valor = formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(DadosProposta.titulosDeParcela[(DadosProposta.titulosDeParcela).length - 1].valor - this.state.ValorExtra))
        const { addToTabelaParcelas, addToPropostaDeVenda, addToDocumentosPropostaLista } = this.props;
        
        addToTabelaParcelas(this.state.DadosFinanciamento)
        addToPropostaDeVenda(DadosProposta)
        addToDocumentosPropostaLista(this.state.DocumentosPropostaLista)

        const navegar = this.props.navigation.getParam('PropostaDePagamento', 'null')
        if (navegar != null && navegar != 'null')
        {
          this.setVisibilidadeModalOption(false)
          return navegar.onConfirm()
        }

      }
    }
    else
    {

      await this.documentosProposta();

      DadosProposta.titulosDeParcela[(DadosProposta.titulosDeParcela).length - 1].valor = formatoDeTexto.DesformatarTexto(formatoDeTexto.FormatarTexto(DadosProposta.titulosDeParcela[(DadosProposta.titulosDeParcela).length - 1].valor + this.state.ValorExtra))
      const { addToTabelaParcelas, addToPropostaDeVenda, addToDocumentosPropostaLista } = this.props;
      
      addToTabelaParcelas(this.state.DadosFinanciamento)
      addToPropostaDeVenda(DadosProposta)
      addToDocumentosPropostaLista(this.state.DocumentosPropostaLista)
      
      const navegar = this.props.navigation.getParam('PropostaDePagamento', 'null')
      if (navegar != null && navegar != 'null')
      {
        this.setVisibilidadeModalOption(false)
        return navegar.onConfirm()
      }

    }
  }
  //#endregion

  //#region Escolhendo a option Não
  setandoOpcaoNaoNaModalOption = async () => {
    const DadosProposta = await this.MontarPropostaDeVenda();
    if(this.state.ValorTotal < this.state.ValorGerado)
    {
      if(DadosProposta.titulosDeParcela[(DadosProposta.titulosDeParcela).length - 1].valor < this.state.ValorExtra)
      {
        this.setVisibilidadeModalOption(false)
      }
      else
      {

        await this.documentosProposta();

        const { addToTabelaParcelas, addToPropostaDeVenda, addToDocumentosPropostaLista } = this.props;
        addToTabelaParcelas(this.state.DadosFinanciamento)
        addToPropostaDeVenda(DadosProposta)
        addToDocumentosPropostaLista(this.state.DocumentosPropostaLista)

        const navegar = this.props.navigation.getParam('PropostaDePagamento', 'null')
        if (navegar != null && navegar != 'null')
        {
          this.setVisibilidadeModalOption(false)
          return navegar.onConfirm()
        }
      }
    }
    else
    {

      await this.documentosProposta();

      const { addToTabelaParcelas, addToPropostaDeVenda, addToDocumentosPropostaLista } = this.props;
      addToTabelaParcelas(this.state.DadosFinanciamento)
      addToPropostaDeVenda(DadosProposta)
      addToDocumentosPropostaLista(this.state.DocumentosPropostaLista)

      const navegar = this.props.navigation.getParam('PropostaDePagamento', 'null')
      if (navegar != null && navegar != 'null')
      {
        this.setVisibilidadeModalOption(false)
        return navegar.onConfirm()
      }
    }
  }
  //#endregion

  //#region Montando proposta de venda
  MontarPropostaDeVenda = async () => {
    var PropostaDeVenda = {
        empresa: this.props.Tabela[0].tabelaCompleta.empresa ?? "",
        centroDeCusto: this.props.Tabela[0].tabelaCompleta.centroDeCusto ?? "",
        numero: 0,
        contratoCEF: this.state.IdCasal,
        dataDaVenda: this.props.EmpresaLogada[0] == 4 ? this.state.DataDaProposta : (new Date().getMonth() < 9 ? (new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + ( new Date().getDate() <= 9 ? "0" + new Date().getDate() : new Date().getDate())) : (new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + ( new Date().getDate() <= 9 ? "0" + new Date().getDate() : new Date().getDate()))),
        finalidadeDaCompra: this.state.ItemPickerFinalidadeDeCompra?.id ?? null,
        prospects: [],
        modeloDeVenda: [],
        identificador: this.props.LotesReservados[0],
        titulosDeCorretagem: this.props.Corretagem != "" ? this.props.Corretagem[0].titulosDeCorretagem : [],
        titulosDeIntermediacao: this.props.Intermediacao != "" ? this.props.Intermediacao[0].titulosDeIntermediacao : [],
        titulosDeSinal: [],
        titulosDeEntrada: [],
        titulosDeParcela: [],
        titulosDeParcelaObra: [],
        titulosDeIntermediaria: [],
        titulosDeFinanciamento: [],
        titulosConsolidados: [],
        salaDeVenda: this.state.ItemPickerSala.cidade ?? "",
        estruturaDeComissao: []
    };

    var Index = 0;
    var ObjetoTabelaDeVenda = this.props.Tabela[0].tabelaCompleta;
    PropostaDeVenda.modeloDeVenda = ObjetoTabelaDeVenda.modeloDeVenda;

    for (let index = 0; index < this.state.EntradasQtde; index++) {
        PropostaDeVenda.titulosDeEntrada.push({
            id: index + 1,
            vencimento: this.state.ListaDeEntradas[index].Vencimento,
            valor: this.state.ListaDeEntradas[index].Valor,
            formaDePagamento: this.state.ListaDeEntradas[index].MeioDePagamento,
            banco: this.state.ListaDeEntradas[index].Banco?.Valor,
            agencia: this.state.ListaDeEntradas[index].Agencia,
            conta: this.state.ListaDeEntradas[index].Conta,
            digitoDaConta: this.state.ListaDeEntradas[index].DigitoDaConta,
            titular: this.state.ListaDeEntradas[index].Titular,
            numeroCheque: this.state.ListaDeEntradas[index].NumeroCheque,
            maquina: this.state.ListaDeEntradas[index].Maquina?.Valor,
            bandeira: this.state.ListaDeEntradas[index].Bandeira?.Valor,
            digitoCartao: this.state.ListaDeEntradas[index].DigitoCartao,
            operacao: this.state.ListaDeEntradas[index].Operacao?.Valor,
            nsu: this.state.ListaDeEntradas[index].NSU,
            numeroDaOperacao: this.state.ListaDeEntradas[index].NumeroDaOperacao,
        });
        PropostaDeVenda.titulosConsolidados.push({
            classificacaoDoTituloDeVenda: ObjetoTabelaDeVenda.classificacoesDosTitulosDaTabelaDeVenda[2].classificacao,
            numero: index + 1,
            numeroDeGeracao: ++Index,
            dataDeVencimento: this.state.ListaDeEntradas[index].Vencimento,
            grupo: 1,
            principal: this.state.ListaDeEntradas[index].Valor,
            juros: 0,
            correcao: 0,
            multa: 0,
            jurosPorAtraso: 0,
            correcaoPorAtraso: 0,
            acrescimoAvulso: 0,
            descontoAvulso: 0,
            descontoDeAntecipacao: 0,
            descontoDePontualidade: 0
        });
    }

    var index_int = 0;

    for (var index = 0; index < this.state.ListaDeIntermediarias.length; index++)
    {
      for(var index_2 = 0; index_2 < this.state.ListaDeIntermediarias[index].Qtde; index_2++)
      {
        var Vencimento = new Date((this.state.ListaDeIntermediarias[index].Vencimento).getFullYear(),(this.state.ListaDeIntermediarias[index].MesReferencia.id - 1), this.state.ListaDeIntermediarias[index].DiaVencimento)
        Vencimento.setUTCHours(23)
        Vencimento.setFullYear((this.state.ListaDeIntermediarias[index].Vencimento).getFullYear() + index_2)
        if(this.state.ListaDeIntermediarias[index].Qtde > 0)
        {
          PropostaDeVenda.titulosDeIntermediaria.push({
            id: index_int + 1,
            vencimento: Vencimento,
            valor: this.props.EmpresaLogada[0] == 8 ? this.state.ListaDeIntermediarias[index].ValorPMT : this.state.ListaDeIntermediarias[index].Valor,
          })
          PropostaDeVenda.titulosConsolidados.push({
            classificacaoDoTituloDeVenda: ObjetoTabelaDeVenda.classificacoesDosTitulosDaTabelaDeVenda[2].classificacao,
            numero: index_int + 1,
            numeroDeGeracao: ++Index,
            dataDeVencimento: Vencimento,
            grupo: 1,
            principal: this.props.EmpresaLogada[0] == 8 ? this.state.ListaDeIntermediarias[index].ValorPMT : this.state.ListaDeIntermediarias[index].Valor,
            juros: 0,
            correcao: 0,
            multa: 0,
            jurosPorAtraso: 0,
            correcaoPorAtraso: 0,
            acrescimoAvulso: 0,
            descontoAvulso: 0,
            descontoDeAntecipacao: 0,
            descontoDePontualidade: 0
          })
          index_int++
        }
      }
    }

    for (let index = 0; index < this.state.SinalQtde; index++) {
        PropostaDeVenda.titulosDeSinal.push({
            id: index + 1,
            vencimento: this.state.ListaDeSinais[index].Vencimento,
            valor: this.state.ListaDeSinais[index].Valor,
            formaDePagamento: this.state.ListaDeSinais[index].MeioDePagamento,
            banco: this.state.ListaDeSinais[index].Banco?.Valor,
            agencia: this.state.ListaDeSinais[index].Agencia,
            conta: this.state.ListaDeSinais[index].Conta,
            digitoDaConta: this.state.ListaDeSinais[index].DigitoDaConta,
            titular: this.state.ListaDeSinais[index].Titular,
            numeroCheque: this.state.ListaDeSinais[index].NumeroCheque,
            maquina: this.state.ListaDeSinais[index].Maquina?.Valor,
            bandeira: this.state.ListaDeSinais[index].Bandeira?.Valor,
            digitoCartao: this.state.ListaDeSinais[index].DigitoCartao,
            operacao: this.state.ListaDeSinais[index].Operacao?.Valor,
            nsu: this.state.ListaDeSinais[index].NSU,
            numeroDaOperacao: this.state.ListaDeSinais[index].NumeroDaOperacao,
        });
        PropostaDeVenda.titulosConsolidados.push({
            classificacaoDoTituloDeVenda: ObjetoTabelaDeVenda.classificacoesDosTitulosDaTabelaDeVenda[2].classificacao,
            numero: index + 1,
            numeroDeGeracao: ++Index,
            dataDeVencimento: this.state.ListaDeSinais[index].Vencimento,
            grupo: 1,
            principal: this.state.ListaDeSinais[index].Valor,
            juros: 0,
            correcao: 0,
            multa: 0,
            jurosPorAtraso: 0,
            correcaoPorAtraso: 0,
            acrescimoAvulso: 0,
            descontoAvulso: 0,
            descontoDeAntecipacao: 0,
            descontoDePontualidade: 0
        });
    }

    for (let index = 0; index < this.state.ParcelaQtde; index++) {
        PropostaDeVenda.titulosDeParcela.push({
            id: index + 1,
            vencimento: this.state.ParcelaVencimento ? new Date(new Date(this.state.ParcelaVencimento).setMonth(this.state.ParcelaVencimento?.getMonth() + (this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao.includes("Anual") ? index * 12 : index))) : new Date(),
            valor: this.props.EmpresaLogada[0] == 8 ? this.state.ParcelaValorPMT : this.state.ParcelaValor,
        });
        PropostaDeVenda.titulosConsolidados.push({
            classificacaoDoTituloDeVenda: ObjetoTabelaDeVenda.classificacoesDosTitulosDaTabelaDeVenda[2].classificacao,
            numero: index + 1,
            numeroDeGeracao: ++Index,
            dataDeVencimento: this.state.ParcelaVencimento ? new Date(new Date(this.state.ParcelaVencimento).setMonth(this.state.ParcelaVencimento?.getMonth() + (this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao.includes("Anual") ? index * 12 : index))) : new Date(),
            grupo: 1,
            principal: this.props.EmpresaLogada[0] == 8 ? this.state.ParcelaValorPMT : this.state.ParcelaValor,
            juros: 0,
            correcao: 0,
            multa: 0,
            jurosPorAtraso: 0,
            correcaoPorAtraso: 0,
            acrescimoAvulso: 0,
            descontoAvulso: 0,
            descontoDeAntecipacao: 0,
            descontoDePontualidade: 0
        });
    }

    for (let index = 0; index < this.state.ParcelaObraQtde; index++) {
      PropostaDeVenda.titulosDeParcelaObra.push({
          id: index + 1,
          vencimento: this.state.ParcelaObraVencimento ? new Date(new Date(this.state.ParcelaObraVencimento).setMonth(this.state.ParcelaObraVencimento?.getMonth() + (this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao.includes("Anual") ? index * 12 : index))) : new Date(),
          valor: this.props.EmpresaLogada[0] == 8 ? this.state.ParcelaObraValorPMT : this.state.ParcelaObraValor,
      });
      PropostaDeVenda.titulosConsolidados.push({
          classificacaoDoTituloDeVenda: ObjetoTabelaDeVenda.classificacoesDosTitulosDaTabelaDeVenda[2].classificacao,
          numero: index + 1,
          numeroDeGeracao: ++Index,
          dataDeVencimento: this.state.ParcelaObraVencimento ? new Date(new Date(this.state.ParcelaObraVencimento).setMonth(this.state.ParcelaObraVencimento?.getMonth() + (this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao.includes("Anual") ? index * 12 : index))) : new Date(),
          grupo: 1,
          principal: this.props.EmpresaLogada[0] == 8 ? this.state.ParcelaObraValorPMT : this.state.ParcelaObraValor,
          juros: 0,
          correcao: 0,
          multa: 0,
          jurosPorAtraso: 0,
          correcaoPorAtraso: 0,
          acrescimoAvulso: 0,
          descontoAvulso: 0,
          descontoDeAntecipacao: 0,
          descontoDePontualidade: 0
      });
    }

    for (let index = 0; index < this.state.ParcelaBancoQtde; index++) {
      PropostaDeVenda.titulosDeFinanciamento.push({
          id: index + 1,
          vencimento: this.state.ParcelaBancoVencimento ? new Date(new Date(this.state.ParcelaBancoVencimento).setMonth(this.state.ParcelaBancoVencimento?.getMonth() + (this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao.includes("Anual") ? index * 12 : index))) : new Date(),
          valor: this.state.ParcelaBancoValor,
      });
      PropostaDeVenda.titulosConsolidados.push({
          classificacaoDoTituloDeVenda: ObjetoTabelaDeVenda.classificacoesDosTitulosDaTabelaDeVenda[2].classificacao,
          numero: index + 1,
          numeroDeGeracao: ++Index,
          dataDeVencimento: this.state.ParcelaBancoVencimento ? new Date(new Date(this.state.ParcelaBancoVencimento).setMonth(this.state.ParcelaBancoVencimento?.getMonth() + (this.state.ItemPickerCondicoesDaTabelaDeVenda?.descricao.includes("Anual") ? index * 12 : index))) : new Date(),
          grupo: 1,
          principal: this.state.ParcelaBancoValor,
          juros: 0,
          correcao: 0,
          multa: 0,
          jurosPorAtraso: 0,
          correcaoPorAtraso: 0,
          acrescimoAvulso: 0,
          descontoAvulso: 0,
          descontoDeAntecipacao: 0,
          descontoDePontualidade: 0
      });
    }

    PropostaDeVenda.estruturaDeComissao.push({
        cpf: this.state.ItemPickerLiner != "" ? this.state.ItemPickerLiner?.cpf : "",
        nome: this.state.ItemPickerLiner != "" ? this.state.ItemPickerLiner?.descricao : "",
        cargo: "Liner"
    }, {
        cpf: this.state.ItemPickerCloser != "" ? this.state.ItemPickerCloser?.cpf : "",
        nome: this.state.ItemPickerCloser != "" ? this.state.ItemPickerCloser?.descricao : "",
        cargo: "Closer"
    }, {
        cpf: this.state.ItemPickerPEP != "" ? this.state.ItemPickerPEP?.cpf : "",
        nome: this.state.ItemPickerPEP != "" ? this.state.ItemPickerPEP?.descricao : "",
        cargo: "PEP"
    }, {
        cpf: this.state.ItemPickerSubGerenteDeSala != "" ? this.state.ItemPickerSubGerenteDeSala?.cpf : "",
        nome: this.state.ItemPickerSubGerenteDeSala != "" ? this.state.ItemPickerSubGerenteDeSala?.descricao : "",
        cargo: "Sub gerente"
    }, {
        cpf: this.state.ItemPickerSubGerenteDeSala != "" ? this.state.ItemPickerSubGerenteDeSala?.cpf : "",
        nome: this.state.ItemPickerSubGerenteDeSala != "" ? this.state.ItemPickerSubGerenteDeSala?.descricao : "",
        cargo: "Gerente"
    }, {
        cpf: this.state.ItemPickerPromotor ? this.state.ItemPickerPromotor?.cpf : "",
        nome: this.state.ItemPickerPromotor ? this.state.ItemPickerPromotor?.descricao : "",
        cargo: "Captador/Promotor"
    }, {
        cpf: this.state.ItemPickerTlmkt ? this.state.ItemPickerTlmkt?.cpf : "",
        nome: this.state.ItemPickerTlmkt ? this.state.ItemPickerTlmkt?.descricao : "",
        cargo: "Assessor Tlmkt"
    })
    return PropostaDeVenda;
  }
  //#endregion

  //#region Array dos documentos originais
  documentosProposta = async () => {
    this.state.DocumentosPropostaLista = []
    if (this.state.FichaNegociacao.base64 != null) {
      this.state.DocumentosPropostaLista.push(this.state.FichaNegociacao)
    }
    if (this.state.FichaAtendimento.base64 != null) {
      this.state.DocumentosPropostaLista.push(this.state.FichaAtendimento)
    }
    if (this.state.ComprovanteEntrada.base64 != null) {
      this.state.DocumentosPropostaLista.push(this.state.ComprovanteEntrada)
    }
    if (this.state.CheckListCadastro.base64 != null) {
      this.state.DocumentosPropostaLista.push(this.state.CheckListCadastro)
    }
  }

  //#endregion

}

//#region Estilizando view da camera
const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  capture: {
    flex: 0,
    backgroundColor: 'transparent',
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 20,
    alignItems: 'center',
    marginRight: 50
  },
});
//#endregion

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  tela: String(state.telaAtual),
  empresa: state.dadosEmpreendimento.filter(emp => emp.empresa),
  centrodecusto: state.dadosEmpreendimento.filter(emp => emp.centrodecusto),
  LotesReservados: state.dadosLotes,
  disponibilidadeEntradas: state.dadosTabelaDeVenda.filter(item => (item.disponibilidadeEntradas == false || item.disponibilidadeEntradas == true)),
  disponibilidadeCorretagem: state.dadosTabelaDeVenda.filter(item => item.disponibilidadeCorretagem),
  disponibilidadeIntermediacao: state.dadosTabelaDeVenda.filter(item => item.disponibilidadeIntermediacao),
  disponibilidadeFinanciamento: state.dadosTabelaDeVenda.filter(item => (item.disponibilidadeFinanciamento == false || item.disponibilidadeFinanciamento == true)),
  primeiroVencimentoFinanciamento: state.dadosTabelaDeVenda.filter(item => item.primeiroVencimentoFinanciamento),
  numeroTabelaDeVenda: state.dadosTabelaDeVenda.filter(item => item.numeroTabelaDeVenda),
  tabelaFinanciamento: state.dadosFinanciamento,
  Tabela: state.dadosTabelaDeVenda.filter(item => item.tabelaCompleta),
  Corretagem: state.dadosCorretagem,
  Intermediacao: state.dadosIntermediacao,
  tabelaDeVendas: state.dadosTabelaDeVenda.filter(item => item.tabelaCompleta),
  ConfigCss: state.configcssApp,
  StyleGlobal: state.StyleGlobal,
  EmpresaLogada: state.EmpresaLogada,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({...DocumentosPropostaListaActions, ...DadosEmpreendimentoActions, ...DadosTabelaParcelasActions, ...DadosPropostaDeVendaActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PropostaDePagamento);