export function addToLead(Lead) {
  return {
    type: '@lead/ADD_LEAD',
    lead: Lead
  }
}

export function cleanToLead() {
  return {
    type: '@lead/INITIAL_STATE'
  }
}