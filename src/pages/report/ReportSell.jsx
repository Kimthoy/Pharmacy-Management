import React, { useEffect, useState, useMemo, useRef } from "react";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

const toNum = (v) => Number.parseFloat(v ?? 0) || 0;
const toDate = (v) => (v ? new Date(v) : new Date(0));
const formatKHR = (v) =>
  new Intl.NumberFormat("km-KH", {
    style: "currency",
    currency: "KHR",
    minimumFractionDigits: 0,
  }).format(toNum(v));

const getUnifiedItems = (sale) => {
  const meds = (sale?.sale_items ?? []).map((it) => ({
    key: `med-${it.id ?? Math.random()}`,
    name:
      it?.medicine?.medicine_name || it?.medicine_name || it?.name || "Unknown",
    quantity: it?.quantity ?? 0,
    kind: "medicine",
  }));
  const packs = (sale?.sale_retail_items ?? []).map((it) => ({
    key: `pkg-${it.id ?? Math.random()}`,
    name: it?.package?.name || it?.name || "Package",
    quantity: it?.quantity ?? 0,
    kind: "package",
  }));
  return [...meds, ...packs];
};

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const isRecentSale = (dateStr) => {
  const d = toDate(dateStr);
  const now = new Date();
  const diff = now - d;
  return diff >= 0 && diff <= TWO_DAYS_MS;
};
const RecentBadge = () => (
  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
    លក់ថ្នីៗ
  </span>
);

