describe('Location', () => {
  it('shows location correctly', () => {
    cy.visit('http://localhost:3000/cypress/location?query=test#my-hash');
    cy.location('pathname').should('eq', '/cypress/location');
    cy.location('search').should('eq', '?query=test');
    cy.location('hash').should('eq', '#my-hash');
  });
});
