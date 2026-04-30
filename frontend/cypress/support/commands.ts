/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(token?: string): Chainable<void>;
    }
  }
}

export {};

Cypress.Commands.add("login", (token: string = "fake-token-123") => {
  cy.window().then((win) => {
    win.sessionStorage.setItem("access_token", token);
  });
});