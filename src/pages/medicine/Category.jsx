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
  // const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [category, setCategory] = useState({
    category_name: "",
    description: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  //pagination

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      // setDeleteLoadingId(id);
      const success = await deleteCategory(id);
      if (success) {
        setSuccess("Category deleted successfully.");
        await fetchCategory();
      } else {
        setError("Failed to delete category.");
      }
    } catch (err) {
      console.error(err);
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
      fetchCategory(); // Refresh the list
    } catch (error) {
      console.error("Error updating category:", error);
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
      console.error("Fetch error:", err);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

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

        console.log("Sending payload:", payload);
        await createCategory(payload);
        setSuccess("category is create successfully !");
        setCategory({ category_name: "", description: "" });
        setShowModal(false);
        fetchCategory(); // Refresh list after create
      } catch (err) {
        console.error("Full error:", err);
        const errorMessage = err?.message || "Failed to create category.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [category]
  );

  return (
    <div className="sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Dashboard</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 shadow-lg active:shadow-none rounded-lg hover:bg-blue-700"
        >
          New
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white sm:p-6 p-3 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">Create Category</h2>
            <p className="text-sm text-gray-600 mb-4">
              Add a new category using the form below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {success && <p className="text-green-600 text-sm">{success}</p>}
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Category Name
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
                <label className="block mb-1 text-sm font-medium">
                  Description
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
                  className="px-4 py-2 border rounded-lg shadow-lg active:shadow-none text-red-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 shadow-lg active:shadow-none text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-md text-gray-700 dark:text-gray-200">
            {currentItems.map((cat, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 dark:border-gray-700"
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
                    className="text-blue-600  sm:hover:bg-slate-700 sm:hover:rounded-lg sm:p-4 sm:hover:bg-opacity-20"
                  >
                    <FaEdit className="sm:w-5 w-4 sm:h-5 h-4" />
                  </button>

                  <button
                    onClick={() => confirmDelete(cat.id)}
                    className="text-red-600 ml-5  sm:hover:bg-slate-700 sm:hover:rounded-lg sm:p-4 sm:hover:bg-opacity-20"
                  >
                    <FaTrash className="sm:w-5 w-4 sm:h-5 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showEditModal && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg-lg shadow-lg w-full max-w-md dark:bg-slate-800">
              <h2 className="text-xl font-semibold mb-4">Edit Category</h2>

              <label className="block mb-2 text-sm">Category Name</label>
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

              <label className="block mb-2 text-sm">Description</label>
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
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCategory}
                  className="px-4 py-2 bg-blue-600 text-white  rounded-lg hover:bg-opacity-50 hover:text-blue-700  shadow-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-center p-16 text-xl text-gray-500 dark:text-gray-400 mt-4">
            {t("Loading ...")}
          </p>
        )}
      </div>
      <div className="flex justify-center items-center mt-4 gap-1 flex-wrap">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
        >
          Prev
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
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryDashboard;
