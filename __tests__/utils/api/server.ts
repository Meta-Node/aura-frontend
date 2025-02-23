import { http, HttpResponse } from 'msw';
import { encryptData } from '@/utils/crypto';
import {
  BRIGHTID_BACKUP,
  mockedBrightIdProfileData,
  TEST_AUTH_KEY,
  TEST_BRIGHT_ID,
  TEST_BRIGHT_PASSWORD,
} from './profile';

export const profileInterceptor = http.get(
  `/auranode-test/brightid/v6/users/${TEST_BRIGHT_ID}/profile`,
  () => HttpResponse.json(mockedBrightIdProfileData),
);

export const backupInterceptor = http.get(
  `/brightid/backups/${TEST_AUTH_KEY}/${TEST_BRIGHT_ID}`,
  () =>
    HttpResponse.text(
      encryptData(JSON.stringify(BRIGHTID_BACKUP), TEST_BRIGHT_PASSWORD),
    ),
);
