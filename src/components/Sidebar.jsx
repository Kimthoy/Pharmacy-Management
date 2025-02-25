import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  BellIcon,
  FolderIcon,
  FlagIcon,
  ShoppingBagIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { CurrencyDollarIcon } from "@heroicons/react/20/solid";

const Sidebar = ({ setSelectedPage, selectedPage }) => {
  const navigate = useNavigate();

  // State to track the visibility of the sub-sidebar
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(false);

  // State to track the active menu item for sub-sidebar
  const [activeMenuItem, setActiveMenuItem] = useState({
    name: "Inventory",
    icon: ShoppingBagIcon,
    path: "/inventory",
    subItems: [
      { name: "Inventory", icon: ShoppingBagIcon, path: "/inventory" },
      {
        name: "Medicine Group",
        icon: FolderIcon,
        path: "/medicine-group",
      },
      {
        name: "List of Medicine",
        icon: ClipboardDocumentListIcon,
        path: "/list-of-medicine",
      },
    ],
  });

  // State to track the width of the sub-sidebar
  const [subSidebarWidth, setSubSidebarWidth] = useState(256); // Initial width in pixels

  // Main menu items with sub-items
  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/" },
    // Inventory menu
    {
      name: "Medicine",
      icon: ShoppingBagIcon,
      path: "/inventory",
      subItems: [
        { name: "Add Medicine", icon: ShoppingBagIcon, path: "/inventory" },
        {
          name: "Medicine Detail",
          icon: FolderIcon,
          path: "/medicine-group",
        },
        {
          name: "List Medicine",
          icon: ClipboardDocumentListIcon,
          path: "/list-of-medicine",
        },
      ],
    },
    {
      name: "Finance",
      icon: CurrencyDollarIcon,

      subItems: [
        {
          name: "MoneyMgt",
          icon: CurrencyDollarIcon,
          path: "/money-mgt",
        },
        { name: "Expense", icon: CurrencyDollarIcon, path: "/expense" },
        { name: "Daily Income", icon: BanknotesIcon, path: "/dailyincome" },
        {
          name: "Report Money",
          icon: CalendarDaysIcon,
          path: "/monthlyincome",
        },
      ],
    },
    { name: "Notifications", icon: BellIcon, path: "/notifications" },
    { name: "Report", icon: FlagIcon, path: "/report" },
    { name: "Setting", icon: Cog6ToothIcon, path: "/configuration" },
  ];

  // Handle page selection and navigation
  const handlePageSelection = (item, path) => {
    setSelectedPage(item);
    navigate(path);
  };

  const openSubSidebar = (menuItem) => {
    if (menuItem.subItems) {
      setActiveMenuItem(menuItem); // Set the active menu item
      setIsSubSidebarOpen(true); // Open the sub-sidebar
      setSelectedPage(menuItem.name); // Highlight the clicked item
    } else {
      setActiveMenuItem(null); // Clear active menu item if no sub-items
      setIsSubSidebarOpen(false); // Close the sub-sidebar
      handlePageSelection(menuItem.name, menuItem.path); // Navigate directly
    }
  };

  return (
    <div className="flex">
      {/* Main Sidebar */}
      <div className="w-16 bg-gray-100 text-black flex flex-col shadow-md justify-between h-screen relative">
        {/* Logo */}
        <img
          src="images/logo.png"
          alt="Logo"
          className="w-10 h-10 mx-auto mt-4 mb-5"
        />
        {/* Menu Items */}
        <ul className="space-y-2 flex-grow px-2">
          {menuItems.map(({ name, icon: Icon, path, subItems }) => (
            <li
              key={name}
              onClick={() =>
                openSubSidebar({ name, icon: Icon, path, subItems })
              }
              className={`relative p-2 rounded cursor-pointer flex items-center justify-center hover:bg-green-300  transition-all duration-300 ease-in-out ${
                selectedPage === name ? "bg-green-400 text-white" : ""
              } group`}
            >
              {/* Icon */}
              <Icon className="h-6 w-6" />

              {/* Tooltip */}
              <span className="absolute left-full ml-2 p-1 rounded bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fixed Sub-sidebar and Resize Handle */}
      <div className="flex ">
        {/* Fixed Sub-sidebar */}
        <div
          className={`bg-gray-200 text-black  flex flex-col shadow-md h-screen p-5 transition-all duration-300 ease-in-out overflow-hidden ${
            isSubSidebarOpen ? "block" : "hidden"
          }`}
          style={{ width: `${subSidebarWidth}px` }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`text-lg font-semibold ${
                subSidebarWidth < 100 ? "hidden" : "" // Hide header text if width is too small
              }`}
            >
              {activeMenuItem?.name}
            </h2>
            <button
              onClick={() => setIsSubSidebarOpen(false)}
              className="text-red-500 self-end"
              aria-label="Close Sub-Sidebar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Dynamically Render Sub-Items */}
          <ul className="mt-4 space-y-2 overflow-y-auto">
            {activeMenuItem?.subItems?.map(({ name, icon: Icon, path }) => (
              <li
                key={name}
                onClick={() => handlePageSelection(name, path)}
                className={`p-3 rounded cursor-pointer hover:bg-green-300 transition-all duration-300 ease-in-out flex items-center ${
                  selectedPage === name ? "bg-green-500 text-white" : ""
                }`}
              >
                {/* Icon */}
                <Icon className="h-5 w-5 mr-2" />
                {/* Name */}
                <span
                  className={`${
                    subSidebarWidth < 100 ? "hidden" : "" // Hide text if width is too small
                  }`}
                >
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resize Handle */}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  setSelectedPage: PropTypes.func.isRequired,
  selectedPage: PropTypes.string.isRequired,
};

export default Sidebar;
