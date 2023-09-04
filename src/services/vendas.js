import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import RNFetchBlob from "rn-fetch-blob";
import API_URL from './api';

class Vendas {
  static = {
    sourceVendas: axios.CancelToken.source()
  }

  async consultar(Token) {

    return await axios.create({
      baseURL: `${API_URL}Venda/` + Token,
      cancelToken: this.static.sourceVendas.token
    }).get();
  }
  async cadastrar(Token, state) {

    return axios({
      method: "POST",
      baseURL: `${API_URL}Venda/` + Token,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async proposta(Token, state) {
    
    return axios({
      method: "POST",
      baseURL: `${API_URL}Venda/NovaProposta/` + Token,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async novoContrato(Token, state) {
    
    return axios({
      method: "POST",
      baseURL: `${API_URL}Venda/NovoContrato/` + Token,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async declaracaoDeRenda(Token, IDEmpresa, IDCentroDeCusto, CPF, DataDeNascimento) {
    
    return await axios.create({
      baseURL: `${API_URL}Venda/GerarDeclaracaoDeRenda/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "/" + CPF + "/" + DataDeNascimento,
      cancelToken: this.static.sourceVendas.token
    }).post()
  }
  async cliente(Token, NomeDoCliente) {

    return await axios.create({
      baseURL: `${API_URL}Venda/` + Token + "/" + NomeDoCliente,
      cancelToken: this.static.sourceVendas.token
    }).get();
  }
  async contratospendentes(Token, IDEmpresa, IDCentroDeCusto) {

    return await axios.create({
      baseURL: `${API_URL}Venda/MeusContratos/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto,
      cancelToken: this.static.sourceVendas.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 400") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 403") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 404") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 500") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } 
    })
  }
  async propostasPendentes(Token, IDEmpresa, IDCentroDeCusto) {

    return await axios.create({
      baseURL: `${API_URL}Venda/ContratosPendentesDeAprovacao/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto,
      cancelToken: this.static.sourceVendas.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 400") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 403") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 404") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 500") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } 
    })
  }
  async aprovarProposta(Token, IDEmpresa, IDCentroDeCusto, IDVenda) {
    
    return await axios.create({
      baseURL: `${API_URL}Venda/AprovarProposta/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "/" + IDVenda,
      cancelToken: this.static.sourceVendas.token
    }).post();
  }
  async desaprovarProposta(Token, IDEmpresa, IDCentroDeCusto, IDVenda) {
    
    return await axios.create({
      baseURL: `${API_URL}Venda/DesaprovarProposta/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "/" + IDVenda,
      cancelToken: this.static.sourceVendas.token
    }).post();
  }
  async consultarcontratos(Token, IDEmpresa, IDCentroDeCusto, IDVenda) {

    return await axios.create({
      baseURL: `${API_URL}Venda/ConsultarContrato/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "/" + IDVenda,
      cancelToken: this.static.sourceVendas.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 400") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 403") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 404") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 500") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } 
    })
  }
  async consultarcompactarcontratos(Token, IDEmpresa, IDCentroDeCusto, IDVenda, Compactar) {

    return await axios.create({
      baseURL: `${API_URL}Venda/ConsultarECompactarContrato/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "/" + IDVenda + "/" + Compactar,
      cancelToken: this.static.sourceVendas.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 400") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 403") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 404") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 500") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } 
    })
  }
  async consultarDocumentosDoContrato(Token, IDEmpresa, IDCentroDeCusto, IDVenda, Descricao) {

    return await axios.create({
      baseURL: `${API_URL}Venda/ConsultarDocumentoDoContrato/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "/" + IDVenda + "/" + Descricao,
      cancelToken: this.static.sourceVendas.token
    }).get().then((response) => {return response})
    .catch((exception) => {return exception})
  }
  async finalidadesdecompra(Token, Empresa, CentroDeCusto, TokenBancoDeDados) {

    return await axios.create({
      baseURL: `${API_URL}Venda/FinalidadesDeCompra/` + Token + "/" + Empresa + "/" + CentroDeCusto + "/" + TokenBancoDeDados,
      cancelToken: this.static.sourceVendas.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 400") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 403") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 404") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 500") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } 
      })
  }
  async veiculosdedivulgacao(Token, Empresa, CentroDeCusto, TokenBancoDeDados) {

    return await axios.create({
      baseURL: `${API_URL}Venda/VeiculosDeDivulgacao/` + Token  + "/" + Empresa + "/" + CentroDeCusto + "/" + TokenBancoDeDados,
      cancelToken: this.static.sourceVendas.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
          return await null;
        } else if(error.message == "Request failed with status code 400") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
          return await null;
        } else if(error.message == "Request failed with status code 403") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
           return await null;
        } else if(error.message == "Request failed with status code 404") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 500") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        }
    })
  }
  async modeloDeVendas(Token, Empresa, CentroDeCusto) {
    
    return await axios.create({
      baseURL: `${API_URL}Venda/ModelosDeVendas/` + Token + "/" + Empresa + "/" + CentroDeCusto,
      cancelToken: this.static.sourceVendas.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 400") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 403") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 404") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 500") {
            PushNotification.localNotification({
              largeIcon: 'digitaldev',
              smallIcon: 'digitaldev',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        }
    })
  }
  async simulacaoDeVendas(Token, state) {

    return axios({
      method: "POST",
      baseURL: `${API_URL}Venda/SimulacaoDeVenda/` + Token,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async gerarInformeDeRendimento(Token, Empresa, CentroDeCusto, Ano) {

    return await axios.create({
      baseURL: `${API_URL}Venda/GerarInformeDeRendimentos/` + Token + "/" + Empresa + "/" + CentroDeCusto + "?Ano=" + Ano,
      cancelToken: this.static.sourceVendas.token
    }).post().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
            return await null;
        } else if(error.message == "Request failed with status code 400") {
            return await null;
        } else if(error.message == "Request failed with status code 403") {
            return await null;
        } else if(error.message == "Request failed with status code 404") {
            return await null;
        } else if(error.message == "Request failed with status code 500") {
            return await null;
        }
    })

  }
  async gerarDemonstrativoDePagamento(Token, Empresa, CentroDeCusto, Local, SubLocal) {

    return await axios.create({
      baseURL: `${API_URL}Venda/GerarExtratoDaVenda/` + Token + "/" + Empresa + "/" + CentroDeCusto + "/" + Local + "/" + SubLocal,
      cancelToken: this.static.sourceVendas.token
    }).post().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
            return await null;
        } else if(error.message == "Request failed with status code 400") {
            return await null;
        } else if(error.message == "Request failed with status code 403") {
            return await null;
        } else if(error.message == "Request failed with status code 404") {
            return await null;
        } else if(error.message == "Request failed with status code 500") {
            return await null;
        }
    })

  }
  async NovosDocumentos(Token, Empresa, CentroDeCusto, Venda, Arquivos)
  {

    var myHeaders = new Headers();
    
    myHeaders.append("Content-Type", "multipart/form-data");

    var formdata = new FormData();

    Arquivos.map((Item) => {
      formdata.append("Arquivos", Item.base64);
    });

    return await axios({
      method: "POST",
      baseURL: `${API_URL}Venda/NovosDocumentos/${Token}/${Empresa}/${CentroDeCusto}/${Venda}`,
      data: formdata,
      headers: myHeaders
    }).then(response => console.log(response))
      .catch(exception => console.log(exception))
  }
  async FinalidadesDeCompra(Token, Empresa, CentroDeCusto, TokenBancoDeDados) {
    
    return await axios.create({
      baseURL: `${API_URL}Venda/FinalidadesDeCompra/` + Token + "/" + Empresa + "/" + CentroDeCusto + "/" + TokenBancoDeDados,
      cancelToken: this.static.sourceVendas.token
    }).get()
      .then((Response) => {return Response})
      .catch((Exception) => {return Exception})
  }
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourceVendas.cancel()
    }
    this.static.sourceVendas = axios.CancelToken.source()
  }

}

export default new Vendas();