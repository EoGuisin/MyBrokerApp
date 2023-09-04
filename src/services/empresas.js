import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class Empresas {
  static = {
    sourceEmpresas: axios.CancelToken.source()
  }

  async consulta(Token) {

    return await axios.create({
      baseURL: `${API_URL}Empresa/GruposDeEmpresas/` + Token + "/" + "?MeusGrupos=true",
      cancelToken: this.static.sourceEmpresas.token
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
        } else if (error.message == "Request failed with status code 500") {
          return await null; 
        } 
    })
  }
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourceEmpresas.cancel()
    }
    this.static.sourceEmpresas = axios.CancelToken.source()
  }
}

export default new Empresas();