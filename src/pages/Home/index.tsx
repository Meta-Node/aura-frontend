import { SubjectCard } from 'components/EvaluationFlow/SubjectCard';
import { SubjectListControls } from 'components/EvaluationFlow/SubjectListControls';
import { PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING } from 'constants/index';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import { SubjectInboundConnectionsContextProvider } from 'contexts/SubjectInboundConnectionsContext';
import { SubjectInboundEvaluationsContextProvider } from 'contexts/SubjectInboundEvaluationsContext';
import { SubjectOutboundEvaluationsContextProvider } from 'contexts/SubjectOutboundEvaluationsContext';
import Onboarding from 'pages/Onboarding';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RoutePath } from 'types/router';

import InfiniteScrollLocal from '../../components/InfiniteScrollLocal';
import LevelUp from '../../components/LevelUp';
import { EmptySubjectList } from '../../components/Shared/EmptyAndLoadingStates/EmptySubjectList';
import { LoadingList } from '../../components/Shared/EmptyAndLoadingStates/LoadingList';
import { HeaderPreferedView } from '../../components/Shared/HeaderPreferedView';
import { ToggleInput } from '../../components/Shared/ToggleInput';
import { useSubjectsListContext } from '../../contexts/SubjectsListContext';
import { useDispatch } from '../../store/hooks';
import { getBrightIdBackupThunk } from '../../store/profile/actions';
import {
  selectAuthData,
  selectPlayerOnboardingScreenShown,
} from '../../store/profile/selectors';
import { hash } from '../../utils/crypto';
import ProfileHeaderCard from './components/ProfileHeaderCard';
import ProfileInfoPerformance from './components/ProfileInfoPerformance';

const Home = () => {
  const color = {
    Player: 'pastel-green',
    Trainer: 'pastel-orange',
    Manager: 'pastel-blue',
  };
  const [isEvaluate, setIsEvaluate] = useState(true);
  const [query] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (query.get('tab') === 'evaluate') {
      setIsEvaluate(true);
    }

    if (query.get('tab') === 'levelup') {
      setIsEvaluate(false);
    }
  }, [query, navigate]);

  const authData = useSelector(selectAuthData);
  const {
    itemsFiltered: filteredSubjects,
    selectedFilterIds,
    clearSortAndFilter,
  } = useSubjectsListContext();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const refreshBrightIdBackup = useCallback(async () => {
    if (!authData) return;
    setLoading(true);
    const authKey = hash(authData.brightId + authData.password);
    await dispatch(getBrightIdBackupThunk({ authKey }));
    setLoading(false);
  }, [authData, dispatch]);

  const { myRatings, loading: loadingMyEvaluations } =
    useMyEvaluationsContext();
  const isLocked = useMemo(
    () =>
      !myRatings ||
      myRatings.filter((r) => Number(r.rating)).length <
        PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING,
    [myRatings],
  );

  const ratingsToBeDoneCount = useMemo(
    () =>
      myRatings
        ? Math.max(
            PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING -
              myRatings.filter((r) => Number(r.rating)).length,
            0,
          )
        : 0,
    [myRatings],
  );

  const playerOnboardingScreenShown = useSelector(
    selectPlayerOnboardingScreenShown,
  );

  if (!authData) {
    return <div>Not logged in</div>;
  }

  return !playerOnboardingScreenShown ? (
    <Onboarding />
  ) : loadingMyEvaluations ? (
    <LoadingList />
  ) : (
    <SubjectInboundEvaluationsContextProvider subjectId={authData.brightId}>
      <div id="scrollable-div" className="page flex flex-col gap-4">
        <ProfileHeaderCard subjectId={authData.brightId} />
        <ProfileInfoPerformance
          subjectId={authData.brightId}
          isPerformance={true}
          color={color.Player}
        />

        <ToggleInput
          option1={'Evaluate'}
          option2={'Level Up'}
          isChecked={isEvaluate}
          disabledHelpText={`${ratingsToBeDoneCount} more evaluation ${
            ratingsToBeDoneCount > 1 ? `s` : ''
          } to unlock Level Up`}
          setIsChecked={(isEvaluate) => {
            navigate(
              RoutePath.HOME + `?tab=${isEvaluate ? 'evaluate' : 'levelup'}`,
            );
          }}
          option2Disabled={isLocked}
        />
        {isEvaluate ? (
          <div>
            <SubjectListControls
              refreshBrightIdBackup={refreshBrightIdBackup}
            />
            {filteredSubjects && !loading ? (
              filteredSubjects.length > 0 ? (
                <div className="overflow-auto flex-grow no-scrollbar">
                  <InfiniteScrollLocal
                    getScrollParent={() =>
                      document.getElementById('scrollable-div')
                    }
                    className={'flex flex-col gap-3'}
                    items={filteredSubjects}
                    //TODO: optimize rendering by caching the rendered components
                    renderItem={(conn, index) => (
                      <SubjectCard index={index} subjectId={conn.id} />
                    )}
                  />
                </div>
              ) : (
                <EmptySubjectList
                  clearSortAndFilter={clearSortAndFilter}
                  hasFilter={selectedFilterIds !== null}
                  showConnectionGuide={true}
                />
              )
            ) : (
              <LoadingList />
            )}
          </div>
        ) : (
          <LevelUp subjectId={authData.brightId} />
        )}
      </div>
    </SubjectInboundEvaluationsContextProvider>
  );
};

export const HomeHeader = () => {
  const authData = useSelector(selectAuthData);
  const subjectId = authData?.brightId;
  return (
    <>
      Home
      <SubjectOutboundEvaluationsContextProvider subjectId={subjectId!}>
        <SubjectInboundEvaluationsContextProvider subjectId={subjectId!}>
          <SubjectInboundConnectionsContextProvider subjectId={subjectId!}>
            <HeaderPreferedView.PreferedView />
          </SubjectInboundConnectionsContextProvider>
        </SubjectInboundEvaluationsContextProvider>
      </SubjectOutboundEvaluationsContextProvider>
    </>
  );
};

export default Home;
