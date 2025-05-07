// src/components/TopBar.jsx
import React, { useState, useRef } from "react";
import { useTranslation } from "../../src/hooks/useTranslation";

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
import Tooltip from "./Tooltip";

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
    <div className="bg-white z-10 p-4 flex items-center justify-between relative shadow-sm">
      {/* Left Section - Search Bar */}
      <div className="flex-1 max-w-xs">
        <input
          type="text"
          placeholder={t("topbar.search")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Right Section - Icons + Language Selector + Dropdown */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Message Icon */}
        {/* Message Icon with Tooltip */}
        <Tooltip text={t("topbar.messages")}>
          <button
            className="text-gray-600 hover:text-green-600 transition-colors hover:scale-110 hover:transition-all"
            aria-label="Messages"
          >
            <MessageCircle size={24} />
          </button>
        </Tooltip>

        {/* Notification Bell with Tooltip */}
        <Tooltip text={t("topbar.notifications")}>
          <button
            className="text-gray-600 hover:text-green-600 transition-colors hover:scale-110 hover:transition-all"
            aria-label="Notifications"
          >
            <Bell size={24} />
          </button>
        </Tooltip>

        {/* Language Selector */}
        <div className="flex items-center border space-x-2 rounded-md px-3 py-1 hover:border-green-600 bg-gray-50">
          <img
            src={languageOptions.find((lang) => lang.value === langCode)?.flag}
            alt={langCode}
            className="w-6 h-6 rounded-full border"
          />
          <select
            value={langCode}
            onChange={handleLanguageChange}
            className="text-gray-700 text-xs cursor-pointer bg-transparent border-none focus:outline-none"
            aria-label="Language selector"
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Tooltip text={t("topbar.profile")}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-green-500 text-white hover:scale-105 hover:transition-all p-1.5 rounded-full cursor-pointer flex items-center justify-center hover:bg-green-600"
              aria-label="User profile"
            >
              <User size={26} />
            </button>
          </Tooltip>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-green-200 shadow-lg rounded-lg py-2 z-20 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="font-semibold">Abu Bin Ishtiyak</p>
                <p className="text-xs text-gray-500">info@softnio.com</p>
              </div>

              <Link to="/aboutuser">
                <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                  <UserCircle className="mr-2" size={18} />{" "}
                  {t("topbar.viewProfile")}
                </button>
              </Link>

              <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                <Settings className="mr-2" size={18} />{" "}
                {t("topbar.accountSetting")}
              </button>

              <button className="w-full flex items-center px-4 py-2 text-green-600 hover:bg-gray-100 transition-colors">
                <Activity className="mr-2" size={18} />{" "}
                {t("topbar.loginActivity")}
              </button>

              <button className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors">
                <LogOut className="mr-2" size={18} /> {t("topbar.signOut")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
