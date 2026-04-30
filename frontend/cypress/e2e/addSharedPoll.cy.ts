/// <reference types="cypress" />

describe("Add Shared Poll", () => {
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

        cy.intercept(
            "GET",
            `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174001/products/suggestion`, {
            statusCode: 200,
            body: [],
        }).as("productsSuggestion");

        cy.intercept(
            "GET",
            `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174001`, {
            statusCode: 200,
            fixture: "poll/sharedPollDetails.json",
        }).as("sharedPollDetails");

        cy.intercept("POST", `${apiUrl}/activities`, {
            statusCode: 200,
            body: {
                id: 1,
                user_id: 2,
                poll_id: 1,
                created_at: "2026-04-29T13:02:14.635129+02:00"
            },
        }).as("addSharedPoll");

        cy.fixture("products/products.json").then((product) => {
            product.total = 1;
            cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174001/products*`, {
                statusCode: 200,
                body: product,
            }).as("products");
        });
    };

    beforeEach(() => {
        setupApiMocks();

        cy.login(token);

        cy.visit("/polls/123e4567-e89b-12d3-a456-426614174001");

        cy.wait("@meRequest");
        cy.wait("@sharedPollDetails");
        cy.wait("@products");
    });

    it("renders shared poll correctly", () => {
        cy.contains("h3", "Kiki's Warm Party").should("be.visible");
        cy.contains("p", "Here is the description of shared poll").should("be.visible");
        cy.contains("div", "0 items").should("be.visible");
        cy.contains("div", "No deadline").should("be.visible");
    });

    it("adds shared poll successfully", () => {

        // Updated activities after adding poll
        cy.intercept("GET", `${apiUrl}/activities`, {
            statusCode: 200,
            body: [{
                uuid: "123e4567-e89b-12d3-a456-426614174001",
                title: "Kiki's Warm Party",
                budget: 250,
                description: "Here is the description of shared poll",
                user_id: 2,
                total_products: 0,
                created_by: "testuser2",
                active: true,
                manually_closed: false,
                created_at: "2026-04-29T13:02:14.635129+02:00"
            }],
        }).as("updatedActivities");

        cy.get('[data-testid="add-poll-icon"]').click();

        // request payload 
        cy.wait("@addSharedPoll").then(({ request }) => {
            let body = request.body;

            if (typeof body === "string") {
                body = JSON.parse(body);
            }
            expect(body.uuid).to.eq(
                "123e4567-e89b-12d3-a456-426614174001"
            );
        });

        cy.wait("@updatedActivities");

        cy.contains(/Shared Poll added successfully/i, { timeout: 6000 })
            .should("be.visible");

        cy.visit("/my-polls");
        cy.contains("Shared With Me").should("be.visible");
    });
});