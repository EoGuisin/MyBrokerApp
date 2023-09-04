//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { Alert, Keyboard, View, Text, Animated, Image, ScrollView, StyleSheet, Dimensions, FlatList, TouchableOpacity, Modal, TextInput, Platform, PermissionsAndroid } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from "axios";
import { getDeviceId } from "react-native-device-info";
import Carousel from 'react-native-snap-carousel';
import { RNCamera } from 'react-native-camera';
import PushNotification from 'react-native-push-notification';
import Lottie from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchInput, { createFilter } from 'react-native-search-filter';
import RnBgTask from 'react-native-bg-thread';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import RNFetchBlob from 'rn-fetch-blob';
import PDFView from 'react-native-view-pdf';
import DocumentPicker from 'react-native-document-picker';
import SvgUri from 'react-native-svg-uri';
import Svg from 'react-native-svg';
//#endregion

//#region Chaves de filtragem

//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { Lead, Prospect, Vendas, Mensagem } from "../../../services";
//#endregion

//#region Redux
import { DadosLeadActions, TelaAtualActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
//#endregion

//#region Componentes
import { Container, Logo, NomeEmpresa, Header, TextInformacao } from '../../../components';
import { ModalSucesso, ModalFalha, ModalPropostaEnviada, ModalOption, ModalValidandoArquivos } from '../../Modais';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
import ImagemCamera from '../../../assets/cam.png';
import IconEmpresaGAV from '../../../assets/LOGOGAVRESORTS.svg';
import IconEmpresaMyBroker from '../../../assets/IconMyBroker.svg';
import IconEmpresaHarmonia from '../../../assets/HarmoniaLogoColorida.svg';
import IconEmpresaSilvaBranco from '../../../assets/SilvaBrancoLogoColorida.svg';
import Pdf from 'react-native-pdf';
import Cam from "../../../assets/cam.svg";
//#endregion

//#endregion

class QuadroResumo extends Component {
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

    await this.separandoDocumentos();
    await this.separandoDocumentosOriginais();
    await this.anexosAssinaturas();  
    await this.pegandoDadosDeRG_Cargo();
    await this.dadosTabela();
    await this.dadosCliente();
    await this.valorTotal();
  }
  //#endregion

  //#region Component Unmount
  componentWillUnmount() {
    this._isMounted = false;
  }
  //#endregion

  //#region Model
  state = {
    VisibilidadeModalPropostaEnviada: false,
    VisibilidadeModalAnexos: false,
    VisibilidadeModalOption: false,
    VisibilidadeModalValidandoArquivos: false,    
    FlashCamera: RNCamera.Constants.FlashMode.off,
    FotoIdentidade: {
      "id": "RG",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
    },
    FotoIdentidadeConjuge: {
      "id": "RG do Conjugê",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null
    },
    FotoEndereco: {
      "id": "Comprovante end.",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null
    },
    FotoCertidao: {
      "id": "Estado Civil",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null
    },
    Documento_rg: {
      "classificacao": 1,
      "arquivo": null,
      "descricao": "Documento de identificacao",
      "extensao": null,
    },
    Documento_rgconjuge: {
      "classificacao": 1,
      "arquivo": null,
      "descricao": "Documento de identificacao",
      "extensao": null
    },
    Documento_endereco: {
      "classificacao": 2,
      "arquivo": null,
      "descricao": "Comprovante de endereco",
      "extensao": null
    },
    Documento_certidao: {
      "classificacao": 3,
      "arquivo": null,
      "descricao": "Comprovante de estado civil",
      "extensao": null
    },
    assinaturas: {
      "assinaturaCliente": {
        "id": 1,
        "base64": null,
        "uri": null
      },
      "assinaturaConjuge": {
        "id": 2,
        "base64": null,
        "uri": null
      }
    },
    FichaNegociacao: {
      "id": "Ficha de Negociacao",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
      "isPDF": false
    },
    FichaAtendimento: {
      "id": "Ficha de Atendimento",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
      "isPDF": false
    },
    ComprovanteEntrada: {
      "id": "Comprovante Entrada",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
      "isPDF": false
    },
    CheckListCadastro: {
      "id": "Check List Cadastro",
      "habilitar_camera": false,
      "base64": null, 
      "deviceOrientation": null, 
      "height": null, 
      "pictureOrientation": null, 
      "uri": null, 
      "width": null,
      "isPDF": false
    },
    Arquivos: [],
    FichaNegociacaoPDF: null,
    FichaAtendimentoPDF: null,
    ComprovanteEntradaPDF: null,
    CheckListCadastroPDF: null,
    VisibilidadeModalCheckListCadastro: false,
    VisibilidadeModalComprovanteEntrada: false,
    VisibilidadeModalFichaAtendimento: false,
    VisibilidadeModalFichaNegociacao: false,
    dadosPropostaDeVenda: [],
    dadosDoModeloDeVenda: [],
    dadosCliente: [],
    ModalOptionMensagem: null,
    Option: null,
    scrollCarouselEnabled: true,
    ValueAssinaturaConjuge: false,
    anexosDocumentos:[],
    anexo_atual: null,
    imageurl: null,
    cameraType: 'back',
    indicatorCamera: false,
    indiceCorrecao: null,
    jurosCompensatorio: null,
    RGCliente: null,
    OrgaoEmissorCliente: null,
    UFRGCliente: null,
    RGConjuge: null,
    OrgaoEmissorConjuge: null,
    UFRGConjuge: null,
    OcupacaoCliente: null,
    OcupacaoConjuge: null,
    ValorIntermediarias: 0,
    ValorEntradas: 0,
    ValorSinais: 0,
    ValorFinanciamento: 0,
    ValorParcelaObra: 0,
    ValorParcelas: 0,
    ID: "",
  };
  //#endregion

  //#region View
  render() {
    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
        <Modal // Anexos
          animationType = 'slide'
          transparent = {false}
          visible = {this.state.VisibilidadeModalAnexos}>
          <View style = {{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
            <View 
              style = {{
                backgroundColor: '#FFFFFF', 
                height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 75 : 62,
                justifyContent: "center",
            }}>
              <View 
                style = {{
                  flexDirection: 'row', 
                  alignItems: 'center',
                  justifyContent: 'space-between'
              }}>
                <Icon name = {'keyboard-arrow-down'} color = {this.props.StyleGlobal.cores.background} size = {40} style = {{ marginTop: 10 }}
                  onPress = {() => {this.setVisibilidadeModalAnexos(false)}}/>
                <Text
                  style = {{
                    marginTop: 6,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: 14,
                    textAlign: 'center',
                    color: this.props.StyleGlobal.cores.background
                }}>Documentos</Text>
                <View style = {{width: 40}}/>
              </View>
            </View>
            <Carousel
              key = {item => item.id}
              ref = {(ref) => {this.FlatListCarousel = ref}}
              data = {this.state.anexosDocumentos}
              sliderWidth = {Dimensions.get('window').width}
              itemWidth = {Dimensions.get('window').width*0.9}
              renderItem = {this.renderItemCarousel}
              scrollEnabled = {this.state.scrollCarouselEnabled}
            />
          </View>
        </Modal>
        <ModalPropostaEnviada 
          visibilidade = {this.state.VisibilidadeModalPropostaEnviada}
          onPressIcon = {() => {this.setVisibilidadeModalPropostaEnviada(false)}}
          onPressObrigado = {async () => {
            this.props.navigation.navigate('Menu')
          }}
          onPressReservarNovoLote = {async () => {
            await this.setVisibilidadeModalPropostaEnviada(false)
            await this.props.navigation.navigate('Prospects')
          }}
        />
        <ModalOption
          visibilidade = {this.state.VisibilidadeModalOption}
          textomensagem = {this.state.ModalOptionMensagem}
          onPressIcon = {() => {this.setVisibilidadeModalOption(false)}}
          onPressSim = {() => {this.setandoOpcaoSimNaModalOption()}}
          onPressNao = {() => {this.setandoOpcaoNaoNaModalOption()}}
        />
        <ModalValidandoArquivos visibilidade = {this.state.VisibilidadeModalValidandoArquivos} 
          onPress = {async () => {
            await Vendas.cancelRequest(true)
            await this.setVisibilidadeModalValidandoArquivos(false)
        }}/>
        <View 
          style = {{
            height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
            justifyContent: "center",
        }}>
          <View
            style = {{
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10
          }}>
            <Icon name = {'keyboard-arrow-left'} color = {this.props.StyleGlobal.cores.background} size = {40} style = {{}}
            onPress = {() => {this.props.navigation.goBack()}}/>
            <Text
              style = {{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
                color: this.props.StyleGlobal.cores.background
            }}>Quadro Resumo</Text>
            <View style = {{width: 40}}></View>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator = {false}>
          <View
            style = {{ 
              backgroundColor: '#FFFFFF', 
              marginBottom: 15, 
              minHeight: Dimensions.get('window').height - 155,
          }}>
            {this.props.Nome != "" &&
            <TextInformacao titulo = {'Titular'} texto = {(this.props.Nome[0].Nome).toUpperCase()}/>}
            {this.props.token != "" &&
            <TextInformacao titulo = {'Corretor'} texto = {(this.props.token[0].pessoa.nome).toUpperCase()}/>}
            {this.props.LotesReservados != "" &&
            <TextInformacao titulo = {'Unidade'} texto = {(this.props.LotesReservados[0].subLocal['descricao']).toUpperCase()}/>}
            {this.props.LotesReservados != "" &&
            <TextInformacao titulo = {'Valor á vista'} texto = {`${formatoDeTexto.FormatarTexto((this.props.LotesReservados[0].valorAVista))}`}/>}
            <TextInformacao titulo = {'Valor total do imóvel'} texto = {`${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeIntermediaria != "" ? ((this.props.PropostaDeVenda[0].titulosDeIntermediaria).reduce((total, intermediaria) => total + (intermediaria.valor), 0)) : 0) + (this.props.PropostaDeVenda[0].titulosDeFinanciamento != "" ? ((this.props.PropostaDeVenda[0].titulosDeFinanciamento).reduce((total, financiamento) => total + (financiamento.valor), 0)) : 0) + (this.props.PropostaDeVenda[0].titulosDeParcelaObra != "" ? ((this.props.PropostaDeVenda[0].titulosDeParcelaObra).reduce((total, parcelaobra) => total + (parcelaobra.valor), 0)) : 0) + (this.props.PropostaDeVenda[0].titulosDeParcela != "" ? ((this.props.PropostaDeVenda[0].titulosDeParcela).reduce((total, parcela) => total + (parcela.valor), 0)) : 0) + (this.props.PropostaDeVenda[0].titulosDeSinal != "" ? ((this.props.PropostaDeVenda[0].titulosDeSinal).reduce((total, sinal) => total + (sinal.valor), 0)) : 0) + (this.props.PropostaDeVenda[0].titulosDeEntrada != "" ? ((this.props.PropostaDeVenda[0].titulosDeEntrada).reduce((total, entrada) => total + (entrada.valor), 0)) : 0) + (((this.props.Corretagem != "" ? this.props.Corretagem[0].valorTotal : 0))) + (this.props.PropostaDeVenda[0].titulosDeIntermediacao != "" ? ((this.props.PropostaDeVenda[0].titulosDeIntermediacao).reduce((total, intermediacao) => total + (intermediacao.valor), 0)) : 0)))}`}/>
            {this.props.PropostaDeVenda[0].titulosDeEntrada != "" && 
            <TextInformacao titulo = {(this.props.PropostaDeVenda[0].titulosDeEntrada).length > 1 ? 'Entradas' : 'Entrada'} texto = {`${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeEntrada).reduce((total, entrada) => total + ((entrada.valor)), 0))/((this.props.PropostaDeVenda[0].titulosDeEntrada).length))} (${formatoDeTexto.NumeroInteiro((this.props.PropostaDeVenda[0].titulosDeEntrada).length)} ${(this.props.PropostaDeVenda[0].titulosDeEntrada).length > 1 ? 'parcelas' : 'parcela'}), totalizando em ${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeEntrada).reduce((total, entrada) => total + ((entrada.valor)), 0)))} ${(this.props.PropostaDeVenda[0].titulosDeEntrada).length == 1 ? `vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeEntrada[0].vencimento, true).format('DD/MM/YYYY')}` : `primeiro vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeEntrada[0].vencimento, true).format('DD/MM/YYYY')}`} ${(this.props.PropostaDeVenda[0].titulosDeEntrada).length > 1 ? `e o último vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeEntrada[(this.props.PropostaDeVenda[0].titulosDeEntrada).length - 1].vencimento, true).format('DD/MM/YYYY')}` : ''}`}/>}
            {this.props.PropostaDeVenda[0].titulosDeIntermediaria != "" && 
            <TextInformacao titulo = {(this.props.PropostaDeVenda[0].titulosDeIntermediaria).length > 1 ? 'Parcelas intermediárias' : 'Parcela intermediária'} texto = {`${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeIntermediaria).reduce((total, entrada) => total + ((entrada.valor)), 0))/((this.props.PropostaDeVenda[0].titulosDeIntermediaria).length))} (${formatoDeTexto.NumeroInteiro((this.props.PropostaDeVenda[0].titulosDeIntermediaria).length)} ${(this.props.PropostaDeVenda[0].titulosDeIntermediaria).length > 1 ? 'parcelas' : 'parcela'}), totalizando em ${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeIntermediaria).reduce((total, entrada) => total + ((entrada.valor)), 0)))} ${(this.props.PropostaDeVenda[0].titulosDeIntermediaria).length == 1 ? `vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeIntermediaria[0].vencimento, true).format('DD/MM/YYYY')}` : `primeiro vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeIntermediaria[0].vencimento, true).format('DD/MM/YYYY')}`} ${(this.props.PropostaDeVenda[0].titulosDeIntermediaria).length > 1 ? `e o último vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeIntermediaria[(this.props.PropostaDeVenda[0].titulosDeIntermediaria).length - 1].vencimento, true).format('DD/MM/YYYY')}` : ''}`}/>}
            {this.props.PropostaDeVenda[0].titulosDeSinal != "" && 
            <TextInformacao titulo = {'Sinal'} texto = {`${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeSinal).reduce((total, entrada) => total + ((entrada.valor)), 0))/((this.props.PropostaDeVenda[0].titulosDeSinal).length))} (${formatoDeTexto.NumeroInteiro((this.props.PropostaDeVenda[0].titulosDeSinal).length)} ${(this.props.PropostaDeVenda[0].titulosDeSinal).length > 1 ? 'parcelas' : 'parcela'}), totalizando em ${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeSinal).reduce((total, entrada) => total + ((entrada.valor)), 0)))} ${(this.props.PropostaDeVenda[0].titulosDeSinal).length == 1 ? `vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeSinal[0].vencimento, true).format('DD/MM/YYYY')}` : `primeiro vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeSinal[0].vencimento, true).format('DD/MM/YYYY')}`} ${(this.props.PropostaDeVenda[0].titulosDeSinal).length > 1 ? `e o último vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeSinal[(this.props.PropostaDeVenda[0].titulosDeSinal).length - 1].vencimento, true).format('DD/MM/YYYY')}` : ''}`}/>}
            {this.props.Corretagem != "" &&
            <TextInformacao titulo = {'Corretor'} texto = {`${formatoDeTexto.FormatarTexto((((this.props.Corretagem[0].valorTotal/(this.props.Corretagem[0].titulosDeCorretagem).length))))} (${(this.props.Corretagem[0].titulosDeCorretagem).length} ${(this.props.Corretagem[0].titulosDeCorretagem).length > 1 ? 'parcelas' : 'parcela'})`}/>}
            {this.props.PropostaDeVenda[0].titulosDeIntermediacao != "" &&
            <TextInformacao titulo = {'Imobiliária'} texto = {`${formatoDeTexto.FormatarTexto((((this.props.Intermediacao[0].valorTotal/(this.props.Intermediacao[0].titulosDeIntermediacao).length))))} (${(this.props.Intermediacao[0].titulosDeIntermediacao).length} ${(this.props.Intermediacao[0].titulosDeIntermediacao).length > 1 ? 'parcelas' : 'parcela'})`}/>}
            {this.props.PropostaDeVenda[0].titulosDeFinanciamento != "" &&
            <TextInformacao titulo = {'Financiamento bancário'} texto = {`${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeFinanciamento).reduce((total, entrada) => total + ((entrada.valor)), 0))/((this.props.PropostaDeVenda[0].titulosDeFinanciamento).length))} (${formatoDeTexto.NumeroInteiro((this.props.PropostaDeVenda[0].titulosDeFinanciamento).length)} ${(this.props.PropostaDeVenda[0].titulosDeFinanciamento).length > 1 ? 'parcelas' : 'parcela'}), totalizando em ${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeFinanciamento).reduce((total, entrada) => total + ((entrada.valor)), 0)))} ${(this.props.PropostaDeVenda[0].titulosDeFinanciamento).length == 1 ? `vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeFinanciamento[0].vencimento, true).format('DD/MM/YYYY')}` : `primeiro vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeFinanciamento[0].vencimento, true).format('DD/MM/YYYY')}`} ${(this.props.PropostaDeVenda[0].titulosDeFinanciamento).length > 1 ? `e o último vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeFinanciamento[(this.props.PropostaDeVenda[0].titulosDeFinanciamento).length - 1].vencimento, true).format('DD/MM/YYYY')}` : ''}`}/>}
            {this.props.PropostaDeVenda[0].titulosDeParcelaObra != "" &&
            <TextInformacao titulo = {(this.props.PropostaDeVenda[0].titulosDeParcelaObra).length > 1 ? 'Parcelas obra' : 'Parcela obra'} texto = {`${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeParcelaObra).reduce((total, entrada) => total + ((entrada.valor)), 0))/((this.props.PropostaDeVenda[0].titulosDeParcelaObra).length))} (${formatoDeTexto.NumeroInteiro((this.props.PropostaDeVenda[0].titulosDeParcelaObra).length)} ${(this.props.PropostaDeVenda[0].titulosDeParcelaObra).length > 1 ? 'parcelas' : 'parcela'}), totalizando em ${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeParcelaObra).reduce((total, entrada) => total + ((entrada.valor)), 0)))} ${(this.props.PropostaDeVenda[0].titulosDeParcelaObra).length == 1 ? `vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeParcelaObra[0].vencimento, true).format('DD/MM/YYYY')}` : `primeiro vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeParcelaObra[0].vencimento, true).format('DD/MM/YYYY')}`} ${(this.props.PropostaDeVenda[0].titulosDeParcelaObra).length > 1 ? `e o último vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeParcelaObra[(this.props.PropostaDeVenda[0].titulosDeParcelaObra).length - 1].vencimento, true).format('DD/MM/YYYY')}` : ''}`}/>}
            {this.props.PropostaDeVenda[0].titulosDeParcela != "" &&
            <TextInformacao titulo = {(this.props.PropostaDeVenda[0].titulosDeParcela).length > 1 ? 'Saldo a financiar' : 'Saldo a financiar'} texto = {`${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeParcela).reduce((total, entrada) => total + ((entrada.valor)), 0))/((this.props.PropostaDeVenda[0].titulosDeParcela).length))} (${formatoDeTexto.NumeroInteiro((this.props.PropostaDeVenda[0].titulosDeParcela).length)} ${(this.props.PropostaDeVenda[0].titulosDeParcela).length > 1 ? 'parcelas' : 'parcela'}), totalizando em ${formatoDeTexto.FormatarTexto(((this.props.PropostaDeVenda[0].titulosDeParcela).reduce((total, entrada) => total + ((entrada.valor)), 0)))} ${(this.props.PropostaDeVenda[0].titulosDeParcela).length == 1 ? `vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeParcela[0].vencimento, true).format('DD/MM/YYYY')}` : `primeiro vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeParcela[0].vencimento, true).format('DD/MM/YYYY')}`} ${(this.props.PropostaDeVenda[0].titulosDeParcela).length > 1 ? `e o último vencimento em ${moment(this.props.PropostaDeVenda[0].titulosDeParcela[(this.props.PropostaDeVenda[0].titulosDeParcela).length - 1].vencimento, true).format('DD/MM/YYYY')}` : ''}`}/>}
            <TextInformacao titulo = {'Plano Indexador'} texto = {`${this.props.PropostaDeVenda[0].modeloDeVenda.gruposIndexadores == "" ? "" : this.props.PropostaDeVenda[0].modeloDeVenda.gruposIndexadores[0].indexadores[0].sigla}`}/>
            <TextInformacao titulo = {'Juros compensatório'} texto = {`${(this.props.Tabela[0].tabelaCompleta.classificacoesDosTitulosDaTabelaDeVenda.find(item => item.classificacao.id == 4).jurosDeTabela * 100).toFixed(4)}% a.m`}/>
            {this.props.EmpresaLogada[0] == 4 &&
            <View
              style = {{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
                justifyContent: "space-between",
                backgroundColor: "#FFFFFF",
                height: 48,
                borderRadius: 5,
                paddingHorizontal: 16,
            }}>
              <Text>Check list de cadastro</Text>
              <View 
                style = {{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
              }}>
                <Icon style = {{marginRight: 20}} name = "check-circle" color = {(this.state.CheckListCadastroPDF != null || this.state.CheckListCadastro.base64 != null) ? '#3C896D' : '#BC3908'} size = {15}/>
                <TouchableOpacity
                  activeOpacity = {1}
                  style = {{
                    backgroundColor: this.props.StyleGlobal.cores.background,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    borderRadius: 5
                  }}
                  onPress = { async () => {
                    if(this.state.CheckListCadastro.base64 != null) 
                    {
                      this._mostraFoto('Check List', this.state.CheckListCadastro);
                      this.setState({anexo_atual: 'Check List'});
                      this.setVisibilidadeModalAnexos(true);
                      this.setState({VisibilidadeModalCheckListCadastro: false})
                    }
                    else
                    {
                      this.setState({VisibilidadeModalCheckListCadastro: true})
                    }
                  }}>
                    <Text style = {{ color: "#ffffff", fontWeight: "bold", width: 50, textAlign: 'center'}}>{(this.state.CheckListCadastroPDF != null || this.state.CheckListCadastro.base64 != null) ? "Abrir" : "Anexar"}</Text>
                </TouchableOpacity>
              </View>
              <Modal // Check list de cadastro
                visible = {this.state.VisibilidadeModalCheckListCadastro}
                animationType = {"slide"}
                transparent = {false}>
                  <View style = {{flex: 1}}>
                    <View 
                      style = {{
                        backgroundColor: this.props.StyleGlobal.cores.background,
                        height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
                        justifyContent: "center"
                    }}>
                      <View 
                        style = {{
                          flexDirection: 'row', 
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 10
                      }}>
                        <Icon 
                          name = {'keyboard-arrow-down'} 
                          color = {'#FFF'} 
                          size = {40}
                          onPress = {async () => {
                            await this.setState({VisibilidadeModalCheckListCadastro: false})
                        }}/>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 14,
                            textAlign: 'center',
                            color: '#FFFFFF'
                        }}>Check list cadastro</Text>
                        <View style = {{width: 40}}/>
                      </View>
                    </View>
                    <View
                      style = {{
                        marginHorizontal: 24, 
                        marginTop: 24, 
                        height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 117) : (Dimensions.get('window').height - 87),
                        justifyContent: 'space-between'
                      }}>
                        <View style = {{alignItems: 'center'}}>
                          {this.props.EmpresaLogada[0] == 4 && <IconEmpresaGAV width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          {this.props.EmpresaLogada[0] == 5 && <IconEmpresaHarmonia width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          {this.props.EmpresaLogada[0] == 8 && <IconEmpresaSilvaBranco width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          {this.props.EmpresaLogada[0] == 6 && <IconEmpresaMyBroker width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          <Text style = {{marginTop: -40, fontStyle: 'normal', fontWeight: 'bold', fontSize: 24, color: this.props.StyleGlobal.cores.background}}>Aviso!</Text>
                          <View style = {{marginHorizontal: 20, marginTop: 35}}>
                            <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: this.props.StyleGlobal.cores.background, lineHeight: 25}}>{"Qual opção deseja escolher para o check list de cadastro?"}</Text>
                          </View>
                          <View style = {{marginTop: 35}}>
                            <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>Dúvidas</Text>
                            <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>vendas@</Text>
                            <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>(XX) XXXX-XXXX</Text>
                          </View>
                        </View>
                        <View style = {{ flexDirection: 'row'}}>
                          <TouchableOpacity
                            style = {{
                              flex: 1,
                              backgroundColor: '#FFFFFF',
                              borderWidth: 1,
                              borderColor: this.props.StyleGlobal.cores.botao,
                              paddingHorizontal: 16,
                              height: 58,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 20,
                              marginRight: 20,
                              borderRadius: 5
                            }}
                            onPress = { async () => {
                              if(this.state.CheckListCadastro.base64 ==  null) {
                                this._tiraFoto('Check List', this.state.CheckListCadastro);
                                this.setState({imageurl: this.state.CheckListCadastro, anexo_atual: 'Check List', scrollCarouselEnabled: false});
                                this.setVisibilidadeModalAnexos(true);
                                this.setState({VisibilidadeModalCheckListCadastro: false})
                              } else if(this.state.CheckListCadastro.base64 != null) {
                                this._mostraFoto('Check List', this.state.CheckListCadastro);
                                this.setState({anexo_atual: 'Check List'});
                                this.setVisibilidadeModalAnexos(true);
                                this.setState({VisibilidadeModalCheckListCadastro: false})
                              }
                            }}>
                            <Text
                              style = {{
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                fontSize: 14,
                                textAlign: 'center',
                                color: this.props.StyleGlobal.cores.botao,
                                alignSelf: 'center',
                              }}>Tirar foto</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style = {{
                              flex: 1,
                              backgroundColor: this.props.StyleGlobal.cores.botao,
                              paddingHorizontal: 16,
                              height: 58,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 20,
                              borderRadius: 5
                            }}
                            onPress = { async () => {

                              if(Platform.OS === "android") {
                                
                                this.setState({VisibilidadeModalCheckListCadastro: false})

                                const granted = await PermissionsAndroid.request(
                                  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                                  {
                                    title: "App permissão de acesso aos arquivos",
                                    message: "O App precisa de acesso ao arquivos",
                                    buttonNeutral: "Pergunte-me depois",
                                    buttonNegative: "Cancelar",
                                    buttonPositive: "OK"
                                  }
                                );
            
                                const grantedWrite = await PermissionsAndroid.request(
                                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                                  {
                                    title: "App permissão de acesso aos arquivos",
                                    message: "O App precisa de acesso ao arquivos",
                                    buttonNeutral: "Pergunte-me depois",
                                    buttonNegative: "Cancelar",
                                    buttonPositive: "OK"
                                  }
                                );
            
                                if((granted === PermissionsAndroid.RESULTS.GRANTED) && (grantedWrite === PermissionsAndroid.RESULTS.GRANTED))
                                {
                                  try {
            
                                    const res = await DocumentPicker.pick({
                                      type: [DocumentPicker.types.allFiles],
                                    });

                                    let extension = res.name.split(".").pop()

                                    if (extension == "pdf")
                                    {
                                      RNFetchBlob.fs.readFile(res.uri, 'base64')
                                      .then((data) => {
                                          this.state.CheckListCadastro.isPDF = true
                                          this.state.CheckListCadastro.base64 = data
                                          this.setState({CheckListCadastroPDF: data})
                                      })
                                    }
                                    else if (extension == "jpg" || extension == "png" || extension == "jpeg") {
                                      RNFetchBlob.fs.readFile(res.uri, 'base64')
                                      .then((data) => {
                                        var dadosImage = `data:image/${extension};base64,${data}`
                                          this.state.CheckListCadastro = {
                                            "id": "Check List Cadastro",
                                            "habilitar_camera": false,
                                            "base64": data,
                                            "deviceOrientation": 1,
                                            "height": Dimensions.get('window').height,
                                            "pictureOrientation": 1,
                                            "uri": dadosImage,
                                            "width": Dimensions.get('window').width,
                                            "extensao": extension,
                                            "isPDF": false
                                          }
                                          this.setState({Renderizar: true})
                                      })
                                    }
                                    else
                                    {
                                      PushNotification.localNotification({
                                        largeIcon: 'icon',
                                        smallIcon: 'icon',
                                        vibrate: true,
                                        vibration: 300,
                                        title: 'My Broker',
                                        message: `Formato de arquivo inválido, selecione outro arquivo.`
                                      })
                                    }
            
                                    // RNFetchBlob.fs.readFile(res.uri, 'base64')
                                    // .then((data) => {
                                    //     this.state.CheckListCadastro.isPDF = true
                                    //     this.state.CheckListCadastro.base64 = data
                                    //     this.setState({CheckListCadastroPDF: data})
                                    // })
            
                                  } catch (err) {
            
                                    if (DocumentPicker.isCancel(err)) 
                                    {
            
                                    } 
                                    else 
                                    {
                                      throw err;
                                    }
            
                                  }
                                }
                              }
                              else if (Platform.OS === "ios") {
                                
                                try {

                                  const res = await DocumentPicker.pick({
                                    type: [DocumentPicker.types.allFiles],
                                  });

                                  let filePath = (res.uri).replace('file://', "")

                                  let extension = res.name.split(".").pop()

                                  if (extension == "pdf")
                                  {
                                    RNFetchBlob.fs.readFile(filePath, 'base64')
                                    .then((data) => {
                                        this.state.CheckListCadastro.isPDF = true
                                        this.state.CheckListCadastro.base64 = data
                                        this.setState({CheckListCadastroPDF: data})
                                    })
                                  }
                                  else if (extension == "jpg" || extension == "png" || extension == "jpeg") {
                                    RNFetchBlob.fs.readFile(filePath, 'base64')
                                    .then((data) => {
                                      var dadosImage = `data:image/${extension};base64,${data}`
                                        this.state.CheckListCadastro = {
                                          "id": "Check List Cadastro",
                                          "habilitar_camera": false,
                                          "base64": data,
                                          "deviceOrientation": 1,
                                          "height": Dimensions.get('window').height,
                                          "pictureOrientation": 1,
                                          "uri": dadosImage,
                                          "width": Dimensions.get('window').width,
                                          "extensao": extension,
                                          "isPDF": false
                                        }
                                        this.setState({Renderizar: true})
                                    })
                                  }
                                  else
                                  {
                                    PushNotification.localNotification({
                                      largeIcon: 'icon',
                                      smallIcon: 'icon',
                                      vibrate: true,
                                      vibration: 300,
                                      title: 'My Broker',
                                      message: `Formato de arquivo inválido, selecione outro arquivo.`
                                    })
                                  }

                                  // RNFetchBlob.fs.readFile(filePath, 'base64')
                                  // .then((data) => {
                                  //     this.state.CheckListCadastro.isPDF = true
                                  //     this.state.CheckListCadastro.base64 = data
                                  //     this.setState({CheckListCadastroPDF: data})
                                  // })

                                  this.setState({VisibilidadeModalCheckListCadastro: false})

                                } catch (err) {
          
                                  if (DocumentPicker.isCancel(err)) 
                                  {

                                  } 
                                  else 
                                  {
                                    this.setState({VisibilidadeModalCheckListCadastro: false})
                                    throw err;
                                  }
          
                                }
                              }
                            }}>
                            <Text
                              style = {{
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                fontSize: 14,
                                textAlign: 'center',
                                color: '#FFFFFF',
                                alignSelf: 'center',
                              }}>Escolher PDF</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                  </View>
              </Modal>
            </View>}
            {this.props.EmpresaLogada[0] == 4 &&
            <View
              style = {{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
                justifyContent: "space-between",
                backgroundColor: "#FFFFFF",
                height: 48,
                borderRadius: 5,
                paddingHorizontal: 16,
            }}>
              <Text>Comprovante entrada</Text>
              <View 
                style = {{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",

              }}>
                <Icon style = {{marginRight: 20}} name = "check-circle" color = {(this.state.ComprovanteEntradaPDF != null || this.state.ComprovanteEntrada.base64 != null) ? '#3C896D' : '#BC3908'} size = {15}/>
                <TouchableOpacity 
                  activeOpacity = {1}
                  style = {{
                    backgroundColor: this.props.StyleGlobal.cores.background,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    borderRadius: 5
                  }}
                  onPress = { async () => {
                    if(this.state.ComprovanteEntrada.base64 != null) 
                    {
                      this._mostraFoto('Comprovante Entrada', this.state.ComprovanteEntrada);
                      this.setState({anexo_atual: 'Comprovante Entrada'});
                      this.setVisibilidadeModalAnexos(true);
                      this.setState({VisibilidadeModalComprovanteEntrada: false})
                    }
                    else
                    {
                      this.setState({VisibilidadeModalComprovanteEntrada: true})
                    }
                  }}>
                    <Text style = {{ color: "#ffffff", fontWeight: "bold", width: 50, textAlign: 'center'}}>{(this.state.ComprovanteEntradaPDF != null || this.state.ComprovanteEntrada.base64 != null) ? "Abrir" : "Anexar"}</Text>
                </TouchableOpacity>
              </View>
              <Modal // Comprovante de entrada
                visible = {this.state.VisibilidadeModalComprovanteEntrada}
                animationType = {"slide"}
                transparent = {false}>
                  <View style = {{flex: 1}}>
                    <View 
                      style = {{
                        backgroundColor: this.props.StyleGlobal.cores.background,
                        height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
                        justifyContent: "center"
                    }}>
                      <View 
                        style = {{
                          flexDirection: 'row', 
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 10
                      }}>
                        <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40}
                          onPress = {async () => {
                            await this.setState({VisibilidadeModalComprovanteEntrada: false})
                        }}/>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 14,
                            textAlign: 'center',
                            color: '#FFFFFF'
                        }}>Comprovante de entrada</Text>
                        <View style = {{width: 40}}/>
                      </View>
                    </View>
                    <View
                      style = {{
                        marginHorizontal: 24, 
                        marginTop: 24, 
                        height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 117) : (Dimensions.get('window').height - 87),
                        justifyContent: 'space-between'
                    }}>
                        <View style = {{alignItems: 'center'}}>
                          {this.props.EmpresaLogada[0] == 4 && <IconEmpresaGAV width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          {this.props.EmpresaLogada[0] == 5 && <IconEmpresaHarmonia width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          {this.props.EmpresaLogada[0] == 8 && <IconEmpresaSilvaBranco width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          {this.props.EmpresaLogada[0] == 6 && <IconEmpresaMyBroker width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          <Text style = {{marginTop: -40, fontStyle: 'normal', fontWeight: 'bold', fontSize: 24, color: this.props.StyleGlobal.cores.background}}>Aviso!</Text>
                          <View style = {{marginHorizontal: 20, marginTop: 35}}>
                            <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: this.props.StyleGlobal.cores.background, lineHeight: 25}}>{"Qual opção deseja escolher para o comprovante de entrada?"}</Text>
                          </View>
                          <View style = {{marginTop: 35}}>
                            <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>Dúvidas</Text>
                            <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>vendas@</Text>
                            <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>(XX) XXXX-XXXX</Text>
                          </View>
                        </View>
                        <View style = {{ flexDirection: 'row'}}>
                          <TouchableOpacity
                            style = {{
                              flex: 1,
                              backgroundColor: '#FFFFFF',
                              borderWidth: 1,
                              borderColor: this.props.StyleGlobal.cores.botao,
                              paddingHorizontal: 16,
                              height: 58,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 20,
                              marginRight: 20,
                              borderRadius: 5
                            }}
                            onPress = { async () => {
                              if(this.state.ComprovanteEntrada.base64 ==  null) {
                                this._tiraFoto('Comprovante Entrada', this.state.ComprovanteEntrada);
                                this.setState({imageurl: this.state.ComprovanteEntrada, anexo_atual: 'Comprovante Entrada', scrollCarouselEnabled: false});
                                this.setVisibilidadeModalAnexos(true);
                                this.setState({VisibilidadeModalComprovanteEntrada: false})
                              } else if(this.state.ComprovanteEntrada.base64 != null) {
                                this._mostraFoto('Comprovante Entrada', this.state.ComprovanteEntrada);
                                this.setState({anexo_atual: 'Comprovante Entrada'});
                                this.setVisibilidadeModalAnexos(true);
                                this.setState({VisibilidadeModalComprovanteEntrada: false})
                              }
                            }}>
                            <Text
                              style = {{
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                fontSize: 14,
                                textAlign: 'center',
                                color: this.props.StyleGlobal.cores.botao,
                                alignSelf: 'center',
                              }}>Tirar foto</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style = {{
                              flex: 1,
                              backgroundColor: this.props.StyleGlobal.cores.botao,
                              paddingHorizontal: 16,
                              height: 58,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 20,
                              borderRadius: 5
                            }}
                            onPress = {async () => {

                              if(Platform.OS === "android")
                              {
                                this.setState({VisibilidadeModalComprovanteEntrada: false})

                                const granted = await PermissionsAndroid.request(
                                  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                                  {
                                    title: "App permissão de acesso aos arquivos",
                                    message: "O App precisa de acesso ao arquivos",
                                    buttonNeutral: "Pergunte-me depois",
                                    buttonNegative: "Cancelar",
                                    buttonPositive: "OK"
                                  }
                                );
            
                                const grantedWrite = await PermissionsAndroid.request(
                                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                                  {
                                    title: "App permissão de acesso aos arquivos",
                                    message: "O App precisa de acesso ao arquivos",
                                    buttonNeutral: "Pergunte-me depois",
                                    buttonNegative: "Cancelar",
                                    buttonPositive: "OK"
                                  }
                                );
            
                                if((granted === PermissionsAndroid.RESULTS.GRANTED) && (grantedWrite === PermissionsAndroid.RESULTS.GRANTED))
                                {
                                  try {
            
                                    const res = await DocumentPicker.pick({
                                      type: [DocumentPicker.types.allFiles],
                                    });

                                    let extension = res.name.split(".").pop()

                                    if (extension == "pdf")
                                    {
                                      RNFetchBlob.fs.readFile(res.uri, 'base64')
                                      .then((data) => {
                                          this.state.ComprovanteEntrada.isPDF = true
                                          this.state.ComprovanteEntrada.base64 = data
                                          this.setState({ComprovanteEntradaPDF: data})
                                      })
                                    }
                                    else if (extension == "jpg" || extension == "png" || extension == "jpeg") {
                                      RNFetchBlob.fs.readFile(res.uri, 'base64')
                                      .then((data) => {
                                        var dadosImage = `data:image/${extension};base64,${data}`
                                          this.state.ComprovanteEntrada = {
                                            "id": "Comprovante Entrada",
                                            "habilitar_camera": false,
                                            "base64": data,
                                            "deviceOrientation": 1,
                                            "height": Dimensions.get('window').height,
                                            "pictureOrientation": 1,
                                            "uri": dadosImage,
                                            "width": Dimensions.get('window').width,
                                            "extensao": extension,
                                            "isPDF": false
                                          }
                                          this.setState({Renderizar: true})
                                      })
                                    }
                                    else
                                    {
                                      PushNotification.localNotification({
                                        largeIcon: 'icon',
                                        smallIcon: 'icon',
                                        vibrate: true,
                                        vibration: 300,
                                        title: 'My Broker',
                                        message: `Formato de arquivo inválido, selecione outro arquivo.`
                                      })
                                    }
            
                                    // RNFetchBlob.fs.readFile(res.uri, 'base64')
                                    // .then((data) => {
                                    //     this.state.ComprovanteEntrada.isPDF = true
                                    //     this.state.ComprovanteEntrada.base64 = data
                                    //     this.setState({ComprovanteEntradaPDF: data})
                                    // })
            
                                  } catch (err) {
            
                                    if (DocumentPicker.isCancel(err)) 
                                    {
            
                                    } 
                                    else 
                                    {
                                      throw err;
                                    }
            
                                  }
                                }
                              }
                              else if (Platform.OS === "ios")
                              {

                                try {
            
                                  const res = await DocumentPicker.pick({
                                    type: [DocumentPicker.types.allFiles],
                                  });

                                  let filePath = (res.uri).replace('file://', "")

                                  let extension = res.name.split(".").pop()

                                  if (extension == "pdf")
                                  {
                                    RNFetchBlob.fs.readFile(filePath, 'base64')
                                    .then((data) => {
                                        this.state.ComprovanteEntrada.isPDF = true
                                        this.state.ComprovanteEntrada.base64 = data
                                        this.setState({ComprovanteEntradaPDF: data})
                                    })
                                  }
                                  else if (extension == "jpg" || extension == "png" || extension == "jpeg") {
                                    RNFetchBlob.fs.readFile(filePath, 'base64')
                                    .then((data) => {
                                      var dadosImage = `data:image/${extension};base64,${data}`
                                        this.state.ComprovanteEntrada = {
                                          "id": "Comprovante Entrada",
                                          "habilitar_camera": false,
                                          "base64": data,
                                          "deviceOrientation": 1,
                                          "height": Dimensions.get('window').height,
                                          "pictureOrientation": 1,
                                          "uri": dadosImage,
                                          "width": Dimensions.get('window').width,
                                          "extensao": extension,
                                          "isPDF": false
                                        }
                                        this.setState({Renderizar: true})
                                    })
                                  }
                                  else
                                  {
                                    PushNotification.localNotification({
                                      largeIcon: 'icon',
                                      smallIcon: 'icon',
                                      vibrate: true,
                                      vibration: 300,
                                      title: 'My Broker',
                                      message: `Formato de arquivo inválido, selecione outro arquivo.`
                                    })
                                  }
          
                                  // RNFetchBlob.fs.readFile(filePath, 'base64')
                                  // .then((data) => {
                                  //     this.state.ComprovanteEntrada.isPDF = true
                                  //     this.state.ComprovanteEntrada.base64 = data
                                  //     this.setState({ComprovanteEntradaPDF: data})
                                  // })

                                  this.setState({VisibilidadeModalComprovanteEntrada: false})
          
                                } catch (err) {
          
                                  if (DocumentPicker.isCancel(err)) 
                                  {
          
                                  } 
                                  else 
                                  {
                                    this.setState({VisibilidadeModalCheckListCadastro: false})
                                    throw err;
                                  }
          
                                }

                              }
                            }}>
                            <Text
                              style = {{
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                fontSize: 14,
                                textAlign: 'center',
                                color: '#FFFFFF',
                                alignSelf: 'center',
                              }}>Escolher PDF</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                  </View>
              </Modal>
            </View>}
            {this.props.EmpresaLogada[0] == 4 &&
            <View
              style = {{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
                justifyContent: "space-between",
                backgroundColor: "#FFFFFF",
                height: 48,
                borderRadius: 5,
                paddingHorizontal: 16,
            }}>
              <Text>Ficha de atendimento</Text>
              <View 
                style = {{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
              }}>
                <Icon style = {{marginRight: 20}} name = "check-circle" color = {(this.state.FichaAtendimentoPDF != null || this.state.FichaAtendimento.base64 != null) ? '#3C896D' : '#BC3908'} size = {15}/>
                <TouchableOpacity 
                  activeOpacity = {1}
                  style = {{
                    backgroundColor: this.props.StyleGlobal.cores.background,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    borderRadius: 5
                  }}
                  onPress = { async () => {
                    if(this.state.FichaAtendimento.base64 != null) 
                    {
                      this._mostraFoto('Atendimento', this.state.FichaAtendimento);
                      this.setState({anexo_atual: 'Atendimento'});
                      this.setVisibilidadeModalAnexos(true);
                      this.setState({VisibilidadeModalFichaAtendimento: false})
                    }
                    else
                    {
                      this.setState({VisibilidadeModalFichaAtendimento: true})
                    }
                  }}>
                    <Text style = {{ color: "#ffffff", fontWeight: "bold", width: 50, textAlign: 'center'}}>{(this.state.FichaAtendimentoPDF != null || this.state.FichaAtendimento.base64 != null) ? "Abrir" : "Anexar"}</Text>
                </TouchableOpacity>
              </View>
              <Modal // ficha de atendimento
                visible = {this.state.VisibilidadeModalFichaAtendimento}
                animationType = {"slide"}
                transparent = {false}>
                  <View style = {{flex: 1}}>
                    <View 
                      style = {{
                        backgroundColor: this.props.StyleGlobal.cores.background,
                        height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
                        justifyContent: "center"
                    }}>
                      <View 
                        style = {{
                          flexDirection: 'row', 
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 10
                      }}>
                        <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40}
                          onPress = {async () => {
                            await this.setState({VisibilidadeModalFichaAtendimento: false})
                        }}/>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 14,
                            textAlign: 'center',
                            color: '#FFFFFF'
                        }}>Ficha de atendimento</Text>
                        <View style = {{width: 40}}/>
                      </View>
                    </View>
                    <View
                      style = {{
                        marginHorizontal: 24, 
                        marginTop: 24, 
                        height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 117) : (Dimensions.get('window').height - 87),
                        justifyContent: 'space-between'
                    }}>
                        <View style = {{alignItems: 'center'}}>
                          {this.props.EmpresaLogada[0] == 4 && <IconEmpresaGAV width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          {this.props.EmpresaLogada[0] == 5 && <IconEmpresaHarmonia width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          {this.props.EmpresaLogada[0] == 8 && <IconEmpresaSilvaBranco width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          {this.props.EmpresaLogada[0] == 6 && <IconEmpresaMyBroker width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          <Text style = {{marginTop: -40, fontStyle: 'normal', fontWeight: 'bold', fontSize: 24, color: this.props.StyleGlobal.cores.background}}>Aviso!</Text>
                          <View style = {{marginHorizontal: 20, marginTop: 35}}>
                            <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: this.props.StyleGlobal.cores.background, lineHeight: 25}}>{"Qual opção deseja escolher para a ficha de atendimento?"}</Text>
                          </View>
                          <View style = {{marginTop: 35}}>
                            <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>Dúvidas</Text>
                            <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>vendas@</Text>
                            <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>(XX) XXXX-XXXX</Text>
                          </View>
                        </View>
                        <View style = {{ flexDirection: 'row'}}>
                          <TouchableOpacity
                            style = {{
                              flex: 1,
                              backgroundColor: '#FFFFFF',
                              borderWidth: 1,
                              borderColor: this.props.StyleGlobal.cores.botao,
                              paddingHorizontal: 16,
                              height: 58,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 20,
                              marginRight: 20,
                              borderRadius: 5
                            }}
                            onPress = { async () => {
                              if(this.state.FichaAtendimento.base64 ==  null) {
                                this._tiraFoto('Atendimento', this.state.FichaAtendimento);
                                this.setState({imageurl: this.state.FichaAtendimento, anexo_atual: 'Atendimento', scrollCarouselEnabled: false});
                                this.setVisibilidadeModalAnexos(true);
                                this.setState({VisibilidadeModalFichaAtendimento: false})
                              } else if(this.state.FichaAtendimento.base64 != null) {
                                this._mostraFoto('Atendimento', this.state.FichaAtendimento);
                                this.setState({anexo_atual: 'Atendimento'});
                                this.setVisibilidadeModalAnexos(true);
                                this.setState({VisibilidadeModalFichaAtendimento: false})
                              }
                            }}>
                            <Text
                              style = {{
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                fontSize: 14,
                                textAlign: 'center',
                                color: this.props.StyleGlobal.cores.botao,
                                alignSelf: 'center',
                            }}>Tirar foto</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style = {{
                              flex: 1,
                              backgroundColor: this.props.StyleGlobal.cores.botao,
                              paddingHorizontal: 16,
                              height: 58,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 20,
                              borderRadius: 5
                            }}
                            onPress = {async () => {

                              if (Platform.OS === "android")
                              {

                                this.setState({VisibilidadeModalFichaAtendimento: false})

                                const granted = await PermissionsAndroid.request(
                                  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                                  {
                                    title: "App permissão de acesso aos arquivos",
                                    message: "O App precisa de acesso ao arquivos",
                                    buttonNeutral: "Pergunte-me depois",
                                    buttonNegative: "Cancelar",
                                    buttonPositive: "OK"
                                  }
                                );
            
                                const grantedWrite = await PermissionsAndroid.request(
                                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                                  {
                                    title: "App permissão de acesso aos arquivos",
                                    message: "O App precisa de acesso ao arquivos",
                                    buttonNeutral: "Pergunte-me depois",
                                    buttonNegative: "Cancelar",
                                    buttonPositive: "OK"
                                  }
                                );
            
                                if((granted === PermissionsAndroid.RESULTS.GRANTED) && (grantedWrite === PermissionsAndroid.RESULTS.GRANTED))
                                {
                                  try {
            
                                    const res = await DocumentPicker.pick({
                                      type: [DocumentPicker.types.allFiles],
                                    });

                                    let extension = res.name.split(".").pop()

                                    if (extension == "pdf")
                                    {
                                      RNFetchBlob.fs.readFile(res.uri, 'base64')
                                      .then((data) => {
                                          this.state.FichaAtendimento.isPDF = true
                                          this.state.FichaAtendimento.base64 = data
                                          this.setState({FichaAtendimentoPDF: data})
                                      })
                                    }
                                    else if (extension == "jpg" || extension == "png" || extension == "jpeg") {
                                      RNFetchBlob.fs.readFile(res.uri, 'base64')
                                      .then((data) => {
                                        var dadosImage = `data:image/${extension};base64,${data}`
                                          this.state.FichaAtendimento = {
                                            "id": "Ficha de Atendimento",
                                            "habilitar_camera": false,
                                            "base64": data,
                                            "deviceOrientation": 1,
                                            "height": Dimensions.get('window').height,
                                            "pictureOrientation": 1,
                                            "uri": dadosImage,
                                            "width": Dimensions.get('window').width,
                                            "extensao": extension,
                                            "isPDF": false
                                          }
                                          this.setState({Renderizar: true})
                                      })
                                    }
                                    else
                                    {
                                      PushNotification.localNotification({
                                        largeIcon: 'icon',
                                        smallIcon: 'icon',
                                        vibrate: true,
                                        vibration: 300,
                                        title: 'My Broker',
                                        message: `Formato de arquivo inválido, selecione outro arquivo.`
                                      })
                                    }
            
                                    // RNFetchBlob.fs.readFile(res.uri, 'base64')
                                    // .then((data) => {
                                    //     this.state.FichaAtendimento.isPDF = true
                                    //     this.state.FichaAtendimento.base64 = data
                                    //     this.setState({FichaAtendimentoPDF: data})
                                    // })
            
                                  } catch (err) {
            
                                    if (DocumentPicker.isCancel(err)) 
                                    {
            
                                    } 
                                    else 
                                    {
                                      throw err;
                                    }
            
                                  }
                                }

                              }
                              else if (Platform.OS === "ios")
                              {

                                try {
            
                                  const res = await DocumentPicker.pick({
                                    type: [DocumentPicker.types.allFiles],
                                  });

                                  let filePath = (res.uri).replace('file://', "")

                                  let extension = res.name.split(".").pop()

                                  if (extension == "pdf")
                                  {
                                    RNFetchBlob.fs.readFile(filePath, 'base64')
                                    .then((data) => {
                                        this.state.FichaAtendimento.isPDF = true
                                        this.state.FichaAtendimento.base64 = data
                                        this.setState({FichaAtendimentoPDF: data})
                                    })
                                  }
                                  else if (extension == "jpg" || extension == "png" || extension == "jpeg") {
                                    RNFetchBlob.fs.readFile(filePath, 'base64')
                                    .then((data) => {
                                      var dadosImage = `data:image/${extension};base64,${data}`
                                        this.state.FichaAtendimento = {
                                          "id": "Ficha de Atendimento",
                                          "habilitar_camera": false,
                                          "base64": data,
                                          "deviceOrientation": 1,
                                          "height": Dimensions.get('window').height,
                                          "pictureOrientation": 1,
                                          "uri": dadosImage,
                                          "width": Dimensions.get('window').width,
                                          "extensao": extension,
                                          "isPDF": false
                                        }
                                        this.setState({Renderizar: true})
                                    })
                                  }
                                  else
                                  {
                                    PushNotification.localNotification({
                                      largeIcon: 'icon',
                                      smallIcon: 'icon',
                                      vibrate: true,
                                      vibration: 300,
                                      title: 'My Broker',
                                      message: `Formato de arquivo inválido, selecione outro arquivo.`
                                    })
                                  }
          
                                  // RNFetchBlob.fs.readFile(filePath, 'base64')
                                  // .then((data) => {
                                  //     this.state.FichaAtendimento.isPDF = true
                                  //     this.state.FichaAtendimento.base64 = data
                                  //     this.setState({FichaAtendimentoPDF: data})
                                  // })

                                  this.setState({VisibilidadeModalFichaAtendimento: false})
          
                                } catch (err) {
          
                                  if (DocumentPicker.isCancel(err)) 
                                  {
          
                                  } 
                                  else 
                                  {
                                    this.setState({VisibilidadeModalFichaAtendimento: false})
                                    throw err;
                                  }
          
                                }

                              }
                            }}>
                            <Text
                              style = {{
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                fontSize: 14,
                                textAlign: 'center',
                                color: '#FFFFFF',
                                alignSelf: 'center',
                            }}>Escolher PDF</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                  </View>
              </Modal>
            </View>}
            {this.props.EmpresaLogada[0] == 4 &&
            <View
              style = {{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
                justifyContent: "space-between",
                backgroundColor: "#FFFFFF",
                height: 48,
                borderRadius: 5,
                paddingHorizontal: 16,
                marginBottom: 20
            }}>
              <Text>Ficha de negociação</Text>
              <View 
                style = {{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
              }}>
                <Icon style = {{marginRight: 20}} name = "check-circle" color = {(this.state.FichaNegociacaoPDF != null || this.state.FichaNegociacao.base64 != null) ? '#3C896D' : '#BC3908'} size = {15}/>
                <TouchableOpacity 
                  activeOpacity = {1}
                  style = {{
                    backgroundColor: this.props.StyleGlobal.cores.background,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    borderRadius: 5
                  }}
                  onPress = { async () => {
                    if(this.state.FichaNegociacao.base64 != null) 
                      {
                        this._mostraFoto('Negociacao', this.state.FichaNegociacao);
                        this.setState({anexo_atual: 'Negociacao'});
                        this.setVisibilidadeModalAnexos(true);
                        this.setState({VisibilidadeModalFichaNegociacao: false})
                      }
                      else
                      {
                        this.setState({VisibilidadeModalFichaNegociacao: true})
                      }
                  }}>
                    <Text style = {{ color: "#ffffff", fontWeight: "bold", width: 50, textAlign: 'center'}}>{(this.state.FichaNegociacaoPDF != null || this.state.FichaNegociacao.base64 != null) ? "Abrir" : "Anexar"}</Text>
                </TouchableOpacity>
              </View>
              <Modal // ficha de negociacao
                visible = {this.state.VisibilidadeModalFichaNegociacao}
                animationType = {"slide"}
                transparent = {false}>
                  <View style = {{flex: 1}}>
                    <View 
                      style = {{
                        backgroundColor: this.props.StyleGlobal.cores.background,
                        height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
                        justifyContent: "center"
                    }}>
                      <View 
                        style = {{
                          flexDirection: 'row', 
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 10
                      }}>
                        <Icon name = {'keyboard-arrow-down'} color = {'#FFF'} size = {40}
                          onPress = {async () => {
                            await this.setState({VisibilidadeModalFichaNegociacao: false})
                        }}/>
                        <Text
                          style = {{
                            fontStyle: 'normal',
                            fontWeight: 'bold',
                            fontSize: 14,
                            textAlign: 'center',
                            color: '#FFFFFF'
                        }}>Ficha de negociacao</Text>
                        <View style = {{width: 40}}/>
                      </View>
                    </View>
                    <View
                      style = {{
                        marginHorizontal: 24, 
                        marginTop: 24, 
                        height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 117) : (Dimensions.get('window').height - 87),
                        justifyContent: 'space-between'
                      }}>
                        <View style = {{alignItems: 'center'}}>
                          {this.props.EmpresaLogada[0] == 4 && <IconEmpresaGAV width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          {this.props.EmpresaLogada[0] == 5 && <IconEmpresaHarmonia width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          {this.props.EmpresaLogada[0] == 8 && <IconEmpresaSilvaBranco width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          {this.props.EmpresaLogada[0] == 6 && <IconEmpresaMyBroker width = {150} height = {250} style = {{marginTop: - 50}}/>}
                          <Text style = {{marginTop: -40, fontStyle: 'normal', fontWeight: 'bold', fontSize: 24, color: this.props.StyleGlobal.cores.background}}>Aviso!</Text>
                          <View style = {{marginHorizontal: 20, marginTop: 35}}>
                            <Text style = {{fontStyle: 'normal', fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: this.props.StyleGlobal.cores.background, lineHeight: 25}}>{"Qual opção deseja escolher para a ficha de negociacao?"}</Text>
                          </View>
                          <View style = {{marginTop: 35}}>
                            <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>Dúvidas</Text>
                            <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>vendas@</Text>
                            <Text style = {{textAlign: 'center', fontStyle: 'normal', fontWeight: '500', fontSize: 12, color: '#677367', marginTop: 4}}>(XX) XXXX-XXXX</Text>
                          </View>
                        </View>
                        <View style = {{ flexDirection: 'row'}}>
                          <TouchableOpacity
                            style = {{
                              flex: 1,
                              backgroundColor: '#FFFFFF',
                              borderWidth: 1,
                              borderColor: this.props.StyleGlobal.cores.botao,
                              paddingHorizontal: 16,
                              height: 58,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 20,
                              marginRight: 20,
                              borderRadius: 5
                            }}
                            onPress = { async () => {
                              if(this.state.FichaNegociacao.base64 ==  null) {
                                this._tiraFoto('Negociacao', this.state.FichaNegociacao);
                                this.setState({imageurl: this.state.FichaNegociacao, anexo_atual: 'Negociacao', scrollCarouselEnabled: false});
                                this.setVisibilidadeModalAnexos(true);
                                this.setState({VisibilidadeModalFichaNegociacao: false})
                              } else if(this.state.FichaNegociacao.base64 != null) {
                                this._mostraFoto('Negociacao', this.state.FichaNegociacao);
                                this.setState({anexo_atual: 'Negociacao'});
                                this.setVisibilidadeModalAnexos(true);
                                this.setState({VisibilidadeModalFichaNegociacao: false})
                              }
                          }}>
                            <Text
                              style = {{
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                fontSize: 14,
                                textAlign: 'center',
                                color: this.props.StyleGlobal.cores.botao,
                                alignSelf: 'center',
                            }}>Tirar foto</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style = {{
                              flex: 1,
                              backgroundColor: this.props.StyleGlobal.cores.botao,
                              paddingHorizontal: 16,
                              height: 58,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 20,
                              borderRadius: 5
                            }}
                            onPress = {async () => {

                              if (Platform.OS === "android")
                              {
                                this.setState({VisibilidadeModalFichaNegociacao: false})

                                const granted = await PermissionsAndroid.request(
                                  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                                  {
                                    title: "App permissão de acesso aos arquivos",
                                    message: "O App precisa de acesso ao arquivos",
                                    buttonNeutral: "Pergunte-me depois",
                                    buttonNegative: "Cancelar",
                                    buttonPositive: "OK"
                                  }
                                );
            
                                const grantedWrite = await PermissionsAndroid.request(
                                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                                  {
                                    title: "App permissão de acesso aos arquivos",
                                    message: "O App precisa de acesso ao arquivos",
                                    buttonNeutral: "Pergunte-me depois",
                                    buttonNegative: "Cancelar",
                                    buttonPositive: "OK"
                                  }
                                );
            
                                if((granted === PermissionsAndroid.RESULTS.GRANTED) && (grantedWrite === PermissionsAndroid.RESULTS.GRANTED))
                                {
                                  try {
            
                                    const res = await DocumentPicker.pick({
                                      type: [DocumentPicker.types.allFiles],
                                    });
            
                                    let extension = res.name.split(".").pop()

                                    if (extension == "pdf")
                                    {
                                      RNFetchBlob.fs.readFile(res.uri, 'base64')
                                      .then((data) => {
                                          this.state.FichaNegociacao.isPDF = true
                                          this.state.FichaNegociacao.base64 = data
                                          this.setState({FichaNegociacaoPDF: data})
                                      })
                                    }
                                    else if (extension == "jpg" || extension == "png" || extension == "jpeg") {
                                      RNFetchBlob.fs.readFile(res.uri, 'base64')
                                      .then((data) => {
                                        var dadosImage = `data:image/${extension};base64,${data}`
                                          this.state.FichaNegociacao = {
                                            "id": "Ficha de Negociacao",
                                            "habilitar_camera": false,
                                            "base64": data,
                                            "deviceOrientation": 1,
                                            "height": Dimensions.get('window').height,
                                            "pictureOrientation": 1,
                                            "uri": dadosImage,
                                            "width": Dimensions.get('window').width,
                                            "extensao": extension,
                                            "isPDF": false
                                          }
                                          this.setState({Renderizar: true})
                                      })
                                    }
                                    else
                                    {
                                      PushNotification.localNotification({
                                        largeIcon: 'icon',
                                        smallIcon: 'icon',
                                        vibrate: true,
                                        vibration: 300,
                                        title: 'My Broker',
                                        message: `Formato de arquivo inválido, selecione outro arquivo.`
                                      })
                                    }
            
                                  } catch (err) {
            
                                    if (DocumentPicker.isCancel(err)) 
                                    {
            
                                    } 
                                    else 
                                    {
                                      throw err;
                                    }
            
                                  }
                                }
                              }
                              else if (Platform.OS === "ios")
                              {

                                try {
            
                                  const res = await DocumentPicker.pick({
                                    type: [DocumentPicker.types.allFiles],
                                  });

                                  let filePath = (res.uri).replace('file://', "")

                                  let extension = res.name.split(".").pop()

                                  if (extension == "pdf")
                                  {
                                    RNFetchBlob.fs.readFile(filePath, 'base64')
                                    .then((data) => {
                                        this.state.FichaNegociacao.isPDF = true
                                        this.state.FichaNegociacao.base64 = data
                                        this.setState({FichaNegociacaoPDF: data})
                                    })
                                  }
                                  else if (extension == "jpg" || extension == "png" || extension == "jpeg") {
                                    RNFetchBlob.fs.readFile(filePath, 'base64')
                                    .then((data) => {
                                      var dadosImage = `data:image/${extension};base64,${data}`
                                        this.state.FichaNegociacao = {
                                          "id": "Ficha de Negociacao",
                                          "habilitar_camera": false,
                                          "base64": data,
                                          "deviceOrientation": 1,
                                          "height": Dimensions.get('window').height,
                                          "pictureOrientation": 1,
                                          "uri": dadosImage,
                                          "width": Dimensions.get('window').width,
                                          "extensao": extension,
                                          "isPDF": false
                                        }
                                        this.setState({Renderizar: true})
                                    })
                                  }
                                  else
                                  {
                                    PushNotification.localNotification({
                                      largeIcon: 'icon',
                                      smallIcon: 'icon',
                                      vibrate: true,
                                      vibration: 300,
                                      title: 'My Broker',
                                      message: `Formato de arquivo inválido, selecione outro arquivo.`
                                    })
                                  }
          
                                  // RNFetchBlob.fs.readFile(filePath, 'base64')
                                  // .then((data) => {
                                  //     this.state.FichaNegociacao.isPDF = true
                                  //     this.state.FichaNegociacao.base64 = data
                                  //     this.setState({FichaNegociacaoPDF: data})
                                  // })

                                  this.setState({VisibilidadeModalFichaNegociacao: false})
          
                                } catch (err) {
          
                                  if (DocumentPicker.isCancel(err)) 
                                  {
          
                                  } 
                                  else 
                                  {
                                    this.setState({VisibilidadeModalFichaNegociacao: false})
                                    throw err;
                                  }
          
                                }

                              }
                          }}>
                            <Text
                              style = {{
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                fontSize: 14,
                                textAlign: 'center',
                                color: '#FFFFFF',
                                alignSelf: 'center',
                            }}>Escolher PDF</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                  </View>
              </Modal>
            </View>}
          </View>
          <View
            style = {{
              paddingHorizontal: 24, 
              flexDirection: 'row'
          }}>
            <TouchableOpacity // Anexos
              activeOpacity = {0.75}
              style = {{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: this.props.StyleGlobal.cores.botao,
                paddingHorizontal: 16,
                height: 58,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                marginRight: 20,
                borderRadius: 5,
            }}
              onPress = {this.acessandoListaDeAnexos}>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 16,
                  textAlign: 'center',
                  color: this.props.StyleGlobal.cores.botao,
                  alignSelf: 'center',
              }}>Anexos</Text>
            </TouchableOpacity>
            <TouchableOpacity // Avançar
              activeOpacity = {0.75}
              style = {{
                flex: 1,
                backgroundColor: this.props.StyleGlobal.cores.botao,
                paddingHorizontal: 16,
                height: 58,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                borderRadius: 5
            }}
              onPress = { async () => {
                await this.dadosDocumentos()
                // await this.sendDocumentos()
                await this.verificandoDocumentos()
                await this.dadosCliente()
                await this.setVisibilidadeModalOption(true)
            }}>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#FFFFFF',
                  alignSelf: 'center',
              }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Container>
    );
  }
  //#endregion

  //#region Controller

  //#region Setando a visibilidade da modal de proposta enviada
  setVisibilidadeModalPropostaEnviada(value) {
    this.setState({VisibilidadeModalPropostaEnviada: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de validação de arquivos
  setVisibilidadeModalValidandoArquivos(value) {
    this.setState({VisibilidadeModalValidandoArquivos: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de opcoes
  setVisibilidadeModalOption = async (value) => {
    this.setState({VisibilidadeModalOption: value})
    await this.setState({
      ModalOptionMensagem: 'Deseja aprovar e confirmar o lançamento desta venda no sistema do cliente? \n\nLembre-se de que, ao aprovar, estará concordando com todos os dados imputados quanto ao cadastro do(s) cliente(s), bem como os valores descrito nesta proposta.',
    })
  }
  //#endregion

  //#region Selecionando a opção sim na modal de opções
  setandoOpcaoSimNaModalOption = async () => {
    this.state.VisibilidadeModalOption = false
    await this.setVisibilidadeModalValidandoArquivos(true);
    await this.postPropostaDeVenda();
  }
  //#endregion

  //#region Selecionando a opção não na modal de opções
  setandoOpcaoNaoNaModalOption = async () => {
    await this.setVisibilidadeModalOption(false)
  }
  //#endregion

  //#region Renderizando itens do carousel
  renderItemCarousel = ({ item, index }) => {
    return(
      <View 
        key = {item.id} 
        style = {{
          flex: 1, justifyContent: 'center', alignItems: 'center',
          backgroundColor: 'transparent',
          borderRadius: 10, borderWidth: 1.2, borderColor: 'transparent'
      }}>
        <View style = {{flex: 1, justifyContent: 'center', marginTop: 20}}>
          <View style = {{width: Dimensions.get('window').width}}>
            <Text style = {{fontSize: 25, textAlign: 'center'}}>{item.id}</Text>
          </View>
          {item.habilitar_camera == false && item.isPDF == false &&
          <TouchableOpacity  style = {{alignItems: 'center'}} activeOpacity = {item.base64 == null ? 0.8 : 1} 
            onPress = { async () => {
              if (item.base64 == null) {
                if ((item.id).indexOf('Check List') != -1) {
                  item.habilitar_camera = true,
                  item.isPDF = false,
                  await this.setState({imageurl: item, anexo_atual: 'Check List', scrollCarouselEnabled: false})
                } else if ((item.id).indexOf('Comprovante Entrada') != -1) {
                  item.habilitar_camera = true,
                  item.isPDF = false,
                  await this.setState({imageurl: item, anexo_atual: 'Comprovante Entrada', scrollCarouselEnabled: false})
                } else if ((item.id).indexOf('Atendimento') != -1) {
                  item.habilitar_camera = true,
                  item.isPDF = false,
                  await this.setState({imageurl: item, anexo_atual: 'Atendimento', scrollCarouselEnabled: false})
                } else if ((item.id).indexOf('Negociacao') != -1) {
                  item.habilitar_camera = true,
                  item.isPDF = false,
                  await this.setState({imageurl: item, anexo_atual: 'Negociacao', scrollCarouselEnabled: false})
                }
              }
            }}>
            {item.base64 != null &&
              <Image style = {{flex: 1, width: Dimensions.get('window').width*0.95, height: Dimensions.get('window').height*0.9}} source = {item.base64 == null ? ImagemCamera : item} resizeMode = {item.base64 == null ? 'center' : 'contain'}
            />}
            {item.base64 == null &&
              <Cam width = {Dimensions.get('window').width * 0.95} height = {Dimensions.get('window').height*0.9} style = {{flex: 1}}
            />}
          </TouchableOpacity>}
          {item.isPDF == true && 
            <PDFView
              fadeInDuration = {250}
              style = {{flex: 1}}
              resource = {item.base64}
              resourceType = {"base64"}
              onLoad = {() => {}}
              onError = {() => {}}
            />
          }
          {item.habilitar_camera == true && item.isPDF == false &&
            <>
              <RNCamera
                ref = {ref => {this.camera = ref}}
                style = {styles.preview}
                type = {this.state.cameraType}
                flashMode = {this.state.FlashCamera}
                autoFocus = {RNCamera.Constants.AutoFocus.on}
                ratio = {"4:3"}
                whiteBalance = {"auto"}
                captureAudio = {false}
                androidCameraPermissionOptions = {{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                androidRecordAudioPermissionOptions = {{
                  title: 'Permission to use audio recording',
                  message: 'We need your permission to use your audio',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                onGoogleVisionBarcodesDetected = {({ barcodes }) => {
                  console.log(barcodes[0].data);
                }}
                googleVisionBarcodeType = {RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.ALL}
                googleVisionBarcodeMode = {RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeMode.NORMAL}
                >
                <View style = {{flex: 0, flexDirection: 'row', width: Dimensions.get('window').width, justifyContent: 'space-between', backgroundColor: this.props.StyleGlobal.cores.background}}>
                  <TouchableOpacity activeOpacity = {1}
                  style = {{flex: 0, marginVertical: 20, alignSelf: 'center', marginLeft: 20}}
                  onPress = { async () => {
                    item.habilitar_camera = false
                    this.setState({imageurl: null, scrollCarouselEnabled: true, VisibilidadeModalAnexos: false})
                  }}>
                    <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                      <Icon name = "close" size = {30} color = "#FFFFFF"/>
                      <Text style = {{color: '#FFFFFF', fontStyle: 'normal', fontWeight: '500', fontSize: 14, textAlign: 'center'}}>Cancelar</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity = {1}
                    onPress = { async () => {
                      
                      if(this.camera) {
                        const options = {
                          quality: 0.5,
                          base64: true,
                          fixOrientation: true,
                          skipProcessing: true,
                        };
                        const data = await this.camera.takePictureAsync(options);
                        item.base64 = data.base64;
                        item.deviceOrientation = data.deviceOrientation;
                        item.height = data.height;
                        item.pictureOrientation = data.pictureOrientation;
                        item.uri = data.uri;
                        item.width = data.width;
                        item.isPDF = false;
                      }

                      item.habilitar_camera = false
                      this.setState({imageurl: null, scrollCarouselEnabled: true})
                  }} style = {styles.capture}>
                  {this.state.indicatorCamera == false &&
                    <Icon name = "radio-button-checked" size = {55} color = "#FFFFFF"/>}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity = {1}
                    onPress = { async () => {
                      if(this.state.FlashCamera == RNCamera.Constants.FlashMode.off)
                      {
                        await this.setState({FlashCamera: RNCamera.Constants.FlashMode.on})
                      }
                      else
                      {
                        await this.setState({FlashCamera: RNCamera.Constants.FlashMode.off})
                      }
                    }} 
                    style = {{
                      flex: 0, 
                      marginVertical: 20, 
                      alignSelf: 'center', 
                      marginRight: 20
                    }}>
                  {this.state.indicatorCamera == false &&
                    <Icon name = "flash-on" size = {30} color = "#FFFFFF"/>}
                  </TouchableOpacity>
                </View>
              </RNCamera>
            </>}
        </View>
        <View style = {{position: 'absolute', justifyContent: 'center', alignItems: 'center',
          bottom: 80}}>
          {item.habilitar_camera == false && ((item.id).indexOf('Check List') != -1 || (item.id).indexOf('Comprovante Entrada') != -1 || (item.id).indexOf('Atendimento') != -1 || (item.id).indexOf('Negociacao') != -1) &&
            <Icon name = 'delete' size = {55} color = {'#B15757'} style = {{opacity: 0.75}}
              onPress = { async () => {
                if((item.id).indexOf('Check List') != -1) {
                    Alert.alert(
                      'Caro Usuário',
                      'Deseja substituir a foto fo Check List de cadastro por uma nova? 🤔',
                      [
                        {
                          text: 'Não',
                          onPress: async () => {

                            this.state.anexosDocumentos = this.state.anexosDocumentos.map((anexo) => {return anexo})
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.CheckListCadastro = {
                              "id": item.id,
                              "habilitar_camera": false,
                              "base64": null, 
                              "deviceOrientation": null, 
                              "height": null, 
                              "pictureOrientation": null, 
                              "uri": null, 
                              "width": null,
                              "isPDF": false, 
                            }

                            Anexos[index] = this.state.CheckListCadastro

                            // item.habilitar_camera = false
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false

                            await this.setState({anexo_atual: this.state.anexo_atual, imageurl: null, CheckListCadastroPDF: null, VisibilidadeModalAnexos: false, anexosDocumentos: Anexos})

                          },
                          style: 'cancel',
                        },
                        { text: 'Sim',
                          onPress: async () => {
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.CheckListCadastro = {
                              "id": item.id,
                              "habilitar_camera": false,
                              "base64": null, 
                              "deviceOrientation": null, 
                              "height": null, 
                              "pictureOrientation": null, 
                              "uri": null, 
                              "width": null,
                              "isPDF": false, 
                            }

                            Anexos[index] = this.state.CheckListCadastro

                            // item.habilitar_camera = true
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false

                            await this.setState({imageurl: item, anexo_atual: item.id, scrollCarouselEnabled: true, CheckListCadastroPDF: null, VisibilidadeModalAnexos: false, VisibilidadeModalCheckListCadastro: true, anexosDocumentos: Anexos})
                        }}
                      ],
                      {cancelable: false},
                    )
                } else if ((item.id).indexOf('Comprovante Entrada') != -1) {
                    Alert.alert(
                      'Caro Usuário',
                      'Deseja substituir a foto do comprovante de entrada por uma nova? 🤔',
                      [
                        {
                          text: 'Não',
                          onPress: async () => {

                            this.state.anexosDocumentos = this.state.anexosDocumentos.map((anexo) => {return anexo})
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.ComprovanteEntrada = {
                              "id": item.id,
                              "habilitar_camera": false,
                              "base64": null, 
                              "deviceOrientation": null, 
                              "height": null, 
                              "pictureOrientation": null, 
                              "uri": null, 
                              "width": null,
                              "isPDF": false, 
                            }

                            Anexos[index] = this.state.ComprovanteEntrada

                            // item.habilitar_camera = false
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false

                            await this.setState({anexo_atual: this.state.anexo_atual, imageurl: null, ComprovanteEntradaPDF: null, VisibilidadeModalAnexos: false, anexosDocumentos: Anexos})
                          },
                          style: 'cancel',
                        },
                        { text: 'Sim',
                          onPress: async () => {
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.ComprovanteEntrada = {
                              "id": item.id,
                              "habilitar_camera": true,
                              "base64": null, 
                              "deviceOrientation": null, 
                              "height": null, 
                              "pictureOrientation": null, 
                              "uri": null, 
                              "width": null,
                              "isPDF": false, 
                            }

                            Anexos[index] = this.state.ComprovanteEntrada

                            // item.habilitar_camera = true
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false

                            await this.setState({imageurl: item, anexo_atual: item.id, scrollCarouselEnabled: false, ComprovanteEntradaPDF: null, VisibilidadeModalAnexos: false, VisibilidadeModalComprovanteEntrada: true, anexosDocumentos: Anexos})
                          }}
                      ],
                      {cancelable: false},
                    )
                } else if ((item.id).indexOf('Atendimento') != -1) {
                    Alert.alert(
                      'Caro Usuário',
                      'Deseja substituir a foto da ficha de atendimento por uma nova? 🤔',
                      [
                        {
                          text: 'Não',
                          onPress: async () => {
                            
                            this.state.anexosDocumentos = this.state.anexosDocumentos.map((anexo) => {return anexo})
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.FichaAtendimento = {
                              "id": item.id,
                              "habilitar_camera": false,
                              "base64": null, 
                              "deviceOrientation": null, 
                              "height": null, 
                              "pictureOrientation": null, 
                              "uri": null, 
                              "width": null,
                              "isPDF": false, 
                            }

                            Anexos[index] = this.state.FichaAtendimento

                            // item.habilitar_camera = false
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false
                            
                            await this.setState({anexo_atual: this.state.anexo_atual, imageurl: null, FichaAtendimentoPDF: null, VisibilidadeModalAnexos: false, anexosDocumentos: Anexos})
                          },
                          style: 'cancel',
                        },
                        { text: 'Sim',
                          onPress: async () => {
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.FichaAtendimento = {
                              "id": item.id,
                              "habilitar_camera": true,
                              "base64": null, 
                              "deviceOrientation": null, 
                              "height": null, 
                              "pictureOrientation": null, 
                              "uri": null, 
                              "width": null,
                              "isPDF": false, 
                            }

                            Anexos[index] = this.state.FichaAtendimento

                            // item.habilitar_camera = true
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false

                            await this.setState({imageurl: item, anexo_atual: item.id, scrollCarouselEnabled: false, FichaAtendimentoPDF: null, VisibilidadeModalAnexos: false, VisibilidadeModalComprovanteEntrada: true, anexosDocumentos: Anexos})
                        }}
                      ],
                      {cancelable: false},
                    )
                } else if ((item.id).indexOf('Negociacao') != -1) {
                    Alert.alert(
                      'Caro Usuário',
                      'Deseja substituir a fota ficha de negociacao por uma nova? 🤔',
                      [
                        {
                          text: 'Não',
                          onPress: async () => {

                            this.state.anexosDocumentos = this.state.anexosDocumentos.map((anexo) => {return anexo})

                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.FichaNegociacao = {
                              "id": item.id,
                              "habilitar_camera": false,
                              "base64": null, 
                              "deviceOrientation": null, 
                              "height": null, 
                              "pictureOrientation": null, 
                              "uri": null, 
                              "width": null,
                              "isPDF": false, 
                            }

                            Anexos[index] = this.state.FichaNegociacao

                            // item.habilitar_camera = false
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false
                            
                            await this.setState({anexo_atual: this.state.anexo_atual, imageurl: null, FichaNegociacaoPDF: null, VisibilidadeModalAnexos: false, anexosDocumentos: Anexos})
                          },
                          style: 'cancel',
                        },
                        { text: 'Sim',
                          onPress: async () => {
                            
                            let Anexos = [...this.state.anexosDocumentos]

                            this.state.FichaNegociacao = {
                              "id": item.id,
                              "habilitar_camera": true,
                              "base64": null, 
                              "deviceOrientation": null, 
                              "height": null, 
                              "pictureOrientation": null, 
                              "uri": null, 
                              "width": null,
                              "isPDF": false, 
                            }

                            Anexos[index] = this.state.FichaNegociacao

                            // item.habilitar_camera = true
                            // item.base64 = null
                            // item.deviceOrientation = null
                            // item.height = null
                            // item.pictureOrientation = null
                            // item.uri = null
                            // item.width = null
                            // item.isPDF = false
                            
                            await this.setState({imageurl: item, anexo_atual: item.id, scrollCarouselEnabled: false, FichaNegociacaoPDF: null, VisibilidadeModalAnexos: false, VisibilidadeModalFichaNegociacao: true, anexosDocumentos: Anexos})
                        }}
                      ],
                      {cancelable: false},
                    )
            }}}/>}
        </View>
      </View>
    );
  }
  //#endregion

  //#region Pegando dos do RG de Cargo na navegação de tela
  pegandoDadosDeRG_Cargo = async () => {
    const RGCliente = await this.props.navigation.getParam('RGCliente', 'null')
    const OrgaoEmissorCliente = await this.props.navigation.getParam('OrgaoEmissorCliente', 'null')
    const UFRGCliente = await this.props.navigation.getParam('UFRGCliente', 'null')
    const RGConjuge = await this.props.navigation.getParam('RGConjuge', 'null')
    const OrgaoEmissorConjuge = await this.props.navigation.getParam('OrgaoEmissorConjuge', 'null')
    const UFRGConjuge = await this.props.navigation.getParam('UFRGConjuge', 'null')
    const OcupacaoCliente = await this.props.navigation.getParam('OcupacaoCliente', 'null')
    const OcupacaoConjuge = await this.props.navigation.getParam('OcupacaoConjuge', 'null')
    await this.setState({RGCliente: RGCliente, OrgaoEmissorCliente: OrgaoEmissorCliente, UFRGCliente: UFRGCliente, RGConjuge: RGConjuge, OrgaoEmissorConjuge:OrgaoEmissorConjuge, UFRGConjuge:UFRGConjuge, OcupacaoCliente: OcupacaoCliente, OcupacaoConjuge: OcupacaoConjuge})
  }
  //#endregion

  //#region Tirando a foto
  takePicture = async () => {
    if(this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        fixOrientation: true,
        skipProcessing: true,
      };
      const data = await this.camera.takePictureAsync(options);
      this.state.imageurl.base64 = data.base64;
      this.state.imageurl.deviceOrientation = data.deviceOrientation;
      this.state.imageurl.height = data.height;
      this.state.imageurl.pictureOrientation = data.pictureOrientation;
      this.state.imageurl.uri = data.uri;
      this.state.imageurl.width = data.width;
      if (this.state.imageurl == 'RG') {
        this.state.Documento_rg.arquivo = data.base64
      } else if (this.state.imageurl == 'RG do Conjugê') {
        this.state.Documento_rgconjuge = data.base64
      } else if (this.state.imageurl  == 'Comprovante de end.') {
        this.state.Documento_endereco = data.base64
      } else if (this.state.imageurl == 'Estado Civil') {
        this.state.Documento_certidao = data.base64
      }
    }
  }
  //#endregion

  //#region Carregando anexos
  anexos = async () => {

    this.state.anexosDocumentos = []

    if (this.props.DocumentosOriginaisLista != "")
    {
      for (var index = 0; index < this.props.DocumentosOriginaisLista[0].length; index++)
      {
        this.state.anexosDocumentos.push(this.props.DocumentosOriginaisLista[0][index])
      }
    }

    if(this.props.EmpresaLogada[0] == 4)
    {
      if(this.state.CheckListCadastro.base64 != null || this.state.CheckListCadastro.base64 == null)
      {
        this.state.anexosDocumentos.push(this.state.CheckListCadastro)
      }
      if(this.state.ComprovanteEntrada.base64 != null || this.state.ComprovanteEntrada.base64 == null)
      {
        this.state.anexosDocumentos.push(this.state.ComprovanteEntrada)
      }
      if(this.state.FichaAtendimento.base64 != null || this.state.FichaAtendimento.base64 == null)
      {
        this.state.anexosDocumentos.push(this.state.FichaAtendimento)
      }
      if(this.state.FichaNegociacao.base64 != null || this.state.FichaNegociacao.base64 == null)
      {
        this.state.anexosDocumentos.push(this.state.FichaNegociacao)
      }
    }

  }
  //#endregion

  //#region Função para tirar foto
  _tiraFoto = async (option) => {
    this.state.anexosDocumentos = []
    if (option.indexOf("Check List") != -1) {
      this.state.CheckListCadastro.habilitar_camera = true
      this.state.anexosDocumentos.push(this.state.CheckListCadastro);
    } else if(option.indexOf('Comprovante Entrada') != -1) {
      this.state.ComprovanteEntrada.habilitar_camera = true
      this.state.anexosDocumentos.push(this.state.ComprovanteEntrada);
    } else if (option.indexOf('Atendimento') != -1) {
      this.state.FichaAtendimento.habilitar_camera = true
      this.state.anexosDocumentos.push(this.state.FichaAtendimento)
    } else if (option.indexOf('Negociacao') != -1) {
      this.state.FichaNegociacao.habilitar_camera = true
      this.state.anexosDocumentos.push(this.state.FichaNegociacao)
    }
  }
  //#endregion

  //#region Mostrar foto
  _mostraFoto = async (option) => {
    this.state.anexosDocumentos = []
    if (option.indexOf("Check List") != -1) {
      this.state.anexosDocumentos.push(this.state.CheckListCadastro)
    } else if(option.indexOf('Comprovante Entrada') != -1) {
      this.state.anexosDocumentos.push(this.state.ComprovanteEntrada)
    } else if (option.indexOf('Atendimento') != -1) {
      this.state.anexosDocumentos.push(this.state.FichaAtendimento)
    } else if (option.indexOf('Negociacao') != -1) {
      this.state.anexosDocumentos.push(this.state.FichaNegociacao)
    }
  }
  //#endregion

  //#region Acessando lista de anexos
  acessandoListaDeAnexos = async () => {
    this.anexos();
    this.setState({anexo_atual: this.state.anexosDocumentos[0].id});
    this.setVisibilidadeModalAnexos(true);
  }
  //#endregion

  //#region Setando a visibilidade da modal dos anexos
  setVisibilidadeModalAnexos(value) {
    this.setState({VisibilidadeModalAnexos: value})
  }
  //#endregion

  //#region Dados do cliente
  dadosCliente = async () => {
    this.state.dadosCliente = {
      "id": this.props.Lead[0].id,
      "cpf": this.props.CPF_CNPJ[0].CPF_CNPJ,
      "nome": this.props.Nome[0].Nome,
      "natureza": 2,
      "dataDeNascimento": moment(this.props.DataDeNascimento[0].Data_nasc, "MM-DD-YYYY", true).format("YYYY-MM-DD"),
      "emails": (this.props.DadosCliente[4].Email != "" && this.props.DadosCliente[4].Email != null) ? [this.props.Email[0].Email] : null,
      "documentoPessoal": (this.state.Documento_rg.arquivo != null) ? this.state.Documento_rg : null,
      "rg": {
        "numero": this.props.RGCliente[0].RG,
        "orgaoEmissor": this.props.OrgaoEmissorCliente[0].OrgaoEmissor,
        "uf": this.props.UFRGCliente[0].UFRG
      },
      "creci": null,
      "estadoCivil": this.props.EstadoCivil[0].EstadoCivil,
      "documentoDeEstadoCivil": (this.state.Documento_certidao.arquivo != null) ? this.state.Documento_certidao : null,
      "regimeDeBens": this.props.EstadoCivil[0].EstadoCivil == 2 ? this.props.RegimeDeBens[0].RegimeDeBens : null,
      "ocupacao": (this.props.OcupacaoCliente != "" && this.props.OcupacaoCliente != null) ? this.props.OcupacaoCliente[0].Ocupacao : null,
      "necessarioAssinaturaDoConjuge": this.props.AssinaturaConjuge == "" ? false : true,
      "conjuge": this.props.EstadoCivil[0].EstadoCivil == 2 ? {
        "id": this.props.RegistroConjuge[0].Registros.ID == 0 ? null : this.props.RegistroConjuge[0].Registros.ID,
        "cpf": this.props.CPF_CNPJ_Conjuge[0].CPF_CNPJ_Conjuge,
        "nome": this.props.Nome_Conjuge[0].Nome_Conjuge,
        "natureza": 2,
        "dataDeNascimento": moment(this.props.DataDeNascimento_Conjuge[0].Data_nasc_Conjuge, "MM-DD-YYYY", true).format("YYYY-MM-DD"),
        "emails": (this.props.DadosConjuge[4].email_Conjuge != "" && this.props.DadosConjuge[4].email_Conjuge != null) ? [this.props.Email_Conjuge[0].email_Conjuge]: null,
        "documentoPessoal": (this.state.Documento_rgconjuge.arquivo != null) ? this.state.Documento_rgconjuge : null,
        "rg": {
          "numero": this.props.RGConjuge[0].RG,
          "orgaoEmissor": this.props.OrgaoEmissorConjuge[0].OrgaoEmissor,
          "uf": this.props.UFRGConjuge[0].UFRG
        },
        "creci": null,
        "ocupacao": (this.props.OcupacaoConjuge != "" && this.props.OcupacaoConjuge != null) ? this.props.OcupacaoConjuge[0].Ocupacao : null,
      } : null,
      "endereco": this.props.Endereco[1] != "" && this.props.Endereco[1] != null ? this.props.Endereco[1] : null,
      "documentoEndereco": (this.state.Documento_endereco.arquivo != null) ? this.state.Documento_endereco : null,
      "telefones": (this.props.Telefone != "" && this.props.Telefone != null) ? this.props.Telefone[1].Telefones : null,
    }
  }
  //#endregion

  //#region Valor para assinatura do Conjuge
  ValorAssinaturaConjuge = async () => {
    const value = await this.props.navigation.getParam('ValueAssinaturaConjuge', 'null')
    await this.setState({ValueAssinaturaConjuge: value})
  }
  //#endregion

  //#region Dados da tabela de precos
  dadosTabela = async () => {
    const tabela = this.props.Tabela[0].tabelaCompleta
    await this.setState({dadosCentroDeCusto: tabela.centroDeCusto, dadosEmpresa: tabela.empresa, dadosDoModeloDeVenda: tabela.modeloDeVenda})
    await this.setState({indiceCorrecao: this.state.dadosDoModeloDeVenda.gruposIndexadores[0].indexadores[0].sigla, jurosCompensatorio: this.state.dadosDoModeloDeVenda.jurosDeTabela})
  }
  //#endregion

  //#region Separando documentos originais
  separandoDocumentosOriginais = async () => {
    if (this.props.DocumentosOriginais != "" && this.props.DocumentosOriginais != null) {
      if (this.props.DocumentosOriginais[0].filter(documentos => documentos.id == 'RG') != "") {
        this.state.FotoIdentidade = this.props.DocumentosOriginais[0].filter(documentos => documentos.id == 'RG')[0]
      }
      if (this.props.DocumentosOriginais[0].filter(documentos => documentos.id == 'RG do Conjugê') != "") {
        this.state.FotoIdentidadeConjuge = this.props.DocumentosOriginais[0].filter(documentos => documentos.id == 'RG do Conjugê')[0]
      }
      if (this.props.DocumentosOriginais[0].filter(documentos => documentos.id == 'Comprovante end.') != "") {
        this.state.FotoEndereco = this.props.DocumentosOriginais[0].filter(documentos => documentos.id == 'Comprovante end.')[0]
      }
      if (this.props.DocumentosOriginais[0].filter(documentos => documentos.id == 'Estado Civil') != "") {
        this.state.FotoCertidao = this.props.DocumentosOriginais[0].filter(documentos => documentos.id == 'Estado Civil')[0]
      }
    }
  }
  //#endregion

  //#region Separando os documentos
  separandoDocumentos = async () => {
    if(this.props.Documentos != "" && this.props.Documentos != null) {
      if(this.props.Documentos[1].Documentos.filter(documentos => documentos.classificacao == 1) != "") {
        this.state.Documento_rg = this.props.Documentos[1].Documentos.filter(documento => documento.classificacao == 1)[0]
      }
      if(this.props.Documentos[1].Documentos.filter(documentos => documentos.classificacao == 2) != "") {
        this.state.Documento_endereco = this.props.Documentos[1].Documentos.filter(documentos => documentos.classificacao == 2)[0]
      }
      if(this.props.Documentos[1].Documentos.filter(documentos => documentos.classificacao == 3) != "") {
        this.state.Documento_certidao = this.props.Documentos[1].Documentos.filter(documentos => documentos.classificacao == 3)[0]
      }
    }
    if(this.props.DocumentosConjuge != "" && this.props.DocumentosConjuge != null) {
      if(this.props.DocumentosConjuge[1].Documentos != "" && this.props.DocumentosConjuge[1].Documentos != null) {
        this.state.Documento_rgconjuge = this.props.DocumentosConjuge[1].Documentos[0]
      }
    }
  }
  //#endregion

  //#region Verificando os documentos
  verificandoDocumentos = async () => {
    if(this.state.FotoIdentidade.base64 != null && this.state.Documento_rg.arquivo != null && this.state.Documento_rg.extensao == null) {
      this.state.Documento_rg.extensao = this.state.FotoIdentidade.uri.substr((this.state.FotoIdentidade.uri).lastIndexOf(".") + 1, this.state.FotoIdentidade.uri.length - (this.state.FotoIdentidade.uri).lastIndexOf("."))
    }
    if (this.state.FotoIdentidadeConjuge.base64 != null && this.state.Documento_rgconjuge.arquivo != null && this.state.Documento_rgconjuge.extensao == null) {
      this.state.Documento_rgconjuge.extensao = this.state.FotoIdentidadeConjuge.uri.substr((this.state.FotoIdentidadeConjuge.uri).lastIndexOf(".") + 1, this.state.FotoIdentidadeConjuge.uri.length - (this.state.FotoIdentidadeConjuge.uri).lastIndexOf("."))
    }
    if (this.state.FotoCertidao.base64 != null && this.state.Documento_certidao.arquivo != null && this.state.Documento_certidao.extensao == null) {
      this.state.Documento_certidao.extensao = this.state.FotoCertidao.uri.substr((this.state.FotoCertidao.uri).lastIndexOf(".") + 1, this.state.FotoCertidao.uri.length - (this.state.FotoCertidao.uri).lastIndexOf("."))
    }
    if (this.state.FotoEndereco.base64 != null && this.state.Documento_endereco.arquivo != null && this.state.Documento_endereco.extensao == null) {
      this.state.Documento_endereco.extensao = this.state.FotoEndereco.uri.substr((this.state.FotoEndereco.uri).lastIndexOf(".") + 1, this.state.FotoEndereco.uri.length - (this.state.FotoEndereco.uri).lastIndexOf("."))
    }
  }
  //#endregion

  //#region Array dos documentos do cliente
  dadosDocumentos = async () => {
    this.state.Arquivos = [];

    if(this.state.CheckListCadastro.base64 != null && this.state.CheckListCadastro.isPDF == false) {
      if ((this.state.CheckListCadastro.uri).indexOf('data:image/') === -1) {
          this.state.Arquivos.push({
                          "arquivo": this.state.CheckListCadastro.base64,
                          "descricao": "CheckListDeCadastro",
                          "extensao": this.state.CheckListCadastro.uri.substr((this.state.CheckListCadastro.uri).lastIndexOf(".") + 1, this.state.CheckListCadastro.uri.length - (this.state.CheckListCadastro.uri).lastIndexOf(".")),
                        })
      } else {
          this.state.Arquivos.push({
                          "arquivo": this.state.CheckListCadastro.base64,
                          "descricao": "CheckListDeCadastro",
                          "extensao": this.state.CheckListCadastro.extensao,
                        })
      }
    }
    else {
      if(this.state.CheckListCadastro.base64 != null && this.state.CheckListCadastro.isPDF == true)
      {
        this.state.Arquivos.push({
          "arquivo": this.state.CheckListCadastro.base64,
          "descricao": "CheckListDeCadastro",
          "extensao": 'pdf',
        })
      }
    }

    if(this.state.ComprovanteEntrada.base64 != null && this.state.ComprovanteEntrada.isPDF == false) {
      if ((this.state.ComprovanteEntrada.uri).indexOf('data:image/') === -1) {
          this.state.Arquivos.push({
                          "arquivo": this.state.ComprovanteEntrada.base64,
                          "descricao": "ComprovanteDaEntrada",
                          "extensao": this.state.ComprovanteEntrada.uri.substr((this.state.ComprovanteEntrada.uri).lastIndexOf(".") + 1, this.state.ComprovanteEntrada.uri.length - (this.state.ComprovanteEntrada.uri).lastIndexOf(".")),
                        })
      } else {
          this.state.Arquivos.push({
                          "arquivo": this.state.ComprovanteEntrada.base64,
                          "descricao": "ComprovanteDaEntrada",
                          "extensao": this.state.ComprovanteEntrada.extensao,
                        })
      }
    }
    else {
      if(this.state.ComprovanteEntrada.base64 != null && this.state.ComprovanteEntrada.isPDF == true)
      {
        this.state.Arquivos.push({
          "arquivo": this.state.ComprovanteEntrada.base64,
          "descricao": "ComprovanteDaEntrada",
          "extensao": 'pdf',
        })
      }
    }

    if(this.state.FichaAtendimento.base64 != null && this.state.FichaAtendimento.isPDF == false) {
      if ((this.state.FichaAtendimento.uri).indexOf('data:image/') === -1) {
        this.state.Arquivos.push({
                          "arquivo": this.state.FichaAtendimento.base64,
                          "descricao": "FichaDeAtendimento",
                          "extensao": this.state.FichaAtendimento.uri.substr((this.state.FichaAtendimento.uri).lastIndexOf(".") + 1, this.state.FichaAtendimento.uri.length - (this.state.FichaAtendimento.uri).lastIndexOf(".")),
                        })
      } else {
        this.state.Arquivos.push({
                          "arquivo": this.state.FichaAtendimento.base64,
                          "descricao": "FichaDeAtendimento",
                          "extensao": this.state.FichaAtendimento.extensao,
                        })
      }
    }
    else {
      if(this.state.FichaAtendimento.base64 != null && this.state.FichaAtendimento.isPDF == true)
      {
        this.state.Arquivos.push({
          "arquivo": this.state.FichaAtendimento.base64,
          "descricao": "FichaDeAtendimento",
          "extensao": 'pdf',
        })
      }
    }

    if(this.state.FichaNegociacao.base64 != null && this.state.FichaNegociacao.isPDF == false) {
      if ((this.state.FichaNegociacao.uri).indexOf('data:image/') === -1) {
        this.state.Arquivos.push({
                          "arquivo": this.state.FichaNegociacao.base64,
                          "descricao": "FichaDeNegociacao",
                          "extensao": this.state.FichaNegociacao.uri.substr((this.state.FichaNegociacao.uri).lastIndexOf(".") + 1, this.state.FichaNegociacao.uri.length - (this.state.FichaNegociacao.uri).lastIndexOf(".")),
                        })
      } else {
        this.state.Arquivos.push({
                          "arquivo": this.state.FichaNegociacao.base64,
                          "descricao": "FichaDeNegociacao",
                          "extensao": this.state.FichaNegociacao.extensao,
                        })
      }
    }
    else {
      if(this.state.FichaNegociacao.base64 != null && this.state.FichaNegociacao.isPDF == true)
      {
        this.state.Arquivos.push({
          "arquivo": this.state.FichaNegociacao.base64,
          "descricao": "FichaDeNegociacao",
          "extensao": 'pdf',
        })
      }
    }
  }
  //#endregion

  //#region Enviando documentos
  sendDocumentos = async (Item) => {

    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "multipart/form-data");

    var formdata = new FormData();

    await this.state.Arquivos.map((Item) => {
      formdata.append("Arquivos", Item.base64)
    });

    let Response = await axios({
      method: "POST",
      baseURL: `http://testapi.oneplus.dev.br/Venda/NovosDocumentos/${this.props.token[0].token}/${this.props.empresa[0].empresa}/${this.props.centrodecusto[0].centrodecusto}/${Item.numero}`,
      data: formdata,
      headers: myHeaders
    }).then(response => {return response})
      .catch(exception => {return exception})
    
    if (Math.floor(Response.status / 100) == 2)
    {
      
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Documentos anexados, aguarde gerando contrato...`
      })
      
      await this.gerandoNovoContrato(Item)
    }
    else
    {

      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Caro usuário os documentos não poderam ser gerados, a equipe de desenvolvimento está analisando.`
      })
  
    }

  }
  //#endregion

  //#region Anexos assinaturas
  anexosAssinaturas = async () => {
    this.state.anexosAssinaturas = []
    if(this.state.assinaturas.assinaturaCliente.base64 == null || this.state.assinaturas.assinaturaCliente.base64 != null) {
      this.state.anexosAssinaturas.push(this.state.assinaturas.assinaturaCliente)
    }
    if (this.props.EstadoCivil != "" && this.props.EstadoCivil[0].EstadoCivil == 2) {
      this.state.anexosAssinaturas.push(this.state.assinaturas.assinaturaConjuge)
    }
  }
  //#endregion

  //#region Dados da proposta de venda
  dadosPropostaDeVenda = async () => {
    this.state.dadosPropostaDeVenda = {
      "empresa": this.state.dadosEmpresa,
      "centroDeCusto": this.state.dadosCentroDeCusto,
      "numero": 0,
      "dataDaVenda": new Date().getMonth() < 9 ? (new Date().getFullYear()+"-"+"0"+(new Date().getMonth() + 1)+"-" + ( new Date().getDate() <= 9 ? "0" + new Date().getDate() : new Date().getDate())) : (new Date().getFullYear()+"-"+(new Date().getMonth() + 1) + "-" + ( new Date().getDate() <= 9 ? "0" + new Date().getDate() : new Date().getDate())),
      "finalidadeDaCompra": 0,
      "canalDeDivulgacao": 0,
      "prospects": this.props.Lead,
      "ModeloDeVenda": this.state.dadosDoModeloDeVenda,
      "Identificador": this.props.LotesReservados[0],
      "titulosDeCorretagem": this.props.Corretagem != "" ? this.props.Corretagem[0].titulosDeCorretagem : null,
      "titulosDeIntermediacao": this.props.Intermediacao != "" ? this.props.Intermediacao[0].titulosDeIntermediacao : null,
      "titulosDeParcela": this.props.TabelaParcelas[0].titulosDeParcela
    }
  }
  //#endregion

  //#region Valor Total
  valorTotal = async () => {} 
  //#endregion

  //#region Postando a proposta de venda
  postPropostaDeVenda = async () => {
    try {
      const response = await Vendas.proposta(this.props.token[0].token, this.props.PropostaDeVenda[0])
      if(Math.floor(response.status / 100) == 2) 
      {
        if(this.props.EmpresaLogada[0] == 5)
        { 
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Venda realizada com sucesso`
          })       
          this.state.VisibilidadeModalValidandoArquivos = false
          await this.setVisibilidadeModalPropostaEnviada(true)
        }
        else
        {
          if(this.props.EmpresaLogada[0] == 4 && this.state.Arquivos.length > 0)
          {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Venda realizada, aguarde anexando documentos...`
            })
            await this.sendDocumentos(response.data)
          }
          else
          {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Venda realizada, aguarde gerando contrato...`
            })
            await this.gerandoNovoContrato(response.data)
          }
        }
      }
    } catch(err) {
      console.log(err.response.request._response)
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Caro usuário a venda não pode ser feita, a equipe de desenvolvimento está analisando.`
      })
      await this.mensagemError("Erro ao realizar a venda", this.props.PropostaDeVenda[0]);
    }
  }
  //#endregion

  //#region Novo contrato
  gerandoNovoContrato = async (item) => {
    try {
      const response = await Vendas.novoContrato(String(this.props.token[0].token), item)
      if(Math.floor(response.status / 100) == 2)
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Contrato gerando com sucesso!`
        })
        this.state.VisibilidadeModalValidandoArquivos = false
        await this.setVisibilidadeModalPropostaEnviada(true)
      }
    } catch {
      PushNotification.localNotification({
        largeIcon: 'icon',
        smallIcon: 'icon',
        vibrate: true,
        vibration: 300,
        title: 'My Broker',
        message: `Caro usuário o documento não pode ser gerado, a equipe de desenvolvimento está analisando.`
      })
      await this.mensagemError("Erro ao gerar o contrato", item);
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
      const response = await Mensagem.NotificacaoEmailExterno(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, Dados)
      if(response.status == 200 || response.status == 201)
      {
        await this.setVisibilidadeModalValidandoArquivos(false)
      }
    } catch(err) {
      await this.setVisibilidadeModalValidandoArquivos(false)
    }
  }
  //#endregion

  //#endregion
}

//#region Estilizando view da camera
const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  capture: {
    flex: 0,
    backgroundColor: 'transparent',
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 20,
    alignItems: 'center',
    marginRight: 50
  },
});
//#endregion

const mapStateToProps = state => ({
  token: state.dadosUsuario,
    
  tela: String(state.telaAtual),

  empresa: state.dadosEmpreendimento.filter(emp => emp.empresa),
  centrodecusto: state.dadosEmpreendimento.filter(emp => emp.centrodecusto),

  RegistroCliente: state.dadosCliente.filter(cliente => cliente.Registros),
  DadosCliente: state.dadosCliente,
  CPF_CNPJ: state.dadosCliente.filter(cliente => cliente.CPF_CNPJ),
  Nome: state.dadosCliente.filter(cliente => cliente.Nome),
  DataDeNascimento: state.dadosCliente.filter(cliente => cliente.Data_nasc),
  EstadoCivil: state.dadosCliente.filter(cliente => cliente.EstadoCivil),
  RegimeDeBens: state.dadosCliente.filter(cliente => cliente.RegimeDeBens),
  Email: state.dadosCliente.filter(cliente => cliente.Email),
  RGCliente: state.dadosCliente.filter(cliente => cliente.RG),
  OrgaoEmissorCliente: state.dadosCliente.filter(cliente => cliente.OrgaoEmissor),
  UFRGCliente: state.dadosCliente.filter(cliente => cliente.UFRG),
  OcupacaoCliente: state.dadosCliente.filter(cliente => cliente.Ocupacao),
  AssinaturaConjuge: state.dadosCliente.filter(cliente => cliente.Assinatura),

  RegistroConjuge: state.dadosConjuge.filter(conjuge => conjuge.Registros),
  DadosConjuge: state.dadosConjuge,
  CPF_CNPJ_Conjuge: state.dadosConjuge.filter(conjuge => conjuge.CPF_CNPJ_Conjuge),
  Nome_Conjuge: state.dadosConjuge.filter(conjuge => conjuge.Nome_Conjuge),
  DataDeNascimento_Conjuge: state.dadosConjuge.filter(conjuge => conjuge.Data_nasc_Conjuge),
  Email_Conjuge: state.dadosConjuge.filter(conjuge => conjuge.email_Conjuge),
  RGConjuge: state.dadosCliente.filter(cliente => cliente.RG),
  OrgaoEmissorConjuge: state.dadosCliente.filter(cliente => cliente.OrgaoEmissor),
  UFRGConjuge: state.dadosCliente.filter(cliente => cliente.UFRG),
  OcupacaoConjuge: state.dadosCliente.filter(cliente => cliente.Ocupacao),

  RegistroDocumentos: state.dadosDocumentos.filter(documento => documento.Registros),
  Documentos: state.dadosDocumentos,
  DocumentosOriginais: state.DocumentosOriginais,
  DocumentosOriginaisLista: state.DocumentosOriginaisLista,
  DocumentosPropostaLista: state.DocumentosPropostaLista,

  DocumentosConjuge: state.dadosDocumentosConjuge,

  Endereco: state.dadosEndereco,

  Telefone: state.dadosTelefones,

  Entradas: state.dadosEntradas,
  Baloes: state.dadosIntermediarias,
  Parcelas: state.dadosParcelas,

  LotesReservados: state.dadosLotes,

  ModeloDeVendas: state.dadosModeloDeVendas,

  Tabela: state.dadosTabelaDeVenda.filter(item => item.tabelaCompleta),

  Lead: state.dadosLead,

  Corretagem: state.dadosCorretagem,

  Intermediacao: state.dadosIntermediacao,

  TabelaParcelas: state.dadosTabelaParcelas,

  PropostaDeVenda: state.dadosPropostaDeVenda,
  StyleGlobal: state.StyleGlobal,
  EmpresaLogada: state.EmpresaLogada
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(QuadroResumo);