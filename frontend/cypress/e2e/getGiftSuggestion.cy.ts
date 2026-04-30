/// <reference types="cypress" />

describe("Get Gift Suggestions", () => {
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

        cy.intercept("POST", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products/suggestion`, {
            statusCode: 200,
            fixture: "suggestions/suggestions.json",
        }).as("productsSuggestionRequest");

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products?page=1&size=10`, {
            statusCode: 200,
            fixture: "products/products.json",
        }).as("products");

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000`, {
            statusCode: 200,
            fixture: "poll/pollDetails.json",
        }).as("pollDetails");

        cy.intercept("GET", `${apiUrl}/products/search*`, {
            statusCode: 200,
            fixture: "search/search.json" 
        }).as("search");

    };
    beforeEach(() => {
        setupApiMocks();

        cy.login(token);

        cy.visit("/my-polls");

        cy.wait("@meRequest");
        cy.wait("@polls");
        cy.contains(/Mike's Birthday/i).click();
        cy.wait("@pollDetails");
        cy.wait("@products");
    });

    it("renders the poll details form correctly", () => {

        cy.url().should("include", "123e4567-e89b-12d3-a456-426614174000")
        cy.get("h3").contains("Mike's Birthday");
        cy.get("p").contains("Here is the description of poll");
        cy.get("div").contains("0 items");
        cy.get("div").contains("No deadline");
        cy.get("button").contains("Get AI gift ideas");
    });

    it("gets AI siggestions from a filled-out form", () => {

        cy.get("button").contains("Get AI gift ideas").click()
        cy.get("button").contains("Family").click()
        cy.get("button").contains("Music").click()
        cy.get("button").contains("Fun").click()
        cy.get('button[type="submit"]').click();

        cy.wait("@productsSuggestionRequest")

        cy.get("h1").contains("Gift Ideas");
        cy.get("div").contains("High-Quality Wireless Headphones");
        cy.get("div").contains("Concert Tickets to See a Favorite Artist");
        cy.get("div").contains("Portable Bluetooth Speaker with Party Lights");
        cy.get("div").contains("DJ Controller (Entry-Level)");
        cy.get("div").contains("Subscription to a Premium Music Streaming Service + Gift Card for Merch");
    });
});