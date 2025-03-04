import useViewMode from '@/hooks/useViewMode';
import { toTitleCase } from '@/utils/text';

export const EmptyEvaluationsList = ({
  clearFilter,
  hasFilter,
}: {
  clearFilter: () => void;
  hasFilter: boolean;
}) => {
  const { currentEvaluationCategory } = useViewMode();

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-2 py-10">
      <img
        src="/assets/images/Shared/no-evidence-found.svg"
        alt="Empty State"
        className="h-8 w-10"
      />
      <h2 className="text-lg font-medium text-white">
        No {toTitleCase(currentEvaluationCategory)}s found
      </h2>
      {hasFilter && (
        <p
          className="cursor-pointer text-center text-white underline"
          onClick={clearFilter}
        >
          Reset view to default
        </p>
      )}
    </div>
  );
};
