import EvaluationThumb from 'components/Shared/EvaluationThumb';
import {
  getBgClassNameOfAuraRatingObject,
  getTextClassNameOfAuraRatingObject,
} from 'constants/index';
import { useSubjectEvaluationFromContext } from 'hooks/useSubjectEvaluation';
import { useMemo } from 'react';

import {
  useImpactPercentage,
  useSubjectVerifications,
} from '../../../hooks/useSubjectVerifications';
import { EvaluationCategory } from '../../../types/dashboard';
import LoadingSpinner from '../LoadingSpinner';

export default function EvaluationInfo({
  fromSubjectId,
  toSubjectId,
  evaluationCategory,
  onClick,
}: {
  fromSubjectId: string;
  toSubjectId: string;
  evaluationCategory: EvaluationCategory;
  onClick?: () => void;
}) {
  const isYourEvaluation = true;
  const { rating, loading, confidenceValue } = useSubjectEvaluationFromContext({
    fromSubjectId,
    toSubjectId,
    evaluationCategory,
  });

  const { auraImpacts } = useSubjectVerifications(
    toSubjectId,
    evaluationCategory,
  );
  const impactPercentage = useImpactPercentage(auraImpacts, fromSubjectId);

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
      text: 'Checking for evaluation…',
    };
  }, [rating, loading]);

  return (
    <div
      onClick={onClick}
      className={`flex h-[36px] flex-1 cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm ${
        styleValues.bgAndTextColor
      } ${isYourEvaluation ? 'p-1.5' : 'p-2.5'}`}
    >
      <div className="flex items-center gap-0.5">
        <EvaluationThumb
          width="17.5px"
          height="16.63px"
          rating={rating && Number(rating?.rating)}
        />
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
            {rating?.rating
              ? ` (${(Number(rating.rating) > 0 ? '+' : '') + rating.rating})`
              : ''}
          </span>
        </div>
      </div>
      {rating && (
        <div className="flex items-center gap-2">
          {rating.isPending ? (
            <>
              <span className="font-medium italic">Pending</span>
              <LoadingSpinner
                className="h-[20px] w-[20px]"
                spinnerClassName={
                  Math.abs(Number(rating.rating)) > 2
                    ? 'border-white'
                    : 'border-gray-950'
                }
              />
            </>
          ) : (
            <span className="font-medium">
              {impactPercentage !== null ? `${impactPercentage}%` : '-'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
