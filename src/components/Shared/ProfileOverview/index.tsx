import ActivitiesCard from 'components/Shared/ActivitiesCard';
import { useSubjectInboundEvaluationsContext } from 'contexts/SubjectInboundEvaluationsContext';
import ReactECharts from 'echarts-for-react';
import { AuraFilterId } from 'hooks/useFilters';
import {
  useImpactEChartOption,
  useSubjectVerifications,
  useTotalImpact,
} from 'hooks/useSubjectVerifications';
import useViewMode from 'hooks/useViewMode';
import LevelProgress from 'pages/Home/components/LevelProgress';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { selectAuthData } from 'store/profile/selectors';
import { PreferredView, ProfileTab } from 'types/dashboard';

import {
  viewModeToEvaluatorViewMode,
  viewModeToString,
  viewModeToViewAs,
} from '../../../constants';
import { CredibilityDetailsProps } from '../../../types';
import { compactFormat } from '../../../utils/number';

const ProfileOverview = ({
  subjectId,
  title = '',
  showEvidenceList,
  hasHeader = false,
  setCredibilityDetailsProps,
  onFindEvaluatorsButtonClick,
  viewMode,
  isMyPerformance,
}: {
  subjectId: string;
  showEvidenceList?: () => void;
  hasHeader?: boolean;
  title?: string;
  setCredibilityDetailsProps: (
    credibilityDetailsProps: CredibilityDetailsProps,
  ) => void;
  onFindEvaluatorsButtonClick?: () => void;
  viewMode: PreferredView;
  isMyPerformance?: boolean;
}) => {
  const location = useLocation();
  const {
    ratings: inboundRatings,
    inboundRatingsStatsString,
    connections: inboundConnections,
  } = useSubjectInboundEvaluationsContext({
    subjectId,
    evaluationCategory: viewModeToViewAs[viewMode],
  });
  const { auraScore, auraImpacts } = useSubjectVerifications(
    subjectId,
    viewModeToViewAs[viewMode],
  );
  const { totalPositiveImpact, totalNegativeImpact } =
    useTotalImpact(auraImpacts);
  const { impactChartOption } = useImpactEChartOption(auraImpacts, true);

  const { currentRoleEvaluatorEvaluationCategory } = useViewMode();

  const { toggleFiltersById } = useSubjectInboundEvaluationsContext({
    subjectId,
  });

  const authData = useSelector(selectAuthData);

  const setEvidenceListFilter = (filterId: AuraFilterId) => {
    toggleFiltersById([filterId], true);
    showEvidenceList?.();
  };

  const onChartClick = (params: any) => {
    if (params.componentType === 'graphic') {
      console.log(
        'Profile image clicked:',
        params.event.target.style.data.evaluator,
      );
      setCredibilityDetailsProps({
        subjectId: params.event.target.style.data.evaluator,
        evaluationCategory:
          viewModeToViewAs[viewModeToEvaluatorViewMode[viewMode]],
      });
    }
    if (params.componentType === 'series') {
      console.log('Bar clicked:', params.data.evaluator);
      setCredibilityDetailsProps({
        subjectId: params.data.evaluator,
        evaluationCategory:
          viewModeToViewAs[viewModeToEvaluatorViewMode[viewMode]],
      });
    }
  };

  return (
    <>
      {authData?.brightId === subjectId &&
        !location.pathname.startsWith('/subject/') && (
          <LevelProgress
            category={currentRoleEvaluatorEvaluationCategory}
            subjectId={subjectId}
          />
        )}
      <div className="card">
        {hasHeader && (
          <div className=" mb-4 font-bold text-lg text-black">{title}</div>
        )}
        {viewMode !== PreferredView.PLAYER &&
          viewMode !== PreferredView.TRAINER && (
            <ActivitiesCard
              subjectId={subjectId}
              onLastEvaluationClick={setCredibilityDetailsProps}
              viewMode={viewMode}
            />
          )}

        <div className="flex flex-col gap-1.5">
          {viewMode !== PreferredView.PLAYER && (
            <div className=" mt-4 font-semibold text-xl">
              {viewModeToString[viewMode]} Evaluations
            </div>
          )}
          {/*<ShowData*/}
          {/*  title="Connections"*/}
          {/*  value={inboundConnections?.length ?? '...'}*/}
          {/*  details={null}*/}
          {/*/>*/}
          <div className="header__info flex flex-col gap-1">
            <ShowData
              title="Evaluations"
              value={inboundRatings?.filter((r) => Number(r.rating)).length}
              details={
                inboundRatingsStatsString
                  ? `(${inboundRatingsStatsString})`
                  : undefined
              }
            />
            <ShowData
              title="Calculated Score"
              value={auraScore ? compactFormat(auraScore) : '-'}
              details={`(${
                totalPositiveImpact !== null
                  ? `+${compactFormat(totalPositiveImpact)}`
                  : '-'
              } / ${
                totalNegativeImpact !== null
                  ? `-${compactFormat(totalNegativeImpact)}`
                  : '-'
              })`}
            />
          </div>
          <div className="body__info flex justify-between w-full">
            <div className="font-medium">Evaluation Impact:</div>
            <div className="underline text-sm text-gray00 dark:text-gray-400">
              What&apos;s this?
            </div>
          </div>
          <ReactECharts
            option={impactChartOption}
            onEvents={{
              click: onChartClick, // Attach click event
            }}
            className="body__chart w-full mb-3"
          />
          <div className="chart-info flex flex-wrap gap-y-2.5 mb-5">
            <div className="chart-info__item flex items-center gap-1 w-1/2">
              <div className="chart-info__item__color w-[22px] h-[11px] rounded bg-[#E2E2E2]"></div>
              <div className="chart-info__item__text text-xs font-bold">
                Low Confidence
              </div>
            </div>
            <div className="chart-info__item flex items-center gap-1 w-1/2">
              <div className="chart-info__item__color w-[22px] h-[11px] rounded bg-[#B5B5B5]"></div>
              <div className="chart-info__item__text text-xs font-bold">
                Medium Confidence
              </div>
            </div>
            <div className="chart-info__item flex items-center gap-1 w-1/2">
              <div className="chart-info__item__color w-[22px] h-[11px] rounded bg-[#7A7A7A]"></div>
              <div className="chart-info__item__text text-xs font-bold">
                High Confidence
              </div>
            </div>
            <div className="chart-info__item flex items-center gap-1 w-1/2">
              <div className="chart-info__item__color w-[22px] h-[11px] rounded bg-[#404040]"></div>
              <div className="chart-info__item__text text-xs font-bold">
                Very High Confidence
              </div>
            </div>
          </div>
          {/*<p className="font-medium italic text-sm text-black">*/}
          {/*  *This chart displays the top 10 impacts players have on the subject*/}
          {/*  score*/}
          {/*</p>*/}
        </div>

        {isMyPerformance && (
          <>
            <Link
              to={`/subject/${subjectId}?viewas=${viewModeToViewAs[viewMode]}&tab=${ProfileTab.EVALUATIONS}`}
              className="w-full"
            >
              <button className="btn--outlined btn--medium mt-4 w-full">
                View All Evaluations
              </button>
            </Link>
            {viewMode === PreferredView.TRAINER && (
              <button
                onClick={onFindEvaluatorsButtonClick}
                className="btn mt-3"
              >
                Find New Trainer
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

const ShowData = ({
  title,
  value,
  details,
}: {
  title: string | number | null | undefined;
  value: string | number | null | undefined;
  details: string | number | null | undefined;
}) => {
  return (
    <div className="flex justify-between w-full">
      <div className="font-medium">{title}:</div>
      <div>
        <span className="font-medium">{value} </span>
        <span>{details}</span>
      </div>
    </div>
  );
};

export default ProfileOverview;
