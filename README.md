# Survivio-API
A package to help fetch the Surviv.io API.

## Usage
```js
const surviv = require("surviv-io");

await surviv.getStats("username");
await surviv.getHistory("username", options);
await surviv.getLeaderboard(options);
```

Options of `getHistory()`:
- Offset: Integer. The offset of the matches.
- Count: Integer. The amount of matches to retrieve.

Options of `getLeaderboard()`:
- Map: String. The name of the map. Listed below.
```js
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
```
- Interval: String. Daily, weekly or all time.
```js
const intervals = [ "daily", "weekly", "alltime" ];
```
- Type: String. The way the leaderboard is sorted. Listed below.
```js
const types = [ "most_kills", "most_damage_dealt", "kpg", "kills", "wins" ];
```
- Team: String. The team mode of the matches. Listed below.
```js
const teamModes = [ "solo", "duo", "squad" ];
```
- Count: Integer. The number of users to retrieve.