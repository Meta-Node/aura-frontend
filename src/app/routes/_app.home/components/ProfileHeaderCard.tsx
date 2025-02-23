import BrightIdProfilePicture from 'components/BrightIdProfilePicture';
import { HorizontalProgressBar } from 'components/Shared/HorizontalProgressBar';
import { getViewModeSubjectBorderColorClass } from 'constants/index';
import { useSubjectName } from 'hooks/useSubjectName';
import { useSubjectVerifications } from 'hooks/useSubjectVerifications';
import useViewMode from 'hooks/useViewMode';
import { FC } from 'react';
import { compactFormat } from 'utils/number';
import { calculateUserScorePercentage } from 'utils/score';

import { Card } from '@/components/ui/card';

const ProfileHeaderCard: FC<{
  subjectId: string;
}> = ({ subjectId }) => {
  const name = useSubjectName(subjectId);
  const { currentViewMode, currentRoleEvaluatorEvaluationCategory } =
    useViewMode();

  const { auraLevel, auraScore, loading } = useSubjectVerifications(
    subjectId,
    currentRoleEvaluatorEvaluationCategory,
  );


  const progress = calculateUserScorePercentage(
    currentRoleEvaluatorEvaluationCategory,
    auraScore ?? 0,
  );

  return (
    <Card className="relative p-4">
      <div className="flex justify-center flex-col gap-2">
        <div className="flex flex-1 gap-3">
          <BrightIdProfilePicture
            className={`rounded-full w-16 h-16 border-2 ${getViewModeSubjectBorderColorClass(
              currentViewMode,
            )} bg-center bg-cover`}
            subjectId={subjectId}
          />
          <div className="evaluation__info flex flex-1 flex-col">
            <p data-testid="profile-name" className="text-black dark:text-white font-medium">{name}</p>

            <div className="text-gray10 dark:text-gray70">
              Level:{' '}
              <span data-testid="profile-level" className="font-medium text-black dark:text-white">
                {auraLevel}
              </span>
              <span className="text-sm mt-2">
                <p className="text-gray10 dark:text-gray70">
                  Score:{' '}
                  <span data-testid="profile-score" className="font-medium text-black dark:text-white">
                    {auraScore ? compactFormat(auraScore) : '-'}
                  </span>
                </p>
              </span>
            </div>
            {progress < 0 ? (
              '😈'
            ) : (
              <HorizontalProgressBar data-testid="profile-progressbar" className="w-full" percentage={progress} />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeaderCard;
