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
export default class EntradasPersonalizadas extends Component {
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
                width: '72%', 
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
              }}>Entradas personalizadas</Text>
            </View>
          </View>
          <View
            style = {{
              marginHorizontal: 24, 
              marginTop: 24, 
              height: Dimensions.get('window').height - 215,
              justifyContent: 'space-between'
            }}>
              <View>
                <View style = {{marginBottom: 8}}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367'
                  }}>Primeiro vencimento</Text>
                  <TextInputPadrao 
                    onChangeText = {this.props.onChangePrimeiroVencimento}
                    onSubmitEditing = {this.props.onSubmitPrimeiroVencimento}
                    returnKeyType = {this.props.returnKeyTypePrimeiroVencimento}
                    keyboardType = {this.props.keyboardPrimeiroVencimento}
                    value = {this.props.valuePrimeiroVencimento}
                    id = {this.props.idPrimeiroVencimento}
                  />         
                </View>
                <View style = {{marginBottom: 8}}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367'
                  }}>Parcelas</Text>
                  <TextInputPadrao
                    onChangeText = {this.props.onChangeParcelas}
                    onSubmitEditing = {this.props.onSubmitParcelas}
                    returnKeyType = {this.props.returnKeyTypeParcelas}
                    keyboardType = {this.props.keyboardParcelas}
                    value = {this.props.valueParcelas}
                    id = {this.props.idParcelas}
                  />                    
                </View>
                <View style = {{marginBottom: 8}}>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 13,
                      color: '#677367'
                  }}>Valor da parcela</Text>
                  <TextInputPadrao
                    onChangeText = {this.props.onChangeValorDaParcela}
                    onSubmitEditing = {this.props.onSubmitValorDaParcela}
                    returnKeyType = {this.props.returnKeyTypeValorDaParcela}
                    keyboardType = {this.props.keyboardValorDaParcela}
                    value = {this.props.valueValorDaParcela}
                    id = {this.props.idValorDaParcela}
                  />                   
                </View>
              </View>
          </View>
          <View style = {{backgroundColor: '#FFFFFF', height: 120, justifyContent: 'flex-end', paddingHorizontal: 24}}>
            <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#8F998F', marginTop: 15}}>Valor total do lote</Text>
            <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 20, color: '#222E50', marginBottom: 10}}>R$ 180.401,94</Text>
            <TouchableOpacity
              style = {{
                width: '100%', 
                backgroundColor: '#222E50',
                paddingVertical: 16,
                paddingHorizontal: 0,
                height: 49,
                alignItems: 'center',
                marginBottom: 10
            }}
              onPress = {this.props.onPressConfirmar}>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#FFFFFF',
                  alignSelf: 'center',
              }}>Prosseguir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  //#endregion
}

EntradasPersonalizadas.propTypes = {
  visibilidade: PropTypes.bool,
  onPressIcon: PropTypes.func,
  onPressConfirmar: PropTypes.func,
  fimdaanimacao: PropTypes.func,
  id: PropTypes.func,
  valuePrimeiroVencimento: PropTypes.string,
  valueValorDaParcela: PropTypes.string,
  valueParcelas: PropTypes.string,
  onChangePrimeiroVencimento: PropTypes.func,
  onChangeParcelas: PropTypes.func,
  onChangeValorDaParcela: PropTypes.func,
  onSubmitPrimeiroVencimento: PropTypes.func,
  onSubmitParcelas: PropTypes.func,
  onSubmitValorDaParcela: PropTypes.func,
  keyboardPrimeiroVencimento: PropTypes.string,
  keyboardValorDaParcela: PropTypes.string,
  keyboardParcelas: PropTypes.string,
  idPrimeiroVencimento: PropTypes.func,
  idParcelas: PropTypes.func,
  idValorDaParcela: PropTypes.func,
  returnKeyTypePrimeiroVencimento: PropTypes.string,
  returnKeyTypeParcelas: PropTypes.string,
  returnKeyTypeValorDaParcela: PropTypes.string,
  onPressFormaPagamento: PropTypes.func,
  valueFormaPagamento: PropTypes.string,
}