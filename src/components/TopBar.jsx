import React, { useState } from "react";

const TopBar = () => {
  const [language, setLanguage] = useState("English (US)");

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const languageOptions = [
    {
      value: "English (US)",
      label: "English (US)",
      flag: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg",
    },
    {
      value: "Khmer (Khmer)",
      label: "Khmer (Khmer)",
      flag: "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg",
    },
  ];

  return (
    <div className="bg-green-100 shadow-md p-4 flex flex-wrap md:flex-nowrap items-center justify-between">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search ..."
        className="hidden sm:block border-separate shadow-lg rounded-lg p-2 w-full sm:max-w-sm outline-none"
      />

      {/* Language Selector */}
      <div className="flex items-center space-x-2 md:space-x-4 cursor-pointer">
        <img
          src={languageOptions.find((lang) => lang.value === language)?.flag}
          alt={language}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg"
        />
        <select
          value={language}
          onChange={handleLanguageChange}
          className="shadow-lg rounded p-2 bg-white outline-none text-sm sm:text-base"
        >
          {languageOptions.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Greeting & Time */}
      <div className="text-center sm:text-right mt-2 sm:mt-0">
        <p className="text-green-600 font-medium text-sm sm:text-base">
          Good Morning
        </p>
        <p className="text-green-500 text-xs sm:text-sm">
          14 January 2022 | 22:45:04
        </p>
      </div>
    </div>
  );
};

export default TopBar;
