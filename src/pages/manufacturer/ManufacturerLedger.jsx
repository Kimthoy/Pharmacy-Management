import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

const ledgerEntries = [
  {
    id: "#DP0796",
    date: "10 Feb 2020",
    pay_term: "On Delivery",
    debit: 9877,
    credit: 0,
    balance: 987,
  },
  {
    id: "#DP8567",
    date: "12 Jun 2020",
    pay_term: "After Dispatch",
    debit: 0,
    credit: 9757,
    balance: 923,
  },
  {
    id: "#DP1092",
    date: "09 May 2020",
    pay_term: "Final Settlement",
    debit: 6768,
    credit: 9776,
    balance: 0,
  },
];

const ManufacturerLedger = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const [formData, setFormData] = useState({
    id: "",
    date: "",
    pay_term: "On Delivery",
    debit: "",
    credit: "",
    balance: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    setFormData({
      id: "",
      date: "",
      pay_term: "On Delivery",
      debit: "",
      credit: "",
      balance: "",
      description: "",
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
    if (!formData.id.trim())
      errors.id = t("manufacturerledger.ErrorIDRequired");
    if (!formData.date.trim())
      errors.date = t("manufacturerledger.ErrorDateRequired");
    if (!formData.pay_term.trim())
      errors.pay_term = t("manufacturerledger.ErrorPayTermRequired");
    if (!formData.debit.trim())
      errors.debit = t("manufacturerledger.ErrorDebitRequired");
    else if (isNaN(formData.debit) || Number(formData.debit) < 0)
      errors.debit = t("manufacturerledger.ErrorDebitInvalid");
    if (!formData.credit.trim())
      errors.credit = t("manufacturerledger.ErrorCreditRequired");
    else if (isNaN(formData.credit) || Number(formData.credit) < 0)
      errors.credit = t("manufacturerledger.ErrorCreditInvalid");
    if (!formData.balance.trim())
      errors.balance = t("manufacturerledger.ErrorBalanceRequired");
    else if (isNaN(formData.balance) || Number(formData.balance) < 0)
      errors.balance = t("manufacturerledger.ErrorBalanceInvalid");
    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    // For demo, add to ledgerEntries array (replace with API call in production)
    ledgerEntries.push({
      ...formData,
      debit: Number(formData.debit),
      credit: Number(formData.credit),
      balance: Number(formData.balance),
    });
    toggleForm();
  };

  const filteredEntries = ledgerEntries.filter((entry) => {
    const matchesSearch = entry.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate =
      (!startDate || new Date(entry.date) >= new Date(startDate)) &&
      (!endDate || new Date(entry.date) <= new Date(endDate));
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedEntries = filteredEntries.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 rounded-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-500 dark:text-gray-200">
          {t("manufacturerledger.ManufacturerLedgerTitle")}
        </h2>
        <button
          type="button"
          onClick={toggleForm}
          className="border border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-300 hover:text-emerald-400 dark:hover:text-emerald-300 text-gray-400 dark:text-gray-300 px-4 py-2 rounded-md transition"
        >
          {t("manufacturerledger.AddLedgerEntry")}
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg dark:shadow-gray-700 w-11/12 md:w-1/2">
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {t("manufacturerledger.AddLedgerEntryTitle")}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mb-4">
              {t("manufacturerledger.AddLedgerEntryDesc")}
            </p>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="id"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerledger.ID")}
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    placeholder={t("manufacturerledger.IDPlaceholder")}
                    value={formData.id}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-green-500"
                  />
                  {formErrors.id && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.id}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="date"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerledger.Date")}
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 focus:outline-green-500"
                  />
                  {formErrors.date && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.date}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="pay_term"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerledger.PayTerm")}
                  </label>
                  <select
                    id="pay_term"
                    name="pay_term"
                    value={formData.pay_term}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 focus:outline-green-500"
                  >
                    <option value="On Delivery">
                      {t("manufacturerledger.PayTermOnDelivery")}
                    </option>
                    <option value="After Dispatch">
                      {t("manufacturerledger.PayTermAfterDispatch")}
                    </option>
                    <option value="Final Settlement">
                      {t("manufacturerledger.PayTermFinalSettlement")}
                    </option>
                  </select>
                  {formErrors.pay_term && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.pay_term}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="debit"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerledger.Debit")}
                  </label>
                  <input
                    type="number"
                    id="debit"
                    name="debit"
                    placeholder={t("manufacturerledger.DebitPlaceholder")}
                    value={formData.debit}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-green-500"
                    min="0"
                  />
                  {formErrors.debit && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.debit}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="credit"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerledger.Credit")}
                  </label>
                  <input
                    type="number"
                    id="credit"
                    name="credit"
                    placeholder={t("manufacturerledger.CreditPlaceholder")}
                    value={formData.credit}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-green-500"
                    min="0"
                  />
                  {formErrors.credit && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.credit}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="balance"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerledger.Balance")}
                  </label>
                  <input
                    type="number"
                    id="balance"
                    name="balance"
                    placeholder={t("manufacturerledger.BalancePlaceholder")}
                    value={formData.balance}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-green-500"
                    min="0"
                  />
                  {formErrors.balance && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.balance}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="description"
                    className="mb-1 text-gray-600 dark:text-gray-200 text-sm"
                  >
                    {t("manufacturerledger.Description")}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder={t("manufacturerledger.DescriptionPlaceholder")}
                    value={formData.description}
                    onChange={handleFormChange}
                    className="border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-green-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t("manufacturerledger.Cancel")}
                </button>
                <button
                  type="submit"
                  className="bg-emerald-400 dark:bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  {t("manufacturerledger.AddLedgerEntry")}
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
          placeholder={t("manufacturerledger.SearchPlaceholder")}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label
            htmlFor="startDate"
            className="me-2 text-gray-400 dark:text-gray-300 text-sm"
          >
            {t("manufacturerledger.FilterStartDate")}
          </label>
          <input
            type="date"
            id="startDate"
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="me-2 text-gray-400 dark:text-gray-300 text-sm"
          >
            {t("manufacturerledger.FilterEndDate")}
          </label>
          <input
            type="date"
            id="endDate"
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <thead className="border border-gray-200 dark:border-gray-600">
            <tr>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerledger.InvoiceNo")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerledger.Date")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerledger.PayTerm")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerledger.Debit")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerledger.Credit")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerledger.Balance")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("manufacturerledger.Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="border border-gray-200 dark:border-gray-600">
            {selectedEntries.map((entry, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 dark:border-gray-600 text-sm"
              >
                <td className="p-3 text-green-400 dark:text-green-300 cursor-pointer hover:underline">
                  {entry.id}
                </td>
                <td className="p-3 text-gray-400 dark:text-gray-300">
                  {entry.date}
                </td>
                <td className="p-3 text-gray-400 dark:text-gray-300">
                  {entry.pay_term}
                </td>
                <td className="p-3 text-gray-400 dark:text-gray-300">
                  {entry.debit}
                </td>
                <td className="p-3 text-gray-400 dark:text-gray-300">
                  {entry.credit}
                </td>
                <td className="p-3 text-gray-400 dark:text-gray-300">
                  {entry.balance}
                </td>
                <td className="p-3 relative">
                  <button
                    ref={menuRef}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                    onClick={() => toggleMenu(index)}
                    aria-label={t("manufacturerledger.Actions")}
                  >
                    <FaEllipsisH />
                  </button>
                  {openMenu === index && (
                    <div className="absolute z-10 right-16 top-2 w-36 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-md dark:shadow-gray-700">
                      <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white">
                        <BiShow className="mr-2" />
                        {t("manufacturerledger.ViewDetails")}
                      </button>
                      <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white">
                        <BiEdit className="mr-2" />
                        {t("manufacturerledger.Edit")}
                      </button>
                      <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white">
                        <BiTrash className="mr-2" />
                        {t("manufacturerledger.Delete")}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 dark:text-gray-300 text-sm">
            {t("manufacturerledger.RowsPerPage")}
          </span>
          <select
            id="rowsPerPage"
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
            aria-label={t("manufacturerledger.RowsPerPage")}
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
            {t("manufacturerledger.Previous")}
          </button>
          <span className="text-gray-400 dark:text-gray-300 text-sm">
            {t("manufacturerledger.Page")} {currentPage}{" "}
            {t("manufacturerledger.Of")} {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-400 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            {t("manufacturerledger.Next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerLedger;
