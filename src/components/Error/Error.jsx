import React from "react";
import "./Error.css";
import { useWeather } from "../../context/weatherCore";

const Error = () => {
  const { getWeatherByCoords } = useWeather();

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6 mt-12 mx-auto pt-10 2xl:mt-16">
        <img src="./src/assets/images/icon-error.svg" className="w-11" alt="Error" />
        <h1 className="text-2 text-center">Something went wrong</h1>
        <div className="error-message text-5-medium text-center max-w-[555px]">
          We couldn't connect to the server (API error). Please try again in a
          few moments.
        </div>
        <button className="retry-button py-3 px-4 rounded-lg" onClick={getWeatherByCoords}>
            <img src="./src/assets/images/icon-retry.svg" className="w-4 mr-2.5 inline-block" alt="" />
            <span className="text-7 inline-block">Retry</span>
        </button>
      </div>
    </>
  );
};

export default Error;
