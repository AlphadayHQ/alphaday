import { TBaseItem } from "./primitives";

export type TForumItem = TBaseItem & {
    startsAt: string;
    endsAt: string;
};
