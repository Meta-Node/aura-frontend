import { ToastAction, ToastProvider } from 'components/ui/toast';
import { useToast } from 'hooks/use-toast';
import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const UpdatePrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log('test for update ');
      console.log(`Service Worker at: ${swUrl}`);
      r &&
        setInterval(() => {
          console.log('Checking for sw update');
          r.update();
        }, 60000);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const { toast } = useToast();

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
          <ToastAction
            altText="Update"
            onClick={() => updateServiceWorker(false)}
          >
            Update
          </ToastAction>
        ),
        duration: Infinity,
      });
    }
  }, [needRefresh, toast, updateServiceWorker]);

  return <ToastProvider />;
};

export default UpdatePrompt;
