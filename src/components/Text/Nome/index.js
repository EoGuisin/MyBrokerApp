//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { ViewPropTypes, View, Text } from 'react-native';
//#endregion

//#region Externas
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
//#endregion

//#region Services

//#endregion

//#region Redux

//#endregion

//#region Componentes

//#endregion

//#region Estilização de telas e efeitos

//#endregion

//#region Imagens

//#endregion

//#endregion

export default class TextNome extends Component {
    constructor(props)
    {
      super(props);
    }

    //#region Model

    //#endregion

    //#region View
    render() { 
      return(
        <View>
          <Text style = {this.props.estilo}>{this.props.texto}</Text>
        </View>
    );
  }
  //#endregion

}

TextNome.propTypes = {
  estilo: ViewPropTypes.style,
  texto: PropTypes.string
};