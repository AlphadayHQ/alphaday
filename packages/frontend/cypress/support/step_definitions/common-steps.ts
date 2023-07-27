import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

Given("I load alphaday url {string}", (url: string) => {
    cy.load(url).log("visited url:", url);
});

And("I have completed the tutorial", () => {
    cy.get("body").then(($body) => {
        if ($body.find("[data-testid='tutorial-wrapper']").length) {
            cy.findByTestId("tutorial-wrapper")
                .should("be.visible")
                .click()
                .click();
        }
    });
});

And("I have accepted cookies", () => {
    // TODO: Implement Accept cookies
});

When("the default board is visible", () => {
    // Assert that the default board is visible
    cy.mockApi();
    cy.url().should("include", "/b/");
    cy.awaitApi();
});

Then("the header should be displayed", () => {
    // Assert that the header is displayed
    cy.findByTestId("header-search-container").should("exist");
});

When("I search for {string}", (searchTerm: string) => {
    cy.mockApi();
    cy.findByTestId("header-search-container")
        .findByTestId("searchbar-input")
        .type(searchTerm, { force: true });
    cy.awaitApi();
    cy.findByTestId("header-search-container")
        .findByTestId(`searchbar-option-${searchTerm}`)
        .find("div")
        .click({ force: true });
});

Then(
    "{string} tags should be in search bar",
    { timeout: 60_000 },
    (searchTerm: string) => {
        cy.findByTestId("header-search-container").should(
            "contain.text",
            searchTerm
        );

        // close the options
        cy.findByTestId("header-search-container")
            .findByTestId("searchbar-input")
            .type("{esc}");
    }
);
