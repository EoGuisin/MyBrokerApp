//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Animated, Modal, View, ImageBackground, ViewPropTypes, TouchableOpacity, Text, TextInput, Dimensions, ScrollView, FlatList } from 'react-native';
//#endregion

//#region Externas
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Componentes
import { PickerView, TextInputPadrao, TextInputData } from '../../../components';
//#endregion

//#endregion
export default class Financiamento extends Component {
  constructor(props)
  {
    super(props);
  }

  //#region Model
  state = {
    animated: new Animated.Value(114)
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
              <Icon name = {'keyboard-arrow-down'} color = {'#222E50'} size = {40} style = {{marginTop: 10, marginLeft: 10}}
                onPress = {this.props.fimdaanimacao}/>
              <Text
                style = {{
                  marginTop: 6,
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#00482D'
              }}>Financiamento</Text>
              <View style = {{width: 40}}/>
            </View>
          </View>
          <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginHorizontal: 24}}>                
            <View style = {{flex: 1, marginTop: 10}}>
              <TextInputData 
                animated = {this.state.animated}
                title = {'Primeiro vencimento'}
                onChangeText = {this.props.onChangeTextFinanciamento}
                value = {this.props.valueFinanciamento}
              />
              <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color: '#8F998F'}}>{`Taxa de Financiamento: ${this.props.juros}% a.m`}</Text>
            </View>
          </View>
          <View style = {{marginBottom: 8, marginHorizontal: 24}}>
            <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
              <Text style = {{width: '20%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Parcelas</Text>
              <Text style = {{width: '35%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor da parcela</Text>
              <Text style = {{width: '45%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14}} numberOfLines = {1} ellipsizeMode = {'tail'}>Total</Text>
            </View>
          </View>
          <ScrollView ref = {(ref) => this.ScrollViewFinanciamento = ref}
            showsHorizontalScrollIndicator = {false}
            horizontal = {true}
            pagingEnabled
            onMomentumScrollEnd = {async (e) => {}}>
            <View 
              style = {{
                minHeight: Dimensions.get('window').height - 230,
                borderTopWidth: 0,
            }}>
            <FlatList
              contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
              showsVerticalScrollIndicator = {false}
              ref = {this.props.idFlatList}
              data = {this.props.dataFlatList}
              keyExtractor = {this.props.keyExtractorFlatList}
              renderItem = {this.props.renderFlatList}
              refreshing = {true}
              ListFooterComponent = {() => (
                <>
                  <View style = {{flexDirection: 'row', justifyContent: 'center', marginTop: 24}}>
                    <TouchableOpacity style = {{flexDirection: 'row', padding: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#222E50', alignItems: 'center', marginRight: 8}}
                      onPress = {this.props.personalizar}>
                      <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 14, textAlign: 'center', color: '#222E50', marginRight: 10}}>Personalizar</Text>
                      <Icon name = 'create' color = {'#222E50'} size = {12}/>
                    </TouchableOpacity>
                  </View>
                  <View style = {{marginHorizontal: 20, marginTop: 20, marginBottom: 30}}>
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
                </>
              )}
            />
            </View>
          </ScrollView>        
        </View>
      </Modal>
    );
  }
  //#endregion
}

Financiamento.propTypes = {
  visibilidade: PropTypes.bool,
  onPressIcon: PropTypes.func,
  onPressConfirmar: PropTypes.func,
  fimdaanimacao: PropTypes.func,
  personalizar: PropTypes.func,
  id: PropTypes.func,
  tabelaFinanciamento: PropTypes.func,
  onChangeTextFinanciamento: PropTypes.func,
  valueFinanciamento: PropTypes.any,
  dataFlatList: PropTypes.array,
  renderFlatList: PropTypes.func,
  keyExtractorFlatList: PropTypes.func,
  idFlatList: PropTypes.func,
  juros: PropTypes.any,
}