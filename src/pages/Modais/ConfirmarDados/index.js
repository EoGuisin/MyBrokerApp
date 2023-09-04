//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SvgUri from 'react-native-svg-uri';
import Svg from 'react-native-svg';
//#endregion

//#region Componentes
import { Animated, Modal, View, ImageBackground, ViewPropTypes, TouchableOpacity, Text, TextInput, Dimensions, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PickerView, TextInputPadrao } from '../../../components';
//#endregion

//#region Imagens
import Logo from '../../../assets/logofundoverde.png';
import IconEmpresa from '../../../assets/Logooo.svg';
import LogoHarmonia from '../../../assets/HarmoniaLogoColorida.svg';
import LogoSilvaBranco from '../../../assets/SilvaBrancoLogoColorida.svg';
import LogoMyBroker from '../../../assets/IconMyBroker.svg';
import LogoGAVResorts from '../../../assets/LOGOGAVRESORTS.svg';
//#endregion

//#endregion

class ConfirmarDados extends Component {

  //#region Model
  constructor(props)
  {
    super(props);
  }

  state = {
    AnimatedHeader: new Animated.Value(1)
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
              backgroundColor: '#FFFFFF', 
              height: 72
          }}>
            <View
              style = {{
                flexDirection: 'row', 
                alignItems: 'center', 
                width: '65%', 
                justifyContent: 'space-between'
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {this.props.StyleLogonCadastro.cores.background} size = {50} style = {{marginTop: 10, marginLeft: 10}}
                onPress = {this.props.onPressIcon}/>
              <Text
                style = {{
                  marginTop: 6,
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 16,
                  textAlign: 'center',
                  color: this.props.StyleLogonCadastro.cores.background
              }}>Confirmar Dados</Text>
            </View>
          </View>
          <View
            style = {{
              marginHorizontal: 24, 
              marginTop: 24, 
              height: Dimensions.get('window').height - 87,
              justifyContent: 'space-between'
            }}>
              <View style = {{alignItems: 'center'}}>
                {this.props.EmpresaLogada == "" && <IconEmpresa width = {150} height = {250} style = {{marginTop: - 50}}/> }
                {this.props.EmpresaLogada[0] == 5 && <LogoHarmonia width = {150} height = {250} style = {{marginTop: - 50}}/>}
                {this.props.EmpresaLogada[0] == 4 && <LogoGAVResorts width = {150} height = {250} style = {{marginTop: - 50}}/>}
                {this.props.EmpresaLogada[0] == 8 && <LogoSilvaBranco width = {150} height = {250} style = {{marginTop: - 50}}/>}
                {this.props.EmpresaLogada[0] == 6 && <LogoMyBroker width = {150} height = {250} style = {{marginTop: - 50}}/>}
                <View style = {{marginHorizontal: 20, marginTop: 35}}>
                  <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, textAlign: 'center', color: this.props.StyleLogonCadastro.cores.background, lineHeight: 25}}>A secretaria, irá validar os documentos e informações enviadas.</Text>
                </View>
              </View>
              <View>           
                <View style = {{marginBottom: 25}}>
                  <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}></Text>
                  <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}></Text>
                  <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}></Text>
                </View>
                <TouchableOpacity
                  style = {{
                    backgroundColor: this.props.StyleLogonCadastro.cores.background,
                    padding: 16,
                    height: 58,
                    alignItems: 'center',
                    marginBottom: 20
                }}
                  onPress = {this.props.onPressObrigado}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      fontSize: 16,
                      textAlign: 'center',
                      color: '#FFFFFF',
                      alignSelf: 'center',
                  }}>Obrigado</Text>
                </TouchableOpacity>
              </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmarDados);

ConfirmarDados.propTypes = {
  visibilidade: PropTypes.bool,
  onPressIcon: PropTypes.func,
  onPressObrigado: PropTypes.func,
}