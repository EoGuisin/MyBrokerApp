import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class Mensagem {
  static = {
    sourceMensagem: axios.CancelToken.source()
  }

  async NotificacaoEmailExterno(Token, Empresa, CentroDeCusto, state) {
    
    return axios({
      method: "POST",
      baseURL: `${API_URL}Mensagem/NotificacaoEmailExterno/` + Token + "/" + Empresa + "/" + CentroDeCusto,
      data: JSON.stringify(state),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
  }
  async cancelRequest(option) {
    if (option == true) {
      this.static.sourceMensagem.cancel();
    }
    this.static.sourceMensagem = axios.CancelToken.source()
  }
}

// const correios = axios.create({
//   baseURL: "https://digitaldev-bancodedados.azurewebsites.net/ConsultaCorreios?CEP="
// })

export default new Mensagem();