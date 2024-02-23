import Modal from 'components/Shared/Modal';
import { EchartsContext } from 'contexts/EchartsContext';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import ReactECharts from 'echarts-for-react';
import { useOutboundConnections } from 'hooks/useSubjectConnections';
import { useSubjectInboundEvaluations } from 'hooks/useSubjectInboundEvaluations';
import { useSubjectName } from 'hooks/useSubjectName';
import { useSubjectVerifications } from 'hooks/useSubjectVerifications';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'store/hooks';
import { selectAuthData } from 'store/profile/selectors';
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
  const { inboundRatings, inboundRatingsStatsString } =
    useSubjectInboundEvaluations(subjectId);
  const {
    loading,
    myRatingToSubject,
    myConnectionToSubject,
    myConfidenceValueInThisSubjectRating,
  } = useMyEvaluationsContext(subjectId);
  const { outboundConnections } = useOutboundConnections(subjectId);
  const { options2 } = useContext(EchartsContext);
  const [isSubject, setIsSubject] = useState(true);
  const link = '/subject/' + subjectId;
  const navigate = useNavigate();

  return (
    <div>
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
        <div>
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
            className="body__chart w-3/4 mb-5 mt-2"
          />
          <Link
            to={link}
            className="flex btn btn--bg-orange w-full justify-center"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              navigate(link);
            }}
          >
            View Subject Profile
          </Link>
        </div>
      )}
      {!isSubject && (
        <div className="w-full">
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
              {inboundRatings !== null ? inboundRatings.length : '...'}(
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
              {outboundConnections !== null
                ? outboundConnections.find((c) => c.id === authData?.brightId)
                    ?.level || '-'
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
            <span className="font-bold text-nl3">32%</span>
          </div>
          <ReactECharts
            style={{ height: '110px' }}
            option={options2}
            className="body__chart w-3/4 mb-5 mt-2"
          />
          <Link
            to={link}
            className="flex btn w-full justify-center"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              navigate(link);
            }}
          >
            View Player Profile
          </Link>
        </div>
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
  const link = '/subject/' + subjectId;
  const navigate = useNavigate();
  return (
    <Modal isOpen={true} closeModalHandler={onClose} title={name}>
      <div>
        <CredibilityDetails subjectId={subjectId} onClose={onClose} />
      </div>
    </Modal>
  );
};

export default CredibilityDetailsModal;
