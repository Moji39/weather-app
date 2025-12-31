import React, { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

const Dropdown = ({
  children,
  dropdownContent,
  onSelect,
  selectedSection,
  onSwitch,
  isToggle = true,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const toggle = (e) => {
    e.stopPropagation();
    setOpen((v) => isToggle ? !v : true);
  };

  const handleItemClick = (sectionKey, itemKey, value) => {
    setOpen(false);
    if (onSelect) onSelect({ section: sectionKey, key: itemKey, value });
  };

  const handleSwitch = (targetSection) => {
    setOpen(false);
    if (onSwitch) onSwitch(targetSection);
  };

  const renderContent = () => {
    const camelToTitleShort = (s) =>
      (s || "")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    if (!dropdownContent) return null;

    if (Array.isArray(dropdownContent)) {
      return (
        <ul className="dropdown-list">
          {dropdownContent.map((item, idx) => (
            <li
              key={idx}
              className="dropdown-item"
              onClick={() => handleItemClick(null, item, item)}
            >
              {item}
            </li>
          ))}
        </ul>
      );
    }

    const sectionKeys = Object.keys(dropdownContent);
    
    const allSelected = sectionKeys.map((k) => (selectedSection && selectedSection[k]) || null);
    const allSame = allSelected.every((v) => v && v === allSelected[0]);
    const currentGlobal = allSame ? allSelected[0] : null; // 'metric' | 'imperial' | null
    const toggleTarget = currentGlobal === "metric" ? "imperial" : "metric";

    return (
      <>
        {onSwitch && (
          <div
            className="dropdown-switch text-7 mb-1 py-2.5 px-2"
            role="button"
            tabIndex={0}
            onClick={() => handleSwitch(toggleTarget)}>
            {`Switch to ${camelToTitleShort(toggleTarget)}`}
          </div>
        )}
        {sectionKeys.map((sectionKey) => {
          const sectionValue = dropdownContent[sectionKey];
          return (
            <div key={sectionKey} className={`dropdown-section relative`}>
              <div className="dropdown-section-title text-8 px-2 pt-1.5 mb-2">
                <span>{camelToTitleShort(sectionKey)}</span>
              </div>

              {Object.entries(sectionValue).map(([itemKey, itemValue]) => {
                const isSelected = selectedSection && selectedSection[sectionKey] === itemKey;
                return (
                  <div
                    key={itemKey}
                    className={`dropdown-item ${isSelected ? "dropdown-item-selected" : ""}`}
                    onClick={() => handleItemClick(sectionKey, itemKey, itemValue)}>
                    <div className="dropdown-item-value">{itemValue}</div>
                    {isSelected && (
                      <img src="./src/assets/images/icon-checkmark.svg" alt="" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </>
    );
  };

  if (isToggle)
    return (
      <div className="dropdown relative" ref={ref}>
        <div
          className={`dropdown-trigger ${open ? "is-open" : ""}`}
          onClick={toggle}
          role="button"
          tabIndex={0}
        >
          {children}
        </div>

        <div
          className={`dropdown-content absolute z-10 right-0 mt-2.5 p-2 rounded-lg ${
            open ? "is-open" : ""
          }`}
          aria-hidden={!open}
        >
          {renderContent()}
        </div>
      </div>
    );

  return (
    <>
      {children}
      <div
        className={`dropdown-content absolute z-10 left-0 top-[58px] w-full mt-2.5 p-2 rounded-lg ${!isToggle && dropdownContent.length > 0 ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        {renderContent()}
      </div>
    </>
  );
};

export default Dropdown;
