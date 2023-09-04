const INITIAL_STATE = {
    "cores": {
      "background": '#2a698e',
    },
  }

export default function styleAPPLogon(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@stylelogon/ADD_STYLE':
      return action.style;
    case '@stylelogon/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}
