import { UserSearchIcon } from "lucide-react";

export const EmptySubjectList = ({
  clearSortAndFilter,
  hasFilter,
  showConnectionGuide,
}: {
  clearSortAndFilter: () => void;
  hasFilter: boolean;
  showConnectionGuide?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 gap-2">
      <UserSearchIcon className="w-10 h-10 mb-1" />
      <h2 className="text-lg font-medium">No subjects found</h2>
      <p className="text-center">
        {hasFilter ? (
          <span
            className="underline cursor-pointer"
            onClick={clearSortAndFilter}
          >
            Reset view to default
          </span>
        ) : (
          showConnectionGuide && (
            <>
              Open the{' '}
              <span className="text-bright-l1 hover:underline cursor-pointer">
                BrightID
              </span>{' '}
              app to connect with someone. After connecting, you&apos;ll be able
              to evaluate them here
            </>
          )
        )}
      </p>
    </div>
  );
};
