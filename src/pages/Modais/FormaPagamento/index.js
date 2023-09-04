//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Modal, View, ImageBackground, ViewPropTypes, ScrollView, FlatList, Text, Dimensions } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
//#endregion

//#endregion

class FormaPagamento extends Component {
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
        animationType = 'slide'
        transparent = {false}
        visible = {this.props.visibilidade}
        onShow = {async () => { this.ScrollViewEmpresa.scrollTo({x: Dimensions.get('window').width, y: 0, animated: true})}}>
        <View style = {{ flex: 1 }}>
          <View style = {{ backgroundColor: this.props.StyleGlobal.cores.background, height: 72 }}>
            <View 
              style = {{
                flexDirection: 'row', 
                alignItems: 'center', 
                width: '65%', 
                justifyContent: 'space-between'
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {50} style = {{ marginTop: 10 }}
                onPress = {this.props.onPressVisibilidade}/>
              <Text
                style = {{
                  marginTop: 6,
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#FFFFFF'
              }}>Forma de pagamento</Text>
            </View>
          </View>
          <ScrollView ref = {(ref) => this.ScrollViewEmpresa = ref}
            showsHorizontalScrollIndicator = {false}
            horizontal = {true}
            pagingEnabled
            onMomentumScrollEnd = {async (e) => {}}>
            <View 
              style = {{
                minHeight: Dimensions.get('window').height - 190, 
                borderTopWidth: 0, 
                marginBottom: 20
            }}>
              <FlatList
                contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                showsVerticalScrollIndicator = {false}
                ref = {this.props.idFlatList}
                data = {this.props.dataFormaPagamento}
                keyExtractor = {this.props.keyExtractorFlatList}
                renderItem = {this.props.renderFormaPagamento}
                refreshing = {true}
              />
            </View>
          </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(FormaPagamento);

FormaPagamento.propTypes = {
  visibilidade: PropTypes.bool,
  onPressVisibilidade: PropTypes.func,
  renderFormaPagamento: PropTypes.func,
  dataFormaPagamento: PropTypes.array,
  idFlatList: PropTypes.func,
  idScrollView: PropTypes.func,
  onChangeSearch: PropTypes.func,
  keyExtractorFlatList: PropTypes.func,
}