import BrightIdProfilePicture from 'components/BrightIdProfilePicture';
import { HorizontalProgressBar } from 'components/Shared/HorizontalProgressBar';
import { getViewModeSubjectBorderColorClass } from 'constants/index';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import useParseBrightIdVerificationData from 'hooks/useParseBrightIdVerificationData';
import { useSubjectName } from 'hooks/useSubjectName';
import useViewMode from 'hooks/useViewMode';
import { FC } from 'react';
import { compactFormat } from 'utils/number';
import { calculateUserScorePercentage } from 'utils/score';

const ProfileHeaderCard: FC<{
  subjectId: string;
}> = ({ subjectId }) => {
  const name = useSubjectName(subjectId);
  const { currentViewMode, currentEvaluationCategory } = useViewMode();

  const { myConnectionToSubject: inboundConnectionInfo } =
    useMyEvaluationsContext({ subjectId });

  const { auraLevel, auraScore } = useParseBrightIdVerificationData(
    inboundConnectionInfo?.verifications,
    currentEvaluationCategory,
  );

  const progress = calculateUserScorePercentage(
    currentEvaluationCategory,
    auraScore ?? 0,
  );

  return (
    <div className="relative card">
      <div className="flex justify-center flex-col gap-2">
        <div className="evaluation-left__top flex flex-1 gap-3">
          <div className="evaluation__profile">
            <BrightIdProfilePicture
              className={`rounded-full w-16 h-16 border-2 ${getViewModeSubjectBorderColorClass(
                currentViewMode,
              )} bg-center bg-cover`}
              subjectId={subjectId}
            />
          </div>
          <div className="evaluation__info flex flex-col">
            <p className="text-black dark:text-white font-medium">{name}</p>

            <p className="text-gray10 dark:text-gray70">
              Level:{' '}
              <span className="font-medium text-black dark:text-white">
                {auraLevel}
              </span>
              <span className="text-sm mt-2">
                <p className="text-gray10 dark:text-gray70">
                  Score:{' '}
                  <span className="font-medium text-black dark:text-white">
                    {auraScore ? compactFormat(auraScore) : '-'}
                  </span>
                </p>
              </span>
            </p>
            {progress < 0 ? (
              '😈'
            ) : (
              <HorizontalProgressBar className="w-full" percentage={progress} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;
