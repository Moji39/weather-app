import React from "react";
import "./DailyForecast.css";
import { useWeather } from "../../context/weatherCore";
import { format } from 'date-fns';

const ForecastItem = ({ day, icon, minTemp, maxTemp }) => {
  return (
    <div className="forecast-item">
      <div className="day text-center">{day}</div>
      {icon && <img src={icon} alt={day} className="icon forecast-icon my-4 mx-auto" />}
      <div className="temp flex justify-between">
        <span className="min">{minTemp}</span>
        <span className="max">{maxTemp}</span>
      </div>
    </div>
  );
};

const DailyForecast = () => {
  const { data, loading, weatherCodeMapping } = useWeather();

  return (
    <>
      <div className="title text-5 mb-5">Daily Forecast</div>
      <div className="forecast">
        {data?.daily?.time?.slice(0, 7).map((time, i) => (
          <ForecastItem
            key={i}
            day={loading ? "" : format(new Date(time), "EEE")}
            icon={loading ? "" : weatherCodeMapping(data.daily.weather_code[i])}
            minTemp={loading ? "" : `${Math.round(data.daily.temperature_2m_min[i])}°`}
            maxTemp={loading ? "" : `${Math.round(data.daily.temperature_2m_max[i])}°`}
          />
        ))}
      </div>
    </>
  );
};

export default DailyForecast;
