//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Alert, StyleSheet, Keyboard, View, Text, Animated, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Modal, TextInput, Switch, Platform, KeyboardAvoidingView } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import Carousel from 'react-native-snap-carousel';
import { RNCamera } from 'react-native-camera';
import PushNotification from 'react-native-push-notification';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
import RnBgTask from 'react-native-bg-thread';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import SvgUri from 'react-native-svg-uri';
import Svg from 'react-native-svg';
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Pessoa, ReceitaFederal, Correios, Cargos, Mensagem, Nacionalidade } from "../../../services";
//#endregion

//#region Redux
import { DadosPropostaDeVendaActions,  DadosLeadActions, TelaAtualActions, ClienteActions, ConjugeActions, EnderecoActions, TelefonesActions, DocumentosOriginaisActions, DocumentosActions, DocumentosConjugeActions, DocumentosOriginaisListaActions } from '../../../store/listaDeActions';
//#endregion

//#region Data
import DataSexualidade from "../../../Data/Sexo";
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
//#endregion

//#region Componentes
import { Container, Logo, NomeEmpresa, Header, TextInputNome, TextInputCPF, TextInputData, TextInputEmail, TextInputCEP, TextInputLogradouro, TextInputNumero, TextInputComplemento, TextInputBairro, TextInputCidade, TextInputTelefone, TextInputRG, TextInputOrgaoEmissor, TextInputRenda } from '../../../components';
import { ModalLoadingGoBack, ModalEstadoCivil, ModalRegimeDeBens, ModalLoading, ModalEndereco, ModalOption, ModalProcurandoDadosCliente, ModalUFDoRG, ModalCargos, ModalNacionalidade, ModalSexualidade } from '../../Modais';
import { ClienteView, EstadoCivilView, ConjugeView, EnderecoView, TelefonesView } from './styles';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
import ImagemCamera from '../../../assets/cam.png';
import Cam from "../../../assets/cam.svg";
//#endregion

//#region Chaves de filtragem
const KEYS_TO_FILTERS = ['nome']
const KEYS_TO_FILTERS_NACIONALIDADE = ['descricao']
const KEYS_TO_FILTERS_SEXUALIDADE = ['descricao']
//#endregion

//#endregion

class DadosCliente extends Component {

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

    await this.setVisibilidadeModalLoadingGoBack(true)
    await this.pegandoListaEstadosCivis();
    if (this.props.Lead != "") {
     await this.carregandoLead()
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
    EmpresaLogada: null,
    AnimatedHeader: new Animated.Value(1),
    AnimatedDataCliente: new Animated.Value(114),
    AnimatedNomeCliente: new Animated.Value(114),
    AnimatedEmailCliente: new Animated.Value(114),    
    AnimatedDataConjuge: new Animated.Value(114),
    AnimatedNomeConjuge: new Animated.Value(114),
    AnimatedEmailConjuge: new Animated.Value(114),
    AnimatedEndereco: new Animated.Value(114),
    AnimatedTelefoneComercial: new Animated.Value(114),
    AnimatedTelefone: new Animated.Value(114),
    VisibilidadeModalLoading: false,
    VisibilidadeModalLoadingGoBack: false,
    VisibilidadeModalEstadosCivis: false,
    VisibilidadeModalRegimeDeBens: false,
    VisibilidadeModalEndereco: false,
    VisibilidadeModalAnexos: false,
    VisibilidadeModalOption: false,
    VisibilidadeModalProcurandoDadosCliente: false,
    VisibilidadeModalUFDoRG: false,
    VisibilidadeModalCargos: false,
    VisibilidadeModalNacionalidade: false,
    VisibilidadeModalSexualidade: false,
    Option: null,
    this: this,
    FlashCamera: RNCamera.Constants.FlashMode.off,
    ModalOptionMensagem: null,
    EstadosCivis: [],
    RegimesDeBens: [],
    Nacionalidades: [],
    Sexualidades: DataSexualidade,
    Foto: ImagemCamera,
    EstadosUF: [
      {
        "id": 0,
        "descricao": 'AC',
      },
      {
        "id": 1,
        "descricao": 'Al',
      },
      {
        "id": 2,
        "descricao": 'AP',
      },
      {
        "id": 3,
        "descricao": 'AM',
      },
      {
        "id": 4,
        "descricao": 'BA',
      },
      {
        "id": 5,
        "descricao": 'CE',
      },
      {
        "id": 6,
        "descricao": 'DF',
      },
      {
        "id": 7,
        "descricao": 'ES',
      },
      {
        "id": 8,
        "descricao": 'GO',
      },
      {
        "id": 9,
        "descricao": 'MA',
      },
      {
        "id": 10,
        "descricao": 'MT',
      },
      {
        "id": 11,
        "descricao": 'MS',
      },
      {
        "id": 12,
        "descricao": 'MG',
      },
      {
        "id": 13,
        "descricao": 'PA',
      },
      {
        "id": 14,
        "descricao": 'PB',
      },
      {
        "id": 15,
        "descricao": 'PR',
      },
      {
        "id": 16,
        "descricao": 'PE',
      },
      {
        "id": 17,
        "descricao": 'PI',
      },
      {
        "id": 18,
        "descricao": 'RJ',
      },
      {
        "id": 19,
        "descricao": 'RN',
      },
      {
        "id": 20,
        "descricao": 'RS',
      },
      {
        "id": 21,
        "descricao": 'RO',
      },
      {
        "id": 22,
        "descricao": 'RR',
      },
      {
        "id": 23,
        "descricao": 'SC',
      },
      {
        "id": 24,
        "descricao": 'SP',
      },
      {
        "id": 25,
        "descricao": 'SE',
      },
      {
        "id": 26,
        "descricao": 'TO',
      }
    ],
    FotoIdentidade: {
      "id": "RG",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
      "isPDF": false,
    },
    FotoIdentidadeConjuge: {
      "id": "RG do Conjugê",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
      "isPDF": false,
    },
    FotoEndereco: {
      "id": "Comprovante end.",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
      "isPDF": false,
    },
    FotoCertidao: {
      "id": "Estado Civil",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
      "isPDF": false,
    },
    Emails: [],
    EmailsConjuge: [],
    DadosEndereco: [],
    Telefones: [],
    ListaDeCargos: [],
    Telefones_existentes: [],
    DocumentosOriginais: [],
    DocumentosOriginaisLista: [],
    Documentos: [],
    DocumentosConjuge: [],  
    emails_Conjuge_existentes: [],
    emails_existentes: [],
    scrollCarouselEnabled: true,
    anexosDocumentos:[],
    anexo_atual: null,
    imageurl: null,
    cameraType: 'back',
    indicatorCamera: false,
    StatusCivil: null,
    StatusCivilDescricao: null,
    Regime: null,
    RegimeDescricao: null,
    ID_cliente: 0,
    ID_conjuge: 0,
    EmailsClienteExiste: false,
    DocumentoClienteRGExiste: false,
    DocumentoClienteCertidaoExiste: false,
    DocumentoClienteEnderecoExiste: false,
    EnderecoClienteExiste: false,
    TelefonesClienteExiste: false,
    TelefonePrincipalExiste: false,
    TelefoneRecadoExiste: false,
    EmailsConjugeExiste: false,
    DocumentoConjugeRGExiste: false,
    searchTermCargos: '',
    searchTermNacionalidade: '',
    searchTermSexualidade: '',
    NomeCliente: null,
    CPFCliente: null,
    DataCliente: null,
    EmailCliente: null,
    RGCliente: null,
    IDRGUFCliente: null,
    RGUFCliente: null,
    RGOrgaoEmissorCliente: null,
    CargoCliente: null,
    RendaCliente: 0,
    NacionalidadeCliente: {
      "id": null,
      "descricao": null,
      "nacionalidade": null,
      "masculino": null,
      "feminino": null
    },
    SexoCliente: {
      "id": null,
      "descricao": null
    },
    OcupacaoCliente: [],
    OcupacaoConjuge: [],
    IDCargoCliente: null,
    IDCargoConjuge: null,
    OptionUF: null,
    OptionCargos: null,
    OptionNacionalidade: null,
    OptionSexualidade: null,
    NomeConjuge: null,
    RGConjuge: null,
    IDRGUFConjuge: null,
    RGUFConjuge: null,
    RGOrgaoEmissorConjuge: null,
    CargoConjuge: null,
    RendaConjuge: 0,
    NacionalidadeConjuge: {
      "id": null,
      "descricao": null,
      "nacionalidade": null,
      "masculino": null,
      "feminino": null
    },
    SexoConjuge: {
      "id": null,
      "descricao": null
    },
    CPFConjuge: null,
    DataConjuge: null,
    EmailConjuge: null,
    ValueSwitchConjuge: false,
    CEP: null,
    Rua: null,
    Numero: null,
    Complemento: null,
    Bairro: null,
    Cidade: null,
    Estado: null,
    IDEstado: null,
    Telefone: null,
    TelefoneComercial: null,
    dadosProspect: [],
    refs: [],
    Clientes: [
      {
        id: 1,
        ID_cliente: 0,
        ID_conjuge: 0,
        ID_prospectcliente: 0,
        ID_prospectconjuge: 0,
        VisibilidadeModalEstadosCivis: false,
        VisibilidadeModalRegimeDeBens: false,
        VisibilidadeModalCargos: false,
        VisibilidadeModalUFDoRG: false,
        VisibilidadeModalNacionalidade: false,
        VisibilidadeModalSexualidade: false,
        OptionUF: '',
        OptionCargos: '',
        OptionNacionalidade: '',
        OptionSexualidade: '',
        OcupacaoCliente: [],
        OcupacaoConjuge: [],
        ValueSwitchConjuge: false,
        valueSwitch: false,
        CPFCliente: null,
        DataCliente: null,
        NomeCliente: null,
        IDRGUFCliente: null,
        RGCliente: null,
        RGOrgaoEmissorCliente: null,
        RGUFCliente: null,
        IDCargoCliente: null,
        CargoCliente: null,
        RendaCliente: 0,
        NacionalidadeCliente: {
          "id": null,
          "descricao": null,
          "nacionalidade": null,
          "masculino": null,
          "feminino": null
        },
        SexoCliente: {
          "id": null,
          "descricao": null
        },
        EmailCliente: null,
        StatusCivil: null,
        StatusCivilDescricao: null,
        Regime: null,
        RegimeDescricao: null,
        CPFConjuge: null,
        DataConjuge: null,
        NomeConjuge: null,
        IDRGUFConjuge: null,
        RGConjuge: null,
        RGOrgaoEmissorConjuge: null,
        RGUFConjuge: null,
        IDCargoConjuge: null,
        CargoConjuge: null,
        RendaConjuge: 0,
        SexoConjuge: {
          "id": null,
          "descricao": null
        },
        NacionalidadeConjuge: {
          "id": null,
          "descricao": null,
          "nacionalidade": null,
          "masculino": null,
          "feminino": null
        },
        EmailConjuge: null,
        CEP: null,
        Rua: null,
        Numero: null,
        Complemento: null,
        Bairro: null,
        Cidade: null,
        Estado: null,
        IDEstado: null,
        Telefone: null,
        TelefoneComercial: null,
        FotoIdentidade: {
          "id": "RG 02",
          "habilitar_camera": false,
          "base64": null, 
          "deviceOrientation": null, 
          "height": null, 
          "pictureOrientation": null, 
          "uri": null, 
          "width": null,
          "isPDF": false,
        },
        FotoIdentidadeConjuge: {
          "id": "RG do Conjugê 02",
          "habilitar_camera": false,
          "base64": null, 
          "deviceOrientation": null, 
          "height": null, 
          "pictureOrientation": null, 
          "uri": null, 
          "width": null,
          "isPDF": false,
        },
        FotoEndereco: {
          "id": "Comprovante end. 02",
          "habilitar_camera": false,
          "base64": null, 
          "deviceOrientation": null, 
          "height": null, 
          "pictureOrientation": null, 
          "uri": null, 
          "width": null,
          "isPDF": false,
        },
        FotoCertidao: {
          "id": "Estado Civil 02",
          "habilitar_camera": false,
          "base64": null, 
          "deviceOrientation": null, 
          "height": null, 
          "pictureOrientation": null, 
          "uri": null, 
          "width": null,
          "isPDF": false,
        },
      },
    ],
    dadosClientes: [],
    ID: ""
  };
  //#endregion

