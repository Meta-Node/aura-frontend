import { useInboundEvaluations } from 'hooks/useSubjectEvaluations';

export const useSubjectInboundEvaluations = (subjectId: string) => {
  return useInboundEvaluations(subjectId);
};
