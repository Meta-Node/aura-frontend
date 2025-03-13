import CredibilityDetailsModal from 'components/CredibilityDetailsModal';
import EvaluateOverlayCard from 'components/EvaluationFlow/EvaluateOverlayCard';
import EvaluationFlow from 'components/EvaluationFlow/EvaluationFlow';
import InfiniteScrollLocal from 'components/InfiniteScrollLocal';
import Modal from 'components/Shared/Modal';
import ProfileEvaluation from 'components/Shared/ProfileEvaluation/ProfileEvaluation';
import {
  SubjectInboundEvaluationsContextProvider,
  useSubjectInboundEvaluationsContext,
} from 'contexts/SubjectInboundEvaluationsContext';
import {
  SubjectOutboundEvaluationsContextProvider,
  useOutboundEvaluationsContext,
} from 'contexts/SubjectOutboundEvaluationsContext';
import { useMyEvaluations } from 'hooks/useMyEvaluations';
import useViewMode from 'hooks/useViewMode';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import {
  EvaluationCategory,
  EvidenceViewMode,
  PreferredView,
  ProfileTab,
} from 'types/dashboard';
import { __DEV__ } from 'utils/env';

import { EmptyActivitiesList } from 'components/Shared/EmptyAndLoadingStates/EmptyActivitiesList';
import { EmptyEvaluationsList } from 'components/Shared/EmptyAndLoadingStates/EmptyEvaluationsList';
import { EmptySubjectList } from 'components/Shared/EmptyAndLoadingStates/EmptySubjectList';
import { LoadingList } from 'components/Shared/EmptyAndLoadingStates/LoadingList';
import { ProfileInfo } from 'components/Shared/ProfileInfo';
import ProfileOverview from 'components/Shared/ProfileOverview';
import { viewModeToSubjectViewMode, viewModeToViewAs } from 'constants/index';
import {
  SubjectInboundConnectionsContextProvider,
  useSubjectInboundConnectionsContext,
} from 'contexts/SubjectInboundConnectionsContext';
import { selectAuthData } from 'store/profile/selectors';
import { CredibilityDetailsProps } from 'types';
import { ConnectionListSearch } from './components/connection-list-search';
import EvidenceHelpModal from './components/evidence-help-modal';
import { ConnectionLevel } from './components/connection-level';
import { ActivityListSearch } from './components/activity-list-search';
import { EvidenceListSearch } from './components/evidence-list-search';
import SubjectProfileHeader from './components/header';
import { ArrowDownLeft, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const ProfileTabs = ({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: ProfileTab;
  setSelectedTab: (value: ProfileTab) => void;
}) => {
  const { currentViewMode } = useViewMode();
  return (
    <div
      className={`min-h-[52px] w-full rounded-lg border bg-white-90-card px-1.5 py-1.5 dark:bg-dark-primary`}
    >
      <div
        className={`flex h-full min-w-full flex-row gap-1.5`}
        // TODO: refactor this to tailwindcss class and values
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#C9A2FF rgba(209, 213, 219, 0.5)',
        }}
      >
        <button
          onClick={() => setSelectedTab(ProfileTab.OVERVIEW)}
          data-testid="table-view-switch-option-one"
          className={`flex h-full w-full min-w-[100px] cursor-pointer items-center justify-center rounded-md transition-all duration-300 ease-in-out ${
            selectedTab === ProfileTab.OVERVIEW
              ? 'background bg-button-primary font-bold text-white dark:bg-slate-200 dark:text-black'
              : 'bg-transparent font-medium text-black dark:text-white'
          }`}
        >
          Overview
        </button>
        {currentViewMode === PreferredView.PLAYER ? (
          <button
            className={`flex h-full w-full min-w-[100px] cursor-pointer items-center justify-center rounded-md transition-all duration-300 ease-in-out ${
              selectedTab === ProfileTab.CONNECTIONS
                ? 'background bg-button-primary font-bold text-white dark:bg-slate-200 dark:text-black'
                : 'bg-transparent font-medium text-black dark:text-white'
            }`}
            onClick={() => setSelectedTab(ProfileTab.CONNECTIONS)}
            data-testid="table-view-switch-option-one"
          >
            <ArrowDownRight className="mr-1 h-4 w-4" />
            Connections
          </button>
        ) : (
          <button
            className={`flex h-full w-full min-w-[100px] cursor-pointer items-center justify-center rounded-md transition-all duration-300 ease-in-out ${
              selectedTab === ProfileTab.ACTIVITY ||
              selectedTab === ProfileTab.ACTIVITY_ON_MANAGERS
                ? 'background bg-button-primary font-bold text-white dark:bg-slate-200 dark:text-black'
                : 'bg-transparent font-medium text-black dark:text-white'
            }`}
            onClick={() => setSelectedTab(ProfileTab.ACTIVITY)}
            data-testid="table-view-switch-option-one"
          >
            <ArrowDownLeft className="mr-1 h-4 w-4" />
            Activity
          </button>
        )}
        <button
          className={`flex w-full min-w-[100px] cursor-pointer items-center justify-center rounded-md transition-all duration-300 ease-in-out ${
            selectedTab === ProfileTab.EVALUATIONS
              ? 'background bg-button-primary font-bold text-white dark:bg-slate-200 dark:text-black'
              : 'bg-transparent font-medium text-black dark:text-white'
          }`}
          onClick={() => setSelectedTab(ProfileTab.EVALUATIONS)}
          data-testid="table-view-switch-option-two"
        >
          <ArrowUpRight className="mr-1 h-4 w-4" />
          Evaluations
        </button>
      </div>
    </div>
  );
};

