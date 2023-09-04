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
import EfeitoDaImpressaoDigital from '../../../effects/impressaodigital.json';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/fundobranco.png';
//#endregion

//#endregion

class ImpressaoDigital extends Component {
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
        animationType="slide"
        transparent={false}
        visible={this.props.visibilidade}>
        <ImageBackground 
          source = {ImagemDeFundo} 
          style = {{flex: 1}}
        >
          <View>
            <Icon 
              style = {{
                marginLeft: 30, 
                marginTop: 40
              }} 
              name = 'close' 
              size = {40} 
              color = {'rgba(0, 0, 0, 0.5)'}
              onPress = {this.props.onPress}
            />
          </View>
          <View 
            style = {{ 
              flex: 1, 
              marginTop: 22 
            }}>
            <Lottie
              resizeMode = 'contain' 
              source = {EfeitoDaImpressaoDigital} 
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

export default connect(mapStateToProps, mapDispatchToProps)(ImpressaoDigital);

ImpressaoDigital.propTypes = {
  visibilidade: PropTypes.bool,
  onPress: PropTypes.func
}