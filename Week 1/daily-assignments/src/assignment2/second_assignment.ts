const { readFile } = require("fs/promises");
import { Request, Response } from "express";
const express = require("express");
const ejs = require("ejs");
import { CityWeather, WeatherData } from "../../interfaces/weather";

const app = express();
const storeNewCityData: (city: string) => Promise<WeatherData> = require("../utils/functions").getAndStoreNewData;

const getWeatherData = async (): Promise<WeatherData> => {
  const jsonData = await readFile("../../public/assets/weatherHistory.json");
  const data: WeatherData = JSON.parse(jsonData);
  return data;
};

app.use(express.static("../../public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/weather", async (req: Request, res: Response): Promise<void> => {
  const data = await getWeatherData();
  res.render("weather", { data });
});

app.get("/weatherCity", async (req: Request, res: Response): Promise<void> => {
  const data: WeatherData = await getWeatherData();
  const key = req.query.key as string;
  const cityData = data[key];
  res.send(JSON.stringify(cityData));
});

app.post("/weather", async (req: Request, res: Response): Promise<void> => {
  const city: string = req.body.city;
  const store = await storeNewCityData(city);
  const data = await getWeatherData();
  res.location("/weather");
});

app.listen(3000);
