import { SubjectInboundConnectionsContextProvider } from 'contexts/SubjectInboundConnectionsContext';
import { SubjectInboundEvaluationsContextProvider } from 'contexts/SubjectInboundEvaluationsContext';
import { SubjectOutboundEvaluationsContextProvider } from 'contexts/SubjectOutboundEvaluationsContext';
import { FC } from 'react';
import { useSelector } from 'react-redux';

import { useSubjectVerifications } from '../../hooks/useSubjectVerifications';
import { selectAuthData } from '../../store/profile/selectors';
import { EvaluationCategory } from '../../types/dashboard';
import { compactFormat } from '../../utils/number';

export const RoleManagement = () => {
  const authData = useSelector(selectAuthData);
  const subjectId = authData!.brightId;

  return (
    <SubjectOutboundEvaluationsContextProvider subjectId={subjectId!}>
      <SubjectInboundEvaluationsContextProvider subjectId={subjectId!}>
        <SubjectInboundConnectionsContextProvider subjectId={subjectId!}>
          <div className="page flex flex-col flex-1">
            <section className="flex flex-col gap-3">
              <PlayerCard subjectId={subjectId} />
              <TrainerCard subjectId={subjectId} />
              <ManagerCard subjectId={subjectId} />
            </section>

            <section className="mt-auto flex w-full justify-center">
              <p className="text-white text-sm">Aura version 2.1</p>
            </section>
          </div>
        </SubjectInboundConnectionsContextProvider>
      </SubjectInboundEvaluationsContextProvider>
    </SubjectOutboundEvaluationsContextProvider>
  );
};

export type SubjectIdProps = {
  subjectId: string;
};

const PlayerCard: FC<SubjectIdProps> = ({ subjectId }) => {
  const playerEvaluation = useSubjectVerifications(
    subjectId,
    EvaluationCategory.PLAYER,
  );
  return (
    <div className="bg-white-90-card dark:bg-button-primary flex flex-col gap-3.5 relative cursor-pointer rounded-lg pl-5 py-[18px] pr-6 pb-4 min-h-[150px]">
      <img
        src="/assets/images/RoleManagement/player-shadow-icon.svg"
        alt=""
        className="absolute top-0 left-0"
      />
      <section className="flex justify-between">
        <div className="flex gap-2">
          <img src="/assets/images/Shared/player.svg" alt="" />
          <div>
            <p className="font-medium dark:text-white text-[20px]">Player</p>
          </div>
        </div>
        <PlayerLevelAndScore
          level={playerEvaluation.auraLevel}
          loading={playerEvaluation.loading}
          score={playerEvaluation.auraScore}
          color="text-pastel-purple"
        />
      </section>

      <section className="flex dark:text-white text-black justify-between mt-auto">
        {/* <button className="btn btn--outlined btn--small">Hide</button> */}
      </section>
    </div>
  );
};

const TrainerCard: FC<SubjectIdProps> = ({ subjectId }) => {
  const trainerEvaluation = useSubjectVerifications(
    subjectId,
    EvaluationCategory.TRAINER,
  );

  console.log(trainerEvaluation);

  return (
    <div className="bg-white-90-card flex dark:bg-button-primary flex-col gap-3.5 relative cursor-pointer rounded-lg pl-5 py-[18px] pr-6 pb-4 min-h-[150px]">
      <img
        src="/assets/images/RoleManagement/trainer-shadow-icon.svg"
        alt=""
        className="absolute top-0 left-0"
      />
      <section className="flex justify-between">
        <div className="flex gap-2 dark:text-white text-black">
          <img src="/assets/images/Shared/trainer.svg" alt="" />
          <div>
            <p className="font-medium text-[20px] dark:text-white">Trainer</p>
          </div>
        </div>
        <PlayerLevelAndScore
          loading={trainerEvaluation.loading}
          level={trainerEvaluation.auraLevel}
          score={trainerEvaluation.auraScore}
          color="text-pastel-green"
        />
      </section>

      <section className="flex justify-end dark:text-white text-black mt-auto">
        <button className="btn !bg-pl2 btn--small">Join</button>
      </section>
    </div>
  );
};

const ManagerCard: FC<SubjectIdProps> = ({ subjectId }) => {
  const managerEvaluation = useSubjectVerifications(
    subjectId,
    EvaluationCategory.MANAGER,
  );

  return (
    <div className="bg-white-90-card flex dark:bg-button-primary flex-col gap-3.5 relative cursor-pointer rounded-lg pl-5 py-[18px] pr-6 pb-4 min-h-[150px]">
      <img
        src="/assets/images/RoleManagement/manager-shadow-icon.svg"
        alt=""
        className="absolute top-0 left-0"
      />
      <section className="flex justify-between">
        <div className="flex gap-2">
          <img src="/assets/images/Shared/manager.svg" alt="" />
          <div>
            <p className="font-medium text-[20px] dark:text-white">Manager</p>
          </div>
        </div>
        <PlayerLevelAndScore
          loading={managerEvaluation.loading}
          level={managerEvaluation.auraLevel}
          score={managerEvaluation.auraScore}
          color="text-gray50"
        />
      </section>

      <section>
        <div className="flex gap-2 items-center mt-2 text-sm font-medium">
          <img src="/assets/images/RoleManagement/item.svg" alt="" />
          <p className="font-medium dark:text-white">
            Reach Trainer Level 2 to unlock
            <span className="text-blue font-bold"> Manager </span>
          </p>
        </div>
      </section>

      <section className="flex justify-between mt-auto dark:text-white text-black"></section>
    </div>
  );
};

const PlayerLevelAndScore = ({
  color,
  level,
  score,
  loading,
}: {
  color: string;
  score?: number | null;
  level?: number | null;
  loading: boolean;
}) => {
  return (
    <div
      className={`bg-gray00 rounded min-w-[90px] h-fit pl-2.5 py-1.5 pr-2 flex gap-1.5 justify-between items-center ${color}`}
    >
      <p className={`level text-sm font-bold`}>
        {loading ? '-' : `lvl ${level ?? '-'}`}
      </p>
      <p className={`text-sm font-bold`}>
        {loading ? '-' : compactFormat(score ?? 0)}
      </p>
    </div>
  );
};
