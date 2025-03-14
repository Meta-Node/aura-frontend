import EvaluationThumb from 'components/Shared/EvaluationThumb';
import {
  getBgClassNameOfAuraRatingObject,
  getConfidenceValueOfAuraRatingNumber,
  getTextClassNameOfAuraRatingObject,
  getViewModeBorderColorClass,
  getViewModeSubjectBorderColorClass,
  getViewModeSubjectTextColorClass,
  getViewModeTextColorClass,
  INBOUND_EVIDENCE_VIEW_MODES,
  preferredViewIconColored,
  subjectViewAsIconColored,
  viewModeSubjectString,
  viewModeToSubjectViewMode,
  viewModeToViewAs,
} from 'constants/index';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import ReactECharts from 'echarts-for-react';
import {
  useSubjectConnectionInfoFromContext,
  useSubjectEvaluationFromContext,
} from 'hooks/useSubjectEvaluation';
import { useSubjectName } from 'hooks/useSubjectName';
import {
  useImpactEChartOption,
  useImpactPercentage,
  useSubjectVerifications,
} from 'hooks/useSubjectVerifications';
import useViewMode from 'hooks/useViewMode';
import { ArrowDownLeft, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import moment from 'moment';
import { useMemo } from 'react';
import {
  EvaluationCategory,
  EvidenceType,
  EvidenceViewMode,
} from 'types/dashboard';
import { connectionLevelIcons } from 'utils/connection';
import { compactFormat } from 'utils/number';

import { ratingToText } from '@/constants/chart';

import { useSelector } from '../../../store/hooks';
import { selectAuthData } from '../../../store/profile/selectors';
import BrightIdProfilePicture from '../../BrightIdProfilePicture';
import Tooltip from '../Tooltip';
import { AuraNodeBrightIdConnection } from '@/types';
import useParseBrightIdVerificationData, {
  getAuraVerification,
} from '@/hooks/useParseBrightIdVerificationData';
import { useGetBrightIDProfileQuery } from '@/store/api/profile';
import { skipToken } from '@reduxjs/toolkit/query';
import { Verifications } from '@/api/auranode.service';

const ProfileEvaluation = ({
  fromSubjectId,
  toSubjectId,
  onClick,
  evidenceViewMode,
  connection,
}: {
  fromSubjectId: string;
  toSubjectId: string;
  onClick: () => void;
  evidenceViewMode: EvidenceViewMode;
  connection?: AuraNodeBrightIdConnection;
}) => {
  const subjectIdToFetch = useMemo(
    () =>
      evidenceViewMode === EvidenceViewMode.INBOUND_EVALUATION
        ? fromSubjectId
        : toSubjectId,
    [evidenceViewMode, fromSubjectId, toSubjectId],
  );

  const profileFetch = useGetBrightIDProfileQuery(
    connection ? skipToken : subjectIdToFetch,
  );

  const { currentViewMode, currentEvaluationCategory } = useViewMode();
  const { loading, ratingNumber } = useSubjectEvaluationFromContext({
    fromSubjectId,
    toSubjectId,
    evaluationCategory:
      INBOUND_EVIDENCE_VIEW_MODES.includes(evidenceViewMode) ||
      evidenceViewMode === EvidenceViewMode.OUTBOUND_ACTIVITY_ON_MANAGERS
        ? currentEvaluationCategory
        : viewModeToViewAs[viewModeToSubjectViewMode[currentViewMode]],
  });

  return (
    <div
      onClick={onClick}
      className={`profile-evaluation-card card gap-.5 cursor-pointer !flex-row border pb-3 pl-2 pr-[14px] pt-[11px]`}
    >
      {loading ? (
        'Loading...'
      ) : ratingNumber &&
        evidenceViewMode !== EvidenceViewMode.INBOUND_CONNECTION ? (
        <EvaluatedCardBody
          connection={connection ?? profileFetch.data}
          evidenceViewMode={evidenceViewMode}
          fromSubjectId={fromSubjectId}
          toSubjectId={toSubjectId}
        />
      ) : (
        <ConnectedCardBody
          evidenceViewMode={evidenceViewMode}
          connection={connection ?? profileFetch.data}
          fromSubjectId={fromSubjectId}
          toSubjectId={toSubjectId}
        />
      )}
    </div>
  );
};

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
    <div
      className="z-10"
      // tooltipClassName="text-sm !w-52 !whitespace-normal"
      // position="right"
      content={``}
    >
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

const UserName = ({ subjectId }: { subjectId: string }) => {
  const name = useSubjectName(subjectId);
  return (
    <div className="flex items-center gap-1">
      <p className="name line-clamp-1 flex-1 text-ellipsis text-sm font-medium">
        {name}
      </p>
      {/*<Link*/}
      {/*  to={RoutePath.SUBJECT_PROFILE.replace(':subjectIdProp', subjectId)}*/}
      {/*  className="flex bg-pastel-purple h-[14px] w-5 items-center justify-center rounded-full cursor-pointer"*/}
      {/*  onClick={(e) => e.stopPropagation()}*/}
      {/*>*/}
      {/*  <img*/}
      {/*    src="/assets/images/SubjectProfile/icon.svg"*/}
      {/*    alt=""*/}
      {/*    className="h-[10px] w-[10px] min-w-[10px]"*/}
      {/*  />*/}
      {/*</Link>*/}
    </div>
  );
};

const UserInformation = ({
  subjectId,
  evidenceViewMode,
  connection,
}: {
  subjectId: string;
  evidenceViewMode: EvidenceViewMode;
  connection?: { verifications: Verifications };
}) => {
  const { currentViewMode, currentRoleEvaluatorEvaluationCategory } =
    useViewMode();

  const verificartions = useMemo(
    () =>
      getAuraVerification(
        connection?.verifications,
        evidenceViewMode === EvidenceViewMode.INBOUND_CONNECTION
          ? EvaluationCategory.SUBJECT
          : evidenceViewMode === EvidenceViewMode.INBOUND_EVALUATION
            ? currentRoleEvaluatorEvaluationCategory
            : viewModeToViewAs[
                evidenceViewMode ===
                EvidenceViewMode.OUTBOUND_ACTIVITY_ON_MANAGERS
                  ? currentViewMode
                  : viewModeToSubjectViewMode[currentViewMode]
              ],
      ),
    [evidenceViewMode, connection],
  );

  const auraScore = verificartions?.score;

  const auraLevel = verificartions?.level;

  return (
    <div className="mb-1.5 flex items-center justify-between gap-0.5 rounded bg-gray00 p-1 pr-2 text-white">
      <img
        src={
          evidenceViewMode === EvidenceViewMode.INBOUND_CONNECTION
            ? '/assets/images/Shared/brightid-icon.svg'
            : evidenceViewMode === EvidenceViewMode.INBOUND_EVALUATION
              ? preferredViewIconColored[currentViewMode]
              : subjectViewAsIconColored[
                  viewModeToViewAs[
                    evidenceViewMode ===
                    EvidenceViewMode.OUTBOUND_ACTIVITY_ON_MANAGERS
                      ? currentViewMode
                      : viewModeToSubjectViewMode[currentViewMode]
                  ]
                ]
        }
        alt=""
        className="mx-1 h-3.5 w-3.5"
      />
      <>
        <Tooltip
          content="subject level"
          tooltipClassName="z-10 font-normal"
          className={`level mr-0.5 text-sm font-bold ${
            INBOUND_EVIDENCE_VIEW_MODES.includes(evidenceViewMode)
              ? getViewModeTextColorClass(currentViewMode)
              : getViewModeSubjectTextColorClass(
                  evidenceViewMode ===
                    EvidenceViewMode.OUTBOUND_ACTIVITY_ON_MANAGERS
                    ? currentViewMode
                    : viewModeToSubjectViewMode[currentViewMode],
                )
          }`}
        >
          lvl {auraLevel}
        </Tooltip>
        <Tooltip
          content="subject score"
          tooltipClassName="z-10 font-normal"
          className={`text-sm font-bold ${
            INBOUND_EVIDENCE_VIEW_MODES.includes(evidenceViewMode)
              ? getViewModeTextColorClass(currentViewMode)
              : getViewModeSubjectTextColorClass(
                  evidenceViewMode ===
                    EvidenceViewMode.OUTBOUND_ACTIVITY_ON_MANAGERS
                    ? currentViewMode
                    : viewModeToSubjectViewMode[currentViewMode],
                )
          }`}
        >
          {auraScore ? compactFormat(auraScore) : '-'}
        </Tooltip>
      </>
    </div>
  );
};

const Graph = ({
  subjectId,
  evidenceViewMode,
  connection,
}: {
  subjectId: string;
  evidenceViewMode: EvidenceViewMode;
  connection?: { verifications: Verifications };
}) => {
  const { currentViewMode, currentRoleEvaluatorEvaluationCategory } =
    useViewMode();

  const { auraImpacts } = useParseBrightIdVerificationData(
    connection?.verifications,
    evidenceViewMode === EvidenceViewMode.INBOUND_CONNECTION
      ? EvaluationCategory.SUBJECT
      : evidenceViewMode === EvidenceViewMode.INBOUND_EVALUATION
        ? currentRoleEvaluatorEvaluationCategory
        : viewModeToViewAs[
            evidenceViewMode === EvidenceViewMode.OUTBOUND_ACTIVITY_ON_MANAGERS
              ? currentViewMode
              : viewModeToSubjectViewMode[currentViewMode]
          ],
  );

  const { impactChartSmallOption } = useImpactEChartOption(auraImpacts);

  return (
    <ReactECharts
      style={{ height: '48px', width: '100%' }}
      option={impactChartSmallOption}
    />
  );
};

const EvidenceInformation = ({
  subjectId,
  evidenceType,
  evidenceViewMode,
}: {
  subjectId: string;
  evidenceType?: EvidenceType;
  evidenceViewMode: EvidenceViewMode;
}) => {
  const name = useSubjectName(subjectId);
  const { currentViewMode } = useViewMode();
  return (
    <div className="evidence-information flex flex-1 justify-between gap-2">
      <Tooltip
        content={
          evidenceType === EvidenceType.EVALUATED
            ? evidenceViewMode === EvidenceViewMode.OUTBOUND_ACTIVITY
              ? 'This user was evaluated by the current subject'
              : 'The current subject evaluated this user'
            : evidenceViewMode === EvidenceViewMode.OUTBOUND_ACTIVITY
              ? 'This user initiated the connection with the current subject'
              : 'This user is connected to the current subject'
        }
        className={`${
          INBOUND_EVIDENCE_VIEW_MODES.includes(evidenceViewMode)
            ? getViewModeTextColorClass(currentViewMode)
            : getViewModeSubjectTextColorClass(currentViewMode)
        } text-xs font-medium`}
      >
        <span className="inline-flex items-center gap-1">
          {evidenceType === EvidenceType.CONNECTED ? (
            <ArrowDownRight className="h-4 w-4" />
          ) : evidenceViewMode === EvidenceViewMode.OUTBOUND_ACTIVITY ? (
            <ArrowDownLeft className="h-4 w-4" />
          ) : (
            <ArrowUpRight className="h-4 w-4" />
          )}
          {evidenceType === EvidenceType.EVALUATED
            ? evidenceViewMode === EvidenceViewMode.OUTBOUND_ACTIVITY
              ? 'evaluated by'
              : 'evaluated'
            : evidenceViewMode === EvidenceViewMode.OUTBOUND_ACTIVITY
              ? 'connected by'
              : 'connected to'}
        </span>
      </Tooltip>
      <div className="flex-1 truncate text-right text-xs font-medium">
        {name}
      </div>
    </div>
  );
};

const EvidenceUserProfile = ({ subjectId }: { subjectId: string }) => {
  return (
    <div className="img ml-auto">
      <BrightIdProfilePicture
        subjectId={subjectId}
        className="h-8 w-8 rounded-full border border-gray60"
      />
    </div>
  );
};

export const EvaluationInformation = ({
  fromSubjectId,
  toSubjectId,
  evidenceViewMode,
}: {
  fromSubjectId: string;
  toSubjectId: string;
  evidenceViewMode: EvidenceViewMode;
}) => {
  const { currentViewMode, currentEvaluationCategory } = useViewMode();
  const evaluationCategory = useMemo(
    () =>
      INBOUND_EVIDENCE_VIEW_MODES.includes(evidenceViewMode) ||
      evidenceViewMode === EvidenceViewMode.OUTBOUND_ACTIVITY_ON_MANAGERS
        ? currentEvaluationCategory
        : viewModeToViewAs[viewModeToSubjectViewMode[currentViewMode]],
    [currentEvaluationCategory, currentViewMode, evidenceViewMode],
  );
  const { rating, loading } = useSubjectEvaluationFromContext({
    fromSubjectId,
    toSubjectId,
    evaluationCategory,
  });

  const fromName = useSubjectName(fromSubjectId);
  const toName = useSubjectName(toSubjectId);

  const { auraImpacts } = useSubjectVerifications(
    toSubjectId,
    evaluationCategory,
  );
  const impactPercentage = useImpactPercentage(auraImpacts, fromSubjectId);

  //TODO: change bg color on negative rating
  return (
    <Tooltip
      position="left"
      tooltipClassName="z-10 w-32 !h-auto !whitespace-normal"
      content={`${fromName} evaluated ${toName} ${
        Number(rating?.rating) > 0 ? '+' : ''
      }${rating?.rating}`}
    >
      <div
        className={`evaluation-information flex flex-col items-center justify-center gap-1 py-1.5 ${getBgClassNameOfAuraRatingObject(
          rating,
        )} rounded-md`}
      >
        {loading ? (
          '...'
        ) : (
          <div className="flex items-center gap-1.5">
            <EvaluationThumb rating={rating && Number(rating?.rating)} />
            <p
              className={`${getTextClassNameOfAuraRatingObject(
                rating,
              )} mt-0.5 text-xs font-bold`}
            >{`${getConfidenceValueOfAuraRatingNumber(
              Number(rating?.rating),
            )} ${Number(rating?.rating) > 0 ? '+' : ''}${rating?.rating}`}</p>
          </div>
        )}
        <div
          className={`flex justify-between gap-9 text-sm ${getTextClassNameOfAuraRatingObject(
            rating,
          )}`}
        >
          <p>Impact</p>
          <p className="font-bold">
            {impactPercentage !== null ? `${impactPercentage}%` : '-'}
          </p>
        </div>
      </div>
    </Tooltip>
  );
};

const EvaluatedCardBody = ({
  fromSubjectId,
  toSubjectId,
  evidenceViewMode,
  connection,
}: {
  fromSubjectId: string;
  toSubjectId: string;
  evidenceViewMode: EvidenceViewMode;
  connection?: { verifications: Verifications };
}) => {
  const leftCardSide = useMemo(
    () =>
      INBOUND_EVIDENCE_VIEW_MODES.includes(evidenceViewMode)
        ? fromSubjectId
        : toSubjectId,
    [evidenceViewMode, fromSubjectId, toSubjectId],
  );
  const name = useSubjectName(leftCardSide);

  const rightCardSide = useMemo(
    () =>
      INBOUND_EVIDENCE_VIEW_MODES.includes(evidenceViewMode)
        ? toSubjectId
        : fromSubjectId,
    [evidenceViewMode, fromSubjectId, toSubjectId],
  );
  const { currentViewMode, currentEvaluationCategory } = useViewMode();

  return (
    <>
      <div className="card__left-column flex w-[60%] gap-1.5">
        <div className="flex w-[50px] flex-col gap-1.5">
          <BrightIdProfilePicture
            subjectId={leftCardSide}
            className={`h-[46px] w-[46px] !min-w-[46px] rounded-lg border-2 ${
              INBOUND_EVIDENCE_VIEW_MODES.includes(evidenceViewMode)
                ? getViewModeBorderColorClass(currentViewMode)
                : getViewModeSubjectBorderColorClass(
                    evidenceViewMode ===
                      EvidenceViewMode.OUTBOUND_ACTIVITY_ON_MANAGERS
                      ? currentViewMode
                      : viewModeToSubjectViewMode[currentViewMode],
                  )
            }`}
          />
          <ConnectionInfo
            connection={connection}
            evidenceViewMode={evidenceViewMode}
            subjectId={leftCardSide}
          />
        </div>
        <div className="flex w-full flex-col gap-0">
          <UserName subjectId={leftCardSide} />
          <UserInformation
            subjectId={leftCardSide}
            connection={connection}
            evidenceViewMode={evidenceViewMode}
          />
          <Tooltip
            // className="z-10"
            content={`Top evaluations of ${name} as a ${currentEvaluationCategory}`}
          >
            <div>
              <Graph
                subjectId={leftCardSide}
                evidenceViewMode={evidenceViewMode}
                connection={connection}
              />
            </div>
          </Tooltip>
        </div>
        <span className="divider pl-.5 mr-1.5 h-full border-r border-dashed border-gray00"></span>
      </div>
      <div className="card__right-column flex w-[40%] flex-col gap-1">
        <EvidenceInformation
          evidenceViewMode={evidenceViewMode}
          evidenceType={EvidenceType.EVALUATED}
          subjectId={rightCardSide}
        />
        <EvidenceUserProfile subjectId={rightCardSide} />
        <EvaluationInformation
          evidenceViewMode={evidenceViewMode}
          fromSubjectId={fromSubjectId}
          toSubjectId={toSubjectId}
        />
      </div>
    </>
  );
};

// const EvaluatedCardBodyOld = ({
//   fromSubjectId,
//   toSubjectId,
// }: {
//   fromSubjectId: string;
//   toSubjectId: string;
// }) => {
//   const { name } = useSubjectBasicInfo(toSubjectId);
//   return (
//     <>
//       <div className="card__top-row flex justify-between w-full">
//         <EvaluatorInfo evaluatorId={fromSubjectId} />
//         <div className="card__top-row__right flex items-start gap-1.5">
//           <p className="connected-to text-right text-purple text-sm font-medium">
//             evaluated
//             <br /> {name}
//           </p>
//         </div>
//       </div>
//       <EvaluationInfo fromSubjectId={fromSubjectId} toSubjectId={toSubjectId} />
//     </>
//   );
// };

const ConnectionInformation = ({
  fromSubjectId,
  toSubjectId,
}: {
  fromSubjectId: string;
  toSubjectId: string;
}) => {
  const { connectionInfo, loading } = useSubjectConnectionInfoFromContext({
    fromSubjectId,
    toSubjectId,
  });
  const connectionTime = useMemo(() => {
    if (!connectionInfo?.timestamp) return '-';
    return moment(connectionInfo.timestamp).fromNow();
  }, [connectionInfo?.timestamp]);
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-md bg-soft-bright py-1.5 dark:bg-dark-bright">
      {loading ? (
        '...'
      ) : (
        <>
          <div className="flex items-center gap-1.5">{connectionTime}</div>
          <div className="flex items-center gap-1.5">
            {connectionInfo && (
              <img
                src={`/assets/images/Shared/${
                  connectionLevelIcons[connectionInfo.level]
                }.svg`}
                className="h-[18px] w-[18px]"
                alt=""
              />
            )}
            <p className="text-sm font-bold">{connectionInfo?.level}</p>
          </div>
        </>
      )}
    </div>
  );
};
const ConnectedCardBody = ({
  evidenceViewMode,
  fromSubjectId,
  connection,
  toSubjectId,
}: {
  fromSubjectId: string;
  toSubjectId: string;
  evidenceViewMode: EvidenceViewMode;
  connection?: { verifications: Verifications };
}) => {
  const leftCardSide = useMemo(
    () =>
      INBOUND_EVIDENCE_VIEW_MODES.includes(evidenceViewMode)
        ? fromSubjectId
        : toSubjectId,
    [evidenceViewMode, fromSubjectId, toSubjectId],
  );

  const name = useSubjectName(leftCardSide);

  const rightCardSide = useMemo(
    () =>
      INBOUND_EVIDENCE_VIEW_MODES.includes(evidenceViewMode)
        ? toSubjectId
        : fromSubjectId,
    [evidenceViewMode, fromSubjectId, toSubjectId],
  );
  return (
    <>
      <div className="card__left-column flex w-[60%] gap-1.5">
        <div className="flex w-[50px] flex-col gap-1.5">
          <BrightIdProfilePicture
            subjectId={leftCardSide}
            className={`h-[46px] w-[46px] !min-w-[46px] rounded-lg border-2 border-pastel-purple`}
          />
          <ConnectionInfo
            connection={connection}
            evidenceViewMode={evidenceViewMode}
            subjectId={leftCardSide}
          />
        </div>
        <div className="flex w-full flex-col gap-0">
          <UserName subjectId={leftCardSide} />
          <UserInformation
            connection={connection}
            evidenceViewMode={evidenceViewMode}
            subjectId={leftCardSide}
          />
          <Tooltip
            // className="z-10"
            content={`Top evaluations ${name}'s as a ${viewModeSubjectString[evidenceViewMode]}`}
          >
            <div>
              <Graph
                subjectId={leftCardSide}
                connection={connection}
                evidenceViewMode={evidenceViewMode}
              />
            </div>
          </Tooltip>
        </div>
        <span className="divider pl-.5 mr-1.5 h-full border-r border-dashed border-gray00"></span>
      </div>
      <div className="card__right-column flex w-[40%] flex-col gap-1">
        <EvidenceInformation
          evidenceViewMode={evidenceViewMode}
          evidenceType={EvidenceType.CONNECTED}
          subjectId={rightCardSide}
        />
        <EvidenceUserProfile subjectId={rightCardSide} />
        <ConnectionInformation
          fromSubjectId={fromSubjectId}
          toSubjectId={toSubjectId}
        />
      </div>
    </>
  );
};

// const ConnectedCardBodyOld = ({
//   fromSubjectId,
//   toSubjectId,
// }: {
//   fromSubjectId: string;
//   toSubjectId: string;
// }) => {
//   const { name } = useSubjectBasicInfo(toSubjectId);
//   return (
//     <>
//       <div className="card__top-row flex justify-between items-start w-full">
//         <EvaluatorInfo evaluatorId={fromSubjectId} />
//         <div className="card__top-row__right flex items-stretch gap-1.5">
//           <p className="evaluated text-right text-orange text-sm font-medium">
//             connected to <br /> {name}
//           </p>
//         </div>
//       </div>
//       <EvaluationInfo fromSubjectId={fromSubjectId} toSubjectId={toSubjectId} />
//     </>
//   );
// };

export default ProfileEvaluation;
