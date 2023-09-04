const INITIAL_STATE = []

export default function documentosOriginais(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@documentosoriginais/ADD':
      return [
        action.documentos 
      ];
    case '@documentosoriginais/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}