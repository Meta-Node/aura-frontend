import EvaluationThumb from 'components/Shared/EvaluationThumb';
import {
  getBgClassNameOfAuraRatingObject,
  getTextClassNameOfAuraRatingObject,
} from 'constants/index';
import { useSubjectEvaluationFromContext } from 'hooks/useSubjectEvaluation';
import { useMemo } from 'react';

export default function EvaluationInfo({
  fromSubjectId,
  toSubjectId,
}: {
  fromSubjectId: string;
  toSubjectId: string;
}) {
  const isYourEvaluation = true;
  const { rating, loading, confidenceValue } = useSubjectEvaluationFromContext({
    fromSubjectId,
    toSubjectId,
  });

  //TODO: get notes from api
  const styleValues = useMemo(() => {
    if (rating?.rating) {
      if (Number(rating.rating) > 0)
        return {
          bgAndTextColor:
            getBgClassNameOfAuraRatingObject(rating) +
            ' ' +
            getTextClassNameOfAuraRatingObject(rating),
          iconBgColor: 'bg-pl2',
          text: 'Positive',
        };
      if (Number(rating.rating) < 0)
        return {
          bgAndTextColor:
            getBgClassNameOfAuraRatingObject(rating) +
            ' ' +
            getTextClassNameOfAuraRatingObject(rating),
          iconBgColor: 'bg-nl2',
          text: 'Negative',
        };
    }
    if (loading) {
      return {
        bgAndTextColor: 'bg-gray20 text-white',
        iconBgColor: 'bg-gray50',
        text: '...',
      };
    }
    return {
      bgAndTextColor: 'bg-gray20 text-white',
      iconBgColor: 'bg-gray50',
      text: 'Not Rated',
    };
  }, [rating, loading]);

  return (
    <div
      className={`text-sm flex flex-1 justify-between rounded-md items-center h-[36px] px-3 py-2 ${
        styleValues.bgAndTextColor
      } ${isYourEvaluation ? 'p-1.5' : 'p-2.5'}`}
    >
      <div className="flex gap-0.5 items-center">
        <EvaluationThumb width="17.5px" height="16.63px" rating={rating} />
        <div>
          <span
            className="font-medium"
            data-testid={`${
              isYourEvaluation ? 'your-' : ''
            }evaluation-${fromSubjectId}-${toSubjectId}-magnitude`}
          >
            {styleValues.text}
          </span>
          <span
            className="font-medium"
            data-testid={`${
              isYourEvaluation ? 'your-' : ''
            }evaluation-${fromSubjectId}-${toSubjectId}-confidence`}
          >
            {rating && Number(rating.rating) !== 0 && confidenceValue
              ? ` - ${confidenceValue}`
              : ''}
            {rating?.rating ? ` (${rating.rating})` : ''}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">{'12%'}</span>
      </div>
    </div>
  );
}
