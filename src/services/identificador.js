import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class Identificador {
  static = {
    sourceIdentificador: axios.CancelToken.source()
  }

    async contratos(Token) {
      return await axios.create({
        baseURL: `${API_URL}Identificador/` + Token + `?EfetuarDownload=false`,
        cancelToken: this.static.sourceIdentificador.token
      }).get()
      .then(async Response => { return Response })
      .catch(async Exception => { return Exception })
    }
    async consulta(Token, Empresa, CentroDeCusto) {

      return await axios.create({
        baseURL: `${API_URL}Identificador/` + Token + "/" + Empresa + "/" + CentroDeCusto,
        cancelToken: this.static.sourceIdentificador.token
      }).get().then(async (response) => {
        if(response.status == 200) {
          return response.data
        }
      }).catch(async error => {
        if(error.message == "Request failed with status code 401") {
            return null;
        } else if(error.message == "Request failed with status code 400") {
            return null;
        } else if(error.message == "Request failed with status code 403") {
            return null;
        } else if(error.message == "Request failed with status code 404") {
            return null;
        } else if(error.message == "Request failed with status code 500") {
            return null;
        }
      })
    }
    async filtrosAplicaveis(Token, Empresa, CentroDeCusto) {

      return await axios.create({
        baseURL: `${API_URL}Identificador/FiltrosAplicaveis/` + Token + "/" + Empresa + "/" + CentroDeCusto,
        cancelToken: this.static.sourceIdentificador.token
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
    async minhasreservas(Token, Empresa, CentroDeCusto) {

      return await axios.create({
        baseURL: `${API_URL}Identificador/MinhasReservas/` + Token + "/" + Empresa + "/" + CentroDeCusto,
        cancelToken: this.static.sourceIdentificador.token
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
              title: 'Harmonia',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 400") {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'Harmonia',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 403") {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'Harmonia',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 404") {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'Harmonia',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        } else if(error.message == "Request failed with status code 500") {
            PushNotification.localNotification({
              largeIcon: 'icon',
              smallIcon: 'icon',
              vibrate: true,
              vibration: 300,
              title: 'Harmonia',
              message: `Aviso: ${error.response.data}`
            })
            return await null;
        }
      })
    }
    async cadastrarReserva(Token, IDProspect, state) {

      return axios({
        method: "POST",
        baseURL: `${API_URL}Identificador/ReservarUnidades/` + Token + "?Prospect=" + IDProspect,
        data: JSON.stringify(state),
        headers:{'Content-Type': 'application/json; charset=utf-8'}
      })
    }
    async cadastrarReservaCorretor(Token, state) {

      return axios({
        method: "POST",
        baseURL: `${API_URL}Identificador/ReservarUnidades/` + Token,
        data: JSON.stringify(state),
        headers:{'Content-Type': 'application/json; charset=utf-8'}
      })
    }
    async deletar(Token, state) {
      return axios({
        method: 'DELETE',
        baseURL: `${API_URL}Identificador/DeletarReservas/` + Token,
        data: JSON.stringify(state),
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        cancelToken: this.static.sourceIdentificador.token
      })
    }
    async cancelRequest(option) {
      if (option == true) {
        this.static.sourceIdentificador.cancel()
      }
      this.static.sourceIdentificador = axios.CancelToken.source()
    }
}

export default new Identificador();