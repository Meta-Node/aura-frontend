import useFilterAndSort from 'hooks/useFilterAndSort';
import {
  AuraFilterId,
  AuraFilterOptions,
  useInboundEvaluationFilters,
} from 'hooks/useFilters';
import {
  AuraSortId,
  AuraSortOptions,
  useInboundEvaluationSorts,
} from 'hooks/useSorts';
import { useSubjectEvaluations } from 'hooks/useSubjectEvaluations';
import { useSubjectInboundEvaluations } from 'hooks/useSubjectInboundEvaluations';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthData, selectBrightIdBackup } from 'store/profile/selectors';
import { AuraInboundConnectionAndRatingData, AuraRating } from 'types';

// Define the context
export const SubjectInboundEvaluationsContext = createContext<
  | (ReturnType<typeof useSubjectInboundEvaluations> & {
      subjectId: string;
    } & ReturnType<
        typeof useFilterAndSort<AuraInboundConnectionAndRatingData>
      > & {
        sorts: AuraSortOptions<AuraInboundConnectionAndRatingData>;
        filters: AuraFilterOptions<AuraInboundConnectionAndRatingData>;
        myRatingObject: AuraRating | undefined;
      })
  | null
>(null);

interface ProviderProps {
  subjectId: string;
  children: ReactNode;
}

// Define the Provider component
export const SubjectInboundEvaluationsContextProvider: React.FC<
  ProviderProps
> = ({ subjectId, children }) => {
  const useSubjectInboundEvaluationsHookData =
    useSubjectInboundEvaluations(subjectId);
  const { ratings } = useSubjectInboundEvaluationsHookData;
  const filters = useInboundEvaluationFilters(
    [
      AuraFilterId.EvaluationMutualConnections,
      AuraFilterId.EvaluationPositiveEvaluations,
      AuraFilterId.EvaluationNegativeEvaluations,
      AuraFilterId.EvaluationJustEvaluations,
      AuraFilterId.EvaluationJustConnections,
      AuraFilterId.EvaluationConnectionTypeSuspiciousOrReported,
      AuraFilterId.EvaluationConnectionTypeJustMet,
      AuraFilterId.EvaluationConnectionTypeAlreadyKnown,
      AuraFilterId.EvaluationConnectionTypeRecovery,
      AuraFilterId.EvaluationTheirRecovery,
    ],
    subjectId,
  );

  const sorts = useInboundEvaluationSorts([
    AuraSortId.RecentEvaluation,
    AuraSortId.EvaluationScore,
    AuraSortId.EvaluationPlayerScore,
  ]);

  const subjectConnections = useSubjectEvaluations(subjectId);

  const brightIdBackup = useSelector(selectBrightIdBackup);

  const inboundOpinions: AuraInboundConnectionAndRatingData[] = useMemo(() => {
    const inboundConnections = subjectConnections.connections;
    if (!inboundConnections || ratings === null || !brightIdBackup) return [];
    const inboundOpinions: AuraInboundConnectionAndRatingData[] = ratings.map(
      (r) => ({
        fromSubjectId: r.fromBrightId,
        rating: r,
        name: brightIdBackup.connections.find(
          (conn) => conn.id === r.fromBrightId,
        )?.name,
        inboundConnection: inboundConnections.find(
          (c) => c.id === r.fromBrightId,
        ),
      }),
    );
    inboundConnections.forEach((c) => {
      const notRated = ratings.findIndex((r) => r.fromBrightId === c.id) === -1;
      if (notRated) {
        inboundOpinions.push({
          fromSubjectId: c.id,
          name: brightIdBackup.connections.find((conn) => conn.id === c.id)
            ?.name,
          inboundConnection: c,
        });
      }
    });
    return inboundOpinions;
  }, [brightIdBackup, ratings, subjectConnections.connections]);

  const filterAndSortHookData = useFilterAndSort(
    inboundOpinions,
    filters,
    sorts,
    useMemo(() => ['fromSubjectId', 'name'], []),
    'evaluationsList',
  );
  const authData = useSelector(selectAuthData);

  const myRatingObject = useMemo(() => {
    if (!authData) return undefined;
    const rating = ratings?.find((r) => r.fromBrightId === authData.brightId);
    return rating;
  }, [authData, ratings]);

  return (
    <SubjectInboundEvaluationsContext.Provider
      value={{
        ...useSubjectInboundEvaluationsHookData,
        ...filterAndSortHookData,
        sorts,
        filters,
        subjectId,
        myRatingObject,
      }}
    >
      {children}
    </SubjectInboundEvaluationsContext.Provider>
  );
};

export const useSubjectInboundEvaluationsContext = (subjectId: string) => {
  const context = useContext(SubjectInboundEvaluationsContext);
  if (context === null) {
    throw new Error(
      'SubjectInboundEvaluationsContext must be used within a SubjectInboundEvaluationsContextProvider',
    );
  }
  if (context.subjectId !== subjectId) {
    throw new Error(
      'SubjectInboundEvaluationsContextProvider for ' +
        subjectId +
        'not provided',
    );
  }
  return context;
};
