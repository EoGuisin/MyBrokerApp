const INITIAL_STATE = [
  {
    "colorheader": '#222E50',
    "colorheaderfonte": '#4FB0C6',
    "colorbutton": '#222E50',
    "colorfonte": '#222E50',
    "fonte": 'Aktifo A'
  }
]

export default function configApp(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@cores/ADD_CORES_FONTES':
      return [
        action.colorheader,
        action.colorheaderfonte,
        action.colorbutton,
        action.colorfonte,
        action.fonte,
      ];
    case '@cores/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}