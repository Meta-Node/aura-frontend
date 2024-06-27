import { AuraRating, ConnectionLevel } from 'types';
import { EvaluationCategory, PreferredView } from 'types/dashboard';

// eslint-disable-next-line no-restricted-globals
export const LOCATION_ORIGIN = location.origin;
export const CONNECTION_SEARCH_SEED = 5;

export const TOAST_SUCCESS = 'success';
export const TOAST_ERROR = 'danger';

// eslint-disable-next-line no-unused-vars
export const connectionLevelMap: { [c in ConnectionLevel]: number } = {
  reported: 0,
  suspicious: 1,
  'just met': 2,
  'already known': 3,
  recovery: 4,
};

export function getTextClassNameOfAuraRatingNumber(
  rating: number | null | undefined,
) {
  if (!rating) return '';
  return Math.abs(rating) > 2 ? 'text-white' : 'text-black';
}

export function getTextClassNameOfAuraRatingObject(
  auraRating: AuraRating | null | undefined,
) {
  if (!auraRating) return auraRating;
  return getTextClassNameOfAuraRatingNumber(Number(auraRating.rating));
}

export function getBgClassNameOfAuraRatingNumber(
  rating: number | null | undefined,
) {
  if (!rating) return '';
  return (rating > 0 ? 'bg-pl' : 'bg-nl') + Math.ceil(Math.abs(rating));
}

export function getBgClassNameOfAuraRatingObject(
  auraRating: AuraRating | null | undefined,
) {
  if (!auraRating) return auraRating;
  return getBgClassNameOfAuraRatingNumber(Number(auraRating.rating));
}

export function getConfidenceValueOfAuraRatingNumber(
  rating: number | null | undefined,
) {
  if (rating === null || rating === undefined) return rating;
  const score = Math.abs(rating);
  if (score >= 4) return 'Very High';
  if (score >= 3) return 'High';
  if (score >= 2) return 'Medium';
  if (score >= 1) return 'Low';
  return 'Very Low';
}

export function getConfidenceValueOfAuraRatingObject(
  auraRating: AuraRating | null | undefined,
) {
  if (!auraRating) return auraRating;
  return getConfidenceValueOfAuraRatingNumber(Number(auraRating.rating));
}

export const brightIdBaseURL = 'http://184.72.224.75';

export const RATING_INBOUND_STAT = 'ri';
export const RATING_OUTBOUND_STAT = 'ro';
export const ENERGY_INBOUND_STAT = 'ei';
export const ENERGY_OUTBOUND_STAT = 'eo';

export const MUTUAL_CONNECTIONS_TEST_NAMESPACE = 'mutual-connections-';

export const PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING = 3;
export const SUBJECTS_EVALUATION_ONBOARDING_GUIDE_STEP_COUNT = 4;

//TODO: remove the functions and just use the mappings, and make sure tailwindcss classes still work properly
export const viewModeSubjectBackgroundColorClass: {
  [key in PreferredView]: string;
} = {
  [PreferredView.PLAYER]: 'bg-pastel-orange',
  [PreferredView.TRAINER]: 'bg-natural-black',
  [PreferredView.MANAGER_EVALUATING_TRAINER]: 'bg-pastel-green',
  [PreferredView.MANAGER_EVALUATING_MANAGER]: 'bg-pastel-blue',
};
export const getViewModeSubjectBorderColorClass = (viewMode: PreferredView) => {
  switch (viewMode) {
    case PreferredView.PLAYER:
      return 'border-pastel-orange';
    case PreferredView.TRAINER:
      return 'border-pastel-purple';
    case PreferredView.MANAGER_EVALUATING_TRAINER:
      return 'border-pastel-green';
    case PreferredView.MANAGER_EVALUATING_MANAGER:
      return 'border-pastel-blue';
    default:
      return 'border-gray100';
  }
};
export const getViewModeSubjectTextColorClass = (viewMode: PreferredView) => {
  switch (viewMode) {
    case PreferredView.PLAYER:
      return 'text-pastel-orange';
    case PreferredView.TRAINER:
      return 'text-pastel-purple';
    case PreferredView.MANAGER_EVALUATING_TRAINER:
      return 'text-pastel-green';
    case PreferredView.MANAGER_EVALUATING_MANAGER:
      return 'text-pastel-blue';
    default:
      return 'text-gray100';
  }
};
export const getViewModeUpArrowIcon = (viewMode: PreferredView) => {
  switch (viewMode) {
    case PreferredView.PLAYER:
      return '/assets/images/Home/level-up-icon-purple.svg';
    case PreferredView.TRAINER:
      return '/assets/images/Home/level-up-icon-green.svg';
    case PreferredView.MANAGER_EVALUATING_TRAINER:
    case PreferredView.MANAGER_EVALUATING_MANAGER:
      return '/assets/images/Home/level-up-icon-blue.svg';
    default:
      return '/assets/images/Home/level-up-icon-purple.svg';
  }
};
export const getViewModeBackgroundColorClass = (viewMode: PreferredView) => {
  switch (viewMode) {
    case PreferredView.PLAYER:
      return 'bg-natural-black';
    case PreferredView.TRAINER:
      return 'bg-pl2';
    case PreferredView.MANAGER_EVALUATING_TRAINER:
    case PreferredView.MANAGER_EVALUATING_MANAGER:
      return 'bg-blue';
    default:
      return 'bg-gray100';
  }
};
export const getViewModeBorderColorClass = (viewMode: PreferredView) => {
  switch (viewMode) {
    case PreferredView.PLAYER:
      return 'border-natural-black';
    case PreferredView.TRAINER:
      return 'border-pastel-green';
    case PreferredView.MANAGER_EVALUATING_TRAINER:
    case PreferredView.MANAGER_EVALUATING_MANAGER:
      return 'border-pastel-blue';
    default:
      return 'border-gray100';
  }
};
export const getViewModeTextColorClass = (viewMode: PreferredView) => {
  switch (viewMode) {
    case PreferredView.PLAYER:
      return 'text-natural-black';
    case PreferredView.TRAINER:
      return 'text-pastel-green';
    case PreferredView.MANAGER_EVALUATING_TRAINER:
    case PreferredView.MANAGER_EVALUATING_MANAGER:
      return 'text-pastel-blue';
    default:
      return 'text-gray100';
  }
};

