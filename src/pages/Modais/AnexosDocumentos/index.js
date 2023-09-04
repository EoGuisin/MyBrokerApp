//#region Bibliotecas importadas

//#region Nativas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { Modal, View, ImageBackground, ViewPropTypes, ScrollView, FlatList, Text, Dimensions } from 'react-native';
//#endregion

//#region Externas
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
import Carousel from 'react-native-snap-carousel';
import { RNCamera } from 'react-native-camera';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
//#endregion

//#endregion

class AnexosDocumentos extends Component {
  constructor(props)
  {
    super(props);
  }
  //#region View
  render() {
    return(
      <Modal
        animationType = 'slide'
        transparent = {false}
        visible = {this.props.visibilidade}>
        <View style = {{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
          <View style = {{ backgroundColor: '#FFFFFF', height: 55 }}>
            <View 
              style = {{
                flexDirection: 'row', 
                alignItems: 'center', 
                width: '60%',
                justifyContent: 'space-between'
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {this.props.StyleGlobal.cores.background} size = {50} style = {{ marginTop: 10 }}
                onPress = {this.props.onPressVisibilidade}/>
              <Text
                style = {{
                  marginTop: 6,
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 14,
                  textAlign: 'center',
                  color: this.props.StyleGlobal.cores.background
              }}>Documentos</Text>
            </View>
          </View>
          <Carousel
            key = {this.props.keyExtractorCarousel}
            ref = {this.props.idCarousel}
            data = {this.props.dataCarousel}
            sliderWidth = {Dimensions.get('window').width}
            itemWidth = {Dimensions.get('window').width*0.9}
            renderItem = {this.renderCarousel}
            scrollEnabled = {this.props.scrollCarouselEnabled}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(AnexosDocumentos);

AnexosDocumentos.propTypes = {
  visibilidade: PropTypes.bool,
  onPressVisibilidade: PropTypes.func,
  dataCarousel: PropTypes.array,
  renderCarousel: PropTypes.func,
  idCarousel: PropTypes.func,
  keyExtractorCarousel: PropTypes.func,
  scrollCarouselEnabled: PropTypes.bool,
}