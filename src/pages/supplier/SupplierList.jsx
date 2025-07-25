import { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import { useTranslation } from "../../hooks/useTranslation";
import { useNavigate } from "react-router-dom";
// import { suppliers } from "../../data/suppliers";
import { getAllSupplier } from "../api/supplierService";
import { sync } from "framer-motion";
const SupplierList = () => {
  const { t } = useTranslation();
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact_info: "",
    address: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [suppliersList, setSuppliersList] = useState(suppliers);
  const [suppliers, setSupplier] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (index) => {
    console.log("Toggling menu for index:", index);
    setOpenMenu(openMenu === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuppliers = suppliersList.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedSuppliers = filteredSuppliers.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const fetchSuppliers = async () => {
    try {
      const data = await getAllSupplier();
      setSupplier(data);
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
      setError("Failed to fetch supplier");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSuppliers();
  }, []);
  const totalSupplier = suppliers.reduce(
    (sum, suppliers) => sum + suppliers.id || "N/A"
  );
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim())
      errors.name = t("supplierlist.SupplierListFormErrorName");
    if (!formData.email.trim()) {
      errors.email = t("supplierlist.SupplierListFormErrorEmail");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t("supplierlist.SupplierListFormErrorEmailInvalid");
    }
    if (!formData.phone.trim())
      errors.phone = t("supplierlist.SupplierListFormErrorPhone");
    return errors;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newSupplier = {
      supplier_id: suppliersList.length + 1, // Simulate auto-increment
      ...formData,
      created_at: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    setSuppliersList((prev) => [...prev, newSupplier]);
    setFormData({
      name: "",
      contact_info: "",
      address: "",
      email: "",
      phone: "",
    });
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedSupplier) {
      console.error("No supplier selected for edit");
      setFormErrors({
        general: t("supplierlist.SupplierListFormErrorGeneral"),
      });
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    console.log("Updating supplier:", selectedSupplier.supplier_id, formData);
    setSuppliersList((prev) =>
      prev.map((supplier) =>
        supplier.supplier_id === selectedSupplier.supplier_id
          ? { ...supplier, ...formData }
          : supplier
      )
    );
    setFormData({
      name: "",
      contact_info: "",
      address: "",
      email: "",
      phone: "",
    });
    setFormErrors({});
    setIsEditModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleModalClose = () => {
    console.log("Closing modal");
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setFormData({
      name: "",
      contact_info: "",
      address: "",
      email: "",
      phone: "",
    });
    setFormErrors({});
    setSelectedSupplier(null);
  };

  const handleEditClick = (supplier) => {
    console.log("Edit clicked for supplier:", supplier);
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact_info: supplier.contact_info,
      address: supplier.address,
      email: supplier.email,
      phone: supplier.phone,
    });
    setIsEditModalOpen(true);
    setOpenMenu(null);
  };

  const handleDeleteClick = (supplier) => {
    console.log("Delete clicked for supplier:", supplier);
    setSelectedSupplier(supplier);
    setIsDeleteConfirmOpen(true);
    setOpenMenu(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedSupplier) {
      console.error("No supplier selected for deletion");
      return;
    }
    console.log("Deleting supplier:", selectedSupplier.supplier_id);
    setSuppliersList((prev) => {
      const updatedList = prev.filter(
        (supplier) => supplier.supplier_id !== selectedSupplier.supplier_id
      );
      console.log("Updated suppliers list:", updatedList);
      return updatedList;
    });
    setIsDeleteConfirmOpen(false);
    setSelectedSupplier(null);
  };

  const handleDeleteCancel = () => {
    console.log("Canceling delete");
    setIsDeleteConfirmOpen(false);
    setSelectedSupplier(null);
  };

  return (
    <div className="p-6 mb-14 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 rounded-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {t("supplierlist.SupplierListTitle")}
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {t("supplierlist.SupplierListDesc")}
      </p>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder={t("supplierlist.SupplierListSearchByName")}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-500"
        >
          <FaPlus className="mr-2" />
          {t("supplierlist.SupplierListAddSupplier")}
        </button>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg dark:shadow-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              {t("supplierlist.SupplierListAddSupplier")}
            </h3>
            <form onSubmit={handleAddFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("supplierlist.SupplierListFormName")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                />
                {formErrors.name && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("supplierlist.SupplierListFormContactInfo")}
                </label>
                <input
                  type="text"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("supplierlist.SupplierListFormAddress")}
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("supplierlist.SupplierListFormEmail")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                />
                {formErrors.email && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("supplierlist.SupplierListFormPhone")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                />
                {formErrors.phone && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  {t("supplierlist.SupplierListFormCancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-500"
                >
                  {t("supplierlist.SupplierListFormSubmit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg dark:shadow-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              {t("supplierlist.SupplierListEditSupplier")}
            </h3>
            <form onSubmit={handleEditFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("supplierlist.SupplierListFormName")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                />
                {formErrors.name && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("supplierlist.SupplierListFormContactInfo")}
                </label>
                <input
                  type="text"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("supplierlist.SupplierListFormAddress")}
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("supplierlist.SupplierListFormEmail")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                />
                {formErrors.email && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  {t("supplierlist.SupplierListFormPhone")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
                />
                {formErrors.phone && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>
              {formErrors.general && (
                <p className="text-red-500 dark:text-red-400 text-sm mb-4">
                  {formErrors.general}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  {t("supplierlist.SupplierListFormCancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-500"
                >
                  {t("supplierlist.SupplierListFormSave")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-lg dark:shadow-gray-700">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              {t("supplierlist.SupplierListDeleteConfirmTitle")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("supplierlist.SupplierListDeleteConfirmMessage", {
                name: selectedSupplier?.name,
              })}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                {t("supplierlist.SupplierListFormCancel")}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-500"
              >
                {t("supplierlist.SupplierListDelete")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg">
          <thead className="border border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-300 rounded">
            <tr>
              <td className="p-3 text-left text-sm">
                {t("supplierlist.SupplierListName")}
              </td>

              <td className="p-3 text-left text-sm">
                {t("supplierlist.SupplierListEmail")}
              </td>
              <td className="p-3 text-left text-sm">
                {t("supplierlist.SupplierListPhone")}
              </td>

              <td className="p-3 text-left text-sm">
                {t("supplierlist.SupplierListActions")}
              </td>
            </tr>
          </thead>
          <tbody>
            {selectedSuppliers.map((supplier, index) => (
              <tr
                key={supplier.supplier_id}
                className="border border-gray-200 dark:border-gray-600 text-xs sm:text-base"
              >
                <td className="p-3 text-[13px] text-gray-400 dark:text-gray-300">
                  {supplier.name}
                </td>

                <td className="p-3 text-[13px] text-gray-400 dark:text-gray-300">
                  {supplier.email}
                </td>
                <td className="p-3 text-[13px] text-gray-400 dark:text-gray-300">
                  {supplier.phone}
                </td>

                <td className="p-3 text-[13px] relative">
                  <button
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                    onClick={() => toggleMenu(index)}
                  >
                    <FaEllipsisV />
                  </button>
                  {openMenu === index && (
                    <div
                      ref={menuRef}
                      className="absolute z-10 right-16 mt-2 top-2 w-36 bg-gray-100 dark:bg-gray-800 border border-green-600 dark:border-green-500 rounded-md shadow-md dark:shadow-gray-700"
                    >
                      <button
                        className="flex align-middle w-full text-left text-gray-600 dark:text-gray-200 py-2 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/supplier/${supplier.supplier_id}`);
                          setOpenMenu(null);
                        }}
                      >
                        <BiShow className="mt-1 w-10" />
                        {t("supplierlist.SupplierListViewDetails")}
                      </button>
                      <button
                        className="flex align-middle w-full text-left text-gray-600 dark:text-gray-200 py-2 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Edit button clicked for:", supplier);
                          handleEditClick(supplier);
                        }}
                      >
                        <BiEdit className="mt-1 w-10" />
                        {t("supplierlist.SupplierListEdit")}
                      </button>
                      <button
                        className="flex align-middle w-full text-left text-gray-600 dark:text-gray-200 py-2 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Delete button clicked for:", supplier);
                          handleDeleteClick(supplier);
                        }}
                      >
                        <BiTrash className="mt-1 w-10" />
                        {t("supplierlist.SupplierListDelete")}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
     
      </div>

      <div className="flex flex-wrap items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-300">
            {t("supplierlist.RowsPerPage")}
          </span>
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
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            {t("supplierlist.SupplierListPrevious")}
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            {t("supplierlist.SupplierListPage")} {currentPage}{" "}
            {t("supplierlist.SupplierListOf")} {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            {t("supplierlist.SupplierListNext")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierList;
