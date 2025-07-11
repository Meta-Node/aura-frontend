import { Outlet } from 'react-router';
import { useStore } from 'react-redux';
import EvaluationOpNotifications from '@/components/EvaluationOpNotifications';
import { IS_PRODUCTION } from '@/utils/env';
import { useDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { triggerNotificationFetch } from '@/store/notifications';
import { useMyEvaluations } from '@/hooks/useMyEvaluations';

export default function AppLanding() {
  const dispatch = useDispatch();
  const { getState } = useStore();

  const { myRatings } = useMyEvaluations();

  useEffect(() => {
    if (!myRatings) return;

    triggerNotificationFetch(getState, dispatch, myRatings);

    const interval = setInterval(
      () => {
        triggerNotificationFetch(getState, dispatch, myRatings);
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [dispatch, myRatings]);

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
