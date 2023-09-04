const INITIAL_STATE = []

export default function telaAtual(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@tela_atual':
      return [ action.tela ];
    case '@tela_atual/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}