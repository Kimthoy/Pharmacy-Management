import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Cell,
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
import { getAllStocks } from "../api/stockService";
const StockReport = () => {
  const { t } = useTranslation();
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState("medicine_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    searchTerm: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 10,
  });
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await getAllStocks();
        const stocks = Array.isArray(response.data) ? response.data : [];

        setStockData(stocks);
      } catch (err) {
        setError("Failed to load stock report");
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);
  const filteredData = useMemo(() => {
    return stockData.filter((item) => {
      const searchMatch =
        !filters.searchTerm ||
        String(item.medicine_id)
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        (item.notes?.toLowerCase() || "").includes(
          filters.searchTerm.toLowerCase()
        );

      const dateMatch =
        (!filters.startDate ||
          new Date(item.received_date) >= new Date(filters.startDate)) &&
        (!filters.endDate ||
          new Date(item.received_date) <= new Date(filters.endDate));

      return searchMatch && dateMatch;
    });
  }, [stockData, filters]);
  const sortedData = [...filteredData].sort((a, b) => {
    let valA, valB;
    if (sortField === "medicine_name") {
      valA = a.medicine?.medicine_name?.toLowerCase() || "";
      valB = b.medicine?.medicine_name?.toLowerCase() || "";
    } else if (sortField === "quantity") {
      valA = a.quantity;
      valB = b.quantity;
    } else if (sortField === "price_in") {
      valA = parseFloat(a.price_in || 0);
      valB = parseFloat(b.price_in || 0);
    } else if (sortField === "received_date") {
      valA = new Date(a.received_date);
      valB = new Date(b.received_date);
    } else {
      valA = a.id;
      valB = b.id;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalStockQuantity = filteredData.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const totalStockValue = filteredData.reduce(
    (sum, item) => sum + parseFloat(item.price_in || 0),
    0
  );
  const lowStockItems = filteredData.filter(
    (item) => item.quantity < 50
  ).length;
  const chartData = useMemo(() => {
    return filteredData.map((item) => ({
      name: `Med-${item.medicine?.medicine_name}`,
      quantity: item.quantity,
    }));
  }, [filteredData]);
  const totalPages = Math.ceil(sortedData.length / pagination.rowsPerPage) || 1;
  const paginatedData = sortedData.slice(
    (pagination.currentPage - 1) * pagination.rowsPerPage,
    pagination.currentPage * pagination.rowsPerPage
  );
  const handlePrint = () => {
    const printContent = document.getElementById("stock-table").outerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Stock Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f4f4f4; }
          </style>
        </head>
        <body>
          <h2>Stock Report</h2>
          <p><b>Total Stock Value:</b> $${totalStockValue.toFixed(2)}</p>
          <p><b>Low Stock Items:</b> ${lowStockItems} Medicines</p>
          ${printContent}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const COLORS = [
    "#34d399",
    "#60a5fa",
    "#f87171",
    "#fbbf24",
    "#a78bfa",
    "#f472b6",
    "#38bdf8",
    "#fb923c",
  ];

  return (
    <div className="sm:p-6 mb-24 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">
          {t("stock-report.StockReport")}
        </h2>
      </div>

      {/* Summary & Chart */}
      <div className="grid md:grid-cols-2 gap-2 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex gap-12">
            <div>
              <p className="text-gray-500 dark:text-gray-300 mb-5">
                {t("stock-report.TotalStockValue")}
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-5">
                ${totalStockValue.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-300 mb-5">
                {t("stock-report.TotalStockQuantity")}
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-5">
                {totalStockQuantity} {t("stock-report./Unit")}
              </p>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            {t("stock-report.LowStockItems:")}{" "}
            <span className="font-bold text-red-500 text-lg p-4">
              {lowStockItems} {t("stock-report.Medicines")}
            </span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-2 rounded-md shadow">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="1 1" stroke="#ccc" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="quantity">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search medicine or notes"
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-2 rounded w-1/3"
          value={filters.searchTerm}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
          }
        />

        <label className="py-2 text-gray-600 dark:text-gray-300">
          {t("stock-report.StartDate")}
        </label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, startDate: e.target.value }))
          }
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-2 rounded"
        />

        <label className="py-2 text-gray-600 dark:text-gray-300">
          {t("stock-report.EndDate")}
        </label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, endDate: e.target.value }))
          }
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-2 rounded"
        />

        <label className="text-gray-500 dark:text-gray-300">
          {t("stock-report.SortBy")}
        </label>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-2 rounded"
        >
          <option value="medicine_name">
            {t("stock-report.MedicineName")}
          </option>
          <option value="quantity">{t("stock-report.Quantity")}</option>
          <option value="price_in">{t("stock-report.Price")}</option>
          <option value="received_date">
            {t("stock-report.ReceivedDate")}
          </option>
        </select>

        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="px-4 py-2 bg-emerald-500 text-white rounded"
        >
          {sortOrder === "asc"
            ? t("stock-report.Ascending")
            : t("stock-report.Descending")}
        </button>

        <button
          onClick={handlePrint}
          className="px-4 py-2 text-emerald-600 underline"
        >
          {t("stock-report.ReportStock")}
        </button>
      </div>

      {/* Table */}
      <table
        id="stock-table"
        className="w-full border-collapse border border-gray-300 dark:border-gray-700"
      >
        <thead>
          <tr className="bg-green-600 dark:bg-gray-700 text-white dark:text-gray-200">
            <th className="p-2 border">{t("stock-report.MedicineName")}</th>
            <th className="p-2 border">{t("stock-report.Quantity")}</th>
            <th className="p-2 border">{t("stock-report.PriceIn")}</th>
            <th className="p-2 border">{t("stock-report.ReceivedDate")}</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((stock) => (
              <tr
                key={stock.id}
                className="border hover:shadow-inner transition-all hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-3  border text-gray-800 dark:text-gray-200">
                  {stock.medicine?.medicine_name}
                </td>
                <td
                  className={`p-2 border ${
                    stock.quantity < 50
                      ? "text-red-500"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {stock.quantity}
                </td>
                <td className="p-2 border text-gray-800 dark:text-gray-200">
                  ${stock.price_in}
                </td>
                <td className="p-2 border text-gray-800 dark:text-gray-200">
                  {new Date(stock.received_date).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="p-4 text-center text-gray-500 dark:text-gray-400"
              >
                {t("stock-report.NoStockFound")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={pagination.currentPage === 1}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              currentPage: prev.currentPage - 1,
            }))
          }
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          {t("stock-report.Prev")}
        </button>
        <span className="text-gray-700 dark:text-gray-200">
          {t("stock-report.Page")} {pagination.currentPage}{" "}
          {t("stock-report.of")}
          {totalPages}
        </span>
        <button
          disabled={pagination.currentPage === totalPages}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              currentPage: prev.currentPage + 1,
            }))
          }
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          {t("stock-report.Next")}
        </button>
      </div>
    </div>
  );
};

export default StockReport;
