import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class Logon {
  static = {
    sourceLogon: axios.CancelToken.source()
  }

  async token_cadastro(Login, Senha) {
    return await axios.create({
      baseURL: `${API_URL}Logon/` + Login + "/" + Senha,
      cancelToken: this.static.sourceLogon.token
    }).get().then(async (response) => {
      if((response.status == 200 || response.status == 201)) {
        return response.data
      }
    }).catch(async error => {
      if(axios.isCancel(error)) {
      console.log('Request Cancelada')
      } else {
        if(error.message == "Request failed with status code 401" && dadosLogin != undefined) {
          try {return await null} catch {}
        } else if(error.message == "Request failed with status code 400" && dadosLogin != undefined) {
          try {return await null} catch {}
        } else if(error.message == "Request failed with status code 403" && dadosLogin != undefined) {
          try {return await null} catch {}
        } else if(error.message == "Request failed with status code 404" && dadosLogin != undefined) {
          try {return await null} catch {}
        } else if (error.message == "Request failed with status code 500" && dadosLogin != undefined) {
          try {return await null} catch {}
        }
    }})
  }
  async autenticar(Login, Senha) {

    return await axios.create({
      baseURL: `${API_URL}Logon/` + Login + "/" + Senha,
      cancelToken: this.static.sourceLogon.token
    }).get().then(async (response) => {
      console.log(response)
      if(response.status == 200) {
        return response.data;
      }
    }).catch(async error => {
      if(axios.isCancel(error)) {
        console.log('Request Cancelada')
      } else {
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
      }
     })
  }
  async cadastrar(Token, Pessoa, Senha) {
    return await axios.create({
      baseURL: `${API_URL}Logon/` + Token +"/" + Pessoa + "/" + Senha
    }).post();
  }
  async alterarSenha(Token, Pessoa, SenhaAtual, NovaSenha) {
    return await axios.create({
      baseURL: `${API_URL}Logon/` + Token +"/" + Pessoa + "/" + SenhaAtual + "/" + NovaSenha
    }).put();
  }
  async deletarUsuario(Token, Pessoa) {
    return await axios.create({
      baseURL: `${API_URL}Logon/` + Token + "/" + Pessoa
    }).delete();
  }
  async SolicitarNovaSenha(CPF) {
    return await axios.create({
      baseURL: `${API_URL}Logon/NovaSenha/${CPF}`
    }).post()
      .then((Response) => {return Response;})
      .catch((Exception) => {return Exception;})
  };
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourceLogon.cancel()
    }
    this.static.sourceLogon = axios.CancelToken.source()
  }
}

export default new Logon();