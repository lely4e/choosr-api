/// <reference types="cypress" />

describe("Polls Page", () => {
  const token = "fake-token-123";
  const apiUrl = Cypress.env("apiUrl");

  const setupApiMocks = () => {
    cy.intercept("POST", `${apiUrl}/auth`, {
      statusCode: 200,
      body: { access_token: token },
    }).as("loginRequest");

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
  };

  beforeEach(() => {
    setupApiMocks();

    cy.login(token);

    cy.visit("/my-polls");

    cy.wait("@meRequest");
    cy.wait("@polls");
  });

  it("shows validation errors on empty submit", () => {
    cy.visit("/add-poll");

    cy.get('input[name="title"]').invoke("removeAttr", "required");
    cy.get('input[type="number"]').invoke("removeAttr", "required");
    cy.get('button[type="submit"]').click();

    cy.get("span.text-red-500").should("have.length.greaterThan", 0);
  });

  it("shows error on invalid title input", () => {
    cy.visit("/add-poll");

    cy.get('input[name="title"]').type("Mi");
    cy.get('input[type="number"]').type("300");
    cy.get('button[type="submit"]').click();

    cy.get("span.text-red-500").should("exist");
  });

  it("shows error on invalid budget input", () => {
    cy.visit("/add-poll");

    cy.get('input[name="title"]').type("Mike's Birthday");
    cy.get('input[type="number"]').type("-1");
    cy.get('button[type="submit"]').click();

    cy.get("span.text-red-500").should("exist");
  });

  it("creates a new poll successfully", () => {
    cy.intercept("POST", `${apiUrl}/polls`, {
      statusCode: 201,
      fixture: "poll/pollDetails.json",
    }).as("createPoll");

    cy.intercept("GET", `${apiUrl}/polls`, {
      statusCode: 200,
      fixture: "poll/polls.json",
    }).as("polls");

    cy.login(token);

    cy.visit("/add-poll");

    cy.get('input[name="title"]').type("Mike's Birthday");
    cy.get('input[type="number"]').type("300");
    cy.get('button[type="submit"]').click();

    cy.wait("@createPoll");

    cy.url().should("include", "/my-polls");

    cy.contains(/poll created successfully/i, { timeout: 4000 }).should(
      "be.visible");

    cy.wait("@polls");
    cy.contains("Mike's Birthday").should("be.visible");
  });
});