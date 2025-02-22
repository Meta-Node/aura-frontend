import { FiltersModal } from 'components/EvaluationFlow/FiltersModal';
import { SortsModal } from 'components/EvaluationFlow/SortsModal';
import { useOutboundEvaluationsContext } from 'contexts/SubjectOutboundEvaluationsContext';
import * as React from 'react';
import { useMemo, useState } from 'react';

import Dropdown from 'components/Shared/Dropdown';
import Modal from 'components/Shared/Modal';
import { viewModeToSubjectViewMode, viewModeToViewAs } from 'constants/index';
import { AuraFilterId } from 'hooks/useFilters';
import { AuraSortId } from 'hooks/useSorts';
import useViewMode from 'hooks/useViewMode';
import { AuraFilterDropdownOption } from 'types';
import { PreferredView, ProfileTab } from 'types/dashboard';

function FilterAndSortModalBody({ subjectId }: { subjectId: string }) {
  const {
    selectedFilterIds,
    toggleFiltersById,
    selectedSort,
    setSelectedSort,
    filters,
    sorts,
  } = useOutboundEvaluationsContext({ subjectId });

  return (
    <div>
      <p className="text-black2 dark:text-gray-100 font-bold">Filters</p>
      <FiltersModal
        testidPrefix={'subject-filter'}
        filters={filters}
        selectedFilterIds={selectedFilterIds}
        toggleFiltersById={toggleFiltersById}
      />
      <p className="text-black2 dark:text-gray-100 font-bold pt-3 pb-1">
        Sorts
      </p>
      <SortsModal
        testidPrefix={'subject-sort'}
        sorts={sorts}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
      />
    </div>
  );
}

export const ActivityListSearch = ({
  selectedTab,
  setSelectedTab,
  subjectId,
}: {
  subjectId: string;
  selectedTab: ProfileTab;
  setSelectedTab: (value: ProfileTab) => void;
}) => {
  const { currentViewMode, currentEvaluationCategory } = useViewMode();

  const {
    itemsOriginal,
    itemsFiltered: filteredSubjects,
    searchString,
    setSearchString,
    selectedFilters,
    selectedSort,
    clearSortAndFilter,
    toggleFiltersById,
    setSelectedSort,
  } = useOutboundEvaluationsContext({
    subjectId,
    evaluationCategory:
      selectedTab === ProfileTab.ACTIVITY_ON_MANAGERS
        ? currentEvaluationCategory
        : viewModeToViewAs[viewModeToSubjectViewMode[currentViewMode]],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const customViewOption = useMemo(
    () => ({
      value: -1,
      label: <p>Custom view</p>,
      filterIds: null,
      sortId: null,
      onClick: () => setIsModalOpen(true),
    }),
    [],
  );
  const defaultOption = useMemo(
    () => ({
      value: 0,
      label: <p>Recent evaluations (default)</p>,
      filterIds: null,
      sortId: null,
      onClick: () => clearSortAndFilter(),
    }),
    [clearSortAndFilter],
  );
  const dropdownOptions: AuraFilterDropdownOption[] = useMemo(
    () => [
      defaultOption,
      ...[
        {
          value: 2,
          label: <p>Negative evaluations</p>,
          filterIds: [AuraFilterId.EvaluationNegativeEvaluations],
          sortId: AuraSortId.RecentEvaluation,
          ascending: false,
        },
        {
          value: 3,
          label: <p>Confidence</p>,
          filterIds: null,
          sortId: AuraSortId.EvaluationConfidence,
          ascending: false,
        },
      ].map((item) => ({
        ...item,
        onClick: () => {
          toggleFiltersById(item.filterIds, true);
          setSelectedSort(item.sortId, item.ascending);
        },
      })),
      customViewOption,
    ],
    [customViewOption, defaultOption, setSelectedSort, toggleFiltersById],
  );

  const selectedItem: AuraFilterDropdownOption = useMemo(() => {
    if (!selectedFilters && !selectedSort) {
      return defaultOption;
    }
    const selectedItem = dropdownOptions.find((item) => {
      const isSelectedSort =
        selectedSort?.id === item.sortId &&
        item.ascending ===
        (selectedSort.defaultAscending !== selectedSort.isReversed);
      if (!isSelectedSort) return false;
      if (!selectedFilters) return !item.filterIds;
      if (!item.filterIds) return false;
      const selectedFilterIdsSorted = selectedFilters.map((f) => f.id).sort();
      const itemFilterIdsSorted = [...item.filterIds].sort();
      for (let i = 0; i < selectedFilterIdsSorted.length; i++) {
        if (itemFilterIdsSorted[i] !== selectedFilterIdsSorted[i]) return false;
      }
      return true;
    });
    return selectedItem ?? customViewOption;
  }, [
    customViewOption,
    defaultOption,
    dropdownOptions,
    selectedFilters,
    selectedSort,
  ]);

  return (
    <>
      <div className="text-right font-semibold text-sm">
        {currentViewMode === PreferredView.MANAGER_EVALUATING_MANAGER && (
          <button className="rounded-lg px-4 py-1 bg-white-90-card dark:bg-button-primary">
            {selectedTab === ProfileTab.ACTIVITY ? (
              <p
                className="font-medium cursor-pointer text-white"
                onClick={() => setSelectedTab(ProfileTab.ACTIVITY_ON_MANAGERS)}
              >
                View Managers
              </p>
            ) : (
              <p
                className="font-medium cursor-pointer text-white"
                onClick={() => setSelectedTab(ProfileTab.ACTIVITY)}
              >
                View Trainers
              </p>
            )}
          </button>
        )}
      </div>
      <div className="text-lg text-white -mt-3 flex items-center">
        <Dropdown
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          items={dropdownOptions}
          selectedItem={selectedItem}
          onItemClick={(item) => item.onClick()}
          className="h-10"
        />
        <Modal
          title="Custom View"
          isOpen={isModalOpen}
          closeModalHandler={() => setIsModalOpen(false)}
          className="select-button-with-modal__modal"
        >
          <FilterAndSortModalBody subjectId={subjectId} />
        </Modal>
        <span className="ml-1">
          (
          {filteredSubjects?.filter((e) => e.rating && e.rating.rating !== '0')
            .length ??
            itemsOriginal?.length ??
            '...'}{' '}
          result
          {(filteredSubjects?.filter((e) => e.rating).length ??
            itemsOriginal?.length) !== 1
            ? 's'
            : ''}
          )
        </span>
      </div>

      <div className="bg-card border text-card-foreground rounded-lg p-1 flex-1 flex flex-col justify-center gap-4 max-h-[175px]">
        <div className="card__input flex gap-2 items-center rounded px-3.5">
          <img
            className="w-4 h-4"
            src="/assets/images/Shared/search-icon.svg"
            alt=""
          />
          <input
            className="w-full font-medium dark:placeholder:text-gray-50 placeholder-black2 bg-card text-card-foreground text-sm h-11 focus:outline-none"
            type="text"
            placeholder="Search in these results"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};
