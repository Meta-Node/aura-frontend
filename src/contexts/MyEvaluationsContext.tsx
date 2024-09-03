import {
  getConfidenceValueOfAuraRatingObject,
  viewModeToViewAs,
} from 'constants/index';
import { useMyEvaluations } from 'hooks/useMyEvaluations';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import useViewMode from '../hooks/useViewMode';
import { EvaluationCategory } from '../types/dashboard';
import { useRefreshEvaluationsContext } from './RefreshEvaluationsContext';

// Define the context
export const MyEvaluationsContext = createContext<ReturnType<
  typeof useMyEvaluations
> | null>(null);

interface ProviderProps {
  children: ReactNode;
}

// Define the Provider component
export const MyEvaluationsContextProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const { refreshOutboundRatings, ...useMyEvaluationsHookData } =
    useMyEvaluations();

  const { refreshCounter } = useRefreshEvaluationsContext();
  useEffect(() => {
    if (refreshCounter > 0) {
      refreshOutboundRatings();
    }
  }, [refreshCounter, refreshOutboundRatings]);

  return (
    <MyEvaluationsContext.Provider
      value={{
        refreshOutboundRatings,
        ...useMyEvaluationsHookData,
      }}
    >
      {children}
    </MyEvaluationsContext.Provider>
  );
};

export const useMyEvaluationsContext = (props?: {
  subjectId?: string;
  evaluationCategory?: EvaluationCategory;
}) => {
  const context = useContext(MyEvaluationsContext);
  if (context === null) {
    throw new Error(
      'MyEvaluationsContext must be used within a MyEvaluationsContextProvider',
    );
  }
  const { currentViewMode } = useViewMode();
  const myRatings = useMemo(() => {
    if (!context.myRatings) return null;
    return context.myRatings.filter(
      (r) =>
        r.category ===
        (props?.evaluationCategory ?? viewModeToViewAs[currentViewMode]),
    );
  }, [context.myRatings, currentViewMode, props?.evaluationCategory]);

  const myRatingToSubject = useMemo(() => {
    if (!props?.subjectId || !myRatings) return undefined;
    return myRatings.find((r) => r.toBrightId === props?.subjectId);
  }, [myRatings, props?.subjectId]);

  const myConnectionToSubject = useMemo(() => {
    if (!props?.subjectId || !context.myConnections) return undefined;
    return context.myConnections.find((c) => c.id === props?.subjectId);
  }, [context.myConnections, props?.subjectId]);

  const myConfidenceValueInThisSubjectRating = useMemo(
    () => getConfidenceValueOfAuraRatingObject(myRatingToSubject),
    [myRatingToSubject],
  );
  const myRatingNumberToSubject = useMemo(
    () => (myRatingToSubject ? Number(myRatingToSubject?.rating) : null),
    [myRatingToSubject],
  );
  const myActiveRatings = useMemo(
    () => myRatings?.filter((r) => Number(r.rating)),
    [myRatings],
  );
  const myLastRating = useMemo(
    () =>
      myActiveRatings ? myActiveRatings[myActiveRatings.length - 1] : undefined,
    [myActiveRatings],
  );
  return {
    ...context,
    myRatings,
    myLastRating,
    myRatingToSubject,
    myConnectionToSubject,
    myConfidenceValueInThisSubjectRating,
    myRatingNumberToSubject,
  };
};
