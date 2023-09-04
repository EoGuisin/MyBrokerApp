const INITIAL_STATE = []

export default function documentosPropostaLista(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@documentospropostalista/ADD':
      return [
        action.documentos 
      ];
    case '@documentospropostalista/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}