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

const manualPrecache = [{ url: 'index.html', revision: null }];

precacheAndRoute(
  self.__WB_MANIFEST
    .filter((entry: { url: string }) => entry.url !== 'index.html')
    .concat(manualPrecache),
);

cleanupOutdatedCaches();

registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), {
    denylist: [
      /\/api\//,
      /\.(?:js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|otf|json|ico)$/,
    ],
  }),
);
