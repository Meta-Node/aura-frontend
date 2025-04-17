import { setBulkSubjectsCache } from '@/store/cache';
import { selectCachedProfiles } from '@/store/cache/selectors';
import { useDispatch } from '@/store/hooks';
import { getBrightIdBackupThunk } from '@/store/profile/actions';
import { hash } from '@/utils/crypto';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthData, selectBrightIdBackup } from 'store/profile/selectors';
import {
  AuraNodeBrightIdConnectionWithBackupData,
  BrightIdBackupWithAuraConnectionData,
} from 'types';
import { useMyEvaluations } from './useMyEvaluations';

export default function useBrightIdBackupWithAuraConnectionData(): BrightIdBackupWithAuraConnectionData | null {
  const dispatch = useDispatch();
  const brightIdBackup = useSelector(selectBrightIdBackup);
  const authData = useSelector(selectAuthData);
  const cachedBrightIdProfiles = useSelector(selectCachedProfiles);
  const { myConnections } = useMyEvaluations();

  const [loading, setLoading] = useState(false);
  const [isExhausted, setIsExhausted] = useState(false);

  const backupConnectionKeys = useMemo(() => {
    return (
      brightIdBackup?.connections.reduce(
        (acc, conn) => {
          acc[conn.id] = conn;
          return acc;
        },
        {} as Record<string, any>,
      ) || {}
    );
  }, [brightIdBackup]);

  const refreshBrightIdBackup = useCallback(async () => {
    if (!authData) return;
    setLoading(true);
    await dispatch(
      getBrightIdBackupThunk({
        authKey: hash(authData.brightId + authData.password),
      }),
    );
    setLoading(false);
  }, [authData, dispatch]);

  useEffect(() => {
    if (loading || !myConnections) return;
    const shouldFetch = myConnections.some(
      (conn) =>
        !cachedBrightIdProfiles[conn.id] &&
        conn.level !== 'aura only' &&
        !backupConnectionKeys[conn.id],
    );

    if (!shouldFetch) {
      setIsExhausted(false);
      return;
    }
    if (isExhausted) return;
    setIsExhausted(true);

    refreshBrightIdBackup().then(() => {
      const connectionTimestamps = myConnections.reduce(
        (acc, conn) => {
          acc[conn.id] = Date.now();
          return acc;
        },
        {} as Record<string, number>,
      );

      dispatch(setBulkSubjectsCache(connectionTimestamps));
    });
  }, [
    loading,
    myConnections,
    refreshBrightIdBackup,
    backupConnectionKeys,
    isExhausted,
    cachedBrightIdProfiles,
    dispatch,
  ]);

  return useMemo(() => {
    if (!brightIdBackup || !myConnections) return null;

    const connections: AuraNodeBrightIdConnectionWithBackupData[] =
      myConnections.map((conn) => ({
        ...backupConnectionKeys[conn.id],
        ...conn,
      }));

    return { ...brightIdBackup, connections };
  }, [brightIdBackup, myConnections, backupConnectionKeys]);
}
