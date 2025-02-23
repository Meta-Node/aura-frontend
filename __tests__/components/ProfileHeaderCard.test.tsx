

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { BRIGHTID_BACKUP, mockedBrightIdProfileData, TEST_AUTH_KEY, TEST_BRIGHT_ID, TEST_BRIGHT_PASSWORD } from '../utils/api/profile'
import { renderWithProviders } from '../utils/redux'
import ProfileHeaderCard from '@/app/routes/_app.home/components/ProfileHeaderCard'
import { act, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { encryptData } from '@/utils/crypto'



export const restHandlers = [
  http.get(`/auranode-test/brightid/v6/users/${TEST_BRIGHT_ID}/profile`, () => HttpResponse.json(mockedBrightIdProfileData)),
  http.get(`/brightid/backups/${TEST_AUTH_KEY}/${TEST_BRIGHT_ID}`, () => HttpResponse.text(encryptData(JSON.stringify(BRIGHTID_BACKUP), TEST_BRIGHT_PASSWORD)))
]

const server = setupServer(...restHandlers)


beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

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
  })
})