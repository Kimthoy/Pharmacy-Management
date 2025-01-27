// Inventory.jsx
import React from "react";
import {
  ClipboardDocumentListIcon,
  RectangleStackIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const Inventory = () => {
  return (
    <div className="bg-white min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          <p className="text-gray-600">
            List of medicines available for sales.
          </p>
        </div>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Item
        </button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-3 gap-4">
        {/* Medicines Available */}
        <div className="bg-blue-100 border border-blue-300 p-4 rounded-lg text-center">
          <ClipboardDocumentListIcon className="h-8 w-8 text-blue-800 mx-auto" />
          <h3 className="text-2xl font-bold text-blue-800 mt-2">298</h3>
          <p className="text-gray-700">Medicines Available</p>
          <button className="mt-4 bg-blue-200 px-4 py-2 text-blue-800 rounded-lg hover:bg-blue-300">
            View Full List »
          </button>
        </div>

        {/* Medicine Groups */}
        <div className="bg-green-100 border border-green-300 p-4 rounded-lg text-center">
          <RectangleStackIcon className="h-8 w-8 text-green-800 mx-auto" />
          <h3 className="text-2xl font-bold text-green-800 mt-2">02</h3>
          <p className="text-gray-700">Medicine Groups</p>
          <button className="mt-4 bg-green-200 px-4 py-2 text-green-800 rounded-lg hover:bg-green-300">
            View Groups »
          </button>
        </div>

        {/* Medicine Shortage */}
        <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-800 mx-auto" />
          <h3 className="text-2xl font-bold text-red-800 mt-2">01</h3>
          <p className="text-gray-700">Medicine Shortage</p>
          <button className="mt-4 bg-red-200 px-4 py-2 text-red-800 rounded-lg hover:bg-red-300">
            Resolve Now »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