const connectionLevelPriority: {
  [key in ConnectionLevel | 'aura only']: number;
} = {
  'already known': 1,
  recovery: 2,
  'just met': 3,
  'aura only': 4,
  suspicious: 5,
  reported: 6,
};

const SubjectProfileBody = ({ subjectId }: { subjectId: string }) => {
  const [selectedTab, setSelectedTab] = useState(ProfileTab.OVERVIEW);

  const [query] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const tabFromQuery = query.get('tab') as ProfileTab | null;
    if (tabFromQuery && Object.values(ProfileTab).includes(tabFromQuery)) {
      setSelectedTab(tabFromQuery);
    }
  }, [query, navigate]);

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [showEvaluateOverlayCard, setShowEvaluateOverlayCard] = useState(false);
  const [credibilityDetailsProps, setCredibilityDetailsProps] =
    useState<CredibilityDetailsProps | null>(null);
  const handleScroll = () => {
    const scrollPosition =
      document.getElementsByClassName('page')[0]?.scrollTop; // => scroll position
    if (scrollPosition > 100) {
      setShowEvaluateOverlayCard(true);
    } else {
      setShowEvaluateOverlayCard(false);
    }
  };

  useEffect(() => {
    handleScroll();
    document
      .getElementsByClassName('page')[0]
      ?.addEventListener('scroll', handleScroll);
    return () => {
      document
        .getElementsByClassName('page')[0]
        ?.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const {
    currentViewMode,
    currentEvaluationCategory,
    currentRoleEvaluatorEvaluationCategory,
  } = useViewMode();

  const {
    itemsFiltered: evaluations,
    loading: loadingInboundEvaluations,
    selectedFilterIds: inboundEvaluationsSelectedFilterId,
    clearSortAndFilter: clearInboundEvaluationsSortAndFilter,
    searchString: evaluationSearchString,
  } = useSubjectInboundEvaluationsContext({
    subjectId,
    evaluationCategory: currentEvaluationCategory,
  });
  const { loading, myConnections } = useMyEvaluations();

  const {
    itemsFiltered: connections,
    loading: loadingInboundConnections,
    selectedFilterIds: inboundConnectionsSelectedFilterId,
    clearSortAndFilter: clearInboundConnectionsSortAndFilter,
    selectedSort,
    selectedFilters,
    searchString,
  } = useSubjectInboundConnectionsContext({
    subjectId,
    evaluationCategory: currentEvaluationCategory,
  });

  const {
    itemsFiltered: outboundEvaluations,
    loading: loadingOutboundEvaluations,
    selectedFilterIds: outboundEvaluationsSelectedFilterId,
    clearSortAndFilter: clearOutboundEvaluationsSortAndFilter,
    searchString: activitySearchString,
  } = useOutboundEvaluationsContext({
    subjectId,
    evaluationCategory:
      selectedTab === ProfileTab.ACTIVITY_ON_MANAGERS
        ? EvaluationCategory.MANAGER
        : viewModeToViewAs[viewModeToSubjectViewMode[currentViewMode]],
  });

  const evaluators = useMemo(() => {
    return (
      evaluations
        ?.filter((e) => e.rating && Number(e.rating.rating))
        .map((e) => e.fromSubjectId) || []
    );
  }, [evaluations]);

  const connectionIds = useMemo(() => {
    if (selectedSort || selectedFilters)
      return connections?.map((e) => e.fromSubjectId) || [];

    const myConnectionsMap =
      myConnections?.reduce(
        (prev, curr) => {
          prev[curr.id] = true;

          return prev;
        },

        {} as { [key: string]: boolean },
      ) ?? {};

    return (
      connections
        ?.sort((a, b) => {
          const levelA = a.inboundConnection?.level;
          const levelB = b.inboundConnection?.level;

          const priorityA =
            (levelA ? connectionLevelPriority[levelA] * 2 : Infinity) +
            (a.inboundConnection?.id && myConnectionsMap[a.inboundConnection.id]
              ? -1
              : 0);

          const priorityB =
            (levelB ? connectionLevelPriority[levelB] * 2 : Infinity) +
            (b.inboundConnection?.id && myConnectionsMap[b.inboundConnection.id]
              ? -1
              : 0);

          if (priorityA === priorityB) {
            const timestampA = a.inboundConnection?.timestamp || 0;
            const timestampB = b.inboundConnection?.timestamp || 0;

            return timestampB - timestampA;
          }

          return priorityA - priorityB;
        })
        .map((e) => e.fromSubjectId) || []
    );
  }, [selectedSort, selectedFilters, connections, myConnections]);

  const evaluateds = useMemo(() => {
    return (
      outboundEvaluations
        ?.filter((e) => e.rating && Number(e.rating.rating))
        .map((e) => e.toSubjectId) || []
    );
  }, [outboundEvaluations]);

  const [showEvaluationFlow, setShowEvaluationFlow] = useState(false);

  useEffect(() => {
    if (currentViewMode === PreferredView.PLAYER) {
      if (
        ![
          ProfileTab.OVERVIEW,
          ProfileTab.EVALUATIONS,
          ProfileTab.CONNECTIONS,
        ].includes(selectedTab)
      ) {
        setSelectedTab(ProfileTab.OVERVIEW);
      }
      return;
    }
    if (
      !(
        currentViewMode === PreferredView.MANAGER_EVALUATING_MANAGER &&
        selectedTab === ProfileTab.ACTIVITY_ON_MANAGERS
      ) &&
      ![
        ProfileTab.OVERVIEW,
        ProfileTab.EVALUATIONS,
        ProfileTab.ACTIVITY,
      ].includes(selectedTab)
    ) {
      setSelectedTab(ProfileTab.OVERVIEW);
    }
  }, [currentViewMode, selectedTab]);

  return (
    <div className="page page__dashboard flex flex-col gap-y-4 overflow-x-hidden">
      {selectedTab !== ProfileTab.OVERVIEW && showEvaluateOverlayCard && (
        <EvaluateOverlayCard
          className={`absolute left-1/2 top-24 z-20 min-h-[89px] w-full max-w-[370px] -translate-x-1/2 md:w-[calc(100vw-40px)]`}
          subjectId={subjectId}
          setShowEvaluationFlow={setShowEvaluationFlow}
        />
      )}

      <ProfileInfo
        subjectId={subjectId}
        setShowEvaluationFlow={setShowEvaluationFlow}
        setSelectedTab={setSelectedTab}
      />

      {__DEV__ && <ConnectionLevel subjectId={subjectId} />}

      {/*{loadingMyEvaluation ? (*/}
      {/*  <div className="card flex flex-col gap-2.5">...</div>*/}
      {/*) : isEvaluated ? (*/}
      {/*  <YourEvaluation*/}
      {/*    subjectId={subjectId}*/}
      {/*    setShowEvaluationFlow={setShowEvaluationFlow}*/}
      {/*  />*/}
      {/*) : (*/}
      {/*  <NewEvaluationCard*/}
      {/*    subjectId={subjectId}*/}
      {/*    setShowEvaluationFlow={setShowEvaluationFlow}*/}
      {/*  />*/}
      {/*)}*/}
      {/* if role is not player then show activities card */}
      <Modal
        title="Help: Understanding the Evidence Section"
        isOpen={isHelpModalOpen}
        closeModalHandler={() => setIsHelpModalOpen(false)}
      >
        <EvidenceHelpModal />
      </Modal>
      <div className="-mb-1 flex items-center gap-2">
        <p className="text-lg font-bold">Evidence</p>
        <img
          onClick={() => setIsHelpModalOpen(true)}
          className="h-5 w-5 cursor-pointer"
          src="/assets/images/SubjectProfile/evidence-info-icon.svg"
          alt=""
        />
      </div>
      <ProfileTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {selectedTab === ProfileTab.OVERVIEW ? (
        <ProfileOverview
          subjectId={subjectId}
          showEvidenceList={() => setSelectedTab(ProfileTab.EVALUATIONS)}
          setCredibilityDetailsProps={setCredibilityDetailsProps}
          viewMode={currentViewMode}
        />
      ) : selectedTab === ProfileTab.ACTIVITY ||
        selectedTab === ProfileTab.ACTIVITY_ON_MANAGERS ? (
        <>
          <ActivityListSearch
            subjectId={subjectId}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          {loadingOutboundEvaluations ? (
            <LoadingList />
          ) : evaluateds.length > 0 ? (
            <InfiniteScrollLocal
              className={'-mb-5 flex h-full w-full flex-col gap-2.5 pb-5'}
              items={evaluateds}
              renderItem={(evaluated) => (
                <ProfileEvaluation
                  evidenceViewMode={
                    selectedTab === ProfileTab.ACTIVITY
                      ? EvidenceViewMode.OUTBOUND_ACTIVITY
                      : EvidenceViewMode.OUTBOUND_ACTIVITY_ON_MANAGERS
                  }
                  onClick={() =>
                    setCredibilityDetailsProps({
                      subjectId: evaluated,
                      evaluationCategory:
                        selectedTab === ProfileTab.ACTIVITY_ON_MANAGERS
                          ? EvaluationCategory.MANAGER
                          : viewModeToViewAs[
                              viewModeToSubjectViewMode[currentViewMode]
                            ],
                    })
                  }
                  key={evaluated}
                  fromSubjectId={subjectId}
                  toSubjectId={evaluated}
                />
              )}
            />
          ) : (
            <EmptyActivitiesList
              searchString={activitySearchString}
              hasFilter={outboundEvaluationsSelectedFilterId !== null}
              clearSortAndFilter={clearOutboundEvaluationsSortAndFilter}
            />
          )}
        </>
      ) : selectedTab === ProfileTab.EVALUATIONS ? (
        <>
          <EvidenceListSearch subjectId={subjectId} />
          {loadingInboundEvaluations ? (
            <LoadingList />
          ) : evaluators.length > 0 ? (
            <InfiniteScrollLocal
              className={'-mb-5 flex h-full w-full flex-col gap-2.5 pb-5'}
              items={evaluators}
              renderItem={(evaluator) => {
                return (
                  <ProfileEvaluation
                    evidenceViewMode={EvidenceViewMode.INBOUND_EVALUATION}
                    onClick={() =>
                      setCredibilityDetailsProps({
                        subjectId: evaluator,
                        evaluationCategory:
                          currentRoleEvaluatorEvaluationCategory,
                      })
                    }
                    key={evaluator}
                    fromSubjectId={evaluator}
                    toSubjectId={subjectId}
                  />
                );
              }}
            />
          ) : (
            <EmptyEvaluationsList
              searchString={evaluationSearchString}
              hasFilter={inboundEvaluationsSelectedFilterId !== null}
              clearFilter={clearInboundEvaluationsSortAndFilter}
            />
          )}
        </>
      ) : (
        <>
          <ConnectionListSearch subjectId={subjectId} />
          {loadingInboundConnections ? (
            <LoadingList />
          ) : connectionIds.length > 0 ? (
            <InfiniteScrollLocal
              className={'-mb-5 flex h-full w-full flex-col gap-2.5 pb-5'}
              items={connectionIds}
              renderItem={(connectionId) => (
                <ProfileEvaluation
                  evidenceViewMode={EvidenceViewMode.INBOUND_CONNECTION}
                  onClick={() =>
                    setCredibilityDetailsProps({
                      subjectId: connectionId,
                      evaluationCategory: EvaluationCategory.SUBJECT,
                    })
                  }
                  key={connectionId}
                  fromSubjectId={connectionId}
                  toSubjectId={subjectId}
                />
              )}
            />
          ) : (
            <EmptySubjectList
              searchString={searchString}
              hasFilter={inboundConnectionsSelectedFilterId !== null}
              clearSortAndFilter={clearInboundConnectionsSortAndFilter}
            />
          )}
        </>
      )}
      <EvaluationFlow
        showEvaluationFlow={showEvaluationFlow}
        setShowEvaluationFlow={setShowEvaluationFlow}
        subjectId={subjectId}
      />
      {credibilityDetailsProps && (
        <CredibilityDetailsModal
          onClose={() => setCredibilityDetailsProps(null)}
          credibilityDetailsProps={credibilityDetailsProps}
        />
      )}
    </div>
  );
};
const SubjectProfile = () => {
  const { id } = useParams();
  const authData = useSelector(selectAuthData);
  const subjectId = useMemo(
    () => id ?? authData?.brightId,
    [authData?.brightId, id],
  );

  return !subjectId ? (
    <div>Unknown subject id</div>
  ) : (
    <SubjectOutboundEvaluationsContextProvider subjectId={subjectId}>
      <SubjectInboundEvaluationsContextProvider subjectId={subjectId}>
        <SubjectInboundConnectionsContextProvider subjectId={subjectId}>
          <SubjectProfileHeader />
          <SubjectProfileBody subjectId={subjectId} />
        </SubjectInboundConnectionsContextProvider>
      </SubjectInboundEvaluationsContextProvider>
    </SubjectOutboundEvaluationsContextProvider>
  );
};

export default SubjectProfile;
