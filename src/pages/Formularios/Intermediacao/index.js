//#region Bibliotecas importadas

//#region Nativas
import React, { Component } from 'react';
import { View, Text, Animated, Image, TouchableOpacity, Dimensions, StyleSheet, ScrollView, Platform } from 'react-native';
//#endregion

//#region Externas
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDeviceId } from "react-native-device-info";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Search, { createFilter } from 'react-native-search-filter';
import PushNotification from 'react-native-push-notification';
import Lottie from 'lottie-react-native';
//#endregion

//#region Services
import Validacoes from '../../../services/validacoes';
import { CentroDeCusto, TabelaDeVendas } from '../../../services';
//#endregion

//#region Redux
import { DadosEmpreendimentoActions, DadosIntermediacaoActions, DadosCorretagemActions } from '../../../store/listaDeActions';
//#endregion

//#region Estilização da tela e efeitos
import { formatoDeTexto } from '../../../Style';
import Loader from '../../../effects/loader.json';
//#endregion

//#region Componentes
import { Container } from '../../../components';
import { ModalCorretor, ModalImobiliaria, ModalLoading, ModalLoadingGoBack } from '../../Modais';
//#endregion

//#region Imagens
import ImagemDeFundo from '../../../assets/imagemdefundologin.png';
import LogoDeFundo from '../../../assets/imagemdefundologo.png';
import LogoNomeEmpresa from '../../../assets/nomedaempresa.png';
//#endregion

//#region Chaves de filtragem

//#endregion

//#endregion

class Intermediacao extends Component {
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

