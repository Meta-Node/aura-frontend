import { ToastAction, ToastProvider } from 'components/ui/toast';
import { useToast } from 'hooks/use-toast';
import React from 'react';
import { usePWAManager } from '@remix-pwa/client';

const UpdatePrompt = () => {
  const {
    promptInstall,
    swRegistration,
    swUpdate,
    updateAvailable,
    userInstallChoice,
  } = usePWAManager();

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
