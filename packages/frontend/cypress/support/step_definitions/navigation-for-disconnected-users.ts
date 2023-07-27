import { Then, And, Given } from "cypress-cucumber-preprocessor/steps";

// TODO: possibly most steps here should be in common-steps

/**
 * Scenario: Navigating to a non-existing board
 */
Then("I should see the {string} error page", (errorNumber: string) => {
    // Assert that the error page is displayed
    cy.get("h1").contains(errorNumber);
});

And("a {string} button appears", (buttonTitle) => {
    cy.get("a").contains(buttonTitle).should("be.visible");
});

/**
 * Scenario: Navigating back from non-existing board
 */

Given("I am on {string} page", (path: string) => {
    // Visit the 404 error page
    cy.url().should("contain", path);
});

And("I click on {string} button", (buttonTitle) => {
    cy.get("a").contains(buttonTitle).click();
});

Then("I should revert back to home", () => {
    // Assert that the URL is equal base url
    cy.url().should("contain", Cypress.config().baseUrl);
});
