import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

const CHECK_INTERVAL = 1000 * 60 * 1;

export function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setUpdateAvailable(true);
      },
    });

    const interval = setInterval(() => {
      updateSW();
    }, CHECK_INTERVAL);

    return () => {
      clearInterval(interval);
      updateSW();
    };
  }, []);

  return updateAvailable;
}
