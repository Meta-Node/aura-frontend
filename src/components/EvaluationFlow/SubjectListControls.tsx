import { FiltersModal } from 'components/EvaluationFlow/FiltersModal';
import { SortsModal } from 'components/EvaluationFlow/SortsModal';
import { useSubjectsListContext } from 'contexts/SubjectsListContext';
import { useMyEvaluations } from 'hooks/useMyEvaluations';
import { RefreshCcwIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import { cn } from '@/lib/utils';

import useBrightIdBackupWithAuraConnectionData from '../../hooks/useBrightIdBackupWithAuraConnectionData';
import { AuraSortId } from '../../hooks/useSorts';
import useViewMode from '../../hooks/useViewMode';
import { AuraFilterDropdownOption } from '../../types';
import { PreferredView } from '../../types/dashboard';
import Dropdown from '../Shared/Dropdown';
import Modal from '../Shared/Modal';
import { Button } from '../ui/button';

function FilterAndSortModalBody({ isPlayerMode }: { isPlayerMode: boolean }) {
  const {
    selectedFilterIds,
    toggleFiltersById,
    selectedSort,
    setSelectedSort,
    filters,
    sorts,
  } = useSubjectsListContext();

  return (
    <div>
      <p className="font-bold text-black2 dark:text-gray-100">Filters</p>
      <FiltersModal
        includeConnectionFilters={isPlayerMode}
        testidPrefix={'subject-filter'}
        filters={filters}
        selectedFilterIds={selectedFilterIds}
        toggleFiltersById={toggleFiltersById}
      />
      <p className="pb-1 pt-3 font-bold text-black2 dark:text-gray-100">
        Sorts
      </p>
      <SortsModal
        includeLastConnectionFilter={isPlayerMode}
        testidPrefix={'subject-sort'}
        sorts={sorts}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
      />
    </div>
  );
}

export const SubjectListControls = ({
  refreshBrightIdBackup,
  loading: contextLoading,
}: {
  refreshBrightIdBackup: () => void;
  loading?: boolean;
}) => {
  const {
    searchString,
    setSearchString,
    selectedFilters,
    selectedSort,
    clearSortAndFilter,
    toggleFiltersById,
    setSelectedSort,
  } = useSubjectsListContext();
  const { refreshOutboundRatings, loading } = useMyEvaluations();

  const brightIdBackup = useBrightIdBackupWithAuraConnectionData();

  const { currentViewMode, setPreferredView } = useViewMode();

  const [params] = useSearchParams();

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
      label: <p>Recent connections (default)</p>,
      filterIds: null,
      sortId: null,
      onClick: () => clearSortAndFilter(),
    }),
    [clearSortAndFilter],
  );

  const dropdownOptions: AuraFilterDropdownOption[] = useMemo(() => {
    if (params.has('subjectId') || currentViewMode === PreferredView.PLAYER) {
      return [
        defaultOption,
        ...[
          {
            value: 2,
            label: <p>Recently evaluated</p>,
            filterIds: null,
            sortId: AuraSortId.ConnectionRecentEvaluation,
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
      ];
    }

    return [
      ...[
        {
          value: 2,
          label: <p>Recently evaluated (default)</p>,
          filterIds: null,
          sortId: AuraSortId.ConnectionRecentEvaluation,
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
    ];
  }, [
    currentViewMode,
    customViewOption,
    defaultOption,
    params,
    setSelectedSort,
    toggleFiltersById,
  ]);

  const selectedItem: AuraFilterDropdownOption = useMemo(() => {
    if (!selectedFilters && !selectedSort) {
      if (params.has('subjectId') || currentViewMode === PreferredView.PLAYER)
        return defaultOption;

      return {
        value: 2,
        label: <p>Recently evaluated (default)</p>,
        filterIds: null,
        sortId: AuraSortId.ConnectionRecentEvaluation,
        ascending: false,
        onClick: () => {
          toggleFiltersById(null, true);
          setSelectedSort(AuraSortId.ConnectionRecentEvaluation, false);
        },
      };
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
    currentViewMode,
    customViewOption,
    defaultOption,
    dropdownOptions,
    params,
    selectedFilters,
    selectedSort,
    setSelectedSort,
    toggleFiltersById,
  ]);

  useEffect(() => {
    if (params.has('subjectId') || currentViewMode === PreferredView.PLAYER) {
      // if (selectedSort?.id === AuraSortId.ConnectionRecentEvaluation)
      //   setSelectedSort(null);
      return;
    }

    if (!selectedSort?.id)
      setSelectedSort(AuraSortId.ConnectionRecentEvaluation);
  }, [currentViewMode, selectedSort, params, setSelectedSort]);

  useEffect(() => {
    if (!params.get('search')) {
      setSearchString('');
      return;
    }

    setSearchString(params.get('search') || '');
  }, [params, setSearchString]);

  const { itemsFiltered: filteredSubjects } = useSubjectsListContext();

  return (
    <>
      <div className="flex max-h-[175px] flex-1 flex-col justify-center gap-4 rounded-lg border bg-card p-1 text-card-foreground dark:bg-dark-primary">
        <div className="card__input flex items-center gap-2 rounded px-3.5">
          <img
            className="h-4 w-4"
            src="/assets/images/Shared/search-icon.svg"
            alt=""
          />
          <input
            className="h-11 w-full bg-transparent text-sm font-medium text-card-foreground placeholder-black2 focus:outline-none dark:placeholder:text-gray-50"
            type="text"
            placeholder="Subject name or ID ..."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-2 mt-2 text-right text-sm">
        {currentViewMode === PreferredView.MANAGER_EVALUATING_TRAINER && (
          <button className="rounded-lg bg-white-90-card px-4 py-1 dark:bg-button-primary">
            {' '}
            <p
              className="ml-auto cursor-pointer font-medium dark:text-white"
              onClick={() =>
                setPreferredView(PreferredView.MANAGER_EVALUATING_MANAGER)
              }
            >
              View Managers
            </p>
          </button>
        )}
        {currentViewMode === PreferredView.MANAGER_EVALUATING_MANAGER && (
          <button className="rounded-lg bg-white-90-card px-4 py-1 dark:bg-button-primary">
            <p
              className="ml-auto cursor-pointer font-medium dark:text-white"
              onClick={() =>
                setPreferredView(PreferredView.MANAGER_EVALUATING_TRAINER)
              }
            >
              View Trainers
            </p>
          </button>
        )}
      </div>
      <div className="mb-3 flex items-center text-lg">
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
          <FilterAndSortModalBody
            isPlayerMode={currentViewMode === PreferredView.PLAYER}
          />
        </Modal>
        <span className="ml-auto text-white">
          (
          {filteredSubjects?.length ??
            brightIdBackup?.connections.length ??
            '...'}{' '}
          result
          {(filteredSubjects?.length ?? brightIdBackup?.connections.length) !==
          1
            ? 's'
            : ''}
          )
        </span>
        <Button
          onClick={() => {
            refreshBrightIdBackup();
            refreshOutboundRatings();
          }}
          disabled={loading || contextLoading}
          className="ml-1"
          variant="outline"
          size={'icon'}
        >
          <RefreshCcwIcon
            className={cn(
              'h-7 w-7 cursor-pointer',
              (loading || contextLoading) && 'animate-spin',
            )}
          />
        </Button>
      </div>
    </>
  );
};
