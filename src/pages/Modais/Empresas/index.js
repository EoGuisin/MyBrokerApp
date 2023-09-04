//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Modal, View, ScrollView, FlatList, Text, Dimensions, Platform } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getDeviceId } from "react-native-device-info";
import SearchInput, { createFilter } from 'react-native-search-filter';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
//#endregion

//#endregion

class Empresas extends Component {
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
        onShow = {async () => {
          this.ScrollViewEmpresa.scrollTo({x: Dimensions.get('window').width, y: 0, animated: true})
        }}>
        <View style = {{ flex: 1, backgroundColor: "#F6F8F5" }}>
          <View
            style = {{
              backgroundColor: this.props.StyleLogonCadastro.cores.background, 
              height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 95 : 62, 
              justifyContent: "center" 
          }}>
            <View 
              style = {{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
              <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40} style = {{ marginTop: 10 }}
                onPress = {this.props.onPressVisibilidade}/>
              <Text
                style = {{
                  marginTop: 6,
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#FFFFFF'
              }}>Empresas</Text>
              <View style = {{width: 40}}/>
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
                data = {this.props.dataEmpresas}
                keyExtractor = {this.props.keyExtractorFlatList}
                renderItem = {this.props.renderEmpresas}
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
  StyleGlobal: state.StyleGlobal,
  StyleLogonCadastro: state.StyleLogonCadastro
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Empresas);

Empresas.propTypes = {
  visibilidade: PropTypes.bool,
  onPressVisibilidade: PropTypes.func,
  renderUFRG: PropTypes.func,
  dataUFRG: PropTypes.array,
  idFlatList: PropTypes.func,
  idScrollView: PropTypes.func,
  onChangeSearch: PropTypes.func,
  keyExtractorFlatList: PropTypes.func,
  empreendimento: PropTypes.string,
}