export const viewModeToString: {
  [key in PreferredView]: string;
} = {
  // first property is just for avoiding type errors
  [PreferredView.PLAYER]: 'Player',
  [PreferredView.TRAINER]: 'Trainer',
  [PreferredView.MANAGER_EVALUATING_TRAINER]: 'Manager',
  [PreferredView.MANAGER_EVALUATING_MANAGER]: 'Manager',
};

export const viewModeToSubjectViewMode: {
  [key in PreferredView]: PreferredView;
} = {
  // first property is just for avoiding type errors
  [PreferredView.PLAYER]: PreferredView.PLAYER,
  [PreferredView.TRAINER]: PreferredView.PLAYER,
  [PreferredView.MANAGER_EVALUATING_TRAINER]: PreferredView.TRAINER,
  [PreferredView.MANAGER_EVALUATING_MANAGER]:
    PreferredView.MANAGER_EVALUATING_TRAINER,
};

export const viewModeToViewAs: {
  [key in PreferredView]: EvaluationCategory;
} = {
  [PreferredView.PLAYER]: EvaluationCategory.SUBJECT,
  [PreferredView.TRAINER]: EvaluationCategory.PLAYER,
  [PreferredView.MANAGER_EVALUATING_TRAINER]: EvaluationCategory.TRAINER,
  [PreferredView.MANAGER_EVALUATING_MANAGER]: EvaluationCategory.MANAGER,
};
export const viewAsToViewMode: {
  [key in EvaluationCategory]: PreferredView;
} = {
  [EvaluationCategory.SUBJECT]: PreferredView.PLAYER,
  [EvaluationCategory.PLAYER]: PreferredView.TRAINER,
  [EvaluationCategory.TRAINER]: PreferredView.MANAGER_EVALUATING_TRAINER,
  [EvaluationCategory.MANAGER]: PreferredView.MANAGER_EVALUATING_MANAGER,
};

export const subjectViewAsIcon: {
  [key in EvaluationCategory]: string;
} = {
  [EvaluationCategory.SUBJECT]:
    '/assets/images/Dashboard/brightid-icon-white.svg',
  [EvaluationCategory.PLAYER]:
    '/assets/images/Dashboard/account-icon-white.svg',
  [EvaluationCategory.TRAINER]:
    '/assets/images/Dashboard/trainer-icon-white.svg',
  [EvaluationCategory.MANAGER]:
    '/assets/images/Dashboard/manager-icon-white.svg',
};

export const preferredViewIcon: {
  [key in PreferredView]: string;
} = {
  [PreferredView.PLAYER]: '/assets/images/Dashboard/account-icon-white.svg',
  [PreferredView.TRAINER]: '/assets/images/Dashboard/trainer-icon-white.svg',
  [PreferredView.MANAGER_EVALUATING_TRAINER]:
    '/assets/images/Dashboard/manager-icon-white.svg',
  [PreferredView.MANAGER_EVALUATING_MANAGER]:
    '/assets/images/Dashboard/manager-icon-white.svg',
} as const;
