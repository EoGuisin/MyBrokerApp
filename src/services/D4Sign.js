import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import API_URL from './api';

class D4Sign {
    static = {
        sourceD4Sign: axios.CancelToken.source()
    }

    async submeterAssinatura(Token, state)
    {
        return axios({
            method: "POST",
            baseURL: `${API_URL}D4Sign/` + Token,
            data: JSON.stringify(state),
            headers:{'Content-Type': 'application/json; charset=utf-8'}
        }).then((response) => {return response})
          .catch((exception) => {return exception})
    }

    async cancelRequest(option) {
        if (option == true) {
          this.static.sourceD4Sign.cancel();
        }
        this.static.sourceD4Sign = axios.CancelToken.source()
    }
}

export default new D4Sign();