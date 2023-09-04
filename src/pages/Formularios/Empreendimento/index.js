//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { View, Text, Animated, TouchableOpacity, Dimensions, ScrollView, FlatList, Platform } from 'react-native';
//#endregion

//#region Externas
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import Icon from 'react-native-vector-icons/MaterialIcons';
import PushNotification from 'react-native-push-notification';
import Lottie from 'lottie-react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { CentroDeCusto } from '../../../services';
//#endregion

//#region Redux
import {DadosEmpreendimentoActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
import Loader from '../../../effects/loader.json';
//#endregion

//#region Componentes
import { Container } from '../../../components';
import { ModalEmpreendimento, ModalLoading, ModalLoadingGoBack } from '../../Modais';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
//#endregion

//#region Chaves de filtragem
const KEYS_TO_FILTERS_EMPRESA = ['empresa.nomeFantasia'];
const KEYS_TO_FILTERS_EMPREENDIMENTO = ['descricao']
//#endregion

//#endregion

class Empreendimento extends Component {
  _isMounted = false;
  constructor(props)
  {
    super(props);
  }

  //#region Funcoes do componente
  componentDidMount = async () => {
    this._isMounted = true;
    
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

    await this.setVisibilidadeModalLoadingGoBack(true)
    await this.pegandoListaDeEmpreendimentos()
  }
  //#endregion

  //#region Component Unmount
  componentWillUnmount() {
    this._isMounted = false;
  }
  //#endregion

  //#region Model
  state = {
    VisibilidadeModalEmpreendimento: false,
    VisibilidadeModalLoading: false,
    VisibilidadeModalLoadingGoBack: false,
    Empreendimentos: [],
    searchTermEmpreendimentos: '',
    Empreendimento: null,
    Empreendimento_descricao: null,
    EmpresaId: null,
    Empresa_nomeFantasia: null,
    ID: "",
    opacityButton: new Animated.Value(0),
    opacityScrollView: new Animated.Value(0), 
    translateYButton: new Animated.Value(40),
    translateYScrollView: new Animated.Value(40)
  };
  //#endregion

  //#region View
  render() {

    const filteredEmpreendimento = this.state.Empreendimentos.filter(createFilter(this.state.searchTermEmpreendimentos, KEYS_TO_FILTERS_EMPREENDIMENTO))
    
    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'space-between' }}>
        <ModalEmpreendimento 
          visibilidade = {this.state.VisibilidadeModalEmpreendimento}
          keyExtractorFlatList = {item => item.sigla}
          renderEmpreendimento = {this.renderEmpreendimentos}
          filteredEmpreendimento = {filteredEmpreendimento}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onChangeSearch = {(term) => {this.searchUpdateEmpreendimento(term)}}
          onPressVisibilidade = {() => {this.setVisibilidadeModalEmpreendimento(false)}}
          colorempreendimento = {this.props.StyleGlobal.cores.background}
        />
        <ModalLoading visibilidade = {this.state.VisibilidadeModalLoading} 
          onPress = { async () => {
            await CentroDeCusto.cancelRequest(true)
            await this.props.navigation.goBack()
        }}/>
        <ModalLoadingGoBack visibilidade = {this.state.VisibilidadeModalLoadingGoBack}
          onPress = { async () => { 
            await CentroDeCusto.cancelRequest(true)
            await this.setState({VisibilidadeModalLoadingGoBack: false})
        }}/>
        {this.state.VisibilidadeModalLoading == false && this.state.VisibilidadeModalLoadingGoBack == false && <>
        <View>
          <View 
            style = {{
              backgroundColor: this.props.StyleGlobal.cores.background, 
              height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 148 : 118,
              justifyContent: "center" 
          }}>
            <View
              style = {{
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
              <Icon name = {'keyboard-arrow-left'} color = {'#FFF'} size = {40} style = {{}}
                onPress = {() => {this.props.navigation.goBack()}}/>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#FFFFFF'
              }}>Escolha o empreendimento</Text>              
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
                borderRadius: 5
            }}>
              <SearchInput
                onChangeText = {(term) => {this.searchUpdateEmpreendimento(term)}}
                style = {{
                  paddingHorizontal: 16,
                  height: 58,
                  fontSize: 14,
                  width: Dimensions.get('window').width * 0.88
                }}
                placeholder = 'Pesquise pelo empreendimento...'
                placeholderTextColor = '#8F998F'
              />
              <Icon name = 'search' size = {30} color = {'#8F998F'} style = {{marginRight: 5}}/>
            </View>
          </View>
          <View 
            style = {{
              maxHeight: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? Dimensions.get('window').height - 240 : Dimensions.get('window').height - 205, 
              minHeight: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? Dimensions.get('window').height - 240 : Dimensions.get('window').height - 205,
          }}>
          <ScrollView ref = {(ref) => this.ScrollViewEmpresa = ref}
            showsHorizontalScrollIndicator = {false}
            horizontal = {true}
            pagingEnabled
            onMomentumScrollEnd = {async (e) => {}}>
            <View 
              style = {{
                minHeight: Dimensions.get('window').height - 195, 
                borderTopWidth: 0, 
                marginBottom: 20,
            }}>
              <FlatList
                contentContainerStyle = {{ marginTop: 8, width: Dimensions.get('window').width }}
                showsVerticalScrollIndicator = {false}
                ref = {(ref) => { this.FlatList = ref }}
                data = {filteredEmpreendimento}
                keyExtractor = {item => item.sigla}
                renderItem = {this.renderEmpreendimentos}
                refreshing = {true}
              />
            </View>
          </ScrollView>
          </View>
        </View>
        {this.state.Empreendimento != null && this.state.EmpresaId != null &&
        <Animated.View 
          style = {[
            { marginHorizontal: 24 },
            { transform: [{translateY: this.state.translateYButton}]},
            { opacity: this.state.opacityButton }
        ]}>
          <TouchableOpacity
            activeOpacity = {1}
            style = {{
              width: '100%',
              backgroundColor: this.props.StyleGlobal.cores.botao,
              height: 58,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: "center",
              marginBottom: 23,
              marginTop: 15,
          }}
            onPress = {this.acessandoProximaTela}>
            <Text
              style = {{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 14,
                textAlign: 'center',
                color: '#FFFFFF',
                alignSelf: 'center',
            }}>Confirmar</Text>
          </TouchableOpacity>
        </Animated.View>}
        </>}
      </Container>
    );
  }
  //#endregion

  //#region Controller

  //#region Pegando lista de empreendimentos no Banco de dados
  pegandoListaDeEmpreendimentos = async () => {
    try {

      const response = await CentroDeCusto.grupoDeEmpresas(this.props.token[0].token, this.props.EmpresaLogada[0], 'VENDA')
      if(response != null && response != undefined) 
      {
        this.state.Empreendimentos = response
        await this.setVisibilidadeModalLoadingGoBack(false)
      }
      
    } catch(err) {
        await this.setVisibilidadeModalLoadingGoBack(false)
        await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Filtrando a lista de empreendimento
  searchUpdateEmpreendimento(term) {
    this.setState({searchTermEmpreendimentos: term})
  }
  //#endregion

  //#region Setando a visibilidade da modal de empreendimento
  setVisibilidadeModalEmpreendimento(value) {
    this.setState({VisibilidadeModalEmpreendimento: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeModalLoading(value) {
    this.setState({VisibilidadeModalLoading: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading go back
  setVisibilidadeModalLoadingGoBack(value) {
    this.setState({VisibilidadeModalLoadingGoBack: value})
  }
  //#endregion

  //#region Renderizando lista de empreendimento
  renderEmpreendimentos = ({ item }) => (
    <TouchableOpacity key = {item.sigla} style = {{marginHorizontal: 8}} activeOpacity = {0.5}
      onPress = {async () => {
        if(this.state.Empreendimento != item.sigla) {
          
          this.state.Empreendimento = item.sigla
          this.state.Empreendimento_descricao = item.descricao
          this.state.EmpresaId = item.empresa.id
          this.state.Empresa_nomeFantasia = item.empresa.nomeFantasia
          
          await this.setState({Renderizar: true})

          await this.animacaoButton();
        
        } else {}
    }}>
      <View 
        style = {{
          backgroundColor: item.sigla == this.state.Empreendimento ? this.props.StyleGlobal.cores.background : '#FFFFFF',
          width: '100%',
          borderWidth: 1,
          borderColor: 'rgba(16, 22, 26, 0.15)',
          marginVertical: 5,
          borderRadius: 5,
          height: 58,
          alignItems: "center",
          justifyContent: "center"
      }}>
        <Text 
          style = {{
            paddingVertical: 0,
            fontSize: 13,
            color: item.sigla == this.state.Empreendimento ? '#FFFFFF' : '#262825',
            fontWeight: item.sigla == this.state.Empreendimento ? 'bold' : 'normal',
            textAlign: 'center',
            textAlignVertical: 'center',
        }}>{item.descricao}</Text>
      </View>
    </TouchableOpacity>
  );
  //#endregion

  //#region Acessando tela de Tabela de preços
  acessandoProximaTela = async () => {
    const { addToEmpresaCentroDeCusto } = this.props;
    addToEmpresaCentroDeCusto({empresa : this.state.EmpresaId}, {centrodecusto: this.state.Empreendimento});

    const navegar = this.props.navigation.getParam('Empreendimento', 'null')
    if(navegar != null && navegar != 'null')
    {
      return navegar.onConfirm()
    }
  }
  //#endregion

  //#region Animacao no botão confirmar
  animacaoButton = async () => {
    Animated.parallel([
      Animated.timing(this.state.opacityButton, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.translateYButton, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      })
    ]).start()
  }
  //#endregion

  //#endregion

}

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  tela: String(state.telaAtual),
  ConfigCss: state.configcssApp,
  StyleGlobal: state.StyleGlobal,
  EmpresaLogada: state.EmpresaLogada,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({...DadosEmpreendimentoActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Empreendimento);