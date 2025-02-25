import {
  selectHasManagerRole,
  selectTrainerRole,
  toggleManagerRole,
  toggleTrainerRole,
} from 'BrightID/actions';
import { SubjectInboundConnectionsContextProvider } from 'contexts/SubjectInboundConnectionsContext';
import { SubjectInboundEvaluationsContextProvider } from 'contexts/SubjectInboundEvaluationsContext';
import { SubjectOutboundEvaluationsContextProvider } from 'contexts/SubjectOutboundEvaluationsContext';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useSubjectVerifications } from 'hooks/useSubjectVerifications';
import { selectAuthData } from 'store/profile/selectors';
import { EvaluationCategory } from 'types/dashboard';
import { compactFormat } from 'utils/number';
import DefaultHeader from '@/components/Shared/DefaultHeader';

export default function RoleManagement() {
  const authData = useSelector(selectAuthData);
  const subjectId = authData!.brightId;

  return (
    <>
      <DefaultHeader title="Settings" />
      <SubjectOutboundEvaluationsContextProvider subjectId={subjectId!}>
        <SubjectInboundEvaluationsContextProvider subjectId={subjectId!}>
          <SubjectInboundConnectionsContextProvider subjectId={subjectId!}>
            <div className="page flex flex-1 flex-col">
              <section className="flex flex-col gap-3">
                <PlayerCard subjectId={subjectId} />
                <TrainerCard subjectId={subjectId} />
                <ManagerCard subjectId={subjectId} />
              </section>

              {/* <section className="mt-auto flex w-full justify-center">
              <p className="text-white text-sm">Aura version 2.1</p>
            </section> */}
            </div>
          </SubjectInboundConnectionsContextProvider>
        </SubjectInboundEvaluationsContextProvider>
      </SubjectOutboundEvaluationsContextProvider>
    </>
  );
}

export type SubjectIdProps = {
  subjectId: string;
};

const PlayerCard: FC<SubjectIdProps> = ({ subjectId }) => {
  const playerEvaluation = useSubjectVerifications(
    subjectId,
    EvaluationCategory.PLAYER,
  );
  return (
    <div className="relative flex min-h-[150px] cursor-pointer flex-col gap-3.5 rounded-lg bg-white-90-card py-[18px] pb-4 pl-5 pr-6 dark:bg-button-primary">
      <img
        src="/assets/images/RoleManagement/player-shadow-icon.svg"
        alt=""
        className="absolute left-0 top-0"
      />
      <section className="flex justify-between">
        <div className="flex gap-2">
          <img src="/assets/images/Shared/player.svg" alt="" />
          <div>
            <p className="text-[20px] font-medium dark:text-white">Player</p>
          </div>
        </div>
        <PlayerLevelAndScore
          level={playerEvaluation.auraLevel}
          loading={playerEvaluation.loading}
          score={playerEvaluation.auraScore}
          color="text-pastel-purple"
        />
      </section>

      <section className="mt-auto flex justify-between text-black dark:text-white"></section>
    </div>
  );
};

const TrainerCard: FC<SubjectIdProps> = ({ subjectId }) => {
  const trainerEvaluation = useSubjectVerifications(
    subjectId,
    EvaluationCategory.TRAINER,
  );
  const dispatch = useDispatch();

  const hasTrainerRole = useSelector(selectTrainerRole);

  const playerEvaluation = useSubjectVerifications(
    subjectId,
    EvaluationCategory.PLAYER,
  );

  return (
    <div className="relative flex min-h-[150px] cursor-pointer flex-col gap-3.5 rounded-lg bg-white-90-card py-[18px] pb-4 pl-5 pr-6 dark:bg-button-primary">
      <img
        src="/assets/images/RoleManagement/trainer-shadow-icon.svg"
        alt=""
        className="absolute left-0 top-0"
      />
      <section className="flex justify-between">
        <div className="flex gap-2 text-black dark:text-white">
          <img src="/assets/images/Shared/trainer.svg" alt="" />
          <div>
            <p className="text-[20px] font-medium dark:text-white">Trainer</p>
          </div>
        </div>
        <PlayerLevelAndScore
          loading={trainerEvaluation.loading}
          level={trainerEvaluation.auraLevel}
          score={trainerEvaluation.auraScore}
          color="text-pastel-green"
        />{' '}
      </section>
      {!playerEvaluation.auraLevel || playerEvaluation.auraLevel < 2 ? (
        <>
          <section>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium">
              <img src="/assets/images/RoleManagement/item.svg" alt="" />

              <p className="dark:text-white">Reach Player level 2 to unlock</p>
              <span className="font-bold dark:text-white"> Trainer </span>
            </div>
          </section>
        </>
      ) : null}

      {!!playerEvaluation.auraLevel && playerEvaluation.auraLevel >= 2 && (
        <section className="mt-auto flex justify-end text-black dark:text-white">
          {hasTrainerRole ? (
            <button
              onClick={() => dispatch(toggleTrainerRole())}
              className="btn btn--outlined btn--small"
            >
              Hide
            </button>
          ) : (
            <button
              className="btn btn--small !bg-pl2"
              onClick={() => dispatch(toggleTrainerRole())}
            >
              Show
            </button>
          )}
        </section>
      )}
    </div>
  );
};

const ManagerCard: FC<SubjectIdProps> = ({ subjectId }) => {
  const managerEvaluation = useSubjectVerifications(
    subjectId,
    EvaluationCategory.MANAGER,
  );

  const trainerEvaluation = useSubjectVerifications(
    subjectId,
    EvaluationCategory.TRAINER,
  );

  const hasManagerRole = useSelector(selectHasManagerRole);

  const dispatch = useDispatch();

  return (
    <div className="relative flex min-h-[150px] cursor-pointer flex-col gap-3.5 rounded-lg bg-white-90-card py-[18px] pb-4 pl-5 pr-6 dark:bg-button-primary">
      <img
        src="/assets/images/RoleManagement/manager-shadow-icon.svg"
        alt=""
        className="absolute left-0 top-0"
      />
      <section className="flex justify-between">
        <div className="flex gap-2">
          <img src="/assets/images/Shared/manager.svg" alt="" />
          <div>
            <p className="text-[20px] font-medium dark:text-white">Manager</p>
          </div>
        </div>
        <PlayerLevelAndScore
          loading={managerEvaluation.loading}
          level={managerEvaluation.auraLevel}
          score={managerEvaluation.auraScore}
          color="text-gray50"
        />
      </section>
      {!trainerEvaluation.auraLevel || trainerEvaluation.auraLevel < 1 ? (
        <>
          <section>
            <div className="mt-2 flex items-center gap-2 text-sm font-medium">
              <img src="/assets/images/RoleManagement/item.svg" alt="" />

              <p className="dark:text-white">Reach Trainer level 1 to unlock</p>
              <span className="font-bold dark:text-white"> Manager </span>
            </div>
          </section>
        </>
      ) : null}
      {!!trainerEvaluation.auraLevel && trainerEvaluation.auraLevel > 1 && (
        <section className="mt-auto flex justify-end text-black dark:text-white">
          {hasManagerRole ? (
            <button
              onClick={() => dispatch(toggleManagerRole())}
              className="btn btn--outlined btn--small"
            >
              Hide
            </button>
          ) : (
            <button
              className="btn btn--small !bg-pl2"
              onClick={() => dispatch(toggleManagerRole())}
            >
              Show
            </button>
          )}
        </section>
      )}
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
      className={`flex h-fit min-w-[90px] items-center justify-between gap-1.5 rounded bg-gray00 py-1.5 pl-2.5 pr-2 ${color}`}
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
