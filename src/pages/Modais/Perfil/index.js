//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Animated, Modal, View, Text, Button, } from 'react-native';
//#endregion

//#region Externas
import Toast from 'react-native-toast-message';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Pessoa } from '~/services';
//#endregion

import { BotaoAlterar, BotaoAlterarTexto } from './style';

import {TextInputEmail, TextInputNome} from '../../../components/index'

class Perfil extends Component {
  constructor(props)
  {
    super(props);
  }

  AlterarDados = async (param1, param2) => {
    this.setState({Loading: true})
    Toast.show({
      type: 'success',
      text1: 'Alterando dados, aguarde!',
      position: "top",
      visibilityTime: 10000
    })
    let Response = await Pessoa.alterarDados(this.props.token[0].token,{
      id: this.props.token[0].pessoa.id,
      cpf: this.props.token[0].pessoa.cpf,
      nome: param1,
      status: null,
      natureza: 2,
      dataDeNascimento: null,
      emails: [
        {
          classificacao: 0,
          descricao: param2,
          host: null,
          porta: null,
          usuario: null,
          senha: null,
          habilitarSSL: null
        }
      ],
      salasDeVenda: null,
      documentoPessoal: null,
      rg: null,
      creci: null,
      estadoCivil: null,
      documentoDeEstadoCivil: null,
      regimeDeBens: null,
      cargo: null,
      cargos: null,
      ocupacao: null,
      necessarioAssinaturaDoConjuge: true,
      conjuge: null,
      endereco: null,
      documentoEndereco: null,
      telefones: null,
      observacao: null,
      tokenDeNotificacao: null,
      pjVinculado: null,
      liderResponsavel: null
    })

    if (Response !== null && Response !== undefined && Response !== ""){
      Toast.show({
        type: 'success',
        text1: 'Dados alterados com sucesso',
        text2: 'Atualize seu perfil para visualizar as alterações!',
        position: 'top',
        visibilityTime: 10000
      })
      this.setState({Loading: false})
    }else {
      Toast.show({
        type: 'success',
        text1: 'Erro ao alterar dados.',
        text2: 'Entre em contato com a equipe de desenvolvimento!',
        position: "top",
        visibilityTime: 10000
      })
      this.setState({Loading: false})
    }
  }

  //#region Model
  state = {
    AnimatedHeader: new Animated.Value(1),
    AnimatedEmailCliente: new Animated.Value(114),
    AnimatedNomeCliente:  new Animated.Value(114),
    NomeCliente: this.props.token[0].pessoa.nome,
    EmailCliente: this.props.token[0].pessoa.emails[0] ? this.props.token[0].pessoa.emails[0].descricao : "",
    Loading: false
  };
  //#endregion

  submitInputNomeCliente = async () => {
    this.InputNomeCliente.focus();
  }

  submitInputEmailCliente = async () => {
    this.InputEmailCliente.focus();
  }

  onChangeInputEmailCliente = async (value) => {
   this.setState({EmailCliente: value})
  }
  
  onChangeInputNomeCliente = async (value) => {
   this.setState({NomeCliente: value})
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
    }
    //#endregion
  //#region View
  render() {
    return(
      <Modal animationType = "fade" transparent = {false} visible = {this.props.visibilidade}>
        <View style = {{ backgroundColor: '#FFF',}}>
          <View style={{backgroundColor:'#0e4688', height: Platform.OS === "ios" ? '10%' : '7%', borderBottomWidth:2, borderColor: '#4B763B'}}>
            <Icon name='arrow-back' size={45} style={{alignSelf: 'flex-start', marginTop: Platform.OS === "ios" ? 38 : 0, color: '#FFF' }} onPress={this.props.onPressClose}/>
            <Text style={{ textAlign:'center', marginTop:-38, fontWeight: 'bold', color: '#FFF', fontSize: 20, margin: 60,}}>Informações de Usuário</Text>
          </View>
          <View style={{height: '100%', marginTop:25, marginHorizontal: 10 }}>
            <View>
              <TextInputNome
                title = {'Nome'}
                animated={this.state.AnimatedNomeCliente}
                keyboardType = {'default'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputNomeCliente = ref}}
                value = {this.state.NomeCliente}
                onChangeText = {this.onChangeInputNomeCliente}
                onSubmitEditing = {this.submitInputNomeCliente}
              />
              <TextInputEmail
                title = {'Email'}
                animated={this.state.AnimatedEmailCliente}
                keyboardType = {'default'}
                returnKeyType = {'go'}
                id = {(ref) => {this.InputEmailCliente = ref}}
                value = {this.state.EmailCliente}
                onChangeText = {this.onChangeInputEmailCliente}
                onSubmitEditing = {this.submitInputEmailCliente}
              />
            </View>
            <View style={{ marginTop: 35 }}>
              <BotaoAlterar
                activeopacity={0.75}
                onPress={() => {
                  this.AlterarDados(this.state.NomeCliente, this.state.EmailCliente)
                }}
                disabled={this.state.Loading}
              >
                <BotaoAlterarTexto>Alterar</BotaoAlterarTexto>
              </BotaoAlterar>
            </View>
          </View>
        </View>
        <Toast/>
      </Modal>
    );
  }
  //#endregion
}

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  Cargos: state.Cargos,
  ConfigCss: state.configcssApp,
  EmpresaLogada: state.EmpresaLogada,
  StyleGlobal: state.StyleGlobal
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Perfil);

Perfil.propTypes = {
  visibilidade: PropTypes.bool,
  onPressClose: PropTypes.func,
}