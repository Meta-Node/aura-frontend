import { FiltersModal } from 'components/EvaluationFlow/FiltersModal';
import { SortsModal } from 'components/EvaluationFlow/SortsModal';
import * as React from 'react';
import { useMemo, useState } from 'react';

import Dropdown from '../../components/Shared/Dropdown';
import Modal from '../../components/Shared/Modal';
import { useSubjectInboundConnectionsContext } from '../../contexts/SubjectInboundConnectionsContext';
import { AuraFilterId } from '../../hooks/useFilters';
import { AuraSortId } from '../../hooks/useSorts';
import { AuraFilterDropdownOption } from '../../types';

function FilterAndSortModalBody({ subjectId }: { subjectId: string }) {
  const {
    selectedFilterIds,
    toggleFiltersById,
    selectedSort,
    setSelectedSort,
    filters,
    sorts,
  } = useSubjectInboundConnectionsContext({ subjectId });

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

export const ConnectionListSearch = ({ subjectId }: { subjectId: string }) => {
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
  } = useSubjectInboundConnectionsContext({
    subjectId,
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
      label: <p>Expected connections (default)</p>,
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
          label: <p>Their Recovery</p>,
          filterIds: [AuraFilterId.TheirRecovery],
          sortId: AuraSortId.ConnectionLastUpdated,
          ascending: false,
        },
        {
          value: 3,
          label: <p>Recovery</p>,
          filterIds: [AuraFilterId.ConnectionTypeRecovery],
          sortId: AuraSortId.ConnectionLastUpdated,
          ascending: false,
        },
        {
          value: 4,
          label: <p>Already known+</p>,
          filterIds: [AuraFilterId.ConnectionTypeAlreadyKnownPlus],
          sortId: AuraSortId.ConnectionLastUpdated,
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
      <div className="bg-gray40 rounded-[10px] p-1 flex-1 flex flex-col justify-center gap-4 max-h-[175px]">
        <div className="card__input flex gap-2 items-center rounded px-3.5">
          <img
            className="w-4 h-4"
            src="/assets/images/Shared/search-icon.svg"
            alt=""
          />
          <input
            className="bg-gray40 w-full text-black2 font-medium placeholder-black2 text-sm h-11 focus:outline-none"
            type="text"
            placeholder="Subject name or ID ..."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
      </div>
      <div className="text-lg text-white mb-3 mt-3 flex items-center">
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
        <span className="ml-auto">
          (
          {filteredSubjects?.filter((e) => e.inboundConnection).length ??
            itemsOriginal?.length ??
            '...'}{' '}
          result
          {(filteredSubjects?.filter((e) => e.inboundConnection).length ??
            itemsOriginal?.length) !== 1
            ? 's'
            : ''}
          )
        </span>
      </div>
    </>
  );
};
