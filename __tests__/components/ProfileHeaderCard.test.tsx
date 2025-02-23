

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { BRIGHTID_BACKUP, findRoleVerification, mockedBrightIdProfileData, TEST_AUTH_KEY, TEST_BRIGHT_ID, TEST_BRIGHT_PASSWORD } from '../utils/api/profile'
import { renderWithProviders } from '../utils/redux'
import ProfileHeaderCard from '@/app/routes/_app.home/components/ProfileHeaderCard'
import { act, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { encryptData } from '@/utils/crypto'
import { setGlobalOrigin } from 'undici'
import { compactFormat } from '@/utils/number'
import { calculateUserScorePercentage } from '@/utils/score'
import { EvaluationCategory } from '@/types/dashboard'



export const restHandlers = [
  http.get(`/auranode-test/brightid/v6/users/${TEST_BRIGHT_ID}/profile`, () => HttpResponse.json(mockedBrightIdProfileData)),
  http.get(`/brightid/backups/${TEST_AUTH_KEY}/${TEST_BRIGHT_ID}`, () => HttpResponse.text(encryptData(JSON.stringify(BRIGHTID_BACKUP), TEST_BRIGHT_PASSWORD)))
]

const server = setupServer(...restHandlers)


beforeAll(() => {
  setGlobalOrigin(window.location.href)
  server.listen({ onUnhandledRequest: 'error' })
})

afterAll(() => server.close())

afterEach(() => server.resetHandlers())



describe('Profile Card Header component', () => {
  it("Should render the component", async () => {
    await act(() => {
      renderWithProviders(
        <MemoryRouter initialEntries={["/home"]}>
          <ProfileHeaderCard subjectId={TEST_BRIGHT_ID} />
        </MemoryRouter>
      )
    })

    expect(screen.getByTestId('profile-name')).toBeInTheDocument()
    expect(screen.getByTestId('profile-name')).toHaveTextContent(BRIGHTID_BACKUP.userData.name)

    const levelElement = screen.getByTestId('profile-level')
    const scoreElement = screen.getByTestId('profile-score')

    const verificationRole = findRoleVerification('player')!

    expect(levelElement).toHaveTextContent(verificationRole.level.toString())
    expect(scoreElement).toHaveTextContent(compactFormat(verificationRole.score))


    const progressElement = screen.getByTestId('profile-progressbar')

    expect(progressElement).toHaveStyle(`width: ${calculateUserScorePercentage(EvaluationCategory.PLAYER, verificationRole.score)}%`)
  })
})