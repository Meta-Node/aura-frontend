import Modal from 'components/Shared/Modal';
import { EchartsContext } from 'contexts/EchartsContext';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import ReactECharts from 'echarts-for-react';
import { useOutboundEvaluations } from 'hooks/useSubjectEvaluations';
import { useSubjectInboundEvaluations } from 'hooks/useSubjectInboundEvaluations';
import { useSubjectName } from 'hooks/useSubjectName';
import { useSubjectVerifications } from 'hooks/useSubjectVerifications';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'store/hooks';
import { selectAuthData } from 'store/profile/selectors';
import { EvaluationCategory } from 'types/dashboard';
import { compactFormat } from 'utils/number';

import { HorizontalProgressBar } from './Shared/HorizontalProgressBar';
import { ToggleInputWithIcon } from './Shared/ToggleInput';

const CredibilityDetails = ({
  subjectId,
  onClose,
}: {
  subjectId: string;
  onClose: () => void;
}) => {
  const authData = useSelector(selectAuthData);
  const { auraLevel, auraScore } = useSubjectVerifications(subjectId);
  const { ratings, inboundRatingsStatsString } =
    useSubjectInboundEvaluations(subjectId);
  const {
    loading,
    myRatingToSubject,
    myConnectionToSubject,
    myConfidenceValueInThisSubjectRating,
  } = useMyEvaluationsContext(subjectId);
  const { connections } = useOutboundEvaluations(subjectId);
  const { options2 } = useContext(EchartsContext);
  const [isSubject, setIsSubject] = useState(true);
  const link = '/subject/' + subjectId;
  const navigate = useNavigate();

  return (
    <div className="min-h-[450px] flex flex-col">
      <ToggleInputWithIcon
        option1={'Subject'}
        option2={'Player'}
        icon1="/assets/images/Shared/brightid-icon.svg"
        icon1Converted="/assets/images/Shared/brightid-icon-white.svg"
        icon2="/assets/images/player.svg"
        icon2Converted="/assets/images/player.svg"
        isChecked={isSubject}
        setIsChecked={setIsSubject}
      />
      {isSubject && (
        <>
          <div className="font-bold text-l">
            As a <span className="text-purple">Player</span>:
          </div>
          <div>
            Level: <span className="font-bold">1</span>
          </div>
          <div className="flex w-full gap-2 items-center">
            <div>
              Score: <span className="font-medium">24.1k</span>
            </div>
            <HorizontalProgressBar percentage={'w-[15%]'} />
          </div>
          <div>
            Evaluations: <span className="font-bold">5 (4 Pos / 1 Neg)</span>
          </div>
          <div>
            Your Evaluation:{' '}
            <span className="font-bold text-pl3">Positive - High (3)</span>
          </div>
          <div>
            Your Evaluation{' '}
            <span className="font-bold text-pl3">Impact: 32%</span>
          </div>
          <ReactECharts
            style={{ height: '110px' }}
            option={options2}
            className="body__chart w-full mb-5 mt-2"
          />
          <Link
            to={link + '?viewas=' + EvaluationCategory.SUBJECT}
            className="flex btn btn--bg-orange w-full justify-center mt-auto"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              navigate(link + '?viewas=' + EvaluationCategory.SUBJECT);
            }}
          >
            View Subject Profile
          </Link>
        </>
      )}
      {!isSubject && (
        <>
          <div className="font-bold text-l">
            As a <span className="text-orange">Subject</span>:
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
            Your Connection:{' '}
            <span className="font-bold">{myConnectionToSubject?.level}</span>
          </div>
          <div>
            Their Connection to you:{' '}
            <span className="font-bold">
              {connections !== null
                ? connections.find((c) => c.id === authData?.brightId)?.level ||
                  '-'
                : '...'}
            </span>
          </div>
          <div>
            Your Evaluation:{' '}
            <span className="font-bold">
              {loading ? (
                <span className="text-gray20">...</span>
              ) : Number(myRatingToSubject?.rating) > 0 ? (
                <span className="text-pl3">
                  Positive - {myConfidenceValueInThisSubjectRating} (
                  {Number(myRatingToSubject?.rating)})
                </span>
              ) : Number(myRatingToSubject?.rating) < 0 ? (
                <span className="text-nl3">
                  Negative - {myConfidenceValueInThisSubjectRating} (
                  {Number(myRatingToSubject?.rating)})
                </span>
              ) : (
                '-'
              )}
            </span>
          </div>
          <div>
            Your Evaluation Impact:
            <span className="font-bold text-nl3"> 32%</span>
          </div>
          <ReactECharts
            style={{ height: '110px' }}
            option={options2}
            className="body__chart w-full mb-5 mt-2"
          />
          <Link
            to={link + '?viewas=' + EvaluationCategory.PLAYER}
            className="flex btn w-full mt-auto justify-center"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              navigate(link + '?viewas=' + EvaluationCategory.PLAYER);
            }}
          >
            View Player Profile
          </Link>
        </>
      )}
    </div>
  );
};
const CredibilityDetailsModal = ({
  subjectId,
  onClose,
}: {
  subjectId: string;
  onClose: () => void;
}) => {
  const name = useSubjectName(subjectId);
  return (
    <Modal isOpen={true} closeModalHandler={onClose} title={name}>
      <CredibilityDetails subjectId={subjectId} onClose={onClose} />
    </Modal>
  );
};

export default CredibilityDetailsModal;
