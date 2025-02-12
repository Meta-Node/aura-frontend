import EvaluationInfo from 'components/Shared/EvaluationInfo/EvaluationInfo';
import { useSelector } from 'store/hooks';
import { selectAuthData } from 'store/profile/selectors';

import { useSubjectEvaluationFromContext } from '../../../hooks/useSubjectEvaluation';
import { EvaluationCategory } from '../../../types/dashboard';
import { Button } from '@/components/ui/button';
import { PencilIcon } from 'lucide-react';

export const YourEvaluationInfo = ({
  toSubjectId,
  setShowEvaluationFlow,
  evaluationCategory,
}: {
  toSubjectId: string;
  setShowEvaluationFlow: (value: boolean) => void;
  evaluationCategory: EvaluationCategory;
}) => {
  const authData = useSelector(selectAuthData);
  const { loading } = useSubjectEvaluationFromContext({
    fromSubjectId: authData?.brightId,
    toSubjectId,
    evaluationCategory,
  });
  if (!authData) return <></>;
  if (loading)
    return (
      <div>
        <span className="font-medium">...</span>
      </div>
    );
  return (
    <div className="flex gap-2">
      <EvaluationInfo
        fromSubjectId={authData.brightId}
        toSubjectId={toSubjectId}
        evaluationCategory={evaluationCategory}
      />
      <Button
        onClick={() => setShowEvaluationFlow(true)}
        data-testid={`your-evaluation-${authData?.brightId}-${toSubjectId}-edit`}
        variant="secondary"
        size="icon"
      >
        <PencilIcon width={20} height={20} />
      </Button>
    </div>
  );
};
