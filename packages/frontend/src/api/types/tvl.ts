import { TTvlDatum, TBaseProject } from "./primitives";

export type TTvlHistoryDatum = {
    date: string;
    tvlUsd: number;
};

export type TTvlHistory = TTvlHistoryDatum[];

export type TProjectTvlHistory = {
    id: number;
    project: TBaseProject;
    interval: string;
    currency: string;
    history: TTvlHistory | void;
    requestedAt: string;
};

export type TProjectData = TTvlDatum & {
    id: number;
    project: TBaseProject;
    tvlHistories: TProjectTvlHistory | undefined;
};
