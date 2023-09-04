//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Keyboard, View, Text, Animated, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
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
//#endregion

//#region Chaves de filtragem

//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Pessoa, Logon } from "../../../services";
//#endregion

//#region Redux
import { DadosLeadActions, TelaAtualActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
//#endregion

//#region Componentes
import { Container, Logo, NomeEmpresa, Header, TextInputConfirmarSenha, TextInputCriarSenha } from '../../../components';
import { ModalSucesso, ModalFalha, ModalConfirmarDados, ModalValidandoArquivos } from '../../Modais';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
//#endregion

//#endregion

class EsqueceuSenha extends Component {

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
  }
  //#endregion

  //#region Model
  state = {
    AnimatedHeader: new Animated.Value(1),
    VisibilidadeModalConfirmarDados: false,
    VisibilidadeModalValidandoArquivos: false,
    VisibilidadeSecureTextSenhaAtual: true,
    VisibilidadeSecureTextNovaSenha: true,
    CriarSenha: null,
    ConfirmarSenha: null,
    Pessoa: null,
    PessoaConjuge: null,
    NumeroRG: null,
    OrgaoEmissorRG: null,
    UFRG: null,
    NumeroCRECI: null,
    UFCRECI: null,
    ValidadeUFCRECI: null,
    Documento_rg: [],
    Documento_certidao: [],
    Documento_endereco: [],
    Telefone_principal: [],
    Telefone_recado: [],
    dadosCliente: [],
    dadosConjuge: [],
    ID:""
  };
  //#endregion

  //#region View
  render() {
    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
        <ModalConfirmarDados 
          visibilidade = {this.state.VisibilidadeModalConfirmarDados}
          onPressIcon = {() => {this.setVisibilidadeModalConfirmarDados(false)}}
          onPressObrigado = {() => {this.props.navigation.navigate('Login')}}
        />
        <ModalValidandoArquivos visibilidade = {this.state.VisibilidadeModalValidandoArquivos} onPress = {() => {this.setVisibilidadeModalValidandoArquivos(false)}}/>
        <View 
          style = {{
            height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62, 
            marginBottom: 20,
            justifyContent: "center"
          }}>
          <View 
            style = {{
              flexDirection: 'row', 
              alignItems: 'center', 
              width: '100%',
              justifyContent: 'space-between',
          }}>
            <Icon name = {'keyboard-arrow-left'} color = {this.props.StyleGlobal.cores.background} size = {40} style = {{}}
            onPress = {() => {this.props.navigation.goBack()}}/>
            <Text
              style = {{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
                color: this.props.StyleGlobal.cores.background
            }}>Esqueci minha senha</Text>            
            <View style = {{width: 40}}></View>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator = {false}>
          <View
            style = {{ 
              paddingHorizontal: 24, 
              marginBottom: 15, 
              minHeight: Dimensions.get('window').height - 195,
          }}>
            <View // Senha e confirmacao de senha
              >
              <TextInputCriarSenha 
                title = {'Senha atual'}
                keyboardType = {'default'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputCriarSenha = ref}}
                value = {this.state.CriarSenha}
                onChangeText = {this.onChangeInputCriarSenha}
                onSubmitEditing = {this.submitInputCriarSenha}
                securetext = {this.state.VisibilidadeSecureTextSenhaAtual}
                onChangeSecureText = {async () => {this.state.VisibilidadeSecureTextSenhaAtual == true ? await this.setState({VisibilidadeSecureTextSenhaAtual: false}) : await this.setState({VisibilidadeSecureTextSenhaAtual: true})}}
              />
              <TextInputConfirmarSenha 
                title = {'Nova senha'}
                keyboardType = {'default'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputConfirmarSenha = ref}}
                value = {this.state.ConfirmarSenha}
                onChangeText = {this.onChangeInputConfirmarSenha}
                onSubmitEditing = {this.submitInputConfimarSenha}
                securetext = {this.state.VisibilidadeSecureTextNovaSenha}
                onChangeSecureText = {async () => {this.state.VisibilidadeSecureTextNovaSenha == true ? await this.setState({VisibilidadeSecureTextNovaSenha: false}) : await this.setState({VisibilidadeSecureTextNovaSenha: true})}}
              />
            </View>
          </View>
          <View style = {{paddingHorizontal: 24, flexDirection: 'row'}}>
            <TouchableOpacity // Avançar
              style = {{
                flex: 1,
                borderRadius: 5,
                backgroundColor: this.props.StyleGlobal.cores.background,
                paddingHorizontal: 16,
                height: 58,
                alignItems: 'center',
                justifyContent: "center",
                marginBottom: 20
            }}
              onPress = {async () => {
                if(await Validacoes.TelaCadatrarSenha(this.state) == true) {
                  await this.setVisibilidadeModalValidandoArquivos(true)
                  if(this.props.RegistroCliente[0].Registros.ID > 0) {
                    await this.putCliente();
                  } else {
                    await this.postCliente();
                  }
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
              }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Container>
    );
  }
  //#endregion

  //#region Controller

  //#region Setando a visibilidade da modal de confirmação de dados
  setVisibilidadeModalConfirmarDados(value) {
    this.setState({VisibilidadeModalConfirmarDados: value})
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

  //#region onSubmit no input criar senha
  submitInputConfimarSenha = async () => {
    
  }
  //#endregion

  //#region Dados do cliente
  dadosCliente = async () => {
    this.state.dadosCliente = [{
      "id": this.props.RegistroCliente[0].Registros.ID,
      "cpf": this.props.CPF_CNPJ[0].CPF_CNPJ,
      "nome": this.props.Nome[0].Nome,
      "natureza": 2,
      "dataDeNascimento": moment(this.props.DataDeNascimento[0].Data_nasc, "MM-DD-YYYY", true).format("YYYY-MM-DD"),
      "emails": (this.props.DadosCliente[4].Email != "" && this.props.DadosCliente[4].Email != null) ? [this.props.Email[0].Email] : null,
      "documentoPessoal": (this.state.Documento_rg != "" && this.state.Documento_rg != null) ? this.state.Documento_rg[0] : null,
      "rg": {
        "numero": this.state.NumeroRG,
        "orgaoEmissor": this.state.OrgaoEmissorRG,
        "uf": this.state.UFRG
      },
      "creci": {
        "numero": this.state.NumeroCRECI,
        "uf": this.state.UFCRECI,
        "dataDeValidade": formatoDeTexto.DataJSON(this.state.ValidadeUFCRECI)
      },
      "estadoCivil": this.props.EstadoCivil[0].EstadoCivil,
      "documentoDeEstadoCivil": (this.state.Documento_certidao != "" && this.state.Documento_certidao != null) ? this.state.Documento_certidao[0] : null,
      "regimeDeBens": this.props.EstadoCivil[0].EstadoCivil == 2 ? this.props.RegimeDeBens[0].RegimeDeBens : null,
      "necessarioAssinaturaDoConjuge": false,
      "conjuge": this.props.EstadoCivil[0].EstadoCivil == 2 ? {
        "id": this.props.RegistroConjuge[0].Registros.ID == 0 ? null : this.props.RegistroConjuge[0].Registros.ID,
        "cpf": this.props.CPF_CNPJ_Conjuge[0].CPF_CNPJ_Conjuge,
        "nome": this.props.Nome_Conjuge[0].Nome_Conjuge,
        "natureza": 2,
        "dataDeNascimento": moment(this.props.DataDeNascimento_Conjuge[0].Data_nasc_Conjuge, "MM-DD-YYYY", true).format("YYYY-MM-DD"),
        "emails": (this.props.DadosConjuge[4].email_Conjuge != "" && this.props.DadosConjuge[4].email_Conjuge != null) ? [this.props.Email_Conjuge[0].email_Conjuge]: null,
        "documentoPessoal": (this.props.DocumentosConjuge[1].Documentos != "" && this.props.DocumentosConjuge[1].Documentos != null) ? this.props.DocumentosConjuge[1].Documentos[0] : null,
        "rg": null,
        "creci": null,
      } : null,
      "endereco": this.props.Endereco[1] != "" && this.props.Endereco[1] != null ? this.props.Endereco[1] : null,
      "documentoEndereco": (this.state.Documento_endereco != "" && this.state.Documento_endereco != null) ? this.state.Documento_endereco[0] : null,
      "telefones": (this.props.Telefone != "" && this.props.Telefone != null) ? this.props.Telefone[1].Telefones : null,
    }]
  }
  //#endregion

  //#region Separando documentos
  separandoDocumentos = async () => {
    if(this.props.Documentos != "" && this.props.Documentos != null) {
      if(this.props.Documentos[1].Documentos.filter(documentos => documentos.classificacao == 1) != "") {
        this.state.Documento_rg = this.props.Documentos[1].Documentos.filter(documento => documento.classificacao == 1)
      }
      if(this.props.Documentos[1].Documentos.filter(documentos => documentos.classificacao == 2) != "") {
        this.state.Documento_endereco = this.props.Documentos[1].Documentos.filter(documentos => documentos.classificacao == 2)
      }
      if(this.props.Documentos[1].Documentos.filter(documentos => documentos.classificacao == 3) != "") {
        this.state.Documento_certidao = this.props.Documentos[1].Documentos.filter(documentos => documentos.classificacao == 3)
      }
    }
  }
  //#endregion

  //#region Post cliente
  postCliente = async () => {
    try {
      const response = await Pessoa.cadastrar(String(this.props.token[0].token), ...this.state.dadosCliente);
      if(response.status == 200 || response.status == 201) {
        const dados = response.data;
        await this.setState({Pessoa: dados.id});
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
      const response = await Pessoa.alterarDados(String(this.props.token[0].token),...this.state.dadosCliente)
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

  //#region Post senha pessoa
  postSenhaPessoa = async () => {
    try {
      if(this.state.CriarSenha === this.state.ConfirmarSenha) {
        console.log(this.state.Pessoa)
        console.log(this.state.ConfirmarSenha)
        const response = await Logon.cadastrar(String(this.props.token[0].token), this.state.Pessoa, this.state.ConfirmarSenha);
        if(response.status == 200 || response.status == 201) {
          await this.setVisibilidadeModalValidandoArquivos(false)
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `${(this.props.Nome[0].Nome).split(' ')[0]} seu cadastro foi efetuado com sucesso`
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
          message: `O usuário já existe!`
        })
    }
  }
  //#endregion

  //#region Dados de RG e CRECI
  pegandoDadosRG_CRECI = async () => {
    const NumeroRG = await this.props.navigation.getParam('NumeroRG', 'null')
    const OrgaoEmissorRG = await this.props.navigation.getParam('OrgaoEmissorRG', 'null')
    const UFRG = await this.props.navigation.getParam('UFRG', 'null')
    const NumeroCRECI = await this.props.navigation.getParam('NumeroCRECI', 'null')
    const UFCRECI = await this.props.navigation.getParam('UFCRECI', 'null')
    const ValidadeUFCRECI = await this.props.navigation.getParam('ValidadeURECI')
    await this.setState({NumeroRG: NumeroRG, OrgaoEmissorRG: OrgaoEmissorRG, UFRG: UFRG, NumeroCRECI: NumeroCRECI, UFCRECI: UFCRECI, ValidadeUFCRECI: ValidadeUFCRECI})
  }
  //#endregion

  //#region Setando a visibilidade da modal de validação de arquivos
  setVisibilidadeModalValidandoArquivos(value) {
    this.setState({VisibilidadeModalValidandoArquivos: value})
  }
  //#endregion

  //#endregion

}

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  StyleGlobal: state.StyleGlobal
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EsqueceuSenha);