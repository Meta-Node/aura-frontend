import HomeHeader from '@/app/routes/_app.home/components/header';
import { act, screen, waitFor } from '@testing-library/react';
import { backupInterceptor, profileInterceptor } from '../utils/api/server';
import { setupServer } from 'msw/node';
import { renderWithProviders } from '../utils/redux';
import { MemoryRouter } from 'react-router';
import { MyEvaluationsContextProvider } from '@/contexts/MyEvaluationsContext';
import { RefreshEvaluationsContextProvider } from '@/contexts/RefreshEvaluationsContext';
import NotificationsPage from '@/app/routes/_app.notifications/route';
import { renderWithRouterAndRedux } from '../utils/app';
import {
  mockedBrightIdProfileData,
  TEST_BRIGHT_ID,
  TEST_BRIGHT_PASSWORD,
} from '../utils/api/profile';
import { EvaluationCategory, PreferredView } from '@/types/dashboard';
import localforage from 'localforage';

export const restHandlers = [profileInterceptor, backupInterceptor];

const server = setupServer(...restHandlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => server.close());

afterEach(() => server.resetHandlers());

beforeEach(() => {
  localStorage.clear();
  localforage.clear();
});

describe('Notification Utils', () => {
  it('Should not create any notification for initial load', async () => {
    await act(() => {
      renderWithProviders(
        <MemoryRouter initialEntries={['/notifications']}>
          <RefreshEvaluationsContextProvider>
            <MyEvaluationsContextProvider>
              <NotificationsPage />
            </MyEvaluationsContextProvider>
          </RefreshEvaluationsContextProvider>
        </MemoryRouter>,
        {},
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('notifications-count-0')).toBeInTheDocument();
      expect(screen.getByTestId('no-notifications')).toBeInTheDocument();
    });
  });
  it('Should create a notification for user level increase', async () => {
    const auraVerification =
      mockedBrightIdProfileData.data.verifications[0].domains![0];

    const [subjectVer, playerVer, trainerVer, managerVer] =
      auraVerification.categories;

    const evaluationsCount =
      subjectVer.impacts.length +
      playerVer.impacts.length +
      trainerVer.impacts.length +
      managerVer.impacts.length;

    subjectVer.score = 5;
    playerVer.level = 12;

    managerVer.level = 0;
    managerVer.score = 0;

    await act(() => {
      renderWithRouterAndRedux(
        <RefreshEvaluationsContextProvider>
          <MyEvaluationsContextProvider>
            <NotificationsPage />
          </MyEvaluationsContextProvider>
        </RefreshEvaluationsContextProvider>,
        {
          router: {
            initialEntries: ['/notifications'],
          },
          redux: {
            preloadedState: {
              profile: {
                authData: {
                  brightId: TEST_BRIGHT_ID,
                  password: TEST_BRIGHT_PASSWORD,
                },
                brightIdBackupEncrypted: null,
                splashScreenShown: true,
                playerOnboardingScreenShown: true,
                preferredView: PreferredView.PLAYER,
              },
              notifications: {
                trackedProfiles: {
                  [TEST_BRIGHT_ID]: {
                    id: TEST_BRIGHT_ID,
                    categories: {
                      [EvaluationCategory.PLAYER]: {
                        score: 0,
                        level: 10,
                        evaluators: [],
                        explorivity: 0,
                      },
                      [EvaluationCategory.SUBJECT]: {
                        score: 0,
                        level: 0,
                        evaluators: [],
                        explorivity: 0,
                      },
                      [EvaluationCategory.TRAINER]: {
                        score: 0,
                        level: 0,
                        evaluators: [],
                        explorivity: 0,
                      },
                      [EvaluationCategory.MANAGER]: {
                        score: 0,
                        level: 0,
                        evaluators: [],
                        explorivity: 0,
                      },
                    },
                    lastUpdated: new Date().getTime() - 1000000,
                  },
                },
                items: [],
                error: null,
                lastFetched: new Date().getTime() - 1000000,
                loading: false,
              },
            },
          },
        },
      );
    });

    await waitFor(() => {
      const notificaitonsCount = 5 + evaluationsCount;

      expect(
        screen.queryByTestId(`notifications-count-${notificaitonsCount}`),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('notifications-count-0'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('no-notifications')).not.toBeInTheDocument();
    });
  });
});
