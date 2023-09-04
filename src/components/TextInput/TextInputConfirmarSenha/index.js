//#region Bibliotecas importadas

//#region Nativas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { ViewPropTypes, View, TextInput, Text, TouchableOpacity } from 'react-native';
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

class TextInputConfirmarSenha extends Component {
    constructor(props)
    {
      super(props);
    }
    render() { 
      return(
        <View style = {this.props.estilo}>
          <Text
            style = {{
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: 13,
              color: '#677367'
          }}>{this.props.title}</Text>
          <View 
            style = {{
              flexDirection: 'row',
            }}>
            <TextInput 
              style = {{
                flex: 1,
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
                borderRadius: 5,
            }}
              secureTextEntry = {this.props.securetext}
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
              maxLength = {16}
            />
            {true &&
            <TouchableOpacity style = {{alignItems: "center", justifyContent: "center", marginLeft: -30, paddingRight: 10}}
              onPress = {this.props.onChangeSecureText}>
            <Icon 
                name = {this.props.securetext == true ? 'visibility-off' : 'visibility'} 
                size = {20}
                color = {this.props.StyleLogonCadastro.cores.background}
                style = {{
                  alignSelf: 'center'
                }}
              />
            </TouchableOpacity>}
          </View>
        </View>
    );
  }
}

const mapStateToProps = state => ({
  EmpresaLogada: state.EmpresaLogada,
  StyleLogonCadastro: state.StyleLogonCadastro
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TextInputConfirmarSenha);

TextInputConfirmarSenha.propTypes = {
  title: PropTypes.string,
  estilo: ViewPropTypes.style,
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
  securetext: PropTypes.bool,
  onChangeSecureText: PropTypes.func
};

TextInputConfirmarSenha.defaultProps = {
  visibilidade: false,
  securetext: true,
}