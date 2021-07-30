import fetch from "node-fetch";

const maps = [
    "normal",
    "desert",
    "woods",
    "50vs50",
    "potato",
    "savannah",
    "halloween",
    "cobalt",
    "snow",
    "valentine",
    "saint patrick",
    "eggsplosion",
    "may 4th",
    "50vs50 last sacrifice",
    "storm",
    "beach",
    "contact",
    "inferno"
] as const;
const intervals = [ "daily", "weekly", "alltime" ] as const;
const types = [ "most_kills", "most_damage_dealt", "kpg", "kills", "wins" ] as const;
const teamModes = [ "solo", "duo", "squad" ] as const;

export interface Stats {
    slug: string;
    username: string;
    player_icon: string;
    banned: boolean;
    wins: number;
    kills: number;
    games: number;
    kpg: number;
    modes: StatsMode[];
}

export interface StatsMode {
    teamMode: number;
    games: number;
    wins: number;
    kills: number;
    winPercent: number;
    mostKills: number;
    mostDamage: number;
    kpg: number;
    avgDamage: number;
    avgTimeAlive: number;
}

interface RawHisory {
    guid: string;
    region: string;
    map_id: number;
    team_mode: number;
    team_count: number;
    team_total: 79;
    end_time: string;
    time_alive: number;
    rank: number;
    kills: number;
    team_kills: number;
    damage_dealt: number;
    damage_taken: number;
}

export interface History extends Omit<RawHisory, "end_time"> {
    end_time: Date;
}

export interface Leader {
    slug: string;
    username: string;
    region: string;
    games: number;
    val: number;
}

interface HistoryOptions {
    offset: number;
    count: number;
}

interface LeaderboardOptions {
    map: typeof maps[number];
    interval: typeof intervals[number];
    type: typeof types[number];
    team: typeof teamModes[number];
    count: number;
}

export async function getStats(username: string) {
    const body = { slug: username.toLowerCase(), interval: "all", mapIdFilter: "-1" };
    const stats = await fetch("https://surviv.io/api/user_stats", { method: "POST", body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }).then(res => res.json());
    if (!stats) throw new Error("Username not found");
    stats.kpg = Number(stats.kpg);
    const modes = [];
    for (const mode of stats.modes) {
        mode.winPercent = Number(mode.winPct);
        mode.kpg = Number(mode.kpg);
        delete mode.winPct;
        modes.push(mode);
    }
    stats.modes = modes;
    return <Stats> stats;
}

export async function getHistory(username: string, options: HistoryOptions = { offset: 0, count: 1 }) {
    const body = { slug: username.toLowerCase(), offset: options.offset, count: options.count, teamModeFilter: 7 };
    const history = await fetch("https://surviv.io/api/match_history", { method: "POST", body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }).then(res => res.json());
    const h = history.map((x: RawHisory) => {
        const yy = <History> <unknown> x;
        yy.end_time = new Date(x.end_time);
        return yy;
    });
    return <History[]> h;
}

export async function getLeaderboard(options: LeaderboardOptions = { map: "normal", interval: "daily", type: "most_kills", team: "solo", count: 100 }) {
    const body = { type: options.type, teamMode: options.team, interval: options.interval, mapId: maps.indexOf(options.map), maxCount: options.count };
    if (!intervals.includes(body.interval)) throw new Error(`The interval is invalid. Use only "${intervals.join(`", "`)}"`);
    else if (!types.includes(body.type)) throw new Error(`The type is invalid. Use only "${types.join(`", "`)}"`);
    else if (!teamModes.includes(body.teamMode)) throw new Error(`The team mode is invalid. Use only "${teamModes.join(`", "`)}"`);
    const leaderboard = await fetch("https://surviv.io/api/leaderboard", { method: "POST", body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }).then(res => res.json());
    return <Leader[]> leaderboard;
}