const SellReport = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const reportRef = useRef();

  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    searchTerm: "",
    startDate: "",
    endDate: "",
    month: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 5,
  });

  useEffect(() => {
    (async () => {
      try {
        const rows = await getAllSale();
        setSalesData(Array.isArray(rows) ? rows : []);
      } catch (err) {
        setError(err?.message || "Failed to fetch sales");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- filtering ---------- */
  const filteredData = useMemo(() => {
    const search = (filters.searchTerm || "").toLowerCase();
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;
    const monthTag = filters.month || "";

    return salesData.filter((sale) => {
      const items = getUnifiedItems(sale);
      const saleDate = toDate(sale.sale_date);

      const matchesSearch =
        !search ||
        (sale.user?.username || "").toLowerCase().includes(search) ||
        (sale.user?.name || "").toLowerCase().includes(search) ||
        (sale.payment_method || "").toLowerCase().includes(search) ||
        (sale.sale_date || "").toLowerCase().includes(search) ||
        items.some((it) => (it.name || "").toLowerCase().includes(search));

      const dateMatch =
        (!start || saleDate >= start) && (!end || saleDate <= end);

      const monthMatch = !monthTag
        ? true
        : `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(
            2,
            "0"
          )}` === monthTag;

      return matchesSearch && dateMatch && monthMatch;
    });
  }, [salesData, filters]);

  /* ---------- charts & totals ---------- */
  const chartData = useMemo(
    () =>
      [...filteredData]
        .sort((a, b) => toDate(a.sale_date) - toDate(b.sale_date))
        .map((sale) => ({
          date: toDate(sale.sale_date).toLocaleDateString(),
          amount: toNum(sale.total_amount),
        })),
    [filteredData]
  );

  const totalSales = useMemo(
    () =>
      filteredData.reduce(
        (sum, sale) => sum + (parseFloat(sale.total_amount) || 0),
        0
      ),
    [filteredData]
  );

  const productRows = useMemo(
    () => filteredData.filter((s) => (s.sale_items ?? []).length > 0),
    [filteredData]
  );
  const otherRows = useMemo(
    () => filteredData.filter((s) => (s.sale_items ?? []).length === 0),
    [filteredData]
  );

  const productsTotalUSD = useMemo(
    () => productRows.reduce((sum, s) => sum + toNum(s.total_amount), 0),
    [productRows]
  );
  const otherTotalKHR = useMemo(
    () => otherRows.reduce((sum, s) => sum + toNum(s.total_amount), 0),
    [otherRows]
  );

  const otherChartData = useMemo(
    () =>
      [...otherRows]
        .sort((a, b) => toDate(a.sale_date) - toDate(b.sale_date))
        .map((sale) => ({
          date: toDate(sale.sale_date).toLocaleDateString(),
          amount: toNum(sale.total_amount),
        })),
    [otherRows]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(productRows.length / pagination.rowsPerPage)
  );
  const paginatedData = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.rowsPerPage;
    return productRows.slice(start, start + pagination.rowsPerPage);
  }, [productRows, pagination]);

  const handlePrintTable = () => {
    const tableContent =
      document.getElementById("sales-report-table").outerHTML;

    const selectedMonthText = filters.month
      ? new Date(filters.month + "-01").toLocaleString("default", {
          month: "long",
          year: "numeric",
        })
      : "All Months";

    const dateRangeText =
      filters.startDate || filters.endDate
        ? `${filters.startDate || "Any"} → ${filters.endDate || "Any"}`
        : "All Dates";

    const totalText = totalSales.toFixed(2);

    const w = window.open("", "_blank", "width=900,height=700");
    w.document.write(`
      <html>
        <head>
          <title>Sales Report - ${selectedMonthText}</title>
          <style>
            body { margin:0; font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            p { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f4f4f4; }
          </style>
        </head>
        <body>
          <h2>Sales Report</h2>
          <p>Month: <strong>${selectedMonthText}</strong></p>
          <p>Date Range: <strong>${dateRangeText}</strong></p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p style="font-weight:bold;">Total Sales: $${totalText}</p>
          ${tableContent}
        </body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) {
      alert("Report section not found!");
      return;
    }
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      backgroundColor: "#fff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`sales-report-${Date.now()}.pdf`);
  };

  const handleDownloadExcel = () => {
    const rows = filteredData.flatMap((sale) => {
      const base = {
        Payment_Method: sale.payment_method || "N/A",
        Sale_Date: toDate(sale.sale_date).toLocaleDateString(),
        Total_Sale: toNum(sale.total_amount),
      };
      const items = getUnifiedItems(sale);
      if (items.length === 0) {
        return [{ ...base, Product: "No items", Quantity: 0 }];
      }
      return items.map((it) => ({
        ...base,
        Product: it.name,
        Quantity: it.quantity,
      }));
    });

    if (rows.length === 0) {
      alert("No sales data to export!");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales_Report");
    XLSX.writeFile(wb, `sales-report-${Date.now()}.xlsx`);
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-300">
        {t("Loading sales report...")}
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        {t("Error:")} {error}
      </div>
    );

  return (
    <div className="sm:p-6 mb-32 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="sm:text-lg text-md font-bold text-gray-500 dark:text-gray-200">
          {t("sellreport.SalesReportTitle")}
        </h2>
      </div>

      <div ref={reportRef}>
        <section className="mb-4">
          <p className="text-gray-500 dark:text-gray-300 text-xs">
            {t("sellreport.SalesReportDesc")}
          </p>
        </section>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-md border p-3 dark:border-gray-700">
            <div className="text-xs text-gray-500">
              {t("sellreport.ProductsTotal(USD)")}
            </div>
            <div className="text-lg font-semibold">
              ${productsTotalUSD.toFixed(2)}
            </div>
          </div>
          <div className="rounded-md border p-3 dark:border-gray-700">
            <div className="text-xs text-gray-500">
              {t("sellreport.OtherTotal(KHR)")}
            </div>
            <div className="text-lg font-semibold">
              {formatKHR(otherTotalKHR)}
            </div>
          </div>
          <div className="rounded-md border p-3 dark:border-gray-700">
            <div className="text-xs text-gray-500">
              {t("sellreport.Entries")}
            </div>
            <div className="text-lg font-semibold">
              {productRows.length + otherRows.length}
            </div>
          </div>
        </div>

        {/* charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 sm:p-6 sm:shadow-md dark:shadow-gray-700 sm:rounded-lg">
            <h3 className="sm:text-lg underline text-md mb-4 font-semibold text-gray-800 dark:text-gray-200">
              {t("sellreport.TotalSales")}
            </h3>
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

          <div className="bg-white dark:bg-gray-800 sm:p-6 sm:shadow-md dark:shadow-gray-700 sm:rounded-lg">
            <h3 className="sm:text-lg underline text-md mb-4 font-semibold text-gray-800 dark:text-gray-200">
              {t("sellreport.OtherSales(Packages/Noitems)")}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={otherChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* filters & exports */}
        <div className="flex gap-4 mt-6">
          <div>
            <label className="block  dark:text-gray-300 mb-1 text-md">
              {t("sellreport.FilterbyMonth")}
            </label>
            <input
              type="month"
              className="border p-1 rounded-md dark:bg-gray-700 dark:text-gray-200"
              value={filters.month}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, month: e.target.value }))
              }
            />
            <button
              onClick={handlePrintTable}
              className="px-2 py-2 text-green-600 underline"
            >
              {t("sellreport.PrintReport")}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-2 py-2 text-blue-600 underline"
            >
              PDF
            </button>
            <button
              onClick={handleDownloadExcel}
              className="px-2 py-2 text-emerald-600 underline"
            >
              Excel
            </button>
          </div>
        </div>

        {/* ===================== PRODUCTS TABLE (USD) ===================== */}
        <div className="bg-white dark:bg-gray-800 sm:p-6 sm:shadow-md dark:shadow-gray-700 rounded-lg mt-6">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {t("sellreport.SalesRecords")}
          </h3>
          <div className="text-sm text-gray-500 mb-4">
            {t("sellreport.SectionTotal(USD)")}:{" "}
            <span className="font-semibold">
              ${productsTotalUSD.toFixed(2)}
            </span>
          </div>

          <table
            id="sales-report-table"
            className="w-full bg-white dark:bg-gray-800  dark:shadow-gray-700  border-gray-200 dark:border-gray-600"
          >
            <thead>
              <tr className="bg-green-600 text-white border-b border-gray-200 dark:border-gray-600">
                <th className="px-2 py-3 text-left  dark:text-gray-300 text-md">
                  {t("sellreport.PaymentType")}
                </th>
                <th className="px-2 py-3 text-left  dark:text-gray-300 text-md">
                  {t("sellreport.SaleDate")}
                </th>
                <th className="px-2 py-3 text-left  dark:text-gray-300 text-md">
                  {t("sellreport.Total")}
                </th>
                <th className="px-2 py-3 text-left  dark:text-gray-300 text-md">
                  {t("sellreport.Product")}
                </th>
                <th className="px-2 py-3 text-left  dark:text-gray-300 text-md">
                  {t("sellreport.Quantity")}
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((sale) =>
                  (sale.sale_items ?? []).map((item, index, arr) => (
                    <tr
                      key={`${sale.id}-${item.id}`}
                      className=" hover:cursor-pointer transition-all hover:shadow-lg"
                    >
                      {index === 0 && (
                        <>
                          <td
                            className="px-2 py-4 text-gray-500 dark:text-gray-300 "
                            rowSpan={arr.length}
                          >
                            {sale.payment_method || "N/A"}
                          </td>
                          <td
                            className="px-2 py-4 text-gray-500 dark:text-gray-300"
                            rowSpan={arr.length}
                          >
                            {/* NEW: show recent badge next to date */}
                            <div className="flex items-center">
                              {toDate(sale.sale_date).toLocaleDateString()}
                              {isRecentSale(sale.sale_date) && <RecentBadge />}
                            </div>
                          </td>
                          <td
                            className="px-2 py-4 text-gray-500 dark:text-gray-300"
                            rowSpan={arr.length}
                          >
                            ${toNum(sale.total_amount).toFixed(2)}
                          </td>
                        </>
                      )}
                      <td className="px-2 py-4 text-gray-700 dark:text-gray-300">
                        {item?.medicine?.medicine_name ||
                          item?.medicine_name ||
                          "Unknown"}
                      </td>
                      <td className="px-2 py-4 text-gray-700 dark:text-gray-300">
                        {item.quantity}
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-300"
                  >
                    {t("sellreport.Nosalesfound")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===================== OTHER SALES TABLE (KHR ONLY) ===================== */}
        <div className="bg-white dark:bg-gray-800 sm:p-6 sm:shadow-md dark:shadow-gray-700 rounded-lg mt-6">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {t("sellreport.OtherSalesRecords—Packages/Noitems")}
          </h3>
          <div className="text-sm text-gray-500 mb-4">
            {t("sellreport.SectionTotal(KHR)")}:{" "}
            <span className="font-semibold">{formatKHR(otherTotalKHR)}</span>
          </div>

          <table className="w-full bg-white dark:bg-gray-800  dark:shadow-gray-700 rounded-lg  border-gray-200 dark:border-gray-600">
            <thead>
              <tr className="bg-green-600 text-white border-b border-gray-200 dark:border-gray-600">
                <th className="px-2 py-3 text-left  dark:text-gray-300 text-md">
                  {t("sellreport.PaymentType")}
                </th>
                <th className="px-2 py-3 text-left  dark:text-gray-300 text-md">
                  {t("sellreport.SaleDate")}
                </th>
                <th className="px-2 py-3 text-left  dark:text-gray-300 text-md">
                  {t("sellreport.Total(KHR)")}
                </th>
                <th className="px-2 py-3 text-left  dark:text-gray-300 text-md">
                  {t("sellreport.Package/Detail")}
                </th>
                <th className="px-2 py-3 text-left  dark:text-gray-300 text-md">
                  {t("sellreport.Quantity")}
                </th>
              </tr>
            </thead>

            <tbody>
              {otherRows.length > 0 ? (
                otherRows.map((sale) => {
                  const packItems = sale.sale_retail_items ?? [];

                  if (packItems.length === 0) {
                    return (
                      <tr
                        key={`other-${sale.id}`}
                        className=" hover:cursor-pointer transition-all hover:shadow-lg"
                      >
                        <td className="px-2 py-4 text-gray-500 dark:text-gray-300">
                          {sale.payment_method || "N/A"}
                        </td>
                        <td className="px-2 py-4 text-gray-500 dark:text-gray-300">
                          {/* NEW: badge for no-items row too */}
                          <div className="flex items-center">
                            {toDate(sale.sale_date).toLocaleDateString()}
                            {isRecentSale(sale.sale_date) && <RecentBadge />}
                          </div>
                        </td>
                        <td className="px-2 py-4 text-gray-500 dark:text-gray-300">
                          {formatKHR(sale.total_amount)}
                        </td>
                        <td className="px-2 py-4 text-gray-700 dark:text-gray-300">
                          {t("sellreport.Noitems")}
                        </td>
                        <td className="px-2 py-4 text-gray-700 dark:text-gray-300">
                          0
                        </td>
                      </tr>
                    );
                  }

                  return packItems.map((it, idx, arr) => (
                    <tr key={`other-${sale.id}-${it.id}`}>
                      {idx === 0 && (
                        <>
                          <td
                            className="px-2 py-4 text-gray-500 dark:text-gray-300"
                            rowSpan={arr.length}
                          >
                            {sale.payment_method || "N/A"}
                          </td>
                          <td
                            className="px-2 py-4 text-gray-500 dark:text-gray-300"
                            rowSpan={arr.length}
                          >
                            {/* NEW: badge for grouped rows */}
                            <div className="flex items-center">
                              {toDate(sale.sale_date).toLocaleDateString()}
                              {isRecentSale(sale.sale_date) && <RecentBadge />}
                            </div>
                          </td>
                          <td
                            className="px-2 py-4 text-gray-500 dark:text-gray-300"
                            rowSpan={arr.length}
                          >
                            {formatKHR(sale.total_amount)}
                          </td>
                        </>
                      )}
                      <td className="px-2 py-4 text-gray-700 dark:text-gray-300">
                        {it?.package?.name || it?.name || "Package"}
                      </td>
                      <td className="px-2 py-4 text-gray-700 dark:text-gray-300">
                        {it.quantity}
                      </td>
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-300"
                  >
                    {t("sellreport.Noothersalesfound")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* pagination controls for the PRODUCTS table */}
      <div className="flex justify-between items-center mt-4">
        <div className="hidden sm:flex items-center gap-2">
          <label htmlFor="rowsPerPage" className=" dark:text-gray-300 text-md">
            {t("sellreport.Rowsperpage")}
          </label>
          <select
            id="rowsPerPage"
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
            value={pagination.rowsPerPage}
            onChange={(e) =>
              setPagination({
                currentPage: 1,
                rowsPerPage: parseInt(e.target.value, 10),
              })
            }
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-emerald-600 text-white disabled:opacity-50"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: Math.max(1, prev.currentPage - 1),
              }))
            }
            disabled={pagination.currentPage === 1}
          >
            {t("sellreport.Previous")}
          </button>
          <span className=" dark:text-gray-300 text-md">
            {t("sellreport.Page")} {pagination.currentPage} {t("sellreport.of")}{" "}
            {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-emerald-600 text-white rounded-md disabled:opacity-50"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: Math.min(prev.currentPage + 1, totalPages),
              }))
            }
            disabled={pagination.currentPage === totalPages}
          >
            {t("sellreport.Next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellReport;
