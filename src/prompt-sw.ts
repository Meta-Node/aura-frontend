import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

declare let self: any;

self.addEventListener('message', (event: any) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});

const manualPrecache = [{ url: 'index.html', revision: null }];

precacheAndRoute([...self.__WB_MANIFEST, ...manualPrecache]);

cleanupOutdatedCaches();

registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));
