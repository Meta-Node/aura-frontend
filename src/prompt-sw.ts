import { cleanupOutdatedCaches } from 'workbox-precaching';
import { setupPwa } from '@vite-pwa/remix/sw';
import { setupRoutes } from './shared-sw';

declare const self: ServiceWorkerGlobalScope;
cleanupOutdatedCaches();

setupPwa({
  manifest: self.__WB_MANIFEST,
});

self.addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

setupRoutes().then(console.log);
