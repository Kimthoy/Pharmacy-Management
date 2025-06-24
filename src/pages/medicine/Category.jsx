import { useState } from "react";
import { FaSort, FaCog, FaEdit, FaTrash } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const mockCategories = [
  {
    id: 1,
    name: "Antibiotics",
    description: "Medicines to treat bacterial infections.",
  },
  {
    id: 2,
    name: "Painkillers",
    description: "Relieves pain and inflammation.",
  },
  { id: 3, name: "Antacids", description: "Reduces stomach acidity." },
];

const Category = () => {
  const { theme, toggleTheme } = useTheme();
  const [categories, setCategories] = useState(mockCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [showSettings, setShowSettings] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [showGridLines, setShowGridLines] = useState(true);
  const [tableFontSize, setTableFontSize] = useState("text-sm");

  const handleAddCategory = () => {
    setIsEditMode(false);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowModal(true);
  };

  const handleDeleteCategory = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setCategories(
        categories.map((category) =>
          category.id === currentCategory.id
            ? { ...category, ...formData }
            : category
        )
      );
    } else {
      const newCategory = { id: categories.length + 1, ...formData };
      setCategories([...categories, newCategory]);
    }
    setShowModal(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleExportCSV = () => {
    const headers = showDescription ? "id,name,description" : "id,name";
    const rows = categories
      .map((cat) =>
        showDescription
          ? `${cat.id},"${cat.name}","${cat.description || ""}"`
          : `${cat.id},"${cat.name}"`
      )
      .join("\n");
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "categories.csv";
    link.click();
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const newItemsPerPage = parseInt(e.target.elements.itemsPerPage.value, 10);
    const newSortOrder = e.target.elements.sortOrder.value;
    const newShowDescription = e.target.elements.showDescription.checked;
    const newShowGridLines = e.target.elements.showGridLines.checked;
    const newTableFontSize = e.target.elements.tableFontSize.value;
    if (newItemsPerPage > 0) {
      setItemsPerPage(newItemsPerPage);
      setSortOrder(newSortOrder);
      setShowDescription(newShowDescription);
      setShowGridLines(newShowGridLines);
      setTableFontSize(newTableFontSize);
      setCurrentPage(1);
      setShowSettings(false);
    }
  };

  const handleResetSettings = () => {
    setItemsPerPage(5);
    setSortOrder("asc");
    setShowDescription(true);
    setShowGridLines(true);
    setTableFontSize("text-sm");
    setCurrentPage(1);
    setShowSettings(false);
  };

  const sortedList = [...categories].sort((a, b) =>
    sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(b.name)
  );

  const filteredList = sortedList.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 mb-3  dark:bg-gray-900 min-h-screen max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-700 dark:text-gray-200">
            Category Dashboard
          </h1>
          <span className="text-xs font-normal text-gray-400 dark:text-gray-300">
            Manage medicine categories in the pharmacy.
          </span>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={handleAddCategory}
            className="text-xs rounded-lg text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-4 py-2  dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
          >
            Add Category
          </button>
         
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800  rounded-lg dark:shadow-gray-700  dark:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-bold text-gray-700 dark:text-gray-200">
            Category List
          </h2>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={handleSearch}
              className="text-md border border-gray-400 dark:border-gray-600 px-1 py-1 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-white dark:bg-gray-700 px-4 py-2 rounded-[4px] shadow-md dark:shadow-gray-600 flex items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600"
            >
              <FaSort />
            </button>
            <button
              onClick={handleSettings}
              className="bg-white dark:bg-gray-700 px-4 py-2 rounded-[4px] shadow-md dark:shadow-gray-600 flex items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600"
            >
              <FaCog />
            </button>
          </div>
        </div>

        {filteredList.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No categories found.
          </p>
        )}

        {filteredList.length > 0 && (
          <table
            className={`w-full border-collapse ${
              showGridLines ? "border border-gray-300 dark:border-gray-600" : ""
            } ${tableFontSize} text-gray-700 dark:text-gray-200`}
          >
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-center">
                <th
                  className={`p-3 ${
                    showGridLines
                      ? "border border-gray-300 dark:border-gray-600"
                      : ""
                  }`}
                >
                  Name
                </th>
                {showDescription && (
                  <th
                    className={`p-3 ${
                      showGridLines
                        ? "border border-gray-300 dark:border-gray-600"
                        : ""
                    }`}
                  >
                    Description
                  </th>
                )}
                <th
                  className={`p-3 ${
                    showGridLines
                      ? "border border-gray-300 dark:border-gray-600"
                      : ""
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((category) => (
                <tr
                  key={category.id}
                  className={`${
                    showGridLines
                      ? "border border-gray-300 dark:border-gray-600"
                      : ""
                  } text-center`}
                >
                  <td
                    className={`p-3 ${
                      showGridLines
                        ? "border border-gray-300 dark:border-gray-600"
                        : ""
                    } text-gray-400 dark:text-gray-300`}
                  >
                    {category.name}
                  </td>
                  {showDescription && (
                    <td
                      className={`p-3 ${
                        showGridLines
                          ? "border border-gray-300 dark:border-gray-600"
                          : ""
                      } text-gray-400 dark:text-gray-300`}
                    >
                      {category.description || "N/A"}
                    </td>
                  )}
                  <td
                    className={`p-3 ${
                      showGridLines
                        ? "border border-gray-300 dark:border-gray-600"
                        : ""
                    } text-gray-800 dark:text-gray-200`}
                  >
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-emerald-500 hover:text-emerald-700 mr-4 hover:scale-110 hover:shadow-lg"
                    >
                      <FaEdit className="" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-500 hover:text-red-700 hover:scale-110 hover:shadow-lg"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="sm:flex hidden items-center space-x-2">
            <span className="text-gray-400 dark:text-gray-300 text-xs">
              Show
            </span>
            <select
              className="text-xs border border-gray-400 dark:border-gray-600 px-2 py-2 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
            <span className="text-gray-400 dark:text-gray-300 text-xs">
              entries
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-[4px] dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700 dark:text-gray-200 text-xs">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-[4px] dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                {isEditMode ? "Edit Category" : "Add Category"}
              </h3>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-200"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-emerald-500 rounded-md hover:bg-emerald-600"
                  >
                    {isEditMode ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                Settings
              </h3>
              <form onSubmit={handleSaveSettings} className="mt-4">
                <div className="mb-4">
                  <label
                    htmlFor="itemsPerPage"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Items per Page
                  </label>
                  <input
                    type="number"
                    id="itemsPerPage"
                    min="1"
                    defaultValue={itemsPerPage}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="sortOrder"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Default Sort Order
                  </label>
                  <select
                    id="sortOrder"
                    defaultValue={sortOrder}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="tableFontSize"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Table Font Size
                  </label>
                  <select
                    id="tableFontSize"
                    defaultValue={tableFontSize}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="text-xs">Small</option>
                    <option value="text-sm">Medium</option>
                    <option value="text-base">Large</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="showDescription"
                      defaultChecked={showDescription}
                      className="mr-2 text-emerald-500 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Show Description Column
                    </span>
                  </label>
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="showGridLines"
                      defaultChecked={showGridLines}
                      className="mr-2 text-emerald-500 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Show Table Grid Lines
                    </span>
                  </label>
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="darkMode"
                      checked={theme === "dark"}
                      onChange={toggleTheme}
                      className="mr-2 text-emerald-500 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Dark Mode
                    </span>
                  </label>
                </div>
                <div className="flex justify-between space-x-2">
                  <button
                    type="button"
                    onClick={handleResetSettings}
                    className="px-4 py-2 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Reset to Default
                  </button>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowSettings(false)}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm text-white bg-emerald-500 rounded-md hover:bg-emerald-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
