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

//#region Services

//#endregion

//#region Redux

//#endregion

//#region Componentes

//#endregion

//#region Estilização de telas e efeitos
import EfeitoSucesso from '../../../effects/loading.json';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
//#endregion

//#endregion

class Sucesso extends Component {
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
        <View 
          style = {{flex: 1, backgroundColor: '#FFFFFF'}}
        >
          <View 
            style = {{ 
              flex: 1, 
              marginTop: 22,
          }}>
            <Lottie 
              resizeMode = 'contain' 
              source = {EfeitoSucesso} 
              autoPlay
              loop
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(Sucesso);

Sucesso.propTypes = {
  visibilidade: PropTypes.bool,
  fimdaanimacao: PropTypes.func,
  id: PropTypes.func,
}