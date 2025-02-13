import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import ReactECharts from 'echarts-for-react';
import { useInboundEvaluations } from 'hooks/useSubjectEvaluations';
import { useSubjectName } from 'hooks/useSubjectName';
import {
  useImpactEChartOption,
  useImpactPercentage,
  useSubjectVerifications,
} from 'hooks/useSubjectVerifications';
import { PencilIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'store/hooks';
import { selectAuthData } from 'store/profile/selectors';
import { EvaluationCategory } from 'types/dashboard';
import { compactFormat } from 'utils/number';
import { calculateUserScorePercentage } from 'utils/score';

import { SubjectInboundEvaluationsContextProvider } from '@/contexts/SubjectInboundEvaluationsContext';

import {
  getRawTextClassNameOfAuraRatingNumber,
  getViewModeSubjectTextColorClass,
  viewAsToViewMode,
} from '../constants';
import { CredibilityDetailsProps } from '../types';
import EvaluationFlow from './EvaluationFlow/EvaluationFlow';
import { HorizontalProgressBar } from './Shared/HorizontalProgressBar';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const views = [
  EvaluationCategory.SUBJECT,
  EvaluationCategory.PLAYER,
  EvaluationCategory.TRAINER,
  EvaluationCategory.MANAGER,
];

const CredibilityDetailsForRole = ({
  subjectId,
  roleEvaluationCategory,
  onClose,
}: {
  subjectId: string;
  roleEvaluationCategory: EvaluationCategory;
  onClose: () => void;
}) => {
  const authData = useSelector(selectAuthData);
  const { auraLevel, auraScore, auraImpacts, refresh } =
    useSubjectVerifications(subjectId, roleEvaluationCategory);
  const [showEvaluationFlow, setShowEvaluationFlow] = useState(false);
  const { ratings, inboundRatingsStatsString } = useInboundEvaluations({
    subjectId,
    evaluationCategory: roleEvaluationCategory,
  });
  const impactPercentage = useImpactPercentage(auraImpacts, authData?.brightId);

  const { loading, myRatingToSubject, myConfidenceValueInThisSubjectRating } =
    useMyEvaluationsContext({
      subjectId,
      evaluationCategory: roleEvaluationCategory,
    });
  const { impactChartOption } = useImpactEChartOption(auraImpacts, true);
  const link = '/subject/' + subjectId;
  const navigate = useNavigate();

  const progress = calculateUserScorePercentage(
    roleEvaluationCategory,
    auraScore ?? 0,
  );

  return (
    <>
      <div className="font-bold text-l">
        As a{' '}
        <span
          className={getViewModeSubjectTextColorClass(
            viewAsToViewMode[roleEvaluationCategory],
          )}
        >
          {roleEvaluationCategory.slice(0, 1).toUpperCase() +
            roleEvaluationCategory.slice(1)}
        </span>
        :
      </div>
      <div>
        Level: <span className="font-bold">{auraLevel}</span>
      </div>
      <div className="flex w-full gap-2 items-center">
        <div>
          Score:{' '}
          <span className="font-medium">
            {auraScore ? compactFormat(auraScore) : '-'}
          </span>
        </div>
        <HorizontalProgressBar percentage={progress} />
      </div>
      <div>
        Evaluations:{' '}
        <span className="font-bold">
          {ratings !== null ? ratings.length : '...'} (
          {inboundRatingsStatsString})
        </span>
      </div>
      <div>
        Your Evaluation:{' '}
        <span className="font-bold">
          {loading ? (
            <span className="text-gray20">...</span>
          ) : myRatingToSubject && Number(myRatingToSubject.rating) > 0 ? (
            <span
              className={`${getRawTextClassNameOfAuraRatingNumber(
                Number(myRatingToSubject.rating),
              )}`}
            >
              Positive - {myConfidenceValueInThisSubjectRating} (
              {Number(myRatingToSubject.rating)})
            </span>
          ) : myRatingToSubject && Number(myRatingToSubject.rating) < 0 ? (
            <span
              className={`${getRawTextClassNameOfAuraRatingNumber(
                Number(myRatingToSubject.rating),
              )}`}
            >
              Negative - {myConfidenceValueInThisSubjectRating} (
              {Number(myRatingToSubject.rating)})
            </span>
          ) : (
            '-'
          )}
        </span>
      </div>
      <SubjectInboundEvaluationsContextProvider subjectId={subjectId}>
        <EvaluationFlow
          refresh={refresh}
          evaluationCategory={roleEvaluationCategory}
          currentViewMode={viewAsToViewMode[roleEvaluationCategory]}
          showEvaluationFlow={showEvaluationFlow}
          setShowEvaluationFlow={setShowEvaluationFlow}
          subjectId={subjectId}
        />
      </SubjectInboundEvaluationsContextProvider>
      <div>
        Your Evaluation Impact:{' '}
        {loading ? (
          <span className="text-gray20">...</span>
        ) : myRatingToSubject && Number(myRatingToSubject.rating) > 0 ? (
          <div className="inline-flex items-center gap-3">
            <span
              className={`font-bold`}
              style={{
                color: '#6C34B3',
              }}
            >
              {impactPercentage ?? 0}%
            </span>

            <Button
              onClick={() => setShowEvaluationFlow(true)}
              variant="secondary"
              size="icon"
            >
              <PencilIcon width={10} height={10} />
            </Button>

          </div>
        ) : (
          <span>
            none.{' '}
            <button
              onClick={() => setShowEvaluationFlow(true)}
              className="text-pastel-blue text-sm"
            >
              Evaluate Now
            </button>
          </span>
        )}
      </div>
      {/* <EvaluationFlow
        showEvaluationFlow={showEvaluationFlow}
        setShowEvaluationFlow={setShowEvaluationFlow}
        subjectId={subjectId}
      /> */}
      <ReactECharts
        style={{ height: '110px' }}
        option={impactChartOption}
        className="body__chart w-full mb-5 mt-2"
      />
      <Link
        to={link + '?viewas=' + roleEvaluationCategory}
        className="flex btn w-full mt-auto justify-center"
        onClick={(e) => {
          e.preventDefault();
          onClose();
          navigate(link + '?viewas=' + roleEvaluationCategory);
        }}
      >
        View{' '}
        {String(roleEvaluationCategory)[0].toUpperCase() +
          String(roleEvaluationCategory).slice(1)}{' '}
        Profile
      </Link>
    </>
  );
};

const CredibilityDetails = ({
  credibilityDetailsProps,
  onClose,
}: {
  credibilityDetailsProps: CredibilityDetailsProps;
  onClose: () => void;
}) => {
  const [evaluationCategory, setEvaluationCategory] = useState(
    credibilityDetailsProps.evaluationCategory,
  );

  const playerEvaluation = useSubjectVerifications(
    credibilityDetailsProps.subjectId,
    EvaluationCategory.PLAYER,
  );

  const trainerEvaluation = useSubjectVerifications(
    credibilityDetailsProps.subjectId,
    EvaluationCategory.TRAINER,
  );

  const managerEvaluation = useSubjectVerifications(
    credibilityDetailsProps.subjectId,
    EvaluationCategory.MANAGER,
  );

  const authorizedTabs = useMemo(() => {
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

  useEffect(() => {
    if (isLoading) return;

    if (!authorizedTabs.includes(evaluationCategory)) {
      setEvaluationCategory(authorizedTabs[0]);
    }
  }, [isLoading, authorizedTabs, evaluationCategory]);

  if (isLoading)
    return (
      <div className="min-h-[450px] flex flex-col w-full">
        <div
          className={`px-1.5 py-1.5 w-full min-h-[52px] rounded-lg p-1 mb-5`}
        >
          <div
            className={`flex flex-row gap-1 min-w-full overflow-x-auto overflow-y-hidden h-full pb-1`}
            // TODO: refactor this to tailwindcss class and values
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#292534 rgba(209, 213, 219, 0.5)',
            }}
          >
            {views.map((_, key) => (
              <p
                key={key}
                className={`rounded-md bg-gray100 min-w-[100px] animate-pulse w-full cursor-pointer h-9 flex gap-1 items-center justify-center transition-all duration-300 ease-in-out`}
              ></p>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-[450px] flex flex-col w-full">
      <div
        className={`px-1.5 py-1.5 w-full min-h-[52px] rounded-lg bg-white-90-card dark:bg-dark-primary p-1 mb-5`}
      >
        <div
          className={`flex flex-row min-w-full overflow-x-auto overflow-y-hidden h-full pb-1`}
          // TODO: refactor this to tailwindcss class and values
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#292534 rgba(209, 213, 219, 0.5)',
          }}
        >
          <p
            className={`rounded-md ${
              authorizedTabs.length > 0 ? '' : 'hidden'
            } min-w-[100px] w-full cursor-pointer h-9 flex gap-1 items-center justify-center transition-all duration-300 ease-in-out ${
              evaluationCategory === EvaluationCategory.SUBJECT
                ? 'background bg-orange dark:text-black text-white font-bold'
                : 'bg-transparent text-black dark:text-white font-medium'
            }`}
            onClick={() => setEvaluationCategory(EvaluationCategory.SUBJECT)}
            data-testid="table-view-switch-option-one"
          >
            <img
              src={
                evaluationCategory === EvaluationCategory.SUBJECT
                  ? '/assets/images/Shared/brightid-icon-white.svg'
                  : '/assets/images/Shared/brightid-icon.svg'
              }
              alt=""
            />
            Subject
          </p>
          <p
            className={`rounded-md ${
              authorizedTabs.length > 1 ? '' : 'hidden'
            } min-w-[100px] w-full cursor-pointer h-9 flex gap-1 items-center justify-center transition-all duration-300 ease-in-out ${
              evaluationCategory === EvaluationCategory.PLAYER
                ? 'background bg-purple text-white font-bold'
                : 'bg-transparent text-black dark:text-white font-medium'
            }`}
            onClick={() => setEvaluationCategory(EvaluationCategory.PLAYER)}
            data-testid="table-view-switch-option-one"
          >
            <img src="/assets/images/player.svg" alt="" />
            Player
          </p>
          <p
            className={`rounded-md ${
              authorizedTabs.length > 2 ? '' : 'hidden'
            } min-w-[100px] w-full cursor-pointer h-9 flex gap-1 justify-center items-center transition-all duration-300 ease-in-out ${
              evaluationCategory === EvaluationCategory.TRAINER
                ? 'background bg-green text-white font-bold'
                : 'bg-transparent text-black dark:text-white font-medium'
            }`}
            onClick={() => setEvaluationCategory(EvaluationCategory.TRAINER)}
            data-testid="table-view-switch-option-two"
          >
            <img src="/assets/images/Shared/trainer.svg" alt="" width={20} />
            Trainer
          </p>
          <p
            className={`rounded-md ${
              authorizedTabs.length > 3 ? '' : 'hidden'
            } min-w-[100px] w-full cursor-pointer h-9 flex gap-1 justify-center items-center transition-all duration-300 ease-in-out ${
              evaluationCategory === EvaluationCategory.MANAGER
                ? 'background bg-blue text-white font-bold'
                : 'bg-transparent text-black dark:text-white font-medium'
            }`}
            onClick={() => setEvaluationCategory(EvaluationCategory.MANAGER)}
            data-testid="table-view-switch-option-two"
          >
            <img
              src="/assets/images/Shared/manager-icon-s-blue.svg"
              alt=""
              width={20}
            />
            Manager
          </p>
        </div>
      </div>
      <CredibilityDetailsForRole
        roleEvaluationCategory={evaluationCategory}
        subjectId={credibilityDetailsProps.subjectId}
        onClose={onClose}
      />
    </div>
  );
};
const CredibilityDetailsModal = ({
  credibilityDetailsProps,
  onClose,
}: {
  credibilityDetailsProps: CredibilityDetailsProps;
  onClose: () => void;
}) => {
  const name = useSubjectName(credibilityDetailsProps.subjectId);
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>{name}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="mt-5">
          <CredibilityDetails
            credibilityDetailsProps={credibilityDetailsProps}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CredibilityDetailsModal;
