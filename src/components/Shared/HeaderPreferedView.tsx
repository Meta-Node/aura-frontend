import { selectHasManagerRole, selectTrainerRole } from 'BrightID/actions';
import { useOutboundEvaluationsContext } from 'contexts/SubjectOutboundEvaluationsContext';
import { useSubjectVerifications } from 'hooks/useSubjectVerifications';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectAuthData } from 'store/profile/selectors';

import {
  getViewModeBackgroundColorClass,
  preferredViewIcon,
  subjectViewAsIcon,
  viewModeSubjectBackgroundColorClass,
} from '../../constants';
import useViewMode from '../../hooks/useViewMode';
import { EvaluationCategory, PreferredView } from '../../types/dashboard';
import Tooltip from './Tooltip';

const views = [
  EvaluationCategory.SUBJECT,
  EvaluationCategory.PLAYER,
  EvaluationCategory.TRAINER,
  EvaluationCategory.MANAGER,
];

const viewsLabel = {
  [EvaluationCategory.MANAGER]: 'Manager',
  [EvaluationCategory.PLAYER]: 'Player',
  [EvaluationCategory.TRAINER]: 'Trainer',
  [EvaluationCategory.SUBJECT]: 'Subject',
};

export const HeaderPreferedView = {
  ProfileHeaderViews: ({ subjectId }: { subjectId: string }) => {
    const { updateViewAs, currentViewMode, currentEvaluationCategory } =
      useViewMode();

    const playerEvaluation = useSubjectVerifications(
      subjectId,
      EvaluationCategory.PLAYER,
    );

    const trainerEvaluation = useSubjectVerifications(
      subjectId,
      EvaluationCategory.TRAINER,
    );

    const managerEvaluation = useSubjectVerifications(
      subjectId,
      EvaluationCategory.MANAGER,
    );

    const authorizedTabs = React.useMemo(() => {
      const tabs = [EvaluationCategory.SUBJECT];

      if (playerEvaluation.auraLevel && playerEvaluation.auraLevel > 0)
        tabs.push(EvaluationCategory.PLAYER);

      if (trainerEvaluation.auraLevel && trainerEvaluation.auraLevel > 0)
        tabs.push(EvaluationCategory.TRAINER);

      if (managerEvaluation.auraLevel && managerEvaluation.auraLevel > 0)
        tabs.push(EvaluationCategory.MANAGER);

      return tabs;
    }, [playerEvaluation, trainerEvaluation, managerEvaluation]);

    const isLoading =
      managerEvaluation.loading ||
      trainerEvaluation.loading ||
      playerEvaluation.loading;

    return (
      <>
        {isLoading
          ? views.map((_, key) => (
              <div
                key={key}
                className={`p-1 rounded animate-pulse bg-gray100 ml-2 cursor-pointer`}
              >
                <div className="w-4 h-4"></div>
              </div>
            ))
          : authorizedTabs.map((subjectViewMode) => (
              <Tooltip
                className={`p-1 rounded ${
                  currentEvaluationCategory === subjectViewMode
                    ? viewModeSubjectBackgroundColorClass[currentViewMode]
                    : 'bg-gray100'
                } ml-2 cursor-pointer`}
                position="bottom"
                key={subjectViewMode}
                content={viewsLabel[subjectViewMode]}
                onClick={() => updateViewAs(subjectViewMode)}
              >
                <img
                  className="w-4 h-4"
                  src={subjectViewAsIcon[subjectViewMode]}
                  alt=""
                />
              </Tooltip>
            ))}
      </>
    );
  },
  PreferedView: () => {
    const { currentViewMode, setPreferredView } = useViewMode();

    const authData = useSelector(selectAuthData);

    const hasManagerRole = useSelector(selectHasManagerRole);

    const hasTrainerRole = useSelector(selectTrainerRole);

    const subjectId = authData!.brightId;

    const { itemsFiltered: trainerActivity } = useOutboundEvaluationsContext({
      subjectId,
      evaluationCategory: EvaluationCategory.TRAINER,
    });

    const { itemsFiltered: managerActivity } = useOutboundEvaluationsContext({
      subjectId,
      evaluationCategory: EvaluationCategory.MANAGER,
    });

    const playerEvaluation = useSubjectVerifications(
      subjectId,
      EvaluationCategory.PLAYER,
    );

    const trainerEvaluation = useSubjectVerifications(
      subjectId,
      EvaluationCategory.TRAINER,
    );

    React.useEffect(() => {
      if (
        currentViewMode === PreferredView.TRAINER &&
        !trainerEvaluation.loading
      ) {
        if (
          !playerEvaluation.auraLevel ||
          playerEvaluation.auraLevel < 2 ||
          !hasTrainerRole
          // ||
          // !trainerActivity ||
          // trainerActivity.length === 0
        ) {
          setPreferredView(PreferredView.PLAYER);
        }
      } else if (
        currentViewMode === PreferredView.MANAGER_EVALUATING_TRAINER ||
        PreferredView.MANAGER_EVALUATING_MANAGER
      ) {
        if (
          !trainerEvaluation.auraLevel ||
          trainerEvaluation.auraLevel < 1 ||
          !hasManagerRole
          // ||
          // !managerActivity ||
          // managerActivity.length === 0
        ) {
          setPreferredView(PreferredView.PLAYER);
        }
      }
    }, [
      currentViewMode,
      hasManagerRole,
      hasTrainerRole,
      managerActivity,
      playerEvaluation.auraLevel,
      setPreferredView,
      trainerActivity,
      trainerEvaluation.auraLevel,
      trainerEvaluation.loading,
    ]);

    return (
      <>
        <Tooltip
          content="Player"
          className={`p-1 rounded ${
            currentViewMode === PreferredView.PLAYER
              ? getViewModeBackgroundColorClass(currentViewMode)
              : 'bg-gray100'
          } ml-2 cursor-pointer`}
          onClick={() => setPreferredView(PreferredView.PLAYER)}
        >
          <img
            className="w-4 h-4"
            src={preferredViewIcon[PreferredView.PLAYER]}
            alt=""
          />
        </Tooltip>
        {!!playerEvaluation.auraLevel &&
          playerEvaluation.auraLevel >= 2 &&
          hasTrainerRole && (
            <Tooltip
              content="Trainer"
              className={`p-1 rounded ${
                currentViewMode === PreferredView.TRAINER
                  ? getViewModeBackgroundColorClass(currentViewMode)
                  : 'bg-gray100'
              } ml-2 cursor-pointer`}
              onClick={() => setPreferredView(PreferredView.TRAINER)}
            >
              <img
                className="w-4 h-4"
                src={preferredViewIcon[PreferredView.TRAINER]}
                alt=""
              />
            </Tooltip>
          )}
        {!!trainerEvaluation.auraLevel &&
          trainerEvaluation.auraLevel >= 1 &&
          hasManagerRole && (
            <Tooltip
              content="Manager"
              className={`p-1 rounded ${
                currentViewMode === PreferredView.MANAGER_EVALUATING_TRAINER ||
                currentViewMode === PreferredView.MANAGER_EVALUATING_MANAGER
                  ? getViewModeBackgroundColorClass(currentViewMode)
                  : 'bg-gray100'
              } ml-2 cursor-pointer`}
              onClick={() =>
                setPreferredView(PreferredView.MANAGER_EVALUATING_TRAINER)
              }
            >
              <img
                className="w-4 h-4"
                src={
                  preferredViewIcon[PreferredView.MANAGER_EVALUATING_TRAINER]
                }
                alt=""
              />
            </Tooltip>
          )}
      </>
    );
  },
};
