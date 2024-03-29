import { BrightIdBackupWithAuraConnectionData } from 'types';
import { RoutePath } from 'types/router';

import { getTestSelector } from '../utils';
import {
  connectionsInConnectionsPageDefaultFilter,
  connectionsInConnectionsPageFilterAllSortedByLastConnectionUpdateAscending,
  connectionsInConnectionsPageFilterAllSortedByLastConnectionUpdateDescending,
  connectionsInConnectionsPageJustMet,
  connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateAscending,
  connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateDescending,
} from '../utils/rating';

describe('Connections Page', () => {
  beforeEach(() => {
    cy.setupProfile();
    cy.visit(RoutePath.HOME);
  });

  function assertOrder(
    orderedConnections: BrightIdBackupWithAuraConnectionData['connections'],
  ) {
    orderedConnections.forEach((c, index) => {
      cy.get(getTestSelector(`user-item-${index}`)).should('exist');
      if (c.name === undefined) throw Error('Connection name not found');
      cy.get(getTestSelector(`user-item-${index}-name`)).contains(c.name);
    });
    cy.get(getTestSelector(`user-item-${orderedConnections.length}`)).should(
      'not.exist',
    );
  }

  it('filters connections', () => {
    assertOrder(connectionsInConnectionsPageDefaultFilter);

    expect(connectionsInConnectionsPageDefaultFilter).to.not.deep.equal(
      connectionsInConnectionsPageJustMet,
    );

    cy.get(getTestSelector('subject-filter-button')).click();
    cy.get(getTestSelector('subject-filter-option-JustMet')).click();
    assertOrder(connectionsInConnectionsPageJustMet);
  });

  it('sorts connections', () => {
    assertOrder(connectionsInConnectionsPageDefaultFilter);

    expect(connectionsInConnectionsPageDefaultFilter).to.not.deep.equal(
      connectionsInConnectionsPageFilterAllSortedByLastConnectionUpdateAscending,
    );
    expect(connectionsInConnectionsPageDefaultFilter).to.not.deep.equal(
      connectionsInConnectionsPageFilterAllSortedByLastConnectionUpdateDescending,
    );

    cy.get(getTestSelector('subject-sort-button')).click();
    cy.get(
      getTestSelector('subject-sort-option-LastConnectionUpdate-ascending'),
    ).click();
    assertOrder(
      connectionsInConnectionsPageFilterAllSortedByLastConnectionUpdateAscending,
    );

    cy.get(getTestSelector('subject-sort-button')).click();
    cy.get(
      getTestSelector('subject-sort-option-LastConnectionUpdate-descending'),
    ).click();
    assertOrder(
      connectionsInConnectionsPageFilterAllSortedByLastConnectionUpdateDescending,
    );
  });

  it('orders filtered list', () => {
    assertOrder(connectionsInConnectionsPageDefaultFilter);

    expect(connectionsInConnectionsPageDefaultFilter).to.not.deep.equal(
      connectionsInConnectionsPageJustMet,
    );
    expect(connectionsInConnectionsPageJustMet).to.not.deep.equal(
      connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateAscending,
    );
    expect(connectionsInConnectionsPageJustMet).to.not.deep.equal(
      connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateDescending,
    );

    cy.get(getTestSelector('subject-filter-button')).click();
    cy.get(getTestSelector('subject-filter-option-JustMet')).click();
    assertOrder(connectionsInConnectionsPageJustMet);

    cy.get(getTestSelector('subject-sort-button')).click();
    cy.get(
      getTestSelector('subject-sort-option-LastConnectionUpdate-ascending'),
    ).click();
    assertOrder(
      connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateAscending,
    );

    cy.get(getTestSelector('subject-sort-button')).click();
    cy.get(
      getTestSelector('subject-sort-option-LastConnectionUpdate-descending'),
    ).click();
    assertOrder(
      connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateDescending,
    );
  });

  it('filters ordered list', () => {
    assertOrder(connectionsInConnectionsPageDefaultFilter);

    expect(connectionsInConnectionsPageDefaultFilter).to.not.deep.equal(
      connectionsInConnectionsPageFilterAllSortedByLastConnectionUpdateAscending,
    );
    expect(
      connectionsInConnectionsPageFilterAllSortedByLastConnectionUpdateAscending,
    ).to.not.deep.equal(
      connectionsInConnectionsPageFilterAllSortedByLastConnectionUpdateDescending,
    );

    cy.get(getTestSelector('subject-sort-button')).click();
    cy.get(
      getTestSelector('subject-sort-option-LastConnectionUpdate-ascending'),
    ).click();
    assertOrder(
      connectionsInConnectionsPageFilterAllSortedByLastConnectionUpdateAscending,
    );

    cy.get(getTestSelector('subject-filter-button')).click();
    cy.get(getTestSelector('subject-filter-option-JustMet')).click();
    assertOrder(
      connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateAscending,
    );
  });

  it('keeps filters when navigating', () => {
    expect(connectionsInConnectionsPageDefaultFilter).to.not.deep.equal(
      connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateAscending,
    );

    assertOrder(connectionsInConnectionsPageDefaultFilter);
    cy.get(getTestSelector('subject-sort-button')).click();
    cy.get(
      getTestSelector('subject-sort-option-LastConnectionUpdate-ascending'),
    ).click();

    cy.get(getTestSelector('subject-filter-button')).click();
    cy.get(getTestSelector('subject-filter-option-JustMet')).click();
    assertOrder(
      connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateAscending,
    );

    // navigate to another page
    cy.get(getTestSelector(`user-item-0`)).click();
    cy.go(-1);

    assertOrder(
      connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateAscending,
    );
  });

  it('keeps filters after reload', () => {
    expect(connectionsInConnectionsPageDefaultFilter).to.not.deep.equal(
      connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateAscending,
    );

    assertOrder(connectionsInConnectionsPageDefaultFilter);
    cy.get(getTestSelector('subject-sort-button')).click();
    cy.get(
      getTestSelector('subject-sort-option-LastConnectionUpdate-ascending'),
    ).click();

    cy.get(getTestSelector('subject-filter-button')).click();
    cy.get(getTestSelector('subject-filter-option-JustMet')).click();
    assertOrder(
      connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateAscending,
    );

    cy.reload();
    assertOrder(
      connectionsInConnectionsPageJustMetSortedByLastConnectionUpdateAscending,
    );
  });
});
