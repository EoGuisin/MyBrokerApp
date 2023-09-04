const INITIAL_STATE = []

export default function documentosOriginaisLista(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@documentosoriginaislista/ADD':
      return [
        action.documentos 
      ];
    case '@documentosoriginaislista/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}