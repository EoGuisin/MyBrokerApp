const INITIAL_STATE = []

export default function telefones(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@telefones/ADD':
      return [ action.registroexiste, action.telefones ];
    case '@telefones/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}