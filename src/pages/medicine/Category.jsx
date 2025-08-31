import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from "../../hooks/useTranslation";

import {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryService";

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
      aria-labelledby="confirm-title"
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="confirm-title"
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

const CategoryDashboard = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveloading, setSaveLoading] = useState(false);

  const [category, setCategory] = useState({
    category_name: "",
    description: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  // manual confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = categories.filter((cat) =>
    cat.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const totalCategory = categories.length;

  // open confirm modal (manual)
  const confirmDelete = (id) => {
    setConfirmId(id);
    setConfirmOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const ok = await deleteCategory(id);
      if (ok) {
        setSuccess(t("category.MsgDeleted"));
        await fetchCategory();
      } else {
        setError(t("category.ErrDelete"));
      }
    } catch {
      setError(t("category.ErrUnexpected"));
    } finally {
      setConfirmOpen(false);
      setConfirmId(null);
    }
  };

  const handleUpdateCategory = async () => {
    setSaveLoading(true);
    try {
      await updateCategory(selectedCategory.id, {
        category_name: selectedCategory.category_name,
        description: selectedCategory.description,
      });
      setShowEditModal(false);
      await fetchCategory();
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEditCategory = (cat) => {
    setSelectedCategory(cat);
    setShowEditModal(true);
  };

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const data = await getAllCategory();
      setCategories(data);
    } catch {
      setError(t("category.ErrFetch"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsLoading(true);
      try {
        await createCategory({
          category_name: category.category_name,
          description: category.description,
        });
        setSuccess(t("category.MsgCreated"));
        setCategory({ category_name: "", description: "" });
        setShowModal(false);
        await fetchCategory();
      } catch (err) {
        setError(err?.message || t("category.ErrCreate"));
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category]
  );

  return (
    <div className="sm:p-6 mb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-slate-300">
            {t("category.Title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            {t("category.Subtitle")}
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            {t("category.Total").replace("{{count}}", totalCategory)}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="cat-search" className="sr-only">
            {t("category.SearchLabel")}
          </label>
          <input
            id="cat-search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t("category.SearchPlaceholder")}
            className="w-full sm:w-64 border rounded-lg px-3 py-2"
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 shadow-lg rounded-lg hover:bg-blue-700 active:shadow-none"
          >
            {t("category.New")}
          </button>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 sm:p-6 p-4 rounded-xl shadow-md w-full max-w-md">
            <h2 className="text-lg dark:text-slate-300 font-bold mb-2">
              {t("category.CreateCategory")}
            </h2>
            <p className="text-sm dark:text-slate-300 text-gray-600 mb-4">
              {t("category.Desc")}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {success && <p className="text-green-600 text-sm">{success}</p>}
              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div>
                <label
                  htmlFor="category_name"
                  className="block dark:text-slate-300 mb-1 text-sm font-medium"
                >
                  {t("category.Name")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="category_name"
                  type="text"
                  name="category_name"
                  value={category.category_name}
                  onChange={handleCategoryChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder={t("category.NamePh")}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t("category.NameHelp")}
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block dark:text-slate-300 mb-1 text-sm font-medium"
                >
                  {t("category.Description")}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={category.description}
                  onChange={handleCategoryChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder={t("category.DescriptionPh")}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t("category.DescriptionHelp")}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg shadow-lg active:shadow-none text-red-700 dark:bg-slate-100"
                >
                  {t("category.BtnCancel")}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 shadow-lg active:shadow-none text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
                >
                  {isLoading ? t("category.BtnSaving") : t("category.BtnSave")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-600 text-white dark:bg-slate-500 dark:text-slate-200">
              <th className="border px-4 py-2 text-left">
                {t("category.CateName")}
              </th>
              <th className="border px-4 py-2 text-left">
                {t("category.CateDescription")}
              </th>
              <th className="border px-4 py-2 text-left">
                {t("category.Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="text-md text-gray-700 dark:text-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-t even:bg-slate-100 dark:even:bg-slate-600 border-gray-200 dark:border-gray-700"
                >
                  <td
                    className="px-4 py-3 max-w-[220px] truncate"
                    title={cat.category_name}
                  >
                    {cat.category_name}
                  </td>
                  <td
                    className="px-4 py-3 max-w-[320px] truncate"
                    title={cat.description}
                  >
                    {cat.description || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="text-blue-600 sm:hover:bg-slate-700 sm:hover:rounded-lg sm:p-2 sm:hover:bg-opacity-20"
                        title={t("category.BtnEdit")}
                        aria-label={t("category.BtnEdit")}
                      >
                        <FaEdit className="sm:w-5 w-4 sm:h-5 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(cat.id)}
                        className="text-red-600 sm:hover:bg-slate-700 sm:hover:rounded-lg sm:p-2 sm:hover:bg-opacity-20"
                        title={t("category.BtnDelete")}
                        aria-label={t("category.BtnDelete")}
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
                  {t("category.NotFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Edit Modal */}
        {showEditModal && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-2">
                {t("category.CateEdit")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                {t("category.EditDesc")}
              </p>

              <div className="mb-4">
                <label htmlFor="edit_name" className="block mb-1 text-sm">
                  {t("category.ColName")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit_name"
                  type="text"
                  value={selectedCategory.category_name}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      category_name: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder={t("category.NamePh")}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t("category.NameHelp")}
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="edit_desc" className="block mb-1 text-sm">
                  {t("category.ColDesc")}
                </label>
                <textarea
                  id="edit_desc"
                  value={selectedCategory.description || ""}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder={t("category.DescriptionPh")}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t("category.DescriptionHelp")}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 dark:bg-gray-400 dark:text-white"
                >
                  {t("category.BtnCancel")}
                </button>
                <button
                  disabled={saveloading}
                  onClick={handleUpdateCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {saveloading
                    ? t("category.BtnSaving")
                    : t("category.BtnSave")}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-center p-16 text-xl text-gray-500 dark:text-gray-400 mt-4">
            {t("category.Loading")}
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-1 flex-wrap">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
        >
          {t("category.Prev")}
        </button>

        {(() => {
          const pages = [];
          const maxPagesToShow = 5;
          let start = Math.max(currentPage - 2, 1);
          let end = Math.min(start + maxPagesToShow - 1, totalPages);

          if (end - start < maxPagesToShow - 1) {
            start = Math.max(end - maxPagesToShow + 1, 1);
          }

          if (start > 1) {
            pages.push(
              <button
                key={1}
                onClick={() => setCurrentPage(1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                1
              </button>
            );
            if (start > 2) pages.push(<span key="start-ellipsis">...</span>);
          }

          for (let i = start; i <= end; i++) {
            pages.push(
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === i ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {i}
              </button>
            );
          }

          if (end < totalPages) {
            if (end < totalPages - 1)
              pages.push(<span key="end-ellipsis">...</span>);
            pages.push(
              <button
                key={totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {totalPages}
              </button>
            );
          }

          return pages;
        })()}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
        >
          {t("category.Next")}
        </button>
      </div>

      {/* Manual confirm dialog (replaces SweetAlert) */}
      <ConfirmDialog
        open={confirmOpen}
        title={t("category.ConfirmTitle")}
        message={t("category.ConfirmText")}
        confirmText={t("category.ConfirmYes")}
        cancelText={t("category.ConfirmNo")}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmId(null);
        }}
        onConfirm={() => {
          if (confirmId) handleDeleteCategory(confirmId);
        }}
      />
    </div>
  );
};

export default CategoryDashboard;
