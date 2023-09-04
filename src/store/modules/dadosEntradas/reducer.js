const INITIAL_STATE = []

export default function entradas(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@entradas/ADD':
      return [ action.entradas ];
    case '@entradas/INITIAL_STATE':
      return INITIAL_STATE
    default:
      return state;
  }
}