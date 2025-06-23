import React, { useState, useMemo, useRef, useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

const STOCK_DATA = [
  {
    id: 1,
    medicine_name: "Paracetamol",
    category: "Tablets",
    quantity: 150,
    reorder_level: 50,
    stock_value: 2250,
    last_updated: "2024-03-15",
  },
  {
    id: 2,
    medicine_name: "Amoxicillin",
    category: "Capsules",
    quantity: 80,
    reorder_level: 30,
    stock_value: 1600,
    last_updated: "2024-03-16",
  },
  {
    id: 3,
    medicine_name: "Cough Syrup",
    category: "Syrups",
    quantity: 40,
    reorder_level: 20,
    stock_value: 1200,
    last_updated: "2024-03-17",
  },
  {
    id: 4,
    medicine_name: "Ibuprofen",
    category: "Tablets",
    quantity: 200,
    reorder_level: 60,
    stock_value: 3000,
    last_updated: "2024-03-18",
  },
  {
    id: 5,
    medicine_name: "Cefixime",
    category: "Capsules",
    quantity: 25,
    reorder_level: 40,
    stock_value: 750,
    last_updated: "2024-03-19",
  },
  {
    id: 6,
    medicine_name: "Antacid Syrup",
    category: "Syrups",
    quantity: 60,
    reorder_level: 25,
    stock_value: 1800,
    last_updated: "2024-03-20",
  },
  {
    id: 7,
    medicine_name: "Aspirin",
    category: "Tablets",
    quantity: 90,
    reorder_level: 30,
    stock_value: 1350,
    last_updated: "2024-03-21",
  },
  {
    id: 8,
    medicine_name: "Azithromycin",
    category: "Capsules",
    quantity: 110,
    reorder_level: 40,
    stock_value: 2200,
    last_updated: "2024-03-22",
  },
];

const StockReport = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [filters, setFilters] = useState({
    searchTerm: "",
    startDate: "",
    endDate: "",
    category: "",
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
    return STOCK_DATA.filter((item) => {
      const matchesSearch = item.medicine_name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
      const dateMatch =
        (!filters.startDate ||
          new Date(item.last_updated) >= new Date(filters.startDate)) &&
        (!filters.endDate ||
          new Date(item.last_updated) <= new Date(filters.endDate));
      const categoryMatch =
        !filters.category || item.category === filters.category;
      return matchesSearch && dateMatch && categoryMatch;
    });
  }, [filters]);

  // Compute summary metrics
  const totalStockValue = filteredData.reduce(
    (sum, item) => sum + item.stock_value,
    0
  );
  const lowStockItems = filteredData.filter(
    (item) => item.quantity <= item.reorder_level
  ).length;

  // Chart data by category
  const chartData = useMemo(() => {
    const categories = ["Tablets", "Capsules", "Syrups"];
    return categories.map((category) => ({
      category,
      quantity: filteredData
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.quantity, 0),
    }));
  }, [filteredData]);

  // Pagination logic
  const totalPages =
    Math.ceil(filteredData.length / pagination.rowsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (pagination.currentPage - 1) * pagination.rowsPerPage,
    pagination.currentPage * pagination.rowsPerPage
  );

  return (
    <div className="p-6 mb-14 bg-white dark:bg-gray-900 min-h-screen">
      {/* Stock Report Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-200">
          {t("stockreport.StockReportTitle")}
        </h2>
        <p className="text-gray-500 dark:text-gray-300">
          {t("stockreport.StockReportDesc")}
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Stock Summary Card */}
        <div className="bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t("stockreport.StockSummary")}
          </h3>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-200">
              {t("stockreport.TotalStockValue")}
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${totalStockValue.toFixed(2)}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-200">
              {t("stockreport.LowStockItems")}
            </p>
            <p className="text-2xl font-bold text-red-500 dark:text-red-400">
              {lowStockItems}
            </p>
          </div>
          <button className="text-emerald-600 dark:text-emerald-400 hover:underline">
            {t("stockreport.ViewDetailedReport")}
          </button>
        </div>

        {/* Stock by Category Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {t("stockreport.StockByCategory")}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#4b5563" : "#e5e7eb"}
              />
              <XAxis
                dataKey="category"
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
              <Bar
                dataKey="quantity"
                fill={theme === "dark" ? "#a78bfa" : "#8884d8"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Inventory Section */}
      <div className="bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-700 rounded-lg mt-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          {t("stockreport.StockInventory")}
        </h3>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label
              htmlFor="search"
              className="block text-gray-400 dark:text-gray-300 mb-1 text-sm"
            >
              {t("stockreport.Search")}
            </label>
            <input
              type="text"
              id="search"
              placeholder={t("stockreport.SearchPlaceholder")}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
            />
          </div>
          <div>
            <label
              htmlFor="startDate"
              className="block text-gray-400 dark:text-gray-300 mb-1 text-sm"
            >
              {t("stockreport.StartDate")}
            </label>
            <input
              type="date"
              id="startDate"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-gray-400 dark:text-gray-300 mb-1 text-sm"
            >
              {t("stockreport.EndDate")}
            </label>
            <input
              type="date"
              id="endDate"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-gray-400 dark:text-gray-300 mb-1 text-sm"
            >
              {t("stockreport.Category")}
            </label>
            <select
              id="category"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200"
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              aria-label={t("stockreport.Category")}
            >
              <option value="">{t("stockreport.AllCategories")}</option>
              <option value="Tablets">{t("stockreport.Tablets")}</option>
              <option value="Capsules">{t("stockreport.Capsules")}</option>
              <option value="Syrups">{t("stockreport.Syrups")}</option>
            </select>
          </div>
        </div>

        {/* Stock table */}
        <table className="w-full bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("stockreport.MedicineName")}
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("stockreport.Category")}
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("stockreport.Quantity")}
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("stockreport.ReorderLevel")}
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("stockreport.StockValue")}
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("stockreport.LastUpdated")}
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("stockreport.Actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 dark:border-gray-600"
              >
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-medium">
                  {item.medicine_name}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                  {item.category}
                </td>
                <td
                  className={`px-6 py-4 font-semibold ${
                    item.quantity <= item.reorder_level
                      ? "text-red-500 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-300"
                  }`}
                >
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                  {item.reorder_level}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                  ${item.stock_value}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                  {item.last_updated}
                </td>
                <td className="px-6 py-4 relative">
                  <button
                    ref={menuRef}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                    onClick={() =>
                      setOpenMenu(openMenu === item.id ? null : item.id)
                    }
                    aria-label={t("stockreport.Actions")}
                  >
                    <FaEllipsisH />
                  </button>
                  {openMenu === item.id && (
                    <div className="absolute z-10 right-16 top-2 w-36 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-md dark:shadow-gray-700">
                      <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-white">
                        <BiShow className="mr-2" />
                        {t("stockreport.ViewDetails")}
                      </button>
                      <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-white">
                        <BiEdit className="mr-2" />
                        {t("stockreport.Edit")}
                      </button>
                      <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-white">
                        <BiTrash className="mr-2" />
                        {t("stockreport.Delete")}
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
          <div className="flex items-center gap-2">
            <label
              htmlFor="rowsPerPage"
              className="text-gray-400 dark:text-gray-300 text-sm"
            >
              {t("stockreport.RowsPerPage")}
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
              aria-label={t("stockreport.RowsPerPage")}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-400 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: Math.max(1, prev.currentPage - 1),
                }))
              }
              disabled={pagination.currentPage === 1}
            >
              {t("stockreport.Previous")}
            </button>
            <span className="text-gray-400 dark:text-gray-300 text-sm">
              {t("stockreport.Page")} {pagination.currentPage}{" "}
              {t("stockreport.Of")} {totalPages}
            </span>
            <button
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-gray-400 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: Math.min(prev.currentPage + 1, totalPages),
                }))
              }
              disabled={pagination.currentPage === totalPages}
            >
              {t("stockreport.Next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockReport;
