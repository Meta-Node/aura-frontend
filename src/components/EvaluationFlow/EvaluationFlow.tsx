import EvaluateModalBody from 'components/EvaluationFlow/EvaluateModalBody';
import NewPlayerGuideAfterEvaluation from 'components/EvaluationFlow/NewPlayerGuideAfterEvaluation';
import { PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING } from 'constants/index';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import { useSubjectInboundEvaluationsContext } from 'contexts/SubjectInboundEvaluationsContext';
import { useSubjectName } from 'hooks/useSubjectName';
import { useCallback, useState } from 'react';

import useViewMode from '../../hooks/useViewMode';
import { PreferredView } from '../../types/dashboard';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';

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
    useSubjectInboundEvaluationsContext({ subjectId });
  const { refreshOutboundRatings, myRatings } = useMyEvaluationsContext({
    subjectId,
  });

  const [myNewRatingCount, setMyNewRatingCount] = useState<number | null>(null);
  const { currentViewMode } = useViewMode();

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
      if (
        currentViewMode !== PreferredView.PLAYER ||
        newRatingCount > PLAYER_EVALUATION_MINIMUM_COUNT_BEFORE_TRAINING
      ) {
        setShowEvaluationFlow(false);
      } else {
        setMyNewRatingCount(newRatingCount);
      }
    },
    [
      currentViewMode,
      myRatingObject,
      myRatings,
      refreshInboundRatings,
      refreshOutboundRatings,
      setShowEvaluationFlow,
    ],
  );

  return (
    <Dialog
      open={showEvaluationFlow}
      onOpenChange={(e) => {
        setShowEvaluationFlow(e);
        if (!e) setMyNewRatingCount(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          {myNewRatingCount === null ? `Evaluating ${name}` : undefined}
        </DialogHeader>
        {myNewRatingCount !== null ? (
          <NewPlayerGuideAfterEvaluation
            closeModalHandler={() => {}}
            ratingsDoneCount={myNewRatingCount}
          />
        ) : (
          <EvaluateModalBody subjectId={subjectId} onSubmitted={onSubmitted} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationFlow;
