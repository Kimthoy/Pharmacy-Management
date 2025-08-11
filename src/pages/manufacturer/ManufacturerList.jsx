import { useState, useRef, useEffect } from "react";

import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import { useTranslation } from "../../hooks/useTranslation";
import SupplierFormModal from "./SupplierFormModal";

import { BiSolidDetail } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createSupplier,
  getAllSupplier,
  updateSupplier,
  deleteSupplier,
} from "../api/supplierService";
const Manufacturerlist = () => {
  const { t } = useTranslation();
  const [totalSupplier, setTotalSupplier] = useState(0);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const menuRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const toggleMenu = (index) => setOpenMenu(openMenu === index ? null : index);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    company_id: "",
    company_name: "",
    email: "",
    phone_number: "",
    address: "",
    is_active: true,
  });

  const toggleForm = () => {
    setIsModalOpen((prev) => !prev);
  };

  const fetchSuppliers = async () => {
    try {
      const suppliers = await getAllSupplier(); // Already an array
      setSuppliers(suppliers);
      const totalSupplier = suppliers.length;
      setTotalSupplier(totalSupplier);
    } catch (err) {
      setError("Failed to fetch supplier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
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

  const validateForm = (data) => {
    const errors = {};

    if (!data.company_name?.trim())
      errors.company_name = "Company name is required";
    if (!data.email?.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email))
      toast.error("Email has already exists!");
    if (!data.phone_number?.trim())
      errors.phone_number = "Phone number is required";
    if (!data.address?.trim()) errors.address = "Address is required";
    return errors;
  };

  const handleFormSubmit = async (formData) => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (formData.id) {
        // Update existing supplier
        await updateSupplier(formData.id, formData);
        toast.success("Supplier updated successfully!");
      } else {
        // Create new supplier
        await createSupplier({
          ...formData,
          balance: Number(formData.balance || 0), // only if you use balance
        });
        toast.success("Supplier added successfully!");
      }

      setFormErrors({});
      toggleForm();
      fetchSuppliers();
    } catch (err) {
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};

        setFormErrors(validationErrors);

        if (validationErrors.email) {
          toast.error(validationErrors.email[0]);
        } else {
          toast.error("Validation failed. Please check your inputs.");
        }
      } else {
        const msg = err.response?.data?.message || "Email already exists!";
        toast.error(msg);
      }
    }
  };

  const filteredSuppliers = suppliers.filter((sup) => {
    const companyId = sup.company_id || "";
    return companyId.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const totalPages = Math.ceil(filteredSuppliers.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedSuppliers = filteredSuppliers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const getStatus = (is_active) => {
    if (is_active === true)
      return {
        text: t("manufacturerlist.StatusActive"),
        color: "text-green-400 dark:text-green-300",
      };
    return {
      text: t("manufacturerlist.StatusInactive"),
      color: "text-red-400 dark:text-red-300",
    };
  };
  const handleEdit = (man) => {
    setIsModalOpen(true);
    setFormData({
      id: man.id,
      company_id: man.company_id,
      company_name: man.company_name,
      email: man.email,
      phone_number: man.phone_number,
      address: man.address,

      is_active: man.is_active,
    });
  };

  return (
    <div className="sm:p-6 mb-20 bg-white dark:bg-gray-900 sm:shadow-lg dark:shadow-gray-800 rounded-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl dark:text-slate-300 font-bold text-gray-500 ">
            {t("manufacturerlist.ManufacturerListTitle")}
          </h2>
          <p className="text-gray-400 dark:text-gray-300 text-md">
            {t("manufacturerlist.ManufacturerListDesc")}
          </p>
          <p className="dark:text-slate-300">
            Total Suppliers: {totalSupplier}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleForm}
          className="border border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-300 hover:text-emerald-400 dark:hover:text-emerald-300 text-gray-400 dark:text-gray-300 px-2 py-1 rounded-md transition"
        >
          {t("manufacturerlist.AddManufacturer")}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          id="search"
          placeholder={t("manufacturerlist.SearchPlaceholder")}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div>
        <table className="w-full sm:min-w-[600px] border-collapse bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 sm:rounded-lg border border-gray-200 dark:border-gray-600">
          <thead className="border border-gray-200 dark:border-gray-600">
            <tr>
              <th className="sm:flex hidden p-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("manufacturerlist.ManufacturerID")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("manufacturerlist.Company")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("manufacturerlist.Email")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("manufacturerlist.Phone")}
              </th>

              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("manufacturerlist.Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="border border-gray-200 dark:border-gray-600">
            {selectedSuppliers.map((man, index) => {
              const { text, color } = getStatus(man.is_active);
              return (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-600 text-md"
                >
                  <td className="sm:flex hidden p-3 text-green-400 dark:text-green-300 cursor-pointer hover:underline">
                    {man.company_id}
                  </td>
                  <td
                    className="p-3 text-gray-400 dark:text-gray-300  max-w-[100px] truncate"
                    title={man.company_name}
                  >
                    {man.company_name}
                  </td>
                  <td
                    className="p-3 text-gray-400 dark:text-gray-300  max-w-[100px] truncate"
                    title={man.email}
                  >
                    {man.email}
                  </td>
                  <td className="p-3 text-gray-400 dark:text-gray-300">
                    {man.phone_number}
                  </td>

                  <td className="p-3 flex">
                    <button
                      onClick={() => handleEdit(man)}
                      className=" text-blue-600 p-3 hover:rounded-md hover:bg-slate-300  dark:hover:bg-slate-600 dark:text-blue-600"
                    >
                      <BiEdit className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedSupplier(man); // `man` is the supplier from map loop
                        setShowDetailModal(true);
                      }}
                      className=" text-green-600 p-3 hover:rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 dark:text-green-600"
                    >
                      <BiSolidDetail className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSupplierToDelete(man); // `man` is your supplier object
                        setShowDeleteModal(true);
                      }}
                      className=" text-red-600 p-3 hover:rounded-md hover:bg-slate-300  dark:hover:bg-slate-600 dark:text-red-600"
                    >
                      <BiTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between mt-4">
        <div className="sm:flex hidden items-center space-x-2">
          <span className="text-gray-400 dark:text-gray-300 text-md">
            {t("manufacturerlist.RowsPerPage")}
          </span>
          <select
            id="rowsPerPage"
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
            aria-label={t("manufacturerlist.RowsPerPage")}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-400 dark:text-gray-300 text-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            {t("manufacturerlist.Previous")}
          </button>
          <span className="text-gray-400 dark:text-gray-300 text-md">
            {t("manufacturerlist.Page")} {currentPage}{" "}
            {t("manufacturerlist.Of")} {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-400 dark:text-gray-300 text-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            {t("manufacturerlist.Next")}
          </button>
        </div>
      </div>
      {isModalOpen && (
        <SupplierFormModal
          isOpen={isModalOpen}
          onClose={toggleForm}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          formErrors={formErrors}
        />
      )}
      {showDetailModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Supplier Details
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-200">
              <p>
                <strong>Company ID:</strong> {selectedSupplier.company_id}
              </p>
              <p>
                <strong>Company Name:</strong> {selectedSupplier.company_name}
              </p>
              <p>
                <strong>Email:</strong> {selectedSupplier.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedSupplier.phone_number}
              </p>
              <p>
                <strong>Address:</strong> {selectedSupplier.address}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedSupplier.is_active ? "Active" : "Inactive"}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && supplierToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Delete
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <strong>{supplierToDelete.company_name}</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteSupplier(supplierToDelete.id); // Call your API method
                    toast.success("Supplier deleted successfully");
                    fetchSuppliers(); // Refresh data
                  } catch (err) {
                    toast.error("Failed to delete supplier");
                  } finally {
                    setShowDeleteModal(false);
                    setSupplierToDelete(null);
                  }
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Manufacturerlist;
