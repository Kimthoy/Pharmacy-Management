import { useState, useEffect } from "react";
import { FaSort, FaCog, FaSun, FaMoon } from "react-icons/fa";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";
import { FaRegEdit } from "react-icons/fa";
import { IoMdCheckboxOutline } from "react-icons/io";
import { LuBan } from "react-icons/lu";
import {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus,
} from "../api/userService";

const ManageStaff = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editUserId, setEditUserId] = useState(null);
  const [confirmation, setConfirmation] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin", // Changed from "Manager" to "admin"
    status: "Active",
    password: "", // Added for createUser
  });
  const [formError, setFormError] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
      console.log("Full response:", response);
      let transformedUsers = [];
      if (response.data && Array.isArray(response.data)) {
        transformedUsers = response.data.map((user) => ({
          id: user.id,
          name: user.username || user.name || "Unknown",
          email: user.email || "No email",
          role: user.role || "admin",
          status: user.is_active ? "Active" : "Inactive",
          username: user.username || user.name || "Unknown",
          phone: user.phone || "",
          gender: user.gender || "",
        }));
      } else {
        console.warn("Unexpected response data format:", response.data);
      }
      setUsers(transformedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddStaff = () => {
    setModalMode("add");
    setFormData({
      name: "",
      email: "",
      role: "admin",
      status: "Active",
      password: "",
      phone: "",
      gender: "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleEditStaff = (user) => {
    setModalMode("edit");
    setEditUserId(user.id);
    setFormData({
      username: user.username || user.name || "",
      name: user.name || user.username || "",
      email: user.email || "",
      role: user.role || "admin",
      status: user.is_active ? "Active" : "Inactive",
      password: "",
      phone: user.phone || "",
      gender: user.gender || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
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
    if (modalMode === "add" && !formData.password.trim()) {
      setFormError(t("staff.error.passwordRequired"));
      return;
    }
    try {
      const updatedData = {
        username: formData.name,
        email: formData.email,
        role: formData.role,
        is_active: formData.status === "Active",
        phone: formData.phone || null,
        gender: formData.gender || null,
      };
      if (formData.password.trim()) {
        updatedData.password = formData.password;
      }
      if (modalMode === "add") {
        await createUser(updatedData);
        setConfirmation(t("staff.success.staffAdded", { name: formData.name }));
      } else {
        await updateUser(editUserId, updatedData);
        setConfirmation(
          t("staff.success.staffUpdated", { name: formData.name })
        );
      }
      setShowModal(false);
      fetchUsers();
      setFormError("");
      setTimeout(() => setConfirmation(""), 3000);
    } catch (error) {
      console.error("Error submitting form:", {
        message: error.message,
        response: error.response ? error.response.data : "No response",
        status: error.response ? error.response.status : "No status",
      });
      setFormError(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0] ||
          error.message ||
          t("staff.error.submitFailed")
      );
    }
  };

  const handleToggleStatus = async (user) => {
    setIsToggling((prev) => ({ ...prev, [user.id]: true }));
    try {
      const newStatus = user.status === "Active" ? "Inactive" : "Active";
      await toggleUserStatus({ id: user.id });
      fetchUsers();
      setConfirmation(
        t("staff.success.statusToggled", { name: user.name, status: newStatus })
      );
      setTimeout(() => setConfirmation(""), 3000);
    } catch (err) {
      console.error("Error toggling status:", {
        message: err.message,
        response: err.response ? err.response.data : "No response",
        status: err.response ? err.response.status : "No status",
      });
      const errorMessage =
        err.response?.data?.message === "Unauthenticated."
          ? t("staff.error.unauthenticated")
          : err.response?.data?.message ||
            err.response?.data?.errors?.[0] ||
            t("staff.error.statusToggleFailed", { error: "Unknown error" });
      setConfirmation(errorMessage);
      setTimeout(() => setConfirmation(""), 3000);
    } finally {
      setIsToggling((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sortedList = Array.isArray(users)
    ? [...users].sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      )
    : [];

  const filteredList = sortedList.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 mb-14 bg-gray-100 dark:bg-gray-900 min-h-screen max-w-6xl mx-auto">
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

        <table className="w-full  dark:text-slate-200 border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="text-center ">
              <td className="py-2 px-3">{t("staff.name")}</td>
              <td className="py-2 px-3">{t("staff.email")}</td>
              <td className="py-2 px-3">{t("staff.role")}</td>
              <td className="py-2 px-3">{t("staff.status")}</td>
              <td className="py-2 px-3">{t("staff.actions")}</td>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length > 0 ? (
              paginatedList.map((user) => (
                <tr
                  key={user.id}
                  className="border dark:hover:bg-slate-700 hover:bg-slate-200 hover:cursor-pointer hover:shadow-md transition-all border-gray-300 dark:border-gray-600 text-center"
                >
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300">
                    {user.name || "No name"}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 cursor-pointer">
                    {user.email || "No email"}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300">
                    {user.role || "No role"}
                  </td>
                  <td
                    className={`p-3 border border-gray-300 dark:border-gray-600 ${
                      user.status === "Active"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {user.status || "No status"}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEditStaff(user)}
                        disabled={user.status !== "Active"}
                        className={`text-xs border border-blue-500 dark:border-blue-400 px-2 py-1 rounded-[4px] transition ${
                          user.status === "Active"
                            ? "text-blue-600 hover:text-white hover:bg-blue-600 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white dark:hover:shadow-md dark:hover:shadow-slate-300"
                            : "text-blue-300 dark:text-blue-600 opacity-50 cursor-not-allowed"
                        }`}
                        aria-label={
                          user.status === "Active"
                            ? t("staff.edit")
                            : t("staff.editDisabled")
                        }
                        aria-disabled={user.status !== "Active"}
                      >
                        <FaRegEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={isToggling[user.id]}
                        className={`text-xs border px-2 py-1 rounded-[4px] transition ${
                          user.status === "Active"
                            ? "text-green-600 border-green-600 hover:text-white hover:bg-green-600 dark:text-green-600 dark:border-green-200 dark:hover:bg-green-600 dark:hover:text-white dark:hover:shadow-md dark:hover:shadow-slate-300"
                            : "text-red-600 border-red-600 hover:text-white hover:bg-red-600 dark:text-red-600 dark:border-red-200 dark:hover:bg-red-600 dark:hover:text-white dark:hover:shadow-md dark:hover:shadow-slate-300"
                        } ${
                          isToggling[user.id]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        aria-label={
                          user.status === "Active" ? t("disable") : t("enable")
                        }
                      >
                        {isToggling[user.id] ? (
                          t("staff.loading")
                        ) : user.status === "Active" ? (
                          <IoMdCheckboxOutline className="w-5 h-5" />
                        ) : (
                          <LuBan className="w-5 h-5" />
                        )}
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
                    htmlFor="gender"
                    className="block text-xs font-medium text-gray-700 dark:text-gray-200"
                  >
                    {t("staff.gender")}
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    className="mt-1 w-full text-xs border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="">{t("staff.selectGender")}</option>
                    <option value="male">{t("staff.male")}</option>
                    <option value="female">{t("staff.female")}</option>
                    <option value="other">{t("staff.other")}</option>
                    <option value="prefer_not_to_say">
                      {t("staff.preferNotToSay")}
                    </option>
                  </select>
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
                {modalMode === "add" && (
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium text-gray-700 dark:text-gray-200"
                    >
                      {t("staff.password")}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className="mt-1 w-full text-xs border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                      aria-required="true"
                    />
                  </div>
                )}
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
                    <option value="partner">{t("staff.rolePartner")}</option>
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
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-medium text-gray-700 dark:text-gray-200"
                  >
                    {t("staff.phone")}
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="mt-1 w-full text-xs border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                  />
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
