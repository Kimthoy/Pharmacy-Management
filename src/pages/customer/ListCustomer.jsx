import { useRef, useEffect, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useTranslation } from "../../hooks/useTranslation";
import { RiTableView } from "react-icons/ri";
import {
  getAllCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customerService";
import EditCustomerModal from "../../components/Customer/EditCustomerModal";
const CustomerList = () => {
  const { t } = useTranslation();
  const menuRef = useRef(null);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  // View Customer
  const [showModal, setShowModal] = useState(false);
  //Update Customer
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const customers = await getAllCustomer();
      setCustomers(customers);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null); // close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchCustomer();
  }, []);
  const closeModal = () => {
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
  };
  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteClick = async (id) => {
    if (!window.confirm(t("customerlist.ConfirmDelete"))) return;

    setDeletingId(id);
    const success = await deleteCustomer(id, t);
    setDeletingId(null);

    if (success) {
      setCustomers((prev) => prev.filter((cus) => cus.id !== id));
    }
  };

  const handleSaveCustomer = async (id, updatedData) => {
    try {
      await updateCustomer(id, updatedData);
      await fetchCustomer(); // Refresh the list
      setShowEditModal(false); // Close the modal
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const toggleMenu = (index) => setOpenMenu(openMenu === index ? null : index);

  const filteredCustomers = (customers || []).filter((cus) => {
    const name = (cus?.name || "").toLowerCase();
    const search = (searchTerm || "").toLowerCase();
    return name.includes(search);
  });

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const getStatus = (status) => {
    if (status === "active")
      return {
        text: t("customerlist.StatusActive"),
        color: "text-green-400 dark:text-green-300",
      };
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

      <div className="w-full h-96 overflow-x-auto">
        <table className="min-w-[420px] w-full bg-white dark:bg-gray-800  rounded-lg border border-gray-200 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-md">
            <tr>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                {t("customerlist.Customer")}
              </th>

              <th className="px-4 py-2 text-left whitespace-nowrap">
                {t("customerlist.Phone")}
              </th>

              <th className="hidden md:table-cell px-4 py-2 text-left whitespace-nowrap">
                {t("customerlist.Amount")}
              </th>
              <th className="hidden md:table-cell px-4 py-2 text-left whitespace-nowrap">
                {t("customerlist.Status")}
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                {t("customerlist.Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="text-md text-gray-700 dark:text-gray-200">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((cus, index) => {
                const { text, color } = getStatus(cus.status);

                return (
                  <tr
                    key={index}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-3">
                      {cus.name}
                      <br />
                      <span className="text-xs text-gray-400">{cus.email}</span>
                    </td>

                    <td className="px-4 py-3">{cus.phone}</td>

                    {/* Desktop only cells */}
                    <td className="hidden md:table-cell px-4 py-3">
                      {cus.item} <br />
                      {cus.quantity}
                    </td>

                    <td className="hidden md:table-cell px-4 py-3 font-semibold">
                      ${cus.amount}
                    </td>

                    <td className={`hidden md:table-cell px-4 py-3 ${color}`}>
                      {text}
                    </td>

                    <td className="px-4 py-3 relative">
                      <button
                        onClick={() => toggleMenu(index)}
                        className="text-xl text-gray-400 hover:text-green-500"
                      >
                        <FaEllipsisH />
                      </button>

                      {openMenu === index && (
                        <div
                          ref={menuRef}
                          className="absolute sm:right-24 right-16 top-5 mt-2 z-50 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded shadow-md"
                        >
                          <button
                            onClick={() => {
                              setSelectedCustomer(cus);
                              setShowModal(true);
                              setOpenMenu(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-md hover:bg-green-100 dark:hover:bg-green-600"
                          >
                            <RiTableView className="mr-2" />{" "}
                            {t("customerlist.View")}
                          </button>

                          <button
                            onClick={() => {
                              setEditingCustomer(cus);
                              setShowEditModal(true);
                              setOpenMenu(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-md hover:bg-green-100 dark:hover:bg-green-600"
                          >
                            <BiEdit className="mr-2" /> {t("customerlist.Edit")}
                          </button>

                          <button
                            key={cus.id}
                            onClick={() => handleDeleteClick(cus.id)}
                            className="flex items-center w-full px-4 py-2 text-md hover:bg-red-100 dark:hover:bg-red-600"
                          >
                            <BiTrash className="mr-2" />{" "}
                            {t("customerlist.Remove")}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  {t("customerlist.NotFound")}
                </td>
              </tr>
            )}
          </tbody>

          {showModal && selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative">
                {/* Close button (top right) */}
                <button
                  className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500 transition"
                  onClick={() => setShowModal(false)}
                  aria-label="Close modal"
                >
                  ✕
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                  {t("customerlist.CustomerDetails")}
                </h2>

                {/* Info List */}
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {t("customerlist.Name")}:
                    </span>{" "}
                    {selectedCustomer.customer}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {t("customerlist.Email")}:
                    </span>{" "}
                    {selectedCustomer.email}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {t("customerlist.Phone")}:
                    </span>{" "}
                    {selectedCustomer.phone}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {t("customerlist.Item")}:
                    </span>{" "}
                    {selectedCustomer.item}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {t("customerlist.Quantity")}:
                    </span>{" "}
                    {selectedCustomer.quantity}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {t("customerlist.Amount")}:
                    </span>{" "}
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      ${selectedCustomer.amount}
                    </span>
                  </p>
                </div>

                {/* Optional Bottom Close Button */}
                <div className="mt-6 text-center sm:hidden">
                  <button
                    onClick={() => setShowModal(false)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {t("Close")}
                  </button>
                </div>
              </div>
            </div>
          )}
          {showEditModal && editingCustomer && (
            <EditCustomerModal
              isOpen={showEditModal}
              onClose={() => setShowEditModal(false)}
              onSave={handleSaveCustomer}
              customer={editingCustomer}
            />
          )}
        </table>
      </div>

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
        </select>
        <div className="flex items-center space-x-2">
          <button
            className="text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 px-3 py-1 rounded-md hover:text-white hover:bg-green-500 dark:hover:bg-green-400 disabled:opacity-50"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            {t("customerlist.Previous")}
          </button>
          <span className="text-gray-600 dark:text-gray-300 text-md">
            {t("customerlist.Page")} {currentPage} {t("customerlist.Of")}{" "}
            {totalPages}
          </span>
          <button
            className="text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 px-3 py-1 rounded-md hover:text-white hover:bg-green-500 dark:hover:bg-green-400 disabled:opacity-50"
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            {t("customerlist.Next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
