const INITIAL_STATE = []

export default function intermediacao(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@intermediacao/ADD':
      return [ action.dadosintermediacao ];
    case '@intermediacao/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}