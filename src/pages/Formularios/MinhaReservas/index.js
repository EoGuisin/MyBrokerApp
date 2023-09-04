//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Linking, Keyboard, View, Text, Animated, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
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
import { DadosLeadActions, TelaAtualActions, LotesActions, DadosIntermediacaoActions, DadosCorretagemActions, DadosFinanciamentoActions, TabelaDeVendasActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
//#endregion

//#region Componentes
import { Container } from '../../../components';
import { ModalLoadingGoBack, ModalLoading } from '../../Modais';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
//#endregion

//#endregion

class MinhasReservas extends Component {
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
      await this.setVisibilidadeModalLoading(true)
      await this.pegandoListaDeUnidades()
    })
    await this.setVisibilidadeModalLoadingGoBack(true)
    await this.pegandoListaDeUnidades()
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
    VisibilidadeModalProspect: false,
    VisibilidadeModalTabelaDePrecos: false,
    VisibilidadeModalOption: false,
    ListaUnidades: [],
    ListaOriginal: [],
    ListaFiltrada: [],
    ListaExibida: [],
    LocaisDeCaptacao: [],
    quantItem: 20,
    distanceEnd: null,
    distanceEndInitial: null,
    loadMore: false,
    TermLeads: '',
    searchTermLeads: '',
    Nome: null,
    Email: null,
    TelefoneP: null,
    finalidade: null,
    IdProspect: [],
    dadosProspect: [],
    dadosLote: [],
    NomeDaUnidade: null,
    lotereservado: [],
    Local: null,
    SubLocal: null,
    identificador: [],
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
    isLoadingHeader: true,
    ID: "",
    scrollFlatY: new Animated.Value(0)
  };
  //#endregion

  //#region View
  render() {

    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
        <Modal // Tabela de precos
          visible = {this.state.VisibilidadeModalTabelaDePrecos}
          transparent = {false}
          animationType = {"slide"}
        >
          <View style = {{flex: 1, justifyContent: 'space-between'}}>
            <ScrollView  ref = {(ref) => this.ScrollViewTabelaPrecos = ref} showsVertiscalScrollIndicator = {false}
            >
              <View style = {{
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
                    <Icon name = {'close'} color = {this.props.StyleGlobal.cores.background} size = {30} style = {{marginTop: 10, marginLeft: 20}}
                      onPress = { () => {this.setVisibilidadeModalTabelaDePrecos(false)}}/>
                    <Text
                      style = {{
                        marginTop: 6,
                        fontStyle: 'normal',
                        fontWeight: '500',
                        fontSize: 12,
                        textAlign: 'center',
                        color: this.props.StyleGlobal.cores.background
                    }}>Tabela de Preços</Text>
                    <View style = {{width: 50}}></View>
                  </View>
                </View>
                <View style = {{ paddingHorizontal: 24, marginBottom: 15 }}>
                  <View // nome da unidade e area
                    style = {{flexDirection: 'row', alignItems: 'center'}}>
                    <View style = {{flex: 1, marginRight: 20}}>
                      <Text style = {{color: this.props.StyleGlobal.cores.background, fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, fontWeight: 'bold', fontStyle: 'normal'}}>{'Unidade'}</Text>
                      <TouchableOpacity style = {{marginTop: 8, marginLeft: 5, height: Dimensions.get('window').height <= 650 ? 20 : 25, justifyContent: 'center', borderWidth: 1, borderColor: '#cdcdcd'}}
                        onPress = {() => {}}>
                        <Text style = {{marginLeft: 5, fontSize: Dimensions.get('window').height <= 650 ? 10 : 10, fontStyle: 'normal', fontWeight: 'normal'}}>{this.state.NomeDaUnidade}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style = {{marginTop: 5}}>
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
                        <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 12}}>{this.state.identificador != "" ? formatoDeTexto.FormatarTexto((this.state.identificador.valorAVista)) : ""}</Text>
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
                          <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{(this.state.tabelaCorretagem != "" && this.state.tabelaIntermediacao != "") ? formatoDeTexto.FormatarTexto((this.state.tabelaIntermediacao[this.state.tabelaIntermediacao.length - 1].valorTotal) + (this.state.tabelaCorretagem[this.state.tabelaCorretagem.length - 1].valorTotal)) : ""}</Text>
                        </View>
                      </View>
                      <View // corretor
                        style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5}}>
                        <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 5, backgroundColor: '#808080', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                          <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{'Corretor'}</Text>
                        </View>
                        {this.state.tabelaCorretagem.map(corretor => (
                          <View key = {corretor.qtdeDeTitulos} style = {{height: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                            <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{formatoDeTexto.FormatarTexto((corretor.principal))}</Text>
                          </View>
                        ))}
                      </View>
                      <View // imobiliaria à vista
                        style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5}}>
                        <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 5, backgroundColor: '#808080', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                          <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{'Imobiliária à vista'}</Text>
                        </View>
                        <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                          <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{this.state.tabelaIntermediacao != "" ? formatoDeTexto.FormatarTexto((this.state.tabelaIntermediacao[parseInt(this.state.tabelaIntermediacao.length - 1)].valorTotal)) : ""}</Text>
                        </View>
                      </View>
                      <View // imobiliaria em X vezes
                        style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5}}>
                        <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 5, backgroundColor: '#808080', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                          <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{this.state.tabelaIntermediacao != "" ? `ou imobiliária em ${this.state.tabelaIntermediacao.length}x` : ""}</Text>
                        </View>
                        <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eeeeee', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                          <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}}>{this.state.tabelaIntermediacao != "" ? formatoDeTexto.FormatarTexto(((this.state.tabelaIntermediacao[parseInt(this.state.tabelaIntermediacao.length - 1)].principal))) : ""}</Text>
                        </View>
                      </View>
                      <View // observacoes sobre a comissao
                        style = {{backgroundColor: '#f2f2f2', paddingVertical: 9, paddingLeft: 10}}>
                        <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 8 : 10, lineHeight: 14}}>{`* A comissão${'\n'}imobiliária não${'\n'}integra o valor do${'\n'}lote e será paga em${'\n'}contrato específico.`}</Text>
                      </View>
                      {this.props.EmpresaLogada[0] == 4 &&
                      <TouchableOpacity style = {{marginLeft: 8, marginTop: 8, backgroundColor: '#dbdee7', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 5, marginRight: 8, borderColor: '#85868a', borderWidth: 1}}
                        onPress = {() => {this.openLinking('http://harmoniaurbanismo.ddns.net:2601/mapas/MapaVillaImperial.pdf')}}>
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
                                <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.FormatarTexto((parcelamento.principal))}</Text>
                              </View>
                            </View>
                            <View // valor total parcelado
                              style = {{marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5, flex: 1, width: '60%'}}>
                              <View style = {{height: Dimensions.get('window').height <= 650 ? 12 : 20, paddingHorizontal: 0, backgroundColor: this.props.StyleGlobal.cores.background, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                                <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: 'normal', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}} numberOfLines = {1} ellipsizeMode = {'tail'}>Total do lote em {parcelamento.qtdeDeTitulos}x</Text>
                              </View>
                              <View style = {{height: Dimensions.get('window').height <= 650 ? 20 : 25, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 5, borderBottomRightRadius: 5}}>
                                <Text style = {{color: '#262825', fontSize: Dimensions.get('window').height <= 650 ? 10 : 10}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.FormatarTexto((parcelamento.valorTotal))}</Text>
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
              style = {{
                paddingHorizontal: 24, 
                flexDirection: 'row', 
                marginBottom: Dimensions.get('window').height <= 650 ? 5 : 5, 
                justifyContent: 'center'
            }}>
              {(this.state.identificador.status == 0 || this.state.identificador.status == 2) &&
              <TouchableOpacity
                style = {{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: this.props.StyleGlobal.cores.background,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: Dimensions.get('window').height <= 650 ? 5 : 10,
                  width: '25%',
                  borderRadius: 5,
                  marginBottom: 10
                }}
                onPress = {async () => {
                  this.state.lotereservado = this.state.identificador
                  await this.disponibilizando_reservando_Lote()
                }}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: Dimensions.get('window').height <= 650 ? 10 : 12,
                    textAlign: 'center',
                    color: this.props.StyleGlobal.cores.background,
                    alignSelf: 'center',
                }}>{this.state.identificador.status == 2 ? "Disponibilizar" : "Reservar"}</Text>
              </TouchableOpacity>}
              {(this.props.tela != "@tela_reserva") &&
              <TouchableOpacity
                style = {{
                  flex: 1,
                  backgroundColor: this.props.StyleGlobal.cores.background,
                  alignItems: 'center',
                  justifyContent: 'center',                
                  marginLeft: (this.state.identificador.status == 0 || this.state.identificador.status == 2 ) ? 40 : 0,
                  padding: Dimensions.get('window').height <= 650 ? 5 : 10,
                  width: '25%',
                  borderRadius: 5,
                  marginBottom: 10
                }}
                onPress = {this.armazenandoTabelasCorretagemIntermediacao}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: Dimensions.get('window').height <= 650 ? 10 : 12,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    alignSelf: 'center',
                }}>Proposta</Text>
              </TouchableOpacity>}
            </View>
          </View>
        </Modal>
        <ModalLoading visibilidade = {this.state.VisibilidadeModalLoading} 
          onPress = {async () => {
            await Identificador.cancelRequest(true)
            await this.setVisibilidadeModalLoading(false)
        }}/>
        <ModalLoadingGoBack
          visibilidade = {this.state.VisibilidadeModalLoadingGoBack}
          onPress = {async () => {
            await Identificador.cancelRequest(true)
            await this.setVisibilidadeModalLoadingGoBack(false)
            await this.props.navigation.goBack()
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
              width: '100%', 
              justifyContent: 'space-between',
              marginTop: 10
          }}>
            <Icon name = {'keyboard-arrow-left'} color = {'#FFF'} size = {40}
              onPress = {() => {this.props.navigation.goBack()}}/>
            <Text
              style = {{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 14,
                textAlign: 'center',
                color: '#FFFFFF'
            }}>Minhas reservas</Text>
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
              onChangeText = {(term) => {this.searchUpdateLeads(term)}}
              style = {{
                paddingHorizontal: 16,
                height: 58,
                fontSize: 14,
                width: Dimensions.get('window').width * 0.88
              }}
              placeholder = 'Pesquise aqui pelo identificador...'
              placeholderTextColor = '#8F998F'
            />
            <Icon name = 'search' size = {30} color = {'#8F998F'} style = {{marginRight: 5}}/>
          </View>
        </View>
        <Animated.FlatList
          ref = {(ref) => this.flatList = ref}
          style = {{marginVertical: 10, marginHorizontal: 8}}
          onScroll = {Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollFlatY}}}],
            {useNativeDriver: true}
          )}
          showsVerticalScrollIndicator = {false}
          onEndReached = { async () => {
            this.setState({loadMore: true})
            this.state.loadMore = true
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
                    backgroundColor: '#FFFFFF',
                    paddingHorizontal: 16,
                    width: '100%',
                    height: 100,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: 'rgba(16, 22, 26, 0.15)',
                    justifyContent: "center",
                    marginVertical: 2,
                    opacity
                  }, {transform: [{scale}]}
                ]}>
                  <TouchableOpacity activeOpacity = {1}
                    onPress = {async () => {}}>
                    <View
                      style ={{
                        width: '100%', 
                    }}>
                      <View style = {{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                        <View
                          style = {{
                            width: '100%', 
                            flexDirection: 'column', 
                            alignItems: 'flex-start',
                            marginLeft: 30
                        }}>
                          <Text
                            style = {{
                              fontSize: 14,
                              fontStyle: 'normal',
                              fontWeight: 'bold',
                              color: '#262825',
                              flexWrap: 'wrap',
                          }}>{(item.subLocal['descricao'] != "" || item.subLocal['descricao'] != null) ? item.subLocal['descricao'] : ""}</Text>
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
                            alignItems: 'center'
                        }}>
                          <View style = {{marginBottom: 10, marginRight: 10, width: 20, borderRadius: 20, backgroundColor: item.status == 2 ? 'red' : '#3C896D', alignItems: 'center'}}>
                            <Text style = {{color: '#FFFFFF'}}>{item.status == 2 ? 'R' : 'D'}</Text>
                          </View>
                          <View>
                            {item.area != '' && item.area != null &&
                            <Text
                              style = {{
                                fontSize: 8,
                                fontStyle: 'normal',
                                fontWeight: 'normal',
                                color: '#8F998F',
                              }} numberOfLines = {1} ellipsizeMode = {'tail'}>Área: {(item.area != "" && item.area != null) ? item.area : ""} m²</Text>}
                            {item.valorAVista != '' && item.valorAVista != null &&
                            <Text
                              style = {{
                                fontSize: 8,
                                fontStyle: 'normal',
                                fontWeight: 'normal',
                                color: '#8F998F',
                              }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor a vista: {(item.valorAVista != "" && item.valorAVista != null) ? formatoDeTexto.FormatarTexto((item.valorAVista)) : ""}</Text>}
                            {item.intermediacao != '' && item.intermediacao != null &&
                            <Text
                              style = {{
                                fontSize: 8,
                                fontStyle: 'normal',
                                fontWeight: 'normal',
                                color: '#262825',
                              }} numberOfLines = {1} ellipsizeMode = {'tail'}>Intermediação: {(item.intermediacao != "" && item.intermediacao != null) ? formatoDeTexto.FormatarTexto((item.intermediacao)) : ""}</Text>}
                          </View>
                        </View>
                        <View 
                          style = {{
                            flexDirection: 'row',
                            justifyContent: 'flex-end', 
                            alignItems: 'center',
                            paddingRight: 10,
                          }}>
                          {(this.props.EmpresaLogada[0] == 4 || this.props.EmpresaLogada[0] == 4 || this.props.EmpresaLogada[0] == 8) &&
                          <TouchableOpacity
                            style = {{
                              paddingVertical: 6,
                              paddingHorizontal: 10,
                              marginRight: 10, 
                              backgroundColor: '#FFFFFF',
                              flexDirection: 'row',
                              borderWidth: 1,
                              borderColor: this.props.StyleGlobal.cores.botao,
                              borderRadius: 5
                          }}
                            onPress = {async () => {
                              this.state.lotereservado = item
                              await this.acessandoProximaTela(item) 
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
                          }}>{item.status == 2 ? 'Disponibilizar' : 'Reservar'}</Text>
                          </TouchableOpacity>}
                          {(this.props.EmpresaLogada[0] == 4 || this.props.EmpresaLogada[0] == 4 || this.props.EmpresaLogada[0] == 8) &&
                          <TouchableOpacity
                          disabled = {false}
                            style = {{
                              paddingVertical: 6,
                              paddingHorizontal: 10, 
                              backgroundColor: this.props.StyleGlobal.cores.botao,
                              flexDirection: 'row',
                              borderWidth: 1,
                              borderColor: this.props.StyleGlobal.cores.botao,
                              borderRadius: 5
                            }}
                            onPress = {async () => {
                              this.state.NomeDaUnidade = item.subLocal['descricao']
                              this.state.Local = item.local['id']
                              this.state.SubLocal = item.subLocal['id']
                              await this.setVisibilidadeModalLoading(true)
                              await this.pegandoTabelaDePrecos();
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
                          }}>Tabela</Text>
                          </TouchableOpacity>}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
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
    this.focusListener.remove()
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow = async () => {
    this.state.keyboardDidShow == false ? await this.setState({keyboardDidShow: true}) : await this.setState({keyboardDidShow: true})
  }

  _keyboardDidHide = async () => {
    
    this.setState({isLoadingHeader: true, keyboardDidShow: false, loadMore: false})
    
    RnBgTask.runInBackground(async () => {this.searchUpdateLeads(this.state.TermLeads)})
  }
  //#endregion

  //#region Pegando a lista de unidades no Banco de dados
  pegandoListaDeUnidades = async () => {
    const response = await Identificador.minhasreservas(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    if(response != null && response != undefined)
    {
      this.state.ListaUnidades = response
      const Lista = this.state.ListaUnidades
      this.state.ListaUnidades = Lista
      this.state.ListaOriginal = Lista
      this.state.ListaFiltrada = Lista
      this.state.ListaExibida = [];
      const ListaAdd = [];
      if (Lista.length >= 20) {
        for(var i = 0; i <= this.state.quantItem - 1; i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
      } else {
        for(var i = 0; i <=(Lista.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        this.state.isLoadingFooter = true 
      }
      this.state.VisibilidadeModalLoadingGoBack = false
      await this.setVisibilidadeModalLoading(false)
    }
    else
    {
      this.state.VisibilidadeModalLoadingGoBack = false
      await this.setVisibilidadeModalLoading(false)
      await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Atualizando a lista de unidades no Banco de dados
  pegandoListaDeUnidadesRefresh = async () => {
    const response = await Identificador.minhasreservas(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    if(response != null && response != undefined) 
    {
      this.state.ListaUnidades = response
      const Lista = this.state.ListaUnidades
      this.state.ListaUnidades = Lista
      this.state.ListaOriginal = Lista
      this.state.ListaFiltrada = Lista
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      this.state.distanceEnd = null;
      this.state.distanceEndInitial = null;
      this.state.loadMore = false;
      const ListaAdd = [];
      if (Lista.length >= 20) {
        for(var i = 0; i <= this.state.quantItem - 1; i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
      } else {
        for(var i = 0; i <=(Lista.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        this.state.isLoadingFooter = false 
      }
      await this.setVisibilidadeModalLoading(false)
    }
    else
    {
      await this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

  //#region Atualizando a lista de unidades no Banco de dados Tabela
  pegandoListaDeUnidadesRefreshTabela = async () => {
    const response = await Identificador.minhasreservas(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    if(response != null && response != undefined) 
    {
      this.state.ListaUnidades = response
      const Lista = this.state.ListaUnidades
      this.state.ListaUnidades = Lista
      this.state.ListaOriginal = Lista
      this.state.ListaFiltrada = Lista
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      this.state.distanceEnd = null;
      this.state.distanceEndInitial = null;
      this.state.loadMore = false;
      const ListaAdd = [];
      if (Lista.length >= 20) {
        for(var i = 0; i <= this.state.quantItem - 1; i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
      } else {
        for(var i = 0; i <=(Lista.length - 1); i++) {
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

  //#region Pegando a tabela de preços de uma unidade em especifico no banco de dados
  pegandoTabelaDePrecos = async () => {
    const response = await TabelaDeVendas.consulta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, this.state.Local, this.state.SubLocal)
    if(response != null && response != undefined) 
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
            this.state.tabelaFinanciamenteOriginal = titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda
            this.state.primeiroVencimentoFinanciamento = (titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda[0].primeiroVencimento).replace('T00:00:00', '')
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
      await this.setVisibilidadeModalTabelaDePrecos(true)
    }
    else 
    {
      await this.setVisibilidadeModalLoading(false)
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
    await this.setState({ VisibilidadeModalLoadingGoBack: value })
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
  searchUpdateLeads = async (Term) => {
    await this.setState({searchTermLeads: Term, TermLeads: Term})
    if (Term == '') {
      this.state.ListaFiltrada = [];
      this.state.ListaExibida = [];
      this.state.quantItem = 20;
      this.state.ListaFiltrada = this.state.ListaOriginal
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
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(lote => (lote.subLocal['descricao']).includes(this.state.searchTermLeads))
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

  //#region Carregando mais unidades para lista
  carregandoMaisReservasParaLista = async () => {
    this.setState({loadMore: true})
    this.state.loadMore = true
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

  //#region Armazenando a tabela de corretagem, intermediação e da tabela de vendas no redux
  armazenandoTabelasCorretagemIntermediacao = async () => {

    if(this.state.identificador.status == 0) {
      const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
      addToCorretagem(this.state.tabelaCorretagem)
      addToIntermediacao(this.state.tabelaIntermediacao)
      addToFinanciamento(this.state.tabelaFinanciamento)
      addToLotes(this.state.identificador)
      addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })
      const navegar = await this.props.navigation.getParam('MinhasReservas', 'null')
      if(navegar != null && navegar != 'null')
      {
        await this.setVisibilidadeModalTabelaDePrecos(false)
        return await navegar.onProposta()
      }
    }
    else if (this.state.identificador.status == 2)
    {
      console.log(this.state.identificador.reservaVinculada.prospectId)
      const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
      addToCorretagem(this.state.tabelaCorretagem)
      addToIntermediacao(this.state.tabelaIntermediacao)
      addToFinanciamento(this.state.tabelaFinanciamento)
      addToLotes(this.state.identificador)
      addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })
      
      if(this.state.identificador.reservaVinculada.prospectId == null) 
      {
        const navegarProposta = await this.props.navigation.getParam('MinhasReservas', 'null')
        if(navegarProposta != null && navegarProposta != 'null')
        {
          await this.setVisibilidadeModalTabelaDePrecos(false)
          return await navegarProposta.onProposta()
        }
      } 
      else
      {
        try {
          await this.setVisibilidadeModalLoading(true)
          const response = await Prospect.consulta(String(this.props.token[0].token), parseInt(this.state.identificador.reservaVinculada.prospectId))
          if(response != null && response != undefined && response != "")
          {
            const { addToLead } = this.props;
            addToLead(response);
            const navegar = await this.props.navigation.getParam('MinhasReservas', 'null')
            {
              if(this.state.tabelaCorretagemExiste == true)
              {
                this.state.VisibilidadeModalTabelaDePrecos = false
                await this.setVisibilidadeModalLoading(false)
                return await navegar.onIntermediacao()
              }
              else
              {
                this.state.VisibilidadeModalTabelaDePrecos = false
                await this.setVisibilidadeModalLoading(false)
                return await navegar.onReservado()
              }
            }
          }
        } catch {
            await this.setVisibilidadeModalLoading(false)
        }
      }
    }
  }
  //#endregion

  //#region Executando a reserva ou disponibilização do lote
  disponibilizando_reservando_Lote = async () => {
    const { addToLotes } = this.props;

    if(this.state.identificador.status == 2) 
    {
      try {
        await this.setVisibilidadeModalLoading(true)
        const response = await Identificador.deletar(String(this.props.token[0].token), [this.state.identificador])
        if (response != null && response != "" && response != undefined) 
        {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Lote disponibilizado com sucesso`
          })
          await this.setVisibilidadeModalTabelaDePrecos(false)
          await this.pegandoListaDeUnidadesRefreshTabela()
        }
      } catch {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Não foi possível disponibilizar, tente novamente`
        })
        await this.setVisibilidadeModalLoading(false)
      }
    }
    else
    {
      await this.setVisibilidadeModalOption(true)
    }
  }
  //#endregion

  //#region Acessando a proxima tela para executar a reserva ou executando a disponibilização do lote
  acessandoProximaTela = async (item) => {
    const { addToLotes } = this.props;
    if(item.status == 2) 
    {
      try {
        await this.setVisibilidadeModalLoading(true)
        const response = await Identificador.deletar(String(this.props.token[0].token), [item])
        if (response != null && response != "" && response != undefined) 
        {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Lote disponibilizado com sucesso`
          })
          await this.pegandoListaDeUnidadesRefresh()
        }
      } catch {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Não foi possível disponibilizar, lote está reservado em nome de outra pessoa.`
        })
        await this.setVisibilidadeModalLoading(false)
      }
    }
    else
    {
      await this.setVisibilidadeModalOption(true)
    }
  }
  //#endregion

  //#region Pressionando o botão sim na modal de option
  pressionandoSim = async (item) => {
    const { addToLotes } = this.props;

    if(item.status == 2) 
    {
      try {
        await this.setVisibilidadeModalLoading(true)
        const response = await Identificador.deletar(String(this.props.token[0].token), [item])
        if (response != null && response != "" && response != undefined) 
        {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Lote disponibilizado com sucesso`
          })
          await this.pegandoListaDeUnidadesRefresh()
        }
      } catch {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Não foi possível disponibilizar, lote está reservado em nome de outra pessoa.`
        })
        await this.setVisibilidadeModalLoading(false)
      }
    }
    else
    {
      const navegar = await this.props.navigation.getParam('MinhasReservas', 'null')
      if(navegar != null && navegar != 'null')
      {
        addToLotes(item)
        this.state.VisibilidadeModalTabelaDePrecos = false
        await this.setVisibilidadeModalOption(false)
        return await navegar.onConfirm()
      }
    }
  }
  //#endregion

  //#region Pressionando o botão não na modal de option
  pressionandoNao = async (item) => {
    const { addToLotes } = this.props;

    if(item.status == 2) 
    {
      try {
        await this.setVisibilidadeModalLoading(true)
        const response = await Identificador.deletar(String(this.props.token[0].token), [item])
        if (response != null && response != "" && response != undefined) 
        {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Lote disponibilizado com sucesso`
          })
          await this.pegandoListaDeUnidadesRefresh()
        }
      } catch {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Não foi possível disponibilizar, lote está reservado em nome de outra pessoa.`
        })
        await this.setVisibilidadeModalLoading(false)
      }
    }
    else
    {
      try {
        this.state.VisibilidadeModalOption = false
        this.state.VisibilidadeModalTabelaDePrecos = false
        await this.setVisibilidadeModalLoading(true)
        const response = await Identificador.cadastrarReservaCorretor(String(this.props.token[0].token), [item])
        if (response != null && response != "" && response != undefined) 
        {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Lote reservado com sucesso`
          })
          await this.setVisibilidadeModalReservaConfirmada(true)
        }
      } catch {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Não foi possível reservar, tente novamente mais tarde.`
        })
        await this.setVisibilidadeModalLoading(false)
      }
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
  empresa: state.dadosEmpreendimento.filter(emp => emp.empresa),
  centrodecusto: state.dadosEmpreendimento.filter(emp => emp.centrodecusto),
  ConfigCss: state.configcssApp,
  EmpresaLogada: state.EmpresaLogada,
  StyleGlobal: state.StyleGlobal
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...DadosLeadActions, ...TelaAtualActions, ...LotesActions, ...DadosIntermediacaoActions, ...DadosCorretagemActions, ...DadosFinanciamentoActions, ...TabelaDeVendasActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MinhasReservas);