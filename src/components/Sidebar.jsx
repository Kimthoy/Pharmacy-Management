import React, { useState, useRef, useEffect } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../src/hooks/useTranslation";
import { BiCapsule } from "react-icons/bi";
import { CiMedicalCross } from "react-icons/ci";
import { FaUserDoctor, FaTruckMedical } from "react-icons/fa6";
import { MdPointOfSale, MdAssignmentReturn } from "react-icons/md";
import {
  UserGroupIcon,
  UserPlusIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { LiaWarehouseSolid } from "react-icons/lia";
import { FiSettings } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";

const Sidebar = ({ setSelectedPage, selectedPage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);

  // Close sidebar when tapping/clicking outside on mobile
  useEffect(() => {
    const handler = (e) => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile || !isOpen) return;

      const sidebarEl = sidebarRef.current;
      const toggleEl = toggleBtnRef.current;

      const clickedInsideSidebar = sidebarEl && sidebarEl.contains(e.target);
      const clickedToggle = toggleEl && toggleEl.contains(e.target);

      if (!clickedInsideSidebar && !clickedToggle) {
        setIsOpen(false);
        setActiveMenuItem(null);
      }
    };

    // Use both touch and mouse events for better reliability across devices
    document.addEventListener("touchstart", handler, { passive: true });
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("mousedown", handler);
    };
  }, [isOpen]);

  const menuItems = [
    { name: t("sidebar.dashboards"), icon: MdSpaceDashboard, path: "/" },
    {
      name: t("sidebar.retail-product"),
      icon: CiMedicalCross,
      path: "/retail-product",
    },
    {
      name: t("sidebar.medicine"),
      icon: BiCapsule,
      path: "/madicinepage",
      subItems: [
        { name: t("sidebar.addMedicine"), path: "/addmedicinepage" },
        { name: t("sidebar.medicineList"), path: "/listofmedicine" },
        { name: t("sidebar.categoies"), path: "/categoies" },
        { name: t("sidebar.units"), path: "/units" },
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

    { name: t("sidebar.staff"), icon: FaUserDoctor, path: "/listofstaff" },
    {
      name: t("sidebar.stock"),
      icon: LiaWarehouseSolid,
      path: "/stock",
      subItems: [
        { name: t("sidebar.AddStock"), path: "/add-supply" },
        { name: t("sidebar.StockList"), path: "/stocklist" },
      ],
    },
    {
      name: t("sidebar.RetailStock"),
      icon: LiaWarehouseSolid,
      path: "/retailstock",
    },
    {
      name: t("sidebar.manufacturer"),
      icon: FaTruckMedical,
      path: "/menufacturer",
      subItems: [
        { name: t("sidebar.manufacturerList"), path: "/manufacturerlist" },
        { name: t("sidebar.supplies"), path: "/supplies" },
        { name: t("sidebar.supplyitems"), path: "/supplyitems" },
      ],
    },
    {
      name: t("sidebar.returns"),
      icon: MdAssignmentReturn,
      path: "/return",
      subItems: [
        { name: t("sidebar.wastageReturnList"), path: "/returns-table" },
      ],
    },
    {
      name: t("sidebar.salepage"),
      icon: MdPointOfSale,
      path: "/saledashboard",
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
    { name: t("sidebar.setting"), icon: FiSettings, path: "/setting-page" },
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
    setIsOpen((prev) => !prev);
    if (!isOpen) setActiveMenuItem(null);
  };

  return (
    <div>
      {/* Toggle button (mobile) */}
      <button
        ref={toggleBtnRef}
        className="md:hidden fixed top-2 right-[72px]  sm:p-2 p-2 bg-green-500 text-white rounded-md"
        onClick={toggleSidebar}
        aria-label={
          isOpen
            ? t("sidebar.close") ?? "Close sidebar"
            : t("sidebar.open") ?? "Open sidebar"
        }
      >
        {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
      </button>

      {/* Dimmed overlay; also closes on click */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[1001] md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`h-screen z-[1001] flex-shrink-0 bg-green-600 dark:bg-gray-900 dark:shadow-gray-800 transition-all duration-300 fixed  md:static
        ${isOpen ? "w-52" : "w-0 md:w-[80px]"} md:hover:w-64
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
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
                  <li key={name} className="relative">
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
                      className={`group flex items-center justify-between w-full px-2 py-2 mt-1 text-md rounded-lg transition-all duration-200
                        ${
                          isParentActive
                            ? "bg-white text-green-700 dark:bg-green-600 dark:text-white"
                            : "text-white dark:text-gray-200"
                        }
                        hover:bg-white hover:text-green-700
                        dark:hover:bg-gray-700 dark:hover:text-white
                        hover:scale-105 hover:shadow-lg`}
                    >
                      <div className="flex items-center">
                        <Icon
                          className={`w-7 h-7 flex-shrink-0 transition-colors duration-200
                            ${
                              isParentActive
                                ? "text-green-700 dark:text-white"
                                : "text-white dark:text-gray-300"
                            }
                            group-hover:text-green-700 dark:group-hover:text-green-400`}
                        />
                        {isOpen && (
                          <span className="ml-2 whitespace-nowrap">{name}</span>
                        )}
                      </div>

                      {isOpen && subItems && (
                        <svg
                          className={`w-5 h-5 transition-transform ${
                            activeMenuItem === name ? "rotate-180" : ""
                          } text-white dark:text-green-400 group-hover:text-green-700`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
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
                              className={`w-full mb-1 mt-1 py-2 rounded-lg transition-all text-left ml-12 px-2 text-md
                                ${
                                  selectedPage === sub.name
                                    ? "bg-green-500 text-white dark:bg-green-600"
                                    : "text-white dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400"
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
    </div>
  );
};

Sidebar.propTypes = {
  setSelectedPage: PropTypes.func.isRequired,
  selectedPage: PropTypes.string.isRequired,
};

export default Sidebar;
