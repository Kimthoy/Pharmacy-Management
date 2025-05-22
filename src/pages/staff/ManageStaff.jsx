import { useState } from "react";
import { FaSort, FaCog, FaSun, FaMoon } from "react-icons/fa";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";
import { mockUsers } from "../../data/mockData"; // Import shared data

const ManageStaff = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editUserId, setEditUserId] = useState(null); // ID of user being edited
  const [confirmation, setConfirmation] = useState(""); // For success messages
  const [users, setUsers] = useState(mockUsers); // Use shared data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Manager",
    status: "Active",
  });
  const [formError, setFormError] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddStaff = () => {
    setModalMode("add");
    setFormData({ name: "", email: "", role: "Manager", status: "Active" });
    setFormError("");
    setShowModal(true);
  };

  const handleEditStaff = (user) => {
    setModalMode("edit");
    setEditUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    setConfirmation(
      t("staff.success.statusToggled", {
        name: user.name,
        status: newStatus,
      })
    );
    setTimeout(() => setConfirmation(""), 3000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name.trim()) {
      setFormError(t("staff.error.nameRequired"));
      return;
    }
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      setFormError(t("staff.error.invalidEmail"));
      return;
    }

    if (modalMode === "add") {
      // Add new staff
      const newUser = {
        id: Date.now(), // Timestamp-based ID
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: "default123", // Default password for new users
        role: formData.role,
        status: formData.status,
        profile_picture: "./default.jpg",
        contact: "",
        join_date: new Date().toISOString().split("T")[0],
        token: `mock-token-${Date.now()}`,
      };
      setUsers((prev) => [...prev, newUser]);
      setConfirmation(t("staff.success.added", { name: formData.name.trim() }));
    } else {
      // Edit existing staff
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editUserId
            ? {
                ...user,
                name: formData.name.trim(),
                email: formData.email.trim(),
                role: formData.role,
                status: formData.status,
              }
            : user
        )
      );
      setConfirmation(
        t("staff.success.edited", { name: formData.name.trim() })
      );
    }

    // Reset form and close modal
    setFormData({ name: "", email: "", role: "Manager", status: "Active" });
    setFormError("");
    setShowModal(false);
    setEditUserId(null);
    setTimeout(() => setConfirmation(""), 3000);
  };

  const sortedList = [...users].sort((a, b) => {
    return sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const filteredList = sortedList.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-700 dark:text-gray-200">
            {t("staff.StaffDashboard")}
          </h1>
          <span className="text-xs font-normal text-gray-400 dark:text-gray-300">
            {t("staff.StaffDashboardDesc")}
          </span>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={toggleTheme}
            className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-[4px] dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          <button
            onClick={handleAddStaff}
            className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-4 py-2 rounded-[4px] dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
            aria-label={t("staff.addStaff")}
          >
            {t("staff.addStaff")}
          </button>
        </div>
      </div>

      {confirmation && (
        <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-[4px]">
          {confirmation}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-700 border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">
            {t("staff.staffList")}
          </h2>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder={t("staff.searchPlaceholder")}
              value={searchQuery}
              onChange={handleSearch}
              className="text-xs border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
              aria-label={t("staff.searchPlaceholder")}
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-white dark:bg-gray-700 px-4 py-2 rounded-[4px] shadow-md dark:shadow-gray-600 flex items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600"
              aria-label={
                sortOrder === "asc" ? "Sort descending" : "Sort ascending"
              }
            >
              <FaSort />
            </button>
            <button
              className="bg-white dark:bg-gray-700 px-4 py-2 rounded-[4px] shadow-md dark:shadow-gray-600 flex items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600"
              aria-label="Settings"
            >
              <FaCog />
            </button>
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-center">
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("staff.name")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("staff.email")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("staff.role")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("staff.status")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("staff.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length > 0 ? (
              paginatedList.map((user) => (
                <tr
                  key={user.id}
                  className="border border-gray-300 dark:border-gray-600 text-center"
                >
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300">
                    {user.name}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 cursor-pointer">
                    {user.email}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300">
                    {user.role}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300">
                    {user.status}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEditStaff(user)}
                        disabled={user.status !== "Active"}
                        className={`text-xs border border-blue-500 dark:border-blue-400 px-2 py-1 rounded-[4px] transition ${
                          user.status === "Active"
                            ? "text-blue-500 dark:text-blue-400 hover:text-white hover:bg-blue-500 dark:hover:bg-blue-400"
                            : "text-blue-300 dark:text-blue-600 opacity-50 cursor-not-allowed"
                        }`}
                        aria-label={
                          user.status === "Active"
                            ? t("staff.edit", { name: user.name })
                            : t("staff.editDisabled", { name: user.name })
                        }
                        aria-disabled={user.status !== "Active"}
                      >
                        {t("staff.edit")}
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="text-xs text-orange-500 dark:text-orange-400 border border-orange-500 dark:border-orange-400 px-2 py-1 rounded-[4px] hover:text-white hover:bg-orange-500 dark:hover:bg-orange-400 transition"
                        aria-label={
                          user.status === "Active"
                            ? t("staff.disable", { name: user.name })
                            : t("staff.enable", { name: user.name })
                        }
                      >
                        {user.status === "Active"
                          ? t("staff.disable")
                          : t("staff.enable")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-16 border border-gray-300 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400"
                >
                  {t("staff.noRecords")}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 dark:text-gray-300 text-xs">
              {t("staff.show")}
            </span>
            <select
              className="text-xs border border-gray-400 dark:border-gray-600 px-2 py-2 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label={t("staff.entriesPerPage")}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
            <span className="text-gray-400 dark:text-gray-300 text-xs">
              {t("staff.entries")}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-[4px] dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition disabled:opacity-50"
              aria-label="Previous page"
            >
              {t("staff.previous")}
            </button>
            <span className="text-gray-700 dark:text-gray-200 text-xs">
              {t("staff.page")} {currentPage} {t("staff.of")} {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-[4px] dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition disabled:opacity-50"
              aria-label="Next page"
            >
              {t("staff.next")}
            </button>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                {modalMode === "add"
                  ? t("staff.addStaff")
                  : t("staff.editStaff")}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close modal"
              >
                ×
              </button>
              <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                {formError && (
                  <p className="text-red-500 dark:text-red-400 text-xs">
                    {formError}
                  </p>
                )}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-gray-700 dark:text-gray-200"
                  >
                    {t("staff.name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="mt-1 w-full text-xs border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-gray-700 dark:text-gray-200"
                  >
                    {t("staff.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="mt-1 w-full text-xs border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-xs font-medium text-gray-700 dark:text-gray-200"
                  >
                    {t("staff.role")}
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="mt-1 w-full text-xs border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                    aria-required="true"
                  >
                    <option value="admin">{t("staff.roleAdmin")}</option>
                    <option value="cashier">{t("staff.roleCashier")}</option>
                    <option value="Manager">{t("staff.roleManager")}</option>
                    <option value="Partner">{t("staff.rolePartner")}</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-xs font-medium text-gray-700 dark:text-gray-200"
                  >
                    {t("staff.status")}
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="mt-1 w-full text-xs border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                    aria-required="true"
                  >
                    <option value="Active">{t("staff.statusActive")}</option>
                    <option value="Inactive">
                      {t("staff.statusInactive")}
                    </option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-xs text-gray-500 dark:text-gray-400 border border-gray-400 dark:border-gray-600 px-4 py-2 rounded-[4px] hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Cancel"
                  >
                    {t("staff.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-4 py-2 rounded-[4px] dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
                    aria-label={
                      modalMode === "add" ? "Add staff" : "Save changes"
                    }
                  >
                    {modalMode === "add" ? t("staff.add") : t("staff.save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStaff;
