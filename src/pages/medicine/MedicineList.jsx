import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { TbHttpDelete, TbListDetails } from "react-icons/tb";
import { getAllMedicines, deleteMedicine } from "../api/medicineService";
import EditMedicineModal from "./EditMedicineModal";
import { useTranslation } from "../../hooks/useTranslation";

/** ---------- Simple manual confirm modal ---------- */
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="med-confirm-title"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="med-confirm-title"
          className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center"
        >
          {title}
        </h3>
        <p className="text-gray-600 dark:text-slate-300 text-center mb-6">
          {message}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-400 dark:text-white"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
/** -------------------------------------------------- */

const MedicineList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [highlightedRow, setHighlightedRow] = useState(null);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  const [medicines, setMedicines] = useState([]);
  const [meta, setMeta] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMedicineData, setEditMedicineData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  // manual confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const highlightedBarcode = location.state?.highlightedBarcode || null;

  const fetchMedicines = async (page = 1) => {
    setLoading(true);
    try {
      const { data, meta } = await getAllMedicines(page);
      setMedicines(data);
      setMeta(meta);
    } catch (err) {
      setError(t("medicine-list.FetchError") || "Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // highlight scroller
  useEffect(() => {
    if (!loading && highlightedBarcode) {
      const el = document.querySelector(
        `[data-barcode="${highlightedBarcode}"]`
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedRow(highlightedBarcode);
        const timer = setTimeout(() => setHighlightedRow(null), 2000);
        return () => clearTimeout(timer);
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

  // open manual confirm
  const confirmDelete = (id) => {
    setConfirmId(id);
    setConfirmOpen(true);
  };

  const handleDeleteMedicine = async (id) => {
    try {
      setStatusLoadingId(id);
      await deleteMedicine(id);
      await fetchMedicines(currentPage);
    } catch (err) {
      // optionally show a toast/error banner
    } finally {
      setStatusLoadingId(null);
      setConfirmOpen(false);
      setConfirmId(null);
    }
  };

  const filteredMedicines = (medicines ?? []).filter((med) =>
    med.medicine_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetailClick = (id) => {
    navigate(`/medicinedetail/${id}`);
  };

  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-4 dark:text-slate-300">
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

    return filteredMedicines.map((med) => (
      <tr
        key={med.id}
        data-barcode={med.barcode}
        className={`border hover:bg-slate-100 transition duration-300 ${
          highlightedRow === med.barcode ? "bg-yellow-100 text-black" : ""
        }`}
      >
        <td className="border px-2 py-1">{med.medicine_name}</td>
        <td className="border px-2 py-1">
          {typeof med.price === "number" ? `$${med.price}` : med.price}
        </td>
        <td className="hidden sm:table-cell border px-2 py-1">{med.weight}</td>
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
          <button
            onClick={() => handleDetailClick(med.id)}
            title={t("medicine-list.Detail")}
          >
            <TbListDetails className="text-green-600 w-5 h-5" />
          </button>

          <button
            onClick={() => handleEditClick(med)}
            title={t("medicine-list.Edit")}
          >
            <BiEdit className="text-blue-600 w-5 h-5" />
          </button>

          <button
            onClick={() => confirmDelete(med.id)}
            disabled={statusLoadingId === med.id}
            className={`flex items-center gap-1 ${
              statusLoadingId === med.id ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={t("medicine-list.Delete")}
          >
            {statusLoadingId === med.id ? (
              <span className="text-gray-500 text-sm">
                {t("medicine-list.Deleting") || "Deleting..."}
              </span>
            ) : (
              <TbHttpDelete className="text-red-600 w-5 h-5" />
            )}
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-4 sm:mb-3 mb-12">
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        {t("medicine-list.TitleMedicine")}
      </h2>

      <div className="mb-4">
        <label htmlFor="med-search" className="sr-only">
          {t("medicine-list.SearchLabel") || t("medicine-list.SearchMedicine")}
        </label>
        <input
          id="med-search"
          type="text"
          placeholder={t("medicine-list.SearchMedicine")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full max-w-sm dark:bg-slate-700 dark:text-white"
        />
        <p className="text-xs text-gray-500 mt-1">
          {t("medicine-list.SearchHelp") || "Search by medicine name."}
        </p>
      </div>

      <table className="w-full border-gray-300 dark:bg-slate-800 dark:text-slate-300">
        <thead className="bg-green-600 text-white dark:bg-slate-500 text-md">
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

      {/* manual confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title={t("medicine-list.ConfirmTitle")}
        message={t("medicine-list.ConfirmText")}
        confirmText={t("medicine-list.ConfirmYes")}
        cancelText={t("medicine-list.ConfirmNo")}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmId(null);
        }}
        onConfirm={() => {
          if (confirmId) handleDeleteMedicine(confirmId);
        }}
      />
    </div>
  );
};

export default MedicineList;
