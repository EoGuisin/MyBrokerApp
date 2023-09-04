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

//#region Estilização de telas e efeitos
import EfeitoFalha from '../../../effects/falha.json';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/fundobranco.png';
//#endregion

//#endregion
class Falha extends Component {
  constructor(props)
  {
    super(props);
  }

  //#region Model

  //#endregion

  //#region View
  render() {
    return(
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.props.visibilidade}>
        <ImageBackground 
          source = {ImagemDeFundo} 
          style = {{flex: 1}}
        >
          <View 
            style = {{
              flex: 1, 
              marginTop: 22 
          }}>
            <Lottie 
              resizeMode = 'cover' 
              source = {EfeitoFalha}
              autoPlay
            />
          </View>
        </ImageBackground>
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

export default connect(mapStateToProps, mapDispatchToProps)(Falha);

Falha.propTypes = {
  visibilidade: PropTypes.bool,
  fimdaanimacao: PropTypes.func,
  id: PropTypes.func,
}