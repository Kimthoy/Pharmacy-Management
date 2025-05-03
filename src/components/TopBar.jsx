// src/components/TopBar.jsx
import React, { useState, useRef } from "react";
import { useTranslation } from "../../src/hooks/useTranslation";
import { RiGlobalLine } from "react-icons/ri";
import {
  MessageCircle,
  Bell,
  User,
  Settings,
  LogOut,
  Activity,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const languageOptions = [
  {
    value: "en",
    label: "English",
    flag: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg",
  },
  {
    value: "km",
    label: "ខ្មែរ",
    flag: "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg",
  },
];

const TopBar = () => {
  const { t, langCode, changeLanguage } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className="bg-white z-10 p-4 flex items-center justify-between relative">
      {/* Language Selector */}
      <div className="flex items-center border space-x-2 rounded-md px-4 py-2 hover:border-green-600">
        <img
          src={languageOptions.find((lang) => lang.value === langCode)?.flag}
          alt={langCode}
          className="w-8 h-8 rounded-full border"
        />
        <select
          value={langCode}
          onChange={handleLanguageChange}
          className="text-gray-500 text-xs cursor-pointer bg-transparent border-none focus:outline-none"
        >
          {languageOptions.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-green-500 text-white p-1 rounded-full cursor-pointer me-5"
        >
          <User size={30} />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-4 border border-green-200 mt-2 w-56 bg-white shadow-lg rounded-lg p-2">
            <Link to="/aboutuser">
              <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                <UserCircle className="mr-2" size={18} />{" "}
                {t("topbar.viewProfile")}
              </button>
            </Link>
            <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <Settings className="mr-2" size={18} />{" "}
              {t("topbar.accountSetting")}
            </button>
            <button className="w-full flex items-center px-4 py-2 text-green-600 hover:bg-gray-100">
              <Activity className="mr-2" size={18} />{" "}
              {t("topbar.loginActivity")}
            </button>
            <button className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100">
              <LogOut className="mr-2" size={18} /> {t("topbar.signOut")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
