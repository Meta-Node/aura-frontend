import {
  getViewModeBackgroundColorClass,
  getViewModeUpArrowIcon,
  PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING,
} from 'constants/index';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import { useSubjectVerifications } from 'hooks/useSubjectVerifications';
import useViewMode from 'hooks/useViewMode';
import { FC, useMemo } from 'react';
import { EvaluationCategory, PreferredView } from 'types/dashboard';
import { compactFormat } from 'utils/number';
import { calculateRemainingScoreToNextLevel } from 'utils/score';

const LevelProgress: FC<{
  category: EvaluationCategory;
  subjectId: string;
}> = ({ category, subjectId }) => {
  const { currentViewMode } = useViewMode();

  const { auraLevel, auraScore } = useSubjectVerifications(subjectId, category);

  const remainingScore = useMemo(
    () => calculateRemainingScoreToNextLevel(category, auraScore ?? 0),
    [auraScore, category],
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

  const progressPercentage = useMemo(() => {
    if (ratingsToBeDoneCount) {
      return Math.floor(
        ((PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING -
          ratingsToBeDoneCount) *
          100) /
          PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING,
      );
    }
    return 73;
  }, [ratingsToBeDoneCount]);

  return (
    <div className="card relative">
      <div className="absolute top-0 right-0">
        <img src={getViewModeUpArrowIcon(currentViewMode)} alt="" />
      </div>
      <div className="flex flex-row gap-4 w-full items-end">
        {ratingsToBeDoneCount === 0 && (
          <div
            className={`flex flex-col items-center gap-1 rounded-[6px] bg-opacity-50 ${getViewModeBackgroundColorClass(
              currentViewMode,
            )} px-2.5 py-2`}
          >
            <div className="font-bold text-sm">Level</div>
            <div className="font-black text-2xl leading-6 text-center">
              {auraLevel ?? '-'}
            </div>
          </div>
        )}
        <div className="flex flex-col w-full gap-3.5">
          <div className="flex flex-row items-center gap-1">
            {ratingsToBeDoneCount === undefined ? (
              '...'
            ) : (
              <>
                <span className="text-xl font-black">
                  {remainingScore < 0 ? '' : compactFormat(remainingScore)}
                </span>
                <span className="text-lg font-medium">to</span>
                <span
                  className={`text-lg font-semibold ${
                    currentViewMode === PreferredView.PLAYER
                      ? 'text-primary-d1'
                      : currentViewMode === PreferredView.TRAINER
                      ? 'text-pl2'
                      : currentViewMode ===
                        PreferredView.MANAGER_EVALUATING_TRAINER
                      ? 'text-blue'
                      : 'text-gray100'
                  }`}
                >
                  Level {(auraLevel ?? 0) + 1}
                </span>
              </>
            )}
          </div>
          <div className="w-full relative bg-gray30 dark:bg-button-primary mb-3 rounded-full h-4">
            <small className="absolute top-full mt-1">
              score:{' '}
              <span className="font-semibold">
                {compactFormat(auraScore ?? 0)}
              </span>
            </small>
            <div
              className={`absolute ${getViewModeBackgroundColorClass(
                currentViewMode,
              )} rounded-full h-full`}
              style={{ width: progressPercentage + '%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelProgress;
