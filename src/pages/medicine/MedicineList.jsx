import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import Swal from "sweetalert2";
import { getAllMedicines, deleteMedicine } from "../api/medicineService";
import { TbHttpDelete } from "react-icons/tb";
import EditMedicineModal from "./EditMedicineModal";
import { useTranslation } from "../../hooks/useTranslation";

const MedicineList = () => {
  const { t } = useTranslation();
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [meta, setMeta] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMedicineData, setEditMedicineData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isdeleteloading, setIsDeleteLoading] = useState(false);
  const fetchMedicines = async (page = 1) => {
    setLoading(true);
    try {
      const { data, meta } = await getAllMedicines(page);
      setMedicines(data);
      setMeta(meta);
    } catch (err) {
      console.error("Failed to fetch medicines", err);
      setError("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines(currentPage);
  }, [currentPage]);

  const handleEditClick = (medicine) => {
    setEditMedicineData(medicine);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setEditModalOpen(false);
    fetchMedicines(currentPage);
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) handleDeleteMedicine(id);
    });
  };

  const handleDeleteMedicine = async (id) => {
    try {
      setStatusLoadingId(id);
      await deleteMedicine(id);
      fetchMedicines(currentPage);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setStatusLoadingId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Medicine List</h2>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mb-4 w-full max-w-sm"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-2">Name</th>
                <th className="border px-2 py-2">Price</th>
                <th className="border px-2 py-2">Weight (mg/g)</th>
                <th className="border px-2 py-2">Unit</th>
                <th className="border px-2 py-2">Category</th>

                <th className="border px-2 py-2">Description</th>
                <th className="border px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(medicines ?? [])
                .filter((med) =>
                  med.medicine_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((med) => (
                  <tr key={med.id}>
                    <td className="border px-2 py-1">{med.medicine_name}</td>
                    <td className="border px-2 py-1">${med.price}</td>
                    <td className="border px-2 py-1">{med.weight}</td>

                    <td className="border px-2 py-1">
                      {Array.isArray(med.units) && med.units.length > 0
                        ? med.units.map((unt) => (
                            <span key={unt.id} className="inline-block mr-1">
                              {unt.unit_name}
                            </span>
                          ))
                        : "—"}
                    </td>

                    <td className="border px-2 py-1">
                      {Array.isArray(med.categories) &&
                      med.categories.length > 0
                        ? med.categories.map((cat) => (
                            <span key={cat.id} className="inline-block mr-1">
                              {cat.category_name}
                            </span>
                          ))
                        : "—"}
                    </td>

                    <td className="border px-2 py-1">
                      {med.medicine_detail || (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="border px-2 py-5 flex gap-2">
                      <button onClick={() => handleEditClick(med)}>
                        <BiEdit className="text-blue-600 w-5 h-5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(med.id)}
                        disabled={isdeleteloading}
                        className={`flex items-center gap-1 ${
                          isdeleteloading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isdeleteloading ? (
                          <>
                            <span className="text-gray-500 text-sm">
                              Deleting...
                            </span>
                          </>
                        ) : (
                          <TbHttpDelete className="text-red-600 w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {meta?.last_page &&
              Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === pageNum ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, meta.last_page || prev)
                )
              }
              disabled={currentPage >= meta.last_page}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {editModalOpen && (
        <EditMedicineModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          initialData={editMedicineData}
        />
      )}
    </div>
  );
};

export default MedicineList;
