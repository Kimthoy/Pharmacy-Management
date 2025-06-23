import { useState, useRef, useEffect, useContext } from "react";
import { useTranslation } from "../../src/hooks/useTranslation";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import MessageModal from "../components/MessageModal";
import { FiMenu } from "react-icons/fi";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { useNavigate } from "react-router-dom";
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
import Modal from "../components/Modal"; // Assuming this is your existing Modal component
import NotificationModal from "../components/NotificationModal"; // New component for notifications

const languageOptions = [
  { value: "en", label: "English", iconPath: "/icon_en.jpg" },
  { value: "km", label: "ខ្មែរ", iconPath: "/icon_kh.jpg" },
];

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
        className="flex items-center bg-white dark:bg-gray-800 border border-emerald-500 dark:border-emerald-400  px-3 py-1 shadow-sm hover:border-emerald-600 dark:hover:border-emerald-300 transition-all rounded-lg duration-200 w-32 justify-between"
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
          className="w-6 h-6 ml-4 transition-transform text-emerald-600 dark:text-emerald-400"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
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
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") &&
          setIsDropdownOpen(!isDropdownOpen)
        }
        className="flex items-center text-black rounded-md px-3 py-1 cursor-pointer transition-all space-x-1"
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

const TopBar = ({ onSearch }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // For logout confirmation
  const [isMessageDropdownOpen, setIsMessageDropdownOpen] = useState(false); // For message dropdown
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false); // For notification dropdown
  const dropdownRef = useRef(null);
  const selectorRef = useRef(null);
  const messageDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setIsMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log("Auth State:", { isAuthenticated, user });
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (
        messageDropdownRef.current &&
        !messageDropdownRef.current.contains(event.target)
      ) {
        setIsMessageDropdownOpen(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setIsNotificationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  // const handleSearch = (term) => {
  //   console.log("Searching for:", term);
  // };

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsModalOpen(false);
    window.location.href = "/login";
  };

  // Mock data for recent chats
  const recentChats = [
    {
      id: 1,
      name: "Iliash Hossain",
      message: "You: Please confirm if you got my la...",
      time: "Now",
      status: "online",
      avatar: "/path/to/avatar1.jpg",
    },
    {
      id: 2,
      name: "Abu Bin Ishtiyak",
      message: "Hi, I am Ishtiyak, can you help me wi...",
      time: "4:49 AM",
      status: "online",
      avatar: "/path/to/avatar2.jpg",
    },
    {
      id: 3,
      name: "George Philips",
      message: "Have you seen the claim from Rose?",
      time: "6 Apr",
      status: "offline",
      avatar: "/path/to/avatar3.jpg",
    },
    {
      id: 4,
      name: "Softnio Group",
      message: "You: I just bought a new computer b...",
      time: "27 Mar",
      status: "offline",
      avatar: "/path/to/avatar4.jpg",
    },
  ];

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      title: "New Message",
      message: "Iliash Hossain sent you a message.",
      time: "Now",
      status: "unread",
      icon: "message",
    },
    {
      id: 2,
      title: "System Update",
      message: "Server maintenance scheduled at 10 PM.",
      time: "2:30 PM",
      status: "read",
      icon: "bell",
    },
    {
      id: 3,
      title: "Alert",
      message: "Low stock for Paracetamol.",
      time: "9:15 AM",
      status: "unread",
      icon: "alert",
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileDropdownRef = useRef(null);
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  const navigate = useNavigate();
  const [showTopBar, setShowTopBar] = useState(true);

  const openProfileDashboard = () => {
    navigate("/profiledashboard");
  };
  return (
    <div className="bg-white dark:bg-gray-900 z-10 p-4 flex flex-col sm:flex-row items-center justify-between shadow-sm dark:shadow-gray-800 ">
      <button
        className="sm:hidden mr-2 absolute right-0 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition dark:text-white "
        onClick={openProfileDashboard}
      >
        <MdOutlineSettingsSuggest size={24} />
      </button>

      {isMobileDropdownOpen && (
        <div
          className="sm:hidden absolute right-0 mr-4 mt-16 w-48 animate-slide-in-left  bg-green-600 text-white dark:bg-gray-800 rounded-md shadow-lg z-50"
          onClick={() => setIsMobileDropdownOpen(false)}
          ref={mobileDropdownRef}
        >
          <ul className="text-white dark:text-gray-200  bg-green-700 rounded-lg">
            <li
              onClick={() => setIsMobileSearchOpen(true)}
              className="px-4 py-2 hover:bg-green-500 transition-all rounded-lg cursor-pointer"
            >
              Search
            </li>
            <Link to="/message">
              <li className="px-4 py-2 hover:bg-green-500 transition-all rounded-lg cursor-pointer">
                Messages
              </li>
            </Link>
            <Link to="/notification">
              <li className="px-4 py-2 hover:bg-green-500 transition-all rounded-lg cursor-pointer">
                Notifications
              </li>
            </Link>
            <li className="px-4 py-2 hover:bg-green-500 transition-all rounded-lg cursor-pointer">
              Logout
            </li>
            <li className="px-4 py-2 hover:bg-green-500 transition-all rounded-lg cursor-pointer">
              <button
                onClick={toggleTheme}
                title={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
              >
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
            </li>
          </ul>
        </div>
      )}

      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-600 p-4 rounded-lg w-11/12 max-w-md shadow-lg animate-slide-in-left">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Search
              </h2>
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="text-gray-600 hover:text-red-500 dark:text-gray-300"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              placeholder={t("topbar.search")}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              aria-label={t("topbar.search")}
            />
          </div>
        </div>
      )}

      {/* Left Section: Logo & Title */}
      <div className="flex items-center justify-center w-full ">
        <img
          src="/logo.png"
          alt="Logo"
          width={70}
          className="rounded sm:w-20 w-14"
        />
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 animate-color-cycle">
          {t("navigation.title", { username: "Panharith" })}
        </h1>
      </div>

      {/* Center: Search + Show All */}
      <div className="sm:flex hidden flex-col sm:flex-row items-center justify-center gap-3 w-64 max-w-xl mr-12">
        <input
          type="text"
          placeholder={t("topbar.search")}
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          aria-label={t("topbar.search")}
        />
      </div>

      {/* Right: Icons + Actions */}
      <div className="flex items-center space-x-3 mt-4 sm:mt-0">
        {/* Message Button */}
        <div className="relative" ref={messageDropdownRef}>
          <button
            onClick={() => setIsMessageDropdownOpen(!isMessageDropdownOpen)}
            className="p-2 rounded-full hover:scale-125 hover:bg-gray-200 dark:hover:bg-gray-700 transition dark:text-white"
            aria-label={t("topbar.messages")}
          >
            <MessageCircle
              size={24}
              className="animate-bounce-hover sm:flex hidden"
            />
          </button>
          {isMessageDropdownOpen && (
            <MessageModal
              isOpen={isMessageDropdownOpen}
              onClose={() => setIsMessageDropdownOpen(false)}
              recentChats={recentChats}
              t={t}
            />
          )}
        </div>

        {/* Notification Button */}
        <div className="relative" ref={notificationDropdownRef}>
          <button
            onClick={() =>
              setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
            }
            className="p-2 rounded-full hover:scale-125 hover:bg-gray-200 dark:hover:bg-gray-700 transition dark:text-white"
            aria-label={t("topbar.notifications")}
          >
            <Bell size={24} className="sm:flex hidden" />
          </button>
          {isNotificationDropdownOpen && (
            <NotificationModal
              isOpen={isNotificationDropdownOpen}
              onClose={() => setIsNotificationDropdownOpen(false)}
              notifications={notifications}
              t={t}
            />
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          className="p-2 sm:flex hidden hover:scale-125 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition dark:text-white"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Language Selector */}
        <div className=" sm:flex hidden">
          <LanguageSelector
            langCode={language}
            onLanguageChange={changeLanguage}
            open={open}
            setOpen={setOpen}
            selectorRef={selectorRef}
            t={t}
          />
        </div>

        {/* User Authentication */}
        <div className="hidden sm:flex">
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
      </div>

      {/* Logout Confirmation Modal */}
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
