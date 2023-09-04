//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Animated, Modal, View, ImageBackground, ViewPropTypes, TouchableOpacity, Text, TextInput, Dimensions } from 'react-native';
//#endregion

//#region Externas
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Componentes
import { PickerView, TextInputPadrao, TextInputFormaPagamento } from '../../../components';
//#endregion

//#endregion
export default class Entradas extends Component {
  constructor(props)
  {
    super(props);
  }

  //#region Model
  state = {};
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
                width: '58%', 
                justifyContent: 'space-between'
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {'#222E50'} size = {50} style = {{marginTop: 10, marginLeft: 10}}
                onPress = {this.props.fimdaanimacao}/>
              <Text
                style = {{
                  marginTop: 6,
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#00482D'
              }}>Entradas</Text>
            </View>
          </View>
          <View style = {{ height: Dimensions.get('window').height - 87, justifyContent: 'space-between' }}>
            <View style = {{marginTop: 20}}>
              <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginHorizontal: 24}}>                
                <View style = {{flex: 1}}>
                  <TouchableOpacity activeOpacity = {1} onPress = {this.props.onPressFormaPagamento}>
                    <TextInputFormaPagamento 
                      title = {'Forma de pagamento'}
                      placeholder = {'Escolha a forma de pagamento'}
                      value = {this.props.valueFormaPagamento}
                      />
                  </TouchableOpacity>
                </View>
              </View>
              <View style = {{marginBottom: 8, marginHorizontal: 24}}>
                <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
                  <Text style = {{width: '20%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Parcelas</Text>
                  <Text style = {{width: '40%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Vencimento</Text>
                  <Text style = {{width: '40%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Total</Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity = {1}>
                <View  style = {{width: '100%', flexDirection: 'row', backgroundColor: '#FFFFFF', height: 62, alignItems: 'center', paddingHorizontal: 24}}>
                  <Text style = {{width: '20%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#8F998F'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{'1'}x</Text>
                  <Text style = {{width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: '#262825'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{'25/08/2020'}</Text>
                  <Text style = {{width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: '#262825'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{'R$ 10.000,00'}</Text>
                </View>
              </TouchableOpacity>
              <View style = {{flexDirection: 'row', justifyContent: 'center', marginTop: 24}}>
                <TouchableOpacity style = {{flexDirection: 'row', padding: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#222E50', alignItems: 'center', marginRight: 8}}
                  onPress = {this.props.personalizar}>
                  <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 14, textAlign: 'center', color: '#222E50', marginRight: 10}}>Personalizar</Text>
                  <Icon name = 'create' color = {'#222E50'} size = {12}/>
                </TouchableOpacity>
              </View>
            </View>
            <View style = {{marginHorizontal: 20}}>
              <TouchableOpacity
                style = {{
                  width: '100%', 
                  backgroundColor: '#222E50',
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

Entradas.propTypes = {
  visibilidade: PropTypes.bool,
  tabelaEntradas: PropTypes.array,
  onPressIcon: PropTypes.func,
  onPressConfirmar: PropTypes.func,
  onPressFormaPagamento: PropTypes.func,
  valueFormaPagamento: PropTypes.string,
  fimdaanimacao: PropTypes.func,
  id: PropTypes.func,
}