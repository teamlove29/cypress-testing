describe('Member List', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/cypress/member-list');
  });

  it('renders menber list correctly', () => {
    const members = ['Sathit', 'Sombut', 'Somchai', 'Somprasong', 'Sornthep'];

    cy.get('[data-testid="member-item"]').each(($element, index) => {
      const member = members[index];

      cy.wrap($element).within(() => {
        cy.get('[data-testid="member-name"]').should('have.text', member);
        cy.get('[data-testid="member-avatar"]')
          .should('have.attr', 'alt', member)
          .and('have.attr', 'src')
          .and('include', member.toLowerCase());
      });
    });
  });

  it('Wrap,Its,Invoke', () => {
    const person = {
      name: 'Somchai',
      age: 24,
      getDetails() {
        return `name:${this.name},age:${this.age}`;
      },
    };

    cy.wrap(person).its('name').should('eq', 'Somchai');
    cy.wrap(person).invoke('getDetails').should('eq', 'name:Somchai,age:24');
  });
});
