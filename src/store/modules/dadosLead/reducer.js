const INITIAL_STATE = []

export default function lead(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@lead/ADD_LEAD':
      return [
        action.lead,
      ];
    case '@lead/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}