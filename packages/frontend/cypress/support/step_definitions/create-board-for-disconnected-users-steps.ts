import { When, Then, And, But } from "cypress-cucumber-preprocessor/steps";

// TODO: move this definitions to header def later
When("I attempt to click on {string} button in header", (buttonText) => {
    cy.findByTestId("views-tab")
        .findByText(buttonText)
        .first()
        .parent() // the button text is wrapped in a span
        .as(buttonText);
});

When("I click on {string} button in header", (buttonText) => {
    cy.findByTestId("header-nav").findByText(buttonText).click({ force: true });
});

And("I can see the create board button in the custom boards column", () => {
    cy.findByTestId("create-empty-board").should("exist").as("createBoard");
});

Then("{string} button should be disabled", (buttonText) => {
    cy.get(`@${buttonText}`).should("be.disabled");
});

Then("the Boards Manager drops down", () => {
    cy.findByTestId("boards-library").should("have.class", "open");
});

But("create board button is disabled", () => {
    cy.get("@createBoard").should("have.class", "disabled");
});
