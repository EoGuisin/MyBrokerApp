//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { ViewPropTypes, Text, TouchableOpacity, Platform } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
//#endregion

//#region Services

//#endregion

//#region Redux

//#endregion

//#region Componentes
import { ViewOpcao } from './styles';
//#endregion

//#region Estilização de telas e efeitos
import Loader from '../../effects/loader.json';
//#endregion

//#region Imagens

//#endregion

//#endregion

class OpcaoMenuIcon extends Component {
  constructor(props)
  {
    super(props);
  }

  //#region Model
  state = {
    habilitar: false,
  };
  //#endregion

  //#region View
  render() { 
    return(
      <TouchableOpacity style = {{elevation: Platform.OS === "ios" ? 0 : 5, borderRadius: 15, width: 96, height: 80, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 1 }} onPress = {this.props.onPress} activeOpacity = {1}>
        <Icon name = {this.props.nomeicon} size = {22} color = {'#00000075'}/>
        <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 10, color: '#00000075', textAlign: 'center'}}>{this.props.textoicon}</Text>
      </TouchableOpacity>
    );
  }
  //#endregion
}

const mapStateToProps = state => ({
  StyleGlobal: state.StyleGlobal
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OpcaoMenuIcon);

OpcaoMenuIcon.propTypes = {
  estilo: ViewPropTypes.style,
  nomeicon: PropTypes.string,
  textoicon: PropTypes.string,
  onPress: PropTypes.func,
};

OpcaoMenuIcon.defaultProps = {
  effect: false,
}