import { useRef, useEffect, useState, useMemo } from "react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { RiTableView } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import { useTranslation } from "../../hooks/useTranslation";
import {
  getAllCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customerService";
import EditCustomerModal from "../../components/Customer/EditCustomerModal";

const CustomerList = () => {
  const { t } = useTranslation();
  const menuRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ fetch customers
  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const response = await getAllCustomer();
      const customersArray = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setCustomers(customersArray);
      setTotalCustomers(customersArray.length);
    } catch (err) {
      setError(t("customerlist.FetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (index) => setOpenMenu(openMenu === index ? null : index);

  // ✅ SweetAlert confirm instead of window.confirm
  const handleDeleteClick = async (id) => {
    Swal.fire({
      title: t("customerlist.ConfirmTitle"),
      text: t("customerlist.ConfirmText"),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: t("customerlist.Cancel"),
      confirmButtonText: t("customerlist.YesDelete"),
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingId(id);
        const success = await deleteCustomer(id, t);
        if (success) {
          setCustomers((prev) => prev.filter((cus) => cus.id !== id));
          Swal.fire(t("customerlist.Deleted"), "", "success");
        }
        setDeletingId(null);
      }
    });
  };

  const handleSaveCustomer = async (id, updatedData) => {
    try {
      await updateCustomer(id, updatedData);
      await fetchCustomer();
      setShowEditModal(false);
    } catch (error) {
      // error handled gracefully
    }
  };

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return (customers || []).filter((cus) =>
      (cus?.name || "").toLowerCase().includes(search)
    );
  }, [customers, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / rowsPerPage)
  );

  const selectedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCustomers, currentPage, rowsPerPage]);

  const getStatus = (status) => {
    if (status === "active") {
      return {
        text: t("customerlist.StatusActive"),
        color: "text-green-400 dark:text-green-300",
      };
    }
    return {
      text: t("customerlist.StatusInactive"),
      color: "text-red-400 dark:text-red-300",
    };
  };

  return (
    <div className="p-3 bg-white mb-20 dark:bg-gray-900 shadow-md dark:shadow-gray-800 rounded-md">
      <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
          {t("customerlist.CustomerListTitle")}
        </h2>
        <input
          type="text"
          placeholder={t("customerlist.SearchPlaceholder")}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <p className="text-gray-600 dark:text-gray-300">
        {t("customerlist.Total")}{" "}
        <span className="font-semibold">{totalCustomers}</span>
      </p>
      <div className="w-full overflow-auto h-full">
        <table className="min-w-[420px] w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-md">
            <tr>
              <th className="px-4 py-2 text-left">
                {t("customerlist.Customer")}
              </th>
              <th className="px-4 py-2 text-left">{t("customerlist.Phone")}</th>
              <th className="hidden md:table-cell px-4 py-2 text-left">
                {t("customerlist.Email")}
              </th>
              <th className="hidden md:table-cell px-4 py-2 text-left">
                {t("customerlist.Item")}
              </th>
              <th className="hidden md:table-cell px-4 py-2 text-left">
                {t("customerlist.Amount")}
              </th>
              <th className="hidden md:table-cell px-4 py-2 text-left">
                {t("customerlist.Status")}
              </th>
              <th className="px-4 py-2 text-left">
                {t("customerlist.Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="text-md text-gray-700 dark:text-gray-200">
            {selectedCustomers.length > 0 ? (
              selectedCustomers.map((cus) => {
                const { text, color } = getStatus(cus.status);

                return (
                  <tr
                    key={cus.id}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-3">{cus.name}</td>
                    <td className="px-4 py-3">{cus.phone}</td>
                    <td className="hidden md:table-cell px-4 py-3">
                      {cus.email}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3">
                      {cus.item} ({cus.quantity})
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 font-semibold">
                      ${cus.amount}
                    </td>
                    <td className={`hidden md:table-cell px-4 py-3 ${color}`}>
                      {text}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCustomer(cus);
                          setShowModal(true);
                        }}
                        className="flex items-center px-3 py-1"
                      >
                        <RiTableView className="mr-2 w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingCustomer(cus);
                          setShowEditModal(true);
                        }}
                        className="flex items-center px-3 py-1"
                      >
                        <BiEdit className="mr-2 w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cus.id)}
                        className="flex items-center px-3 py-1"
                      >
                        {deletingId === cus.id ? (
                          <FaSpinner className="animate-spin mr-2 w-5 h-5 text-red-600" />
                        ) : (
                          <BiTrash className="mr-2 w-5 h-5 text-red-600" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  {t("customerlist.NotFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination + RowsPerPage */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        <select
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setCurrentPage(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>

        <div className="flex items-center space-x-2">
          <button
            className="text-green-600 border border-green-600 px-3 py-1 rounded-md hover:bg-green-500 hover:text-white disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            {t("customerlist.Previous")}
          </button>
          <span className="text-gray-600 dark:text-gray-300 text-md">
            {t("customerlist.Page")} {currentPage} {t("customerlist.Of")}{" "}
            {totalPages}
          </span>
          <button
            className="text-green-600 border border-green-600 px-3 py-1 rounded-md hover:bg-green-500 hover:text-white disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            {t("customerlist.Next")}
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {t("customerlist.CustomerDetails")}
            </h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong>{t("customerlist.Name")}:</strong>{" "}
                {selectedCustomer.name}
              </p>
              <p>
                <strong>{t("customerlist.Email")}:</strong>{" "}
                {selectedCustomer.email}
              </p>
              <p>
                <strong>{t("customerlist.Phone")}:</strong>{" "}
                {selectedCustomer.phone}
              </p>
              <p>
                <strong>{t("customerlist.Item")}:</strong>{" "}
                {selectedCustomer.item} ({selectedCustomer.quantity})
              </p>
              <p>
                <strong>{t("customerlist.Amount")}:</strong> $
                {selectedCustomer.amount}
              </p>
              <p>
                <strong>{t("customerlist.Status")}:</strong>{" "}
                {selectedCustomer.status}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCustomer && (
        <EditCustomerModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveCustomer}
          customer={editingCustomer}
        />
      )}
    </div>
  );
};

export default CustomerList;
