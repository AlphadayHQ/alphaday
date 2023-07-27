import { And, Then, defineStep } from "cypress-cucumber-preprocessor/steps";
import "../params/env";

defineStep(
    "I click on the {string} button in the portfolio widget",
    (buttonText: string) => {
        cy.mockApi();
        cy.findByTestId("portfolio-widget").within(($portfolioWidget) => {
            cy.getByContent(buttonText, {
                withinSubject: $portfolioWidget,
            }).click();
            cy.awaitApi();
        });
    }
);

defineStep("I click on the {string} user option", (optionText: string) => {
    cy.mockApi();
    let buttonId;
    const optionTextLowerCase = optionText.toLowerCase();
    // note: order is important
    if (optionTextLowerCase.includes("disconnect")) {
        buttonId = "profile-dropdown-disconnect-wallet";
    } else if (optionTextLowerCase.includes("verify")) {
        buttonId = "profile-dropdown-verify-wallet";
    } else if (optionTextLowerCase.includes("connect")) {
        buttonId = "profile-dropdown-connect-wallet";
    } else {
        buttonId = "profile-dropdown-connect-wallet";
    }
    cy.findByTestId(buttonId)
        .first()
        .should("have.text", optionText)
        .click({ force: true });
    cy.awaitApi();
});

defineStep("I close the verify wallet pop up", () => {
    cy.findByTestId("alpha-dialog-close-button").click();
});

defineStep("I click on the profile dropdown", () => {
    cy.findByTestId("profile-dropdown").first().click();
});

And("I confirm the Metamask signature request", () => {
    // we handle this automatically in test setup in src/mock-libraries.ts
    // This placeholder step is here to make the test more readable
});

And("I accept Metamask access", () => {
    // we handle this automatically in test setup in src/mock-libraries.ts
    // This placeholder step is here to make the test more readable
});

And("I click on the metamask option", () => {
    cy.findByTestId("wallet-connection-button-metamask").first().click();
});

And("I should see {string} in the portfolio widget", (text: string) => {
    cy.findByTestId("portfolio-widget").should("contain.text", text);
});

And("I should see {env} in the portfolio tabs", (address: string) => {
    cy.findByTestId(`portfolio-account-${address.toLowerCase()}`).should(
        "exist"
    );
});

Then("the wallet address should not be visible", () => {
    cy.findByTestId("profile-dropdown-wallet-address").should("not.exist");
});

Then("the wallet address should be visible", () => {
    cy.findByTestId("profile-dropdown-wallet-address").should("exist");
});

Then("my wallet should be connected", () => {
    cy.findByTestId("profile-dropdown-verify-wallet").should(
        "contain.text",
        "Verify Your Wallet"
    );
    cy.findByTestId("profile-dropdown-wallet-address").should("not.exist");
});

Then("the wallet address should match {env}", (expectedAddress: string) => {
    cy.findByTestId("profile-dropdown-wallet-address")
        .attr("data-address")
        .should("eq", expectedAddress.toLowerCase());
});

Then("I should see the verify wallet pop up", () => {
    cy.findByTestId("alpha-dialog").should("exist");
});
