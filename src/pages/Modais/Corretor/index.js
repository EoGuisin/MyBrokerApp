//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Animated, Modal, View, ImageBackground, ViewPropTypes, TouchableOpacity, Text, TextInput, Dimensions, Platform } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Componentes
import { PickerView, TextInputPadrao, TextInputData } from '../../../components';
//#endregion

//#region Estilização de tela e efeitos
import { formatoDeTexto } from '../../../Style';
//#endregion

//#endregion

class Corretor extends Component {
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
    animated: new Animated.Value(114),
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
              backgroundColor: '#FFFFFF', 
              height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
              justifyContent: "center",
          }}>
            <View
              style = {{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {this.props.colorheader} size = {40} style = {{marginTop: 10, marginLeft: 10}}
                onPress = {this.props.fimdaanimacao}/>
              <Text
                style = {{
                  marginTop: 6,
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 16,
                  textAlign: 'center',
                  color: this.props.colorheader
              }}>Intermediação</Text>
              <View style = {{width: 40}}/>
            </View>
          </View>
          <View style = {{ height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 107) : (Dimensions.get('window').height - 87), justifyContent: 'space-between' }}>
            <View style = {{marginTop: 20}}>
              <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginHorizontal: 24}}>                
                <View style = {{flex: 1}}>
                  <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: this.props.StyleGlobal.cores.background, marginBottom: 8}}>Corretor</Text>
                  <TextInputData 
                    animated = {this.state.animated}
                    title = {'Primeiro vencimento'}
                    onChangeText = {this.props.onChangeTextVencimento}
                    value = {this.props.valueVencimento}
                    />
                </View>
              </View>
              <View style = {{marginBottom: 8, marginHorizontal: 24}}>
                <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
                  <Text style = {{width: '30%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Parcelas</Text>
                  <Text style = {{width: '40%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor da parcela</Text>
                  <Text style = {{width: '30%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Total</Text>
                </View>
              </View>
              {this.props.tabelaCorretagem}
            </View>
            <View style = {{marginHorizontal: 20}}>
              <TouchableOpacity
                style = {{
                  width: '100%', 
                  backgroundColor: this.props.colorbutton,
                  paddingVertical: 16,
                  paddingHorizontal: 0,
                  height: 49,
                  alignItems: 'center'
              }}
                onPress = {this.props.onPressConfirmar}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    alignSelf: 'center',
                }}>Confirmar</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(Corretor);

Corretor.propTypes = {
  visibilidade: PropTypes.bool,
  onPressIcon: PropTypes.func,
  onPressConfirmar: PropTypes.func,
  fimdaanimacao: PropTypes.func,
  tabelaCorretagem: PropTypes.array,
  id: PropTypes.func,
  onChangeTextVencimento: PropTypes.func,
  valueVencimento: PropTypes.any,
  colorheader: PropTypes.string,
  colorbutton: PropTypes.string,
}