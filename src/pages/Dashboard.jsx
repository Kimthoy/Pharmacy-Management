import React, { useState } from "react";
import {
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDownload = (format) => {
    alert(`Downloading report as ${format}`);
    setShowDropdown(false);
  };

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            A quick data overview of the inventory.
          </p>
        </div>
        <div className="relative">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-haspopup="true"
            aria-expanded={showDropdown ? "true" : "false"}
          >
            Download Report <span className="ml-1">▼</span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                onClick={() => handleDownload("Excel")}
                aria-label="Download report as Excel"
              >
                Excel
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                onClick={() => handleDownload("PDF")}
                aria-label="Download report as PDF"
              >
                PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/Inventory">
          <div className="bg-green-100 border border-green-300 p-4 rounded-lg text-center">
            <ShieldCheckIcon className="h-8 w-8 text-green-800 mx-auto" />
            <h3 className="text-lg font-semibold text-green-800 mt-2">Good</h3>
            <p className="text-gray-700">Inventory Status</p>
            <button className="mt-4 bg-green-200 px-2 py-2 text-green-800 rounded-lg hover:bg-green-300">
              View Detailed Report
            </button>
          </div>
        </Link>

        <Link to="/money-mgt">
          <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg text-center">
            <CurrencyRupeeIcon className="h-8 w-8 text-yellow-800 mx-auto" />
            <h3 className="text-xl font-semibold text-yellow-800 mt-2">
              Rs. 8,55,875
            </h3>
            <p className="text-gray-700">Revenue · Jan 2022</p>
            <button className="mt-4 bg-yellow-200 px-2 py-2 text-yellow-800 rounded-lg hover:bg-yellow-300">
              View Detailed Report
            </button>
          </div>
        </Link>

        <Link to="/list-of-medicine">
          <div className="bg-blue-100 border border-blue-300 p-4 rounded-lg text-center">
            <ClipboardDocumentListIcon className="h-8 w-8 text-blue-800 mx-auto" />
            <h3 className="text-xl font-semibold text-blue-800 mt-2">298</h3>
            <p className="text-gray-700">Medicines Available</p>
            <button className="mt-4 bg-blue-200 px-4 py-2 text-blue-800 rounded-lg hover:bg-blue-300">
              Visit Inventory
            </button>
          </div>
        </Link>

        <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-800 mx-auto" />
          <h3 className="text-xl font-semibold text-red-800 mt-2">01</h3>
          <p className="text-gray-700">Medicine Shortage</p>
          <button className="mt-4 bg-red-200 px-4 py-2 text-red-800 rounded-lg hover:bg-red-300">
            Resolve Now
          </button>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Cog6ToothIcon className="h-6 w-6 text-gray-800 mr-2" />
              <h3 className="font-semibold text-gray-800">Inventory</h3>
            </div>
            <Link to="/configuration" className="text-blue-600 hover:underline">
              Go to Configuration »
            </Link>
          </div>
          <p className="mt-4 text-gray-700">
            <strong>298</strong> Total no of Medicines
          </p>
          <p className="mt-1 text-gray-700">
            <strong>24</strong> Medicine Groups
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingCartIcon className="h-6 w-6 text-gray-800 mr-2" />
              <h3 className="font-semibold text-gray-800">Quick Report</h3>
            </div>
            <span className="text-gray-600">January 2022</span>
          </div>
          <p className="mt-4 text-gray-700">
            <strong>70,856</strong> Qty of Medicines Sold
          </p>
          <p className="mt-1 text-gray-700">
            <strong>5,288</strong> Invoices Generated
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UserGroupIcon className="h-6 w-6 text-gray-800 mr-2" />
              <h3 className="font-semibold text-gray-800">My Pharmacy</h3>
            </div>
            <Link to="/User" className="text-blue-600 hover:underline">
              Go to User Management »
            </Link>
          </div>
          <p className="mt-4 text-gray-700">
            <strong>04</strong> Total no of Suppliers
          </p>
          <p className="mt-1 text-gray-700">
            <strong>05</strong> Total no of Users
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UsersIcon className="h-6 w-6 text-gray-800 mr-2" />
              <h3 className="font-semibold text-gray-800">Customers</h3>
            </div>
            <Link to="/Customer" className="text-blue-600 hover:underline">
              Go to Customers Page »
            </Link>
          </div>
          <p className="mt-4 text-gray-700">
            <strong>845</strong> Total no of Customers
          </p>
          <p className="mt-1 text-gray-700">
            <strong>Adalimumab</strong> Frequently bought Item
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
