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

  React.useEffect(() => {
    if (updateAvailable) {
      toast({
        title: 'New Version Available ↗️',
        description: 'Click update to get the latest features.',
        action: (
          <ToastAction altText="Update" onClick={swRegistration?.update}>
            Update
          </ToastAction>
        ),
        duration: Infinity,
      });
    }
  }, [updateAvailable, swUpdate, toast]);

  return <ToastProvider />;
};

export default UpdatePrompt;
