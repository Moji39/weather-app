import { fetchWeatherApi } from "openmeteo";

const url = "https://api.open-meteo.com/v1/forecast";
let count = 0;

export async function fetchWeatherByCoords(
  lat,
  lon,
  {
    temperature_unit = "celsius",
    windspeed_unit = "kmh",
    precipitation_unit = "mm",
  } = {}
) {
  if (lat == null || lon == null) throw new Error("lat and lon required");
  const params = {
    latitude: String(lat),
    longitude: String(lon),
    daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
    hourly: ["temperature_2m", "weather_code"],
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
    ],
    temperature_unit,
    windspeed_unit,
    precipitation_unit,
  };

  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];

  const utcOffsetSeconds = response.utcOffsetSeconds();

  const currentData = response.current() || null;
  const hourlyData = response.hourly() || null;
  const dailyData = response.daily() || null;

  const weatherData = {
    current: {
      time: new Date((Number(currentData.time()) + utcOffsetSeconds) * 1000),
      temperature_2m: currentData.variables(0)?.value(),
      relative_humidity_2m: currentData.variables(1)?.value(),
      apparent_temperature: currentData.variables(2)?.value(),
      precipitation: currentData.variables(3)?.value(),
      weather_code: currentData.variables(4)?.value(),
      wind_speed_10m: currentData.variables(5)?.value(),
    },
    hourly: {
      time: Array.from(
        {
          length:
            (Number(hourlyData.timeEnd()) - Number(hourlyData.time())) /
            hourlyData.interval(),
        },
        (_, i) =>
          new Date(
            (Number(hourlyData.time()) +
              i * hourlyData.interval() +
              utcOffsetSeconds) *
              1000
          )
      ),
      temperature_2m: hourlyData.variables(0)?.valuesArray(),
      weather_code: hourlyData.variables(1)?.valuesArray(),
    },
    daily: {
      time: Array.from(
        {
          length:
            (Number(dailyData.timeEnd()) - Number(dailyData.time())) /
            dailyData.interval(),
        },
        (_, i) =>
          new Date(
            (Number(dailyData.time()) +
              i * dailyData.interval() +
              utcOffsetSeconds) *
              1000
          )
      ),
      weather_code: dailyData.variables(0)?.valuesArray(),
      temperature_2m_max: dailyData.variables(1)?.valuesArray(),
      temperature_2m_min: dailyData.variables(2)?.valuesArray(),
    },
  };

  count++;
  console.log(`Weather requests made: ${count}, lat: ${lat}, lon: ${lon}`);
  console.log(weatherData);
  return {
    current: weatherData.current,
    hourly: weatherData.hourly,
    daily: weatherData.daily,
  };
}
