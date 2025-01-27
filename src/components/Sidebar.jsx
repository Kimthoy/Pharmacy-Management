import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CurrencyRupeeIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  
  Bars3Icon,
  XMarkIcon,
  ClipboardIcon, // New Icon
  FolderIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ setSelectedPage, selectedPage }) => {
  const [isSvgChanged, setIsSvgChanged] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Dashboard");
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/" },
    { name: "Inventory", icon: ClipboardDocumentListIcon, path: "/inventory" },
    { name: "Configuration", icon: Cog6ToothIcon, path: "/configuration" },
    { name: "Daily Management", icon: CurrencyRupeeIcon, path: "/money-mgt" },
    { name: "Notifications", icon: BellIcon, path: "/notifications" },
  ];

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
    <div className="w-72 bg-gray-800 text-white flex flex-col p-4">
      <div className="flex items-center mb-6 relative">
        <img src="logo.png" alt="User" className="w-12 rounded-full mr-4" />
        <div>
          <p className="text-lg font-semibold">KHOY ROTHANAK</p>
          <p className="text-sm text-blue-300">PHANHARITH PHAMACY</p>
        </div>
        <button
          ref={buttonRef}
          className="ml-auto text-white hover:text-gray-300"
          onClick={() => {
            toggleSvg();
            toggleMenu();
          }}
        >
          {!isSvgChanged ? (
            <Bars3Icon className="h-5 w-5" />
          ) : (
            <XMarkIcon className="h-5 w-5" />
          )}
        </button>

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
                  <div>
                    <HomeIcon className="h-5 w-5 " />
                  </div>
                  <div className="font-bold">My Profile</div>
                </div>
              </li>
              <hr />
              <li
                onClick={() => handleMenuItemClick("Logout")}
                className={`p-2 hover:bg-gray-200 rounded cursor-pointer text-red-500  ${
                  selectedMenuItem === "Logout" ? "bg-white-100" : ""
                }`}
              >
                <div className="flex justify-around">
                  <div>
                    <PowerIcon className="h-5 w-5 " />
                  </div>
                  <div className="font-bold">Logout</div>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>

      <ul className="space-y-1">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <React.Fragment key={name}>
            <li
              onClick={() =>
                name === "Inventory"
                  ? handleInventoryToggle()
                  : handlePageSelection(name, path)
              }
              className={`p-2 rounded cursor-pointer flex items-center hover:bg-blue-500 ${
                selectedMenuItem === name ? "bg-blue-500 text-white" : ""
              }`}
            >
              <Icon className="h-5 w-5 inline mr-2" />
              {name}
              {name === "Inventory" && (
                <span className="ml-auto">
                  {isInventoryOpen ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </span>
              )}
            </li>

            {isInventoryOpen && name === "Inventory" && (
              <ul className="pl-6 space-y-1">
                <li
                  onClick={() =>
                    handlePageSelection("List of Medicine", "/list-of-medicine")
                  }
                  className={`p-2 rounded hover:bg-blue-500 cursor-pointer flex items-center ${
                    selectedPage === "List of Medicine"
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                >
                  <ClipboardIcon className="h-5 w-5 inline mr-2" />
                  List of Medicine
                </li>
                <li
                  onClick={() =>
                    handlePageSelection("Medicine Group", "/medicine-group")
                  }
                  className={`p-2 rounded hover:bg-blue-500 cursor-pointer flex items-center ${
                    selectedPage === "Medicine Group"
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                >
                  <FolderIcon className="h-5 w-5 inline mr-2" />
                  Medicine Group
                </li>
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>
      
    </div>
  );
};

Sidebar.propTypes = {
  setSelectedPage: PropTypes.func.isRequired,
  selectedPage: PropTypes.string.isRequired,
};

export default Sidebar;
