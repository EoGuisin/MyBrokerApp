const INITIAL_STATE = []

export default function lotes(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@lotes/ADD':
      return [ action.lotes ];
    case '@lotes/INITIAL_STATE':
      return INITIAL_STATE;  
    default:
      return state;
  }
}