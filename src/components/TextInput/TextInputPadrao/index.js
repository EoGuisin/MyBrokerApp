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
import { ViewPropTypes, View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class TextInputPadrao extends Component {
    constructor(props)
    {
      super(props);
    }
    render() { 
      return(
        <View>
          <TextInput 
            style = {{
              flexDirection: 'column',
              paddingVertical: 24,
              paddingHorizontal: 16,
              height: 65,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: 'rgba(16, 22, 26, 0.15)',
              borderRadius: 5,
              marginTop: 4,
              color: '#262825',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: 14,
          }}
            multiline = {this.props.multilines}
            numberOfLines = {4}
            autocorrect = {false}
            placeholder = {this.props.placeholder}
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

TextInputPadrao.propTypes = {
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
  multilines: PropTypes.bool,
};

TextInputPadrao.defaultProps = {
  visibilidade: false,
  multilines: false,
}