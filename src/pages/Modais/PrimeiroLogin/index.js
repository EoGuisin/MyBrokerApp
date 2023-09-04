//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Animated, Modal, View, ImageBackground, ViewPropTypes, TouchableOpacity, Text, TextInput, Dimensions, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
//#endregion

//#region Chaves de filtragem

//#endregion

//#region Services

//#endregion

//#region Redux

//#endregion

//#region Estilização das telas e efeitos

//#endregion

//#region Componentes
import { PickerView, TextInputPadrao, TextInputCriarSenha, TextInputConfirmarSenha } from '../../../components';
//#endregion

//#region Imagens

//#endregion

//#endregion
class PrimeiroLogin extends Component {
  constructor(props)
  {
    super(props);
  }

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

  //#region Model
  state = {
    AnimatedHeader: new Animated.Value(1),
    ID: "",
  };
  //#endregion

  //#region View
  render() {
    return(
      <Modal
        animationType = "slide"
        transparent = {false}
        visible = {this.props.visibilidade}>
         <View 
          style = {{
            flex: 1,
            backgroundColor: '#F6F8F5', 
            justifyContent: 'flex-start'
        }}>
          <View
            style = {{
              backgroundColor: this.props.StyleLogonCadastro.cores.background, 
              height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 75 : 62,
              justifyContent: "center"
          }}>
            <View
              style = {{ 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#FFFFFF',
                  flexWrap: 'wrap'
              }}>Primeiro acesso: atualização de senha</Text>
            </View>
          </View>
          <View
            style = {{
              marginHorizontal: 24, 
              marginTop: 24, 
              height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 117) : Dimensions.get('window').height - 107,
              justifyContent: 'space-between',
            }}>
              <View></View>
              <View>
                <View style = {{marginBottom: 8}}>
                  <TextInputCriarSenha
                    title = {this.props.titleNovaSenha}
                    keyboardType = {this.props.keyboardNovaSenha}
                    returnKeyType = {this.props.returnKeyTypeNovaSenha}
                    id = {this.props.idNovaSenha}
                    value = {this.props.valueNovaSenha}
                    onChangeText = {this.props.onChangeNovaSenha}
                    onSubmitEditing = {this.props.onSubmitNovaSenha}
                    securetext = {this.props.securetextNovaSenha}
                    onChangeSecureText = {this.props.onChangeSecureTextNovaSenha}
                  />
                </View>
                <View style = {{marginBottom: 8}}>
                  <TextInputConfirmarSenha
                    title = {this.props.titleConfirmarSenha}
                    keyboardType = {this.props.keyboardConfirmarSenha}
                    returnKeyType = {this.props.returnKeyTypeConfirmarSenha}
                    id = {this.props.idConfirmarSenha}
                    value = {this.props.valueConfirmarSenha}
                    onChangeText = {this.props.onChangeConfirmarSenha}
                    onSubmitEditing = {this.props.onSubmitConfirmarSenha}
                    securetext = {this.props.securetextConfirmarSenha}
                    onChangeSecureText = {this.props.onChangeSecureTextConfirmarSenha}
                  />                   
                </View>
              </View>
              <TouchableOpacity
                style = {{
                  width: '100%', 
                  backgroundColor: this.props.StyleLogonCadastro.cores.background,
                  paddingHorizontal: 16,
                  height: 58,
                  alignItems: 'center',
                  justifyContent: "center",
                  borderRadius: 5
              }}
                onPress = {this.props.onPressConfirmar}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    alignSelf: 'center',
                }}>Confirmar</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  //#endregion
}

const mapStateToProps = state => ({
  EmpresaLogada: state.EmpresaLogada,
  StyleGlobal: state.StyleGlobal,
  StyleLogonCadastro: state.StyleLogonCadastro
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PrimeiroLogin);

PrimeiroLogin.propTypes = {
  visibilidade: PropTypes.bool,
  onPressIcon: PropTypes.func,
  onPressConfirmar: PropTypes.func,
  fimdaanimacao: PropTypes.func,
  id: PropTypes.func,
  valorSelecionado: PropTypes.any,
  valueSenhaAtual: PropTypes.string,
  valueConfirmarSenha: PropTypes.string,
  valueNovaSenha: PropTypes.string,
  titleSenhaAtual: PropTypes.string,
  titleNovaSenha: PropTypes.string,
  titleConfirmarSenha: PropTypes.string,
  securetextNovaSenha: PropTypes.bool,
  securetextSenhaAtual: PropTypes.bool,
  securetextConfirmarSenha: PropTypes.bool,
  onChangeSecureTextSenhaAtual: PropTypes.func,
  onChangeSecureTextNovaSenha: PropTypes.func,
  onChangeSecureTextConfirmarSenha: PropTypes.func,
  onChangeSenhaAtual: PropTypes.func,
  onChangeNovaSenha: PropTypes.func,
  onChangeConfirmarSenha: PropTypes.func,
  onSubmitSenhaAtual: PropTypes.func,
  onSubmitNovaSenha: PropTypes.func,
  onSubmitConfirmarSenha: PropTypes.func,
  keyboardSenhaAtual: PropTypes.string,
  keyboardConfirmarSenha: PropTypes.string,
  keyboardNovaSenha: PropTypes.string,
  idSenhaAtual: PropTypes.func,
  idNovaSenha: PropTypes.func,
  idConfirmarSenha: PropTypes.func,
  returnKeyTypeSenhaAtual: PropTypes.string,
  returnKeyTypeNovaSenha: PropTypes.string,
  returnKeyTypeConfirmarSenha: PropTypes.string
}