/* eslint-disable @typescript-eslint/no-unused-expressions */

import localforage from 'localforage';
import { ProfileState } from 'store/profile';
import { RoutePath } from 'types/router';
import { decryptData, encryptData } from 'utils/crypto';

import { getTestSelector } from '../utils';
import {
  BRIGHT_ID_BACKUP,
  FAKE_AUTH_KEY,
  FAKE_BRIGHT_ID,
  FAKE_BRIGHT_ID_PASSWORD,
  recoveryUserInfo,
} from '../utils/data';

describe('Auth', () => {
  beforeEach(() => {
    cy.profileIntercepts();
  });

  function doLogin() {
    const dataId =
      'iA:YztBoikEQb1LK5PYztBoikEQ-rE9rMDH52d0R1LK5PntbNxrE9rMDHG2d0RgsAhOhKQmntbNxgsAhOhKQmiA';
    cy.intercept(
      {
        url: `/auranode*/profile/upload/*`,
        method: 'POST',
      },
      {
        body: { status: true },
        statusCode: 201,
      },
    ).as('profileUpload');
    cy.intercept(
      {
        url: `/auranode*/profile/list/*`,
        method: 'GET',
      },
      {
        body: { profileIds: ['data'] },
        statusCode: 200,
      },
    ).as('profileWaitingForScan');

    cy.intercept(
      {
        url: `/auranode*/profile/download/**/sig_completed_` + dataId,
        method: 'GET',
      },
      {
        body: {
          data: null,
        },
        statusCode: 200,
      },
    ).as('downloadCompleted');

    cy.intercept(
      {
        url: `/auranode*/profile/*/sig_userinfo_` + dataId,
        method: 'DELETE',
      },
      {
        body: { status: true },
        statusCode: 200,
      },
    ).as('deleteUserInfo');
    cy.intercept(
      {
        url: `/auranode*/profile/*/sig_completed_` + dataId,
        method: 'DELETE',
      },
      {
        body: { status: true },
        statusCode: 200,
      },
    ).as('deleteDownloadCompleted');

    cy.visit('/', {
      onBeforeLoad(window) {
        window.localStorage.removeItem('persist:root');
      },
    });
    cy.get(getTestSelector('splash-dismiss-btn')).click();
    cy.get(getTestSelector('import-universal-link'))
      .invoke('attr', 'href')
      .then((universalLink) => {
        if (!universalLink) throw Error('aesKey not found');
        const aesKey =
          new URL(
            decodeURIComponent(
              universalLink.slice(
                'https://app.brightid.org/connection-code/'.length,
              ),
            ),
          ).searchParams.get('aes') || '';

        cy.intercept(
          {
            url: `/auranode*/profile/download/**/sig_userinfo_` + dataId,
            method: 'GET',
          },
          {
            body: {
              data: encryptData(JSON.stringify(recoveryUserInfo), aesKey),
            },
            statusCode: 200,
          },
        ).as('downloadUserInfo');

        cy.wait('@profileUpload')
          .its('request.body')
          .should((body) => {
            expect(JSON.parse(body.data).signingKey).to.exist;
            expect(JSON.parse(body.data).timestamp).to.exist;
            expect(body.uuid).to.eq('data');
            expect(body.requestedTtl).to.exist;
          });

        cy.wait('@profileWaitingForScan');
        cy.intercept(
          {
            url: `/auranode*/profile/list/*`,
            method: 'GET',
          },
          {
            body: {
              profileIds: [
                'data',
                'sig_userinfo_' + dataId,
                'sig_completed_' + dataId,
              ],
            },
            statusCode: 200,
          },
        ).as('profileWaitingScanned');
        cy.wait('@profileWaitingScanned');
        cy.wait('@downloadUserInfo');
        cy.wait('@deleteUserInfo');
        cy.wait('@downloadCompleted');
        cy.intercept(
          {
            url: `/auranode*/profile/list/*`,
            method: 'GET',
          },
          {
            body: { profileIds: ['data'] },
            statusCode: 200,
          },
        );
      });
    cy.wait('@explorerCode')
      .its('request.body')
      .should((body) => {
        expect(body.brightId).to.eq(FAKE_BRIGHT_ID);
        expect(body.password).to.eq(FAKE_BRIGHT_ID_PASSWORD);
        expect(body.key).to.eq(FAKE_AUTH_KEY);
        expect(body.publicKey).to.exist;
      });
  }

  function doLoginSuccess() {
    localforage.clear();
    cy.intercept(
      {
        url: `/v1/connect/explorer-code`,
        method: 'POST',
      },
      {
        body: 'OK',
      },
    ).as('explorerCode');
    doLogin();
    cy.wait('@fakeProfilePicture') // wait until page tries to load data
      .then(async () => {
        const profileSliceData = JSON.parse(
          JSON.parse((await localforage.getItem('persist:root')) || '{}')
            .profile || '{}',
        ) as ProfileState;
        expect(profileSliceData.authData?.brightId).to.eq(FAKE_BRIGHT_ID);
        expect(profileSliceData.authData?.password).to.eq(
          FAKE_BRIGHT_ID_PASSWORD,
        );
        expect(profileSliceData.authData?.publicKey).to.exist;
        expect(profileSliceData.authData?.privateKey).to.exist;
        expect(
          JSON.parse(
            decryptData(
              profileSliceData.brightIdBackupEncrypted || '',
              FAKE_BRIGHT_ID_PASSWORD,
            ),
          ),
        ).to.deep.eq(BRIGHT_ID_BACKUP);
      });
  }

  it('login', () => {
    doLoginSuccess();
  });

  it('stays logged in', () => {
    doLoginSuccess();
    cy.visit('/');
    cy.url().should('include', RoutePath.HOME);
  });

  async function isLoggedOut() {
    const profileSliceData = JSON.parse(
      JSON.parse((await localforage.getItem('persist:root')) || '{}').profile ||
        '{}',
    ) as ProfileState;
    expect(profileSliceData.authData).to.be.null;
    expect(profileSliceData.brightIdBackupEncrypted).to.be.null;
  }

  //
  // it('handle login failed response', () => {
  //   cy.intercept(
  //     {
  //       url: `/v1/connect/explorer-code`,
  //       method: 'POST',
  //     },
  //     {
  //       statusCode: 500,
  //     },
  //   ).as('explorerCodeError');
  //   doLogin();
  //   cy.url().should('not.include', `/profile/${FAKE_BRIGHT_ID}`);
  //   cy.get(`.toast--${TOAST_ERROR}`).then(isLoggedOut);
  // });
  //
  it('logout', () => {
    cy.setupProfile();
    cy.visit(RoutePath.DASHBOARD);
    cy.get(getTestSelector('logout-button')).click();
    cy.get(getTestSelector('import-universal-link'));
    //TODO: find a way to avoid wait time
    cy.wait(1000).then(isLoggedOut);
    // stays logged out
    cy.visit('/').then(isLoggedOut);
  });
});
