import {
  getViewModeBackgroundColorClass,
  getViewModeUpArrowIcon,
  PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING,
} from 'constants/index';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import { useSubjectVerifications } from 'hooks/useSubjectVerifications';
import useViewMode from 'hooks/useViewMode';
import { useMemo } from 'react';

import { PreferredView } from '../../../types/dashboard';

const ProfileInfoPerformance = ({
  subjectId,
  isPerformance,
  color = 'pastel-green',
}: {
  subjectId: string;
  isPerformance: boolean;
  color: string;
}) => {
  const { currentViewMode, currentRoleEvaluatorEvaluationCategory } =
    useViewMode();
  const { auraLevel } = useSubjectVerifications(
    subjectId,
    currentRoleEvaluatorEvaluationCategory,
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
          <div className="flex flex-row items-end gap-1">
            {ratingsToBeDoneCount === undefined ? (
              '...'
            ) : ratingsToBeDoneCount > 0 ? (
              <>
                <span className="text-2xl font-black">
                  {ratingsToBeDoneCount}
                </span>
                <span className="text-lg font-medium">
                  more evaluation{ratingsToBeDoneCount > 1 ? `s` : ''} to unlock
                  Level-up
                </span>
              </>
            ) : (
              <>
                <span className="text-xl font-black">25,234</span>
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
                  Level 3
                </span>
              </>
            )}
          </div>
          <div className="w-full relative bg-gray30 rounded-full h-4">
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

export default ProfileInfoPerformance;
