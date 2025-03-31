import { SubjectCard } from '@/components/EvaluationFlow/SubjectCard';
import { act, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { renderWithRouterAndRedux } from '../utils/app';
import {
  BRIGHTID_BACKUP,
  createSubjectCategory,
  findProfileCategory,
  generateEvaluationImpact,
  generateRandomBrightIdConnectionBackup,
  mockedBrightIdProfileData,
  TEST_BRIGHT_ID,
} from '../utils/api/profile';
import { MyEvaluationsContextProvider } from '@/contexts/MyEvaluationsContext';
import { RefreshEvaluationsContextProvider } from '@/contexts/RefreshEvaluationsContext';
import { http, HttpResponse } from 'msw';
import {
  backupInterceptor,
  makeMockOutboundInterceptor,
  profileInterceptor,
} from '../utils/api/server';
import { BrightIdBackupConnection } from '@/types';
import { EvaluationCategory, EvaluationValue } from '@/types/dashboard';
import { compactFormat } from '@/utils/number';

const createOutboundMockedData = () => {
  const mockedOutboundData = {
    data: { connections: [] as BrightIdBackupConnection[] },
  };

  const connection = generateRandomBrightIdConnectionBackup();
  mockedOutboundData.data.connections.push(connection);

  connection.auraEvaluations?.push({
    domain: 'BrightID',
    category: EvaluationCategory.PLAYER,
    confidence: 4,
    evaluation: EvaluationValue.POSITIVE,
    modified: new Date().getTime() / 1000,
  });

  const domains =
    mockedOutboundData.data.connections[0].verifications![0].domains!;

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

  return mockedOutboundData;
};

describe('Subject card functionality', () => {
  const outboundData = createOutboundMockedData();

  const restListeners = [
    profileInterceptor,
    backupInterceptor,
    makeMockOutboundInterceptor(outboundData),
  ];

  const server = setupServer(...restListeners);

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterAll(() => server.close());

  afterEach(() => server.resetHandlers());

  it('Should render the component with the correct info', async () => {
    await act(() =>
      renderWithRouterAndRedux(
        <RefreshEvaluationsContextProvider>
          <MyEvaluationsContextProvider>
            <SubjectCard
              verifications={mockedBrightIdProfileData.data.verifications}
              index={0}
              subjectId={TEST_BRIGHT_ID}
            />
          </MyEvaluationsContextProvider>
        </RefreshEvaluationsContextProvider>,
        {
          router: { initialEntries: ['/home'] },
        },
      ),
    );

    await waitFor(() => {
      expect(screen.getByTestId(`subject-item-0-level`)).toHaveTextContent(
        findProfileCategory(
          mockedBrightIdProfileData,
          'subject',
        ).level.toString(),
      );

      expect(screen.getByTestId(`subject-item-0-score`)).toHaveTextContent(
        compactFormat(
          findProfileCategory(mockedBrightIdProfileData, 'subject').score,
        ),
      );

      expect(screen.getByTestId(`subject-item-0-name`)).toHaveTextContent(
        BRIGHTID_BACKUP.userData.name,
      );

      expect(
        screen.getByTestId(`subject-card-${TEST_BRIGHT_ID}`),
      ).toHaveAttribute('href', `/subject/${TEST_BRIGHT_ID}`);
    });
  });
});
