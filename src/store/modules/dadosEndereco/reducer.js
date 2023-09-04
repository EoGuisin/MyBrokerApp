const INITIAL_STATE = []

export default function endereco(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@endereco/ADD':
      return [ action.registroexiste, action.endereco ];
    case '@endereco/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}