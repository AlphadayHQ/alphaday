import { TBaseItem } from "./primitives";

export type TRedditItem = TBaseItem & {
    startsAt: string;
    endsAt: string;
};
