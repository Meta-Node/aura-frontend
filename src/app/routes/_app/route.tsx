import { Outlet } from 'react-router';

import EvaluationOpNotifications from '@/components/EvaluationOpNotifications';
import { IS_PRODUCTION } from '@/utils/env';
import { useDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { fetchNotificationsThunk } from '@/store/notifications';

export default function AppLanding() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNotificationsThunk());

    const interval = setInterval(
      () => {
        dispatch(fetchNotificationsThunk());
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="bg-background-light dark:bg-background">
      <div
        className={`${IS_PRODUCTION ? 'bg-circle-dots' : 'bg-lines'} relative`}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

        <div className="app relative">
          <Outlet />

          <div className="sticky bottom-2 pl-5 pr-5">
            <EvaluationOpNotifications />
          </div>
        </div>
      </div>
    </div>
  );
}
