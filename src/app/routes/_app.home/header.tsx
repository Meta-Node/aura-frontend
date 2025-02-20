import { selectManagerRoleState, selectTrainerRoleState, RoleStatus, toggleSearchModal } from "@/BrightID/actions";
import Tooltip from "@/components/Shared/Tooltip";
import { getViewModeBackgroundColorClass, preferredViewIcon } from "@/constants";
import { SubjectInboundConnectionsContextProvider } from "@/contexts/SubjectInboundConnectionsContext";
import { SubjectInboundEvaluationsContextProvider } from "@/contexts/SubjectInboundEvaluationsContext";
import { SubjectOutboundEvaluationsContextProvider, useOutboundEvaluationsContext } from "@/contexts/SubjectOutboundEvaluationsContext";
import { useSubjectVerifications } from "@/hooks/useSubjectVerifications";
import useViewMode from "@/hooks/useViewMode";
import { useDispatch } from "@/store/hooks";
import { selectAuthData } from "@/store/profile/selectors";
import { PreferredView, EvaluationCategory } from "@/types/dashboard";
import { RoutePath } from "@/types/router";
import { useEffect } from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";


const ViewTooltip = ({
  view,
  content,
  condition,
}: {
  view: PreferredView;
  content: string;
  condition: boolean;
}) => {
  const { setPreferredView, currentViewMode } = useViewMode();

  if (!condition) return null;

  return (
    <Tooltip
      content={content}
      className={`p-1 rounded ${currentViewMode === view
        ? getViewModeBackgroundColorClass(currentViewMode)
        : 'bg-gray100'
        } ml-2 cursor-pointer`}
      onClick={() => setPreferredView(view)}
    >
      <img className="w-4 h-4" src={preferredViewIcon[view]} alt="" />
    </Tooltip>
  );
};


function HomeHeaderItems() {
  const { currentViewMode, setPreferredView } = useViewMode();

  const authData = useSelector(selectAuthData);

  const managerRole = useSelector(selectManagerRoleState);

  const trainerRole = useSelector(selectTrainerRoleState);

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

  const shouldNavigateToPlayerFromTrainer =
    currentViewMode === PreferredView.TRAINER &&
    !trainerEvaluation.loading &&
    (!playerEvaluation.auraLevel ||
      playerEvaluation.auraLevel < 2 ||
      (trainerRole === RoleStatus.NOT_SET &&
        (!trainerActivity || trainerActivity.length === 0)));

  const shouldNavigateToPlayerFromManager =
    (currentViewMode === PreferredView.MANAGER_EVALUATING_TRAINER ||
      currentViewMode === PreferredView.MANAGER_EVALUATING_MANAGER) &&
    (!trainerEvaluation.auraLevel ||
      trainerEvaluation.auraLevel < 1 ||
      (managerRole === RoleStatus.NOT_SET &&
        (!managerActivity || managerActivity.length === 0)));

  const canShowTrainerTooltip =
    !!playerEvaluation.auraLevel &&
    playerEvaluation.auraLevel >= 2 &&
    (trainerRole === RoleStatus.SHOW ||
      (trainerRole === RoleStatus.NOT_SET &&
        (trainerActivity?.length ?? 0) > 0));

  const canShowManagerTooltip =
    !!trainerEvaluation.auraLevel &&
    trainerEvaluation.auraLevel >= 1 &&
    (managerRole === RoleStatus.SHOW ||
      (managerRole === RoleStatus.NOT_SET &&
        (managerActivity?.length ?? 0) > 0));

  useEffect(() => {
    if (
      shouldNavigateToPlayerFromTrainer ||
      shouldNavigateToPlayerFromManager
    ) {
      setPreferredView(PreferredView.PLAYER);
    }
  }, [
    shouldNavigateToPlayerFromTrainer,
    shouldNavigateToPlayerFromManager,
    setPreferredView,
  ]);

  return (
    <>
      <ViewTooltip
        view={PreferredView.PLAYER}
        content="Player"
        condition={true}
      />
      <ViewTooltip
        view={PreferredView.TRAINER}
        content="Trainer"
        condition={canShowTrainerTooltip}
      />
      <ViewTooltip
        view={PreferredView.MANAGER_EVALUATING_TRAINER}
        content="Manager"
        condition={canShowManagerTooltip}
      />
    </>
  );
}


export const HeaderBody = () => {
  const authData = useSelector(selectAuthData);
  const subjectId = authData?.brightId;

  if (!subjectId) return null;

  return (
    <>
      <Link to={RoutePath.HOME} className="flex items-center gap-1 mr-2">
        <FaHome size={20} />
        <span className="text-xl font-semibold">
          Home
        </span>
      </Link>

      <SubjectOutboundEvaluationsContextProvider subjectId={subjectId}>
        <SubjectInboundEvaluationsContextProvider subjectId={subjectId}>
          <SubjectInboundConnectionsContextProvider subjectId={subjectId}>
            <HomeHeaderItems />
          </SubjectInboundConnectionsContextProvider>
        </SubjectInboundEvaluationsContextProvider>
      </SubjectOutboundEvaluationsContextProvider>
    </>
  );
};


export default function HomeHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2.5 px-1 md:px-6 pt-9">
      <header className="header pb-4 flex-wrap flex justify-between">
        <div className="header-left flex-wrap items-center flex ">
          <HeaderBody />
        </div>
        <span className="header-right flex items-center">
          <button
            key="/assets/images/Header/search.svg"
            onClick={() => dispatch(toggleSearchModal())}
            className="header-icon text-gray-300 dark:text-white mr-4"
            data-testid="nav-button"
          >
            <FaSearch size={20} />
          </button>
          <span
            key="/assets/images/Header/settings.svg"
            onClick={() => navigate(RoutePath.SETTINGS)}
            className="header-icon !cursor-pointer"
            data-testid="nav-button"
          >
            <img
              key="/assets/images/Header/settings.svg"
              className="w-6 h-6"
              src="/assets/images/Header/settings.svg"
              alt={''}
            />
          </span>
        </span>
      </header>
    </div>
  )
}
