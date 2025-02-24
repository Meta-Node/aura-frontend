import SubjectProfileHeader from '@/app/routes/_app.subject.$id/components/header';
import { renderWithRouterAndRedux } from '../../utils/app';
import { act, screen, waitFor } from '@testing-library/react';
import { TEST_BRIGHT_ID } from '../../utils/api/profile';

describe('subject header component', () => {
  it('Should render the component on subject mode', async () => {
    await act(() =>
      renderWithRouterAndRedux(<SubjectProfileHeader />, {
        router: { initialEntries: ['/subject/' + TEST_BRIGHT_ID] },
      }),
    );

    expect(screen.getByTestId('header-title')).toHaveTextContent(
      'Subject Profile',
    );
  });

  it('Should render the component on player mode', async () => {
    await act(() =>
      renderWithRouterAndRedux(<SubjectProfileHeader />, {
        router: {
          initialEntries: ['/subject/' + TEST_BRIGHT_ID + '?viewas=player'],
        },
      }),
    );

    expect(screen.getByTestId('header-title')).toHaveTextContent(
      'Player Profile',
    );
  });

  it('Should render the component on trainer mode', async () => {
    await act(() =>
      renderWithRouterAndRedux(<SubjectProfileHeader />, {
        router: {
          initialEntries: ['/subject/' + TEST_BRIGHT_ID + '?viewas=trainer'],
        },
      }),
    );

    expect(screen.getByTestId('header-title')).toHaveTextContent(
      'Trainer Profile',
    );
  });

  it('Should render the component on manager mode', async () => {
    await act(() =>
      renderWithRouterAndRedux(<SubjectProfileHeader />, {
        router: {
          initialEntries: ['/subject/' + TEST_BRIGHT_ID + '?viewas=manager'],
        },
      }),
    );

    expect(screen.getByTestId('header-title')).toHaveTextContent(
      'Manager Profile',
    );
  });

  it('Should only render subject tab', async () => {
    await act(() =>
      renderWithRouterAndRedux(<SubjectProfileHeader />, {
        router: {
          initialEntries: ['/subject/' + TEST_BRIGHT_ID],
        },
      }),
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('subject-view-Subject')).toBeInTheDocument();
        expect(
          screen.queryByTestId('subject-view-Player'),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('subject-view-Trainer'),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('subject-view-Manager'),
        ).not.toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});
