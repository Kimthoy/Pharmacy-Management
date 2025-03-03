import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { BiCapsule } from "react-icons/bi";
import {
  ClipboardDocumentListIcon,
  FolderIcon,
  XMarkIcon,
  UserGroupIcon,
  UserPlusIcon,
  ListBulletIcon,
  UsersIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { CiSettings } from "react-icons/ci";
import { RiPagesLine } from "react-icons/ri";

import {
  MdAddHomeWork,
  MdListAlt,
  MdOutlineMonitorHeart,
  MdOutlineMedicationLiquid,
} from "react-icons/md";
import { LuNotebookPen } from "react-icons/lu";
import { LiaWarehouseSolid } from "react-icons/lia";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { BiPurchaseTag } from "react-icons/bi";
import { PiInvoiceBold } from "react-icons/pi";
import { GoGraph, GoSignIn } from "react-icons/go";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { TfiDashboard } from "react-icons/tfi";

const Sidebar = ({ setSelectedPage, selectedPage }) => {
  const navigate = useNavigate();
  const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(false);

  const [subSidebarWidth] = useState(256);

  const menuItems = [
    { name: "Dashboard", icon: TfiDashboard, path: "/" },

    {
      name: "MedicinePage",
      icon: BiCapsule,
      path: "/madicinepage",
      subItems: [
        {
          name: "AddMedicinePage",
          icon: MdOutlineMedicationLiquid,
          path: "/addmedicinepage",
        },
        {
          name: "ListMedicinePage",
          icon: ClipboardDocumentListIcon,
          path: "/listofmedicine",
        },
        {
          name: "MedicineDetailPage",
          icon: FolderIcon,
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
          icon: UsersIcon,
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
          name: "Add Manufacturer",
          icon: MdAddHomeWork,
          path: "/addmanu",
        },

        {
          name: "Manufacturer List",
          icon: MdListAlt,
          path: "/manufacturerlist",
        },
        {
          name: "Manufacturer Ledger",
          icon: LuNotebookPen,
          path: "/manuledger",
        },
      ],
    },

    {
      name: "FinancePage",
      icon: HiOutlineCurrencyDollar,
      path: "/financepage",
      subItems: [
        {
          name: "ExpenasePage",
          icon: HiOutlineCurrencyDollar,
          path: "/expensepage",
        },

        {
          name: "IncomePage",
          icon: GoGraph,
          path: "/incomepage",
        },
        {
          name: "InvoiceDetailPage",
          icon: FaFileInvoiceDollar,
          path: "/invoicedetail",
        },
        {
          name: "InvoiceListPage",
          icon: PiInvoiceBold,
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
          icon: MdOutlineMonitorHeart,
          path: "/salereport",
        },

        {
          name: "StockReport",
          icon: LiaWarehouseSolid,
          path: "/stockreport",
        },
        {
          name: "PurchaseReport",
          icon: BiPurchaseTag,
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
          icon: ArrowLeftEndOnRectangleIcon,
          path: "/login",
        },
        {
          name: "Sign In",
          icon: GoSignIn,
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
              className={`relative p-2 rounded cursor-pointer flex items-center justify-center hover:bg-green-400  transition-all duration-300 ease-in-out ${
                selectedPage === name ? "bg-green-400 text-white" : ""
              } group`}
            >
              <Icon className="h-6 w-6" />
              <span className="absolute left-full ml-2 p-1 rounded bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex ">
        <div
          className={`bg-gray-100 text-black  flex flex-col shadow-md h-screen p-5 transition-all duration-100 ease-in-out overflow-hidden ${
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
            {activeMenuItem?.subItems?.map(({ name, icon: Icon, path }) => (
              <li
                key={name}
                onClick={() => handlePageSelection(name, path)}
                className={`p-3 rounded cursor-pointer hover:bg-green-400 transition-all duration-100 ease-in-out flex items-center ${
                  selectedPage === name ? "bg-green-500 text-white" : ""
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />

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
