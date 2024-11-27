import { EvaluationCategory } from 'types/dashboard';

import { userLevelPoints } from '../constants/levels';

export const calculateUserScorePercentage = (
  view: EvaluationCategory,
  score: number,
) => {
  const selectedCategoryLevel = userLevelPoints[view];

  const highestLevelStart = selectedCategoryLevel.find((item) => item > score);

  if (!highestLevelStart) return 100;

  if (score >= 0) {
    const width = Math.min(
      (Math.log(score) / Math.log(highestLevelStart * 100)) * 100,
      100,
    );

    return width;
  }

  return -1;
};
