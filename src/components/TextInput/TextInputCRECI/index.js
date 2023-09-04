//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { ViewPropTypes, View, TextInput, Text } from 'react-native';
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



export default class TextInputCRECI extends Component {
    constructor(props)
    {
      super(props);
    }
    render() { 
      return(
        <View>
          <Text
            style = {{
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 13,
              color: '#677367'
          }}>{this.props.title}</Text>
          <TextInput 
            style = {{
              flexDirection: 'column',
              paddingVertical: 24,
              paddingHorizontal: 16,
              height: 65,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#E2F2E3',
              marginTop: 4,
              marginBottom: 8,
              color: '#262825',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: 14,
          }}
            autocorrect = {false}
            autoCapitalize = {this.props.autoCapitalize}
            textAlignVertical = {this.props.textAlignVertical}
            onChangeText = {this.props.onChangeText}
            onSubmitEditing = {this.props.onSubmitEditing}
            returnKeyType = {this.props.returnKeyType}
            keyboardType = {this.props.keyboardType}
            editable = {this.props.editable}
            value = {this.props.value}
            ref = {this.props.id}
            onBlur = {this.props.onBlur}
          />
        </View>
    );
  }
}

TextInputCRECI.propTypes = {
  title: PropTypes.string,
  onChangeText: PropTypes.func,
  returnKeyType: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  autoCapitalize: PropTypes.string,
  textAlignVertical: PropTypes.string,
  value: PropTypes.any,
  id: PropTypes.func,
  editable: PropTypes.bool,
  onBlur: PropTypes.func,
  visibilidade: PropTypes.bool,
  keyboardType: PropTypes.string,
};

TextInputCRECI.defaultProps = {
  visibilidade: false,
}