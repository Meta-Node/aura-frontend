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
    <div className="inline-flex gap-1 rounded-md bg-soft-bright p-2 dark:bg-dark-bright">
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
        <p className="text-sm font-medium text-black">
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
      className={`flex items-center gap-1 rounded-md ${getBgClassNameOfAuraRatingNumber(
        ratingNumber,
      )} ${getTextClassNameOfAuraRatingNumber(ratingNumber)} px-3 py-2.5`}
    >
      {ratingNumber}
      <EvaluationThumb
        width="18px"
        height="18px"
        rating={rating && Number(rating?.rating)}
      />
      <p className="text-sm font-bold leading-4">
        {rating?.isPending ? '' : `${confidenceValue} `}({ratingNumber})
      </p>
      {rating?.isPending && (
        <LoadingSpinner
          className="ml-1 h-[18px] w-[18px]"
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

export const connectionLevelColors: Record<ConnectionLevel, string> = {
  reported: '#FF4B31',
  suspicious: '#FF7831',
  recovery: '#FFA131',
  'already known': '#FFC585',
  'just met': '#FFB85C',
  'aura only': '#FFE8D4',
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
    <div className="flex w-full items-center gap-1">
      <Tooltip
        tooltipClassName="text-sm !w-52 !whitespace-normal"
        position="right"
        content={`You connected with "${inboundConnectionInfo?.level}" to ${name}`}
      >
        <div
          className="flex gap-1 rounded-md p-2"
          style={{
            backgroundColor: inboundConnectionInfo?.level
              ? connectionLevelColors[inboundConnectionInfo.level]
              : '#FFB85C',
          }}
        >
          {inboundConnectionInfo && inboundConnectionInfo.level && (
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
            <p className="text-sm font-medium text-black">
              {inboundConnectionInfo?.level}
            </p>
          )}
        </div>
      </Tooltip>
      {ratingNumber ? (
        <Tooltip content={`Your evaluation of ${name}`}>
          <div
            className={`flex items-center gap-1 rounded-md ${getBgClassNameOfAuraRatingNumber(
              ratingNumber,
            )} ${getTextClassNameOfAuraRatingNumber(ratingNumber)} px-3 py-2.5`}
          >
            {(ratingNumber > 0 ? '+' : '') + ratingNumber}
            <EvaluationThumb
              width="18px"
              height="18px"
              rating={rating && Number(rating?.rating)}
            />
            <p className="text-sm font-bold leading-4">
              {rating?.isPending ? '' : `${confidenceValue} `}({ratingNumber})
            </p>
            {rating?.isPending && (
              <LoadingSpinner
                className="ml-1 h-[18px] w-[18px]"
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
