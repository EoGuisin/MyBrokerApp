//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Modal, View, ImageBackground, ViewPropTypes, ScrollView, FlatList, Text, Dimensions, TouchableOpacity, Platform } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
//#endregion

//#endregion

class ListaLotes extends Component {
  constructor(props)
  {
    super(props);
  }

  componentDidMount = async () => {
    try {
      if(Platform.OS === "ios" && !Platform.isPad && !Platform.isTVOS)
      {
        const deviceId = getDeviceId()

        const numberId = deviceId.replace("iPhone", "").substr(0, 2)
        
        if (numberId == 'X' || numberId == "X,") 
        {
          this.setState({ID: "X"})
        }
        else
        {
          const ID = parseInt(numberId)
          this.setState({ID: ID})
        }
      }
      else
      {
        const ID = ""
        this.setState({ID: ID})
      }

    } catch {}
  }

  //#region Model
  state = {
    ID: "",
  }
  //#endregion

  //#region View
  render() {

    return(
      <Modal
        animationType = 'slide'
        transparent = {false}
        visible = {this.props.visibilidade}
        onShow = {async () => { this.ScrollViewEmpresa.scrollTo({x: Dimensions.get('window').width, y: 0, animated: true})}}>
        <View 
          style = {{ 
            flex: 1,
            backgroundColor: "#F6F8F5"
        }}>
          <View 
            style = {{
              backgroundColor: this.props.colorlotes, 
              height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? ((this.props.EmpresaLogada[0] == 8 || this.props.EmpresaLogada[0] == 4) ? 178 : 148) : ((this.props.EmpresaLogada[0] == 8 || this.props.EmpresaLogada[0] == 4) ? 148 : 118),
              justifyContent: "center"
          }}>
            <View 
              style = {{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
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
              }}>Selecione a unidade</Text>
              <View style = {{width: 40}}></View>
            </View>
            <View
              style = {{
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent:'space-between', 
                backgroundColor: '#FFFFFF', 
                marginHorizontal: 8, 
                height: 58,
                marginVertical: 5,
                borderRadius: 5,
            }}>
              <SearchInput
                onChangeText = {this.props.onChangeSearch}
                style = {{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  height: 58,
                  fontSize: 14,
                  width: Dimensions.get('window').width * 0.88
                }}
                placeholder = 'Pesquisar pelo identificador...'
                placeholderTextColor = '#8F998F'
              />
              <Icon name = 'search' size = {30} color = {'#8F998F'} style = {{marginRight: 5}}/>
            </View>
            <View style = {{alignItems: 'flex-end'}}>
              {this.props.EmpresaLogada[0] == 8 &&
                <TouchableOpacity activeOpacity = {1} style = {{flexDirection: 'row', alignItems: 'center', marginRight: 8, width: 150, borderRadius: 5}}
                  onPress = {this.props.onPressModalFiltros}>
                  <Icon name = 'list' size = {25} color = {'#FFFFFF'} style = {{marginRight: 5, marginLeft: 5}}/>
                  <Text style = {{color: '#FFFFFF', fontSize: 15, fontWeight: "bold"}}>Filtros aplicáveis</Text>
                </TouchableOpacity>}
              {this.props.EmpresaLogada[0] == 4 &&
              <TouchableOpacity activeOpacity = {1} style = {{flexDirection: 'row', alignItems: 'center', marginRight: 8, width: 150, borderRadius: 5}}
                onPress = {this.props.onPressModalFiltros}>
                <Icon name = 'list' size = {25} color = {'#FFFFFF'} style = {{marginRight: 5, marginLeft: 5}}/>
                <Text style = {{color: '#FFFFFF', fontSize: 15, fontWeight: "bold"}}>Filtros aplicáveis</Text>
              </TouchableOpacity>}
            </View>
          </View>
          {/* <ScrollView ref = {(ref) => this.ScrollViewEmpresa = ref}
            onLayout = {this.props.onlayout}
            scrollEventThrottle = {16}
            showsHorizontalScrollIndicator = {false}
            horizontal = {true}
            pagingEnabled
            onMomentumScrollEnd = {async (e) => {}}
            onScroll={this.props.onScroll}> */}
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
                data = {this.props.filteredEmpreendimento}
                keyExtractor = {this.props.keyExtractorFlatList}
                renderItem = {this.props.renderEmpreendimento}
                refreshing = {true}
              />
            </View>
          {/* </ScrollView> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(ListaLotes);

ListaLotes.propTypes = {
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
  colorlotes: PropTypes.string,
  onPressModalFiltros: PropTypes.func
}