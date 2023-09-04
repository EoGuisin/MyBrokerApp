//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import {StyleSheet, Keyboard, View, Text, Animated, Image, ScrollView, Dimensions, FlatList, TouchableOpacity, Modal, TextInput, Linking } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
import { Lead, Prospect, Vendas, Identificador, TabelaDeVendas, Empresas } from "../../../services";
//#endregion

//#region Redux
import { DadosLeadActions, TelaAtualActions, LotesActions, DadosIntermediacaoActions, DadosCorretagemActions, DadosFinanciamentoActions, TabelaDeVendasActions  } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
import EfeitoSwipeDown from '../../../effects/swipearrowdown.json';
import EfeitoSwipeUp from '../../../effects/swipearrowup.json';
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

//#region Import Data
import Usuarios from '../../../Data/Usuarios';
//#endregion

//#endregion

class Permissoes extends Component {
  _isMounted = false;
  //#region Funcoes do componente
  componentDidMount = async () => {
    this._isMounted = true;
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      // await this.setVisibilidadeModalLoading(true)
      await this.pegandoListaDeUsuariosRefresh()
    })
    await this.setVisibilidadeModalLoadingGoBack(true)
    await this.pegandoListaDeUsuarios()
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
    VisibilidadeModalLoading: false,
    VisibilidadeModalLoadingGoBack: false,
    VisibilidadeModalEmpresasPermissoes: false,
    FiltrosAplicaveis: [],
    FiltroEmpreendimento: '',
    CampoFiltrado: '',
    ListaEmpresasComPermissaoDeAcesso: [
      {
          "grupo": {
              "nome": "GAV Resorts",
              "permissaoDeAcesso": true,
              "empresas": [
                  {
                      "id": 20,
                      "nomeFantasia": "SALINAS PREMIUM RESORT EMPREENDIMENTO IMOBILIARIO SPE LTDA",
                      "razaoSocial": "SALINAS PREMIUM RESORT EMPREENDIMENTO IMOBILIARIO SPE LTDA",
                      "cnpj": "28883561000103",
                      "ie": null,
                      "im": null,
                      "enquadramentoTributario": null,
                      "permissaoDeAcesso": true,
                      "centrodecusto": [
                          {
                              "empresa": {
                                  "id": 20,
                                  "nomeFantasia": "SALINAS PREMIUM RESORT EMPREENDIMENTO IMOBILIARIO SPE LTDA",
                                  "razaoSocial": "SALINAS PREMIUM RESORT EMPREENDIMENTO IMOBILIARIO SPE LTDA",
                                  "cnpj": "28883561000103",
                                  "ie": null,
                                  "im": null,
                                  "enquadramentoTributario": null
                              },
                              "sigla": "SALPR",
                              "descricao": "SALINAS PREMIUM RESORT",
                              "permissaoDeAcesso": true,
                              "modulos": [
                                  {
                                      "id": 0,
                                      "name": "Leads",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 1,
                                      "name": "Prospects",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 2,
                                      "name": "Disponibilidade",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 3,
                                      "name": "Proposta pendentes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 4,
                                      "name": "Permissoes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 5,
                                      "name": "Minhas reservas",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 6,
                                      "name": "Meus contratos",
                                      "permissaoDeAcesso": true
                                  }
                              ]
                          }
                      ]
                  },
                  {
                      "id": 21,
                      "nomeFantasia": "E.T.R. CONSTRUTORA E INCORPORADORA LTDA",
                      "razaoSocial": "E.T.R. CONSTRUTORA E INCORPORADORA LTDA",
                      "cnpj": "14194873000197",
                      "ie": null,
                      "im": null,
                      "enquadramentoTributario": null,
                      "permissaoDeAcesso": true,
                      "centrodecusto": [
                          {
                              "empresa": {
                                  "id": 21,
                                  "nomeFantasia": "E.T.R. CONSTRUTORA E INCORPORADORA LTDA",
                                  "razaoSocial": "E.T.R. CONSTRUTORA E INCORPORADORA LTDA",
                                  "cnpj": "14194873000197",
                                  "ie": null,
                                  "im": null,
                                  "enquadramentoTributario": null
                              },
                              "sigla": "SALPK",
                              "descricao": "SALINAS PARK RESORT",
                              "permissaoDeAcesso": true,
                              "modulos": [
                                  {
                                      "id": 0,
                                      "name": "Leads",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 1,
                                      "name": "Prospects",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 2,
                                      "name": "Disponibilidade",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 3,
                                      "name": "Proposta pendentes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 4,
                                      "name": "Permissoes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 5,
                                      "name": "Minhas reservas",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 6,
                                      "name": "Meus contratos",
                                      "permissaoDeAcesso": true
                                  }
                              ]
                          }
                      ]
                  },
                  {
                      "id": 22,
                      "nomeFantasia": "ATALAIA RESORT EMPREENDIMENTO IMOBILIÁRIO SPE LTDA",
                      "razaoSocial": "ATALAIA RESORT EMPREENDIMENTO IMOBILIÁRIO SPE LTDA",
                      "cnpj": "26504364000100",
                      "ie": null,
                      "im": null,
                      "enquadramentoTributario": null,
                      "permissaoDeAcesso": true,
                      "centrodecusto": [
                          {    
                              "empresa": {
                                  "id": 22,
                                  "nomeFantasia": "ATALAIA RESORT EMPREENDIMENTO IMOBILIÁRIO SPE LTDA",
                                  "razaoSocial": "ATALAIA RESORT EMPREENDIMENTO IMOBILIÁRIO SPE LTDA",
                                  "cnpj": "26504364000100",
                                  "ie": null,
                                  "im": null,
                                  "enquadramentoTributario": null
                              },
                              "sigla": "SALEX",
                              "descricao": "SALINAS EXCLUSIVE RESORT",
                              "permissaoDeAcesso": true,
                              "modulos": [
                                  {
                                      "id": 0,
                                      "name": "Leads",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 1,
                                      "name": "Prospects",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 2,
                                      "name": "Disponibilidade",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 3,
                                      "name": "Proposta pendentes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 4,
                                      "name": "Permissoes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 5,
                                      "name": "Minhas reservas",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 6,
                                      "name": "Meus contratos",
                                      "permissaoDeAcesso": true
                                  }
                              ]
                          }
                      ]
                  },
                  {
                      "id": 23,
                      "nomeFantasia": "GAV MURO ALTO EMPREENDIMENTO IMOBILIÁRIO SPE LTDA",
                      "razaoSocial": "GAV MURO ALTO EMPREENDIMENTO IMOBILIÁRIO SPE LTDA",
                      "cnpj": "34832326000105",
                      "ie": null,
                      "im": null,
                      "enquadramentoTributario": null,
                      "permissaoDeAcesso": true,
                      "centrodecusto": [
                          {
                              "empresa": {
                                  "id": 23,
                                  "nomeFantasia": "GAV MURO ALTO EMPREENDIMENTO IMOBILIÁRIO SPE LTDA",
                                  "razaoSocial": "GAV MURO ALTO EMPREENDIMENTO IMOBILIÁRIO SPE LTDA",
                                  "cnpj": "34832326000105",
                                  "ie": null,
                                  "im": null,
                                  "enquadramentoTributario": null
                              },
                              "sigla": "PORAL",
                              "descricao": "PORTO ALTO RESORT",
                              "permissaoDeAcesso": true,
                              "modulos": [
                                  {
                                      "id": 0,
                                      "name": "Leads",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 1,
                                      "name": "Prospects",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 2,
                                      "name": "Disponibilidade",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 3,
                                      "name": "Proposta pendentes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 4,
                                      "name": "Permissoes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 5,
                                      "name": "Minhas reservas",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 6,
                                      "name": "Meus contratos",
                                      "permissaoDeAcesso": true
                                  }
                              ]
                          }
                      ]
                  }
              ]
          }
      },
      {
          
          "grupo": {
              "nome": "Harmonia Urbanismo",
              "permissaoDeAcesso": true,
              "empresas": [
                  {
                      "id": 18,
                      "nomeFantasia": "TERESINA 01 EMPREENDIMENTOS IMOBILIARIOS SPE LTDA",
                      "razaoSocial": "TERESINA 01 EMPREENDIMENTOS IMOBILIARIOS SPE LTDA",
                      "cnpj": "18867859000168",
                      "ie": null,
                      "im": null,
                      "enquadramentoTributario": null,
                      "centrodecusto": [
                          {
                              "empresa": {
                                  "id": 18,
                                  "nomeFantasia": "TERESINA 01 EMPREENDIMENTOS IMOBILIARIOS SPE LTDA",
                                  "razaoSocial": "TERESINA 01 EMPREENDIMENTOS IMOBILIARIOS SPE LTDA",
                                  "cnpj": "18867859000168",
                                  "ie": null,
                                  "im": null,
                                  "enquadramentoTributario": null
                              },
                              "sigla": "22VEN",
                              "descricao": "LOTEAMENTO VILLA IMPERIAL",
                              "permissaoDeAcesso": true,
                              "modulos": [
                                  {
                                      "id": 0,
                                      "name": "Leads",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 1,
                                      "name": "Prospects",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 2,
                                      "name": "Disponibilidade",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 3,
                                      "name": "Proposta pendentes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 4,
                                      "name": "Permissoes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 5,
                                      "name": "Minhas reservas",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 6,
                                      "name": "Meus contratos",
                                      "permissaoDeAcesso": true
                                  }
                              ]
                          }
                      ],                         
                      "permissaoDeAcesso": true
                  }
              ]
          }
      },
      {
          "grupo": {
              "nome": "Silva Branco",
              "permissaoDeAcesso": true,
              "empresas": [
                  {
                      "id": 19,
                      "nomeFantasia": "SILVA BRANCO",
                      "razaoSocial": "SILVA BRANCO CONSTRUTORA E INCORPORADORA LTDA",
                      "cnpj": "07663389000102",
                      "ie": null,
                      "im": null,
                      "enquadramentoTributario": null,
                      "permissaoDeAcesso": true,
                      "centrodecusto": [
                          {
                              "empresa": {
                                  "id": 19,
                                  "nomeFantasia": "SILVA BRANCO",
                                  "razaoSocial": "SILVA BRANCO CONSTRUTORA E INCORPORADORA LTDA",
                                  "cnpj": "07663389000102",
                                  "ie": null,
                                  "im": null,
                                  "enquadramentoTributario": null
                              },
                              "sigla": "BSBDF",
                              "descricao": "BRASÍLIA (DF)",
                              "permissaoDeAcesso": true,
                              "modulos": [
                                  {
                                      "id": 0,
                                      "name": "Leads",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 1,
                                      "name": "Prospects",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 2,
                                      "name": "Disponibilidade",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 3,
                                      "name": "Proposta pendentes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 4,
                                      "name": "Permissoes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 5,
                                      "name": "Minhas reservas",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 6,
                                      "name": "Meus contratos",
                                      "permissaoDeAcesso": true
                                  }
                              ]
                          },
                          {
                              "empresa": {
                                  "id": 19,
                                  "nomeFantasia": "SILVA BRANCO",
                                  "razaoSocial": "SILVA BRANCO CONSTRUTORA E INCORPORADORA LTDA",
                                  "cnpj": "07663389000102",
                                  "ie": null,
                                  "im": null,
                                  "enquadramentoTributario": null
                              },
                              "sigla": "COCGO",
                              "descricao": "CIDADE OCIDENTAL (GO)",
                              "permissaoDeAcesso": true,
                              "modulos": [
                                  {
                                      "id": 0,
                                      "name": "Leads",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 1,
                                      "name": "Prospects",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 2,
                                      "name": "Disponibilidade",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 3,
                                      "name": "Proposta pendentes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 4,
                                      "name": "Permissoes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 5,
                                      "name": "Minhas reservas",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 6,
                                      "name": "Meus contratos",
                                      "permissaoDeAcesso": true
                                  }
                              ]
                          },
                          {
                              "empresa": {
                                  "id": 19,
                                  "nomeFantasia": "SILVA BRANCO",
                                  "razaoSocial": "SILVA BRANCO CONSTRUTORA E INCORPORADORA LTDA",
                                  "cnpj": "07663389000102",
                                  "ie": null,
                                  "im": null,
                                  "enquadramentoTributario": null
                              },
                              "sigla": "CRZDF",
                              "descricao": "CRUZEIRO (DF)",
                              "permissaoDeAcesso": true,
                              "modulos": [
                                  {
                                      "id": 0,
                                      "name": "Leads",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 1,
                                      "name": "Prospects",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 2,
                                      "name": "Disponibilidade",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 3,
                                      "name": "Proposta pendentes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 4,
                                      "name": "Permissoes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 5,
                                      "name": "Minhas reservas",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 6,
                                      "name": "Meus contratos",
                                      "permissaoDeAcesso": true
                                  }
                              ]
                          },
                          {
                              "empresa": {
                                  "id": 19,
                                  "nomeFantasia": "SILVA BRANCO",
                                  "razaoSocial": "SILVA BRANCO CONSTRUTORA E INCORPORADORA LTDA",
                                  "cnpj": "07663389000102",
                                  "ie": null,
                                  "im": null,
                                  "enquadramentoTributario": null
                              },
                              "sigla": "LSLDF",
                              "descricao": "LAGO SUL (DF)",
                              "permissaoDeAcesso": true,
                              "modulos": [
                                  {
                                      "id": 0,
                                      "name": "Leads",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 1,
                                      "name": "Prospects",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 2,
                                      "name": "Disponibilidade",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 3,
                                      "name": "Proposta pendentes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 4,
                                      "name": "Permissoes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 5,
                                      "name": "Minhas reservas",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 6,
                                      "name": "Meus contratos",
                                      "permissaoDeAcesso": true
                                  }
                              ]
                          },
                          {
                              "empresa": {
                                "id": 19,
                                "nomeFantasia": "SILVA BRANCO",
                                "razaoSocial": "SILVA BRANCO CONSTRUTORA E INCORPORADORA LTDA",
                                "cnpj": "07663389000102",
                                "ie": null,
                                "im": null,
                                "enquadramentoTributario": null
                              },
                              "sigla": "VALGO",
                              "descricao": "VALPARAÍSO DE GOIÁS (GO)",
                              "permissaoDeAcesso": true,
                              "modulos": [
                                  {
                                      "id": 0,
                                      "name": "Leads",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 1,
                                      "name": "Prospects",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 2,
                                      "name": "Disponibilidade",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 3,
                                      "name": "Proposta pendentes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 4,
                                      "name": "Permissoes",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 5,
                                      "name": "Minhas reservas",
                                      "permissaoDeAcesso": true
                                  },
                                  {
                                      "id": 6,
                                      "name": "Meus contratos",
                                      "permissaoDeAcesso": true
                                  }
                              ]
                          }
                      ]
                  }
              ]
          }
      }
    ],
    ListaPermissoesTelas: [
      {
          "id": 0,
          "name": "Leads",
          "status": true
      },
      {
          "id": 1,
          "name": "Prospects",
          "status": true
      },
      {
          "id": 2,
          "name": "Disponibilidade",
          "status": true
      },
      {
          "id": 3,
          "name": "Proposta pendentes",
          "status": true
      },
      {
          "id": 4,
          "name": "Permissoes",
          "status": true
      },
      {
          "id": 5,
          "name": "Minhas reservas",
          "status": true
      },
      {
          "id": 6,
          "name": "Meus contratos",
          "status": true
      }  
    ],
    ListaUsuarios: Usuarios,
    ListaOriginal: [],
    ListaFiltrada: [],
    ListaExibida: [],
    GruposEmpresas: [],
    LocaisDeCaptacao: [],
    quantItem: 20,
    distanceEnd: null,
    distanceEndInitial: null,
    loadMore: false,
    TermUsuarios: '',
    searchTermUsuarios: '',
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
    LoteSelecionado: null,
    GrupoSelecionado: null,
    EmpresaSelecionada: null,
    CentroSelecionado: null,
  };
  //#endregion

  //#region View
  render() {
    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
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
        }}/>
        {this.state.VisibilidadeModalLoading == false && this.state.VisibilidadeModalLoadingGoBack == false && <>
        <View
          style = {{
            backgroundColor: this.props.StyleGlobal.cores.background, 
            height: 128
        }}>
          <View 
            style = {{
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'space-between'
          }}>
            <Icon name = {'keyboard-arrow-left'} color = {'#FFF'} size = {40} style = {{marginTop: 10}}
              onPress = {() => {this.props.navigation.goBack()}}/>
            <Text
              style = {{
                marginTop: 6,
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: 14,
                textAlign: 'center',
                color: '#FFFFFF'
            }}>Permissões de usuário</Text>
            <View style = {{width: 40}}></View>
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
              onChangeText = {async (term) => { await this.searchUpdateUsuarios(term) }}
              style = {{
                paddingVertical: 12,
                paddingHorizontal: 16,
                height: 48,
                fontSize: 12,
                width: Dimensions.get('window').width * 0.88
              }}
              fuzzy = {true}
              placeholder = 'Buscar por nome ou CPF...'
              placeholderTextColor = '#8F998F'
            />
            <Icon name = 'search' size = {30} color = {'#8F998F'} style = {{marginRight: 5}}/>
          </View>
        </View>
        <ScrollView onLayout = {async (e) => {await this.setState({distanceEnd: e.nativeEvent.layout.height, distanceEndInitial: e.nativeEvent.layout.height})}}
          ref = { (ref) => this.ScrollView = ref } showsVerticalScrollIndicator = {false}
          scrollEventThrottle = {16}
          onScroll = {(e) => {
            if ((e.nativeEvent.contentOffset.y >= this.state.distanceEnd) && this.state.loadMore == false) {
              this.setState({isLoadingFooter: true})
              this.carregandoMaisUsuariosParaLista()
              this.state.distanceEnd = e.nativeEvent.contentOffset.y + this.state.distanceEndInitial
            }
        }}>
          <View
            style = {{
              minHeight: Dimensions.get('window').height - 190, 
              borderTopWidth: 0, 
              marginBottom: 20
          }}>
          <FlatList
            ref = {(ref) => this.flatList = ref}
            style = {{marginVertical: 10, marginHorizontal: 8}}
            data = {this.state.ListaExibida}
            keyExtractor = {(item, index) => index.toString()}
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
    
    RnBgTask.runInBackground(async () => {this.searchUpdateUsuarios(this.state.TermUsuarios)})
  }
  //#endregion

  //#region Renderização a lista de usuarios
  renderItem = ({ item, index }) => (
    <>
      <View
        style = {{
          backgroundColor: '#FFFFFF',
          padding: 16,
          width: '100%',
          borderWidth: 1,
          borderColor: '#E2F2E3',
      }}>
        <TouchableOpacity activeOpacity = {1}
          onPress = {async () => {}}>
          <View
            style ={{
              width: '100%',
          }}>
            <View 
              style = {{
                flexDirection: 'row', 
                alignItems: 'center', 
                width: '100%'
              }}>
              <View
                style = {{
                  maxWidth: '100%', 
                  flexDirection: 'column', 
                  alignItems: 'flex-start',
                  marginBottom: 5
              }}>
                <Text
                  style = {{
                    fontSize: Dimensions.get('window').width * 0.035,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    color: '#262825',
                    flexWrap: 'wrap',
                    textAlign: 'left',
                }}>{(item.pessoa.nome).toUpperCase()}</Text>
              </View>
            </View>
            <View
              style = {{
                flexDirection: 'row', 
                width: '100%',
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginLeft: 5,
            }}>
              <View
                style = {{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                <View>
                  <Text
                    style = {{
                      fontSize: Dimensions.get('window').width * 0.03,
                      fontStyle: 'normal',
                      fontWeight: 'normal',
                      color: '#262825',
                      flexWrap: 'wrap',
                  }}>CPF: {formatoDeTexto.CPF_CNPJ(item.pessoa.cpf)}</Text>
                </View>
              </View>
              <View
                style ={{
                  flexDirection: 'row', 
                  justifyContent: 'flex-end', 
                  alignItems: 'center',
                  paddingRight: 10
                }}>
                <TouchableOpacity activeOpacity = {1}
                  style = {{
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    marginRight: 10,
                    width: Dimensions.get('window').width * 0.18,
                    backgroundColor: this.props.StyleGlobal.cores.botao,
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: this.props.StyleGlobal.cores.botao,
                    justifyContent: 'center',
                    borderRadius: 2,
                  }}
                  onPress = {async () => {
                    if(item._modalEmpresas == false)
                    {
                      item._modalEmpresas = true
                      this.setState({LoteSelecionado: null})
                    }
                    else
                    {
                      item._modalEmpresas = false
                      this.setState({LoteSelecionado: null})
                    }
                  }}>
                  <Text
                    style = {{
                      fontSize: Dimensions.get('window').width * 0.03, 
                      color: '#FFFFFF',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      textAlign: 'center',
                      alignSelf: 'center',
                      marginVertical: 4,
                      marginHorizontal: 0
                }}>{'Gerenciar'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <Modal // Empresas permitidas
          visible = {item._modalEmpresas == false ? false : true}
          transparent = {false}
          animationType = 'slide'          
        >
          <View
            style = {{
              backgroundColor: this.props.StyleGlobal.cores.background, 
              height: 62
          }}>
            <View
              style = {{
                marginTop: 10,
                flexDirection: 'row', 
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
              <Icon name = 'keyboard-arrow-down' size = {40} color = {'#FFFFFF'}
                onPress = {() => {
                  item._modalEmpresas = false
                  this.setState({LoteSelecionado: null})
              }}/>
              <Text
                style = {{
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: 16,
                  textAlign: 'center',
                  color: '#FFFFFF'
                }}>Gerenciando permissões</Text>
                <View style = {{width: 40}}/>
            </View>
          </View>
          <View
            style = {{
              backgroundColor: '#FFFCFF',              
              maxHeight: Dimensions.get('window').height - 60,
              minHeight: Dimensions.get('window').height - 60,
          }}>
            <ScrollView
              showsVerticalScrollIndicator = {false}>
              <View
                style = {{
                  borderTopWidth: 0,
                  marginVertical: 20,
                  marginHorizontal: 10,
                  minHeight: Dimensions.get('window').height - 170,
              }}>
            {(this.state.ListaEmpresasComPermissaoDeAcesso).map((emp, index__) => emp.grupo.permissaoDeAcesso == true && (
              <>
                <View
                  style = {{
                    backgroundColor: '#FFFFFF',
                    padding: 16,
                    width: '100%',
                    borderLeftWidth: 1,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e2e3e5',
                    borderColor: this.props.StyleGlobal.cores.background,
                }}>
                  <TouchableOpacity activeOpacity = {1}
                    onPress = {async () => {
                      if((this.state.GrupoSelecionado == null || this.state.GrupoSelecionado != index__) && item.empresasComPermissaoDeAcesso[index__].grupo.permissaoDeAcesso == true)
                      {
                        this.setState({GrupoSelecionado: index__})
                      }
                      else
                      {
                        this.setState({GrupoSelecionado: null})
                      }
                    }}>
                    <View
                      style ={{
                        width: '100%',
                    }}>
                      <View
                        style = {{
                          flexDirection: 'row', 
                          width: '100%',
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginLeft: 5,
                      }}>
                        <View
                          style = {{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '60%'
                          }}>
                          <View>
                            <Text
                              style = {{
                                fontSize: Dimensions.get('window').width * 0.03,
                                fontStyle: 'normal',
                                fontWeight: 'bold',
                                color: '#262825',
                                flexWrap: 'wrap',
                              }}>{(emp.grupo.nome).toUpperCase()}</Text>
                          </View>
                        </View>
                        <View
                          style ={{
                            flexDirection: 'row', 
                            justifyContent: 'flex-end', 
                            alignItems: 'center',
                            paddingRight: 10,
                            width: '40%'
                          }}>
                          <TouchableOpacity activeOpacity = {1}
                            disabled = {false}
                            style = {{
                              paddingVertical: 6,
                              paddingHorizontal: 10,
                              marginRight: 10,
                              width: Dimensions.get('window').width * 0.20,
                              justifyContent: 'center',
                              backgroundColor: item.empresasComPermissaoDeAcesso[index__].grupo.permissaoDeAcesso == true ? '#FFFFFF'  : this.props.StyleGlobal.cores.botao,
                              flexDirection: 'row',
                              borderWidth: 1,
                              borderColor: this.props.StyleGlobal.cores.botao,
                              borderRadius: 2
                            }}
                            onPress = {async () => {
                              if(item.empresasComPermissaoDeAcesso[index__].grupo.permissaoDeAcesso == false)
                              {
                                let ListaDeUsuarios = [...this.state.ListaExibida]
                                ListaDeUsuarios[index].empresasComPermissaoDeAcesso[index__].grupo.permissaoDeAcesso = true
                                await this.setState({ListaExibida: ListaDeUsuarios})
                              }
                              else
                              {
                                let ListaDeUsuarios = [...this.state.ListaExibida]
                                ListaDeUsuarios[index].empresasComPermissaoDeAcesso[index__].grupo.permissaoDeAcesso = false
                                await this.setState({ListaExibida: ListaDeUsuarios})
                              }
                            }}>
                            <Text
                              style = {{
                                fontSize: Dimensions.get('window').width * 0.03, 
                                color: item.empresasComPermissaoDeAcesso[index__].grupo.permissaoDeAcesso == true ? this.props.StyleGlobal.cores.botao  : '#FFFFFF',
                                fontStyle: 'normal',
                                fontWeight: '500',
                                textAlign: 'center',
                                alignSelf: 'center',
                                marginVertical: 4,
                                marginHorizontal: 0
                          }}>{(item.empresasComPermissaoDeAcesso[index__].grupo.permissaoDeAcesso == true) ? 'Retirar' : 'Adicionar'}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <Collapsible style = {{marginLeft: 15}} collapsed = {this.state.GrupoSelecionado == index__ ? false : true}>
                  <View style = {{borderLeftWidth: 1, borderColor: this.props.StyleGlobal.cores.background, paddingLeft: 5}}>
                    <Text style = {{color: this.props.StyleGlobal.cores.background, fontWeight: 'bold'}}>Empresas</Text>
                  </View>
                  {(emp.grupo.empresas).map((empresas, index___) => empresas.permissaoDeAcesso == true && (
                    <>
                      <TouchableOpacity activeOpacity = {1}
                        onPress = {async () => {
                          if((this.state.EmpresaSelecionada == null || this.state.EmpresaSelecionada != index___) && item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].permissaoDeAcesso == true)
                          {
                            this.setState({EmpresaSelecionada: index___})
                          }
                          else
                          {
                            this.setState({EmpresaSelecionada: null})
                          }
                      }}>
                        <View
                          style ={{
                            width: '100%',
                            borderLeftWidth: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: '#e2e3e5',
                            padding: 5,
                            borderColor: this.props.StyleGlobal.cores.background
                        }}>
                          <View
                            style = {{
                              flexDirection: 'row', 
                              width: '100%',
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              marginLeft: 5,
                          }}>
                            <View
                              style = {{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '60%'
                              }}>
                              <View>
                                <Text
                                  style = {{
                                    fontSize: Dimensions.get('window').width * 0.03,
                                    fontStyle: 'normal',
                                    fontWeight: 'bold',
                                    color: '#262825',
                                    flexWrap: 'wrap',
                                  }}>{(empresas.nomeFantasia).toUpperCase()}</Text>
                              </View>
                            </View>
                            <View
                              style ={{
                                flexDirection: 'row', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                width: '30%'
                              }}>
                              <TouchableOpacity activeOpacity = {1}
                                disabled = {false}
                                style = {{
                                  paddingVertical: 6,
                                  paddingHorizontal: 10,
                                  marginRight: 15,
                                  width: Dimensions.get('window').width * 0.15,
                                  justifyContent: 'center',
                                  backgroundColor: item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].permissaoDeAcesso == true ? '#FFFFFF'  : this.props.StyleGlobal.cores.botao,
                                  flexDirection: 'row',
                                  borderWidth: 1,
                                  borderColor: this.props.StyleGlobal.cores.botao,
                                  borderRadius: 2
                                }}
                                onPress = {async () => {
                                  if(item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].permissaoDeAcesso == false)
                                  {
                                    let ListaDeUsuarios = [...this.state.ListaExibida]
                                    ListaDeUsuarios[index].empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].permissaoDeAcesso = true 
                                    await this.setState({ListaExibida: ListaDeUsuarios})
                                  }
                                  else
                                  {
                                    let ListaDeUsuarios = [...this.state.ListaExibida]
                                    ListaDeUsuarios[index].empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].permissaoDeAcesso = false 
                                    await this.setState({ListaExibida: ListaDeUsuarios})
                                  }
                                }}>
                                <Text
                                  style = {{
                                    fontSize: Dimensions.get('window').width * 0.02, 
                                    color: item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].permissaoDeAcesso == true ? this.props.StyleGlobal.cores.botao  : '#FFFFFF',
                                    fontStyle: 'normal',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    alignSelf: 'center',
                                    marginVertical: 4,
                                    marginHorizontal: 0
                              }}>{item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].permissaoDeAcesso == true ? 'Retirar' : 'Adicionar'}</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        <Collapsible style = {{marginLeft: 25}} collapsed = {this.state.EmpresaSelecionada == index___ ? false : true}>
                          <View style = {{borderLeftWidth: 1, borderColor: this.props.StyleGlobal.cores.background, paddingLeft: 5}}>
                            <Text style = {{color: this.props.StyleGlobal.cores.background, fontWeight: 'bold'}}>Centro de custo</Text>
                          </View>
                          {(empresas.centrodecusto).map((centro, index____) => centro.permissaoDeAcesso == true && (
                            <>
                              <TouchableOpacity activeOpacity = {1}
                                onPress = {async () => {
                                  if((this.state.CentroSelecionado == null || this.state.CentroSelecionado != index____) && item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].permissaoDeAcesso == true)
                                  {
                                    this.setState({CentroSelecionado: index____})
                                  }
                                  else
                                  {
                                    this.setState({CentroSelecionado: null})
                                  }
                                }}>
                                <View
                                  style ={{
                                    width: '100%',                                        
                                    padding: 5,
                                    borderLeftWidth: 1,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#e2e3e5',
                                    borderColor: this.props.StyleGlobal.cores.background,
                                }}>
                                  <View
                                    style = {{
                                      flexDirection: 'row', 
                                      width: '100%',
                                      justifyContent: 'space-between', 
                                      alignItems: 'center',
                                      marginLeft: 5,
                                  }}>
                                    <View
                                      style = {{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        width: '60%'
                                      }}>
                                      <View>
                                        <Text
                                          style = {{
                                            fontSize: Dimensions.get('window').width * 0.03,
                                            fontStyle: 'normal',
                                            fontWeight: 'bold',
                                            color: '#262825',
                                            flexWrap: 'wrap',
                                          }}>{(centro.descricao).toUpperCase()}</Text>
                                      </View>
                                    </View>
                                    <View
                                      style ={{
                                        flexDirection: 'row', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        width: '30%'
                                      }}>
                                      <TouchableOpacity activeOpacity = {1}
                                        disabled = {false}
                                        style = {{
                                          paddingVertical: 6,
                                          paddingHorizontal: 10,
                                          marginRight: 23,
                                          width: Dimensions.get('window').width * 0.15,
                                          justifyContent: 'center',
                                          backgroundColor: item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].permissaoDeAcesso == true ? '#FFFFFF'  : this.props.StyleGlobal.cores.botao,
                                          flexDirection: 'row',
                                          borderWidth: 1,
                                          borderColor: this.props.StyleGlobal.cores.botao,
                                          borderRadius: 2
                                        }}
                                        onPress = {async () => {
                                          if(item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].permissaoDeAcesso == false)
                                          {
                                            let ListaDeUsuarios = [...this.state.ListaExibida]
                                            ListaDeUsuarios[index].empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].permissaoDeAcesso = true 
                                            await this.setState({ListaExibida: ListaDeUsuarios})
                                          }
                                          else
                                          {
                                            let ListaDeUsuarios = [...this.state.ListaExibida]
                                            ListaDeUsuarios[index].empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].permissaoDeAcesso = false 
                                            await this.setState({ListaExibida: ListaDeUsuarios})
                                          }
                                        }}>
                                        <Text
                                          style = {{
                                            fontSize: Dimensions.get('window').width * 0.02, 
                                            color: item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].permissaoDeAcesso == true ? this.props.StyleGlobal.cores.botao  : '#FFFFFF',
                                            fontStyle: 'normal',
                                            fontWeight: '500',
                                            textAlign: 'center',
                                            alignSelf: 'center',
                                            marginVertical: 4,
                                            marginHorizontal: 0
                                        }}>{item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].permissaoDeAcesso == true ? 'Retirar' : 'Adicionar'}</Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  </View>
                                  <Collapsible style = {{marginLeft: 35}} collapsed = {this.state.CentroSelecionado == index____ ? false : true}>
                                    <View style = {{borderLeftWidth: 1, borderColor: this.props.StyleGlobal.cores.background, paddingLeft: 5}}>
                                      <Text style = {{color: this.props.StyleGlobal.cores.background, fontWeight: 'bold'}}>Módulos</Text>
                                    </View>
                                    {(centro.modulos).map((modulo, index_____) => modulo.permissaoDeAcesso == true && (
                                      <>
                                        <TouchableOpacity activeOpacity = {1}
                                          onPress = {async () => {}}>
                                          <View
                                            style ={{
                                              width: '100%',
                                              borderLeftWidth: 1,
                                              borderBottomWidth: 1,
                                              borderBottomColor: '#e2e3e5',
                                              padding: 5,
                                              borderColor: this.props.StyleGlobal.cores.background
                                          }}>
                                            <View
                                              style = {{
                                                flexDirection: 'row', 
                                                width: '100%',
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                marginLeft: 5,
                                            }}>
                                              <View
                                                style = {{
                                                  flexDirection: 'row',
                                                  alignItems: 'center',
                                                  width: '60%'
                                              }}>
                                                <View>
                                                  <Text
                                                    style = {{
                                                      fontSize: Dimensions.get('window').width * 0.03,
                                                      fontStyle: 'normal',
                                                      fontWeight: 'bold',
                                                      color: '#262825',
                                                      flexWrap: 'wrap',
                                                  }}>{(modulo.name).toUpperCase()}</Text>
                                                </View>
                                              </View>
                                              <View
                                                style ={{
                                                  flexDirection: 'row', 
                                                  justifyContent: 'center', 
                                                  alignItems: 'center',
                                                  width: '30%'
                                                }}>
                                                <TouchableOpacity activeOpacity = {1}
                                                  disabled = {false}
                                                  style = {{
                                                      paddingVertical: 6,
                                                      paddingHorizontal: 10,
                                                      marginRight: 34,
                                                      width: Dimensions.get('window').width * 0.15,
                                                      justifyContent: 'center',
                                                      backgroundColor: item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].modulos[index_____].permissaoDeAcesso == true ? '#FFFFFF'  : this.props.StyleGlobal.cores.botao,
                                                      flexDirection: 'row',
                                                      borderWidth: 1,
                                                      borderColor: this.props.StyleGlobal.cores.botao,
                                                      borderRadius: 2
                                                  }}
                                                  onPress = {async () => {
                                                    if(item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].modulos[index_____].permissaoDeAcesso == false)
                                                    {
                                                      let ListaDeUsuarios = [...this.state.ListaExibida]
                                                      ListaDeUsuarios[index].empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].modulos[index_____].permissaoDeAcesso = true 
                                                      await this.setState({ListaExibida: ListaDeUsuarios})
                                                    }
                                                    else
                                                    {
                                                      let ListaDeUsuarios = [...this.state.ListaExibida]
                                                      ListaDeUsuarios[index].empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].modulos[index_____].permissaoDeAcesso = false 
                                                      await this.setState({ListaExibida: ListaDeUsuarios})
                                                    }
                                                }}>
                                                  <Text
                                                  style = {{
                                                    fontSize: Dimensions.get('window').width * 0.02, 
                                                    color: item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].modulos[index_____].permissaoDeAcesso == true ? this.props.StyleGlobal.cores.botao  : '#FFFFFF',
                                                    fontStyle: 'normal',
                                                    fontWeight: '500',
                                                    textAlign: 'center',
                                                    alignSelf: 'center',
                                                    marginVertical: 4,
                                                    marginHorizontal: 0
                                                  }}>{item.empresasComPermissaoDeAcesso[index__].grupo.empresas[index___].centrodecusto[index____].modulos[index_____].permissaoDeAcesso == true ? 'Retirar' : 'Adicionar'}</Text>
                                                </TouchableOpacity>
                                              </View>
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      </>
                                    ))}
                                  </Collapsible>
                                </TouchableOpacity>
                              </>
                            ))}
                        </Collapsible>
                      </TouchableOpacity>
                    </>
                  ))}
                </Collapsible>
              </>
            ))}
            </View>
            </ScrollView>
            <View style = {{paddingHorizontal: 10}}>
              <TouchableOpacity
                style = {{
                  backgroundColor: this.props.StyleGlobal.cores.background,
                  padding: 16,
                  height: 58,
                  alignItems: 'center',
                  marginBottom: 20,
                  borderRadius: 5
              }}
                onPress = {() => {
                  item._modalEmpresas = false
                  this.setState({LoteSelecionado: null})
                }}>
                <Text
                  style = {{
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: 16,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    alignSelf: 'center',
                }}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
      </Modal>
    </>
  );
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

  //#region Pegando a lista de usuarios no Banco de dados
  pegandoListaDeUsuarios = async () => {
    // const response = await Identificador.consulta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    // if(response != null && response != undefined && response != "") 
    // {
      // this.state.ListaUsuarios = response
      const Lista = this.state.ListaUsuarios
      this.state.ListaUsuarios = Lista
      this.state.ListaOriginal = Lista
      this.state.ListaFiltrada = Lista
      this.state.ListaExibida = [];
      const ListaAdd = [];
      if (Lista.length >= 20) {
        for(var i = 0; i <= (this.state.quantItem - 1); i++) {
          var _tagModalEmpresas = {_modalEmpresas: false}
          var _tagModalPermissoesMenu = {_modalPermissoesMenu: true}
          Object.assign(this.state.ListaFiltrada[i], _tagModalEmpresas)
          Object.assign(this.state.ListaFiltrada[i], _tagModalPermissoesMenu)
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
      } else {
        for(var i = 0; i <=(Lista.length - 1); i++) {
          var _tagModalEmpresas = {_modalEmpresas: false}
          var _tagModalPermissoesMenu = {_modalPermissoesMenu: true}
          Object.assign(this.state.ListaFiltrada[i], _tagModalEmpresas)
          Object.assign(this.state.ListaFiltrada[i], _tagModalPermissoesMenu)
          ListaAdd.push(this.state.ListaFiltrada[i])
        }
        this.state.ListaExibida = ListaAdd
        this.state.isLoadingFooter = true
      }

      await this.pegandoGruposDeEmpresas();
    // }
    // else
    // {
    //   await this.setVisibilidadeModalLoadingGoBack(false)
    //   await this.props.navigation.goBack()
    // }
  }
  //#endregion

  //#region Grupo de empresas
  pegandoGruposDeEmpresas = async () => {
    try {
      const response = await Empresas.consulta(String(this.props.token[0].token))
      if(response != null && response != undefined)
      {        
        this.state.GruposEmpresas = response
        // this.state.ListaEmpresasComPermissaoDeAcesso = this.props.token[0].empresasComPermissaoDeAcesso
        this.setVisibilidadeModalLoadingGoBack(false)
      }
    } catch(err) {
      this.setVisibilidadeModalLoadingGoBack(false)
    }
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeModalLoading = async (value) => {
    await this.setState({ VisibilidadeModalLoading: value })
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeModalEmpresasPermissoes = async (value) => {
    await this.setState({ VisibilidadeModalEmpresasPermissoes: value })
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

  //#region Filtrando usuarios
  searchUpdateUsuarios = async (Term) => {
    await this.setState({searchTermUsuarios: Term, TermUsuarios: Term})
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
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(lote => ((lote.pessoa.nome).includes(this.state.searchTermUsuarios) || (lote.pessoa.cpf).includes(this.state.searchTermUsuarios)))
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

  //#region Filtro de usuarios avançado
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
      console.log(`Qtde. de quartos: ${this.state.FiltroQtdequartos}`)
      this.state.ListaFiltrada = this.state.ListaOriginal.filter(lote => lote.observacoes.includes(`Qtde. de quartos: ${this.state.FiltroQtdequartosMin}`) || lote.observacoes.includes(`Qtde. de quartos: ${this.state.FiltroQtdequartosMax}`))
      // this.state.ListaFiltrada = this.state.ListaOriginal.filter(createFilter(this.state.searchTermUsuarios, KEYS_TO_FILTERS_LEADS))
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

  //#region Carregando mais usuarios para lista
  carregandoMaisUsuariosParaLista = async () => {
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

  //#region Atualizando a lista de usuarios no Banco de dados
  pegandoListaDeUsuariosRefresh = async () => {
    await this.setVisibilidadeModalLoading(false)
    // const response = await Identificador.consulta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    // if(response != null && response != undefined) 
    // {
    //   this.state.ListaUsuarios = response
    //   const Lista = this.state.ListaUsuarios
    //   this.state.ListaUsuarios = Lista
    //   this.state.ListaOriginal = Lista
    //   this.state.ListaFiltrada = Lista
    //   this.state.ListaExibida = [];
    //   const ListaAdd = [];
    //   if (Lista.length >= 20) {
    //     for(var i = 0; i <= this.state.quantItem - 1; i++) {
    //       ListaAdd.push(this.state.ListaFiltrada[i])
    //     }
    //     this.state.ListaExibida = ListaAdd
    //   } else {
    //     for(var i = 0; i <=(Lista.length - 1); i++) {
    //       ListaAdd.push(this.state.ListaFiltrada[i])
    //     }
    //     this.state.ListaExibida = ListaAdd
    //     this.state.isLoadingFooter = true
    //   }
    //   await this.setVisibilidadeModalLoading(false)
    // }
    // else
    // {
    //   await this.setVisibilidadeModalLoading(false)
    // }
  }
  //#endregion

  //#region Atualizando a lista de usuarios no Banco de dados Tabela
  pegandoListaDeUnidadesRefreshTabela = async () => {
    const response = await Identificador.consulta(String(this.props.token[0].token), this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto)
    if(response != null && response != undefined) 
    {
      this.state.ListaUsuarios = response
      const Lista = this.state.ListaUsuarios
      this.state.ListaUsuarios = Lista
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
        await this.setState({isLoadingFooter: true}) 
      }
    }
    else
    {
      await this.setVisibilidadeModalLoading(false)
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
      const navegar = await this.props.navigation.getParam('Disponibilidade', 'null')
      if(navegar != null && navegar != 'null')
      {
        await this.setVisibilidadeModalTabelaDePrecos(false)
        return await navegar.onProposta()
      }
    }
    else if (this.state.identificador.status == 2)
    {
      const { addToIntermediacao, addToCorretagem, addToFinanciamento, addToLotes, addToDadosTabelaDeVendas } = this.props;
      addToCorretagem(this.state.tabelaCorretagem)
      addToIntermediacao(this.state.tabelaIntermediacao)
      addToFinanciamento(this.state.tabelaFinanciamento)
      addToLotes(this.state.identificador)
      addToDadosTabelaDeVendas( { numeroTabelaDeVenda: this.state.numeroDaTabelaDeVenda }, {tabelaFinanciamento: this.state.tabelaFinanciamenteOriginal}, {primeiroVencimentoFinanciamento: this.state.primeiroVencimentoFinanciamento}, { disponibilidadeEntradas: this.state.tabelaEntradasExiste }, { disponibilidadeIntermediarias: this.state.tabelaIntermediariasExiste }, {disponibilidadeFinanciamento: this.state.tabelaFinaciamentoExiste}, { disponibilidadeIntermediacao: this.state.tabelaIntermediacaoExiste }, { disponibilidadeCorretagem: this.state.tabelaCorretagemExiste }, { tabelaCompleta: this.state.tabelaCompleta })

      if(this.state.identificador.reservaVinculada.prospectId == null) 
      {
        const navegarProposta = await this.props.navigation.getParam('Disponibilidade', 'null')
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
            const navegar = await this.props.navigation.getParam('Disponibilidade', 'null')
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
      if(this.state.identificador.reservaVinculada.vendedorId == this.props.token[0].pessoa.id)
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
            await this.pegandoTabelaDePrecos()
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
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Não é possível disponibilizar o lote, ele está reservado em nome de outra pessoa.`
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
            await this.pegandoListaDeUsuariosRefresh()
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
        const navegar = await this.props.navigation.getParam('Disponibilidade', 'null')
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
          await this.pegandoListaDeUsuariosRefresh()
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

  //#region Reservando ou disponibilizando lote
  reserva_disponibilizacao = async (item) => {
    const { addToLotes } = this.props;

    if(item.status == 2) 
    {
      if(item.reservaVinculada.vendedorId == this.props.token[0].pessoa.id)
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
            await this.pegandoListaDeUsuariosRefresh()
          }
        } catch {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Não foi possível disponibilizar, tente novamente!`
            })
          await this.setVisibilidadeModalLoading(false)
        }
      }
      else
      {
        PushNotification.localNotification({
          largeIcon: 'icon',
          smallIcon: 'icon',
          vibrate: true,
          vibration: 300,
          title: 'My Broker',
          message: `Não é possível disponibilizar o lote, ele está reservado em nome de outra pessoa.`
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

export default connect(mapStateToProps, mapDispatchToProps)(Permissoes);