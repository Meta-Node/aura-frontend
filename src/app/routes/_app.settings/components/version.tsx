import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetAppLatestVersionQuery } from '@/store/api/backup';
import { skipToken } from '@reduxjs/toolkit/query';
import { usePWAManager } from '@remix-pwa/client';
import { Loader2 } from 'lucide-react';
import { MdUpdate } from 'react-icons/md';

const isDevelopment = process.env.NODE_ENV === 'development';

export default function VersionCard() {
  const { data, isLoading } = useGetAppLatestVersionQuery(
    isDevelopment ? skipToken : undefined,
    {
      pollingInterval: 20000,
    },
  );

  const {
    promptInstall,
    swRegistration,
    swUpdate,
    updateAvailable,
    userInstallChoice,
  } = usePWAManager();

  const handleUpdate = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.update();
      window.location.reload();
    }
  };

  return (
    <Card className="flex items-center justify-between gap-2 rounded-lg py-3.5 pl-5 pr-2">
      <div>
        <div className="flex items-center gap-2">
          <MdUpdate size={20} />
          <p className="text-[20px] font-medium">Update Aura</p>
        </div>
        <p className="mt-3 text-sm">
          You are currently using version {APP_VERSION}
        </p>
      </div>
      {isDevelopment ? (
        <Button disabled>Update</Button>
      ) : (
        <div>
          {isLoading ? (
            <Button disabled>
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={handleUpdate}
              disabled={data === APP_VERSION && !updateAvailable}
            >
              {!updateAvailable ? (
                'Update'
              ) : (
                <>
                  Update Available <small>{data}</small>
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
