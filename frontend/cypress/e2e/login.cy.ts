/// <reference types="cypress" />

describe("Login Page", () => {
  const apiUrl = Cypress.env("apiUrl");

  beforeEach(() => {
    cy.visit("/login");
  });

  it("renders the login form correctly", () => {
    cy.get("h1").contains("Welcome back");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('button[type="submit"]').contains("Sign In").should("be.visible");
    cy.contains(/Don.t have an account/i).should("be.visible");
    cy.contains("Sign up").should("have.attr", "href", "/signup");
  });

  it("shows validation errors on empty submit", () => {
    cy.get('button[type="submit"]').click();

    cy.get('input[type="email"]').invoke("removeAttr", "required");
    cy.get('input[type="password"]').invoke("removeAttr", "required");
    cy.get('button[type="submit"]').click();
    // Zod validation errors should appear
    cy.get("span.text-red-500").should("have.length.greaterThan", 0);
  });

  it("shows error on invalid credentials", () => {
    // Intercept the auth API call and simulate a 401
    cy.intercept("POST", `${apiUrl}/auth`, {
      statusCode: 401,
      body: { detail: "Invalid username or password" },
    }).as("loginRequest");

    cy.get('input[type="email"]').type("wrong@example.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");

    // Error message should appear
    cy.get("span.text-red-500").should("exist");
  });

  it("logs in successfully and redirects to /my-polls", () => {
    // Intercept POST /auth → return a fake token
    cy.intercept("POST", `${apiUrl}/auth`, {
      statusCode: 200,
      body: { access_token: "fake-token-123" },
    }).as("loginRequest");

    // Intercept GET /me → return fake user data
    cy.intercept("GET", `${apiUrl}/me`, {
      statusCode: 200,
      fixture: "user/me.json",
    }).as("meRequest");

    cy.intercept("GET", `${apiUrl}/polls`, {
      statusCode: 200,
      fixture: "poll/emptyPoll.json",
    }).as("polls");

    cy.intercept("GET", `${apiUrl}/activities`, {
      statusCode: 200,
      body: [],
    }).as("activities");

    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("correctpassword");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");
    cy.wait("@meRequest");

    // redirect to /my-polls
    cy.url().should("include", "/my-polls");

    // Success toast should appear
    cy.contains(/User logged in successfully/i, { timeout: 6000 }).should(
      "be.visible",
    );
  });
});
