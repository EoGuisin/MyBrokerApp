const INITIAL_STATE = []

export default function corretagem(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@corretagem/ADD':
      return [ action.dadoscorretagem ];
    case '@corretagem/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}