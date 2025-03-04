import React, { useState } from "react";
import { FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi";

const ManufacturerList = () => {
  const [showForm, setShowForm] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [bulkAction, setBulkAction] = useState("");

  const handleSelect = (id) => {
    setSelectedManufacturers((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  const handleBulkAction = () => {
    if (bulkAction === "Delete") {
      setManufacturers((prev) =>
        prev.filter((m) => !selectedManufacturers.includes(m.id))
      );
      setSelectedManufacturers([]);
    }
  };

  const [manufacturers, setManufacturers] = useState([
    {
      id: 1,
      name: "Healthcare",
      email: "info@softnio.com",
      phone: "+811 847-4958",
      location: "Toronto, Canada",
      balance: "7868.55 USD",
      status: "Inactive",
    },
    {
      id: 2,
      name: "Square",
      email: "square@.com",
      phone: "+124 394-1787",
      location: "Florida, USA",
      balance: "9047.20 USD",
      status: "Active",
    },
    {
      id: 3,
      name: "Lupun",
      email: "lupin@.com",
      phone: "+168 603-2320",
      location: "Montgomery, USA",
      balance: "4300.98 USD",
      status: "Active",
    },
  ]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Manufacturer Lists</h2>
      <div className="py-4 ml-3">
        <select
          className="border p-2 rounded"
          value={bulkAction}
          onChange={(e) => setBulkAction(e.target.value)}
        >
          <option value="">Bulk Action</option>
          <option value="Send Email">Send Email</option>
          <option value="Delete">Delete</option>
        </select>

        <button
          className={`px-4 py-2 rounded ml-4 ${
            selectedManufacturers.length && bulkAction
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-700 cursor-not-allowed"
          }`}
          onClick={handleBulkAction}
          disabled={!selectedManufacturers.length || !bulkAction}
        >
          Apply
        </button>
        <button
          className="bg-green-500 ml-4 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowForm(true)}
        >
          + Add Manufacturer
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Add Manufacturer</h2>
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  className="w-full p-2 border rounded"
                  type="text"
                  required
                  placeholder="Company"
                />
                <input
                  className="w-full p-2 border rounded"
                  type="email"
                  placeholder="Email"
                />
                <input
                  className="w-full p-2 border rounded"
                  type="text"
                  required
                  placeholder="Phone"
                />
                <input
                  className="w-full p-2 border rounded"
                  type="text"
                  required
                  placeholder="Balance"
                />
                <input
                  className="w-full p-2 border rounded"
                  type="text"
                  required
                  placeholder="Country"
                />
                <input
                  className="w-full p-2 border rounded"
                  type="text"
                  required
                  placeholder="City"
                />
                <input
                  className="w-full p-2 border rounded"
                  type="text"
                  required
                  placeholder="State"
                />
                <select className="w-full p-2 border rounded" required>
                  <option value="">Select -/-</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                  Add Manufacturer
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="w-full border-collapse bg-white shadow-md mt-4">
        <thead>
          {/* <tr>
            <td colSpan={6}></td>
          </tr> */}
          <tr className="bg-gray-200">
            <td className="p-3">
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedManufacturers(
                    e.target.checked ? manufacturers.map((m) => m.id) : []
                  )
                }
                checked={selectedManufacturers.length === manufacturers.length}
              />
            </td>
            <td className="p-3">Company</td>
            <td className="p-3">Email</td>
            <td className="p-3">Phone</td>
            <td className="p-3">Location</td>
            <td className="p-3">Balance</td>
            <td className="p-3">Status</td>
            <td className="p-3">Action</td>
          </tr>
        </thead>
        <tbody>
          {manufacturers.map((manufacturer) => (
            <tr key={manufacturer.id} className="border-b">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedManufacturers.includes(manufacturer.id)}
                  onChange={() => handleSelect(manufacturer.id)}
                />
              </td>
              <td className="p-3">{manufacturer.name}</td>
              <td className="p-3">{manufacturer.email}</td>
              <td className="p-3">{manufacturer.phone}</td>
              <td className="p-3">{manufacturer.location}</td>
              <td className="p-3">{manufacturer.balance}</td>
              <td
                className={`p-3 font-semibold ${
                  manufacturer.status === "Active"
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}
              >
                {manufacturer.status}
              </td>
              <td className="p-3 relative">
                <button
                  onClick={() =>
                    setShowMenu(
                      showMenu === manufacturer.id ? null : manufacturer.id
                    )
                  }
                >
                  <FiMoreVertical size={20} />
                </button>
                {showMenu === manufacturer.id && (
                  <div className="absolute z-50 right-24 top-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2">
                    <button className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-100">
                      <FiEdit size={16} />
                      <span>Edit</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full text-left p-2 text-red-500 hover:bg-gray-100">
                      <FiTrash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManufacturerList;
