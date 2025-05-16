import React, { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

const ledgerEntries = [
  {
    id: "#DP0796",
    date: "10 Feb 2020",
    debit: 9877,
    credit: 0,
    balance: 987,
  },
  {
    id: "#DP8567",
    date: "12 Jun 2020",
    debit: 0,
    credit: 9757,
    balance: 923,
  },
  {
    id: "#DP1092",
    date: "09 May 2020",
    debit: 6768,
    credit: 9776,
    balance: 0,
  },
];

const CustomerLedger = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      <h2 className="text-2xl font-bold mb-2 text-gray-500 dark:text-gray-200">
        {t("customerledger.CustomerLedgerTitle")}
      </h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          id="search"
          placeholder={t("customerledger.SearchPlaceholder")}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label
            htmlFor="startDate"
            className="me-2 text-gray-400 dark:text-gray-300 text-sm"
          >
            {t("customerledger.FilterStartDate")}
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
            {t("customerledger.FilterEndDate")}
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
                {t("customerledger.ID")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("customerledger.Date")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("customerledger.Debit")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("customerledger.Credit")}
              </th>
              <th className="p-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("customerledger.Balance")}
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
                  {entry.debit}
                </td>
                <td className="p-3 text-gray-400 dark:text-gray-300">
                  {entry.credit}
                </td>
                <td className="p-3 text-gray-400 dark:text-gray-300">
                  {entry.balance}
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
            {t("customerledger.RowsPerPage")}
          </span>
          <select
            id="rowsPerPage"
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
            aria-label={t("customerledger.RowsPerPage")}
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
            {t("customerledger.Previous")}
          </button>
          <span className="text-gray-400 dark:text-gray-300 text-sm">
            {t("customerledger.Page")} {currentPage} {t("customerledger.Of")}{" "}
            {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-400 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            {t("customerledger.Next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerLedger;
