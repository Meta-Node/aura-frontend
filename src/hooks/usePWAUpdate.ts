import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

const CHECK_INTERVAL = 1000 * 60 * 1; // 1 minute

export function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setUpdateAvailable(true); // ✅ Triggers a state update
      },
    });

    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          setUpdateAvailable(true);
        }
      });
    }, CHECK_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return updateAvailable;
}
