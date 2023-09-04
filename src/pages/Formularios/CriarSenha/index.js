//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Keyboard, View, Text, Animated, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
//#endregion

//#region Externas
import { getDeviceId } from "react-native-device-info";
import CheckBox from '@react-native-community/checkbox';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PushNotification from 'react-native-push-notification';
import Icon from 'react-native-vector-icons/MaterialIcons';
//#endregion

//#region Chaves de filtragem

//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Pessoa, Logon } from "../../../services";
//#endregion

//#region Componentes
import { Container, TextInputConfirmarSenha, TextInputCriarSenha } from '../../../components';
import { ModalPoliticaDePrivacidade, ModalConfirmarDados, ModalValidandoArquivos } from '../../Modais';
//#endregion

//#endregion

class CriarSenha extends Component {

  //#region Funcoes do componente
  componentDidMount = async () => {
    await this.pegandoDadosRG_CRECI();
    await this.separandoDocumentos();
    await this.dadosCliente();

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
    VisibilidadeModalTermosDeUso: false,
    VisibilidadeModalValidandoArquivos: false,
    VisibilidadeSecureTextCriarSenha: true,
    VisibilidadeSecureTextConfirmarSenha: true,
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
    ToggleCheckBox: false,
    dadosCliente: [],
    dadosConjuge: [],
    ID: "",
  };
  
  //#endregion

  //#region View
  render() {
    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
        <ModalPoliticaDePrivacidade
          visibilidade = {this.state.VisibilidadeModalTermosDeUso}
          onPressClose = {() => {this.setState({VisibilidadeModalTermosDeUso: false})}}
        />
        <ModalConfirmarDados 
        visibilidade = {this.state.VisibilidadeModalConfirmarDados}
        onPressIcon = {() => {this.setVisibilidadeModalConfirmarDados(false)}}
        onPressObrigado = {() => {this.props.navigation.navigate('Login')}}
        />
        <ModalValidandoArquivos visibilidade = {this.state.VisibilidadeModalValidandoArquivos} onPress = {() => {this.setVisibilidadeModalValidandoArquivos(false)}}/>
        <View style = {{ height: 62, marginBottom: 20 }}>
          <View 
            style = {{
              flexDirection: 'row', 
              alignItems: 'center', 
              width: '100%', 
              justifyContent: 'space-between',
              paddingTop: 25
          }}>
            <Icon name = {'keyboard-arrow-left'} color = {'#26A77C'} size = {40} 
            onPress = {() => {this.props.navigation.goBack()}}/>
            <Text
              style = {{
                marginTop: 6,
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: 16,
                textAlign: 'center',
                color: '#26A77C'
            }}>Senha</Text>            
            <View style = {{width: 40}}></View>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator = {false}>
          <View
            style = {{ paddingHorizontal: 24, marginBottom: 15, minHeight: Dimensions.get('window').height - 175,
          }}>
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
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <CheckBox
                  style={{ height: 50, borderRadius: 3, transform: (Platform.OS === "ios") ? [{ scaleX: .6 }, { scaleY: .6 }] : [{ scaleX: .9 }, { scaleY: .9 }]}}
                  disabled={false}
                  value={this.state.ToggleCheckBox}
                  boxType={'circle'}
                  onAnimationType={"flat"}
                  onValueChange={(newValue) => {
                    this.setState({ToggleCheckBox: newValue })
                  }}
                />
                <Text style = {{ fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, textAlign: 'center', color: '#26A77C'}}>Li e concordo com a  </Text>
                <TouchableOpacity activeOpacity={0.75} 
                  onPress={() => { this.setState({VisibilidadeModalTermosDeUso: true})}}
                >
                 <Text style = {{ fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, textAlign: 'center', color: '#26A77C'}}>Política de Privacidade</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style = {{paddingHorizontal: 24, flexDirection: 'row'}}>
            <TouchableOpacity // Avançar
              style = {{
                flex: 1,
                backgroundColor: '#26A77C',
                padding: 16,
                height: 58,
                alignItems: 'center',
                marginBottom: 20
            }}
              onPress = {async () => {
                if(await Validacoes.TelaCadatrarSenha(this.state) == true) {
                  if(this.state.ToggleCheckBox == true){
                    await this.setVisibilidadeModalValidandoArquivos(true)
                    if(this.props.RegistroCliente[0].Registros.ID > 0) {
                      await this.putCliente();
                    } else {
                      await this.postCliente();
                    }
                }else{
                  PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Você deve concordar com a política de privacidade para continuar!`
                  })
                }
                }
            }}>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'normal',
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
      "dataDeNascimento": null,
      "emails": (this.props.DadosCliente[4].Email != "" && this.props.DadosCliente[4].Email != null) ? [this.props.Email[0].Email] : null,
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
        console.log(dados.id)
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
      const response = await Pessoa.alterarDados(String(this.props.token[0].token),...this.state.dadosCliente)
      if(response.status == 200 || response.status == 201) {
        const dados = response.data;
        console.log(dados.id)
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
          message: `O usuário já existe.`
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
  RegistroCliente: state.dadosCliente.filter(cliente => cliente.Registros),
  DadosCliente: state.dadosCliente,
  CPF_CNPJ: state.dadosCliente.filter(cliente => cliente.CPF_CNPJ),
  Nome: state.dadosCliente.filter(cliente => cliente.Nome),
  DataDeNascimento: state.dadosCliente.filter(cliente => cliente.Data_nasc),
  EstadoCivil: state.dadosCliente.filter(cliente => cliente.EstadoCivil),
  RegimeDeBens: state.dadosCliente.filter(cliente => cliente.RegimeDeBens),
  Email: state.dadosCliente.filter(cliente => cliente.Email),

  RegistroConjuge: state.dadosConjuge.filter(conjuge => conjuge.Registros),
  DadosConjuge: state.dadosConjuge,
  CPF_CNPJ_Conjuge: state.dadosConjuge.filter(conjuge => conjuge.CPF_CNPJ_Conjuge),
  Nome_Conjuge: state.dadosConjuge.filter(conjuge => conjuge.Nome_Conjuge),
  DataDeNascimento_Conjuge: state.dadosConjuge.filter(conjuge => conjuge.Data_nasc_Conjuge),
  Email_Conjuge: state.dadosConjuge.filter(conjuge => conjuge.email_Conjuge),

  RegistroDocumentos: state.dadosDocumentos.filter(documento => documento.Registros),
  Documentos: state.dadosDocumentos,

  DocumentosConjuge: state.dadosDocumentosConjuge,

  Endereco: state.dadosEndereco,

  Telefone: state.dadosTelefones,
  StyleGlobal: state.StyleGlobal
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CriarSenha);