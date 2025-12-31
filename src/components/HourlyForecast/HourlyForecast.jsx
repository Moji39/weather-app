import React, { useState, useMemo } from "react";
import "./HourlyForecast.css";
import { Dropdown } from "../components";
import { useWeather } from "../../context/weatherCore";
import { format } from "date-fns";

const HourlyForecastItem = ({ time, icon, temp }) => {
  return (
    <div className="hourly-forecast-item flex items-center py-[10px] pr-4 pl-3 gap-2 rounded-lg">
      {icon && <img src={icon} className="w-10 h-10" alt="" />}
      <span className="text-5-medium flex-grow-1">{time}</span>
      <span className="text-7">{temp}</span>
    </div>
  );
};

const HourlyForecast = () => {
  const { data, loading, weatherCodeMapping } = useWeather();

  const orderedDays = useMemo(
    () => [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    []
  );
  const today = format(new Date(), "EEEE");

  const [selectedDay, setSelectedDay] = useState(today);

  const days = useMemo(() => {
    const startIndex = orderedDays.indexOf(today);
    return Array.from({ length: 7 }, (_, i) => {
      return orderedDays[(startIndex + i) % 7];
    });
  }, [orderedDays, today]);

  const dayIndex = days.indexOf(selectedDay);

  const startHour = dayIndex * 24;
  const endHour = startHour + 24;

  const hourlyTimes = data?.hourly?.time?.slice(startHour, endHour) ?? [];

  const handleDayClick = (day) => {
    setSelectedDay(day.value);
  };

  return (
    <>
      <div className="px-4 md:px-6 mb-4">
        <div className="hourly-forecast-header relative flex items-center justify-between">
          <div className="title text-5">Hourly Forecast</div>
          <Dropdown dropdownContent={loading ? [] : days} onSelect={handleDayClick}>
            <button className="flex items-center justify-between px-4 py-2 rounded-lg days-button" disabled={loading}>
              <span className="text-7 mr-3">{loading ? "—" : selectedDay}</span>
              <img src="./src/assets/images/icon-dropdown.svg" className="icon dropdown-icon" alt="" />
            </button>
          </Dropdown>
        </div>
      </div>
      <div className="hourly-forecast-list relative scrollable flex flex-col gap-4 max-h-[608px] overflow-y-auto px-4 md:px-6">
        {hourlyTimes.map((time, i) => {
          const hourIndex = startHour + i;

          return (
            <HourlyForecastItem
              key={hourIndex}
              time={loading ? "" : format(new Date(time), "H aa")}
              icon={loading ? "" : weatherCodeMapping(
                data.hourly.weather_code[hourIndex]
              )}
              temp={loading ? "" : `${Math.round(
                data.hourly.temperature_2m[hourIndex]
              )}°`}
            />
          );
        })}
      </div>
    </>
  );
};

export default HourlyForecast;
