import React from 'react'
import './Header.css'
import { Dropdown } from '../components'
import { useWeather } from '../../context/weatherCore'

const Header = () => {
  const { selectedValues, setUnit, switchAll } = useWeather();

  const units = {
    temperature: {
      metric: "Celsius (°C)",
      imperial: "Fahrenheit (°F)"
    },
    windSpeed: {
      metric: "km/h",
      imperial: "mph"
    },
    precipitation: {
        metric: "Millimeters (mm)",
        imperial: "Inches (in)"
    }
  };

  const handleUnitChange = (unitType, value) => {
    setUnit(unitType, value);
  };

  const handleSwitchAll = (target) => {
    switchAll(target);
  };

  return (
    <header>
        <div className="container relative flex items-center justify-between">
          <img
            src="./src/assets/images/logo.svg"
            alt="logo"
            id="logo"
            className="logo max-w-[138px] md:max-w-none"
          />
          <Dropdown
            dropdownContent={units}
            selectedSection={selectedValues}
            onSelect={({ section, key }) => handleUnitChange(section, key)}
            onSwitch={handleSwitchAll}
          >
            <button className="flex items-center justify-between px-2.5 py-2 rounded-lg units-button md:px-4 md:py-3">
              <img src="./src/assets/images/icon-units.svg" className='icon units-icon' alt="" />
              <span className="text-8 mx-2 md:text-7 md:mx-2.5">Units</span>
              <img src="./src/assets/images/icon-dropdown.svg" className='icon dropdown-icon' alt="" />
            </button>
          </Dropdown>
        </div>
      </header>
  )
}

export default Header
