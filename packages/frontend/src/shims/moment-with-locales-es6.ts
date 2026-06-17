// @ts-expect-error - minified UMD bundle has no types
// eslint-disable-next-line import/extensions
import * as mod from "moment/min/moment-with-locales.min.js";

type Moment = typeof import("moment");
const moment = ((mod as unknown as { default?: Moment }).default ??
    mod) as Moment;

export default moment;
