import { ToastAction, ToastProvider } from 'components/ui/toast';
import { useToast } from 'hooks/use-toast';
import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
// import { pwaInfo } from 'virtual:pwa-info';

// console.log(pwaInfo);

const UpdatePrompt = () => {
  const buildDate = '__DATE__';
  // replaced dyanmicaly
  const reloadSW = '__RELOAD_SW__';

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker at: ${swUrl}`);
      // @ts-expect-error just ignore
      if (reloadSW === 'true') {
        r &&
          setInterval(() => {
            console.log('Checking for sw update');
            r.update();
          }, 20000 /* 20s for testing purposes */);
      } else {
        // eslint-disable-next-line prefer-template
        console.log('SW Registered: ' + r);
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const { toast } = useToast();

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    console.log('test for hot reloading 2 the application');
    if (import.meta.hot) {
      console.log('Hot Reloading');
      import.meta.hot.accept();
    }
  };

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  React.useEffect(() => {
    if (needRefresh) {
      toast({
        title: 'New Version Available ↗️',
        description: 'Click update to get the latest features.',
        action: (
          <ToastAction altText="Update" onClick={updateApp}>
            Update
          </ToastAction>
        ),
        duration: Infinity,
      });
    }
  }, [needRefresh, toast]);

  return <ToastProvider />;
};

export default UpdatePrompt;
