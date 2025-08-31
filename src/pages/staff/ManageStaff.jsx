import { useState, useEffect, useMemo } from "react";
import { FaSort, FaRegEdit } from "react-icons/fa";
import { TbHttpDelete } from "react-icons/tb";
import { GrView } from "react-icons/gr";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userService";

const ManageStaff = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editUserId, setEditUserId] = useState(null);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "cashier",
    status: "Active",
    password: "",
    phone: "",
    gender: "",
  });
  const [formError, setFormError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  // ===== Helpers (place above return) =====
  const statusPill = (status) =>
    status === "Active"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
      : "bg-rose-50 text-rose-700 ring-1 ring-rose-200";

  const roleBadge =
    "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 ring-1 ring-gray-200/60 dark:ring-gray-600 px-2 py-0.5 rounded-md text-xs font-medium";

  // ===== API calls =====
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
      const transformedUsers =
        response.data?.map((user) => ({
          id: user.id,
          name: user.username || user.name || "Unknown",
          email: user.email || "No email",
          role: (user.role || "cashier").toLowerCase(),
          status: user.is_active ? "Active" : "Inactive",
          username: user.username || user.name || "Unknown",
          phone: user.phone || "",
          gender: user.gender || "",
        })) || [];
      setUsers(transformedUsers);
    } catch (error) {
      toast.error(t("staff.error.loadFailed") || "Failed to load users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset to page 1 when search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  // ====== Actions ======
  const handleAddStaff = () => {
    setModalMode("add");
    setEditUserId(null);
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
    setShowFormModal(true);
  };

  const handleEditStaff = (user) => {
    setModalMode("edit");
    setEditUserId(user.id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role?.toLowerCase() || "cashier",
      status: user.status || "Active",
      password: "",
      phone: user.phone || "",
      gender: user.gender || "",
    });
    setFormError("");
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError(t("staff.error.nameRequired"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError(t("staff.error.invalidEmail"));
      return;
    }
    if (modalMode === "add" && !formData.password.trim()) {
      setFormError(t("staff.error.passwordRequired"));
      return;
    }

    try {
      const payload = {
        username: formData.name,
        email: formData.email,
        role: formData.role,
        is_active: formData.status === "Active",
        phone: formData.phone,
        gender: formData.gender,
        ...(formData.password && { password: formData.password }),
      };

      if (modalMode === "add") {
        await createUser(payload);
        toast.success(
          t("staff.success.staffAdded").replace("{{name}}", formData.name)
        );
      } else {
        await updateUser(editUserId, payload);
        toast.success(
          t("staff.success.staffUpdated").replace("{{name}}", formData.name)
        );
      }

      setShowFormModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("staff.error.submitFailed")
      );
    }
  };

  const confirmDeleteUser = (user) => {
    setDeleteConfirmUser(user);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirmUser) return;
    setIsDeleting(true);
    try {
      await deleteUser(deleteConfirmUser.id);
      toast.success(
        `${deleteConfirmUser.username} ${
          t("staff.success.deleted") || "deleted successfully"
        }`
      );
      fetchUsers();
    } catch {
      toast.error(t("staff.error.deleteFailed") || "Failed to delete user");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmUser(null);
    }
  };

  // ===== Filters, Sort & Pagination =====
  const processedList = useMemo(() => {
    const sorted = [...users].sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    const filtered = sorted.filter((user) => {
      const match = `${user.name} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      // Hide admins
      return match && user.role?.toLowerCase() !== "admin";
    });

    return filtered;
  }, [users, sortOrder, searchQuery]);

  const totalPages = Math.ceil(processedList.length / itemsPerPage) || 1;

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedList.slice(start, start + itemsPerPage);
  }, [processedList, currentPage, itemsPerPage]);

  const toggleSort = () => setSortOrder((s) => (s === "asc" ? "desc" : "asc"));

  return (
    <div className="sm:p-2 mb-14 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold">{t("staff.StaffDashboard")}</h1>
          <p className="text-gray-400">{t("staff.StaffDashboardDesc")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder={t("staff.searchPlaceholder") || "Search staff..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 bg-transparent outline-none"
            />
          </div>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg bg-transparent"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / {t("staff.page") || "page"}
              </option>
            ))}
          </select>
          <button
            onClick={toggleSort}
            className="px-3 py-2 rounded-lg border flex items-center gap-2"
            title={t("staff.sortByName") || "Sort by name"}
          >
            <FaSort className="w-4 h-4" />
            {sortOrder === "asc"
              ? t("staff.sortAsc") || "A → Z"
              : t("staff.sortDesc") || "Z → A"}
          </button>
          <button
            onClick={handleAddStaff}
            className="px-4 py-2 rounded-lg border text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white"
          >
            {t("staff.addStaff")}
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="w-full py-10 text-center text-gray-500">
          {t("staff.loading") || "Loading..."}
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-600">
            <table className="w-full">
              <thead className="bg-green-600 text-white">
                <tr className="text-center">
                  <th className="py-3 px-2">{t("staff.name")}</th>
                  <th className="py-3 px-2">{t("staff.email")}</th>
                  <th className="py-3 px-2">{t("staff.role")}</th>
                  <th className="hidden sm:table-cell py-3 px-2">
                    {t("staff.status")}
                  </th>
                  <th className="py-3 px-2">{t("staff.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.length > 0 ? (
                  paginatedList.map((user) => (
                    <tr
                      key={user.id}
                      className="text-center border-t border-gray-200 dark:border-gray-700"
                    >
                      <td className="py-3 px-2">{user.name}</td>
                      <td className="py-3 px-2 text-emerald-500 break-all max-w-xs">
                        {user.email}
                      </td>

                      <td className="py-3 px-2 capitalize">{user.role}</td>
                      <td
                        className={` hidden sm:table-cell py-3 px-2 ${
                          user.status === "Active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {user.status}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex justify-center gap-2">
                          <button
                            className="text-blue-500 hover:opacity-80"
                            onClick={() => handleEditStaff(user)}
                            title={t("staff.edit") || "Edit"}
                          >
                            <FaRegEdit className="w-5 h-5" />
                          </button>
                          <button
                            className="text-green-600 hover:opacity-80"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsViewModalOpen(true);
                            }}
                            title={t("staff.view") || "View"}
                          >
                            <GrView className="w-5 h-5" />
                          </button>
                          <button
                            className="text-red-500 hover:opacity-80 disabled:opacity-50"
                            onClick={() => confirmDeleteUser(user)}
                            disabled={isDeleting}
                            title={t("staff.delete") || "Delete"}
                          >
                            <TbHttpDelete className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-6">
                      {t("staff.noRecords")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              {t("staff.showing") || "Showing"}{" "}
              {processedList.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}{" "}
              {t("staff.to") || "to"}{" "}
              {Math.min(currentPage * itemsPerPage, processedList.length)}{" "}
              {t("staff.of") || "of"} {processedList.length}{" "}
              {t("staff.results") || "results"}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded disabled:opacity-50"
              >
                {t("staff.prev") || "Prev"}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`px-3 py-2 border rounded ${
                    n === currentPage
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : ""
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded disabled:opacity-50"
              >
                {t("staff.next") || "Next"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* View Detail Modal */}
      {isViewModalOpen && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsViewModalOpen(false);
          }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="user-details-title"
        >
          {/* Click outside to close */}
          <div
            className="absolute inset-0"
            onClick={() => setIsViewModalOpen(false)}
          />

          <div
            className="relative w-full max-w-lg bg-white dark:bg-gray-850 rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 p-6 sm:p-7"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            {/* Close button */}
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-red-500/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
              aria-label={t("common.close") || "Close"}
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              {/* Avatar (initials) */}
              <div className="h-12 w-12 shrink-0 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 flex items-center justify-center font-semibold">
                {(selectedUser?.name || selectedUser?.username || "?")
                  .trim()
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2
                  id="user-details-title"
                  className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white truncate"
                >
                  {t("staff.userDetails") || "User Details"}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className={roleBadge}>
                    {t("staff.role") || "Role"}:{" "}
                    <span className="capitalize">
                      {selectedUser.role || "-"}
                    </span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusPill(
                      selectedUser.status
                    )}`}
                  >
                    {selectedUser.status || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {t("staff.username") || "Username"}
                </p>
                <p className="mt-1 font-medium text-gray-900 dark:text-gray-100 break-words">
                  {selectedUser.username || selectedUser.name || "-"}
                </p>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {t("staff.email") || "Email"}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <a
                    href={
                      selectedUser.email
                        ? `mailto:${selectedUser.email}`
                        : undefined
                    }
                    className="font-medium text-emerald-600 hover:underline dark:text-emerald-400 break-all"
                  >
                    {selectedUser.email || "-"}
                  </a>
                  {selectedUser.email && (
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            selectedUser.email
                          );
                          toast.success(t("common.copied") || "Copied");
                        } catch {
                          toast.error(t("common.copyFailed") || "Copy failed");
                        }
                      }}
                      className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {t("common.copy") || "Copy"}
                    </button>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {t("staff.phone") || "Phone"}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  {selectedUser.phone ? (
                    <>
                      <a
                        href={`tel:${selectedUser.phone}`}
                        className="font-medium text-gray-900 dark:text-gray-100"
                      >
                        {selectedUser.phone}
                      </a>
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              selectedUser.phone
                            );
                            toast.success(t("common.copied") || "Copied");
                          } catch {
                            toast.error(
                              t("common.copyFailed") || "Copy failed"
                            );
                          }
                        }}
                        className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {t("common.copy") || "Copy"}
                      </button>
                    </>
                  ) : (
                    <span className="font-medium text-gray-400">-</span>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {t("staff.gender") || "Gender"}
                </p>
                <p className="mt-1 font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {selectedUser.gender || "-"}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="inline-flex px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t("common.close") || "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div
            className="bg-white dark:bg-gray-800 p-3 sm:p-8 rounded-2xl w-full max-w-lg shadow-2xl relative"
            role="dialog"
            aria-labelledby="staff-form-title"
          >
            <h2
              id="staff-form-title"
              className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center"
            >
              {modalMode === "add" ? t("staff.addStaff") : t("staff.editStaff")}
            </h2>

            {formError && (
              <p className="text-red-500 mb-4 text-center font-medium">
                {formError}
              </p>
            )}

            <form
              onSubmit={handleFormSubmit}
              className="space-y-7  overflow-y-scroll h-96"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("staff.name") || "Name"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 w-full border rounded-lg p-2 bg-transparent"
                  placeholder={t("staff.name") || "Enter full name"}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t("staff.helper.name") || "Use full legal name"}
                </p>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("staff.email") || "Email"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 w-full border rounded-lg p-2 bg-transparent"
                  placeholder="example@domain.com"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t("staff.helper.email") || "We’ll never share this email"}
                </p>
              </div>

              {/* Password (only on add) */}
              {modalMode === "add" && (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("staff.password") || "Password"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="mt-1 w-full border rounded-lg p-2 bg-transparent"
                    placeholder="********"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("staff.helper.password") ||
                      "Minimum 6 characters, include letters & numbers"}
                  </p>
                </div>
              )}

              {/* Phone & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("staff.phone") || "Phone"}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1 w-full border rounded-lg p-2 bg-transparent"
                    placeholder="+855 12 345 678"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("staff.helper.phone") || "Include country code"}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("staff.gender") || "Gender"}
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="mt-1 w-full border rounded-lg p-2 bg-transparent"
                  >
                    <option value="">
                      {t("staff.gender") || "Select gender"}
                    </option>
                    <option value="male">{t("staff.male") || "Male"}</option>
                    <option value="female">
                      {t("staff.female") || "Female"}
                    </option>
                    <option value="other">{t("staff.other") || "Other"}</option>
                  </select>
                </div>
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("staff.role") || "Role"}
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="mt-1 w-full border rounded-lg p-2 bg-transparent"
                  >
                    <option value="cashier">
                      {t("staff.role.cashier") || "Cashier"}
                    </option>
                    <option value="partner">
                      {t("staff.role.partner") || "Partner"}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("staff.status") || "Status"}
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="mt-1 w-full border rounded-lg p-2 bg-transparent"
                  >
                    <option value="Active">
                      {t("staff.active") || "Active"}
                    </option>
                    <option value="Inactive">
                      {t("staff.inactive") || "Inactive"}
                    </option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t("common.cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  {modalMode === "add"
                    ? t("common.create") || "Create"
                    : t("common.update") || "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">
              {t("staff.confirmDeleteTitle") || "Delete Staff"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              {t("staff.confirmDeleteMsg").replace(
                "{{name}}",
                deleteConfirmUser?.username
              )}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded border"
                disabled={isDeleting}
              >
                {t("common.cancel") || "Cancel"}
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting
                  ? t("common.deleting") || "Deleting..."
                  : t("common.delete") || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-left" autoClose={1000} />
    </div>
  );
};

export default ManageStaff;
