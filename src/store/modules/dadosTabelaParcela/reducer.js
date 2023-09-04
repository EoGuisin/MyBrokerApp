const INITIAL_STATE = []

export default function tabelaparcelas(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@tabelaparcelas/ADD':
      return [ action.tabela ];
    case '@tabelaparcelas/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}