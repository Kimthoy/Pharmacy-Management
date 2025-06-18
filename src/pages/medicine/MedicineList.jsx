import React, { useEffect, useState } from "react";
import { BiShow, BiEdit, BiTrash } from "react-icons/bi";
import { getAllMedicines, toggleProductStatus } from "../api/medicineService";
import { GrCheckboxSelected } from "react-icons/gr";
import { FaBan } from "react-icons/fa6";
import { PiBackspaceBold } from "react-icons/pi";

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);
  const handleCheckboxChange = (id) => {
    setSelectedMedicines((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((mid) => mid !== id)
        : [...prevSelected, id]
    );
  };
  // Handle pop view medicine
  const handleView = (medicine) => {
    setSelectedMedicine(medicine);
    setIsViewModalOpen(true);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMedicines([]);
    } else {
      const allIds = paginatedMedicines.map((m) => m.id);
      setSelectedMedicines(allIds);
    }
  };
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const data = await getAllMedicines();
      console.log("Fetched medicines:", data);
      setMedicines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch medicines:", err);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (medicineId) => {
    try {
      await toggleProductStatus(medicineId);
      fetchMedicines(); // Refresh list
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // 1. Filtered medicines (FIRST)
  const filteredMedicines = medicines.filter((med) => {
    const name = med.product?.name || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (startDate && endDate && med.date) {
      const medDate = new Date(med.date);
      matchesDate =
        medDate >= new Date(startDate) && medDate <= new Date(endDate);
    }

    return matchesSearch && matchesDate;
  });

  // 2. Paginate after filter
  const totalPages = Math.ceil(filteredMedicines.length / rowsPerPage);
  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // 3. THEN compute checkbox logic
  const isAllSelected =
    paginatedMedicines.length > 0 &&
    selectedMedicines.length === paginatedMedicines.length;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-slate-200">
        Medicine List
      </h2>
      {/* Search and Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      {error && <p className="text-red-500 mb-2">⚠️ {error}</p>}
      {/* Loading State */}
      {loading ? (
        <p className="text-center mt-36 text-lg">Loading medicines...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200 dark:bg-slate-700 dark:text-slate-600">
            <tr>
              <th className="border  hover:cursor-pointer px-2 py-4 dark:text-slate-200">
                <input
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  type="checkbox"
                  name=""
                  id=""
                  className="w-5 h-5 accent-green-600 rounded transition-all duration-200 ease-in-out scale-100 checked:scale-110"
                />
              </th>
              <td className="border px-3 dark:text-slate-100">Name</td>
              <td className="border px-3 dark:text-slate-100">Price</td>

              <td className="border px-3 dark:text-slate-100">Status</td>
              <td className="border px-3 dark:text-slate-100">Expire Date</td>
              <td className="border px-3 dark:text-slate-100">Descriptions</td>
              <td className="border px-3 dark:text-slate-100">Actions</td>
            </tr>
          </thead>
          <tbody>
            {paginatedMedicines.length > 0 ? (
              paginatedMedicines.map((med, index) => (
                <tr
                  key={med.id}
                  className="text-left transition-all hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  <td className=" text-center px-2 hover:cursor-pointer border  dark:text-slate-100">
                    <input
                      checked={selectedMedicines.includes(med.id)}
                      onChange={() => handleCheckboxChange(med.id)}
                      type="checkbox"
                      className="w-5 h-5 accent-blue-600 rounded transition-all duration-200 ease-in-out scale-100 checked:scale-110"
                    />
                  </td>
                  <td className="border px-3 dark:text-slate-100">
                    {med.medicine_name}
                  </td>
                  <td className="border px-3 dark:text-slate-100">
                    $ {med.price}
                  </td>
                  <td className="border px-3 dark:text-slate-100">
                    {med.active ? "Active" : "Inactive"}
                  </td>
                  <td className="border px-3 dark:text-slate-100">
                    {med.expire_date}
                  </td>
                  <td className="border px-3 dark:text-slate-100">
                    {med.medicine_detail}
                  </td>
                  <td className="border-b py-5  flex flex-1">
                    <button
                      onClick={() => handleView(med)}
                      className="text-white ml-2 hover:scale-110 transition-all p-1 rounded-lg bg-yellow-500"
                    >
                      <BiShow className="w-5 h-5" />
                    </button>

                    <button
                      to={`/medicines/edit/${med.id}`}
                      className="text-white ml-2 p-1 hover:scale-110 transition-all rounded-lg bg-blue-700  "
                    >
                      <BiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(med.id)}
                      className={`p-1 rounded-lg ml-2 hover:scale-125 transition-all text-white text-lg ${
                        med.active ? "bg-red-600 " : "bg-green-600 "
                      }`}
                    >
                      {med.active ? (
                        <FaBan className="h-5 w-5" />
                      ) : (
                        <GrCheckboxSelected className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {isViewModalOpen && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md shadow-slate-300 w-[90%] max-w-md relative">
            <PiBackspaceBold
              className="w-6 h-6 float-end mr-4 hover:cursor-pointer hover:text-red-600"
              onClick={() => setIsViewModalOpen(false)}
            />

            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-100">
              Information
            </h2>
            <div className=" text-gray-800 dark:text-gray-200">
              <table className="table-auto w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b hover:bg-slate-200 hover:shadow-md  cursor-pointer ">
                    <td className="pl-4 py-2 font-semibold w-1/4">Name</td>
                    <td className="py-2 w-1/12">:</td>
                    <td className="py-2 float-end pr-4 uppercase">
                      {selectedMedicine.medicine_name}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 hover:shadow-md  cursor-pointer">
                    <td className="py-2 font-semibold pl-4">Price</td>
                    <td className="py-2">:</td>
                    <td className="py-2 float-end pr-4">
                      ${selectedMedicine.price}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 hover:shadow-md  cursor-pointer">
                    <td className="py-2 font-semibold pl-4">Weight (mg)</td>
                    <td className="py-2">:</td>
                    <td className="py-2 float-end pr-4">
                      {selectedMedicine.weight} mg
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 hover:shadow-md  cursor-pointer">
                    <td className="py-2 font-semibold pl-4">Category</td>
                    <td className="py-2">:</td>
                    <td className="py-2 float-end pr-4">
                      {selectedMedicine.category}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 hover:shadow-md  cursor-pointer">
                    <td className="py-2 font-semibold pl-4">Status</td>
                    <td className="py-2">:</td>
                    <td className="py-2 float-end pr-4">
                      {selectedMedicine.active ? (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 hover:shadow-md  cursor-pointer">
                    <td className="py-2 font-semibold pl-4">Expire Date</td>
                    <td className="py-2">:</td>
                    <td className="py-2 float-end pr-4">
                      {selectedMedicine.expire_date}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-200 hover:shadow-md  cursor-pointer">
                    <td className="py-2 font-semibold pl-4">Description</td>
                    <td className="py-2">:</td>
                    <td className="py-2 float-end pr-4">
                      {selectedMedicine.medicine_detail}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-200 hover:shadow-md cursor-pointer">
                    <td className="py-2 font-semibold pl-4">Barcode</td>
                    <td className="py-2">:</td>
                    <td className="py-2 float-end pr-4">
                      {selectedMedicine.barcode_number}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineList;
