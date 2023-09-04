const INITIAL_STATE = []

export default function dadosMeiosDeContato(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@meiosdecontato/ADD_MEIOS_DE_CONTATO':
      return [ action.meios ];
    case '@meiosdecontato/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}