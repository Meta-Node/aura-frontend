import { cleanupOutdatedCaches } from 'workbox-precaching';
import { setupPwa } from '@vite-pwa/remix/sw';
import { setupRoutes } from './shared-sw';
import { triggerNotificationFetch } from './store/notifications';
import { configureAppStore } from './store';
import { connectionsApi } from './store/api/connections';
import { AuraRating } from './types';
import { EvaluationValue } from './types/dashboard';

declare const self: ServiceWorkerGlobalScope;
cleanupOutdatedCaches();

setupPwa({
  manifest: self.__WB_MANIFEST,
});

setupRoutes().then(console.log);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function processOutboundRatings() {}

self.addEventListener('periodicsync', (event: any) => {
  if (event.tag === 'periodic-task') {
    const { store } = configureAppStore();

    const state = store.getState();

    event.waitUntil(
      (async () => {
        if (!state.profile.authData?.brightId) return;

        const subjectId = state.profile.authData.brightId;

        const outbounds = await connectionsApi.endpoints.getOutboundConnections
          .initiate({
            id: state.profile.authData.brightId,
          })(store.dispatch, store.getState, {})
          .unwrap();

        const outboundRatings: AuraRating[] | null = (() => {
          if (!outbounds.length || !subjectId) return null;
          const pendingRatings: AuraRating[] = [];

          return outbounds
            .reduce(
              (a, c) =>
                a.concat(
                  ...(c.auraEvaluations
                    ?.filter(
                      (r) =>
                        pendingRatings.findIndex(
                          (pr) =>
                            pr.toBrightId === c.id &&
                            pr.category === r.category,
                        ) === -1,
                    )
                    .map((e) => ({
                      fromBrightId: subjectId,
                      toBrightId: c.id,
                      rating: String(
                        (e.evaluation === EvaluationValue.POSITIVE ? 1 : -1) *
                          e.confidence,
                      ),
                      category: e.category,
                      id: 0,
                      createdAt: new Date(
                        e.modified || c.timestamp,
                      ).toISOString(),
                      updatedAt: new Date(
                        e.modified || c.timestamp,
                      ).toISOString(),
                      timestamp: e.modified || c.timestamp,
                      isPending: false,
                      verifications: c.verifications,
                    })) ?? []),
                ),
              [] as AuraRating[],
            )
            .concat(pendingRatings)
            .sort((a, b) => a.timestamp - b.timestamp);
        })();

        await triggerNotificationFetch(
          store.getState,
          store.dispatch,
          outboundRatings ?? [],
        );

        const { notifications } = store.getState();

        if (Notification.permission !== 'granted') {
          return;
        }

        const newNotifications = notifications.items.filter(
          (item) => !item.viewed,
        );

        if (!newNotifications.length) return;

        await self.registration.showNotification('App Update', {
          body: 'You have new notifications in aura app!',
          icon: '/assets/images/notification.jpg',
          tag: 'update-notification',
        });
      })(),
    );
  }
});
