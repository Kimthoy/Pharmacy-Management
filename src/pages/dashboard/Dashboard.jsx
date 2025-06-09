import { useState, useRef, useEffect } from "react";

import {
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
  UsersIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ClockIcon,
  PlusIcon,
  TruckIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {

  const [showDropdown, setShowDropdown] = useState(false);
  const downloadDropdownRef = useRef(null);
  const dashboardData = {
    inventoryStatus: "Good",
    revenue: "Rs. 8,55,875",
    medicinesAvailable: 298,
    medicineShortage: 1,
    totalMedicines: 298,
    totalSales: 70856,
    totalSuppliers: 4,
    totalCustomers: 845,
    pendingPrescriptions: 12,
    processedPrescriptions: 245,
    expiringSoon: 5,
    lowStockItems: 3,
    recentActivities: [
      {
        id: 1,
        action: "Restocked Paracetamol",
        staff: "John Doe",
        time: "2 hours ago",
      },
      {
        id: 2,
        action: "Processed Prescription #1234",
        staff: "Jane Smith",
        time: "3 hours ago",
      },
      {
        id: 3,
        action: "Added new supplier",
        staff: "Alice Brown",
        time: "5 hours ago",
      },
    ],
  };

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
    alert(`${format} file downloaded`);
    setShowDropdown(false);
  };

  const handleQuickAction = (action) => {
    alert(`Initiated ${action}`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-4 sm:p-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-600 dark:text-gray-200">
            Pharmacy Dashboard
          </h1>
          <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300">
            Overview of pharmacy operations and metrics
          </p>
        </div>
        <div className="relative mt-4 sm:mt-0" ref={downloadDropdownRef}>
          <button
            className="text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow-sm hover:border-emerald-600 hover:text-emerald-500 dark:hover:text-emerald-400"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Download Report <span className="ml-1">▼</span>
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
                Excel
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400"
                onClick={() => handleDownload("PDF")}
              >
                PDF
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400"
                onClick={() => handleDownload("CSV")}
              >
                CSV
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          className="flex items-center text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-4 py-2 rounded-md hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:text-white dark:hover:text-white transition"
          onClick={() => handleQuickAction("Add Prescription")}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Prescription
        </button>
        <button
          className="flex items-center text-xs text-blue-500 dark:text-blue-400 border border-blue-500 dark:border-blue-400 px-4 py-2 rounded-md hover:bg-blue-500 dark:hover:bg-blue-400 hover:text-white dark:hover:text-white transition"
          onClick={() => handleQuickAction("Restock Inventory")}
        >
          <TruckIcon className="h-5 w-5 mr-2" />
          Restock Inventory
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 p-4 rounded-lg text-center">
          <ShieldCheckIcon className="h-6 w-6 text-green-800 dark:text-green-300 mx-auto" />
          <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mt-2">
            {dashboardData.inventoryStatus}
          </h3>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Inventory Status
          </p>
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 p-4 rounded-lg text-center">
          <CurrencyRupeeIcon className="h-6 w-6 text-yellow-800 dark:text-yellow-300 mx-auto" />
          <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mt-2">
            {dashboardData.revenue}
          </h3>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Revenue · Jan 2022
          </p>
        </div>

        <div className="bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 p-4 rounded-lg text-center">
          <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500 dark:text-blue-300 mx-auto" />
          <h3 className="text-sm font-semibold text-blue-500 dark:text-blue-300 mt-2">
            {dashboardData.medicinesAvailable}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-300">
            Medicines Available
          </p>
        </div>

        <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 p-4 rounded-lg text-center">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-800 dark:text-red-300 mx-auto" />
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mt-2">
            {dashboardData.medicineShortage}
          </h3>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Medicine Shortage
          </p>
        </div>

        <div className="bg-purple-100 dark:bg-purple-900 border border-purple-300 dark:border-purple-700 p-4 rounded-lg text-center">
          <ClockIcon className="h-6 w-6 text-purple-800 dark:text-purple-300 mx-auto" />
          <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mt-2">
            {dashboardData.expiringSoon}
          </h3>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Expiring Soon
          </p>
        </div>

        <div className="bg-orange-100 dark:bg-orange-900 border border-orange-300 dark:border-orange-700 p-4 rounded-lg text-center">
          <BellIcon className="h-6 w-6 text-orange-800 dark:text-orange-300 mx-auto" />
          <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mt-2">
            {dashboardData.lowStockItems}
          </h3>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Low Stock Items
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Cog6ToothIcon className="h-5 w-5 text-gray-800 dark:text-gray-300 mr-2" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Inventory
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">
            <strong>{dashboardData.totalMedicines}</strong> Total Medicines
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingCartIcon className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-200">
                Sales Report
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">
            <strong>{dashboardData.totalSales}</strong> Total Sales
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-200">
                Suppliers
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">
            <strong>{dashboardData.totalSuppliers}</strong> Total Suppliers
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UsersIcon className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-200">
                Customers
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">
            <strong>{dashboardData.totalCustomers}</strong> Total Customers
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2" />
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-200">
                Prescriptions
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">
            <strong>{dashboardData.pendingPrescriptions}</strong> Pending
            Prescriptions
            <br />
            <strong>{dashboardData.processedPrescriptions}</strong> Processed
            Prescriptions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
