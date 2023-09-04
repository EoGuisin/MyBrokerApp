//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity, Alert, Linking, BackHandler, Platform, KeyboardAvoidingView, Switch, StatusBar } from 'react-native';
import VersionCheck from 'react-native-version-check';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import Lottie from 'lottie-react-native';
import PropTypes from 'prop-types';
import { getVersion, getBuildNumber, getDeviceId } from 'react-native-device-info';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Logon, Empresas } from '../../../services';
//#endregion

//#region Redux
import { StyleLogonCadastroActions, StyleGlobalActions, EmpresaLogadaActions, TelaAtualActions, DadosUsuarioActions, DadosEmpreendimentoActions, DadosMeiosDeContatoActions, DadosModeloDeVendasActions, EntradasActions, IntermediariasActions, ParcelasActions, LotesActions, ClienteActions, ConjugeActions, EnderecoActions, TelefonesActions, DocumentosOriginaisActions, DocumentosActions, DocumentosConjugeActions, DadosCorretagemActions, DadosIntermediacaoActions, DadosTabelaParcelasActions, TabelaDeVendasActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
import Loader from '../../../effects/loader.json';
import LoaderCircle from '../../../effects/loader-circle.json';
import LoaderCircleColor from '../../../effects/loader-circle-color.json';
//#endregion

//#region Componentes
import { ContainerLogin, TextInputUsuario, TextInputSenha, TextInputEmpresa } from '../../../components';
import { EsqueciSenha, EsqueciSenhaTexto, BotaoEntrar, LoginButtom, BotaoEntrarTexto, BotaoCriarConta, CriarConta, CriarContaTexto, Versao, VersaoTexto, Header, Footer, ContentFooter } from './styles';
import { ModalImpressaoDigital, ModalSucesso, ModalFalha, ModalCadastro, ModalEmpresa, ModalPrimeiroLogin } from '../../Modais';
//#endregion

//#region Version code
const VersionCode = getVersion()
//#endregion

//#region Imagens
import LogoMyBrokerBranca from '../../../assets/MyBrokerBranca.svg';
//#endregion

//#endregion

class Login extends Component {  

  _isMounted = false;
  //#region Funcoes do componente
  componentDidMount = async () => {
    this._isMounted = true;
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      
      this.cleanRedux();

    })
    // this.setVisibilidadeSucesso(true);
    this.pegandoValorDoUsuario();
    this.pegandoValorDaSenha();
    this.pegandoValorEmpresaLogada();
    // this.pegandoGruposDeEmpresas();
    this.cleanRedux();
    this.checkVersion();
  }
  //#endregion

  //#region Component Unmount
  componentWillUnmount() {
    this._isMounted = false;
  }
  //#endregion

  //#region Model
  state = {
    CPF: null,
    Senha: null,
    ListaEmpresa: [
      {
        "id": 0,
        "descricao": "GAV Resorts"
      },
      {
        "id": 1,
        "descricao": "Harmonia"
      },
      {
        "id": 2,
        "descricao": "Silva Branco"
      }
    ],
    GruposEmpresas: [],
    Empresa: null,
    EmpresasPermitidas: [],
    VisibilityScreen: true,
    VisibilidadeIndicadorDeCarregamento: false,
    VisibilidadeModalImpressaoDigital: false,
    VisibilidadeModalSucesso: false,
    VisibilidadeModalFalha: false,
    VisibilidadeModalCadastro: false,
    VisibilidadeModalEmpresa: false,
    VisibilidadeErroLogin: false,
    VisibilidadeSecureText: true,
    VisibilidadeModalPrimeiroLogin: false,
    InverterAnimacaoDasOpcoesMenu: false,
    VisibilidadeSecureTextCriarSenha: true,
    VisibilidadeSecureTextConfirmarSenha: true,
    ConfirmarSenha: null,
    CriarSenha: null,
    buttomWidth: new Animated.Value(20),
    Token: null,
    Pessoa: null,
    primeiroAcesso: false,
    loadingEsqueciSenha: false,
    changeCPFEmail: false,
  };
  //#endregion

  //#region View
  render() {
    return (
      <KeyboardAvoidingView 
        style = {{flex: 1}} behavior = {Platform.OS === "ios" ? "padding" : "height"}>
      <ContainerLogin>
        <ModalPrimeiroLogin
          visibilidade = {this.state.VisibilidadeModalPrimeiroLogin}
          titleNovaSenha = {'Nova senha'}
          titleConfirmarSenha = {'Confirme a senha'}
          valueConfirmarSenha = {this.state.ConfirmarSenha}
          valueNovaSenha = {this.state.CriarSenha}
          securetextNovaSenha = {this.state.VisibilidadeSecureTextCriarSenha}
          securetextConfirmarSenha = {this.state.VisibilidadeSecureTextConfirmarSenha}
          onChangeSecureTextNovaSenha = {async () => {this.state.VisibilidadeSecureTextCriarSenha == true ? await this.setState({VisibilidadeSecureTextCriarSenha: false}) : await this.setState({VisibilidadeSecureTextCriarSenha: true})}}
          onChangeSecureTextConfirmarSenha = {async () => {this.state.VisibilidadeSecureTextConfirmarSenha == true ? await this.setState({VisibilidadeSecureTextConfirmarSenha: false}) : await this.setState({VisibilidadeSecureTextConfirmarSenha: true})}}
          onChangeNovaSenha = {this.onChangeInputCriarSenha}
          onChangeConfirmarSenha = {this.onChangeInputConfirmarSenha}
          onSubmitNovaSenha = {this.submitInputCriarSenha}
          onSubmitConfirmarSenha = {this.submitInputConfimarSenha}
          keyboardConfirmarSenha = {'default'}
          keyboardNovaSenha = {'default'}
          idNovaSenha = {(ref) => {this.InputCriarSenha = ref}}
          idConfirmarSenha = {(ref) => {this.InputConfirmarSenha = ref}}
          returnKeyTypeNovaSenha = {'next'}
          returnKeyTypeConfirmarSenha = {'go'}
          onPressConfirmar = { async () => { await this.atualizacaoSenha() }}
        />
        <ModalImpressaoDigital visibilidade = {this.state.VisibilidadeModalImpressaoDigital} 
          onPress = { async () => {
            this.setVisibilidadeImpressaoDigital(false)
            this.setState({Senha: null})
        }}/>
        <ModalSucesso 
          visibilidade = {this.state.VisibilidadeModalSucesso} 
        />
        <ModalFalha 
          visibilidade = {this.state.VisibilidadeModalFalha} 
        />
        <ModalCadastro 
          visibilidade = {this.state.VisibilidadeModalCadastro} 
          onPress = {this.setVisibilidadeCadastro} 
        />
        <ModalEmpresa
          visibilidade = {this.state.VisibilidadeModalEmpresa}
          keyExtractorFlatList = {item => item.grupo}
          renderEmpresas = {this.renderEmpresas}
          dataEmpresas = {this.state.GruposEmpresas}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onPressVisibilidade = {async() => {
            this.setState({VisibilidadeIndicadorDeCarregamento: false})
            this.setVisibilidadeModalEmpresa(false)
          }}
        />
        <StatusBar
          barStyle = "light-content"
          hidden = {false}
          backgroundColor = {this.props.StyleLogonCadastro.cores.background}
          translucent = {true}
          networkActivityIndicatorVisible = {true}
        />
        {this.state.VisibilidadeModalSucesso != true && this.state.VisibilityScreen && <>
        <Header
          style = {{
            backgroundColor: this.props.StyleLogonCadastro.cores.background,
            borderBottomRightRadius: Dimensions.get('window').width * 0.75,
            height: 270,
            justifyContent: "center"
        }}>
          {true && <LogoMyBrokerBranca width = {Dimensions.get('window').width * 0.5} height = {170} style = {{marginLeft: 30}}/>}
        </Header>
        <Footer
          style = {{
            backgroundColor: this.props.StyleLogonCadastro.cores.background,
            height: Dimensions.get("window").height - 230
        }}>
          <ContentFooter
            style = {{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: Dimensions.get('window').width * 0.2,
              justifyContent: 'space-around',
          }}>
            <View style = {{ alignItems: 'center', marginTop: 60 }}>
              <TextInputUsuario 
                title = {"Usuário"}
                changeIcon = {this.state.changeCPFEmail == true ? true : false}
                autoCapitalize = {"none"}
                textAlignVertical = {"bottom"} 
                returnKeyType = {(Platform.OS == "ios") ? (this.state.changeCPFEmail == true ? 'go' : 'done') : 'go'}
                keyboardType = {this.state.changeCPFEmail == true ? 'default' : 'numeric'}
                value = {this.state.CPF}
                onChangeText = {this.setLogin}
                onSubmitEditing = {() => { this.focoInputSenha() }}
              />
              <TextInputSenha 
                title = {"Senha"}
                autoCapitalize={"none"}
                textAlignVertical={"bottom"}
                returnKeyType={'next'}
                value={this.state.Senha}
                estilo = {{borderBottomLeftRadius: this.state.VisibilidadeErroLogin == true ? 0 : 10, borderBottomRightRadius: this.state.VisibilidadeErroLogin == true ? 0 : 10}}
                onChangeText={this.setSenha} onSubmitEditing={this.validandoTelaPeloInput}
                id = {value => this.setIdInputSenha(value)}
                securetext = {this.state.VisibilidadeSecureText}
                onChangeSecureText = { async () => { this.state.VisibilidadeSecureText == true ? this.setState({VisibilidadeSecureText: false}) : this.setState({VisibilidadeSecureText: true}) }}
              />
              {this.state.VisibilidadeErroLogin == true &&
              <View 
                style = {{
                  width: Dimensions.get('window').width - 33,
                  backgroundColor: '#F84B4B',
                  paddingLeft: 20,
                  paddingTop: 14,
                  paddingBottom: 15,
                  borderWidth: 1,
                  borderColor: '#F84B4B',
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10
              }}>
                <Text style = {{textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 10, color: '#FFFFFF'}}>{`Senha incorreta. Tente novamente ou clique em\n"Esquecei minha senha?" para redefini-la.`}</Text>
              </View>}
              <View style = {{width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 15}}>
                <View style = {{flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 20}}>
                  <Text style = {{color: this.props.StyleLogonCadastro.cores.background, fontSize: 14}}>{`CPF`}</Text>
                  <Switch
                    style={{ transform: [{ scaleX: .5 }, { scaleY: .5 }] }}
                    value = {this.state.changeCPFEmail}
                    thumbColor = {this.props.StyleLogonCadastro.cores.background}
                    trackColor = {{
                      true: "#CCCCCC",
                      false: this.props.StyleLogonCadastro.cores.background
                    }}
                    onValueChange = {() => {
                      if (this.state.changeCPFEmail == false)
                      {
                        this.setState({changeCPFEmail: true, CPF: null})
                      }
                      else
                      {
                        this.setState({changeCPFEmail: false, CPF: null})
                      }
                  }}/>
                  <Text style = {{color: this.props.StyleLogonCadastro.cores.background, fontSize: 14}}>{`Email`}</Text>
                </View>
                <View style = {{flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                  <EsqueciSenha disabled = {this.state.VisibilidadeIndicadorDeCarregamento} 
                    onPress = {async () => {
                      this.setState({loadingEsqueciSenha: true})
                      if(await this.validandoCPF() == true)
                      {
                        let Response = await Logon.SolicitarNovaSenha(formatoDeTexto.CPF_CNPJOriginal(this.state.CPF))
                        if(Math.floor(Response.status / 100) == 2)
                        {
                          PushNotification.localNotification({
                            largeIcon: 'icon',
                            smallIcon: 'icon',
                            vibrate: true,
                            vibration: 300,
                            title: 'My Broker',
                            message: `Caro usuário, sua solicitação de troca de senha, foi enviada para o email: ${((Response.data).destinatario)}`
                          })
                          this.setState({loadingEsqueciSenha: false})
                        }
                        else
                        {
                          PushNotification.localNotification({
                            largeIcon: 'icon',
                            smallIcon: 'icon',
                            vibrate: true,
                            vibration: 300,
                            title: 'My Broker',
                            message: 'Não foi possível solicitar nova senha, entre em contato com a equipe de desenvolvimento.'
                          })
                          this.setState({loadingEsqueciSenha: false})
                        }
                      }
                  }}>
                      <EsqueciSenhaTexto 
                        style = {{
                          color: this.props.StyleLogonCadastro.cores.background, 
                          fontWeight: "bold",
                    }}>Esqueci minha senha</EsqueciSenhaTexto>
                  </EsqueciSenha>
                  <View style = {{width: this.state.loadingEsqueciSenha == false ? 0 : 18 , height: this.state.loadingEsqueciSenha == false ? 0 : 18, marginTop: 24, marginRight: 20, marginBottom: 2}}>
                    {this.state.loadingEsqueciSenha == true && <Lottie resizeMode ='contain' autoPlay source = {Loader} loop />}
                  </View>
                </View>
              </View>
            </View>
            <View style = {{ alignItems: 'center' }}>
            <AlertNotificationRoot>
              <BotaoEntrar
                style = {{
                  backgroundColor: this.props.StyleLogonCadastro.cores.background, 
                  border: 1, 
                  borderColor: this.props.StyleLogonCadastro.cores.background,
              }}>
                <LoginButtom activeOpacity = {0.75}
                    disabled = {this.state.VisibilidadeIndicadorDeCarregamento} 
                    onPress = {this.validandoTela}>
                    <View>
                      {this.state.VisibilidadeIndicadorDeCarregamento == false && <BotaoEntrarTexto>Entrar</BotaoEntrarTexto>}
                      {this.state.VisibilidadeIndicadorDeCarregamento == true && <Lottie resizeMode ='cover' style = {{ alignSelf: 'center', width: 10, height: 10 }} autoSize autoPlay source = {LoaderCircle} loop />}
                    </View>
                  </LoginButtom>
              </BotaoEntrar>
              </AlertNotificationRoot>
              {false &&
              <CriarConta>
                <BotaoCriarConta
                  activeOpacity = {0.75}
                  disabled = {this.state.VisibilidadeIndicadorDeCarregamento} 
                  onPress = {this.autenticandoTokenCadastro}>
                    <CriarContaTexto style = {{color: this.props.StyleLogonCadastro.cores.background}}>Criar Conta</CriarContaTexto>
                </BotaoCriarConta>
              </CriarConta>}
              <View style = {{marginBottom: 10, marginTop: Dimensions.get('window').height * 0.1}}>
              <Versao>
                <VersaoTexto style = {{color: this.props.StyleLogonCadastro.cores.background}}> Versão: {VersionCode}</VersaoTexto>
              </Versao>
              </View>
            </View>
          </ContentFooter>
        </Footer></>}
      </ContainerLogin>
      </KeyboardAvoidingView>
    );
  }
  //#endregion

  //#region Controller

  //#region CheckVersion
  checkVersion = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();

      if(updateNeeded && updateNeeded.isNeeded)
      {
        Alert.alert(
          'Por favor atualize',
          'Você vai ter que atualizar seu aplicatico para a última versão para continuar usando.',
          [
            {
              text: 'Atualizar',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl);
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {

    }

  }
  //#endregion

  //#region Grupo de empresas
  pegandoGruposDeEmpresas = async () => {
    try {
      let response = await Empresas.consulta('NzAyNjEyMzExNDZjMjl6Skc1bGRETXk=')
      if(response != null && response != undefined)
      {
        this.state.GruposEmpresas = response
        this.pegandoValorDoUsuario();
        this.pegandoValorDaSenha();
        this.pegandoValorEmpresaLogada();
      }
    } catch(err) {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `No momento não é possível logar no app, tente reiniciar o app ou entre em contato com o suporte.`
      })
      this.setVisibilidadeSucesso(false)
    }
  }
  //#endregion

  //#region Validando CPF
  validandoCPF = async () => {
    if (this.state.CPF == '' || this.state.CPF == null)
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: 'Preencha o CPF para fazer a solicitação!'
      })

      this.setState({loadingEsqueciSenha: false})

      return false;
    }
    else if (await this.ValidarCPF(formatoDeTexto.CPF_CNPJOriginal(this.state.CPF)) == false)
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `O CPF é inválido!`
      })

      this.setState({loadingEsqueciSenha: false})

      return false;
    }
    else
    {
      return true;
    }
  }
  //#endregion

  //#region Setando a visibilidade da modal de primeiro login
  setVisibilidadeModalPrimeiroLogin = async (value) => {
    await this.setState({VisibilidadeModalPrimeiroLogin: value})
  }
  //#endregion

  //#region onChangeText no input criar senha
  onChangeInputCriarSenha = async (value) => {
    await this.setState({CriarSenha: value})
  }
  //#endregion

  //#region onChangeText no input confirmar senha
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

  //#region Atualização de senha
  atualizacaoSenha = async () => {
    if(this.state.CriarSenha == null || this.state.CriarSenha == '')
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Preencha: Criar senha.`
      })
    }
    else if (this.state.ConfirmarSenha == null || this.state.ConfirmarSenha == '')
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Preencha: Confirmar Senha.`
      })
    }
    else if (this.state.CriarSenha != this.state.ConfirmarSenha)
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Aviso: As senhas digitadas não correspondem, digite senhas iguais.`
      })
    }
    else
    {
      await this.setVisibilidadeSucesso(true)
      try {
        const response = await Logon.alterarSenha(String(this.state.Token), this.state.Pessoa, this.state.Senha, this.state.CriarSenha)
        if(Math.floor(response.status / 100) == 2)
        {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Senha atualizada com sucesso, faça o login novamente para acessar a aplicação.`
          })
          this.state.Senha = null
          this.state.VisibilidadeIndicadorDeCarregamento = false
          this.state.VisibilidadeErroLogin = false
          await this.setVisibilidadeModalPrimeiroLogin(false)
          await this.setVisibilidadeSucesso(false)
        }
        else
        {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Não foi possível atualizar a senha, tente novamente.`
          })
          await this.setVisibilidadeSucesso(false)
        }
      } catch {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Não foi possível atualizar a senha, tente novamente.`
          })
          await this.setVisibilidadeSucesso(false)
      }
    }
  }
  //#endregion

  //#region Renderizando lista de empresas
  renderEmpresas = ({ item, index }) => (item.descricao == 'GAV Resorts' || item.descricao == 'Pattro Administradora' || item.descricao == 'Harmonia Urbanismo') && (
    <TouchableOpacity 
      key = {index}
      style = {{ marginHorizontal: 8 }}
      activeOpacity = {0.75}
      onPress = { async () => {

        const { addStyleLogonCadastro, addStyleGlobal, addEmpLogada } = this.props;

        this.state.Empresa = item.id
        this.state.EmpresasPermitidas = item.empresas 
        await this.armazenandoValorDoUsuario()
        await this.armazenandoValorDaSenha()
        await this.armazenandoEmpresaLogada()
        await this.armazenandoGrupoDeEmpresasLogada()
        
        addStyleLogonCadastro({
          "cores": {
            "background": '#2a698e',
          },
        })

        addStyleGlobal({
          "cores": {
            "background": '#2a698e',
            "botao": '#2a698e', 
          },
          "fontes": {
            "padrao": 'Aktifo A',
            "corpadrao": '#2a698e',
            "corbase": '#FFFFFF',
            "corpadraoclaro": '#4B763B'
          },
          "empresaLogada": {
            "nome": ""
          },
          "permissoes": {}
        })
        
        addEmpLogada(this.state.Empresa)

        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Aviso: Caro usuário, o funcionamento do aplicativo na My Broker é somente entre às 8:00 hrs e 20:00 hrs, fora desde horário o funcionamento será limitado.`
        })
        this.setState({ VisibilidadeIndicadorDeCarregamento: false });
        this.setState({VisibilidadeErroLogin: false, Senha: null})
        await this.setVisibilidadeModalEmpresa(false)
        await this.props.navigation.navigate('Menu')
    }}>
      <View 
        style = {{
          backgroundColor: item.descricao == this.state.Empresa ? this.props.StyleLogonCadastro.cores.background : '#FFFFFF',
          paddingHorizontal: 16,
          width: '100%',
          borderWidth: 1,
          borderColor: 'rgba(16, 22, 26, 0.15)',
          borderRadius: 5,
          marginVertical: 5,
          height: 58,
          alignItems: "center",
          justifyContent: "center",
      }}>
        <Text 
          style = {{
            paddingVertical: 0,
            fontSize: 12,
            color: item.descricao == this.state.Empresa ? "#FFFFFF" : '#262825',
            fontWeight: item.descricao == this.state.Empresa ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>
    </TouchableOpacity>
  );
  //#endregion

  //#region Desmontando componentes
  componentWillUnmount() {
    this.focusListener.remove()
  }
  //#endregion

  //#region Limpando redux
  cleanRedux = () => {
    const { cleanToTela, cleanToEmpresaCentroDeCusto, cleanToMeiosDeContato, cleanToModelo, cleanToEntradas, cleanToIntermediarias, 
      cleanToParcelas, cleanToLotes, cleanToCliente, cleanToConjuge, cleanToEndereco, cleanToTelefones, 
      cleanToDocumentos, cleanToDocumentosConjuge, cleanToDocumentosOriginais, cleanToCorretagem,
      cleanToIntermediacao, cleanToDadosTabelaDeVendas, cleanToTabelaParcelas, cleanToToken, cleanEmpLogada } = this.props;
      
      cleanToTela()
      cleanToEmpresaCentroDeCusto()
      cleanToModelo()
      cleanToEntradas()
      cleanToIntermediarias()
      cleanToParcelas()
      cleanToLotes()
      cleanToCliente()
      cleanToConjuge()
      cleanToEndereco()
      cleanToTelefones()
      cleanToDocumentosOriginais()
      cleanToDocumentos()
      cleanToDocumentosConjuge()
      cleanToMeiosDeContato()
      cleanToCorretagem()
      cleanToIntermediacao()
      cleanToDadosTabelaDeVendas()
      cleanToTabelaParcelas()
      cleanEmpLogada()
  }
  //#endregion

  //#region Setanndo o CPF no login
  setLogin = async (value) => {
    if (this.state.changeCPFEmail == true) {
      this.setState({ 
        CPF: value
      })
    }
    else
    {
      this.setState({ 
        CPF: formatoDeTexto.CPF_CNPJ(value) 
      })
    }
  }
  //#endregion

  //#region Setando a senha
  setSenha = async (value) => {
    await this.setState({ Senha: value })
  }
  //#endregion

  //#region Setando a senha
  setEmpresa = async (value) => {
    await this.setState({ Empresa: value })
  }
  //#endregion

  //#region Focando o input senha
  focoInputSenha() {
    this.InputSenha.focus()
  }
  //#endregion

  //#region Focando o input senha
  focoInputEmpresa() {
    this.InputEmpresa.focus()
  }
  //#endregion

  //#region Setando a referencia do input da senha
  setIdInputSenha(value) {
    this.InputSenha = value
  }
  //#endregion

  //#region Setando a referencia do input da senha
  setIdInputEmpresa(value) {
    this.InputEmpresa = value
  }
  //#endregion

  //#region Setando visibilidade da modal de impressão digital
  setVisibilidadeImpressaoDigital = async (value) => {
    await this.setState({ VisibilidadeModalImpressaoDigital: value })
  }
  //#endregion

  //#region Setando visibilidade da modal das empresas
  setVisibilidadeModalEmpresa = async (value) => {
    await this.setState({ VisibilidadeModalEmpresa: value })
  }
  //#endregion

  //#region Setando visibilidade da modal de sucesso
  setVisibilidadeSucesso = async (value) => {
    await this.setState({ VisibilidadeModalSucesso: value })
  }
  //#endregion

  //#region Setando visibilidade da modal de falha
  setVisibilidadeFalha = async (value) => {
    await this.setState({ VisibilidadeModalFalha: value })
  }
  //#endregion

  //#region Setando visibilidade da modal de cadastro
  setVisibilidadeCadastro = async (value) => {
    await this.setState({ VisibilidadeModalCadastro: value })
  }
  //#endregion

  //#region Validação dos dados da tela pelo botão de entrar
  validandoTela = async () => {

    var AsyncStorageCPF = await AsyncStorage.getItem('@Login_mybroker');
    var AsyncStorageSenha = await AsyncStorage.getItem('@Senha_mybroker');
    var CPFVazio = (this.state.CPF == null || this.state.CPF == '');
    var SenhaVazia = (this.state.Senha == null || this.state.Senha == '');

    if (((CPFVazio && SenhaVazia) || (!CPFVazio && SenhaVazia)) && AsyncStorageCPF != null && AsyncStorageSenha != null) {
      FingerprintScanner.isSensorAvailable().then(() => {
        this.setVisibilidadeImpressaoDigital(true);
        this.autenticandoDigital();
      }
      ).catch(async () => {
        await Validacoes.TelaLogin(this.state)
        // await this.setVisibilidadeFalha(true);
        // setTimeout(async () => {
        //   this.setVisibilidadeFalha(false);
        // }, 4000)
      });
      return;
    }
    if (!CPFVazio && !SenhaVazia) {
      await this.autenticandoLogin();

      return;
    }
    if ((CPFVazio || SenhaVazia) && (AsyncStorageCPF == null && AsyncStorageSenha == null))
    {
      await Validacoes.TelaLogin(this.state)
      // await this.setVisibilidadeFalha(true);
      // setTimeout(async () => {
      //   this.setVisibilidadeFalha(false);
      // }, 4000)
    }
  }
  //#endregion

  //#region Validação dos dados da tela pelo Input da senha
  validandoTelaPeloInput = async () => {

    var AsyncStorageCPF = await AsyncStorage.getItem('@Login_mybroker');
    var AsyncStorageSenha = await AsyncStorage.getItem('@Senha_mybroker');
    var CPFVazio = (this.state.CPF == null || this.state.CPF == '');
    var SenhaVazia = (this.state.Senha == null || this.state.Senha == '');

    if ((AsyncStorageCPF != null && AsyncStorageSenha != null) && (!CPFVazio && !SenhaVazia)) {
      await this.autenticandoLogin()
      // if (await this.autenticandoLogin() == true) {
      //   const { addEmpLogada } = this.props;
      //   addEmpLogada(this.state.Empresa)
      //   await this.props.navigation.navigate('Menu')
      // }
    }
  }
  //#endregion

  //#region Autenticando a digital do usuário
  autenticandoDigital = async () => {

    var AsyncStorageCPF = await AsyncStorage.getItem('@Login_mybroker');
    var AsyncStorageSenha = await AsyncStorage.getItem('@Senha_mybroker');

    FingerprintScanner
      .authenticate({ onAttempt: this.tentativaDeAutenticacao })
      .then(async () => {
        await this.setState({ CPF: AsyncStorageCPF == null ? this.state.CPF : AsyncStorageCPF, Senha: AsyncStorageSenha == null ? this.state.Senha : AsyncStorageSenha })
        await this.autenticandoLogin()
      })
      .catch(async (error) => {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Aviso: Várias tentativas sem sucesso, por favor insira a senha!`
        })
        FingerprintScanner.release();
      });
  }

  tentativaDeAutenticacao = async (error) => {
    FingerprintScanner.release();
    await this.setVisibilidadeImpressaoDigital(false)
    // await this.setVisibilidadeFalha(true)
    // setTimeout(async () => { this.setVisibilidadeFalha(false) }, 4000)
  };
  //#endregion

  //#region Autenticar o usuario e senha no banco de dados
  autenticandoLogin = async () => {
    this.setState({ VisibilidadeIndicadorDeCarregamento: true });
    if (await Validacoes.TelaLogin(this.state) == true) {
      let Response = await Logon.autenticar(this.state.changeCPFEmail == true ? this.state.CPF : formatoDeTexto.CPF_CNPJOriginal(this.state.CPF), this.state.Senha)
      console.log(Response)
      if (Response != null && Response != undefined)
      {
        this.state.primeiroAcesso = Response.primeiroAcesso;

        if(Response.primeiroAcesso == true)
        {
          this.state.Pessoa = Response.pessoa.id;
          this.state.Token = Response.token;
          await this.setVisibilidadeModalPrimeiroLogin(true);
        }
        else 
        {

          let ResponseGP = await Empresas.consulta(Response.token)
          if (ResponseGP != null && ResponseGP != undefined)
          {
            const { addToToken } = this.props;

            addToToken(Response);

            this.state.GruposEmpresas = ResponseGP;

            await this.setVisibilidadeImpressaoDigital(false);
            FingerprintScanner.release();
            const { addStyleLogonCadastro, addStyleGlobal, addEmpLogada } = this.props;

            this.state.Empresa = ResponseGP[0].id;
            this.state.EmpresasPermitidas = ResponseGP[0].empresas; 
            await this.armazenandoValorDoUsuario();
            await this.armazenandoValorDaSenha();
            await this.armazenandoEmpresaLogada();
            await this.armazenandoGrupoDeEmpresasLogada();
            
            addStyleLogonCadastro({
              "cores": {
                "background": '#2a698e',
              },
            });
    
            addStyleGlobal({
              "cores": {
                "background": '#2a698e',
                "botao": '#2a698e', 
              },
              "fontes": {
                "padrao": 'Aktifo A',
                "corpadrao": '#2a698e',
                "corbase": '#FFFFFF',
                "corpadraoclaro": '#4B763B'
              },
              "empresaLogada": {
                "nome": ""
              },
              "permissoes": {}
            });
            
            addEmpLogada(ResponseGP[0].id);

            this.setState({ VisibilidadeIndicadorDeCarregamento: false });
            this.setState({VisibilidadeErroLogin: false, Senha: null});
            await this.setVisibilidadeModalEmpresa(false);
            await this.props.navigation.navigate('Menu');
            // await this.setVisibilidadeModalEmpresa(true);
          }
        }
      } 
      else 
      {
        // await this.setVisibilidadeFalha(true)
        this.setState({ VisibilidadeIndicadorDeCarregamento: false, VisibilidadeErroLogin: true, Senha: null, buttomWidth: new Animated.Value(20)})
      }
    }
    else 
    {
      this.setState({ VisibilidadeIndicadorDeCarregamento: false, buttomWidth: new Animated.Value(20) });
      return false;
    }
  }
  //#endregion

  //#region Armazenando o usuário no AsyncStorage
  armazenandoValorDoUsuario = async () => {
    try {
      const value = await AsyncStorage.getItem('@Login_mybroker');
      if (value != null) {
        if (value != this.state.CPF) {
          await AsyncStorage.removeItem('@Login_mybroker')
          await AsyncStorage.setItem('@Login_mybroker', formatoDeTexto.CPF_CNPJOriginal(this.state.CPF))
        } else {
        }
      } else {
        await AsyncStorage.setItem('@Login_mybroker', formatoDeTexto.CPF_CNPJOriginal(this.state.CPF))
      }
    } catch (e) { console.log(e) }
  }
  //#endregion

  //#region Armazenando a senha no AsyncStorage
  armazenandoValorDaSenha = async () => {
    try {
      const value = await AsyncStorage.getItem('@Senha_mybroker');
      if (value != null) {
        if (value != this.state.Senha) {
          await AsyncStorage.removeItem('@Senha_mybroker')
          await AsyncStorage.setItem('@Senha_mybroker', this.state.Senha)
        } else {
        }
      } else {
        await AsyncStorage.setItem('@Senha_mybroker', this.state.Senha)
      }
    } catch (e) { console.log(e) }
  }
  //#endregion

  //#region Armazenando a empresa logada no AsyncStorage
  armazenandoEmpresaLogada = async () => {
    try {
      const value = await AsyncStorage.getItem('@EmpresaLogada_mybroker');
      if (value != null) 
      {
        if (parseInt(value) != this.state.Empresa) 
        {
          await AsyncStorage.removeItem('@EmpresaLogada_mybroker')
          await AsyncStorage.setItem('@EmpresaLogada_mybroker', String(this.state.Empresa))
        } 
        else {}
      } 
      else 
      {
        await AsyncStorage.setItem('@EmpresaLogada_mybroker', String(this.state.Empresa))
      }
    } catch (e) { console.log(e) }
  }
  //#endregion

  //#region Armazenando grupo de empresas logadas no AsyncStorage
  armazenandoGrupoDeEmpresasLogada = async () => {
    try {
      let value = await AsyncStorage.getItem('@GrupoLogado_mybroker')
      if(value != null) {
        if(value != this.state.GruposEmpresas)
        {
          await AsyncStorage.removeItem('@GrupoLogado_mybroker')
          await AsyncStorage.setItem('@GrupoLogado_mybroker', JSON.stringify(this.state.GruposEmpresas))
        } else {}
      }
      else 
      {
        await AsyncStorage.setItem('@GrupoLogado_mybroker', JSON.stringify(this.state.GruposEmpresas))
      }
    } catch (e) { console.log(e) }
  }
  //#endregion

  //#region Pegando o valor do usuario armazenado no AsyncStorage
  pegandoValorDoUsuario = async () => {
    try {
      const value = await AsyncStorage.getItem('@Login_mybroker');
      if (value != null) {
        await this.setState({ CPF: formatoDeTexto.CPF_CNPJ(value) })
      } else {
        await this.setState({ CPF: null })
      }
    } catch (e) { console.log(e) }
  }
  //#endregion

  //#region Pegando o valor da senha armazenada no AsyncStorage
  pegandoValorDaSenha = async () => {
    try {
      const value = await AsyncStorage.getItem('@Senha_mybroker');
      if (value != null) {
        // await this.setState({Senha: value})
      } else {
        await this.setState({ Senha: null })
      }
    } catch { console.log(e) }
  }
  //#endregion

  //#region Pegando o valor da empresa logada armazenada no AsyncStorage
  pegandoValorEmpresaLogada = async () => {
    try {
      const value = await AsyncStorage.getItem('@EmpresaLogada_mybroker');
      if (value != null) {
        this.setState({ Empresa: parseInt(value) })

        const { addStyleLogonCadastro, addEmpLogada } = this.props;

        addStyleLogonCadastro({
          "cores": {
            "background": '#2a698e',
          },
        })
        addEmpLogada(this.state.Empresa)
        this.pegandoGrupoDeEmpresasLogada();
        this.setVisibilidadeSucesso(false)
      } else {
        this.setState({ Empresa: null })        
        this.setVisibilidadeSucesso(false)
      }
    } catch { console.log(e) }
  }
  //#endregion

  //#region Pegando o grupo de empresas logadas no AsyncStorage
  pegandoGrupoDeEmpresasLogada = async () => {
    try {
      let value = await AsyncStorage.getItem('@GrupoLogado_mybroker')
      if(value != null)
      {
        await this.setState({GruposEmpresas: JSON.parse(value)})
        this.state.GruposEmpresas.map(empresa => {
          if(empresa.id == this.state.Empresa)
          {
            this.state.EmpresasPermitidas = empresa.empresas
          }
        })
      }
      else
      {
        await this.setState({GruposEmpresas: []})
      }
    } catch (e) {

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

  //#region Acessando a criação de conta
  autenticandoTokenCadastro = async () => {
    this.setVisibilidadeCadastro(true)
    let response = await Logon.token_cadastro('70261231146', 'sos$net32');
    if(response != null && response != undefined && response != "") 
    {
      
      const { addToToken } = this.props;

      addToToken(response);

      this.setVisibilidadeCadastro(false)

      this.props.navigation.navigate('DadosUsuario')
    } 
    else 
    { 
      this.setVisibilidadeCadastro(false)
    }
}
  //#endregion

  //#region Recuperando a senha

  //#endregion

  //#region Acessando os Termos e condições

  //#endregion

  //#endregion

}

const mapStateToProps = state => ({
  StyleLogonCadastro: state.StyleLogonCadastro
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...StyleLogonCadastroActions, ...StyleGlobalActions, ...EmpresaLogadaActions,...DadosUsuarioActions,...TelaAtualActions,...DadosEmpreendimentoActions,...DadosModeloDeVendasActions, ...DadosMeiosDeContatoActions, ...EntradasActions, ...IntermediariasActions, ...ParcelasActions, ...LotesActions, ...ClienteActions, ...ConjugeActions, ...EnderecoActions, ...TelefonesActions, ...DocumentosOriginaisActions, ...DocumentosActions, ...DocumentosConjugeActions, ...DadosCorretagemActions, ...DadosIntermediacaoActions, ...DadosTabelaParcelasActions, ...TabelaDeVendasActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);