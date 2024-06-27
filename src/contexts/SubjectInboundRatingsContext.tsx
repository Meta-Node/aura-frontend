import React, { createContext, ReactNode, useContext } from 'react';

import { useInboundEvaluations } from '../hooks/useSubjectEvaluations';

// Define the context
const SubjectInboundRatingsContext = createContext<
  | (ReturnType<typeof useInboundEvaluations> & {
      subjectId: string;
    })
  | null
>(null);

interface ProviderProps {
  subjectId: string;
  children: ReactNode;
}

// Define the Provider component
export const SubjectInboundRatingsContextProvider: React.FC<ProviderProps> = ({
  subjectId,
  children,
}) => {
  return (
    <SubjectInboundRatingsContext.Provider
      value={{ ...useInboundEvaluations(subjectId), subjectId }}
    >
      {children}
    </SubjectInboundRatingsContext.Provider>
  );
};

export const useSubjectInboundRatingsContext = (subjectId: string) => {
  const context = useContext(SubjectInboundRatingsContext);
  if (context === null) {
    throw new Error(
      'SubjectInboundRatingsContext must be used within a SubjectInboundRatingsContextProvider',
    );
  }
  if (context.subjectId !== subjectId) {
    throw new Error(
      'SubjectInboundRatingsContextProvider for ' + subjectId + 'not provided',
    );
  }
  return context;
};
