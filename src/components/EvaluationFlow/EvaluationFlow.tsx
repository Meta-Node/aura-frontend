import EvaluateModalBody from 'components/EvaluationFlow/EvaluateModalBody';
import NewPlayerGuideAfterEvaluation from 'components/EvaluationFlow/NewPlayerGuideAfterEvaluation';
import Modal from 'components/Shared/Modal';
import { PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING } from 'constants/index';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import { useSubjectInboundEvaluationsContext } from 'contexts/SubjectInboundEvaluationsContext';
import { useSubjectName } from 'hooks/useSubjectName';
import { useCallback, useState } from 'react';

const EvaluationFlow = ({
  showEvaluationFlow,
  subjectId,
  setShowEvaluationFlow,
}: {
  subjectId: string;
  showEvaluationFlow: boolean;
  setShowEvaluationFlow: (value: boolean) => void;
}) => {
  const name = useSubjectName(subjectId);

  const { refreshInboundRatings, myRatingObject } =
    useSubjectInboundEvaluationsContext(subjectId);
  const { refreshOutboundRatings, myRatings } =
    useMyEvaluationsContext(subjectId);

  const [myNewRatingCount, setMyNewRatingCount] = useState<number | null>(null);

  const onSubmitted = useCallback(
    async (newRating: number | null | undefined) => {
      const myRatingsCount = myRatings?.filter((r) => Number(r.rating)).length;
      refreshInboundRatings();
      refreshOutboundRatings();
      if (!newRating) {
        setShowEvaluationFlow(false);
        return;
      }
      if (myRatingsCount === undefined) return;
      const isNewRating = !(myRatingObject && Number(myRatingObject.rating));
      const newRatingCount = myRatingsCount + (isNewRating ? 1 : 0);
      if (newRatingCount > PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING) {
        setShowEvaluationFlow(false);
      } else {
        setMyNewRatingCount(newRatingCount);
      }
    },
    [
      myRatingObject,
      myRatings,
      refreshInboundRatings,
      refreshOutboundRatings,
      setShowEvaluationFlow,
    ],
  );

  return (
    <Modal
      isOpen={showEvaluationFlow}
      closeModalHandler={() => {
        setShowEvaluationFlow(false);
        setMyNewRatingCount(null);
      }}
      title={myNewRatingCount === null ? `Endorsing ${name}` : undefined}
    >
      {myNewRatingCount !== null ? (
        <NewPlayerGuideAfterEvaluation
          closeModalHandler={() => {}}
          ratingsDoneCount={myNewRatingCount}
        />
      ) : (
        <EvaluateModalBody subjectId={subjectId} onSubmitted={onSubmitted} />
      )}
    </Modal>
  );
};

export default EvaluationFlow;
