// let a = 1;

describe('Test', () => {
  it('contains Babel Coder in the page', () => {
    cy.visit('https://www.babelcoder.com/');
    cy.contains('Babel Coder');

    console.log('object');
  });
});
