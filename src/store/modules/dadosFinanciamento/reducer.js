const INITIAL_STATE = []

export default function financiamento(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@financiamento/ADD':
      return [ action.dadosfinanciamento ];
    case '@financiamento/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}