//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Animated, Modal, View, ImageBackground, ViewPropTypes, TouchableOpacity, Text, TextInput, Dimensions, Image } from 'react-native';
//#endregion

//#region Externas
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SvgUri from 'react-native-svg-uri';
import Svg from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Componentes
import { PickerView, TextInputPadrao } from '../../../components';
//#endregion

//#region Imagens
import Logo from '../../../assets/logofundoverde.png'; 
import LogoDeFundo from '../../../assets/LOGOone.png';
import IconEmpresa from '../../../assets/Logooo.svg';
//#endregion

//#endregion

export default class OptionSenha extends Component {
  constructor(props)
  {
    super(props);
  }
  
  //#region Model
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
              height: 62
          }}>
            <View
              style = {{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {'#26A77C'} size = {40} style = {{marginTop: 10, marginLeft: 10}}
                onPress = {this.props.onPressIcon}/>
              <Text
                style = {{
                  marginTop: 6,
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#26A77C'
              }}>Caro usuário</Text>
              <View style = {{width: 40}}/>
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
                {/* <IconEmpresa width = {150} height = {250} style = {{marginTop: - 50}}/> */}
                <Image style = {{width: 200, height: 200, marginLeft: -10}} source={LogoDeFundo}/>
                <Text style = {{marginTop: -40, fontStyle: 'normal', fontWeight: 'normal', fontSize: 24, color: '#26A77C'}}>Aviso!</Text>
                <View style = {{marginHorizontal: 20, marginTop: 35}}>
                  <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, textAlign: 'center', color: '#26A77C', lineHeight: 25}}>{this.props.textomensagem}</Text>
                </View>
                <View style = {{marginTop: 35}}/>
              </View>
              <View style = {{ flexDirection: 'row'}}>
                <TouchableOpacity
                  style = {{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    borderColor: '#26A77C',
                    padding: 16,
                    height: 58,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    marginRight: 20
                }}
                  onPress = {this.props.onPressNao}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      fontSize: 12,
                      textAlign: 'center',
                      color: '#26A77C',
                      alignSelf: 'center',
                  }}>Não</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style = {{
                    flex: 1,
                    backgroundColor: '#26A77C',
                    padding: 16,
                    height: 58,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20
                }}
                  onPress = {this.props.onPressSim}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      fontSize: 12,
                      textAlign: 'center',
                      color: '#FFFFFF',
                      alignSelf: 'center',
                  }}>Sim</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>
    );
  }
  //#endregion
}



OptionSenha.propTypes = {
  visibilidade: PropTypes.bool,
  onPressIcon: PropTypes.func,
  onPressNao: PropTypes.func,
  onPressSim: PropTypes.func,
  textomensagem: PropTypes.string
}