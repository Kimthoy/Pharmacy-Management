import { useState, useEffect } from "react";
import { FaSort, FaCog } from "react-icons/fa";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";
import { FaRegEdit } from "react-icons/fa";
import { TbHttpDelete } from "react-icons/tb";
import { GrView } from "react-icons/gr";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
} from "../api/userService";

const ManageStaff = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editUserId, setEditUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const confirmDeleteUser = (user) => {
    setDeleteConfirmUser(user);
  };

  const genderOptions = [
    { value: "", label: t("staff.selectGender") },
    { value: "male", label: t("staff.male") },
    { value: "female", label: t("staff.female") },
  ];

  const roleOptions = [
    { value: "", label: "Admin" },
    { value: "cashier", label: "Cashier" },
    { value: "partner", label: "Partner" },
  ];

  const filteredRoleOptions =
    modalMode === "add"
      ? roleOptions.filter((opt) => opt.label !== "Admin")
      : formData.role === "Admin"
      ? roleOptions
      : roleOptions.filter((opt) => opt.label !== "Admin");

  const statusOptions = [
    { value: "Active", label: t("staff.statusActive") },
    { value: "Inactive", label: t("staff.statusInactive") },
  ];

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirmUser) return;

    setIsDeleting(true); // ✅ start loading

    try {
      await deleteUser(deleteConfirmUser.id);
      toast.success(`${deleteConfirmUser.username} deleted successfully`);
      fetchUsers(); // refresh list
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false); // ✅ stop loading
      setDeleteConfirmUser(null); // close modal
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmUser(null);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
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
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ When adding a staff member
  const handleAddStaff = () => {
    setModalMode("add");

    setFormData({
      name: "",
      email: "",
      role: "cashier",
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
      role: user.role?.toLowerCase() || "cashier",
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
        toast.success(t("staff.success.staffAdded", { name: formData.name }));
      } else {
        await updateUser(editUserId, updatedData);
        toast.success(t("staff.success.staffUpdated", { name: formData.name }));
      }
      setShowModal(false);
      fetchUsers();
      setFormError("");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0] ||
          error.message ||
          t("staff.error.submitFailed")
      );
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

 
const filteredList = sortedList
  // Search filter
  .filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  // ✅ Hide admins
  .filter((user) => user.role?.toLowerCase() !== "admin");

const totalPages = Math.ceil(filteredList.length / itemsPerPage);

