//#region Bibliotecas importadas

//#region Nativas

//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
import { ViewPropTypes, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
    Passwords,
    Password,
    PasswordText,
    TextAndIcon,
} from './styles';

class TextInputSenha extends Component {
    constructor(props)
    {
      super(props);
    }
    render() { 
      return(
        <Passwords 
          style = {[this.props.estilo,{
            flexDirection: 'row',
            backgroundColor: '#FFFFFF',
            alignItems: 'flex-end',
            paddingVertical: 5,
            paadingHorizontal: 15,
            marginLeft: 49,
            marginRight: 49,
            marginTop: 8,
            border: 1,
            borderColor: this.props.StyleLogonCadastro.cores.background,
            borderRadius: 10
        }]}>
            <Icon name = {'lock'} size = {20} color = {this.props.StyleLogonCadastro.cores.background} style = {{alignSelf: 'center', marginRight: 5}}/>
            <TextAndIcon>
            <PasswordText
              placeholderTextColor = {"rgba(255, 255, 255, 0.6)"}
              autocorrect = {false}
              placeholder = {"Digite sua senha"}
              autoCapitalize = {this.props.autoCapitalize}
              textAlignVertical = {this.props.textAlignVertical}
              width= {330}
              secureTextEntry = {this.props.securetext}
              onChangeText = {this.props.onChangeText}
              onSubmitEditing = {this.props.onSubmitEditing}
              returnKeyType = {this.props.returnKeyType}
              editable = {this.props.editable}
              value = {this.props.value}
              ref = {this.props.id}
              onBlur = {this.props.onBlur}
              style = {[{color: this.props.StyleLogonCadastro.cores.background}]}
              maxLength = {16}
            >
            </PasswordText>
            </TextAndIcon>
            {true &&
            <TouchableOpacity style = {{alignItems: "center", justifyContent: "center", marginBottom: 10, width: 40}}
              onPress = {this.props.onChangeSecureText}>
              <Icon name = {this.props.securetext == true ? 'visibility-off' : 'visibility'} size = {20} color = {this.props.StyleLogonCadastro.cores.background} style = {{alignSelf: 'flex-end'}}/>
            </TouchableOpacity>}
        </Passwords>
    );
  }
}

const mapStateToProps = state => ({
  EmpresaLogada: state.EmpresaLogada,
  StyleLogonCadastro: state.StyleLogonCadastro
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TextInputSenha);

TextInputSenha.propTypes = {
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
  estilo: ViewPropTypes.style,
  securetext: PropTypes.bool,
  onChangeSecureText: PropTypes.func
};

TextInputSenha.defaultProps = {
  visibilidade: false,
  securetext: true,
}