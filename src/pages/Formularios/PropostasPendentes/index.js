//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import {Keyboard, View, Text, Animated, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Modal, TextInput, Linking, Platform } from 'react-native';
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
import fetch_blob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';
import RNShareFile from 'react-native-share-pdf';
import PDFView from 'react-native-view-pdf';
import Collapsible from 'react-native-collapsible';
import { Picker } from '@react-native-picker/picker';
//#endregion

//#region Chaves de filtragem
const KEYS_TO_FILTERS_LEADS = ['subLocal.descricao']
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Vendas, Identificador, TabelaDeVendas } from "../../../services";
//#endregion

//#region Redux
import { DadosLeadActions, TelaAtualActions, LotesActions, DadosIntermediacaoActions, DadosCorretagemActions, DadosFinanciamentoActions, TabelaDeVendasActions  } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
import EfeitoSwipeDown from '../../../effects/swipearrowdown.json';
import EfeitoSwipeUp from '../../../effects/swipearrowup.json';
import EfeitoLoading from '../../../effects/planeloading.json';
//#endregion

//#region Componentes
import { Container, Logo, NomeEmpresa, Header } from '../../../components';
import { ModalLoadingGoBack, ModalCadastroDoLead, ModalLoading, ModalEnviandoArquivos, ModalDeletandoArquivos, ModalSucesso, ModalFalha, ModalListaProspect, ModalOption, ModalReservaConfirmada } from '../../Modais';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
//#endregion

//#endregion

class PropostasPendentes extends Component {
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
    
