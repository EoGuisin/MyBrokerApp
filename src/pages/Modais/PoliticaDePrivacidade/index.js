//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Animated, Modal, View, ImageBackground, ViewPropTypes, TouchableOpacity, Text, TextInput, Dimensions, Image, ScrollView } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Imagens
import IconMyBroker from '../../../assets/IconMyBroker.svg';
//#endregion

//region Data
import data from './PoliticaDePrivacidade.json'
//#endregion


//#endregion

class PoliticaDePrivacidade extends Component {
  constructor(props)
  {
    super(props);
  }
  
  //#region Model
  state = {
    AnimatedHeader: new Animated.Value(1)
  };
  //#endregion
  
  //#region View
  render() {
    return(
      <Modal
        animationType = "slide"
        transparent = {false}
        visible = {this.props.visibilidade}>

            <View 
              style = {{
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                paddingTop: 25,
            }}>
              <Icon name = {'keyboard-arrow-left'} color = {'#26A77C'} size = {40} 
              onPress = {this.props.onPressClose}/>
              <Text
                style = {{
                  marginTop: 6,
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#26A77C'
              }}>Politica de Privacidade</Text>            
              <View style = {{width: 40}}></View>
            </View>
            <ScrollView>
              <View
                style = {{
                  backgroundColor: "#F6F7F8",
                  margin: 15,
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  borderRadius: 10,
                  height: '100%',
                  alignItems: 'center'
              }}>
                <IconMyBroker width = {200} height = {200} style = {{marginTop: -50, marginBottom: -50}}/>
                <View style = {{alignItems: 'center'}}>
                  <Text style = {{color: "#26A77C", fontSize: 16, marginBottom: 20, fontWeight: "bold"}}>Nossa política de privacidade</Text>
                </View>
                <View>
                  {data.Item0.map((item0) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item0.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`1 - ${data.Item1.Titulo}`}</Text>
                  {data.Item1.Paragrafos.map((item1) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item1.Descricao}</Text>
                  })}
                  {data.Item1.Itens.map((item1_) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item1_.item}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`2 - ${data.Item2.Titulo}`}</Text>
                  {data.Item2.Paragrafos.map((item2) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item2.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`3 - ${data.Item3.Titulo}`}</Text>
                  {data.Item3.Paragrafos.map((item3) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item3.Descricao}</Text>
                  })}
                  {data.Item3.Itens.map((item3_) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item3_.item}</Text>
                  })}
                  
                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`4 - ${data.Item4.Titulo}`}</Text>
                  {data.Item4.Paragrafos.map((item4) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item4.Descricao}</Text>
                  })}
                  
                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`5 - ${data.Item5.Titulo}`}</Text>
                  {data.Item5.Paragrafos.map((item5) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item5.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`6 - ${data.Item6.Titulo}`}</Text>
                  {data.Item6.Paragrafos.map((item6) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item6.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`7 - ${data.Item7.Titulo}`}</Text>
                  {data.Item7.Paragrafos.map((item7) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item7.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`8 - ${data.Item8.Titulo}`}</Text>
                  {data.Item8.Paragrafos.map((item8) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item8.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`9 - ${data.Item9.Titulo}`}</Text>
                  {data.Item9.Paragrafos.map((item9) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item9.Descricao}</Text>
                  })}

                  {data.Item9.Itens.map((item9_) => {
                    return (
                      <>
                        <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item9_.item}</Text>
                        <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item9_.subItem}</Text>
                      </>
                    )
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`10 - ${data.Item10.Titulo}`}</Text>
                  {data.Item10.Paragrafos.map((item10) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item10.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`11 - ${data.Item11.Titulo}`}</Text>
                  <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`${data.Item11.Paragrafos[0].Descricao}`}</Text>
                  {data.Item11.Itens.map((item11_) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item11_.item}</Text>
                  })}
                  <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`${data.Item11.Paragrafos[1].Descricao}`}</Text>
                  {data.Item11._Itens.map((Item11) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{Item11.item}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`12 - ${data.Item12.Titulo}`}</Text>
                  {data.Item12.Paragrafos.map((item12) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item12.Descricao}</Text>
                  })}
                  {data.Item12.Itens.map((item12_) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item12_.item}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`13 - ${data.Item13.Titulo}`}</Text>
                  {data.Item13.Paragrafos.map((item13) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item13.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`14 - ${data.Item14.Titulo}`}</Text>
                  {data.Item14.Paragrafos.map((item14) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item14.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`15 - ${data.Item15.Titulo}`}</Text>
                  {data.Item15.Paragrafos.map((item15) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item15.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`16 - ${data.Item16.Titulo}`}</Text>
                  {data.Item16.Paragrafos.map((item16) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item16.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`17 - ${data.Item17.Titulo}`}</Text>
                  {data.Item17.Paragrafos.map((item17) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item17.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`18 - ${data.Item18.Titulo}`}</Text>
                  {data.Item18.Paragrafos.map((item18) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item18.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`19 - ${data.Item19.Titulo}`}</Text>
                  {data.Item19.Paragrafos.map((item19) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item19.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`20 - ${data.Item20.Titulo}`}</Text>
                  {data.Item20.Paragrafos.map((item20) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item20.Descricao}</Text>
                  })}

                  <Text style = {{color: "#26A77C", fontWeight:"bold", fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{`21 - ${data.Item21.Titulo}`}</Text>
                  {data.Item21.Paragrafos.map((item21) => {
                    return <Text style = {{ fontSize: 12, marginBottom: 15, textAlign: 'justify'}}>{item21.Descricao}</Text>
                  })}
                </View>
              </View>
            </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(PoliticaDePrivacidade);

PoliticaDePrivacidade.propTypes = {
  visibilidade: PropTypes.bool,
  onPressClose: PropTypes.func,
  onPress: PropTypes.func,
  textomensagem: PropTypes.string
}