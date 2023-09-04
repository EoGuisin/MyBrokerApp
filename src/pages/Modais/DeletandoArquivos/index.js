//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Modal, View, ImageBackground, ViewPropTypes } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
//#endregion

//#region Estilização da tela e efeitos
import EfeitoDeletandoArquivos from '../../../effects/delete_files.json';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
//#endregion

//#endregion
class DeletandoArquivos extends Component {
  constructor(props)
  {
    super(props);
  }
  
  //#region View
  render() {
    return(
      <Modal
      animationType = {'fade'}
      transparent = {false}
      visible = {this.props.visibilidade}
      >
        <View style = {{flex: 1, backgroundColor: '#E6E6E6'}}>
          <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Lottie resizeMode = {'cover'} source = {EfeitoDeletandoArquivos} autoPlay />
          </View>
        </View>
    </Modal>
    );
  }
  //#endregion
}

const mapStateToProps = state => ({
  EmpresaLogada: state.EmpresaLogada,
  StyleGlobal: state.StyleGlobal
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DeletandoArquivos);

DeletandoArquivos.propTypes = {
  visibilidade: PropTypes.bool,
  onPress: PropTypes.func,
  fimdaanimacao: PropTypes.func,
  id: PropTypes.func,
}