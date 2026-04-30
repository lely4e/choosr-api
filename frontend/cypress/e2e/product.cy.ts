/// <reference types="cypress" />

describe("Product Page", () => {
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

        cy.intercept("GET", "**/polls/123e4567-e89b-12d3-a456-426614174000/products/suggestion", {
            statusCode: 200,
            body: [],
        }).as("productsSuggestion");

        cy.fixture("poll/pollDetails.json").then((poll) => {
            poll.total_products = 1;
            cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000`, {
                statusCode: 200,
                body: poll,
            }).as("pollDetails");
        });

        cy.intercept("POST", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products/1/vote`, {
            statusCode: 200,
            body: {
                "id": 1,
                "product_id": 1,
                "has_voted": true,
                "user_id": 1
            },
        }).as("voted");

        cy.intercept("POST", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products/1/comments`, {
            statusCode: 200,
            body: {
                "id": 1,
                "text": "I think this option is super",
                "user_id": 1,
                "product_id": 1,
                "created_at": "2026-04-28T11:46:21.828262+02:00",
                "created_by": "testuser"
            },
        }).as("addComment");

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products*`, {
            statusCode: 200,
            fixture: "products/product.json"
        }).as("products");

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products/1/comments`, {
            statusCode: 200,
            body: [],
        }).as("showComments");

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
        cy.url().should("include", "123e4567-e89b-12d3-a456-426614174000")
    });

    it("renders the poll details form correctly", () => {

        cy.get("h3").contains("Mike's Birthday");
        cy.get("p").contains("Here is the description of poll");
        cy.get("div").contains("1 item");
        cy.get("div").contains("No deadline");
        cy.get("button").contains("Get AI gift ideas");
    });

    it("renders product details form correctly", () => {

        cy.get("div").contains("PlayStation");
        cy.get("div").contains(4.7);
        cy.get("div").contains(84.99);
        cy.get('[data-testid="delete-icon"]')
        cy.get('[data-testid="chat-icon"]')
        cy.get('[data-testid="vote-icon"]')
        cy.get('[data-testid="vote-button-icon"]')
    });

    it("votes on product succesfully", () => {

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products*`, {
            statusCode: 200,
            body: {
                "items": [{
                    "id": 1,
                    "title": "PlayStation DualSense® Wireless Controller – Genshin Impact Limited Edition",
                    "link": "https://www.amazon.com/PlayStation-DualSense%C2%AE-Wireless-Controller-Gaming-Console/dp/B0G4S3GZ5N/ref=sr_1_2?dib=eyJ2IjoiMSJ9.7fFutZRFbnvRTIsu8GdI51ZL3f-hCOlIq7GMD0OqFXDq5JOxdfMNn00k2vc0sroQvxdFBDC4whqDhlUHRO0xX1cyMyHAMBNF62Kn9QrXbRARtsiSnUvCdlS4j5DReg2jY990iWhYSBYxFghb5l2exKYZO7TXwGksaCi_IZkOb0NG79aJlAji5vkjC5a1n8s6fDiCByloH4pV31oZQPB2savUb53AYXfTHzMBNdSGSG_MLtAdsnLi7azDoUg-XYTUxN_v29lPM8Lh_4IJnjf8G7tCwqlAJewm_pMo04ptGJk.oFgPWuYtmgn6rm_HTX8qYpI4ZENn7Kpl61E7LGqRnY8&dib_tag=se&keywords=Limited+Edition+Gaming&qid=1776705601&sr=8-2",
                    "image": "https://m.media-amazon.com/images/I/61DIrafTIML._AC_UL320_.jpg",
                    "rating": 4.7,
                    "price": 84.99,
                    "votes": 1,
                    "comments": 0,
                    "has_voted": true,
                    "user_id": 1
                }],
                "total": 1,
                "page": 1,
                "size": 10,
                "pages": 1
            },
        }).as("newproducts");

        cy.get('[data-testid="vote-button-icon"]').click();
        cy.wait("@voted");
        cy.contains(/You voted/i, { timeout: 6000 }).should("be.visible");

        cy.wait("@newproducts")
        cy.get("div").contains("1 item");
        cy.get('[data-testid="vote-icon"]').parent().should('contain.text', '1')
        cy.get('[data-testid="voted-button-icon"]').should("be.visible");
    });

    it("comments on product succesfully", () => {
        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products*`, {
            statusCode: 200,
            body: {
                "items": [{
                    "id": 1,
                    "title": "PlayStation DualSense® Wireless Controller – Genshin Impact Limited Edition",
                    "link": "https://www.amazon.com/PlayStation-DualSense%C2%AE-Wireless-Controller-Gaming-Console/dp/B0G4S3GZ5N/ref=sr_1_2?dib=eyJ2IjoiMSJ9.7fFutZRFbnvRTIsu8GdI51ZL3f-hCOlIq7GMD0OqFXDq5JOxdfMNn00k2vc0sroQvxdFBDC4whqDhlUHRO0xX1cyMyHAMBNF62Kn9QrXbRARtsiSnUvCdlS4j5DReg2jY990iWhYSBYxFghb5l2exKYZO7TXwGksaCi_IZkOb0NG79aJlAji5vkjC5a1n8s6fDiCByloH4pV31oZQPB2savUb53AYXfTHzMBNdSGSG_MLtAdsnLi7azDoUg-XYTUxN_v29lPM8Lh_4IJnjf8G7tCwqlAJewm_pMo04ptGJk.oFgPWuYtmgn6rm_HTX8qYpI4ZENn7Kpl61E7LGqRnY8&dib_tag=se&keywords=Limited+Edition+Gaming&qid=1776705601&sr=8-2",
                    "image": "https://m.media-amazon.com/images/I/61DIrafTIML._AC_UL320_.jpg",
                    "rating": 4.7,
                    "price": 84.99,
                    "votes": 0,
                    "comments": 1,
                    "has_voted": false,
                    "user_id": 1
                }],
                "total": 1,
                "page": 1,
                "size": 10,
                "pages": 1
            },
        }).as("products");

        cy.get('[data-testid="product-1"]').find('[data-testid="chat-icon"]').click();
        cy.get('textarea[data-testid="text-area-1"]').type("I think this option is super");
        cy.get('[data-testid="add-comment"]').click();
        cy.wait("@addComment");
        cy.wait("@products")
        cy.contains(/Comment added successfully/i).should("be.visible");
        cy.get('[data-testid="chat-icon"]').parent().should('contain.text', '1')
        cy.get('[data-testid="comment-1"]').contains("testuser");
        cy.get('[data-testid="comment-text-1"]').contains("I think this option is super");
    });

    it("shows and close comments with icon button", () => {
        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products*`, {
            statusCode: 200,
            body: {
                "items": [{
                    "id": 1,
                    "title": "PlayStation DualSense® Wireless Controller – Genshin Impact Limited Edition",
                    "link": "https://www.amazon.com/PlayStation-DualSense%C2%AE-Wireless-Controller-Gaming-Console/dp/B0G4S3GZ5N/ref=sr_1_2?dib=eyJ2IjoiMSJ9.7fFutZRFbnvRTIsu8GdI51ZL3f-hCOlIq7GMD0OqFXDq5JOxdfMNn00k2vc0sroQvxdFBDC4whqDhlUHRO0xX1cyMyHAMBNF62Kn9QrXbRARtsiSnUvCdlS4j5DReg2jY990iWhYSBYxFghb5l2exKYZO7TXwGksaCi_IZkOb0NG79aJlAji5vkjC5a1n8s6fDiCByloH4pV31oZQPB2savUb53AYXfTHzMBNdSGSG_MLtAdsnLi7azDoUg-XYTUxN_v29lPM8Lh_4IJnjf8G7tCwqlAJewm_pMo04ptGJk.oFgPWuYtmgn6rm_HTX8qYpI4ZENn7Kpl61E7LGqRnY8&dib_tag=se&keywords=Limited+Edition+Gaming&qid=1776705601&sr=8-2",
                    "image": "https://m.media-amazon.com/images/I/61DIrafTIML._AC_UL320_.jpg",
                    "rating": 4.7,
                    "price": 84.99,
                    "votes": 0,
                    "comments": 1,
                    "has_voted": false,
                    "user_id": 1
                }],
                "total": 1,
                "page": 1,
                "size": 10,
                "pages": 1
            },
        }).as("productsWithComment");

        cy.intercept("GET", `${apiUrl}/polls/123e4567-e89b-12d3-a456-426614174000/products/1/comments`, {
            statusCode: 200,
            body: [{
                "id": 1,
                "text": "I think this option is super",
                "user_id": 1,
                "product_id": 1,
                "created_at": "2026-04-28T11:46:21.828262+02:00",
                "created_by": "testuser"
            }],
        }).as("showComments");

        cy.get('[data-testid="product-1"]').find('[data-testid="chat-icon"]').click();
        cy.wait("@showComments")
        cy.wait("@productsWithComment")

        cy.get('[data-testid="chat-icon"]').parent().should('contain.text', '1')
        cy.get('[data-testid="comments-title"]').should("be.visible");

        cy.get('[data-testid="product-1"]').find('[data-testid="chat-icon"]').click();
        cy.get('[data-testid="comments-title"]').should("not.exist");
    })
});