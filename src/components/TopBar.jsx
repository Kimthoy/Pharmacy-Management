import React, { useState, useEffect, useRef } from "react";
import {
  Globe,
  MessageCircle,
  Bell,
  User,
  Settings,
  LogOut,
  Activity,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { RiGlobalLine } from "react-icons/ri";

const TopBar = () => {
  const [language, setLanguage] = useState("English (US)");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white z-10  p-4 flex items-center justify-between relative">
      {/* Search Bar */}
      <div className="flex items-center border-b  border-green-600 w-1/3">
        <input
          type="text"
          placeholder="Search anything"
          className="w-full p-2 outline-none text-gray-600 "
          aria-label="Search"
        />
      </div>

      {/* Icons Section */}
      <div className="flex items-center space-x-6">
        <RiGlobalLine className="text-green-600 cursor-pointer " size={27} />
        <MessageCircle className="text-green-600 cursor-pointer" size={27} />
        <Bell className="text-green-600 cursor-pointer" size={27} />

        {/* Language Selector */}
        <div className="flex items-center border space-x-2 rounded-md px-4 py-2 hover:border-green-600">
          <img
            src={languageOptions.find((lang) => lang.value === language)?.flag}
            alt={language}
            className="w-8 h-8 rounded-full  border"
            aria-label="Selected language flag"
          />
          <select
            value={language}
            onChange={handleLanguageChange}
            className="text-gray-500   text-xs  cursor-pointer"
            aria-label="Language selector"
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Profile Icon with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-green-500 text-white p-1 rounded-full cursor-pointer me-5"
          >
            <User size={30} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-4 border border-green-200 mt-2 w-56 bg-white shadow-lg rounded-lg p-2">
              <div className="flex items-center p-2 border-b">
                <div className="bg-green-500 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
                  AB
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Abu Bin Ishtiyak</p>
                  <p className="text-gray-500 text-sm">info@softnio.com</p>
                </div>
              </div>
              <Link to="/aboutuser">
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <UserCircle className="mr-2" size={18} /> View Profile
                </button>
              </Link>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Settings className="mr-2" size={18} /> Account Setting
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="w-full flex items-center px-4 py-2 text-green-600 hover:bg-gray-100"
              >
                <Activity className="mr-2" size={18} /> Login Activity
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                <LogOut className="mr-2" size={18} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
