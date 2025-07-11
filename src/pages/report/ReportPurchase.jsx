import React, { useState, useMemo, useRef, useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

const PURCHASE_DATA = [
  {
    id: "PO001",
    medicine_name: "Paracetamol",
    supplier: "MediCorp",
    quantity: 100,
    total_cost: 1500,
    purchase_date: "2024-03-15",
  },
  {
    id: "PO002",
    medicine_name: "Amoxicillin",
    supplier: "PharmaPlus",
    quantity: 50,
    total_cost: 1000,
    purchase_date: "2024-03-16",
  },
  {
    id: "PO003",
    medicine_name: "Cough Syrup",
    supplier: "HealthMart",
    quantity: 30,
    total_cost: 900,
    purchase_date: "2024-03-17",
  },
  {
    id: "PO004",
    medicine_name: "Ibuprofen",
    supplier: "MediCorp",
    quantity: 80,
    total_cost: 1200,
    purchase_date: "2024-03-18",
  },
  {
    id: "PO005",
    medicine_name: "Cefixime",
    supplier: "PharmaPlus",
    quantity: 20,
    total_cost: 600,
    purchase_date: "2024-03-19",
  },
  {
    id: "PO006",
    medicine_name: "Antacid Syrup",
    supplier: "HealthMart",
    quantity: 40,
    total_cost: 1200,
    purchase_date: "2024-03-20",
  },
  {
    id: "PO007",
    medicine_name: "Aspirin",
    supplier: "MediCorp",
    quantity: 60,
    total_cost: 900,
    purchase_date: "2024-03-21",
  },
  {
    id: "PO008",
    medicine_name: "Azithromycin",
    supplier: "PharmaPlus",
    quantity: 70,
    total_cost: 1400,
    purchase_date: "2024-03-22",
  },
];

const PurchaseReport = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [filters, setFilters] = useState({
    searchTerm: "",
    startDate: "",
    endDate: "",
    supplier: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 5,
  });
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return PURCHASE_DATA.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.medicine_name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());
      const dateMatch =
        (!filters.startDate ||
          new Date(item.purchase_date) >= new Date(filters.startDate)) &&
        (!filters.endDate ||
          new Date(item.purchase_date) <= new Date(filters.endDate));
      const supplierMatch =
        !filters.supplier || item.supplier === filters.supplier;
      return matchesSearch && dateMatch && supplierMatch;
    });
  }, [filters]);

  // Compute summary metrics
  const totalPurchaseAmount = filteredData.reduce(
    (sum, item) => sum + item.total_cost,
    0
  );
  const totalPurchases = filteredData.length;

  // Pagination logic
  const totalPages =
    Math.ceil(filteredData.length / pagination.rowsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (pagination.currentPage - 1) * pagination.rowsPerPage,
    pagination.currentPage * pagination.rowsPerPage
  );

  return (
    <div className="sm:p-6 mb-16   bg-white dark:bg-gray-900 min-h-screen">
      {/* Purchase Report Section */}
      <section className="mb-8">
        <h2 className="sm:text-2xl text-lg font-bold text-gray-500 dark:text-gray-200">
          {t("purchasereport.PurchaseReportTitle")}
        </h2>
        <p className="text-md text-gray-500 dark:text-gray-300">
          {t("purchasereport.PurchaseReportDesc")}
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Purchase Summary Card */}
        <div className="bg-white dark:bg-gray-800 sm:p-6 sm:shadow-md dark:shadow-gray-700 sm:rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t("purchasereport.PurchaseSummary")}
          </h3>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-200">
              {t("purchasereport.TotalPurchaseAmount")}
            </p>
            <p className="sm:text-2xl text-lg font-bold text-emerald-600 dark:text-emerald-400">
              ${totalPurchaseAmount.toFixed(2)}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-200">
              {t("purchasereport.TotalPurchases")}
            </p>
            <p className="sm:text-2xl text-lg font-bold text-gray-500 dark:text-gray-300">
              {totalPurchases}
            </p>
          </div>
          <button className="text-emerald-600 dark:text-emerald-400 hover:underline">
            {t("purchasereport.ViewDetailedReport")}
          </button>
        </div>

        {/* Purchase Trend Chart */}
        <div className="bg-white dark:bg-gray-800 w-[440px] p-6 sm:shadow-md shadow-lg dark:shadow-gray-700 rounded-lg">
          <h3 className="sm:text-lg text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t("purchasereport.PurchaseTrend")}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={filteredData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#4b5563" : "#e5e7eb"}
              />
              <XAxis
                dataKey="purchase_date"
                stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <YAxis stroke={theme === "dark" ? "#9ca3af" : "#6b7280"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                  borderColor: theme === "dark" ? "#4b5563" : "#e5e7eb",
                  color: theme === "dark" ? "#e5e7eb" : "#374151",
                }}
              />
              <Line
                type="monotone"
                dataKey="total_cost"
                stroke={theme === "dark" ? "#a78bfa" : "#8884d8"}
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Purchase Records Section */}
      <div className="bg-white dark:bg-gray-800 sm:p-6 sm:shadow-md dark:shadow-gray-700 rounded-lg mt-6">
        <h3 className="sm:text-xl text-md font-semibold text-gray-800 dark:text-gray-200 mb-6">
          {t("purchasereport.PurchaseRecords")}
        </h3>

        {/* Filter controls */}
        <div className="sm:flex  sm:flex-wrap sm:gap-4 mb-6">
          <div>
            <label
              htmlFor="search"
              className="block text-gray-400 dark:text-gray-300 mb-1 text-md"
            >
              {t("purchasereport.Search")}
            </label>
            <input
              type="text"
              id="search"
              placeholder={t("purchasereport.SearchPlaceholder")}
              className="border w-full border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
            />
          </div>

          <div>
            <label
              htmlFor="supplier"
              className="block w-full text-gray-400 dark:text-gray-300 mb-1 text-md"
            >
              {t("purchasereport.Supplier")}
            </label>
            <select
              id="supplier"
              className="border w-full  border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200"
              value={filters.supplier}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, supplier: e.target.value }))
              }
              aria-label={t("purchasereport.Supplier")}
            >
              <option value="">{t("purchasereport.AllSuppliers")}</option>
              <option value="MediCorp">{t("purchasereport.MediCorp")}</option>
              <option value="PharmaPlus">
                {t("purchasereport.PharmaPlus")}
              </option>
              <option value="HealthMart">
                {t("purchasereport.HealthMart")}
              </option>
            </select>
          </div>
          <div className=" sm:flex block space-x-2 justify-center align-middle">
            <div>
              <label
                htmlFor="startDate"
                className="block w-full text-gray-400 dark:text-gray-300 mb-1 text-md"
              >
                {t("purchasereport.StartDate")}
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-gray-400 dark:text-gray-300 mb-1 text-md"
              >
                {t("purchasereport.EndDate")}
              </label>
              <input
                type="date"
                id="endDate"
                className="border w-full border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* Purchase table */}
        <table className="w-full bg-white dark:bg-gray-800 sm:hadow-md dark:shadow-gray-700 sm:rounded-lg border border-gray-200 dark:border-gray-600">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th className="sm:flex hidden px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("purchasereport.PurchaseID")}
              </th>
              <th className="px-5 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("purchasereport.MedicineName")}
              </th>
              <th className="px-5 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("purchasereport.Supplier")}
              </th>
              <th className="px-5 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("purchasereport.Quantity")}
              </th>
              <th className="sm:flex hidden px-5 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("purchasereport.TotalCost")}
              </th>
              <th className="sm:flex hidden px-5 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("purchasereport.PurchaseDate")}
              </th>
              <th className="px-5 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                {t("purchasereport.Actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 dark:border-gray-600"
              >
                <td className="sm:flex hidden px-5 py-4 text-emerald-600 dark:text-emerald-400 font-medium">
                  {item.id}
                </td>
                <td className="px-5 py-4 text-gray-800 dark:text-gray-200">
                  {item.medicine_name}
                </td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-300">
                  {item.supplier}
                </td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-300 font-semibold">
                  {item.quantity}
                </td>
                <td className="sm:flex hidden  px-5 py-4 text-gray-500 dark:text-gray-300">
                  ${item.total_cost}
                </td>
                <td className="sm:flex hidden px-5 py-4 text-gray-500 dark:text-gray-300">
                  {item.purchase_date}
                </td>
                <td className="px-5 py-4 relative">
                  <button
                    ref={menuRef}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                    onClick={() =>
                      setOpenMenu(openMenu === item.id ? null : item.id)
                    }
                    aria-label={t("purchasereport.Actions")}
                  >
                    <FaEllipsisH />
                  </button>
                  {openMenu === item.id && (
                    <div className="sm:w-40 w-44 absolute z-10 sm:right-[120px] right-[82px] sm:top-10 top-4  bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-md dark:shadow-gray-700">
                      <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-white">
                        <BiShow className="mr-2" />
                        {t("purchasereport.ViewDetails")}
                      </button>
                      <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-white">
                        <BiEdit className="mr-2" />
                        {t("purchasereport.Edit")}
                      </button>
                      <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-white">
                        <BiTrash className="mr-2" />
                        {t("purchasereport.Delete")}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="sm:flex hidden items-center gap-2">
            <label
              htmlFor="rowsPerPage"
              className="text-gray-400 dark:text-gray-300 text-md"
            >
              {t("purchasereport.RowsPerPage")}
            </label>
            <select
              id="rowsPerPage"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200"
              value={pagination.rowsPerPage}
              onChange={(e) =>
                setPagination({
                  currentPage: 1,
                  rowsPerPage: parseInt(e.target.value),
                })
              }
              aria-label={t("purchasereport.RowsPerPage")}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 border sm:bg-white bg-emerald-600 sm:text-emerald-600 text-white dark:border-gray-600 rounded-md  dark:text-gray-300 text-md sm:hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: Math.max(1, prev.currentPage - 1),
                }))
              }
              disabled={pagination.currentPage === 1}
            >
              {t("purchasereport.Previous")}
            </button>
            <span className="text-gray-400 dark:text-gray-300 text-md">
              {t("purchasereport.Page")} {pagination.currentPage}{" "}
              {t("purchasereport.Of")} {totalPages}
            </span>
            <button
              className="px-3 py-1 border sm:bg-white bg-emerald-600 sm:text-emerald-600 text-white border-gray-300 dark:border-gray-600 rounded-md  dark:text-gray-300 text-md sm:hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: Math.min(prev.currentPage + 1, totalPages),
                }))
              }
              disabled={pagination.currentPage === totalPages}
            >
              {t("purchasereport.Next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseReport;
