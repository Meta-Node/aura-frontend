import { useSubjectName } from 'hooks/useSubjectName';
import { Link } from 'react-router-dom';
import { PlayerHistorySequenceType } from 'types';
import { RoutePath } from 'types/router';

import { subjectViewAsIconColored } from '../../constants';

export const PlayerHistorySequence = ({
  playerHistorySequence,
}: {
  playerHistorySequence: PlayerHistorySequenceType[];
}) => {
  return (
    <div className="flex bg-primary-l1 dark:bg-primary-d2 rounded w-full">
      <div
        className="rtl: flex flex-row min-w-full gap-1.5 py-3 overflow-auto first:pr-2.5 last:pl-2.5"
        // TODO: refactor this to tailwindcss class
        style={{
          overflow: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#A982DF #f5f5f5',
        }}
      >
        {playerHistorySequence.map((item, i) => (
          <>
            <PlayerHistoryItem item={item} />
            {i !== playerHistorySequence.length - 1 && (
              <img src="/assets/images/Header/play-icon.svg" alt="" />
            )}
          </>
        ))}
      </div>
    </div>
  );
};

const PlayerHistoryItem = ({ item }: { item: PlayerHistorySequenceType }) => {
  const name = useSubjectName(item.subjectId);
  return (
    <Link
      to={
        RoutePath.SUBJECT_PROFILE.replace(':subjectIdProp', item.subjectId) +
        '?viewas=' +
        item.evaluationCategory
      }
      className="flex gap-1 items-center"
    >
      <img
        src={subjectViewAsIconColored[item.evaluationCategory]}
        alt=""
        width="10px"
        height="10px"
      />
      <p className="whitespace-nowrap text-black text-xs mr-1.5">{name}</p>
    </Link>
  );
};
