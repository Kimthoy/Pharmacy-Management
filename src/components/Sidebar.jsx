import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../src/hooks/useTranslation";
import { BiCapsule } from "react-icons/bi";
import { CiRepeat, CiSettings } from "react-icons/ci";
import { RiPagesLine } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import { MdPointOfSale } from "react-icons/md";
import {
  UserGroupIcon,
  UserPlusIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { LiaWarehouseSolid } from "react-icons/lia";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { TfiDashboard } from "react-icons/tfi";
import { HiMenu, HiX } from "react-icons/hi";

const Sidebar = ({ setSelectedPage, selectedPage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: t("sidebar.dashboards"), icon: TfiDashboard, path: "/" },
    {
      name: t("sidebar.medicine"),
      icon: BiCapsule,
      path: "/madicinepage",
      subItems: [
        { name: t("sidebar.addMedicine"), path: "/addmedicinepage" },
        { name: t("sidebar.medicineList"), path: "/listofmedicine" },
        // { name: t("sidebar.medicineDetail"), path: "/medicinedetail" },
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
      icon: MdPointOfSale,
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
    if (window.innerWidth < 768) {
      setIsOpen(false);
      setActiveMenuItem(null);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setActiveMenuItem(null);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-green-500 text-white rounded-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`h-screen flex-shrink-0 bg-white dark:bg-gray-900 dark:shadow-gray-800 transition-all duration-300 fixed z-50 md:static
          ${isOpen ? "w-64" : "w-0 md:w-[80px]"} md:hover:w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        onMouseEnter={() => window.innerWidth >= 768 && setIsOpen(true)}
        onMouseLeave={() => {
          if (window.innerWidth >= 768) {
            setIsOpen(false);
            setActiveMenuItem(null);
          }
        }}
      >
        <div className="h-full overflow-y-auto overflow-x-hidden flex flex-col">
          <nav className="flex-1 px-2 py-2">
            <ul className="space-y-1">
              {menuItems.map(({ name, icon: Icon, path, subItems }) => {
                const isParentActive =
                  selectedPage === name ||
                  (subItems &&
                    subItems.some((sub) => sub.name === selectedPage));

                return (
                  <li key={name}>
                    <button
                      onClick={() => {
                        if (subItems?.length) {
                          setActiveMenuItem(
                            name === activeMenuItem ? null : name
                          );
                        } else {
                          handlePageSelection(name, path);
                        }
                      }}
                      className={`flex items-center justify-between w-full px-4 py-2 mt-1 text-md rounded-lg transition-all duration-200
                        ${
                          isParentActive
                            ? "bg-green-500 text-white dark:bg-green-600"
                            : "text-gray-700 dark:text-gray-200"
                        }
                        hover:bg-green-500 dark:hover:bg-gray-700
                        hover:text-white dark:hover:text-green-500
                        hover:scale-105 hover:shadow-md hover:shadow-slate-300
                      `}
                    >
                      <div className="flex items-center">
                        <Icon
                          className={`w-7 h-7 flex-shrink-0 transition-colors duration-200 ${
                            isParentActive
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        />
                        {isOpen && (
                          <span className="ml-4 whitespace-nowrap">{name}</span>
                        )}
                      </div>

                      {isOpen && subItems && (
                        <svg
                          className={`w-5 h-5 transition-transform ${
                            activeMenuItem === name ? "rotate-180" : ""
                          } text-white  dark:text-green-400`}
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

                    {isOpen && subItems && (
                      <ul
                        className={`overflow-hidden transition-all ml-0 duration-300 ease-in-out ${
                          activeMenuItem === name
                            ? "opacity-100 max-h-[300px]"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {subItems.map((sub) => (
                          <li key={sub.name}>
                            <button
                              onClick={() =>
                                handlePageSelection(sub.name, sub.path)
                              }
                              className={`w-full mb-1 mt-1 py-2 rounded-lg hover:scale-105 hover:shadow-md transition-all text-left ml-12 px-2 text-md ${
                                selectedPage === sub.name
                                  ? "bg-green-500 text-white dark:bg-green-600"
                                  : "text-gray-700 dark:text-gray-200 hover:bg-green-600 dark:hover:bg-gray-700 hover:text-white dark:hover:text-green-400"
                              }`}
                            >
                              {sub.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  setSelectedPage: PropTypes.func.isRequired,
  selectedPage: PropTypes.string.isRequired,
};

export default Sidebar;
