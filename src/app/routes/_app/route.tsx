import { lazy } from 'react';
import { Outlet } from 'react-router';

const EvaluationOpNotifications = lazy(
  () => import('@/components/EvaluationOpNotifications'),
);

export default function AppLanding() {
  return (
    <div className={`bg-circle-dots bg-background-light dark:bg-background`}>
      <div className="app">
        <Outlet />

        <div className="sticky bottom-2 pl-5 pr-5">
          <EvaluationOpNotifications />
        </div>
      </div>
    </div>
  );
}
