/// <reference types="@testing-library/cypress" />

describe('Selectors', () => {
  it('selects elements correctly', () => {
    cy.visit('/cypress/selectors');
    // regular expestion
    // \ is ignore
    cy.findByRole('button', { name: /outlined button \(#outlined\)/i }).should(
      'exist'
    );

    cy.findByText('Body (.text-group:nth-child(2))').should('exist');
    cy.findByText('Subtitle ([data-testid="subtitle"])').should('exist');
    // cy.findByTestId('subtitle').should('exist');
  });
});
