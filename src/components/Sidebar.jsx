import React, { useState } from "react";
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
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ setSelectedPage, selectedPage }) => {
  const navigate = useNavigate();

  // State to track the visibility of the sub-sidebar
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/" },
    { name: "Inventory", icon: ShoppingBagIcon, path: "/inventory" },
    {
      name: "Stock",
      icon: ClipboardDocumentListIcon,
      path: "/list-of-medicine",
    },
    { name: "Medicine Group", icon: FolderIcon, path: "/medicine-group" },
    { name: "Expense", icon: CurrencyDollarIcon, path: "/money-mgt" },
    { name: "Daily Income", icon: BanknotesIcon, path: "/dailyincome" },
    { name: "Monthly Income", icon: CalendarDaysIcon, path: "/monthlyincome" },
    { name: "Notifications", icon: BellIcon, path: "/notifications" },
    { name: "Report", icon: FlagIcon, path: "/report" },
    { name: "Setting", icon: Cog6ToothIcon, path: "/configuration" },
  ];

  const handlePageSelection = (item, path) => {
    setSelectedPage(item);
    navigate(path);
  };

  const toggleSubSidebar = () => {
    setIsSubSidebarOpen(!isSubSidebarOpen); // Toggle the sub-sidebar visibility
  };

  return (
    <div className="flex">
      {/* Main Sidebar */}
      <div className="w-16 bg-gray-100 text-black flex flex-col shadow-md justify-between h-screen relative">
        <img src="images/logo.png" className="mb-5" alt="Logo" />
        <hr />
        <ul className="space-y-2">
          {menuItems.map(({ name, icon: Icon, path }) => (
            <li
              key={name}
              onClick={() => handlePageSelection(name, path)}
              className={`relative p-2 rounded cursor-pointer flex items-center justify-center hover:bg-gray-300 group transition-all duration-300 ease-in-out transform ${
                selectedPage === name ? "bg-blue-200 text-blue-600" : ""
              }`}
            >
              <Icon className="h-6 w-6" />
            </li>
          ))}

          {/* Button to toggle sub-sidebar */}
          <div className="absolute top-32 left-11 w-10 h-10 rounded-full shadow-md bg-gray-200">
            <button
              onClick={toggleSubSidebar}
              className="relative p-2 cursor-pointer flex items-center justify-center transform"
            >
              {isSubSidebarOpen ? (
                <ChevronDoubleLeftIcon className="h-6 w-6" />
              ) : (
                <ChevronDoubleRightIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </ul>
      </div>

      {/* Sub-sidebar (Pop-up) */}
      {isSubSidebarOpen && (
        <div
          className="w-40 bg-gray-200 text-black flex flex-col shadow-md justify-between h-screen p-4 left-0 top-0 transition-all duration-300 ease-in-out"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sub-sidebar
        >
          <button className="text-red-500 " onClick={toggleSubSidebar}>
            <XMarkIcon className="w-5 h-5 ml-52" />
          </button>
          <ul className=" mb-96">
            {/* Sub-sidebar items with labels only (no icons) */}
            <li
              onClick={() => handlePageSelection("Sub-Stock", "/sub-stock")}
              className="p-3  rounded cursor-pointer hover:bg-gray-300 transition-all duration-300 ease-in-out"
            >
              Sub-Stock
            </li>
            <li
              onClick={() =>
                handlePageSelection("Sub-Medicine", "/sub-medicine")
              }
              className="p-3  rounded cursor-pointer hover:bg-gray-300 transition-all duration-300 ease-in-out"
            >
              Sub-Medicine
            </li>
            <li
              onClick={() => handlePageSelection("Sub-Expense", "/sub-expense")}
              className="p-3  rounded cursor-pointer hover:bg-gray-300 transition-all duration-300 ease-in-out"
            >
              Sub-Expense
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  setSelectedPage: PropTypes.func.isRequired,
  selectedPage: PropTypes.string.isRequired,
};

export default Sidebar;
