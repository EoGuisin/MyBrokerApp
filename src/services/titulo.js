import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class Titulo {
  static = {
    sourceTitulo: axios.CancelToken.source()
  }

  async formadepagamento(Token) {

    return await axios.create({
      baseURL: `${API_URL}Titulo/FormaDePagamento/` + Token,
      cancelToken: this.static.sourceTitulo.token
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
  async classificacoes(Token) {

    return await axios.create({
      baseURL: `${API_URL}Titulo/Classificacoes/` + Token,
      cancelToken: this.static.sourceTitulo.token
    }).get();
  }
  async cancelRequest(option) {
    
    if (option == true) {
      this.static.sourceTitulo.cancel()
    }
    this.static.sourceTitulo = axios.CancelToken.source()
  }
}

export default new Titulo();