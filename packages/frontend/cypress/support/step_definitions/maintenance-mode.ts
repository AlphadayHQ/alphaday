import { Given } from "cypress-cucumber-preprocessor/steps";

Given("I opened alphaday when on maintenance", () => {
    cy.mockApi("/status", {
        statusCode: 503,
        body: {
            message: "Service Unavailable",
        },
    });
    cy.load("/");
});
