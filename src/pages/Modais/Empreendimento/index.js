//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Modal, View, ImageBackground, ViewPropTypes, ScrollView, FlatList, Text, Dimensions } from 'react-native';
//#endregion

//#region Externas
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
//#endregion

//#endregion
export default class Empreendimento extends Component {
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
          <View 
            style = {{ 
              backgroundColor: this.props.colorempreendimento, 
              height: 118 
          }}>
            <View 
              style = {{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40} style = {{}}
                onPress = {this.props.onPressVisibilidade}/>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#FFFFFF'
              }}>Empreendimento</Text>              
              <View style = {{width: 40}}></View>
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
                placeholder = 'Buscar Empreendimento'
                placeholderTextColor = '#8F998F'
              />
              <Icon name = 'search' size = {30} color = {'#8F998F'} style = {{marginRight: 5}}/>
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
                data = {this.props.filteredEmpreendimento}
                keyExtractor = {this.props.keyExtractorFlatList}
                renderItem = {this.props.renderEmpreendimento}
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

Empreendimento.propTypes = {
  visibilidade: PropTypes.bool,
  onPressVisibilidade: PropTypes.func,
  renderEmpreendimento: PropTypes.func,
  filteredEmpreendimento: PropTypes.array,
  idFlatList: PropTypes.func,
  idScrollView: PropTypes.func,
  onChangeSearch: PropTypes.func,
  keyExtractorFlatList: PropTypes.func,
  empreendimento: PropTypes.string,
  colorempreendimento: PropTypes.string,
}