import localforage from 'localforage';

import { getTestSelector } from '../utils';

describe('Unauthenticated issue', () => {
  beforeEach(() => {
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
