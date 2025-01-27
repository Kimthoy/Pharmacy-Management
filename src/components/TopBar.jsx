import React, { useState } from "react";

const TopBar = () => {
  const [language, setLanguage] = useState("English (US)");

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value); // Set language based on dropdown selection
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
    <div className="bg-white  shadow-lg p-4 flex items-center justify-between">
      <input
        type="text"
        placeholder="Search ..."
        className="border-separate shadow-lg rounded-lg p-2 flex-grow max-w-sm"
      />
      <img src="PANHARITH.jpg" alt="Phamacy" className="w-max " />

      <div className="flex items-center space-x-4">
        <div className="flex  items-center space-x-2 cursor-pointer">
          <img
            src={languageOptions.find((lang) => lang.value === language)?.flag}
            alt={language}
            className="w-10 h-10 rounded-full  shadow-lg"
          />
          <select
            value={language}
            onChange={handleLanguageChange}
            className=" shadow-lg rounded p-2 bg-white "
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="text-right">
          <p className="text-gray-800 font-medium">Good Morning</p>
          <p className="text-gray-500 text-sm">14 January 2022 | 22:45:04</p>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
