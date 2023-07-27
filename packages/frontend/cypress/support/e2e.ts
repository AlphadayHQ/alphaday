/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This support/e2e.ts is processed and
// loaded automatically before all test files.
// ***********************************************************

import { RouteHandler } from "cypress/types/net-stubbing";
import "@testing-library/cypress/add-commands";
// Import custom commands:
import "./commands";

declare global {
    type CypressOptions = Partial<
        Cypress.Loggable &
            Cypress.Timeoutable &
            Cypress.Withinable &
            Cypress.Shadow
    >;

    type TMockMetamaskRequest = {
        method: "eth_requestAccounts" | "personal_sign";
        params: string[];
    };
    namespace Cypress {
        interface Window {
            ethereum: {
                isAlphaday: boolean;
                request: (req: TMockMetamaskRequest) => string | string[];
                on: (
                    event: string,
                    handler: (...args: unknown[]) => void
                ) => void;
                removeListener: (
                    event: string,
                    handler: (...args: unknown[]) => void
                ) => void;
            };
        }
        interface Chainable {
            /**
             * Custom command to read an element's attribute value
             *
             * @param value The attribute name to read
             * @param options The options to pass to cy.get
             *
             * @example cy.attr('data-address')
             */
            attr(
                value: string,
                options?: CypressOptions
            ): Chainable<JQuery<HTMLElement>>;

            /**
             * Custom command to load an alphaday page and wait for it to load.
             * N/B: Tests relying on this command may fail/hang if env `APP_API_BASE_URL` is not defined
             *
             * @param url The page path to visit. E.g - "/", "/b/alpha" etc
             * @param options The options to pass to cy.visit
             *
             * @example cy.load('/')
             */
            load(
                url: string,
                options?: Partial<Cypress.VisitOptions>
            ): Chainable<JQuery<HTMLElement>>;

            /**
             * Custom command to mock api requests
             *
             * @param path The path on the api to mock. Defaults to '**'
             * @param handler The response to return
             */
            mockApi(
                path?: string,
                handler?: RouteHandler
            ): Chainable<JQuery<HTMLElement>>;

            /**
             * Custom command to wait for api request to complete
             */
            awaitApi(): Chainable<JQuery<HTMLElement>>;

            /**
             * Custom command to select DOM element by content
             *
             * @param content The text content to search for
             * @param options The options to pass to cy.get
             *
             * @example cy.getByContent('Hello World')
             * @example cy.getByContent('Hello World', { timeout: 10000 })
             * @example cy.getByContent('Hello World', { timeout: 10000, withinSubject: cy.$$('div') })
             */
            getByContent(
                content: string,
                options?: CypressOptions
            ): Chainable<JQuery<HTMLElement>>;
        }
    }
}
