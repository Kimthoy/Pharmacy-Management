import { useState, useEffect } from "react";
import { FaSort, FaCog, FaRegEdit } from "react-icons/fa";
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
  const [showModal, setShowModal] = useState(false);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

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
          role: user.role || "cashier",
          status: user.is_active ? "Active" : "Inactive",
          username: user.username || user.name || "Unknown",
          phone: user.phone || "",
          gender: user.gender || "",
        })) || [];
      setUsers(transformedUsers);
    } catch (error) {
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ====== Actions ======
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
      name: user.name || "",
      email: user.email || "",
      role: user.role?.toLowerCase() || "cashier",
      status: user.status || "Active",
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
        toast.success(t("staff.success.staffAdded", { name: formData.name }));
      } else {
        await updateUser(editUserId, payload);
        toast.success(t("staff.success.staffUpdated", { name: formData.name }));
      }

      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
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
      toast.success(`${deleteConfirmUser.username} deleted successfully`);
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmUser(null);
    }
  };

  // ===== Filters & Pagination =====
  const sortedList = [...users].sort((a, b) =>
    sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const filteredList = sortedList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      user.role?.toLowerCase() !== "admin"
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="sm:p-2 mb-14 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">{t("staff.StaffDashboard")}</h1>
          <p className="text-gray-400">{t("staff.StaffDashboardDesc")}</p>
        </div>
        <button
          onClick={handleAddStaff}
          className="px-4 py-2 rounded-lg border text-emerald-500 border-emerald-500 hover:bg-emerald-500 hover:text-white"
        >
          {t("staff.addStaff")}
        </button>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="text-center">
            <td className="py-3">{t("staff.name")}</td>
            <td className="py-3">{t("staff.email")}</td>
            <td className="py-3">{t("staff.role")}</td>
            <td className="py-3">{t("staff.status")}</td>
            <td className="py-3">{t("staff.actions")}</td>
          </tr>
        </thead>
        <tbody>
          {paginatedList.length > 0 ? (
            paginatedList.map((user) => (
              <tr key={user.id} className="text-center border">
                <td className="py-3">{user.name}</td>
                <td className="text-emerald-500 py-3">{user.email}</td>
                <td>{user.role}</td>
                <td
                  className={
                    user.status === "Active"
                      ? "text-green-600 py-3"
                      : "text-red-600"
                  }
                >
                  {user.status}
                </td>
                <td className="py-3">
                  <div className="flex justify-center space-x-2">
                    <button
                      className="text-blue-500"
                      onClick={() => handleEditStaff(user)}
                    >
                      <FaRegEdit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-green-500"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true); // ✅ open the modal
                      }}
                    >
                      <GrView className="w-5 h-5" />
                    </button>

                    <button
                      className="text-red-500"
                      onClick={() => confirmDeleteUser(user)}
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
      {/* ✅ View Detail Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center">
              👤 User Details
            </h2>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <strong>👤 Username:</strong> {selectedUser.username}
              </li>
              <li>
                <strong>📧 Email:</strong> {selectedUser.email}
              </li>
              <li>
                <strong>🔐 Role:</strong> {selectedUser.role}
              </li>
              <li>
                <strong>📱 Phone:</strong> {selectedUser.phone}
              </li>
              <li>
                <strong>📈 Status:</strong> {selectedUser.status}
              </li>
              <li>
                <strong>⚧ Gender:</strong> {selectedUser.gender}
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

      {/* === ADD / EDIT MODAL === */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === "add" ? "Add Staff" : "Edit Staff"}
            </h2>
            {formError && <p className="text-red-500">{formError}</p>}
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              {modalMode === "add" && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              )}
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="cashier">Cashier</option>
                <option value="partner">Partner</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border p-2 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-emerald-500 text-white"
                >
                  {modalMode === "add" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManageStaff;
