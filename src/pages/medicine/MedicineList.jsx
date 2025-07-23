import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import Swal from "sweetalert2";
import { getAllMedicines, deleteMedicine } from "../api/medicineService";
import { TbHttpDelete } from "react-icons/tb";
import EditMedicineModal from "./EditMedicineModal";
import { useTranslation } from "../../hooks/useTranslation";
import { useLocation } from "react-router-dom";

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

  const location = useLocation();
  const highlightedBarcode = location.state?.highlightedBarcode || null;

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

  // ✅ Auto-scroll to highlighted medicine after loading
  useEffect(() => {
    if (!loading && highlightedBarcode) {
      const el = document.querySelector(
        `[data-barcode="${highlightedBarcode}"]`
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [loading, highlightedBarcode]);

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
      title: t("medicine-list.Confirmation"),
      text: t("medicine-list.Noted"),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: t("medicine-list.Cancel"),
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("medicine-list.Yes"),
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

  const filteredMedicines = (medicines ?? []).filter((med) =>
    med.medicine_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-4">
            {t("medicine-list.Loading")}
          </td>
        </tr>
      );
    }

    if (!loading && filteredMedicines.length === 0) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-4 text-gray-500">
            {t("medicine-list.NotFound")}
          </td>
        </tr>
      );
    }

    return filteredMedicines.map((med) => {
      const isHighlighted = highlightedBarcode === med.barcode;

      return (
        <tr
          key={med.id}
          data-barcode={med.barcode}
          className={`hover:bg-gray-50 ${isHighlighted ? "bg-yellow-100" : ""}`}
        >
          <td className="border px-2 py-1">{med.medicine_name}</td>
          <td className="border px-2 py-1">${med.price}</td>
          <td className="hidden sm:table-cell border px-2 py-1">
            {med.weight}
          </td>
          <td className="hidden sm:table-cell border px-2 py-1">
            {Array.isArray(med.units) && med.units.length > 0
              ? med.units.map((unt) => (
                  <span key={unt.id} className="inline-block mr-1">
                    {unt.unit_name}
                  </span>
                ))
              : "—"}
          </td>
          <td className="hidden sm:table-cell border px-2 py-1">
            {Array.isArray(med.categories) && med.categories.length > 0
              ? med.categories.map((cat) => (
                  <span key={cat.id} className="inline-block mr-1">
                    {cat.category_name}
                  </span>
                ))
              : "—"}
          </td>
          <td
            className="border px-2 py-1 truncate max-w-8"
            title={med.medicine_detail}
          >
            {med.medicine_detail || <span className="text-gray-400">N/A</span>}
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
                <span className="text-gray-500 text-sm">Deleting...</span>
              ) : (
                <TbHttpDelete className="text-red-600 w-5 h-5" />
              )}
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="p-4 sm:mb-3 mb-12">
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        {t("medicine-list.TitleMedicine")}
      </h2>

      <input
        type="text"
        placeholder={t("medicine-list.SearchMedicine")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mb-4 w-full max-w-sm"
      />

      <table className="w-full border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-2">{t("medicine-list.Name")}</th>
            <th className="border px-2 py-2">{t("medicine-list.Price")}</th>
            <th className="hidden sm:table-cell border px-2 py-2">
              {t("medicine-list.Weight")}
            </th>
            <th className="hidden sm:table-cell border px-2 py-2">
              {t("medicine-list.Unit")}
            </th>
            <th className="hidden sm:table-cell border px-2 py-2">
              {t("medicine-list.Category")}
            </th>
            <th className="border px-2 py-2">
              {t("medicine-list.Description")}
            </th>
            <th className="border px-2 py-2">{t("medicine-list.Actions")}</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>

      {!loading && meta?.last_page > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {t("medicine-list.Prev")}
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
            {t("medicine-list.Next")}
          </button>
        </div>
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
