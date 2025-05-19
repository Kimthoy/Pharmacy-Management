import { useState, useRef, useEffect, useContext } from "react";
import { useTranslation } from "../../src/hooks/useTranslation";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  MessageCircle,
  Bell,
  UserCircle,
  Settings,
  LogOut,
  Activity,
  Sun,
  Moon,
} from "lucide-react";
import { Link } from "react-router-dom";
import Tooltip from "../components/Tooltip";
import Modal from "../components/Modal"; // Import the new Modal component

const languageOptions = [
  {
    value: "en",
    label: "English",
    iconPath: "/icon_en.jpg",
  },
  {
    value: "km",
    label: "ខ្មែរ",
    iconPath: "/icon_kh.jpg",
  },
];

const SearchBar = ({ t, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="flex-1 max-w-xs">
      <input
        type="text"
        placeholder={t("topbar.search")}
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white"
        aria-label={t("topbar.search")}
      />
    </div>
  );
};

const IconButton = ({ Icon, tooltip, ariaLabel, onClick }) => (
  <Tooltip text={tooltip}>
    <button
      className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all hover:scale-110"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <Icon size={24} />
    </button>
  </Tooltip>
);

const LanguageSelector = ({
  langCode,
  onLanguageChange,
  open,
  setOpen,
  selectorRef,
  t,
}) => {
  const handleLanguageChange = (value) => {
    onLanguageChange(value);
    setOpen(false);
  };

  const currentLang = languageOptions.find((lang) => lang.value === langCode);

  return (
    <div className="relative inline-block" ref={selectorRef}>
      <button
        onClick={() => setOpen(!open)}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && setOpen(!open)
        }
        className="flex items-center bg-white dark:bg-gray-800 border border-emerald-500 dark:border-emerald-400 rounded-md px-3 py-1 shadow-sm hover:border-emerald-600 dark:hover:border-emerald-300 transition-all duration-200 w-32 justify-between"
        aria-expanded={open}
        aria-label={t("topbar.selectLanguage")}
      >
        <div className="flex items-center space-x-2">
          <img
            src={currentLang?.iconPath}
            alt={currentLang?.label}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {currentLang?.label}
          </span>
        </div>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            open ? "rotate-180" : ""
          } text-emerald-600 dark:text-emerald-400`}
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
        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg animate-fade-in">
          {languageOptions.map((lang) => (
            <li
              key={lang.value}
              onClick={() => handleLanguageChange(lang.value)}
              className={`flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer ${
                langCode === lang.value
                  ? "bg-emerald-100 dark:bg-gray-700 font-semibold"
                  : ""
              }`}
            >
              <img
                src={lang.iconPath}
                alt={lang.label}
                className="w-5 h-5 rounded-full mr-2 object-cover"
              />
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ProfileDropdown = ({
  user,
  isDropdownOpen,
  setIsDropdownOpen,
  dropdownRef,
  handleLogout,
  t,
}) => {
  const truncateName = (name) => {
    if (!name) return t("topbar.unknownUser");
    return name.length > 10 ? `${name.slice(0, 8)}...` : name;
  };

  const truncateRole = (role) => {
    if (!role) return "";
    return role.length > 6 ? `${role.slice(0, 4)}...` : role;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip text={t("topbar.profile")}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            setIsDropdownOpen(!isDropdownOpen)
          }
          className="flex items-center   text-black rounded-md px-3 py-1 cursor-pointer transition-all space-x-1"
          aria-expanded={isDropdownOpen}
          aria-label={t("topbar.profile")}
        >
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={t("topbar.profile")}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <UserCircle
              size={24}
              className="text-black hover:scale-125 dark:text-white dark:hover:scale-125 dark:hover:text-emerald-500 hover:text-emerald-500"
            />
          )}
        </button>
      </Tooltip>
      {isDropdownOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-gray-600 shadow-lg rounded-lg py-2 animate-fade-in">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {user?.name || t("topbar.unknownUser")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email || t("topbar.noEmail")}
            </p>
          </div>
          <Link to="/profile">
            <button
              className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsDropdownOpen(false)}
            >
              <UserCircle className="mr-2" size={18} />
              {t("topbar.viewProfile")}
            </button>
          </Link>
          <Link to="/settingspage">
            <button
              className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings className="mr-2" size={18} />
              {t("topbar.accountSetting")}
            </button>
          </Link>
          <Link to="/activity">
            <button
              className="w-full flex items-center px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Activity className="mr-2" size={18} />
              {t("topbar.loginActivity")}
            </button>
          </Link>
          <button
            className="w-full flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2" size={18} />
            {t("topbar.signOut")}
          </button>
        </div>
      )}
    </div>
  );
};

const AuthButtons = ({ t }) => (
  <div className="flex items-center space-x-3">
    <Link to="/login">
      <button
        className="px-4 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors"
        aria-label={t("topbar.login")}
      >
        {t("topbar.login")}
      </button>
    </Link>
    <Link to="/register">
      <button
        className="px-4 py-2 border border-emerald-500 dark:border-emerald-400 text-emerald-500 dark:text-emerald-400 rounded-md hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors"
        aria-label={t("topbar.register")}
      >
        {t("topbar.register")}
      </button>
    </Link>
  </div>
);

const TopBar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const dropdownRef = useRef(null);
  const selectorRef = useRef(null);

  useEffect(() => {
    console.log("Auth State:", { isAuthenticated, user });
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (term) => {
    console.log("Searching for:", term);
  };

  const handleLogout = () => {
    setIsModalOpen(true); // Open the modal instead of confirm
  };

  const confirmLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsModalOpen(false);
    window.location.href = "/login";
  };

  return (
    <div className="bg-white dark:bg-gray-900 z-10 p-4 flex flex-col sm:flex-row items-center justify-between relative shadow-sm dark:shadow-gray-800">
      <SearchBar t={t} onSearch={handleSearch} />
      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 mt-4 sm:mt-0">
        <IconButton
          Icon={MessageCircle}
          tooltip={t("topbar.messages")}
          ariaLabel={t("topbar.messages")}
          onClick={() => alert(t("topbar.messagesComingSoon"))}
        />
        <IconButton
          Icon={Bell}
          tooltip={t("topbar.notifications")}
          ariaLabel={t("topbar.notifications")}
          onClick={() => alert(t("topbar.notificationsComingSoon"))}
        />
        <IconButton
          Icon={theme === "light" ? Moon : Sun}
          tooltip={
            theme === "light" ? t("topbar.darkMode") : t("topbar.lightMode")
          }
          ariaLabel={
            theme === "light" ? t("topbar.darkMode") : t("topbar.lightMode")
          }
          onClick={toggleTheme}
        />
        <LanguageSelector
          langCode={language}
          onLanguageChange={changeLanguage}
          open={open}
          setOpen={setOpen}
          selectorRef={selectorRef}
          t={t}
        />
        {isAuthenticated ? (
          <ProfileDropdown
            user={user}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            dropdownRef={dropdownRef}
            handleLogout={handleLogout}
            t={t}
          />
        ) : (
          <AuthButtons t={t} />
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmLogout}
        message={t("topbar.logoutConfirm")}
      />
    </div>
  );
};

export default TopBar;
