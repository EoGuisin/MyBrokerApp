const INITIAL_STATE = []

export default function empLog(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@emp/ADD':
      return [
        action.empresa
      ];
    case '@emp/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}