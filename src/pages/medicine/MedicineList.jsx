import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import { MdWarehouse } from "react-icons/md";
const medicines = [
  {
    name: "Zimax",
    generic: "Azithromycin",
    weight: "500mg",
    category: "Tablet",
    price: "20.55 USD",
    stock: 100,
    date: "2025-01-20",
  },
  {
    name: "Oxidon",
    generic: "Domperidon",
    weight: "10mg",
    category: "Tablet",
    price: "15.00 USD",
    stock: 50,
    date: "2025-02-10",
  },
  {
    name: "MED-1008",
    generic: "Hydrazine",
    weight: "200Doses",
    category: "Inhaler",
    price: "12.45 USD",
    stock: 0,
    date: "2025-03-21",
  },
];

const MedicineList = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");

  const toggleMenu = (index) => setOpenMenu(openMenu === index ? null : index);

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch = med.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = category ? med.category === category : true;
    const matchesDate =
      (!startDate || new Date(med.date) >= new Date(startDate)) &&
      (!endDate || new Date(med.date) <= new Date(endDate));
    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalPages = Math.ceil(filteredMedicines.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedMedicines = filteredMedicines.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const getStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-600" };
    if (stock <= 50) return { text: "Low", color: "text-orange-500" };
    return { text: "Available", color: "text-green-600" };
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md overflow-x-auto">
      <h2 className="text-2xl font-bold mb-2">Medicine</h2>
      <p className="text-gray-600 mb-4">Here is the medicine list.</p>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 rounded-md focus:outline-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border p-2 rounded-md focus:outline-green-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Tablet">Tablet</option>
          <option value="Vitamin">Vitamin</option>
          <option value="Inhaler">Inhaler</option>
        </select>

        <div>
          <label htmlFor="" className="me-2 text-gray-400">
            Filter by Choose start date
          </label>
          <input
            type="date"
            className="border p-2 rounded-md focus:outline-green-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="" className="me-2 text-gray-400">
            Choose end date
          </label>
          <input
            type="date"
            className="border p-2 rounded-md focus:outline-green-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-700 rounded">
            <tr>
              <td className="p-3 text-left">Name</td>
              <td className="p-3 text-left">Generic Name</td>
              <td className="p-3 text-left">Weight</td>
              <td className="p-3 text-left">Category</td>
              <td className="p-3 text-left">Price</td>
              <td className="p-3 text-left">Stock</td>
              <td className="p-3 text-left">Status</td>
              <td className="p-3 text-left">Date</td>
              <td className="p-3 text-left">Actions</td>
            </tr>
          </thead>
          <tbody>
            {selectedMedicines.map((med, index) => {
              const { text, color } = getStatus(med.stock);
              return (
                <tr key={index} className="border-b text-sm sm:text-base">
                  <td className="p-3 font-bold text-gray-600">{med.name}</td>
                  <td className="p-3 text-gray-400">{med.generic}</td>
                  <td className="p-3 text-gray-400">{med.weight}</td>
                  <td className="p-3 text-gray-400">{med.category}</td>
                  <td className="p-3 text-gray-400">{med.price}</td>
                  <td className="p-3 text-gray-400">{med.stock}</td>
                  <td className={`p-3 font-semibold ${color}`}>{text}</td>
                  <td className="p-3 text-gray-400">{med.date}</td>
                  <td className="p-3 relative">
                    <button
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                      onClick={() => toggleMenu(index)}
                    >
                      <FaEllipsisV />
                    </button>
                    {openMenu === index && (
                      <div className="absolute z-10 right-24  mt-2 top-2 w-36 bg-gray-100 border-green-600  rounded-md shadow-md">
                        <button className="flex  align-middle w-full text-left text-gray-600  py-2 hover:rounded-md hover:bg-green-500 hover:text-white">
                          <MdWarehouse className="mt-1 w-10" />
                          Manufacturer
                        </button>
                        <button className="flex  align-middle w-full text-left text-gray-600  py-2 hover:rounded-md hover:bg-green-500 hover:text-white">
                          <BiShow className="mt-1 w-10" />
                          View Details
                        </button>

                        <button className="flex  align-middle w-full text-left text-gray-600 hover:rounded-md  py-2 hover:bg-green-500 hover:text-white">
                          <BiEdit className="mt-1 w-10" />
                          Edit
                        </button>

                        <button className="flex align-middle w-full text-gray-600 text-center hover:rounded-md  py-2 hover:bg-green-500 hover:text-white">
                          <BiTrash className="mt-1 w-10" />
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Rows per page:</span>
          <select
            className="border p-2 rounded-md"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded-md"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border rounded-md"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineList;
