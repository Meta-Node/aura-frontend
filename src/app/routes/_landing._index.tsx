import RecoveryCodeScreen from 'BrightID/components/Onboarding/RecoveryFlow/RecoveryCodeScreen';
import useRedirectAfterLogin from 'hooks/useRedirectAfterLogin';
import Splash from 'pages/Splash';
import { useEffect, useState } from 'react';
import { useSelector } from 'store/hooks';
import {
  selectIsLoggedIn,
  selectSplashScreenShown,
} from 'store/profile/selectors';

import CustomTrans from '@/components/CustomTrans';
import { checkIndexedDB } from '@/utils/check-db';
import { selectPreferredTheme } from '@/BrightID/reducer/settingsSlice';

const Login = () => {
  const userIsLogged = useSelector(selectIsLoggedIn);
  const splashScreenShown = useSelector(selectSplashScreenShown);
  const redirectAfterLogin = useRedirectAfterLogin();
  const preferredTheme = useSelector(selectPreferredTheme)

  const [isDbHealthy, setIsDbHealthy] = useState(false);

  useEffect(() => {
    if (userIsLogged) {
      redirectAfterLogin();
    }
  }, [redirectAfterLogin, userIsLogged]);

  useEffect(() => {
    checkIndexedDB().then((isHealthy) => {
      setIsDbHealthy(isHealthy);
    });
  }, []);

  if (!isDbHealthy) {
    return <DbUnhealthy />;
  }

  return <div className={`${preferredTheme === "dark" ? "app_container__dark" : "app_container"}`}>
    {splashScreenShown ? <RecoveryCodeScreen /> : <Splash />}
  </div>;
};

const DbUnhealthy = () => {
  return (
    <div className="page page__splash !pt-[90px] !px-[22px] pb-4 flex flex-col">
      <section className="content pl-5 pr-12">
        <p className="text-white font-black text-5xl mb-3">Aura</p>
        <p className="text-white font-black text-2xl mb-9">
          <CustomTrans i18nKey="welcomeScreen.tagline" />
        </p>
        <p className="text-white font-medium text-lg">
          <CustomTrans i18nKey="welcomeScreen.description" />
        </p>
      </section>

      <div className="text-warn">
        <p>IndexedDB is blocked. Please enable IndexedDB to use Aura.</p>
      </div>

      <section className="actions mb-24 mt-auto text-center">
        <button
          className="btn btn--big !text-white max-w-[270px] w-full"
          data-testid="splash-dismiss-btn"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </section>
      <footer className="flex justify-between text-gray90 text-sm">
        <span className="flex gap-1"></span>
        <span className="flex gap-1">
          <p className="text-gray50">Powered by:</p>
          <p className="font-light">BrightID</p>
        </span>
      </footer>
    </div>
  );
};

export default Login;
