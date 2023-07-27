import { defineParameterType } from "cypress-cucumber-preprocessor/steps";

defineParameterType({
    name: "env",
    regexp: /<ENV_[A-Z0-9_]+>/, // matches <ENV_VAR_NAME>
    transformer: (envVarName) => {
        return Cypress.env(envVarName.replace(/<ENV_|>/g, ""));
    },
});
