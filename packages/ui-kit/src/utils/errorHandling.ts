import Logoday from "src/assets/svg/logo-white.svg";

/* eslint-disable no-param-reassign */
export const imgOnError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = Logoday;
};
/* eslint-enable no-param-reassign */
