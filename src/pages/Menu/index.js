//#region Bibliotecas importadas

//#region Nativas
import React, { Component, useEffect } from 'react';
import { View, Text, Image, ScrollView, Animated, TouchableOpacity, Dimensions, Linking, Platform, StatusBar, Alert } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import axios from 'axios';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFetchBlob from 'rn-fetch-blob';
import Collapse from 'react-native-collapsible';
import NumberFormat from 'react-number-format';
import AsyncStorage from '@react-native-async-storage/async-storage';
//#endregion

//#region Services
import { QuadroResumoMenu, Cargos, Identificador } from '../../services';
//#endregion

//#region Redux
import { ContratosActions, ConfigCssAppActions, TelaAtualActions, DadosUsuarioActions, DadosEmpreendimentoActions, DadosMeiosDeContatoActions, DadosModeloDeVendasActions, EntradasActions, IntermediariasActions, ParcelasActions, LotesActions, ClienteActions, ConjugeActions, EnderecoActions, TelefonesActions, DocumentosOriginaisActions, DocumentosActions, DocumentosConjugeActions, CargosActions, TabelaFIPActions, DadosLeadActions, DadosCorretagemActions, DadosIntermediacaoActions, DadosTabelaParcelasActions, TabelaDeVendasActions } from '../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import LoaderCircleColor from '../../effects/loader-circle-color.json';
import LoaderCircleWrite from '../../effects/loader-circle.json';
import Sad from '../../effects/sad.json';
//#endregion

//#region Componentes
import { ContainerMenu, TextTitulo } from '../../components';
import { ModalLoading, ModalSucesso, ModalPerfil } from '../Modais';
import { 
  ContainerOpcoesMenu,
  ContentQuadroResumo,
  Atendente,
  CircleItem,
  CircleScrollTo, 
  OpcoesMenu, 
  LogoView,
  LogoutAndNomeCorretor,
  NomeCorretor,
  Footer,
  ContentFooter
} from './styles';
//#endregion

//#region path Cargos
const pathCargos = `${RNFetchBlob.fs.dirs.MainBundleDir}/cargos${new Date().getMonth()}_${new Date().getFullYear()}.json`;
  // const pathTabelaFIP = `${RNFetchBlob.fs.dirs.MainBundleDir}/tabelaFIP${new Date().getMonth()}_${new Date().getFullYear()}.json`;
//#endregion

//#region Imagens
import IconMyBrokerBranca from '../../assets/MyBrokerBranca.svg';
import IconAtendente from '../../assets/IconAtendente.svg';
//#endregion

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

//#endregion

