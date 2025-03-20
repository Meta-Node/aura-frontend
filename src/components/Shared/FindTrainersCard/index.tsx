import { useMemo, useState } from 'react';
import { compactFormat } from 'utils/number';

import {
  viewModeToEvaluatorViewMode,
  viewModeToViewAs,
} from '../../../constants';
import { useSubjectInboundEvaluationsContext } from '../../../contexts/SubjectInboundEvaluationsContext';
import { getAuraVerification } from '../../../hooks/useParseBrightIdVerificationData';
import { useSubjectConnectionInfoFromContext } from '../../../hooks/useSubjectEvaluation';
import {
  useInboundEvaluations,
  useOutboundEvaluations,
} from '../../../hooks/useSubjectEvaluations';
import { useSubjectName } from '../../../hooks/useSubjectName';
import { useSubjectVerifications } from '../../../hooks/useSubjectVerifications';
import { PreferredView } from '../../../types/dashboard';
import { connectionLevelIcons } from '../../../utils/connection';
import BrightIdProfilePicture from '../../BrightIdProfilePicture';
import LinkCard from '@/app/routes/_app.home/components/LinkCard';

const FindTrainersCard = ({ subjectId }: { subjectId: string }) => {
  return (
    <div className="card !bg-[#ECECEC] dark:!bg-[#1f1f1f]">
      <div className="mb-4.5 font-bold text-lg">Find Trainers</div>
      <div className="flex flex-col gap-2.5">
        <PotentialEvaluatorsListBrief
          subjectId={subjectId}
          description={
            'Here is a list of trainers from your BrightID connections. Ask them to check your work and help you improve.'
          }
          evaluatorViewMode={PreferredView.TRAINER}
          title={'Trainers'}
        />
        <PotentialEvaluatorsListBrief
          subjectId={subjectId}
          description={
            'Or you can ask other players you know to introduce you to their trainers.'
          }
          evaluatorViewMode={PreferredView.PLAYER}
          title={'Players'}
        />
        <div className="mb-[22px]">
          <LinkCard />
        </div>
      </div>
    </div>
  );
};

