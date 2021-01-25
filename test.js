const surviv = require(".");

(async() => {
    console.log(await surviv.getStats("NorthWestWind"));
    console.log(await surviv.getHistory("NorthWestWind", { offset: 0, count: 10 }));
    console.log(await surviv.getLeaderboard());
})();