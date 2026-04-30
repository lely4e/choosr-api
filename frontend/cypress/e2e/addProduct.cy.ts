/// <reference types="cypress" />

describe("Add Product", () => {
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

        cy.intercept("GET", `${apiUrl}/products/search*`, {
            statusCode: 200,
            fixture: "search/search.json"
        }).as("search");

        cy.intercept("POST", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products`, {
            statusCode: 200,
            fixture: "products/product.json",
        }).as("updatedProducts");

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

    it("searches and adds product succesfully", () => {
        cy.url().should("include", "123e4567-e89b-12d3-a456-426614174000")

        // refetch poll details after adding a product
        cy.fixture("poll/pollDetails.json").then((poll) => {
            poll.total_products = 1;
            cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000`, {
                statusCode: 200,
                body: poll,
            }).as("updatedPollDetails");
        });

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products?page=1&size=10`, {
            statusCode: 200,
            fixture: "products/product.json",
        }).as("getUpdatedProducts");

        cy.get('input[name="search"]').type("PlayStation");
        cy.get('[data-testid="search-icon"]').click();
        cy.wait("@search");

        cy.contains("PlayStation").parent().find('[data-testid="plus-icon"]').click();
        cy.wait("@updatedProducts");
        cy.contains(/Product added successfully/i, { timeout: 6000 }).should("be.visible");
        cy.wait("@getUpdatedProducts");
    });

});