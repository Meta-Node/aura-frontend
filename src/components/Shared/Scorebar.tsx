import { userLevelPoints } from 'constants/levels';
import { useMemo } from 'react';
import { EvaluationCategory } from 'types/dashboard';
import { compactFormat } from 'utils/number';
import { calculateUserScorePercentage } from 'utils/score';

export default function Scorebar({
  score,
  category,
}: {
  score: number;
  category: EvaluationCategory;
}) {
  const colorStatuses = [
    'bg-green30 dark:bg-pastel-green',
    'bg-green10',
    'bg-green20',
    'bg-green',
  ];
  const selectedCategoryLevel = userLevelPoints[category];

  const progress = useMemo(
    () => calculateUserScorePercentage(category, score),
    [score, category],
  );

  const levelProgresses = useMemo(() => {
    return selectedCategoryLevel
      .slice(1)
      .map((level) => calculateUserScorePercentage(category, level));
  }, [category, selectedCategoryLevel]);

  const highlightedColorIndex = levelProgresses.findIndex(
    (level) => level > progress,
  );

  const highlightedLevel =
    colorStatuses[highlightedColorIndex !== -1 ? highlightedColorIndex : 3];

  return (
    <div className="dark:bg-gray00 rounded overflow-hidden h-5 w-full min-w-40 relative">
      <div
        className={`h-full left-0 absolute ${highlightedLevel}`}
        style={{ width: `${progress}%` }}
      ></div>
      {levelProgresses.map((level, key) => (
        <div
          className={`absolute w-px border-r border-dashed border-stone-400 h-full`}
          key={key}
          style={{
            left: `${level}%`,
          }}
        ></div>
      ))}
      <p
        className={`text-sm text-stone-200 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2`}
      >
        {compactFormat(score)}
      </p>
      <p
        className={`text-xs text-stone-300 absolute top-1/2 -translate-y-1/2 left-2`}
      >
        Score
      </p>
    </div>
  );
}
