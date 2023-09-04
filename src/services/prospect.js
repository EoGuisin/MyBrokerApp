import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class Prospect  {
  static = {
    sourceProspect: axios.CancelToken.source()
  }

  async lista(Token) {
    
    return await axios.create({
      baseURL: `${API_URL}Prospect/` + Token, 
      cancelToken: this.static.sourceProspect.token
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
  async cadastrar(Token, state) {
    return axios({
      method: "POST",
      baseURL: `${API_URL}Prospect/` + Token,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async cadastrarEmSalaDeVendas(Token, IdSalaDeVendas, IdArea, state) {
    return axios({
      method: "POST",
      baseURL: `${API_URL}Prospect/${Token}/${IdSalaDeVendas}/${IdArea}`,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async cadastrarLista(Token, state) {
    return axios({
      method: "POST",
      baseURL: `${API_URL}Prospect/NovosProspects/` + Token,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async alterar(Token, state) {
    
    return axios({
      method: 'PUT',
      baseURL: `${API_URL}Prospect/` + Token,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async consulta(Token, Prospect) {
    
    return await axios.create({
      baseURL: `${API_URL}Prospect/` + Token + "/" + Prospect,
      cancelToken: this.static.sourceProspect.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return await response.data;
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
  async consultaCPF(Token, CPF) {
    
    return await axios.create({
      baseURL: `${API_URL}Prospect/ConsultarCPF/` + Token + "/" + CPF,
      cancelToken: this.static.sourceProspect.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return await response.data;
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
  async delete(Token, IDProspect) {
    
    return await axios.create({
      baseURL: `${API_URL}Prospect/` + Token + "/" + IDProspect,
      cancelToken: this.static.sourceProspect.token
    }).delete();
  }
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourceProspect.cancel()
    }
    this.static.sourceProspect = axios.CancelToken.source()
  }
}

export default new Prospect();