import React, { useEffect, useState } from "react";
import { BiShow, BiEdit, BiTrash } from "react-icons/bi";
import Swal from "sweetalert2";
import {
  getAllMedicines,
  toggleProductStatus,
  deleteMedicine,
} from "../api/medicineService";
import { PiBackspaceBold } from "react-icons/pi";
import { useTranslation } from "../../hooks/useTranslation";
import EditMedicineModal from "./EditMedicineModal";
import { TbHttpDelete } from "react-icons/tb";
const MedicineList = () => {
  const { t } = useTranslation();
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [success, setSuccess] = useState([]);
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
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const filtered = medicines.filter((med) =>
    med.medicine_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  //delete alert
  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteMedicine(id);
      }
    });
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
      console.log("Fetched medicines:", medicinesData);
      setMedicines(medicinesData);
    } catch (err) {
      console.error("Failed to fetch medicines", err);
    } finally {
      setLoading(false);
    }
  };
  const handleEditClick = (medicine) => {
    setEditMedicineData(medicine);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedMedicine) => {
    console.log("Save this:", updatedMedicine);
    setEditModalOpen(false);
    fetchMedicines();
  };

  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000); // hide after 3 seconds
  };

  const handleDeleteMedicine = async (id) => {
    try {
      setStatusLoadingId(id);
      await deleteMedicine(id);
      await fetchMedicines();
      showToast("ថ្នាំត្រូវបានលុបដោយជោគជ័យ!", "success");
    } catch (err) {
      showToast("បរាជ័យក្នុងការលុបថ្នាំ!", "error");
    } finally {
      setStatusLoadingId(null);
    }
  };

  return (
    <div className="p-4 mb-16">
      <h2 className="text-xl font-bold mb-4 dark:text-slate-200">
        Medicine List
      </h2>
      {toast.message && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: toast.type === "success" ? "#4CAF50" : "#F44336",
            color: "white",
            padding: "12px 20px",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 9999,
            minWidth: "250px",
            fontWeight: "bold",
            userSelect: "none",
          }}
        >
          {toast.message}
        </div>
      )}

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
        <p className="text-center mt-36 text-md dark:text-slate-300">
          Loading medicines...
        </p>
      ) : (
        <div>
          <div className="w-full overflow-x-auto relative">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200 dark:bg-slate-700 dark:text-slate-600">
                <tr>
                  <th className="border px-2 py-4 dark:text-slate-200 hidden sm:table-cell">
                    <input
                      // checked={isAllSelected}
                      onChange={handleSelectAll}
                      type="checkbox"
                      className="w-5 h-5 hover:cursor-pointer accent-green-600 rounded transition-all duration-200 ease-in-out scale-100 checked:scale-110"
                    />
                  </th>
                  <td className="border px-3 py-2 dark:text-slate-100">Name</td>
                  <td className="border px-3 py-2 dark:text-slate-100">
                    Price
                  </td>
                  <td className="border px-3 py-2 dark:text-slate-100">
                    Expire Date
                  </td>
                  <td className=" border px-3 py-2 dark:text-slate-100">
                    Status
                  </td>
                  <td className="sm:flex hidden border px-3 py-2 dark:text-slate-100">
                    Image
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
                {currentItems.map((med) => (
                  <tr key={med.id} className="text-left transition-all ">
                    <td className="text-center px-2 border dark:text-slate-100 hidden sm:table-cell">
                      <input
                        checked={selectedMedicines.includes(med.id)}
                        disabled={med.status !== "active"}
                        onChange={() => handleCheckboxChange(med.id)}
                        type="checkbox"
                        className="w-5 h-5 accent-blue-600 hover:cursor-pointer rounded transition-all duration-200 ease-in-out scale-100 checked:scale-110"
                      />
                    </td>
                    <td
                      className="border px-3 py-2 max-w-[100px] sm:max-w-[200px]  truncate whitespace-nowrap overflow-hidden text-ellipsis dark:text-slate-100"
                      title={med.medicine_name}
                    >
                      {med.medicine_name}
                    </td>

                    <td className="border px-3 py-2 dark:text-slate-100">
                      ${med.price}
                    </td>
                    <td className="border px-3 py-2 dark:text-slate-100">
                      {new Date(med.expire_date).toLocaleDateString("en-GB")}
                    </td>
                    <td className=" border px-3 py-2 dark:text-slate-100">
                      {med.status}
                    </td>
                    <td className="sm:flex hidden border px-3 dark:text-slate-100">
                      <img
                        src={med.image}
                        alt="Medicine"
                        className="w-20 h-20 object-cover"
                      />
                    </td>
                    <td className="border px-3 py-2 dark:text-slate-100 hidden sm:table-cell">
                      {med.medicine_detail}
                    </td>
                    <td className="border px-3 py-2 ">
                      <div className="flex flex-wrap gap-2 ">
                        <button
                          onClick={() => handleView(med)}
                          className={`text-yellow-500  rounded-lg  transition-all sm:hover:bg-slate-700 sm:over:bg-slate-700 sm:dark:hover:bg-opacity-50 sm:hover:rounded-lg sm:p-3 sm:hover:bg-opacity-20`}
                        >
                          <BiShow className="sm:w-6 w-5 sm:h-6 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(med)}
                          className={`text-blue-600 rounded-lg  transition-all sm:hover:bg-slate-700 dark:hover:bg-opacity-50 sm:hover:rounded-lg sm:p-3 sm:hover:bg-opacity-15`}
                        >
                          <BiEdit className="sm:w-6 w-5 sm:h-6 h-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(med.id)}
                          disabled={statusLoadingId === med.id}
                          className={`rounded-lg text-red-600 transition-all sm:hover:bg-slate-700 dark:hover:bg-opacity-50 sm:hover:rounded-lg sm:p-3 sm:hover:bg-opacity-15`}
                        >
                          {statusLoadingId === med.id ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <TbHttpDelete className="sm:w-6 w-5 sm:h-6 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex  absolute right-0 justify-center items-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 shadow-lg"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white sm:mb-0 mb-14 dark:bg-slate-800 sm:p-6 p-2 shadow-lg w-[90%] max-w-md relative">
            <PiBackspaceBold
              className="w-6 h-6 float-end mr-4 hover:cursor-pointer hover:text-red-600 dark:text-slate-200 dark:hover:text-red-500"
              onClick={() => setIsViewModalOpen(false)}
            />
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-100">
              {t("medicine-view.Info")}
            </h2>
            <div className="text-gray-800 dark:text-gray-200">
              <table className="table-auto w-full text-left border-collapse ">
                <tbody>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-green-600">
                    <td className="pl-4 py-2 font-semibold w-1/3">
                      {t("medicine-view.Name")}
                    </td>
                    <td className="py-2 w-1/12">:</td>
                    <td className="py-2 pr-4 uppercase ">
                      {selectedMedicine.medicine_name}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-green-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Price")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">${selectedMedicine.price}</td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-green-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Quantity")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">
                      {selectedMedicine.quantity} (ប្រអប់)
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-green-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Weight")} (mg)
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">{selectedMedicine.weight}</td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-green-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Category")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">
                      {selectedMedicine.categories &&
                      selectedMedicine.categories.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {selectedMedicine.categories.map((cat) => (
                            <p key={cat.id}>{cat.category_name}</p>
                          ))}
                        </ul>
                      ) : (
                        <span className="italic text-gray-500">
                          No categories
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-green-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Status")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">
                      <span
                        className={`px-2 py-1  text-sm font-medium ${
                          selectedMedicine.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedMedicine.status}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-green-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Expire_Date")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">
                      {new Date(
                        selectedMedicine.expire_date
                      ).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-green-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Description")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">
                      {selectedMedicine.medicine_detail}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-green-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Barcode")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">
                      {selectedMedicine.barcode_number}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-green-600">
                    <td className="pl-4 py-2 font-semibold">
                      {t("medicine-view.Image")}
                    </td>
                    <td className="py-2">:</td>
                    <td className="py-2 pr-4">
                      <img
                        src={
                          selectedMedicine.image
                            ? selectedMedicine.image
                            : "/placeholder-image.png"
                        }
                        alt="Medicine"
                        className="w-20 h-auto rounded"
                      />
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
