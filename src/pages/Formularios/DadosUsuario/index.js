//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Alert, StyleSheet, Keyboard, View, Text, Animated, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Modal, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
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
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Pessoa, ReceitaFederal, Correios, Logon, Empresas } from "../../../services";
//#endregion

//#region Redux
import { DadosLeadActions, TelaAtualActions, ClienteActions, ConjugeActions, EnderecoActions, TelefonesActions, DocumentosOriginaisActions, DocumentosActions, DocumentosConjugeActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
//#endregion

//#region Componentes
import { Container, Logo, NomeEmpresa, Header, TextInputNome, TextInputCPF, TextInputData, TextInputEmail, TextInputCEP, TextInputLogradouro, TextInputNumero, TextInputComplemento, TextInputBairro, TextInputCidade, TextInputEstado, TextInputTelefone, TextInputRG, TextInputCRECI, TextInputOrgaoEmissor, TextInputEstadoCivil, TextInputRegimeDeBens, TextInputUFDoRG, TextInputEstadoCRECI, TextInputValidadeCRECI, TextInputCriarSenha, TextInputConfirmarSenha } from '../../../components';
import { ModalSucesso, ModalFalha, ModalEstadoCivil, ModalRegimeDeBens, ModalLoading, ModalEndereco, ModalAnexos, ModalOption, ModalOptionSenha, ModalProcurandoDadosCliente, ModalAviso, ModalUFDoRG, ModalValidandoArquivos, ModalConfirmarDados } from '../../Modais';
import { ClienteView, ConjugeView, EnderecoView, EstadoCivilView, TelefonesView, CRECIView } from './styles';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
import ImagemCamera from '../../../assets/cam.png';
//#endregion

//#endregion

class DadosUsuario extends Component {
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

    await this.setVisibilidadeModalLoading(true)
    await this.pegandoListaEstadosCivis();
  }
  //#endregion

  //#region Component Unmount
  componentWillUnmount() {
    this._isMounted = false;
  }
  //#endregion

  //#region Model
  state = {
    AnimatedHeader: new Animated.Value(1),
    AnimatedDataCliente: new Animated.Value(114),
    AnimatedNomeCliente: new Animated.Value(114),
    AnimatedRGCliente: new  Animated.Value(114),
    AnimatedRGOrgaoEmissorCliente: new Animated.Value(114),
    AnimatedRGUFCliente: new Animated.Value(114),
    AnimatedEmailCliente: new Animated.Value(114),    
    AnimatedDataConjuge: new Animated.Value(114),
    AnimatedNomeConjuge: new Animated.Value(114),
    AnimatedEmailConjuge: new Animated.Value(114),
    AnimatedUFCRECI: new Animated.Value(114),
    AnimatedValidadeCRECI: new Animated.Value(114),
    AnimatedEndereco: new Animated.Value(114),
    AnimatedTelefoneComercial: new Animated.Value(114),
    AnimatedTelefone: new Animated.Value(114),
    VisibilidadeModalLoading: false,
    VisibilidadeModalEstadosCivis: false,
    VisibilidadeModalRegimeDeBens: false,
    VisibilidadeModalEndereco: false,
    VisibilidadeModalAnexos: false,
    VisibilidadeModalOption: false,
    VisibilidadeModalProcurandoDadosCliente: false,
    VisibilidadeModalAviso: false,
    VisibilidadeModalUFDoRG: false,
    VisibilidadeModalValidandoArquivos: false,
    VisibilidadeModalConfirmarDados: false,
    VisibilidadeSecureTextCriarSenha: true,
    VisibilidadeSecureTextConfirmarSenha: true,
    Option: null,
    this: this,
    FlashCamera: RNCamera.Constants.FlashMode.off,
    ModalOptionMensagem: null,
    ModalAvisoMensagem: null,
    modalonPress: () => {},
    EstadosCivis: [],
    RegimesDeBens: [],
    EstadosUFRG: [
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
    Foto: ImagemCamera,
    FotoIdentidade: {
      "id": "RG",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
    },
    FotoIdentidadeConjuge: {
      "id": "RG do Conjugê",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null
    },
    FotoEndereco: {
      "id": "Comprovante end.",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null
    },
    FotoCertidao: {
      "id": "Estado Civil",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null
    },
    ListaEmpresas: [
      {
        id: "GAV Resorts",
        descricao: 'GAV Resorts'
      },
      {
        id: 'Harmonia Urbanismo',
        descricao: 'Harmonia Urbanismo'
      },
      {
        id: 'Silva Branco',
        descricao: 'Silva Branco'
      },
      {
        id: 'Pattro Administradora',
        descricao: 'Pattro Administradora'
      }
    ],
    selectedItems : [],
    CriarSenha: null,
    ConfirmarSenha: null,
    Pessoa: null,
    PessoaConjuge: null,
    dadosCliente: [],
    Emails: [],
    EmailsConjuge: [],
    DadosEndereco: [],
    Telefones: [],
    Telefones_existentes: [],
    DocumentosOriginais: [],
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
    NomeCliente: null,
    CPFCliente: null,
    DataCliente: null,
    RGCliente: null,
    RGOrgaoEmissorCliente: null,
    RGIDUFCliente: null,
    RGUFCliente: null,
    EmailCliente: null,
    NomeConjuge: null,
    CPFConjuge: null,
    DataConjuge: null,
    EmailConjuge: null,
    ValueSwitchConjuge: false,
    NumeroCRECI: null,
    UFCRECI: null,
    ValidadeCRECI: null,
    CEP: null,
    Rua: null,
    Numero: null,
    Complemento: null,
    Bairro: null,
    Cidade: null,
    Estado: null,
    Telefone: null,
    TelefoneComercial: null,
    animated: new Animated.Value(0),
    ID: ""
  };
  //#endregion

  //#region View
  render() {

    return (
      <KeyboardAvoidingView 
      style = {{flex: 1}} behavior = {Platform.OS === "ios" ? "padding" : "height"}>
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
        <Modal // Anexos
          animationType = 'slide'
          transparent = {false}
          visible = {this.state.VisibilidadeModalAnexos}>
          <View
            style = {{
              width: Dimensions.get('window').width, 
              height: Dimensions.get('window').height
          }}>
            <View
              style = {{
                backgroundColor: '#FFFFFF', 
                height: 55,
                justifyContent: "center",
                alignItems: "center"
            }}>
              <View
                style = {{
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'space-between'
              }}>
                <Icon 
                  name = {'keyboard-arrow-down'}
                  color = {'#00482D'} 
                  size = {50}
                  onPress = { () => {
                    this.setVisibilidadeModalAnexos(false) 
                }}/>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 12,
                    textAlign: 'center',
                    color: '#00482D'
                }}>Documentos</Text>
                <View style = {{width: 50}}/>
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
          keyExtractorFlatList = {item => item.id}
          renderEstadoCivil = {this.renderEstadoCivil}
          dataEstadoCivil = {this.state.EstadosCivis}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onPressVisibilidade = {() => {this.setVisibilidadeModalEstadosCivis(false)}}
        />
        <ModalUFDoRG 
          visibilidade = {this.state.VisibilidadeModalUFDoRG}
          keyExtractorFlatList = {item => item.id}
          renderUFRG = {this.renderUFEstados}
          dataUFRG = {this.state.EstadosUFRG}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onPressVisibilidade = {() => {this.setVisibilidadeModalUFDoRG(false)}}
        />
        <ModalRegimeDeBens 
          visibilidade = {this.state.VisibilidadeModalRegimeDeBens}
          keyExtractorFlatList = {item => item.id}
          renderRegimeDeBens = {this.renderRegimeDeBens}
          dataRegimeDeBens = {this.state.RegimesDeBens}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onPressVisibilidade = {() => {this.setVisibilidadeModalRegimeDeBens(false)}}
        />
        <ModalLoading 
          visibilidade = {this.state.VisibilidadeModalLoading}
          onPress = {() => {this.setVisibilidadeModalLoading(false)}}
        />
        <ModalEndereco
          visibilidade = {this.state.VisibilidadeModalEndereco}
          fimdaanimacao = {() => {this.setVisibilidadeModalEndereco(true)}}
        />
        <ModalOptionSenha
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
        <ModalAviso
          visibilidade = {this.state.VisibilidadeModalAviso}
          textomensagem = {this.state.ModalAvisoMensagem}
          onPressIcon = {() => this.setVisibilidadeModalAviso(false)}
          onPress = {this.state.modalonPress}
        />
        <ModalConfirmarDados 
          visibilidade = {this.state.VisibilidadeModalConfirmarDados}
          onPressIcon = {() => {this.setVisibilidadeModalConfirmarDados(false)}}
          onPressObrigado = {() => {this.props.navigation.navigate('Login')}}
        />
        <ModalValidandoArquivos visibilidade = {this.state.VisibilidadeModalValidandoArquivos} onPress = {() => {this.setVisibilidadeModalValidandoArquivos(false)}}/>
        {this.state.VisibilidadeModalLoading != true && <>
        <View 
          style = {{
            height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
            justifyContent: "center",
            marginBottom: 20 
        }}>
          <View
            style = {{
              flexDirection: 'row', 
              alignItems: 'center', 
              width: '100%', 
              justifyContent: 'space-between',
              marginTop: 10
          }}>
            <Icon name = {'keyboard-arrow-left'} color = {this.props.StyleLogonCadastro.cores.background} size = {40} style = {{}}
            onPress = {() => {this.props.navigation.goBack()}}/>
            <Text
              style = {{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
                color: this.props.StyleLogonCadastro.cores.background
            }}>Cadastre-se</Text>
            <View style = {{width: 40}}></View>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator = {false}>
          <View
            style = {{
              paddingHorizontal: 24, 
              marginBottom: 15, 
              minHeight: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 195) : (Dimensions.get('window').height - 175),
          }}>
            <ClienteView
              >
              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
              {this.state.CPFCliente != null && this.state.CPFCliente != "" && this.state.DataCliente != null && this.state.DataCliente != "" && this.state.NomeCliente != null && this.state.NomeCliente != "" && false &&
                <Icon name = {"photo-camera"} size = {24} color = {this.props.StyleLogonCadastro.cores.background} style = {{marginBottom: 14}} onPress = {this.setandoParaTirarFotoDaIdentidade}/>}
                <Text style = {{ fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: this.props.StyleLogonCadastro.cores.background, marginBottom: 16}}>Dados Pessoais</Text>
              </View>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 13,
                  color: '#677367',
                  marginBottom: 10
              }}>{'Empresa'}</Text>
              <View 
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 8,
                  paddingHorizontal: 3,
                  borderWidth: 1,
                  borderColor: '#E2F2E3',
                  marginBottom: 5,
                  borderRadius: 5,
              }}>                
                <View style = {{marginBottom: this.state.selectedItems.length == 0 ? 0 : 10, flexDirection: "row", width: "100%", flexWrap: "wrap"}}>
                  {(this.state.selectedItems).map((Item, index) => (
                      <View
                        style = {{
                          backgroundColor: this.props.StyleLogonCadastro.cores.background,
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
                            this.state.selectedItems =  await (this.state.selectedItems).filter((item) => item != Item)
                            await this.setState({Renderizar: true})
                        }}/>
                    </View>
                  ))}
                </View>
                <MultiSelect
                  hideTags
                  searchIcon = {<Icon name = 'search' size = {20} color = {this.props.StyleLogonCadastro.cores.background}/>}
                  items={this.state.ListaEmpresas}
                  uniqueKey="id"
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.onSelectedItemsChange}
                  selectedItems={this.state.selectedItems}
                  selectText={ this.state.selectedItems.length == 0 ? "Selecione a empresa" : "Items selecionados"}
                  searchInputPlaceholderText="Procurando Itens..."
                  onChangeInput={ (text)=> console.log(text)}
                  tagRemoveIconColor= {this.props.StyleLogonCadastro.cores.background}
                  tagBorderColor= {this.props.StyleLogonCadastro.cores.background}
                  tagTextColor= {this.props.StyleLogonCadastro.cores.background}
                  selectedItemTextColor="#CCCCCC"
                  selectedItemIconColor="#CCCCCC"
                  itemTextColor= {this.props.StyleLogonCadastro.cores.background}
                  displayKey="descricao"
                  searchInputStyle={{ color: this.props.StyleLogonCadastro.cores.background, }}
                  submitButtonColor= {this.props.StyleLogonCadastro.cores.background}
                  submitButtonText="Selecionar"
                />
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
              {false &&
              <TextInputData
                animated = {this.state.AnimatedDataCliente}
                title = {'Data de nascimento'}
                keyboardType = {'numeric'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputDataCliente = ref}}
                value = {this.state.DataCliente}
                onChangeText = {this.onChangeInputDataCliente}
                onSubmitEditing = {this.submitInputDataCliente}
              />}
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
              {false &&
              <TextInputRG
                animated = {this.state.AnimatedEmailCliente}
                title = {'Número do seu RG'}
                keyboardType = {'numeric'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputRGCliente = ref}}
                value = {this.state.RGCliente}
                onChangeText = {this.onChangeInputRGCliente}
                onSubmitEditing = {this.submitInputRGCliente}
              />}
              {false &&
              <View style = {{flexDirection: 'row'}}>
                <TextInputOrgaoEmissor
                  animated = {this.state.AnimatedRGOrgaoEmissorCliente}
                  estilo = {{flex: 1, marginRight: 8}}
                  title = {'Orgão Emissor'}
                  keyboardType = {'default'}
                  returnKeyType = {'go'}
                  id = {(ref) => {this.InputRGOrgaoEmissor = ref}}
                  value = {this.state.RGOrgaoEmissorCliente}
                  onChangeText = {this.onChangeInputRGOrgaoEmissorCliente}
                  onSubmitEditing = {() => {}}
                />
                <TouchableOpacity activeOpacity = {1} onPress = {() => {this.setVisibilidadeModalUFDoRG(true)}}>
                  <TextInputUFDoRG
                    title = {'UF'}
                    estilo = {{flex: 1}}
                    placeholder = {'Selecione o estado'}
                    value = {this.state.RGUFCliente}
                  />
                </TouchableOpacity>
              </View>}
              <TextInputEmail
                animated = {this.state.AnimatedEmailCliente}
                title = {'Email'}
                keyboardType = {'email-address'}
                returnKeyType = {'go'}
                autoCapitalize = {'none'}
                id = {(ref) => {this.InputEmailCliente = ref}}
                value = {this.state.EmailCliente}
                onChangeText = {this.onChangeInputEmailCliente}
                onSubmitEditing = {this.submitInputEmailCliente}
              />
            </ClienteView>
            {false &&
            <EstadoCivilView>
              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                {this.state.StatusCivil > 0 &&
                <Icon name = {"photo-camera"} size = {24} color = {"#26A77C"} style = {{marginTop: 9}} onPress = {this.setandoParaTirarFotoDaCertidao}/>}
                <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: '#26A77C', marginBottom: 16, marginTop: 24}}>Estado Civil</Text>
              </View>
              <TouchableOpacity activeOpacity = {1} onPress = {() => {this.setVisibilidadeModalEstadosCivis(true)}}>
                <TextInputEstadoCivil
                  title = {'Situação atual'}
                  placeholder = {'Clique aqui para selecionar o estado civil'}
                  value = {this.state.StatusCivilDescricao}
                />
              </TouchableOpacity>
              {this.state.StatusCivil >= 2 && false &&
                <TouchableOpacity activeOpacity = {1} onPress = {() => {this.setVisibilidadeModalRegimeDeBens(true)}}>
                  <TextInputRegimeDeBens
                    title = {'Regime de bens'}
                    placeholder = {'Clique aqui para selecionar o regime de bens'}
                    value = {this.state.RegimeDescricao}
                  />
                </TouchableOpacity>}
            </EstadoCivilView>}
            {this.state.StatusCivil == 2 && false &&
            <ConjugeView
              >
            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
            {this.state.CPFConjuge != null && this.state.CPFConjuge != "" && this.state.DataConjuge != null && this.state.DataConjuge != "" && this.state.NomeConjuge != null && this.state.NomeConjuge != "" &&
              <Icon name = {"photo-camera"} size = {24} color = {"#26A77C"} style = {{ marginTop: 20}} onPress = {this.setandoParaTirarFotoDoConjuge}/>}
              <Text style = {{ fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: '#26A77C', marginTop: 24, marginBottom: 5}}>Conjuge</Text>
            </View>
            <TextInputCPF 
                title = {'Digite aqui seu CPF'}
                keyboardType = {'numeric'}
                returnKeyType = {'search'}
                id = {(ref) => {this.InputCPFConjuge = ref}}
                value = {this.state.CPFConjuge}
                onChangeText = {this.onChangeInputCPFConjuge}
                onSubmitEditing = {this.submitInputCPFConjuge}
              />
              <TextInputData
                animated = {this.state.AnimatedDataConjuge}
                title = {'Data de nascimento'}
                keyboardType = {'numeric'}
                returnKeyType = {'go'}
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
              <TextInputEmail
                animated = {this.state.AnimatedEmailConjuge}
                title = {'Email'}
                returnKeyType = {'go'}
                keyboardType = {'email-address'}
                autoCapitalize = {'none'}
                id = {(ref) => {this.InputEmailConjuge = ref}}
                value = {this.state.EmailConjuge}
                onChangeText = {this.onChangeInputEmailConjuge}
                onSubmitEditing = {this.submitInputEmailConjuge}
              />
            </ConjugeView>}
            {false &&
            <CRECIView
              >
              <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: '#26A77C', marginBottom: 16}}>CRECI</Text>
              <TextInputCRECI
                title = {'Digite o número do CRECI'}
                keyboardType = {'numeric'}
                id = {(ref) => {this.InputCRECICliente = ref}}
                value = {this.state.NumeroCRECI}
                onChangeText = {this.onChangeInputNumeroCRECI}
                onSubmitEditing = {this.submitInputNumeroCRECI}
              />
              <View style = {{flexDirection: 'row'}}>
                <TextInputEstadoCRECI
                  animated = {this.state.AnimatedUFCRECI}
                  title = {'UF'} estilo = {{flex: 1, marginRight: 8}}
                  keyboardType = {'default'}
                  id = {(ref) => {this.InputUFCRECI = ref}}
                  value = {this.state.UFCRECI}
                  onChangeText = {this.onChangeInputUFCRECI}
                  onSubmitEditing = {this.submitInputUFCRECI}
                />
                <TextInputValidadeCRECI
                  animated = {this.state.AnimatedValidadeCRECI}
                  title = {'Validade'} estilo = {{flex: 1}}
                  keyboardType = {'numeric'}
                  id = {(ref) => {this.InputValidadeCRECI = ref}}
                  value = {this.state.ValidadeCRECI}
                  onChangeText = {this.onChangeInputValidadeCRECI}
                  onSubmitEditing = {() => {}}
                />
              </View>
            </CRECIView>}
            {false &&
            <EnderecoView
              >
              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name = {"photo-camera"} size = {24} color = {"#26A77C"} style = {{marginTop: 10}} onPress = {this.setandoParaTirarFotoDoEndereco}/>
                <Text style = {{ fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: '#26A77C', marginBottom: 16, marginTop: 24}}>Endereço</Text>
              </View>
              <TextInputCEP
                title = {'CEP'}
                keyboardType = {'numeric'}
                returnKeyType = {'search'}
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
                returnKeyType = {'go'}
                defaultValue = {"S/N"}
                keyboardType = {'numeric'}
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
              <TextInputEstado
                animated = {this.state.AnimatedEndereco}
                title = {'Estado'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputEstado = ref}}
                value = {this.state.Estado}
                onChangeText = {this.onChangeInputEstado}
                onSubmitEditing = {() => {}}
              />
            </EnderecoView>}
            {false &&
            <TelefonesView
              >
              <Text style = {{ fontStyle: 'normal', fontWeight: '500', fontSize: 16, color: '#00482D', marginBottom: 16, marginTop: 24}}>Telefones</Text>
              <TextInputTelefone
                animated = {this.state.AnimatedTelefone}
                title = {'Telefone'}
                keyboardType = {'numeric'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputTelefone = ref}}
                value = {this.state.Telefone}
                onChangeText = {this.onChangeInputTelefone}
                onSubmitEditing = {this.submitInputTelefone}
              />
              <TextInputTelefone 
                animated = {this.state.AnimatedTelefoneComercial}
                title = {'Telefone Comercial'}
                keyboardType = {'numeric'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputTelefoneComercial = ref}}
                value = {this.state.TelefoneComercial}
                onChangeText = {this.onChangeInputTelefoneComercial}
                onSubmitEditing = {() => {}}
              />
            </TelefonesView>}
            <View // Senha e confirmacao de senha
              >
              <TextInputCriarSenha 
                title = {'Crie uma senha'}
                keyboardType = {'default'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputCriarSenha = ref}}
                value = {this.state.CriarSenha}
                onChangeText = {this.onChangeInputCriarSenha}
                onSubmitEditing = {this.submitInputCriarSenha}
                securetext = {this.state.VisibilidadeSecureTextCriarSenha}
                onChangeSecureText = {async () => {this.state.VisibilidadeSecureTextCriarSenha == true ? await this.setState({VisibilidadeSecureTextCriarSenha: false}) : await this.setState({VisibilidadeSecureTextCriarSenha: true})}}
              />
              <TextInputConfirmarSenha 
                title = {'Confirme a senha'}
                keyboardType = {'default'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputConfirmarSenha = ref}}
                value = {this.state.ConfirmarSenha}
                onChangeText = {this.onChangeInputConfirmarSenha}
                onSubmitEditing = {this.submitInputConfimarSenha}
                securetext = {this.state.VisibilidadeSecureTextConfirmarSenha}
                onChangeSecureText = {async () => {this.state.VisibilidadeSecureTextConfirmarSenha == true ? await this.setState({VisibilidadeSecureTextConfirmarSenha: false}) : await this.setState({VisibilidadeSecureTextConfirmarSenha: true})}}
              />
            </View>
          </View>
          <View style = {{paddingHorizontal: 24, flexDirection: 'row'}}>
            {false &&
            <TouchableOpacity // Anexos
              style = {{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#26A77C',
                padding: 16,
                height: 58,
                alignItems: 'center',
                marginBottom: 20,
                marginRight: 20
            }}
              onPress = {this.acessandoListaDeAnexos}>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#26A77C',
                  alignSelf: 'center',
              }}>Anexos</Text>
            </TouchableOpacity>}
            <TouchableOpacity // Avançar
              style = {{
                flex: 1,
                backgroundColor: this.props.StyleLogonCadastro.cores.background,
                paddingHorizontal: 16,
                height: 58,
                alignItems: 'center',
                justifyContent: "center",
                marginBottom: 20,
                borderRadius: 5
            }}
              onPress = {this.prosseguirTelaCriarSenha}>
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

  //#region on selected items change
  onSelectedItemsChange = selectedItems => {
    let selecionado = selectedItems.find(item => item == 'GAV Resorts')

    if (selecionado == 'GAV Resorts')
    {
      let filtrados = selectedItems.filter(item => item != 'GAV Resorts');

      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Não é possível cadastrar por meio dessa empresa, faça esse cadastro por meio da nossa plataforma WEB.`
      });
      
      this.setState({ filtrados });
    }
    else
    {
      this.setState({ selectedItems });
    }
  };
  //#endregion

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
        const response = await ReceitaFederal.Consulta_CPF(String(this.props.token[0].token), formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente), formatoDeTexto.DataJSON(this.state.DataCliente))
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
    this.state.DataCliente != "" && this.state.DataCliente != null) {
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
      await this.setState({EstadosCivis: response})
      await this.pegandoListaRegimeDeBens();
    }
    else
    {
      await this.setVisibilidadeModalLoading(false)
      await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando lista de regimes de bens no banco de dados
  pegandoListaRegimeDeBens = async () => {
    const response = await Pessoa.regimeDeBens(String(this.props.token[0].token))
    if(response != null && response != undefined)
    {
      await this.setState({RegimesDeBens: response})
      await this.setVisibilidadeModalLoading(false)
    }
    else
    {
      await this.setVisibilidadeModalLoading(false)
      await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando grupo de empresas
  pegandoGruposDeEmpresas = async () => {
    
  }
  //#endregion

  //#region Setando a visibilidade da modal de estados civis
  setVisibilidadeModalEstadosCivis(value) {
    this.setState({VisibilidadeModalEstadosCivis: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de regime de bens
  setVisibilidadeModalRegimeDeBens(value) {
    this.setState({VisibilidadeModalRegimeDeBens: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeModalLoading(value) {
    this.setState({VisibilidadeModalLoading: value})
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

  //#region Setando a visibilidade da modal de aviso
  setVisibilidadeModalAviso(value) {
    this.setState({VisibilidadeModalAviso: value})
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
    else if(option == '@recuperarsenha') 
    {
      await this.setState({
        ModalOptionMensagem: 'Caro usuário, deseja recuperar sua senha?'
      })
    }
    this.setState({VisibilidadeModalOption: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de estados do rg
  setVisibilidadeModalUFDoRG(value) {
    this.setState({VisibilidadeModalUFDoRG: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de confirmação de dados
  setVisibilidadeModalConfirmarDados(value) {
    this.setState({VisibilidadeModalConfirmarDados: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de validação de arquivos
  setVisibilidadeModalValidandoArquivos(value) {
    this.setState({VisibilidadeModalValidandoArquivos: value})
  }
  //#endregion

  //#region Renderizando lista de estados civis
  renderEstadoCivil = ({ item }) => (
    <TouchableOpacity key = {item.id}
      onPress = {async () => {
        if(item.id != this.state.StatusCivil)
        {
          if(item.id == 1) 
          {
            await this.setState({StatusCivil: item.id, StatusCivilDescricao: item.descricao, Regime: null, RegimeDescricao: null})
            await this.setVisibilidadeModalEstadosCivis(false)
          }
          else
          {
            await this.setState({StatusCivil: item.id, StatusCivilDescricao: item.descricao})
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
            color: item.descricao == this.state.StatusCivilDescricao ? '#8d4055' : '#262825',
            fontWeight: item.descricao == this.state.StatusCivilDescricao ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>
    </TouchableOpacity>
  );
  //#endregion

  //#region Renderizando lista de estados
  renderUFEstados = ({ item }) => (
    <TouchableOpacity key = {item.id}
      onPress = {async () => {
        if(item.id != this.state.RGIDUFCliente)
        {
          if(item.id == 1) 
          {
            await this.setState({RGIDUFCliente: item.id, RGUFCliente: item.descricao})
            await this.setVisibilidadeModalUFDoRG(false)
          }
          else
          {
            await this.setState({RGIDUFCliente: item.id, RGUFCliente: item.descricao})
            await this.setVisibilidadeModalUFDoRG(false)
          }
        }
        else
        {
          await this.setVisibilidadeModalUFDoRG(false)
        }
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
            color: item.descricao == this.state.RGUFCliente ? '#8d4055' : '#262825',
            fontWeight: item.descricao == this.state.RGUFCliente ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>
    </TouchableOpacity>
  );
  //#endregion

  //#region Renderizando lista de regime de bens
  renderRegimeDeBens = ({ item }) => (
    <TouchableOpacity key = {item.id}
      onPress = {async () => {
        if(item.id != this.state.Regime)
        {
          await this.setState({Regime: item.id, RegimeDescricao: item.descricao})
          await this.setVisibilidadeModalRegimeDeBens(false)
        }
        else
        {
          await this.setVisibilidadeModalRegimeDeBens(false)
        }
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
            color: item.descricao == this.state.RegimeDescricao ? '#8d4055' : '#262825',
            fontWeight: item.descricao == this.state.RegimeDescricao ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>
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

  //#region Submit no input do CPF/CNPJ do cliente
  submitInputCPFCliente = async () => {
    if(this.state.CPFCliente == null)
    {
      this.InputNomeCliente.focus();
    }
    else
    {
      if(await formatoDeTexto.TextoValido(this.state.CPFCliente) == true) {
        await this.setVisibilidadeModalProcurandoDadosCliente(true)
        await this.pegandoDadosCliente();
      } else {
        await Validacoes._InputCPF_CNPJ(this.state.CPFCliente, this.state.this)
      }
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
    } else {
      this.InputNomeCliente.focus()
    }
  }
  //#endregion

  //#region Submit no input do Nome do cliente
  submitInputNomeCliente = async () => {
    this.InputEmailCliente.focus();
  }
  //#endregion

  //#region Submit no input do Numero CRECI
  submitInputNumeroCRECI = async () => {    
    this.InputUFCRECI.focus();
  }
  //#endregion

  //#region Submit no input do UF do CRECI
  submitInputUFCRECI = async () => {    
    this.InputValidadeCRECI.focus();
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
    this.InputCriarSenha.focus();
  }
  //#endregion

  //#region onChangeText no input criar senha
  onChangeInputCriarSenha = async (value) => {
    await this.setState({CriarSenha: value})
  }
  //#endregion

  //#region onChangeText no input confirma senha
  onChangeInputConfirmarSenha = async (value) => {
    await this.setState({ConfirmarSenha: value})
  }
  //#endregion

  //#region onSubmit no input criar senha
  submitInputCriarSenha = async () => {
    this.InputConfirmarSenha.focus()
  }
  //#endregion

  //#region onSubmit no input confirmar senha
  submitInputConfimarSenha = async () => {
    
  }
  //#endregion

  //#region Submit no input do CPF do conjuge
  submitInputCPFConjuge = async () => {
    if(await this.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(this.state.CPFConjuge)) == true) {
      this.setVisibilidadeModalProcurandoDadosCliente(true)
      await this.pegandoDadosConjuge();
    } else {
      await Validacoes._InputCPF_CNPJ(this.state.CPFConjuge, this.state.this)
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
    this.InputEmailConjuge.focus();
  }
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

  //#region onChangeText no input Orgao emissor
  onChangeInputRGOrgaoEmissorCliente = async (value) => {
    await this.setState({ RGOrgaoEmissorCliente: value });
  }
  //#endregion

  //#region onChangeText no inpit EmailCliente
  onChangeInputEmailCliente = async (value) => {
    this.setState({EmailCliente: value})
  }
  //#endregion

  //#region onChangeText no input do numero CRECI
  onChangeInputNumeroCRECI = async (value) => {
    this.setState({NumeroCRECI: value})
  }
  //#endregion

  //#region onChangeText no input UF do CRECI
  onChangeInputUFCRECI = async (value) => {
    this.setState({UFCRECI: value})
  }
  //#endregion

  //#region onChangeText no input da validade do CRECI
  onChangeInputValidadeCRECI = async (value) => {
    this.setState({ValidadeCRECI: formatoDeTexto.Data(value)})
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
    if(this.state.Cidade != null && this.state.Cidade != "")
    {
      this.InputEstado.focus()
    }
    else
    {
      this.InputEstado.focus()   
    }
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
      this.AnimacaoInputTelefoneComercial();
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
    return (
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
               if (item.id == 'RG') {
                  item.habilitar_camera = true,
                  await this.setState({imageurl: this.state.FotoIdentidade, anexo_atual: 'RG', scrollCarouselEnabled: false})
               } else if (item.id == 'RG do Conjugê') {
                  item.habilitar_camera = true,
                  await this.setState({imageurl: this.state.FotoIdentidadeConjuge, anexo_atual: 'RG do Conjugê', scrollCarouselEnabled: false})
               } else if (item.id == 'Estado Civil') {
                  item.habilitar_camera = true,
                  await this.setState({imageurl: this.state.FotoCertidao, anexo_atual: 'Estado Civil', scrollCarouselEnabled: false})
               } else if (item.id == 'Comprovante end.') {
                  item.habilitar_camera = true,
                  await this.setState({imageurl: this.state.FotoEndereco, anexo_atual: 'Comprovante end.', scrollCarouselEnabled: false})
               }
              }
          }}>
            <Image style = {{flex: 1, width: Dimensions.get('window').width*0.95, height: Dimensions.get('window').height*0.9}} source = {item.base64 == null ? ImagemCamera : item} resizeMode = {item.base64 == null ? 'center' : 'contain'}
            />
          </TouchableOpacity>}
          {item.habilitar_camera == true && 
            <>
              <RNCamera
                ref = {ref => {this.camera = ref}}
                style = {styles.preview}
                type = {this.state.cameraType}
                flashMode = {this.state.FlashCamera}
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
                defaultVideoQuality = {"720p"}
                onGoogleVisionBarcodesDetected={({ barcodes }) => {
                  console.log(barcodes[0].data);
                }}
                googleVisionBarcodeType = {RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.ALL}
                googleVisionBarcodeMode={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeMode.NORMAL}
                >
                <View style ={{flex: 0, flexDirection: 'row', width: Dimensions.get('window').width, justifyContent: 'space-between', backgroundColor: '#4C773C'}}>
                  <TouchableOpacity activeOpacity = {1}
                  style = {{flex: 0, marginVertical: 20, alignSelf: 'center', marginLeft: 20}}
                  onPress = {async () => {
                    item.habilitar_camera = false
                    this.setState({imageurl: null, scrollCarouselEnabled: true})
                  }}>
                    <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                      <Icon name="close" size = {30} color = "#FFFFFF"/>
                      <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: '500', fontSize: 14, textAlign: 'center'}}>Cancelar</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity = {1}
                    onPress={ async () => {
                      await this.takePicture(this.camera)
                      item.habilitar_camera = false
                      this.setState({imageurl: null, scrollCarouselEnabled: true})
                  }}
                    style={styles.capture}>
                  {this.state.indicatorCamera == false &&
                    <Icon name="radio-button-checked" size={55} color="#FFFFFF"/>}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity = {1}
                    onPress={ async () => {
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
                  {this.state.indicatorCamera == false &&
                    <Icon name="flash-on" size={30} color="#FFFFFF"/>}
                  </TouchableOpacity>
                </View>
              </RNCamera>
            </>}
        </View>
        <View style = {{position: 'absolute', justifyContent: 'center', alignItems: 'center', bottom: 80}}>
          {item.habilitar_camera == false && 
            <Icon name = 'delete' size = {55} color = {'#B15757'} style = {{opacity: 0.75}}
              onPress = {async () => {
                if(item.id == 'RG') {
                  this.state.FotoIdentidade.base64 = null,
                  this.state.FotoIdentidade.habilitar_camera = false,
                  this.state.FotoIdentidade.deviceOrientation = null,
                  this.state.FotoIdentidade.height = null,
                  this.state.FotoIdentidade.pictureOrientation = null,
                  this.state.FotoIdentidade.uri = null,
                  this.state.FotoIdentidade.width = null,
                  item.habilitar_camera = true
                  await this.setState({imageurl: this.state.FotoIdentidade, anexo_atual: 'RG', scrollCarouselEnabled: false});
                } else if (item.id == 'RG do Conjugê') {
                    this.state.FotoIdentidadeConjuge.base64 = null,
                    this.state.FotoIdentidadeConjuge.habilitar_camera = false,
                    this.state.FotoIdentidadeConjuge.deviceOrientation = null,
                    this.state.FotoIdentidadeConjuge.height = null,
                    this.state.FotoIdentidadeConjuge.pictureOrientation = null,
                    this.state.FotoIdentidadeConjuge.uri = null,
                    this.state.FotoIdentidadeConjuge.width = null,
                    item.habilitar_camera = true
                    await this.setState({imageurl: this.state.FotoIdentidadeConjuge, anexo_atual: 'RG do Conjugê', scrollCarouselEnabled: false});
                } else if (item.id == 'Estado Civil') {
                    this.state.FotoCertidao.base64 = null,
                    this.state.FotoCertidao.habilitar_camera = false,
                    this.state.FotoCertidao.deviceOrientation = null,
                    this.state.FotoCertidao.height = null,
                    this.state.FotoCertidao.pictureOrientation = null,
                    this.state.FotoCertidao.uri = null,
                    this.state.FotoCertidao.width = null,
                    item.habilitar_camera = true
                    await this.setState({imageurl: this.state.FotoCertidao, anexo_atual: 'Estado Civil', scrollCarouselEnabled: false});
                } else if (item.id == 'Comprovante end.') {
                    this.state.FotoEndereco.base64 = null,
                    this.state.FotoEndereco.habilitar_camera = false,
                    this.state.FotoEndereco.deviceOrientation = null,
                    this.state.FotoEndereco.height = null,
                    this.state.FotoEndereco.pictureOrientation = null,
                    this.state.FotoEndereco.uri = null,
                    this.state.FotoEndereco.width = null,
                    item.habilitar_camera = true
                    await this.setState({imageurl: this.state.FotoEndereco, anexo_atual: 'Comprovante de end.', scrollCarouselEnabled: false});
                }
            }}/>}
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
    if(this.state.StatusCivil == 2 && (this.state.FotoIdentidadeConjuge.base64 != null || this.state.FotoIdentidadeConjuge.base64 == null)) {
      this.state.anexosDocumentos.push(this.state.FotoIdentidadeConjuge);
    }
    if((this.state.FotoCertidao.base64 != null || this.state.FotoCertidao.base64 == null)) {
      this.state.anexosDocumentos.push(this.state.FotoCertidao);
    }
    if(this.state.FotoEndereco.base64 != null || this.state.FotoEndereco.base64 == null) {
      this.state.anexosDocumentos.push(this.state.FotoEndereco);
    }
  }
  //#endregion

  //#region Função para tirar foto
  _tiraFoto = async (option) => {
    this.state.anexosDocumentos = []
    if(option == 'RG') {
      this.state.FotoIdentidade.habilitar_camera = true
      this.state.anexosDocumentos.push(this.state.FotoIdentidade);
    } else if (option == 'RG do Conjugê') {
      this.state.FotoIdentidadeConjuge.habilitar_camera = true
      this.state.anexosDocumentos.push(this.state.FotoIdentidadeConjuge);
    } else if (option == 'Estado Civil') {
      this.state.FotoCertidao.habilitar_camera = true
      this.state.anexosDocumentos.push(this.state.FotoCertidao)
    } else if (option == 'Comprovante end.') {
      this.state.FotoEndereco.habilitar_camera = true
      this.state.anexosDocumentos.push(this.state.FotoEndereco)
    }
  }
  //#endregion

  //#region Mostrar foto
  _mostraFoto = async (option) => {
    this.state.anexosDocumentos = []
    if(option == 'RG') {
      this.state.anexosDocumentos.push(this.state.FotoIdentidade)
    } else if (option == 'RG do Conjugê') {
      this.state.anexosDocumentos.push(this.state.FotoIdentidadeConjuge)
    } else if (option == 'Estado Civil') {
      this.state.anexosDocumentos.push(this.state.FotoCertidao)
    } else if (option == 'Comprovante end.') {
      this.state.anexosDocumentos.push(this.state.FotoEndereco)
    }
  }
  //#endregion

  //#region Setando para tirar foto da identidade
  setandoParaTirarFotoDaIdentidade = async () => {
    if(this.state.FotoIdentidade.base64 ==  null) {
      this._tiraFoto('RG');
      this.setState({imageurl: this.state.FotoIdentidade, anexo_atual: 'RG', scrollCarouselEnabled: false});
      this.setVisibilidadeModalAnexos(true);
    } else if(this.state.FotoIdentidade.base64 != null) {
      this._mostraFoto('RG');
      this.setState({anexo_atual: 'RG'});
      this.setVisibilidadeModalAnexos(true);
    }
  }
  //#endregion

  //#region Setando para tirar foto do estado civil
  setandoParaTirarFotoDaCertidao = async () => {
    if(this.state.FotoCertidao.base64 == null) {
      this._tiraFoto('Estado Civil');
      this.setState({imageurl: this.state.FotoCertidao, anexo_atual: 'Estado Civil', scrollCarouselEnabled: false});
      this.setVisibilidadeModalAnexos(true)
    } else if(this.state.FotoCertidao.base64 != null) {
      this._mostraFoto('Estado Civil');
      this.setState({anexo_atual: 'Estado Civil'});
      this.setVisibilidadeModalAnexos(true);
    }
  }
  //#endregion

  //#region Setando para tirar foto da Identidade do conjuge
  setandoParaTirarFotoDoConjuge = async () => {
    if(this.state.FotoIdentidadeConjuge.base64 == null) {
      this._tiraFoto('RG do Conjugê');
      this.setState({imageurl: this.state.FotoIdentidadeConjuge, anexo_atual: 'RG do Conjugê', scrollCarouselEnabled: false});
      this.setVisibilidadeModalAnexos(true)
    } else if(this.state.FotoIdentidadeConjuge.base64 != null) {
      this._mostraFoto('RG do Conjugê');
      this.setState({anexo_atual: 'RG do Conjugê'});
      this.setVisibilidadeModalAnexos(true);
    }
  }
  //#endregion

  //#region Setando para tirar foto do endereco
  setandoParaTirarFotoDoEndereco = async () => {
    if(this.state.FotoEndereco.base64 == null) {
      this._tiraFoto('Comprovante end.');
      this.setState({imageurl: this.state.FotoEndereco, anexo_atual: 'Comprovante end.', scrollCarouselEnabled: false});
      this.setVisibilidadeModalAnexos(true)
    } else if(this.state.FotoEndereco.base64 != null) {
      this._mostraFoto('Comprovante end.');
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
    else if(option == '@recuperarsenha')
    {
      await this.setVisibilidadeModalOption(false)
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Não é possível cadastrar por meio dessa empresa, faça esse cadastro por meio da nossa plataforma WEB.`
      })
      // await this.props.navigation.navigate('EsqueceuSenha')
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
    else if (option == '@recuperarsenha')
    {
      await this.setVisibilidadeModalOption(false)
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
        Data_nasc: null
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
        Ocupacao: null,
      },
      {
        Assinatura: false
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
        Ocupacao: null,
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

  //#region Array dados dos telefones no redux
  dadosTelefonesRedux = async () => {
    const { addToTelefones } = this.props;

    addToTelefones({ Registros: { Telefones: { Principal: this.state.TelefonePrincipalExiste, Recado: this.state.TelefoneRecadoExiste }, Telefones_existentes: this.state.Telefones_existentes }}, { Telefones: this.state.Telefones })
  }
  //#endregion

  //#region Array dos documentos originais
  documentosOriginais = async () => {
    this.state.DocumentosOriginais = []
    if (this.state.FotoIdentidade.base64 != null) {
      this.state.DocumentosOriginais.push(this.state.FotoIdentidade)
    }
    if (this.state.FotoIdentidadeConjuge.base64 != null) { 
      this.state.DocumentosOriginais.push(this.state.FotoIdentidadeConjuge)
    }
    if (this.state.FotoEndereco.base64 != null) {
      this.state.DocumentosOriginais.push(this.state.FotoEndereco)
    }
    if (this.state.FotoCertidao.base64 != null) {
      this.state.DocumentosOriginais.push(this.state.FotoCertidao)
    }
  }
  //#endregion

  //#region Array dos documentos originais no redux
  documentosOriginaisRedux = async () => {
    const { addToDocumentosOriginais } = this.props;

    addToDocumentosOriginais(this.state.DocumentosOriginais)
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

  //#region Prosseguir para a tela de Criar a senha
  prosseguirTelaCriarSenha = async () => {
    let empresa = this.state.selectedItems.find(item => item == 'GAV Resorts')
    
    if (empresa == 'GAV Resorts')
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
    else {

      if ((await Validacoes.TelaDadosUsuario(this.state, this.state.this, this.setModals)) == true) 
      {

        this.setVisibilidadeModalValidandoArquivos(true)
        if (this.state.VisibilidadeModalValidandoArquivos == true) {
          setTimeout(async () => {
            await this.dadosClienteEmail();
            await this.dadosCliente();
            if(this.state.ID_cliente > 0) 
            {
              await this.putCliente();
            }
            else 
            {
              await this.postCliente();
            }
          }, 1000)
        }

      }

    }
  }
  //#endregion

  //#region Dados do cliente
  dadosCliente = async () => {
    this.state.dadosCliente = {
      "id": this.state.ID_cliente,
      "cpf": formatoDeTexto.CPF_CNPJOriginal(this.state.CPFCliente),
      "nome": this.state.NomeCliente,
      "natureza": 2,
      "dataDeNascimento": null,
      "emails": (this.state.EmailCliente != null && this.state.EmailCliente != "") ? [this.state.Emails] : null,
      "documentoPessoal": null,
      "rg": null,
      "creci": null,
      "estadoCivil": null,
      "documentoDeEstadoCivil":  null,
      "regimeDeBens": null,
      "necessarioAssinaturaDoConjuge": false,
      "conjuge": null,
      "endereco": null,
      "documentoEndereco": null,
      "telefones": null,
    }
    // console.log(JSON.stringify(this.state.dadosCliente))
  }
  //#endregion

  //#region Post cliente
  postCliente = async () => {
    try {
      const response = await Pessoa.cadastrar(String(this.props.token[0].token), this.state.dadosCliente);
      if(response.status == 200 || response.status == 201) {
        const dados = response.data;
        await this.setState({Pessoa: dados.id});
        await this.postSenhaPessoa();
      }
    } catch(err) {
        await this.setVisibilidadeModalValidandoArquivos(false)
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Falha ao tentar cadastrar os seus dados pessoais, por favor tente novamente!`
        })
    }
  }
  //#endregion

  //#region Put cliente
  putCliente = async () => {
    try {
      const response = await Pessoa.alterarDados(String(this.props.token[0].token), this.state.dadosCliente)
      if(response.status == 200 || response.status == 201) {
        const dados = response.data;
        await this.setState({Pessoa: dados.id});
        await this.postSenhaPessoa();
      }
    } catch(err) {
        await this.setVisibilidadeModalValidandoArquivos(false)
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Falha ao tentar alterar os seus dados pessoais, por favor tente novamente!`
        })
    }
  }
  //#endregion

  //#region Post senha pessoa
  postSenhaPessoa = async () => {
    try {
      if(this.state.CriarSenha === this.state.ConfirmarSenha) {
        const response = await Logon.cadastrar(String(this.props.token[0].token), this.state.Pessoa, this.state.ConfirmarSenha);
        if(response.status == 200 || response.status == 201) {
          await this.setVisibilidadeModalValidandoArquivos(false)
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `${(this.state.NomeCliente).split(' ')[0]} seu cadastro foi efetuado com sucesso`
          })          
          this.setVisibilidadeModalConfirmarDados(true)
        }
      }
    } catch(err) {
      console.log(err.response.request._response)
        await this.setVisibilidadeModalValidandoArquivos(false)
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `O usuário já existe.`
        })
        await this.setState({Option: '@recuperarsenha'})
        await this.setVisibilidadeModalOption(true, '@recuperarsenha')
    }
  }
  //#endregion

  //#region Setando a escolha na modal de aviso sobre o documento que esta faltando
  setModals = async (options) => {
    this.state.anexosDocumentos = []
    if (options == '@foto_rg') {
        this.setState({ModalAvisoMensagem: 'Caro usuário, para efetuar o cadastro é obrigatório tirar a foto do RG'})
        this.setState({modalonPress: () => {
          if(this.state.FotoIdentidade.base64 == null) {
            this.setVisibilidadeModalAviso(false)
            this._tiraFoto('RG');
            this.setState({imageurl: this.state.FotoIdentidade, anexo_atual: 'RG', scrollCarouselEnabled: false});
            this.setVisibilidadeModalAnexos(true);
          }
        }})
        this.setVisibilidadeModalAviso(true)
    } else if (options == '@foto_certidao') {
        this.setState({ModalAvisoMensagem: 'Caro usuário, para efetuar o cadastro é obrigatório tirar a foto do comprovante de estado civil'})
        this.setState({modalonPress: () => {
          if(this.state.FotoCertidao.base64 == null) {
            this.setVisibilidadeModalAviso(false)
            this._tiraFoto('Estado Civil');
            this.setState({imageurl: this.state.FotoCertidao, anexo_atual: 'Estado Civil', scrollCarouselEnabled: false});
            this.setVisibilidadeModalAnexos(true)
          }
        }})
        this.setVisibilidadeModalAviso(true)
    } else if (options == '@foto_endereco') {
        this.setState({ModalAvisoMensagem: 'Caro usuário, para efetuar o cadastro é obrigatório tirar a foto do Comprovante de endereço'})
        this.setState({modalonPress: () => {
          if(this.state.FotoEndereco.base64 == null) {
            this.setVisibilidadeModalAviso(false)
            this._tiraFoto('Comprovante end.');
            this.setState({imageurl: this.state.FotoEndereco, anexo_atual: 'Comprovante end.', scrollCarouselEnabled: false});
            this.setVisibilidadeModalAnexos(true)
          }
        }})
        this.setVisibilidadeModalAviso(true)
    } else if (options == '@foto_rgconjuge') {
        this.setState({ModalAvisoMensagem: 'Caro usuário, para efetuar o cadastro é obrigatório tirar a foto do RG do conjugê'})
        this.setState({modalonPress: () => {
          if(this.state.FotoIdentidadeConjuge.base64 == null) {
            this.setVisibilidadeModalAviso(false)
            this._tiraFoto('RG do Conjugê');
            this.setState({imageurl: this.state.FotoIdentidadeConjuge, anexo_atual: 'RG do Conjugê', scrollCarouselEnabled: false});
            this.setVisibilidadeModalAnexos(true)
          }
        }})
        this.setVisibilidadeModalAviso(true)
    }
  }
  //#endregion

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
  StyleGlobal: state.StyleGlobal,
  StyleLogonCadastro: state.StyleLogonCadastro
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...DocumentosOriginaisActions,...DocumentosConjugeActions,...ConjugeActions,...DocumentosActions,...TelefonesActions,...ClienteActions, ...EnderecoActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DadosUsuario);