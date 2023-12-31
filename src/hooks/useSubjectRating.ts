import { getConfidenceValueOfAuraRatingObject } from 'constants/index';
import { useSubjectInboundEvaluationsContext } from 'contexts/SubjectInboundEvaluationsContext';
import { useMemo } from 'react';

export const useSubjectRating = ({
  fromSubjectId,
  toSubjectId,
}: {
  fromSubjectId: string | undefined;
  toSubjectId: string;
}) => {
  const { inboundRatings, loading } =
    useSubjectInboundEvaluationsContext(toSubjectId);

  const rating = useMemo(() => {
    const ratingObject = inboundRatings?.find(
      (r) => r.fromBrightId === fromSubjectId,
    );
    return ratingObject ?? null;
  }, [fromSubjectId, inboundRatings]);

  const confidenceValue = useMemo(
    () => getConfidenceValueOfAuraRatingObject(rating),
    [rating],
  );

  return { rating, loading, confidenceValue };
};
