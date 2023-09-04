const INITIAL_STATE = []

export default function propostaDeVenda(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@propostadevenda/ADD_DADOS':
      return [
         action.propostadevenda
      ];
    case '@propostadevenda/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}