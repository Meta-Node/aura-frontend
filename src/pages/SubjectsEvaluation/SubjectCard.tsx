import { Link } from 'react-router-dom';
import { useSubjectBasicInfo } from '../../hooks/useSubjectBasicInfo.ts';
import BrightIdProfilePicture from '../../components/BrightIdProfilePicture.tsx';
import { compactFormat } from '../../utils/number.ts';

export const SubjectCard = ({ subjectId }: { subjectId: string }) => {
  const { tier, name, auraScore } = useSubjectBasicInfo(subjectId);
  return (
    <Link
      to={'/subject/' + subjectId}
      className={
        'card card--evaluation b-4 flex !flex-row gap-1 !justify-between w-full'
        // + subject.evaluation === 'POSITIVE'
        //   ? '!bg-green-card !opacity-75'
        //   : subject.evaluation === 'NEGATIVE'
        //     ? '!bg-red-card !opacity-75'
        //     : ''
      }
    >
      <div className="evaluation-left flex flex-col gap-2">
        <div className="evaluation-left__top flex gap-3">
          <div className="evaluation__profile">
            <BrightIdProfilePicture
              className="rounded-full w-12 h-12 border border-white bg-center bg-cover"
              id={subjectId}
            />
          </div>
          <div className="evaluation__info flex flex-col">
            <p className="text-black font-medium">{name}</p>
            <p className="text-gray20">
              Tier: <span className="font-medium text-black">{tier}</span>
            </p>
          </div>
        </div>
        <div className="evaluation-left__bottom">
          <p className="text-sm text-gray20">Your evaluation</p>
          <p className="font-medium">
            {/*{subject.evaluation === 'POSITIVE' ? (*/}
            {/*  <span className="text-green-800">*/}
            {/*    Positive{' '}*/}
            {/*    <span className="text-black">*/}
            {/*      {' '}*/}
            {/*      - {subject.evaluationStrength}*/}
            {/*    </span>*/}
            {/*  </span>*/}
            {/*) : subject.evaluation === 'NEGATIVE' ? (*/}
            {/*  <span className="text-red-800">*/}
            {/*    Negative{' '}*/}
            {/*    <span className="text-black">*/}
            {/*      {' '}*/}
            {/*      - {subject.evaluationStrength}*/}
            {/*    </span>*/}
            {/*  </span>*/}
            {/*) : (*/}
            {/*  <span className="text-gray20">...</span>*/}
            {/*)}*/}
          </p>
        </div>
      </div>
      <div className="evaluation-right flex flex-col gap-2">
        <div className="evaluation-right__top">
          <p className="text-gray20">
            Score:{' '}
            <span className="font-medium text-black">
              {auraScore ? compactFormat(auraScore) : '-'}
            </span>
          </p>
          <p className="text-gray20">
            <span className="font-medium text-black">{'18 Pos / 5 Neg'}</span>
          </p>
        </div>
        <div className="evaluation-right__bottom">
          <img
            className="w-26.5 h-12"
            src={
              // subject.evaluation === 'NEGATIVE'
              //   ? '/assets/images/negative-chart.svg'
              //   : subject.evaluation === 'POSITIVE'
              //   ? '/assets/images/positive-chart.svg'
              //   :
              '/assets/images/chart.svg'
            }
            alt=""
          />
        </div>
      </div>
    </Link>
  );
};
