/// <reference types="cypress" />

describe("Shared Poll", () => {
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
            fixture: "poll/activities.json",
        }).as("activities");

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174001/products/suggestion`, {
            statusCode: 200,
            body: [],
        }).as("productsSuggestion");

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174001`, {
            statusCode: 200,
            fixture: "poll/sharedPollDetails.json",
        }).as("sharedPollDetails");

        cy.fixture("products/products.json").then((product) => {
            product.total = 1;
            cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174001/products*`, {
                statusCode: 200,
                body: product,
            }).as("products");
        });

        cy.intercept("GET", `${apiUrl}/products/search*`, {
            statusCode: 200,
            fixture: "search/search.json"
        }).as("search");

        cy.intercept("POST", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174001/products*`, {
            statusCode: 200,
            fixture: "products/product.json"
        }).as("addProduct");
    };

    beforeEach(() => {
        setupApiMocks();

        cy.login(token);

        cy.visit("/my-polls");
        cy.request("/polls/123e4567-e89b-12d3-a456-426614174001");

        cy.wait("@meRequest");
        cy.wait("@activities");
    });

    it("renders shared poll form correctly", () => {

        cy.get("h3").contains("Kiki's Warm Party");
        cy.get("p").contains("Here is the description of shared poll");
        cy.get("div").contains("0 items");
        cy.get("div").contains("No deadline");
    });

    it("renders shared poll details form correctly", () => {

        cy.contains(/Kiki's Warm Party/i).click();
        cy.url().should("include", "123e4567-e89b-12d3-a456-426614174001")
        cy.wait("@products");
        cy.get("h3").contains("Kiki's Warm Party");
        cy.get("p").contains("Here is the description of shared poll");
        cy.get("div").contains("0 items");
        cy.get("div").contains("No deadline");
        cy.get("div").contains("created by testuser2");
        cy.get("button").contains("Get AI gift ideas");
        cy.get('[data-testid="edit-icon"]').should("not.exist");
    });

    it("search and add product succesfully", () => {

        cy.fixture("poll/sharedPollDetails.json").then((poll) => {
            poll.total_products = 1;
            cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174001`, {
                statusCode: 200,
                body: poll,
            }).as("updatedPollDetails");
        });

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174001/products?page=1&size=10`, {
            statusCode: 200,
            fixture: "products/product.json",
        }).as("getUpdatedProducts");

        cy.contains(/Kiki's Warm Party/i).click();
        cy.url().should("include", "123e4567-e89b-12d3-a456-426614174001")
        cy.get('input[name="search"]').type("PlayStation");
        cy.get('[data-testid="search-icon"]').click();
        cy.wait("@search");

        cy.contains("PlayStation").parent().find('[data-testid="plus-icon"]').click();
        cy.wait("@addProduct");
        cy.wait("@getUpdatedProducts");
        cy.wait("@updatedPollDetails");
        cy.contains(/Product added successfully/i, { timeout: 6000 }).should("be.visible");

    });

});