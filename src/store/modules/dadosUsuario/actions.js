export function addToToken(token) {
  return {
    type: '@token/ADD',
    token: token,
  }
}

export function cleanToToken() {
  return {
    type: '@token/INITIAL_STATE'
  }
}