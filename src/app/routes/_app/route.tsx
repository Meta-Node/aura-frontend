import { Outlet } from 'react-router';

import EvaluationOpNotifications from '@/components/EvaluationOpNotifications';
import { IS_PRODUCTION } from '@/utils/env';

export default function AppLanding() {
  return (
    <>
      <div
        style={
          IS_PRODUCTION
            ? {}
            : {
                background:
                  'linear-gradient(90deg, hsla(0,0%,25%,0.5) 1px, transparent 1px), linear-gradient(hsla(0,0%,25%,0.5) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                backgroundRepeat: 'repeat',
              }
        }
        className={`bg-circle-dots relative bg-background-light dark:bg-background`}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

        <div className="app relative">
          <Outlet />

          <div className="sticky bottom-2 pl-5 pr-5">
            <EvaluationOpNotifications />
          </div>
        </div>
      </div>
    </>
  );
}
