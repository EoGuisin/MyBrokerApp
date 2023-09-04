import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class CentroDeCusto {
  static = {
    sourceCentroDeCusto: axios.CancelToken.source()
  }

  async consulta(Token, EmpresaId, IdNiveis, responsegetEmpreendimento) {

    return await axios.create({
      baseURL: `${API_URL}CentroDeCusto/` + Token +"/"+ EmpresaId + "/" + IdNiveis,
      cancelToken: this.static.sourceCentroDeCusto.token
    }).get().then(async (response) => {
        if(response.status == 200) {
          await responsegetEmpreendimento(response.data);
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
        } else if (error.message == "Request failed with status code 500") {
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
  async grupoDeEmpresas(Token, Grupo, IdNiveis) {
    
    return await axios.create({
      baseURL: `${API_URL}CentroDeCusto/` + Token + "/" + Grupo + "?NivelDeVisualizacao=" + IdNiveis,
      cancelToken: this.static.sourceCentroDeCusto.token
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
        } else if (error.message == "Request failed with status code 500") {
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
  async todos(Token, IdNiveis) {
    
    return await axios.create({
      baseURL: `${API_URL}CentroDeCusto/` + Token +"/" + IdNiveis,
      cancelToken: this.static.sourceCentroDeCusto.token
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
        } else if (error.message == "Request failed with status code 500") {
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
  async meiosDeContato(Token, EmpresaId, EmpreendimentoId, IdNiveis, responsegetMeiosDeContato) {
    
    return await axios.create({
      baseURL: `${API_URL}CentroDeCusto/MeiosDeContato/` + Token +"/"+ EmpresaId + "/" + EmpreendimentoId + "/" + IdNiveis,
      cancelToken: this.static.sourceCentroDeCusto.token
    }).get().then(async (response) => {
        if(response.status == 200) {
          await responsegetMeiosDeContato(response.data);
        }
    }).catch(error => {
        if(error.message == "Request failed with status code 401") {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
        } else if(error.message == "Request failed with status code 400") {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
        } else if(error.message == "Request failed with status code 403") {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
        } else if(error.message == "Request failed with status code 404") {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'My Broker',
              message: `Aviso: ${error.response.data}`
            })
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
    })
  }
  async cadastrar(Token, Empresa, Sigla, Descricao) {

    return await axios.create({
      baseURL: `${API_URL}CentroDeCusto/` + Token + "/" + Empresa + "/" + Sigla + "/" + Descricao
    }).post();
  }
  async alterar(Token, Empresa, Sigla, Descricao) {

    return await axios.create({
      baseURL: `${API_URL}CentroDeCusto/` + Token + "/" + Empresa + "/" + Sigla + "/" + Descricao
    }).put();
  }
  async deletar(Token, Empresa, Sigla) {

    return await axios.create({
      baseURL: `${API_URL}CentroDeCusto/` + Token + "/" + Empresa + "/" + Sigla
    }).delete();
  }
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourceCentroDeCusto.cancel()
    }
    this.static.sourceCentroDeCusto = axios.CancelToken.source()
  }
}

export default new CentroDeCusto();