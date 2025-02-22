import DefaultHeader from "@/components/Shared/DefaultHeader";
import Tooltip from "@/components/Shared/Tooltip";
import { viewModeSubjectBackgroundColorClass, subjectViewAsIcon } from "@/constants";
import { useOutboundEvaluations } from "@/hooks/useSubjectEvaluations";
import useViewMode from "@/hooks/useViewMode";
import { selectAuthData } from "@/store/profile/selectors";
import { EvaluationCategory } from "@/types/dashboard";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

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

export default function SubjectProfileHeader() {
  const { subjectViewModeTitle } = useViewMode();
  const params = useParams();

  const authData = useSelector(selectAuthData);

  const subjectIdProp = params["id"];
  console.log(params)

  const subjectId = useMemo(
    () => subjectIdProp ?? authData?.brightId,
    [authData?.brightId, subjectIdProp],
  );

  if (!subjectId) return null;

  return (
    <DefaultHeader title={`${subjectViewModeTitle} Profile`}>

      <SubjectHeaderBody subjectId={subjectId} />
    </DefaultHeader>
  );
};

export function SubjectHeaderBody({ subjectId }: { subjectId: string }) {
  const { updateViewAs, currentViewMode, currentEvaluationCategory } =
    useViewMode();

  const playerActivity = useOutboundEvaluations({
    subjectId,
    evaluationCategory: EvaluationCategory.PLAYER,
  });

  const trainerActivity = useOutboundEvaluations({
    subjectId,
    evaluationCategory: EvaluationCategory.TRAINER,
  });

  const managerActivity = useOutboundEvaluations({
    subjectId,
    evaluationCategory: EvaluationCategory.MANAGER,
  });

  const authorizedTabs = useMemo(() => {
    const tabs = [EvaluationCategory.SUBJECT];

    if ((playerActivity.ratings?.length ?? 0) > 0)
      tabs.push(EvaluationCategory.PLAYER);

    if ((trainerActivity.ratings?.length ?? 0) > 0)
      tabs.push(EvaluationCategory.TRAINER);

    if ((managerActivity.ratings?.length ?? 0) > 0)
      tabs.push(EvaluationCategory.MANAGER);

    return tabs;
  }, [playerActivity, trainerActivity, managerActivity]);

  const isLoading =
    managerActivity.loading ||
    trainerActivity.loading ||
    playerActivity.loading;

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
            className={`p-1 rounded ${currentEvaluationCategory === subjectViewMode
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
}