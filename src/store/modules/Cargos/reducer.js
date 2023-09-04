const INITIAL_STATE = []

export default function cargos(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@cargos/ADD':
      return [ action.cargos ];
    case '@cargos/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}