//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { View, Text, Animated, Image, TouchableOpacity, Dimensions, ScrollView, FlatList, Keyboard } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
import PushNotification from 'react-native-push-notification';
import Lottie from 'lottie-react-native';
import RnBgTask from 'react-native-bg-thread';
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { CentroDeCusto, Prospect, Identificador } from '../../../services';
//#endregion

//#region Redux
import { DadosUsuarioActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
import Loader from '../../../effects/loader.json';
//#endregion

//#region Componentes
import { Container } from '../../../components';
import { ModalEmpreendimento, ModalLoading } from '../../Modais';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
//#endregion

//#region Chaves de filtragem
const KEYS_TO_FILTERS_LOTES = ['indice', 'subLocal.descricao']
//#endregion

//#endregion

class ReservaLista extends Component {

  //#region Funcoes do componente
  componentDidMount = async () => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      // await this.refreshListaLeads()
    })
    await this.setVisibilidadeModalLoading(true)
    await this.pegandoListaDeUnidades()
  }
  //#endregion

  //#region Model
  state = {
    indicatortabela: false,
    VisibilidadeModalLoading: false,
    ListaUnidades: [],
    ListaOriginal: [],
    ListaFiltrada: [],
    ListaExibida: [],
    DadosRecebidos: [],
    quantItem: 20,
    distanceEnd: null,
    distanceEndInitial: null,
    loadMore: false,
    TermUnidades: '',
    searchTermUnidades: '',
    local: null,
    subLocal: null,
  };
  //#endregion

  //#region View
  render() {
    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
        <ModalLoading visibilidade = {this.state.VisibilidadeModalLoading} onPress = {() => {this.setVisibilidadeLoading(false)}}/>
        {this.state.VisibilidadeModalLoading == false && <>
        <View style = {{ backgroundColor: '#4C773C', height: 128 }}>
          <View
            style = {{
              flexDirection: 'row', 
              alignItems: 'center', 
              width: '100%', 
              justifyContent: 'space-between'
          }}>
            <Icon name = {'keyboard-arrow-left'} color = {'#FFF'} size = {50} style = {{marginTop: 10, marginLeft: 10}}
              onPress = {() => {this.props.navigation.goBack()}}/>
            <Text
              style = {{
                marginTop: 6,
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: 16,
                textAlign: 'center',
                color: '#FFFFFF'
            }}>Unidades Disponíveis</Text>
            <View style = {{width: 50}}></View>
          </View>
          <View
            style = {{
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent:'space-between', 
              backgroundColor: '#FFFFFF', 
              marginHorizontal: 8, 
              height: 48,
              marginVertical: 5 
          }}>
            <SearchInput
              onChangeText = {async (term) => {await this.setState({TermUnidades: term})}}
              style = {{
                paddingVertical: 12,
                paddingHorizontal: 16,
                height: 48,
                width: Dimensions.get('window').width * 0.88
              }}
              placeholder = 'Buscar Unidade'
              placeholderTextColor = '#8F998F'
            />
            <Icon name = 'search' size = {30} color = {'#8F998F'} style = {{marginRight: 5}}/>
          </View>
        </View>
        <ScrollView onLayout = {async (e) => {await this.setState({distanceEnd: e.nativeEvent.layout.height, distanceEndInitial: e.nativeEvent.layout.height})}}
          ref = { (ref) => this.ScrollView = ref } showsVerticalScrollIndicator = {false}
          onScroll={(e) => {
            if ((e.nativeEvent.contentOffset.y >= this.state.distanceEnd) && this.state.loadMore == false) {
              this.setState({isLoadingFooter: true})
              this.carregandoMaisUnidadesParaLista()
              this.state.distanceEnd = e.nativeEvent.contentOffset.y + this.state.distanceEndInitial
            }
        }}>
          <View
            style = {{
              minHeight: Dimensions.get('window').height - 190, 
              borderTopWidth: 0, marginBottom: 20
          }}>
          <FlatList
            ref = {(ref) => this.flatList = ref}
            style = {{marginVertical: 10, marginHorizontal: 8}}
            data = {this.state.ListaExibida}
            keyExtractor = {item => item.id}
            renderItem = {this.renderItem}
            refreshing = {true}
          />
          </View>
        </ScrollView>
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
    
    RnBgTask.runInBackground(async () => {this.searchUpdateUnidades(this.state.TermUnidades)})
  }
  //#endregion

  //#region Pegando a lista de unidades no Banco de dados
  pegandoListaDeUnidades = async () => {
    const response = await Identificador.consulta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    if(response != null && response != undefined) 
    {
      await this.setState({ListaUnidades: response})
      const Lista = this.state.ListaUnidades
      await this.setState({ListaUnidades: Lista});
      await this.setState({ListaOriginal: Lista, ListaFiltrada: Lista});
      this.state.ListaExibida = [];
      const ListaAdd = [];
      if (Lista.length >= 20) {
        for(var i = 0; i <= this.state.quantItem - 1; i++) {
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
    }
    else
    {
      await this.setVisibilidadeModalLoading(false)
      await this.props.navigation.goBack()
    }
  }
  //#endregion

  //#region Filtrando a lista de empreendimento
  searchUpdateEmpreendimento(term) {
    this.setState({searchTermEmpreendimentos: term})
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
          backgroundColor: '#FFFFFF',
          padding: 16,
          width: '100%',
          height: 95,
          borderWidth: 1,
          borderColor: '#E2F2E3',
          marginBottom: 4
      }}>
        <TouchableOpacity activeOpacity = {1}
          onPress = {async () => {}}>
          <View 
            style ={{
              width: '100%', 
              justifyContent: 'space-between', 
              flexDirection: 'row'
          }}>
            <View 
              style = {{
                maxWidth: '40%', 
                flexDirection: 'column', 
                alignItems: 'flex-start'
            }}>
              <Text
                style = {{
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#262825'
              }} numberOfLines = {1} ellipsizeMode = {'tail'}>{item.subLocal['descricao']}</Text>
              <Text
                style = {{
                  fontSize: 10,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#8F998F',
                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Área: {item.area} m²</Text>
              <Text
                style = {{
                  fontSize: 10,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#8F998F',
                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor a vista: {formatoDeTexto.Moeda(parseInt(item.valorAVista * 100))}</Text>
              <Text
                style = {{
                  fontSize: 10,
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  color: '#8F998F',
                }} numberOfLines = {1} ellipsizeMode = {'tail'}>Intermediação: {formatoDeTexto.Moeda(parseInt(item.intermediacao * 100))}</Text>
            </View>
            <View
              style = {{
                flexDirection: 'row', 
                maxWidth: '60%', 
                minWidth: '60%', 
                justifyContent: 'flex-end', 
                alignItems: 'center'
            }}>
              <TouchableOpacity
                style = {{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  marginRight: 10, 
                  backgroundColor: '#FFFFFF',
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#4C773C'
              }}
                onPress = {async () => {
                  if(item.status != 2) {
                    item.status = 2                       
                    this.state.ListaExibida.map(change => {if(((change.indice != item.indice) && (change.indice != -1))) {
                      change.status = 0
                    }})
                    await this.setState({indicatortabela: true, local: item.local['id'], subLocal: item.subLocal['id']})
                    // await this.getTabelaDeVendas();
                    if(await this.state.loading_tabeladevendas == true && await this.state.loading_reserva == true) {
                      // try {this.AnimacaoLoading.reset()} catch{}
                      // await this.setModalVisibleLoading(false)
                      // await this.props.navigation.navigate('TabelaDeVendas', {Lote: item, TabelaDeVendas: this.state.tabelaDeVendas, local: this.state.local, subLocal: this.state.subLocal})
                      // await this.setState({indicatortabela: false})
                    }
                    // await this.setState({Renderizar: this.state.Renderizar})
                  } else if(item.status == 2) {
                    await this.setState({indicatortabela: true, local: item.local['id'], subLocal: item.subLocal['id']})
                    // await this.getTabelaDeVendas();
                    if(await this.state.loading_tabeladevendas == true && await this.state.loading_reserva == true) {
                      // try {this.AnimacaoLoading.reset()} catch{}
                      // await this.setModalVisibleLoading(false)
                      // await this.props.navigation.navigate('TabelaDeVendas', {Lote: item, TabelaDeVendas: this.state.tabelaDeVendas, local: this.state.local, subLocal: this.state.subLocal})
                      // await this.setState({indicatortabela: false})
                    }
                    // await this.setState({Renderizar: this.state.Renderizar})
                  }
                }}>
                <Text
                  style = {{
                    fontSize: 12, 
                    color: '#4C773C',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    textAlign: 'center',
                    alignSelf: 'center',
                    marginVertical: 4,
                    marginHorizontal: 0
              }}>Tabela</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style = {{
                  paddingVertical: 6,
                  paddingHorizontal: 10, 
                  backgroundColor: '#4C773C',
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#4C773C'
                }}
                onPress = {async () => {}}
              >
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
              }}>Reservar</Text>
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
    this.setState({searchTermUnidades: Term})
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
        this.ScrollView.scrollTo({x: 0, y: 0, animated: true})
      } else {
        for(var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, isLoadingFooter: true, distanceEnd: this.state.distanceEndInitial})
        this.ScrollView.scrollTo({x: 0, y: 0, animated: true})
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
        this.ScrollView.scrollTo({x: 0, y: 0, animated: true})
      } else {
        for (var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        await this.setState({ListaExibida: ListaAdd, isLoadingHeader: false, isLoadingFooter: true, distanceEnd: this.state.distanceEndInitial})
        this.ScrollView.scrollTo({x: 0, y: 0, animated: true})
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

  //#endregion

}

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  tela: String(state.telaAtual),
  LotesReservados: state.dadosLotes,
  empresa: state.dadosEmpreendimento.filter(emp => emp.empresa),
  centrodecusto: state.dadosEmpreendimento.filter(emp => emp.centrodecusto),
  Prospect: state.dadosLead,
  StyleGlobal: state.StyleGlobal
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ReservaLista);