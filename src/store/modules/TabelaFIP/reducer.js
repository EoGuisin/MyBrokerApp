const INITIAL_STATE = []

export default function tabelaFIP(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@tabelafip/ADD':
      return [ action.tabelafip ];
    case '@tabelafip/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}