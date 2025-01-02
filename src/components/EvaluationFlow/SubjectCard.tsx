import BrightIdProfilePicture from 'components/BrightIdProfilePicture';
import { ConnectionAndEvaluationStatus } from 'components/ConnectionAndEvaluationStatus';
import { getViewModeSubjectBorderColorClass } from 'constants/index';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import ReactECharts from 'echarts-for-react';
import useParseBrightIdVerificationData from 'hooks/useParseBrightIdVerificationData';
import { useSubjectName } from 'hooks/useSubjectName';
import useViewMode from 'hooks/useViewMode';
import { Link } from 'react-router-dom';
import { compactFormat } from 'utils/number';
import { calculateUserScorePercentage } from 'utils/score';

import { useImpactEChartOption } from '../../hooks/useSubjectVerifications';
import { HorizontalProgressBar } from '../Shared/HorizontalProgressBar';

export const SubjectCard = ({
  subjectId,
  index,
}: {
  subjectId: string;
  index?: string | number;
}) => {
  const name = useSubjectName(subjectId);

  const { myConnectionToSubject: inboundConnectionInfo } =
    useMyEvaluationsContext({ subjectId });
  const { currentViewMode, currentEvaluationCategory } = useViewMode();

  const { auraLevel, auraScore, auraImpacts } =
    useParseBrightIdVerificationData(
      inboundConnectionInfo?.verifications,
      currentEvaluationCategory,
    );
  const { impactChartSmallOption } = useImpactEChartOption(auraImpacts);

  const progress = calculateUserScorePercentage(
    currentEvaluationCategory,
    auraScore ?? 0,
  );

  return (
    <Link
      to={'/subject/' + subjectId}
      className={`card card--evaluation b-4 flex !flex-row gap-1 items-center !justify-between w-full`}
      data-testid={`subject-card-${subjectId}`}
    >
      <div
        className="evaluation-left flex flex-col gap-2"
        data-testid={`user-item-${index}`}
      >
        <div className="evaluation-left__top flex gap-3">
          <div className="evaluation__profile">
            <BrightIdProfilePicture
              className={`rounded-full w-12 h-12 border-2 ${getViewModeSubjectBorderColorClass(
                currentViewMode,
              )} bg-center bg-cover`}
              subjectId={subjectId}
            />
          </div>
          <div className="evaluation__info flex flex-col">
            <p
              className="text-black dark:text-white font-medium"
              data-testid={`user-item-${index}-name`}
            >
              {name}
            </p>

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
              <HorizontalProgressBar className="w-36" percentage={progress} />
            )}
          </div>
        </div>

        <div className="mt-auto">
          <ConnectionAndEvaluationStatus subjectId={subjectId} />
        </div>
      </div>
      <div className="evaluation-right flex flex-col gap-2 items-end">
        <div className="evaluation-right__bottom">
          <ReactECharts
            style={{ height: '48px', width: '100%' }}
            option={impactChartSmallOption}
          />
        </div>
        {/* <div className="-mt-1">
          <EvaluationStatus subjectId={subjectId} />
        </div> */}
      </div>
    </Link>
  );
};
