// src/components/Dashboard.jsx
import React, { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
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
  const { t, langCode } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDownload = (format) => {
    alert(`${t(`dashboard.${format.toLowerCase()}`)} file downloaded`);
    setShowDropdown(false);
  };

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-600">
            {t("dashboard.title")}
          </h1>
          <p className="text-xs sm:text-base text-gray-600">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="relative">
          <button
            className="text-gray-500 border px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow-sm hover:border-emerald-600 hover:text-emerald-500"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {t("dashboard.downloadReport")} <span className="ml-1">▼</span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:border-emerald-600 hover:text-emerald-600"
                onClick={() => handleDownload("Excel")}
              >
                {t("dashboard.excel")}
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:border-emerald-600 hover:text-emerald-600"
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
        <div className="bg-green-100 border border-green-300 p-4 rounded-lg text-center">
          <ShieldCheckIcon className="h-6 w-6 text-green-800 mx-auto" />
          <h3 className="text-sm font-semibold text-green-800 mt-2">Good</h3>
          <p className="text-xs text-gray-700">
            {t("dashboard.inventoryStatus")}
          </p>
        </div>

        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg text-center">
          <CurrencyRupeeIcon className="h-6 w-6 text-yellow-800 mx-auto" />
          <h3 className="text-sm font-semibold text-yellow-800 mt-2">
            Rs. 8,55,875
          </h3>
          <p className="text-xs text-gray-700">
            {t("dashboard.revenue")} · Jan 2022
          </p>
        </div>

        <div className="bg-blue-100 border border-blue-300 p-4 rounded-lg text-center">
          <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500 mx-auto" />
          <h3 className="text-sm font-semibold text-blue-500 mt-2">298</h3>
          <p className="text-xs text-gray-500">
            {t("dashboard.medicinesAvailable")}
          </p>
        </div>

        <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-center">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-800 mx-auto" />
          <h3 className="text-sm font-semibold text-red-800 mt-2">01</h3>
          <p className="text-xs text-gray-700">
            {t("dashboard.medicineShortage")}
          </p>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Cog6ToothIcon className="h-5 w-5 text-gray-800 mr-2" />
              <h3 className="text-sm font-semibold text-gray-800">
                {t("inventory.title")}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            <strong>298</strong> {t("inventory.totalMedicines")}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingCartIcon className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-sm font-semibold text-gray-500">
                {t("dashboard.quickReport")}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            <strong>70,856</strong> {t("dashboard.medicinesSold")}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-sm font-semibold text-gray-500">
                {t("dashboard.myPharmacy")}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            <strong>04</strong> {t("dashboard.totalSuppliers")}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UsersIcon className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-sm font-semibold text-gray-500">
                {t("dashboard.customers")}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            <strong>845</strong> {t("dashboard.totalCustomers")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
