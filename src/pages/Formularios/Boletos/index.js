//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Animated, TouchableOpacity, Dimensions, FlatList, TextInput, Platform, Modal } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PushNotification from 'react-native-push-notification';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';
import RNShareFile from 'react-native-share-pdf';
import PDFView from 'react-native-view-pdf';
import SvgUri from 'react-native-svg-uri';
import Svg from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Identificador, BoletosAPI } from '../../../services';
//#endregion

//#region Redux
import { TelaAtualActions, DadosUsuarioActions, DadosEmpreendimentoActions, DadosMeiosDeContatoActions, DadosModeloDeVendasActions, EntradasActions, IntermediariasActions, ParcelasActions, LotesActions, ClienteActions, ConjugeActions, EnderecoActions, TelefonesActions, DocumentosOriginaisActions, DocumentosActions, DocumentosConjugeActions, CargosActions, TabelaFIPActions, DadosLeadActions, DadosCorretagemActions, DadosIntermediacaoActions, DadosTabelaParcelasActions, TabelaDeVendasActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
import Loader from '../../../effects/loader.json';
//#endregion

//#region Componentes
import { ContainerMenu, ContainerScroll, Logo, TextCargo, TextNome, TextTitulo, OpcaoMenuIcon, OpcaoMenuImage, TextInputData } from '../../../components';
import { ModalLoading, ModalListaLotes } from '../../Modais';
import {
    AlinhamentoHorizontal,
    ContainerOpcoesMenu,
    ContentQuadroResumo,
    Atendente,
    CircleItem,
    CircleScrollTo,
    ScrollContainerOpcoesMenu,
    OpcoesMenu,
    QuadroResumoDoCorretor,
    InformacoesSuperior,
    InformacoesInferior,
    TotalEmVendas,
    TotalEmComissao,
    TotalDeAprovacao,
    PropostasAtivas,
    Vendas,
    TituloInfo,
    DescricaoInfo,
    AtividadesRecentes,
    AlinhamentoDoIcone
} from './styles';
//#endregion

//#region path Cargos
const pathCargos = `${RNFetchBlob.fs.dirs.MainBundleDir}/cargos${new Date().getMonth()}_${new Date().getFullYear()}.json`;
// const pathTabelaFIP = `${RNFetchBlob.fs.dirs.MainBundleDir}/tabelaFIP${new Date().getMonth()}_${new Date().getFullYear()}.json`;
//#endregion

//#region Imagens
import LogoDeFundo from '../../../assets/logomenu.png';
import IconEmpresa from '../../../assets/IconMyBroker.svg';
// import IconEmpresaGAV from '../../../assets/LogoBrancaGAV.svg';
import IconEmpresaGAV from '../../../assets/MyBrokerBranca.svg';
import IconEmpresaHarmonia from '../../../assets/HarmoniaLogo.svg';
import IconEmpresaSilvaBranco from '../../../assets/SilvaBrancoLogo.svg';
import IconMyBroker from '../../../assets/MyBrokerBranca.svg';
//#endregion

//#endregion

class Boletos extends Component {

    //#region Funcoes do componente
    componentDidMount = async () => {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', async () => { })
        await this.setVisibilidadeModalLoading(true)
        await this.pegandoListaDeUnidades();
    }
    //#endregion

    //#region Model
    state = {
        DadosDoQuadroResumo: [{
            id: 'Total pago',
            valor: 0
        },
        {
            id: 'Total a pagar',
            valor: 0
        },
        {
            id: 'Percentual pago',
            valor: 0
        },
        {
            id: 'Titulos inadiplentes',
            valor: 0
        },
        {
            id: "Custas em aberto",
            valor: 0
        }
        ],
        DadosDoQuadroResumoTeste2: [

        ],
        DadosDoQuadroResumoTeste: [{
            id: 0,
            name: 'Saldo devedor',
            valor: 'R$ 10.000,00'
        },
        {
            id: 1,
            name: 'Total negociado',
            valor: 'R$ 20.000,00'
        },
        {
            id: 2,
            name: 'Boletos pendentes',
            valor: '10'
        },
        ],
        DadosAtividadesView: [{
            id: 1,
            data: '10/10/1010',
            cargo: 'ankkklc',
            nome: 'Lucas'
        },
        {
            id: 2,
            data: '10/10/1110',
            cargo: 'ankkklc',
            nome: 'Lucas'
        },
        {
            id: 3,
            data: '10/10/1210',
            cargo: 'ankkklc',
            nome: 'Lucas'
        },
        {
            id: 4,
            data: '10/10/1310',
            cargo: 'ankkklc',
            nome: 'Lucas'
        },
        {
            id: 5,
            data: '10/10/1410',
            cargo: 'ankkklc',
            nome: 'Lucas'
        },
        {
            id: 6,
            data: '10/10/1510',
            cargo: 'ankkklc',
            nome: 'Lucas'
        },
        {
            id: 7,
            data: '10/10/1610',
            cargo: 'ankkklc',
            nome: 'Lucas'
        }
        ],
        AnimatedData: new Animated.Value(114),
        VisibilidadeModalListaLotes: false,
        VisibilidadeModalLoading: false,
        VisibilidadeModalPDF: false,
        ValorAnimadoOpcoesMenu: new Animated.Value(65),
        NomeDoIconeParaAbrirOpcoes: 'keyboard-arrow-down',
        InverterAnimacaoDasOpcoesMenu: false,
        PDFContrato: "",
        PDFDescricaoContrato: "",
        PDFExtensaoContrato: "",
        ItemBoleto: null,
        ListaUnidades: [],
        ListaOriginal: [],
        ListaExibida: [],
        ListaFiltrada: [],
        ListaBoletos: [],
        ListaOriginalBoletos: [],
        ListaExibidaBoletos: [{
            id: 0,
            status: 2,
            numero: 1,
            vencimento: '27/11/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 1,
            status: 2,
            numero: 2,
            vencimento: '28/11/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 2,
            status: 2,
            numero: 3,
            vencimento: '29/11/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 3,
            status: 0,
            numero: 4,
            vencimento: '30/11/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 4,
            status: 3,
            numero: 5,
            vencimento: '31/11/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 5,
            status: 3,
            numero: 6,
            vencimento: '01/12/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 6,
            status: 3,
            numero: 7,
            vencimento: '02/12/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 7,
            status: 3,
            numero: 8,
            vencimento: '03/12/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 8,
            status: 3,
            numero: 9,
            vencimento: '04/12/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 9,
            status: 3,
            numero: 10,
            vencimento: '05/12/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 10,
            status: 3,
            numero: 11,
            vencimento: '06/12/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 11,
            status: 3,
            numero: 12,
            vencimento: '07/12/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 12,
            status: 3,
            numero: 13,
            vencimento: '08/12/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        },
        {
            id: 13,
            status: 3,
            numero: 14,
            vencimento: '09/12/2020',
            valor: 'R$ 1.000,00',
            gerarboleto: false,
        }
        ],
        ListaFiltradaBoletos: [],
        VisibilidadeDateTimer: false,
        DataBoleto: new Date(),
        DataBoletoDescription: moment(new Date(), true).format('DD/MM/YYYY'),
        TituloPage: '',
        DadosRecebidos: [],
        NomeDaUnidade: null,
        Local: null,
        SubLocal: null,
        quantItem: 20,
        distanceEnd: null,
        distanceEndInitial: null,
        loadMore: false,
        TermUnidades: '',
        searchTermUnidades: '',
        id_atual: 0,
        renderizar: false,
        xOffset: new Animated.Value(1),
    };
    //#endregion

    //#region View
    render() {
        return (
            <ContainerScroll style={{ paddingTop: 0 }} >
                <Modal // Compartilhar ou mostrar PDF do contrato
                    animationType='slide'
                    visible={this.state.VisibilidadeModalPDF}
                    transparent={false}>
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 85, flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', backgroundColor: this.props.StyleGlobal.cores.background }}>
                            <View>
                                <Icon
                                    style={{ marginLeft: 20 }}
                                    name='close'
                                    size={40}
                                    color={'#FFFFFF'}
                                    onPress={() => { this.setVisibilidadeModalPDF(false) }}
                                />
                            </View>
                            <Text style = {{ fontStyle: 'normal', fontWeight: 'bold', fontSize: 14, textAlign: 'center', color: '#FFFFFF' }}>{`Boleto - ${this.state.ItemBoleto != null ? this.state.ItemBoleto.titulosDoBoleto[0].classificacao.descricao : ""} ${this.state.ItemBoleto != null ? this.state.ItemBoleto.titulosDoBoleto[0].numero : ""}`}</Text>
                            <View>
                                <Icon
                                    style={{ marginRight: 20 }}
                                    name='share'
                                    size={40}
                                    color={'#FFFFFF'}
                                    onPress={async () => { const showError = await RNShareFile.sharePDF(this.state.PDFContrato, `${'Boleto'}.${'pdf'}`) }}
                                />
                            </View>
                        </View>
                        <PDFView
                            fadeInDuration={250}
                            style={{ flex: 1 }}
                            resource={this.state.PDFContrato}
                            resourceType={"base64"}
                            onLoad={() => { }}
                            onError={() => { }}
                        />
                    </View>
                </Modal>
                <ModalLoading
                    visibilidade={this.state.VisibilidadeModalLoading}
                    onPress={() => { this.props.navigation.goBack() }}/>
                <ModalListaLotes
                    visibilidade={this.state.VisibilidadeModalListaLotes}
                    keyExtractorFlatList={item => item.id}
                    renderEmpreendimento={this.renderItem}
                    filteredEmpreendimento={this.state.ListaExibida}
                    idFlatList={(ref) => { this.FlatList = ref }}
                    onChangeSearch={(term) => { this.searchUpdateUnidades(term) }}
                    onPressVisibilidade={() => {
                        this.setVisibilidadeModalListaLotes(false)
                        this.props.navigation.goBack()
                    }}
                    onScroll={(e) => {
                        if ((e.nativeEvent.contentOffset.y >= this.state.distanceEnd) && this.state.loadMore == false) {
                            this.setState({ isLoadingFooter: true })
                            this.carregandoMaisUnidadesParaLista()
                            this.state.distanceEnd = e.nativeEvent.contentOffset.y + this.state.distanceEndInitial
                        }
                    }}
                    onlayout={async (e) => { await this.setState({ distanceEnd: e.nativeEvent.layout.height, distanceEndInitial: e.nativeEvent.layout.height }) }}
                    colorlotes={this.props.StyleGlobal.cores.background}
                />
                {this.state.VisibilidadeModalLoading == false && this.state.ListaBoletos != "" && <>
                    <ContentQuadroResumo
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: this.props.StyleGlobal.cores.background,
                            height: 175,
                    }}>
                        <View
                            activeOpacity={1}
                            style={{
                                position: 'absolute',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                flex: 1,
                                width: Dimensions.get('window').width,
                        }}>
                            {this.props.EmpresaLogada[0] == 4 && <IconEmpresaGAV width={Dimensions.get('window').width * 0.4} height={Dimensions.get('window').height * 0.2} style={{ marginLeft: 10, marginBottom: 10, marginTop: 0 }} />}
                            {this.props.EmpresaLogada[0] == 5 && <IconEmpresaHarmonia width={Dimensions.get('window').width * 0.4} height={Dimensions.get('window').height * 0.2} style={{ marginLeft: 10, marginBottom: 10, marginTop: 0 }} />}
                            {this.props.EmpresaLogada[0] == 8 && <IconEmpresaSilvaBranco width={Dimensions.get('window').width * 0.4} height={Dimensions.get('window').height * 0.2} style={{ marginLeft: 10, marginBottom: 10, marginTop: 0 }} />}
                            {this.props.EmpresaLogada[0] == 6 && <IconMyBroker width={Dimensions.get('window').width * 0.4} height={130} style={{ marginLeft: 10, marginBottom: 10, marginTop: 0 }} />}
                        </View>
                        <QuadroResumoDoCorretor
                            ref={(ref) => this.ScrollViewQuadro = ref}
                            horizontal={true}
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            style={[{ flex: 1, height: '50%', marginBottom: 20 }]}
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                                [{nativeEvent: {contentOffset: {x: this.state.xOffset}}}],
                                {useNativeDriver: true}
                            )}
                            onMomentumScrollEnd={ async (e) => {
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
                            }}>
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
                                            <Text style = {{fontSize: 15, color: this.props.StyleGlobal.fontes.corpadraoclaro, marginBottom: 5, textAlign: 'right'}}>{dados.id}</Text>
                                            <Text style = {{fontSize: 12, color: this.props.StyleGlobal.fontes.corbase, fontWeight: '500', textAlign: 'right'}}>{dados.valor}</Text>
                                        </Animated.View>
                                    </Animated.View>
                                )
                            })}</>}
                        </QuadroResumoDoCorretor>
                    </ContentQuadroResumo>
                    {/* <DateTimePickerModal
                        isVisible={this.state.VisibilidadeDateTimer}
                        mode={"date"}
                        locale={"pt-BR"}
                        is24Hour={true}
                        date={this.state.DataBoleto}
                        maximumDate={new Date((new Date().getFullYear() + 2).toString() + "-01-01")}
                        headerTextIOS={"Vencimento boleto"}
                        cancelTextIOS={"Cancelar"}
                        confirmTextIOS={"Confirmar"}
                        onConfirm={async (date) => {
                            const currentDate = date || this.state.DataBoleto
                            this.setState({ DataBoleto: currentDate, VisibilidadeDateTimer: false, DataBoletoDescription: moment(currentDate, true).format('DD/MM/YYYY') })
                        }}
                        onCancel={async () => { this.setState({ VisibilidadeDateTimer: false, DataBoletoDescription: moment(this.state.DataBoleto, true).format('DD/MM/YYYY') }) }} /> */}
                    <TouchableOpacity onPress={() => { this.mostrandoDatePicker(true) }} activeOpacity={1}>
                        {true &&
                            <>
                                <View style={{marginTop: 0, paddingHorizontal: 12, backgroundColor: this.props.StyleGlobal.cores.background }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                                        <Icon
                                            name="logout"
                                            size={25}
                                            color={'#FFFFFF'}
                                            style={{ marginLeft: 0 }}
                                            onPress={() => { this.props.navigation.goBack() }}
                                        />
                                        <Icon
                                            name="format-list-bulleted"
                                            size={25}
                                            color={'#FFFFFF'}
                                            style={{ marginLeft: 0 }}
                                            onPress={() => { this.setVisibilidadeModalListaLotes(true) }}
                                        />
                                    </View>
                                    {
                                        /* <View style = {{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                                                        <Text
                                                            style = {{
                                                            flex: 1,
                                                            flexDirection: 'column',
                                                            backgroundColor: '#FFFFFF',
                                                            borderWidth: 1,
                                                            borderColor: this.props.StyleGlobal.cores.background,
                                                            marginTop: 16,
                                                            marginBottom: 8,
                                                            color: '#262825',
                                                            fontStyle: 'normal',
                                                            fontWeight: 'normal',
                                                            fontSize: 16,
                                                            textAlignVertical: 'center',
                                                            paddingHorizontal: 8,
                                                            paddingVertical: 15,
                                                            borderRadius: 5
                                                        }}>{this.state.DataBoletoDescription}</Text>
                                                        <Icon name = "event" size = {30} color = {this.props.StyleGlobal.cores.background} style = {{marginTop: 10, marginLeft: -35}}/>
                                                        </View> */
                                    }
                                </View>
                            </>}
                    </TouchableOpacity>
                    <View
                        style={{
                            paddingHorizontal: 7,
                            justifyContent: 'center',
                            paddingVertical: 5,
                    }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                backgroundColor: this.props.StyleGlobal.cores.background,
                                elevation: 1,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                                opacity: 0.9,
                                paddingHorizontal: 16,
                                width: '100%',
                                borderWidth: 1,
                                borderColor: '#E2F2E3',
                                padding: 10,
                                justifyContent: 'flex-start',
                            }}>
                            <Text style={{ width: '10%', textAlign: 'center', color: '#FFFFFF', fontWeight: 'bold' }}/>
                            <Text style={{ width: '12%', textAlign: 'center', color: '#FFFFFF', fontWeight: 'bold' }}>N°</Text>
                            <Text style={{ width: '25%', textAlign: 'center', color: '#FFFFFF', fontWeight: 'bold' }}>Venc.</Text>
                            <Text style={{ width: '30%', textAlign: 'center', color: '#FFFFFF', fontWeight: 'bold' }}>Valor</Text>
                        </View>
                    </View>
                    <ScrollView
                        onLayout={async (e) => { await this.setState({ distanceEnd: e.nativeEvent.layout.height, distanceEndInitial: e.nativeEvent.layout.height })}}
                        ref={(ref) => this.ScrollView = ref}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                        onScroll={(e) => {
                            // if ((e.nativeEvent.contentOffset.y >= this.state.distanceEnd) && this.state.loadMore == false) {
                            //   this.setState({isLoadingFooter: true})
                            //   // this.carregandoMaisLeadsParaLista()
                            //   this.state.distanceEnd = e.nativeEvent.contentOffset.y + this.state.distanceEndInitial
                            // }
                        }}>
                        <View style={{ minHeight: Dimensions.get('window').height - 240, borderTopWidth: 0 }}>
                            <FlatList
                                ref={(ref) => this.flatList = ref}
                                style={{ marginBottom: 10, marginHorizontal: 8 }}
                                data={this.state.ListaBoletos}
                                keyExtractor={item => parseInt(item.numeroDoDocumento)}
                                renderItem={this.renderItemBoletos}
                                showsVerticalScrollIndicator={false}
                                refreshing={true}
                            />
                        </View>
                    </ScrollView>
                    {false &&
                        <View style={{ marginHorizontal: 7, marginVertical: 15 }}>
                            <TouchableOpacity
                                style={{
                                    width: '100%',
                                    backgroundColor: this.props.StyleGlobal.cores.botao,
                                    paddingHorizontal: 16,
                                    height: 49,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: "center"
                                }}
                                onPress={() => { }}>
                                <Text style={{ fontStyle: 'normal', fontWeight: '500', fontSize: 14, textAlign: 'center', color: '#FFFFFF', alignSelf: 'center' }}>Gerar</Text>
                            </TouchableOpacity>
                        </View>}
                </> }
            </ContainerScroll>
        );
    }
    //#endregion

    //#region Controller

    //#region Setando Visibilidade Date Picker
    mostrandoDatePicker = (value) => {
        this.setState({ VisibilidadeDateTimer: value })
    }
    //#endregion

    //#region Desmontando componentes
    componentWillUnmount() {
        this.focusListener.remove()
    }
    //#endregion

    //#region Animacao do menu de opções
    animacaoMenuOpcoes = async () => {
        if (this.state.InverterAnimacaoDasOpcoesMenu == false) {
            Animated.timing(this.state.ValorAnimadoOpcoesMenu, {
                toValue: 160,
                duration: 800,
                useNativeDriver: false
            }).start()
            this.setState({ NomeDoIconeParaAbrirOpcoes: 'keyboard-arrow-up', InverterAnimacaoDasOpcoesMenu: true })
        } else {
            Animated.timing(this.state.ValorAnimadoOpcoesMenu, {
                toValue: 65,
                duration: 800,
                useNativeDriver: false
            }).start()
            this.setState({ NomeDoIconeParaAbrirOpcoes: 'keyboard-arrow-down', InverterAnimacaoDasOpcoesMenu: false })
        }
    }
    //#endregion

    //#region Setando a visibilidade da modal de loading
    setVisibilidadeModalLoading(value) {
        this.setState({ VisibilidadeModalLoading: value })
    }
    //#endregion

    //#region Setando a visibilidade da modal de PDF
    setVisibilidadeModalPDF(value) {
        this.setState({ VisibilidadeModalPDF: value })
    }
    //#endregion

    //#region Pegando a lista de unidades no Banco de dados
    pegandoListaDeUnidades = async () => {
        try {
            let Response = await Identificador.consulta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
            if (Response != null && Response != undefined) {

                this.state.ListaUnidades = Response
                const Lista = this.state.ListaUnidades
                this.state.ListaUnidades = Lista
                this.state.ListaOriginal = Lista
                this.state.ListaFiltrada = Lista
                this.state.ListaExibida = [];
                const ListaAdd = [];
                if (Lista.length >= 20) {
                    for (var i = 0; i <= (this.state.quantItem - 1); i++) {
                        ListaAdd.push(this.state.ListaFiltrada[i])
                    }
                    await this.setState({ ListaExibida: ListaAdd })
                } else {
                    for (var i = 0; i <= (Lista.length - 1); i++) {
                        ListaAdd.push(this.state.ListaFiltrada[i])
                    }
                    await this.setState({ ListaExibida: ListaAdd, isLoadingFooter: true })
                }
                if ((this.state.DadosRecebidos != "") && (this.state.DadosRecebidos.filter(lotes => (lotes.id != -1 && lotes.status != 2)) == "")) {
                    await this.setState({ value: true });
                }
                await this.setVisibilidadeModalLoading(false)
                await this.setVisibilidadeModalListaLotes(true)
            } else {
                PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `No momento não consta boletos, caso contrário entre contato com a equipe de desenvolvimento.`
                })
                await this.setVisibilidadeModalLoading(false)
                await this.props.navigation.goBack()
            }
        } catch {
            PushNotification.localNotification({
                largeIcon: 'icon',
                smallIcon: 'icon',
                vibrate: true,
                vibration: 300,
                title: 'My Broker',
                message: `No momento não consta boletos, caso contrário entre contato com a equipe de desenvolvimento.`
            })
            await this.setVisibilidadeModalLoading(false)
            await this.props.navigation.goBack()
        }
    }
    //#endregion

    //#region Setando a visibilidade da modal de lista de lotes
    setVisibilidadeModalListaLotes(value) {
        this.setState({ VisibilidadeModalListaLotes: value })
    }
    //#endregion

    //#region Renderizando lista de unidades disponiveis
    renderItem = ({ item, index }) => item.indice != -1 && (
        <>
            <View style={{
                    backgroundColor: '#FFFFFF',
                    paddingHorizontal: 16,
                    width: '100%',
                    height: 100,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: 'rgba(16, 22, 26, 0.15)',
                    marginVertical: 5,
                    justifyContent: "center",
                }}>
                <TouchableOpacity activeOpacity={1} onPress={async () => {}}>
                    <View style={{ width: '100%' }}>
                        <View style={{ width: '100%', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 12, fontStyle: 'normal', fontWeight: 'bold', color: '#262825', flexWrap: 'wrap'}}> {(item.subLocal['descricao'] != "" || item.subLocal['descricao'] != null) ? item.subLocal['descricao'] : ""} </Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                            <View style={{ marginRight: 30 }} > 
                                {item.area != '' && item.area != null && <Text style={{ fontSize: 10, fontStyle: 'normal', fontWeight: 'normal', color: '#8F998F' }} numberOfLines={1} ellipsizeMode={'tail'} > Área: {(item.area != "" && item.area != null) ? item.area : ""}m² </Text>} 
                                {item.valorAVista != '' && item.valorAVista != null && <Text style = {{ fontSize: 10, fontStyle: 'normal', fontWeight: 'normal', color: '#8F998F' }} numberOfLines={1} ellipsizeMode={'tail'} > Valor a vista: {(item.valorAVista != "" && item.valorAVista != null) ? formatoDeTexto.FormatarTexto((item.valorAVista)) : ""} </Text>} 
                                {item.intermediacao != '' && item.intermediacao != null && <Text style = {{ fontSize: 10, fontStyle: 'normal', fontWeight: 'normal', color: '#8F998F' }} numberOfLines={1} ellipsizeMode={'tail'} > Intermediação: {(item.intermediacao != "" && item.intermediacao != null) ? formatoDeTexto.FormatarTexto((item.intermediacao)) : ""} </Text>}
                            </View>
                            <View style = {{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 10 }}>
                                <TouchableOpacity
                                    disabled = {false}
                                    style = {{
                                        paddingVertical: 6,
                                        paddingHorizontal: 10,
                                        backgroundColor: this.props.StyleGlobal.cores.background,
                                        flexDirection: 'row',
                                        borderWidth: 1,
                                        borderColor: this.props.StyleGlobal.cores.background,
                                        borderRadius: 5,
                                    }}
                                    onPress = {async () => {
                                        this.state.NomeDaUnidade = item.subLocal['descricao'];
                                        this.state.Local = item.local['id'];
                                        this.state.SubLocal = item.subLocal['id'];
                                        await this.setVisibilidadeModalListaLotes(false);
                                        await this.setVisibilidadeModalLoading(true);
                                        await this.pegandoListaBoletos();
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
                    </View>
                </TouchableOpacity>
            </View>
        </>
    );
    //#endregion

    //#region Filtrando unidades
    searchUpdateUnidades = async (Term) => {
        await this.setState({ searchTermUnidades: Term })
        if (Term == '') {
            this.state.ListaFiltrada = [];
            this.state.ListaExibida = [];
            this.state.quantItem = 20;
            await this.setState({ ListaFiltrada: this.state.ListaOriginal })
            const ListaAdd = [];
            if (this.state.ListaFiltrada.length >= 20) {
                for (var i = 0; i <= (this.state.quantItem - 1); i++) {
                    ListaAdd.push(this.state.ListaFiltrada[i])
                }
                await this.setState({ ListaExibida: ListaAdd, isLoadingHeader: false, distanceEnd: this.state.distanceEndInitial })
            } else {
                for (var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
                    ListaAdd.push(this.state.ListaFiltrada[i])
                }
                await this.setState({ ListaExibida: ListaAdd, isLoadingHeader: false, isLoadingFooter: true, distanceEnd: this.state.distanceEndInitial })
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
                await this.setState({ ListaExibida: ListaAdd, isLoadingHeader: false, distanceEnd: this.state.distanceEndInitial })
            } else {
                for (var i = 0; i <= (this.state.ListaFiltrada.length - 1); i++) {
                    ListaAdd.push(this.state.ListaFiltrada[i])
                }
                await this.setState({ ListaExibida: ListaAdd, isLoadingHeader: false, isLoadingFooter: true, distanceEnd: this.state.distanceEndInitial })
            }
        }
    }
    //#endregion

    //#region Carregando mais unidades para a lista
    carregandoMaisUnidadesParaLista = async () => {
        this.setState({ loadMore: true })
        const quantAnterior = this.state.quantItem;
        const ListaAdd = [];
        this.state.quantItem = (this.state.quantItem + 20);
        if ((this.state.ListaFiltrada.length > this.state.quantItem)) {
            try {
                for (var i = (quantAnterior); i <= (this.state.quantItem - 1); i++) {
                    ListaAdd.push(this.state.ListaFiltrada[i])
                }
                await this.setState({ ListaExibida: this.state.ListaExibida.concat(ListaAdd) })
                await this.setState({ loadMore: false })
            } catch { }
        } else if (this.state.ListaFiltrada.length < this.state.quantItem) {
            try {
                for (var i = (quantAnterior); i <= (this.state.ListaFiltrada.length - 1); i++) {
                    ListaAdd.push(this.state.ListaFiltrada[i])
                }
                this.state.quantItem = this.state.ListaFiltrada.length;
                await this.setState({ ListaExibida: this.state.ListaExibida.concat(ListaAdd) })
                await this.setState({ loadMore: false })
            } catch { await this.setState({ isLoadingFooter: true }) }
        }
    }
    //#endregion

    //#region Renderização a lista de boletos
    renderItemBoletos = ({ item, index }) => (
        <>
            <View style={{ backgroundColor: '#FFF9FB', paddingHorizontal: 16, width: '100%', marginVertical: 0.2, elevation: 1 }}>
                <TouchableOpacity activeOpacity={1} onPress={async () => { }} >
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {new Date(item.dataDeVencimento) == new Date() && 
                                <View style={{ marginRight: 10, width: 25, height: 25, borderRadius: 20, backgroundColor: '#3C896D', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: '#FFF9FB' }}>{'A'}</Text>
                                </View>}
                            {new Date(item.dataDeVencimento) < new Date() && 
                                <View style={{ marginRight: 10, width: 25, height: 25, borderRadius: 20, backgroundColor: '#BC3908', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: '#FFF9FB' }}>{'I'}</Text> 
                                </View>} 
                            {new Date(item.dataDeVencimento) > new Date() && 
                                <View style={{ marginRight: 10, width: 25, height: 25, borderRadius: 20, backgroundColor: '#5B85AA', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: '#FFF9FB' }}>{'A'}</Text> 
                                </View>}
                            <View style={{ maxWidth: '60%', flexDirection: 'row', alignItems: 'flex-start'}}>
                                <Text style = {{ fontSize: 14, fontStyle: 'normal', fontWeight: 'normal', color: '#262825', marginLeft: 3, width: '30%', textAlign: 'center' }} numberOfLines={1} ellipsizeMode={'tail'}>{item.titulosDoBoleto[0].numero}</Text>
                                <Text style = {{ fontSize: 14, fontStyle: 'normal', fontWeight: 'normal', color: '#262825', width: '58%', textAlign: 'center'}} numberOfLines={1} ellipsizeMode={'tail'}>{moment(item.dataDeVencimento, true).format('DD/MM/YYYY')}</Text>
                                <Text style = {{ fontSize: 14, textAlign: 'right', fontStyle: 'normal', fontWeight: 'normal', color: '#262825', width: '73%', maxwidth: '73%', textAlign: 'center'}} numberOfLines={1} ellipsizeMode={'tail'}>{formatoDeTexto.Moeda(item.valor)}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', width: '40%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{
                                    paddingVertical: 0.5,
                                    paddingHorizontal: 5,
                                    marginVertical: 5,
                                    backgroundColor: '#FFFFFF',
                                    flexDirection: 'row',
                                    borderWidth: 1,
                                    borderColor: this.props.StyleGlobal.cores.background,
                                    width: 80,
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                }}
                                onPress = {async () => { await this.reimprimirBoleto(item) }}>
                                <Text
                                    style = {{
                                        fontSize: 12,
                                        color: this.props.StyleGlobal.cores.background,
                                        fontStyle: 'normal',
                                        fontWeight: '500',
                                        textAlign: 'center',
                                        alignSelf: 'center',
                                        marginVertical: 4,
                                        marginHorizontal: 0,
                                }}>{'Emitir'}</Text>
                            </TouchableOpacity> 
                        </View>
                    </View>
                </TouchableOpacity> 
            </View> 
        </>
    );
    //#endregion

    //#region Pegando a lista de boletos no Banco de dados
    pegandoListaBoletos = async () => {
        try {
            let response = await BoletosAPI.consultaBoletosEmitidos(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, this.state.Local, this.state.SubLocal)
            if (response != null && response != undefined) {
                this.state.ListaBoletos = response
                await this.setVisibilidadeModalLoading(false)
                await this.setVisibilidadeModalListaLotes(false)
            } else {
                PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Não foi possível acessar os boletos vinculados a esse lote, entre em contato com a equipe de desenvolvimento`
                })
                await this.setVisibilidadeModalLoading(false)
                await this.setVisibilidadeModalListaLotes(true)
            }
        } catch {
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

    //#region Reimprimir o boleto
    reimprimirBoleto = async (item) => {
        try {
            await this.setVisibilidadeModalLoading(true)
            let Response = await BoletosAPI.reimprimirBoleto(String(this.props.token[0].token), item)
            if (Math.round(Response.status / 100) == 2) {
                await this.setState({ PDFContrato: (Response.data)[0].pdf, ItemBoleto: item })
                await this.setVisibilidadeModalLoading(false)
                await this.setVisibilidadeModalPDF(true)
            } else {
                PushNotification.localNotification({
                    largeIcon: 'icon',
                    smallIcon: 'icon',
                    vibrate: true,
                    vibration: 300,
                    title: 'My Broker',
                    message: `Não foi possível imprimir o boleto, entre em contato com a equipe de desenvolvimento.`
                })
            }
        } catch {

        }
    }
    //#endregion

    //#endregion
}

const mapStateToProps = state => ({
    token: state.dadosUsuario,
    Cargos: state.Cargos,
    empresa: state.dadosEmpreendimento.filter(emp => emp.empresa),
    centrodecusto: state.dadosEmpreendimento.filter(emp => emp.centrodecusto),
    Prospect: state.dadosLead,
    LotesReservados: state.dadosLotes,
    ConfigCss: state.configcssApp,
    StyleGlobal: state.StyleGlobal,
    EmpresaLogada: state.EmpresaLogada
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ ...TelaAtualActions, ...DadosLeadActions, ...DadosUsuarioActions, ...CargosActions, ...TabelaFIPActions, ...DadosEmpreendimentoActions, ...DadosMeiosDeContatoActions, ...DadosModeloDeVendasActions, ...EntradasActions, ...IntermediariasActions, ...ParcelasActions, ...LotesActions, ...ClienteActions, ...ConjugeActions, ...EnderecoActions, ...TelefonesActions, ...DocumentosOriginaisActions, ...DocumentosActions, ...DocumentosConjugeActions, ...DadosCorretagemActions, ...DadosIntermediacaoActions, ...DadosTabelaParcelasActions, ...TabelaDeVendasActions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Boletos);
