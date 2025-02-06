import localforage from 'localforage';

import { getTestSelector } from '../utils';

describe('Unauthenticated issue', () => {
  afterEach(() => {
    cy.clearLocalStorage();
    localforage.clear();
  });

  it('Show welcome page on start', () => {
    cy.visit('/');
    expect(
      cy
        .get(getTestSelector('splash-dismiss-btn'))
        .should('be.visible')
        .should('not.be.disabled')
        .contains('Get Started'),
      'Get Started button must be visible and clickable',
    );
  });

  it("On reload doesn't show the welcome page", () => {
    cy.visit('/');

    cy.get(getTestSelector('splash-dismiss-btn')).click();

    cy.wait(300);

    expect(
      cy.get(getTestSelector('import-universal-link')).should('be.visible'),
      'Import link should be visible',
    );

    cy.reload();

    expect(
      cy.get(getTestSelector('import-universal-link')).should('be.visible'),
      'Import link should be visible after reload',
    );
  });

  it('Redirects to splash page on profile page', () => {
    cy.visit('/home');

    cy.location('pathname').should('eq', '/');
  });
});

describe('Login functionality', () => {
  it('basic login', () => {
    cy.visit('/');
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
      });
  });
});

const setupLoginNetworkInterceptors = () => {
  cy.intercept(
    {
      url: '/auranode*/profile/upload/*',
      method: 'POST',
    },
    {
      body: JSON.stringify({ success: true }),
      statusCode: 201,
    },
  );

  cy.intercept(
    {
      url: '/auranode*/profile/list/*',
      method: 'GET',
    },
    {
      body: JSON.stringify({ profileIds: ['data'] }),
    },
  );
};
