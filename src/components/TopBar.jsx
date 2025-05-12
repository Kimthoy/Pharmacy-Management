import React, { useState, useRef, useEffect } from "react";
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
  const { t, changeLanguage } = useTranslation();
  const [langCode, setLangCode] = useState("en");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  const selectorRef = useRef();

  // Close dropdowns if clicked outside
  const handleClickOutside = (event, ref, setter) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setter(false);
    }
  };

  useEffect(() => {
    const onClickOutside = (event) => {
      handleClickOutside(event, dropdownRef, setIsDropdownOpen);
      handleClickOutside(event, selectorRef, setOpen);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
    setLangCode(e.target.value);
    setOpen(false);
  };

  return (
    <div className="bg-white z-10 p-4 flex items-center justify-between relative shadow-sm">
      {/* Search Bar */}
      <div className="flex-1 max-w-xs">
        <input
          type="text"
          placeholder={t("topbar.search")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Right Section - Icons + Language Selector + Profile Dropdown */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Message Icon */}
        <Tooltip text={t("topbar.messages")}>
          <button className="text-gray-600 hover:text-green-600 transition-all hover:scale-110">
            <MessageCircle size={24} />
          </button>
        </Tooltip>

        {/* Notification Bell Icon */}
        <Tooltip text={t("topbar.notifications")}>
          <button className="text-gray-600 hover:text-green-600 transition-all hover:scale-110">
            <Bell size={24} />
          </button>
        </Tooltip>

        {/* Language Selector */}
        <div className="relative inline-block" ref={selectorRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center bg-white border border-green-500 rounded-md px-3 py-1 shadow-sm hover:border-green-600 transition-all duration-200 w-36 justify-between"
          >
            <div className="flex items-center space-x-2">
              <img
                src={
                  languageOptions.find((lang) => lang.value === langCode)?.flag
                }
                alt={langCode}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-800">
                {languageOptions.find((lang) => lang.value === langCode)?.label}
              </span>
            </div>
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${
                open ? "rotate-180" : ""
              } text-green-600`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {open && (
            <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg animate-fade-in">
              {languageOptions.map((lang) => (
                <li
                  key={lang.value}
                  onClick={() =>
                    handleLanguageChange({ target: { value: lang.value } })
                  }
                  className={`flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 cursor-pointer ${
                    langCode === lang.value ? "bg-green-100 font-semibold" : ""
                  }`}
                >
                  <img
                    src={lang.flag}
                    alt={lang.label}
                    className="w-5 h-5 rounded-full mr-2 object-cover"
                  />
                  {lang.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Tooltip text={t("topbar.profile")}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-green-500 text-white hover:scale-105 p-1.5 rounded-full cursor-pointer flex items-center justify-center hover:bg-green-600"
            >
              <User size={26} />
            </button>
          </Tooltip>
          {isDropdownOpen && (
            <div className="absolute z-50 right-0 mt-2 w-56 bg-white border border-green-200 shadow-lg rounded-lg py-2 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="font-semibold">Abu Bin Ishtiyak</p>
                <p className="text-xs text-gray-500">info@softnio.com</p>
              </div>

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
    </div>
  );
};

export default TopBar;
