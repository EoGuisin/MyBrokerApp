//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Animated, Modal, View, ImageBackground, ViewPropTypes, TouchableOpacity, Text, TextInput, Dimensions, Image } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
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
import { TextInputPadrao } from '../../../components';
//#endregion

//#region Imagens
import Logo from '../../../assets/logofundoverde.png';
//#endregion

//#endregion

class Aviso extends Component {
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
              height: 72
          }}>
            <View
              style = {{
                flexDirection: 'row', 
                alignItems: 'center', 
                width: '60%', 
                justifyContent: 'space-between'
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {this.props.StyleGlobal.cores.background} size = {50} style = {{marginTop: 10, marginLeft: 10}}
                onPress = {this.props.onPressIcon}/>
              <Text
                style = {{
                  marginTop: 6,
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 16,
                  textAlign: 'center',
                  color: this.props.StyleGlobal.cores.background
              }}>Caro usuário</Text>
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
                <Image source = {Logo}/>
                <Text style = {{marginTop: 24, fontStyle: 'normal', fontWeight: 'normal', fontSize: 24, color: this.props.StyleGlobal.cores.background}}>Aviso!</Text>
                <View style = {{marginHorizontal: 20, marginTop: 35}}>
                  <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, textAlign: 'center', color: this.props.StyleGlobal.cores.background, lineHeight: 25}}>{this.props.textomensagem}</Text>
                </View>
                <View style = {{marginTop: 35}}>
                  <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>Dúvidas</Text>
                  <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>vendas@</Text>
                  <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>(XX) XXXX-XXXX</Text>
                </View>
              </View>
              <View style = {{ flexDirection: 'row'}}>
                <TouchableOpacity
                  style = {{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1,
                    borderColor: this.props.StyleGlobal.cores.botao,
                    padding: 16,
                    height: 58,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    marginRight: 20
                }}
                  onPress = {this.props.onPress}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      fontSize: 12,
                      textAlign: 'center',
                      color: this.props.StyleGlobal.cores.botao,
                      alignSelf: 'center',
                  }}>OK</Text>
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
  StyleGlobal: state.StyleGlobal
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Aviso);

Aviso.propTypes = {
  visibilidade: PropTypes.bool,
  onPressIcon: PropTypes.func,
  onPress: PropTypes.func,
  textomensagem: PropTypes.string
}