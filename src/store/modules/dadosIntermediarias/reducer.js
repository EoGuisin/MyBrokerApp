const INITIAL_STATE = []

export default function intermediarias(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@intermediarias/ADD':
      return [ action.intermediarias ];
    case '@intermediarias/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}