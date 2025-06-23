import React, { useEffect, useState } from "react";
import { BiShow, BiEdit, BiTrash } from "react-icons/bi";
import { getAllMedicines, toggleProductStatus } from "../api/medicineService";
// import { GrCheckboxSelected } from "react-icons/gr";
// import { FaBan } from "react-icons/fa6";
import { PiBackspaceBold } from "react-icons/pi";
import { useTranslation } from "../../hooks/useTranslation";
import EditMedicineModal from "./EditMedicineModal";

const MedicineList = () => {
  const { t } = useTranslation();
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMedicineData, setEditMedicineData] = useState(null);

  const handleToggleStatus = async (medicineId) => {
    setStatusLoadingId(medicineId);
    try {
      await toggleProductStatus(medicineId);
      fetchMedicines();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedMedicines((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((mid) => mid !== id)
        : [...prevSelected, id]
    );
  };

  const handleView = (medicine) => {
    setSelectedMedicine(medicine);
    setIsViewModalOpen(true);
  };

  const handleSelectAll = () => {
    const activeMedicineIds = medicines
      .filter((med) => med.status === "active")
      .map((med) => med.id);

    if (selectedMedicines.length === activeMedicineIds.length) {
      setSelectedMedicines([]);
    } else {
      setSelectedMedicines(activeMedicineIds);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const medicinesData = await getAllMedicines();
      console.log("Fetched medicines:", medicinesData); // Should be an array
      setMedicines(medicinesData); // ✅ Must be an array
    } catch (err) {
      console.error("Failed to fetch medicines", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter((med) => {
    const name = med.product?.name || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const isAllSelected =
    filteredMedicines.length > 0 &&
    selectedMedicines.length ===
      filteredMedicines.filter((med) => med.status === "active").length;

  const handleEditClick = (medicine) => {
    setEditMedicineData(medicine);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedMedicine) => {
    console.log("Save this:", updatedMedicine);
    setEditModalOpen(false);
    fetchMedicines();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-slate-200">
        Medicine List
      </h2>

      {/* Search Box */}
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 mb-2">⚠️ {error}</p>}

      {/* Table loading state */}
      {medicines.length === 0 ? (
        <p className="text-center mt-36 text-lg dark:text-slate-300">
          Loading medicines...
        </p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200 dark:bg-slate-700 dark:text-slate-600">
              <tr>
                <th className="border px-2 py-4 dark:text-slate-200 hidden sm:table-cell">
                  <input
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    type="checkbox"
                    className="w-5 h-5 hover:cursor-pointer accent-green-600 rounded transition-all duration-200 ease-in-out scale-100 checked:scale-110"
                  />
                </th>
                <td className="border px-3 py-2 dark:text-slate-100">Name</td>
                <td className="border px-3 py-2 dark:text-slate-100">Price</td>
                <td className="border px-3 py-2 dark:text-slate-100">
                  Expire Date
                </td>
                <td className="border px-3 py-2 dark:text-slate-100 hidden sm:table-cell">
                  Descriptions
                </td>
                <td className="border px-3 py-2 dark:text-slate-100">
                  Actions
                </td>
              </tr>
            </thead>

            <tbody>
              {medicines.map((med) => (
                <tr
                  key={med.id}
                  className="text-left transition-all hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  <td className="text-center px-2 border dark:text-slate-100 hidden sm:table-cell">
                    <input
                      checked={selectedMedicines.includes(med.id)}
                      disabled={med.status !== "active"}
                      onChange={() => handleCheckboxChange(med.id)}
                      type="checkbox"
                      className="w-5 h-5 accent-blue-600 hover:cursor-pointer rounded transition-all duration-200 ease-in-out scale-100 checked:scale-110"
                    />
                  </td>
                  <td className="border px-3 py-2 dark:text-slate-100">
                    {med.medicine_name}
                  </td>
                  <td className="border px-3 py-2 dark:text-slate-100">
                    $ {med.price}
                  </td>
                  <td className="border px-3 py-2 dark:text-slate-100">
                    {med.expire_date}
                  </td>
                  <td className="border px-3 py-2 dark:text-slate-100 hidden sm:table-cell">
                    {med.medicine_detail}
                  </td>
                  <td className="border px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleView(med)}
                        disabled={med.status !== "active"}
                        className={`text-white p-1 rounded-lg bg-yellow-500 transition-all ${
                          med.status !== "active"
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-110"
                        }`}
                      >
                        <BiShow className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(med)}
                        disabled={med.status !== "active"}
                        className={`text-white p-1 rounded-lg bg-blue-700 transition-all ${
                          med.status !== "active"
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-110"
                        }`}
                      >
                        <BiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(med.id)}
                        disabled={statusLoadingId === med.id}
                        className={`p-1 rounded-lg text-white transition-all ${
                          med.status === "active"
                            ? "bg-red-600"
                            : "bg-green-600"
                        } ${
                          statusLoadingId === med.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {statusLoadingId === med.id ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : med.status === "active" ? (
                          t("medicine-list.Disable")
                        ) : (
                          t("medicine-list.Enable")
                        )}
                      </button>
                      <button
                        onClick={() => handleEditClick(med)}
                        disabled={med.status !== "active"}
                        className={`text-white p-1 rounded-lg bg-blue-700 transition-all ${
                          med.status !== "active"
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-110"
                        }`}
                      >
                        Add to Stock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md w-[90%] max-w-md relative">
            <PiBackspaceBold
              className="w-6 h-6 float-end mr-4 hover:cursor-pointer hover:text-red-600 dark:text-slate-200 dark:hover:text-red-500"
              onClick={() => setIsViewModalOpen(false)}
            />
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-100">
              {t("medicine-view.Info")}
            </h2>
            <div className="text-gray-800 dark:text-gray-200">
              <table className="table-auto w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600">
                    <td className="pl-4 py-2 font-semibold w-1/3">
                      {t("medicine-view.Name")}
                    </td>
                    <td className="py-2 w-1/12">:</td>
                    <td className="py-2 pr-4">
                      {selectedMedicine.medicine_name}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Price")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">${selectedMedicine.price}</td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Weight")} (mg)
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">{selectedMedicine.weight}</td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Category")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">{selectedMedicine.category}</td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Status")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">
                      {selectedMedicine.active ? "Active" : "Inactive"}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Expire_Date")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">
                      {selectedMedicine.expire_date}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Description")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">
                      {selectedMedicine.medicine_detail}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-200 dark:hover:bg-slate-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Barcode")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">
                      {selectedMedicine.barcode_number}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditMedicineModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={editMedicineData}
      />
    </div>
  );
};

export default MedicineList;
