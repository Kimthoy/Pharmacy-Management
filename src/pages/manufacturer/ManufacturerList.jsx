import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

const manufacturers = [
  {
    manufacturer_id: "#M-35",
    company: "Healthcare",
    email: "info@softnio.com",
    phone: "+811 847-4958",
    address: "Stoeng Meanchey, Phnom Penh",
    balance: 7868.55,
    status: "active",
  },
  {
    manufacturer_id: "#M-98",
    company: "Healthcare",
    email: "info@softnio.com",
    phone: "+811 847-4958",
    address: "Stoeng Meanchey, Phnom Penh",
    balance: 7868.55,
    status: "active",
  },
  {
    manufacturer_id: "#M-35",
    company: "Healthcare",
    email: "info@softnio.com",
    phone: "+811 847-4958",
    address: "Stoeng Meanchey, Phnom Penh",
    balance: 7868.55,
    status: "active",
  },
  {
    manufacturer_id: "#M-98",
    company: "Healthcare",
    email: "info@softnio.com",
    phone: "+811 847-4958",
    address: "Stoeng Meanchey, Phnom Penh",
    balance: 7868.55,
    status: "active",
  },
];

const Manufacturerlist = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const [formData, setFormData] = useState({
    manufacturer_id: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    balance: "",
    status: "active",
  });
  const [formErrors, setFormErrors] = useState({});

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    setFormData({
      manufacturer_id: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      balance: "",
      status: "active",
    });
    setFormErrors({});
  };

  const toggleMenu = (index) => setOpenMenu(openMenu === index ? null : index);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.manufacturer_id.trim())
      errors.manufacturer_id = t(
        "manufacturerlist.ErrorManufacturerIDRequired"
      );
    if (!formData.company.trim())
      errors.company = t("manufacturerlist.ErrorCompanyRequired");
    if (!formData.email.trim())
      errors.email = t("manufacturerlist.ErrorEmailRequired");
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = t("manufacturerlist.ErrorEmailInvalid");
    if (!formData.phone.trim())
      errors.phone = t("manufacturerlist.ErrorPhoneRequired");
    if (!formData.address.trim())
      errors.address = t("manufacturerlist.ErrorAddressRequired");
    if (!formData.balance.trim())
      errors.balance = t("manufacturerlist.ErrorBalanceRequired");
    else if (isNaN(formData.balance) || Number(formData.balance) < 0)
      errors.balance = t("manufacturerlist.ErrorBalanceInvalid");
    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    // For demo, add to manufacturers array (replace with API call in production)
    manufacturers.push({
      ...formData,
      balance: Number(formData.balance),
    });
    toggleForm();
  };

  const filteredManufacturers = manufacturers.filter((man) =>
    man.manufacturer_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredManufacturers.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedManufacturers = filteredManufacturers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const getStatus = (status) => {
    if (status === "active")
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
    <div className="p-6 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 rounded-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-200">
            {t("manufacturerlist.ManufacturerListTitle")}
          </h2>
          <p className="text-gray-400 dark:text-gray-300 text-sm">
            {t("manufacturerlist.ManufacturerListDesc")}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleForm}
          className="border border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-300 hover:text-emerald-400 dark:hover:text-emerald-300 text-gray-400 dark:text-gray-300 px-4 py-2 rounded-md transition"
        >
          {t("manufacturerlist.AddManufacturer")}
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-gray-700 w-11/12 md:w-1/2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {t("manufacturerlist.AddManufacturerTitle")}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mb-4">
              {t("manufacturerlist.AddManufacturerDesc")}
            </p>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="manufacturer_id"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerlist.ManufacturerID")}
                  </label>
                  <input
                    type="text"
                    id="manufacturer_id"
                    name="manufacturer_id"
                    placeholder={t(
                      "manufacturerlist.ManufacturerIDPlaceholder"
                    )}
                    value={formData.manufacturer_id}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-green-500"
                  />
                  {formErrors.manufacturer_id && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.manufacturer_id}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="company"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerlist.Company")}
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder={t("manufacturerlist.CompanyPlaceholder")}
                    value={formData.company}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-green-500"
                  />
                  {formErrors.company && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.company}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerlist.Email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t("manufacturerlist.EmailPlaceholder")}
                    value={formData.email}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-green-500"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="phone"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerlist.Phone")}
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder={t("manufacturerlist.PhonePlaceholder")}
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-green-500"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="address"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerlist.Address")}
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder={t("manufacturerlist.AddressPlaceholder")}
                    value={formData.address}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-green-500"
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.address}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="balance"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerlist.Balance")}
                  </label>
                  <input
                    type="text"
                    id="balance"
                    name="balance"
                    placeholder={t("manufacturerlist.BalancePlaceholder")}
                    value={formData.balance}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-green-500"
                  />
                  {formErrors.balance && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.balance}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="status"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerlist.Status")}
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 focus:outline-green-500"
                  >
                    <option value="active">
                      {t("manufacturerlist.StatusActive")}
                    </option>
                    <option value="inactive">
                      {t("manufacturerlist.StatusInactive")}
                    </option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t("manufacturerlist.Cancel")}
                </button>
                <button
                  type="submit"
                  className="bg-emerald-400 dark:bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  {t("manufacturerlist.AddManufacturer")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <thead className="border border-gray-200 dark:border-gray-600">
            <tr>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerlist.ManufacturerID")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerlist.Company")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerlist.Phone")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerlist.Address")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerlist.Balance")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerlist.Status")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerlist.Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="border border-gray-200 dark:border-gray-600">
            {selectedManufacturers.map((man, index) => {
              const { text, color } = getStatus(man.status);
              return (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-600 text-sm"
                >
                  <td className="p-3 text-green-400 dark:text-green-300 cursor-pointer hover:underline">
                    {man.manufacturer_id}
                  </td>
                  <td className="p-3 text-gray-400 dark:text-gray-300">
                    {man.company}
                    <br />
                    <span className="text-gray-500 dark:text-gray-400">
                      {man.email}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400 dark:text-gray-300">
                    {man.phone}
                  </td>
                  <td className="p-3 text-gray-400 dark:text-gray-300">
                    {man.address}
                  </td>
                  <td className="p-3 text-gray-400 dark:text-gray-300">
                    {man.balance}
                  </td>
                  <td className={`p-3 ${color}`}>{text}</td>
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
                      <div className="absolute z-10 right-16 top-2 w-36 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-md dark:shadow-gray-700">
                        <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white">
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

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 dark:text-gray-300 text-sm">
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
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-400 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            {t("manufacturerlist.Previous")}
          </button>
          <span className="text-gray-400 dark:text-gray-300 text-sm">
            {t("manufacturerlist.Page")} {currentPage}{" "}
            {t("manufacturerlist.Of")} {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-400 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            {t("manufacturerlist.Next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Manufacturerlist;
