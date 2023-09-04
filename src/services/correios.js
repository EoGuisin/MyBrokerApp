import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class Correios {
  static = {
    sourceCorreios: axios.CancelToken.source()
  }

  async consulta(Token, CEPOriginal) {
    
    return await axios.create({
      baseURL:`${API_URL}Correios/` + Token +"/"+ CEPOriginal,
      cancelToken: this.static.sourceCorreios.token
    }).get().then(async (response) => {
        if(response.status == 200 || response.status == 201) {
          return response.data
        }
    }).catch(async error => {
      if (axios.isCancel(error)) {
        console.log('Request Cancelada')
      } else {
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
                message: `Aviso: CEP não localizado, preencha os dados manualmente`
            })
            return await null;
          } else if (error.message == "Request failed with status code 500") {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
          }
          return await null;
      }
    })
  }
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourceCorreios.cancel();
    }
    this.static.sourceCorreios = axios.CancelToken.source()
  }
}

// const correios = axios.create({
//   baseURL: "https://digitaldev-bancodedados.azurewebsites.net/ConsultaCorreios?CEP="
// })

export default new Correios();