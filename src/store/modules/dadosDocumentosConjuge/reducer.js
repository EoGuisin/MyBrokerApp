const INITIAL_STATE = []

export default function documentosconjuge(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@documentosconjuge/ADD':
      return [ action.registrorgexiste, action.documentosconjuge ];
    case '@documentosconjuge/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}
