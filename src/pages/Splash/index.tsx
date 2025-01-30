import { useState } from 'react';
import { useDispatch } from 'store/hooks';
import { setSplashScreenShown } from 'store/profile';

import { FadeIn, Scale } from '../../animations';
import CustomTrans from '../../components/CustomTrans';

const Spalsh = () => {
  const dispatch = useDispatch();

  const [isTabOpen, setIsTabOpen] = useState(false);

  const onCopyDataFromDev = () => {
    console.log();
    const devTab = window.open(
      `${import.meta.env.VITE_DEV_DEPLOYMENT_DOMAIN}/import`,
      '_blank',
    );

    devTab?.addEventListener('close', (event) => {
      setIsTabOpen(false);
    });

    window.addEventListener('message', (event) => {
      if (event.origin !== import.meta.env.VITE_DEV_DEPLOYMENT_DOMAIN) return;

      try {
        const data = JSON.parse(event.data);
        if (data.type === 'localStorageData') {
          localStorage.setItem('migratedData', JSON.stringify(data.payload));
          console.log('Received localStorage data from dev tab.');
        }
      } catch (error) {
        console.error('Invalid message format', error);
      }
    });

    setTimeout(() => {
      devTab?.postMessage(
        { type: 'requestLocalStorage', secret: 'SHARED_SECRET' },
        import.meta.env.VITE_DEV_DEPLOYMENT_DOMAIN,
      );
    }, 2000);
  };

  return (
    <div className="page page__splash !pt-[90px] !px-[22px] pb-4 flex flex-col">
      <section className="content pl-5 pr-12">
        <FadeIn delay={0.1}>
          <p className="text-white font-black text-5xl mb-3">Aura</p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-white font-black text-2xl mb-9">
            <CustomTrans i18nKey="welcomeScreen.tagline" />
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-white font-medium text-lg">
            <CustomTrans i18nKey="welcomeScreen.description" />
          </p>
        </FadeIn>
      </section>

      <section className="actions mb-24 mt-auto text-center">
        <Scale delay={0.25}>
          <button
            className="btn btn--big !text-white max-w-[270px] w-full"
            data-testid="splash-dismiss-btn"
            onClick={() => dispatch(setSplashScreenShown(true))}
          >
            Get Started
          </button>
          <button
            disabled={isTabOpen}
            className="btn mt-4 text-sm !text-white max-w-[270px] w-full"
            data-testid="splash-dismiss-btn"
            onClick={() => onCopyDataFromDev()}
          >
            Copy the data [DEV ONLY]
          </button>
        </Scale>
      </section>
      <FadeIn delay={0.3}>
        <footer className="flex justify-between text-gray90 text-sm">
          <span className="flex gap-1">
            {/* <p className="font-light">Version</p>
            <p className="">2.1</p> */}
          </span>
          <span className="flex gap-1">
            <p className="text-gray50">Powered by:</p>
            <p className="font-light">BrightID</p>
          </span>
        </footer>
      </FadeIn>
    </div>
  );
};

export default Spalsh;
