import { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'store/hooks';
import { selectAuthData } from 'store/profile/selectors';

import { NodeApiContext } from '../BrightID/components/NodeApiGate';
import {
  addOperation,
  selectOperationByHash,
} from '../BrightID/reducer/operationsSlice';
import { operation_states } from '../BrightID/utils/constants';
import { EvaluationValue } from '../types/dashboard';
import useViewMode from './useViewMode';

export function useEvaluateSubject() {
  const authData = useSelector(selectAuthData);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const api = useContext(NodeApiContext);
  const [connectionOpHash, setConnectionOpHash] = useState<string>('');
  const connectionOp = useSelector((state) =>
    selectOperationByHash(state, connectionOpHash),
  );
  useEffect(() => {
    async function getData() {
      console.log({ connectionOp });
      if (connectionOp?.state === operation_states.APPLIED) {
        setLoading(false);
      }
    }

    getData();
  }, [connectionOp]);

  const { currentEvaluationCategory } = useViewMode();
  const submitEvaluation = useCallback(
    async (subjectId: string, newRating: number) => {
      if (!api || !authData) return;
      setLoading(true);
      try {
        const op = await api.evaluate(
          authData.brightId,
          subjectId,
          newRating < 0 ? EvaluationValue.NEGATIVE : EvaluationValue.POSITIVE,
          Math.abs(newRating),
          'BrightID',
          currentEvaluationCategory,
          Date.now(),
        );
        dispatch(addOperation(op));
        setConnectionOpHash(op.hash);
      } catch (e) {
        setLoading(false);
        throw e;
      }
    },
    [api, authData, currentEvaluationCategory, dispatch],
  );

  return { submitEvaluation, loading };
}
