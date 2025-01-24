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
  viewModeToString,
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
import moment from 'moment';
import { useMemo } from 'react';
import {
  EvaluationCategory,
  EvidenceType,
  EvidenceViewMode,
} from 'types/dashboard';
import { connectionLevelIcons } from 'utils/connection';
import { compactFormat } from 'utils/number';

import { useSelector } from '../../../store/hooks';
import { selectAuthData } from '../../../store/profile/selectors';
import BrightIdProfilePicture from '../../BrightIdProfilePicture';
import Tooltip from '../Tooltip';

const ProfileEvaluation = ({
  fromSubjectId,
  toSubjectId,
  onClick,
  evidenceViewMode,
}: {
  fromSubjectId: string;
  toSubjectId: string;
  onClick: () => void;
  evidenceViewMode: EvidenceViewMode;
}) => {
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
      className={`profile-evaluation-card card !flex-row cursor-pointer gap-.5 pl-2 pt-[11px] pr-[14px] pb-3`}
    >
      {loading ? (
        'Loading...'
      ) : ratingNumber &&
        evidenceViewMode !== EvidenceViewMode.INBOUND_CONNECTION ? (
        <EvaluatedCardBody
          evidenceViewMode={evidenceViewMode}
          fromSubjectId={fromSubjectId}
          toSubjectId={toSubjectId}
        />
      ) : (
        <ConnectedCardBody
          evidenceViewMode={evidenceViewMode}
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
}: {
  subjectId: string;
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

  const { auraImpacts } = useSubjectVerifications(
    subjectId,
    evaluationCategory,
  );
  const authData = useSelector(selectAuthData);
  const impactPercentage = useImpactPercentage(auraImpacts, authData?.brightId);

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
    <Tooltip
      position="right"
      className="z-10"
      content={`You connected with "${inboundConnectionInfo?.level}" to ${name}`}
    >
      <div className={`flex flex-col gap-0.5 ${bgColor} py-1.5 rounded-md`}>
        {loading ? (
          '...'
        ) : (
          <>
            <div className="flex gap-0.5 justify-center items-center">
              {inboundConnectionInfo &&
                connectionLevelIcons[inboundConnectionInfo.level] && (
                  <img
                    src={`/assets/images/Shared/${
                      connectionLevelIcons[inboundConnectionInfo.level]
                    }.svg`}
                    className="h-[18px] w-[18px]"
                    alt=""
                  />
                )}
              {!!rating && Number(rating?.rating) !== 0 && (
                <p
                  className={`text-sm font-bold ${getTextClassNameOfAuraRatingObject(
                    rating,
                  )}`}
                >
                  {Number(rating.rating) < 0 ? '-' : '+'}
                  {Math.abs(Number(rating.rating))}
                </p>
              )}
            </div>
            {!!rating && Number(rating?.rating) !== 0 && (
              <p
                className={`impact-percentage ${getTextClassNameOfAuraRatingObject(
                  rating,
                )} text-[11px] font-bold text-center w-full`}
              >
                {impactPercentage !== null ? `${impactPercentage}%` : '-'}
              </p>
            )}
          </>
        )}
      </div>
    </Tooltip>
  );
};

const UserName = ({ subjectId }: { subjectId: string }) => {
  const name = useSubjectName(subjectId);
  return (
    <div className="flex gap-1 items-center">
      <p className="name flex-1 font-medium text-sm line-clamp-1 text-ellipsis">
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
}: {
  subjectId: string;
  evidenceViewMode: EvidenceViewMode;
}) => {
  const { currentViewMode, currentRoleEvaluatorEvaluationCategory } =
    useViewMode();
  const { auraLevel, auraScore, loading } = useSubjectVerifications(
    subjectId,
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
  return (
    <div className="bg-gray00 rounded p-1 pr-2 flex gap-0.5 justify-between items-center mb-1.5 text-white">
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
        className="w-3.5 h-3.5 mx-1"
      />
      {loading ? (
        <p
          className={`level text-sm font-bold mr-0.5 ${
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
          ...
        </p>
      ) : (
        <>
          <Tooltip
            content="subject level"
            tooltipClassName="z-10 font-normal"
            className={`level text-sm font-bold mr-0.5 ${
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
            {auraLevel}
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
            {/*13.4<span className="font-medium">m</span>*/}
            {auraScore ? compactFormat(auraScore) : '-'}
          </Tooltip>
        </>
      )}
    </div>
  );
};

const Graph = ({
  subjectId,
  evidenceViewMode,
}: {
  subjectId: string;
  evidenceViewMode: EvidenceViewMode;
}) => {
  const { currentViewMode, currentRoleEvaluatorEvaluationCategory } =
    useViewMode();
  const { auraImpacts } = useSubjectVerifications(
    subjectId,
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
    <div className="evidence-information flex justify-between flex-1 gap-2">
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
        {evidenceType === EvidenceType.EVALUATED
          ? evidenceViewMode === EvidenceViewMode.OUTBOUND_ACTIVITY
            ? 'evaluated by'
            : 'evaluated'
          : evidenceViewMode === EvidenceViewMode.OUTBOUND_ACTIVITY
          ? 'connected by'
          : 'connected to'}
      </Tooltip>
      <div className="text-xs font-medium truncate flex-1 text-right">
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
        className="rounded-full border border-gray60 w-8 h-8"
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
      tooltipClassName="z-10"
      // tooltipClassName="translate-x-1/2"
      content={`${fromName} evaluated ${toName} +4`}
    >
      <div
        className={`evaluation-information flex flex-col py-1.5 items-center justify-center gap-1 ${getBgClassNameOfAuraRatingObject(
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
              )} text-xs font-bold mt-0.5`}
            >{`${getConfidenceValueOfAuraRatingNumber(
              Number(rating?.rating),
            )} ${rating?.rating}`}</p>
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
}: {
  fromSubjectId: string;
  toSubjectId: string;
  evidenceViewMode: EvidenceViewMode;
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
  const { currentViewMode } = useViewMode();
  return (
    <>
      <div className="card__left-column w-[60%] flex gap-1.5">
        <div className="w-[50px] flex flex-col gap-1.5">
          <BrightIdProfilePicture
            subjectId={leftCardSide}
            className={`w-[46px] h-[46px] !min-w-[46px] rounded-lg border-2 ${
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
            evidenceViewMode={evidenceViewMode}
            subjectId={leftCardSide}
          />
        </div>
        <div className="flex flex-col gap-0 w-full">
          <UserName subjectId={leftCardSide} />
          <UserInformation
            subjectId={leftCardSide}
            evidenceViewMode={evidenceViewMode}
          />
          <Tooltip
            // className="z-10"
            content={`All evaluations of ${name} as a ${viewModeToString[evidenceViewMode]}`}
          >
            <div>
              <Graph
                subjectId={leftCardSide}
                evidenceViewMode={evidenceViewMode}
              />
            </div>
          </Tooltip>
        </div>
        <span className="divider border-r border-dashed border-gray00 pl-.5 mr-1.5 h-full"></span>
      </div>
      <div className="card__right-column flex flex-col gap-1 w-[40%]">
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
    <div className="flex flex-col py-1.5 items-center justify-center gap-1 bg-soft-bright dark:bg-dark-bright rounded-md">
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
  toSubjectId,
}: {
  fromSubjectId: string;
  toSubjectId: string;
  evidenceViewMode: EvidenceViewMode;
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
      <div className="card__left-column w-[60%] flex gap-1.5">
        <div className="w-[50px] flex flex-col gap-1.5">
          <BrightIdProfilePicture
            subjectId={leftCardSide}
            className={`w-[46px] h-[46px] !min-w-[46px] rounded-lg border-2 border-pastel-purple`}
          />
          <ConnectionInfo
            evidenceViewMode={evidenceViewMode}
            subjectId={leftCardSide}
          />
        </div>
        <div className="flex flex-col gap-0 w-full">
          <UserName subjectId={leftCardSide} />
          <UserInformation
            evidenceViewMode={evidenceViewMode}
            subjectId={leftCardSide}
          />
          <Tooltip
            // className="z-10"
            content={`All of ${name}'s evaluations as a ${viewModeSubjectString[evidenceViewMode]}`}
          >
            <div>
              <Graph
                subjectId={leftCardSide}
                evidenceViewMode={evidenceViewMode}
              />
            </div>
          </Tooltip>
        </div>
        <span className="divider border-r border-dashed border-gray00 pl-.5 mr-1.5 h-full"></span>
      </div>
      <div className="card__right-column flex flex-col gap-1 w-[40%]">
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
