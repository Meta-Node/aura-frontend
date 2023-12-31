import ConfidenceDropdown from 'components/Shared/ConfidenceDropdown';
import { useSubjectInboundEvaluationsContext } from 'contexts/SubjectInboundEvaluationsContext';
import { useEvaluateSubject } from 'hooks/useEvaluateSubject';
import { useSubjectName } from 'hooks/useSubjectName';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthData } from 'store/profile/selectors';

const EvaluateModalBody = ({
  subjectId,
  onSubmitted,
}: {
  subjectId: string;
  onSubmitted: () => void;
}) => {
  const [isYes, setIsYes] = useState(true);
  const [confidence, setConfidence] = useState(1);
  const { myRatingObject } = useSubjectInboundEvaluationsContext(subjectId);
  const authData = useSelector(selectAuthData);
  const prevRating = useMemo(
    () => (myRatingObject ? Number(myRatingObject.rating) : undefined),
    [myRatingObject],
  );

  useEffect(() => {
    if (!prevRating) return;
    setIsYes(prevRating > 0);
    setConfidence(Math.abs(prevRating));
  }, [prevRating]);

  const name = useSubjectName(subjectId);
  const { submitEvaluation, loading } = useEvaluateSubject();

  const submit = useCallback(async () => {
    if (loading || !authData?.brightId) return;
    try {
      const newRating = isYes ? confidence : -1 * confidence;
      if (newRating !== prevRating) {
        await submitEvaluation(subjectId, newRating);
      }
      onSubmitted();
    } catch (e) {
      alert(String(e));
    }
  }, [
    authData,
    confidence,
    isYes,
    loading,
    onSubmitted,
    prevRating,
    subjectId,
    submitEvaluation,
  ]);

  return (
    <div>
      <p className="subtitle -mt-6 mb-6">
        as a <span className="font-bold">subject</span> in{' '}
        <span className="font-bold">brightID</span> domain
      </p>

      {prevRating && (
        <button
          className="-mt-3 mb-3 bg-red-500 text-white p-1.5 rounded-xl transition-colors duration-200 transform hover:bg-red-600 focus:outline-none focus:bg-red-600"
          onClick={() => {
            submitEvaluation(subjectId, 0).then(onSubmitted);
          }}
        >
          {loading ? 'Removing...' : 'Remove Your Evaluation'}
        </button>
      )}

      <p className="font-medium mb-2">
        Is this the account of {name} that should be Aura verified?
      </p>

      <div className="p-1.5 rounded-lg bg-white w-full mb-5">
        <div className="w-full h-[38px] relative bg-white flex">
          <span
            className={`cursor-pointer background absolute w-1/2 top-0 bottom-0 rounded-md transition-all duration-300 ease-in-out ${
              isYes ? 'left-0 right-1/2 bg-pl2' : 'right-0 left-1/2 bg-error'
            }`}
          ></span>
          <p
            className={`bg-transparent absolute w-1/2 left-0 top-1/2 -translate-y-1/2 text-center font-bold text-lg transition-all duration-300 ease-in-out ${
              isYes ? 'text-white' : 'text-black'
            }`}
            data-testid={`evaluate-positive`}
            onClick={() => setIsYes(true)}
          >
            Yes
          </p>
          <p
            className={`cursor-pointer bg-transparent absolute w-1/2 right-0 top-1/2 -translate-y-1/2 text-center font-bold text-lg transition-all duration-300 ease-in-out ${
              isYes ? 'text-black' : 'text-white'
            }`}
            data-testid={`evaluate-negative`}
            onClick={() => setIsYes(false)}
          >
            No
          </p>
        </div>
      </div>

      <p className="font-medium mb-2">How confident are you?</p>
      <ConfidenceDropdown
        confidence={confidence}
        setConfidence={setConfidence}
      />
      <div className="mt-36">
        <button
          data-testid="submit-evaluation"
          className="btn btn--big w-full"
          onClick={submit}
        >
          {loading ? '...' : 'Submit Evaluation'}
        </button>
      </div>
    </div>
  );
};

export default EvaluateModalBody;
