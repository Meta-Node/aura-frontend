// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

import localforage from 'localforage';
import { BrightIdBackupConnection } from 'types';

import {
  BRIGHT_ID_BACKUP,
  BRIGHT_ID_BACKUP_ENCRYPTED,
  brightIdProfileResponse,
  FAKE_AUTH_KEY,
  FAKE_BRIGHT_ID,
  LOCAL_STORAGE_DATA,
  PROFILE_PICTURE,
} from '../utils/data';
import {
  connectionIncomingConnectionsResponse,
  connectionOutboundConnectionsResponse,
} from '../utils/mutual-connections';
import {
  oldRatings,
  userInboundConnectionsResponse,
  userIncomingRatingsResponse,
  userOutboundConnectionsResponse,
  userRatingsResponse,
} from '../utils/rating';

function connectionIntercepts(connection: BrightIdBackupConnection) {
  cy.intercept(
    {
      url: `/v1/ratings/${connection.id}`,
      method: 'GET',
    },
    {
      body: {
        ratings: [],
      },
    },
  );
  cy.intercept(
    {
      url: `/v1/ratings/inbound/${connection.id}`,
      method: 'GET',
    },
    {
      body: {
        ratings: oldRatings.filter(
          (rating) => rating.toBrightId === connection.id,
        ),
      },
    },
  );
  cy.intercept(
    {
      url: `/auranode*/brightid/v6/users/${connection.id}/connections/inbound?withVerifications=true`,
      method: 'GET',
    },
    {
      body: connectionIncomingConnectionsResponse,
    },
  );
  cy.intercept(
    {
      url: `/auranode*/brightid/v6/users/${connection.id}/connections/outbound?withVerifications=true`,
      method: 'GET',
    },
    {
      body: connectionOutboundConnectionsResponse,
    },
  );
}

Cypress.Commands.add('blockApiRequests', () => {
  cy.intercept(
    {
      url: `**/v1/**`,
    },
    {
      statusCode: 404,
    },
  );
  cy.intercept(
    {
      url: `**/brightid/**`,
    },
    {
      statusCode: 404,
    },
  );
  cy.intercept(
    {
      url: `**/auranode/**`,
    },
    {
      statusCode: 404,
    },
  );
});
Cypress.Commands.add('profileIntercepts', () => {
  cy.intercept(
    {
      url: `/brightid/backups/*/*`,
      method: 'GET',
    },
    {
      body: PROFILE_PICTURE,
    },
  ).as('fakeProfilePicture');
  cy.intercept(
    {
      url: `/brightid/backups/${FAKE_AUTH_KEY}/data`,
      method: 'GET',
    },
    {
      body: BRIGHT_ID_BACKUP_ENCRYPTED,
    },
  );
  cy.intercept(
    {
      url: `/v1/ratings/${FAKE_BRIGHT_ID}`,
      method: 'GET',
    },
    {
      body: userRatingsResponse,
    },
  );
  cy.intercept(
    {
      url: `/v1/ratings/inbound/${FAKE_BRIGHT_ID}`,
      method: 'GET',
    },
    {
      body: userIncomingRatingsResponse,
    },
  );
  // node api
  cy.intercept(
    {
      url: `auranode*/brightid/v6/users/*/profile`,
      method: 'GET',
    },
    {
      body: brightIdProfileResponse,
    },
  );

  cy.intercept(
    {
      url: `/auranode*/brightid/v6/users/${FAKE_BRIGHT_ID}/connections/inbound?withVerifications=true`,
      method: 'GET',
    },
    {
      body: userInboundConnectionsResponse,
    },
  );
  cy.intercept(
    {
      url: `/auranode*/brightid/v6/users/${FAKE_BRIGHT_ID}/connections/outbound?withVerifications=true`,
      method: 'GET',
    },
    {
      body: userOutboundConnectionsResponse,
    },
  );
  BRIGHT_ID_BACKUP.connections.forEach((conn) => {
    connectionIntercepts(conn);
  });
});

Cypress.Commands.add('setupProfile', () => {
  localforage.setItem('persist:root', JSON.stringify(LOCAL_STORAGE_DATA));
  cy.profileIntercepts();
});

beforeEach(() => {
  localforage.config({ storeName: 'keyvaluepairs', name: 'localforage' });
  cy.blockApiRequests();
  // if (Cypress.env('spy_on_console')) {
  //   cy.on('window:before:load', (win) => {
  //     cy.spy(win.console, 'error').as('spyWinConsoleError');
  //     cy.spy(win.console, 'warn').as('spyWinConsoleWarn');
  //   });
  // }
});

// afterEach(() => {
//   if (Cypress.env('spy_on_console')) {
//     cy.get('@spyWinConsoleError').should('have.callCount', 0);
//     cy.get('@spyWinConsoleWarn').should('have.callCount', 0);
//   }
// });

Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from failing the test
  return false;
});

Cypress.Commands.overwrite('intercept', (original, arg1, arg2, ...args) => {
  if (typeof arg2 === 'object' && arg2.constructor !== RegExp) {
    // @ts-ignore
    return original(arg1, { ...arg2, log: false }, ...args);
  }
  return original(arg1, arg2, ...args);
});
