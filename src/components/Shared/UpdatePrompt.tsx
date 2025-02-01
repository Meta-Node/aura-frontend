import { ToastAction, ToastProvider } from 'components/ui/toast';
import { useToast } from 'hooks/use-toast';
import { usePWAUpdate } from 'hooks/usePWAUpdate';
import React from 'react';

const UpdatePrompt = () => {
  const updateAvailable = usePWAUpdate();
  const { toast } = useToast();

  const updateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    if (import.meta.hot) {
      console.log('Hot Reloading');
      console.log('This is a test for HMR ');
      import.meta.hot.accept();
    }
  };

  React.useEffect(() => {
    if (updateAvailable) {
      toast({
        title: 'New Version Available ↗️',
        description: 'Click update to get the latest features.',
        action: (
          <ToastAction altText="Update" onClick={updateApp}>
            Update
          </ToastAction>
        ),
      });
    }
  }, [updateAvailable, toast]);

  return <ToastProvider />;
};

export default UpdatePrompt;
