import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class MenuQuadro {
  static = {
    sourceMenuQuadro: axios.CancelToken.source()
  }

  async QuadroResumo(Token, Grupo) {
    return await axios.create({
      baseURL: `${API_URL}Menu/QuadroResumo/` + Token + "/" + Grupo,
      cancelToken: this.static.sourceMenuQuadro.token
    }).get().then(async (response) => {
      if(response.status == 200 || response.status == 201) {
        return response.data;
      }
    }).catch(async error => {
      if(axios.isCancel(error)) {
        console.log('Resquest Cancelada')
      } else {
        if(error.message == "Request failed with status code 401") {
          return null;
        } else if(error.message == "Request failed with status code 400") {
          return null;
        } else if(error.message == "Request failed with status code 403") {
          return null;
        } else if(error.message == "Request failed with status code 404") {
          return null;
        } else if (error.message == "Request failed with status code 500") {
          return null;
        }
      }
    })
  }
  async NewsLetterMyBroker(Token) {
    return await axios.create({
      baseURL: `${API_URL}Menu/Newsletter/` + Token,
      cancelToken: this.static.sourceMenuQuadro.token
    }).get().then(async (response) => {
      if(Math.floor(response.status / 100) == 2) {
        return response.data;
      }
    }).catch(async error => {
      if(axios.isCancel(error)) {
        console.log('Resquest Cancelada')
      } else {
        if(error.message == "Request failed with status code 401") {
          return null;
        } else if(error.message == "Request failed with status code 400") {
          return null;
        } else if(error.message == "Request failed with status code 403") {
          return null;
        } else if(error.message == "Request failed with status code 404") {
          return null;
        } else if (error.message == "Request failed with status code 500") {
          return null;
        }
      }
    })
  }
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourceMenuQuadro.cancel()
    }
    this.static.sourceMenuQuadro = axios.CancelToken.source()
  }
}

export default new MenuQuadro();
