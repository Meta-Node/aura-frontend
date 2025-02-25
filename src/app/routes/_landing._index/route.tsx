import RecoveryCodeScreen from 'BrightID/components/Onboarding/RecoveryFlow/RecoveryCodeScreen';
import useRedirectAfterLogin from 'hooks/useRedirectAfterLogin';
import { useEffect, useState } from 'react';
import { useSelector } from 'store/hooks';
import {
  selectIsLoggedIn,
  selectSplashScreenShown,
} from 'store/profile/selectors';

import CustomTrans from '@/components/CustomTrans';
import { checkIndexedDB } from '@/utils/check-db';
import { selectPreferredTheme } from '@/BrightID/reducer/settingsSlice';
import Splash from './components/splash';

const Login = () => {
  const userIsLogged = useSelector(selectIsLoggedIn);
  const splashScreenShown = useSelector(selectSplashScreenShown);
  const redirectAfterLogin = useRedirectAfterLogin();
  const preferredTheme = useSelector(selectPreferredTheme);

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

  return <div>{splashScreenShown ? <RecoveryCodeScreen /> : <Splash />}</div>;
};

const DbUnhealthy = () => {
  return (
    <div className="page page__splash flex flex-col !px-[22px] !pt-[90px] pb-4">
      <section className="content pl-5 pr-12">
        <p className="mb-3 text-5xl font-black text-white">Aura</p>
        <p className="mb-9 text-2xl font-black text-white">
          <CustomTrans i18nKey="welcomeScreen.tagline" />
        </p>
        <p className="text-lg font-medium text-white">
          <CustomTrans i18nKey="welcomeScreen.description" />
        </p>
      </section>

      <div className="text-warn">
        <p>IndexedDB is blocked. Please enable IndexedDB to use Aura.</p>
      </div>

      <section className="actions mb-24 mt-auto text-center">
        <button
          className="btn btn--big w-full max-w-[270px] !text-white"
          data-testid="splash-dismiss-btn"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </section>
      <footer className="flex justify-between text-sm text-gray90">
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
