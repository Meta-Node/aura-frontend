import { ToastAction, ToastProvider } from 'components/ui/toast';
import { useToast } from 'hooks/use-toast';
import React from 'react';
import { usePWAManager } from '@remix-pwa/client';
import { useGetAppLatestVersionQuery } from '@/store/api/backup';
import { skipToken } from '@reduxjs/toolkit/query';

const isDevelopment = process.env.NODE_ENV === 'development';

const UpdatePrompt = () => {
  const {
    promptInstall,
    swRegistration,
    swUpdate,
    updateAvailable,
    userInstallChoice,
  } = usePWAManager();

  const { toast } = useToast();
  const { data, isLoading } = useGetAppLatestVersionQuery(
    isDevelopment ? skipToken : undefined,
    {
      pollingInterval: 60000,
    },
  );

  React.useEffect(() => {
    if (updateAvailable || (APP_VERSION !== data && !isDevelopment)) {
      toast({
        title: 'New Version Available ↗️',
        description: 'Click update to get the latest features.',
        action: (
          <ToastAction
            altText="Update"
            onClick={() => {
              swRegistration?.update();
              window.location.reload();
            }}
          >
            Update
          </ToastAction>
        ),
        duration: Infinity,
      });
    }
  }, [updateAvailable, data, swUpdate, toast]);

  return <ToastProvider />;
};

export default UpdatePrompt;
