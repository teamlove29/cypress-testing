import {
  getByTestID,
  getByTestIDStartsWith,
  interceptApi,
  loginAs,
  // loginAs,
} from './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestID: typeof getByTestID;
      getByTestIDStartsWith: typeof getByTestIDStartsWith;
      findByTestID: (
        selector: string
      ) => Cypress.Chainable<JQuery<HTMLElement>>;
      interceptApi: typeof interceptApi;
      loginAs: typeof loginAs;
    }
  }
}