  //#region View
  render() {
    
    const filteredCargos = this.state.ListaDeCargos.filter(createFilter(this.state.searchTermCargos, KEYS_TO_FILTERS))
    const filteredNacionalidade = this.state.Nacionalidades.filter(createFilter(this.state.searchTermNacionalidade, KEYS_TO_FILTERS_NACIONALIDADE))
    const filteredSexualidades = this.state.Sexualidades.filter(createFilter(this.state.searchTermSexualidade, KEYS_TO_FILTERS_SEXUALIDADE))

    return (
      <KeyboardAvoidingView
        style = {{flex: 1}} behavior = {Platform.OS === "ios" ? "padding" : "height"}>
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
        <Modal // Anexos
          animationType = 'slide'
          transparent = {false}
          visible = {this.state.VisibilidadeModalAnexos}>
          <View style = {{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View style = {{ backgroundColor: '#FFFFFF', height: 75, justifyContent: "center" }}>
              <View 
                style = {{
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10
              }}>
                <Icon name = {'keyboard-arrow-down'} color = {this.props.StyleGlobal.cores.background} size = {40}
                  onPress = {() => {this.setVisibilidadeModalAnexos(false)}}/>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 13,
                    textAlign: 'center',
                    color: this.props.StyleGlobal.cores.background
                }}>Documentos</Text>
                <View style = {{width: 40}}/>
              </View>
            </View>
            <Carousel
              key = {item => item.id}
              ref = {(ref) => {this.FlatListCarousel = ref}}
              data = {this.state.anexosDocumentos}
              sliderWidth = {Dimensions.get('window').width}
              itemWidth = {Dimensions.get('window').width*0.9}
              renderItem = {this.renderItemCarousel}
              scrollEnabled = {this.state.scrollCarouselEnabled}
            />
          </View>
        </Modal>
        <ModalEstadoCivil 
          visibilidade = {this.state.VisibilidadeModalEstadosCivis}
          keyExtractorFlatList = {item => String(item.id)}
          renderEstadoCivil = {this.renderEstadoCivil}
          dataEstadoCivil = {this.state.EstadosCivis}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onPressVisibilidade = {() => {this.setVisibilidadeModalEstadosCivis(false)}}
        />
        <ModalRegimeDeBens 
          visibilidade = {this.state.VisibilidadeModalRegimeDeBens}
          keyExtractorFlatList = {item => String(item.id)}
          renderRegimeDeBens = {this.renderRegimeDeBens}
          dataRegimeDeBens = {this.state.RegimesDeBens}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onPressVisibilidade = {() => {this.setVisibilidadeModalRegimeDeBens(false)}}
        />
        <ModalUFDoRG 
          visibilidade = {this.state.VisibilidadeModalUFDoRG}
          keyExtractorFlatList = {item => String(item.id)}
          renderUFRG = {this.renderUFEstados}
          dataUFRG = {this.state.EstadosUF}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onPressVisibilidade = {() => {this.setVisibilidadeModalUFDoRG(false)}}
        />
        <ModalLoading 
          visibilidade = {this.state.VisibilidadeModalLoading}
          onPress = {async () => {
            await Prospect.cancelRequest(true)
            await Pessoa.cancelRequest(true)
            await this.setVisibilidadeModalLoading(false)
          }}
        />
        <ModalLoadingGoBack
          visibilidade = {this.state.VisibilidadeModalLoadingGoBack}
          onPress = {async () => {
            await Pessoa.cancelRequest(true)
            await Cargos.cancelRequest(true)
            await this.setState({VisibilidadeModalLoadingGoBack: false})
            await this.props.navigation.goBack()
          }}
        />
        <ModalEndereco
          visibilidade = {this.state.VisibilidadeModalEndereco}
          fimdaanimacao = {() => {this.setVisibilidadeModalEndereco(true)}}
        />
        <ModalOption
          visibilidade = {this.state.VisibilidadeModalOption}
          textomensagem = {this.state.ModalOptionMensagem}
          onPressIcon = {() => {this.setVisibilidadeModalOption(false, '@')}}
          onPressSim = {() => {this.setandoOpcaoSimNaModalOption(this.state.Option)}}
          onPressNao = {() => {this.setandoOpcaoNaoNaModalOption(this.state.Option)}}
        />
        <ModalProcurandoDadosCliente
          visibilidade = {this.state.VisibilidadeModalProcurandoDadosCliente}
          onPress = {() => {this.setVisibilidadeModalProcurandoDadosCliente(false)}}
        />
        <ModalCargos
          visibilidade = {this.state.VisibilidadeModalCargos}
          keyExtractorFlatList = {item => String(item.id)}
          renderCargos = {this.renderCargos}
          filteredCargos= {filteredCargos}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onChangeSearch = {(term) => {this.searchUpdateCargos(term)}}
          onPressVisibilidade = {() => {this.setVisibilidadeModalCargos(false)}}
          onScroll = {(e) => {}}
          onlayout = {async (e) => {}}
        />
        <ModalNacionalidade
          visibilidade = {this.state.VisibilidadeModalNacionalidade}
          keyExtractorFlatList = {item => String(item.id)}
          renderNacionalidade = {this.renderNacionalidade}
          filteredNacionalidade = {filteredNacionalidade}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onChangeSearch = {(term) => {this.searchUpdateNacionalidade(term)}}
          onPressVisibilidade = {() => {this.setVisibilidadeModalNacionalidade(false)}}
          onScroll = {(e) => {}}
          onlayout = {async (e) => {}}
        />
        <ModalSexualidade
          visibilidade = {this.state.VisibilidadeModalSexualidade}
          keyExtractorFlatList = {item => String(item.id)}
          renderSexualidade = {this.renderSexualidade}
          filteredSexualidade = {filteredSexualidades}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onChangeSearch = {(term) => {this.searchUpdateSexualidade(term)}}
          onPressVisibilidade = {() => {this.setVisibilidadeModalSexualidade(false)}}
          onScroll = {(e) => {}}
          onlayout = {async (e) => {}}
        />
        {this.state.VisibilidadeModalLoading == false && this.state.VisibilidadeModalLoadingGoBack == false && <>
        <View 
          style = {{
            height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 72,
            marginBottom: 20,
            justifyContent: "center"
        }}>
          <View
            style = {{
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
          }}>
            <Icon name = {'keyboard-arrow-left'} color = {this.props.StyleGlobal.cores.background} size = {40} style = {{}}
            onPress = { () => {this.props.navigation.goBack() }}/>
            <Text
              style = {{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
                color: this.props.StyleGlobal.cores.background
            }}>Cliente</Text>
            <View style = {{width: 40}}/>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator = {false}>
          <View
            style = {{
              paddingHorizontal: 24, 
              marginBottom: 15, 
              minHeight: Dimensions.get('window').height - 175,
          }}>
            {true &&
            <ClienteView>
              <View style = {{flexDirection: 'row'}}>
                {this.state.CPFCliente != null && this.state.CPFCliente != "" && this.state.DataCliente != null && this.state.DataCliente != "" && this.state.NomeCliente != null && this.state.NomeCliente != "" &&
                  <Icon name = {"photo-camera"} size = {24} color = {this.props.StyleGlobal.cores.background} onPress = {this.setandoParaTirarFotoDaIdentidade}/>}
                <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginBottom: 16}}>Cliente</Text>
              </View>
              <TextInputCPF 
                title = {'Digite aqui seu CPF'}
                keyboardType = {'numeric'}
                returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                id = {(ref) => {this.InputCPFCliente = ref}}
                value = {this.state.CPFCliente}
                onChangeText = {this.onChangeInputCPFCliente}
                onSubmitEditing = {this.submitInputCPFCliente}
              />
              <TextInputData
                animated = {this.state.AnimatedDataCliente}
                title = {'Data de nascimento'}
                keyboardType = {'numeric'}
                returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                id = {(ref) => {this.InputDataCliente = ref}}
                value = {this.state.DataCliente}
                onChangeText = {this.onChangeInputDataCliente}
                onSubmitEditing = {this.submitInputDataCliente}
              />
              <TextInputNome
                animated = {this.state.AnimatedNomeCliente}
                title = {'Escreva seu nome completo'}
                keyboardType = {'default'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputNomeCliente = ref}}
                value = {this.state.NomeCliente}
                onChangeText = {this.onChangeInputNomeCliente}
                onSubmitEditing = {this.submitInputNomeCliente}
              />
              <TextInputRG
                animated = {this.state.AnimatedEmailCliente}
                title = {'Número do seu RG'}
                keyboardType = {'numeric'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputRGCliente = ref}}
                value = {this.state.RGCliente}
                onChangeText = {this.onChangeInputRGCliente}
                onSubmitEditing = {this.submitInputRGCliente}
              />
              <View style = {{flexDirection: 'row'}}>
                <TextInputOrgaoEmissor
                  animated = {this.state.AnimatedNomeCliente}
                  estilo = {{flex: 1, marginRight: 8}}
                  title = {'Orgão Emissor'}
                  keyboardType = {'default'}
                  returnKeyType = {'go'}
                  id = {(ref) => {this.InputRGOrgaoEmissor = ref}}
                  value = {this.state.RGOrgaoEmissorCliente}
                  onChangeText = {this.onChangeInputRGOrgaoEmissorCliente}
                  onSubmitEditing = {() => {}}
                />
                <TouchableOpacity style = {{ borderRadius: 5}} activeOpacity = {1} 
                  onPress = {() => {this.setVisibilidadeModalUFDoRG(true, '@orgaoemissorcliente')}}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367'
                  }}>{"UF"}</Text>
                  <Text
                    style = {{
                      flexDirection: 'column',
                      paddingVertical: 24,
                      paddingHorizontal: 16,
                      height: 65,
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
                  }}>{(this.state.RGUFCliente == null || this.state.RGUFCliente == "") ? "XX" : this.state.RGUFCliente}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style = {{borderRadius: 5}} activeOpacity = {1} onPress = {() => {this.setVisibilidadeModalCargos(true, '@cliente')}}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 13,
                    color: '#677367'
                }}>{"Cargo"}</Text>
                <Text
                  style = {{
                    flexDirection: 'column',
                    paddingVertical: 24,
                    paddingHorizontal: 16,
                    height: 65,
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
                }}>{(this.state.CargoCliente == null || this.state.CargoCliente == "") ? "Selecione o cargo do cliente" : this.state.CargoCliente}</Text>
              </TouchableOpacity>
              {this.props.EmpresaLogada[0] == 8 &&
              <TextInputRenda 
                title = {'Renda'}
                keyboardType = {'numeric'}
                returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                id = {(ref) => {this.InputRendaCliente = ref}}
                value = {formatoDeTexto.FormatarTexto(this.state.RendaCliente)}
                onChangeText = {this.onChangeInputRendaCliente}
                onSubmitEditing = {() => {}}
              />}
              {this.props.EmpresaLogada[0] == 4 &&
              <TouchableOpacity style = {{borderRadius: 5}} activeOpacity = {1} onPress = {() => {this.setVisibilidadeModalNacionalidade(true, '@cliente')}}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 13,
                    color: '#677367'
                }}>{"Nacionalidade"}</Text>
                <Text
                  style = {{
                    flexDirection: 'column',
                    paddingVertical: 24,
                    paddingHorizontal: 16,
                    height: 65,
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
                }}>{(this.state.NacionalidadeCliente.id == null || this.state.NacionalidadeCliente == "") ? "Selecione a nacionalidade do cliente" : this.state.NacionalidadeCliente.descricao}</Text>
              </TouchableOpacity>}
              {this.props.EmpresaLogada[0] == 8 &&
              <TouchableOpacity style = {{borderRadius: 5}} activeOpacity = {1} onPress = {() => {this.setVisibilidadeModalSexualidade(true, '@cliente')}}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 13,
                    color: '#677367'
                }}>{"Sexo"}</Text>
                <Text
                  style = {{
                    flexDirection: 'column',
                    paddingVertical: 24,
                    paddingHorizontal: 16,
                    height: 65,
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
                }}>{(this.state.SexoCliente.id == null || this.state.SexoCliente == "") ? "Selecione o sexo do cliente" : this.state.SexoCliente.descricao}</Text>
              </TouchableOpacity>}
              <TextInputEmail
                animated = {this.state.AnimatedEmailCliente}
                title = {'Email'}
                keyboardType = {'email-address'}
                returnKeyType = {'go'}
                autoCapitalize = {'none'}
                id = {(ref) => {this.InputEmailCliente = ref}}
                value = {this.state.EmailCliente}
                onChangeText = {this.onChangeInputEmailCliente}
                onSubmitEditing = {() => {}}
              />
            </ClienteView>
            }
            {true &&
            <EstadoCivilView>
              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                {this.state.StatusCivil > 0 &&
                <Icon name = {"photo-camera"} size = {24} color = {this.props.StyleGlobal.cores.background} style = {{marginTop: 9}} onPress = {this.setandoParaTirarFotoDaCertidao}/>}
                <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginBottom: 16, marginTop: 24}}>Estado Civil</Text>
              </View>
              <TouchableOpacity activeOpacity = {1} onPress = {() => {this.setVisibilidadeModalEstadosCivis(true)}}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 13,
                    color: '#677367'
                }}>{"Situação atual"}</Text>
                <Text
                  style = {{
                    flexDirection: 'column',
                    paddingVertical: 24,
                    paddingHorizontal: 16,
                    height: 65,
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
                }}>{(this.state.StatusCivilDescricao == null || this.state.StatusCivilDescricao == "") ? 'Selecione o estado civil' : this.state.StatusCivilDescricao}</Text>
              </TouchableOpacity>
              {this.state.StatusCivil == 2 &&
                <TouchableOpacity activeOpacity = {1} onPress = {() => {this.setVisibilidadeModalRegimeDeBens(true)}}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367'
                  }}>{"Regime de bens"}</Text>
                  <Text
                    style = {{
                      flexDirection: 'column',
                      paddingVertical: 24,
                      paddingHorizontal: 16,
                      height: 65,
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
                  }}>{(this.state.RegimeDescricao == null || this.state.RegimeDescricao == "") ? 'Selecione o regime de bens' : this.state.RegimeDescricao}</Text>
                </TouchableOpacity>}
            </EstadoCivilView>
            }
            {(this.state.StatusCivil == 2 || this.state.StatusCivil == 7) &&
            <ConjugeView>
              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                {this.state.CPFConjuge != null && this.state.CPFConjuge != "" && this.state.DataConjuge != null && this.state.DataConjuge != "" && this.state.NomeConjuge != null && this.state.NomeConjuge != "" &&
                  <Icon name = {"photo-camera"} size = {24} color = {this.props.StyleGlobal.cores.background} style = {{ marginTop: 20}} onPress = {this.setandoParaTirarFotoDoConjuge}/>}
                <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginTop: 24, marginBottom: 5}}>Conjuge</Text>
              </View>
              <View style = {{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 16}}>
                <Switch
                  trackColor = {{false: '#CCCCCC99', true: this.props.StyleGlobal.cores.background}}
                  onValueChange = {this.onValueChangeSwitchConjuge}
                  value = {this.state.ValueSwitchConjuge} 
                />
                <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: this.props.StyleGlobal.cores.background}}>Conjugê irá assinar o contrato?</Text>
              </View>
              <TextInputCPF 
                title = {'Digite aqui seu CPF'}
                keyboardType = {'numeric'}
                returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                id = {(ref) => {this.InputCPFConjuge = ref}}
                value = {this.state.CPFConjuge}
                onChangeText = {this.onChangeInputCPFConjuge}
                onSubmitEditing = {this.submitInputCPFConjuge}
              />
              <TextInputData
                animated = {this.state.AnimatedDataConjuge}
                title = {'Data de nascimento'}
                keyboardType = {'numeric'}
                returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                id = {(ref) => {this.InputDataConjuge = ref}}
                value = {this.state.DataConjuge}
                onChangeText = {this.onChangeInputDataConjuge}
                onSubmitEditing = {this.submitInputDataConjuge}
              />
              <TextInputNome 
                animated = {this.state.AnimatedNomeConjuge}
                title = {'Escreva seu nome completo'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputNomeConjuge = ref}}
                value = {this.state.NomeConjuge}
                onChangeText = {this.onChangeInputNomeConjuge}
                onSubmitEditing = {this.submitInputNomeConjuge}
              />
              <TextInputRG
                animated = {this.state.AnimatedEmailCliente}
                title = {'Número do seu RG'}
                keyboardType = {'numeric'}
                returnKeyType = {Platform.OS === "ios" ? "done" : 'go'}
                id = {(ref) => {this.InputRGConjuge = ref}}
                value = {this.state.RGConjuge}
                onChangeText = {this.onChangeInputRGConjuge}
                onSubmitEditing = {this.submitInputRGConjuge}
              />
              <View style = {{flexDirection: 'row'}}>
                <TextInputOrgaoEmissor
                  animated = {this.state.AnimatedNomeCliente}
                  estilo = {{flex: 1, marginRight: 8}}
                  title = {'Orgão Emissor'}
                  keyboardType = {'default'}
                  returnKeyType = {'go'}
                  id = {(ref) => {this.InputRGOrgaoEmissorConjuge = ref}}
                  value = {this.state.RGOrgaoEmissorConjuge}
                  onChangeText = {this.onChangeInputRGOrgaoEmissorConjuge}
                  onSubmitEditing = {() => {}}
                />
                <TouchableOpacity style = {{}} activeOpacity = {1} onPress = {() => {this.setVisibilidadeModalUFDoRG(true, '@orgaoemissorconjuge')}}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367'
                  }}>{"UF"}</Text>
                  <Text
                    style = {{
                      flexDirection: 'column',
                      paddingVertical: 24,
                      paddingHorizontal: 16,
                      height: 65,
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
                  }}>{(this.state.RGUFConjuge == null || this.state.RGUFConjuge == "") ? "XX" : this.state.RGUFConjuge}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity activeOpacity = {1} onPress = {() => {this.setVisibilidadeModalCargos(true, '@conjuge')}}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 13,
                    color: '#677367'
                }}>{"Cargo"}</Text>
                <Text
                  style = {{
                    flexDirection: 'column',
                    paddingVertical: 24,
                    paddingHorizontal: 16,
                    height: 65,
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
                }}>{(this.state.CargoConjuge == null || this.state.CargoConjuge == "") ? "Selecione o cargo do conjuge" : this.state.CargoConjuge}</Text>
              </TouchableOpacity>
              {this.props.EmpresaLogada[0] == 8 &&
              <TextInputRenda 
                title = {'Renda'}
                keyboardType = {'numeric'}
                returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                id = {(ref) => {this.InputRendaConjuge = ref}}
                value = {formatoDeTexto.FormatarTexto(this.state.RendaConjuge)}
                onChangeText = {(value) => {this.setState({RendaConjuge: formatoDeTexto.DesformatarTexto(value)})}}
                onSubmitEditing = {() => {}}
              />}
              {this.props.EmpresaLogada[0] == 4 &&
              <TouchableOpacity activeOpacity = {1} onPress = {() => {this.setVisibilidadeModalNacionalidade(true, '@conjuge')}}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 13,
                    color: '#677367'
                }}>{"Nacionalidade"}</Text>
                <Text
                  style = {{
                    flexDirection: 'column',
                    paddingVertical: 24,
                    paddingHorizontal: 16,
                    height: 65,
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
                }}>{(this.state.NacionalidadeConjuge.id == null || this.state.NacionalidadeConjuge == "") ? "Selecione a nacionalidade do conjuge" : this.state.NacionalidadeConjuge.descricao}</Text>
              </TouchableOpacity>}
              {this.props.EmpresaLogada[0] == 8 &&
              <TouchableOpacity activeOpacity = {1} onPress = {() => {this.setVisibilidadeModalSexualidade(true, '@conjuge')}}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 13,
                    color: '#677367'
                }}>{"Sexo"}</Text>
                <Text
                  style = {{
                    flexDirection: 'column',
                    paddingVertical: 24,
                    paddingHorizontal: 16,
                    height: 65,
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
                }}>{(this.state.SexoConjuge.id == null || this.state.SexoConjuge == "") ? "Selecione o sexo do conjuge" : this.state.SexoConjuge.descricao}</Text>
              </TouchableOpacity>}
              <TextInputEmail
                animated = {this.state.AnimatedEmailConjuge}
                title = {'Email'}
                keyboardType = {'email-address'}
                returnKeyType = {'go'}
                autoCapitalize = {'none'}
                id = {(ref) => {this.InputEmailConjuge = ref}}
                value = {this.state.EmailConjuge}
                onChangeText = {this.onChangeInputEmailConjuge}
                onSubmitEditing = {this.submitInputEmailConjuge}
              />
            </ConjugeView>}
            {true &&
            <EnderecoView>
              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                {this.state.CEP != null && this.state.CEP != "" && this.state.Rua != null && this.state.Rua != "" && this.state.Bairro != null && this.state.Bairro != "" && this.state.Cidade != null && this.state.Cidade != "" && this.state.Estado != null && this.state.Estado != "" &&
                  <Icon name = {"photo-camera"} size = {24} color = {this.props.StyleGlobal.cores.background} style = {{ marginTop: 9}} onPress = {this.setandoParaTirarFotoDoEndereco}/>}
                <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginBottom: 16, marginTop: 24}}>Endereço</Text>
              </View>
              <TextInputCEP
                title = {'CEP'}
                keyboardType = {'numeric'}
                returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                id = {(ref) => {this.InputCEP = ref}}
                value = {this.state.CEP}
                onChangeText = {this.onChangeInputCEP}
                onSubmitEditing = {this.submitInputCEP}
              />
              <TextInputLogradouro
                animated = {this.state.AnimatedEndereco}
                title = {'Rua'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputRua = ref}}
                value = {this.state.Rua}
                onChangeText = {this.onChangeInputRua}
                onSubmitEditing = {this.submitInputRua}
              />
              <TextInputNumero
                animated = {this.state.AnimatedEndereco}
                title = {'Número'}
                defaultValue = {"S/N"}
                keyboardType = {'numeric'}
                returnKeyType = {Platform.OS === "ios" ? "done" : 'go'}
                id = {(ref) => {this.InputNumero = ref}}
                value = {this.state.Numero}
                onChangeText = {this.onChangeInputNumero}
                onSubmitEditing = {this.submitInputNumero}
              />
              <TextInputComplemento 
                animated = {this.state.AnimatedEndereco}
                title = {'Complemento'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputComplemento = ref}}
                value = {this.state.Complemento}
                onChangeText = {this.onChangeInputComplemento}
                onSubmitEditing = {this.submitInputComplemento}
              />
              <TextInputBairro
                animated = {this.state.AnimatedEndereco}
                title = {'Bairro'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputBairro = ref}}
                value = {this.state.Bairro}
                onChangeText = {this.onChangeInputBairro}
                onSubmitEditing = {this.submitInputBairro}
              />
              <TextInputCidade 
                animated = {this.state.AnimatedEndereco}
                title = {'Cidade'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputCidade = ref}}
                value = {this.state.Cidade}
                onChangeText = {this.onChangeInputCidade}
                onSubmitEditing = {this.submitInputCidade}
              />
              <TouchableOpacity activeOpacity = {1}
                onPress = {() => {this.setVisibilidadeModalUFDoRG(true, '@endereco')}}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 13,
                    color: '#677367'
                }}>{"Estado"}</Text>
                <Text
                  style = {{
                    flexDirection: 'column',
                    paddingVertical: 24,
                    paddingHorizontal: 16,
                    height: 65,
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
                }}>{(this.state.Estado == null || this.state.Estado == "") ? "Clique para selecionar o estado" : this.state.Estado}</Text>          
              </TouchableOpacity>
            </EnderecoView>
            }
            {true &&
            <TelefonesView
              >
              <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginBottom: 16, marginTop: 24}}>Telefones</Text>
              <TextInputTelefone
                animated = {this.state.AnimatedTelefone}
                title = {'Telefone'}
                keyboardType = {'numeric'}
                returnKeyType = {Platform.OS === "ios" ? "done" : 'go'}
                id = {(ref) => {this.InputTelefone = ref}}
                value = {this.state.Telefone}
                onChangeText = {this.onChangeInputTelefone}
                onSubmitEditing = {this.submitInputTelefone}
              />
              <TextInputTelefone 
                animated = {this.state.AnimatedTelefoneComercial}
                title = {'Telefone Comercial'}
                keyboardType = {'numeric'}
                returnKeyType = {Platform.OS === "ios" ? "done" : 'go'}
                id = {(ref) => {this.InputTelefoneComercial = ref}}
                value = {this.state.TelefoneComercial}
                onChangeText = {this.onChangeInputTelefoneComercial}
                onSubmitEditing = {() => {}}
              />
            </TelefonesView>
            }
            {this.state.Clientes.map((cliente) => true && (
              <>
                <ClienteView key = {cliente.id}>
                  <View style = {{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
                    {cliente.CPFCliente != null && cliente.CPFCliente != "" && cliente.DataCliente != null && cliente.DataCliente != "" && cliente.NomeCliente != null && cliente.NomeCliente != "" &&
                      <Icon name = {"photo-camera"} size = {24} color = {this.props.StyleGlobal.cores.background} 
                      onPress = {() => {
                        if(cliente.FotoIdentidade.base64 ==  null) {
                          this._tiraFoto('RG', cliente.FotoIdentidade);
                          this.setState({imageurl: cliente.FotoIdentidade, anexo_atual: 'RG', scrollCarouselEnabled: false});
                          this.setVisibilidadeModalAnexos(true);
                        } else if(cliente.FotoIdentidade.base64 != null) {
                          this._mostraFoto('RG', cliente.FotoIdentidade);
                          this.setState({anexo_atual: 'RG'});
                          this.setVisibilidadeModalAnexos(true);
                        }
                      }}/>}
                    <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginBottom: 2}}>{cliente.valueSwitch == true ? `Dados do ${parseInt(parseInt(cliente.id) + 1)}° comprador` : `Esta venda possui ${parseInt(parseInt(cliente.id) + 1)}° comprador?`}</Text>
                    <Switch
                      trackColor = {{false: '#CCCCCC99', true: this.props.StyleGlobal.cores.background}}
                      onValueChange = {async () => {
                        if (cliente.valueSwitch == false)
                        {
                          cliente.valueSwitch = true
                          this.state.Clientes.push({
                            id: cliente.id + 1,
                            ID_cliente: 0,
                            ID_conjuge: 0,
                            ID_prospectcliente: 0,
                            ID_prospectconjuge: 0,
                            VisibilidadeModalEstadosCivis: false,
                            VisibilidadeModalRegimeDeBens: false,
                            VisibilidadeModalCargos: false,
                            VisibilidadeModalUFDoRG: false,
                            VisibilidadeModalNacionalidade: false,
                            VisibilidadeModalSexualidade: false,
                            OptionUF: '',
                            OptionCargos: '',
                            OptionNacionalidade: '',
                            OptionSexualidade: '',
                            OcupacaoCliente: [],
                            OcupacaoConjuge: [],
                            ValueSwitchConjuge: false,
                            valueSwitch: false,
                            CPFCliente: null,
                            DataCliente: null,
                            NomeCliente: null,
                            RGCliente: null,
                            RGOrgaoEmissorCliente: null,
                            RGUFCliente: null,
                            CargoCliente: null,
                            RendaCliente: 0,
                            NacionalidadeCliente: {
                              "id": null,
                              "descricao": null,
                              "nacionalidade": null,
                              "masculino": null,
                              "feminino": null
                            },
                            SexoCliente: {
                              "id": null,
                              "descricao": null
                            },
                            EmailCliente: null,
                            StatusCivil: null,
                            StatusCivilDescricao: null,
                            Regime: null,
                            RegimeDescricao: null,
                            CPFConjuge: null,
                            DataConjuge: null,
                            NomeConjuge: null,
                            RGConjuge: null,
                            RGOrgaoEmissorConjuge: null,
                            RGUFConjuge: null,
                            CargoConjuge: null,
                            RendaConjuge: 0,
                            SexoConjuge: {
                              "id": null,
                              "descricao": null
                            },
                            NacionalidadeConjuge: {
                              "id": null,
                              "descricao": null,
                              "nacionalidade": null,
                              "masculino": null,
                              "feminino": null
                            },
                            EmailConjuge: null,
                            CEP: null,
                            Rua: null,
                            Numero: null,
                            Complemento: null,
                            Bairro: null,
                            Cidade: null,
                            Estado: null,
                            IDEstado: null,
                            Telefone: null,
                            TelefoneComercial: null,
                            FotoIdentidade: {
                              "id": `RG ${formatoDeTexto.NumeroInteiro(cliente.id + 2)}`,
                              "habilitar_camera": false,
                              "base64": null, 
                              "deviceOrientation": null, 
                              "height": null, 
                              "pictureOrientation": null, 
                              "uri": null, 
                              "width": null,
                              "isPDF": false,
                            },
                            FotoIdentidadeConjuge: {
                              "id": `RG do Conjugê ${formatoDeTexto.NumeroInteiro(cliente.id + 2)}`,
                              "habilitar_camera": false,
                              "base64": null, 
                              "deviceOrientation": null, 
                              "height": null, 
                              "pictureOrientation": null, 
                              "uri": null, 
                              "width": null,
                              "isPDF": false,
                            },
                            FotoEndereco: {
                              "id": `Comprovante end. ${formatoDeTexto.NumeroInteiro(cliente.id + 2)}`,
                              "habilitar_camera": false,
                              "base64": null, 
                              "deviceOrientation": null, 
                              "height": null, 
                              "pictureOrientation": null, 
                              "uri": null, 
                              "width": null,
                              "isPDF": false,
                            },
                            FotoCertidao: {
                              "id": `Estado Civil ${formatoDeTexto.NumeroInteiro(cliente.id + 2)}`,
                              "habilitar_camera": false,
                              "base64": null, 
                              "deviceOrientation": null, 
                              "height": null, 
                              "pictureOrientation": null, 
                              "uri": null, 
                              "width": null,
                              "isPDF": false,
                            },
                          })
                          await this.setState({Renderizar: true})
                        }
                        else {
                          cliente.valueSwitch = false
                          this.state.Clientes = this.state.Clientes.filter(filtro => filtro.id != cliente.id)
                          await this.state.Clientes.map(async c => {
                            if(c.id >= cliente.id) {
                              c.id = c.id - 1;
                              await this.setState({Renderizar: false})
                            }
                          })
                          await this.setState({Renderizar: true})
                        }
                      }}
                      value = {cliente.valueSwitch} 
                    />
                  </View>
                  {cliente.valueSwitch == true && <>
                    <TextInputCPF 
                      title = {'Digite aqui seu CPF'}
                      keyboardType = {'numeric'}
                      returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                      id = {(ref) => {this.InputCPFCliente = ref}}
                      value = {cliente.CPFCliente}
                      onChangeText = {(value) => {
                        cliente.CPFCliente = formatoDeTexto.CPF_CNPJ(value)
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {async () => {
                        if(await this.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente)) == true 
                        || await this.ValidarCNPJ(formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente)) == true) {
                            await this.setVisibilidadeModalProcurandoDadosCliente(true)
                            await this.pegandoDadosClienteLista(cliente.CPFCliente, cliente.id, cliente.DataCliente);
                        } else {
                          await Validacoes._InputCPF_CNPJLista(cliente.CPFCliente, this.state.this, cliente.DataCliente, cliente.id)
                        }
                      }}
                    />
                    <TextInputData
                      animated = {this.state.AnimatedDataCliente}
                      title = {'Data de nascimento'}
                      keyboardType = {'numeric'}
                      returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                      id = {(ref) => {this.InputDataCliente = ref}}
                      value = {cliente.DataCliente}
                      onChangeText = {(value) => {
                        cliente.DataCliente = formatoDeTexto.Data(value)
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                    <TextInputNome
                      animated = {this.state.AnimatedNomeCliente}
                      title = {'Escreva seu nome completo'}
                      keyboardType = {'default'}
                      returnKeyType = {'go'}
                      id = {(ref) => {this.InputNomeCliente = ref}}
                      value = {cliente.NomeCliente}
                      onChangeText = {(value) => {
                        cliente.NomeCliente = value
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                    <TextInputRG
                      animated = {this.state.AnimatedEmailCliente}
                      title = {'Número do seu RG'}
                      keyboardType = {'numeric'}
                      returnKeyType = {Platform.OS === "ios" ? "done" : 'go'}
                      id = {(ref) => {this.InputRGCliente = ref}}
                      value = {cliente.RGCliente}
                      onChangeText = {(value) => {
                        cliente.RGCliente = value
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                    <View style = {{flexDirection: 'row'}}>
                      <TextInputOrgaoEmissor
                        animated = {this.state.AnimatedNomeCliente}
                        estilo = {{flex: 1, marginRight: 8}}
                        title = {'Orgão Emissor'}
                        keyboardType = {'default'}
                        returnKeyType = {'go'}
                        id = {(ref) => {this.InputRGOrgaoEmissor = ref}}
                        value = {cliente.RGOrgaoEmissorCliente}
                        onChangeText = {(value) => {
                          cliente.RGOrgaoEmissorCliente = value
                          this.setState({Renderizar: true})
                        }}
                        onSubmitEditing = {() => {}}
                      />
                      <TouchableOpacity style = {{ borderRadius: 5}} activeOpacity = {1} 
                        onPress = {() => {
                          cliente.VisibilidadeModalUFDoRG = true
                          cliente.OptionUF = '@orgaoemissorcliente'
                          this.setState({Renderizar: true})
                        }}>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 13,
                            color: '#677367'
                        }}>{"UF"}</Text>
                        <Text
                          style = {{
                            flexDirection: 'column',
                            paddingVertical: 24,
                            paddingHorizontal: 16,
                            height: 65,
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
                        }}>{(cliente.RGUFCliente == null || cliente.RGUFCliente == "") ? "XX" : cliente.RGUFCliente}</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style = {{borderRadius: 5}} activeOpacity = {1} 
                      onPress = {() => {
                        cliente.VisibilidadeModalCargos = true
                        cliente.OptionCargos = '@cliente'
                        this.setState({Renderizar: true})
                      }}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{"Cargo"}</Text>
                      <Text
                        style = {{
                          flexDirection: 'column',
                          paddingVertical: 24,
                          paddingHorizontal: 16,
                          height: 65,
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
                      }}>{(cliente.CargoCliente == null || cliente.CargoCliente == "") ? "Selecione o cargo do cliente" : cliente.CargoCliente}</Text>
                    </TouchableOpacity>
                    {this.props.EmpresaLogada[0] == 8 &&
                    <TextInputRenda 
                      title = {'Renda'}
                      keyboardType = {'numeric'}
                      returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                      value = {formatoDeTexto.FormatarTexto(cliente.RendaCliente)}
                      onChangeText = {(value) => {
                        cliente.RendaCliente = formatoDeTexto.DesformatarTexto(value)
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />}
                    {this.props.EmpresaLogada[0] == 4 &&
                    <TouchableOpacity style = {{borderRadius: 5}} activeOpacity = {1}
                      onPress = {() => {
                        cliente.VisibilidadeModalNacionalidade = true
                        cliente.OptionNacionalidade = '@cliente'
                        this.setState({Renderizar: true})
                      }}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{"Nacionalidade"}</Text>
                      <Text
                        style = {{
                          flexDirection: 'column',
                          paddingVertical: 24,
                          paddingHorizontal: 16,
                          height: 65,
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
                      }}>{(cliente.NacionalidadeCliente.id == null || cliente.NacionalidadeCliente == "") ? "Selecione a nacionalidade do cliente" : cliente.NacionalidadeCliente.descricao}</Text>
                    </TouchableOpacity>}
                    {this.props.EmpresaLogada[0] == 8 &&
                    <TouchableOpacity style = {{borderRadius: 5}} activeOpacity = {1}
                      onPress = {() => {
                        cliente.VisibilidadeModalSexualidade = true
                        cliente.OptionSexualidade = '@cliente'
                        this.setState({Renderizar: true})
                      }}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{"Sexo"}</Text>
                      <Text
                        style = {{
                          flexDirection: 'column',
                          paddingVertical: 24,
                          paddingHorizontal: 16,
                          height: 65,
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
                      }}>{(cliente.SexoCliente.id == null || cliente.SexoCliente == "") ? "Selecione o sexo do cliente" : cliente.SexoCliente.descricao}</Text>
                    </TouchableOpacity>}
                    <TextInputEmail 
                      animated = {this.state.AnimatedEmailCliente}
                      title = {'Email'}
                      keyboardType = {'email-address'}
                      returnKeyType = {'go'}
                      autoCapitalize = {'none'}
                      id = {(ref) => {this.InputEmailCliente = ref}}
                      value = {cliente.EmailCliente}
                      onChangeText = {(value) => {
                        cliente.EmailCliente = value
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                  </>
                  }
                </ClienteView>
                {cliente.valueSwitch == true && 
                  <EstadoCivilView>
                    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                      {cliente.StatusCivil > 0 &&
                      <Icon name = {"photo-camera"} size = {24} color = {this.props.StyleGlobal.cores.background} style = {{marginTop: 9}} 
                        onPress = {() => {
                          if(cliente.FotoCertidao.base64 == null) {
                            this._tiraFoto('Estado Civil', cliente.FotoCertidao);
                            this.setState({imageurl: cliente.FotoCertidao, anexo_atual: 'Estado Civil', scrollCarouselEnabled: false});
                            this.setVisibilidadeModalAnexos(true)
                          } else if(cliente.FotoCertidao.base64 != null) {
                            this._mostraFoto('Estado Civil', cliente.FotoCertidao);
                            this.setState({anexo_atual: 'Estado Civil'});
                            this.setVisibilidadeModalAnexos(true);
                          }
                        }}/>}
                      <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginBottom: 16, marginTop: 24}}>Estado Civil</Text>
                    </View>
                    <TouchableOpacity activeOpacity = {1} 
                      onPress = {() => {
                        cliente.VisibilidadeModalEstadosCivis = true
                        this.setState({Renderizar: true})
                    }}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{"Situação atual"}</Text>
                      <Text
                        style = {{
                          flexDirection: 'column',
                          paddingVertical: 24,
                          paddingHorizontal: 16,
                          height: 65,
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
                      }}>{(cliente.StatusCivilDescricao == null || cliente.StatusCivilDescricao == "") ? 'Selecione o estado civil' : cliente.StatusCivilDescricao}</Text>
                    </TouchableOpacity>
                    {cliente.StatusCivil == 2 &&
                    <TouchableOpacity activeOpacity = {1} 
                      onPress = {() => {
                        cliente.VisibilidadeModalRegimeDeBens = true
                        this.setState({Renderizar: true})
                      }}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{"Regime de bens"}</Text>
                      <Text
                        style = {{
                          flexDirection: 'column',
                          paddingVertical: 24,
                          paddingHorizontal: 16,
                          height: 65,
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
                      }}>{(cliente.RegimeDescricao == null || cliente.RegimeDescricao == "") ? 'Selecione o regime de bens' : cliente.RegimeDescricao}</Text>
                    </TouchableOpacity>}
                  </EstadoCivilView>
                }
                {(cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && cliente.valueSwitch == true &&
                  <ConjugeView>
                    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                      {cliente.CPFConjuge != null && cliente.CPFConjuge != "" && cliente.DataConjuge != null && cliente.DataConjuge != "" && cliente.NomeConjuge != null && cliente.NomeConjuge != "" &&
                        <Icon name = {"photo-camera"} size = {24} color = {this.props.StyleGlobal.cores.background} style = {{ marginTop: 20}} 
                        onPress = {() => {
                          if(cliente.FotoIdentidadeConjuge.base64 == null) {
                            this._tiraFoto('RG do Conjugê', cliente.FotoIdentidadeConjuge);
                            this.setState({imageurl: cliente.FotoIdentidadeConjuge, anexo_atual: 'RG do Conjugê', scrollCarouselEnabled: false});
                            this.setVisibilidadeModalAnexos(true)
                          } else if(cliente.FotoIdentidadeConjuge.base64 != null) {
                            this._mostraFoto('RG do Conjugê', cliente.FotoIdentidadeConjuge);
                            this.setState({anexo_atual: 'RG do Conjugê'});
                            this.setVisibilidadeModalAnexos(true);
                          }
                        }}/>}
                      <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginTop: 24, marginBottom: 5}}>Conjuge</Text>
                    </View>
                    <View style = {{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 16}}>
                      <Switch
                        trackColor = {{false: '#CCCCCC99', true: this.props.StyleGlobal.cores.background}}
                        onValueChange = {async () => {
                          if(cliente.ValueSwitchConjuge == false)
                            {
                              cliente.ValueSwitchConjuge = true
                              await this.setState({Renderizar: true})
                            }
                            else
                            {
                              cliente.ValueSwitchConjuge = false
                              await this.setState({Renderizar: true})
                            }
                        }}
                        value = {cliente.ValueSwitchConjuge} 
                      />
                      <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: this.props.StyleGlobal.cores.background}}>Conjugê irá assinar o contrato?</Text>
                    </View>
                    <TextInputCPF 
                      title = {'Digite aqui seu CPF'}
                      keyboardType = {'numeric'}
                      returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                      id = {(ref) => {this.InputCPFConjuge = ref}}
                      value = {cliente.CPFConjuge}
                      onChangeText = {(value) => {
                        cliente.CPFConjuge = formatoDeTexto.CPF_CNPJ(value)
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {async () => {
                        if(await this.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(cliente.CPFConjuge)) == true) {
                            this.setVisibilidadeModalProcurandoDadosCliente(true)
                            await this.pegandoDadosConjugeLista(cliente.CPFConjuge, cliente.id, cliente.DataConjuge);
                        } else {
                          await Validacoes._InputCPF_CNPJConjugeLista(cliente.CPFConjuge, this.state.this, cliente.DataConjuge, cliente.id)
                        }
                      }}
                    />
                    <TextInputData
                      animated = {this.state.AnimatedDataConjuge}
                      title = {'Data de nascimento'}
                      keyboardType = {'numeric'}
                      returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                      id = {(ref) => {this.InputDataConjuge = ref}}
                      value = {cliente.DataConjuge}
                      onChangeText = {(value) => {
                        cliente.DataConjuge = formatoDeTexto.Data(value)
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                    <TextInputNome 
                      animated = {this.state.AnimatedNomeConjuge}
                      title = {'Escreva seu nome completo'}
                      returnKeyType = {'go'}
                      id = {(ref) => {this.InputNomeConjuge = ref}}
                      value = {cliente.NomeConjuge}
                      onChangeText = {(value) => {
                        cliente.NomeConjuge = value
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                    <TextInputRG
                      animated = {this.state.AnimatedEmailCliente}
                      title = {'Número do seu RG'}
                      keyboardType = {'numeric'}
                      returnKeyType = {Platform.OS === "ios" ? "done" : 'go'}
                      id = {(ref) => {this.InputRGConjuge = ref}}
                      value = {cliente.RGConjuge}
                      onChangeText = {(value) => {
                        cliente.RGConjuge = value
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                    <View style = {{flexDirection: 'row'}}>
                      <TextInputOrgaoEmissor
                        animated = {this.state.AnimatedNomeCliente}
                        estilo = {{flex: 1, marginRight: 8}}
                        title = {'Orgão Emissor'}
                        keyboardType = {'default'}
                        returnKeyType = {'go'}
                        id = {(ref) => {this.InputRGOrgaoEmissorConjuge = ref}}
                        value = {cliente.RGOrgaoEmissorConjuge}
                        onChangeText = {(value) => {
                          cliente.RGOrgaoEmissorConjuge = value
                          this.setState({Renderizar: true})
                        }}
                        onSubmitEditing = {() => {}}
                      />
                      <TouchableOpacity style = {{ borderRadius: 5}} activeOpacity = {1} 
                        onPress = {() => {
                          cliente.VisibilidadeModalUFDoRG = true
                          cliente.OptionUF = '@orgaoemissorconjuge'
                          this.setState({Renderizar: true})
                        }}>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 13,
                            color: '#677367'
                        }}>{"UF"}</Text>
                        <Text
                          style = {{
                            flexDirection: 'column',
                            paddingVertical: 24,
                            paddingHorizontal: 16,
                            height: 65,
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
                        }}>{(cliente.RGUFConjuge == null || cliente.RGUFConjuge == "") ? "XX" : cliente.RGUFConjuge}</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style = {{borderRadius: 5}} activeOpacity = {1} 
                      onPress = {() => {
                        cliente.VisibilidadeModalCargos = true
                        cliente.OptionCargos = '@conjuge'
                        this.setState({Renderizar: true})
                      }}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{"Cargo"}</Text>
                      <Text
                        style = {{
                          flexDirection: 'column',
                          paddingVertical: 24,
                          paddingHorizontal: 16,
                          height: 65,
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
                      }}>{(cliente.CargoConjuge == null || cliente.CargoConjuge == "") ? "Selecione o cargo do conjuge" : cliente.CargoConjuge}</Text>
                    </TouchableOpacity>
                    {this.props.EmpresaLogada[0] == 8 &&
                    <TextInputRenda 
                      title = {'Renda'}
                      keyboardType = {'numeric'}
                      returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                      value = {formatoDeTexto.FormatarTexto(cliente.RendaConjuge)}
                      onChangeText = {(value) => {
                        cliente.RendaConjuge = formatoDeTexto.DesformatarTexto(value)
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />}
                    {this.props.EmpresaLogada[0] == 4 &&
                    <TouchableOpacity style = {{borderRadius: 5}} activeOpacity = {1} 
                      onPress = {() => {
                        cliente.VisibilidadeModalNacionalidade = true
                        cliente.OptionNacionalidade = '@conjuge'
                        this.setState({Renderizar: true})
                      }}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{"Nacionalidade"}</Text>
                      <Text
                        style = {{
                          flexDirection: 'column',
                          paddingVertical: 24,
                          paddingHorizontal: 16,
                          height: 65,
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
                      }}>{(cliente.NacionalidadeConjuge.id == null || cliente.NacionalidadeConjuge == "") ? "Selecione a nacionalidade do conjuge" : cliente.NacionalidadeConjuge.descricao}</Text>
                    </TouchableOpacity>}
                    {this.props.EmpresaLogada[0] == 8 &&
                    <TouchableOpacity style = {{borderRadius: 5}} activeOpacity = {1} 
                      onPress = {() => {
                        cliente.VisibilidadeModalSexualidade = true
                        cliente.OptionSexualidade = '@conjuge'
                        this.setState({Renderizar: true})
                      }}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{"Sexo"}</Text>
                      <Text
                        style = {{
                          flexDirection: 'column',
                          paddingVertical: 24,
                          paddingHorizontal: 16,
                          height: 65,
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
                      }}>{(cliente.SexoConjuge.id == null || cliente.SexoConjuge == "") ? "Selecione o sexo do conjuge" : cliente.SexoConjuge.descricao}</Text>
                    </TouchableOpacity>}
                    <TextInputEmail
                      animated = {this.state.AnimatedEmailConjuge}
                      title = {'Email'}
                      keyboardType = {'email-address'}
                      returnKeyType = {'go'}
                      autoCapitalize = {'none'}
                      id = {(ref) => {this.InputEmailConjuge = ref}}
                      value = {cliente.EmailConjuge}
                      onChangeText = {(value) => {
                        cliente.EmailConjuge = value
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                  </ConjugeView>
                }
                {cliente.valueSwitch == true &&
                  <EnderecoView>
                    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                      {cliente.CEP != null && cliente.CEP != "" && cliente.Rua != null && cliente.Rua != "" && cliente.Bairro != null && cliente.Bairro != "" && cliente.Cidade != null && cliente.Cidade != "" && cliente.Estado != null && cliente.Estado != "" &&
                        <Icon name = {"photo-camera"} size = {24} color = {this.props.StyleGlobal.cores.background} style = {{ marginTop: 9}} 
                        onPress = {() => {
                          if(cliente.FotoEndereco.base64 == null) {
                            this._tiraFoto('Comprovante end.', cliente.FotoEndereco);
                            this.setState({imageurl: cliente.FotoEndereco, anexo_atual: 'Comprovante end.', scrollCarouselEnabled: false});
                            this.setVisibilidadeModalAnexos(true)
                          } else if(cliente.FotoEndereco.base64 != null) {
                            this._mostraFoto('Comprovante end.', cliente.FotoEndereco);
                            this.setState({anexo_atual: 'Comprovante end.'});
                            this.setVisibilidadeModalAnexos(true);
                          }
                        }}/>}
                      <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginBottom: 16, marginTop: 24}}>Endereço</Text>
                    </View>
                    <TextInputCEP
                      title = {'CEP'}
                      keyboardType = {'numeric'}
                      returnKeyType = {Platform.OS === "ios" ? "done" : 'search'}
                      id = {(ref) => {}}
                      value = {cliente.CEP}
                      onChangeText = {(value) => {
                        cliente.CEP = formatoDeTexto.CEP(value)
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {async () => {
                        await this.setVisibilidadeModalEndereco(true);
                        await this.pegandoDadosDoEnderecoLista(cliente.CEP, cliente.id);
                      }}
                    />
                    <TextInputLogradouro
                      animated = {this.state.AnimatedEndereco}
                      title = {'Rua'}
                      returnKeyType = {'go'}
                      id = {(ref) => {}}
                      value = {cliente.Rua}
                      onChangeText = {(value) => {
                        cliente.Rua = value
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                    <TextInputNumero
                      animated = {this.state.AnimatedEndereco}
                      title = {'Número'}
                      defaultValue = {"S/N"}
                      keyboardType = {'numeric'}
                      returnKeyType = {Platform.OS === "ios" ? "done" : 'go'}
                      id = {(ref) => {}}
                      value = {cliente.Numero}
                      onChangeText = {(value) => {
                        if(formatoDeTexto.NumeroInteiro(value.replace("S/N","")) == null || formatoDeTexto.NumeroInteiro(value.replace("S/N","")) == "NaN" ){
                          cliente.Numero = "S/N"
                          this.setState({Renderizar: true})
                        } else {
                          cliente.Numero = value.replace("S/N","")
                          this.setState({Renderizar: true})
                        }
                      }}
                      onSubmitEditing = {() => {}}
                    />
                    <TextInputComplemento 
                      animated = {this.state.AnimatedEndereco}
                      title = {'Complemento'}
                      returnKeyType = {'go'}
                      id = {(ref) => {}}
                      value = {cliente.Complemento}
                      onChangeText = {(value) => {
                        cliente.Complemento = value
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                    <TextInputBairro
                      animated = {this.state.AnimatedEndereco}
                      title = {'Bairro'}
                      returnKeyType = {'go'}
                      id = {(ref) => {}}
                      value = {cliente.Bairro}
                      onChangeText = {(value) => {
                        cliente.Bairro = value
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                    <TextInputCidade 
                      animated = {this.state.AnimatedEndereco}
                      title = {'Cidade'}
                      returnKeyType = {'go'}
                      id = {(ref) => {}}
                      value = {cliente.Cidade}
                      onChangeText = {(value) => {
                        cliente.Cidade = value
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                    <TouchableOpacity activeOpacity = {1}
                      onPress = {() => {
                        cliente.VisibilidadeModalUFDoRG = true
                        cliente.OptionUF = '@endereco'
                        this.setState({Renderizar: true})
                    }}>
                      <Text
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 13,
                          color: '#677367'
                      }}>{"Estado"}</Text>
                      <Text
                        style = {{
                          flexDirection: 'column',
                          paddingVertical: 24,
                          paddingHorizontal: 16,
                          height: 65,
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
                      }}>{(cliente.Estado == null || cliente.Estado == "") ? "Clique para selecionar o estado" : cliente.Estado}</Text>          
                    </TouchableOpacity>
                  </EnderecoView>
                }
                {cliente.valueSwitch == true &&
                  <TelefonesView>
                    <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginBottom: 16, marginTop: 24}}>Telefones</Text>
                    <TextInputTelefone
                      animated = {this.state.AnimatedTelefone}
                      title = {'Telefone'}
                      keyboardType = {'numeric'}
                      returnKeyType = {Platform.OS === "ios" ? "done" : 'go'}
                      id = {(ref) => {}}
                      value = {cliente.Telefone}
                      onChangeText = {(value)  => {
                        cliente.Telefone = formatoDeTexto.Telefone(value)
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                    <TextInputTelefone 
                      animated = {this.state.AnimatedTelefoneComercial}
                      title = {'Telefone Comercial'}
                      keyboardType = {'numeric'}
                      returnKeyType = {Platform.OS === "ios" ? "done" : 'go'}
                      id = {(ref) => {}}
                      value = {cliente.TelefoneComercial}
                      onChangeText = {(value) => {
                        cliente.TelefoneComercial = formatoDeTexto.Telefone(value)
                        this.setState({Renderizar: true})
                      }}
                      onSubmitEditing = {() => {}}
                    />
                  </TelefonesView>
                }
                <ModalEstadoCivil
                  visibilidade = {cliente.VisibilidadeModalEstadosCivis == true ? true : false}
                  keyExtractorFlatList = {item => String(item.id)}
                  renderEstadoCivil = {({ item }) => (
                    <TouchableOpacity key = {item.id} activeOpacity = {1} style = {{marginHorizontal: 8}}
                      onPress = {async () => {
                        if(item.id != cliente.StatusCivil)
                        {
                          if(item.id == 1) 
                          {
                            cliente.StatusCivil = item.id
                            cliente.StatusCivilDescricao = item.descricao
                            cliente.Regime = null
                            cliente.RegimeDescricao = null
                            cliente.VisibilidadeModalEstadosCivis = false
                            await this.setState({Renderizar: true})
                          }
                          else
                          {
                            cliente.StatusCivil = item.id
                            cliente.StatusCivilDescricao = item.descricao
                            cliente.VisibilidadeModalEstadosCivis = false
                            await this.setState({Renderizar: true})
                          }
                        }
                        else
                        {
                          cliente.VisibilidadeModalEstadosCivis = false
                          await this.setState({Renderizar: true})
                        }
                    }}>
                      <View 
                        style = {{
                          backgroundColor: item.descricao == cliente.StatusCivilDescricao ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                          paddingHorizontal: 16,
                          height: 58,
                          width: '100%',
                          marginVertical: 5,
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center"
                      }}>
                        <Text 
                          style = {{
                            paddingVertical: 0,
                            fontSize: 12,
                            color: item.descricao == cliente.StatusCivilDescricao ? '#FFFFFF' : '#262825',
                            fontWeight: item.descricao == cliente.StatusCivilDescricao ? 'bold' : 'normal',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>{item.descricao}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  dataEstadoCivil = {this.state.EstadosCivis}
                  idFlatList = {(ref) => { this.FlatListEstadoCivil = ref }}
                  onPressVisibilidade = {() => {
                    cliente.VisibilidadeModalEstadosCivis = false
                    this.setState({Renderizar: true})
                  }}
                />
                <ModalRegimeDeBens
                  visibilidade = {cliente.VisibilidadeModalRegimeDeBens == true ? true : false}
                  keyExtractorFlatList = {item => String(item.id)}
                  renderRegimeDeBens = {({ item }) => (
                    <TouchableOpacity key = {item.id} style = {{marginHorizontal: 8}}
                      onPress = {async () => {
                        if(item.id != cliente.Regime)
                        {
                          cliente.Regime = item.id
                          cliente.RegimeDescricao = item.descricao
                          cliente.VisibilidadeModalRegimeDeBens = false
                          await this.setState({Renderizar: true})
                        }
                        else
                        {
                          cliente.VisibilidadeModalRegimeDeBens = false
                          await this.setState({Renderizar: true})
                        }
                    }}>
                      <View 
                        style = {{
                          backgroundColor: item.descricao == cliente.RegimeDescricao ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                          paddingHorizontal: 16,
                          height: 58,
                          width: '100%',
                          marginVertical: 5,
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center"
                      }}>
                        <Text 
                          style = {{
                            paddingVertical: 0,
                            fontSize: 12,
                            color: item.descricao == cliente.RegimeDescricao ? '#FFFFFF' : '#262825',
                            fontWeight: item.descricao == cliente.RegimeDescricao ? 'bold' : 'normal',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>{item.descricao}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  dataRegimeDeBens = {this.state.RegimesDeBens}
                  idFlatList = {(ref) => { this.FlatListRegimeDeBens = ref }}
                  onPressVisibilidade = {() => {
                    cliente.VisibilidadeModalRegimeDeBens = false
                    this.setState({Renderizar: true})
                  }}
                />
                <ModalUFDoRG
                  visibilidade = {cliente.VisibilidadeModalUFDoRG == true ? true : false}
                  keyExtractorFlatList = {item => String(item.id)}
                  renderUFRG = {({ item }) => (
                    <TouchableOpacity key = {item.id} activeOpacity = {1} style = {{marginHorizontal: 8}}
                      onPress = {async () => {
                        if(cliente.OptionUF == '@orgaoemissorcliente')
                        {
                          if(item.id != cliente.IDRGUFCliente)
                          {
                            cliente.IDRGUFCliente = item.id
                            cliente.RGUFCliente = item.descricao
                            cliente.VisibilidadeModalUFDoRG = false
                            await this.setState({Renderizar: true})
                          }
                          else
                          {
                            cliente.VisibilidadeModalUFDoRG = false
                            await this.setState({Renderizar: true})
                          }
                        }
                        else if (cliente.OptionUF == '@orgaoemissorconjuge')
                        {
                          if(item.id != cliente.IDRGUFConjuge)
                          {
                            cliente.IDRGUFConjuge = item.id
                            cliente.RGUFConjuge = item.descricao
                            cliente.VisibilidadeModalUFDoRG = false
                            await this.setState({Renderizar: true})
                          }
                          else
                          {
                            cliente.VisibilidadeModalUFDoRG = false
                            await this.setState({Renderizar: true})
                          }
                        }
                        else if (cliente.OptionUF == '@endereco')
                        {
                          if(item.id != cliente.IDEstado)
                          {
                            cliente.IDEstado = item.id
                            cliente.Estado = item.descricao
                            cliente.VisibilidadeModalUFDoRG = false
                            await this.setState({Renderizar: true})
                          }
                          else
                          {
                            cliente.VisibilidadeModalUFDoRG = false
                            await this.setState({Renderizar: true})
                          }
                        }
                    }}>
                      {cliente.OptionUF == '@orgaoemissorcliente' &&
                      <View 
                        style = {{
                          backgroundColor: item.descricao == cliente.RGUFCliente ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                          paddingHorizontal: 16,
                          height: 58,
                          width: '100%',
                          marginVertical: 5,
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center"
                      }}>
                        <Text 
                          style = {{
                            paddingVertical: 0,
                            fontSize: 13,
                            color: (item.descricao == cliente.RGUFCliente) ? "#FFFFFF" : '#262825',
                            fontWeight: (item.descricao == cliente.RGUFCliente) ? 'bold' : 'normal',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>{item.descricao}</Text>
                      </View>}
                      {cliente.OptionUF == '@orgaoemissorconjuge' &&
                      <View 
                        style = {{
                          backgroundColor: item.descricao == cliente.RGUFConjuge ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                          paddingHorizontal: 16,
                          height: 58,
                          width: '100%',
                          marginVertical: 5,
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center"
                      }}>
                        <Text 
                          style = {{
                            paddingVertical: 0,
                            fontSize: 13,
                            color: (item.descricao == cliente.RGUFConjuge) ? '#FFFFFF' : '#262825',
                            fontWeight: (item.descricao == cliente.RGUFConjuge) ? 'bold' : 'normal',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>{item.descricao}</Text>
                      </View>}
                      {cliente.OptionUF == '@endereco' &&
                      <View 
                        style = {{
                          backgroundColor: item.descricao == cliente.Estado ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                          paddingHorizontal: 16,
                          height: 58,
                          width: '100%',
                          marginVertical: 5,
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center"
                      }}>
                        <Text 
                          style = {{
                            paddingVertical: 0,
                            fontSize: 13,
                            color: (item.descricao == cliente.Estado) ? '#FFFFFF' : '#262825',
                            fontWeight: (item.descricao == cliente.Estado) ? 'bold' : 'normal',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>{item.descricao}</Text>
                      </View>}
                    </TouchableOpacity>
                  )}
                  dataUFRG = {this.state.EstadosUF}
                  idFlatList = {(ref) => { this.FlatListUFRG = ref }}
                  onPressVisibilidade = {() => {
                    cliente.VisibilidadeModalUFDoRG = false
                    this.setState({Renderizar: true})
                  }}
                />
                <ModalCargos
                  visibilidade = {cliente.VisibilidadeModalCargos == true ? true : false}
                  keyExtractorFlatList = {item => String(item.id)}
                  renderCargos = {({ item }) => (
                    <TouchableOpacity key = {item.id} style = {{marginHorizontal: 8}}
                      onPress = {async () => {
                        if(cliente.OptionCargos == '@cliente') 
                        {
                          cliente.CargoCliente = item.nome
                          cliente.IDCargoCliente = item.id
                          cliente.OcupacaoCliente = {"id": item.id, "cargo": item.cargo, "nome": item.nome}
                          cliente.VisibilidadeModalCargos = false
                          this.setState({Renderizar: true})
                        }
                        else if (cliente.OptionCargos == '@conjuge')
                        {
                          cliente.CargoConjuge = item.nome
                          cliente.IDCargoConjuge = item.id
                          cliente.OcupacaoConjuge = {"id": item.id, "cargo": item.cargo, "nome": item.nome}
                          cliente.VisibilidadeModalCargos = false
                          this.setState({Renderizar: true})
                        }
                    }}>
                      {cliente.OptionCargos == '@cliente' &&
                      <View 
                        style = {{
                          backgroundColor: item.id == cliente.IDCargoCliente ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                          paddingHorizontal: 16,
                          height: 58,
                          width: '100%',
                          marginVertical: 5,
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center"
                      }}>
                        <Text 
                          style = {{
                            paddingVertical: 0,
                            fontSize: 12,
                            color: item.id == cliente.IDCargoCliente ? "#FFFFFF" : '#262825',
                            fontWeight: item.id == cliente.IDCargoCliente ? 'bold' : 'normal',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>{item.nome}</Text> 
                      </View>}
                      {cliente.OptionCargos == '@conjuge' &&
                      <View 
                        style = {{
                          backgroundColor: item.id == cliente.IDCargoConjuge ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                          paddingHorizontal: 16,
                          height: 58,
                          width: '100%',
                          marginVertical: 5,
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center"
                      }}>
                        <Text 
                          style = {{
                            paddingVertical: 0,
                            fontSize: 12,
                            color: item.id == cliente.IDCargoConjuge ? "#FFFFFF" : '#262825',
                            fontWeight: item.id == cliente.IDCargoConjuge ? 'bold' : 'normal',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>{item.nome}</Text>
                      </View>}
                    </TouchableOpacity>
                  )}
                  filteredCargos= {filteredCargos}
                  idFlatList = {(ref) => { this.FlatListCargos = ref }}
                  onChangeSearch = {(term) => {this.searchUpdateCargos(term)}}
                  onPressVisibilidade = {() => {
                    cliente.VisibilidadeModalCargos = false
                    this.setState({Renderizar: true})
                  }}
                  onScroll = {(e) => {}}
                  onlayout = {async (e) => {}}
                />
                <ModalNacionalidade
                  visibilidade = {cliente.VisibilidadeModalNacionalidade == true ? true : false}
                  keyExtractorFlatList = {item => String(item.id)}
                  renderNacionalidade = {({ item }) => (
                    <TouchableOpacity key = {item.id} style = {{marginHorizontal: 8}}
                      onPress = {async () => {
                        if(cliente.OptionNacionalidade == '@cliente') 
                        {
                          cliente.NacionalidadeCliente = item
                          cliente.VisibilidadeModalNacionalidade = false
                          this.setState({Renderizar: true})
                        }
                        else if (cliente.OptionNacionalidade == '@conjuge')
                        {
                          cliente.NacionalidadeConjuge = item
                          cliente.VisibilidadeModalNacionalidade = false
                          this.setState({Renderizar: true})
                        }
                    }}>
                      {cliente.OptionNacionalidade == '@cliente' &&
                      <View 
                        style = {{
                          backgroundColor: item.id == cliente.NacionalidadeCliente.id ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                          paddingHorizontal: 16,
                          height: 58,
                          width: '100%',
                          marginVertical: 5,
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center"
                      }}>
                        <Text 
                          style = {{
                            paddingVertical: 0,
                            fontSize: 12,
                            color: item.id == cliente.NacionalidadeCliente.id ? '#FFFFFF' : '#262825',
                            fontWeight: item.id == cliente.NacionalidadeCliente.id ? 'bold' : 'normal',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>{item.descricao}</Text> 
                      </View>}
                      {cliente.OptionNacionalidade == '@conjuge' &&
                      <View 
                        style = {{
                          backgroundColor: item.id == cliente.NacionalidadeConjuge.id ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                          paddingHorizontal: 16,
                          height: 58,
                          width: '100%',
                          marginVertical: 5,
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center"
                      }}>
                        <Text 
                          style = {{
                            paddingVertical: 0,
                            fontSize: 12,
                            color: item.id == cliente.NacionalidadeConjuge.id ? '#FFFFFF' : '#262825',
                            fontWeight: item.id == cliente.NacionalidadeConjuge.id ? 'bold' : 'normal',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>{item.descricao}</Text>
                      </View>}
                    </TouchableOpacity>
                  )}
                  filteredNacionalidade= {filteredNacionalidade}
                  idFlatList = {(ref) => { this.FlatListNacionalidade = ref }}
                  onChangeSearch = {(term) => {this.searchUpdateNacionalidade(term)}}
                  onPressVisibilidade = {() => {
                    cliente.VisibilidadeModalNacionalidade = false
                    this.setState({Renderizar: true})
                  }}
                  onScroll = {(e) => {}}
                  onlayout = {async (e) => {}}
                />
                <ModalSexualidade
                  visibilidade = {cliente.VisibilidadeModalSexualidade == true ? true : false}
                  keyExtractorFlatList = {item => String(item.id)}
                  renderSexualidade = {({ item }) => (
                    <TouchableOpacity key = {item.id} style = {{marginHorizontal: 8}}
                      onPress = {async () => {
                        if(cliente.OptionSexualidade == '@cliente') 
                        {
                          cliente.SexoCliente = item
                          cliente.VisibilidadeModalSexualidade = false
                          this.setState({Renderizar: true})
                        }
                        else if (cliente.OptionSexualidade == '@conjuge')
                        {
                          cliente.SexoConjuge = item
                          cliente.VisibilidadeModalSexualidade = false
                          this.setState({Renderizar: true})
                        }
                    }}>
                      {cliente.OptionSexualidade == '@cliente' &&
                      <View 
                        style = {{
                          backgroundColor: item.id == cliente.SexoCliente.id ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                          paddingHorizontal: 16,
                          height: 58,
                          width: '100%',
                          marginVertical: 5,
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center"
                      }}>
                        <Text 
                          style = {{
                            paddingVertical: 0,
                            fontSize: 12,
                            color: item.id == cliente.SexoCliente.id ? '#FFFFFF' : '#262825',
                            fontWeight: item.id == cliente.SexoCliente.id ? 'bold' : 'normal',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>{item.descricao}</Text> 
                      </View>}
                      {cliente.OptionSexualidade == '@conjuge' &&
                      <View 
                        style = {{
                          backgroundColor: item.id == cliente.SexoConjuge.id ? this.props.StyleGlobal.cores.background : '#FFFFFF',
                          paddingHorizontal: 16,
                          height: 58,
                          width: '100%',
                          marginVertical: 5,
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)',
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center"
                      }}>
                        <Text 
                          style = {{
                            paddingVertical: 0,
                            fontSize: 12,
                            color: item.id == cliente.SexoConjuge.id ? '#FFFFFF' : '#262825',
                            fontWeight: item.id == cliente.SexoConjuge.id ? 'bold' : 'normal',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}>{item.descricao}</Text>
                      </View>}
                    </TouchableOpacity>
                  )}
                  filteredSexualidade = {filteredSexualidades}
                  idFlatList = {(ref) => { this.FlatListSexualidade = ref }}
                  onChangeSearch = {(term) => {this.searchUpdateSexualidade(term)}}
                  onPressVisibilidade = {() => {
                    cliente.VisibilidadeModalSexualidade = false
                    this.setState({Renderizar: true})
                  }}
                  onScroll = {(e) => {}}
                  onlayout = {async (e) => {}}
                />
              </>
            ))}
          </View>
          <View 
            style = {{
              paddingHorizontal: 24, 
              flexDirection: 'row'
          }}>
            <TouchableOpacity // Anexos
              style = {{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: this.props.StyleGlobal.cores.background,
                paddingHorizontal: 16,
                height: 58,
                alignItems: 'center',
                justifyContent: "center",
                marginBottom: 20,
                marginRight: 20,
                borderRadius: 5
            }}
              onPress = {this.acessandoListaDeAnexos}>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 16,
                  textAlign: 'center',
                  color: this.props.StyleGlobal.cores.background,
                  alignSelf: 'center',
              }}>Anexos</Text>
            </TouchableOpacity>
            <TouchableOpacity // Avançar
              style = {{
                flex: 1,
                backgroundColor: this.props.StyleGlobal.cores.background,
                paddingHorizontal: 16,
                height: 58,
                alignItems: 'center',
                justifyContent: "center",
                marginBottom: 20,
                borderRadius: 5,
                borderWidth: 1,
            }}
              onPress = {() => {this.prosseguirTelaQuadroResumo()}}>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#FFFFFF',
                  alignSelf: 'center',
              }}>Avançar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </>}
      </Container>
      </KeyboardAvoidingView>
    );
  }
  //#endregion

  //#region Controller

  //#region Carregando dados dos leads
  carregandoLead = async () => {
    const Lead = (this.props.Lead)[0]
    if (Lead != 'null' && Lead != null && Lead != "") {
      if(Lead.nome != null && Lead.nome != "") {
        await this.setState({NomeCliente: Lead.nome})
      }
      if(Lead.emails != null && Lead.emails != "") {
        await this.setState({EmailCliente: Lead.emails[0].descricao})
      }
      if(Lead.telefones != "" && Lead.telefones != null) {
        if ((Lead.telefones).length == 1) {
          if(Lead.telefones.find(telefone => telefone.classificacao == 1) != "") {
            const telefonePrincipal = await Lead.telefones.find(telefone => telefone.classificacao == 1)
            await this.setState({Telefone: formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero)});
          }
        } else if ((Lead.telefones).length >= 2) {
          if (Lead.telefones.find(telefone => telefone.classificacao == 1) != "") {
            const telefonePrincipal = await Lead.telefones.find(telefone => telefone.classificacao == 1)
            await this.setState({Telefone: formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero)});
          }
          if (Lead.telefones.find(telefone => telefone.classificacao == 3) != "") {
            const telefoneRecado = await Lead.telefones.find(telefone => telefone.classificacao == 3)
            await this.setState({TelefoneComercial: formatoDeTexto.Telefone(telefoneRecado.ddd + telefoneRecado.numero)})
          }
        }
      }
    }
  }
  //#endregion

  //#region Consultando o CPF do cliente na receita federal
  consultaReceitaFederal = async () => {
    if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11){
      if(formatoDeTexto.DataAPI(this.state.DataCliente) != null && formatoDeTexto.DataAPI(this.state.DataCliente).length == 10){
        const response = await ReceitaFederal.Consulta_CPF(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente), formatoDeTexto.DataAPI(this.state.DataCliente))
        if(response != null && response != undefined && response != "")
        {
          await this.setState({NomeCliente: response.nome_da_pf});
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
        else
        {
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
      }
    }
    else {
      if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 14){
        const response = await ReceitaFederal.Consulta_CNPJ(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente), this.responseconsultaCNPJ)
        if(response != null && response != undefined && response != "")
        {
          await this.setState({DataCliente: response.abertura, NomeCliente: response.nome});
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
        else
        {
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
      }
    }

    // Dados do Conjuge

    if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge).length == 11){
      if(formatoDeTexto.DataAPI(this.state.CPFConjuge) != null && formatoDeTexto.DataAPI(this.state.DataConjuge).length == 10){
        const response = await ReceitaFederal.Consulta_CPF(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge), formatoDeTexto.DataAPI(this.state.DataConjuge))
        if(response != null && response != undefined && response != "")
        {
          await this.setState({NomeConjuge: response.nome_da_pf});
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
        else
        {
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
      }
    }
  }
  //#endregion

  //#region Consultando o CPF do cliente no banco de dados
  pegandoDadosCliente = async () => {
    if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11) {
      const response = await Pessoa.localizar(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente))

      if (response != null && response != undefined && response != "")
      {
        if (response.id != null) {
          await this.setState({ID_cliente: response.id});
        }
        if (response.cpf != null) {
          await this.setState({CPFCliente: formatoDeTexto.CPF_CNPJ(response.cpf)})
        }
        if (response.dataDeNascimento != null) {
          const data = response.dataDeNascimento
          const newdata = data.split('T')[0]
          await this.setState({DataCliente: moment(newdata, 'YYYY-MM-DD', true).format('DD/MM/YYYY')})
        }
        if (response.nome != null) {
          await this.setState({NomeCliente: response.nome})
        }
        if (response.rg != null) {
          const dadosrg = response.rg
          await this.setState({RGCliente: dadosrg.numero})
          await this.setState({RGOrgaoEmissorCliente: dadosrg.orgaoEmissor})
          await this.setState({RGUFCliente: dadosrg.uf})
        }
        if (response.emails != null && response.emails != "") {
          await this.setState({EmailCliente: response.emails[0].descricao, EmailsClienteExiste: true, emails_existentes: response.emails})
        }
        if (response.estadoCivil != null) {
          await this.setState({StatusCivil: response.estadoCivil});
          this.state.EstadosCivis.map(async situacao => {
            if(situacao.id == this.state.StatusCivil)
            {
              await this.setState({StatusCivilDescricao: situacao.descricao})
            }
          })
          if(this.state.StatusCivil == 2) {
            if(this.state.RegimesDeBens != "") {
              if(response.regimeDeBens != null) {
                await this.setState({regime: response.regimeDeBens})
                this.state.RegimesDeBens.map(async regime => {
                  if(regime.id == this.state.Regime)
                  {
                    await this.setState({RegimeDescricao: regime.descricao})
                  }
                })
              }
            }
          }
        }
        if (response.conjuge != null) {
          const dadosconjuge = response.conjuge;
          if (dadosconjuge.id != null) {
            await this.setState({ID_conjuge: dadosconjuge.id});
          }
          if (dadosconjuge.cpf != null) {
            await this.setState({CPFConjuge: formatoDeTexto.CPF_CNPJ(dadosconjuge.cpf)})
          }
          if (dadosconjuge.dataDeNascimento != null) {
            const data = dadosconjuge.dataDeNascimento
            const newdata = data.split('T')[0]
            await this.setState({DataConjuge: moment(newdata, 'YYYY-MM-DD', true).format('DD/MM/YYYY')})
          }
          if (dadosconjuge.nome != null) {
            await this.setState({NomeConjuge: dadosconjuge.nome})
          }
          if (dadosconjuge.emails != null && dadosconjuge.emails != "") {
            await this.setState({EmailConjuge: dadosconjuge.emails[0].descricao, EmailsConjugeExiste: true, emails_Conjuge_existentes: dadosconjuge.emails})
          }
          if (dadosconjuge.documentoPessoal != null) {
              await this.setState({DocumentoConjugeRGExiste: true})
              var dadosImage = `data:image/${dadosconjuge.documentoPessoal.extensao};base64,${dadosconjuge.documentoPessoal.arquivo}`
              this.state.FotoIdentidadeConjuge = {
                "id": "RG do Conjugê",
                "habilitar_camera": false,
                "base64": dadosconjuge.documentoPessoal.arquivo,
                "deviceOrientation": 1,            
                "height": Dimensions.get('window').height,
                "pictureOrientation": 1,
                "uri": dadosImage,
                "width": Dimensions.get('window').width,
                "extensao": dadosconjuge.documentoPessoal.extensao,
                "isPDF": false
              }
          }
        }
        if (response.endereco != null) {
          await this.setState({EnderecoClienteExiste: true});
          const endereco = response.endereco;
          if(endereco.logradouro != null) {
            await this.setState({Rua: endereco.logradouro});
          }
          if(endereco.numero != null) {
            await this.setState({Numero: endereco.numero});
          }
          if(endereco.complemento != null) {
            await this.setState({Complemento: endereco.complemento});
          }
          if(endereco.bairro != null) {
            await this.setState({Bairro: endereco.bairro});
          }
          if(endereco.cidade != null) {
            await this.setState({Cidade: endereco.cidade});
          }
          if(endereco.uf != null) {
            await this.setState({Estado: endereco.uf});
          }
          if(endereco.cep != null) {
            await this.setState({CEP: formatoDeTexto.CEP(endereco.cep)});
          }
        }
        if (response.telefones != "" && response.telefones != null) {

          response.telefones = await (response.telefones).filter((data) => data != null)

          await this.setState({TelefonesClienteExiste: true, Telefones_existentes: response.telefones});
          if((response.telefones).length == 1) {
            if(response.cpf != null && (response.cpf).length == 11) {
              if(response.telefones.find(telefone => telefone.classificacao == 1) != "") {
                const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 1)
                await this.setState({Telefone: formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero), TelefonePrincipalExiste: true});
              }
            } else if (response.cpf != null && (response.cpf).length == 14) {
              if(response.telefones.find(telefone => telefone.classificacao == 2) != "") {
                const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 2)
                await this.setState({Telefone: formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero), TelefonePrincipalExiste: true});
              }
            }
          } else if ((response.telefones).length >= 2) {
              if(response.cpf != null && (response.cpf).length == 11) {
                if(response.telefones.find(telefone => telefone.classificacao == 1) != "") {
                  const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 1)
                  await this.setState({Telefone: formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero), TelefonePrincipalExiste: true});
                }
                if(response.telefones.find(telefone => telefone.classificacao == 3) != "") {
                  const telefoneRecado = await response.telefones.find(telefone => telefone.classificacao == 3)
                  await this.setState({TelefoneComercial: formatoDeTexto.Telefone(telefoneRecado.ddd + telefoneRecado.numero), TelefoneRecadoExiste: true});
                }
              } else if (response.cpf != null && (response.cpf).length == 14) {
                  if(response.telefones.find(telefone => telefone.classificacao == 2) != "") {
                    const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 2)
                    await this.setState({Telefone: formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero), TelefonePrincipalExiste: true});
                  }
                  if(response.telefones.find(telefone => telefone.classificacao == 3) != "") {
                    const telefoneRecado = await response.telefones.find(telefone => telefone.classificacao == 3)
                    await this.setState({TelefoneComercial: formatoDeTexto.Telefone(telefoneRecado.ddd + telefoneRecado.numero), TelefoneRecadoExiste: true});
                  }
              }
          }
        }
        if (response.documentoPessoal != null) {
            await this.setState({DocumentoClienteRGExiste: true});
            var dadosImage = `data:image/${response.documentoPessoal.extensao};base64,${response.documentoPessoal.arquivo}`
            this.state.FotoIdentidade = {
              "id": "RG",
              "habilitar_camera": false,
              "base64": response.documentoPessoal.arquivo,
              "deviceOrientation": 1,            
              "height": Dimensions.get('window').height,
              "pictureOrientation": 1,
              "uri": dadosImage,
              "width": Dimensions.get('window').width,
              "extensao": response.documentoPessoal.extensao,
              "isPDF": false
            }
        }
        if (response.documentoDeEstadoCivil != null) {
          await this.setState({DocumentoClienteCertidaoExiste: true});
            var dadosImage = `data:image/${response.documentoDeEstadoCivil.extensao};base64,${response.documentoDeEstadoCivil.arquivo}`
            this.state.FotoCertidao = {
              "id": "Estado Civil",
              "habilitar_camera": false,
              "base64": response.documentoDeEstadoCivil.arquivo,
              "deviceOrientation": 1,            
              "height": Dimensions.get('window').height,
              "pictureOrientation": 1,
              "uri": dadosImage,
              "width": Dimensions.get('window').width,
              "extensao": response.documentoDeEstadoCivil.extensao,
              "isPDF": false
            }
        }
        if (response.documentoEndereco != null) {
          await this.setState({DocumentoClienteEnderecoExiste: true});
          var dadosImage = `data:image/${response.documentoEndereco.extensao};base64,${response.documentoEndereco.arquivo}`
          this.state.FotoEndereco = {
            "id": "Comprovante end.",
            "habilitar_camera": false,
            "base64": response.documentoEndereco.arquivo,
            "deviceOrientation": 1,            
            "height": Dimensions.get('window').height,
            "pictureOrientation": 1,
            "uri": dadosImage,
            "width": Dimensions.get('window').width,
            "extensao": response.documentoEndereco.extensao,
            "isPDF": false
          }
        }
        this.setVisibilidadeModalProcurandoDadosCliente(false)
      }
      else
      {
        await Validacoes._InputCPF_CNPJ(this.state.CPFCliente, this.state.this)
        if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11) {
          this.setVisibilidadeModalProcurandoDadosCliente(false)
        } else if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 14) {
          this.setVisibilidadeModalProcurandoDadosCliente(false)
        }
        await this.setVisibilidadeModalProcurandoDadosCliente(false)
      }
    } else if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 14) {
      const response = await Pessoa.localizar(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente))
      if (response != null && response != undefined && response != "")
      {
        if (response.id != null) {
          await this.setState({ID_cliente: response.id});
        }
        if (response.cpf != null) {
          await this.setState({CPFCliente: formatoDeTexto.CPF_CNPJ(response.cpf)})
        }
        if (response.dataDeNascimento != null) {
          const data = response.dataDeNascimento
          const newdata = data.split('T')[0]
          await this.setState({DataCliente: moment(newdata, 'YYYY-MM-DD', true).format('DD/MM/YYYY')})
        }
        if (response.nome != null) {
          await this.setState({NomeCliente: response.nome})
        }
        if (response.emails != null && response.emails != "") {
          await this.setState({EmailCliente: response.emails[0].descricao, EmailsClienteExiste: true, emails_existentes: response.emails})
        }
        if (response.estadoCivil != null) {
          await this.setState({StatusCivil: response.estadoCivil});
          this.state.EstadosCivis.map(async situacao => {
            if(situacao.id == this.state.StatusCivil)
            {
              await this.setState({StatusCivilDescricao: situacao.descricao})
            }
          })
          if(this.state.StatusCivil == 2) {
            if(this.state.RegimesDeBens != "") {
              if(response.regimeDeBens != null) {
                await this.setState({regime: response.regimeDeBens})
              }
            }
          }
        }
        if (response.conjuge != null) {
          const dadosconjuge = response.conjuge;
          if (dadosconjuge.id != null) {
            await this.setState({ID_conjuge: dadosconjuge.id});
          }
          if (dadosconjuge.cpf != null) {
            await this.setState({CPFConjuge: formatoDeTexto.CPF_CNPJ(dadosconjuge.cpf)})
          }
          if (dadosconjuge.dataDeNascimento != null) {
            const data = dadosconjuge.dataDeNascimento
            const newdata = data.split('T')[0]
            await this.setState({DataConjuge: moment(newdata, 'YYYY-MM-DD', true).format('DD/MM/YYYY')})
          }
          if (dadosconjuge.nome != null) {
            await this.setState({NomeConjuge: dadosconjuge.nome})
          }
          if (dadosconjuge.emails != null && dadosconjuge.emails != "") {
            await this.setState({EmailConjuge: dadosconjuge.emails[0].descricao, EmailsConjugeExiste: true, emails_Conjuge_existentes: dadosconjuge.emails})
          }
          if (dadosconjuge.documentoPessoal != null) {
              await this.setState({DocumentoConjugeRGExiste: true})
              var dadosImage = `data:image/${dadosconjuge.documentoPessoal.extensao};base64,${dadosconjuge.documentoPessoal.arquivo}`
              this.state.FotoIdentidadeConjuge = {
                "id": "RG do Conjugê",
                "habilitar_camera": false,
                "base64": dadosconjuge.documentoPessoal.arquivo,
                "deviceOrientation": 1,            
                "height": Dimensions.get('window').height,
                "pictureOrientation": 1,
                "uri": dadosImage,
                "width": Dimensions.get('window').width,
                "extensao": dadosconjuge.documentoPessoal.extensao,
              }
          }
        }
        if (response.endereco != null) {
          await this.setState({EnderecoClienteExiste: true});
          const endereco = response.endereco;
          if(endereco.logradouro != null) {
            await this.setState({Rua: endereco.logradouro});
          }
          if(endereco.numero != null) {
            await this.setState({Numero: endereco.numero});
          }
          if(endereco.complemento != null) {
            await this.setState({Complemento: endereco.complemento});
          }
          if(endereco.bairro != null) {
            await this.setState({Bairro: endereco.bairro});
          }
          if(endereco.cidade != null) {
            await this.setState({Cidade: endereco.cidade});
          }
          if(endereco.uf != null) {
            await this.setState({Estado: endereco.uf});
          }
          if(endereco.cep != null) {
            await this.setState({CEP: formatoDeTexto.CEP(endereco.cep)});
          }
        }
        if (response.telefones != "" && response.telefones != null) {
          await this.setState({TelefonesClienteExiste: true, Telefones_existentes: response.telefones});
          if((response.telefones).length == 1) {
            if(response.cpf != null && (response.cpf).length == 11) {
              if(response.telefones.find(telefone => telefone.classificacao == 1) != "") {
                const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 1)
                await this.setState({Telefone: formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero), TelefonePrincipalExiste: true});
              }
            } else if (response.cpf != null && (response.cpf).length == 14) {
                if(response.telefones.find(telefone => telefone.classificacao == 2) != "") {
                  const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 2)
                  await this.setState({Telefone: formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero), TelefonePrincipalExiste: true});
                }
            }
          } else if ((response.telefones).length >= 2) {
              if(response.cpf != null && (response.cpf).length == 11) {
                if(response.telefones.find(telefone => telefone.classificacao == 1) != "") {
                  const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 1)
                  await this.setState({Telefone: formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero), TelefonePrincipalExiste: true});
                }
                if(response.telefones.find(telefone => telefone.classificacao == 3) != "") {
                  const telefoneRecado = await response.telefones.find(telefone => telefone.classificacao == 3)
                  await this.setState({TelefoneComercial: formatoDeTexto.Telefone(telefoneRecado.ddd + telefoneRecado.numero), TelefoneRecadoExiste: true});
                }
              } else if (response.cpf != null && (response.cpf).length == 14) {
                  if(response.telefones.find(telefone => telefone.classificacao == 2) != "") {
                    const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 2)
                    await this.setState({Telefone: formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero), TelefonePrincipalExiste: true});
                  }
                  if(response.telefones.find(telefone => telefone.classificacao == 3) != "") {
                    const telefoneRecado = await response.telefones.find(telefone => telefone.classificacao == 3)
                    await this.setState({TelefoneComercial: formatoDeTexto.Telefone(telefoneRecado.ddd + telefoneRecado.numero), TelefoneRecadoExiste: true});
                  }
              }
          }
        }
        if (response.documentoPessoal != null) {
            await this.setState({DocumentoClienteRGExiste: true});
            var dadosImage = `data:image/${response.documentoPessoal.extensao};base64,${response.documentoPessoal.arquivo}`
            this.state.FotoIdentidade = {
              "id": "RG",
              "habilitar_camera": false,
              "base64": response.documentoPessoal.arquivo,
              "deviceOrientation": 1,            
              "height": Dimensions.get('window').height,
              "pictureOrientation": 1,
              "uri": dadosImage,
              "width": Dimensions.get('window').width,
              "extensao": response.documentoPessoal.extensao,
              "isPDF": false
            }
        }
        if (response.documentoDeEstadoCivil != null) {
          await this.setState({DocumentoClienteCertidaoExiste: true});
            var dadosImage = `data:image/${response.documentoDeEstadoCivil.extensao};base64,${response.documentoDeEstadoCivil.arquivo}`
            this.state.FotoCertidao = {
              "id": "Estado Civil",
              "habilitar_camera": false,
              "base64": response.documentoDeEstadoCivil.arquivo,
              "deviceOrientation": 1,            
              "height": Dimensions.get('window').height,
              "pictureOrientation": 1,
              "uri": dadosImage,
              "width": Dimensions.get('window').width,
              "extensao": response.documentoDeEstadoCivil.extensao,
              "isPDF": false
            }
        }
        if (response.documentoEndereco != null) {
          await this.setState({DocumentoClienteEnderecoExiste: true});
          var dadosImage = `data:image/${response.documentoEndereco.extensao};base64,${response.documentoEndereco.arquivo}`
          this.state.FotoEndereco = {
            "id": "Comprovante end.",
            "habilitar_camera": false,
            "base64": response.documentoEndereco.arquivo,
            "deviceOrientation": 1,            
            "height": Dimensions.get('window').height,
            "pictureOrientation": 1,
            "uri": dadosImage,
            "width": Dimensions.get('window').width,
            "extensao": response.documentoEndereco.extensao,
            "isPDF": false
          }
        }
        this.setVisibilidadeModalProcurandoDadosCliente(false)
      }
      else
      {
        await Validacoes._InputCPF_CNPJ(this.state.CPFCliente, this.state.this)
        if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11) {
          this.setVisibilidadeModalProcurandoDadosCliente(false)
        } else if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 14) {
          this.setVisibilidadeModalProcurandoDadosCliente(false)
        }    
        await this.setVisibilidadeModalProcurandoDadosCliente(false)
      }
    }
  }
  //#endregion

  //#region Consultando o CPF do conjuge no banco de dados
  pegandoDadosConjuge = async () => {
    const response = await Pessoa.localizar(this.props.token[0].token, formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge))
    if (response != null && response != undefined && response != "")
    {
      if (response.id != null) {
        await this.setState({ID_conjuge: response.id});
      }
      if (response.cpf != null) {
        await this.setState({CPFConjuge: formatoDeTexto.CPF_CNPJ(response.cpf)})
      }
      if (response.dataDeNascimento != null) {
        const data = response.dataDeNascimento
        const newdata = data.split('T')[0]
        await this.setState({DataConjuge: moment(newdata, 'YYYY-MM-DD', true).format('DD/MM/YYYY')})
      }
      if (response.nome != null) {
        await this.setState({NomeConjuge: response.nome})
      }
      if (response.emails != null && response.emails != "") {
        await this.setState({EmailConjuge: response.emails[0].descricao, EmailsConjugeExiste: true, emails_Conjuge_existentes: response.emails})
      }
      if (response.rg != null) {
        const dadosrg = response.rg
        await this.setState({RGConjuge: dadosrg.numero})
        await this.setState({RGOrgaoEmissorConjuge: dadosrg.orgaoEmissor})
        await this.setState({RGUFConjuge: dadosrg.uf})
      }
      if (response.documentoPessoal != null) {
          await this.setState({DocumentoConjugeRGExiste: true})
          var dadosImage = `data:image/${response.documentoPessoal.extensao};base64,${response.documentoPessoal.arquivo}`
          this.state.FotoIdentidadeConjuge = {
            "id": "RG do Conjugê",
            "habilitar_camera": false,
            "base64": response.documentoPessoal.arquivo,
            "deviceOrientation": 1,            
            "height": Dimensions.get('window').height,
            "pictureOrientation": 1,
            "uri": dadosImage,
            "width": Dimensions.get('window').width,
            "extensao": response.documentoPessoal.extensao,
            "isPDF": false
          }
      }
      this.setVisibilidadeModalProcurandoDadosCliente(false) 
    }
    else
    {
      await Validacoes._InputCPF_CNPJConjuge(this.state.CPFConjuge, this.state.this, this.state)
      this.setVisibilidadeModalProcurandoDadosCliente(false)
    }
  }
  //#endregion

  //#region Consultando o CPF do cliente da lista na receita federal
  consultaReceitaFederalLista = async (CPF, Data, IDCliente) => {
    if(formatoDeTexto.CPF_CNPJOriginal(CPF) != null && formatoDeTexto.CPF_CNPJOriginal(CPF).length == 11){
      if(formatoDeTexto.DataAPI(Data) != null && formatoDeTexto.DataAPI(Data).length == 10){
        const response = await ReceitaFederal.Consulta_CPF(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(CPF), formatoDeTexto.DataAPI(Data))
        if(response != null && response != undefined && response != "")
        {
          this.state.Clientes.map(cliente => {
            if (cliente.id == IDCliente)
            {
              cliente.NomeCliente = response.nome_da_pf
            }
          })
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
        else
        {
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
      }
    }
    else {
      if(formatoDeTexto.CPF_CNPJOriginal(CPF) != null && formatoDeTexto.CPF_CNPJOriginal(CPF).length == 14){
        const response = await ReceitaFederal.Consulta_CNPJ(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(CPF))
        if(response != null && response != undefined && response != "")
        {
          this.state.Clientes.map(cliente => {
            if(cliente.id = IDCliente)
            {
              cliente.DataCliente = response.abertura
              cliente.NomeCliente = response.nome
            }
          })
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
        else
        {
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
      }
    }
  }
  //#endregion

  //#region Consultando o CPF do conjuge da lista na receita federal
  consultaReceitaFederalConjugeLista = async (CPF, Data, IDCliente) => {
    if(formatoDeTexto.CPF_CNPJOriginal(CPF) != null && formatoDeTexto.CPF_CNPJOriginal(CPF).length == 11){
      if(formatoDeTexto.DataAPI(Data) != null && formatoDeTexto.DataAPI(Data).length == 10){
        const response = await ReceitaFederal.Consulta_CPF(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(CPF), formatoDeTexto.DataAPI(Data))
        if(response != null && response != undefined && response != "")
        {
          this.state.Clientes.map(cliente => {
            if (cliente.id == IDCliente)
            {
              cliente.NomeConjuge = response.nome_da_pf
            }
          })
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
        else
        {
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
      }
    }
    else {
      if(formatoDeTexto.CPF_CNPJOriginal(CPF) != null && formatoDeTexto.CPF_CNPJOriginal(CPF).length == 14){
        console.log('bbbbb')
        const response = await ReceitaFederal.Consulta_CNPJ(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(CPF))
        if(response != null && response != undefined && response != "")
        {
          this.state.Clientes.map(cliente => {
            if(cliente.id = IDCliente)
            {
              cliente.DataConjuge = response.abertura
              cliente.NomeConjuge = response.nome
            }
          })
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
        else
        {
          await this.setVisibilidadeModalProcurandoDadosCliente(false);
        }
      }
    }
  }
  //#endregion

  //#region Consultando o CPF do cliente da lista no banco de dados
  pegandoDadosClienteLista = async (CPF, IDCliente, Data) => {
    if(formatoDeTexto.CPF_CNPJOriginal(CPF) != null && formatoDeTexto.CPF_CNPJOriginal(CPF).length == 11) {
      let response = await Pessoa.localizar(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(CPF))
      let response_prospect = await Prospect.consultaCPF(String(this.props.token[0].token, formatoDeTexto.CPF_CNPJOriginal(CPF)))
      if (response != null && response != undefined && response != "")
      {
        this.state.Clientes.map(async cliente => {
          if(cliente.id == IDCliente) {
            if (response.id != null) {
              cliente.ID_cliente = response.id
            }
            if (response.cpf != null) {
              cliente.CPFCliente = formatoDeTexto.CPF_CNPJ(response.cpf)
            }
            if (response.dataDeNascimento != null) {
              const data = response.dataDeNascimento
              const newdata = data.split('T')[0]
              cliente.DataCliente = moment(newdata, 'YYYY-MM-DD', true).format('DD/MM/YYYY')
            }
            if (response.nome != null) {
              cliente.NomeCliente = response.nome
            }
            if (response.rg != null) {
              const dadosrg = response.rg
              cliente.RGCliente = dadosrg.numero
              cliente.RGOrgaoEmissorCliente = dadosrg.orgaoEmissor
              cliente.RGUFCliente = dadosrg.uf
            }
            if (response.emails != null && response.emails != "") {
              cliente.EmailCliente = response.emails[0].descricao
            }
            if (response.estadoCivil != null) {
              cliente.StatusCivil = response.estadoCivil
              this.state.EstadosCivis.map(async situacao => {
                if(situacao.id == cliente.StatusCivil)
                {
                  cliente.StatusCivilDescricao = situacao.descricao
                }
              })
              if(cliente.StatusCivil == 2) {
                if(this.state.RegimesDeBens != "") {
                  if(response.regimeDeBens != null) {
                    cliente.Regime = response.regimeDeBens
                    this.state.RegimesDeBens.map(async regime => {
                      if(regime.id == cliente.Regime)
                      {
                        cliente.RegimeDescricao = regime.descricao
                      }
                    })
                  }
                }
              }
            }
            if (response.conjuge != null) {
              const dadosconjuge = response.conjuge;
              if (dadosconjuge.id != null) {
                cliente.ID_conjuge = dadosconjuge.id
              }
              if (dadosconjuge.cpf != null) {
                cliente.CPFConjuge = formatoDeTexto.CPF_CNPJ(dadosconjuge.cpf)
              }
              if (dadosconjuge.dataDeNascimento != null) {
                const data = dadosconjuge.dataDeNascimento
                const newdata = data.split('T')[0]
                cliente.DataConjuge = moment(newdata, 'YYYY-MM-DD', true).format('DD/MM/YYYY')
              }
              if (dadosconjuge.nome != null) {
                cliente.NomeConjuge = dadosconjuge.nome
              }
              if (dadosconjuge.emails != null && dadosconjuge.emails != "") {
                cliente.EmailConjuge = dadosconjuge.emails[0].descricao
              }
              if (dadosconjuge.documentoPessoal != null) {
                  await this.setState({DocumentoConjugeRGExiste: true})
                  var dadosImage = `data:image/${dadosconjuge.documentoPessoal.extensao};base64,${dadosconjuge.documentoPessoal.arquivo}`
                  var id = cliente.FotoIdentidadeConjuge.id
                  cliente.FotoIdentidadeConjuge = {
                    "id": id,
                    "habilitar_camera": false,
                    "base64": dadosconjuge.documentoPessoal.arquivo,
                    "deviceOrientation": 1,            
                    "height": Dimensions.get('window').height,
                    "pictureOrientation": 1,
                    "uri": dadosImage,
                    "width": Dimensions.get('window').width,
                    "extensao": dadosconjuge.documentoPessoal.extensao,
                    "isPDF": false
                  }
              }
            }
            if (response.endereco != null) {
              const endereco = response.endereco;
              if(endereco.logradouro != null) {
                cliente.Rua = endereco.logradouro
              }
              if(endereco.numero != null) {
                cliente.Numero = endereco.numero
              }
              if(endereco.complemento != null) {
                cliente.Complemento = endereco.complemento
              }
              if(endereco.bairro != null) {
                cliente.Bairro = endereco.bairro
              }
              if(endereco.cidade != null) {
                cliente.Cidade = endereco.cidade
              }
              if(endereco.uf != null) {
                cliente.Estado = endereco.uf
              }
              if(endereco.cep != null) {
                cliente.CEP = formatoDeTexto.CEP(endereco.cep)
              }
            }
            if (response.telefones != "" && response.telefones != null) {

              response.telefones = await (response.telefones).filter((data) => data != null)

              await this.setState({TelefonesClienteExiste: true, Telefones_existentes: response.telefones});
              if((response.telefones).length == 1) {
                if(response.cpf != null && (response.cpf).length == 11) {
                  if(response.telefones.find(telefone => telefone.classificacao == 1) != "") {
                    const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 1)
                    cliente.Telefone = formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero)
                  }
                } else if (response.cpf != null && (response.cpf).length == 14) {
                    if(response.telefones.find(telefone => telefone.classificacao == 2) != "") {
                      const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 2)
                      cliente.Telefone = formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero)
                    }
                }
              } else if ((response.telefones).length >= 2) {
                  if(response.cpf != null && (response.cpf).length == 11) {
                    if(response.telefones.find(telefone => telefone.classificacao == 1) != "") {
                      const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 1)
                      cliente.Telefone = formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero)
                    }
                    if(response.telefones.find(telefone => telefone.classificacao == 3) != "") {
                      const telefoneRecado = await response.telefones.find(telefone => telefone.classificacao == 3)
                      cliente.TelefoneComercial = formatoDeTexto.Telefone(telefoneRecado.ddd + telefoneRecado.numero)
                    }
                  } else if (response.cpf != null && (response.cpf).length == 14) {
                      if(response.telefones.find(telefone => telefone.classificacao == 2) != "") {
                        const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 2)
                        cliente.Telefone = formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero)
                      }
                      if(response.telefones.find(telefone => telefone.classificacao == 3) != "") {
                        const telefoneRecado = await response.telefones.find(telefone => telefone.classificacao == 3)
                        cliente.TelefoneComercial = formatoDeTexto.Telefone(telefoneRecado.ddd + telefoneRecado.numero)
                      }
                  }
              }
            }
            if (response.documentoPessoal != null) {
                await this.setState({DocumentoClienteRGExiste: true});
                var dadosImage = `data:image/${response.documentoPessoal.extensao};base64,${response.documentoPessoal.arquivo}`
                var id = cliente.FotoIdentidade.id
                cliente.FotoIdentidade = {
                  "id": id,
                  "habilitar_camera": false,
                  "base64": response.documentoPessoal.arquivo,
                  "deviceOrientation": 1,            
                  "height": Dimensions.get('window').height,
                  "pictureOrientation": 1,
                  "uri": dadosImage,
                  "width": Dimensions.get('window').width,
                  "extensao": response.documentoPessoal.extensao,
                  "isPDF": false
                }
            }
            if (response.documentoDeEstadoCivil != null) {
              await this.setState({DocumentoClienteCertidaoExiste: true});
                var dadosImage = `data:image/${response.documentoDeEstadoCivil.extensao};base64,${response.documentoDeEstadoCivil.arquivo}`
                var id = cliente.FotoCertidao.id
                cliente.FotoCertidao = {
                  "id": id,
                  "habilitar_camera": false,
                  "base64": response.documentoDeEstadoCivil.arquivo,
                  "deviceOrientation": 1,            
                  "height": Dimensions.get('window').height,
                  "pictureOrientation": 1,
                  "uri": dadosImage,
                  "width": Dimensions.get('window').width,
                  "extensao": response.documentoDeEstadoCivil.extensao,
                  "isPDF": false
                }
            }
            if (response.documentoEndereco != null) {
              await this.setState({DocumentoClienteEnderecoExiste: true});
              var dadosImage = `data:image/${response.documentoEndereco.extensao};base64,${response.documentoEndereco.arquivo}`
              var id = cliente.FotoEndereco.id
              cliente.FotoEndereco = {
                "id": id,
                "habilitar_camera": false,
                "base64": response.documentoEndereco.arquivo,
                "deviceOrientation": 1,            
                "height": Dimensions.get('window').height,
                "pictureOrientation": 1,
                "uri": dadosImage,
                "width": Dimensions.get('window').width,
                "extensao": response.documentoEndereco.extensao,
                "isPDF": false
              }
            }
            if (response_prospect != null && response_prospect != undefined && response_prospect != "") {
              if (response_prospect.id != null) {
                cliente.ID_prospectcliente = response_prospect.id
              }
            }
            this.setVisibilidadeModalProcurandoDadosCliente(false)
          }
        })
      }
      else
      {
        await Validacoes._InputCPF_CNPJLista(CPF, this.state.this, Data, IDCliente)
        if(formatoDeTexto.CPF_CNPJOriginal(CPF).length == 11) {
          this.setVisibilidadeModalProcurandoDadosCliente(false)
        } else if(formatoDeTexto.CPF_CNPJOriginal(CPF).length == 14) {
          this.setVisibilidadeModalProcurandoDadosCliente(false)
        }
        await this.setVisibilidadeModalProcurandoDadosCliente(false)
      }
    } else if(formatoDeTexto.CPF_CNPJOriginal(CPF) != null && formatoDeTexto.CPF_CNPJOriginal(CPF).length == 14) {
      let response = await Pessoa.localizar(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(CPF))
      if (response != null && response != undefined && response != "")
      {
        this.state.Clientes.map(async cliente => {
          if (cliente.id == IDCliente)
          {
            if (response.id != null) {
              cliente.ID_cliente = response.id
            }
            if (response.cpf != null) {
              cliente.CPFCliente = formatoDeTexto.CPF_CNPJ(response.cpf)
            }
            if (response.dataDeNascimento != null) {
              const data = response.dataDeNascimento
              const newdata = data.split('T')[0]
              cliente.DataCliente = moment(newdata, 'YYYY-MM-DD', true).format('DD/MM/YYYY')
            }
            if (response.nome != null) {
              cliente.NomeCliente = response.nome
            }
            if (response.emails != null && response.emails != "") {
              cliente.EmailCliente = response.emails[0].descricao
            }
            if (response.estadoCivil != null) {
              cliente.StatusCivil = response.estadoCivil
              this.state.EstadosCivis.map(async situacao => {
                if(situacao.id == cliente.StatusCivil)
                {
                  cliente.StatusCivilDescricao = situacao.descricao
                }
              })
              if(cliente.StatusCivil == 2) {
                if(this.state.RegimesDeBens != "") {
                  if(response.regimeDeBens != null) {
                    cliente.Regime = response.regimeDeBens
                    this.state.RegimesDeBens.map(async regime => {
                      if(regime.id == cliente.Regime)
                      {
                        cliente.RegimeDescricao = regime.descricao
                      }
                    })
                  }
                }
              }
            }
            if (response.conjuge != null) {
              const dadosconjuge = response.conjuge;
              if (dadosconjuge.id != null) {
                cliente.ID_conjuge = dadosconjuge.id
              }
              if (dadosconjuge.cpf != null) {
                cliente.CPFConjuge = formatoDeTexto.CPF_CNPJ(dadosconjuge.cpf)
              }
              if (dadosconjuge.dataDeNascimento != null) {
                const data = dadosconjuge.dataDeNascimento
                const newdata = data.split('T')[0]
                cliente.DataConjuge = moment(newdata, 'YYYY-MM-DD', true).format('DD/MM/YYYY')
              }
              if (dadosconjuge.nome != null) {
                cliente.NomeConjuge = dadosconjuge.nome
              }
              if (dadosconjuge.emails != null && dadosconjuge.emails != "") {
                cliente.EmailConjuge = dadosconjuge.emails[0].descricao
              }
              if (dadosconjuge.documentoPessoal != null) {
                  await this.setState({DocumentoConjugeRGExiste: true})
                  var dadosImage = `data:image/${dadosconjuge.documentoPessoal.extensao};base64,${dadosconjuge.documentoPessoal.arquivo}`
                  var id = cliente.FotoIdentidadeConjuge.id
                  cliente.FotoIdentidade = {
                    "id": id,
                    "habilitar_camera": false,
                    "base64": dadosconjuge.documentoPessoal.arquivo,
                    "deviceOrientation": 1,            
                    "height": Dimensions.get('window').height,
                    "pictureOrientation": 1,
                    "uri": dadosImage,
                    "width": Dimensions.get('window').width,
                    "extensao": dadosconjuge.documentoPessoal.extensao,
                    "isPDF": false
                  }
              }
            }
            if (response.endereco != null) {
              await this.setState({EnderecoClienteExiste: true});
              const endereco = response.endereco;
              if(endereco.logradouro != null) {
                cliente.Rua = endereco.logradouro
              }
              if(endereco.numero != null) {
                cliente.Numero = endereco.numero
              }
              if(endereco.complemento != null) {
                cliente.Complemento = endereco.complemento
              }
              if(endereco.bairro != null) {
                cliente.Bairro = endereco.bairro
              }
              if(endereco.cidade != null) {
                cliente.Cidade = endereco.cidade
              }
              if(endereco.uf != null) {
                cliente.Estado = endereco.uf
              }
              if(endereco.cep != null) {
                cliente.CEP = formatoDeTexto.CEP(endereco.cep)
              }
            }
            if (response.telefones != "" && response.telefones != null) {
              await this.setState({TelefonesClienteExiste: true, Telefones_existentes: response.telefones});
              if((response.telefones).length == 1) {
                if(response.cpf != null && (response.cpf).length == 11) {
                  if(response.telefones.find(telefone => telefone.classificacao == 1) != "") {
                    const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 1)
                    cliente.Telefone = formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero)
                  }
                } else if (response.cpf != null && (response.cpf).length == 14) {
                    if(response.telefones.find(telefone => telefone.classificacao == 2) != "") {
                      const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 2)
                      cliente.Telefone = formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero)
                    }
                }
              } else if ((response.telefones).length >= 2) {
                  if(response.cpf != null && (response.cpf).length == 11) {
                    if(response.telefones.find(telefone => telefone.classificacao == 1) != "") {
                      const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 1)
                      cliente.Telefone = formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero)
                    }
                    if(response.telefones.find(telefone => telefone.classificacao == 3) != "") {
                      const telefoneRecado = await response.telefones.find(telefone => telefone.classificacao == 3)
                      cliente.TelefoneComercial = formatoDeTexto.Telefone(telefoneRecado.ddd + telefoneRecado.numero)
                    }
                  } else if (response.cpf != null && (response.cpf).length == 14) {
                      if(response.telefones.find(telefone => telefone.classificacao == 2) != "") {
                        const telefonePrincipal = await response.telefones.find(telefone => telefone.classificacao == 2)
                        cliente.Telefone = formatoDeTexto.Telefone(telefonePrincipal.ddd + telefonePrincipal.numero)
                      }
                      if(response.telefones.find(telefone => telefone.classificacao == 3) != "") {
                        const telefoneRecado = await response.telefones.find(telefone => telefone.classificacao == 3)
                        cliente.TelefoneComercial = formatoDeTexto.Telefone(telefoneRecado.ddd + telefoneRecado.numero)
                      }
                  }
              }
            }
            if (response.documentoPessoal != null) {
                await this.setState({DocumentoClienteRGExiste: true});
                var dadosImage = `data:image/${response.documentoPessoal.extensao};base64,${response.documentoPessoal.arquivo}`
                var id = cliente.FotoIdentidade.id
                cliente.FotoIdentidade = {
                  "id": id,
                  "habilitar_camera": false,
                  "base64": response.documentoPessoal.arquivo,
                  "deviceOrientation": 1,            
                  "height": Dimensions.get('window').height,
                  "pictureOrientation": 1,
                  "uri": dadosImage,
                  "width": Dimensions.get('window').width,
                  "extensao": response.documentoPessoal.extensao,
                  "isPDF": false
                }
            }
            if (response.documentoDeEstadoCivil != null) {
              await this.setState({DocumentoClienteCertidaoExiste: true});
                var dadosImage = `data:image/${response.documentoDeEstadoCivil.extensao};base64,${response.documentoDeEstadoCivil.arquivo}`
                var id = cliente.FotoCertidao.id
                cliente.FotoCertidao = {
                  "id": id,
                  "habilitar_camera": false,
                  "base64": response.documentoDeEstadoCivil.arquivo,
                  "deviceOrientation": 1,            
                  "height": Dimensions.get('window').height,
                  "pictureOrientation": 1,
                  "uri": dadosImage,
                  "width": Dimensions.get('window').width,
                  "extensao": response.documentoDeEstadoCivil.extensao,
                  "isPDF": false
                }
            }
            if (response.documentoEndereco != null) {
              await this.setState({DocumentoClienteEnderecoExiste: true});
              var dadosImage = `data:image/${response.documentoEndereco.extensao};base64,${response.documentoEndereco.arquivo}`
              var id = cliente.FotoEndereco.id
              cliente.FotoEndereco = {
                "id": id,
                "habilitar_camera": false,
                "base64": response.documentoEndereco.arquivo,
                "deviceOrientation": 1,            
                "height": Dimensions.get('window').height,
                "pictureOrientation": 1,
                "uri": dadosImage,
                "width": Dimensions.get('window').width,
                "extensao": response.documentoEndereco.extensao,
                "isPDF": false
              }
            }
            this.setVisibilidadeModalProcurandoDadosCliente(false)
          }
        })
      }
      else
      {
        await Validacoes._InputCPF_CNPJLista(CPF, this.state.this, Data, IDCliente)
        if(formatoDeTexto.CPF_CNPJOriginal(CPF).length == 11) {
          this.setVisibilidadeModalProcurandoDadosCliente(false)
        } else if(formatoDeTexto.CPF_CNPJOriginal(CPF).length == 14) {
          this.setVisibilidadeModalProcurandoDadosCliente(false)
        }
        await this.setVisibilidadeModalProcurandoDadosCliente(false)
      }
    }
  }
  //#endregion

  //#region Consultando o CPF do conjuge da lista no banco de dados
  pegandoDadosConjugeLista = async (CPF, IDCliente, Data) => {
    const response = await Pessoa.localizar(this.props.token[0].token, formatoDeTexto.CPF_CNPJOriginal(CPF))
    if (response != null && response != undefined && response != "")
    {
      this.state.Clientes.map(async cliente => {
        if(cliente.id == IDCliente)
        {
          if (response.id != null) {
            cliente.ID_conjuge = response.id
          }
          if (response.cpf != null) {
            cliente.CPFConjuge = formatoDeTexto.CPF_CNPJ(response.cpf)
          }
          if (response.dataDeNascimento != null) {
            const data = response.dataDeNascimento
            const newdata = data.split('T')[0]
            cliente.DataConjuge = moment(newdata, 'YYYY-MM-DD', true).format('DD/MM/YYYY')
          }
          if (response.nome != null) {
            cliente.NomeConjuge = response.nome
          }
          if (response.rg != null) {
            const dadosrg = response.rg
            cliente.RGConjuge = dadosrg.numero
            cliente.RGOrgaoEmissorConjuge = dadosrg.orgaoEmissor
            cliente.RGUFConjuge = dadosrg.uf
          }
          if (response.emails != null && response.emails != "") {
            cliente.EmailConjuge = response.emails[0].descricao
          }
          if (response.documentoPessoal != null) {
              var dadosImage = `data:image/${response.documentoPessoal.extensao};base64,${response.documentoPessoal.arquivo}`
              var id = cliente.FotoIdentidadeConjuge.id
              cliente.FotoIdentidadeConjuge = {
                "id": id,
                "habilitar_camera": false,
                "base64": response.documentoPessoal.arquivo,
                "deviceOrientation": 1,            
                "height": Dimensions.get('window').height,
                "pictureOrientation": 1,
                "uri": dadosImage,
                "width": Dimensions.get('window').width,
                "extensao": response.documentoPessoal.extensao,
                "isPDF": false
              }
          }
          this.setVisibilidadeModalProcurandoDadosCliente(false) 
        }
      })
    }
    else
    {
      await Validacoes._InputCPF_CNPJConjugeLista(CPF, this.state.this, Data, IDCliente)
      this.setVisibilidadeModalProcurandoDadosCliente(false)
    }
  }
  //#endregion

  //#region Consultando o Prospect do cliente da lista no banco de dados
  pegandoDadosProspectClienteLista = async (CPF, IDCliente) => {
    try {
      const response = await Prospect.consultaCPF(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(CPF))
      if(response != null && response != undefined && response != "")
      {
        await this.setVisibilidadeModalProcurandoDadosCliente(false)
      }
    } catch {

    }
  }
  //#endregion

  //#region Consultando o Prospect do conjuge da lista no banco de dados
  pegandoDadosProspectConjugeLista = async (CPF, IDConjuge) => {

  }
  //#endregion

  //#region Validando CPF
  ValidarCPF = (cpf) => {
    
    if ( !cpf || cpf.length != 11

      || cpf == "00000000000"

      || cpf == "11111111111"

      || cpf == "22222222222" 

      || cpf == "33333333333" 

      || cpf == "44444444444" 

      || cpf == "55555555555" 

      || cpf == "66666666666"

      || cpf == "77777777777"

      || cpf == "88888888888" 

      || cpf == "99999999999" )

    return false

    var soma = 0

      var resto

    for (var i = 1; i <= 9; i++) 

      soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)

    resto = (soma * 10) % 11

      if ((resto == 10) || (resto == 11))  resto = 0

      if (resto != parseInt(cpf.substring(9, 10)) ) return false

    soma = 0

      for (var i = 1; i <= 10; i++) 

        soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)

      resto = (soma * 10) % 11

      if ((resto == 10) || (resto == 11))  resto = 0

      if (resto != parseInt(cpf.substring(10, 11) ) ) return false

      return true

  }
  //#endregion

  //#region Validando CNPJ
  ValidarCNPJ = (cnpj) => {

    if ( !cnpj || cnpj.length != 14

        || cnpj == "00000000000000" 

        || cnpj == "11111111111111" 

        || cnpj == "22222222222222" 

        || cnpj == "33333333333333" 

        || cnpj == "44444444444444" 

        || cnpj == "55555555555555" 

        || cnpj == "66666666666666" 

        || cnpj == "77777777777777" 

        || cnpj == "88888888888888" 

        || cnpj == "99999999999999")

        return false

    var tamanho = cnpj.length - 2

    var numeros = cnpj.substring(0,tamanho)

    var digitos = cnpj.substring(tamanho)

    var soma = 0

    var pos = tamanho - 7

    for (var i = tamanho; i >= 1; i--) {

      soma += numeros.charAt(tamanho - i) * pos--

      if (pos < 2) pos = 9

    }

    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11

    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1

    numeros = cnpj.substring(0,tamanho)

    soma = 0

    pos = tamanho - 7

    for (var i = tamanho; i >= 1; i--) {

      soma += numeros.charAt(tamanho - i) * pos--

      if (pos < 2) pos = 9

    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11

    if (resultado != digitos.charAt(1)) return false

    return true;

  }
  //#endregion

  //#region Validando Email
  IsEmail = (email) => {
    var str = email;
    var filtro = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if(filtro.test(str) && str.indexOf(";") === -1) {
        return true;
    } else {
        return false;
    }
  }
  //#endregion

  //#region Validando Telefone
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

  //#region Validando CEP
  IsCEP(strCEP) {
    var str = strCEP;
    var objER = /^[0-9]{2}\.[0-9]{3}-[0-9]{3}$/;
    if(objER.test(str)) {
      return true
    } else {
      return false
    }
  }
  //#endregion

  //#region AnimacaoInputDataCliente
  AnimacaoInputDataCliente() {
    if((this.state.CPFCliente != "" && this.state.CPFCliente != null && (
      formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11
      || (formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 14))) &&
      ((this.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente)) == true ||
        this.ValidarCNPJ(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente)) == true))) {
          Animated.timing(this.state.AnimatedDataCliente,{
            toValue: 114,
            duration: 700,
            useNativeDriver: false
          }).start();
        } else {
          Animated.timing(this.state.AnimatedDataCliente,{
            toValue: 0,
            duration: 400,
            useNativeDriver: false
          }).start();
        }
  }
  //#endregion

  //#region AnimacaoInputNomeCliente
  AnimacaoInputNomeCliente() {
    if(this.state.CPFCliente != "" && ((formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11) ||
    formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 14)) {
      Animated.timing(this.state.AnimatedNomeCliente,{
        toValue: 114,
        duration: 700,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(this.state.AnimatedNomeCliente,{
        toValue: 0,
        duration: 400,
        useNativeDriver: false
      }).start();
    }
  }
  //#endregion

  //#region AnimacaoInputEmailCliente
  AnimacaoInputEmailCliente() {
    if(this.state.CPFCliente != "" && (formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11 ||
    formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 14) &&
    this.state.DataCliente != "" && this.state.DataCliente != null && this.state.NomeCliente != null
    && this.state.NomeCliente != "") {
      Animated.timing(this.state.AnimatedEmailCliente,{
        toValue: 114,
        duration: 700,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(this.state.AnimatedEmailCliente,{
        toValue: 0,
        duration: 400,
        useNativeDriver: false
      }).start();
    }
  }
  //#endregion

  //#region AnimacaoInputDataConjuge
  AnimacaoInputDataConjuge() {
    if((this.state.CPFConjuge != "" && this.state.CPFConjuge != null && (
      formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge).length == 11)) &&
      ((this.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge)) == true))) {
          Animated.timing(this.state.AnimatedDataConjuge,{
            toValue: 114,
            duration: 700,
            useNativeDriver: false
          }).start();
    } else {
      Animated.timing(this.state.AnimatedDataConjuge,{
        toValue: 0,
        duration: 400,
        useNativeDriver: false
      }).start();
    }
  }
  //#endregion

  //#region AnimacaoInputNomeConjuge
  AnimacaoInputNomeConjuge() {
    if(this.state.CPFConjuge != "" && ((formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge).length == 11))) {
      Animated.timing(this.state.AnimatedNomeConjuge,{
        toValue: 114,
        duration: 700,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(this.state.AnimatedNomeConjuge,{
        toValue: 0,
        duration: 400,
        useNativeDriver: false
      }).start();
    }
  }
  //#endregion

  //#region AnimacaoInputEmailConjuge
  AnimacaoInputEmailConjuge() {
    if(this.state.CPFConjuge != "" && (formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge).length == 11) &&
    this.state.DataConjuge != "" && this.state.DataConjuge != null && this.state.NomeConjuge != null
    && this.state.NomeConjuge != "") {
      Animated.timing(this.state.AnimatedEmailConjuge,{
        toValue: 114,
        duration: 700,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(this.state.AnimatedEmailConjuge,{
        toValue: 0,
        duration: 400,
        useNativeDriver: false
      }).start();
    }
  }
  //#endregion

  //#region AnimacaoInputsEndereco
  AnimacaoInputsEndereco() {
    if(this.state.CEP != null && this.state.CEP != "" && formatoDeTexto.CEPOriginal(this.state.CEP).length == 8) {
      Animated.timing(this.state.AnimatedEndereco,{
        toValue: 114,
        duration: 700,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(this.state.AnimatedEndereco,{
        toValue: 0,
        duration: 400,
        useNativeDriver: false
      }).start();
    }
  }
  //#endregion

  //#region AnimacaoInputTelefoneComercial
  AnimacaoInputTelefoneComercial() {
    if(this.state.Telefone != null && this.state.Telefone != "" && (formatoDeTexto.TelefoneOriginal(this.state.Telefone).length == 11 ||formatoDeTexto.TelefoneOriginal(this.state.Telefone).length == 10)) {
      Animated.timing(this.state.AnimatedTelefoneComercial,{
        toValue: 114,
        duration: 700,
        useNativeDriver: false
      }).start();
    } else {
      Animated.timing(this.state.AnimatedTelefoneComercial,{
        toValue: 0,
        duration: 400,
        useNativeDriver: false
      }).start();
    }
  }
  //#endregion

  //#region Pegando lista de estados civis no banco de dados
  pegandoListaEstadosCivis = async () => {
    const response = await Pessoa.estadocivil(String(this.props.token[0].token))
    if(response != null && response != undefined)
    {
      this.state.EstadosCivis = response
      await this.pegandoListaRegimeDeBens();
    }
    else
    {
      await this.setVisibilidadeModalLoadingGoBack(false)
      await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando lista de regimes de bens no banco de dados
  pegandoListaRegimeDeBens = async () => {
    const response = await Pessoa.regimeDeBens(String(this.props.token[0].token))
    if(response != null && response != undefined)
    {
      this.state.RegimesDeBens = response
      if(this.props.listacargos == "" || this.props.listacargos == null)
      {
        await this.pegandoListaDeCargos()
      }
      else
      {
        await this.setState({ListaDeCargos: this.props.listacargos[0]})
        await this.pegandoListaDeNacionalidade()
      }
    }
    else
    {
      await this.setVisibilidadeModalLoadingGoBack(false)
      await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando lista de cargos no redux ou banco
  pegandoListaDeCargos = async () => {
    const response = await Cargos.lista(String(this.props.token[0].token))
    if (response != "" && response != null && response != undefined)
    {
      this.state.ListaDeCargos = response
      await this.pegandoListaDeNacionalidade()
    }
    else
    {
      await this.setVisibilidadeModalLoadingGoBack(false)
      await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando lista de nacionalidades
  pegandoListaDeNacionalidade = async () => {
    let Response = await Nacionalidade.lista(this.props.token[0].token)
    if (Math.floor(Response.status / 100) == 2) 
    {
      this.state.Nacionalidades = Response.data
      await this.setVisibilidadeModalLoadingGoBack(false)
    }
    else
    {
      await this.setVisibilidadeModalLoadingGoBack(false)
    }
  }
  //#endregion

  //#region Setando a visibilidade da modal de estados civis
  setVisibilidadeModalEstadosCivis(value) {
    this.setState({VisibilidadeModalEstadosCivis: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de estados civis lista
  setVisibilidadeModalEstadosCivisLista(value) {
    this.setState({VisibilidadeModalEstadosCivisLista: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de regime de bens
  setVisibilidadeModalRegimeDeBens(value) {
    this.setState({VisibilidadeModalRegimeDeBens: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de regime de bens lista
  setVisibilidadeModalRegimeDeBensLista(value) {
    this.setState({VisibilidadeModalRegimeDeBensLista: value})
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

  //#region Setando a visiblidade da modal do endereco
  setVisibilidadeModalEndereco(value) {
    this.setState({VisibilidadeModalEndereco: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal dos anexos
  setVisibilidadeModalAnexos(value) {
    this.setState({VisibilidadeModalAnexos: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de procurar os dados do cliente
  setVisibilidadeModalProcurandoDadosCliente(value) {
    this.setState({VisibilidadeModalProcurandoDadosCliente: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de opcoes
  setVisibilidadeModalOption = async (value, option) => {
    if(option == '@deletedadoscliente')
    {
      await this.setState({
        ModalOptionMensagem: 'Caro usuário, os dados referentes ao nome e ao email do cliente já foram preenchidos, deseja apagá-los?',
      })
    }
    else if (option == '@deletedadosconjuge')
    {
      await this.setState({
        ModalOptionMensagem: 'Caro usuário, os dados referentes ao nome e ao email do conjugê já foram preenchidos, deseja apagá-los?',
      })
    }
    this.setState({VisibilidadeModalOption: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal da UF
  setVisibilidadeModalUFDoRG(value, option) {
    this.setState({VisibilidadeModalUFDoRG: value, OptionUF: option})
  }
  //#endregion

  //#region Setando a visibilidade da modal da UF lista
  setVisibilidadeModalUFDoRGLista(value, option) {
    this.setState({VisibilidadeModalUFDoRGLista: value, OptionUF: option})
  }
  //#endregion

  //#region Setando a visibilidade da modal dos Cargos
  setVisibilidadeModalCargos(value, option) {
    this.setState({VisibilidadeModalCargos: value, OptionCargos: option})
  }
  //#endregion

  //#region Setando a visibilidade da modal das nacionalidade
  setVisibilidadeModalNacionalidade(value, option) {
    this.setState({VisibilidadeModalNacionalidade: value, OptionNacionalidade: option})
  }
  //#endregion

  //#region Setando a visibilidade da modal das sexualidades
  setVisibilidadeModalSexualidade(value, option) {
    this.setState({VisibilidadeModalSexualidade: value, OptionSexualidade: option})
  }
  //#endregion

  //#region Setando a visibilidade da modal dos Cargos lista
  setVisibilidadeModalCargosLista(value, option) {
    this.setState({VisibilidadeModalCargosLista: value, OptionCargos: option})
  }
  //#endregion

  //#region Filtro lista de cargos
  searchUpdateCargos(term) {
    this.setState({searchTermCargos: term})
  }
  //#endregion

  //#region Filtro lista de nacionalidades
  searchUpdateNacionalidade(term) {
    this.setState({searchTermNacionalidade: term})
  }
  //#endregion

  //#region Filtro lista de sexualidades
  searchUpdateSexualidade(term) {
    this.setState({searchTermSexualidade: term})
  }
  //#endregion

  //#region Renderizando lista de cargos
  renderCargos = ({ item }) => (
    <TouchableOpacity activeOpacity = {1} key = {item.id} style = {{marginHorizontal: 8}}
      onPress = { async () => {
        if(this.state.OptionCargos == '@cliente') 
        {
          this.state.CargoCliente = item.nome
          this.state.IDCargoCliente = item.id
          this.state.OcupacaoCliente = {"id": item.id, "cargo": item.cargo, "nome": item.nome}

          this.setVisibilidadeModalCargos(false)
        }
        else if (this.state.OptionCargos == '@conjuge')
        {
          this.state.CargoConjuge = item.nome
          this.state.IDCargoConjuge = item.id
          this.state.OcupacaoConjuge = {"id": item.id, "cargo": item.cargo, "nome": item.nome}
          this.setVisibilidadeModalCargos(false)
        }
    }}>
      {this.state.OptionCargos == '@cliente' &&
      <View 
        style = {{
          backgroundColor: item.id == this.state.IDCargoCliente ? this.props.StyleGlobal.cores.background : '#FFFFFF',
          paddingHorizontal: 16,
          height: 58,
          width: '100%',
          marginVertical: 5,
          borderWidth: 1,
          borderColor: 'rgba(16, 22, 26, 0.15)',
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center"
      }}>
        <Text 
          style = {{
            paddingVertical: 0,
            fontSize: 13,
            color: item.id == this.state.IDCargoCliente ? "#FFFFFF" : '#262825',
            fontWeight: item.id == this.state.IDCargoCliente ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.nome}</Text>
      </View>}
      {this.state.OptionCargos == '@conjuge' &&
      <View 
        style = {{
          backgroundColor: item.id == this.state.IDCargoConjuge ? this.props.StyleGlobal.cores.background : '#FFFFFF',
          paddingHorizontal: 16,
          height: 58,
          width: '100%',
          marginVertical: 5,
          borderWidth: 1,
          borderColor: 'rgba(16, 22, 26, 0.15)',
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center"
      }}>
        <Text 
          style = {{
            paddingVertical: 0,
            fontSize: 13,
            color: item.id == this.state.IDCargoConjuge ? "#FFFFFF" : '#262825',
            fontWeight: item.id == this.state.IDCargoConjuge ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.nome}</Text>
      </View>}
    </TouchableOpacity>
  );
  //#endregion

  //#region Renderizando lista de nacionalidade
  renderNacionalidade = ({ item }) => (
    <TouchableOpacity activeOpacity = {1} key = {item.id} style = {{marginHorizontal: 8}}
      onPress = { async () => {
        if(this.state.OptionNacionalidade == '@cliente') 
        {
          this.state.NacionalidadeCliente = item

          this.setVisibilidadeModalNacionalidade(false)
        }
        else if (this.state.OptionNacionalidade == '@conjuge')
        {
          this.state.NacionalidadeConjuge = item

          this.setVisibilidadeModalNacionalidade(false)
        }
    }}>
      {this.state.OptionNacionalidade == '@cliente' &&
      <View 
        style = {{
          backgroundColor: item.id == this.state.NacionalidadeCliente.id ? this.props.StyleGlobal.cores.background : '#FFFFFF',
          paddingHorizontal: 16,
          height: 58,
          width: '100%',
          marginVertical: 5,
          borderWidth: 1,
          borderColor: 'rgba(16, 22, 26, 0.15)',
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center"
      }}>
        <Text 
          style = {{
            paddingVertical: 0,
            fontSize: 13,
            color: item.id == this.state.NacionalidadeCliente.id ? "#FFFFFF" : '#262825',
            fontWeight: item.id == this.state.NacionalidadeCliente.id ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>}
      {this.state.OptionNacionalidade == '@conjuge' &&
      <View 
        style = {{
          backgroundColor: item.id == this.state.NacionalidadeConjuge.id ? this.props.StyleGlobal.cores.background : '#FFFFFF',
          paddingHorizontal: 16,
          height: 58,
          width: '100%',
          marginVertical: 5,
          borderWidth: 1,
          borderColor: 'rgba(16, 22, 26, 0.15)',
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center"
      }}>
        <Text 
          style = {{
            paddingVertical: 0,
            fontSize: 13,
            color: item.id == this.state.NacionalidadeConjuge.id  ? "#FFFFFF" : '#262825',
            fontWeight: item.id == this.state.NacionalidadeConjuge.id ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>}
    </TouchableOpacity>
  );
  //#endregion

  //#region Renderizando lista de sexualidade
  renderSexualidade = ({ item }) => (
    <TouchableOpacity activeOpacity = {1} key = {item.id} style = {{marginHorizontal: 8}}
      onPress = { async () => {
        if(this.state.OptionSexualidade == '@cliente') 
        {
          this.state.SexoCliente = item

          this.setVisibilidadeModalSexualidade(false)
        }
        else if (this.state.OptionSexualidade == '@conjuge')
        {
          this.state.SexoConjuge = item

          this.setVisibilidadeModalSexualidade(false)
        }
    }}>
      {this.state.OptionSexualidade == '@cliente' &&
      <View 
        style = {{
          backgroundColor: item.id == this.state.SexoCliente.id ? this.props.StyleGlobal.cores.background : '#FFFFFF',
          paddingHorizontal: 16,
          height: 58,
          width: '100%',
          marginVertical: 5,
          borderWidth: 1,
          borderColor: 'rgba(16, 22, 26, 0.15)',
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center"
      }}>
        <Text 
          style = {{
            paddingVertical: 0,
            fontSize: 13,
            color: item.id == this.state.SexoCliente.id ? "#FFFFFF" : '#262825',
            fontWeight: item.id == this.state.SexoCliente.id ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>}
      {this.state.OptionSexualidade == '@conjuge' &&
      <View 
        style = {{
          backgroundColor: item.id == this.state.SexoConjuge.id ? this.props.StyleGlobal.cores.background : '#FFFFFF',
          paddingHorizontal: 16,
          height: 58,
          width: '100%',
          marginVertical: 5,
          borderWidth: 1,
          borderColor: 'rgba(16, 22, 26, 0.15)',
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center"
      }}>
        <Text 
          style = {{
            paddingVertical: 0,
            fontSize: 13,
            color: item.id == this.state.SexoConjuge.id  ? "#FFFFFF" : '#262825',
            fontWeight: item.id == this.state.SexoConjuge.id ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>}
    </TouchableOpacity>
  );
  //#endregion

  //#region Renderizando lista de estados civis
  renderEstadoCivil = ({ item }) => (
    <TouchableOpacity key = {item.id} style = {{marginHorizontal: 8}}
      onPress = {async () => {
        if(item.id != this.state.StatusCivil)
        {
          if(item.id == 1) 
          {
            this.state.StatusCivil = item.id
            this.state.StatusCivilDescricao = item.descricao
            this.state.Regime = null
            this.state.RegimeDescricao = null
            await this.setVisibilidadeModalEstadosCivis(false)
          }
          else
          {
            this.state.StatusCivil = item.id
            this.state.StatusCivilDescricao = item.descricao
            await this.setVisibilidadeModalEstadosCivis(false)
          }
        }
        else
        {
          await this.setVisibilidadeModalEstadosCivis(false)
        }
    }}>
      <View 
        style = {{
          backgroundColor: item.descricao == this.state.StatusCivilDescricao ? this.props.StyleGlobal.cores.background : '#FFFFFF',
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
            fontSize: 13,
            color: item.descricao == this.state.StatusCivilDescricao ? "#FFFFFF" : '#262825',
            fontWeight: item.descricao == this.state.StatusCivilDescricao ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>
    </TouchableOpacity>
  );
  //#endregion

  //#region Renderizando lista de regime de bens
  renderRegimeDeBens = ({ item }) => (
    <TouchableOpacity activeOpacity = {1} key = {item.id} style = {{marginHorizontal: 8}}
      onPress = {async () => {
        if(item.id != this.state.Regime)
        {
          this.state.Regime = item.id
          this.state.RegimeDescricao = item.descricao
          await this.setVisibilidadeModalRegimeDeBens(false)
        }
        else
        {
          await this.setVisibilidadeModalRegimeDeBens(false)
        }
    }}>
      <View 
        style = {{
          backgroundColor: item.descricao == this.state.RegimeDescricao ? this.props.StyleGlobal.cores.background : '#FFFFFF',
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
            fontSize: 13,
            color: item.descricao == this.state.RegimeDescricao ? "#FFFFFF" : '#262825',
            fontWeight: item.descricao == this.state.RegimeDescricao ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>
    </TouchableOpacity>
  );
  //#endregion
  
  //#region Renderizando lista de estados
  renderUFEstados = ({ item }) => (
    <TouchableOpacity activeOpacity = {1} key = {item.id} style = {{marginHorizontal: 8}}
      onPress = {async () => {
        if(this.state.OptionUF == '@orgaoemissorcliente')
        {
          if(item.id != this.state.IDRGUFCliente)
          {
            this.state.IDRGUFCliente = item.id
            this.state.RGUFCliente = item.descricao
            await this.setVisibilidadeModalUFDoRG(false)
          }
          else
          {
            await this.setVisibilidadeModalUFDoRG(false)
          }
        }
        else if (this.state.OptionUF == '@orgaoemissorconjuge')
        {
          if(item.id != this.state.IDRGUFConjuge)
          {
            this.state.IDRGUFConjuge = item.id
            this.state.RGUFConjuge = item.descricao
            await this.setVisibilidadeModalUFDoRG(false)
          }
          else
          {
            await this.setVisibilidadeModalUFDoRG(false)
          }
        }
        else if (this.state.OptionUF == '@endereco')
        {
          if(item.id != this.state.IDEstado)
          {
            this.state.IDEstado = item.id
            this.state.Estado = item.descricao
            await this.setVisibilidadeModalUFDoRG(false)
          }
          else
          {
            await this.setVisibilidadeModalUFDoRG(false)
          }
        }
    }}>
      {this.state.OptionUF == '@orgaoemissorcliente' &&
      <View
        style = {{
          backgroundColor: item.descricao == this.state.RGUFCliente ? this.props.StyleGlobal.cores.background : '#FFFFFF',
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
            fontSize: 13,
            color: item.descricao == this.state.RGUFCliente ? '#FFFFFF' : '#262825',
            fontWeight: item.descricao == this.state.RGUFCliente ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>}
      {this.state.OptionUF == '@orgaoemissorconjuge' &&
      <View
        style = {{
          backgroundColor: item.descricao == this.state.RGUFConjuge ? this.props.StyleGlobal.cores.background : '#FFFFFF',
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
            color: item.descricao == this.state.RGUFConjuge ? '#FFFFFF' : '#262825',
            fontWeight: item.descricao == this.state.RGUFConjuge ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>}
      {this.state.OptionUF == '@endereco' &&
      <View
        style = {{
          backgroundColor: item.descricao == this.state.Estado ? this.props.StyleGlobal.cores.background : '#FFFFFF',
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
            color: item.descricao == this.state.Estado ? '#FFFFFF' : '#262825',
            fontWeight: item.descricao == this.state.Estado ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>}
    </TouchableOpacity>
  );
  //#endregion

  //#region Pegando os dados do endereço nos correios
  pegandoDadosDoEndereco = async () => {
    if(this.state.CEP != null && this.state.CEP != "" && formatoDeTexto.CEPOriginal(this.state.CEP).length == 8)
    {
      const response = await Correios.consulta(String(this.props.token[0].token), formatoDeTexto.CEPOriginal(this.state.CEP))
      if(response != null && response != undefined && response != "") 
      {
        await this.setState({
          Rua: response.Logradouro,
          Numero: 'S/N',
          Complemento: response.Complemento,
          Bairro: response.Bairro,
          Cidade: response.Cidade,
          Estado: response.UF,
        })
        await this.setVisibilidadeModalEndereco(false)
      }
      else
      {
        await this.setVisibilidadeModalEndereco(false)
      }
    }
    else
    {
      await this.setVisibilidadeModalEndereco(false)
      this.InputCEP.focus();
    }
  }
  //#endregion

  //#region Pegando os dados do endereço nos correios
  pegandoDadosDoEnderecoLista = async (CEP, IDCliente) => {
    if(CEP != null && CEP != "" && formatoDeTexto.CEPOriginal(CEP).length == 8)
    {
      const response = await Correios.consulta(String(this.props.token[0].token), formatoDeTexto.CEPOriginal(CEP))
      if(response != null && response != undefined && response != "") 
      {
        this.state.Clientes.map(async cliente => {
          if (cliente.id == IDCliente)
          {
            cliente.Rua = response.Logradouro
            cliente.Numero = 'S/N'
            cliente.Complemento = response.Complemento
            cliente.Bairro =  response.Bairro
            cliente.Cidade = response.Cidade
            cliente.Estado = response.UF
          }
        })
        await this.setVisibilidadeModalEndereco(false)
      }
      else
      {
        await this.setVisibilidadeModalEndereco(false)
      }
    }
    else
    {
      await this.setVisibilidadeModalEndereco(false)
    }
  }
  //#endregion

  //#region Submit no input do CPF/CNPJ do cliente
  submitInputCPFCliente = async () => {    
    if(await this.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente)) == true 
    || await this.ValidarCNPJ(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente)) == true) {
      if((this.state.NomeCliente != null && this.state.NomeCliente != "") || (this.state.EmailCliente != null && this.state.EmailCliente != "")) {
        await this.setState({Option: '@deletedadoscliente'})
        await this.setVisibilidadeModalOption(true, '@deletedadoscliente')
      } else {
        await this.setVisibilidadeModalProcurandoDadosCliente(true)
        await this.pegandoDadosCliente();
      }
    } else {
      await Validacoes._InputCPF_CNPJ(this.state.CPFCliente, this.state.this)
    }
  }
  //#endregion

  //#region Submit no input da Data do cliente
  submitInputDataCliente = async () => {
    if(this.state.DataCliente != null && this.state.DataCliente != "" && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 14) {
      await this.setVisibilidadeModalProcurandoDadosCliente(true)
      this.consultaReceitaFederal()
      this.InputNomeCliente.focus()
    } else if( this.state.DataCliente != null && this.state.DataCliente != "" && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11) {
      await this.setVisibilidadeModalProcurandoDadosCliente(true)
      await this.consultaReceitaFederal()
    } else {}
  }
  //#endregion

  //#region Submit no input do Nome do cliente
  submitInputNomeCliente = async () => {
    this.InputRGCliente.focus();
  }
  //#endregion

  //#region Submit no input do RG do cliente
  submitInputRGCliente = async () => {
    this.InputRGOrgaoEmissor.focus();
  }
  //#endregion

  //#region Submit no input do orgao emissor do RG
  submitInputRGOrgaoEmissor = async () => {}
  //#endregion

  //#region Submit no input do Email do cliente
  submitInputEmailCliente = async () => {
    
  }
  //#endregion

  //#region Submit no input do CPF do conjuge
  submitInputCPFConjuge = async () => {
    if(await this.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge)) == true) {
      if((this.state.NomeConjuge != null && this.state.NomeConjuge != "") || (this.state.EmailConjuge != null && this.state.EmailConjuge != "")) {
        await this.setState({Option: '@deletedadosconjuge'})
        await this.setVisibilidadeModalOption(true, '@deletedadosconjuge')
      } else {
        this.setVisibilidadeModalProcurandoDadosCliente(true)
        await this.pegandoDadosConjuge();
      }
    } else {
      await Validacoes._InputCPF_CNPJConjuge(this.state.CPFConjuge, this.state.this, this.state)
    }
  }
  //#endregion

  //#region Submit no input da Data do conjuge
  submitInputDataConjuge = async () => {
    if( this.state.DataConjuge != null && this.state.DataConjuge != "" && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge).length == 11) {
      await this.setVisibilidadeModalProcurandoDadosCliente(true)
      await this.consultaReceitaFederal();
    } else {}
  }
  //#endregion

  //#region Submit no input do Nome do conjuge
  submitInputNomeConjuge = async () => {
    this.InputRGConjuge.focus();
  }
  //#endregion

  //#region Submit no input do RG do conjuge
  submitInputRGConjuge = async () => {
    this.InputRGOrgaoEmissorConjuge.focus();
  }
  //#endregion

  //#region Submit no input do orgao emissor do RG do conjuge
  submitInputRGOrgaoEmissorConjuge = async () => {}
  //#endregion

  //#region Submit no input do Email do conjuge
  submitInputEmailConjuge = async () => {
    
  }
  //#endregion

  //#region Submit no input do CEP
  submitInputCEP = async () => {
    await this.setVisibilidadeModalEndereco(true);
    await this.pegandoDadosDoEndereco();
  }
  //#endregion

  //#region onChangeText no input CPFCliente
  onChangeInputCPFCliente = async (value) => {
    await this.setState({ CPFCliente: formatoDeTexto.CPF_CNPJ(value)})
  }
  //#endregion

  //#region onChangeText no input RendaCliente
  onChangeInputRendaCliente = async (value) => {
    await this.setState({ RendaCliente: formatoDeTexto.DesformatarTexto(value)})
  }
  //#endregion

  //#region onChangeText no input DataCliente
  onChangeInputDataCliente = async (value) => {
    await this.setState({DataCliente: formatoDeTexto.Data(value)})
  }
  //#endregion

  //#region onChangeText no input NomeCliente
  onChangeInputNomeCliente = async (value) => {
    await this.setState({ NomeCliente: value });
  }
  //#endregion

  //#region onChangeText no input RGCliente
  onChangeInputRGCliente = async (value) => {
    await this.setState({ RGCliente: value });
  }
  //#endregion

  //#region onChangeText no input Orgao emissor Cliente
  onChangeInputRGOrgaoEmissorCliente = async (value) => {
    await this.setState({ RGOrgaoEmissorCliente: (value)});
  }
  //#endregion

  //#region onChangeText no inpit EmailCliente
  onChangeInputEmailCliente = async (value) => {
    this.setState({EmailCliente: value})
  }
  //#endregion

  //#region onChangeText no input CPFConjuge
  onChangeInputCPFConjuge = async (value) => {
    await this.setState({ CPFConjuge: formatoDeTexto.CPF_CNPJ(value)})
  }
  //#endregion

  //#region onChangeText no input DataConjuge
  onChangeInputDataConjuge = async (value) => {
    await this.setState({DataConjuge: formatoDeTexto.Data(value)})
  }
  //#endregion

  //#region onChangeText no input NomeConjuge
  onChangeInputNomeConjuge = async (value) => {
    await this.setState({ NomeConjuge: value });
  }
  //#endregion

  //#region onChangeText no input RGConjuge
  onChangeInputRGConjuge = async (value) => {
    await this.setState({ RGConjuge: value });
  }
  //#endregion

  //#region onChangeText no input Orgao emissor Conjuge
  onChangeInputRGOrgaoEmissorConjuge = async (value) => {
    await this.setState({ RGOrgaoEmissorConjuge: value });
  }
  //#endregion

  //#region onChangeText no input EmailConjuge
  onChangeInputEmailConjuge= async (value) => {
    this.setState({EmailCliente: value})
  }
  //#endregion

  //#region onChangeText no input do CEP
  onChangeInputCEP = async (value) => {
    this.setState({CEP: formatoDeTexto.CEP(value)})
  }
  //#endregion

  //#region onChangeText no input da Rua
  onChangeInputRua = async (value) => {
    this.setState({Rua: value})
  }
  //#endregion

  //#region onChangeText no input Numero
  onChangeInputNumero = async (value) => {
    if(formatoDeTexto.NumeroInteiro(value.replace("S/N","")) == null || formatoDeTexto.NumeroInteiro(value.replace("S/N","")) == "NaN" ){
      await this.setState({Numero: "S/N"})
    } else {
      await this.setState({Numero: value.replace("S/N","")})
    }
  }
  //#endregion

  //#region onChangeText no input da Complemento
  onChangeInputComplemento = async (value) => {
    this.setState({Complemento: value})
  }
  //#endregion

  //#region onChangeText no input da Bairro
  onChangeInputBairro = async (value) => {
    this.setState({Bairro: value})
  }
  //#endregion

  //#region onChangeText no input da Cidade
  onChangeInputCidade= async (value) => {
    this.setState({Cidade: value})
  }
  //#endregion

  //#region onChangeText no input da Estado
  onChangeInputEstado = async (value) => {
    this.setState({Estado: value})
  }
  //#endregion

  //#region onChangeText no input do telefone
  onChangeInputTelefone = async (value) => {
    this.setState({Telefone: formatoDeTexto.Telefone(value)})
  }
  //#endregion

  //#region onChangeText no input do telefone comercial
  onChangeInputTelefoneComercial = async (value) => {
    this.setState({TelefoneComercial: formatoDeTexto.Telefone(value)})
  }
  //#endregion

  //#region onValueChange Switch do conjuge
  onValueChangeSwitchConjuge = async () => {
    if(this.state.ValueSwitchConjuge == false)
    {
      await this.setState({ValueSwitchConjuge: true})
    }
    else
    {
      await this.setState({ValueSwitchConjuge: false})
    }
  }
  //#endregion

  //#region Submit no input da Rua
  submitInputRua = async () => {
    if(this.state.Rua != null && this.state.Rua != "")
    {
      this.InputNumero.focus()
    }
    else
    {
      this.InputNumero.focus()
    }
  }
  //#endregion

  //#region Submit no input do Numero
  submitInputNumero = async () => {
    if(this.state.Numero != null && this.state.Numero != "")
    {
      this.InputComplemento.focus()
    }
    else
    {
      this.InputComplemento.focus()
    }
  }
  //#endregion

  //#region Submit no input do Complemento
  submitInputComplemento = async () => {
    if(this.state.Complemento != null && this.state.Complemento != "")
    {
      this.InputBairro.focus()
    }
    else
    {
      this.InputBairro.focus()
    }
  }
  //#endregion

  //#region Submit no input do Bairro
  submitInputBairro = async () => {
    if(this.state.Bairro != null && this.state.Bairro != "")
    {
      this.InputCidade.focus()
    }
    else
    {
      this.InputCidade.focus()
    }
  }
  //#endregion

  //#region Submit no input da Cidade
  submitInputCidade = async () => {
    
  }
  //#endregion

  //#region Submit no input do Estado
  submitInputEstado = async () => {
    if(this.state.Estado != null && this.state.Estado != "")
    {

    }
    else
    {
      
    }
  }
  //#endregion

  //#region Submit no input do Telefone
  submitInputTelefone = async () => {
    if(this.state.Telefone != null && this.state.Telefone != "" && (formatoDeTexto.TelefoneOriginal(this.state.Telefone).length == 11 ||formatoDeTexto.TelefoneOriginal(this.state.Telefone).length == 10))
    {
      this.InputTelefoneComercial.focus();
    }
    else
    {

    }
  }
  //#endregion

  //#region Submit no input do Telefone comercial
  submitInputTelefoneComercial = async () => {
    
  }
  //#endregion

  //#region Renderizando itens do carousel
  renderItemCarousel = ({ item, index }) => {
    return(
      <View 
        key = {item.id} 
        style = {{
          flex: 1, justifyContent: 'center', alignItems: 'center',
          backgroundColor: 'transparent',
          borderRadius: 10, borderWidth: 1.2, borderColor: 'transparent'
        }}>
        <View style = {{flex: 1, justifyContent: 'center', marginTop: 20}}>
          <View style = {{width: Dimensions.get('window').width}}>
            <Text style = {{fontSize: 25, textAlign: 'center'}}>{item.id}</Text>
          </View>
          {item.habilitar_camera == false &&
          <TouchableOpacity  style = {{alignItems: 'center'}} activeOpacity = {item.base64 == null ? 0.8 : 1} 
            onPress = {async () => {
              if (item.base64 == null) {
                if ((item.id).indexOf('RG do Conjugê') != -1) {
                  item.habilitar_camera = true,
                  await this.setState({imageurl: item, anexo_atual: 'RG', scrollCarouselEnabled: false})
                } else if ((item.id).indexOf('RG') != -1) {
                  item.habilitar_camera = true,
                  await this.setState({imageurl: item, anexo_atual: 'RG do Conjugê', scrollCarouselEnabled: false})
                } else if ((item.id).indexOf('Estado Civil') != -1) {
                  item.habilitar_camera = true,
                  await this.setState({imageurl: item, anexo_atual: 'Estado Civil', scrollCarouselEnabled: false})
                } else if ((item.id).indexOf('Comprovante end.') != -1) {
                  item.habilitar_camera = true,
                  await this.setState({imageurl: item, anexo_atual: 'Comprovante end.', scrollCarouselEnabled: false})
                }
              }
          }}>
            {item.base64 != null &&
              <Image style = {{flex: 1, width: Dimensions.get('window').width*0.95, height: Dimensions.get('window').height*0.9}} source = {item.base64 == null ? ImagemCamera : item} resizeMode = {item.base64 == null ? 'center' : 'contain'}
            />}
            {item.base64 == null &&
              <Cam width = {Dimensions.get('window').width * 0.95} height = {Dimensions.get('window').height*0.9} style = {{flex: 1}}
            />}
          </TouchableOpacity>}
          {item.habilitar_camera == true && 
            <>
              <RNCamera
                ref = {ref => {this.camera = ref}}
                style = {styles.preview}
                type = {this.state.cameraType}
                flashMode ={ this.state.FlashCamera}
                autoFocus = {RNCamera.Constants.AutoFocus.on}
                ratio = {"4:3"}
                whiteBalance = {"auto"}
                captureAudio = {false}
                androidCameraPermissionOptions = {{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                androidRecordAudioPermissionOptions = {{
                  title: 'Permission to use audio recording',
                  message: 'We need your permission to use your audio',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                onGoogleVisionBarcodesDetected = {({ barcodes }) => {
                  console.log(barcodes[0].data);
                }}
                googleVisionBarcodeType = {RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.ALL}
                googleVisionBarcodeMode={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeMode.NORMAL}
                >
                <View style ={{flex: 0, flexDirection: 'row', width: Dimensions.get('window').width, justifyContent: 'space-between', backgroundColor: this.props.StyleGlobal.cores.background}}>
                  <TouchableOpacity 
                    activeOpacity = {1}
                    style = {{flex: 0, marginVertical: 20, alignSelf: 'center', marginLeft: 20}}
                    onPress = { async () => {
                      item.habilitar_camera = false
                      this.setState({imageurl: null, scrollCarouselEnabled: true})
                  }}>
                    <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                      <Icon name = "close" size = {30} color = "#FFFFFF"/>
                      <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: '500', fontSize: 14, textAlign: 'center'}}>Cancelar</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    activeOpacity = {1}
                    onPress = { async () => {
                      // await this.takePicture(this.camera)

                      if(this.camera) {
                        const options = {
                          quality: 0.5,
                          base64: true,
                          fixOrientation: true,
                          skipProcessing: true,
                        };
                        const data = await this.camera.takePictureAsync(options);
                        item.base64 = data.base64;
                        item.deviceOrientation = data.deviceOrientation;
                        item.height = data.height;
                        item.pictureOrientation = data.pictureOrientation;
                        item.uri = data.uri;
                        item.width = data.width;
                      }

                      item.habilitar_camera = false
                      this.setState({imageurl: null, scrollCarouselEnabled: true})
                  }}
                    style={styles.capture}>
                  {this.state.indicatorCamera == false && <Icon name="radio-button-checked" size={55} color="#FFFFFF"/>}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    activeOpacity = {1}
                    onPress = { async () => {
                      if(this.state.FlashCamera == RNCamera.Constants.FlashMode.off)
                      {
                        await this.setState({FlashCamera: RNCamera.Constants.FlashMode.on})
                      }
                      else
                      {
                        await this.setState({FlashCamera: RNCamera.Constants.FlashMode.off})
                      }
                    }}
                    style = {{flex: 0, marginVertical: 20, alignSelf: 'center', marginRight: 20}}>
                  {this.state.indicatorCamera == false && <Icon name="flash-on" size={30} color="#FFFFFF"/>}
                  </TouchableOpacity>
                </View>
              </RNCamera>
            </>}
        </View>
        <View style = {{position: 'absolute', justifyContent: 'center', alignItems: 'center',
          bottom: 80}}>
          {item.habilitar_camera == false && 
            <Icon name = 'delete' size = {55} color = {'#B15757'} style = {{opacity: 0.75}}
              onPress = { async () => {
                if((item.id).indexOf('RG do Conjugê') != -1) {
                    Alert.alert(
                      'Caro Usuário',
                      'Deseja substituir a foto de RG do Conjugê por uma nova? 🤔',
                      [
                        {
                          text: 'Não',
                          onPress: async () => {

                            this.state.anexosDocumentos = this.state.anexosDocumentos.map((anexo) => {return anexo})
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.Clientes.map(cliente => {
                              if (cliente.FotoIdentidadeConjuge.id == item.id)
                              {
                                cliente.FotoIdentidadeConjuge = {
                                  "id": item.id,
                                  "habilitar_camera": false,
                                  "base64": null, 
                                  "deviceOrientation": null, 
                                  "height": null, 
                                  "pictureOrientation": null, 
                                  "uri": null, 
                                  "width": null,
                                  "isPDF": false,
                                }

                                Anexos[index] = cliente.FotoIdentidadeConjuge
                              }
                            })

                            if (this.state.FotoIdentidadeConjuge.id == item.id)
                            {
                              this.state.FotoIdentidadeConjuge = {
                                "id": item.id,
                                "habilitar_camera": false,
                                "base64": null, 
                                "deviceOrientation": null, 
                                "height": null, 
                                "pictureOrientation": null, 
                                "uri": null, 
                                "width": null,
                                "isPDF": false, 
                              }
  
                              Anexos[index] = this.state.FotoIdentidadeConjuge
                            }

                            // item.habilitar_camera = false
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false

                            await this.setState({anexo_atual: this.state.anexo_atual, imageurl: null, anexosDocumentos: Anexos})

                          },
                          style: 'cancel',
                        },
                        { text: 'Sim',
                          onPress: async () => {
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.Clientes.map(cliente => {
                              if (cliente.FotoIdentidadeConjuge.id == item.id)
                              {
                                cliente.FotoIdentidadeConjuge = {
                                  "id": item.id,
                                  "habilitar_camera": true,
                                  "base64": null, 
                                  "deviceOrientation": null, 
                                  "height": null, 
                                  "pictureOrientation": null, 
                                  "uri": null, 
                                  "width": null,
                                  "isPDF": false, 
                                }
    
                                Anexos[index] = cliente.FotoIdentidadeConjuge
                              }
                            })

                            if (this.state.FotoIdentidadeConjuge.id == item.id)
                            {
                              this.state.FotoIdentidadeConjuge = {
                                "id": item.id,
                                "habilitar_camera": true,
                                "base64": null, 
                                "deviceOrientation": null, 
                                "height": null, 
                                "pictureOrientation": null, 
                                "uri": null, 
                                "width": null,
                                "isPDF": false, 
                              }
  
                              Anexos[index] = this.state.FotoIdentidadeConjuge
                            }

                            // item.habilitar_camera = true
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false

                            await this.setState({imageurl: item, anexo_atual: 'RG do Conjugê', scrollCarouselEnabled: false, anexosDocumentos: Anexos})
                        }}
                      ],
                      {cancelable: false},
                    )
                } else if ((item.id).indexOf('RG') != -1) {
                    Alert.alert(
                      'Caro Usuário',
                      'Deseja substituir a foto do RG por uma nova? 🤔',
                      [
                        {
                          text: 'Não',
                          onPress: async () => {

                            this.state.anexosDocumentos = this.state.anexosDocumentos.map((anexo) => {return anexo})
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.Clientes.map(cliente => {
                              if (cliente.FotoIdentidade.id == item.id)
                              {
                                cliente.FotoIdentidade = {
                                  "id": item.id,
                                  "habilitar_camera": false,
                                  "base64": null, 
                                  "deviceOrientation": null, 
                                  "height": null, 
                                  "pictureOrientation": null, 
                                  "uri": null, 
                                  "width": null,
                                  "isPDF": false,
                                }

                                Anexos[index] = cliente.FotoIdentidade
                              }
                            })

                            if (this.state.FotoIdentidade.id == item.id)
                            {
                              this.state.FotoIdentidade = {
                                "id": item.id,
                                "habilitar_camera": false,
                                "base64": null, 
                                "deviceOrientation": null, 
                                "height": null, 
                                "pictureOrientation": null, 
                                "uri": null, 
                                "width": null,
                                "isPDF": false, 
                              }
  
                              Anexos[index] = this.state.FotoIdentidade
                            }

                            // item.habilitar_camera = false
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false

                            await this.setState({anexo_atual: this.state.anexo_atual, imageurl: null, anexosDocumentos: Anexos})
                          },
                          style: 'cancel',
                        },
                        { text: 'Sim',
                          onPress: async () => {
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.Clientes.map(cliente => {
                              if (cliente.FotoIdentidade.id == item.id)
                              {
                                cliente.FotoIdentidade = {
                                  "id": item.id,
                                  "habilitar_camera": true,
                                  "base64": null, 
                                  "deviceOrientation": null, 
                                  "height": null, 
                                  "pictureOrientation": null, 
                                  "uri": null, 
                                  "width": null,
                                  "isPDF": false, 
                                }
    
                                Anexos[index] = cliente.FotoIdentidade
                              }
                            })

                            if (this.state.FotoIdentidade.id == item.id)
                            {
                              this.state.FotoIdentidade = {
                                "id": item.id,
                                "habilitar_camera": true,
                                "base64": null, 
                                "deviceOrientation": null, 
                                "height": null, 
                                "pictureOrientation": null, 
                                "uri": null, 
                                "width": null,
                                "isPDF": false, 
                              }
  
                              Anexos[index] = this.state.FotoIdentidade
                            }

                            // item.habilitar_camera = true
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false

                            await this.setState({imageurl: item, anexo_atual: 'RG', scrollCarouselEnabled: false, anexosDocumentos: Anexos})
                          }}
                      ],
                      {cancelable: false},
                    )
                } else if ((item.id).indexOf('Estado Civil') != -1) {
                    Alert.alert(
                      'Caro Usuário',
                      'Deseja substituir a foto da Estado Civil por uma nova? 🤔',
                      [
                        {
                          text: 'Não',
                          onPress: async () => {
                            
                            this.state.anexosDocumentos = this.state.anexosDocumentos.map((anexo) => {return anexo})
                            
                            let Anexos = [...this.state.anexosDocumentos]
                            
                            this.state.Clientes.map(cliente => {
                              if (cliente.FotoCertidao.id == item.id)
                              {
                                cliente.FotoCertidao = {
                                  "id": item.id,
                                  "habilitar_camera": false,
                                  "base64": null, 
                                  "deviceOrientation": null, 
                                  "height": null, 
                                  "pictureOrientation": null, 
                                  "uri": null, 
                                  "width": null,
                                  "isPDF": false,
                                }

                                Anexos[index] = cliente.FotoCertidao
                              }
                            })

                            if (this.state.FotoCertidao.id == item.id)
                            {
                              this.state.FotoCertidao = {
                                "id": item.id,
                                "habilitar_camera": false,
                                "base64": null, 
                                "deviceOrientation": null, 
                                "height": null, 
                                "pictureOrientation": null, 
                                "uri": null, 
                                "width": null,
                                "isPDF": false, 
                              }
  
                              Anexos[index] = this.state.FotoCertidao
                            }

                            // item.habilitar_camera = false
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false
                            
                            await this.setState({anexo_atual: this.state.anexo_atual, imageurl: null, anexosDocumentos: Anexos})
                          },
                          style: 'cancel',
                        },
                        { text: 'Sim',
                          onPress: async () => {
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.Clientes.map(cliente => {
                              if (cliente.FotoCertidao.id == item.id)
                              {
                                cliente.FotoCertidao = {
                                  "id": item.id,
                                  "habilitar_camera": true,
                                  "base64": null, 
                                  "deviceOrientation": null, 
                                  "height": null, 
                                  "pictureOrientation": null, 
                                  "uri": null, 
                                  "width": null,
                                  "isPDF": false, 
                                }
    
                                Anexos[index] = cliente.FotoCertidao
                              }
                            })

                            if (this.state.FotoCertidao.id == item.id)
                            {
                              this.state.FotoCertidao = {
                                "id": item.id,
                                "habilitar_camera": true,
                                "base64": null, 
                                "deviceOrientation": null, 
                                "height": null, 
                                "pictureOrientation": null, 
                                "uri": null, 
                                "width": null,
                                "isPDF": false, 
                              }
  
                              Anexos[index] = this.state.FotoCertidao
                            }

                            // item.habilitar_camera = true
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false

                            await this.setState({imageurl: item, anexo_atual: 'Estado Civil', scrollCarouselEnabled: false, anexosDocumentos: Anexos})
                        }}
                      ],
                      {cancelable: false},
                    )
                } else if ((item.id).indexOf('Comprovante end.') != -1) {
                    Alert.alert(
                      'Caro Usuário',
                      'Deseja substituir a foto do Comprovante end. por uma nova? 🤔',
                      [
                        {
                          text: 'Não',
                          onPress: async () => {

                            this.state.anexosDocumentos = this.state.anexosDocumentos.map((anexo) => {return anexo})

                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.Clientes.map(cliente => {
                              if (cliente.FotoEndereco.id == item.id)
                              {
                                cliente.FotoEndereco = {
                                  "id": item.id,
                                  "habilitar_camera": false,
                                  "base64": null, 
                                  "deviceOrientation": null, 
                                  "height": null, 
                                  "pictureOrientation": null, 
                                  "uri": null, 
                                  "width": null,
                                  "isPDF": false,
                                }

                                Anexos[index] = cliente.FotoEndereco
                              }
                            })

                            if (this.state.FotoEndereco.id == item.id)
                            {
                              this.state.FotoEndereco = {
                                "id": item.id,
                                "habilitar_camera": false,
                                "base64": null, 
                                "deviceOrientation": null, 
                                "height": null, 
                                "pictureOrientation": null, 
                                "uri": null, 
                                "width": null,
                                "isPDF": false, 
                              }
  
                              Anexos[index] = this.state.FotoEndereco
                            }

                            // item.habilitar_camera = false
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false
                            
                            await this.setState({anexo_atual: this.state.anexo_atual, imageurl: null, anexosDocumentos: Anexos})
                          },
                          style: 'cancel',
                        },
                        { text: 'Sim',
                          onPress: async () => {
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.Clientes.map(cliente => {
                              if (cliente.FotoEndereco.id == item.id)
                              {
                                cliente.FotoEndereco = {
                                  "id": item.id,
                                  "habilitar_camera": true,
                                  "base64": null, 
                                  "deviceOrientation": null, 
                                  "height": null, 
                                  "pictureOrientation": null, 
                                  "uri": null, 
                                  "width": null,
                                  "isPDF": false, 
                                }
    
                                Anexos[index] = cliente.FotoEndereco
                              }
                            })

                            if (this.state.FotoEndereco.id == item.id)
                            {
                              this.state.FotoEndereco = {
                                "id": item.id,
                                "habilitar_camera": true,
                                "base64": null, 
                                "deviceOrientation": null, 
                                "height": null, 
                                "pictureOrientation": null, 
                                "uri": null, 
                                "width": null,
                                "isPDF": false, 
                              }
  
                              Anexos[index] = this.state.FotoEndereco
                            }
                            
                            // item.habilitar_camera = true
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false
                            
                            await this.setState({imageurl: item, anexo_atual: 'Comprovante end.', scrollCarouselEnabled: false, anexosDocumentos: Anexos})
                        }}
                      ],
                      {cancelable: false},
                    )
            }}}/>}
        </View>
      </View>
    );
  }
  //#endregion

  //#region Tirando a foto
  takePicture = async () => {
    if(this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        fixOrientation: true,
        skipProcessing: true,
      };
      const data = await this.camera.takePictureAsync(options);
      this.state.imageurl.base64 = data.base64;
      this.state.imageurl.deviceOrientation = data.deviceOrientation;
      this.state.imageurl.height = data.height;
      this.state.imageurl.pictureOrientation = data.pictureOrientation;
      this.state.imageurl.uri = data.uri;
      this.state.imageurl.width = data.width;
    }
  }
  //#endregion

  //#region Carregando anexos
  anexos = async () => {
    this.state.anexosDocumentos = []
    if(this.state.FotoIdentidade.base64 != null || this.state.FotoIdentidade.base64 == null ) {
      this.state.anexosDocumentos.push(this.state.FotoIdentidade);
    }
    if((this.state.StatusCivil == 2 || this.state.StatusCivil == 7) && (this.state.FotoIdentidadeConjuge.base64 != null || this.state.FotoIdentidadeConjuge.base64 == null)) {
      this.state.anexosDocumentos.push(this.state.FotoIdentidadeConjuge);
    }
    if((this.state.FotoCertidao.base64 != null || this.state.FotoCertidao.base64 == null)) {
      this.state.anexosDocumentos.push(this.state.FotoCertidao);
    }
    if(this.state.FotoEndereco.base64 != null || this.state.FotoEndereco.base64 == null) {
      this.state.anexosDocumentos.push(this.state.FotoEndereco);
    }
    if(this.state.Clientes != null) {
      this.state.Clientes.map(cliente => {
        if(cliente.valueSwitch == true) {
          if(cliente.FotoIdentidade.base64 != null || cliente.FotoIdentidade.base64 == null)
          {
            this.state.anexosDocumentos.push(cliente.FotoIdentidade)
          }
          if((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.FotoIdentidadeConjuge.base64 != null || cliente.FotoIdentidadeConjuge.base64 == null)) 
          {
            this.state.anexosDocumentos.push(cliente.FotoIdentidadeConjuge)
          }
          if(cliente.FotoCertidao.base64 != null || cliente.FotoCertidao.base64 == null)
          {
            this.state.anexosDocumentos.push(cliente.FotoCertidao)
          }
          if(cliente.FotoEndereco.base64 != null || cliente.FotoEndereco.base64 == null)
          {
            this.state.anexosDocumentos.push(cliente.FotoEndereco)
          }
        }
      })
    }
  }
  //#endregion

  //#region Função para tirar foto
  _tiraFoto = async (option, Image) => {
    this.state.anexosDocumentos = []
    if(option.indexOf('RG do Conjugê') != -1) {
      Image.habilitar_camera = true
      this.state.anexosDocumentos.push(Image)
    } else if (option.indexOf('RG') != -1) {
      Image.habilitar_camera = true
      this.state.anexosDocumentos.push(Image)
    } else if (option.indexOf('Estado Civil') != -1) {
      Image.habilitar_camera = true
      this.state.anexosDocumentos.push(Image)
    } else if (option.indexOf('Comprovante end.') != -1) {
      Image.habilitar_camera = true
      this.state.anexosDocumentos.push(Image)
    }
  }
  //#endregion

  //#region Mostrar foto
  _mostraFoto = async (option, Image) => {
    this.state.anexosDocumentos = []
    if(option.indexOf('RG do Conjugê') != -1) {
      this.state.anexosDocumentos.push(Image)
    } else if (option.indexOf('RG') != -1) {
      this.state.anexosDocumentos.push(Image)
    } else if (option.indexOf('Estado Civil') != -1) {
      this.state.anexosDocumentos.push(Image)
    } else if (option.indexOf('Comprovante end.') != -1) {
      this.state.anexosDocumentos.push(Image)
    }
  }
  //#endregion

  //#region Setando para tirar foto da identidade
  setandoParaTirarFotoDaIdentidade = async () => {
    if(this.state.FotoIdentidade.base64 ==  null) {
      this._tiraFoto('RG', this.state.FotoIdentidade);
      this.setState({imageurl: this.state.FotoIdentidade, anexo_atual: 'RG', scrollCarouselEnabled: false});
      this.setVisibilidadeModalAnexos(true);
    } else if(this.state.FotoIdentidade.base64 != null) {
      this._mostraFoto('RG', this.state.FotoIdentidade);
      this.setState({anexo_atual: 'RG'});
      this.setVisibilidadeModalAnexos(true);
    }
  }
  //#endregion

  //#region Setando para tirar foto do estado civil
  setandoParaTirarFotoDaCertidao = async () => {
    if(this.state.FotoCertidao.base64 == null) {
      this._tiraFoto('Estado Civil', this.state.FotoCertidao);
      this.setState({imageurl: this.state.FotoCertidao, anexo_atual: 'Estado Civil', scrollCarouselEnabled: false});
      this.setVisibilidadeModalAnexos(true)
    } else if(this.state.FotoCertidao.base64 != null) {
      this._mostraFoto('Estado Civil', this.state.FotoCertidao);
      this.setState({anexo_atual: 'Estado Civil'});
      this.setVisibilidadeModalAnexos(true);
    }
  }
  //#endregion

  //#region Setando para tirar foto da Identidade do conjuge
  setandoParaTirarFotoDoConjuge = async () => {
    if(this.state.FotoIdentidadeConjuge.base64 == null) {
      this._tiraFoto('RG do Conjugê', this.state.FotoIdentidadeConjuge);
      this.setState({imageurl: this.state.FotoIdentidadeConjuge, anexo_atual: 'RG do Conjugê', scrollCarouselEnabled: false});
      this.setVisibilidadeModalAnexos(true)
    } else if(this.state.FotoIdentidadeConjuge.base64 != null) {
      this._mostraFoto('RG do Conjugê', this.state.FotoIdentidadeConjuge);
      this.setState({anexo_atual: 'RG do Conjugê'});
      this.setVisibilidadeModalAnexos(true);
    }
  }
  //#endregion

  //#region Setando para tirar foto do endereco
  setandoParaTirarFotoDoEndereco = async () => {
    if(this.state.FotoEndereco.base64 == null) {
      this._tiraFoto('Comprovante end.', this.state.FotoEndereco);
      this.setState({imageurl: this.state.FotoEndereco, anexo_atual: 'Comprovante end.', scrollCarouselEnabled: false});
      this.setVisibilidadeModalAnexos(true)
    } else if(this.state.FotoEndereco.base64 != null) {
      this._mostraFoto('Comprovante end.', this.state.FotoEndereco);
      this.setState({anexo_atual: 'Comprovante end.'});
      this.setVisibilidadeModalAnexos(true);
    }
  }
  //#endregion

  //#region Acessando lista de anexos
  acessandoListaDeAnexos = async () => {
    this.anexos();
    this.setState({anexo_atual: this.state.anexosDocumentos[0].id});
    this.setVisibilidadeModalAnexos(true);
  }
  //#endregion

  //#region Escolhendo a opção sim na modal de opcoes
  setandoOpcaoSimNaModalOption = async (option) => {
    if(option == '@deletedadoscliente')
    {
      await this.setState({NomeCliente: null, EmailCliente: null})
      await this.setVisibilidadeModalOption(false)      
      await this.setVisibilidadeModalProcurandoDadosCliente(true)
      await this.pegandoDadosCliente()
    }
    else if (option == '@deletedadosconjuge')
    {
      await this.setState({NomeConjuge: null, EmailConjuge: null})      
      await this.setVisibilidadeModalOption(false)      
      await this.setVisibilidadeModalProcurandoDadosCliente(true)
      await this.pegandoDadosConjuge()
    }
  }
  //#endregion

  //#region Escolhendo o opção nao na modal de opcoes
  setandoOpcaoNaoNaModalOption = async (option) => {
    if(option == '@deletedadoscliente')
    {
      await this.setVisibilidadeModalOption(false)
      await this.setVisibilidadeModalProcurandoDadosCliente(true)
      await this.pegandoDadosCliente()
    }
    else if (option == '@deletedadosconjuge')
    {      
      await this.setVisibilidadeModalOption(false)
      await this.setVisibilidadeModalProcurandoDadosCliente(true)
      await this.pegandoDadosConjuge()
    }
  }
  //#endregion

  //#region Array email do cliente
  dadosClienteEmail = async () => {
    if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11 && this.state.EmailCliente != null && this.state.EmailCliente != "") {
      this.state.Emails = {
        "classificacao": 1,
        "descricao": this.state.EmailCliente
      }
    } else if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 14 && this.state.EmailCliente != null && this.state.EmailCliente != "") {
      this.state.Emails = {
        "classificacao": 2,
        "descricao": this.state.EmailCliente
      }
    }
  }
  //#endregion

  //#region Array dados do cliente no redux
  dadosClienteRedux = async () => {
    const { addToCliente } = this.props;

    addToCliente (
      {
        Registros: {ID: this.state.ID_cliente, Email: this.state.EmailsClienteExiste, Emails_existentes: this.state.emails_existentes}
      },
      {
        CPF_CNPJ: formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente)
      },
      {
        Data_nasc: formatoDeTexto.DataAPI(this.state.DataCliente)
      },
      {
        Nome: this.state.NomeCliente
      },
      {
        Email: this.state.Emails
      },
      {
        EstadoCivil: this.state.StatusCivil
      },
      {
        RegimeDeBens: this.state.Regime
      },
      {
        RG: this.state.RGCliente
      },
      {
        OrgaoEmissor: this.state.RGOrgaoEmissorCliente
      },
      {
        UFRG: this.state.RGUFCliente
      },
      {
        Ocupacao: this.state.OcupacaoCliente
      },
      {
        Assinatura: this.state.ValueSwitchConjuge
      }
      )
  }
  //#endregion

  //#region Array email do conjuge
  dadosConjugeEmail = async () => {
    if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge).length == 11 && this.state.EmailConjuge != null && this.state.EmailConjuge != "") {
      this.state.EmailsConjuge = {
        "classificacao": 1,
        "descricao": this.state.EmailConjuge
      }
    } else if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge).length == 14 && this.state.EmailConjuge != null && this.state.EmailConjuge != "") {
      this.state.EmailsConjuge = {
        "classificacao": 2,
        "descricao": this.state.EmailConjuge
      }
    }
  }
  //#endregion

  //#region Array dados do conjuge no redux
  dadosConjugeRedux = async () => {
    const { addToConjuge } = this.props;

    addToConjuge (
      {
        Registros: {ID: this.state.ID_conjuge, Email: this.state.EmailsConjugeExiste, Emails_existentes: this.state.emails_Conjuge_existentes}
      },
      {
        CPF_CNPJ_Conjuge: formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge)
      },
      {
        Data_nasc_Conjuge: formatoDeTexto.DataAPI(this.state.DataConjuge)
      },
      {
        Nome_Conjuge: this.state.NomeConjuge
      },
      {
        email_Conjuge: this.state.EmailsConjuge
      },
      {
        RG: this.state.RGConjuge
      },
      {
        OrgaoEmissor: this.state.RGOrgaoEmissorConjuge
      },
      {
        UFRG: this.state.RGUFConjuge
      },
      {
        Ocupacao: this.state.OcupacaoConjuge
      },
      )
  }
  //#endregion

  //#region Array dados do endereco no redux
  dadosEnderecoRedux = async () => {
    const { addToEndereco } = this.props;
    if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11) {
      addToEndereco(
        {
          Registro: this.state.EnderecoClienteExiste
        },
        {
          "classificacao": 1,
          "logradouro": this.state.Rua,
          "numero": this.state.Numero,
          "complemento": this.state.Complemento == "" ? null : this.state.Complemento,
          "bairro": this.state.Bairro,
          "cidade": this.state.Cidade,
          "uf": this.state.Estado,
          "cep": formatoDeTexto.CEPOriginal(this.state.CEP)
        }
      )
    } else if (formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 14) {
      addToEndereco(
        {
          Registro: this.state.EnderecoClienteExiste
        },
        {
          "classificacao": 2,
          "logradouro": this.state.Rua,
          "numero": this.state.Numero,
          "complemento": this.state.Complemento == "" ? null : this.state.Complemento,
          "bairro": this.state.Bairro,
          "cidade": this.state.Cidade,
          "uf": this.state.Estado,
          "cep": formatoDeTexto.CEPOriginal(this.state.CEP)
        }
      )
    }
  }
  //#endregion

  //#region Array dados dos telefones
  dadosTelefones = async () => {
    this.state.Telefones = []
    if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11 
      && this.state.Telefone != null && this.state.Telefone != "" && this.state.Telefones.length == 0) {
      const Telefone = formatoDeTexto.TelefoneOriginal(this.state.Telefone);
      const ddd = Telefone.substr(0, 2);
      const number = Telefone.substr(2, 9);
      this.state.Telefones.push({
        "classificacao": 1,
        "ddi": "55",
        "ddd": ddd,
        "numero": number,
        "observacao": "Telefone principal",
      })
    }
    if(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 14 
      && this.state.Telefone != null && this.state.Telefone != "" && this.state.Telefone.length == 0) {
      const Telefone = formatoDeTexto.TelefoneOriginal(this.state.Telefone);
      const ddd = Telefone.substr(0, 2);
      const number = Telefone.substr(2, 9);
      this.state.Telefones.push({
        "classificacao": 2,
        "ddi": "55",
        "ddd": ddd,
        "numero": number,
        "observacao": "Telefone principal",
      })
    }
    if(this.state.TelefoneComercial != null && this.state.TelefoneComercial != "" && this.state.Telefones.length < 2) {
      const Telefone = formatoDeTexto.TelefoneOriginal(this.state.TelefoneComercial);
      const ddd = Telefone.substr(0, 2);
      const number = Telefone.substr(2, 9);
      this.state.Telefones.push({
        "classificacao": 3,
        "ddi": "55",
        "ddd": ddd,
        "numero": number,
        "observacao": "Telefone p/ recado",
      })
    }
  }
  //#endregion

  //#region Array telefones
  dadosTelefonesArray = async (CPF, TelP, TelC) => {
    const TelefonesLista = []
    if(formatoDeTexto.CPF_CNPJOriginal(CPF) != null && formatoDeTexto.CPF_CNPJOriginal(CPF).length == 11 
      && TelP != null && TelP != "" && TelP.length == 0) {
      const Telefone = formatoDeTexto.TelefoneOriginal(Tel);
      const ddd = Telefone.substr(0, 2);
      const number = Telefone.substr(2, 9);
      TelefonesLista.push({
        "classificacao": 1,
        "ddi": "55",
        "ddd": ddd,
        "numero": number,
        "observacao": "Telefone principal",
      })
    }
    if(formatoDeTexto.CPF_CNPJOriginal(CPF) != null && formatoDeTexto.CPF_CNPJOriginal(CPF).length == 14 
      && TelP != null && TelP != "" && TelP.length == 0) {
      const Telefone = formatoDeTexto.TelefoneOriginal(TelP);
      const ddd = Telefone.substr(0, 2);
      const number = Telefone.substr(2, 9);
      TelefonesLista.push({
        "classificacao": 2,
        "ddi": "55",
        "ddd": ddd,
        "numero": number,
        "observacao": "Telefone principal",
      })
    }
    if(TelC != null && TelC != "" && TelC.length < 2) {
      const Telefone = formatoDeTexto.TelefoneOriginal(TelC);
      const ddd = Telefone.substr(0, 2);
      const number = Telefone.substr(2, 9);
      TelefonesLista.push({
        "classificacao": 3,
        "ddi": "55",
        "ddd": ddd,
        "numero": number,
        "observacao": "Telefone p/ recado",
      })
    }
    return TelefonesLista;
  }
  //#endregion

  //#region Array dados dos telefones no redux
  dadosTelefonesRedux = async () => {
    const { addToTelefones } = this.props;

    addToTelefones({ Registros: { Telefones: { Principal: this.state.TelefonePrincipalExiste, Recado: this.state.TelefoneRecadoExiste }, Telefones_existentes: this.state.Telefones_existentes }}, { Telefones: this.state.Telefones })
  }
  //#endregion

  //#region Array dos documentos originais
  documentosOriginais = async () => {
    this.state.DocumentosOriginais = []
    this.state.DocumentosOriginaisLista = []
    if (this.state.FotoIdentidade.base64 != null) {
      this.state.DocumentosOriginais.push(this.state.FotoIdentidade)
      this.state.DocumentosOriginaisLista.push(this.state.FotoIdentidade)
    }
    if (this.state.StatusCivil == 2 && this.state.FotoIdentidadeConjuge.base64 != null) { 
      this.state.DocumentosOriginais.push(this.state.FotoIdentidadeConjuge)
      this.state.DocumentosOriginaisLista.push(this.state.FotoIdentidadeConjuge)
    }
    if (this.state.FotoEndereco.base64 != null) {
      this.state.DocumentosOriginais.push(this.state.FotoEndereco)
      this.state.DocumentosOriginaisLista.push(this.state.FotoEndereco)
    }
    if (this.state.FotoCertidao.base64 != null) {
      this.state.DocumentosOriginais.push(this.state.FotoCertidao)
      this.state.DocumentosOriginaisLista.push(this.state.FotoCertidao)
    }
    if(this.state.Clientes != null) {
      this.state.Clientes.map(cliente => {
        if(cliente.valueSwitch == true) {
          if(cliente.FotoIdentidade.base64 != null)
          {
            this.state.DocumentosOriginaisLista.push(cliente.FotoIdentidade)
          }
          if(cliente.StatusCivil == 2 && (cliente.FotoIdentidadeConjuge.base64 != null))
          {
            this.state.DocumentosOriginaisLista.push(cliente.FotoIdentidadeConjuge)
          }
          if(cliente.FotoCertidao.base64 != null)
          {
            this.state.DocumentosOriginaisLista.push(cliente.FotoCertidao)
          }
          if(cliente.FotoEndereco.base64 != null)
          {
            this.state.DocumentosOriginaisLista.push(cliente.FotoEndereco)
          }
        }
      })
    }
  }
  //#endregion

  //#region Array dos documentos originais no redux
  documentosOriginaisRedux = async () => {
    const { addToDocumentosOriginais, addToDocumentosOriginaisLista } = this.props;

    addToDocumentosOriginais(this.state.DocumentosOriginais)
    addToDocumentosOriginaisLista(this.state.DocumentosOriginaisLista)
  }
  //#endregion

  //#region Array dos documentos do cliente
  dadosDocumentos = async () => {
    this.state.Documentos = []
    if(this.state.FotoIdentidade.base64 != null) {
      if ((this.state.FotoIdentidade.uri).indexOf('data:image/') === -1) {
          this.state.Documentos.push({
                          "classificacao": 1,
                          "arquivo": this.state.FotoIdentidade.base64,
                          "descricao": "Documento de identificacao",
                          "extensao": this.state.FotoIdentidade.uri.substr((this.state.FotoIdentidade.uri).lastIndexOf(".") + 1, this.state.FotoIdentidade.uri.length - (this.state.FotoIdentidade.uri).lastIndexOf(".")),
                        })
      } else {
          this.state.Documentos.push({
                          "classificacao": 1,
                          "arquivo": this.state.FotoIdentidade.base64,
                          "descricao": "Documento de identificacao",
                          "extensao": this.state.FotoIdentidade.extensao,
                        })
      }
    }
    if(this.state.FotoEndereco.base64 != null) {
      if ((this.state.FotoEndereco.uri).indexOf('data:image/') === -1) {
          this.state.Documentos.push({
                          "classificacao": 2,
                          "arquivo": this.state.FotoEndereco.base64,
                          "descricao": "Comprovante de endereco",
                          "extensao": this.state.FotoEndereco.uri.substr((this.state.FotoEndereco.uri).lastIndexOf(".") + 1, this.state.FotoEndereco.uri.length - (this.state.FotoEndereco.uri).lastIndexOf(".")),
                        })
      } else {
          this.state.Documentos.push({
                          "classificacao": 2,
                          "arquivo": this.state.FotoEndereco.base64,
                          "descricao": "Comprovante de endereco",
                          "extensao": this.state.FotoEndereco.extensao,
                        })
      }
    }
    if(this.state.StatusCivil > 0 && this.state.FotoCertidao.base64 != null) {
      if ((this.state.FotoCertidao.uri).indexOf('data:image/') === -1) {
        this.state.Documentos.push({
                          "classificacao": 3,
                          "arquivo": this.state.FotoCertidao.base64,
                          "descricao": "Comprovante de estado civil",
                          "extensao": this.state.FotoCertidao.uri.substr((this.state.FotoCertidao.uri).lastIndexOf(".") + 1, this.state.FotoCertidao.uri.length - (this.state.FotoCertidao.uri).lastIndexOf(".")),
                        })
      } else {
        this.state.Documentos.push({
                          "classificacao": 3,
                          "arquivo": this.state.FotoCertidao.base64,
                          "descricao": "Comprovante de estado civil",
                          "extensao": this.state.FotoCertidao.extensao,
                        })
      }
    }
  }
  //#endregion

  //#region Array dos documentos do cliente no redux
  dadosDocumentosRedux = async () => {
    const { addToDocumentos } = this.props;
    
    addToDocumentos({ Registros: { RG: this.state.DocumentoClienteRGExiste, Certidao: this.state.DocumentoClienteCertidaoExiste, Endereco: this.state.DocumentoClienteEnderecoExiste } },{ Documentos: this.state.Documentos });
  }
  //#endregion

  //#region Array dos documentos do conjuge
  dadosDocumentosConjuge = async () => {
    this.state.DocumentosConjuge = []
    if(this.state.FotoIdentidadeConjuge.base64 != null) {
      if ((this.state.FotoIdentidadeConjuge.uri).indexOf('data:image/') === -1) {
        this.state.DocumentosConjuge.push({
                            "classificacao": 1,
                            "arquivo": this.state.FotoIdentidadeConjuge.base64,
                            "descricao": "Documento de identificacao",
                            "extensao": this.state.FotoIdentidadeConjuge.uri.substr((this.state.FotoIdentidadeConjuge.uri).lastIndexOf(".") + 1, this.state.FotoIdentidadeConjuge.uri.length - (this.state.FotoIdentidadeConjuge.uri).lastIndexOf(".")),
                          })
      } else {
        this.state.DocumentosConjuge.push({
                            "classificacao": 1,
                            "arquivo": this.state.FotoIdentidadeConjuge.base64,
                            "descricao": "Comprovante de identificacao",
                            "extensao": this.state.FotoIdentidadeConjuge.extensao,
                          })
      }
    }
  }
  //#endregion

  //#region Array dos documentos do conjuge no redux
  dadosDocumentosConjugeRedux = async () => {
    const { addToDocumentosConjuge } = this.props;

    addToDocumentosConjuge({ Registro: this.state.DocumentoConjugeRGExiste },{ Documentos: this.state.DocumentosConjuge });
  }
  //#endregion

  //#region Array dos dados do prospect
  dadosProspect = async () => {
    this.state.dadosProspect = [{
      "id": this.props.Lead[0].id,
      "cpf": formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente),
      "nome": this.state.NomeCliente,
      "dataDeNascimento": formatoDeTexto.DataJSON(this.state.DataCliente),
      "idade": null,
      "nacionalidade": (this.props.EmpresaLogada[0] == 4 && this.state.NacionalidadeCliente.id != null) ? this.state.NacionalidadeCliente : null,
      "sexo": (this.props.EmpresaLogada[0] == 8 && this.state.SexoCliente.id != null) ? this.state.SexoCliente.id : null,
      "emails": [this.state.Emails],
      "fotoDoProspect": null,
      "documentoPessoal": (this.state.Documentos != "" && this.state.Documentos.filter(documentos => documentos.classificacao == 1) != "") ? this.state.Documentos.filter(documento => documento.classificacao == 1)[0] : null,
      "rg": {
        "numero": this.state.RGCliente,
        "orgaoEmissor": this.state.RGOrgaoEmissorCliente,
        "uf": this.state.RGUFCliente
      },
      "estadoCivil": this.state.StatusCivil,
      "documentoDeEstadoCivil": (this.state.Documentos != "" && this.state.Documentos.filter(documentos => documentos.classificacao == 3) != "") ? this.state.Documentos.filter(documento => documento.classificacao == 3)[0] : null,
      "regimeDeBens": (this.state.StatusCivil == 2 || this.state.StatusCivil == 7) ? this.state.Regime : null,
      "ocupacao": this.state.OcupacaoCliente,
      "renda": (this.props.EmpresaLogada[0] == 8 && formatoDeTexto.DesformatarTexto(this.state.RendaCliente) > 0 && this.state.RendaCliente != "") ? this.state.RendaCliente : null,
      "dadosDosVeiculos": null,
      "dependentes": (((this.state.StatusCivil == 2 || this.state.StatusCivil == 7) && this.state.NomeConjuge != null && this.state.NomeConjuge != "") ||
        ((this.state.StatusCivil == 2 || this.state.StatusCivil == 7) && (this.state.NomeConjuge != null && this.state.NomeConjuge != "" && (
          (this.state.CPFConjuge != null && this.state.CPFConjuge != "") ||
          (this.state.DataConjuge != null && this.state.DataConjuge != "") ||
          (this.state.RGConjuge != null && this.state.RGConjuge != "") ||
          (this.state.OcupacaoConjuge != null && this.state.OcupacaoConjuge != "") ||
          (this.state.EmailConjuge != null && this.state.EmailConjuge != "")          
        )))) ? [
        {
          "classificacao": 1,
          "cpf": (this.state.CPFConjuge != null && this.state.CPFConjuge != "") ? formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge) : null,
          "nome": (this.state.NomeConjuge != null && this.state.NomeConjuge != "") ? this.state.NomeConjuge : null,
          "dataDeNascimento": (this.state.DataConjuge != null && this.state.DataConjuge != "") ? formatoDeTexto.DataJSON(this.state.DataConjuge) : null,
          "idade": null,
          "nacionalidade": (this.props.EmpresaLogada[0] == 4 && this.state.NacionalidadeConjuge.id != null) ? this.state.NacionalidadeConjuge : null,
          "sexo": (this.props.EmpresaLogada[0] == 8 && this.state.SexoConjuge.id != null) ? this.state.SexoConjuge.id : null,
          "rg": {
            "numero": (this.state.RGConjuge != null && this.state.RGConjuge != "") ? this.state.RGConjuge : null,
            "orgaoEmissor": (this.state.RGOrgaoEmissorConjuge != null && this.state.RGOrgaoEmissorConjuge != "") ? this.state.RGOrgaoEmissorConjuge : null,
            "uf": (this.state.RGUFConjuge != null && this.state.RGUFConjuge != "") ? this.state.RGUFConjuge : null,
          },
          "ocupacao": (this.state.OcupacaoConjuge != null && this.state.OcupacaoConjuge != "") ? this.state.OcupacaoConjuge : null,
          "renda": (this.props.EmpresaLogada[0] == 8 && formatoDeTexto.DesformatarTexto(this.state.RendaConjuge) > 0 && this.state.RendaConjuge != "") ? this.state.RendaConjuge : null,
          "email": (this.state.EmailConjuge != null && this.state.EmailConjuge != "") ? this.state.EmailConjuge : null,
          "telefones": null,
          "fotoDoDependente": this.state.DocumentosConjuge != "" ? this.state.DocumentosConjuge[0] : null,
        }
      ] : null,
      "endereco": {
        "classificacao": (formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11) ? 1 : 2,
        "logradouro": this.state.Rua,
        "numero": this.state.Numero,
        "complemento": this.state.Complemento == "" ? null : this.state.Complemento,
        "bairro": this.state.Bairro,
        "cidade": this.state.Cidade,
        "uf": this.state.Estado,
        "cep": formatoDeTexto.CEPOriginal(this.state.CEP)
      },
      "documentoEndereco": (this.state.Documentos != "" && this.state.Documentos.filter(documentos => documentos.classificacao == 2) != "") ? this.state.Documentos.filter(documento => documento.classificacao == 2)[0] : null,
      "telefones": this.state.Telefones,
      "localDeCaptacao": this.props.Lead[0].localDeCaptacao,
      "status": 0,
      "alturaDoItem": 70,
      "pessoa": {
        "id": this.state.ID_cliente,
        "cpf": formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente),
        "nome": this.state.NomeCliente,
        "natureza": 2,
        "dataDeNascimento": formatoDeTexto.DataJSON(this.state.DataCliente),
        "emails": [this.state.Emails],
        "documentoPessoal": (this.state.Documentos != "" && this.state.Documentos.filter(documentos => documentos.classificacao == 1) != "") ? this.state.Documentos.filter(documento => documento.classificacao == 1)[0] : null,
        "rg": {
          "numero": this.state.RGCliente,
          "orgaoEmissor": this.state.RGOrgaoEmissorCliente,
          "uf": this.state.RGUFCliente
        },
        "creci": null,
        "estadoCivil": this.state.StatusCivil,
        "documentoDeEstadoCivil": (this.state.Documentos != "" && this.state.Documentos.filter(documentos => documentos.classificacao == 3) != "") ? this.state.Documentos.filter(documento => documento.classificacao == 3)[0] : null,
        "regimeDeBens": this.state.Regime,
        "ocupacao": this.state.OcupacaoCliente,
        "necessarioAssinaturaDoConjuge": this.state.ValueSwitchConjuge,
        "conjuge": ((this.state.StatusCivil == 2 && this.state.NomeConjuge != null && this.state.NomeConjuge != "") ||
          (this.state.StatusCivil == 2 && (this.state.NomeConjuge != null && this.state.NomeConjuge != "" && (
            (this.state.CPFConjuge != null && this.state.CPFConjuge != "") ||
            (this.state.DataConjuge != null && this.state.DataConjuge != "") ||
            (this.state.RGConjuge != null && this.state.RGConjuge != "") ||
            (this.state.OcupacaoConjuge != null && this.state.OcupacaoConjuge != "") ||
            (this.state.EmailConjuge != null && this.state.EmailConjuge != "")          
          )))) ? {
          "id": this.state.ID_conjuge,
          "cpf": (this.state.CPFConjuge != null && this.state.CPFConjuge != "") ? formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge) : null,
          "nome": (this.state.NomeConjuge != null && this.state.NomeConjuge != "") ? this.state.NomeConjuge : null,
          "natureza": 0,
          "dataDeNascimento": (this.state.DataConjuge != null && this.state.DataConjuge != "") ? formatoDeTexto.DataJSON(this.state.DataConjuge) : null,
          "emails": (this.state.EmailConjuge != null && this.state.EmailConjuge != "") ? [this.state.EmailsConjuge] : null,
          "documentoPessoal": this.state.DocumentosConjuge != "" ? this.state.DocumentosConjuge[0] : null,
          "rg": {
            "numero": (this.state.RGConjuge != null && this.state.RGConjuge != "") ? this.state.RGConjuge : null,
            "orgaoEmissor": (this.state.RGOrgaoEmissorConjuge != null && this.state.RGOrgaoEmissorConjuge != "") ? this.state.RGOrgaoEmissorConjuge : null,
            "uf": (this.state.RGUFConjuge != null && this.state.RGUFConjuge != "") ? this.state.RGUFConjuge : null,
          },
          "creci": null,
          "ocupacao": (this.state.OcupacaoConjuge != null && this.state.OcupacaoConjuge != "") ? this.state.OcupacaoConjuge : null,
        } : null,
        "endereco": {
          "classificacao": (formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11) ? 1 : 2,
          "logradouro": this.state.Rua,
          "numero": this.state.Numero,
          "complemento": this.state.Complemento == "" ? null : this.state.Complemento,
          "bairro": this.state.Bairro,
          "cidade": this.state.Cidade,
          "uf": this.state.Estado,
          "cep": formatoDeTexto.CEPOriginal(this.state.CEP)
        },
        "documentoEndereco": (this.state.Documentos != "" && this.state.Documentos.filter(documentos => documentos.classificacao == 2) != "") ? this.state.Documentos.filter(documento => documento.classificacao == 2)[0] : null,
        "telefones": this.state.Telefones
      }
    }]
    await this.state.Clientes.map(async cliente => {
      if(cliente.valueSwitch == true)
      {
        this.state.dadosProspect.push({
          "id": cliente.ID_prospectcliente,
          "cpf": formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente),
          "nome": cliente.NomeCliente,
          "dataDeNascimento": formatoDeTexto.DataJSON(cliente.DataCliente),
          "idade": null,
          "nacionalidade": (this.props.EmpresaLogada[0] == 4 && cliente.NacionalidadeCliente.id != null) ? cliente.NacionalidadeCliente : null,
          "sexo": (this.props.EmpresaLogada[0] == 8 && cliente.SexoCliente.id != null) ? cliente.SexoCliente.id : 0,
          "emails": (formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 11) ? [
            {
              "classificacao": 1,
              "descricao": cliente.EmailCliente
            }
          ] : (formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 14) ? [
            {
              "classificacao": 2,
              "descricao": cliente.EmailCliente
            }
          ] : null,
          "fotoDoProspect": null,
          "documentoPessoal": cliente.FotoIdentidade.base64 != null ? ((cliente.FotoIdentidade.uri).includes('data:image/') ? {
            "classificacao": 1,
            "arquivo": cliente.FotoIdentidade.base64,
            "descricao": "Documento de identificacao",
            "extensao": cliente.FotoIdentidade.extensao,
          } : {
            "classificacao": 1,
            "arquivo": cliente.FotoIdentidade.base64,
            "descricao": "Documento de identificacao",
            "extensao": cliente.FotoIdentidade.uri.substr((cliente.FotoIdentidade.uri).lastIndexOf(".") + 1, cliente.FotoIdentidade.uri.length - (cliente.FotoIdentidade.uri).lastIndexOf(".")),
          }) : null,
          "rg": {
            "numero": cliente.RGCliente,
            "orgaoEmissor": cliente.RGOrgaoEmissorCliente,
            "uf": cliente.RGUFCliente
          },
          "estadoCivil": cliente.StatusCivil,
          "documentoDeEstadoCivil": (cliente.StatusCivil > 0 && cliente.FotoCertidao.base64 != null) ? ((cliente.FotoCertidao.uri).includes('data:image/') ? {
            "classificacao": 3,
            "arquivo": cliente.FotoCertidao.base64,
            "descricao": "Comprovante de estado civil",            
            "extensao": cliente.FotoCertidao.extensao,
          } : {
            "classificacao": 3,
            "arquivo": cliente.FotoCertidao.base64,
            "descricao": "Comprovante de estado civil",
            "extensao": cliente.FotoCertidao.uri.substr((cliente.FotoCertidao.uri).lastIndexOf(".") + 1, cliente.FotoCertidao.uri.length - (cliente.FotoCertidao.uri).lastIndexOf(".")),
          }) : null,
          "regimeDeBens": (cliente.StatusCivil == 2 || cliente.StatusCivil == 7) ? cliente.Regime : null,
          "ocupacao": cliente.OcupacaoCliente,
          "renda": (this.props.EmpresaLogada[0] == 8 && formatoDeTexto.DesformatarTexto(cliente.RendaCliente) > 0 && cliente.RendaCliente != "") ? cliente.RendaCliente : null, 
          "dadosDosVeiculos": null,
          "dependentes": (((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && cliente.NomeConjuge != null && cliente.NomeConjuge != "") ||
            ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.NomeConjuge != null && cliente.NomeConjuge != "" && (
              (cliente.CPFConjuge != null && cliente.CPFConjuge != "") ||
              (cliente.DataConjuge != null && cliente.DataConjuge != "") ||
              (cliente.RGConjuge != null && cliente.RGConjuge != "") ||
              (cliente.OcupacaoConjuge != null && cliente.OcupacaoConjuge != "") ||
              (cliente.EmailConjuge != null && cliente.EmailConjuge != "")          
            )))) ? [
            {
              "classificacao": 1,
              "cpf": (cliente.CPFConjuge != null && cliente.CPFConjuge != "") ? formatoDeTexto.CPF_CNPJOriginal(cliente.CPFConjuge) : null,
              "nome": (cliente.NomeConjuge != null && cliente.NomeConjuge != "") ? cliente.NomeConjuge : null,
              "dataDeNascimento": (cliente.DataConjuge != null && cliente.DataConjuge != "") ? formatoDeTexto.DataJSON(cliente.DataConjuge) : null,
              "idade": null,
              "nacionalidade": (this.props.EmpresaLogada[0] == 4 && cliente.NacionalidadeConjuge.id != null) ? cliente.NacionalidadeConjuge : null,
              "sexo": (this.props.EmpresaLogada[0] == 8 && cliente.SexoConjuge.id != null) ? cliente.SexoConjuge.id : 0,
              "rg": {
                "numero": (cliente.RGConjuge != null && cliente.RGConjuge != "") ? cliente.RGConjuge : null,
                "orgaoEmissor": (cliente.RGOrgaoEmissorConjuge != null && cliente.RGOrgaoEmissorConjuge != "") ? cliente.RGOrgaoEmissorConjuge : null,
                "uf": (cliente.RGUFConjuge != null && cliente.RGUFConjuge != "") ? cliente.RGUFConjuge : null,
              },
              "ocupacao": (cliente.OcupacaoConjuge != null && cliente.OcupacaoConjuge != "") ? cliente.OcupacaoConjuge : null,
              "renda": (this.props.EmpresaLogada[0] == 8 && formatoDeTexto.DesformatarTexto(cliente.RendaConjuge) > 0 && cliente.RendaConjuge != "") ? cliente.RendaConjuge : null,
              "email": (cliente.EmailConjuge != null && cliente.EmailConjuge != "") ? cliente.EmailConjuge : null,
              "telefones": null,
              "fotoDoDependente": (cliente.FotoIdentidadeConjuge.base64 != null) ? ((cliente.FotoIdentidadeConjuge.uri).includes('data:image/') ? {
                "classificacao": 1,
                "arquivo": cliente.FotoIdentidadeConjuge.base64,
                "descricao": "Comprovante de identificacao",
                "extensao": cliente.FotoIdentidadeConjuge.extensao,
              } : {
                "classificacao": 1,
                "arquivo": cliente.FotoIdentidadeConjuge.base64,
                "descricao": "Documento de identificacao",
                "extensao": cliente.FotoIdentidadeConjuge.uri.substr((cliente.FotoIdentidadeConjuge.uri).lastIndexOf(".") + 1, cliente.FotoIdentidadeConjuge.uri.length - (cliente.FotoIdentidadeConjuge.uri).lastIndexOf(".")),
              }) : null,
            }
          ] : null,
          "endereco": {
            "classificacao": (formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 11) ? 1 : 2,
            "logradouro": cliente.Rua,
            "numero": cliente.Numero,
            "complemento": cliente.Complemento == "" ? null : cliente.Complemento,
            "bairro": cliente.Bairro,
            "cidade": cliente.Cidade,
            "uf": cliente.Estado,
            "cep": formatoDeTexto.CEPOriginal(cliente.CEP)
          },
          "documentoEndereco": (cliente.FotoEndereco.base64 != null) ? ((cliente.FotoEndereco.uri).includes('data:image/') ? {
            "classificacao": 2,
            "arquivo": cliente.FotoEndereco.base64,
            "descricao": "Comprovante de endereco",
            "extensao": cliente.FotoEndereco.extensao,
          } : {
            "classificacao": 2,
            "arquivo": cliente.FotoEndereco.base64,
            "descricao": "Comprovante de endereco",
            "extensao": cliente.FotoEndereco.uri.substr((cliente.FotoEndereco.uri).lastIndexOf(".") + 1, cliente.FotoEndereco.uri.length - (cliente.FotoEndereco.uri).lastIndexOf(".")),
          }) : null,
          "telefones": ((formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 11 
          && cliente.Telefone != null && cliente.Telefone != "") && (cliente.TelefoneComercial != null 
          && cliente.TelefoneComercial != "")) ? [{
            "classificacao": 1,
            "ddi": "55",
            "ddd": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(0, 2),
            "numero": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(2, 9),
            "observacao": "Telefone principal",
          }, {
            "classificacao": 3,
            "ddi": "55",
            "ddd": formatoDeTexto.TelefoneOriginal(cliente.TelefoneComercial).substr(0, 2),
            "numero": formatoDeTexto.TelefoneOriginal(cliente.TelefoneComercial).substr(2, 9),
            "observacao": "Telefone p/ recado",
          }] : (((formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 14 
          && cliente.Telefone != null && cliente.Telefone != "") && (cliente.TelefoneComercial != null 
          && cliente.TelefoneComercial != "")) ? [{
            "classificacao": 2,
            "ddi": "55",
            "ddd": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(0, 2),
            "numero": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(2, 9),
            "observacao": "Telefone principal",
          }, {
            "classificacao": 3,
            "ddi": "55",
            "ddd": formatoDeTexto.TelefoneOriginal(cliente.TelefoneComercial).substr(0, 2),
            "numero": formatoDeTexto.TelefoneOriginal(cliente.TelefoneComercial).substr(2, 9),
            "observacao": "Telefone p/ recado",
          }] : ((formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 11 
          && cliente.Telefone != null && cliente.Telefone != "") ? [{
            "classificacao": 1,
            "ddi": "55",
            "ddd": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(0, 2),
            "numero": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(2, 9),
            "observacao": "Telefone principal",
          }] : [{
            "classificacao": 2,
            "ddi": "55",
            "ddd": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(0, 2),
            "numero": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(2, 9),
            "observacao": "Telefone principal",
          }])),
          "localDeCaptacao": this.props.Lead[0].localDeCaptacao,
          "status": 0,
          "alturaDoItem": 70,
          "pessoa": {
            "id": cliente.ID_cliente,
            "cpf": formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente),
            "nome": cliente.NomeCliente,
            "natureza": 2,
            "dataDeNascimento": formatoDeTexto.DataJSON(cliente.DataCliente),
            "emails": (formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 11) ? [
              {
                "classificacao": 1,
                "descricao": cliente.EmailCliente
              }
            ] : (formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 14) ? [
              {
                "classificacao": 2,
                "descricao": cliente.EmailCliente
              }
            ] : null,
            "documentoPessoal": cliente.FotoIdentidade.base64 != null ? ((cliente.FotoIdentidade.uri).includes('data:image/') ? {
              "classificacao": 1,
              "arquivo": cliente.FotoIdentidade.base64,
              "descricao": "Documento de identificacao",
              "extensao": cliente.FotoIdentidade.extensao,
            } : {
              "classificacao": 1,
              "arquivo": cliente.FotoIdentidade.base64,
              "descricao": "Documento de identificacao",
              "extensao": cliente.FotoIdentidade.uri.substr((cliente.FotoIdentidade.uri).lastIndexOf(".") + 1, cliente.FotoIdentidade.uri.length - (cliente.FotoIdentidade.uri).lastIndexOf(".")),
            }) : null,
            "rg": {
              "numero": cliente.RGCliente,
              "orgaoEmissor": cliente.RGOrgaoEmissorCliente,
              "uf": cliente.RGUFCliente
            },
            "creci": null,
            "estadoCivil": cliente.StatusCivil,
            "documentoDeEstadoCivil": (cliente.StatusCivil > 0 && cliente.FotoCertidao.base64 != null) ? ((cliente.FotoCertidao.uri).includes('data:image/') ? {
              "classificacao": 3,
              "arquivo": cliente.FotoCertidao.base64,
              "descricao": "Comprovante de estado civil",            
              "extensao": cliente.FotoCertidao.extensao,
            } : {
              "classificacao": 3,
              "arquivo": cliente.FotoCertidao.base64,
              "descricao": "Comprovante de estado civil",
              "extensao": cliente.FotoCertidao.uri.substr((cliente.FotoCertidao.uri).lastIndexOf(".") + 1, cliente.FotoCertidao.uri.length - (cliente.FotoCertidao.uri).lastIndexOf(".")),
            }) : null,
            "regimeDeBens": cliente.Regime,
            "ocupacao": cliente.OcupacaoCliente,
            "necessarioAssinaturaDoConjuge": cliente.ValueSwitchConjuge,
            "conjuge": ((cliente.StatusCivil == 2 && cliente.NomeConjuge != null && cliente.NomeConjuge != "") ||
              (cliente.StatusCivil == 2 && (cliente.NomeConjuge != null && cliente.NomeConjuge != "" && (
                (cliente.CPFConjuge != null && cliente.CPFConjuge != "") ||
                (cliente.DataConjuge != null && cliente.DataConjuge != "") ||
                (cliente.RGConjuge != null && cliente.RGConjuge != "") ||
                (cliente.OcupacaoConjuge != null && cliente.OcupacaoConjuge != "") ||
                (cliente.EmailConjuge != null && cliente.EmailConjuge != "")          
              )))) ? {
              "id": cliente.ID_conjuge,
              "cpf": (cliente.CPFConjuge != null && cliente.CPFConjuge != "") ? formatoDeTexto.CPF_CNPJOriginal(cliente.CPFConjuge) : null,
              "nome": (cliente.NomeConjuge != null && cliente.NomeConjuge != "") ? cliente.NomeConjuge : null,
              "natureza": 0,
              "dataDeNascimento": (cliente.DataConjuge != null && cliente.DataConjuge != "") ? formatoDeTexto.DataJSON(cliente.DataConjuge) : null,
              "emails": (cliente.EmailConjuge != null && cliente.EmailConjuge != "") ? [this.state.EmailsConjuge] : null,
              "documentoPessoal":  (cliente.FotoIdentidadeConjuge.base64 != null) ? ((cliente.FotoIdentidadeConjuge.uri).includes('data:image/') ? {
                "classificacao": 1,
                "arquivo": cliente.FotoIdentidadeConjuge.base64,
                "descricao": "Comprovante de identificacao",
                "extensao": cliente.FotoIdentidadeConjuge.extensao,
              } : {
                "classificacao": 1,
                "arquivo": cliente.FotoIdentidadeConjuge.base64,
                "descricao": "Documento de identificacao",
                "extensao": cliente.FotoIdentidadeConjuge.uri.substr((cliente.FotoIdentidadeConjuge.uri).lastIndexOf(".") + 1, cliente.FotoIdentidadeConjuge.uri.length - (cliente.FotoIdentidadeConjuge.uri).lastIndexOf(".")),
              }) : null,
              "rg": {
                "numero": (cliente.RGConjuge != null && cliente.RGConjuge != "") ? cliente.RGConjuge : null,
                "orgaoEmissor": (cliente.RGOrgaoEmissorConjuge != null && cliente.RGOrgaoEmissorConjuge != "") ? cliente.RGOrgaoEmissorConjuge : null,
                "uf": (cliente.RGUFConjuge != null && cliente.RGUFConjuge != "") ? cliente.RGUFConjuge : null,
              },
              "creci": null,
              "ocupacao": (cliente.OcupacaoConjuge != null && cliente.OcupacaoConjuge != "") ? cliente.OcupacaoConjuge : null,
            } : null,
            "endereco": {
              "classificacao": (formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 11) ? 1 : 2,
              "logradouro": cliente.Rua,
              "numero": cliente.Numero,
              "complemento": cliente.Complemento == "" ? null : cliente.Complemento,
              "bairro": cliente.Bairro,
              "cidade": cliente.Cidade,
              "uf": cliente.Estado,
              "cep": formatoDeTexto.CEPOriginal(cliente.CEP)
            },
            "documentoEndereco": (cliente.FotoEndereco.base64 != null) ? ((cliente.FotoEndereco.uri).includes('data:image/') ? {
              "classificacao": 2,
              "arquivo": cliente.FotoEndereco.base64,
              "descricao": "Comprovante de endereco",
              "extensao": cliente.FotoEndereco.extensao,
            } : {
              "classificacao": 2,
              "arquivo": cliente.FotoEndereco.base64,
              "descricao": "Comprovante de endereco",
              "extensao": cliente.FotoEndereco.uri.substr((cliente.FotoEndereco.uri).lastIndexOf(".") + 1, cliente.FotoEndereco.uri.length - (cliente.FotoEndereco.uri).lastIndexOf(".")),
            }) : null,
            "telefones": ((formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 11 
            && cliente.Telefone != null && cliente.Telefone != "") && (cliente.TelefoneComercial != null 
            && cliente.TelefoneComercial != "")) ? [{
              "classificacao": 1,
              "ddi": "55",
              "ddd": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(0, 2),
              "numero": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(2, 9),
              "observacao": "Telefone principal",
            }, {
              "classificacao": 3,
              "ddi": "55",
              "ddd": formatoDeTexto.TelefoneOriginal(cliente.TelefoneComercial).substr(0, 2),
              "numero": formatoDeTexto.TelefoneOriginal(cliente.TelefoneComercial).substr(2, 9),
              "observacao": "Telefone p/ recado",
            }] : (((formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 14 
            && cliente.Telefone != null && cliente.Telefone != "") && (cliente.TelefoneComercial != null 
            && cliente.TelefoneComercial != "")) ? [{
              "classificacao": 2,
              "ddi": "55",
              "ddd": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(0, 2),
              "numero": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(2, 9),
              "observacao": "Telefone principal",
            }, {
              "classificacao": 3,
              "ddi": "55",
              "ddd": formatoDeTexto.TelefoneOriginal(cliente.TelefoneComercial).substr(0, 2),
              "numero": formatoDeTexto.TelefoneOriginal(cliente.TelefoneComercial).substr(2, 9),
              "observacao": "Telefone p/ recado",
            }] : ((formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 11 
            && cliente.Telefone != null && cliente.Telefone != "") ? [{
              "classificacao": 1,
              "ddi": "55",
              "ddd": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(0, 2),
              "numero": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(2, 9),
              "observacao": "Telefone principal",
            }] : [{
              "classificacao": 2,
              "ddi": "55",
              "ddd": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(0, 2),
              "numero": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(2, 9),
              "observacao": "Telefone principal",
            }]))
          }
        })
      }
    })
    // console.log('aaa', JSON.stringify(this.state.dadosProspect))
  }
  //#endregion

  //#region Array dos dados do cliente
  dadosCliente = async () => {
    this.state.dadosClientes = [{
      "id": this.state.ID_cliente,
      "cpf": formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente),
      "nome": this.state.NomeCliente,
      "natureza": 2,
      "dataDeNascimento": formatoDeTexto.DataJSON(this.state.DataCliente),
      "emails": [this.state.Emails],
      "documentoPessoal": (this.state.Documentos != "" && this.state.Documentos.filter(documentos => documentos.classificacao == 1) != "") ? this.state.Documentos.filter(documento => documento.classificacao == 1)[0] : null,
      "rg": {
        "numero": this.state.RGCliente,
        "orgaoEmissor": this.state.RGOrgaoEmissorCliente,
        "uf": this.state.RGUFCliente
      },
      "creci": null,
      "estadoCivil": this.state.StatusCivil,
      "documentoDeEstadoCivil": (this.state.Documentos != "" && this.state.Documentos.filter(documentos => documentos.classificacao == 3) != "") ? this.state.Documentos.filter(documento => documento.classificacao == 3)[0] : null,
      "regimeDeBens": this.state.Regime,
      "ocupacao": this.state.OcupacaoCliente,
      "necessarioAssinaturaDoConjuge": this.state.ValueSwitchConjuge,
      "conjuge": ((this.state.StatusCivil == 2 && this.state.NomeConjuge != null && this.state.NomeConjuge != "") ||
        (this.state.StatusCivil == 2 && (this.state.NomeConjuge != null && this.state.NomeConjuge != "" && (
          (this.state.CPFConjuge != null && this.state.CPFConjuge != "") ||
          (this.state.DataConjuge != null && this.state.DataConjuge != "") ||
          (this.state.RGConjuge != null && this.state.RGConjuge != "") ||
          (this.state.OcupacaoConjuge != null && this.state.OcupacaoConjuge != "") ||
          (this.state.EmailConjuge != null && this.state.EmailConjuge != "")          
        )))) ? {
        "id": this.state.ID_conjuge,
        "cpf": (this.state.CPFConjuge != null && this.state.CPFConjuge != "") ? formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge) : null,
        "nome": (this.state.NomeConjuge != null && this.state.NomeConjuge != "") ? this.state.NomeConjuge : null,
        "natureza": 0,
        "dataDeNascimento": (this.state.DataConjuge != null && this.state.DataConjuge != "") ? formatoDeTexto.DataJSON(this.state.DataConjuge) : null,
        "emails": (this.state.EmailConjuge != null && this.state.EmailConjuge != "") ? [this.state.EmailsConjuge] : null,
        "documentoPessoal": this.state.DocumentosConjuge != "" ? this.state.DocumentosConjuge[0] : null,
        "rg": {
          "numero": (this.state.RGConjuge != null && this.state.RGConjuge != "") ? this.state.RGConjuge : null,
          "orgaoEmissor": (this.state.RGOrgaoEmissorConjuge != null && this.state.RGOrgaoEmissorConjuge != "") ? this.state.RGOrgaoEmissorConjuge : null,
          "uf": (this.state.RGUFConjuge != null && this.state.RGUFConjuge != "") ? this.state.RGUFConjuge : null,
        },
        "creci": null,
        "ocupacao": (this.state.OcupacaoConjuge != null && this.state.OcupacaoConjuge != "") ? this.state.OcupacaoConjuge : null,
      } : null,
      "endereco": {
        "classificacao": (formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente).length == 11) ? 1 : 2,
        "logradouro": this.state.Rua,
        "numero": this.state.Numero,
        "complemento": this.state.Complemento == "" ? null : this.state.Complemento,
        "bairro": this.state.Bairro,
        "cidade": this.state.Cidade,
        "uf": this.state.Estado,
        "cep": formatoDeTexto.CEPOriginal(this.state.CEP)
      },
      "documentoEndereco": (this.state.Documentos != "" && this.state.Documentos.filter(documentos => documentos.classificacao == 2) != "") ? this.state.Documentos.filter(documento => documento.classificacao == 2)[0] : null,
      "telefones": this.state.Telefones
    }]
    await this.state.Clientes.map(async cliente => {
      if(cliente.valueSwitch == true)
      {
        this.state.dadosClientes.push({
          "id": cliente.ID_cliente,
          "cpf": formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente),
          "nome": cliente.NomeCliente,
          "natureza": 2,
          "dataDeNascimento": formatoDeTexto.DataJSON(cliente.DataCliente),
          "emails": (formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 11) ? [
            {
              "classificacao": 1,
              "descricao": cliente.EmailCliente
            }
          ] : (formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 14) ? [
            {
              "classificacao": 2,
              "descricao": cliente.EmailCliente
            }
          ] : null,
          "documentoPessoal": cliente.FotoIdentidade.base64 != null ? ((cliente.FotoIdentidade.uri).includes('data:image/') ? {
            "classificacao": 1,
            "arquivo": cliente.FotoIdentidade.base64,
            "descricao": "Documento de identificacao",
            "extensao": cliente.FotoIdentidade.extensao,
          } : {
            "classificacao": 1,
            "arquivo": cliente.FotoIdentidade.base64,
            "descricao": "Documento de identificacao",
            "extensao": cliente.FotoIdentidade.uri.substr((cliente.FotoIdentidade.uri).lastIndexOf(".") + 1, cliente.FotoIdentidade.uri.length - (cliente.FotoIdentidade.uri).lastIndexOf(".")),
          }) : null,
          "rg": {
            "numero": cliente.RGCliente,
            "orgaoEmissor": cliente.RGOrgaoEmissorCliente,
            "uf": cliente.RGUFCliente
          },
          "creci": null,
          "estadoCivil": cliente.StatusCivil,
          "documentoDeEstadoCivil": (cliente.StatusCivil > 0 && cliente.FotoCertidao.base64 != null) ? ((cliente.FotoCertidao.uri).includes('data:image/') ? {
            "classificacao": 3,
            "arquivo": cliente.FotoCertidao.base64,
            "descricao": "Comprovante de estado civil",            
            "extensao": cliente.FotoCertidao.extensao,
          } : {
            "classificacao": 3,
            "arquivo": cliente.FotoCertidao.base64,
            "descricao": "Comprovante de estado civil",
            "extensao": cliente.FotoCertidao.uri.substr((cliente.FotoCertidao.uri).lastIndexOf(".") + 1, cliente.FotoCertidao.uri.length - (cliente.FotoCertidao.uri).lastIndexOf(".")),
          }) : null,
          "regimeDeBens": cliente.StatusCivil == 2 ? cliente.Regime : null,
          "ocupacao": cliente.OcupacaoCliente,
          "necessarioAssinaturaDoConjuge": cliente.ValueSwitchConjuge,
          "conjuge": ((cliente.StatusCivil == 2 && cliente.NomeConjuge != null && cliente.NomeConjuge != "") ||
            (cliente.StatusCivil == 2 && (cliente.NomeConjuge != null && cliente.NomeConjuge != "" && (
              (cliente.CPFConjuge != null && cliente.CPFConjuge != "") ||
              (cliente.DataConjuge != null && cliente.DataConjuge != "") ||
              (cliente.RGConjuge != null && cliente.RGConjuge != "") ||
              (cliente.OcupacaoConjuge != null && cliente.OcupacaoConjuge != "") ||
              (cliente.EmailConjuge != null && cliente.EmailConjuge != "")          
            )))) ? {
              "id": cliente.ID_conjuge,
              "cpf": (cliente.CPFConjuge != null && cliente.CPFConjuge != "") ? formatoDeTexto.CPF_CNPJOriginal(cliente.CPFConjuge) : null,
              "nome": (cliente.NomeConjuge != null && cliente.NomeConjuge != "") ? cliente.NomeConjuge : null,
              "natureza": 0,
              "dataDeNascimento": (cliente.DataConjuge != null && cliente.DataConjuge != "") ? formatoDeTexto.DataJSON(cliente.DataConjuge) : null,
              "emails": (formatoDeTexto.CPF_CNPJOriginal(cliente.CPFConjuge) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFConjuge).length == 11) ? [
                {
                  "classificacao": 1,
                  "descricao": cliente.EmailConjuge
                }
              ] : (formatoDeTexto.CPF_CNPJOriginal(cliente.CPFConjuge) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFConjuge).length == 14) ? [
                {
                  "classificacao": 2,
                  "descricao": cliente.EmailConjuge
                }
              ] : null,
              "documentoPessoal": (cliente.FotoIdentidadeConjuge.base64 != null) ? ((cliente.FotoIdentidadeConjuge.uri).includes('data:image/') ? {
                "classificacao": 1,
                "arquivo": cliente.FotoIdentidadeConjuge.base64,
                "descricao": "Comprovante de identificacao",
                "extensao": cliente.FotoIdentidadeConjuge.extensao,
              } : {
                "classificacao": 1,
                "arquivo": cliente.FotoIdentidadeConjuge.base64,
                "descricao": "Documento de identificacao",
                "extensao": cliente.FotoIdentidadeConjuge.uri.substr((cliente.FotoIdentidadeConjuge.uri).lastIndexOf(".") + 1, cliente.FotoIdentidadeConjuge.uri.length - (cliente.FotoIdentidadeConjuge.uri).lastIndexOf(".")),
              }) : null,
              "rg": {
                "numero": (cliente.RGConjuge != null && cliente.RGConjuge != "") ? cliente.RGConjuge : null,
                "orgaoEmissor": (cliente.RGOrgaoEmissorConjuge != null && cliente.RGOrgaoEmissorConjuge != "") ? cliente.RGOrgaoEmissorConjuge : null,
                "uf": (cliente.RGUFConjuge != null && cliente.RGUFConjuge != "") ? cliente.RGUFConjuge : null,
              },
              "creci": null,
              "ocupacao": (cliente.OcupacaoConjuge != null && cliente.OcupacaoConjuge != "") ? cliente.OcupacaoConjuge : null,
            } : null,
          "endereco": {
            "classificacao": (formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 11) ? 1 : 2,
            "logradouro": cliente.Rua,
            "numero": cliente.Numero,
            "complemento": cliente.Complemento == "" ? null : cliente.Complemento,
            "bairro": cliente.Bairro,
            "cidade": cliente.Cidade,
            "uf": cliente.Estado,
            "cep": formatoDeTexto.CEPOriginal(cliente.CEP)
          },
          "documentoEndereco": (cliente.FotoEndereco.base64 != null) ? ((cliente.FotoEndereco.uri).includes('data:image/') ? {
            "classificacao": 2,
            "arquivo": cliente.FotoEndereco.base64,
            "descricao": "Comprovante de endereco",
            "extensao": cliente.FotoEndereco.extensao,
          } : {
            "classificacao": 2,
            "arquivo": cliente.FotoEndereco.base64,
            "descricao": "Comprovante de endereco",
            "extensao": cliente.FotoEndereco.uri.substr((cliente.FotoEndereco.uri).lastIndexOf(".") + 1, cliente.FotoEndereco.uri.length - (cliente.FotoEndereco.uri).lastIndexOf(".")),
          }) : null,
          "telefones": ((formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 11 
          && cliente.Telefone != null && cliente.Telefone != "") && (cliente.TelefoneComercial != null 
          && cliente.TelefoneComercial != "")) ? [{
            "classificacao": 1,
            "ddi": "55",
            "ddd": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(0, 2),
            "numero": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(2, 9),
            "observacao": "Telefone principal",
          }, {
            "classificacao": 3,
            "ddi": "55",
            "ddd": formatoDeTexto.TelefoneOriginal(cliente.TelefoneComercial).substr(0, 2),
            "numero": formatoDeTexto.TelefoneOriginal(cliente.TelefoneComercial).substr(2, 9),
            "observacao": "Telefone p/ recado",
          }] : (((formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 14 
          && cliente.Telefone != null && cliente.Telefone != "") && (cliente.TelefoneComercial != null 
          && cliente.TelefoneComercial != "")) ? [{
            "classificacao": 2,
            "ddi": "55",
            "ddd": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(0, 2),
            "numero": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(2, 9),
            "observacao": "Telefone principal",
          }, {
            "classificacao": 3,
            "ddi": "55",
            "ddd": formatoDeTexto.TelefoneOriginal(cliente.TelefoneComercial).substr(0, 2),
            "numero": formatoDeTexto.TelefoneOriginal(cliente.TelefoneComercial).substr(2, 9),
            "observacao": "Telefone p/ recado",
          }] : ((formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente) != null && formatoDeTexto.CPF_CNPJOriginal(cliente.CPFCliente).length == 11 
          && cliente.Telefone != null && cliente.Telefone != "") ? [{
            "classificacao": 1,
            "ddi": "55",
            "ddd": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(0, 2),
            "numero": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(2, 9),
            "observacao": "Telefone principal",
          }] : [{
            "classificacao": 2,
            "ddi": "55",
            "ddd": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(0, 2),
            "numero": formatoDeTexto.TelefoneOriginal(cliente.Telefone).substr(2, 9),
            "observacao": "Telefone principal",
          }]))
        })
      }
    })
    // console.log('Dados Cliente', JSON.stringify(this.state.dadosClientes))
  }
  //#endregion

  //#region Put dados do prospect
  alterandoDadosProspect = async () => {
    try {
      const response = await Prospect.cadastrarLista(String(this.props.token[0].token), this.state.dadosProspect)
      if(response.status == 200 || response.status == 201)
      {
        await this.postPessoas()
      }
    } catch(err) {
      
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Falha ao tentar atualizar os dados do prospect, tente novamente!`
      })
      await this.mensagemError('Erro ao tentar atualizar o prospect', this.state.dadosProspect);
    }
  }
  //#endregion

  //#region Post Pessoas
  postPessoas = async () => {
    try {
      const response = await Pessoa.cadastrarPessoas(String(this.props.token[0].token), this.state.dadosClientes)
      if(response.status == 200 || response.status == 201)
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Dados do prospect atualizados com sucesso`
        })
        this.props.Proposta[0].prospects = this.state.dadosProspect
        const { addToLead, addToPropostaDeVenda } = this.props;
        addToLead(this.state.dadosProspect)
        addToPropostaDeVenda(this.props.Proposta[0])

        await this.setVisibilidadeModalLoading(false);
        const navegar = await this.props.navigation.getParam('DadosCliente', 'null')
        if (navegar != null && navegar != "")
        {
          return navegar.onConfirm()
        }
      }
    } catch(err) {
      console.log(err)

      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Falha ao tentar atualizar os dados do prospect, tente novamente!`
      })
      await this.mensagemError("Erro ao tentar fazer o POST de pessoa", this.state.dadosClientes)
    }
  }
  //#endregion

  //#region Verificando a existencia de termos vazios na lista de clientes
  validandoListaClientes = async () => {

    var Verf_CPFClientes = null
    var Verf_DataClientes = null
    var Verf_DataClientesInc = null
    var Verf_DataClientesInv = null
    var Verf_DataClientesMar = null
    var Verf_NomeClientes = null
    var Verf_RGClientes = null
    var Verf_RGOrgaoEmissorClientes = null
    var Verf_RGUFClientes = null
    var Verf_CargoClientes = null
    var Verf_RendaClientes = null
    var Verf_NacionalidadeClientes = null
    var Verf_SexoClientes = null
    var Verf_EmailClientes = null
    var Verf_EmailClientesInv = null
    var Verf_StatusCivil = null
    var Verf_RegimeDeBens = null

    var Verf_CPFConjuges = null
    var Verf_DataConjuges = null
    var Verf_DataConjugesInc = null
    var Verf_DataConjugesInv = null
    var Verf_NomeConjuges = null
    var Verf_RGConjuges = null
    var Verf_RGOrgaoEmissorConjuges = null
    var Verf_RGUFConjuges = null
    var Verf_CargoConjuges = null
    var Verf_RendaConjuges = null
    var Verf_NacionalidadeConjuges = null
    var Verf_SexoConjuges = null
    var Verf_EmailConjuges = null
    var Verf_EmailConjugesInv = null
    var Verf_CondNome = null

    var Verf_CEP = null
    var Verf_CEPInv = null
    var Verf_CPEInc = null
    var Verf_Rua = null
    var Verf_Bairro = null
    var Verf_Cidade = null
    var Verf_Estado = null
    var Verf_Telefone = null
    var Verf_TelefoneInv = null
    var Verf_TelefoneComercialInv = null
    var Verf_TelefonesIguais = null

    Verf_CPFClientes = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.CPFCliente == null || cliente.CPFCliente == "")))
    Verf_DataClientes = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.DataCliente == null || cliente.DataCliente == "")))
    Verf_DataClientesInc = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.DataCliente != null && formatoDeTexto.Data(cliente.DataCliente).length != 10)))
    Verf_DataClientesInv = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.DataCliente != null && Validacoes.Data(cliente.DataCliente) == false)))
    Verf_DataClientesMar = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (Validacoes.Maioridade(cliente.DataCliente) == false)))
    Verf_NomeClientes = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.NomeCliente == null || cliente.NomeCliente == "")))
    Verf_RGClientes = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.RGCliente == null || cliente.RGCliente == "")))
    Verf_RGOrgaoEmissorClientes = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.RGOrgaoEmissorCliente == null || cliente.RGOrgaoEmissorCliente == "")))
    Verf_RGUFClientes = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.RGUFCliente == null || cliente.RGUFCliente == "")))
    Verf_CargoClientes = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.CargoCliente == null || cliente.CargoCliente == "")))
    Verf_RendaClientes = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && this.props.EmpresaLogada[0] == 8 && (formatoDeTexto.DesformatarTexto(cliente.RendaCliente) == 0 || cliente.RendaCliente == "")))
    Verf_NacionalidadeClientes = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && this.props.EmpresaLogada[0] == 4 && (cliente.NacionalidadeCliente.id == null)))
    Verf_SexoClientes = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && this.props.EmpresaLogada[0] == 8 && (cliente.SexoCliente.id == null)))
    Verf_EmailClientes = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.EmailCliente == null || cliente.EmailCliente == "")))
    Verf_EmailClientesInv = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (this.IsEmail(cliente.EmailCliente) == false && (cliente.EmailCliente == null && cliente.EmailCliente == ""))))
    Verf_StatusCivil = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.StatusCivil == null || cliente.StatusCivil == 0)))
    Verf_RegimeDeBens = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.StatusCivil == 2 && (cliente.Regime == null || cliente.Regime == 0))))
    
    Verf_CPFConjuges = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.CPFConjuge == null || cliente.CPFConjuge == ""))))
    Verf_DataConjuges = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.DataConjuge == null || cliente.DataConjuge == ""))))
    Verf_DataConjugesInc = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.DataConjuge != null && formatoDeTexto.Data(cliente.DataConjuge).length != 10))))
    Verf_DataConjugesInv = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.DataConjuge != null && Validacoes.Data(cliente.DataConjuge) == false))))
    Verf_NomeConjuges = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.NomeConjuge == null || cliente.NomeConjuge == ""))))
    Verf_RGConjuges = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.RGConjuge == null || cliente.RGConjuge == ""))))
    Verf_RGOrgaoEmissorConjuges = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && cliente.Regime != null && cliente.Regime != 0 && (cliente.RGOrgaoEmissorConjuge == null || cliente.RGOrgaoEmissorConjuge == ""))))
    Verf_RGUFConjuges = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.RGUFConjuge == null || cliente.RGUFConjuge == ""))))
    Verf_CargoConjuges = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.CargoConjuge == null || cliente.CargoConjuge == ""))))
    Verf_RendaConjuges = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && this.props.EmpresaLogada[0] == 8 && cliente.ValueSwitchConjuge == true && (cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (formatoDeTexto.DesformatarTexto(cliente.RendaConjuge) == 0 && cliente.RendaConjuge == "")))
    Verf_NacionalidadeConjuges = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && this.props.EmpresaLogada[0] == 4 && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.NacionalidadeConjuge.id == null))))
    Verf_SexoConjuges = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && this.props.EmpresaLogada[0] == 8 && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.SexoConjuge.id == null))))
    Verf_EmailConjuges = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.EmailConjuge == null || cliente.EmailConjuge == ""))))
    Verf_EmailConjugesInv = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && ((this.IsEmail(cliente.EmailConjuge) == false) && cliente.EmailConjuge != null && cliente.EmailConjuge != ""))))
    Verf_CondNome = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && cliente.ValueSwitchConjuge == true && ((cliente.StatusCivil == 2 || cliente.StatusCivil == 7) && (cliente.NomeConjuge == null || cliente.NomeConjuge == "") && 
    ((cliente.CPFConjuge != null && cliente.CPFConjuge != "") ||
    (cliente.DataConjuge != null && cliente.DataConjuge != "") ||
    (cliente.EmailConjuge != null && cliente.EmailConjuge != "") ||
    (cliente.RGConjuge != null && cliente.RGConjuge != "" )||
    (cliente.RGOrgaoEmissorConjuge != null && cliente.RGOrgaoEmissorConjuge != "") ||
    (cliente.RGUFConjuge != null && cliente.RGUFConjuge != "") ||
    (cliente.CargoConjuge != null && cliente.CargoConjuge != "")))))

    Verf_CEP = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.CEP == null || cliente.CEP == "")))
    Verf_CEPInv = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.CEP != null && cliente.CEP != "" && this.IsCEP(cliente.CEP) == false)))
    Verf_CPEInc = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.CEP != null && formatoDeTexto.CEPOriginal(cliente.CEP).length != 8)))
    Verf_Rua = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.Rua == null || cliente.Rua == "")))
    Verf_Bairro = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.Bairro == null || cliente.Bairro == "")))
    Verf_Cidade = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.Cidade == null || cliente.Cidade == "")))
    Verf_Estado = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.Estado == null || cliente.Estado == "")))
    Verf_Telefone = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.Telefone == null || cliente.Telefone == "")))
    Verf_TelefoneInv = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && ((cliente.Telefone != "" && cliente.Telefone != null) && (formatoDeTexto.Telefone(cliente.Telefone).length <= 13 || this.Telefone_validation(cliente.Telefone) == false))))
    Verf_TelefoneComercialInv = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && ((cliente.TelefoneComercial != "" && cliente.TelefoneComercial != null) && (formatoDeTexto.Telefone(cliente.TelefoneComercial).length <= 13 || this.Telefone_validation(cliente.TelefoneComercial) == false))))
    Verf_TelefonesIguais = await this.state.Clientes.filter(cliente => (cliente.valueSwitch == true && (cliente.Telefone == cliente.TelefoneComercial)))

    if (Verf_CPFClientes != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os CPF's.`
      })
    } else if (Verf_DataClientes != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todas as datas de Nascimento do clientes.`
      })
    } else if(Verf_DataClientesInc != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Existem datas de nascimento incorretas dos clientes.`
        })
    } else if(Verf_DataClientesInv != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Existem datas de nascimentos inválidas dos clientes.`
      })
    } else if(Verf_DataClientesMar != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Existem idades dos clientes que não que atigem o minímo necessário.`
      })
    } else if(Verf_NomeClientes != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os nomes dos clientes.`
      })
    } else if(Verf_RGClientes != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os RG's dos clientes.`
      })
    } else if(Verf_RGOrgaoEmissorClientes != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os Orgãos emissores dos clientes.`
      })
    } else if(Verf_RGUFClientes != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todas as UF's dos RG's dos clientes.`
      })
    } else if(Verf_CargoClientes != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os cargos dos clientes.`
      })
    } else if(this.props.EmpresaLogada[0] == 8 && Verf_RendaClientes != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos as rendas dos clientes.`
      })
    } else if(this.props.EmpresaLogada[0] == 4 && Verf_NacionalidadeClientes != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos as nacionalidades dos clientes.`
      })
    } else if(this.props.EmpresaLogada[0] == 8 && Verf_SexoClientes != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os sexos dos clientes.`
      })
    } else if(Verf_EmailClientes != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os e-mails dos clientes.`
      })
    } else if(Verf_EmailClientesInv != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Existem e-mails dos clientes inválidos.`
      })
    } else if(Verf_StatusCivil != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Selecione todos os estados civis dos clientes.`
        })
    } else if(Verf_RegimeDeBens != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Selecione todos os regimes de bens.`
        })
    }
    else if(Verf_CPFConjuges != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha todos os CPF's dos conjuges.`
        })
    } else if(Verf_DataConjuges != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha todos as datas de nascimentos dos conjuges.`
        })
    } else if(Verf_DataConjugesInc != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Existem datas de nascimentos dos conjuges incorretas.`
        })
    } else if(Verf_DataConjugesInv != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Existem datas de nascimentos dos conjuges inválidas.`
      })
    } else if(Verf_NomeConjuges != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha todos os nomes dos conjuges.`
        })
    } else if(Verf_RGConjuges != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os RG's dos conjuges.`
      })
    } else if(Verf_RGOrgaoEmissorConjuges != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os orgaos emissores dos conjuges.`
      })
    } else if(Verf_RGUFConjuges != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os UF's dos RG's dos conjuges.`
      })
    } else if(Verf_CargoConjuges != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os cargos dos conjuges.`
      })
    } else if(this.props.EmpresaLogada[0] == 8 && Verf_RendaConjuges != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos as rendas dos conjuges.`
      })
    } else if(this.props.EmpresaLogada[0] == 4 && Verf_NacionalidadeConjuges != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos as nacionalidades dos conjuges.`
      })
    } else if(this.props.EmpresaLogada[0] == 8 && Verf_SexoConjuges != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os sexos dos conjuges.`
      })
    } else if(Verf_EmailConjuges != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha todos os e-mails dos conjuges.`
      })
    } else if(Verf_EmailConjugesInv != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Existem e-mails dos conjuges inválidos.`
      })
    } else if(Verf_CondNome != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Preencha os nomes dos conjugês ou deixe todos os dados deles vazios.`
      })
    }
    else if(Verf_CEP != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha os CEP's`
        })
    } else if(Verf_CEPInv != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Existem CEP's inválidos.`
        })
    } else if(Verf_CPEInc != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Existem CEP's incorretos.`
        })
    } else if(Verf_Rua != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha Rua em todos os clientes.`
        })
    } else if(Verf_Bairro != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha Bairro em todos os clientes.`
        })
    } else if(Verf_Cidade != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha Cidade em todos os clientes.`
        })
    } else if(Verf_Estado != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha UF em todos os clientes.`
        })
    } else if(Verf_Telefone != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Preencha Telefone principal em todos os clientes.`
        })
    } else if(Verf_TelefoneInv != "") {
        return await PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `Existem telefones principais inválidos.`
        })
    } else if(Verf_TelefoneComercialInv != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Existem telefones comerciais inválidos.`
      })
    } else if(Verf_TelefonesIguais != "") {
      return await PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Existem telefones de recados iguais ao principal.`
      })
    } else {
        return await true;
    }

  }
  //#endregion

  //#region Prosseguir para a tela do Quadro Resumo
  prosseguirTelaQuadroResumo = async () => {
    if (await Validacoes.TelaDadosCliente(this.state, this.state.this) == true && (await this.validandoListaClientes()) == true) {
      await this.setVisibilidadeModalLoading(true)
      if (await this.state.VisibilidadeModalLoading == true) {
        setTimeout(async () => {
          await this.dadosClienteEmail();
          await this.dadosConjugeEmail();
          await this.dadosClienteRedux();
          await this.dadosConjugeRedux();
          await this.dadosDocumentosConjuge();
          await this.dadosDocumentosConjugeRedux();
          await this.dadosEnderecoRedux();
          await this.dadosTelefones();
          await this.dadosTelefonesRedux();
          await this.dadosDocumentos();
          await this.dadosDocumentosRedux();
          await this.documentosOriginais();
          await this.documentosOriginaisRedux();          
          await this.dadosCliente();
          await this.dadosProspect();
          await this.alterandoDadosProspect();
        }, 1000)
      }
    }
  }
  //#endregion 

  //#region Mensagem de erro a ser enviada por email
  mensagemError = async (titulo, body) => {
    try {
      const Dados = {
        "destinatario": "lucas@digitalint.com.br",
        "titulo": titulo,
        "mensagem": JSON.stringify(body)
      }
      const response = await Mensagem.NotificacaoEmailExterno(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, Dados)
      if(response.status == 200 || response.status == 201)
      {
        await this.setVisibilidadeModalLoading(false)
      }
    } catch(err) {
      await this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

}
  //#endregion

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
  Lead: state.dadosLead,
  Proposta: state.dadosPropostaDeVenda,
  empresa: state.dadosEmpreendimento.filter(emp => emp.empresa),
  centrodecusto: state.dadosEmpreendimento.filter(emp => emp.centrodecusto),
  listacargos: state.Cargos,
  StyleGlobal: state.StyleGlobal,
  EmpresaLogada: state.EmpresaLogada,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...DadosPropostaDeVendaActions, ...DocumentosOriginaisActions,...DocumentosConjugeActions,...ConjugeActions,...DocumentosActions,...TelefonesActions,...ClienteActions, ...EnderecoActions, ...DadosLeadActions, ...DocumentosOriginaisListaActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DadosCliente);