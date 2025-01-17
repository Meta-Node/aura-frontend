import React, { FC, Fragment } from 'react';

import { LevelRequirements } from '@/types/requirement';

interface ChecklistProps {
  checklists: LevelRequirements[];
}

const ChecklistItem: FC<{ item: LevelRequirements }> = ({ item }) => {
  if ('title' in item) {
    return (
      <div className="flex items-center gap-2">
        <span
          className={`w-4 h-4 rounded-full mr-2 ${
            !item.requirement ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></span>
        <span className="text-sm">
          {item.title}{' '}
          {item.requirement > 0 && `(${item.requirement} more needed)`}
        </span>
      </div>
    );
  }

  return (
    <div>
      {(item.AND || item.OR)?.map((checklist, key) => (
        <Fragment key={key}>
          <ChecklistItem item={checklist} />
          {(item.AND?.length || item.OR?.length || 0) - 1 === key || (
            <p className="font-semibold ml-5">{item.AND ? '(AND)' : '(OR)'}</p>
          )}
        </Fragment>
      ))}
    </div>
  );
};

const RequirementsChecklist: FC<ChecklistProps> = ({ checklists }) => {
  return (
    <div className="space-y-4 mt-3">
      {checklists.map((item, index) => (
        <ChecklistItem item={item} key={index} />
      ))}
    </div>
  );
};

export default RequirementsChecklist;
