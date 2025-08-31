import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from "../../hooks/useTranslation";
import {
  getAllUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../api/unitService";

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
      aria-labelledby="unit-confirm-title"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="unit-confirm-title"
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

const UnitDashboard = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [units, setUnits] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // create form saving
  const [saveLoading, setSaveLoading] = useState(false); // edit form saving

  const [unit, setUnit] = useState({ unit_name: "", desc: "" });
  const [selectedUnit, setSelectedUnit] = useState(null);

  // manual confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = units.filter((u) =>
    u.unit_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // confirm (manual)
  const confirmDelete = (id) => {
    setConfirmId(id);
    setConfirmOpen(true);
  };

  const handleDeleteUnit = async (id) => {
    try {
      const ok = await deleteUnit(id);
      if (ok) {
        setSuccess(t("unit.MsgDeleted"));
        await fetchUnits();
      } else {
        setError(t("unit.ErrDelete"));
      }
    } catch {
      setError(t("unit.ErrUnexpected"));
    } finally {
      setConfirmOpen(false);
      setConfirmId(null);
    }
  };

  const handleUpdateUnit = async () => {
    setSaveLoading(true);
    try {
      await updateUnit(selectedUnit.id, {
        unit_name: selectedUnit.unit_name,
        desc: selectedUnit.desc,
      });
      setShowEditModal(false);
      await fetchUnits();
    } catch {
      setError(t("unit.ErrUpdate"));
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEditUnit = (u) => {
    setSelectedUnit(u);
    setShowEditModal(true);
  };

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const data = await getAllUnits();
      setUnits(data);
    } catch {
      setError(t("unit.ErrFetch"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUnitChange = (e) => {
    const { name, value } = e.target;
    setUnit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsLoading(true);
      try {
        await createUnit({ unit_name: unit.unit_name, desc: unit.desc });
        setSuccess(t("unit.MsgCreated"));
        setUnit({ unit_name: "", desc: "" });
        setShowModal(false);
        await fetchUnits();
      } catch (err) {
        setError(err?.message || t("unit.ErrCreate"));
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [unit]
  );

  return (
    <div className="sm:p-6 dark:text-slate-300 mb-20">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("unit.Title")}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {t("unit.Subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="unit-search" className="sr-only">
            {t("unit.SearchLabel")}
          </label>
          <input
            id="unit-search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t("unit.SearchPlaceholder")}
            className="w-full sm:w-64 border rounded-lg px-3 py-2"
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 shadow-lg active:shadow-none rounded-lg hover:bg-blue-700"
          >
            {t("unit.BtnNew")}
          </button>
        </div>
      </div>

      {/* create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 sm:p-6 p-3 rounded-xl shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">{t("unit.TitleNew")}</h2>
            <p className="text-sm dark:text-slate-300 text-gray-600 mb-4">
              {t("unit.FormDesc")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {success && <p className="text-green-600 text-sm">{success}</p>}
              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div>
                <label
                  htmlFor="unit_name"
                  className="block mb-1 text-sm font-medium"
                >
                  {t("unit.Name")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="unit_name"
                  type="text"
                  name="unit_name"
                  value={unit.unit_name}
                  onChange={handleUnitChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg dark:text-slate-900"
                  placeholder={t("unit.NamePh")}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t("unit.NameHelp")}
                </p>
              </div>

              <div>
                <label
                  htmlFor="unit_desc"
                  className="block mb-1 text-sm font-medium"
                >
                  {t("unit.Desc")}
                </label>
                <textarea
                  id="unit_desc"
                  name="desc"
                  value={unit.desc}
                  onChange={handleUnitChange}
                  className="w-full border px-3 py-2 rounded-lg dark:text-slate-900"
                  placeholder={t("unit.DescPh")}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t("unit.DescHelp")}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 dark:bg-slate-200 py-2 border rounded-lg shadow-lg active:shadow-none text-red-700 dark:hover:bg-slate-300"
                >
                  {t("unit.BtnCancel")}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 shadow-lg active:shadow-none text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
                >
                  {isLoading ? t("unit.BtnSaving") : t("unit.BtnSave")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-600 text-white dark:bg-slate-800">
              <th className="border px-4 py-2 text-left">
                {t("unit.ColName")}
              </th>
              <th className="border px-4 py-2 text-left">
                {t("unit.ColDesc")}
              </th>
              <th className="border px-4 py-2 text-left">
                {t("unit.ColActions")}
              </th>
            </tr>
          </thead>
          <tbody className="text-md text-gray-700 dark:text-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((u) => (
                <tr
                  key={u.id}
                  className="border-t even:bg-slate-100 dark:even:bg-slate-800 border-gray-200 dark:border-gray-700"
                >
                  <td
                    className="px-4 py-3 max-w-[180px] truncate"
                    title={u.unit_name}
                  >
                    {u.unit_name}
                  </td>
                  <td
                    className="px-4 py-3 max-w-[320px] truncate"
                    title={u.desc}
                  >
                    {u.desc || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditUnit(u)}
                        className="text-blue-600 sm:hover:bg-slate-700 sm:hover:rounded-lg sm:p-2 sm:hover:bg-opacity-20"
                        title={t("unit.BtnEdit")}
                        aria-label={t("unit.BtnEdit")}
                      >
                        <FaEdit className="sm:w-5 w-4 sm:h-5 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(u.id)}
                        className="text-red-600 sm:hover:bg-slate-700 sm:hover:rounded-lg sm:p-2 sm:hover:bg-opacity-20"
                        title={t("unit.BtnDelete")}
                        aria-label={t("unit.BtnDelete")}
                      >
                        <FaTrash className="sm:w-5 w-4 sm:h-5 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  {t("unit.NotFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* edit modal */}
        {showEditModal && selectedUnit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md dark:bg-slate-800">
              <h2 className="text-xl font-semibold mb-2">
                {t("unit.FormEdit")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                {t("unit.EditDesc")}
              </p>

              <div className="mb-4">
                <label htmlFor="edit_unit_name" className="block mb-1 text-sm">
                  {t("unit.Name")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit_unit_name"
                  type="text"
                  value={selectedUnit.unit_name}
                  onChange={(e) =>
                    setSelectedUnit({
                      ...selectedUnit,
                      unit_name: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder={t("unit.NamePh")}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t("unit.NameHelp")}
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="edit_unit_desc" className="block mb-1 text-sm">
                  {t("unit.Desc")}
                </label>
                <textarea
                  id="edit_unit_desc"
                  value={selectedUnit.desc || ""}
                  onChange={(e) =>
                    setSelectedUnit({ ...selectedUnit, desc: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder={t("unit.DescPh")}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t("unit.DescHelp")}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 dark:bg-gray-400 dark:text-white"
                >
                  {t("unit.BtnCancel")}
                </button>
                <button
                  onClick={handleUpdateUnit}
                  disabled={saveLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {saveLoading ? t("unit.BtnSaving") : t("unit.BtnSave")}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-center p-16 text-xl text-gray-500 dark:text-gray-400 mt-4">
            {t("unit.Loading")}
          </p>
        )}
      </div>

      {/* pagination */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50"
        >
          {t("unit.BtnPrev")}
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
          className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          {t("unit.BtnNext")}
        </button>
      </div>

      {/* manual confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title={t("unit.ConfirmTitle")}
        message={t("unit.ConfirmText")}
        confirmText={t("unit.ConfirmYes")}
        cancelText={t("unit.ConfirmNo")}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmId(null);
        }}
        onConfirm={() => {
          if (confirmId) handleDeleteUnit(confirmId);
        }}
      />
    </div>
  );
};

export default UnitDashboard;
