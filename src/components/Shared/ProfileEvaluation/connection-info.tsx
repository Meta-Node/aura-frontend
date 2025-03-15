import { Verifications } from '@/api/auranode.service';
import {
  INBOUND_EVIDENCE_VIEW_MODES,
  viewModeToViewAs,
  viewModeToSubjectViewMode,
  getBgClassNameOfAuraRatingObject,
  getTextClassNameOfAuraRatingObject,
} from '@/constants';
import { ratingToText } from '@/constants/chart';
import { useMyEvaluationsContext } from '@/contexts/MyEvaluationsContext';
import { getAuraVerification } from '@/hooks/useParseBrightIdVerificationData';
import { useSubjectName } from '@/hooks/useSubjectName';
import { useImpactPercentage } from '@/hooks/useSubjectVerifications';
import useViewMode from '@/hooks/useViewMode';
import { selectAuthData } from '@/store/profile/selectors';
import { EvidenceViewMode } from '@/types/dashboard';
import { connectionLevelIcons } from '@/utils/connection';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Tooltip from '../Tooltip';

const ConnectionInfo = ({
  subjectId,
  evidenceViewMode,
  connection,
}: {
  subjectId: string;
  connection?: { verifications: Verifications };
  evidenceViewMode: EvidenceViewMode;
}) => {
  const { currentViewMode, currentEvaluationCategory } = useViewMode();
  const evaluationCategory = useMemo(
    () =>
      INBOUND_EVIDENCE_VIEW_MODES.includes(evidenceViewMode)
        ? currentEvaluationCategory
        : viewModeToViewAs[viewModeToSubjectViewMode[currentViewMode]],
    [currentEvaluationCategory, currentViewMode, evidenceViewMode],
  );
  const {
    myRatingToSubject: rating,
    loading,
    myConnectionToSubject: inboundConnectionInfo,
  } = useMyEvaluationsContext({
    subjectId,
    evaluationCategory,
  });

  const verification = useMemo(
    () => getAuraVerification(connection?.verifications, evaluationCategory),
    [evaluationCategory, connection],
  );

  const auraImpacts = verification?.impacts;

  const authData = useSelector(selectAuthData);
  const impactPercentage = useImpactPercentage(
    auraImpacts ?? [],
    authData?.brightId,
  );

  const name = useSubjectName(subjectId);

  const bgColor = useMemo(() => {
    if (rating && Number(rating?.rating) !== 0) {
      return getBgClassNameOfAuraRatingObject(rating);
    }
    if (inboundConnectionInfo?.level === 'just met') {
      return 'bg-pl1';
    }
    if (
      inboundConnectionInfo?.level === 'recovery' ||
      inboundConnectionInfo?.level === 'already known'
    ) {
      return 'bg-pl4';
    }
    if (
      inboundConnectionInfo?.level === 'suspicious' ||
      inboundConnectionInfo?.level === 'reported'
    ) {
      return 'bg-nl4';
    }
    return '';
  }, [inboundConnectionInfo?.level, rating]);
  return (
    <div className="z-10" content={``}>
      <div className={`flex flex-col gap-0.5 ${bgColor} rounded-md py-1.5`}>
        {loading ? (
          '...'
        ) : (
          <>
            <div className="flex items-center justify-center gap-0.5">
              {inboundConnectionInfo &&
                connectionLevelIcons[inboundConnectionInfo.level] && (
                  <Tooltip
                    content={`You connected with "${inboundConnectionInfo?.level}" to ${name}`}
                    position="right"
                    tooltipClassName="!whitespace-normal !w-40"
                  >
                    <img
                      src={`/assets/images/Shared/${
                        connectionLevelIcons[inboundConnectionInfo.level]
                      }.svg`}
                      className="h-[18px] w-[18px]"
                      alt=""
                    />
                  </Tooltip>
                )}
              {!!rating && Number(rating?.rating) !== 0 && (
                <Tooltip
                  position="right"
                  content={`You evaluated ${name} ${
                    Number(rating.rating) > 0
                      ? `+${rating.rating}`
                      : rating.rating
                  } (${ratingToText[rating.rating]})`}
                >
                  <p
                    className={`text-sm font-bold ${getTextClassNameOfAuraRatingObject(
                      rating,
                    )}`}
                  >
                    {Number(rating.rating) < 0 ? '-' : '+'}
                    {Math.abs(Number(rating.rating))}
                  </p>
                </Tooltip>
              )}
            </div>
            {!!rating && Number(rating?.rating) !== 0 && (
              <Tooltip
                position="right"
                content={`Your evaluation impact on ${name} is ${
                  impactPercentage !== null ? `${impactPercentage}%` : '-'
                }`}
              >
                <p
                  className={`impact-percentage ${getTextClassNameOfAuraRatingObject(
                    rating,
                  )} w-full text-center text-[11px] font-bold`}
                >
                  {impactPercentage !== null ? `${impactPercentage}%` : '-'}
                </p>
              </Tooltip>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionInfo;
