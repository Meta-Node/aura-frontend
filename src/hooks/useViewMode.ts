import { viewAsToViewMode } from 'constants/index';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'store/hooks';
import { setPreferredView as setPreferredViewAction } from 'store/profile';
import { selectPreferredView } from 'store/profile/selectors';
import { EvaluationCategory, PreferredView } from 'types/dashboard';

export default function useViewMode() {
  const preferredViewMode = useSelector(selectPreferredView);
  const [query] = useSearchParams();
  const currentViewMode = useMemo(() => {
    const viewAs = query.get('viewas');
    if (
      viewAs &&
      (Object.values(EvaluationCategory) as string[]).includes(viewAs)
    ) {
      return viewAsToViewMode[viewAs as EvaluationCategory];
    }
    return preferredViewMode;
  }, [preferredViewMode, query]);
  const dispatch = useDispatch();
  const setPreferredView = useCallback(
    (value: PreferredView) => {
      dispatch(setPreferredViewAction(value));
    },
    [dispatch],
  );

  const subjectViewModeTitle = useMemo(
    () =>
      ({
        [PreferredView.PLAYER]: 'Subject',
        [PreferredView.TRAINER]: 'Player',
        [PreferredView.MANAGER_EVALUATING_TRAINER]: 'Trainer',
        [PreferredView.MANAGER_EVALUATING_MANAGER]: 'Manager',
      }[currentViewMode]),
    [currentViewMode],
  );

  const location = useLocation();
  const navigate = useNavigate();
  const updateViewAs = (value: EvaluationCategory) => {
    // Create a new URLSearchParams object based on the current query string
    const searchParams = new URLSearchParams(location.search);

    // Set the new or update the existing query parameter
    searchParams.set('viewas', value);

    // Navigate to the same route with the new query string
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  return {
    currentViewMode,
    updateViewAs,
    setPreferredView,
    subjectViewModeTitle,
  };
}
