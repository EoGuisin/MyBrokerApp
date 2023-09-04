import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class TabelaDeVendas {
  static = {
    sourceTabelaDeVendas: axios.CancelToken.source()
  }

  async consulta(Token, IDEmpresa, IDCentroDeCusto, Local, Sublocal) {
    return await axios.create({
      baseURL: `${API_URL}TabelaDeVenda/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "/" + Local + "/" + Sublocal, 
      cancelToken: this.static.sourceTabelaDeVendas.token
    }).get().then(async (response) => {
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
  async simularTitulosDeCorretagem(Token, IDEmpresa, IDCentroDeCusto, Local, Sublocal, IDTabelaDeVenda, QtdeDeTitulos) {
    return await axios.create({
      baseURL: `${API_URL}TabelaDeVenda/SimularTitulosDeCorretagem/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "/" + Local + "/" + Sublocal + "/" + IDTabelaDeVenda + "/" + QtdeDeTitulos,
      cancelToken: this.static.sourceTabelaDeVendas.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      } else if(error.message == "Request failed with status code 400") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      } else if(error.message == "Request failed with status code 403") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      } else if(error.message == "Request failed with status code 404") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      } else if(error.message == "Request failed with status code 500") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      }
    })
  }
  async simularTitulosDeIntermediacao(Token, IDEmpresa, IDCentroDeCusto, Local, Sublocal, IDTabelaDeVenda, QtdeDeTitulos, PrimeiroVencimento) {
    return await axios.create({
      baseURL: `${API_URL}TabelaDeVenda/SimularTitulosDeIntermediacao/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "/" + Local + "/" + Sublocal + "/" + IDTabelaDeVenda + "/" + QtdeDeTitulos + "/" + PrimeiroVencimento,
      cancelToken: this.static.sourceTabelaDeVendas.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      } else if(error.message == "Request failed with status code 400") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      } else if(error.message == "Request failed with status code 403") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      } else if(error.message == "Request failed with status code 404") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      } else if(error.message == "Request failed with status code 500") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      }
    })
  }
  async simularTitulosDeEntradas(Token, IDEmpresa, IDCentroDeCusto, Local, Sublocal, IDTabelaDeVenda, QtdeDeTitulos) {
    return await axios.create({
      baseURL: `${API_URL}TabelaDeVenda/SimularTitulosDeEntrada/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "/" + Local + "/" + Sublocal + "/" + IDTabelaDeVenda + "/" + QtdeDeTitulos,
      cancelToken: this.static.sourceTabelaDeVendas.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      } else if(error.message == "Request failed with status code 400") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      } else if(error.message == "Request failed with status code 403") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      } else if(error.message == "Request failed with status code 404") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      } else if(error.message == "Request failed with status code 500") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
          return await null;
      }
    })
  }
  async simularTitulosDeParcelaPorQtdeDeTitulos(Token, IDEmpresa, IDCentroDeCusto, Local, Sublocal, IDTabelaDeVenda, QtdeDeTitulos, PrimeiroVencimento, ValorTotalDeEntrada) {
    return await axios.create({
      baseURL: `${API_URL}TabelaDeVenda/SimularTitulosDeParcelaPorQtdeDeTitulos/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "/" + Local + "/" + Sublocal + "/" + IDTabelaDeVenda + "/" + QtdeDeTitulos + "/" + PrimeiroVencimento + "/" + ValorTotalDeEntrada,
      cancelToken: this.static.sourceTabelaDeVendas.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: ${error.response.data}`
          })
          return await null;
      } else if(error.message == "Request failed with status code 400") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: ${error.response.data}`
          })
          return await null;
      } else if(error.message == "Request failed with status code 403") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: ${error.response.data}`
          })
          return await null;
      } else if(error.message == "Request failed with status code 404") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: ${error.response.data}`
          })
          return await null;
      } else if(error.message == "Request failed with status code 500") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: ${error.response.data}`
          })
          return await null;
      }
    })
  }
  async simularTitulosDeParcelaPorValorDaParcela(Token, IDEmpresa, IDCentroDeCusto, Local, Sublocal, IDTabelaDeVenda, ValorDaParcela, PrimeiroVencimento, ValorTotalDeEntrada) {
    return await axios.create({
      baseURL: `${API_URL}TabelaDeVenda/SimularTitulosDeParcelaPorValorDaParcela/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "/" + Local + "/" + Sublocal + "/" + IDTabelaDeVenda + "/" + ValorDaParcela + "/" + PrimeiroVencimento + "/" + ValorTotalDeEntrada,
      cancelToken: this.static.sourceTabelaDeVendas.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: ${error.response.data}`
          })
          return await null;
      } else if(error.message == "Request failed with status code 400") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: ${error.response.data}`
          })
          return await null;
      } else if(error.message == "Request failed with status code 403") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: ${error.response.data}`
          })
          return await null;
      } else if(error.message == "Request failed with status code 404") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: ${error.response.data}`
          })
          return await null;
      } else if(error.message == "Request failed with status code 500") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: ${error.response.data}`
          })
          return await null;
      }
    })
  }
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourceTabelaDeVendas.cancel()
    }
    this.static.sourceTabelaDeVendas = axios.CancelToken.source()
  }
}

export default new TabelaDeVendas();