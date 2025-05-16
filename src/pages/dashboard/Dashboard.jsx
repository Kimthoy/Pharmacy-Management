import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";
import {
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
  UsersIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const downloadDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        downloadDropdownRef.current &&
        !downloadDropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDownload = (format) => {
    alert(`${t(`dashboard.${format.toLowerCase()}`)} file downloaded`);
    setShowDropdown(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-600 dark:text-gray-200">
            {t("dashboard.title")}
          </h1>
          <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="relative" ref={downloadDropdownRef}>
          <button
            className="text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow-sm hover:border-emerald-600 hover:text-emerald-500 dark:hover:text-emerald-400"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {t("dashboard.downloadReport")} <span className="ml-1">▼</span>
          </button>
          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10 
              transition-all duration-300 ease-out transform origin-top scale-95 opacity-0 
              animate-dropdown"
            >
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400"
                onClick={() => handleDownload("Excel")}
              >
                {t("dashboard.excel")}
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400"
                onClick={() => handleDownload("PDF")}
              >
                {t("dashboard.pdf")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 p-4 rounded-lg text-center">
          <ShieldCheckIcon className="h-6 w-6 text-green-800 dark:text-green-300 mx-auto" />
          <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mt-2">
            Good
          </h3>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {t("dashboard.inventoryStatus")}
          </p>
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 p-4 rounded-lg text-center">
          <CurrencyRupeeIcon className="h-6 w-6 text-yellow-800 dark:text-yellow-300 mx-auto" />
          <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mt-2">
            Rs. 8,55,875
          </h3>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {t("dashboard.revenue")} · Jan 2022
          </p>
        </div>

        <div className="bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 p-4 rounded-lg text-center">
          <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500 dark:text-blue-300 mx-auto" />
          <h3 className="text-sm font-semibold text-blue-500 dark:text-blue-300 mt-2">
            298
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-300">
            {t("dashboard.medicinesAvailable")}
          </p>
        </div>

        <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 p-4 rounded-lg text-center">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-800 dark:text-red-300 mx-auto" />
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mt-2">
            01
          </h3>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            {t("dashboard.medicineShortage")}
          </p>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Cog6ToothIcon className="h-5 w-5 text-gray-800 dark:text-gray-300 mr-2" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {t("inventory.title")}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">
            <strong>298</strong> {t("inventory.totalMedicines")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingCartIcon className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-200">
                {t("report.title-report")}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">
            <strong>70,856</strong> {t("report.total-report")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-200">
                {t("supplier.supptitle")}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">
            <strong>04</strong> {t("supplier.totalsupp")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UsersIcon className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-200">
                {t("customers.title-customer")}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">
            <strong>845</strong> {t("customers.total-customer")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
