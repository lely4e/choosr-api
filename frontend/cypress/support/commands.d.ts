/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(token?: string): Chainable<void>;
  }
}