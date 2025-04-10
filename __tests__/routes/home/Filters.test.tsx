import { BrightIdBackupConnection } from '@/types';
import { setupServer } from 'msw/node';
import {
  createSubjectCategory,
  generateEvaluationImpact,
  generateRandomBrightIdConnectionBackup,
  TEST_BRIGHT_ID,
} from '../../utils/api/profile';
import {
  profileInterceptor,
  backupInterceptor,
  makeMockOutboundInterceptor,
  inboundEmptyInterceptor,
} from '../../utils/api/server';
import { renderWithRouterAndRedux } from '../../utils/app';
import HomePage from '@/app/routes/_app.home/route';
import { RefreshEvaluationsContextProvider } from '@/contexts/RefreshEvaluationsContext';
import { SubjectsListContextProvider } from '@/contexts/SubjectsListContext';
import { MyEvaluationsContextProvider } from '@/contexts/MyEvaluationsContext';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EvaluationCategory, EvaluationValue } from '@/types/dashboard';

const mockedOutboundData = {
  data: { connections: [] as BrightIdBackupConnection[] },
};

const connection1 = generateRandomBrightIdConnectionBackup(
  'already known',
  'just met',
);
connection1.auraEvaluations?.push({
  domain: 'BrightID',
  category: EvaluationCategory.PLAYER,
  confidence: 4,
  evaluation: EvaluationValue.POSITIVE,
  modified: new Date().getTime() / 1000,
});

const domains = connection1.verifications![0].domains!;

domains[0].categories.push(
  createSubjectCategory(
    EvaluationCategory.PLAYER,
    [
      generateEvaluationImpact(
        TEST_BRIGHT_ID,
        Math.floor(Math.random() * 100000),
        4,
        Math.floor(Math.random() * 100000),
      ),
    ],
    1,
  ),
);

const connection2 = generateRandomBrightIdConnectionBackup(
  'aura only',
  'aura only',
);

connection2.timestamp = new Date().getTime() + 400000;

const connection3 = generateRandomBrightIdConnectionBackup(
  'just met',
  'already known',
);
const connection4 = generateRandomBrightIdConnectionBackup(
  'recovery',
  'just met',
);
const connection5 = generateRandomBrightIdConnectionBackup(
  'recovery',
  'suspicious',
);

mockedOutboundData.data.connections.push(
  connection1,
  connection2,
  connection3,
  connection4,
  connection5,
);

const outboundData = mockedOutboundData;

const restListeners = [
  profileInterceptor,
  backupInterceptor,
  inboundEmptyInterceptor,
  makeMockOutboundInterceptor(outboundData),
];

const server = setupServer(...restListeners);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterAll(() => server.close());

afterEach(() => server.resetHandlers());

describe('Filter basic bahvior', () => {
  it('Sort by Recent connections', async () => {
    renderWithRouterAndRedux(
      <RefreshEvaluationsContextProvider>
        <MyEvaluationsContextProvider>
          <SubjectsListContextProvider>
            <HomePage />
          </SubjectsListContextProvider>
        </MyEvaluationsContextProvider>
      </RefreshEvaluationsContextProvider>,
      {},
    );

    await waitFor(() => {
      expect(screen.getByTestId('home-view-select')).toBeInTheDocument();

      userEvent.click(screen.getByTestId('home-view-select'));
    });

    await act(() => {
      userEvent.click(screen.getByTestId('dropdown-option-0'));
    });

    // await waitFor(() => {
    //   expect(
    //     screen.getByTestId(`subject-card-${connection1.id}`),
    //   ).toBeInTheDocument();
    // });
  });

  it('Sort by recently evaluated connections');

  it('Should remember the sort state when refreshing or reloading the page');
});

describe('Custom Filter Behavior', () => {
  it('Should Open when clicking custom view');

  it('Should Reset the view when clicking the clear button');

  it('Should Close the modal when clicking okay or close');

  it('Should filter by level');

  it('Should filter by your evaluation ');

  it('Should filter by connection type ');

  it('Should sort by last connected, ASC/DESC');

  it('Should sort by confidence, ASC/DESC');

  it('Should sort by Score, ASC/DESC');
  it('Should sort by Recently evaluated, ASC/DESC');

  it('Should sort by combination of score and confidence');
});
