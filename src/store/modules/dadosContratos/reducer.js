const INITIAL_STATE = []

export default function contrato(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@contratos/ADD':
      return [ action.contrato, action.lista ];
    case '@contratos/INITIAL_STATE':
      return INITIAL_STATE;  
    default:
      return state;
  }
}