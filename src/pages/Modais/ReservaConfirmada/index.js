//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Animated, Modal, View, ImageBackground, ViewPropTypes, TouchableOpacity, Text, TextInput, Dimensions, Image, Platform } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SvgUri from 'react-native-svg-uri';
import Svg from 'react-native-svg';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Services

//#endregion

//#region Redux

//#endregion

//#region Componentes
import { PickerView, TextInputPadrao } from '../../../components';
//#endregion

//#region Estilização de telas e efeitos

//#endregion

//#region Imagens
import Logo from '../../../assets/logofundoverde.png';
import IconEmpresa from '../../../assets/svg.svg';
import IconEmpresaGAV from '../../../assets/LOGOGAVRESORTS.svg';
import IconEmpresaMyBroker from '../../../assets/IconMyBroker.svg';
import IconEmpresaHarmonia from '../../../assets/HarmoniaLogoColorida.svg';
import IconEmpresaSilvaBranco from '../../../assets/SilvaBrancoLogoColorida.svg';
//#endregion

//#endregion

class ReservaConfirmada extends Component {
  constructor(props)
  {
    super(props);
  }

  //#region Model
  state = {
    AnimatedHeader: new Animated.Value(1),
    ID: "",
  };
  //#endregion
  
  //#region View
  render() {

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
              backgroundColor: "#FFFFFF", 
              height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
              justifyContent: "center"
          }}>
            <View
              style = {{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between',
                margintop: 10,
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {this.props.StyleGlobal.cores.background} size = {40} style = {{marginLeft: 10}}
                onPress = {this.props.onPressIcon}/>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 16,
                  textAlign: 'center',
                  color: this.props.StyleGlobal.fontes.corpadrao
              }}>Sucesso</Text>
              <View style = {{width: 40}}/>
            </View>
          </View>
          <View
            style = {{
              marginHorizontal: 24, 
              marginTop: 24, 
              height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 107) : (Dimensions.get('window').height - 87),
              justifyContent: 'space-between'
            }}>
              <View style = {{alignItems: 'center'}}>
                {this.props.EmpresaLogada[0] == 4 && <IconEmpresaGAV width = {Dimensions.get('window').width * 0.4} height = {Dimensions.get('window').height * 0.3} style = {{marginTop: - 50}}/>}
                {this.props.EmpresaLogada[0] == 5 && <IconEmpresaHarmonia width = {Dimensions.get('window').width * 0.4} height = {Dimensions.get('window').height * 0.3} style = {{marginTop: - 50}}/>}
                {this.props.EmpresaLogada[0] == 8 && <IconEmpresaSilvaBranco width = {Dimensions.get('window').width * 0.4} height = {Dimensions.get('window').height * 0.3} style = {{marginTop: - 50}}/>}
                {this.props.EmpresaLogada[0] == 6 && <IconEmpresaMyBroker width = {150} height = {250} style = {{marginTop: - 50}}/>}
                <Text style = {{marginTop: 24, fontStyle: 'normal', fontWeight: 'bold', fontSize: 24, color: this.props.StyleGlobal.fontes.corpadrao}}>Reserva confirmada!</Text>
                <View style = {{marginHorizontal: 20, marginTop: 35}}>
                  <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: this.props.StyleGlobal.fontes.corpadrao, lineHeight: 25}}>Sua reserva foi realizada com sucesso e ela espirará dia {moment(new Date().setDate((new Date()).getDate() + 1), true).format('DD/MM/YYYY')} às {new Date().getHours()}:{new Date().getMinutes() > 9 ? new Date().getMinutes() : '0' + new Date().getMinutes()}hr</Text>
                </View>
              </View>
                <View>
                  <View style = {{marginBottom: 25}}>
                    <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>Dúvidas</Text>
                    <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>vendas@</Text>
                    <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>(XX) XXXX-XXXX</Text>
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
                      marginRight: 20,
                      borderRadius: 5,
                  }}
                    onPress = {this.props.onPressReservarNovoLote}>
                    <Text
                      style = {{
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: 12,
                        textAlign: 'center',
                        color: this.props.StyleGlobal.cores.botao,
                        alignSelf: 'center',
                    }}>Reservar novo lote</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style = {{
                      flex: 1,
                      backgroundColor: this.props.StyleGlobal.cores.botao,
                      padding: 16,
                      height: 58,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                      borderRadius: 5
                  }}
                    onPress = {this.props.onPressObrigado}>
                    <Text
                      style = {{
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: 12,
                        textAlign: 'center',
                        color: '#FFFFFF',
                        alignSelf: 'center',
                    }}>Obrigado</Text>
                  </TouchableOpacity>
                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReservaConfirmada);

ReservaConfirmada.propTypes = {
  visibilidade: PropTypes.bool,
  onPressIcon: PropTypes.func,
  onPressReservarNovoLote: PropTypes.func,
  onPressObrigado: PropTypes.func,
}