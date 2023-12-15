import { mockGetProfile, mockInvalidSignin, mockSignin } from 'api/auth';
import { createAuth } from 'models/auth';
import { createUser } from 'models/user';

describe('Signin UI', () => {
  it('handles login and logout correctly', () => {
    const auth = createAuth();
    const profile = createUser();

    const { response: signinResponse, mocked: mockedSignin } = mockSignin();

    mockedSignin.as('signin');
    mockGetProfile(profile).mocked.as('profile');

    cy.visit('/');
    cy.getByTestID('auth-menu-login-button').click();
    cy.location('pathname').should('eq', '/auth/sign-in');
    cy.getByTestID('auth-form-email').type(auth.email);
    cy.getByTestID('auth-form-password').type(auth.password);
    cy.getByTestID('auth-form-submit-button').click();

    cy.wait('@signin').its('request.body').should('deep.equal', auth);
    cy.should(() => {
      expect(localStorage.getItem('accessToken')).to.eq(signinResponse.token);
    });

    cy.wait('@profile')
      .its('request.headers')
      .should('include', { authorization: `Bearer ${signinResponse.token}` });

    cy.getByTestID('flash-message').should('have.text', 'Welcome back!');
    cy.getByTestID('auth-profile-name').should('have.text', profile.name);
    cy.getByTestID('auth-profile-avatar').should(
      'have.attr',
      'src',
      profile.avatar
    );

    // logout
    cy.getByTestID('auth-menu').click();
    cy.getByTestID('auth-menu-logout').click();
    cy.should(() => {
      expect(localStorage.getItem('accessToken')).to.be.null;
    });
    cy.getByTestID('flash-message').should('have.text', 'Bye!');
    cy.getByTestID('auth-menu-login-button').should('be.visible');
  });

  it('invalid sign-in', () => {
    const auth = createAuth();

    mockInvalidSignin().mocked.as('invalid');

    cy.visit('/auth/sign-in');
    cy.location('pathname').should('eq', '/auth/sign-in');
    cy.getByTestID('auth-form-email').type(auth.email);
    cy.getByTestID('auth-form-password').type('invalid-password');
    cy.getByTestID('auth-form-submit-button').click();

    cy.wait('@invalid').its('request.body').should('deep.equal', {
      email: auth.email,
      password: 'invalid-password',
    });

    cy.getByTestID('flash-message').should(
      'have.text',
      'incorrect Username or Password'
    );
  });
});
