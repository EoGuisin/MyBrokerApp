const INITIAL_STATE = {
    "cores": {
      "background": '#2a698e',
      "botao": '#0e4688',
    },
    "fontes": {
      "padrao": 'Aktifo A',
      "corpadrao": '#2a698e',
      "corbase": '#FFFFFF',
      "corpadraoclaro": '#86bad7'
    },
    "empresaLogada": {
      "nome": ""
    },
    "permissoes": {}
  }

export default function styleAPP(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@style/ADD_STYLE':
      return action.style;
    case '@style/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}