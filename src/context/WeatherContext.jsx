import React, { useState, useCallback, useEffect } from "react";
import { fetchWeatherByCoords } from "../service/weatherService";
import { WeatherContext } from "./weatherCore";

const STORAGE_KEY = "weather_app_units";

export const WeatherProvider = ({ children }) => {
  const stored =
    (typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")) ||
    null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [temperatureUnit, setTemperatureUnit] = useState(
    stored?.temperature || "metric"
  );
  const [windSpeedUnit, setWindSpeedUnit] = useState(
    stored?.windSpeed || "metric"
  );
  const [precipitationUnit, setPrecipitationUnit] = useState(
    stored?.precipitation || "metric"
  );

  // lastCity normalized to { lat, lon, displayName }
  const [lastCity, setLastCity] = useState({
    lat: 52.52,
    lon: 13.419,
    displayName: "Berlin, Germany",
  });

  // persist units
  useEffect(() => {
    const payload = {
      temperature: temperatureUnit,
      windSpeed: windSpeedUnit,
      precipitation: precipitationUnit,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }, [temperatureUnit, windSpeedUnit, precipitationUnit]);

  const getWeatherByCoords = useCallback(async (lat, lon, opts = {}) => {
    setLoading(true);
    setError(null);
    try {
      const d = await fetchWeatherByCoords(lat, lon, opts);
      setData(d);
      // only update lastCity if coords actually changed to avoid re-triggering effects
      setLastCity((prev) => {
        if (!prev || prev.lat !== lat || prev.lon !== lon) return { lat, lon };
        return prev;
      });
      return d;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const setUnit = useCallback((unitType, value) => {
    switch (unitType) {
      case "temperature":
        setTemperatureUnit(value);
        break;
      case "windSpeed":
        setWindSpeedUnit(value);
        break;
      case "precipitation":
        setPrecipitationUnit(value);
        break;
      default:
        break;
    }
  }, []);

  const setCity = useCallback((city) => {
    if (city) {
      setLastCity((prev) => {
        const lat = city.lat ?? city.latitude ?? city.latitude ?? city.lat;
        const lon = city.lon ?? city.longitude ?? city.longitude ?? city.lon;
        const displayName = city.displayName || (city.name && city.country ? `${city.name}, ${city.country}` : city.name) || prev?.displayName || '';
        if (!prev || prev.lat !== lat || prev.lon !== lon || prev.displayName !== displayName) return { lat, lon, displayName };
        return prev;
      });
    }
  }, []);

  const switchAll = useCallback((target) => {
    setTemperatureUnit(target);
    setWindSpeedUnit(target);
    setPrecipitationUnit(target);
  }, []);

  useEffect(() => {
    if (!lastCity || lastCity.lat == null || lastCity.lon == null) return;
    getWeatherByCoords(lastCity.lat, lastCity.lon, { temperature_unit: temperatureUnit === "metric" ? "celsius" : "fahrenheit", windspeed_unit: windSpeedUnit === "metric" ? "kmh" : "mph", precipitation_unit: precipitationUnit === "metric" ? "mm" : "inch" }).catch(() => {});
  }, [
    temperatureUnit,
    windSpeedUnit,
    precipitationUnit,
    lastCity,
    getWeatherByCoords,
  ]);

  const selectedValues = {
    temperature: temperatureUnit,
    windSpeed: windSpeedUnit,
    precipitation: precipitationUnit,
  };

  const weatherCodeMapping = (code) => {
    const base = "./src/assets/images/icon-";

    switch (true) {
      case code == 0:
        return `${base}sunny.webp`;

      case code == 1 || code == 2:
        return `${base}partly-cloudy.webp`;

      case code == 3:
        return `${base}overcast.webp`;

      case code >= 40 && code < 50:
        return `${base}fog.webp`;

      case code >= 50 && code < 60:
        return `${base}drizzle.webp`;

      case code >= 60 && code < 70:
        return `${base}rain.webp`;

      case code >= 70 && code < 80:
        return `${base}snow.webp`;

      case code == 80 || code == 81 || code == 82:
        return `${base}rain.webp`;

      case code == 85 || code == 86:
        return `${base}snow.webp`;

      case code >= 90 && code < 100:
        return `${base}storm.webp`;

      default:
        return "";
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        data,
        loading,
        error,
        getWeatherByCoords,
        setUnit,
        switchAll,
        selectedValues,
        setCity,
        lastCity,
        weatherCodeMapping,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
