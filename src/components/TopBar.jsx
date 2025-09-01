import { useState, useRef, useEffect, useContext } from "react";
import { useTranslation } from "../../src/hooks/useTranslation";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import MessageModal from "../components/MessageModal";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import { getExpiringSoonItems } from "../pages/api/supplyItemService";

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
import Modal from "../components/Modal";
import NotificationModal from "../components/NotificationModal";

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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const dateString = currentTime.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative inline-block" ref={selectorRef}>
      <button
        onClick={() => setOpen(!open)}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && setOpen(!open)
        }
        className="flex items-center bg-white dark:bg-gray-800 border border-emerald-500 dark:border-emerald-400 px-3 py-1 shadow-sm hover:border-emerald-600 dark:hover:border-emerald-300 transition-all rounded-lg duration-200 w-32 justify-between"
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
        className="flex hover:bg-slate-100 mr-6 dark:hover:bg-gray-700 hover:rounded-lg items-center text-black rounded-md p-3 cursor-pointer hover:shadow-lg space-x-1"
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
          <UserCircle size={24} className="text-green-700 dark:text-white" />
        )}
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 z-[999] mt-2 w-56 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-gray-600 shadow-lg rounded-lg py-2 animate-fade-in">
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
  <div className="flex items-center mr-6 space-x-3">
    <Link to="/login">
      <button
        className="px-4 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors"
        aria-label={t("topbar.login")}
      >
        {t("topbar.login")}
      </button>
    </Link>
  </div>
);

