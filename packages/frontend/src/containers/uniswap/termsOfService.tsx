import i18next from "i18next";

export const termsOfService = `
#### ${i18next.t("terms_of_service.titleOne")}

${i18next.t("terms_of_service.textOne")} [__${i18next.t("terms_of_service.textTwo")}__](https://uniswap.org/terms-of-service) ${i18next.t("terms_of_service.textThree")} [__${i18next.t("terms_of_service.textFour")}__](https://uniswap.org/privacy-policy).

#### ${i18next.t("terms_of_service.titleTwo")}

${i18next.t("terms_of_service.textFive")}
`;

export default termsOfService;
