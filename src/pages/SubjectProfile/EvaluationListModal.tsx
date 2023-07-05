import { useState } from 'react';
import { ModalItem } from '../../components/Shared/Modal/ModalItem';
import SubjectEvaluation from '../../components/Shared/ProfileEvaluation';
import { useInboundRatings } from '../../hooks/useSubjectRatings.ts';

export const EvaluationListModal = ({ subjectId }: { subjectId: string }) => {
  const [filters] = useState([
    {
      id: 1,
      title: 'Mutual connections',
      isSelected: false,
    },
    {
      id: 2,
      title: 'Positive Evaluations',
      isSelected: true,
    },
    {
      id: 3,
      title: 'Negative Evaluations',
      isSelected: false,
    },
  ]);
  const [sorts] = useState([
    {
      id: 1,
      title: 'Recent',
      isSelected: false,
    },
    {
      id: 2,
      title: 'Evaluation Score',
      isSelected: true,
    },
    {
      id: 3,
      title: 'Player Score',
      isSelected: false,
    },
  ]);
  const { inboundRatings } = useInboundRatings(subjectId);
  return (
    <div className="flex flex-col gap-[18px] max-h-[600px]">
      <SelectItems title="Filters" isOpen={true} items={filters} />
      <SelectItems title="Sort" isOpen={false} items={sorts} />
      <div className="flex flex-col overflow-scroll overscroll-contain gap-2.5 w-full -mb-5 pb-5">
        {inboundRatings?.map((rating) => (
          <SubjectEvaluation
            key={rating.id}
            fromSubjectId={rating.fromBrightId}
            toSubjectId={rating.toBrightId}
            className="!min-w-[305px] !py-5"
          />
        ))}
      </div>
    </div>
  );
};

const SelectItems = ({
  title,
  isOpen,
  items,
}: {
  title: string;
  isOpen: boolean;
  items: any;
}) => {
  return (
    <div className="flex flex-col w-full gap-2.5">
      <div className="flex justify-between">
        <p className="">{title}</p>
        <img
          src={`${
            isOpen
              ? '/assets/images/Shared/minus-icon.svg'
              : '/assets/images/Shared/plus-icon.svg'
          }`}
          alt=""
        />
      </div>
      {isOpen && (
        <div className="flex flex-row flex-wrap gap-2">
          {items.map((item: any) => (
            <ModalItem
              className="w-auto min-w-min"
              title={item.title}
              isSelected={item.isSelected}
              icon={item.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
};
