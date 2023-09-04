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

export default class TextTitulo extends Component {
    constructor(props)
    {
      super(props);
    }

    //#region Model

    //#endregion

    //#region View
    render() { 
      return(
        <View 
          style = {{
            paddingHorizontal: 24,
            paddingVertical: 16
        }}>
          <Text 
            style = {{
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 14,
              color: '#677367',
              alignSelf: 'flex-start',
              marginVertical: 4,
          }}>{this.props.titulo}</Text>
          <Text 
            style = {{
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: 16,
              color: '#262825',
              alignSelf: 'flex-start',
              flexWrap: 'wrap',
              textAlign: 'justify'
          }}>{this.props.texto}</Text>
        </View>
    );
  }
  //#endregion
}

TextTitulo.propTypes = {
  estilo: ViewPropTypes.style,
  titulo: PropTypes.string,
  texto: PropTypes.string,
};