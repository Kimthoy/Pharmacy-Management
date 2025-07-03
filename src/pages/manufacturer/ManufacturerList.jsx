import { useState, useRef, useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import { useTranslation } from "../../hooks/useTranslation";
import SupplierFormModal from "./SupplierFormModal";
import { toast } from "react-toastify";
import { createSupplier, getAllSupplier } from "../api/supplierService";
const Manufacturerlist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleForm = () => setIsModalOpen((prev) => !prev);
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const menuRef = useRef(null);

  const [formErrors, setFormErrors] = useState({});
  const toggleMenu = (index) => setOpenMenu(openMenu === index ? null : index);

  const fetchSuppliers = async () => {
    try {
      const data = await getAllSupplier();
      setSuppliers(data);
    } catch (err) {
      toast.error("Failed to load suppliers");
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
      errors.email = "Email is invalid";
    if (!data.phone_number?.trim())
      errors.phone_number = "Phone number is required";
    if (!data.address?.trim()) errors.address = "Address is required";
    return errors;
  };

  const handleFormSubmit = async (formData) => {
    // No e.preventDefault() here!

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await createSupplier({
        ...formData,
        balance: Number(formData.balance), // if you use balance
      });

      toast.success("Supplier added successfully!");
      setFormErrors({});
      toggleForm(); // close modal

      // Optional: refresh list or reset form
      fetchSuppliers();
      // setFormData(initialState);
    } catch (err) {
      const msg = err.message || "Failed to create supplier.";
      toast.error(msg);
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
  const handleCreateSupplier = async (formData) => {
    try {
      await createSupplier(formData);
      toast.success("Supplier created!");
      setIsModalOpen(false);
      fetchSuppliers(); // Refresh list
    } catch (error) {
      toast.error(error.message || "Failed to create supplier");
    }
  };
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

  return (
    <div className="sm:p-6 mb-20 bg-white dark:bg-gray-900 sm:shadow-lg dark:shadow-gray-800 rounded-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-500 dark:text-gray-200">
            {t("manufacturerlist.ManufacturerListTitle")}
          </h2>
          <p className="text-gray-400 dark:text-gray-300 text-md">
            {t("manufacturerlist.ManufacturerListDesc")}
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
      <div className="sm:w-full w-[444px]">
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
              <th className="sm:flex hidden p-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("manufacturerlist.Address")}
              </th>

              <th className=" p-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("manufacturerlist.Status")}
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
                  <td className="sm:flex hidden p-3 text-gray-400 dark:text-gray-300">
                    {man.address}
                  </td>

                  <td className={` p-3 ${color}`}>{text}</td>
                  <td className="p-3 relative">
                    <button
                      ref={menuRef}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                      onClick={() => toggleMenu(index)}
                      aria-label={t("manufacturerlist.Actions")}
                    >
                      <FaEllipsisH />
                    </button>
                    {openMenu === index && (
                      <div className="absolute z-10 right-24 sm:right-28 top-6 w-36 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg dark:shadow-gray-700">
                        <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-lg hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white">
                          <BiShow className="mr-2" />
                          {t("manufacturerlist.ViewDetails")}
                        </button>
                        <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white">
                          <BiEdit className="mr-2" />
                          {t("manufacturerlist.Edit")}
                        </button>
                        <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white">
                          <BiTrash className="mr-2" />
                          {t("manufacturerlist.Remove")}
                        </button>
                      </div>
                    )}
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
      <SupplierFormModal
        isOpen={isModalOpen}
        onClose={toggleForm}
        onSubmit={handleFormSubmit} // now it expects formData, not event
      />
    </div>
  );
};

export default Manufacturerlist;
