const readline = require("readline");
const { stdin: input, stdout: output } = require("process");

const rl = readline.createInterface({ input, output });

const storeNewData: (city: string) => void = require("../utils/functions").getAndStoreNewData;

rl.question("Which city you want to add weather data of?\n ", (city: string) => {
  storeNewData(city);
  rl.close();
});
