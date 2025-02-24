import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

const EvaluationOpNotifications = lazy(
  () => import('@/components/EvaluationOpNotifications'),
);

export default function AppLanding() {
  return (
    <div
      className={`bg-background-light dark:bg-gradient-to-tr dark:from-black dark:to-gray-950`}
    >
      <div className="app">
        <Outlet />

        <div className="sticky bottom-2 pl-5 pr-5">
          <EvaluationOpNotifications />
        </div>
      </div>
    </div>
  );
}
