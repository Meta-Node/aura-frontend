import EvaluationThumb from 'components/Shared/EvaluationThumb';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import { FC } from 'react';
import { connectionLevelIcons } from 'utils/connection';

import { useSubjectName } from '@/hooks/useSubjectName';

import {
  getBgClassNameOfAuraRatingNumber,
  getTextClassNameOfAuraRatingNumber,
} from '../constants';
import LoadingSpinner from './Shared/LoadingSpinner';
import Tooltip from './Shared/Tooltip';

export type SubjectIdProps = {
  subjectId: string;
};

export const ConnectionStatus: FC<SubjectIdProps> = ({ subjectId }) => {
  const {
    myRatingNumberToSubject: ratingNumber,
    myConnectionToSubject: inboundConnectionInfo,
  } = useMyEvaluationsContext({ subjectId });

  if (
    !inboundConnectionInfo ||
    !connectionLevelIcons[inboundConnectionInfo.level]
  ) {
    return null;
  }

  return (
    <div className="inline-flex gap-1 p-2 rounded-md bg-soft-bright dark:bg-dark-bright">
      {inboundConnectionInfo &&
        connectionLevelIcons[inboundConnectionInfo.level] && (
          <img
            src={`/assets/images/Shared/${
              connectionLevelIcons[inboundConnectionInfo.level]
            }.svg`}
            alt=""
            width="20px"
            height="20px"
          />
        )}
      {!ratingNumber && (
        <p className="font-medium text-black text-sm">
          {inboundConnectionInfo?.level}
        </p>
      )}
    </div>
  );
};

export const EvaluationStatus = ({ subjectId }: { subjectId: string }) => {
  const {
    myRatingToSubject: rating,
    myRatingNumberToSubject: ratingNumber,
    myConfidenceValueInThisSubjectRating: confidenceValue,
  } = useMyEvaluationsContext({ subjectId });

  return ratingNumber ? (
    <div
      className={`flex gap-1 items-center rounded-md ${getBgClassNameOfAuraRatingNumber(
        ratingNumber,
      )} ${getTextClassNameOfAuraRatingNumber(ratingNumber)} py-2.5 px-3`}
    >
      {ratingNumber}
      <EvaluationThumb
        width="18px"
        height="18px"
        rating={rating && Number(rating?.rating)}
      />
      <p className="font-bold text-sm leading-4">
        {rating?.isPending ? '' : `${confidenceValue} `}({ratingNumber})
      </p>
      {rating?.isPending && (
        <LoadingSpinner
          className="w-[18px] h-[18px] ml-1"
          spinnerClassName={
            Math.abs(Number(rating.rating)) > 2
              ? 'border-white'
              : 'border-gray-950'
          }
        />
      )}
    </div>
  ) : (
    <></>
  );
};

export const ConnectionAndEvaluationStatus = ({
  subjectId,
}: {
  subjectId: string;
}) => {
  const {
    myRatingToSubject: rating,
    myRatingNumberToSubject: ratingNumber,
    myConnectionToSubject: inboundConnectionInfo,
    myConfidenceValueInThisSubjectRating: confidenceValue,
  } = useMyEvaluationsContext({ subjectId });

  const name = useSubjectName(subjectId);

  return (
    <div className="w-full items-center flex gap-1">
      <Tooltip
        tooltipClassName="text-sm !w-52 !whitespace-normal"
        position="right"
        content={`You connected with "${inboundConnectionInfo?.level}" to ${name}`}
      >
        <div className="flex gap-1 p-2 rounded-md bg-soft-bright dark:bg-dark-bright">
          {inboundConnectionInfo &&
            connectionLevelIcons[inboundConnectionInfo.level] && (
              <img
                src={`/assets/images/Shared/${
                  connectionLevelIcons[inboundConnectionInfo.level]
                }.svg`}
                alt=""
                width="20px"
                height="20px"
              />
            )}
          {!ratingNumber && (
            <p className="font-medium text-black text-sm">
              {inboundConnectionInfo?.level}
            </p>
          )}
        </div>
      </Tooltip>
      {ratingNumber ? (
        <Tooltip content={`Your evaluation of ${name}`}>
          <div
            className={`flex gap-1 items-center rounded-md ${getBgClassNameOfAuraRatingNumber(
              ratingNumber,
            )} ${getTextClassNameOfAuraRatingNumber(ratingNumber)} py-2.5 px-3`}
          >
            {ratingNumber}
            <EvaluationThumb
              width="18px"
              height="18px"
              rating={rating && Number(rating?.rating)}
            />
            <p className="font-bold text-sm leading-4">
              {rating?.isPending ? '' : `${confidenceValue} `}({ratingNumber})
            </p>
            {rating?.isPending && (
              <LoadingSpinner
                className="w-[18px] h-[18px] ml-1"
                spinnerClassName={
                  Math.abs(Number(rating.rating)) > 2
                    ? 'border-white'
                    : 'border-gray-950'
                }
              />
            )}
          </div>
        </Tooltip>
      ) : (
        <></>
      )}
    </div>
  );
};
