import React from "react";
import {
  Search,
  WeatherInfo,
  DailyForecast,
  HourlyForecast,
  Header,
  Error,
} from "../components/components";
import { useWeather } from "../context/weatherCore";

const MainPage = () => {
  const { error, getWeatherByCoords } = useWeather();

  return (
    <>
      <Header />
      <main>
        <div className="container">
          {!error ? (
            <>
              <h1 className="text-2 text-center my-12 max-w-[500px] mx-auto 2xl:my-16 2xl:max-w-full">
                How's the sky looking today?
              </h1>
              <div className="search mb-8 mx-auto md:flex md:justify-between 2xl:max-w-[656px] 2xl:mb-12">
                <Search />
              </div>
              <div className="weather-info 2xl:flex">
                <div className="2xl:mr-8 2xl:flex-grow-6">
                  <div className="general-info mb-8 2xl:mb-12">
                    <WeatherInfo />
                  </div>
                  <div className="daily-forecast mb-8 2xl:mb-0">
                    <DailyForecast />
                  </div>
                </div>
                <div className="hourly-forecast py-5 md:py-6 2xl:flex-grow-1">
                  <HourlyForecast />
                </div>
              </div>
            </>
          ) : (
            <Error />
          )}
        </div>
      </main>
    </>
  );
};

export default MainPage;
