import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class Formularios  {

  static = {
    sourceFormularios: axios.CancelToken.source()
  }
  
  async Get(Token, EmpresaLogada) {
    
    return await axios.create({
      baseURL: `${API_URL}Formulario/` + Token + "/" + EmpresaLogada, 
      cancelToken: this.static.sourceFormularios.token
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
  async Post(Token, EmpresaLogada, state) {
    return axios({
      method: "POST",
      baseURL: `${API_URL}Formulario/` + Token + "/" + EmpresaLogada,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async Put(Token, EmpresaLogada, state) {
    
    return axios({
      method: 'PUT',
      baseURL: `${API_URL}Formulario/` + Token + "/" + EmpresaLogada,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async Delete(Token, EmpresaLogada, state) {
    return axios({
      method: 'DELETE',
      baseURL: `${API_URL}Formulario/` + Token + "/" + EmpresaLogada,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      cancelToken: this.static.sourceFormularios.token
    })
  }
  async ClassificacoesDasPerguntas(Token, ResponseLeads) {
    
    return await axios.create({
      baseURL: `${API_URL}Formulario/ClassificacoesDasPerguntas/` + Token, 
      cancelToken: this.static.sourceFormularios.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        await ResponseLeads(response.data);
      }
    }).catch(error => {
        if(error.message == "Request failed with status code 401") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
      } else if(error.message == "Request failed with status code 400") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
      } else if(error.message == "Request failed with status code 403") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
      } else if(error.message == "Request failed with status code 404") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
      } else if(error.message == "Request failed with status code 500") {
          PushNotification.localNotification({
            largeIcon: 'icon',
            smallIcon: 'icon',
            vibrate: true,
            vibration: 300,
            title: 'My Broker',
            message: `Aviso: "${error.response.data}"`
          })
      }
    })
  }
  async CancelRequest(option) {
    if (option == true) {
      this.static.sourceFormularios.cancel()
    }
    this.static.sourceFormularios = axios.CancelToken.source()
  }

}

export default new Formularios();