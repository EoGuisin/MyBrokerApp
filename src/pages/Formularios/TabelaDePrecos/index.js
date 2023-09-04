//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Modal, Linking, Platform, KeyboardAvoidingView, FlatList, Animated } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import PushNotification from 'react-native-push-notification';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
import RnBgTask from 'react-native-bg-thread';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
//#endregion

//#region Chaves de filtragem
const KEYS_TO_FILTERS_LOTES = ['subLocal.descricao']
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Identificador, TabelaDeVendas, Mensagem } from "../../../services";
//#endregion

//#region Redux
import { DadosLeadActions, TelaAtualActions, DadosIntermediacaoActions, DadosCorretagemActions, DadosFinanciamentoActions, LotesActions, TabelaDeVendasActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
//#endregion

//#region Componentes
import { Container } from '../../../components';
import { ModalLoadingGoBack, ModalSucesso, ModalFalha, ModalListaLotes, ModalLoading, ModalReservaConfirmada } from '../../Modais';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
//#endregion

//#endregion

class TabelaDePrecos extends Component {
  _isMounted = false;
  //#region Funcoes do componente
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

    if(this.props.Prospect != "")
    {
      this.state.IdProspect = this.props.Prospect[0].id
      this.state.IdEmpresa = this.props.empresa[0].empresa
      this.state.IdCentroDeCusto = this.props.centrodecusto[0].centrodecusto
      this._isMounted = true;
      const { navigation } = this.props;
      this.focusListener = navigation.addListener('didFocus', async () => {
        if(this.state.ListaUnidades != "")
        {
          await this.setVisibilidadeModalLoadingGoBack(true)
          await this.pegandoListaDeUnidades();
        }
      });
      if (this.state.ListaUnidades == "")
      {
        await this.setVisibilidadeModalLoadingGoBack(true)
        await this.pegandoListaDeUnidades();
      }
    }
    else
    {
      this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Component Unmount
  componentWillUnmount() {
    this._isMounted = false;
  }
  //#endregion

  //#region Model
  state = {
    DadosParcelamento: [
      {
        'id': 0,
        'numparcelas': 180,
        'valorparcela': 'R$ 637,96',
        'total': 'R$ 114.832,04'
      },
      {
        'id': 1,
        'numparcelas': 120,
        'valorparcela': 'R$ 839,31',
        'total': 'R$ 100.717,80'
      },
      {
        'id': 2,
        'numparcelas': 60,
        'valorparcela': 'R$ 1.461,56',
        'total': 'R$ 87.693,59'
      },
      {
        'id': 3,
        'numparcelas': 36,
        'valorparcela': 'R$ 2.299,90',
        'total': 'R$ 82.796,34'
      },
      {
        'id': 4,
        'numparcelas': 24,
        'valorparcela': 'R$ 3.350,64',
        'total': 'R$ 80.415,32'
      },
      {
        'id': 5,
        'numparcelas': 12,
        'valorparcela': 'R$ 6.300,00',
        'total': 'R$ 75.600,00'
      },      
    ],
    VisibilidadeModalListaLotes: false,
    VisibilidadeModalLoading: false,
    VisibilidadeModalLoadingGoBack: false,
    VisiblidadeModalReservaConfirmada: false,
    VisibilidadeModalFiltros: false,
    VisibilidadeModalFiltrosGAVResorts: false,
    FiltrosAplicaveis: [],
    FiltroEmpreendimento: '',
    CampoFiltrado: '',
    ListaUnidades: [],
    ListaOriginal: [],
    ListaExibida: [],
    ListaFiltrada: [],
    DadosRecebidos: [],
    NomeDaUnidade: null,
    IdProspect: null,
    IdEmpresa: null,
    IdCentroDeCusto: null,
    Token: null,
    Local: null,
    SubLocal: null,
    quantItem: 20,
    distanceEnd: null,
    distanceEndInitial: null,
    loadMore: false,
    TermUnidades: '',
    searchTermUnidades: '',
    optionObrigado: '',
    identificador: [],
    dadosLote: [],
    numeroDaTabelaDeVenda: null,
    tabelaDeVendas: [],
    tabelaCorretagem: [],
    tabelaIntermediacao: [],
    tabelaFinanciamento: [],
    tabelaFinanciamenteOriginal: [],
    tabelaEntradas: [],
    tabelaIntermediarias: [],
    tabelaCompleta: [],
    tabelaCorretagemExiste: false,
    tabelaIntermediacaoExiste: false,
    tabelaFinaciamentoExiste: false,
    tabelaIntermediariasExiste: false,
    tabelaEntradasExiste: false,
    juros: null,
    primeiroVencimentoFinanciamento: null,
    DadosFinanciamento: [],
    valorCorretagem: null,
    valorImobiliaria: null,
    valorFinancimento: null,
    valorParcelaDoFinancimento: null,
    valorDasIntermediarias: null,
    valorDasEntradas: null,
    IdCorretagem: null,
    IdIntermediacao: null,
    IdFinanciamento: null,
    IdIntermediarias: null,
    IdEntradas: null,
    primeiroVencimentoParcela: null,
    numeroDaTabelaDeVenda: null,
    formaPagamento: [],
    calendarioMeses: [],
    simulacaoCorretagem: [],
    simulacaoIntermediacao: [],
    Lote: [],
    isLoadingFooter: false,
    value: true,
    ID: "",
    scrollFlatY: new Animated.Value(0),
  };
  //#endregion

  //#region View
  render() {

    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
        <Modal // Lista de lotes
          animationType = 'slide'
          transparent = {false}
          visible = {this.state.VisibilidadeModalListaLotes}
          onShow = {async () => {}}>
          <View
            style = {{
              flex: 1,
              backgroundColor: "#F6F8F5"
          }}>
            <View 
              style = {{
                backgroundColor: this.props.StyleGlobal.cores.background, 
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
                <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40}
                  onPress = {() => {
                    this.setVisibilidadeModalListaLotes(false)
                    this.props.navigation.goBack()
                }}/>
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
                  onChangeText = {(term) => {this.searchUpdateUnidades(term)}}
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
                    onPress = {async () => {await this.setState({VisibilidadeModalFiltros: true})}}>
                    <Icon name = 'list' size = {25} color = {'#FFFFFF'} style = {{marginRight: 5, marginLeft: 5}}/>
                    <Text style = {{color: '#FFFFFF', fontSize: 15, fontWeight: "bold"}}>Filtros aplicáveis</Text>
                  </TouchableOpacity>}
                {this.props.EmpresaLogada[0] == 4 &&
                  <TouchableOpacity activeOpacity = {1} style = {{flexDirection: 'row', alignItems: 'center', marginRight: 8, width: 150, borderRadius: 5}}
                    onPress = {async () => {await this.setState({VisibilidadeModalFiltrosGAVResorts: true})}}>
                    <Icon name = 'list' size = {25} color = {'#FFFFFF'} style = {{marginRight: 5, marginLeft: 5}}/>
                    <Text style = {{color: '#FFFFFF', fontSize: 15, fontWeight: "bold"}}>Filtros aplicáveis</Text>
                  </TouchableOpacity>}
              </View>
            </View>
            <Animated.FlatList
              contentContainerStyle = {{
                marginTop: 8,
                width: Dimensions.get('window').width, 
                paddingHorizontal: 10 
              }}
              showsVerticalScrollIndicator = {false}
              onScroll = {Animated.event(
                [{nativeEvent: {contentOffset: {y: this.state.scrollFlatY}}}],
                {useNativeDriver: true}
              )}
              ref = {(ref) => { this.FlatList = ref }}
              data = {this.state.ListaExibida}
              keyExtractor = {item => String(item.indice)}
              renderItem = {({ item, index }) => { 
                
                const inputRange = [
                  -1,
                  0,
                  (120 * index),
                  (120 * (index + 2))
                ]
    
                const scale = this.state.scrollFlatY.interpolate({
                  inputRange,
                  outputRange: [1, 1, 1, 0]
                })
    
                const opacityInputRange = [
                  -1,
                  0,
                  (120 * index),
                  (120 * (index + 1))
                ]
    
                const opacity = this.state.scrollFlatY.interpolate({
                  inputRange: opacityInputRange,
                  outputRange: [1, 1, 1, 0]
                })

                return (
                  <>
                    <Animated.View
                      style = {[{
                        backgroundColor: item.status == 2 ? '#CCCCCC50' : '#FFFFFF',
                        paddingHorizontal: 16,
                        width: '100%',
                        height: 100,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: 'rgba(16, 22, 26, 0.15)',
                        marginVertical: 5,
                        justifyContent: "center",
                        opacity
                    }, {transform: [{scale}]}
                    ]}>
                      <TouchableOpacity activeOpacity = {1}
                        onPress = {async () => {}}>
                        <View
                          style ={{
                            width: '100%',
                        }}>
                          <View
                            style = {{
                              width: '100%', 
                              flexDirection: 'column', 
                              alignItems: 'flex-start',
                          }}>
                            <Text
                              style = {{
                                fontSize: 12,
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                color: '#262825',
                                flexWrap: 'wrap'
                            }}>{(item.subLocal['descricao'] != "" || item.subLocal['descricao'] != null) ? item.subLocal['descricao'] : ""}</Text>
                          </View>
                          <View
                            style = {{
                              width: '100%',
                              flexDirection: 'row',
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              marginTop: 5,
                          }}>
                            <View style = {{marginRight: 30}}>
                              {item.area != '' && item.area != null &&
                              <Text
                                style = {{
                                  fontSize: 10,
                                  fontStyle: 'normal',
                                  fontWeight: 'normal',
                                  color: '#8F998F',
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Área: {(item.area != "" && item.area != null) ? item.area : ""} m²</Text>}
                              {item.valorAVista != '' && item.valorAVista != null &&
                              <Text
                                style = {{
                                  fontSize: 10,
                                  fontStyle: 'normal',
                                  fontWeight: 'normal',
                                  color: '#8F998F',
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor a vista: {(item.valorAVista != "" && item.valorAVista != null) ? formatoDeTexto.FormatarTexto((item.valorAVista)) : ""}</Text>}
                              {item.intermediacao != '' && item.intermediacao != null &&
                              <Text
                                style = {{
                                  fontSize: 10,
                                  fontStyle: 'normal',
                                  fontWeight: 'normal',
                                  color: '#8F998F',
                                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Intermediação: {(item.intermediacao != "" && item.intermediacao != null) ? formatoDeTexto.FormatarTexto((item.intermediacao)) : ""}</Text>}
                            </View>
                            <View 
                              style = {{
                                flexDirection: 'row',
                                justifyContent: 'flex-end', 
                                alignItems: 'center',
                                paddingRight: 10
                              }}>
                              {item.status == 0 &&
                              <TouchableOpacity
                                style = {{
                                  paddingVertical: 6,
                                  paddingHorizontal: 10,
                                  marginRight: 10, 
                                  backgroundColor: '#FFFFFF',
                                  flexDirection: 'row',
                                  borderWidth: 1,
                                  borderColor: this.props.StyleGlobal.cores.botao,
                                  borderRadius: 5,
                              }}
                                onPress = {async () => {this.reservandoListaLote(item)}}>
                                <Text
                                  style = {{
                                    fontSize: 12,
                                    color: this.props.StyleGlobal.cores.botao,
                                    fontStyle: 'normal',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    alignSelf: 'center',
                                    marginVertical: 4,
                                    marginHorizontal: 0
                              }}>Reservar</Text>
                              </TouchableOpacity>}
                              <TouchableOpacity
                                disabled = {false}
                                activeOpacity = {1}
                                style = {{
                                  paddingVertical: 6,
                                  paddingHorizontal: 10, 
                                  backgroundColor: this.props.StyleGlobal.cores.botao,
                                  flexDirection: 'row',
                                  borderWidth: 1,
                                  borderRadius: 5,
                                  borderColor: this.props.StyleGlobal.cores.botao
                                }}
                                onPress = {async () => {
                                  this.state.NomeDaUnidade = item.subLocal['descricao']
                                  this.state.Local = item.local['id']
                                  this.state.SubLocal = item.subLocal['id']
                                  await this.setVisibilidadeModalListaLotes(false)
                                  await this.setVisibilidadeModalLoading(true)
                                  await this.pegandoTabelaDePrecos();
                              }}>
                                <Text
                                  style = {{
                                    fontSize: 12, 
                                    color: '#FFFFFF',
                                    fontStyle: 'normal',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    alignSelf: 'center',
                                    marginVertical: 4,
                                    marginHorizontal: 0
                              }}>Tabela</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  </>
                )

              }}
              onEndReached = {async () => {
                this.setState({loadMore: true})
                const quantAnterior = this.state.quantItem;
                const ListaAdd = [];
                this.state.quantItem = (this.state.quantItem + 20);
                if ((this.state.ListaFiltrada.length > this.state.quantItem)) {
                  try {
                    for (var i = (quantAnterior); i <= (this.state.quantItem - 1); i++) {
                      ListaAdd.push(this.state.ListaFiltrada[i])
                    }
                    this.state.ListaExibida = this.state.ListaExibida.concat(ListaAdd)
                    await this.setState({loadMore: false})
                  } catch {}
                } else if (this.state.ListaFiltrada.length < this.state.quantItem) {
                  try {
                    for (var i = (quantAnterior); i <= (this.state.ListaFiltrada.length - 1); i++) {
                      ListaAdd.push(this.state.ListaFiltrada[i])
                    }
                    this.state.quantItem = this.state.ListaFiltrada.length;
                    this.state.ListaExibida = this.state.ListaExibida.concat(ListaAdd)
                    await this.setState({loadMore: false})
                  } catch {await this.setState({isLoadingFooter: true})}
                }
              }}
              onEndReachedThreshold = {0.1}
              refreshing = {true}
            />
          </View>
          <Modal // Filtros Gav Resorts
            animationType = 'slide'
            visible = {this.state.VisibilidadeModalFiltrosGAVResorts}
            transparent = {false}>
            <KeyboardAvoidingView
              style = {{flex: 1}} behavior = {Platform.OS === "ios" ? "padding" : "height"}>
              <View
                style = {{
                  backgroundColor: this.props.StyleGlobal.cores.background, 
                  height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
                  marginBottom: 10,
                  justifyContent: "center"
              }}>
                <View 
                  style = {{
                    flexDirection: 'row', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10
                }}>
                  <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40} style = {{ }}
                    onPress = {() => {this.setState({VisibilidadeModalFiltrosGAVResorts: false})}}/>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 14,
                      textAlign: 'center',
                      color: '#FFFFFF'
                  }}>Filtros aplicáveis</Text>              
                  <View style = {{width: 40}}></View>
                </View>
              </View>
              <ScrollView
                ref = { (ref) => this.ScrollViewFiltroGAV = ref } showsVerticalScrollIndicator = {false}
                scrollEventThrottle = {16}
              >
                  <View
                    style = {{
                      minHeight: Dimensions.get('window').height - 190, 
                      borderTopWidth: 0, marginBottom: 20, marginHorizontal: 10,
                      justifyContent: "center"
                  }}>
                    {this.state.FiltrosAplicaveis.map((filtros, index) => filtros.nome != "Unidade" && (
                    <View key = {String(index)}>
                      {filtros.tipo.id == 4 &&
                        <View key = {String(index)}>
                          <Text
                            style = {{
                              fontStyle: 'normal',
                              fontWeight: 'bold',
                              fontSize: 13,
                              color: '#677367',
                              paddingBottom: 10,
                              backgroundColor: "#FFFFFF"
                          }}>{filtros.nome === "UnidadeDisponivel" ? "Unidade" : filtros.nome}</Text>
                          <View 
                            style={{
                              flex: 1,
                              backgroundColor: '#FFFFFF',
                              paddingVertical: 8,
                              paddingHorizontal: 3,
                              marginBottom: 5,
                              borderRadius: 10
                          }}> 
                            <View style = {{marginBottom: filtros.selectedItems.length == 0 ? 0 : 10, flexDirection: "row", width: "100%", flexWrap: "wrap"}}>
                              {(filtros.selectedItems).map((Item, index) => (
                                  <View
                                    style = {{
                                      backgroundColor: this.props.StyleGlobal.cores.background,
                                      paddingHorizontal: 8,
                                      paddingVertical: 12,
                                      borderRadius: 5,
                                      alignItems: 'center',
                                      flexDirection: "row",
                                      maxWidth: "50%",
                                      marginVertical: 3,
                                      marginLeft: 5,
                                      justifyContent: "space-between"
                                  }}>
                                    <Text 
                                      style = {{
                                        fontSize: 12, 
                                        color: "#FFFFFF",
                                        fontWeight: "bold",
                                        maxWidth: "90%"
                                    }} numberOfLines = {1} ellipsizeMode = {"tail"}>{Item}</Text>
                                    <Icon name = "close" color = "#FFFFFF" size = {20} 
                                      onPress = {async () => {
                                        filtros.selectedItems =  await (filtros.selectedItems).filter((item) => item != Item)
                                        await this.setState({Renderizar: true})
                                    }}/>
                                </View>
                              ))}
                            </View>
                            <MultiSelect
                              styleSelectorContainer = {{maxHeight: 300, flex: 1}}
                              hideTags
                              searchIcon = {<Icon name = 'search' size = {20} color = {this.props.StyleGlobal.cores.background}/>}
                              items = {filtros.regraGeral.opcoes}
                              uniqueKey = "descricao"
                              filterMethod = {"full"}
                              onSelectedItemsChange = { selectedItems => {
                                filtros.selectedItems = selectedItems
                                this.setState({Renderizar: true})
                              }}
                              selectedItems = {filtros.selectedItems}
                              selectText = { filtros.selectedItems.length == 0 ? "Selecione a empresa" : "Items selecionados"}
                              searchInputPlaceholderText = "Procurando Itens..."
                              styleItemsContainer = {{marginVertical: 10 }}
                              onChangeInput = { (text) => {}}
                              tagRemoveIconColor = {this.props.StyleGlobal.cores.background}
                              tagBorderColor = {this.props.StyleGlobal.cores.background}
                              tagTextColor = {this.props.StyleGlobal.cores.background}
                              selectedItemTextColor=  "#CCCCCC"
                              selectedItemIconColor = "#CCCCCC"
                              itemTextColor = {this.props.StyleGlobal.cores.background}
                              displayKey = "descricao"
                              searchInputStyle = {{ color: this.props.StyleGlobal.cores.background }}
                              submitButtonColor = {this.props.StyleGlobal.cores.background}
                              submitButtonText = "Selecionar"
                            />
                          </View>
                        </View>
                      }
                    </View>
                    ))}
                  </View>
              </ScrollView>
            </KeyboardAvoidingView> 
            <View
              style = {{ marginHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                style = {{
                  width: '100%', 
                  backgroundColor: this.props.StyleGlobal.cores.background,
                  paddingVertical: 16,
                  paddingHorizontal: 0,
                  height: 58,
                  alignItems: 'center',
                  justifyContent: "center",
                  marginBottom: 23,
                  borderRadius: 5
              }}
              onPress = { async() => {

                let FiltroIdentificador = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "UnidadeDisponivel")[0].selectedItems ?? []
                let FiltroPavimento = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "Pavimento")[0].selectedItems ?? []
                let FiltroQuantidadeDeQuartos = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "Quantidade de quartos")[0].selectedItems ?? []
                let FiltroDescricao = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "Descrição")[0].selectedItems ?? []

                let UnidadesFiltradas = this.state.ListaOriginal.filter((Item) => ((FiltroIdentificador.length == 0 || FiltroIdentificador.filter((_item) => _item === Item.subLocal.descricao).length > 0) 
                && (FiltroQuantidadeDeQuartos.length == 0 || FiltroQuantidadeDeQuartos.filter((_item) => Item.observacoes.includes(("Qtde. de quartos: ").concat(_item))).length > 0)
                && (FiltroPavimento.length == 0 || FiltroPavimento.filter((_item) => Item.observacoes.includes(("Pavimento: ").concat(_item))).length > 0)
                && (FiltroDescricao.length == 0 || FiltroDescricao.filter((_item) => Item.observacoes.includes(("Descrição: ").concat(_item))).length > 0)))

                this.state.ListaFiltrada = UnidadesFiltradas
                this.state.ListaExibida = [];

                if (UnidadesFiltradas.length >= 20)
                {
                  this.state.ListaExibida = UnidadesFiltradas.slice(0, 20)
                }
                else
                {
                  this.state.ListaExibida = UnidadesFiltradas.slice(0, UnidadesFiltradas.length)
                }
                await this.setState({VisibilidadeModalFiltrosGAVResorts: false})
              }}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    alignSelf: 'center'
                }}>Filtrar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal // Filtros Silva Branco
            animationType = 'slide'
            visible = {this.state.VisibilidadeModalFiltros}
            transparent = {false}>
            <KeyboardAvoidingView
              style = {{flex: 1}} behavior = {Platform.OS === "ios" ? "padding" : "height"}>
              <View
                style = {{
                  backgroundColor: this.props.StyleGlobal.cores.background, 
                  height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
                  marginBottom: 10,
                  justifyContent: "center"
              }}>
                <View 
                  style = {{
                    flexDirection: 'row', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10
                }}>
                  <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40} style = {{}}
                    onPress = {() => {this.setState({VisibilidadeModalFiltros: false})}}/>
                  <Text
                    style = {{
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      fontSize: 14,
                      textAlign: 'center',
                      color: '#FFFFFF'
                  }}>Filtros aplicáveis</Text>              
                  <View style = {{width: 40}}></View>
                </View>
              </View>
              <ScrollView
                ref = { (ref) => this.ScrollViewFiltroGAV = ref } showsVerticalScrollIndicator = {false}
                scrollEventThrottle = {16}
              >
                  <View
                    style = {{
                      minHeight: Dimensions.get('window').height - 190, 
                      borderTopWidth: 0, marginBottom: 20, marginHorizontal: 10,
                      justifyContent: "center"
                  }}>
                    {this.state.FiltrosAplicaveis.map((filtros, index) => filtros.nome != "Unidade" && (
                    <View key = {String(index)}>
                      {filtros.tipo.id == 4 &&
                        <View key = {String(index)}>
                          <Text
                            style = {{
                              fontStyle: 'normal',
                              fontWeight: 'bold',
                              fontSize: 13,
                              color: '#677367',
                              paddingBottom: 10,
                              backgroundColor: "#FFFFFF"
                          }}>{filtros.nome === "UnidadeDisponivel" ? "Unidade" : filtros.nome}</Text>
                          <View 
                            style={{
                              flex: 1,
                              backgroundColor: '#FFFFFF',
                              paddingVertical: 8,
                              paddingHorizontal: 3,
                              marginBottom: 5,
                              borderRadius: 10
                          }}> 
                            <View style = {{marginBottom: filtros.selectedItems.length == 0 ? 0 : 10, flexDirection: "row", width: "100%", flexWrap: "wrap"}}>
                              {(filtros.selectedItems).map((Item, index) => (
                                  <View
                                    style = {{
                                      backgroundColor: this.props.StyleGlobal.cores.background,
                                      paddingHorizontal: 8,
                                      paddingVertical: 12,
                                      borderRadius: 5,
                                      alignItems: 'center',
                                      flexDirection: "row",
                                      maxWidth: "50%",
                                      marginVertical: 3,
                                      marginLeft: 5,
                                      justifyContent: "space-between"
                                  }}>
                                    <Text 
                                      style = {{
                                        fontSize: 12, 
                                        color: "#FFFFFF",
                                        fontWeight: "bold",
                                        maxWidth: "90%"
                                    }} numberOfLines = {1} ellipsizeMode = {"tail"}>{Item}</Text>
                                    <Icon 
                                      name = "close" 
                                      color = "#FFFFFF" 
                                      size = {20} 
                                      onPress = { async () => {
                                        filtros.selectedItems =  await (filtros.selectedItems).filter((item) => item != Item)
                                        await this.setState({Renderizar: true})
                                    }}/>
                                </View>
                              ))}
                            </View>
                            <MultiSelect
                              styleSelectorContainer = {{maxHeight: 300, flex: 1}}
                              hideTags
                              searchIcon = {<Icon name = 'search' size = {20} color = {this.props.StyleGlobal.cores.background}/>}
                              items = {filtros.regraGeral.opcoes}
                              uniqueKey = "descricao"
                              filterMethod = {"full"}
                              onSelectedItemsChange = { selectedItems => {
                                filtros.selectedItems = selectedItems
                                this.setState({Renderizar: true})
                              }}
                              selectedItems = {filtros.selectedItems}
                              selectText = { filtros.selectedItems.length == 0 ? "Selecione a empresa" : "Items selecionados"}
                              searchInputPlaceholderText = "Procurando Itens..."
                              styleItemsContainer = {{marginVertical: 10 }}
                              onChangeInput = { (text) => {}}
                              tagRemoveIconColor = {this.props.StyleGlobal.cores.background}
                              tagBorderColor = {this.props.StyleGlobal.cores.background}
                              tagTextColor = {this.props.StyleGlobal.cores.background}
                              selectedItemTextColor=  "#CCCCCC"
                              selectedItemIconColor = "#CCCCCC"
                              itemTextColor = {this.props.StyleGlobal.cores.background}
                              displayKey = "descricao"
                              searchInputStyle = {{ color: this.props.StyleGlobal.cores.background }}
                              submitButtonColor = {this.props.StyleGlobal.cores.background}
                              submitButtonText = "Selecionar"
                            />
                          </View>
                        </View>
                      }
                    </View>
                    ))}
                  </View>
              </ScrollView>
            </KeyboardAvoidingView> 
            <View
              style = {{ marginHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                style = {{
                  width: '100%', 
                  backgroundColor: this.props.StyleGlobal.cores.background,
                  paddingVertical: 16,
                  paddingHorizontal: 0,
                  height: 58,
                  alignItems: 'center',
                  justifyContent: "center",
                  marginBottom: 23,
                  borderRadius: 5
              }}
              onPress = { async() => {

                let FiltroIdentificador = await this.state.FiltrosAplicaveis.filter((filtros) => filtros.nome == "Empreendimento")[0].selectedItems ?? []

                let UnidadesFiltradas = this.state.ListaOriginal.filter((Item) => ((FiltroIdentificador.length == 0 || FiltroIdentificador.filter((_item) => Item.subLocal.descricao.includes((_item))).length > 0)))

                this.state.ListaFiltrada = UnidadesFiltradas
                this.state.ListaExibida = [];

                if (UnidadesFiltradas.length >= 20)
                {
                  this.state.ListaExibida = UnidadesFiltradas.slice(0, 20)
                }
                else
                {
                  this.state.ListaExibida = UnidadesFiltradas.slice(0, UnidadesFiltradas.length)
                }
                await this.setState({VisibilidadeModalFiltros: false})

              }}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    alignSelf: 'center'
                }}>Filtrar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Modal>
        <ModalReservaConfirmada 
          visibilidade = {this.state.VisiblidadeModalReservaConfirmada}
          onPressIcon = {async () => {
            await this.setVisibilidadeModalReservaConfirmada(false)
            await this.setVisibilidadeModalLoading(true)
            await this.pegandoListaDeUnidades()
          }}
          onPressReservarNovoLote = {async () => {
            this.state.VisiblidadeModalReservaConfirmada = false
            await this.setVisibilidadeModalLoading(true)
            await this.pegandoListaDeUnidades()
          }}
          onPressObrigado = {async () => {
            if(this.state.optionObrigado == "@proposta")
            {
              const navegar = await this.props.navigation.getParam('TabelaDePrecos', 'null')
              if(navegar != null && navegar != 'null')
              {
                if(this.state.tabelaCorretagemExiste == true)
                {
                  await this.setVisibilidadeModalReservaConfirmada(false)
                  return await navegar.onIntermediacao()
                }
                else
                {
                  await this.setVisibilidadeModalReservaConfirmada(false)
                  return await navegar.onConfirm()
                }
              }
            }
            else if (this.state.optionObrigado == '@reserva')
            {
              await this.setVisibilidadeModalReservaConfirmada(false)
              await this.props.navigation.navigate('Menu')
            }
          }}/>
        <ModalLoading visibilidade = {this.state.VisibilidadeModalLoading} 
          onPress = {async () => {
            await Identificador.cancelRequest(true)
            await this.setVisibilidadeModalLoading(false)
          }}/>
        <ModalLoadingGoBack visibilidade = {this.state.VisibilidadeModalLoadingGoBack}
          onPress = {async () => {
            await Identificador.cancelRequest(true)
            await this.setVisibilidadeModalLoadingGoBack(false)
            await this.props.navigation.goBack()
        }}/>
        {this.state.VisibilidadeModalLoading == false && this.state.VisibilidadeModalLoadingGoBack == false && this.state.VisiblidadeModalReservaConfirmada == false && this.state.VisibilidadeModalListaLotes == false && <>
          <ScrollView  ref = {(ref) => this.ScrollViewTabelaPrecos = ref} showsVertiscalScrollIndicator = {false}
          >
            <View 
              style = {{
                minHeight: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 245) : (Dimensions.get('window').height - 195),
            }}>
              <View 
                style = {{
                  height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 82 : 52, 
                  backgroundColor: '#FFFFFF',
                  justifyContent: "center"
              }}>
                <View
                  style = {{
                    flexDirection: 'row', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                  <Icon name = {'keyboard-arrow-left'} color = {this.props.StyleGlobal.cores.background} size = {30} style = {{marginTop: 10}}
                    onPress = { () => { this.setVisibilidadeModalListaLotes(true) }}/>
                  <Text
                    style = {{
                      marginTop: 6,
                      fontStyle: 'normal',
                      fontWeight: '500',
                      fontSize: 12,
                      textAlign: 'center',
                      color: this.props.StyleGlobal.cores.background
                  }}>Tabela de Preços</Text>
                  <View style = {{width: 30}}></View>
                </View>
              </View>
              <View style = {{ paddingHorizontal: 24, marginBottom: 15 }}>
                <View // nome da unidade e area
                  style = {{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <View style = {{flex: 1, marginRight: 20}}>
                    <Text style = {{color: this.props.StyleGlobal.cores.background, fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, fontWeight: 'bold', fontStyle: 'normal'}}>{'Selecione a unidade'}</Text>
                    <TouchableOpacity style = {{marginTop: 8, marginLeft: 5, paddingVertical: 2, justifyContent: 'center', borderWidth: 1, borderColor: '#cdcdcd'}}
                      onPress = {() => {this.setVisibilidadeModalListaLotes(true)}}>
                      <Text style = {{marginLeft: 5, fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, fontStyle: 'normal', fontWeight: 'normal', flexWrap: 'wrap'}}>{this.state.NomeDaUnidade}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style = {{ marginTop: 5}}>
                    <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 15, paddingHorizontal: 20, backgroundColor: this.props.StyleGlobal.cores.background, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                      <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: 10}}>{'Área (m²)'}</Text>
                    </View>
                    <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#dadce8', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                      <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{this.state.identificador != "" ? this.state.identificador.area : ""}</Text>
                    </View>
                  </View>
                </View>
                <View // Status e valor do lote
                  style = {{flexDirection: 'row', marginTop: 9}}>
                  <View>
                    <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 10, backgroundColor: this.props.StyleGlobal.cores.background, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                      <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{'Status da unidade:'}</Text>
                    </View>
                    <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#dadce8', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                      <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, fontWeight: 'bold'}}>{(this.state.identificador != "") ? (this.state.identificador.status == 0 ? 'Disponível' : 'Reservado') : ""}</Text>
                    </View>
                  </View>
                  <View style = {{flex: 1, marginLeft: 20}}>
                    <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 10, backgroundColor: this.props.StyleGlobal.cores.background, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                      <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{'Valor do lote à vista'}</Text>
                    </View>
                    <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#d9ebd5', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                      <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 12}}>{this.state.identificador != "" ? formatoDeTexto.Moeda(parseInt(this.state.identificador.valorAVista * 100)) : ""}</Text>
                    </View>
                  </View>
                </View>
                <View style = {{flexDirection: 'row', marginTop: 5}}>
                  {this.state.tabelaIntermediacaoExiste == true &&
                  <View // Comissão imobiliária
                    >
                    <Text style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5, fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, color: '#3c3d41'}}>{`Comissão${'\n'}imobiliária:`}</Text>
                    <View // total intermediação
                      style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5}}>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 5, backgroundColor: '#808080', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                        <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{'Total intermediação'}</Text>
                      </View>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                        <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{(this.state.tabelaCorretagem != "" && this.state.tabelaIntermediacao != "") ? formatoDeTexto.Moeda(parseInt(this.state.tabelaIntermediacao[this.state.tabelaIntermediacao.length - 1].valorTotal * 100) + parseInt(this.state.tabelaCorretagem[this.state.tabelaCorretagem.length - 1].valorTotal * 100)) : ""}</Text>
                      </View>
                    </View>
                    <View // corretor
                      style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5}}>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 5, backgroundColor: '#808080', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                        <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{'Corretor'}</Text>
                      </View>
                      {this.state.tabelaCorretagem.map(corretor => (
                        <View key = {corretor.qtdeDeTitulos} style = {{height: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                          <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{formatoDeTexto.Moeda(parseInt(corretor.principal * 100))}</Text>
                        </View>
                      ))}
                    </View>
                    <View // imobiliaria à vista
                      style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5}}>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 5, backgroundColor: '#808080', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                        <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{'Imobiliária à vista'}</Text>
                      </View>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                        <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{this.state.tabelaIntermediacao != "" ? formatoDeTexto.Moeda(parseInt(this.state.tabelaIntermediacao[parseInt(this.state.tabelaIntermediacao.length - 1)].valorTotal * 100)) : ""}</Text>
                      </View>
                    </View>
                    <View // imobiliaria em X vezes
                      style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5}}>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 5, backgroundColor: '#808080', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                        <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{this.state.tabelaIntermediacao != "" ? `ou imobiliária em ${this.state.tabelaIntermediacao.length}x` : ""}</Text>
                      </View>
                      <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                        <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{this.state.tabelaIntermediacao != "" ? formatoDeTexto.Moeda((parseInt(this.state.tabelaIntermediacao[parseInt(this.state.tabelaIntermediacao.length - 1)].principal * 100))) : ""}</Text>
                      </View>
                    </View>
                    <View // observacoes sobre a comissao
                      style = {{backgroundColor: '#f2f2f2', paddingVertical: 9, paddingLeft: 10}}>
                      <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 8 : 10, lineHeight: 14}}>{`* A comissão${'\n'}imobiliária não${'\n'}integra o valor do${'\n'}lote e será paga em${'\n'}contrato específico.`}</Text>
                    </View>
                    {this.props.EmpresaLogada[0] == 5 &&
                    <TouchableOpacity style = {{marginLeft: 8, marginTop: 8, backgroundColor: '#dbdee7', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 5, marginRight: 8, borderColor: '#85868a', borderWidth: 1}}
                      onPress = {() => {
                        this.openLinking('http://harmoniaurbanismo.ddns.net:2601/mapas/MapaVillaImperial.pdf')
                      }}>
                      <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 8 : 10, lineHeight: 14, textAlign: 'center'}}>Acessar o Mapa</Text>
                    </TouchableOpacity>}
                  </View>}
                  <View // Planos de parcelamento
                    style = {{flex: 1, marginLeft: this.state.tabelaIntermediacaoExiste == true ? 20 : 0}}>
                    <View // Comissão imobiliária
                      >
                      <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, color: '#3c3d41'}}>{`Planos de parcelamento`}</Text>
                      <Text style = {{marginBottom: Dimensions.get('window').height <= 650 ? 2 : 5, marginLeft: 4, fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 12, color: '#4d5256'}}>{`Taxa de juros: ${this.state.juros * 100}% a.m`}</Text>
                      {this.state.tabelaFinanciamento.map(parcelamento => (
                        <View // Parcelamento X vezes
                          key = {parcelamento.qtdeDeTitulos} style = {{flexDirection: 'row'}}>
                          <View // numero parcelas
                            style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5, marginRight: 10, width: '40%'}}>
                            <View style = {{ paddingHorizontal: 0, backgroundColor: this.props.StyleGlobal.cores.background, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                              <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, flexWrap: 'wrap', textAlign: 'center', paddingVertical: 3}}>{parcelamento.descricao}</Text>
                            </View>
                            <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#d9ebd5', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                              <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.Moeda(parseInt(parcelamento.principal * 100))}</Text>
                            </View>
                          </View>
                          <View // valor total parcelado
                            style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5, flex: 1, width: '60%'}}>
                            <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 0, backgroundColor: this.props.StyleGlobal.cores.background, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                              <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}} numberOfLines = {1} ellipsizeMode = {'tail'}>Total do lote em {parcelamento.qtdeDeTitulos}x</Text>
                            </View>
                            <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                              <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.Moeda(parseInt(parcelamento.valorTotal * 100))}</Text>
                            </View>
                          </View>
                        </View>
                      ))}
                      <Text style = {{fontSize: Dimensions.get('window').height <= 650 ? 8 : 10, marginTop: 5, textAlign: 'right'}}>Tabela de venda válida até {new Date().getMonth() < 9 ? (( new Date().getDate() <= 9 ? "0" + new Date().getDate() : new Date().getDate())+"/"+"0"+(new Date().getMonth() + 1) + "/" + new Date().getFullYear()) : (( new Date().getDate() <= 9 ? "0" + new Date().getDate() : new Date().getDate())+"/"+(new Date().getMonth() + 1) + "/" + new Date().getFullYear())}</Text>
                    </View>
                  </View>
                </View>
                <View style = {{marginTop: 2}}>
                  <Text style = {{fontSize: Dimensions.get('window').height <= 650 ? 8 : 10, textAlign: 'right'}}>{`* As parcelas mensais serão corrigidas a cada 12 meses pelo IGPM Todos os valores em reais`}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          <View // Botoes de reserva e proposta
            style = {{ paddingHorizontal: 24, flexDirection: 'row', marginBottom: Dimensions.get('window').height <= 650 ? 15 : 15, justifyContent: 'center'}}>
            {this.state.identificador.status == 0 &&
            <TouchableOpacity
              style = {{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: this.props.StyleGlobal.cores.botao,
                alignItems: 'center',
                justifyContent: 'center',
                padding: Dimensions.get('window').height <= 650 ? 5 : 10,
                width: '25%',
                borderRadius: 5
            }}
              onPress = {this.reservandoLote}>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: Dimensions.get('window').height <= 650 ? 10 : 12,
                  textAlign: 'center',
                  color: this.props.StyleGlobal.cores.botao,
                  alignSelf: 'center',
              }}>Reservar</Text>
            </TouchableOpacity>}
            {(this.props.tela != "@tela_reserva") && (this.state.identificador.status == 0 || (this.state.identificador.status == 2 && (this.state.identificador.reservaVinculada.vendedorId == this.props.token[0].pessoa.id))) &&
            <TouchableOpacity
              style = {{
                flex: 1,
                backgroundColor: this.props.StyleGlobal.cores.botao,
                alignItems: 'center',
                justifyContent: 'center',                
                marginLeft: this.state.identificador.status == 0 ? 40 : 0,
                padding: Dimensions.get('window').height <= 650 ? 5 : 10,
                width: '25%',
                borderRadius: 5,
            }}
              onPress = {this.armazenandoTabelasCorretagemIntermediacao}>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: Dimensions.get('window').height <= 650 ? 10 : 12,
                  textAlign: 'center',
                  color: '#FFFFFF',
                  alignSelf: 'center',
              }}>Proposta</Text>
            </TouchableOpacity>}
          </View>
        </>}
      </Container>
    );
  }
  //#endregion

  //#region Controller

  //#region Setando a visibilidade da modal de confirmação de dados
  setVisibilidadeModalConfirmarDados(value) {
    this.setState({VisibilidadeModalConfirmarDados: value})
  }
  //#endregion
 
  //#region Setando a visibilidade da modal de reserva confirmada
  setVisibilidadeModalReservaConfirmada(value) {
    this.setState({VisiblidadeModalReservaConfirmada: value})
  }
  //#endregion

  //#region Pegando a lista de unidades no Banco de dados
  pegandoListaDeUnidades = async () => {
    try {
      const response = await Identificador.consulta(String(this.props.token[0].token), this.state.IdEmpresa, this.state.IdCentroDeCusto)
      if(response != null && response != undefined)
      {

        let UnidadesFiltradas = (response).filter((Item) => (Item.status == 0 || (Item.status == 2 && (Item.reservaVinculada.vendedorId == this.props.token[0].pessoa.id))))
        
        this.state.ListaUnidades = UnidadesFiltradas
        this.state.ListaOriginal = UnidadesFiltradas
        this.state.ListaFiltrada = UnidadesFiltradas
        this.state.ListaExibida = [];

        if (this.state.ListaFiltrada.length >= 20) {
          this.state.ListaExibida = this.state.ListaFiltrada.slice(0, this.state.quantItem)
        } 
        else {
          this.state.ListaExibida = this.state.ListaFiltrada.slice(0, this.state.ListaFiltrada.length)
        }
        if((this.state.DadosRecebidos != "") && (this.state.DadosRecebidos.filter(lotes => (lotes.id != -1 && lotes.status != 2)) == "")) {
          this.state.value = true
        }
        await this.pegandoFiltrosAplicaveis();
      }
      else
      {
        await this.setVisibilidadeModalLoadingGoBack(false)
        await this.props.navigation.goBack()
      }
    } catch(err) {
        await this.setVisibilidadeModalLoadingGoBack(false)
        await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Pegando a lista de filtros aplicaveis
  pegandoFiltrosAplicaveis = async () => {
    try {
      const response = await Identificador.filtrosAplicaveis(String(this.props.token[0].token), this.state.IdEmpresa, this.state.IdCentroDeCusto)
      if(response != null && response != undefined && response != "")
      {

        this.state.FiltrosAplicaveis = response
        
        for(var i = 0; i < (this.state.FiltrosAplicaveis.length); i++) {
          var selectedItens = {selectedItems: []}
          Object.assign(this.state.FiltrosAplicaveis[i], selectedItens)
        }

        await this.setVisibilidadeModalLoadingGoBack(false)
        await this.setVisibilidadeModalListaLotes(true)
      }
      else
      {
        if (this.props.EmpresaLogada[0] == 'Silva Branco')
        {
          await this.setVisibilidadeModalLoadingGoBack(false)
          await this.props.navigation.goBack()
        }
        else
        {
          await this.setVisibilidadeModalLoadingGoBack(false)          
          await this.setVisibilidadeModalListaLotes(true)
        }
      }
    } catch {
      if (this.props.EmpresaLogada[0] == 8)
      {
        await this.setVisibilidadeModalLoadingGoBack(false)
        await this.props.navigation.goBack()
      }
      else
      {
        await this.setVisibilidadeModalLoadingGoBack(false)
        await this.setVisibilidadeModalListaLotes(true)
      }
    }
  }
  //#endregion 

  //#region Setando a visibilidade da modal de lista de lotes
  setVisibilidadeModalListaLotes(value) {
    this.setState({VisibilidadeModalListaLotes: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeModalLoading(value) {
    this.setState({VisibilidadeModalLoading: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading goBack
  setVisibilidadeModalLoadingGoBack(value) {
    this.setState({VisibilidadeModalLoadingGoBack: value})
  }
  //#endregion

  //#region Filtrando unidades
  searchUpdateUnidades = async (Term) => {
    await this.setState({searchTermUnidades: Term})
    if (Term == '') {
      this.state.ListaFiltrada = [];
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      await this.setState({ListaFiltrada: this.state.ListaOriginal})
      const ListaAdd = [];
      if (this.state.ListaFiltrada.length >= 20) {
        for(var i = 0; i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, distanceEnd: this.state.distanceEndInitial})
      } else {
        for(var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, isLoadingFooter: true, distanceEnd: this.state.distanceEndInitial})
      }
    } else {
      this.state.ListaFiltrada = [];
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      const ListaAdd = [];
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(lote => (lote.subLocal['descricao']).includes(this.state.searchTermUnidades))
      if (this.state.ListaFiltrada.length >= 20) {
        for (var i = 0; i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, distanceEnd: this.state.distanceEndInitial})
      } else {
        for (var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, isLoadingFooter: true, distanceEnd: this.state.distanceEndInitial})
      }
    }
  }
  //#endregion

  //#region Carregando mais unidades para a lista
  carregandoMaisUnidadesParaLista = async () => {
    this.setState({loadMore: true})
    const quantAnterior = this.state.quantItem;
    const ListaAdd = [];
    this.state.quantItem = (this.state.quantItem + 20);
    if ((this.state.ListaFiltrada.length > this.state.quantItem)) {
      try {
        for (var i = (quantAnterior); i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = this.state.ListaExibida.concat(ListaAdd)
        await this.setState({loadMore: false})
      } catch {}
    } else if (this.state.ListaFiltrada.length < this.state.quantItem) {
      try {
        for (var i = (quantAnterior); i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.quantItem = this.state.ListaFiltrada.length;
        this.state.ListaExibida = this.state.ListaExibida.concat(ListaAdd)
        await this.setState({loadMore: false})
      } catch {await this.setState({isLoadingFooter: true})}
    }
  }
  //#endregion

  //#region Filtro Silva Branco
  filtroSilva = async () => {
    if (this.state.FiltroEmpreendimento == '') {
      this.state.ListaFiltrada = [];
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      await this.setState({ListaFiltrada: this.state.ListaOriginal})
      const ListaAdd = [];
      if (this.state.ListaFiltrada.length >= 20) {
        for(var i = 0; i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, distanceEnd: this.state.distanceEndInitial})
      } else {
        for(var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, isLoadingFooter: true, distanceEnd: this.state.distanceEndInitial})
      }
    } else {
      this.state.ListaFiltrada = [];
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      const ListaAdd = [];
      // this.state.ListaFiltrada = this.state.ListaOriginal.filter(lote => lote.observacoes.includes(`Qtde. de quartos: ${this.state.FiltroQtdequartosMin}`) || lote.observacoes.includes(`Qtde. de quartos: ${this.state.FiltroQtdequartosMax}`))
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(createFilter(this.state.FiltroEmpreendimento, [this.state.CampoFiltrado]))
      if (this.state.ListaFiltrada.length >= 20) {
        for (var i = 0; i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, distanceEnd: this.state.distanceEndInitial})
      } else {
        for (var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, isLoadingFooter: true, distanceEnd: this.state.distanceEndInitial})
      }
    }
    await this.setState({VisibilidadeModalFiltros: false})
  }
  //#endregion

  //#region Pegando a tabela de preços de uma unidade em especifico no banco de dados
  pegandoTabelaDePrecos = async () => {

    try {
      const response = await TabelaDeVendas.consulta(String(this.props.token[0].token), this.state.IdEmpresa, this.state.IdCentroDeCusto, this.state.Local, this.state.SubLocal)
      if(response != null && response != undefined && response != "") 
      {
        const tabela = response
        const titulosDaTabelaDeVendas = tabela.classificacoesDosTitulosDaTabelaDeVenda
        for(var i = 0; i < titulosDaTabelaDeVendas.length; i++) {
          if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Corretagem') {
              this.state.tabelaCorretagemExiste = true
              this.state.tabelaCorretagem = titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda
          } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Intermediação') {
              this.state.tabelaIntermediacaoExiste = true
              this.state.tabelaIntermediacao = titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda
          } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Parcela') {
              this.state.tabelaFinaciamentoExiste = true
              this.state.tabelaFinanciamento = titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda
          } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Entrada') {
              this.state.tabelaEntradasExiste = true
              this.state.tabelaEntradas = titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda
          } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Intermediaria') {
              this.state.tabelaIntermediariasExiste = true
              this.state.tabelaIntermediarias = titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda
          }
        }
        if(await this.state.tabelaCorretagemExiste == true) {
          const positionCorretagem = (this.state.tabelaCorretagem).length - 1;
          this.state.valorCorretagem = this.state.tabelaCorretagem[positionCorretagem].valorTotal
          this.state.IdCorretagem = this.state.tabelaCorretagem[positionCorretagem].qtdeDeTitulos
        }
        if(await this.state.tabelaIntermediacaoExiste == true) {
          const positionIntermediacao = (this.state.tabelaIntermediacao).length - 1;
          this.state.valorImobiliaria = this.state.tabelaIntermediacao[positionIntermediacao].valorTotal
          this.state.IdIntermediacao = this.state.tabelaIntermediacao[positionIntermediacao].qtdeDeTitulos
        }
        if(await this.state.tabelaFinaciamentoExiste == true) {
          const positionFinanciamento = (this.state.tabelaFinanciamento).length - 1;
          this.state.valorFinancimento = this.state.tabelaFinanciamento[positionFinanciamento].valorTotal 
          this.state.IdFinanciamento = this.state.tabelaFinanciamento[positionFinanciamento].qtdeDeTitulos 
          this.state.valorParcelaDoFinancimento = this.state.tabelaFinanciamento[positionFinanciamento].principal
          const position = 0;
          for(var i = 0; i <= positionFinanciamento; i++) {
            const proximaposition = position + i;
            if(this.state.tabelaFinanciamento[i].jurosDeTabela >= this.state.tabelaFinanciamento[proximaposition].jurosDeTabela)
            {
              this.state.juros = this.state.tabelaFinanciamento[i].jurosDeTabela
            }
          }
        }
        if(await this.state.tabelaEntradasExiste == true) {
          const positionEntradas = (this.state.tabelaEntradas).length - 1;
          this.state.valorDasEntradas = this.state.tabelaEntradas[positionEntradas].valorTotal
          this.state.IdEntradas = this.state.tabelaEntradas[positionEntradas].qtdeDeTitulos
        }
        if(await this.state.tabelaIntermediariasExiste == true) {
          const positionIntermediarias = (this.state.tabelaIntermediarias).length - 1;
          this.state.valorDasIntermediarias = this.state.tabelaIntermediarias[positionIntermediarias].valorTotal 
          this.state.IdIntermediarias = this.state.tabelaIntermediarias[positionIntermediarias].qtdeDeTitulos
        }
        this.state.identificador = tabela.identificador
        this.state.tabelaCompleta = tabela
        this.state.dadosLote = this.state.identificador.subLocal
        this.state.numeroDaTabelaDeVenda = tabela.numero
        await this.setVisibilidadeModalLoading(false)
        await this.setVisibilidadeModalListaLotes(false)
      }
      else
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `O lote selecionado não tem tabela disponível, tente outro lote.`
        })
        await this.setVisibilidadeModalLoading(false)
        await this.setVisibilidadeModalListaLotes(true)
      }
    } 
    catch {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Falha ao tentar solicitar a tabela de vendas, tente novamente!`
      })
      await this.setVisibilidadeModalLoading(false)
      await this.setVisibilidadeModalListaLotes(true)
    }
  }
  //#endregion

  //#region Armazenando a tabela de corretagem, intermediação e da tabela de vendas no redux
  armazenandoTabelasCorretagemIntermediacao = async () => {
    if(this.state.identificador.reservaVinculada.vendedorId != this.props.token[0].pessoa.id && this.state.identificador.reservaVinculada.vendedorId != null)
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Desculpe, mas a unidade já esta reservada em nome de ${this.state.identificador.reservaVinculada.vendedorNome}`
      })
    }
    else {
      if(this.state.identificador.status == 0)
      {
        await this.setVisibilidadeModalLoading(true)
        try {
          const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), parseInt(this.state.IdProspect), [this.state.identificador])
          if (response != null && response != undefined && response != "")
          {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Reserva realizada com sucesso`
            })
            const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
            addToCorretagem(this.state.tabelaCorretagem)
            addToIntermediacao(this.state.tabelaIntermediacao)
            addToFinanciamento(this.state.tabelaFinanciamento)
            addToLotes(this.state.identificador)
            addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })
            await this.setVisibilidadeModalLoading(false)
            this.state.optionObrigado = '@proposta'
            await this.setVisibilidadeModalReservaConfirmada(true)
          }
          else
          {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Não foi possível realizar a reserva, entre em contato com nossa equipe de desenvolvimento.`
            })
            RnBgTask.runInBackground(async() => {await this.mensagemError(`Error na Reserva: Prospect: ${String(this.props.Prospect[0].id)} // Token: ${String(this.props.token[0].token)}`, this.state.identificador)})
          }
        } catch(err) {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Não foi possível realizar a reserva, entre em contato com nossa equipe de desenvolvimento.`
          })
          RnBgTask.runInBackground(async() => {await this.mensagemError(`Error na Reserva: Prospect: ${String(this.props.Prospect[0].id)} // Token: ${String(this.props.token[0].token)} // Descricao error: ${String(err.response.request._response)}`, this.state.identificador)})
        }
      }
      else
      {
        const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
        addToCorretagem(this.state.tabelaCorretagem)
        addToIntermediacao(this.state.tabelaIntermediacao)
        addToFinanciamento(this.state.tabelaFinanciamento)
        addToLotes(this.state.identificador)
        addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })
        await this.setVisibilidadeModalLoading(false)
        const navegar = await this.props.navigation.getParam('TabelaDePrecos', 'null')
        if(navegar != null && navegar != 'null')
        {
          if(this.state.tabelaCorretagemExiste == true && this.props.EmpresaLogada[0] == 5)
          {
            await this.setVisibilidadeModalReservaConfirmada(false)
            return await navegar.onIntermediacao()
          }
          else
          {
            await this.setVisibilidadeModalReservaConfirmada(false)
            return await navegar.onConfirm()
          }
        }
      }
    }
  }
  //#endregion

  //#region Envio de mensagem do error por email
  mensagemError = async (titulo, body) => {
    try {
      const Dados = {
        "destinatario": "lucas@digitalint.com.br",
        "titulo": titulo,
        "mensagem": JSON.stringify(body)
      }
      const response = await Mensagem.NotificacaoEmailExterno(String(this.props.token[0].token), this.state.IdEmpresa, this.state.IdCentroDeCusto, Dados)
      if(response.status == 200 || response.status == 201)
      {
        await this.setVisibilidadeModalLoading(false)
      }
    } catch(err) {
      await this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

  //#region Executando a reserva do lote
  reservandoLote = async () => {
    await this.setVisibilidadeModalLoading(true)
    try {

      const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), parseInt(this.state.IdProspect), [this.state.identificador])
      if (response != null && response != undefined && response != "")
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Reserva realizada com sucesso`
        })
        this.state.optionObrigado = '@reserva'
        await this.setVisibilidadeModalLoading(false)
        await this.setVisibilidadeModalReservaConfirmada(true)
      }
    } catch(err) {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Falha ao tentar realizar a reserva, tente novamente.`
      })
      await this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

  //#region Executando a reserva por meio da lista de lotes
  reservandoListaLote = async (item) => {
    await this.setVisibilidadeModalListaLotes(false)
    await this.setVisibilidadeModalLoading(true)
    const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), parseInt(this.state.IdProspect), [item])
    if (response != null && response != undefined && response != "")
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Reserva realizada com sucesso`
      })
      this.state.optionObrigado = '@reserva'
      await this.setVisibilidadeModalLoading(false)
      await this.setVisibilidadeModalReservaConfirmada(true)
    }
    else
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Falha ao tentar realizar a reserva, tente novamente!`
      })
      await this.setVisibilidadeModalLoading(false)
      await this.setVisibilidadeModalListaLotes(true)
    }
  }
  //#endregion

  //#region Abrindo link do mapa
  openLinking = async (url) => {
    const supported = await Linking.canOpenURL(url)
    if(supported) 
    {
      await Linking.openURL(url)
    }
    else
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `O mapa não pode ser aberto no momento!`
      })
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
  ConfigCss: state.configcssApp,
  StyleGlobal: state.StyleGlobal,
  EmpresaLogada: state.EmpresaLogada
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({...DadosIntermediacaoActions, ...DadosCorretagemActions, ...DadosFinanciamentoActions, ...LotesActions, ...TabelaDeVendasActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TabelaDePrecos);