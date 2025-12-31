import React from "react";
import "./WeatherInfo.css";
import { useWeather } from "../../context/weatherCore";
import { format } from "date-fns";

const SecondaryInfoItem = ({ label, value }) => {
  return (
    <div className="secondary-info-item">
      <div className="secondary-info-label text-6 mb-6">{label}</div>
      <div className="secondary-info-value text-3">{value}</div>
    </div>
  );
};

const isDefined = (value) =>
  value !== null && value !== undefined && value !== "undefined";

const WeatherInfo = () => {
  const { data, loading, selectedValues, lastCity, weatherCodeMapping } =
    useWeather();

  const temperatureUnitLabel =
    selectedValues?.temperature === "imperial" ? "°F" : "°C";
  const windUnitLabel =
    selectedValues?.windSpeed === "imperial" ? "mph" : "km/h";
  const precipUnitLabel =
    selectedValues?.precipitation === "imperial" ? "in" : "mm";

  const currentTemp =
    !loading && isDefined(data?.current?.temperature_2m)
      ? `${Math.round(data.current.temperature_2m)} ${temperatureUnitLabel}`
      : "";
  const feelsLike =
    !loading && isDefined(data?.current?.apparent_temperature)
      ? `${Math.round(
          data.current.apparent_temperature
        )} ${temperatureUnitLabel}`
      : "—";
  const humidity =
    !loading && isDefined(data?.current?.relative_humidity_2m)
      ? `${data.current.relative_humidity_2m} %`
      : "—";
  const wind =
    !loading && isDefined(data?.current?.wind_speed_10m)
      ? `${Math.round(data.current.wind_speed_10m)} ${windUnitLabel}`
      : "—";
  const precipitation =
    !loading && isDefined(data?.current?.precipitation)
      ? `${Math.round(data.current.precipitation)} ${precipUnitLabel}`
      : "—";

  return (
    <>
      <div className="temp relative mb-5 -z-9 2xl:mb-8">
        <div
          className={`bg-setup absolute top-0 left-0 w-full h-full -z-10 ${
            loading ? "hidden" : ""
          }`}
        >
          <div className="bg bg-small md:hidden"></div>
          <div className="bg bg-large hidden md:block"></div>
        </div>
        <div className="main-info px-6 py-8 md:py-20 md:flex md:justify-between md:items-center">
          {!loading ? (
            <>
              <div className="date-location mb-4 md:w-fit md:mb-0">
                <div className="location text-4 text-center md:text-left mb-3">
                  {lastCity?.displayName ?? ""}
                </div>
                <div className="date opacity-80 text-6 text-center md:text-left">
                  {data?.current?.time
                    ? format(data?.current?.time, "EEEE, MMM d, yyyy")
                    : ""}
                </div>
              </div>
              <div className="temperature flex items-center justify-center mx-auto w-max md:mx-0">
                <img
                  src={weatherCodeMapping(data?.current?.weather_code)}
                  className="temp-icon mr-5"
                  alt=""
                />
                <span className="temp-value text-1">{currentTemp}</span>
              </div>
            </>
          ) : (
            <div className="loading flex flex-col items-center justify-center w-full">
              <div className="dots-loader mb-3.5">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="loading-text text-6">Loading...</div>
            </div>
          )}
        </div>
      </div>
      <div className="secondary-info flex flex-wrap gap-4 md:gap-5 2xl:gap-6">
        <SecondaryInfoItem label="Feels Like" value={feelsLike} />
        <SecondaryInfoItem label="Humidity" value={humidity} />
        <SecondaryInfoItem label="Wind" value={wind} />
        <SecondaryInfoItem label="Precipitation" value={precipitation} />
      </div>
    </>
  );
};

export default WeatherInfo;
