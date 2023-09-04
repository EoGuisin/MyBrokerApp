import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class Pessoa {
  static = {
    sourcePessoa: axios.CancelToken.source()
  }

  async localizar(Token, CPF) {

    return await axios.create({
      baseURL: `${API_URL}Pessoa/` + Token + "/" + CPF,
      cancelToken: this.static.sourcePessoa.token
    }).get().then(async (response) => {
        if(response.status == 200 || response.status == 201) {
          return response.data;
        }
    }).catch(async error => {
      if(axios.isCancel(error)) {
        console.log('Request cancelada')
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
        }
      })
  }
  async natureza(Token) {
    return await axios.create({
      baseURL: `${API_URL}Pessoa/Natureza/` + Token,
      cancelToken: this.static.sourcePessoa.token
    }).get();
  }
  async estadocivil(Token) {
    return await axios.create({
      baseURL: `${API_URL}Pessoa/EstadoCivil/` + Token,
      cancelToken: this.static.sourcePessoa.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
      if (axios.isCancel(error)) {
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
      }
    })
  }
  async regimeDeBens(Token) {

    return await axios.create({
      baseURL: `${API_URL}Pessoa/RegimeDeBens/` + Token,
      cancelToken: this.static.sourcePessoa.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
      if (axios.isCancel(error)) {
        console.log('Request cancelada')
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
      }
    })
  }
  async cadastrar(Token, state) {
    return axios({
      method: "POST",
      baseURL: `${API_URL}Pessoa/` + Token,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async cadastrarPessoas(Token, state) {

    return axios({
      method: "POST",
      baseURL: `${API_URL}Pessoa/NovasPessoas/` + Token,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async cadastrarDocumentos(Token, Pessoa, state) {
    return axios({
      method: "POST",
      baseURL: `${API_URL}Pessoa/NovosDocumentos/` + Token + "/" + Pessoa,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async cadastrarEmails(Token, Pessoa, state) {
    return axios({
      method: 'POST',
      baseURL: `${API_URL}Pessoa/NovosEmails/` + Token + "/" + Pessoa,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async cadastrarEnderecos(Token, Pessoa, state) {
    return axios({
      method: "POST",
      baseURL: `${API_URL}Pessoa/NovosEnderecos/` + Token + "/" + Pessoa,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async cadastrarTelefones(Token, Pessoa, state) {
    return  axios({
      method: "POST",
      baseURL: `${API_URL}Pessoa/NovosTelefones/` + Token + "/" + Pessoa, 
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}      
    })
  }
  async alterarDados(Token, state) {

    return axios({
      method: "PUT",
      baseURL: `${API_URL}Pessoa/` + Token,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async alterarDocumentos(Token, Pessoa, state) {
    
    return axios({
      method: "PUT",
      baseURL: `${API_URL}Pessoa/AtualizacaoDoDocumento/` + Token + "/" + Pessoa,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async alterarEmails(Token, Pessoa, state) {

    return axios({
      method: "PUT",
      baseURL: `${API_URL}Pessoa/AtualizacaoDoEmail/` + Token + "/" + Pessoa,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async alterarEndereco(Token, Pessoa, state) {

    return axios({
      method: "PUT",
      baseURL: `${API_URL}Pessoa/AtualizacaoDoEndereco/` + Token + "/" + Pessoa,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async alterarTelefones(Token, Pessoa, state) {

    return axios({
      method: "PUT",
      baseURL: `${API_URL}Pessoa/AtualizacaoDoTelefone/` + Token + "/" + Pessoa,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async deletar(Token, Id) {

    return await axios.create({
      baseURL: `${API_URL}Pessoa/` + Token + "/" + Id 
    }).delete();
  }
  async deletarDocumento(Token, Pessoa, classificacao) {

    return await axios.create({
      baseURL: `${API_URL}Pessoa/DeletarDocumento/` + Token + "/" + Pessoa + "/" + classificacao,
    }).delete();
  }
  async deletarEmail(Token, Pessoa, Email) {

    return await axios.create({
      baseURL: `${API_URL}Pessoa/DeletarEmail/` + Token + "/" + Pessoa + "/" + Email
    }).delete();
  }
  async deletarEndereco(Token, Pessoa, Id) {

    return await axios.create({
      baseURL: `${API_URL}Pessoa/DeletarEndereco/` + Token + "/" + Pessoa + "/" + Id
    }).delete();
  }
  async deletarTelefone(Token, Pessoa, DDI, DDD, Telefone) {

    return await axios.create({
      baseURL: `${API_URL}Pessoa/DeletarTelefone/` + Token + "/" + Pessoa + "/" + DDI + "/" + DDD + "/" + Telefone
    }).delete();
  }
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourcePessoa.cancel()
    }
    this.static.sourcePessoa = axios.CancelToken.source()
  }
}

export default new Pessoa();