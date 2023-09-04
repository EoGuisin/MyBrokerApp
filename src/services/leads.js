import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class Leads  {
  static = {
    sourceLeads: axios.CancelToken.source()
  }

  async lista(Token) {
    
    return await axios.create({
      baseURL: `${API_URL}Lead/` + Token, 
      cancelToken: this.static.sourceLeads.token
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
  async cadastrar(Token, state) {
    return axios({
      method: "POST",
      baseURL: `${API_URL}Lead/` + Token,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async cadastrarEmSalaDeVendas(Token, IdSalaDeVendas, IdArea, state) {
    return axios({
      method: "POST",
      baseURL: `${API_URL}Lead/${Token}/${IdSalaDeVendas}/${IdArea}`,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async alterar(Token, state) {
    
    return axios({
      method: 'PUT',
      baseURL: `${API_URL}Lead/` + Token,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async consulta(Token, Lead, ResponseLeads) {
    
    return await axios.create({
      baseURL: `${API_URL}Lead/` + Token + "/" + Lead,
      cancelToken: this.static.sourceLeads.token
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
  async delete(Token, IDLead) {
    
    return await axios.create({
      baseURL: `${API_URL}Lead/` + Token + "/" + IDLead,
      cancelToken: this.static.sourceLeads.token
    }).delete();
  }
  async classificacaoDependente(Token, ResponseLeads) {
    
    return await axios.create({
      baseURL: `${API_URL}Lead/` + Token, 
      cancelToken: this.static.sourceLeads.token
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
  async LocaisDeCaptacao(Token) {

    return await axios.create({
      baseURL: `${API_URL}Lead/LocaisDeCaptacao/` + Token, 
      cancelToken: this.static.sourceLeads.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data
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
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourceLeads.cancel()
    }
    this.static.sourceLeads = axios.CancelToken.source()
  }
}

export default new Leads();