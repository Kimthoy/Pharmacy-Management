import React, { useState, useMemo, useEffect } from "react";
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
import { getAllSupply } from "../api/suppliesService";

const PurchaseReport = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    searchTerm: "",
    startDate: "",
    endDate: "",
    supplier: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 10,
  });

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const supplies = await getAllSupply();
        if (!Array.isArray(supplies)) {
          setPurchaseData([]);
          return;
        }

        const flattened = supplies.flatMap((supply) => {
          if (!supply.supply_items || supply.supply_items.length === 0) {
            return [];
          }

          return supply.supply_items.map((item) => ({
            id: `${supply.id}-${item.id}`,
            supplier: supply.supplier?.company_name || "Unknown Supplier",
            invoice_id: supply.invoice_id || "N/A",
            purchase_date: supply.invoice_date || new Date().toISOString(),
            medicine_name: item.medicine?.medicine_name || "Unknown Medicine",
            quantity: item.supply_quantity || 0,
            unit_price: parseFloat(item.unit_price || 0),
            total_cost:
              (item.supply_quantity || 0) * parseFloat(item.unit_price || 0),
          }));
        });
        setPurchaseData(flattened);
      } catch (err) {
     
        setError("Failed to load purchase report");
      } finally {
        setLoading(false);
      }
    };
    fetchSupplies();
  }, []);
  const filteredData = useMemo(() => {
    return purchaseData.filter((row) => {
      const search = filters.searchTerm.toLowerCase();
      const searchMatch =
        !filters.searchTerm ||
        row.medicine_name.toLowerCase().includes(search) ||
        row.supplier.toLowerCase().includes(search) ||
        row.invoice_id.toLowerCase().includes(search);

      const dateMatch =
        (!filters.startDate ||
          new Date(row.purchase_date) >= new Date(filters.startDate)) &&
        (!filters.endDate ||
          new Date(row.purchase_date) <= new Date(filters.endDate));

      const supplierMatch =
        !filters.supplier || row.supplier === filters.supplier;

      return searchMatch && dateMatch && supplierMatch;
    });
  }, [purchaseData, filters]);

  // ✅ Summary metrics
  const totalPurchaseAmount = filteredData.reduce(
    (sum, row) => sum + row.total_cost,
    0
  );
  const totalPurchases = filteredData.length;
  const totalPurchaseValue = filteredData.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  // ✅ Pagination
  const totalPages =
    Math.ceil(filteredData.length / pagination.rowsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (pagination.currentPage - 1) * pagination.rowsPerPage,
    pagination.currentPage * pagination.rowsPerPage
  );

  // ✅ Chart Data
  const chartData = filteredData.map((row) => ({
    date: row.purchase_date,
    total_cost: row.total_cost,
  }));

  // ✅ PRINT FUNCTION
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const tableRows = filteredData
      .map(
        (row) => `
        <tr>
          <td>${row.invoice_id}</td>
          <td>${row.supplier}</td>
          <td>${row.medicine_name}</td>
          <td>${row.quantity}</td>
          <td>$${row.unit_price.toFixed(2)}</td>
          <td>$${row.total_cost.toFixed(2)}</td>
          <td>${new Date(row.purchase_date).toLocaleDateString()}</td>
        </tr>
      `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Purchase Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            th { background: #f4f4f4; }
            .summary {
              margin-top: 10px;
              font-size: 16px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h1>Purchase Report</h1>
          <div class="summary">
            Total Purchases: ${totalPurchases} <br/>
            Total Purchase Amount: $${totalPurchaseAmount.toFixed(2)}
          </div>
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Supplier</th>
                <th>Medicine</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Cost</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (loading)
    return <p className="p-6 text-center">⏳ Loading Purchase Report...</p>;
  if (error) return <p className="p-6 text-center text-red-500">❌ {error}</p>;

  return (
    <div className="sm:p-6 mb-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      {/* Header Section */}
      <section className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="sm:text-2xl text-lg font-bold text-gray-700 dark:text-gray-200">
            Purchase Report
          </h2>
          <p className="text-md text-gray-500 dark:text-gray-300">
            View all purchases by supplier, medicine, and cost.
          </p>
        </div>
      </section>

      {/* Summary & Chart Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 sm:p-6 sm:shadow-md rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Purchase Summary
          </h3>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300">
              Total Purchase Amount
            </p>
            <p className="sm:text-2xl text-lg font-bold text-emerald-600 dark:text-emerald-400">
              ${totalPurchaseAmount.toFixed(2)}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300">
              Total Purchase quantity:
            </p>
            <p className="sm:text-2xl text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {totalPurchaseValue}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300">Total Purchases</p>
            <p className="sm:text-2xl text-lg font-bold text-gray-700 dark:text-gray-200">
              {totalPurchases}
            </p>
          </div>
        </div>

        {/* Purchase Trend Chart */}
        <div className="bg-white dark:bg-gray-800 w-[440px] p-6 shadow-lg rounded-lg">
          <h3 className="sm:text-lg text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Purchase Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#4b5563" : "#e5e7eb"}
              />
              <XAxis
                dataKey="date"
                stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <YAxis stroke={theme === "dark" ? "#9ca3af" : "#6b7280"} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total_cost"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Filter Purchases
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">
              Search
            </label>
            <input
              type="text"
              placeholder="Medicine, Supplier, Invoice"
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400"
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">
              Supplier
            </label>
            <input
              type="text"
              placeholder="Filter by Supplier"
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400"
              value={filters.supplier}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, supplier: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">
              Start Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">
              End Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>

          <div className="flex md:justify-end">
            <button
              onClick={handlePrint}
              className="w-full md:w-auto px-4 py-2 text-emerald-600 underline transition-all"
            >
              🖨 Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Table */}
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <th className="p-2 border">Invoice ID</th>
            <th className="p-2 border">Supplier</th>
            <th className="p-2 border">Medicine</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Unit Price</th>
            <th className="p-2 border">Total Cost</th>
            <th className="p-2 border">Purchase Date</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row) => (
              <tr
                key={row.id}
                className="border hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-2 border text-emerald-600 dark:text-emerald-400">
                  {row.invoice_id}
                </td>
                <td className="p-2 border text-gray-800 dark:text-gray-200">
                  {row.supplier}
                </td>
                <td className="p-2 border text-gray-800 dark:text-gray-200">
                  {row.medicine_name}
                </td>
                <td className="p-2 border text-gray-800 dark:text-gray-200">
                  {row.quantity}
                </td>
                <td className="p-2 border text-gray-800 dark:text-gray-200">
                  ${row.unit_price.toFixed(2)}
                </td>
                <td className="p-2 border font-semibold text-gray-700 dark:text-gray-300">
                  ${row.total_cost.toFixed(2)}
                </td>
                <td className="p-2 border text-gray-800 dark:text-gray-200">
                  {new Date(row.purchase_date).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="p-4 text-center text-gray-500 dark:text-gray-400"
              >
                No Purchases Found
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
          Prev
        </button>
        <span>
          Page {pagination.currentPage} of {totalPages}
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
          Next
        </button>
      </div>
    </div>
  );
};

export default PurchaseReport;
