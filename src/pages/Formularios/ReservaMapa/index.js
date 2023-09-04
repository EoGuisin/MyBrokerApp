//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Dimensions, FlatList, Animated, View, Text, PanResponder, StyleSheet, Modal, ImageBackground, TouchableOpacity } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Lottie from 'lottie-react-native';
import MapView, { Polygon, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import PushNotification from 'react-native-push-notification';
//#endregion

//#region Services
import { Identificador } from '../../../services';
//#endregion

//#region Redux
import { LotesActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto, Animacoes } from '../../../Style';
import Loader from '../../../effects/loader.json';
import Loading from '../../../effects/loading-empresas.json';
//#endregion

//#region Componentes
import { ModalMapa, ModalReservaConfirmada } from '../../Modais';
import {
  ContainerMapa,
  AnimaView,
  HeaderMapa,
  ReturnMenu,
  TopMapa,
  ButtomVoltarMapa, 
  ButtomVoltarTextMapa,
  ContainerScroll,
  TabScroll, 
  DescriptionUnidade, 
  RenderText,
  ReservaouVender,
  ReservaView,
  ReservaButtom,
  TabelaVendaView,
  TabelaButtom, 
  ButtomText,
  TitleLoteAnimado,
  ViewConfirmaButtom,
  ConfirmaButtom,
  ConfirmaButtomText,
  ViewListaButttom,
  ListaButtom,
  ListaButtomText,
  FooterButtom,
  IndicatorView,
} from './styles';
//#endregion

//#region Imagens
import logo from '../../../assets/logomenu.png';
import back_image from '../../../assets/imagemdefundologin.png';
//#endregion

//#region Dimensoes da tela
const {height, width } = Dimensions.get('window');
//#endregion

//#endregion

class ReservaMapa extends Component {

  //#region Funcoes do componente
  componentDidMount = async () => {
    await this.setVisibilidadeModalMapa(true)
    await this.pegandoListaDeUnidades()
  }
  //#endregion
  
  //#region Model
  text = "Reserva em lista"
  HeaderHeight = null
  FlatListHeight = null
  ScrollViewHeight = 100
  state = {
    navegar: this.props.navigation,
    indicator: false,
    indicatortabela: false,
    VisibilidadeModalMapa: false,
    VisibilidadeModalReservaConfirmada: false,
    offsetButtom: new Animated.ValueXY({x: 0, y: 0}),
    offsetHeader: new Animated.ValueXY({x: 0, y: 0}),
    opacity: new Animated.Value(0),
    scaleOffset: new Animated.Value(1),
    scaleLista: new Animated.Value(0),
    AnimatedHeader: new Animated.Value(1),
    AnimatedScroll: new Animated.Value(this.ScrollViewHeight),
    AnimatedButtom: new Animated.Value(0),
    changeText: true,
    header: true,
    IDProspect: null,
    Renderizar: true,
    latitude: -5.5769,
    longitude: -47.4337,
    polygons: [],
    polygonsR_V: [],
    local: null,
    subLocal: null, 
  };
  //#endregion
  
  //#region View
  render() {
    const { latitude, longitude } = this.state.polygons == "" ? { latitude: 0, longitude: 0 } : this.state.polygons[4].centro
    const { AnimatedHeader, AnimatedScroll, AnimatedButtom } = this.state;
    return (
      <ContainerMapa>
        <ModalReservaConfirmada 
          visibilidade = {this.state.VisibilidadeModalReservaConfirmada}
          onPressIcon = {() => {this.setVisibilidadeModalReservaConfirmada(false)}}
          onPressReservarNovoLote = {() => {this.setVisibilidadeModalReservaConfirmada(false)}}
          onPressObrigado = {() => {this.props.navigation.navigate('Menu')}}
        />
        <ModalMapa visibilidade = {this.state.VisibilidadeModalMapa} onPress = {() => {this.setVisibilidadeMapa(false)}}/>
        <MapView
          ref = {map => this.mapView = map}
          provider = {PROVIDER_GOOGLE}
          style = {{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
          region = {{
            latitude,
            longitude,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134 
          }}
          tappable
          onPress = { async () => {
            Animacoes.offScroll(this.state, 0, 1000);
            this.state.offsetButtom.x = new Animated.Value(0)
            this.state.offsetButtom.y = new Animated.Value(0)
            this.state.opacity = new Animated.Value(1)
            setTimeout(() => {
              this.setState({header: true, changeText: true})
              Animacoes.onHeaderMapa(this.state, 1, 400)
            }, 1000);
          }}
          showsUserLocation loadingEnabled
          minZoomLevel = {16}
        >
          {this.state.polygons.map(poligonos => poligonos.coordinates != "" && poligonos.coordinates != null && poligonos.centro != "" && poligonos.centro != null && (
          <Polygon
            key = {poligonos.indice} coordinates = {poligonos.coordinates}
            fillColor = {this.statusDaUnidade(poligonos.status)}
            strokeColor = {this.statusDaUnidade(poligonos.status)}
            strokeWidth = {1}
            strokeColor = {'#000000'}
          />
          ))}
            {this.state.polygons.map(lotes => lotes.indice != -1 && lotes.centro != "" && lotes.centro != null && lotes.coordinates != "" && lotes.coordinates != null && (
            <Marker
              key = {lotes.indice} coordinate = {lotes.centro} tappable
              onPress = {async () => {
                Animacoes.offHeaderMapa(this.state, 0, 400);
                setTimeout(() => {
                  this.setState({header: false});
                  Animacoes.onScroll(this.state, this.ScrollViewHeight, 400);
                }, 1000)
                this.state.polygons[0].centro = lotes.centro
                this.ScrollView.scrollTo({x: Dimensions.get('window').width * (parseInt(lotes.indice) - 1), y: 0, animated: false})
              }}>
              <View>
                <Text></Text>
              </View>
            </Marker>
          ))}
        </MapView>
        {this.state.header != false &&
        <TopMapa
          style = {[
            {backgroundColor: '#FFFFFF', width: '100%', height: 72, 
            marginBottom: height*0.912, opacity: AnimatedHeader, alignItems: 'center' },
            { transform: [
              {
                translateY: AnimatedHeader.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                })
              },
              { translateX: this.state.offsetHeader.x },
            ]}
        ]}>
          <View 
            style = {{
              flexDirection: 'row', 
              alignItems: 'center', 
              width: '55%', 
              justifyContent: 'space-between'
          }}>
            <Icon name = {'keyboard-arrow-left'} color = {'#4C773C'} size = {50} style = {{marginTop: 10}}
            onPress = {() => {this.props.navigation.goBack()}}/>
            <Text
              style = {{
                marginTop: 6,
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: 16,
                textAlign: 'center',
                color: '#4C773C'
            }}>Mapa</Text>
          </View>
        </TopMapa>}
        <ContainerScroll
          style = {{
            width: '100%',
            maxHeight: AnimatedScroll,
            transform: [
              {
                translateY: AnimatedScroll.interpolate({
                  inputRange: [0, this.ScrollViewHeight],
                  outputRange: [0, 1],
                })
              }
            ]
        }}>
        <TabScroll ref = {(ref) => this.ScrollView = ref}
          style = {{
            width: '100%',
            height: AnimatedScroll,
          }}
          horizontal showsHorizontalScrollIndicator = {false} pagingEnabled
          onMomentumScrollEnd = { async (e) => {
            const lote = ( e.nativeEvent.contentOffset.x > 0 )
              ?  Math.round((e.nativeEvent.contentOffset.x + Dimensions.get('window').width) / Dimensions.get('window').width)
              : 1;
            const { latitude, longitude } = this.state.polygons[lote].centro;
            this.mapView.animateCamera({
              center: {
                latitude: latitude, 
                longitude: longitude
              }, 
              pitch: 0,
              heading: 0, 
              altitude: 200
            }, 500)
            this.state.polygons[0].centro = this.state.polygons[lote].centro;
        }}>
          {this.state.polygons.map(lotes => lotes.indice != -1 && lotes.centro != "" && lotes.centro != null && lotes.coordinates != "" && lotes.coordinates != null && (
            <DescriptionUnidade key = {lotes.indice} style={{ width: width - 40}}>
              <HeaderMapa 
                onLayout = {async (event) => {
                  if((this.HeaderHeight < event.nativeEvent.layout.height)) {
                    this.HeaderHeight = event.nativeEvent.layout.height
                    this.ScrollViewHeight = ((this.FlatListHeight + this.HeaderHeight + 30) < 400 ? (this.FlatListHeight + this.HeaderHeight + 30) : 400)
                    Animacoes.onScroll(this.state,this.ScrollViewHeight, 1000)
              }}}>
                <Animated.Text
                  style = {[
                    {transform: [
                      {translateX: this.state.offsetButtom.x}
                    ]},
                    {
                      opacity: 1, 
                      marginLeft: 16,
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      fontSize: 16,
                      color: '#262825' 
                    },
                ]}>{lotes.subLocal['descricao']}</Animated.Text>
              </HeaderMapa>
              <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style = {{height: this.FlatListHeight, maxHeight: 200}} showsVerticalScrollIndicator = {false} onLayout = {async (event) => {
                  if((this.FlatListHeight < event.nativeEvent.layout.height)) {
                    this.FlatListHeight = event.nativeEvent.layout.height
                    this.ScrollViewHeight = ((this.FlatListHeight + this.HeaderHeight + 30) < 400 ? (this.FlatListHeight + this.HeaderHeight + 30) : 400)
                    Animacoes.onScroll(this.state,this.ScrollViewHeight, 1000)
                }}}>
                  <Animated.FlatList
                    style = {[
                      {marginTop: 10, marginLeft: 16},
                      {transform: [
                        {translateY: this.state.offsetButtom.x}
                      ]},
                      {opacity: 1}
                    ]}
                    data = {lotes.observacoes} renderItem = {this.renderItem}
                    refreshing = {true}
                  />
                  <Animated.View
                    style = {[
                      { marginBottom: 10, marginLeft: 16},
                      {transform: [
                        {translateY: this.state.offsetButtom.x}
                      ]},
                      {opacity: this.state.opacity}
                  ]}>
                    <Text style = {{color: '#000000', fontSize: 12}}>Área: {lotes.area} m²</Text> 
                    <Text style = {{color: '#000000', fontSize: 12}}>Valor a vista: {formatoDeTexto.Moeda(parseInt(lotes.valorAVista * 100))}</Text>
                    <Text style = {{color: '#000000', fontSize: 12}}>Intermediação: {formatoDeTexto.Moeda(parseInt(lotes.intermediacao * 100))}</Text>                  
                  </Animated.View>
                </View>
                <ReservaouVender style = {{justifyContent: 'flex-end'}}>
                  <TabelaVendaView
                    style = {[
                      {opacity: 1, marginRight: 10},
                  ]}>
                    <TabelaButtom
                      style = {{
                        backgroundColor: '#FFFFFF',
                        width: this.state.indicatortabela == false ? 68 : 78,
                      }}
                      activeOpacity = {1}
                      onPress = { async () => {await this.props.navigation.navigate('TabelaDePrecos')}}>
                      <IndicatorView>
                        <ButtomText style = {{marginRight: 5, fontSize: 10, color: '#4C773C'}}>{"Tabela"}</ButtomText>
                        {this.state.indicatortabela == true &&
                          <Lottie resizeMode = 'cover' style = {{alignSelf: 'center', width: 20, height: 20}} autoSize autoPlay source = {Loader} loop/>}
                      </IndicatorView>
                    </TabelaButtom>
                  </TabelaVendaView>
                  <ReservaView
                    style = {[
                      { transform: [
                        { translateX: this.state.offsetButtom.x },
                        { scale: this.state.scaleOffset }
                      ]},
                      {opacity: 1},
                  ]}>
                    <ReservaButtom
                      style = {{
                        backgroundColor: lotes.status == 2 ? '#D45840' : '#4C773C',
                        width: this.props.tela == '@tela_reserva' ? 61 : 81
                      }}
                      activeOpacity = {1}
                      onPress = { async () => {this.setVisibilidadeModalReservaConfirmada(true)}}>
                    {this.props.tela == '@tela_reserva' &&
                    <ButtomText style = {{fontSize: 10}}>{lotes.status == 2 ? "Reservado": "Reservar"}</ButtomText>}
                    {this.props.tela == '@tela_vendadireta' && 
                    <ButtomText style = {{fontSize: 10}}>{lotes.status == 2 ? "Reservado": "Reservar"}</ButtomText>}
                    </ReservaButtom>
                  </ReservaView>
                </ReservaouVender>
              </View>
            </DescriptionUnidade>
          ))}
        </TabScroll>
        </ContainerScroll>
      </ContainerMapa>
    );
  }
  //#endregion

  //#region Controller

  //#region Setando a visibilidade da modal do mapa
  setVisibilidadeModalMapa(value) {
    this.setState({VisibilidadeModalMapa: value})
  }
  //#endregion

  //#region Setando a visiblidade da modal de reserva confirmada
  setVisibilidadeModalReservaConfirmada(value) {
    this.setState({VisibilidadeModalReservaConfirmada: value})
  }
  //#endregion

  //#region Animação de spring no botão
  animacaoDeSpringNoBotao() {
    Animated.parallel([
      Animated.sequence([
      Animated.delay(1000),
      Animated.parallel([
        Animated.spring(this.state.offsetButtom.x,{
          toValue: 0,
          speed: 1,
          bounciness: 20,
          useNativeDriver: true
        }),
        Animated.spring(this.state.offsetButtom.y,{
          toValue: 0,
          speed: 1,
          bounciness: 20,
          useNativeDriver: true
        }),
      ]),
      ]),
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 1750,
        useNativeDriver: true
      })
    ]).start()
  }
  //#endregion

  //#region Renderizando observações dos lotes
  renderItem = ({ item }) => (
    <>
      <RenderText
        style = {{
          borderLeftWidth: 1,
          borderLeftColor: '#9F9F9F',
          paddingLeft: 10,
          color: '#9F9F9F'
        }}
      >{item}</RenderText>
    </>   
  )
  //#endregion

  //#region Status da unidade
  statusDaUnidade(status)
  {
    switch(status)
      {
        case 0:
          return '#3FBF7F';
          break;
        case 6:
          return '#0480B9';
          break;
        case 2:
          return '#BF3F3F';
          break;
      }
  }
  //#endregion

  //#region Pegando lista de lotes no banco de dados
  pegandoListaDeUnidades = async () => {
    const response = await Identificador.consulta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    if(response != null && response != undefined) 
    {
      await this.setState({polygons: response})
      Animacoes.onMapa(this.state, 1, 1000);
      Animated.parallel([
        Animated.spring(this.state.offsetHeader.x,{
          toValue: 0,
          speed: 1,
          bounciness: 20,
          useNativeDriver: true
        }),
        Animated.timing(this.state.AnimatedHeader,{
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        }),
      ]).start();
      this.animacaoDeSpringNoBotao();
      await this.setVisibilidadeModalMapa(false)
    }
    else 
    { 
      await this.setVisibilidadeModalMapa(false)
      this.props.navigation.goBack()
    }
  }
  //#endregion

  //#endregion
}

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  tela: String(state.telaAtual),
  empresa: state.dadosEmpreendimento.filter(emp => emp.empresa),
  centrodecusto: state.dadosEmpreendimento.filter(emp => emp.centrodecusto),
  Prospect: state.dadosLead,
  LotesReservados: state.dadosLotes,
  StyleGlobal: state.StyleGlobal
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({...LotesActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ReservaMapa);