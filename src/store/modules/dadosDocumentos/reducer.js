const INITIAL_STATE = []

export default function documentos(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@documentos/ADD':
      return [ 
        action.registrosexiste, 
        action.documentos 
      ];
    case '@documentos/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}