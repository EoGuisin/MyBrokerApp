//#region Bibliotecas importadas

//#region Nativas

//#endregion

//#region Externas

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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, View, TextInput, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class TextInputRegimeDeBens extends Component {
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
            placeholder = {this.props.placeholder}
            textAlignVertical = {this.props.textAlignVertical}
            onChangeText = {this.props.onChangeText}
            onSubmitEditing = {this.props.onSubmitEditing}
            returnKeyType = {this.props.returnKeyType}
            keyboardType = {this.props.keyboardType}
            editable = {false}
            value = {this.props.value}
            ref = {this.props.id}
            onBlur = {this.props.onBlur}
          />
        </View>
    );
  }
}

TextInputRegimeDeBens.propTypes = {
  animated: PropTypes.object,
  title: PropTypes.string,
  placeholder: PropTypes.string,
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

TextInputRegimeDeBens.defaultProps = {
  visibilidade: false,
}