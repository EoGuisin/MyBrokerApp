const INITIAL_STATE = []

export default function modelo(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@modelo/ADD':
      return [ action.modelodevendas ];
    case '@modelo/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}