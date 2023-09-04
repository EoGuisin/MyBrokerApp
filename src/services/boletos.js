import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class Boletos {
  static = {
    sourceBoletos: axios.CancelToken.source()
  }

  async consultaBoletosEmitidos(Token, IDEmpresa, IDCentroDeCusto, Local, Sublocal) {
    return await axios.create({
      baseURL: `${API_URL}Boleto/ConsultarBoletosEmitidos/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "?" + "Local=" + Local + "&" + "Sublocal=" + Sublocal,
      cancelToken: this.static.sourceBoletos.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        console.log(`${API_URL}Boleto/ConsultarBoletosEmitidos/` + Token + "/" + IDEmpresa + "/" + IDCentroDeCusto + "?" + "Local=" + Local + "&" + "Sublocal=" + Sublocal)
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
  async reimprimirBoleto(Token, state) {
    return axios({
      method: "POST",
      baseURL: `${API_URL}Boleto/ReimprimirBoleto/` + Token,
      data: JSON.stringify(state),
      headers:{'Content-Type': 'application/json; charset=utf-8'}
    })

  }
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourceBoletos.cancel()
    }
    this.static.sourceBoletos = axios.CancelToken.source()
  }
}

export default new Boletos();