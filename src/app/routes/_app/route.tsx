import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';

import EvaluationOpNotifications from '@/components/EvaluationOpNotifications';

export default function AppLanding() {
  return (
    <div className={`bg-circle-dots bg-background-light dark:bg-background`}>
      <div className="app">
        <Outlet />

        <div className="sticky bottom-2 pl-5 pr-5">
          <Suspense>
            <EvaluationOpNotifications />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
