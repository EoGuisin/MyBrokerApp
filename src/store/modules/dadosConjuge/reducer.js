const INITIAL_STATE = []

export default function conjuge(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@conjuge/ADD':
      return [
        action.registroexiste,
        action.cpf_cnpj,
        action.data_nasc, 
        action.nome, 
        action.email,
        action.rg,
        action.orgaoemissor,
        action.ufrg,
        action.ocupacao
      ];
    case '@conjuge/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}