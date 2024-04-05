var readline = require("readline");
var _a = require("process"), input = _a.stdin, output = _a.stdout;
var rl = readline.createInterface({ input: input, output: output });
var storeNewData = require("../utils/functions").getAndStoreNewData;
rl.question("Which city you want to add weather data of?\n ", function (city) {
    storeNewData(city);
    rl.close();
});
