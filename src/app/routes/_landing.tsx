import { Outlet } from 'react-router';

export default function LandingLayout() {
  return (
    <div className="bg-background dark:bg-black3">
      <div className="app">
        <Outlet />
      </div>
    </div>
  );
}
