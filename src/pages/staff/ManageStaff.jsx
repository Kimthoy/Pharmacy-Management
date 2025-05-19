import React, { useState, useEffect } from "react";
import { FaSort, FaCog, FaSun, FaMoon } from "react-icons/fa";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";

const ManageStaff = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError(t("staff.authError"));
        setLoading(false);
        return;
      }
      const response = await axios.get("http://127.0.0.1:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      setUsers(response.data.data); // Adjusted for API response structure
    } catch (err) {
      console.error("Failed to fetch users:", err);
      if (err.code === "ERR_NETWORK") {
        setError(t("staff.networkError"));
      } else if (err.response) {
        if (err.response.status === 500) {
          setError(t("staff.serverError"));
        } else if (err.response.status === 401) {
          setError(t("staff.authError"));
        } else if (err.response.status === 403) {
          setError(t("staff.unauthorizedError") || "Unauthorized access.");
        } else {
          setError(
            err.response.data.message ||
              `${t("staff.fetchError")} (Status: ${err.response.status})`
          );
        }
      } else {
        setError(err.message || t("staff.fetchError"));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRole = async (token) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data.role;
    } catch (err) {
      console.error("Failed to fetch user role:", err);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserRole(token).then((role) => {
        if (role === "admin") {
          fetchUsers();
        } else {
          setError(
            t("staff.unauthorizedError") || "Only admins can view staff."
          );
        }
      });
    } else {
      setError(t("staff.authError"));
    }
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
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

  const handleAddStaff = () => setShowModal(true);

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
          >
            {t("staff.addStaff")}
          </button>
        </div>
      </div>

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
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-white dark:bg-gray-700 px-4 py-2 rounded-[4px] shadow-md dark:shadow-gray-600 flex items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600"
            >
              <FaSort />
            </button>
            <button className="bg-white dark:bg-gray-700 px-4 py-2 rounded-[4px] shadow-md dark:shadow-gray-600 flex items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600">
              <FaCog />
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            {t("staff.loading")}
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 dark:text-red-400">{error}</p>
        )}

        {!loading && !error && (
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
                {/* <th className="p-3 border border-gray-300 dark:border-gray-600">
                  {t("staff.status")}
                </th> */}
              </tr>
            </thead>
            <tbody>
              {paginatedList.length > 0 ? (
                paginatedList.map((user, index) => (
                  <tr
                    key={index}
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
                    {/* <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      {user.status || 'N/A'}
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="p-16 border border-gray-300 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400"
                  >
                    {t("staff.noRecords")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

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
            >
              {t("staff.next")}
            </button>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">
                {t("staff.addStaff")}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                &times;
              </button>
              {/* Add form here (placeholder) */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStaff;
