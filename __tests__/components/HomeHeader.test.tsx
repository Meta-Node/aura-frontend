import HomeHeader from '@/app/routes/_app.home/header';
import { act, screen } from '@testing-library/react';
import { backupInterceptor, profileInterceptor } from '../utils/api/server';
import { setupServer } from 'msw/node';
import { setGlobalOrigin } from 'undici';
import { renderWithProviders } from '../utils/redux';
import { MemoryRouter as Router } from 'react-router';
import { MemoryRouter } from 'react-router-dom';
import { MyEvaluationsContextProvider } from '@/contexts/MyEvaluationsContext';
import { RefreshEvaluationsContextProvider } from '@/contexts/RefreshEvaluationsContext';

export const restHandlers = [profileInterceptor, backupInterceptor];

const server = setupServer(...restHandlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

beforeEach(() => {
  setGlobalOrigin(window.location.href);
});

afterAll(() => server.close());

afterEach(() => server.resetHandlers());

describe('Home Header', () => {
  it('should render with correct roles', async () => {
    await act(() => {
      renderWithProviders(
        // <Router>
        <MemoryRouter initialEntries={['/home']}>
          <RefreshEvaluationsContextProvider>
            <MyEvaluationsContextProvider>
              <HomeHeader />
            </MyEvaluationsContextProvider>
          </RefreshEvaluationsContextProvider>
        </MemoryRouter>,
        // </Router>,
        {},
      );
    });

    expect(screen.getByTestId('hometab-Player')).toBeInTheDocument();
    expect(screen.queryByTestId('hometab-Trainer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hometab-Manager')).not.toBeInTheDocument();
  });

  it('Should render with trainer role', async () => {});
});
