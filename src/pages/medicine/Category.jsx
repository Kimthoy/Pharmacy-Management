import React, { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useTranslation } from "../../hooks/useTranslation";

import {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryService";

const CategoryDashboard = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveloading, setSaveLoading] = useState(false);
  

  const [category, setCategory] = useState({
    category_name: "",
    description: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  //pagination

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = categories.filter((cat) =>
    cat.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
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
        handleDeleteCategory(id);
      }
    });
  };
  const handleDeleteCategory = async (id) => {
    try {
      
      const success = await deleteCategory(id);
      if (success) {
        setSuccess("Category deleted successfully.");
        await fetchCategory();
      } else {
        setError("Failed to delete category.");
      }
    } catch (err) {
     
      setError("An unexpected error occurred.");
    }
  };

  const handleUpdateCategory = async () => {
    try {
      await updateCategory(selectedCategory.id, {
        category_name: selectedCategory.category_name,
        description: selectedCategory.description,
      });
      setShowEditModal(false);
      fetchCategory(); 
    } catch (error) {
     
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const data = await getAllCategory();
      setCategories(data);
    } catch (err) {
      console.log("Error :", err);
      setError("Failed to fetch categories.");
    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  const totalCategory = categories.length;

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsLoading(true);
      try {
        const payload = {
          category_name: category.category_name,
          description: category.description,
        };

       
        await createCategory(payload);
        setSuccess("category is create successfully !");
        setCategory({ category_name: "", description: "" });
        setShowModal(false);
        fetchCategory(); 
      } catch (err) {
       
        const errorMessage = err?.message || "Failed to create category.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [category]
  );

  return (
    <div className="sm:p-6 mb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-slate-300">
          {t("category.Title")}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 shadow-lg active:shadow-none rounded-lg hover:bg-blue-700"
        >
          {t("category.New")}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-800 sm:p-6 p-3 rounded-lg shadow-md w-full max-w-md">
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
                <label className="block dark:text-slate-300 mb-1 text-sm font-medium">
                  {t("category.Name")}
                </label>
                <input
                  type="text"
                  name="category_name"
                  value={category.category_name}
                  onChange={handleCategoryChange}
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block dark:text-slate-300 mb-1 text-sm font-medium">
                  {t("category.Description")}
                </label>
                <textarea
                  name="description"
                  value={category.description}
                  onChange={handleCategoryChange}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 dark:bg-slate-100 py-2 border rounded-lg shadow-lg active:shadow-none text-red-700"
                >
                  {t("category.BtnCancel")}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 shadow-lg active:shadow-none text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  {isLoading ? t("category.BtnSaving") : t("category.BtnSave")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-green-300 text-gray-600 w-full px-4 py-2 rounded-lg">
        {t("category.Totalofcateogry")} : {totalCategory}{" "}
        {t("category.categories")}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 dark:bg-slate-500 dark:text-slate-200 ">
              <td className="border px-4 py-2 text-left">
                {t("category.CateName")}
              </td>
              <td className="border px-4 py-2 text-left">
                {t("category.CateDescription")}
              </td>
              <td className="border px-4 py-2 text-left">
                {t("category.Actions")}
              </td>
            </tr>
          </thead>
          <tbody className="text-md text-gray-700 dark:text-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((cat, index) => (
                <tr
                  key={index}
                  className="border-t  even:bg-slate-100 dark:even:bg-slate-600 dark: border-gray-200 dark:border-gray-700"
                >
                  <td
                    className="px-4 py-3 max-w-[150px] truncate"
                    title={cat.category_name}
                  >
                    {cat.category_name}
                  </td>

                  <td
                    className="px-4 py-3 max-w-[200px] truncate"
                    title={cat.description}
                  >
                    {cat.description}
                  </td>

                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="text-blue-600 sm:hover:bg-slate-700 sm:hover:rounded-lg sm:p-4 sm:hover:bg-opacity-20"
                    >
                      <FaEdit className="sm:w-5 w-4 sm:h-5 h-4" />
                    </button>

                    <button
                      onClick={() => confirmDelete(cat.id)}
                      className="text-red-600 ml-5 sm:hover:bg-slate-700 sm:hover:rounded-lg sm:p-4 sm:hover:bg-opacity-20"
                    >
                      <FaTrash className="sm:w-5 w-4 sm:h-5 h-4" />
                    </button>
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
        {showEditModal && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg-lg shadow-lg w-full max-w-md dark:bg-slate-800">
              <h2 className="text-xl font-semibold mb-4">
                {t("category.CateEdit")}
              </h2>

              <label className="block mb-2 text-sm">
                {t("category.ColName")}
              </label>
              <input
                type="text"
                value={selectedCategory.category_name}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    category_name: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded-lg mb-4"
              />

              <label className="block mb-2 text-sm">
                {t("category.ColDesc")}
              </label>
              <textarea
                value={selectedCategory.description}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    description: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded-lg mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white transition-all rounded-lg shadow-lg hover:bg-opacity-65 hover:text-red-700"
                >
                  {t("category.BtnCancel")}
                </button>
                <button
                  disabled={saveloading}
                  onClick={handleUpdateCategory}
                  className="px-4 py-2 bg-blue-600 text-white  rounded-lg hover:bg-opacity-50 hover:text-blue-700  shadow-lg"
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
          <p className="text-center p-16 text-xl text-gray-500 dark:text-gray-400 mt-4"></p>
        )}
      </div>
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
    </div>
  );
};

export default CategoryDashboard;
