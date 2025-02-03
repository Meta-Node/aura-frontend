import { useOutboundEvaluationsContext } from 'contexts/SubjectOutboundEvaluationsContext';
import { useMemo } from 'react';

import { useSubjectVerifications } from '@/hooks/useSubjectVerifications';

import {
  viewModeSubjectString,
  viewModeToSubjectViewMode,
  viewModeToViewAs,
} from '../../../constants';
import { CredibilityDetailsProps } from '../../../types';
import { PreferredView } from '../../../types/dashboard';
import { ActivityChart } from './ActivityChart';

const ActivitiesCard = ({
  subjectId,
  onLastEvaluationClick,
  viewMode,
}: {
  subjectId: string;
  onLastEvaluationClick: (
    credibilityDetailsProps: CredibilityDetailsProps,
  ) => void;
  viewMode: PreferredView;
}) => {
  const { ratings: outboundRatings } = useOutboundEvaluationsContext({
    subjectId,
    evaluationCategory: viewModeToViewAs[viewModeToSubjectViewMode[viewMode]],
  });
  const outboundActiveRatings = useMemo(
    () => outboundRatings?.filter((r) => Number(r.rating)),
    [outboundRatings],
  );

  const { auraScore, auraImpacts } = useSubjectVerifications(
    subjectId,
    viewModeToViewAs[viewMode],
  );

  return (
    <>
      <div className=" mb-4 font-semibold text-xl">
        {viewModeSubjectString[viewMode]} Activity
      </div>
      <div>
        <div className="flex flex-col gap-1 leading-5 mb-3">
          <div className="flex justify-between">
            <div className="font-medium">Total evaluations:</div>
            <div>
              <span className="font-medium">
                {outboundActiveRatings?.length ?? '...'}{' '}
              </span>
              <span>
                (
                {outboundRatings?.filter((r) => Number(r.rating) > 0).length ??
                  '...'}
                {' Pos / '}
                {outboundRatings?.filter((r) => Number(r.rating) < 0).length ??
                  '...'}{' '}
                Neg)
              </span>
            </div>
          </div>
        </div>
        <ActivityChart
          key={viewMode}
          auraScore={auraScore ?? 0}
          auraImpacts={auraImpacts}
        />
      </div>
    </>
  );
};

export default ActivitiesCard;
