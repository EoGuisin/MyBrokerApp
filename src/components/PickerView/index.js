//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { ViewPropTypes, Animated } from 'react-native';
//#endregion

//#region Externas
import PropTypes from 'prop-types';
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Services

//#endregion

//#region Redux

//#endregion

//#region Componentes
import {
  Alinha,
  AnimaView,
  Title,
  ViewPicker,
  Borda,
} from './styles';
//#endregion

//#region Estilização de telas e efeitos

//#endregion

//#region Imagens

//#endregion

//#endregion

export default class PickerView extends Component {
    constructor(props)
    {
      super(props);
    }

    //#region Model

    //#endregion

    //#region View
    render() { 
      return(
        <AnimaView 
          style = {[
            { opacity: this.props.scale},
            { transform: [{
              scale: this.props.scale.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              })
            }]}
          ]}>
        <Alinha onLayout={this.props.layout} 
          style = {{
            flexDirection: 'column',
            paddingVertical: 12,
            paddingHorizontal: 16,
            height: 61,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#E2F2E3',
            marginTop: 4,
        }}>
          <Picker
            selectedValue = {this.props.selectValue}
            style={this.props.estilo}
            onValueChange = {this.props.onValueChange}
            > 
            <Picker.Item label = {this.props.defaultLabel} value = {0} color = "rgba(71,134, 128, 0.5)"/>
            {this.props.ListItens}
          </Picker>
        </Alinha>
        </AnimaView>
    );
  }
  //#endregion
}

PickerView.propTypes = {
  scale: PropTypes.object,
  estilo: ViewPropTypes.style,
  selectValue: PropTypes.any,
  onValueChange: PropTypes.func,
  layout: PropTypes.func,
  defaultLabel: PropTypes.string,
  ListItens: PropTypes.array,
  offset: PropTypes.object,
};

PickerView.defaultProps = {
  offset: new Animated.ValueXY({ x: 0, y: 0})
}