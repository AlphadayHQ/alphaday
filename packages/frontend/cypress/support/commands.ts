import Accounts from "web3-eth-accounts";

// attr
Cypress.Commands.add(
    "attr",
    { prevSubject: "element" },
    (subject, attr, options) => {
        return cy.wrap(subject, options).invoke("attr", attr);
    }
);

// load
Cypress.Commands.add("load", (url, options) => {
    cy.mockApi();
    cy.visit(url, {
        ...options,
        onBeforeLoad: (win) => {
            const TEST_ADDRESS = Cypress.env("TEST_ADDRESS");
            const TEST_XPRV = Cypress.env("TEST_XPRV");

            // eslint-disable-next-line no-param-reassign
            win.ethereum = {
                isAlphaday: true,
                // @ts-expect-error
                request: (req) => {
                    // Logger.debug("mock-libraries: calling metamask mock", req);
                    if (req.method === "eth_requestAccounts") {
                        // Logger.debug("Using ", TEST_ADDRESS);
                        return [TEST_ADDRESS];
                    }
                    if (req.method === "personal_sign") {
                        const ethAccounts = new Accounts();
                        const signatureResponse = ethAccounts.sign(
                            req.params[0],
                            TEST_XPRV || ""
                        );
                        return signatureResponse.signature;
                    }
                    return undefined;
                },
                on: (_event, _handler) => undefined,
                removeListener: (_event, _handler) => undefined,
            };
        },
        auth: {
            username: Cypress.env("APP_AUTH_USERNAME"),
            password: Cypress.env("APP_AUTH_PASSWORD"),
        },
    });
    cy.awaitApi();
});

// getByContent
Cypress.Commands.add("getByContent", (content: string, options) => {
    return cy.get("*", options).contains(content);
});

// mockApi
// eslint-disable-next-line @typescript-eslint/default-param-last
Cypress.Commands.add("mockApi", (path = "**", handler) => {
    const apiUrl = new URL(Cypress.env("APP_API_BASE_URL"));
    apiUrl.pathname = path;
    cy.intercept(apiUrl.toString(), handler).as("apiRequest");
});

// awaitApi
Cypress.Commands.add("awaitApi", () => {
    cy.wait("@apiRequest");
});

export {};
