const INITIAL_STATE = []

export default function dadosEmpreendimento(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@empreendimento/ADD_EMPRESA_CENTRODECUSTO':
      return [ action.empresa, action.centrodecusto];
    case '@empreendimento/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}