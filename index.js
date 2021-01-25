const fetch = require("node-fetch").default;
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
];
const intervals = [ "daily", "weekly", "alltime" ];
const types = [ "most_kills", "most_damage_dealt", "kpg", "kills", "wins" ];
const teamModes = [ "solo", "duo", "squad" ];

async function getStats(username) {
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
    return stats;
}

async function getHistory(username, options = { offset: 0, count: 1 }) {
    const body = { slug: username.toLowerCase(), offset: options.offset, count: options.count, teamModeFilter: 7 };
    const history = await fetch("https://surviv.io/api/match_history", { method: "POST", body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }).then(res => res.json());
    const h = history.map(x => {
        x.end_time = new Date(x.end_time);
        return x;
    });
    return h;
}

async function getLeaderboard(options = { map: "normal", interval: "daily", type: "most_kills", team: "solo", count: 100 }) {
    const body = { type: options.type, teamMode: options.team, interval: options.interval, mapId: maps.indexOf(options.map), maxCount: options.count };
    if (!intervals.includes(body.interval)) throw new Error(`The interval is invalid. Use only "${intervals.join(`", "`)}"`);
    else if (!types.includes(body.type)) throw new Error(`The type is invalid. Use only "${types.join(`", "`)}"`);
    else if (!teamModes.includes(body.teamMode)) throw new Error(`The team mode is invalid. Use only "${teamModes.join(`", "`)}"`);
    const leaderboard = await fetch("https://surviv.io/api/leaderboard", { method: "POST", body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }).then(res => res.json());
    return leaderboard;
}

module.exports = {
    getHistory,
    getStats,
    getLeaderboard
}