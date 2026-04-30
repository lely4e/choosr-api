/// <reference types="cypress" />

describe("Poll Page", () => {
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
            fixture: "poll/polls.json",
        }).as("polls");

        cy.intercept("GET", `${apiUrl}/activities`, {
            statusCode: 200,
            body: [],
        }).as("activities");

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products/suggestion`, {
            statusCode: 200,
            body: [],
        }).as("productsSuggestion");

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products?page=1&size=10`, {
            statusCode: 200,
            fixture: "products/products.json",
        }).as("products");

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000`, {
            statusCode: 200,
            fixture: "poll/pollDetails.json",
        }).as("pollDetails");

        cy.intercept("PUT", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000`, {
            statusCode: 200,
            body: {
                uuid: "123e4567-e89b-12d3-a456-426614174000",
                title: "Mike's Birthday New",
                budget: 300,
                description: "Here is the description of poll",
                user_id: 1,
                total_products: 0,
                active: true,
                manually_closed: false
            },
        }).as("editPollDetails");

    };
    beforeEach(() => {
        setupApiMocks();

        cy.login(token);

        cy.visit("/my-polls");

        cy.wait("@meRequest");
        cy.wait("@polls");
        cy.contains(/Mike's Birthday/i).click();
        cy.wait("@pollDetails");
    });

    it("renders the poll details form correctly", () => {

        cy.wait("@products");
        cy.url().should("include", "123e4567-e89b-12d3-a456-426614174000")
        cy.get("h3").contains("Mike's Birthday");
        cy.get("p").contains("Here is the description of poll");
        cy.get("div").contains("0 items");
        cy.get("div").contains("No deadline");
        cy.get("button").contains("Get AI gift ideas");
    });

    it("edits poll title succesfully", () => {

        cy.get('[data-testid="edit-icon"]').click();

        cy.contains(/Apply/i).click();
        cy.wait("@editPollDetails");
        cy.url().should("include", "123e4567-e89b-12d3-a456-426614174000")
        // Success toast should appear
        cy.contains(/Poll updated successfully/i, { timeout: 6000 }).should("be.visible");
        cy.get("h3").contains("Mike's Birthday New");
        cy.get("p").contains("Here is the description of poll");
        cy.get("div").contains("0 items");
        cy.get("div").contains("No deadline");
        cy.get("button").contains("Get AI gift ideas");
    });

    it("failes by editing poll title with long title", () => {
        cy.get('[data-testid="edit-icon"]').click();
        cy.get('input[name="title"]').clear().type("Here is very loooooooooooooooooooooooooooooooooooooooooooooong title");
        cy.contains(/Apply/i).click();
        cy.get("span.text-red-500").should("contain", "Title is too long (max 40 characters)");
    });

    it("failes by editing poll description with long description", () => {
        cy.get('[data-testid="edit-icon"]').click();
        cy.get('input[name="description"]').clear().type("Here is very looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong description");
        cy.contains(/Apply/i).click();
        cy.get("span.text-red-500").should("contain", "Description is too long (max 140 characters)");
    });

    it("shows validation errors on too short input", () => {
        cy.get('[data-testid="edit-icon"]').click();
        cy.get('input[name="title"]').clear().type("M");
        cy.contains(/Apply/i).click();
        cy.get("span.text-red-500").should("contain", "Title is too short (min 3 characters)");
    });
});