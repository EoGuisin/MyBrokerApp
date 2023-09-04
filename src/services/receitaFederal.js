import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class ReceitaFederal {
  static = {
    sourceReceitaFederal: axios.CancelToken.source()
  }

  async Consulta_CPF(Token, CPF_CNPJ, DataNascimento){

    return await axios.create({
      baseURL: `${API_URL}ReceitaFederal/` + Token +"/"+ CPF_CNPJ +"/"+ DataNascimento,
      cancelToken: this.static.sourceReceitaFederal.token
    }).get().then(async (response) => {
      if(response.status == 200) {
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
                message: `Aviso: ${error.response.data}!`
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
  async Consulta_CNPJ(Token, CPF_CNPJ){

    return await axios.create({
      baseURL: `${API_URL}ReceitaFederal/` + Token +"/"+ CPF_CNPJ,
      cancelToken: this.static.sourceReceitaFederal.token
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
      this.static.sourceReceitaFederal.cancel()
    }
    this.static.sourceReceitaFederal = axios.CancelToken.source()
  }
}

export default new ReceitaFederal();