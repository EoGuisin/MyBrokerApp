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
import { ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
    Users,
    User,
    UserText,
    TextAndIcon,
} from './styles';

class TextInputUsuario extends Component {
    constructor(props)
    {
      super(props);
    }
    render() { 
      return(
        <Users
          style = {{
            flexDirection: 'row',
            backgroundColor: '#FFFFFF',
            alignItems: 'flex-end',
            paddingVertical: 5,
            paadingHorizontal: 15,
            marginLeft: 29,
            marginRight: 29,
            border: 1,
            borderColor: this.props.StyleLogonCadastro.cores.background,
            borderRadius: 10
          }}>          
          <Icon name = {this.props.changeIcon == false ? 'account-circle' : 'mail'} size = {20} color = {this.props.StyleLogonCadastro.cores.background} style = {{alignSelf: 'center', marginRight: 5}}
            onPress = {async () => {}}/>
          <TextAndIcon>
            <UserText
              placeholderTextColor = {"rgba(255, 255, 255, 0.6)"}
              autoCorrect ={false}
              placeholder = {"Informe o seu CPF"}
              onBlur = {this.props.onBlur}
              onEndEditing = {this.props.EndEditing}
              autoCapitalize = {this.props.autoCapitalize}
              maxLength = {this.props.changeIcon == false ? 14 : 100}
              textAlignVertical = {this.props.textAlignVertical}
              width = {310}
              onChangeText = {this.props.onChangeText}
              value = {this.props.value}
              returnKeyType = {this.props.returnKeyType}
              keyboardType = {this.props.keyboardType}
              onSubmitEditing = {this.props.onSubmitEditing}
              editable = {this.props.editable}
              blurOnSubmit = {false}
              style = {{color: this.props.StyleLogonCadastro.cores.background}}
            >
            </UserText>
          </TextAndIcon>
        </Users>
    );
  }
}

const mapStateToProps = state => ({
  EmpresaLogada: state.EmpresaLogada,
  StyleLogonCadastro: state.StyleLogonCadastro
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TextInputUsuario);

TextInputUsuario.propTypes = {
  title: PropTypes.string,
  onChangeText: PropTypes.func,
  keyboardType: PropTypes.string,
  returnKeyType: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  autoCapitalize: PropTypes.string,
  textAlignVertical: PropTypes.string,
  value: PropTypes.any,
  id: PropTypes.func,
  id_title: PropTypes.func,
  editable: PropTypes.bool,
  onBlur: PropTypes.func,
  EndEditing: PropTypes.func,
  changeIcon: PropTypes.bool,
};

TextInputUsuario.defaultProps = {
  changeIcon: false,
}