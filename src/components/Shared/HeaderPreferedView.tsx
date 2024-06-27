import * as React from 'react';

import {
  getViewModeBackgroundColorClass,
  preferredViewIcon,
  subjectViewAsIcon,
  viewModeSubjectBackgroundColorClass,
  viewModeToViewAs,
} from '../../constants';
import useViewMode from '../../hooks/useViewMode';
import { EvaluationCategory, PreferredView } from '../../types/dashboard';

export const HeaderPreferedView = {
  ProfileHeaderViews: () => {
    const { updateViewAs, currentViewMode } = useViewMode();

    const views = [
      EvaluationCategory.SUBJECT,
      EvaluationCategory.PLAYER,
      EvaluationCategory.TRAINER,
      EvaluationCategory.MANAGER,
    ];

    return (
      <>
        {views.map((subjectViewMode) => (
          <div
            className={`p-1 rounded ${
              viewModeToViewAs[currentViewMode] === subjectViewMode
                ? viewModeSubjectBackgroundColorClass[currentViewMode]
                : 'bg-gray100'
            } ml-2 cursor-pointer`}
            key={subjectViewMode}
            onClick={() => updateViewAs(subjectViewMode)}
          >
            <img
              className="w-4 h-4"
              src={subjectViewAsIcon[subjectViewMode]}
              alt=""
            />
          </div>
        ))}
      </>
    );
  },
  PreferedView: () => {
    const { currentViewMode, setPreferredView } = useViewMode();

    return (
      <>
        <div
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
        </div>
        <div
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
        </div>
        <div
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
            src={preferredViewIcon[PreferredView.MANAGER_EVALUATING_TRAINER]}
            alt=""
          />
        </div>
      </>
    );
  },
};
