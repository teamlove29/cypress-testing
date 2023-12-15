import { createAuth } from 'models/auth';
import { Role } from 'models/user';

describe('Admin UI', () => {
  beforeEach(() => {
    cy.interceptApi('GET', '/dashboard', {});
    cy.loginAs(Role.Admin); // role admin is 1
    cy.visit('/admin');
  });
  it('redirects to /admin/dashboard correctly', () => {
    cy.location('pathname').should('eq', '/admin/dashboard');
  });

  it('navigates to each pages correctly', () => {
    cy.getByTestID('admin-links').within(() => {
      const linkNames = ['users', 'categories', 'articles', 'dashboard'];

      linkNames.forEach((linkName) => {
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.get(`a[href="/admin/${linkName}"]`)
          .click()
          .location('pathname')
          .should('eq', `/admin/${linkName}`);
      });
    });
  });
});
