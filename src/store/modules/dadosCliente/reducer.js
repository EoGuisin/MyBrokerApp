const INITIAL_STATE = []

export default function cliente(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@cliente/ADD_CPF_DATA_NOME_EMAIL':
      return [
        action.registroexiste,
        action.cpf_cnpj,
        action.data_nasc, 
        action.nome, 
        action.email, 
        action.estadocivil, 
        action.regimedebens,
        action.rg,
        action.orgaoemissor,
        action.ufrg,
        action.ocupacao,
        action.assinaturaconjuge
      ];
    case '@cliente/INITIAL_STATE':
      return INITIAL_STATE;
    default:
      return state;
  }
}