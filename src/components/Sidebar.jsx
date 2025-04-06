import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { BiCapsule } from "react-icons/bi";
import { CiRepeat } from "react-icons/ci";

import {
  XMarkIcon,
  UserGroupIcon,
  UserPlusIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { CiSettings } from "react-icons/ci";
import { RiPagesLine } from "react-icons/ri";

import { MdOutlineMonitorHeart } from "react-icons/md";
import { LiaWarehouseSolid } from "react-icons/lia";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";

import { TfiDashboard } from "react-icons/tfi";

const Sidebar = ({ setSelectedPage, selectedPage }) => {
  const navigate = useNavigate();
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(false);

  const [subSidebarWidth] = useState(256);

  const menuItems = [
    { name: "Dashboard", icon: TfiDashboard, path: "/" },

    {
      name: "Medicine",
      icon: BiCapsule,
      path: "/madicinepage",
      subItems: [
        {
          name: "Add Medicine",

          path: "/addmedicinepage",
        },
        {
          name: "Medicine List",

          path: "/listofmedicine",
        },
        {
          name: "Medicine Detail",

          path: "/medicinedetail",
        },
      ],
    },

    {
      name: "Customers",
      icon: UserGroupIcon,
      path: "/customers",
      subItems: [
        { name: "New Customer", icon: UserPlusIcon, path: "/insertcustomer" },
        { name: "Customer List", icon: ListBulletIcon, path: "/customerlist" },
        {
          name: "Customer Ledger",

          path: "/customerledger",
        },
      ],
    },

    {
      name: "Manufacturer",
      icon: LiaWarehouseSolid,
      path: "/menufacturer",
      subItems: [
        {
          name: "Manufacturer List",

          path: "/manufacturerlist",
        },
        {
          name: "Manufacturer Ledger",

          path: "/manuledger",
        },
      ],
    },
    {
      name: "Return",
      icon: CiRepeat,
      path: "/menufacturer",
      subItems: [
        {
          name: "Add Wastage Return",

          path: "/addwastagereturn",
        },
        {
          name: "Add Manufacturer Return",

          path: "/addmanufacturerreturn",
        },
        {
          name: "Manufacturer Return List",

          path: "/manufacturerreturnlist",
        },
        {
          name: "Wastage Return List",

          path: "/wastagereturnlist",
        },
      ],
    },

    {
      name: "Finance",
      icon: HiOutlineCurrencyDollar,
      path: "/financepage",
      subItems: [
        {
          name: "Expenase",
          path: "/expensepage",
        },

        {
          name: "Income",
          path: "/incomepage",
        },
        {
          name: "Invoice Detail",
          path: "/invoicedetail",
        },
        {
          name: "Invoice List",
          path: "/invoicelist",
        },
      ],
    },
    {
      name: "Report",
      icon: MdOutlineMonitorHeart,
      path: "/reportall",
      subItems: [
        {
          name: "SaleReport",

          path: "/salereport",
        },

        {
          name: "StockReport",

          path: "/stockreport",
        },
        {
          name: "PurchaseReport",

          path: "/purchasreport",
        },
      ],
    },
    {
      name: "Pages",
      icon: RiPagesLine,
      path: "/login",
      subItems: [
        {
          name: "Login",

          path: "/login",
        },
        {
          name: "Sign In",

          path: "/register",
        },
      ],
    },
    {
      name: "Settings",
      icon: CiSettings,
      path: "/settingpage",
    },
  ];
  const handlePageSelection = (item, path) => {
    setSelectedPage(item);
    navigate(path);
  };

  const openSubSidebar = (menuItem) => {
    if (menuItem.subItems) {
      setActiveMenuItem(menuItem);
      setIsSubSidebarOpen(true);
      setSelectedPage(menuItem.name);
    } else {
      setActiveMenuItem(null);
      setIsSubSidebarOpen(false);
      handlePageSelection(menuItem.name, menuItem.path);
    }
  };

  return (
    <div className="flex">
      <div className="w-16 bg-gray-100 text-black flex flex-col  justify-between h-screen relative">
        <img
          src="images/logo.png"
          alt="Logo"
          className="w-10 h-10 mx-auto mt-4 mb-5"
        />

        <ul className="space-y-2 flex-grow px-2">
          {menuItems.map(({ name, icon: Icon, path, subItems }) => (
            <li
              key={name}
              onClick={() =>
                openSubSidebar({ name, icon: Icon, path, subItems })
              }
              className={`relative p-2 rounded cursor-pointer flex items-center justify-center hover:bg-green-400 hover:text-white  transition-all duration-300 ease-in-out ${
                selectedPage === name ? "bg-green-400 text-white" : ""
              } group`}
            >
              <Icon className="h-6 w-6" />
              {/* name hover */}
              <span className="absolute left-full ml-2 p-2 rounded bg-gray-600 font-bold  text-white text-sm z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex ">
        <div
          className={`bg-gray-100 text-black   flex flex-col shadow-md h-screen p-5 transition-all duration-100 ease-in-out overflow-hidden ${
            isSubSidebarOpen ? "block" : "hidden"
          }`}
          style={{ width: `${subSidebarWidth}px` }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`text-lg font-semibold ${
                subSidebarWidth < 100 ? "hidden" : ""
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
          <ul className="mt-4 space-y-2 overflow-y-auto">
            {activeMenuItem?.subItems?.map(({ name, path }) => (
              <li
                key={name}
                onClick={() => handlePageSelection(name, path)}
                className={`p-3 rounded cursor-pointer hover:bg-green-400 hover:text-white transition-all duration-100 ease-in-out flex items-center ${
                  selectedPage === name ? "bg-green-500 text-white" : ""
                }`}
              >
                <span className={`${subSidebarWidth < 100 ? "hidden" : ""}`}>
                  {name}
                </span>
              </li>
            ))}
          </ul>
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
