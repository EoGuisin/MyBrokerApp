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

//#region Services

//#endregion

//#region Redux

//#endregion

//#region Componentes

//#endregion

//#region Estilização de telas e efeitos

//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
//#endregion

//#endregion

class Prospects extends Component {
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
          <View style = {{ backgroundColor: this.props.StyleGlobal.cores.background, height: 128 }}>
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
              }}>Prospects</Text>
            </View>
            <View
              style = {{
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent:'space-between', 
                backgroundColor: '#FFFFFF', 
                marginHorizontal: 8, 
                height: 48,
                marginVertical: 5 
            }}>
              <SearchInput
                onChangeText = {this.props.onChangeSearch}
                style = {{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  height: 48,
                  fontSize: 12,
                  width: Dimensions.get('window').width * 0.88
                }}
                placeholder = 'Buscar unidade'
                placeholderTextColor = '#8F998F'
              />
              <Icon name = 'search' size = {30} color = {'#8F998F'} style = {{marginRight: 5}}/>
            </View>
          </View>
          <ScrollView ref = {(ref) => this.ScrollViewEmpresa = ref}
            onLayout = {this.props.onlayout}
            showsHorizontalScrollIndicator = {false}
            horizontal = {true}
            pagingEnabled
            onMomentumScrollEnd = {async (e) => {}}
            onScroll={this.props.onScroll}>
            <View 
              style = {{
                minHeight: Dimensions.get('window').height - 190, 
                borderTopWidth: 0,
                marginBottom: 20
            }}>
              <FlatList
                contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width, paddingHorizontal: 10 }}
                showsVerticalScrollIndicator = {false}
                ref = {this.props.idFlatList}
                data = {this.props.filteredProspect}
                keyExtractor = {this.props.keyExtractorFlatList}
                renderItem = {this.props.renderProspect}
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

export default connect(mapStateToProps, mapDispatchToProps)(Prospects);

Prospects.propTypes = {
  visibilidade: PropTypes.bool,
  onPressVisibilidade: PropTypes.func,
  renderEmpreendimento: PropTypes.func,
  filteredEmpreendimento: PropTypes.array,
  idFlatList: PropTypes.func,
  idScrollView: PropTypes.func,
  onChangeSearch: PropTypes.func,
  keyExtractorFlatList: PropTypes.func,
  empreendimento: PropTypes.string,
  onScroll: PropTypes.func,
  onlayout: PropTypes.func,
}