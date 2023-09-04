import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class Nacionalidade {
  static = {
    sourceNacionalidade: axios.CancelToken.source()
  }

  async lista(Token) {
    return await axios.create({
      baseURL: `${API_URL}Nacao/` + Token,
      cancelToken: this.static.sourceNacionalidade.token
    }).get().then((response) => {return response})
          .catch((exception) => {return exception})
  }
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourceNacionalidade.cancel()
    }
    this.static.sourceNacionalidade = axios.CancelToken.source()
  }
}

export default new Nacionalidade();