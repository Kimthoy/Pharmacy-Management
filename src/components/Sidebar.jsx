import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  // CurrencyRupeeIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  FolderIcon,
  PowerIcon,
  FlagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { CurrencyDollarIcon } from "@heroicons/react/20/solid";

const Sidebar = ({ setSelectedPage, selectedPage }) => {
  const [isSvgChanged, setIsSvgChanged] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Dashboard");
  const [setIsInventoryOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const menuItems = React.useMemo(
    () => [
      { name: "Dashboard", icon: HomeIcon, path: "/" },
      { name: "Inventory", icon: ShoppingBagIcon, path: "/inventory" },
      {
        name: "List of Medicine",
        icon: ClipboardDocumentListIcon,
        path: "/list-of-medicine",
      },
      {
        name: "Medicine Group",
        icon: FolderIcon,
        path: "/medicine-group",
      },

      {
        name: "Expense",
        icon: CurrencyDollarIcon,
        path: "/money-mgt",
      },
      { name: "Notifications", icon: BellIcon, path: "/notifications" },
      { name: "Report", icon: FlagIcon, path: "/report" },
      { name: "Setting", icon: Cog6ToothIcon, path: "/configuration" },
    ],
    []
  );

  const toggleSvg = () => setIsSvgChanged((prev) => !prev);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item);
    setIsMenuOpen(false);
    if (item === "Profile" || item === "Logout") {
      setIsSvgChanged(false);
    }
  };

  const handlePageSelection = (item, path) => {
    setSelectedMenuItem(item);
    setSelectedPage(item);
    navigate(path);
  };

  const handleInventoryToggle = () => {
    setIsInventoryOpen((prev) => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarMinimized((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setIsSvgChanged(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex">
      <div
        className={`${
          isSidebarMinimized ? "w-15" : "w-62"
        } bg-gray-800 text-white flex flex-col justify-between h-screen p-1 transition-all duration-300 relative `}
      >
        <div>
          {/* Top Section with User Profile */}
          <div className="flex items-center mb-6 relative">
            <img src="logo.png" alt="User" className="w-12 rounded-full mr-4" />
            {!isSidebarMinimized && (
              <>
                <div>
                  <h3 id="admin_name" className="font-thin  font-serif">
                    KHOY ROTHANAK
                  </h3>
                  <p
                    id="name_phamacy"
                    className="font-serif font-thin text-blue-300"
                  >
                    PHANHARITH PHAMACY
                  </p>
                </div>
              </>
            )}
            {!isSidebarMinimized && (
              <>
                <button
                  ref={buttonRef}
                  className="ml-auto text-white hover:text-gray-300"
                  onClick={() => {
                    toggleSvg();
                    toggleMenu();
                  }}
                >
                  {!isSvgChanged ? (
                    <Bars3Icon className="h-6 w-6" />
                  ) : (
                    <XMarkIcon className="h-6 w-6" />
                  )}
                </button>
              </>
            )}
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 top-12 w-36 bg-white rounded shadow-lg"
              >
                <ul>
                  <li
                    onClick={() => handleMenuItemClick("Profile")}
                    className={`p-2 hover:bg-gray-200 rounded cursor-pointer text-blue-500 ${
                      selectedMenuItem === "Profile" ? "bg-white-100" : ""
                    }`}
                  >
                    <div className="flex justify-around">
                      <HomeIcon className="h-6 w-6" />
                      <span>My Profile</span>
                    </div>
                  </li>
                  <hr />
                  <li
                    onClick={() => handleMenuItemClick("Logout")}
                    className={`p-2 hover:bg-gray-200 rounded cursor-pointer text-red-500 ${
                      selectedMenuItem === "Logout" ? "bg-white-100" : ""
                    }`}
                  >
                    <div className="flex justify-around">
                      <PowerIcon className="h-6 w-6" />
                      <span>Logout</span>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <ul className="space-y-1">
            {menuItems.map(({ name, icon: Icon, path }) => (
              <React.Fragment key={name}>
                <li
                  onClick={() =>
                    name === ""
                      ? handleInventoryToggle()
                      : handlePageSelection(name, path)
                  }
                  className={`p-2 rounded cursor-pointer flex items-center hover:bg-blue-500 ${
                    selectedMenuItem === name ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  <Icon className="h-6 w-6 inline mr-2" />
                  {!isSidebarMinimized && name}
                  {name === "" && !isSidebarMinimized}
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>
        <div className="mt-auto">
          <button
            onClick={toggleSidebar}
            className="bg-gray-700 text-white w-10 p-2 rounded flex items-center justify-end hover:bg-gray-600"
          >
            {isSidebarMinimized ? (
              <ChevronRightIcon className="h-6 w-6" />
            ) : (
              <ChevronLeftIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  setSelectedPage: PropTypes.func.isRequired,
  selectedPage: PropTypes.string.isRequired,
};

export default Sidebar;
