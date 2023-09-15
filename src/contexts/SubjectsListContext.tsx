import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import {
  AuraFilterId,
  AuraFilterOptions,
  useSubjectFilters,
} from 'hooks/useFilters.ts';
import {
  AuraSortId,
  AuraSortOptions,
  useSubjectSorts,
} from 'hooks/useSorts.ts';
import useFilterAndSort from 'hooks/useFilterAndSort.ts';
import { useSelector } from 'react-redux';
import { selectBrightIdBackup } from 'store/profile/selectors.ts';
import { BrightIdConnection, Connection } from 'types';

// Define the context
const SubjectsListContext = createContext<
  | (ReturnType<typeof useFilterAndSort<Connection>> & {
      sorts: AuraSortOptions<BrightIdConnection>;
      filters: AuraFilterOptions<BrightIdConnection>;
    })
  | null
>(null);

interface PlatformsProviderProps {
  children: ReactNode;
}

// Define the Provider component
export const SubjectsListContextProvider: React.FC<PlatformsProviderProps> = ({
  children,
}) => {
  const brightIdBackup = useSelector(selectBrightIdBackup);

  const filters = useSubjectFilters(
    useMemo(
      () => [
        AuraFilterId.ConnectionTierNotYet,
        AuraFilterId.ConnectionTierSybil,
        AuraFilterId.ConnectionTierBronze,
        AuraFilterId.ConnectionTierSilver,
        AuraFilterId.ConnectionTierGold,
        AuraFilterId.ConnectionYourEvaluationPositive,
        AuraFilterId.ConnectionYourEvaluationNegative,
        AuraFilterId.ConnectionYourEvaluationNotEvaluatedYet,
        AuraFilterId.ConnectionConnectionTypeJustMet,
        AuraFilterId.ConnectionConnectionTypeAlreadyKnownPlus,
      ],
      [],
    ),
  );
  const sorts = useSubjectSorts(
    useMemo(
      () => [
        AuraSortId.ConnectionLastUpdated,
        AuraSortId.ConnectionMostEvaluations,
        AuraSortId.ConnectionScore,
        AuraSortId.MostMutualConnections,
      ],
      [],
    ),
  );

  const filterAndSortHookData = useFilterAndSort(
    brightIdBackup?.connections ?? null,
    filters,
    sorts,
    useMemo(() => ['id', 'name'], []),
    'subjectsList',
  );

  return (
    <SubjectsListContext.Provider
      value={{ ...filterAndSortHookData, filters, sorts }}
    >
      {children}
    </SubjectsListContext.Provider>
  );
};

// Use this hook in your components to get access to asset platform data
export const useSubjectsListContext = () => {
  const context = useContext(SubjectsListContext);
  if (context === null) {
    throw new Error(
      'SubjectsListContext must be used within a SubjectsListContextProvider',
    );
  }
  return context;
};
