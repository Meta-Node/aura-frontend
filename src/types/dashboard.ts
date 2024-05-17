export enum PreferredView {
  PLAYER,
  TRAINER,
  MANAGER_EVALUATING_TRAINER,
  MANAGER_EVALUATING_MANAGER,
}

export enum ProfileTab {
  OVERVIEW,
  ACTIVITY,
  EVALUATIONS,
  ACTIVITY_ON_MANAGERS,
}

export enum EvidenceViewMode {
  INBOUND_EVALUATION,
  OUTBOUND_ACTIVITY,
  OUTBOUND_ACTIVITY_ON_MANAGERS,
}

export enum ProfileViewAs {
  SUBJECT = 'subject',
  PLAYER = 'player',
  TRAINER = 'trainer',
  MANAGER = 'manager',
}

export enum EvidenceType {
  EVALUATED,
  CONNECTED,
}
