import { TBaseItem } from "./primitives";

export type TDaoItem = TBaseItem & {
    startsAt: string;
    endsAt: string;
};
