import {
  selectIsSearchModalOpen,
  selectPrefferedTheme,
  toggleSearchModal,
} from 'BrightID/actions';
import GlobalSearchModal from 'components/GlobalSearchModal';
import { useMyEvaluationsContext } from 'contexts/MyEvaluationsContext';
import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import routes from 'Routes';
import { RoutePath } from 'types/router';

import EvaluationOpNotifications from './components/EvaluationOpNotifications';
import Header from './components/Header';
import {
  selectIsLoggedIn,
  selectPlayerOnboardingScreenShown,
} from './store/profile/selectors';

const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {
  const userIsLogged = useSelector(selectIsLoggedIn); // Your hook to get login status
  if (!userIsLogged) {
    return (
      <Navigate
        to={{
          pathname: RoutePath.LOGIN,
          search: `next=${encodeURIComponent(
            window.location.href.slice(window.location.origin.length),
          )}`,
        }}
        replace
      />
    );
  }
  return children;
};

function App() {
  const location = useLocation();
  const currentRouteObject = useMemo(
    () => routes.find((route) => route.pathRegex.test(location.pathname)),
    [location.pathname],
  );
  const dispatch = useDispatch();

  //TODO: remove these hardcodes after a stable release
  const playerOnboardingScreenShown = useSelector(
    selectPlayerOnboardingScreenShown,
  );
  const prefferedTheme = useSelector(selectPrefferedTheme);

  const isSearchModalOpen = useSelector(selectIsSearchModalOpen);

  const { myRatings } = useMyEvaluationsContext();
  const isPlayerOnboarding =
    location.pathname === RoutePath.HOME &&
    myRatings?.length === 0 &&
    !playerOnboardingScreenShown;
  const hasDarkBackground =
    location.pathname === RoutePath.LOGIN ||
    location.pathname === RoutePath.SPLASH ||
    location.pathname === RoutePath.ONBOARDING ||
    isPlayerOnboarding;

  const noHeader = currentRouteObject?.noHeader || isPlayerOnboarding;

  useEffect(() => {
    if (prefferedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [prefferedTheme]);

  return (
    <div
      className={`app_container bg-background ${
        hasDarkBackground && 'app_container__dark'
      } relative ${
        prefferedTheme !== 'light'
          ? 'dark app_container_dark_bg'
          : 'app_container'
      }`}
    >
      <div className="app">
        {!noHeader && <Header />}
        <Routes>
          {routes.map((route) => (
            <Route
              path={route.path}
              key={route.path}
              element={
                route.requireAuth ? (
                  <RequireAuth>{route.element}</RequireAuth>
                ) : (
                  route.element
                )
              }
            />
          ))}
          <Route path="*" element={<Navigate to={'/home'} replace={true} />} />
        </Routes>
        <div className="sticky bottom-2 pr-5 pl-5">
          <EvaluationOpNotifications />
        </div>
      </div>
      {isSearchModalOpen && (
        <GlobalSearchModal onClose={() => dispatch(toggleSearchModal())} />
      )}
    </div>
  );
}

export default App;
