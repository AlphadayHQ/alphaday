/**
 * The `/coins/{coin}/developer-activity/` endpoint returns GitHub
 * developer-activity snapshots for a coin, newest first. Each snapshot is a
 * point-in-time reading of the coin's main repository.
 */
export type TDeveloperActivitySnapshot = {
    id: number;
    coin: string;
    commitsLast4Weeks: number;
    contributorsCount: number;
    openIssues: number;
    stars: number;
    forks: number;
    date: string;
};

export type TDeveloperActivityData = {
    // snapshots ordered oldest -> newest (ready to plot on a time axis)
    snapshots: TDeveloperActivitySnapshot[];
};
