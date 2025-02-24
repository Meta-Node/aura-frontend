import { PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING } from 'constants/index';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import { useSubjectVerifications } from 'hooks/useSubjectVerifications';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthData } from 'store/profile/selectors';
import { EvaluationCategory } from 'types/dashboard';

import { userLevelPoints } from '../constants/levels';
import { AuraRating } from '@/types';
import { AuraImpactRaw } from '@/api/auranode.service';

export const calculateRemainingScoreToNextLevel = (
  view: EvaluationCategory,
  score: number,
) => {
  const selectedCategoryLevel = userLevelPoints[view];

  const highestLevelStart =
    selectedCategoryLevel.find((item) => item > score) ??
    selectedCategoryLevel.at(-1)!;

  return highestLevelStart - score;
};

export const calculateUserScorePercentage = (
  view: EvaluationCategory,
  score: number,
) => {
  const selectedCategoryLevel = userLevelPoints[view];

  const highestLevelStart =
    // selectedCategoryLevel.find((item) => item > score) ??
    selectedCategoryLevel.at(-1);

  if (highestLevelStart === undefined) return 100;

  if (score === 0) return 0;

  if (score > 0) {
    const width = Math.min(
      (Math.log(score) / Math.log(highestLevelStart * 100)) * 100,
      100,
    );

    return width;
  }

  return -1;
};

export const useLevelupProgress = ({
  evaluationCategory,
}: {
  evaluationCategory: EvaluationCategory;
}) => {
  const authData = useSelector(selectAuthData);

  const subjectId = authData?.brightId;

  const playerEvaluation = useSubjectVerifications(
    subjectId,
    EvaluationCategory.PLAYER,
  );

  const trainerEvaluation = useSubjectVerifications(
    subjectId,
    EvaluationCategory.TRAINER,
  );
  const { myRatings } = useMyEvaluationsContext();

  const ratingsToBeDoneCount = useMemo(
    () =>
      myRatings
        ? Math.max(
            PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING -
              myRatings.filter((r) => Number(r.rating)).length,
            0,
          )
        : undefined,
    [myRatings],
  );

  if (evaluationCategory === EvaluationCategory.PLAYER) {
    return {
      isUnlocked: (ratingsToBeDoneCount ?? 0) <= 0,
      reason: `${ratingsToBeDoneCount} more evaluation${
        (ratingsToBeDoneCount ?? 0) > 1 ? `s` : ''
      } to unlock Level Up`,
      percent:
        ((myRatings?.length ?? 0) /
          PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING) *
        100,
    };
  }

  if (evaluationCategory === EvaluationCategory.TRAINER) {
    return {
      isUnlocked:
        !!playerEvaluation.auraLevel && playerEvaluation.auraLevel >= 2,
      reason: 'Reach Player level 2 to unlock',
      percent: playerEvaluation.auraLevel ?? (0 / 2) * 100,
    };
  }

  if (evaluationCategory === EvaluationCategory.MANAGER) {
    return {
      isUnlocked:
        !!trainerEvaluation.auraLevel && trainerEvaluation.auraLevel >= 1,
      reason: 'Reach Trainer level 1 to unlock',
      percent: playerEvaluation.auraLevel ?? (0 / 1) * 100,
    };
  }

  return {
    isUnlocked: false,
    reason: '',
    percent: 0,
  };
};

export const calculateSubjectScore = (
  category: EvaluationCategory,
  ratings: AuraImpactRaw[],
) => {
  const selectedCategoryLevel = userLevelPoints[category];
  const score = ratings.reduce((prev, item) => (item.score ?? 0) + prev, 0);

  const currentLevel = selectedCategoryLevel.findIndex((item) => item > score);

  return currentLevel;

  // switch (category) {
  //   case EvaluationCategory.SUBJECT:
  //     return currentLevel;

  //   case EvaluationCategory.PLAYER:
  //     return currentLevel;

  //   case EvaluationCategory.TRAINER:

  //     return currentLevel;

  //   case EvaluationCategory.MANAGER:
  //     return currentLevel;
  // }

  // return -1;
};
