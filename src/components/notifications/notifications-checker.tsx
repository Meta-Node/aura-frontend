import { AppDispatch } from '@/store';
import {
  alertsLastFetchSelector,
  resetOnMountStates,
  updateInboundData,
  updateLastFetch,
  updateOutboundData,
} from '@/store/notifications/slice';
import { selectAuthData } from '@/store/profile/selectors';
import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

export async function triggerNotificationFetch(
  getState: () => unknown,
  dispatch: AppDispatch,
  brightId: string,
) {
  await Promise.all([
    updateInboundData(getState, dispatch, brightId),
    updateOutboundData(getState, dispatch, brightId),
  ]);
  dispatch(updateLastFetch());
}

export default function NotificationsChecker() {
  const dispatch = useDispatch();
  const { getState } = useStore();

  const authData = useSelector(selectAuthData);
  const lastFetch = useSelector(alertsLastFetchSelector);

  useEffect(() => {
    dispatch(resetOnMountStates());
  }, []);

  useEffect(() => {
    if (!authData) return;

    if (lastFetch && Date.now() - lastFetch < 2.5 * 60 * 1000) return;

    triggerNotificationFetch(getState, dispatch, authData.brightId);

    const interval = setInterval(
      () => {
        triggerNotificationFetch(getState, dispatch, authData.brightId);
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [dispatch, authData]);

  return null;
}
