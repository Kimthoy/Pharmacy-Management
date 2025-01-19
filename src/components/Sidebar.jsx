import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CurrencyRupeeIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ setSelectedPage, selectedPage }) => {
  const [isSvgChanged, setIsSvgChanged] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Dashboard");
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Map menu items to icons for reusability
  const menuItems = [
    { name: "Dashboard", icon: HomeIcon },
    { name: "Inventory", icon: ClipboardDocumentListIcon },
    { name: "Configuration", icon: Cog6ToothIcon },
    { name: "MoneyMgt", icon: CurrencyRupeeIcon },
    { name: "Notifications", icon: BellIcon },
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

  const handlePageSelection = (item) => {
    setSelectedMenuItem(item);
    setSelectedPage(item);
  };

  const handleInventoryToggle = () => {
    setIsInventoryOpen((prev) => !prev);
    setSelectedMenuItem("Inventory");
    setSelectedPage("Inventory");
  };

  // Close dropdowns when clicking outside
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
    <div className="w-64 bg-blue-800 text-white flex flex-col p-4">
      {/* User Info Section */}
      <div className="flex items-center mb-6 relative">
        <img
          src="profile.png"
          alt="User"
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <p className="text-lg font-semibold">John Doe</p>
          <p className="text-sm text-blue-300">Pharma One</p>
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
            <ChevronDownIcon className="h-5 w-5" />
          ) : (
            <ChevronUpIcon className="h-5 w-5" />
          )}
        </button>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-10 w-48 bg-white rounded shadow-lg"
          >
            <ul>
              <li
                onClick={() => handleMenuItemClick("Profile")}
                className={`p-2 hover:bg-gray-100 cursor-pointer text-blue-700 text-center ${
                  selectedMenuItem === "Profile" ? "bg-gray-100" : ""
                }`}
              >
                My Profile
              </li>
              <li
                onClick={() => handleMenuItemClick("Logout")}
                className={`p-2 hover:bg-gray-100 cursor-pointer text-red-700 text-center ${
                  selectedMenuItem === "Logout" ? "bg-gray-100" : ""
                }`}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <ul className="space-y-1">
        {menuItems.map(({ name, icon: Icon }) => (
          <li
            key={name}
            onClick={() =>
              name === "Inventory"
                ? handleInventoryToggle()
                : handlePageSelection(name)
            }
            className={`p-2 rounded cursor-pointer flex items-center hover:bg-blue-700 ${
              selectedMenuItem === name ? "bg-blue-700 text-white" : ""
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
        ))}

        {isInventoryOpen && selectedMenuItem === "Inventory" && (
          <>
            <li
              onClick={() => handlePageSelection("List of Medicine")}
              className={`p-2 pl-8 hover:bg-blue-700 cursor-pointer ${
                selectedPage === "List of Medicine" ? "bg-blue-700" : ""
              }`}
            >
              List of Medicine
            </li>
            <li
              onClick={() => handlePageSelection("Medicine Group")}
              className={`p-2 pl-8 hover:bg-blue-700 cursor-pointer ${
                selectedPage === "Medicine Group" ? "bg-blue-700" : ""
              }`}
            >
              Medicine Group
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  setSelectedPage: PropTypes.func.isRequired,
  selectedPage: PropTypes.string.isRequired,
};

export default Sidebar;
