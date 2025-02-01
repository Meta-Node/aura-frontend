import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setUpdateAvailable(true);
      },
    });

    return () => {
      if (updateSW) {
        updateSW();
      }
    };
  }, []);

  return updateAvailable;
}
