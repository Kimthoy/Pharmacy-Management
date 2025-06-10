import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../src/hooks/useTranslation";
import { useTheme } from "../context/ThemeContext";
import { BiCapsule } from "react-icons/bi";
import { CiRepeat, CiSettings } from "react-icons/ci";
import { RiPagesLine } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import {
  UserGroupIcon,
  UserPlusIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { LiaWarehouseSolid } from "react-icons/lia";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { TfiDashboard } from "react-icons/tfi";

const Sidebar = ({ setSelectedPage, selectedPage }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { name: t("sidebar.dashboards"), icon: TfiDashboard, path: "/" },
    {
      name: t("sidebar.medicine"),
      icon: BiCapsule,
      path: "/madicinepage",
      subItems: [
        { name: t("sidebar.addMedicine"), path: "/addmedicinepage" },
        { name: t("sidebar.medicineList"), path: "/listofmedicine" },
        { name: t("sidebar.medicineDetail"), path: "/medicinedetail" },
        { name: t("sidebar.categoies"), path: "/categoies" },
      ],
    },
    {
      name: t("sidebar.customer"),
      icon: UserGroupIcon,
      path: "/customers",
      subItems: [
        {
          name: t("sidebar.newCustomer"),
          icon: UserPlusIcon,
          path: "/insertcustomer",
        },
        {
          name: t("sidebar.customerList"),
          icon: ListBulletIcon,
          path: "/customerlist",
        },
      ],
    },
    {
      name: t("sidebar.staff"),
      icon: FaUserDoctor,
      path: "/staff",
      subItems: [
        {
          name: t("sidebar.staffList"),
          icon: UserPlusIcon,
          path: "/listofstaff",
        },
      ],
    },
    {
      name: t("sidebar.manufacturer"),
      icon: LiaWarehouseSolid,
      path: "/menufacturer",
      subItems: [
        { name: t("sidebar.manufacturerList"), path: "/manufacturerlist" },
      ],
    },
    {
      name: t("sidebar.returns"),
      icon: CiRepeat,
      path: "/return",
      subItems: [
        { name: t("sidebar.addWastageReturn"), path: "/addwastagereturn" },
        {
          name: t("sidebar.addManufacturerReturn"),
          path: "/addmanufacturerreturn",
        },
        {
          name: t("sidebar.manufacturerReturnList"),
          path: "/manufacturerreturnlist",
        },
        { name: t("sidebar.wastageReturnList"), path: "/wastagereturnlist" },
      ],
    },
    {
      name: t("sidebar.finance"),
      icon: HiOutlineCurrencyDollar,
      path: "/financepage",
      subItems: [
        { name: t("sidebar.expense"), path: "/expensepage" },
        { name: t("sidebar.income"), path: "/incomepage" },
        { name: t("sidebar.invoiceDetail"), path: "/invoicedetail" },
        { name: t("sidebar.invoiceList"), path: "/invoicelist" },
      ],
    },
    {
      name: t("sidebar.salepage"),
      icon: HiOutlineCurrencyDollar,
      path: "/salepage",
      subItems: [{ name: t("sidebar.saledashboard"), path: "/saledashboard" }],
    },
    {
      name: t("sidebar.reports"),
      icon: MdOutlineMonitorHeart,
      path: "/reportall",
      subItems: [
        { name: t("sidebar.saleReport"), path: "/salereport" },
        { name: t("sidebar.stockReport"), path: "/stockreport" },
        { name: t("sidebar.purchaseReport"), path: "/purchasreport" },
      ],
    },
    {
      name: t("sidebar.pages"),
      icon: RiPagesLine,
      path: "/login",
      subItems: [
        { name: t("sidebar.login"), path: "/login" },
        { name: t("sidebar.register"), path: "/register" },
        { name: t("sidebar.client"), path: "/client" },
      ],
    },
    { name: t("sidebar.settings"), icon: CiSettings, path: "/settingpage" },
  ];

  const handlePageSelection = (item, path) => {
    setSelectedPage(item);
    navigate(path);
  };

  return (
    <div
      className={`h-screen flex-shrink-0 bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800 transition-all duration-300 ${
        isHovered ? "w-52" : "w-[80px]"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveMenuItem(null);
      }}
    >
      <div className="flex flex-col h-full">
        {/* Main Menu Items */}
        <nav className="flex-1 px-2 py-2">
          <ul className="space-y-1">
            {menuItems.map(({ name, icon: Icon, path, subItems }) => (
              <React.Fragment key={name}>
                <li>
                  <button
                    onClick={() => {
                      if (subItems) {
                        setActiveMenuItem(
                          name === activeMenuItem ? null : name
                        );
                      } else {
                        handlePageSelection(name, path);
                      }
                    }}
                    className={`flex items-center justify-between w-full text-xs p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-gray-700 hover:text-green-700 dark:hover:text-green-400 transition-all duration-200 ${
                      selectedPage === name
                        ? "bg-green-500 text-white dark:bg-green-600"
                        : ""
                    }`}
                  >
                    {/* Left section: icon + label */}
                    <div className="flex items-center">
                      <Icon className="w-6 h-6 flex-shrink-0 text-gray-600 dark:text-gray-300" />
                      {isHovered && (
                        <span className="ml-6 whitespace-nowrap">{name}</span>
                      )}
                    </div>
                    {/* Right section: dropdown arrow (if applicable) */}
                    {isHovered && subItems && (
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          activeMenuItem === name ? "rotate-180" : ""
                        } text-green-600 dark:text-green-400`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                  {/* Submenu with smooth expand */}
                  {subItems && (
                    <ul
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isHovered && activeMenuItem === name
                          ? " opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {subItems.map((sub) => (
                        <li key={sub.name}>
                          <button
                            onClick={() =>
                              handlePageSelection(sub.name, sub.path)
                            }
                            className={`w-full text-left ml-10 mt-1 p-2 rounded text-xs text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-gray-700 hover:text-green-700 dark:hover:text-green-400 transition-colors ${
                              selectedPage === sub.name
                                ? "bg-green-500 text-white dark:bg-green-600"
                                : ""
                            }`}
                          >
                            {sub.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  setSelectedPage: PropTypes.func.isRequired,
  selectedPage: PropTypes.string.isRequired,
};

export default Sidebar;
