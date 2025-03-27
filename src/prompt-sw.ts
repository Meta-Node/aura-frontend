import { cleanupOutdatedCaches } from 'workbox-precaching';
import { setupPwa } from '@vite-pwa/remix/sw';
import { setupRoutes } from './shared-sw';

declare const self: ServiceWorkerGlobalScope;
cleanupOutdatedCaches();

setupPwa({
  manifest: self.__WB_MANIFEST,
});

setupRoutes().then(console.log);
