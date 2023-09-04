//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, FlatList, TouchableOpacity, Linking, Platform, Modal, Switch } from 'react-native';
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
const KEYS_TO_FILTERS_LOTES = ['subLocal.descricao']
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Identificador, TabelaDeVendas } from "../../../services";
//#endregion

//#region Redux
import { DadosLeadActions, TelaAtualActions, DadosIntermediacaoActions, DadosCorretagemActions, DadosFinanciamentoActions, LotesActions, TabelaDeVendasActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
//#endregion

//#region Componentes
import { Container } from '../../../components';
import { ModalListaLotes, ModalLoading, ModalReservaConfirmada } from '../../Modais';
//#endregion

//#region ArquivosPdf
import cessaoBase64 from "./cessaoBase64.json";
import escrituraBase64 from './escritura.json';
//#endregion

//#endregion

class Informativos extends Component {

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

    let navegar = await this.props.navigation.getParam('Informativos', 'null')
    this.setState({Titulo: navegar.titleMensagem})
    if(navegar.termos == false) {
      this.setVisibilidadeModalLoading(true)
      this.pegandoListaDeUnidades();
    }
    else {
      this.setState({VisibilidadeModalCheckList: true})
    }
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
    VisiblidadeModalReservaConfirmada: false,
    VisibilidadeModalCheckList: false,
    ListaUnidades: [],
    ListaOriginal: [],
    ListaExibida: [],
    ListaFiltrada: [],
    Titulo: '',
    DadosRecebidos: [],
    PDFContrato: "https://www.dga.unicamp.br/Conteudos/Legislacao/OficiosCircularesDGA/Ofi_033_2007.pdf",
    NomeDaUnidade: null,
    Local: null,
    SubLocal: null,
    quantItem: 20,
    distanceEnd: null,
    distanceEndInitial: null,
    loadMore: false,
    TermUnidades: '',
    searchTermUnidades: '',
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
    ID: "",
    valueSwitchTermos: false,
  };
  //#endregion

  //#region View
  render() {
    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
        <ModalListaLotes 
          visibilidade = {this.state.VisibilidadeModalListaLotes}
          keyExtractorFlatList = {item => item.id}
          colorlotes = {this.props.StyleGlobal.cores.background}
          renderEmpreendimento = {this.renderItem}
          filteredEmpreendimento = {this.state.ListaExibida}
          idFlatList = {(ref) => { this.FlatList = ref }}
          onChangeSearch = {(term) => {this.searchUpdateUnidades(term)}}
          onPressVisibilidade = {() => {
            this.setVisibilidadeModalListaLotes(false)
            this.props.navigation.goBack()
          }}
        />
        <Modal // Mostrar PDF de confirmação
          animationType = {'slide'}
          visible = {this.state.VisibilidadeModalCheckList}
          transparent = {false}>
          <View style = {{ flex: 1 }}>
              <View style = {{ height: 85, flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', backgroundColor: this.props.StyleGlobal.cores.background }}>
                  <View>
                    <Icon
                      style = {{ marginLeft: 20 }}
                      name = {'close'}
                      size = {40}
                      color = {'#FFFFFF'}
                      onPress = {() => { 
                        this.setState({ VisibilidadeModalCheckList: false }) 
                        this.props.navigation.goBack(); 
                      }}
                    />
                  </View>
                  <Text style = {{ fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, textAlign: 'center', color: '#FFFFFF' }}>{`Termos`}</Text>
                  <View style = {{width: 40}}/>
              </View>
              <PDFView
                fadeInDuration={250}
                style={{ flex: 1 }}
                resource={this.state.Titulo.includes('escritura') ? escrituraBase64.base64 : cessaoBase64.base64}
                resourceType={"base64"}
                onLoad={() => { }}
                onError={() => { }}
              />
              <View style={{ height: 120, alignItems: 'center', justifyContent: "center", backgroundColor: this.props.StyleGlobal.cores.background }}>
                <View style = {{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style = {{marginLeft: 10}}>
                    <Switch
                      trackColor = {{false: '#CCCCCC99', true: "#FFFFFF"}}
                      onValueChange = {() => {
                        if(this.state.valueSwitchTermos == false)
                        {
                          this.setState({valueSwitchTermos: true})
                          this.setVisibilidadeModalLoading(true)
                          this.pegandoListaDeUnidades();
                        }
                      }}
                      value = {this.state.valueSwitchTermos}
                    />
                  </View>
                  <Text 
                    style = {{
                      width: "80%",
                      flexWrap: "wrap",
                      color: "#FFFFFF", 
                      fontWeight: "bold",
                      marginLeft: 10,
                  }}>{`Eu estou de acordo com todos os termos acima citados.`}</Text>
                </View>
                  <TouchableOpacity
                    style = {{
                      backgroundColor: "#FFFFFF",
                      paddingHorizontal: 16,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: "center",
                      marginBottom: 20,
                      marginTop: 10,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: "#FFFFFF"
                    }}
                    activeOpacity = {1}
                    onPress = {() => {
                      if (this.state.valueSwitchTermos == true) {
                        this.setState({VisibilidadeModalCheckList: false})
                        this.setVisibilidadeModalLoading(true)
                        this.pegandoListaDeUnidades();
                      }
                      else {
                        PushNotification.localNotification({
                          largeIcon: 'icon',
                          smallIcon: 'icon',
                          vibrate: true,
                          vibration: 300,
                          title: 'My Broker',
                          message: `É necessário aceitar os termos!`
                        })
                      }
                    }}>
                      <Text 
                        style = {{
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 16,
                          textAlign: 'center',
                          color: this.props.StyleGlobal.cores.background,
                          alignSelf: 'center',
                    }}>{`Confirmar`}</Text>
                  </TouchableOpacity>
              </View>
          </View>
        </Modal>
        <ModalReservaConfirmada 
          visibilidade = {this.state.VisiblidadeModalReservaConfirmada}
          onPressIcon = {() => {this.setVisibilidadeModalReservaConfirmada(false)}}
          onPressReservarNovoLote = {async () => {
            await this.setVisibilidadeModalReservaConfirmada(false)
            await this.setVisibilidadeModalLoading(true)
            await this.pegandoListaDeUnidades()
          }}
          onPressObrigado = {() => {this.props.navigation.navigate('Menu')}}
        />
        <ModalLoading visibilidade = {this.state.VisibilidadeModalLoading} onPress = {() => {this.setVisibilidadeModalLoading(false)}}/>
        {this.state.VisibilidadeModalLoading == false &&
        <>
        <View
          style = {{
            backgroundColor: this.props.StyleGlobal.cores.background, 
            height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 178 : 168,
            justifyContent: "center" 
        }}>
          <View 
            style = {{
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'space-between'
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
              onChangeText = {async (term) => { await this.searchUpdateUnidades(term) }}
              style = {{
                paddingVertical: 12,
                paddingHorizontal: 16,
                height: 58,
                fontSize: 14,
                width: Dimensions.get('window').width * 0.88
              }}
              fuzzy = {true}
              placeholder = 'Buscar por identificador...'
              placeholderTextColor = '#8F998F'
            />
            <Icon name = 'search' size = {30} color = {'#8F998F'} style = {{marginRight: 5}}/>
          </View>
        </View>
        {/* <ScrollView onLayout = {async (e) => {await this.setState({distanceEnd: e.nativeEvent.layout.height, distanceEndInitial: e.nativeEvent.layout.height})}}
          ref = { (ref) => this.ScrollView = ref } showsVerticalScrollIndicator = {false} scrollEventThrottle = {16}
          onScroll = {(e) => {
            if ((e.nativeEvent.contentOffset.y >= this.state.distanceEnd) && this.state.loadMore == false) {
              this.setState({isLoadingFooter: true})
              this.carregandoMaisUnidadesParaLista()
              this.state.distanceEnd = e.nativeEvent.contentOffset.y + this.state.distanceEndInitial
            }
        }}> */}
          <View
            style = {{
              minHeight: Dimensions.get('window').height - 190, 
              borderTopWidth: 0, marginBottom: 20
          }}>
          <FlatList
            ref = {(ref) => this.flatList = ref}
            style = {{marginVertical: 10, marginHorizontal: 8}}
            data = {this.state.ListaExibida}
            onScroll = {(e) => {
              if ((e.nativeEvent.contentOffset.y >= this.state.distanceEnd) && this.state.loadMore == false) {
                this.setState({isLoadingFooter: true})
                this.carregandoMaisUnidadesParaLista()
                this.state.distanceEnd = e.nativeEvent.contentOffset.y + this.state.distanceEndInitial
              }
            }}
            keyExtractor = {item => String(item.indice)}
            renderItem = {this.renderItem}
            refreshing = {true}
          />
          </View>
        {/* </ScrollView> */}
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
    
    let response = await Identificador.consulta(this.props.token[0].token, this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    

    if(response != null && response != undefined) 
    {
      await this.setState({ListaUnidades: response})
      const Lista = this.state.ListaUnidades
      await this.setState({ListaUnidades: Lista});
      await this.setState({ListaOriginal: Lista, ListaFiltrada: Lista});
      this.state.ListaExibida = [];
      const ListaAdd = [];
      if (Lista.length >= 20) {
        for(var i = 0; i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd})
      } else {
        for(var i = 0; i <=(Lista.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingFooter: true}) 
      }
      if((this.state.DadosRecebidos != "") && (this.state.DadosRecebidos.filter(lotes => (lotes.id != -1 && lotes.status != 2)) == "")) {
        await this.setState({value: true});
      }
      await this.setVisibilidadeModalLoading(false)
      // await this.setVisibilidadeModalListaLotes(true)
    }
    else
    {
      await this.setVisibilidadeModalLoading(false)
      await this.props.navigation.goBack()
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

  //#region Renderizando lista de unidades disponiveis
  renderItem = ({ item, index }) => item.indice != -1 && (
    <>
      <View 
        style = {{
          backgroundColor: item.status == 2 ? '#CCCCCC50' : '#FFFFFF',
          paddingHorizontal: 16,
          width: '100%',
          height: 100,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#E2F2E3',
          marginBottom: 4,
          justifyContent: "center",
          marginVertical: 2,
      }}>
        <TouchableOpacity activeOpacity = {1}
          onPress = {async () => {
            await this.setVisibilidadeModalListaLotes(false)
            await this.setVisibilidadeModalLoading(false)
          }}>
          <View
            style ={{
              width: '100%', 
              justifyContent: 'space-between', 
              flexDirection: 'row'
          }}>
            <View
              style = {{
                maxWidth: '100%', 
                flexDirection: 'column', 
                alignItems: 'flex-start'
            }}>
              <Text
                style = {{
                  fontSize: 14,
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  color: '#262825'
              }} numberOfLines = {1} ellipsizeMode = {'tail'}>{(item.subLocal['descricao'] != "" || item.subLocal['descricao'] != null) ? item.subLocal['descricao'] : ""}</Text>
              <Text
                style = {{
                  fontSize: 10,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#8F998F',
                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Área: {(item.area != "" && item.area != null) ? item.area : ""} m²</Text>
              <Text
                style = {{
                  fontSize: 10,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#8F998F',
                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor a vista: {(item.valorAVista != "" && item.valorAVista != null) ? formatoDeTexto.Moeda(parseInt(item.valorAVista * 100)) : ""}</Text>
              <Text
                style = {{
                  fontSize: 10,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#8F998F',
                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Intermediação: {(item.intermediacao != "" && item.intermediacao != null) ? formatoDeTexto.Moeda(parseInt(item.intermediacao * 100)) : ""}</Text>
            </View>
            <View
              style = {{
                flexDirection: 'row',
                justifyContent: 'flex-end', 
                alignItems: 'center'
            }}>
              <TouchableOpacity
                disabled = {false}
                style = {{
                  paddingVertical: 6,
                  paddingHorizontal: 10, 
                  backgroundColor: this.props.StyleGlobal.cores.background,
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: this.props.StyleGlobal.cores.background,
                }}
                onPress = {async () => {

                  let supported = await  Linking.canOpenURL(`https://wa.me/5562996842423?text=Olá meu nome é *${(this.props.token[0].pessoa.nome).toUpperCase()}*, gostaria de *${`${(this.state.Titulo).toUpperCase()}`}* do meu contrato da unidade *${(item.subLocal['descricao']).toUpperCase()}*, do empreendimento *${(item.centroDeCusto.descricao).toUpperCase()}*, da empresa *${(item.empresa.nomeFantasia).toUpperCase()}*`)
                  
                  if (supported)
                  {

                    await Linking.openURL(`https://wa.me/5562996842423?text=Olá meu nome é *${(this.props.token[0].pessoa.nome).toUpperCase()}*, gostaria de *${`${(this.state.Titulo).toUpperCase()}`}* do meu contrato da unidade *${(item.subLocal['descricao']).toUpperCase()}*, do empreendimento *${(item.centroDeCusto.descricao).toUpperCase()}*, da empresa *${(item.empresa.nomeFantasia).toUpperCase()}*`)
                  }
                  else
                  {
                    PushNotification.localNotification({
                      largeIcon: 'icon',
                      smallIcon: 'icon',
                      vibrate: true,
                      vibration: 300,
                      title: 'My Broker',
                      message: `O whatsapp não pode ser acessado!`
                    })
                  }

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
              }}>Selecione</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
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
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(createFilter(this.state.searchTermUnidades, KEYS_TO_FILTERS_LOTES))
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
    const quantAnterior = this.state.quantItem;
    const ListaAdd = [];
    this.state.quantItem = (this.state.quantItem + 20);
    if ((this.state.ListaFiltrada.length > this.state.quantItem)) {
      try {
        for (var i = (quantAnterior); i <= (this.state.quantItem - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: this.state.ListaExibida.concat(ListaAdd)})
        await this.setState({loadMore: false})
      } catch {}
    } else if (this.state.ListaFiltrada.length < this.state.quantItem) {
      try {
        for (var i = (quantAnterior); i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.quantItem = this.state.ListaFiltrada.length;
        await this.setState({ListaExibida: this.state.ListaExibida.concat(ListaAdd)})
        await this.setState({loadMore: false})
      } catch {await this.setState({isLoadingFooter: true})}
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
            await this.setState({tabelaCorretagemExiste: true, tabelaCorretagem: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
        } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Intermediação') {
            await this.setState({tabelaIntermediacaoExiste: true, tabelaIntermediacao: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
        } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Parcela') {
            await this.setState({tabelaFinaciamentoExiste: true, tabelaFinanciamento: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda, tabelaFinanciamenteOriginal: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda, primeiroVencimentoFinanciamento: (titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda[0].primeiroVencimento).replace('T00:00:00', '')})
        } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Entrada') {
            await this.setState({tabelaEntradasExiste: true, tabelaEntradas: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
        } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Intermediaria') {
          await this.setState({tabelaIntermediariasExiste: true, tabelaIntermediarias: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
        }
      }
      if(await this.state.tabelaCorretagemExiste == true) {
        const positionCorretagem = (this.state.tabelaCorretagem).length - 1;
        await this.setState({valorCorretagem: this.state.tabelaCorretagem[positionCorretagem].valorTotal, IdCorretagem: this.state.tabelaCorretagem[positionCorretagem].qtdeDeTitulos})
      }
      if(await this.state.tabelaIntermediacaoExiste == true) {
        const positionIntermediacao = (this.state.tabelaIntermediacao).length - 1;
        await this.setState({valorImobiliaria: this.state.tabelaIntermediacao[positionIntermediacao].valorTotal, IdIntermediacao: this.state.tabelaIntermediacao[positionIntermediacao].qtdeDeTitulos})
      }
      if(await this.state.tabelaFinaciamentoExiste == true) {
        const positionFinanciamento = (this.state.tabelaFinanciamento).length - 1;
        await this.setState({valorFinancimento: this.state.tabelaFinanciamento[positionFinanciamento].valorTotal, IdFinanciamento: this.state.tabelaFinanciamento[positionFinanciamento].qtdeDeTitulos, valorParcelaDoFinancimento: this.state.tabelaFinanciamento[positionFinanciamento].principal})
        const position = 0;
        for(var i = 0; i <= positionFinanciamento; i++) {
          const proximaposition = position + i;
          if(this.state.tabelaFinanciamento[i].jurosDeTabela >= this.state.tabelaFinanciamento[proximaposition].jurosDeTabela)
          {
            await this.setState({juros: this.state.tabelaFinanciamento[i].jurosDeTabela})
          }
        }
      }
      if(await this.state.tabelaEntradasExiste == true) {
        const positionEntradas = (this.state.tabelaEntradas).length - 1;
        await this.setState({valorDasEntradas: this.state.tabelaEntradas[positionEntradas].valorTotal, IdEntradas: this.state.tabelaEntradas[positionEntradas].qtdeDeTitulos})
      }
      if(await this.state.tabelaIntermediariasExiste == true) {
        const positionIntermediarias = (this.state.tabelaIntermediarias).length - 1;
        await this.setState({valorDasIntermediarias: this.state.tabelaIntermediarias[positionIntermediarias].valorTotal, IdIntermediarias: this.state.tabelaIntermediarias[positionIntermediarias].qtdeDeTitulos})
      }
      await this.setState({identificador: tabela.identificador})
      await this.setState({tabelaCompleta: tabela, dadosLote: this.state.identificador.subLocal, numeroDaTabelaDeVenda: tabela.numero})
      await this.setVisibilidadeModalLoading(false)
      await this.setVisibilidadeModalListaLotes(false)
    }
    else 
    {
      await this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

  //#region Carregando os dados da tabela de venda do lote escolhido
  carregandoDadosDoLote = async () => {
    const Lote = await this.props.navigation.getParam('Lote', 'null');
    const local = await this.props.navigation.getParam('local', 'null');
    const sublocal = await this.props.navigation.getParam('subLocal', 'null')
    const tabela = await this.props.navigation.getParam('TabelaDeVendas', 'null');
    const titulosDaTabelaDeVendas = tabela.classificacoesDosTitulosDaTabelaDeVenda
    for(var i = 0; i < titulosDaTabelaDeVendas.length; i++) {
      if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Corretagem') {
          await this.setState({tabelaCorretagemExiste: true, tabelaCorretagem: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
      } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Intermediação') {
          await this.setState({tabelaIntermediacaoExiste: true, tabelaIntermediacao: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
      } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Parcela') {
          await this.setState({tabelaFinaciamentoExiste: true, tabelaFinanciamento: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda, tabelaFinanciamenteOriginal: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda, primeiroVencimentoFinanciamento: (titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda[0].primeiroVencimento).replace('T00:00:00', '')})
      } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Entrada') {
          await this.setState({tabelaEntradasExiste: true, tabelaEntradas: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
      } else if(titulosDaTabelaDeVendas[i].classificacao.descricao == 'Intermediaria') {
         await this.setState({tabelaIntermediariasExiste: true, tabelaIntermediarias: titulosDaTabelaDeVendas[i].condicoesDaTabelaDeVenda})
      }
    }
    if(await this.state.tabelaCorretagemExiste == true) {
      const positionCorretagem = (this.state.tabelaCorretagem).length - 1;
      await this.setState({valorCorretagem: this.state.tabelaCorretagem[positionCorretagem].valorTotal, IdCorretagem: this.state.tabelaCorretagem[positionCorretagem].qtdeDeTitulos})
    }
    if(await this.state.tabelaIntermediacaoExiste == true) {
      const positionIntermediacao = (this.state.tabelaIntermediacao).length - 1;
      await this.setState({valorImobiliaria: this.state.tabelaIntermediacao[positionIntermediacao].valorTotal, IdIntermediacao: this.state.tabelaIntermediacao[positionIntermediacao].qtdeDeTitulos})
    }
    if(await this.state.tabelaFinaciamentoExiste == true) {
      const positionFinanciamento = (this.state.tabelaFinanciamento).length - 1;
      await this.setState({valorFinancimento: this.state.tabelaFinanciamento[positionFinanciamento].valorTotal, IdFinanciamento: this.state.tabelaFinanciamento[positionFinanciamento].qtdeDeTitulos, valorParcelaDoFinancimento: this.state.tabelaFinanciamento[positionFinanciamento].principal})
      await this.setState({juros: this.state.tabelaFinanciamento[0].jurosDeTabela})
    }
    if(await this.state.tabelaEntradasExiste == true) {
      const positionEntradas = (this.state.tabelaEntradas).length - 1;
      await this.setState({valorDasEntradas: this.state.tabelaEntradas[positionEntradas].valorTotal, IdEntradas: this.state.tabelaEntradas[positionEntradas].qtdeDeTitulos})
    }
    if(await this.state.tabelaIntermediariasExiste == true) {
      const positionIntermediarias = (this.state.tabelaIntermediarias).length - 1;
      await this.setState({valorDasIntermediarias: this.state.tabelaIntermediarias[positionIntermediarias].valorTotal, IdIntermediarias: this.state.tabelaIntermediarias[positionIntermediarias].qtdeDeTitulos})
    }
    await this.setState({identificador: tabela.identificador})
    await this.setState({tabelaCompleta: tabela, Lote: Lote, dadosLote: this.state.identificador.subLocal, SubLocal: sublocal, Local: local, numeroDaTabelaDeVenda: tabela.numero})
    
  }
  //#endregion

  //#region Armazenando a tabela de corretagem, intermediação e da tabela de vendas no redux
  armazenandoTabelasCorretagemIntermediacao = async () => {

      if(this.state.identificador.status == 0) 
      {
        await this.setVisibilidadeModalLoading(true)
        const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), parseInt(this.props.Prospect[0].id), [this.state.identificador])
        if (response != null || response != undefined || response != "")
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
          const navegar = await this.props.navigation.getParam('TabelaDePrecos', 'null')
          if(navegar != null && navegar != 'null')
          {
            return await navegar.onConfirm()
          }
          // await this.props.navigation.navigate('Intermediacao')
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
          return await navegar.onConfirm()
        }
        // await this.props.navigation.navigate('Intermediacao')
      }

    // if(this.props.tela == '@tela_vendadireta')
    // {
    //   if(this.state.identificador.status == 0) 
    //   {
    //     await this.setVisibilidadeModalLoading(true)
    //     const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), parseInt(this.props.Prospect[0].id), [this.state.identificador])
    //     if (response != null || response != undefined || response != "")
    //     {
    //       PushNotification.localNotification({
    //         largeIcon: 'icon',
    //         smallIcon: 'icon',
    //         vibrate: true,
    //         vibration: 300,
    //         title: 'My Broker',
    //         message: `Reserva realizada com sucesso`
    //       })
    //       const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
    //       addToCorretagem(this.state.tabelaCorretagem)
    //       addToIntermediacao(this.state.tabelaIntermediacao)
    //       addToFinanciamento(this.state.tabelaFinanciamento)
    //       addToLotes(this.state.identificador)
    //       addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })
    //       await this.setVisibilidadeModalLoading(false)
    //       await this.props.navigation.navigate('Intermediacao')
    //     }
    //   }
    //   else
    //   {
    //     const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
    //     addToCorretagem(this.state.tabelaCorretagem)
    //     addToIntermediacao(this.state.tabelaIntermediacao)
    //     addToFinanciamento(this.state.tabelaFinanciamento)
    //     addToLotes(this.state.identificador)
    //     addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })
    //     await this.setVisibilidadeModalLoading(false)
    //     await this.props.navigation.navigate('Intermediacao')
    //   }
    // }
    // else
    // {
    //   PushNotification.localNotification({
    //     largeIcon: 'icon',
    //     smallIcon: 'icon',
    //     vibrate: true,
    //     vibration: 300,
    //     title: 'My Broker',
    //     message: `Permitido somente a reserva do lote.`
    //   })
    // }
  }
  //#endregion

  //#region Executando a reserva do lote
  reservandoLote = async () => {
    await this.setVisibilidadeModalLoading(true)
    const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), parseInt(this.props.Prospect[0].id), [this.state.identificador])
    if (response != null || response != undefined || response != "")
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Reserva realizada com sucesso`
      })
      await this.setVisibilidadeModalLoading(false)
      await this.props.navigation.navigate('Menu')
    }
  }
  //#endregion

  //#region Executando a reserva por meio da lista de lotes
  reservandoListaLote = async (item) => {
    await this.setVisibilidadeModalLoading(true)
    const response = await Identificador.cadastrarReserva(String(this.props.token[0].token), parseInt(this.props.Prospect[0].id), [item])
    if (response != null || response != undefined || response != "")
    {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Reserva realizada com sucesso"`
      })
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
  StyleGlobal: state.StyleGlobal,
  EmpresaLogada: state.EmpresaLogada,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({...DadosIntermediacaoActions, ...DadosCorretagemActions, ...DadosFinanciamentoActions, ...LotesActions, ...TabelaDeVendasActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Informativos);