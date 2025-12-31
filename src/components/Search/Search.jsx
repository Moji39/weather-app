import React, { useEffect, useState } from "react";
import "./Search.css";
import Dropdown from "../Drowpdown/Dropdown.jsx";
import { geocodeCity } from "../../service/cityService.js";
import { useWeather } from "../../context/weatherCore";
import searchIcon from "../../assets/images/icon-search.svg";

const normalize = (s = "") => s.trim().toLowerCase();

const Search = ({ onSelectCity }) => {
  const { getWeatherByCoords, selectedValues, setCity } = useWeather();

  const [cityInput, setCityInput] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (cityInput.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedCity(null);
      return;
    }

    const q = normalize(cityInput);
    if (!q) return;

    let isCancelled = false;

    const fetchCities = async () => {
      try {
        const matches = await geocodeCity(q);

        if (isCancelled) return;

        if (cityInput === matches[0]?.displayName) {
          setShowSuggestions(false);
          setSelectedCity(matches[0]);
          setCity(matches[0]);
        } else {
          setSuggestions(matches);
          setShowSuggestions(matches.length > 0);
          setSelectedCity(null);
        }
      } catch (err) {
        console.error("Geocoding failed", err);
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedCity(null);
      }
    };

    fetchCities();

    return () => {
      isCancelled = true;
    };
  }, [cityInput, setCity]);

  const handleChange = (e) => {
    setCityInput(e.target.value);
    setSelectedCity(null);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) setShowSuggestions(true);
  };

  const selectSuggestion = (payload) => {
    const label = payload.value;
    setCityInput(label);
    const found = suggestions.find((c) => c.displayName === label) || null;
    setSelectedCity(found);
    setCity(found);
    setShowSuggestions(false);
    setSuggestions([]);
    if (onSelectCity) onSelectCity(found);
  };

  const handleSearch = async () => {
    try {
      const options = {
        temperature_unit:
          selectedValues.temperatureUnit === "metric"
            ? "celsius"
            : "fahrenheit",
        windspeed_unit:
          selectedValues.windSpeedUnit === "metric" ? "kmh" : "mph",
        precipitation_unit:
          selectedValues.precipitationUnit === "metric" ? "mm" : "inch",
      };

      if (cityInput.length >= 3) {
        const matches = await geocodeCity(normalize(cityInput));
        const firstCity = matches?.[0];

        if (!firstCity) return;

        setSelectedCity(firstCity);
        setCity(firstCity);
        setCityInput(firstCity.displayName);
        setSuggestions([]);
        setShowSuggestions(false);

        if (onSelectCity) onSelectCity(firstCity);
      }
    } catch (e) {
      console.error("Search failed", e);
    }
  };

  return (
    <>
      <div className="search-input relative flex items-center mb-3 md:mb-0 md:mr-4 md:flex-grow-1">
        <Dropdown
          dropdownContent={suggestions.map((c) => c.displayName)}
          onSelect={selectSuggestion}
          isToggle={false}
        >
          <img
            src={searchIcon}
            alt=""
            className="w-6 h-6 mr-6"
          />
          <div
            className="search-field-wrapper"
            style={{ position: "relative", width: "100%" }}
          >
            <input
              type="text"
              placeholder="Search for a place..."
              value={cityInput}
              onChange={handleChange}
              onFocus={handleFocus}
              className="bg-transparent border-none outline-none text-5-medium w-full"
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              aria-haspopup="listbox"
            />
          </div>
        </Dropdown>
      </div>

      <button
        className={`search-button text-5-medium text-center w-full md:max-w-fit ${
          cityInput.length >= 3 ? "" : "button-disabled"
        }`}
        disabled={cityInput.length < 3}
        onClick={handleSearch}
      >
        Search
      </button>
    </>
  );
};

export default Search;
