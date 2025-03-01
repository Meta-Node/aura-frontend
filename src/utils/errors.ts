import { registerSW } from 'virtual:pwa-register';

export const APP_STATE = {
  isStarted: false,
};

window.addEventListener('unhandledrejection', (event) => {
  if (APP_STATE.isStarted) {
    return;
  }

  registerSW({
    onNeedRefresh() {},
    onRegistered(registration) {
      if (!APP_STATE.isStarted) {
        registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    },
    onOfflineReady() {
      console.log('App is ready to work offline');
    },
  });
});