const paginatedList = filteredList.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  return (
    <div className="sm:p-2 mb-14 dark:bg-gray-900 min-h-screen max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-700 dark:text-gray-200">
            {t("staff.StaffDashboard")}
          </h1>
          <span className="text-md font-normal text-gray-400 dark:text-gray-300">
            {t("staff.StaffDashboardDesc")}
          </span>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={handleAddStaff}
            className="text-md text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-4 py-1 rounded-lg dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
            aria-label={t("staff.addStaff")}
          >
            {t("staff.addStaff")}
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border-gray-200 dark:border-gray-600">
        {/* Search & sort */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-bold text-gray-700 dark:text-gray-200">
            {t("staff.staffList")}
          </h2>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder={t("staff.searchPlaceholder")}
              value={searchQuery}
              onChange={handleSearch}
              className="text-md border border-gray-400 dark:border-gray-600 px-3 py-1 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
              aria-label={t("staff.searchPlaceholder")}
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-lg dark:shadow-gray-600 flex items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600"
              aria-label={
                sortOrder === "asc" ? "Sort descending" : "Sort ascending"
              }
            >
              <FaSort />
            </button>
            <button
              className="bg-white hidden sm:flex dark:bg-gray-700 px-4 py-2 rounded-lg shadow-lg dark:shadow-gray-600 items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600"
              aria-label="Settings"
            >
              <FaCog />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="sm:w-full w-[444px]">
          <table className="w-full dark:text-slate-100 border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="text-center ">
                <td className="py-2 px-3">{t("staff.name")}</td>
                <td className="py-2 px-3 sm:flex hidden">{t("staff.email")}</td>
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
                    className={`border text-center transition-all border-gray-300 dark:border-gray-600 
                      ${
                        user.status === "Active"
                          ? "hover:bg-slate-200 dark:hover:bg-slate-700 hover:cursor-pointer hover:shadow-lg"
                          : "bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300">
                      {user.name || "No name"}
                    </td>
                    <td className="sm:flex hidden p-4 border-gray-300 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 cursor-pointer">
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
                      {user.role === "admin" ? (
                        <span className="text-gray-400 italic">
                          Admin Protected
                        </span>
                      ) : (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEditStaff(user)}
                            className="text-md border text-blue-700 border-blue-500 dark:border-blue-400 px-2 py-1 rounded-lg transition hover:bg-blue-600 hover:text-white"
                          >
                            <FaRegEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleViewDetail(user)}
                            className="text-md border px-2 py-1 rounded-lg transition text-green-600 border-green-600 hover:text-white hover:bg-green-600 dark:text-green-400 dark:border-green-200 dark:hover:bg-green-600 dark:hover:text-white dark:hover:shadow-lg dark:hover:shadow-slate-300"
                          >
                            <GrView className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => confirmDeleteUser(user)}
                            className="text-md border border-red-500 dark:border-red-400 px-2 py-1 rounded-lg transition align-middle text-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <TbHttpDelete className="w-5 h-5" />
                          </button>
                        </div>
                      )}
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

          {/* User details modal */}
          {isModalOpen && selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
              <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition"
                  aria-label="Close modal"
                >
                  ✕
                </button>
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center">
                  👤 User Details
                </h2>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      👤 Username:
                    </span>{" "}
                    {selectedUser.username}
                  </li>
                  <li>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      📧 Email:
                    </span>{" "}
                    {selectedUser.email}
                  </li>
                  <li>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      🔐 Role:
                    </span>{" "}
                    {selectedUser.role}
                  </li>
                  <li>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      📱 Phone:
                    </span>{" "}
                    {selectedUser.phone}
                  </li>
                  <li>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      📈 Status:
                    </span>{" "}
                    {selectedUser.status}
                  </li>
                  <li>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      ⚧ Gender:
                    </span>{" "}
                    {selectedUser.gender}
                  </li>
                </ul>
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          {deleteConfirmUser && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  Confirm Deletion
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    {deleteConfirmUser.username}
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirmed}
                    disabled={isDeleting}
                    className={`px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 ${
                      isDeleting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="hidden items-center space-x-2 sm:flex">
            <span className="text-gray-400 dark:text-gray-300 text-md">
              {t("staff.show")}
            </span>
            <select
              className="text-md border border-gray-400 dark:border-gray-600 px-2 py-2 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
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
            <span className="text-gray-400 dark:text-gray-300 text-md">
              {t("staff.entries")}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="text-md text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-lg dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition disabled:opacity-50"
              aria-label="Previous page"
            >
              {t("staff.previous")}
            </button>
            <span className="text-gray-700 dark:text-gray-200 text-md">
              {t("staff.page")} {currentPage} {t("staff.of")} {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="text-md text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-lg dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition disabled:opacity-50"
              aria-label="Next page"
            >
              {t("staff.next")}
            </button>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white sm:mb-12 mb-16 sm:overflow-hidden overflow-y-auto sm:max-h-[90vh] max-h-[85vh] w-[95%] dark:bg-gray-800 p-6 shadow-lg max-w-md">
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
              <form onSubmit={handleFormSubmit} className="mt-4 space-y-4 ">
                {formError && (
                  <p className="text-red-500 dark:text-red-400 text-md">
                    {formError}
                  </p>
                )}

                {/* Name & Gender */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col flex-1 min-w-[180px]">
                    <label
                      htmlFor="name"
                      className="block text-md font-medium text-gray-700 dark:text-gray-200"
                    >
                      {t("staff.name")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="mt-1 w-full text-md border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                      aria-required="true"
                    />
                  </div>

                  <div className="flex flex-col flex-1 min-w-[180px] mt-4 sm:mt-0">
                    <label
                      htmlFor="gender"
                      className="block text-md font-medium text-gray-700 dark:text-gray-200"
                    >
                      {t("staff.gender")}
                    </label>
                    <Select
                      name="gender"
                      options={genderOptions}
                      value={
                        genderOptions.find(
                          (opt) => opt.value === formData.gender
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        handleFormChange({
                          target: {
                            name: "gender",
                            value: selectedOption ? selectedOption.value : "",
                          },
                        })
                      }
                      classNamePrefix="select"
                      className="mt-1 w-full text-md border-gray-400 dark:border-gray-600 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col flex-1 min-w-[180px]">
                  <label
                    htmlFor="email"
                    className="block text-md font-medium text-gray-700 dark:text-gray-200"
                  >
                    {t("staff.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="mt-1 w-full text-md border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                    aria-required="true"
                  />
                </div>

                {modalMode === "add" && (
                  <div className="flex flex-col flex-1 min-w-[180px]">
                    <label
                      htmlFor="password"
                      className="block text-md font-medium text-gray-700 dark:text-gray-200"
                    >
                      {t("staff.password")}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className="mt-1 w-full text-md border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                      aria-required="true"
                    />
                  </div>
                )}

                {/* Role & Status */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col flex-1 min-w-[180px]">
                    <label
                      htmlFor="role"
                      className="block text-md font-medium text-gray-700 dark:text-gray-200"
                    >
                      {t("staff.role")}
                    </label>
                    <Select
                      name="role"
                      options={filteredRoleOptions}
                      value={
                        filteredRoleOptions.find(
                          (opt) => opt.value === formData.role
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        handleFormChange({
                          target: {
                            name: "role",
                            value: selectedOption ? selectedOption.value : "",
                          },
                        })
                      }
                      classNamePrefix="select"
                      className="mt-1 w-full text-md border-gray-400 dark:border-gray-600 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>

                  <div className="flex flex-col flex-1 min-w-[180px] mt-4 sm:mt-0">
                    <label
                      htmlFor="status"
                      className="block text-md font-medium text-gray-700 dark:text-gray-200"
                    >
                      {t("staff.status")}
                    </label>
                    <Select
                      name="status"
                      options={statusOptions}
                      value={
                        statusOptions.find(
                          (opt) => opt.value === formData.status
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        handleFormChange({
                          target: {
                            name: "status",
                            value: selectedOption ? selectedOption.value : "",
                          },
                        })
                      }
                      classNamePrefix="select"
                      className="mt-1 w-full text-md dark:border-gray-600 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                      aria-required="true"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col flex-1 min-w-[180px]">
                  <label
                    htmlFor="phone"
                    className="block text-md font-medium text-gray-700 dark:text-gray-200"
                  >
                    {t("staff.phone")}
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="mt-1 w-full text-md border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting} // ✅ disable cancel while submitting
                    className={`text-md text-gray-500 dark:text-gray-400 border border-gray-400 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label="Cancel"
                  >
                    {t("staff.cancel")}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting} // ✅ disable submit while loading
                    className={`text-md text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-4 py-2 rounded-lg dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label={
                      modalMode === "add" ? "Add staff" : "Save changes"
                    }
                  >
                    {isSubmitting
                      ? modalMode === "add"
                        ? "Adding..."
                        : "Saving..."
                      : modalMode === "add"
                      ? t("staff.add")
                      : t("staff.save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ManageStaff;
