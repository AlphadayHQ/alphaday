import i18next from "i18next";

export const termsOfService = `
#### ${i18next.t("terms_of_service.titleOne")}

${i18next.t("terms_of_service.text_one")} [__${i18next.t("terms_of_service.text_two")}__](https://uniswap.org/terms-of-service) ${i18next.t("terms_of_service.text_three")} [__${i18next.t("terms_of_service.text_four")}__](https://uniswap.org/privacy-policy).

#### ${i18next.t("terms_of_service.titleTwo")}

${i18next.t("terms_of_service.text_five")}
`;

export default termsOfService;
