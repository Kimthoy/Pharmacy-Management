import { useEffect, useState, useMemo } from "react";
import { getAllSale } from "../api/saleService";
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

const SellReport = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    searchTerm: "",
    startDate: "",
    endDate: "",
    month: "", // NEW: month filter
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 5,
  });

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getAllSale();

        const salesArray = Array.isArray(response)
          ? response
          : response.data || [];

        console.log("✅ API Sales Array:", salesArray);
        setSalesData(salesArray);
      } catch (err) {
        console.error("❌ Fetch Sales Error:", err);
        setError(err.message || "Failed to fetch sales");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  // ✅ FILTER sales
  const filteredData = useMemo(() => {
    return salesData.filter((sale) => {
      const search = filters.searchTerm.toLowerCase();

      const matchesSearch =
        !search ||
        sale.user?.username?.toLowerCase().includes(search) ||
        sale.user?.name?.toLowerCase().includes(search) ||
        sale.payment_method?.toLowerCase().includes(search) ||
        sale.sale_date?.toLowerCase().includes(search) ||
        sale.items?.some((item) =>
          item.medicine_name?.toLowerCase().includes(search)
        );

      const saleDate = new Date(sale.sale_date);

      const dateMatch =
        (!filters.startDate || saleDate >= new Date(filters.startDate)) &&
        (!filters.endDate || saleDate <= new Date(filters.endDate));

      const monthMatch = !filters.month
        ? true
        : saleDate.getFullYear() +
            "-" +
            String(saleDate.getMonth() + 1).padStart(2, "0") ===
          filters.month;

      return matchesSearch && dateMatch && monthMatch;
    });
  }, [salesData, filters]);

  // ✅ Total Sales for Filtered Data
  const totalSales = filteredData.reduce(
    (sum, sale) => sum + parseFloat(sale.total_amount || 0),
    0
  );

  // ✅ Chart Data
  const chartData = filteredData.map((sale) => ({
    date: sale.sale_date,
    amount: parseFloat(sale.total_amount),
  }));

  // ✅ Pagination
  const totalPages =
    Math.ceil(filteredData.length / pagination.rowsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (pagination.currentPage - 1) * pagination.rowsPerPage,
    pagination.currentPage * pagination.rowsPerPage
  );

  // ✅ Print ONLY filtered table content
  const handlePrintTable = () => {
    const tableContent =
      document.getElementById("sales-report-table").outerHTML;

    const printWindow = window.open("", "_blank", "width=900,height=600");

    const selectedMonthText = filters.month
      ? new Date(filters.month + "-01").toLocaleString("default", {
          month: "long",
          year: "numeric",
        })
      : "All Months";

    printWindow.document.write(`
      <html>
        <head>
          <title>Sales Report - ${selectedMonthText}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f4f4f4; }
          </style>
        </head>
        <body>
          <h2>Sales Report - ${selectedMonthText}</h2>
          <p style="text-align:center;">Generated on: ${new Date().toLocaleString()}</p>
          <p style="text-align:center; font-weight:bold;">Total Sales: $${totalSales.toFixed(
            2
          )}</p>
          ${tableContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-300">
        {t("Loading sales report...")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {t("Error:")} {error}
      </div>
    );
  }

  return (
    <div className="sm:p-6 mb-32 bg-white dark:bg-gray-900 min-h-screen">
      {/* ✅ Header with Print Table Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="sm:text-lg text-md font-bold text-gray-500 dark:text-gray-200">
          {t("sellreport.SalesReportTitle")}
        </h2>

        {/* ✅ Print Table Only */}
      </div>

      <section className="mb-8">
        <p className="text-gray-500 dark:text-gray-300 text-xs">
          {t("sellreport.SalesReportDesc")}
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Total Sales Card */}
        <div className="bg-white dark:bg-gray-800 sm:p-6 sm:shadow-md dark:shadow-gray-700 sm:rounded-lg">
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="sm:text-lg underline text-md mb-4 font-semibold text-gray-800 dark:text-gray-200">
                {t("sellreport.TotalSales")}
              </h3>
              <p className="sm:text-md text-md font-bold text-emerald-600 dark:text-emerald-400">
                Total Sale : ${totalSales.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Sales chart */}
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4F46E5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Records Section */}
      <div className="bg-white dark:bg-gray-800 sm:p-6 sm:shadow-md dark:shadow-gray-700 rounded-lg mt-6">
        <h3 className="text-md  font-semibold text-gray-800 dark:text-gray-200 mb-6">
          {t("sellreport.SalesRecords")}
        </h3>
        <div className="flex ">
          <div className="flex mb-8">
            <div>
              <label className="block text-gray-400 dark:text-gray-300 mb-1 text-md">
                Filter by Month
              </label>
              <input
                type="month"
                className="border p-1 rounded-md dark:bg-gray-700 dark:text-gray-200"
                value={filters.month}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    month: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <button
            onClick={handlePrintTable}
            className="px-4 py-2 mb-4 text-green-600 underline"
          >
            🖨 Print Sale
          </button>
        </div>

        <table
          id="sales-report-table"
          className="w-full bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                Payment Type
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                Sale Date
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                Total Sale
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                Product
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                Quantity
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((sale) =>
                sale.sale_items?.length > 0 ? (
                  sale.sale_items.map((item, index) => (
                    <tr
                      key={`${sale.id}-${item.id}`}
                      className="border-b border-gray-200 dark:border-gray-600"
                    >
                      {index === 0 ? (
                        <>
                          <td
                            className="px-6 py-4 text-gray-500 dark:text-gray-300"
                            rowSpan={sale.sale_items.length}
                          >
                            {sale.payment_method || "N/A"}
                          </td>
                          <td
                            className="px-6 py-4 text-gray-500 dark:text-gray-300"
                            rowSpan={sale.sale_items.length}
                          >
                            {new Date(sale.sale_date).toLocaleDateString()}
                          </td>
                          <td
                            className="px-6 py-4 text-gray-500 dark:text-gray-300"
                            rowSpan={sale.sale_items.length}
                          >
                            ${parseFloat(sale.total_amount || 0).toFixed(2)}
                          </td>
                        </>
                      ) : null}

                      {/* Product info */}
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {item.medicine_name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {item.quantity}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr
                    key={sale.id}
                    className="border-b border-gray-200 dark:border-gray-600"
                  >
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                      {sale.payment_method || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                      {new Date(sale.sale_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                      ${parseFloat(sale.total_amount || 0).toFixed(2)}
                    </td>
                    <td
                      colSpan="2"
                      className="px-6 py-4 text-gray-500 dark:text-gray-300"
                    >
                      No items
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-300"
                >
                  No sales found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        {/* Rows per page */}
        <div className="sm:flex hidden items-center gap-2">
          <label
            htmlFor="rowsPerPage"
            className="text-gray-400 dark:text-gray-300 text-md"
          >
            Rows per page
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
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        {/* Page controls */}
        <div className="flex items-center gap-3">
          <button
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-emerald-600 text-white dark:text-gray-300 text-md disabled:opacity-50"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: Math.max(1, prev.currentPage - 1),
              }))
            }
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-400 dark:text-gray-300 text-md">
            Page {pagination.currentPage} of {totalPages}
          </span>
          <button
            className="px-3 bg-emerald-600 text-white py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: Math.min(prev.currentPage + 1, totalPages),
              }))
            }
            disabled={pagination.currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellReport;
