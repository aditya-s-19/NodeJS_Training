const fs = require("fs/promises");

const FILE_PATH = "../../public/assets/weatherHistory.json";
const API_URL = "http://api.weatherapi.com/v1/current.json?key=42fb4882a30c4db4a0062820240304";

const getAndStoreNewData = async (city: string) => {
  // two functions, api service and db layer
  try {
    const jsonData = await fs.readFile(FILE_PATH);
    const data = JSON.parse(jsonData);
    const response = await fetch(`${API_URL}&q=${city}`);
    const weatherData = await response.json();
    const dataKey = `${weatherData.location.name.replace(" ", "")}_${weatherData.location.localtime.replace(" ", "_")}`;
    data[dataKey] = weatherData;
    fs.writeFile(FILE_PATH, JSON.stringify(data), (err: Error) => {
      console.log(err ? err : "file updated successfully!");
    });
    return weatherData;
  } catch (error) {
    console.log(error);
  }
};

module.exports.getAndStoreNewData = getAndStoreNewData;
