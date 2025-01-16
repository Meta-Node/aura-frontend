import ConfidenceDropdown from 'components/Shared/Dropdown/ConfidenceDropdown';
import { useSubjectInboundEvaluationsContext } from 'contexts/SubjectInboundEvaluationsContext';
import { useEvaluateSubject } from 'hooks/useEvaluateSubject';
import { useSubjectName } from 'hooks/useSubjectName';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthData } from 'store/profile/selectors';

import useViewMode from '../../hooks/useViewMode';
import CustomTrans from '../CustomTrans';

const EvaluateModalBody = ({
  subjectId,
  onSubmitted,
}: {
  subjectId: string;
  onSubmitted: (newRating: number | null | undefined) => void;
}) => {
  const [isYes, setIsYes] = useState(true);
  const [confidence, setConfidence] = useState(1);
  const [onDelete, setOnDelete] = useState(false);
  const { myRatingObject } = useSubjectInboundEvaluationsContext({ subjectId });
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
      await submitEvaluation(subjectId, newRating);
      onSubmitted(newRating);
    } catch (e) {
      alert(String(e));
    }
  }, [
    authData,
    confidence,
    isYes,
    loading,
    onSubmitted,
    subjectId,
    submitEvaluation,
  ]);

  const { subjectViewModeTitle } = useViewMode();

  return (
    <div>
      <p className="subtitle mb-6 -mt-1">
        as a <span className="font-bold">{subjectViewModeTitle}</span> in{' '}
        <span className="font-bold">BrightID</span> domain
      </p>

      <p className="font-medium mb-2">
        <CustomTrans
          i18nKey={`evaluationQuestion.${subjectViewModeTitle.toLowerCase()}`}
          values={{ name }}
        />
      </p>

      <div className="p-1.5 rounded-lg dark:bg-button-primary bg-white w-full mb-5">
        <div className="w-full h-[38px] relative dark:bg-button-primary bg-white flex">
          <span
            className={`cursor-pointer background absolute w-1/2 top-0 bottom-0 rounded-md transition-all duration-300 ease-in-out ${
              isYes ? 'left-0 right-1/2 bg-pl3' : 'right-0 left-1/2 bg-error'
            }`}
          ></span>
          <p
            className={`cursor-pointer bg-transparent absolute w-1/2 left-0 top-1/2 -translate-y-1/2 text-center font-bold text-lg transition-all duration-300 ease-in-out ${
              isYes ? 'text-white' : 'text-black'
            }`}
            data-testid={`evaluate-positive`}
            onClick={() => setIsYes(true)}
          >
            <div className="flex gap-1 w-full justify-center">
              <img
                src={
                  isYes
                    ? '/assets/images/Shared/thumbs-up-white.svg'
                    : '/assets/images/Shared/thumbs-up-black.svg'
                }
                alt=""
                width="17.5px"
                height="17.5px"
              />
              Yes
            </div>
          </p>
          <p
            className={`cursor-pointer bg-transparent absolute w-1/2 right-0 top-1/2 -translate-y-1/2 text-center font-bold text-lg transition-all duration-300 ease-in-out ${
              isYes ? 'text-black' : 'text-white'
            }`}
            data-testid={`evaluate-negative`}
            onClick={() => setIsYes(false)}
          >
            <div className="flex gap-1 w-full justify-center">
              <img
                src={
                  isYes
                    ? '/assets/images/Shared/thumbs-down-black.svg'
                    : '/assets/images/Shared/thumbs-down-white.svg'
                }
                alt=""
                width="17.5px"
                height="17.5px"
              />
              No
            </div>
          </p>
        </div>
      </div>

      <p className="font-medium mb-2">How confident are you?</p>
      <ConfidenceDropdown
        confidence={confidence}
        setConfidence={setConfidence}
      />
      <p className="font-medium mt-1">
        <CustomTrans
          i18nKey={`evaluationExpression.${subjectViewModeTitle.toLowerCase()}.${
            isYes ? 'positive' : 'negative'
          }`}
        />
      </p>
      <div className="mt-12">
        {prevRating ? (
          <div className="flex gap-3">
            <button
              className={`flex justify-center transition-all ease-linear
            ${
              onDelete
                ? `btn btn--big btn--outlined-big`
                : `btn btn--big w-full`
            }
            `}
              onClick={() => (onDelete ? setOnDelete(false) : submit())}
            >
              <p
                className={`overflow-hidden ${
                  onDelete ? 'opacity-100 w-20' : '!w-0 h-7 opacity-0'
                }`}
              >
                Cancel
              </p>
              <p
                data-testid="submit-evaluation"
                className={`overflow-hidden ${
                  onDelete ? '!w-0 h-7 opacity-0' : 'w-44 opacity-100'
                }`}
              >
                {loading ? 'Sending Operation...' : 'Update Evaluation'}
              </p>
              {/*{loading && !isEdit ? '...' : 'Submit Evaluation'}*/}
            </button>
            <button
              data-testid="remove-evaluation"
              className={`btn btn--big bg-delete dark:bg-red-500 flex gap-2.5 transition-all ease-linear ${
                onDelete ? 'w-full justify-center items-center' : ''
              }`}
              onClick={() =>
                onDelete
                  ? submitEvaluation(subjectId, 0).then(() => onSubmitted(0))
                  : setOnDelete(true)
              }
            >
              <img src="/assets/images/Shared/erase-icon.svg" alt="" />
              <p
                className={`transition-all overflow-hidden ${
                  onDelete ? 'w-[75px] opacity-100' : 'w-0 opacity-0'
                }`}
              >
                Remove
              </p>
            </button>
          </div>
        ) : (
          <button
            data-testid="submit-evaluation"
            className="btn btn--big w-full"
            onClick={submit}
          >
            {loading ? 'Sending Operation...' : 'Submit Evaluation'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EvaluateModalBody;
