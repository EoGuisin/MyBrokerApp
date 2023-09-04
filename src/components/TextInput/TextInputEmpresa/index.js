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

class TextInputEmpresa extends Component {
    constructor(props)
    {
      super(props);
    }
    render() {
      return(
        <Passwords 
          style = {{
            flexDirection: 'row',
            backgroundColor: '#FFFFFF',
            alignItems: 'flex-end',
            paddingVertical: 5,
            paadingHorizontal: 15,
            marginLeft: 29,
            marginRight: 29,
            marginTop: 8,
            marginBottom: 5,
            border: 1,
            borderColor: this.props.StyleLogonCadastro.cores.background,
            borderRadius: 10
        }}>    
          {true &&
            <View style = {{alignItems: "center", justifyContent: "center",marginBottom: 10, marginRight: 5}}>
              <Icon name = {'business'} size = {20} color = {this.props.StyleLogonCadastro.cores.background} style = {{alignSelf: 'center'}}/>
            </View>}
            <TextAndIcon>
              <PasswordText
                width= {330}
                style = {[{color: this.props.StyleLogonCadastro.cores.background}]}
              >{this.props.value}</PasswordText>
            </TextAndIcon>
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

export default connect(mapStateToProps, mapDispatchToProps)(TextInputEmpresa);

TextInputEmpresa.propTypes = {
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
  onpress: PropTypes.func
};

TextInputEmpresa.defaultProps = {
  visibilidade: false,
  securetext: true,
  value: "Selecione a empresa"
}