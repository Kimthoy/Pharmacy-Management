import { useState } from "react";
import { FaSun, FaMoon, FaSignOutAlt } from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; // Use useAuth
import { useNavigate } from "react-router-dom";

const TopBar = ({ onLanguageChange }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
        {t("app.title")}
      </div>
      <div className="flex items-center space-x-4">
        <select
          onChange={(e) => onLanguageChange(e.target.value)}
          className="text-sm border border-gray-400 dark:border-gray-600 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="en">{t("language.english")}</option>
          <option value="kh">{t("language.khmer")}</option>
        </select>
        <button
          onClick={toggleTheme}
          className="text-emerald-500 dark:text-emerald-400"
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-200"
          >
            <span>{user?.name || t("user.guest")}</span>
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="User avatar"
              className="w-8 h-8 rounded-full"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <FaSignOutAlt />
                <span>{t("user.logout")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