    await this.setVisibilidadeModalLoadingGoBack(true)
    await this.pegandoListaDePropostaPendentes()
  }
  //#endregion

  //#region Component Unmount
  componentWillUnmount() {
    this._isMounted = false;
  }
  //#endregion

  //#region Model
  state = {
    opacidadeHeader: new Animated.Value(1),
    escalaHeader: new Animated.ValueXY({x: 0, y: 1}),
    VisibilidadeModalCadastroDoLead: false,
    VisibilidadeModalLoading: false,
    VisibilidadeModalLoadingGoBack: false,
    VisibilidadeModalEnviandoArquivos: false,
    VisibilidadeModalDeleltandoArquivos: false,
    VisibilidadeModalSucesso: false,
    VisibilidadeModalFalha: false,
    VisibilidadeModalPDF: false,
    VisibilidadeModalFiltros: false,
    VisibilidadeModalProspect: false,
    VisibilidadeModalTabelaDePrecos: false,
    VisibilidadeModalOption: false,
    VisibilidadeModalReservaConfirmada: false,
    FiltrosAplicaveis: [],
    FiltroEmpreendimento: '',
    CampoFiltrado: '',
    ListaPropostas: [],
    ListaOriginal: [],
    ListaFiltrada: [],
    ListaExibida: [],
    LocaisDeCaptacao: [],
    quantItem: 20,
    distanceEnd: null,
    distanceEndInitial: null,
    loadMore: false,
    TermPropostas: '',
    searchTermPropostas: '',
    Nome: null,
    Email: null,
    TelefoneP: null,
    finalidade: null,
    IdProspect: [],
    dadosProspect: [],
    NomeDaUnidade: null,
    Local: null,
    SubLocal: null,
    identificador: [],
    LoteSelecionado: null,
    NomeDoIconeParaAbrirOpcoes: 'keyboard-arrow-down',
    FiltroPavimentoMin: '',
    FiltroPavimentoMax: '',
    FiltroQtdequartosMin: '',
    FiltroQtdequartosMax: '',
    FiltroDescricao: '',
    lotereservado: [],
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
    isLoadingHeader: false,
    ID: "",
    scrollFlatY: new Animated.Value(0)
  };
  //#endregion

  //#region View
  render() {

    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
        <ModalLoading visibilidade = {this.state.VisibilidadeModalLoading} 
          onPress = {async () => {
            await Vendas.cancelRequest(true)
            await Identificador.cancelRequest(true)
            await this.setVisibilidadeModalLoading(false)
        }}/>
        <ModalLoadingGoBack 
          visibilidade = {this.state.VisibilidadeModalLoadingGoBack}
          onPress = {async () => {
            await Vendas.cancelRequest(true)
            await this.setVisibilidadeModalLoadingGoBack(false)
            await this.props.navigation.goBack()
        }}/>
        <ModalOption 
          visibilidade = {this.state.VisibilidadeModalOption}
          onPressNao = {async () => {this.pressionandoNao(this.state.lotereservado)}}
          onPressSim = {async () => {this.pressionandoSim(this.state.lotereservado)}}
          textomensagem = {'Deseja vincular o lote a um prospect?'}
          onPressIcon = {async () => {this.setVisibilidadeModalOption(false)}}
        />
        <ModalReservaConfirmada 
          onPressIcon = {async () => {
            this.state.VisibilidadeModalLoading = true
            await this.setVisibilidadeModalReservaConfirmada(false)
            await this.pegandoListaDeUnidadesRefresh()
          }}
          textBotaoEsquerdo = {'Reservar novo lote'}
          textBotaoDireito = {'Obrigado'}
          visibilidade = {this.state.VisibilidadeModalReservaConfirmada} 
          onPressReservarNovoLote = { async () => {
            this.state.VisibilidadeModalLoading = true
            await this.setVisibilidadeModalReservaConfirmada(false)
            await this.pegandoListaDeUnidadesRefresh()
          }}
          onPressObrigado = { async () => {
            this.state.VisibilidadeModalLoading = true
            await this.setVisibilidadeModalReservaConfirmada(false)
            await this.pegandoListaDeUnidadesRefresh()
          }}
        />
        {this.state.VisibilidadeModalLoading == false && this.state.VisibilidadeModalLoadingGoBack == false && <>
        <View
          style = {{
            backgroundColor: this.props.StyleGlobal.cores.background, 
            height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 158 : 128,
            justifyContent: "center"
        }}>
          <View 
            style = {{
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10
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
            }}>Propostas pendentes</Text>
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
              onChangeText = {async (term) => { await this.searchUpdatePropostas(term) }}
              style = {{
                paddingVertical: 12,
                paddingHorizontal: 16,
                height: 58,
                fontSize: 14,
                width: Dimensions.get('window').width * 0.88
              }}
              fuzzy = {true}
              placeholder = 'Pesquisar pelo nome do cliente...'
              placeholderTextColor = '#8F998F'
            />
            <Icon name = 'search' size = {30} color = {'#8F998F'} style = {{marginRight: 5}}/>
          </View>
        </View>
        <Animated.FlatList
          ref = {(ref) => this.flatList = ref}
          style = {{marginVertical: 10, marginHorizontal: 8}}
          showsVerticalScrollIndicator = {false}
          onScroll = {Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollFlatY}}}],
            {useNativeDriver: true}
          )}
          data = {this.state.ListaExibida}
          onEndReached = {async () => {
            this.state.loadMore = true
            const quantAnterior = this.state.quantItem;
            const ListaAdd = [];
            this.state.quantItem = (this.state.quantItem + 20);
            if ((this.state.ListaFiltrada.length > this.state.quantItem)) {
              try {
                for (var i = (quantAnterior); i <= (this.state.quantItem - 1); i++) {
                  var loadingAnimated = {loading: false}
                  Object.assign(this.state.ListaFiltrada[i], loadingAnimated)
                  ListaAdd.push(this.state.ListaFiltrada[i])
                }
                this.state.ListaExibida = this.state.ListaExibida.concat(ListaAdd)
                await this.setState({loadMore: false})
              } catch {}
            } else if (this.state.ListaFiltrada.length < this.state.quantItem) {
              try {
                for (var i = (quantAnterior); i <= (this.state.ListaFiltrada.length - 1); i++) {
                  var loadingAnimated = {loading: false}
                  Object.assign(this.state.ListaFiltrada[i], loadingAnimated)
                  ListaAdd.push(this.state.ListaFiltrada[i])
                }
                this.state.quantItem = this.state.ListaFiltrada.length;
                this.state.ListaExibida = this.state.ListaExibida.concat(ListaAdd)
                await this.setState({loadMore: false})
              } catch {await this.setState({isLoadingFooter: true})}
            }
          }}
          onEndReachedThreshold = {0.1}
          keyExtractor = {item => String(item.numero)}
          renderItem = {({ item, index }) => {
            
            const inputRange = [
              -1,
              0,
              (140 * index),
              (140 * (index + 2))
            ]

            const scale = this.state.scrollFlatY.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 0]
            })

            const opacityInputRange = [
              -1,
              0,
              (140 * index),
              (140 * (index + 1))
            ]

            const opacity = this.state.scrollFlatY.interpolate({
              inputRange: opacityInputRange,
              outputRange: [1, 1, 1, 0]
            })

            return (
              <>
                <Animated.View key = {item.numero}
                  style = {[{
                    backgroundColor: '#FFFFFF',
                    paddingHorizontal: 16,
                    width: '100%',
                    height: 130,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: 'rgba(16, 22, 26, 0.15)',
                    justifyContent: "center",
                    marginVertical: 2,
                    opacity
                  }, {transform: [{scale}]}
                ]}>
                  <TouchableOpacity activeOpacity = {1}
                    onPress = {async () => {
                      if(this.state.LoteSelecionado == null || (this.state.LoteSelecionado != item.numero))
                      {
                        this.setState({LoteSelecionado: item.numero})
                      }
                      else
                      {
                        this.setState({LoteSelecionado: null})
                      }
                    }}>
                    <View
                      style ={{
                        width: '100%',
                    }}>
                      <View style = {{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                        <View
                          style = {{
                            maxWidth: '100%', 
                            flexDirection: 'column', 
                            alignItems: 'flex-start',
                        }}>
                          {item.prospects != '' &&
                          <Text
                            style = {{
                              fontSize: 14,
                              fontStyle: 'normal',
                              fontWeight: 'bold',
                              color: '#262825',
                              flexWrap: 'wrap',
                              textAlign: 'left',
                              marginBottom: 4,
                          }}>{`TITULAR: ${(item.prospects[0].nome).toUpperCase()}`}</Text>}
                          <Text
                            style = {{
                              fontSize: 10,
                              fontStyle: 'normal',
                              fontWeight: 'normal',
                              color: '#262825',
                              flexWrap: 'wrap',
                              textAlign: 'left',
                            }}>{`${item.identificador.subLocal['descricao']}`}</Text>
                        </View>
                      </View>
                      <View
                        style = {{
                          flexDirection: 'row', 
                          width: '100%',
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginTop: 5,
                      }}>
                        <View
                          style = {{
                            flexDirection: 'row',
                            alignItems: 'center',
                            maxWidth: '50%',
                          }}>
                          <View>
                            <Text
                              style = {{
                                fontSize: 10,
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                color: '#8F998F',
                                flexWrap: 'wrap',
                                marginBottom: 3,
                              }}>{`Data da proposta: ${moment(item.dataDaVenda, true).format('DD/MM/YYYY')}`}</Text>
                            {item.identificador.reservaVinculada['vendedorNome'] != null &&
                            <Text
                              style = {{
                                fontSize: 10,
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                color: '#8F998F',
                                flexWrap: 'wrap',
                                marginBottom: 3,
                              }}>{`Vendedor: ${item.identificador.reservaVinculada['vendedorNome']}`}</Text>}
                            <Text
                              style = {{
                                fontSize: 10,
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                color: '#8F998F',
                                flexWrap: 'wrap',
                                marginBottom: 3,
                              }}>{`Valor a vista: ${formatoDeTexto.FormatarTexto(item.identificador.valorAVista)}`}</Text>
                            <Text
                              style = {{
                                fontSize: 10,
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                color: '#8F998F',
                                flexWrap: 'wrap',
                                marginBottom: 3,
                              }}>{`Total gerado: ${formatoDeTexto.FormatarTexto(item.valorTotal)}`}</Text>
                          </View>
                        </View>
                        {item.loading == false &&
                        <View
                          style ={{
                            flexDirection: 'row', 
                            justifyContent: 'flex-end', 
                            alignItems: 'center',
                            maxWidth: '50%'
                          }}>
                          {this.props.EmpresaLogada[0] == 8 &&
                          <TouchableOpacity
                            style = {{
                              paddingVertical: 6,
                              paddingHorizontal: 10,
                              marginRight: 10, 
                              backgroundColor: '#FFFFFF',
                              flexDirection: 'row',
                              borderWidth: 1,
                              borderRadius: 5,
                              borderColor: this.props.StyleGlobal.cores.background
                          }}
                            onPress = { async () => {
                              item.loading = true
                              this.setState({Renderizar: true})
                              RnBgTask.runInBackground(async () => {await this.desaprovarProposta(item, index)})
                            }}>
                            <Text
                              style = {{
                                fontSize: 10, 
                                color: this.props.StyleGlobal.cores.botao,
                                fontStyle: 'normal',
                                fontWeight: '500',
                                textAlign: 'center',
                                alignSelf: 'center',
                                marginVertical: 4,
                                marginHorizontal: 0
                          }}>{'Desaprovar'}</Text>
                          </TouchableOpacity>}
                          {this.props.EmpresaLogada[0] == 8 &&
                          <TouchableOpacity
                            disabled = {false}
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
                              item.loading = true
                              this.setState({Renderizar: true})
                              RnBgTask.runInBackground(async () => {await this.aprovarProposta(item, index)})
                            }}>
                            <Text
                              style = {{
                                fontSize: 10, 
                                color: '#FFFFFF',
                                fontStyle: 'normal',
                                fontWeight: '500',
                                textAlign: 'center',
                                alignSelf: 'center',
                                marginVertical: 4,
                                marginHorizontal: 0
                          }}>{'Aprovar'}</Text>
                          </TouchableOpacity>}
                        </View>}
                        {item.loading == true &&
                        <View
                          style = {{
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: 65,
                            minWidth: 65,
                            maxWidth: '50%',
                        }}>
                          <Lottie 
                            resizeMode = 'contain'
                            source = {EfeitoLoading}
                            autoPlay
                            loop
                          />
                        </View>}
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
                <Collapsible collapsed = {this.state.LoteSelecionado == item.numero ? false : true}>
                  <View 
                    style = {{
                      backgroundColor: '#FFFFFF',
                      marginBottom: 4,
                      paddingHorizontal: 15,
                      borderBottomWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      borderColor: '#E2F2E3',
                      width: '100%',
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5
                    }}>
                    {item.titulosDeFinanciamento != "" && item.titulosDeFinanciamento != null &&
                    <View 
                      style = {{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3, maxWidth: '75%'}}>
                    <Text 
                      style ={{
                        fontSize: 10,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        color: '#262825',
                        flexWrap: 'wrap',
                        textAlign: 'justify'
                    }}>{'Fin. bancário: '}</Text>     
                    <Text
                      style = {{
                        fontSize: 10,
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        color: '#262825',
                        flexWrap: 'wrap',
                        textAlign: 'justify'
                      }}>{`${formatoDeTexto.FormatarTexto(((item.titulosDeFinanciamento).reduce((total, entrada) => total + ((entrada.valor)), 0))/((item.titulosDeFinanciamento).length))} (${formatoDeTexto.NumeroInteiro((item.titulosDeFinanciamento).length)} ${(item.titulosDeFinanciamento).length > 1 ? 'parcelas' : 'parcela'}), totalizando em ${formatoDeTexto.FormatarTexto(((item.titulosDeFinanciamento).reduce((total, entrada) => total + ((entrada.valor)), 0)))} ${(item.titulosDeFinanciamento).length == 1 ? `vencimento em ${moment(item.titulosDeFinanciamento[0].vencimento, true).format('DD/MM/YYYY')}` : `primeiro vencimento em ${moment(item.titulosDeFinanciamento[0].vencimento, true).format('DD/MM/YYYY')}`} ${(item.titulosDeFinanciamento).length > 1 ? `e o último vencimento em ${moment(item.titulosDeFinanciamento[(item.titulosDeFinanciamento).length - 1].vencimento, true).format('DD/MM/YYYY')}` : ''}`}</Text>
                    </View>}
                    {item.titulosDeEntrada != "" && item.titulosDeEntrada != null &&
                    <View 
                      style = {{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3, maxWidth: '75%'}}>
                      <Text 
                        style ={{
                          fontSize: 10,
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          color: '#262825',
                          flexWrap: 'wrap',
                          textAlign: 'justify'
                      }}>{'Entrada: '}</Text>
                      <Text
                        style = {{
                          fontSize: 10,
                          fontStyle: 'normal',
                          fontWeight: 'normal',
                          color: '#262825',
                          flexWrap: 'wrap',
                          textAlign: 'justify'
                        }}>{`${formatoDeTexto.FormatarTexto(((item.titulosDeEntrada).reduce((total, entrada) => total + ((entrada.valor)), 0))/((item.titulosDeEntrada).length))} (${formatoDeTexto.NumeroInteiro((item.titulosDeEntrada).length)} ${(item.titulosDeEntrada).length > 1 ? 'parcelas' : 'parcela'}), totalizando em ${formatoDeTexto.FormatarTexto(((item.titulosDeEntrada).reduce((total, entrada) => total + ((entrada.valor)), 0)))} ${(item.titulosDeEntrada).length == 1 ? `vencimento em ${moment(item.titulosDeEntrada[0].vencimento, true).format('DD/MM/YYYY')}` : `primeiro vencimento em ${moment(item.titulosDeEntrada[0].vencimento, true).format('DD/MM/YYYY')}`} ${(item.titulosDeEntrada).length > 1 ? `e o último vencimento em ${moment(item.titulosDeEntrada[(item.titulosDeEntrada).length - 1].vencimento, true).format('DD/MM/YYYY')}` : ''}`}</Text>
                      </View>}
                    {item.titulosDeSinal != "" && item.titulosDeSinal != null &&
                    <View 
                      style = {{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3, maxWidth: '75%'}}>
                      <Text 
                        style ={{
                          fontSize: 10,
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          color: '#262825',
                          flexWrap: 'wrap',
                          textAlign: 'justify'
                      }}>{'Sinal: '}</Text>
                      <Text
                        style = {{
                          fontSize: 10,
                          fontStyle: 'normal',
                          fontWeight: 'normal',
                          color: '#262825',
                          flexWrap: 'wrap',
                          textAlign: 'justify'
                        }}>{`${formatoDeTexto.FormatarTexto(((item.titulosDeSinal).reduce((total, entrada) => total + ((entrada.valor)), 0))/((item.titulosDeSinal).length))} (${formatoDeTexto.NumeroInteiro((item.titulosDeSinal).length)} ${(item.titulosDeSinal).length > 1 ? 'parcelas' : 'parcela'}), totalizando em ${formatoDeTexto.FormatarTexto(((item.titulosDeSinal).reduce((total, entrada) => total + ((entrada.valor)), 0)))} ${(item.titulosDeSinal).length == 1 ? `vencimento em ${moment(item.titulosDeSinal[0].vencimento, true).format('DD/MM/YYYY')}` : `primeiro vencimento em ${moment(item.titulosDeSinal[0].vencimento, true).format('DD/MM/YYYY')}`} ${(item.titulosDeSinal).length > 1 ? `e o último vencimento em ${moment(item.titulosDeSinal[(item.titulosDeSinal).length - 1].vencimento, true).format('DD/MM/YYYY')}` : ''}`}</Text>
                    </View>}
                    {item.titulosDeIntermediaria != "" && item.titulosDeIntermediaria != null &&
                    <View 
                      style = {{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3, maxWidth: '75%'}}>
                      <Text 
                        style ={{
                          fontSize: 10,
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          color: '#262825',
                          flexWrap: 'wrap',
                          textAlign: 'justify'
                      }}>{'Intermediária: '}</Text>
                      <Text
                        style = {{
                          fontSize: 10,
                          fontStyle: 'normal',
                          fontWeight: 'normal',
                          color: '#262825',
                          flexWrap: 'wrap',
                          textAlign: 'justify'
                        }}>{`${formatoDeTexto.FormatarTexto(((item.titulosDeIntermediaria).reduce((total, entrada) => total + ((entrada.valor)), 0))/((item.titulosDeIntermediaria).length))} (${formatoDeTexto.NumeroInteiro((item.titulosDeIntermediaria).length)} ${(item.titulosDeIntermediaria).length > 1 ? 'parcelas' : 'parcela'}), totalizando em ${formatoDeTexto.FormatarTexto(((item.titulosDeIntermediaria).reduce((total, entrada) => total + ((entrada.valor)), 0)))} ${(item.titulosDeIntermediaria).length == 1 ? `vencimento em ${moment(item.titulosDeIntermediaria[0].vencimento, true).format('DD/MM/YYYY')}` : `primeiro vencimento em ${moment(item.titulosDeIntermediaria[0].vencimento, true).format('DD/MM/YYYY')}`} ${(item.titulosDeIntermediaria).length > 1 ? `e o último vencimento em ${moment(item.titulosDeIntermediaria[(item.titulosDeIntermediaria).length - 1].vencimento, true).format('DD/MM/YYYY')}` : ''}`}</Text>
                    </View>}
                    {item.titulosDeParcelaObra != "" && item.titulosDeParcelaObra != null &&
                    <View 
                      style = {{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3, maxWidth: '75%'}}>
                      <Text 
                        style ={{
                          fontSize: 10,
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          color: '#262825',
                          flexWrap: 'wrap',
                          textAlign: 'justify'
                      }}>{'Parcela Obra: '}</Text>
                    <Text
                      style = {{
                        fontSize: 10,
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        color: '#262825',
                        flexWrap: 'wrap',
                        textAlign: 'justify'
                      }}>{`${formatoDeTexto.FormatarTexto(((item.titulosDeParcelaObra).reduce((total, entrada) => total + ((entrada.valor)), 0))/((item.titulosDeParcelaObra).length))} (${formatoDeTexto.NumeroInteiro((item.titulosDeParcelaObra).length)} ${(item.titulosDeParcelaObra).length > 1 ? 'parcelas' : 'parcela'}), totalizando em ${formatoDeTexto.FormatarTexto(((item.titulosDeParcelaObra).reduce((total, entrada) => total + ((entrada.valor)), 0)))} ${(item.titulosDeParcelaObra).length == 1 ? `vencimento em ${moment(item.titulosDeParcelaObra[0].vencimento, true).format('DD/MM/YYYY')}` : `primeiro vencimento em ${moment(item.titulosDeParcelaObra[0].vencimento, true).format('DD/MM/YYYY')}`} ${(item.titulosDeParcelaObra).length > 1 ? `e o último vencimento em ${moment(item.titulosDeParcelaObra[(item.titulosDeParcelaObra).length - 1].vencimento, true).format('DD/MM/YYYY')}` : ''}`}</Text>
                    </View>}
                    {item.titulosDeParcela != "" && item.titulosDeParcela != null &&
                    <View 
                      style = {{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, maxWidth: '75%'}}>
                      <Text 
                        style ={{
                          fontSize: 10,
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          color: '#262825',
                          flexWrap: 'wrap',
                          textAlign: 'justify'
                      }}>{'Saldo a financiar: '}</Text>
                    <Text
                      style = {{
                        fontSize: 10,
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        color: '#262825',
                        flexWrap: 'wrap',
                        textAlign: 'justify'
                      }}>{`${formatoDeTexto.FormatarTexto(((item.titulosDeParcela).reduce((total, entrada) => total + ((entrada.valor)), 0))/((item.titulosDeParcela).length))} (${formatoDeTexto.NumeroInteiro((item.titulosDeParcela).length)} ${(item.titulosDeParcela).length > 1 ? 'parcelas' : 'parcela'}), totalizando em ${formatoDeTexto.FormatarTexto(((item.titulosDeParcela).reduce((total, entrada) => total + ((entrada.valor)), 0)))} ${(item.titulosDeParcela).length == 1 ? `vencimento em ${moment(item.titulosDeParcela[0].vencimento, true).format('DD/MM/YYYY')}` : `primeiro vencimento em ${moment(item.titulosDeParcela[0].vencimento, true).format('DD/MM/YYYY')}`} ${(item.titulosDeParcela).length > 1 ? `e o último vencimento em ${moment(item.titulosDeParcela[(item.titulosDeParcela).length - 1].vencimento, true).format('DD/MM/YYYY')}` : ''}`}</Text>
                    </View>}
                  </View>
                </Collapsible>
                <TouchableOpacity
                  style = {{
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    marginTop: -30,
                    height: 30
                  }} 
                  activeOpacity = {1}
                  onPress = {async () => {
                    if(this.state.LoteSelecionado == null || (this.state.LoteSelecionado != item.numero))
                    {
                      this.setState({LoteSelecionado: item.numero})
                    }
                    else
                    {
                      this.setState({LoteSelecionado: null})
                    }
                  }}>
                  <Lottie 
                    resizeMode = 'contain'
                    source = {this.state.LoteSelecionado == item.numero ? EfeitoSwipeUp : EfeitoSwipeDown}
                    autoPlay
                    loop
                  />
                </TouchableOpacity>
              </>
          )}}
          refreshing = {true}
        />
        </>}
      </Container>
    );
  }
  //#endregion

  //#region Controller

  //#region Manipulação de estado do Keyboard
  UNSAFE_componentWillMount = async () => {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow = async () => {
    this.state.keyboardDidShow == false ? await this.setState({keyboardDidShow: true}) : await this.setState({keyboardDidShow: true})
  }

  _keyboardDidHide = async () => {
    
    this.setState({isLoadingHeader: true, keyboardDidShow: false, loadMore: false})
    
    RnBgTask.runInBackground(async () => {this.searchUpdatePropostas(this.state.TermPropostas)})
  }
  //#endregion

  //#region Pegando a lista de propostas pendentes
  pegandoListaDePropostaPendentes = async () => {

    try {
      const response = await Vendas.propostasPendentes(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
      if(response != null && response != undefined)
      {

        this.state.ListaPropostas = response
        const Lista = this.state.ListaPropostas
        this.state.ListaPropostas = Lista
        this.state.ListaOriginal = Lista
        this.state.ListaFiltrada = Lista
        this.state.ListaExibida = [];
        const ListaAdd = [];
        if (Lista.length >= 20) {
          for(var i = 0; i <= (this.state.quantItem - 1); i++) {
            var loadingAnimated = {loading: false}
            Object.assign(this.state.ListaFiltrada[i], loadingAnimated)
            ListaAdd.push(this.state.ListaFiltrada[i])
          }
          this.state.ListaExibida = ListaAdd
        } else {
          for(var i = 0; i <=(Lista.length - 1); i++) {
            var loadingAnimated = {loading: false}
            Object.assign(this.state.ListaFiltrada[i], loadingAnimated)
            ListaAdd.push(this.state.ListaFiltrada[i])
          }
          this.state.ListaExibida = ListaAdd
          this.state.isLoadingFooter = true
        }
        await this.setVisibilidadeModalLoadingGoBack(false)
      }
      else
      {
        await this.setVisibilidadeModalLoadingGoBack(false)
        await this.props.navigation.goBack()
      }
    } catch {
      await this.setVisibilidadeModalLoadingGoBack(false)
      await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeModalLoading = async (value) => {
    await this.setState({ VisibilidadeModalLoading: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading go back
  setVisibilidadeModalLoadingGoBack = async (value) => {
    await this.setState({VisibilidadeModalLoadingGoBack: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de Prospect
  setVisibilidadeModalProspect = async (value) => {
    await this.setState({ VisibilidadeModalProspect: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de PDF
  setVisibilidadeModalPDF(value) {
    this.setState({VisibilidadeModalPDF: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal da tabela de preços
  setVisibilidadeModalTabelaDePrecos(value) {
    this.setState({VisibilidadeModalTabelaDePrecos: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de option
  setVisibilidadeModalOption = async (value) => {
    this.setState({VisibilidadeModalOption: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de reserva confirmada
  setVisibilidadeModalReservaConfirmada = async (value) => {
    this.setState({VisibilidadeModalReservaConfirmada: value})
  }
  //#endregion

  //#region Filtrando unidades
  searchUpdatePropostas = async (Term) => {
    await this.setState({searchTermPropostas: Term, TermPropostas: Term})
    if (Term == '') {
      this.state.ListaFiltrada = [];
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      this.state.ListaFiltrada = this.state.ListaOriginal
      await this.setState({ListaFiltrada: this.state.ListaOriginal})
      const ListaAdd = [];
      if (this.state.ListaFiltrada.length >= 20) {
        for(var i = 0; i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        this.state.isLoadingHeader = false
        await this.setState({distanceEnd: this.state.distanceEndInitial})
      } else {
        for(var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        this.state.isLoadingHeader = false
        this.state.isLoadingFooter = true
        await this.setState({distanceEnd: this.state.distanceEndInitial})
      }
    } else {
      this.state.ListaFiltrada = [];
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      const ListaAdd = [];
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(proposta => ((proposta.prospects[0].nome).includes(this.state.searchTermPropostas) || (proposta.identificador.subLocal['descricao']).includes(this.state.searchTermPropostas)))
      if (this.state.ListaFiltrada.length >= 20) {
        for (var i = 0; i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        this.state.isLoadingHeader = false
        await this.setState({distanceEnd: this.state.distanceEndInitial})
      } else {
        for (var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        this.state.isLoadingHeader = false
        this.state.isLoadingFooter = true
        await this.setState({distanceEnd: this.state.distanceEndInitial})
      }
    }
  }
  //#endregion

  //#region Filtro de unidade avançado
  advancedFilter = async () => {
    if (this.state.FiltroPavimento == '' && this.state.FiltroQtdequartos == '' && this.state.FiltroDescricao == '') {
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
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(lote => lote.observacoes.includes(`Qtde. de quartos: ${this.state.FiltroQtdequartosMin}`) || lote.observacoes.includes(`Qtde. de quartos: ${this.state.FiltroQtdequartosMax}`))
      // this.state.ListaFiltrada = this.state.ListaOriginal.filter(createFilter(this.state.searchTermPropostas, KEYS_TO_FILTERS_LEADS))
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
      // this.state.ListaFiltrada = this.state.ListaOriginal.filter(lote => (lote.subLocal['descricao']).includes(this.state.FiltroEmpreendimento))
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

  //#region Carregando mais unidades para lista
  carregandoMaisPropostasParaLista = async () => {
    this.state.loadMore = true
    const quantAnterior = this.state.quantItem;
    const ListaAdd = [];
    this.state.quantItem = (this.state.quantItem + 20);
    if ((this.state.ListaFiltrada.length > this.state.quantItem)) {
      try {
        for (var i = (quantAnterior); i <= (this.state.quantItem - 1); i++) {
          var loadingAnimated = {loading: false}
          Object.assign(this.state.ListaFiltrada[i], loadingAnimated)
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = this.state.ListaExibida.concat(ListaAdd)
        await this.setState({loadMore: false})
      } catch {}
    } else if (this.state.ListaFiltrada.length < this.state.quantItem) {
      try {
        for (var i = (quantAnterior); i <= (this.state.ListaFiltrada.length - 1); i++) {
          var loadingAnimated = {loading: false}
          Object.assign(this.state.ListaFiltrada[i], loadingAnimated)
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.quantItem = this.state.ListaFiltrada.length;
        this.state.ListaExibida = this.state.ListaExibida.concat(ListaAdd)
        await this.setState({loadMore: false})
      } catch {await this.setState({isLoadingFooter: true})}
    }
  }
  //#endregion

  //#region Atualizando a lista de unidades no Banco de dados
  pegandoListaDePropostaPendentesRefresh = async () => {
    const response = await Vendas.propostasPendentes(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    if(response != null && response != undefined) 
    {
      this.state.ListaPropostas = response
      const Lista = this.state.ListaPropostas
      this.state.ListaPropostas = Lista
      this.state.ListaOriginal = Lista
      this.state.ListaFiltrada = Lista
      this.state.ListaExibida = [];
      const ListaAdd = [];
      if (Lista.length >= 20) {
        for(var i = 0; i <= this.state.quantItem - 1; i++) {
          var loadingAnimated = {loading: false}
          Object.assign(this.state.ListaFiltrada[i], loadingAnimated)
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
      } else {
        for(var i = 0; i <=(Lista.length - 1); i++) {
          var loadingAnimated = {loading: false}
          Object.assign(this.state.ListaFiltrada[i], loadingAnimated)
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        this.state.isLoadingFooter = true
      }
      await this.setVisibilidadeModalLoading(false)
    }
    else
    {
      await this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

  //#region Pressionando o botão sim na modal de option
  pressionandoSim = async (item) => {
    
  }
  //#endregion

  //#region Pressionando o botão não na modal de option
  pressionandoNao = async (item) => {

  }
  //#endregion

  //#region Aprovando proposta
  aprovarProposta = async (item, index) => {
    try {
      const response = await Vendas.aprovarProposta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, parseInt(item.numero))
      if(Math.floor(response.status / 100) == 2)
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Proposta aprovada com sucesso!`
        })
        this.state.ListaOriginal = await this.state.ListaOriginal.filter(proposta => proposta.numero != item.numero)
        this.state.ListaPropostas = await this.state.ListaPropostas.filter(proposta => proposta.numero != item.numero)
        this.state.ListaFiltrada = await this.state.ListaPropostas.filter(proposta => proposta.numero != item.numero)
        this.state.ListaExibida = await this.state.ListaExibida.filter(proposta => proposta.numero != item.numero)
        this.setState({Renderizar: true})
      }
      else
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Falha ao tentar aprovar a proposta, tente novamente!`
        })
        this.state.ListaOriginal[index].loading = false
        this.state.ListaPropostas[index].loading = false
        this.state.ListaFiltrada[index].loading = false
        this.state.ListaExibida[index].loading = false
        this.setState({Renderizar: true})
      }
    } catch {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Falha ao tentar aprovar a proposta, tente novamente!`
      })
      this.state.ListaOriginal[index].loading = false
      this.state.ListaPropostas[index].loading = false
      this.state.ListaFiltrada[index].loading = false
      this.state.ListaExibida[index].loading = false
      this.setState({Renderizar: true})
    }
  }
  //#endregion

  //#region Desaprovar proposta
  desaprovarProposta = async (item, index) => {
    try {
      const response = await Vendas.desaprovarProposta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, parseInt(item.numero))
      if(Math.floor(response.status / 100) == 2)
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Proposta desaprovada com sucesso!`
        })
        this.state.ListaOriginal = await this.state.ListaOriginal.filter(proposta => proposta.numero != item.numero)
        this.state.ListaPropostas = await this.state.ListaPropostas.filter(proposta => proposta.numero != item.numero)
        this.state.ListaFiltrada = await this.state.ListaPropostas.filter(proposta => proposta.numero != item.numero)
        this.state.ListaExibida = await this.state.ListaExibida.filter(proposta => proposta.numero != item.numero)
        this.setState({Renderizar: true})
      }
      else
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Falha ao tentar desaprovar a proposta, tente novamente!`
        })
        this.state.ListaOriginal[index].loading = false
        this.state.ListaPropostas[index].loading = false
        this.state.ListaFiltrada[index].loading = false
        this.state.ListaExibida[index].loading = false
        this.setState({Renderizar: true})
      }
    } catch {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Falha ao tentar desaprovar a proposta, tente novamente!`
        })
        this.state.ListaOriginal[index].loading = false
        this.state.ListaPropostas[index].loading = false
        this.state.ListaFiltrada[index].loading = false
        this.state.ListaExibida[index].loading = false
        this.setState({Renderizar: true})
    }
  }
  //#endregion

  //#endregion

}

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  empresa: state.dadosEmpreendimento.filter(emp => emp.empresa),
  centrodecusto: state.dadosEmpreendimento.filter(emp => emp.centrodecusto),
  ConfigCss: state.configcssApp,
  EmpresaLogada: state.EmpresaLogada,
  StyleGlobal: state.StyleGlobal
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...DadosLeadActions, ...TelaAtualActions, ...LotesActions, ...DadosIntermediacaoActions, ...DadosCorretagemActions, ...DadosFinanciamentoActions, ...TabelaDeVendasActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PropostasPendentes);