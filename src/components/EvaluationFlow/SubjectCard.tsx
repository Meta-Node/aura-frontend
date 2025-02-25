import BrightIdProfilePicture from 'components/BrightIdProfilePicture';
import { ConnectionAndEvaluationStatus } from 'components/ConnectionAndEvaluationStatus';
import { getViewModeSubjectBorderColorClass } from 'constants/index';
import ReactECharts from 'echarts-for-react';
import { useSubjectName } from 'hooks/useSubjectName';
import useViewMode from 'hooks/useViewMode';
import { Link } from 'react-router';
import { compactFormat } from 'utils/number';
import { calculateUserScorePercentage } from 'utils/score';

import {
  useImpactEChartOption,
  useSubjectVerifications,
} from '../../hooks/useSubjectVerifications';
import { HorizontalProgressBar } from '../Shared/HorizontalProgressBar';
import Tooltip from '../Shared/Tooltip';
import { Card } from '../ui/card';

export const SubjectCard = ({
  subjectId,
  index,
}: {
  subjectId: string;
  index?: string | number;
}) => {
  const name = useSubjectName(subjectId);

  const { currentViewMode, currentEvaluationCategory } = useViewMode();

  const { auraLevel, auraScore, auraImpacts } = useSubjectVerifications(
    subjectId,
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
      data-testid={`subject-card-${subjectId}`}
    >
      <Card
        className={`b-4 flex w-full !flex-row items-center !justify-between gap-1 p-4`}
      >
        <div
          className="evaluation-left flex flex-col gap-2"
          data-testid={`user-item-${index}`}
        >
          <div className="evaluation-left__top flex gap-3">
            <div className="evaluation__profile">
              <BrightIdProfilePicture
                className={`h-12 w-12 rounded-full border-2 ${getViewModeSubjectBorderColorClass(
                  currentViewMode,
                )} bg-cover bg-center`}
                subjectId={subjectId}
              />
            </div>
            <div className="evaluation__info flex flex-col">
              <p
                className="font-medium text-black dark:text-white"
                data-testid={`user-item-${index}-name`}
              >
                {name}
              </p>

              <div className="text-gray10 dark:text-gray70">
                Level:{' '}
                <span className="font-medium text-black dark:text-white">
                  {auraLevel}
                </span>
                <span className="mt-2 text-sm">
                  <p className="text-gray10 dark:text-gray70">
                    Score:{' '}
                    <span className="font-medium text-black dark:text-white">
                      {auraScore ? compactFormat(auraScore) : '-'}
                    </span>
                  </p>
                </span>
              </div>
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
        <div className="evaluation-right flex flex-col items-end gap-2">
          <Tooltip
            tooltipClassName="text-sm translate-x-1/2"
            position="top-left"
            content={'Top evaluations of ' + name}
            className="evaluation-right__bottom"
          >
            <ReactECharts
              opts={{
                height: 48,
                width: 'auto',
              }}
              style={{ height: '48px', width: '100%' }}
              option={impactChartSmallOption}
            />
          </Tooltip>
        </div>
      </Card>
    </Link>
  );
};