    await this.pegandoTabelasCorretagemIntermediacaoRedux()
  }
  //#endregion

  //#region Component Unmount
  componentWillUnmount() {
    this._isMounted = false;
  }
  //#endregion

  //#region Model
  state = {
    VisibilidadeModalLoading: false,
    VisibilidadeModalLoadingGoBack: false,
    VisibilidadeModalCorretor: false,
    VisibilidadeModalImobiliaria: false,
    VisibilidadeModalLoading: false,
    alturaScrollView: 150,
    TabelaCorretagem: [],
    TabelaIntermediacao: [],
    SimulacaoCorretagem: [],
    SimulacaoIntermediacao: [],
    ValorTotalCorretagem: null,
    QtdeParcelasCorretagem: null,
    VencimentoCorretagem: null,
    VencimentoTemporarioCorretagem: null,
    ValorParcelaCorretagem: null,
    ValorTotalImobiliaria: null,
    QtdeParcelasImobiliaria: null,
    VencimentoImobiliaria: null,
    VencimentoTemporarioImobiliaria: null, 
    ValorParcelasImobiliaria: null,
    ID: "",
  };
  //#endregion

  //#region View
  render() {
    return (
      <Container style = {{ paddingBottom: 0, justifyContent: 'flex-start' }}>
        <ModalLoading visibilidade = {this.state.VisibilidadeModalLoading} 
          onPress = {async () => {
            await TabelaDeVendas.cancelRequest(true)
            await this.setVisibilidadeModalLoading(false)
        }}/>
        <ModalLoadingGoBack visibilidade = {this.state.VisibilidadeModalLoadingGoBack} 
          onPress = {async () => {
            await TabelaDeVendas.cancelRequest(true)
            await this.setVisibilidadeModalLoadingGoBack(false)
            await this.props.navigation.goBack()
        }}/>
        <ModalCorretor 
          visibilidade = {this.state.VisibilidadeModalCorretor}
          colorheader = {this.props.StyleGlobal.cores.background}
          colorbutton = {this.props.StyleGlobal.cores.botao}
          fimdaanimacao = {() => {this.setVisibilidadeModalCorretor(false)}}
          tabelaCorretagem = {
            this.state.TabelaCorretagem.map((corretagem, index) => (
              <TouchableOpacity key = {index} activeOpacity = {1} onPress = {() => {this.setandoOutraEscolhaCorretagem(corretagem.qtdeDeTitulos, this.state.VencimentoTemporarioCorretagem, corretagem.principal, index)}}>
                <View style = {{width: '100%', flexDirection: 'row', backgroundColor: corretagem.status == true ? this.props.StyleGlobal.cores.background : '#FFFFFF', height: 62, alignItems: 'center', paddingHorizontal: 24}}>
                  <Text style = {{width: '30%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: corretagem.status == true ? '#FFFFFF' : '#8F998F'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{corretagem.qtdeDeTitulos}x</Text>
                  <Text style = {{width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: corretagem.status == true ? '#FFFFFF' : '#262825'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.FormatarTexto((corretagem.principal))}</Text>
                  <Text style = {{width: '30%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: corretagem.status == true ? '#FFFFFF' : this.props.StyleGlobal.cores.background}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.FormatarTexto((corretagem.valorTotal))}</Text>
                </View>
              </TouchableOpacity>
            ))}
          valueVencimento = {this.state.VencimentoTemporarioCorretagem}
          onChangeTextVencimento = {(value) => {this.setState({VencimentoTemporarioCorretagem: formatoDeTexto.Data(value)})}}
          onPressConfirmar = {async () => {
            await this.setState({VencimentoCorretagem: this.state.VencimentoTemporarioCorretagem})
            await this.setVisibilidadeModalCorretor(false)
          }}
        />
        <ModalImobiliaria 
          visibilidade = {this.state.VisibilidadeModalImobiliaria}
          colorheader = {this.props.StyleGlobal.cores.background}
          colorbutton = {this.props.StyleGlobal.cores.botao}
          fimdaanimacao = {() => {this.setVisibilidadeModalImobiliaria(false)}}
          tabelaImobiliaria = {
            this.state.TabelaIntermediacao.map((imobiliaria, index) => (
              <TouchableOpacity key = {index} activeOpacity = {1} onPress = {() => {this.setandoOutraEscolhaImobiliaria(imobiliaria.qtdeDeTitulos, this.state.VencimentoTemporarioImobiliaria, imobiliaria.principal, index)}}>
                <View style = {{width: '100%', flexDirection: 'row', backgroundColor: imobiliaria.status == true ? this.props.StyleGlobal.cores.background : '#FFFFFF', height: 62, alignItems: 'center', paddingHorizontal: 24}}>
                  <Text style = {{width: '20%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: imobiliaria.status == true ? '#FFFFFF' : '#8F998F'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{imobiliaria.qtdeDeTitulos}x</Text>
                  <Text style = {{width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: imobiliaria.status == true ? '#FFFFFF' : '#262825'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.FormatarTexto((imobiliaria.principal))}</Text>
                  <Text style = {{width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: imobiliaria.status == true ? '#FFFFFF' : this.props.StyleGlobal.cores.background}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.FormatarTexto((imobiliaria.valorTotal))}</Text>
                </View>
              </TouchableOpacity>
            ))}
          valueVencimento = {this.state.VencimentoTemporarioImobiliaria}
          onChangeTextVencimento = {(value) => {this.setState({VencimentoTemporarioImobiliaria: formatoDeTexto.Data(value)})}}
          onPressConfirmar = {async () => {
            await this.setState({VencimentoImobiliaria: this.state.VencimentoTemporarioImobiliaria})
            await this.setVisibilidadeModalImobiliaria(false)
          }}
        />
        {this.state.VisibilidadeModalLoading == false && <>
        <View style = {{
          backgroundColor: '#FFFFFF',
          height: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? 85 : 62,
          justifyContent: "center",
        }}>
          <View
            style = {{
              flexDirection: 'row', 
              alignItems: 'center', 
              width: '100%', 
              justifyContent: 'space-between',
          }}>
            <Icon name = {'keyboard-arrow-left'} color = {this.props.StyleGlobal.cores.background} size = {40} style = {{marginTop: 10}}
            onPress = {() => {this.props.navigation.goBack()}}/>
            <Text
              style = {{
                marginTop: 6,
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: 16,
                textAlign: 'center',
                color: this.props.StyleGlobal.cores.botao,
            }}>Intermediação</Text>
            <View style = {{width: 40}}></View>
          </View>
        </View>
        <View onLayout = {event => { this.frameViewHeight = event.nativeEvent.layout.height}} style = {{maxHeight: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 190) : (Dimensions.get('window').height - 170), minHeight: (Platform.OS === "ios" && (this.state.ID == "X" || this.state.ID >= 10)) ? (Dimensions.get('window').height - 190) : (Dimensions.get('window').height - 170)}}>
          <ScrollView  ref = {(ref) => this.ScrollViewFinanciamento = ref} showsVertiscalScrollIndicator = {false}
            >
            <View style = {{minHeight: Dimensions.get('window').height - this.state.alturaScrollView}}>
              <View style = {{paddingLeft: 23, height: 88, backgroundColor: '#FFFFFF', justifyContent: 'center'}}>
                <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color:'#8F998F',
                  }}>Valor total</Text>
                <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 20, color: this.props.StyleGlobal.cores.botao
                  }}>{formatoDeTexto.FormatarTexto((this.state.ValorTotalCorretagem) + (this.state.ValorTotalImobiliaria))}</Text>
              </View>
              <View // Corretagem
                style = {{marginTop: 20}}>
                <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginHorizontal: 24}}>                
                  <View>
                    <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: this.props.StyleGlobal.cores.botao, marginBottom: 8}}>Corretor</Text>
                    <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color: '#8F998F'}}>{formatoDeTexto.FormatarTexto((this.state.ValorTotalCorretagem))}</Text>
                  </View>
                  <TouchableOpacity style = {{flexDirection: 'row', padding: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: this.props.StyleGlobal.cores.botao, alignItems: 'center'}}
                    onPress = {() => {this.setVisibilidadeModalCorretor(true)}}>
                    <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 12, textAlign: 'center', color: this.props.StyleGlobal.cores.botao}}>Selecione</Text>
                  </TouchableOpacity>
                </View>
                <View style = {{marginBottom: 8, marginHorizontal: 24}}>
                  <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
                    <Text style = {{width: '20%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 12}} numberOfLines = {1} ellipsizeMode = {'tail'}>Parcelas</Text>
                    <Text style = {{width: '40%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 12}} numberOfLines = {1} ellipsizeMode = {'tail'}>Vencimento</Text>
                    <Text style = {{width: '40%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 12}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor da parcela</Text>
                  </View>
                </View>
                <TouchableOpacity activeOpacity = {1}>
                  <View  style = {{width: '100%', flexDirection: 'row', backgroundColor: '#FFFFFF', height: 62, alignItems: 'center', paddingHorizontal: 24}}>
                    <Text style = {{width: '20%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color: '#8F998F'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{this.state.QtdeParcelasCorretagem}x</Text>
                    <Text style = {{width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#262825'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{this.state.VencimentoCorretagem}</Text>
                    <Text style = {{width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: this.props.StyleGlobal.cores.botao}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.FormatarTexto((this.state.ValorParcelaCorretagem))}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View // Imobiliaria
                style = {{marginTop: 20}}>
                <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginHorizontal: 24}}>                
                  <View>
                    <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 16, color: this.props.StyleGlobal.cores.botao, marginBottom: 8}}>Imobiliária</Text>
                    <Text style = {{fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color: '#8F998F'}}>{formatoDeTexto.FormatarTexto((this.state.ValorTotalImobiliaria))}</Text>
                  </View>
                  <TouchableOpacity style = {{flexDirection: 'row', padding: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: this.props.StyleGlobal.cores.botao, alignItems: 'center'}}
                    onPress = {() => {this.setVisibilidadeModalImobiliaria(true)}}>
                    <Text style = {{fontStyle: 'normal', fontWeight: '500', fontSize: 12, textAlign: 'center', color: this.props.StyleGlobal.cores.botao}}>Selecione</Text>
                  </TouchableOpacity>
                </View>
                <View style = {{marginBottom: 8, marginHorizontal: 24}}>
                  <View style = {{width: '100%', flexDirection: 'row', marginTop: 4}}>
                    <Text style = {{width: '20%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 12}} numberOfLines = {1} ellipsizeMode = {'tail'}>Parcelas</Text>
                    <Text style = {{width: '40%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 12}} numberOfLines = {1} ellipsizeMode = {'tail'}>Vencimento</Text>
                    <Text style = {{width: '40%', textAlign: 'left', color: '#8F998F', fontStyle: 'normal', fontWeight: 'normal', fontSize: 12}} numberOfLines = {1} ellipsizeMode = {'tail'}>Valor da parcela</Text>
                  </View>
                </View>
                <TouchableOpacity activeOpacity = {1}>
                  <View  style = {{width: '100%', flexDirection: 'row', backgroundColor: '#FFFFFF', height: 62, alignItems: 'center', paddingHorizontal: 24}}>
                    <Text style = {{width: '20%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 12, color: '#8F998F'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{this.state.QtdeParcelasImobiliaria}x</Text>
                    <Text style = {{width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: '#262825'}} numberOfLines = {1} ellipsizeMode = {'tail'}>{this.state.VencimentoImobiliaria}</Text>
                    <Text style = {{width: '40%', textAlign: 'left', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14, color: this.props.StyleGlobal.cores.botao}} numberOfLines = {1} ellipsizeMode = {'tail'}>{formatoDeTexto.FormatarTexto((this.state.ValorParcelasImobiliaria))}</Text>
                  </View>
                </TouchableOpacity>
                </View>
            </View>
          </ScrollView>
        </View>
        <View style = {{ marginHorizontal: 20 }}>
          <TouchableOpacity
            style = {{
              width: '100%',
              backgroundColor: this.props.StyleGlobal.cores.botao,
              padding: 16,
              alignItems: 'center',
              marginVertical: 35
          }}
            onPress = {this.prosseguirProximaTela}>
            <Text
              style = {{
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: 14,
                textAlign: 'center',
                color: '#FFFFFF',
                alignSelf: 'center',
            }}>Prosseguir</Text>
          </TouchableOpacity>
        </View>
        </>}
      </Container>
    );
  }
  //#endregion

  //#region Controller

  //#region Setando a visibilidade da modal de loading
  setVisibilidadeModalLoading(value) {
    this.setState({VisibilidadeModalLoading: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal de loading go back
  setVisibilidadeModalLoadingGoBack(value) {
    this.setState({VisibilidadeModalLoadingGoBack: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal do corretor
  setVisibilidadeModalCorretor(value) {
    this.setState({VisibilidadeModalCorretor: value})
  }
  //#endregion

  //#region Setando a visibilidade da modal da imobiliaria
  setVisibilidadeModalImobiliaria(value) {
    this.setState({VisibilidadeModalImobiliaria: value})
  }
  //#endregion

  //#region Setando a vsibilidade da modal de loading
  setVisibilidadeModalLoading(value) {
    this.setState({VisibilidadeModalLoading: value})
  }
  //#endregion

  //#region Pegando tabela de corretagem e de intermediacao do redux
  pegandoTabelasCorretagemIntermediacaoRedux = async () => {
    this.state.TabelaCorretagem = this.props.tabelaCorretagem[0]
    this.state.TabelaIntermediacao = this.props.tabelaIntermediacao[0]
    this.state.ValorTotalCorretagem = this.props.tabelaCorretagem[0][0].valorTotal
    this.state.VencimentoCorretagem = formatoDeTexto.DataInvertendoJSON((this.props.tabelaCorretagem[0][0].primeiroVencimento).replace('T00:00:00', '').replace('-03:00', ''))
    this.state.VencimentoTemporarioCorretagem = formatoDeTexto.DataInvertendoJSON((this.props.tabelaCorretagem[0][0].primeiroVencimento).replace('T00:00:00', '').replace('-03:00', ''))
    this.state.ValorParcelaCorretagem = this.state.TabelaCorretagem[this.state.TabelaCorretagem.length - 1].principal
    this.state.QtdeParcelasCorretagem = this.state.TabelaCorretagem[this.state.TabelaCorretagem.length - 1].qtdeDeTitulos
    this.state.ValorTotalImobiliaria = this.props.tabelaIntermediacao[0][0].valorTotal
    this.state.VencimentoImobiliaria = formatoDeTexto.DataInvertendoJSON((this.props.tabelaIntermediacao[0][0].primeiroVencimento).replace('T00:00:00', '').replace('-03:00', ''))
    this.state.VencimentoTemporarioImobiliaria = formatoDeTexto.DataInvertendoJSON((this.props.tabelaIntermediacao[0][0].primeiroVencimento).replace('T00:00:00', '').replace('-03:00', ''))
    this.state.ValorParcelasImobiliaria = this.state.TabelaIntermediacao[this.state.TabelaIntermediacao.length - 1].principal
    await this.setState({QtdeParcelasImobiliaria: this.state.TabelaIntermediacao[this.state.TabelaIntermediacao.length - 1].qtdeDeTitulos})
  }
  //#endregion

  //#region Setando outra escolha para a imobiliaria
  setandoOutraEscolhaImobiliaria = async (qtdeParcelas, vencimento, valor, posicao) => {
    this.state.TabelaIntermediacao.map((imobiliaria, index) => {
      if(posicao == index)
      {
        imobiliaria.status = true
      }
      else
      {
        imobiliaria.status = false
      }
    })
    await this.setState({
      QtdeParcelasImobiliaria: qtdeParcelas,
      VencimentoTemporarioImobiliaria: vencimento,
      ValorParcelasImobiliaria: valor,
    })
  }
  //#endregion

  //#region Setando outra escolha para corretagem
  setandoOutraEscolhaCorretagem = async (qtdeParcelas, vencimento, valor, posicao) => {
    this.state.TabelaCorretagem.map((corretagem, index) => {
      if(posicao == index)
      {
        corretagem.status = true
      }
      else
      {
        corretagem.status = false
      }
    })
    await this.setState({
      QtdeParcelasCorretagem: qtdeParcelas,
      VencimentoTemporarioCorretagem: vencimento,
      ValorParcelasCorretagem: valor,
    })
  }
  //#endregion

  //#region Simulacao corretagem
  simulacaoCorretagem = async () => {
    // console.log(this.props.token[0].token)
    // console.log(this.props.empresa[0].empresa)
    // console.log(this.props.centrodecusto[0].centrodecusto)
    // console.log(this.props.LotesReservados[0].local['id'])
    // console.log(this.props.LotesReservados[0].subLocal['id'])
    // console.log(this.props.numeroTabelaDeVenda[0].numeroTabelaDeVenda)
    // console.log(this.state.QtdeParcelasCorretagem)
    const response = await TabelaDeVendas.simularTitulosDeCorretagem(this.props.token[0].token, this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, this.props.LotesReservados[0].local['id'], this.props.LotesReservados[0].subLocal['id'], this.props.numeroTabelaDeVenda[0].numeroTabelaDeVenda, this.state.QtdeParcelasCorretagem)
    if(response != null && response != undefined)
    {
      await this.setState({SimulacaoCorretagem: response})
      await this.simulacaoIntermediacao()
    }
    else
    {
      await this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

  //#region Simulacao Intermediacao
  simulacaoIntermediacao = async () => {
    const response = await TabelaDeVendas.simularTitulosDeIntermediacao(this.props.token[0].token, this.props.empresa[0].empresa, this.props.centrodecusto[0].centrodecusto, this.props.LotesReservados[0].local['id'], this.props.LotesReservados[0].subLocal['id'], this.props.numeroTabelaDeVenda[0].numeroTabelaDeVenda, this.state.QtdeParcelasImobiliaria, formatoDeTexto.DataJSON(this.state.VencimentoImobiliaria))
    if (response != null && response != undefined)
    {
      await this.setState({SimulacaoIntermediacao: response})
      const { addToIntermediacao, addToCorretagem } = this.props;
      addToCorretagem(this.state.SimulacaoCorretagem)
      addToIntermediacao(this.state.SimulacaoIntermediacao)
      await this.setVisibilidadeModalLoading(false)
      const navegar = await this.props.navigation.getParam('Intermediacao', 'null')
      if(navegar != null && navegar != 'null')
      {
        return navegar.onConfirm()
      }
      // await this.props.navigation.navigate('PropostaDePagamento')
    }
    else
    {
      await this.setState({SimulacaoCorretagem: [], SimulacaoIntermediacao: []})
      await this.setVisibilidadeModalLoading(false)
    }
  }
  //#endregion

  //#region Prosseguir para a proxima tela
  prosseguirProximaTela = async () => {
    await this.setVisibilidadeModalLoading(true)
    await this.simulacaoCorretagem()
  }
  //#endregion

  //#endregion
}

const mapStateToProps = state => ({
  token: state.dadosUsuario,
  tela: String(state.telaAtual),
  ConfigCss: state.configcssApp,
  StyleGlobal: state.StyleGlobal,
  empresa: state.dadosEmpreendimento.filter(emp => emp.empresa),
  centrodecusto: state.dadosEmpreendimento.filter(emp => emp.centrodecusto),
  LotesReservados: state.dadosLotes,
  disponibilidadeCorretagem: state.dadosTabelaDeVenda.filter(item => item.disponibilidadeCorretagem),
  disponibilidadeIntermediacao: state.dadosTabelaDeVenda.filter(item => item.disponibilidadeIntermediacao),
  primeiroVencimentoFinanciamento: state.dadosTabelaDeVenda.filter(item => item.primeiroVencimentoFinanciamento),
  numeroTabelaDeVenda: state.dadosTabelaDeVenda.filter(item => item.numeroTabelaDeVenda),
  tabelaCorretagem: state.dadosCorretagem,
  tabelaIntermediacao: state.dadosIntermediacao,
  tabelaFinanciamento: state.dadosFinanciamento,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({...DadosEmpreendimentoActions, ...DadosCorretagemActions, ...DadosIntermediacaoActions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Intermediacao);