import { useDispatch } from '@/store/hooks';
import { getBrightIdBackupThunk } from '@/store/profile/actions';
import { hash } from '@/utils/crypto';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthData, selectBrightIdBackup } from 'store/profile/selectors';
import {
  AuraNodeBrightIdConnectionWithBackupData,
  BrightIdBackupConnection,
  BrightIdBackupWithAuraConnectionData,
} from 'types';

export default function useBrightIdBackupWithAuraConnectionData(): BrightIdBackupWithAuraConnectionData | null {
  const brightIdBackup = useSelector(selectBrightIdBackup);
  const { myConnections } = useMyEvaluationsContext();
  const authData = useSelector(selectAuthData);
  const dispatch = useDispatch();

  const [isExhusted, setIsExhusted] = useState(false);
  const refreshBrightIdBackup = useCallback(async () => {
    if (!authData) return;
    const authKey = hash(authData.brightId + authData.password);
    await dispatch(getBrightIdBackupThunk({ authKey }));
  }, [authData, dispatch]);

  const backupConnectionKeys = brightIdBackup?.connections.reduce(
    (prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    },
    {} as Record<string, BrightIdBackupConnection>,
  );

  useEffect(() => {
    let shouldFetch = false;
    if (!backupConnectionKeys) return;

    myConnections?.forEach((conn) => {
      if (!backupConnectionKeys[conn.id]) {
        shouldFetch = true;
      }
    });

    if (!shouldFetch) {
      setIsExhusted(false);
      return;
    }

    if (isExhusted) return;

    refreshBrightIdBackup();
    setIsExhusted(true);
  }, [myConnections, refreshBrightIdBackup, brightIdBackup, isExhusted]);

  return useMemo(() => {
    if (brightIdBackup === null || !myConnections) return null;

    const connections: AuraNodeBrightIdConnectionWithBackupData[] = [];
    myConnections.forEach((c) => {
      const connectionInBrightIdBackup = backupConnectionKeys![c.id];

      connections.push({
        ...connectionInBrightIdBackup,
        ...c,
      });
    });
    return {
      ...brightIdBackup,
      connections,
    };
  }, [brightIdBackup, myConnections]);
}