const PotentialEvaluatorsListBrief = ({
  description,
  title,
  evaluatorViewMode,
  subjectId,
}: {
  description: string;
  title: string;
  evaluatorViewMode: PreferredView;
  subjectId: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { itemsOriginal, loading } = useSubjectInboundEvaluationsContext({
    subjectId,
  });
  const potentialEvaluators = useMemo(
    () =>
      itemsOriginal?.filter((c) => {
        const level = getAuraVerification(
          c.inboundConnection?.verifications,
          viewModeToViewAs[viewModeToEvaluatorViewMode[evaluatorViewMode]],
        )?.level;
        return level && level > 0;
      }),
    [evaluatorViewMode, itemsOriginal],
  );
  //TODO: Animation must be implemented
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-black2 dark:text-gray-300 font-medium">
        {description}
      </div>
      <div className="flex flex-col gap-2 dark:bg-card bg-white rounded-[8px] p-3">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2.5">
            {!isExpanded && (
              <div className="flex flex-row gap-0.5">
                {potentialEvaluators?.slice(0, 3).map((p) => (
                  <BrightIdProfilePicture
                    key={p.fromSubjectId}
                    subjectId={p.fromSubjectId}
                    className="w-6 h-6 rounded border-pastel-green border-[1px]"
                  />
                ))}
              </div>
            )}
            <div className="flex flex-row gap-1">
              <span className="font-black">
                {!loading && potentialEvaluators
                  ? potentialEvaluators.length
                  : '...'}
              </span>
              <span className="font-medium">{title}</span>
            </div>
          </div>
          {isExpanded ? (
            <img
              src="/assets/images/Shared/minus-purple-icon.svg"
              alt=""
              className="cursor-pointer -mt-2"
              onClick={() => setIsExpanded(false)}
            />
          ) : (
            <div
              className="font-medium cursor-pointer"
              onClick={() => setIsExpanded(true)}
            >
              Show All
            </div>
          )}
        </div>
        {isExpanded && (
          <div className="flex flex-col gap-4">
            {potentialEvaluators?.map((p) => (
              <PotentialEvaluatorBrief
                key={p.fromSubjectId}
                evaluatorViewMode={evaluatorViewMode}
                evaluatorSubjectId={p.fromSubjectId}
                subjectId={subjectId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EvaluationsCount = ({
  evaluatorViewMode,
  evaluatorSubjectId,
}: {
  evaluatorViewMode: PreferredView;
  evaluatorSubjectId: string;
}) => {
  const { ratings } = useOutboundEvaluations({
    subjectId: evaluatorSubjectId,
    evaluationCategory: viewModeToViewAs[evaluatorViewMode],
  });
  return <>{ratings ? ratings.length : '...'}</>;
};

const EvaluatorsCount = ({
  evaluatorViewMode,
  evaluatorSubjectId,
}: {
  evaluatorViewMode: PreferredView;
  evaluatorSubjectId: string;
}) => {
  const { ratings } = useInboundEvaluations({
    subjectId: evaluatorSubjectId,
    evaluationCategory: viewModeToViewAs[evaluatorViewMode],
  });
  return <>{ratings ? ratings.length : '...'}</>;
};

const PotentialEvaluatorBrief = ({
  evaluatorViewMode,
  evaluatorSubjectId,
  subjectId,
}: {
  evaluatorViewMode: PreferredView;
  evaluatorSubjectId: string;
  subjectId: string;
}) => {
  const subjectName = useSubjectName(evaluatorSubjectId);
  const { auraLevel, loading, auraScore } = useSubjectVerifications(
    evaluatorSubjectId,
    viewModeToViewAs[viewModeToEvaluatorViewMode[evaluatorViewMode]],
  );
  const { connectionInfo } = useSubjectConnectionInfoFromContext({
    fromSubjectId: evaluatorSubjectId,
    toSubjectId: subjectId,
  });
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex gap-1.5 items-center">
        <BrightIdProfilePicture
          subjectId={evaluatorSubjectId}
          className="w-[26px] h-[26px] rounded border-pastel-green border-[1px]"
        />
        <div className="flex flex-col leading-3">
          <div className="font-bold text-sm leading-4">{subjectName}</div>
          <div className="">
            {connectionInfo ? (
              <div className="flex items-center gap-1">
                <img
                  src={`/assets/images/Shared/${connectionLevelIcons[connectionInfo.level]
                    }.svg`}
                  alt=""
                  className="inline mr-0.5"
                  width={20}
                  height={20}
                />
                <span className="font-medium text-sm leading-3">
                  {connectionInfo.level}
                </span>
              </div>
            ) : (
              <div>...</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col leading-3 text-right">
        <span>
          {evaluatorViewMode === PreferredView.TRAINER && (
            <span className="font-medium text-xs">
              (
              <EvaluationsCount
                evaluatorSubjectId={evaluatorSubjectId}
                evaluatorViewMode={evaluatorViewMode}
              />{' '}
              Trainees)
            </span>
          )}{' '}
          {evaluatorViewMode === PreferredView.TRAINER && (
            <span className="font-medium text-xs">
              (
              <EvaluatorsCount
                evaluatorSubjectId={evaluatorSubjectId}
                evaluatorViewMode={evaluatorViewMode}
              />{' '}
              Trainers)
            </span>
          )}{' '}
          <span className="font-bold text-xs">
            Level {loading ? '...' : auraLevel !== null ? auraLevel : '-'}
          </span>{' '}
        </span>
        <p className="text-gray10 dark:text-gray-300 text-xs mb-2">
          Score:{' '}
          <span className="font-medium text-black dark:text-white">
            {auraScore ? compactFormat(auraScore) : '-'}
          </span>
        </p>
        {/* <div className="text-gray20 text-[10px] font-normal">
          Connection Level
        </div> */}
      </div>
    </div>
  );
};

export default FindTrainersCard;
