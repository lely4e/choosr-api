/// <reference types="cypress" />

describe("Signup Page", () => {
    const apiUrl = Cypress.env("apiUrl");

    beforeEach(() => {
        cy.visit("/signup");
    });

    it("renders the signup form correctly", () => {
        cy.get("h1").contains("Create your account");
        cy.get('input[name="username"]').should("be.visible");
        cy.get('input[type="email"]').should("be.visible");
        cy.get('input[type="password"]').should("be.visible");
        cy.get('button[type="submit"]').contains("Signup").should("be.visible");
        cy.contains(/Already have an account/i).should("be.visible");
        cy.contains("Sign in").should("have.attr", "href", "/login");
    });

    it("shows validation errors on empty submit", () => {
        cy.get('button[type="submit"]').click();

        cy.get('input[name="username"]').invoke("removeAttr", "required");
        cy.get('input[type="email"]').invoke("removeAttr", "required");
        cy.get('input[type="password"]').invoke("removeAttr", "required");
        cy.get('button[type="submit"]').click();
        // Zod validation errors should appear
        cy.get("span.text-red-500").should("have.length.greaterThan", 0);
    });

    it("shows error on invalid input", () => {
        // short username triggers Zod error before any API call
        cy.get('input[name="username"]').type("ll");
        cy.get('input[type="email"]').type("email@example.com");
        cy.get('input[type="password"]').type("password");
        cy.get('button[type="submit"]').click();
        // Zod validation errors should appear
        cy.get("span.text-red-500").should("exist");
    });

    it("shows error when email already exists", () => {
        cy.intercept("POST", `${apiUrl}/signup`, {
            statusCode: 400,
            body: { detail: "Email already exists" },
        }).as("signupRequest");

        cy.get('input[name="username"]').type("testuser");
        cy.get('input[type="email"]').type("existing@example.com");
        cy.get('input[type="password"]').type("password123");
        cy.get('button[type="submit"]').click();

        cy.wait("@signupRequest");
        // Zod validation errors should appear
        cy.get("span.text-red-500").should("exist");
    });

    it("shows error on invalid password", () => {
        cy.get('input[name="username"]').type("testuser");
        cy.get('input[type="email"]').type("email@example.com");
        cy.get('input[type="password"]').type("passwor");
        cy.get('button[type="submit"]').click();

        cy.get("span.text-red-500").should("exist");
    });

    it("signup succesfully", () => {
        cy.intercept("POST", `${apiUrl}/signup`, {
            statusCode: 200,
        }).as("signupRequest");

        cy.get('input[name="username"]').type("testuser");
        cy.get('input[type="email"]').type("existing@example.com");
        cy.get('input[type="password"]').type("password123");
        cy.get('button[type="submit"]').click();

        cy.wait("@signupRequest");

        // redirect to /login
        cy.url().should("include", "/login");

        // success toast should appear
        cy.contains(/User created successfully/i, { timeout: 6000 }).should(
            "be.visible",
        );
    });
});
