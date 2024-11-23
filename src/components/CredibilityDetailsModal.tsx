import Modal from 'components/Shared/Modal';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import ReactECharts from 'echarts-for-react';
import {
  useInboundEvaluations,
  useOutboundEvaluations,
} from 'hooks/useSubjectEvaluations';
import { useSubjectName } from 'hooks/useSubjectName';
import {
  useImpactEChartOption,
  useImpactPercentage,
  useSubjectVerifications,
} from 'hooks/useSubjectVerifications';
import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'store/hooks';
import { selectAuthData } from 'store/profile/selectors';
import { EvaluationCategory } from 'types/dashboard';
import { compactFormat } from 'utils/number';

import {
  getRawTextClassNameOfAuraRatingNumber,
  getViewModeSubjectTextColorClass,
  viewAsToViewMode,
} from '../constants';
import { CredibilityDetailsProps } from '../types';
import { HorizontalProgressBar } from './Shared/HorizontalProgressBar';

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
  const { auraLevel, auraScore, auraImpacts } = useSubjectVerifications(
    subjectId,
    roleEvaluationCategory,
  );
  const { ratings, inboundRatingsStatsString } = useInboundEvaluations({
    subjectId,
    evaluationCategory: roleEvaluationCategory,
  });
  const impactPercentage = useImpactPercentage(auraImpacts, authData?.brightId);
  const {
    loading,
    myRatingToSubject,
    myConnectionToSubject,
    myConfidenceValueInThisSubjectRating,
  } = useMyEvaluationsContext({
    subjectId,
    evaluationCategory: roleEvaluationCategory,
  });
  const { connections } = useOutboundEvaluations({ subjectId });
  const { impactChartOption } = useImpactEChartOption(auraImpacts);
  const link = '/subject/' + subjectId;
  const navigate = useNavigate();

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
        <HorizontalProgressBar percentage={'w-[15%]'} />
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
      <div>
        Your Evaluation Impact:{' '}
        <span
          className={`font-bold ${getRawTextClassNameOfAuraRatingNumber(
            Number(myRatingToSubject?.rating),
          )}`}
        >
          {impactPercentage !== null ? `${impactPercentage}%` : '-'}
        </span>
      </div>
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
        className={`px-1.5 py-1.5 w-full min-h-[52px] rounded-lg bg-white-90-card p-1 bg-white mb-5`}
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
                ? 'background bg-orange text-white font-bold'
                : 'bg-transparent text-black font-medium'
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
                : 'bg-transparent text-black font-medium'
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
                : 'bg-transparent text-black font-medium'
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
                : 'bg-transparent text-black font-medium'
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
    <Modal isOpen={true} closeModalHandler={onClose} title={name}>
      <CredibilityDetails
        credibilityDetailsProps={credibilityDetailsProps}
        onClose={onClose}
      />
    </Modal>
  );
};

export default CredibilityDetailsModal;