const TopBar = ({ onSearch = () => {} }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme(false);
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageDropdownOpen, setIsMessageDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);

  const dropdownRef = useRef(null);
  const selectorRef = useRef(null);
  const messageDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

 
  const notifications = [];

  // 2) Expiring soon (fetch + badge)
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);

  useEffect(() => {
    let alive = true;
    const loadExpiringSoon = async () => {
      try {
        const items = await getExpiringSoonItems({ months: 2, perPage: 0 });
        if (!alive) return;
        const list = Array.isArray(items) ? items : [];
        setExpiringSoon(list);
        setExpiringSoonCount(list.length);
      } catch (e) {
        console.error(e);
      }
    };
    loadExpiringSoon();
    const id = setInterval(loadExpiringSoon, 10 * 60 * 1000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const expiringAsNotifications = (expiringSoon || [])
    .slice(0, 10)
    .map((it, idx) => ({
      id: `exp-${it?.id ?? idx}`,
      title: "Expiring Soon",
      message: `${
        it?.medicine?.medicine_name || it?.medicine?.name || "Unknown"
      } ${t("topbar.expiresOn") || "expires on"} ${
        it?.expire_date
          ? new Date(it.expire_date).toLocaleDateString()
          : "No date"
      }`,
      time: "now",
      status: "unread",
      icon: "alert",
      type: "warning",
      href: "/expire-soon",
      state: { highlightId: it?.id },
    }));

  const combinedNotifications = [...expiringAsNotifications, ...notifications];
  const totalUnread =
    expiringSoonCount +
    notifications.filter((n) => n.status === "unread").length;

  const handleNotificationClick = (item) => {
    const target =
      item?.href || (item?.type === "warning" ? "/expire-soon" : null);
    if (target) navigate(target, { state: item?.state || {} });
    setIsNotificationDropdownOpen(false);
  };

  useEffect(() => {
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
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setIsMobileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => setIsModalOpen(true);
  const confirmLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsModalOpen(false);
    window.location.href = "/login";
  };

  const recentChats = [
    {
      id: 1,
      name: "Iliash Hossain",
      message: "You: Please confirm if you got my la...",
      time: "Now",
      status: "online",
      avatar: "/path/to/avatar1.jpg",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const dateString = currentTime.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const openProfileDashboard = () => navigate("/profiledashboard");

  return (
    <div className="bg-white dark:bg-gray-900 z-50 sm:h-20 h-16 flex flex-col sm:flex-row items-center justify-between sm:shadow-sm shadow-lg dark:shadow-gray-800">
      <button
        className="sm:hidden mr-6 bg-gray-200 absolute right-0 mt-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition dark:text-white dark:bg-slate-700"
        onClick={openProfileDashboard}
      >
        <MdOutlineSettingsSuggest size={24} className="text-green-600" />
      </button>

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

      <div className="sm:flex flex justify-center items-center w-full sm:mt-1 mt-1">
        <img src="/logo.png" alt="Logo" className="rounded sm:w-16 w-12 ml-6" />
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 animate-color-cycle">
          {t("navigation.title", { username: "Panharith" })}
        </h1>

        <div className="ml-5 sm:flex hidden">
          <input
            type="text"
            placeholder={t("topbar.search")}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            aria-label={t("topbar.search")}
          />
        </div>
      </div>

      <div className="w-40 mr-5 text-right text-sm font-medium text-gray-700 dark:text-gray-200 leading-tight hidden sm:block">
        <div>{timeString}</div>
        <div className="text-xs">{dateString}</div>
      </div>

      <div className="flex items-center space-x-3 mt-4 sm:mt-0">
        <div className="relative" ref={messageDropdownRef}>
          <button
            onClick={() => setIsMessageDropdownOpen(!isMessageDropdownOpen)}
            className="p-3 hover:shadow-lg rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition dark:text-white text-green-600"
            aria-label={t("topbar.messages")}
          >
            <MessageCircle
              size={24}
              className="animate-bounce-hover sm:flex hidden"
            />
          </button>
          <div className="z-30">
            {isMessageDropdownOpen && (
              <MessageModal
                isOpen={isMessageDropdownOpen}
                onClose={() => setIsMessageDropdownOpen(false)}
                recentChats={recentChats}
                t={t}
              />
            )}
          </div>
        </div>

        <div className="relative" ref={notificationDropdownRef}>
          <button
            onClick={() =>
              setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
            }
            className="relative p-3 hidden sm:flex hover:shadow-lg rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition dark:text-white text-green-600"
            aria-label={
              totalUnread > 0
                ? `${t("topbar.notifications")} – ${totalUnread} ${
                    t("topbar.new") || "new"
                  }`
                : t("topbar.notifications")
            }
            aria-live="polite"
          >
            <Bell size={24} className="sm:flex hidden" />
            {totalUnread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] leading-[18px] flex items-center justify-center shadow-lg">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </button>

          <div className="z-30">
            {isNotificationDropdownOpen && (
              <NotificationModal
                isOpen={isNotificationDropdownOpen}
                onClose={() => setIsNotificationDropdownOpen(false)}
                notifications={combinedNotifications}
                onItemClick={handleNotificationClick} // << navigate on click
                t={t}
              />
            )}
          </div>
        </div>

        <button
          onClick={toggleTheme}
          title={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
          className="p-3 sm:flex hidden rounded-lg hover:bg-gray-100 hover:shadow-lg dark:hover:bg-gray-700 transition dark:text-white"
        >
          {theme === "light" ? (
            <Moon size={25} className="text-green-600" />
          ) : (
            <Sun size={25} className="text-white" />
          )}
        </button>

        <div className="sm:flex hidden shadow-lg rounded-lg">
          <LanguageSelector
            langCode={language}
            onLanguageChange={changeLanguage}
            open={open}
            setOpen={setOpen}
            selectorRef={selectorRef}
            t={t}
          />
        </div>

        <div className="hidden sm:flex">
          {isAuthenticated ? (
            <ProfileDropdown
              user={user}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              dropdownRef={dropdownRef}
              handleLogout={() => setIsModalOpen(true)}
              t={t}
            />
          ) : (
            <AuthButtons t={t} />
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          logout();
          setIsDropdownOpen(false);
          setIsModalOpen(false);
          window.location.href = "/login";
        }}
        message={t("topbar.logoutConfirm")}
      />
    </div>
  );
};

export default TopBar;
