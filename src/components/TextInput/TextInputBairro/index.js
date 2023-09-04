//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { ViewPropTypes, View, TextInput, Text, Animated } from 'react-native';
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

//#region Estilização das telas e efeitos

//#endregion

//#region Imagens

//#endregion

//#endregion

export default class TextInputBairro extends Component {
    constructor(props)
    {
      super(props);
    }

    //#region Model

    //#endregion

    //#region View
    render() { 
      return(
        <Animated.View style = {{
          maxHeight: this.props.animated,
          transform: [
            {
              translateY: this.props.animated.interpolate({
                inputRange: [0, 114],
                outputRange: [0, 1],
              })
            }
          ],
          opacity: this.props.animated,
        }}>
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
              borderColor: 'rgba(16, 22, 26, 0.15)',
              marginTop: 4,
              marginBottom: 8,
              color: '#262825',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: 14,
              borderRadius: 5
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
        </Animated.View>
    );
  }
  //#endregion
}

TextInputBairro.propTypes = {
  animated: PropTypes.object,
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

TextInputBairro.defaultProps = {
  visibilidade: false,
}