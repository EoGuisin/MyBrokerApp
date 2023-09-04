const INITIAL_STATE = []

export default function dadosUsuario(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@token/ADD':
      return [ action.token ];
    case '@token/INITIAL_STATE':
      return INITIAL_STATE;  
    default:
      return state;
  }
}