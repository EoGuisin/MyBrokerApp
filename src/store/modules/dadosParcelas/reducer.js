const INITIAL_STATE = []

export default function parcelas(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@parcelas/ADD':
      return [ action.parcelas ];
    case '@parcelas/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}