class Menu extends Component {
  _isMounted = false;

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

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      // await this.setVisibilidadeModalLoading(false);
      // await this.pegandoQuadroResumoMenu()
    })
    await this.pegandoQuadroResumoMenu();
    await this.pegandoListaDeContratos();
    await this.ultimasNoticias();
    // await this.pegandoListaDeCargos();
  }
  //#endregion


  
  //#region Component Unmount
  componentWillUnmount() {
    this._isMounted = false;
  }
  //#endregion

  //#region Model
  state = {
    DadosDoQuadroResumo: [],
    DadosDoQuadroResumoTeste2: [],
    NewsLetter: [],
    NewsLetterMyBroker: [],
    ListaDeContratos: [],
    LoadingNoticias: true,
    OpacityNoticias: new Animated.Value(0),
    NoticiasY: new Animated.Value(60),
    DadosAtividadesView: [],
    VisibilidadeModalLoading: false,
    VisibilidadeModalSucesso: false,
    VisibilidadeModalPerfil: false,
    ValorAnimadoOpcoesMenu: new Animated.Value(65),
    xOffset: new Animated.Value(1),
    distOffset: Dimensions.get('window').width*0.25,
    distScroll: 0,
    NomeDoIconeParaAbrirOpcoes: 'keyboard-arrow-down',
    InverterAnimacaoDasOpcoesMenu: false,
    id_atual: 0,
    fadeOpacity: new Animated.Value(1),
    ID: "",
    getMostrarMaisOpcoesMenu: new Animated.Value(65),
    rotateIcon: new Animated.Value(0),
    expandCollapsideContratos: true,
  };
  //#endregion

  //#region View
  render() {
    
    const headerOpacity = this.state.xOffset.interpolate({
      inputRange: [0, this.state.distOffset],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    
    return (
      <ContainerMenu style = {{backgroundColor: "#FFFFFF"}}>
        <ModalSucesso visibilidade={this.state.VisibilidadeModalSucesso}/>
        <ModalPerfil
          visibilidade={this.state.VisibilidadeModalPerfil}
          onPressClose={() => {this.setState({ VisibilidadeModalPerfil: false })}}
        />
        <ModalLoading 
          visibilidade = {this.state.VisibilidadeModalLoading}
          onPress = {() => { this.props.navigation.goBack() }}
        />
        <StatusBar
          barStyle = "light-content"
          hidden = {false}
          backgroundColor = {this.props.StyleGlobal.cores.background}
          translucent = {true}
          networkActivityIndicatorVisible = {true}
        />
        {this.state.VisibilidadeModalLoading != true && <>
        <ContentQuadroResumo
          style = {{
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: this.props.StyleGlobal.cores.background,
            height: 200,
        }}>
          <LogoView style = {{width: Dimensions.get("window").width}}>
            {true && <IconMyBrokerBranca width = {Dimensions.get('window').width * 0.4} height = {130} style = {{marginLeft: 10, marginBottom: Platform.isPad ? 50 : 10}}/>}
          </LogoView>
          <Animated.ScrollView
            horizontal = {true} pagingEnabled showsHorizontalScrollIndicator = {false}
            style = {[ {flex: 1, height: '50%', marginBottom: 20} ]}
            scrollEventThrottle = {16}
            onScroll = {Animated.event(
              [{nativeEvent: {contentOffset: {x: this.state.xOffset}}}],
              {useNativeDriver: true}
            )}
            onMomentumScrollEnd = { async (e) => {
              const circulo = ( e.nativeEvent.contentOffset.x > 0 )
                ?  Math.round(e.nativeEvent.contentOffset.x / (Dimensions.get('window').width))
                : 0;
                if(circulo != this.state.id_atual && circulo != 0) 
                {
                  await this.setState({id_atual: circulo})
                } 
                else
                {
                  await this.setState({id_atual: circulo})
                }
            }}
          >
            {(this.state.DadosDoQuadroResumo.length > 0) && <>
              {this.state.DadosDoQuadroResumo.map((dados, index) => {

                const inputRange = [
                  -1,
                  0,
                  Dimensions.get('window').width * index,
                  Dimensions.get('window').width * (index + 2)
                ]

                const scale = this.state.xOffset.interpolate({
                  inputRange,
                  outputRange: [1, 1, 1, 0]
                })

                const opacityInputRange = [
                  -1,
                  0,
                  (Dimensions.get('window').width) * index,
                  (Dimensions.get('window').width) * (index + .5)
                ]

                const opacity = this.state.xOffset.interpolate({
                  inputRange: opacityInputRange,
                  outputRange: [1, 1, 1, 0]
                })

                return (
                  <Animated.View key = {dados.id} 
                    style = {[
                      { width: (Dimensions.get('window').width), justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 30 },
                      { opacity: opacity },
                      { transform: [{scale}] }
                  ]}>
                    <Animated.View 
                      style = {{
                        height: '100%', 
                        justifyContent: 'space-evenly'
                    }}>
                      <Text style = {{fontSize: 15, color: "#FFFFFF", marginBottom: 5, textAlign: 'right', fontWeight: 'bold'}}>{dados.id}</Text>
                      {Platform.OS !== "ios" &&
                        <NumberFormat 
                          value={dados.valor1}
                          displayType='text'
                          thousandSeparator
                          prefix="R$"
                          renderText={(value) => <Text style = {{fontSize: 18, color: "#FFFFFF", marginBottom: 5, textAlign: 'right', fontWeight: 'bold'}}>{value}</Text>}
                        />}
                      {Platform.OS === "ios" &&
                        <Text style = {{fontSize: 18, color: "#FFFFFF", marginBottom: 5, textAlign: 'right', fontWeight: 'bold'}}>{dados.valor1 && (dados.valor1).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</Text>}
                      <Text style = {{fontSize: 18, color: "#FFFFFF", marginTop: -40, textAlign: 'right', fontWeight: 'bold'}}>{dados.valor2}</Text>
                    </Animated.View>
                  </Animated.View>
                )
            })}</>}
            {(this.state.DadosDoQuadroResumo.length == 0) && <>
              <View style = {{width: Dimensions.get('window').width, marginTop: 40}}>
                <View style = {{width: Dimensions.get('window').width, height: 15, alignItems: 'flex-end', marginLeft: Dimensions.get('window').width * 0.2, marginBottom: 10}}>
                  <Lottie
                    source = {LoaderCircleWrite}
                    autoPlay
                    resizeMode = {"contain"}
                    loop
                  />
                </View>
                <Text style = {{color: '#FFFFFF', width: Dimensions.get('window').width, textAlign: 'right', paddingRight: Platform.isPad ? ((Dimensions.get("window").width - (Dimensions.get('window').width * 0.4)) * 0.4) : Dimensions.get('window').width * 0.15, marginLeft: 10}}>Carregando resumo...</Text>
              </View>
            </>}
          </Animated.ScrollView>
        </ContentQuadroResumo>
        <CircleScrollTo style = {{position: 'absolute', marginTop: Platform.isPad ? 140 : 140, marginLeft: Platform.isPad ? Dimensions.get('window').width - 200 : Dimensions.get('window').width - 200}}>
        {this.state.DadosDoQuadroResumo.map((c, index) => (
          <CircleItem 
            key = {c.id}
            activeOpacity = {1}
            style = {{
              borderColor: index == this.state.id_atual ? '#CCC' : '#FFF',
              backgroundColor: index == this.state.id_atual ? '#BBBBBB' : '#000',
            }}></CircleItem>
        ))}
        </CircleScrollTo>
          <LogoutAndNomeCorretor
            activeOpacity = {1}
            style = {{
              marginTop: -Dimensions.get('window').height * 0.05, 
              marginLeft: Dimensions.get('window').width * 0.03,
              marginRight: '88%',
            }} onPress = {() => {this.props.navigation.goBack()}}>
              <Icon name = 'logout' color = {'#FFF'} size = {20} />
          </LogoutAndNomeCorretor>
          <NomeCorretor  style = {{ color: "#FFF", marginRight: 80, marginTop: -29, marginLeft: 50 }} ellipsizeMode = 'tail' numberOfLines={1}>{this.props.token[0].pessoa.nome}</NomeCorretor>
          <View style={{alignItems:'flex-end', marginTop:-25, marginBottom: 10, marginRight: 15, marginLeft: 350, borderRadius: 30}}>
            <Icon name = 'person' color = {'#FFF'} size = {30} onPress={() => {this.setVisibilidadePerfil(true)}}/>
          </View>
        <Footer
          style = {{
            backgroundColor: this.props.StyleGlobal.cores.background,
            height: Dimensions.get('window').height - 200,
            justifyContent: 'flex-start',
            opacity: 1
        }}>
          <ContentFooter
            style = {{
              flex: 1,
              backgroundColor: '#FFFFFF',
          }}>
            <ContainerOpcoesMenu>
              <ScrollView>
                
                <View>
                  <TextTitulo estilo = {{ fontStyle: 'normal', fontWeight: 'bold', fontSize: 16, color: "#000000", marginVertical: 10,color: this.props.StyleGlobal.fontes.corpadrao}} texto = {'Principais notícias'}/>
                  {this.props.EmpresaLogada[0] != 6 && this.state.NewsLetter.map((Item) => (
                    <TouchableOpacity
                      style = {{
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        paddingHorizontal: 5,
                        minHeight: 120, 
                        backgroundColor: '#FFFFFF', 
                        borderWidth: 1, 
                        borderColor: 'rgba(16, 22, 26, 0.15)', 
                        marginBottom: 8,
                        borderRadius: 5,
                        elevation: 5,
                      }} activeOpacity = {1} onPress = {async () => {window.open(Item.URL)}}>
                      <Image style = {{width: 100, height: 100, borderRadius: 100}} source = {{uri: Item.URLImagem}}/>
                      <View style = {{justifyContent: 'space-between', width: '70%'}}>
                        <Text ellipsizeMode = {'tail'} style = {{flexWrap: 'wrap',textAlign: 'right', fontSize: 14, color: this.props.StyleGlobal.fontes.corpadrao, fontWeight: 'bold', marginBottom: 10}}>{Item.Titulo}</Text>
                        <Text ellipsizeMode = {'tail'} style = {{flexWrap: 'wrap',textAlign: 'right', fontSize: 12, color: '#000000'}}>{Item.Descricao}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                  {this.state.NewsLetterMyBroker.length > 0 && this.props.EmpresaLogada[0] == 6 && this.state.NewsLetterMyBroker.map((Item) => (
                    <Animated.View
                      style = {[
                        {opacity: this.state.OpacityNoticias},
                        {transform: [
                          {translateY: this.state.NoticiasY}
                        ]}
                    ]}>
                      <TouchableOpacity
                        style = {{
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          paddingHorizontal: 20,
                          backgroundColor: '#FFFFFF',
                          borderWidth: 1,
                          borderColor: 'rgba(16, 22, 26, 0.15)', 
                          marginBottom: 8,
                          borderRadius: 5,
                          minHeight: 100,
                          paddingVertical: 10,
                          elevation: Platform.OS === 'ios' ? 0 : 5
                        }} activeOpacity = {1} onPress = {async () => {await Linking.openURL(Item.url)}}>
                        {Item.arquivo != null && <Image style = {{width: 60, height: 60, borderRadius: 60}} source = {{uri: Item.arquivo.arquivo}}/>}
                        <View style = {{justifyContent: 'space-between', width: Item.arquivo == null ? '100%' : '80%', marginRight: 10}}>
                          <Text style = {{flexWrap: 'wrap',textAlign: 'right', fontSize: 14, color: this.props.StyleGlobal.cores.background, fontWeight: 'bold', marginBottom: 10}}>{Item.titulo}</Text>
                          <Text style = {{flexWrap: 'wrap',textAlign: 'right', fontSize: 12, color: '#000000'}}>{Item.descricao}</Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                  {this.state.LoadingNoticias == true && <>
                    <Animated.View 
                      style = {[{
                        width: SCREEN_WIDTH, 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: SCREEN_HEIGHT * 0.4,
                    }]}>
                      <View style = {{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', marginRight: 20}}>
                        <Lottie
                          source = {LoaderCircleColor}
                          autoPlay
                          resizeMode = {"contain"}
                          loop
                        />
                      </View>
                      <Text style = {{color: "#00000075", width: SCREEN_WIDTH, textAlign: 'center', marginRight: 20}}>Carregando notícias...</Text>
                    </Animated.View>
                  </>}
                  {this.state.LoadingNoticias == false && this.state.NewsLetter == "" && this.props.EmpresaLogada[0] != 6 && <View style = {{alignItems: "center", justifyContent: "center", height: SCREEN_HEIGHT * 0.4}}>
                    <View style = {{width: 70, height: 70, marginBottom: 20}}>
                      <Lottie
                        resizeMode = {"contain"}
                        source = {Sad}
                        autoPlay
                        loop = {false}
                      />
                    </View>
                    <Text 
                      style = {{
                        marginLeft: 10, 
                        fontStyle: 'normal', 
                        fontWeight: 'normal', 
                        fontSize: 12, 
                        color: "#000000", 
                        lineHeight: 18,
                        textAlign: "center"
                    }}>Não foi possível atualizar as principais notícias no momento.</Text>
                  </View>}
                  {this.state.LoadingNoticias == false && this.state.NewsLetterMyBroker == "" && this.props.EmpresaLogada[0] == 6 && <View style = {{alignItems: "center", justifyContent: "center", height: SCREEN_HEIGHT * 0.4}}>
                    <View style = {{width: 70, height: 70, marginBottom: 20}}>
                      <Lottie
                        resizeMode = {"contain"}
                        source = {Sad}
                        autoPlay
                        loop = {false}
                      />
                    </View>
                    <Text 
                      style = {{
                        marginLeft: 10, 
                        fontStyle: 'normal', 
                        fontWeight: 'normal', 
                        fontSize: 12, 
                        color: "#000000", 
                        lineHeight: 18,
                        textAlign: "center"
                    }}>Não foi possível atualizar as principais notícias no momento.</Text>
                  </View>}
                </View>
                <OpcoesMenu
                  style = {[
                    {height: "50%", marginTop: 10, marginLeft: 1, marginRight: 1},
                    {transform: [
                      {translateY: this.state.ValorAnimadoOpcoesMenu.interpolate({
                        inputRange: [0, 200],
                        outputRange: [0, 1]
                      })}
                    ]}
                ]}>
                  <TouchableOpacity 
                    style = {{
                      paddingHorizontal: 15, 
                      borderRadius: 4, 
                      width: "100%", 
                      height: 80, 
                      backgroundColor: '#FFFFFF', 
                      borderWidth: 1, 
                      borderColor: this.props.StyleGlobal.cores.background + "20",
                      borderBottomColor: this.state.expandCollapsideContratos == true ? this.props.StyleGlobal.cores.background : ("#FFFFFF00"),
                      borderBottomWidth: 5,
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      shadowColor: '#000'
                    }} 
                    onPress = {() => { 
                      this.state.expandCollapsideContratos == true ? this.setState({expandCollapsideContratos: false}) : this.setState({expandCollapsideContratos: true}) 
                      if (this.state.InverterAnimacaoDasOpcoesMenu == false && this.state.expandCollapsideContratos == true) {this.animacaoMenuOpcoes()}
                    }}
                    activeOpacity = {1}>
                      <View style = {{flexDirection: "row", alignItems: "center"}}>
                        <Icon name = {'description'} size = {40} color = {this.props.StyleGlobal.cores.background}/>
                        <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#000000', textAlign: 'center'}}>{'Meus contratos'}</Text>
                      </View>
                      <View>
                        <Icon name = {this.state.expandCollapsideContratos == false ? 'expand-less' : 'expand-more'} size = {40} color = {this.props.StyleGlobal.cores.background}/>
                      </View>
                  </TouchableOpacity>
                  <View>
                    <Collapse 
                      collapsed = {this.state.expandCollapsideContratos}
                      style = {{
                        borderBottomColor: this.props.StyleGlobal.cores.background,
                        borderBottomWidth: 4,
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4,
                    }}>
                      {this.state.ListaDeContratos.length > 0 && this.state.ListaDeContratos.map(item => (
                        
                        <TouchableOpacity
                          activeOpacity = {0.75}
                          onPress = { async () => {

                            const { addToContratos } = this.props;

                            addToContratos(
                              
                              {
                                ContratoSelecionado: item,
                              },
                              {
                                ListaDeContratos: this.state.ListaDeContratos
                              }
                            )

                            await this.props.navigation.navigate('OpcoesContratos') 
                          }}
                          style = {{
                            backgroundColor: '#FFFFFF',
                            width: "100%",
                            borderWidth: 1,
                            borderColor: this.props.StyleGlobal.cores.background + "20",
                            borderBottomLeftRadius: 4,
                            borderBottomRightRadius: 4,
                            marginTop: 1,
                            padding: 15,
                            flexDirection: 'row',
                            alignItems: "center"
                          }}>
                            <View style = {{width: "90%"}}>
                              <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3}}>
                                <Text style = {{fontWeight: 'bold', fontSize: 12}}>Loteamento</Text>
                                <Text style = {{fontWeight: 'bold', fontSize: 12}}>{item.centroDeCusto['descricao']}</Text>
                              </View>
                              <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10}}>
                                <Text style = {{fontWeight: 'bold', fontSize: 12}}>Nome do contrato</Text>
                                <Text style = {{fontWeight: 'bold', fontSize: 12}}>{item.subLocal['descricao']}</Text>
                              </View>
                              <View style = {{flexWrap: 'wrap', maxWidth: '100%', marginRight: 5, justifyContent: 'space-between'}}>
                                {item.observacoes.map(obs => ( <Text style = {{fontSize: 12, marginBottom: 2, textAlign: 'left'}}>{obs}</Text>))}
                              </View>
                            </View>
                            <View style = {{marginLeft: 10}}>
                              <Icon 
                                name = {'navigate-next'} 
                                size = {35} 
                                color = {this.props.StyleGlobal.cores.background}

                              />
                            </View>
                        </TouchableOpacity>
                        
                      ))}
                      {this.state.ListaDeContratos.length == 0 && <View 
                          style = {{
                            backgroundColor: '#FFFFFF',
                            width: "100%",
                            borderWidth: 1,
                            borderColor: this.props.StyleGlobal.cores.background + "20",
                            borderBottomLeftRadius: 4,
                            borderBottomRightRadius: 4,
                            marginTop: 1,
                            padding: 15,
                            flexDirection: 'row',
                            alignItems: "center",
                        }}>
                          <Text>Não há contratos no momento</Text>
                      </View>}
                      
                    </Collapse>
                  </View>
                </OpcoesMenu>

                {false &&
                <Atendente>
                  <TouchableOpacity>
                    <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                      <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                        <IconAtendente width = {50} height = {50}/>
                        <Text style = {{marginLeft: 10, fontWeight: 'bold'}}>{`Falar ${'\n'}com atendente`}</Text>
                      </View>
                      <View style = {{marginRight: 10, borderRadius: 30, backgroundColor: '#CCCCCC50', padding: 5}}>
                        <Icon name = "arrow-forward" size = {40} color = {'#00000075'}/>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Atendente>}
              </ScrollView>
            </ContainerOpcoesMenu>
          </ContentFooter>
        </Footer>
        </>}
      </ContainerMenu>
    );
  }
  //#endregion

  //#region Controller

  //#region Pegando lista de contratos
  pegandoListaDeContratos = async () => {
    let Response = await Identificador.contratos(this.props.token[0].token)

    if (Math.floor(Response.status / 100) == 2)
    {
      this.setState({ListaDeContratos: Response.data})
      this.setVisibilidadeModalLoading(false)
    }
    else
    {
      this.setState({ListaDeContratos: []})
      this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion
  
  //#region Desmontando componentes
  componentWillUnmount() {
    this.focusListener.remove()
  }
  //#endregion

  //#region Animacao noticias
  animacaoNoticias = () => {
    Animated.parallel([
      Animated.timing(this.state.OpacityNoticias, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false
      }),
      Animated.timing(this.state.NoticiasY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false
      }),
    ]).start();
  }
  //#endregion

  //#region Pegando lista de cargos
  pegandoListaDeCargos = async () => {
    const { addToCargos } = this.props;

    if (await RNFetchBlob.fs.exists(pathCargos)) {
      RNFetchBlob.fs.readFile(pathCargos, 'utf8').then((data) => addToCargos(JSON.parse(data))).catch((err) => console.log(err))
    } 
    else 
    {
      const response = await Cargos.lista(String(this.props.token[0].token))
      if(response != null && response != "" && response != undefined) 
      {
        const { addToCargos } = this.props;

        if (await RNFetchBlob.fs.exists(pathCargos)) {
          RNFetchBlob.fs.readFile(pathCargos, 'utf8').then((data) => addToCargos(JSON.parse(data))).catch((err) => console.log(err))
        } 
        else 
        {
            try 
            {
              addToCargos(response)
              RNFetchBlob.fs.writeFile(pathCargos, JSON.stringify(response), 'utf8')
            } 
            catch(error) 
            {

            }
        }
      }
    }
  }
  //#endregion
  
  //#region Acessando a tela dos leads
  acessandoTelaDosLeads = async () => {
    const { addToTela } = this.props;
    addToTela('@tela_vendadireta');

    const QuadroResumo = {onConfirm: () => {this.props.navigation.navigate('Leads', {Leads: Leads})}}
    const DadosCliente = {onConfirm: () => {this.props.navigation.navigate('QuadroResumo', {QuadroResumo: QuadroResumo})}}
    const PropostaDePagamento = {onConfirm: () => {this.props.navigation.navigate('DadosCliente', {DadosCliente: DadosCliente})}}
    const Intermediacao = {onConfirm: () => {this.props.navigation.navigate('PropostaDePagamento', {PropostaDePagamento: PropostaDePagamento})}}
    const TabelaDePrecos = {onConfirm: () => {this.props.navigation.navigate('PropostaDePagamento', {PropostaDePagamento: PropostaDePagamento})}, onIntermediacao: () => {this.props.navigation.navigate('Intermediacao', {Intermediacao: Intermediacao})}}
    const Empreendimento = {onConfirm: () => {this.props.navigation.navigate('TabelaDePrecos', {TabelaDePrecos: TabelaDePrecos})}}
    const Leads = {onConfirm: () => {this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})}}

    await this.props.navigation.navigate('Leads', {Leads: Leads})
  }
  //#endregion

  //#region Acessando a tela dos prospects
  acessandoTelaDosProspects = async () => {
    const { addToTela } = this.props;
    addToTela('@tela_vendadireta');

    const QuadroResumo = {onConfirm: () => {this.props.navigation.navigate('Prospects', {Prospects: Prospects})}}
    const DadosCliente = {onConfirm: () => {this.props.navigation.navigate('QuadroResumo', {QuadroResumo: QuadroResumo})}}
    const PropostaDePagamento = {onConfirm: () => {this.props.navigation.navigate('DadosCliente', {DadosCliente: DadosCliente})}}
    const Intermediacao = {onConfirm: () => {this.props.navigation.navigate('PropostaDePagamento', {PropostaDePagamento: PropostaDePagamento})}}
    const TabelaDePrecos = {onConfirm: () => {this.props.navigation.navigate('PropostaDePagamento', {PropostaDePagamento: PropostaDePagamento})}, onIntermediacao: () => {this.props.navigation.navigate('Intermediacao', {Intermediacao: Intermediacao})}}
    const Empreendimento = {onConfirm: () => {this.props.navigation.navigate('TabelaDePrecos', {TabelaDePrecos: TabelaDePrecos})}}
    const Prospects = {onConfirm: () => {this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})}}

    await this.props.navigation.navigate('Prospects', {Prospects: Prospects})
  }
  //#endregion

  //#region Acessando a tela dos contratos pendentes
  acessandoTelaDosContratosPendentes = async () => {
    const { addToTela } = this.props;
    addToTela('@tela_contratospendentes');

    const Empreendimento = {onConfirm: () => {this.props.navigation.navigate('ContratosPendentes')}}
    
    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})
  }
  //#endregion

  //#region Acessando a tela para minhas reservas
  acessandoTelaDasMinhasReservas = async () => {
    const { addToTela } = this.props;
    addToTela('@tela_reserva');

    const QuadroResumo = {onConfirm: () => {this.props.navigation.navigate('MinhasReservas', {MinhasReservas: MinhasReservas})}}
    const DadosCliente = {onConfirm: () => {this.props.navigation.navigate('QuadroResumo', {QuadroResumo: QuadroResumo})}}
    const PropostaDePagamento = {onConfirm: () => {this.props.navigation.navigate('DadosCliente', {DadosCliente: DadosCliente})}}
    const Intermediacao = {onConfirm: () => {this.props.navigation.navigate('PropostaDePagamento', {PropostaDePagamento: PropostaDePagamento})}}
    const Prospects = {onConfirm: () => {this.props.navigation.navigate('MinhasReservas', {MinhasReservas: MinhasReservas})}, iconAdd: true}
    const ProspectsProposta = {onConfirm: () => {this.props.navigation.navigate('PropostaDePagamento', {PropostaDePagamento: PropostaDePagamento})}, iconAdd: true, onReservaNovo: () => {this.props.navigation.navigate('MinhasReservas', {MinhasReservas: MinhasReservas})}, onIntermediacao: () => {this.props.navigation.navigate('Intermediacao', {Intermediacao: Intermediacao})}}
    const MinhasReservas = {onConfirm: () => {this.props.navigation.navigate('Prospects', {Prospects: Prospects})}, onProposta: () => {this.props.navigation.navigate('Prospects', {ProspectsProposta: ProspectsProposta})}, onReservado: () => {this.props.navigation.navigate('PropostaDePagamento', {PropostaDePagamento: PropostaDePagamento})}, onIntermediacao: () => {this.props.navigation.navigate('Intermediacao', {Intermediacao: Intermediacao})}}
    const Empreendimento = {onConfirm: () => {this.props.navigation.navigate('MinhasReservas', {MinhasReservas: MinhasReservas})}}

    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento});
  }
  //#endregion

  //#region Acessando a tela para disponibilidade
  acessandoTelaDasDisponibilidades = async () => {

    const { addToTela } = this.props;
    addToTela('@tela_reserva');

    const QuadroResumo = {onConfirm: () => {this.props.navigation.navigate('Disponibilidade', {Disponibilidade: Disponibilidade})}}
    const DadosCliente = {onConfirm: () => {this.props.navigation.navigate('QuadroResumo', {QuadroResumo: QuadroResumo})}}
    const PropostaDePagamento = {onConfirm: () => {this.props.navigation.navigate('DadosCliente', {DadosCliente: DadosCliente})}}
    const Intermediacao = {onConfirm: () => {this.props.navigation.navigate('PropostaDePagamento', {PropostaDePagamento: PropostaDePagamento})}}
    const Prospects = {onConfirm: () => {this.props.navigation.navigate('Disponibilidade', {Disponibilidade: Disponibilidade})}, iconAdd: true}
    const ProspectsProposta = {onConfirm: () => {this.props.navigation.navigate('PropostaDePagamento', {PropostaDePagamento: PropostaDePagamento})}, iconAdd: true, onReservaNovo: () => {this.props.navigation.navigate('Disponibilidade', {Disponibilidade: Disponibilidade})}, onIntermediacao: () => {this.props.navigation.navigate('Intermediacao', {Intermediacao: Intermediacao})}}
    const Disponibilidade = {onConfirm: () => {this.props.navigation.navigate('Prospects', {Prospects: Prospects})}, onProposta: () => {this.props.navigation.navigate('Prospects', {ProspectsProposta: ProspectsProposta})}, onReservado: () => {this.props.navigation.navigate('PropostaDePagamento', {PropostaDePagamento: PropostaDePagamento})}, onIntermediacao: () => {this.props.navigation.navigate('Intermediacao', {Intermediacao: Intermediacao})}}
    const Empreendimento = {onConfirm: () => {this.props.navigation.navigate('Disponibilidade', {Disponibilidade: Disponibilidade})}}    

    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento});
  }

  //#endregion

  //#region Acessando a tela para pagamentos
  acessandoTelaDePagamentos = async () => {
    await this.props.navigation.navigate('Pagamentos');
  }
  //#endregion

  //#region Acessando a tela de permissões
  acessandoTelaDePermissoes = async () => {
    await this.props.navigation.navigate('Permissoes');
  }
  //#endregion

  //#region Acessando a tela de propostas pendentes
  acessandoTelaDePropostasPendentes = async () => {
    const Empreendimento = {onConfirm: () => {this.props.navigation.navigate('PropostasPendentes')}}    

    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento});
  }
  //#endregion

  //#region Acessando a tela para autorização de escritura
  acessandoTelaDeAutorizacaoDeEscritura = async () => {
    
    const Informativos = {titleMensagem: 'solicitar a autorização de escritura', termos: true, onConfirm: () => {}}

    const Empreendimento = {titleMensagem: 'solicitar a autorização de escritura', onConfirm: () => {this.props.navigation.navigate('Informativos', {Informativos: Informativos})}}

    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})
  }
  //#endregion

  //#region Acessando a tela de renegociacao
  acessandoTelaDeRenegociacao = async () => {

    const Informativos = {titleMensagem: 'solicitar uma renegociação', termos: false, onConfirm: () => {}}

    const Empreendimento = {titleMensagem: 'solicitar uma renegociação', onConfirm: () => {this.props.navigation.navigate('Informativos', {Informativos: Informativos})}}

    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})

  }
  //#endregion

  //#region Acessando a tela de cessao de direitos
  acessandoTelaDeCessaoDeDireitos = async () => {

    const Informativos = {titleMensagem: 'solicitar uma cessão de direitos', termos: true,  onConfirm: () => {}}

    const Empreendimento = {titleMensagem: 'solicitar uma cessão de direitos', onConfirm: () => {this.props.navigation.navigate('Informativos', {Informativos: Informativos})}}

    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})

  }
  //#endregion

  //#region Acessando a tela de boletos
  acessandoTelaDeBoletos = async () => {

    const Boletos = {title: '', onConfirm: () => {}}

    const Empreendimento = {title: '', onConfirm: () => {this.props.navigation.navigate('Boletos')}}
  
    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})
  }
  //#endregion

  //#region Acessando a tela de demonstrativo de pagamento
  acessandoTelaDeDemonstrativoDePagamento = async () => {

    const Demonstrativo = {title: `Dem. de pagamentos`, onConfirm: () => {}}

    const Empreendimento = {title: `Dem. de pagamentos`, onConfirm: () => {this.props.navigation.navigate('DemonstrativoIR', {Demonstrativo: Demonstrativo})}}
   
    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})

  }
  //#endregion

  //#region Acessando a tela de demonstrativo de imposto de renda
  acessandoTelaDeDemonstrativoDeImpostoDeRenda = async () => {
    
    const Demonstrativo = {title: `Informe de rendimentos de ${(new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())).getFullYear()}`, onConfirm: () => {}}

    const Empreendimento = {title: `Informe de rendimentos de ${(new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())).getFullYear()}`, onConfirm: () => {this.props.navigation.navigate('DemonstrativoIR', {Demonstrativo: Demonstrativo})}}
    
    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})

  }
  //#endregion

  //#region Acessando a tela de falha no pagamento
  acessandoTelaDeFalhaNoPagamento = async () => {
    
    const Informativos = {title: 'Falha no pagamento', onConfirm: () => {}}

    const Empreendimento = {title: 'Falha no pagamento', onConfirm: () => {this.props.navigation.navigate('Informativos', {Informativos: Informativos})}}
   
    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})
  }
  //#endregion

  //#region Acessando a tela de pagamento em duplicidade
  acessandoTelaDePagamentoEmDuplicidade = async () => {
    
    const Informativos = {title: 'Pagamento em duplicidade', onConfirm: () => {}}

    const Empreendimento = {title: 'Pagamento em duplicidade', onConfirm: () => {this.props.navigation.navigate('Informativos', {Informativos: Informativos})}}
   
    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})
  }
  //#endregion

  //#region Acessando a tela de dúvidas sobre o contrato
  acessandoTelaDeDuvidasSobreOContrato = async () => {
    
    const Informativos = {title: 'Dúvidas sobre o contrato', onConfirm: () => {}}

    const Empreendimento = {title: 'Dúvidas sobre o contrato', onConfirm: () => {this.props.navigation.navigate('Informativos', {Informativos: Informativos})}}
   
    await this.props.navigation.navigate('Empreendimento', {Empreendimento: Empreendimento})
  }
  //#endregion

  //#region Acessando a tela de configurações
  acessandoTelaDeConfiguracoes = async () => {
    await this.props.navigation.navigate('Configuracoes')
  }
  //#endregion

  //#region Pegando dados do quadro resumo
  pegandoQuadroResumoMenu = async () => {
    try {
      let response = await QuadroResumoMenu.QuadroResumo(String(this.props.token[0].token), "27")
      if(response != null && response != "" && response != undefined)
      {
        let dados = [response]
        this.state.DadosDoQuadroResumo = await dados.map(quadro => [
          {
            id: this.props.EmpresaLogada[0] == 6 ? 'Total pago' : "Total em vendas",
            valor1: quadro.totalEmVendas
          },
          {
            id: this.props.EmpresaLogada[0] == 6 ? 'Total a pagar' : "Total em comissão",
            valor1: quadro.totalEmComissao
          },
          {
            id: this.props.EmpresaLogada[0] == 6 ? 'Percentual pago' : "Taxa de aprovação",
            valor2: `${(quadro.taxaDeAprovacao).toFixed(2)}%`
          },
          {
            id: this.props.EmpresaLogada[0] == 6 ? "Titulos inadimplentes" : 'Propostas ativas',
            valor2: quadro.propostasAtivas
          },
          {
            id: this.props.EmpresaLogada[0] == 6 ? "Custas em aberto" : 'Venda',
            valor2: quadro.vendas
          }
        ])
        this.state.DadosDoQuadroResumo = this.state.DadosDoQuadroResumo[0]
        await this.pegandoListaDeContratos();
        // this.setVisibilidadeModalLoading(false);
      }
      else {}
    } catch(err) {}
  }
  //#endregion

  //#region Ultimas noticias
  ultimasNoticias = async () => {
    if (this.props.EmpresaLogada[0] === 6)
    {
      try {
        let Response = await QuadroResumoMenu.NewsLetterMyBroker(this.props.token[0].token)
        if (Response != null && Response != undefined)
        {
          let dadosLimpos = Response.filter(item => item != null)
          this.setState({NewsLetterMyBroker: dadosLimpos, LoadingNoticias: false})
          this.animacaoNoticias();
        }
        else {}
      } catch(err) {

      }
    }
    else
    {
      try {
        let Response = await axios.get('https://api.bing.microsoft.com/v7.0/news/search?q=mercado imobiliario', {
          headers: {
            "Ocp-Apim-Subscription-Key": "e5cb9cc214b34758939c5210fa3a25ef"
          }
        }).then((Response) => {return Response;})
          .catch((Exception) => {return Exception;})

        var Registros = []
  
        if(Math.floor(Response.status / 100) == 2)
        {
          var dados = Response.data.value;
          dados.map((Item) => {
            Registros.push({
                Titulo: Item.name,
                URLImagem: Item.image != "" ? Item.image.thumbnail.contentUrl : "",
                Descricao: Item.description,
                URL: Item.url
            });
          })
          this.setState({LoadingNoticias: false})
          // this.state.NewsLetter = Registros;
        }
        else
        {
          this.setState({LoadingNoticias: false})
        }
      } catch(err) {}
    }
  }
  //#endregion

  //#region Animacao menu
  animacaoMenuOpcoes() {
    if(this.state.InverterAnimacaoDasOpcoesMenu == false) {
      Animated.parallel([
        Animated.timing(this.state.ValorAnimadoOpcoesMenu, {
          toValue: 400,
          duration: 800,
          useNativeDriver: false
        }),
        Animated.timing(this.state.rotateIcon, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
      this.setState({InverterAnimacaoDasOpcoesMenu: true})
    } else {
      Animated.parallel([
        Animated.timing(this.state.ValorAnimadoOpcoesMenu, {
          toValue: 65,
          duration: 800,
          useNativeDriver: false
        }),
        Animated.timing(this.state.rotateIcon, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
      this.setState({InverterAnimacaoDasOpcoesMenu: false})
    }
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeModalLoading(value) {
    this.setState({VisibilidadeModalLoading: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de sucesso
  setVisibilidadeSucesso = async (value) => {
    await this.setState({ VisibilidadeModalSucesso: value })
  }

  //#region Setando a visibilidade da modal de Perfil
  setVisibilidadePerfil = async (value) => {
    await this.setState({ VisibilidadeModalPerfil: value })
  }
  //#endregion

  //#region Limpando o redux
  cleanRedux = () => {
    const { cleanToTela, cleanToEmpresaCentroDeCusto, cleanToMeiosDeContato, cleanToModelo, cleanToEntradas, cleanToIntermediarias, 
      cleanToParcelas, cleanToLotes, cleanToCliente, cleanToConjuge, cleanToEndereco, cleanToTelefones, 
      cleanToDocumentos, cleanToDocumentosConjuge, cleanToDocumentosOriginais, cleanToLead, cleanToCorretagem,
      cleanToIntermediacao, cleanToDadosTabelaDeVendas, cleanToTabelaParcelas } = this.props;
      
      cleanToTela()
      cleanToEmpresaCentroDeCusto()
      cleanToModelo()
      cleanToEntradas()
      cleanToIntermediarias()
      cleanToParcelas()
      cleanToLotes()
      cleanToCliente()
      cleanToConjuge()
      cleanToEndereco()
      cleanToTelefones()
      cleanToDocumentosOriginais()
      cleanToDocumentos()
      cleanToDocumentosConjuge()
      cleanToLead()
      cleanToMeiosDeContato()
      cleanToCorretagem()
      cleanToIntermediacao()
      cleanToDadosTabelaDeVendas()
      cleanToTabelaParcelas() 
  }
  //#endregion

  //#endregion
}

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  Cargos: state.Cargos,
  ConfigCss: state.configcssApp,
  EmpresaLogada: state.EmpresaLogada,
  StyleGlobal: state.StyleGlobal
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...ContratosActions, ...ConfigCssAppActions,...TelaAtualActions,...DadosLeadActions, ...DadosUsuarioActions, ...CargosActions, ...TabelaFIPActions, ...DadosEmpreendimentoActions, ...DadosMeiosDeContatoActions, ...DadosModeloDeVendasActions, ...EntradasActions, ...IntermediariasActions, ...ParcelasActions, ...LotesActions, ...ClienteActions, ...ConjugeActions, ...EnderecoActions, ...TelefonesActions, ...DocumentosOriginaisActions, ...DocumentosActions, ...DocumentosConjugeActions, ...DadosCorretagemActions, ...DadosIntermediacaoActions, ...DadosTabelaParcelasActions, ...TabelaDeVendasActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Menu);