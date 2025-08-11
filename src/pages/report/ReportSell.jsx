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
    const fetchSales = async () => {
      try {
        const response = await getAllSale();
        const salesArray = Array.isArray(response)
          ? response
          : response?.data || [];
        setSalesData(salesArray);
      } catch (err) {
        setError(err.message || "Failed to fetch sales");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

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
        : `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(
            2,
            "0"
          )}` === filters.month;

      return matchesSearch && dateMatch && monthMatch;
    });
  }, [salesData, filters]);

  const chartData = useMemo(() => {
    return [...filteredData]
      .sort((a, b) => new Date(a.sale_date) - new Date(b.sale_date))
      .map((sale) => ({
        date: new Date(sale.sale_date).toLocaleDateString(),
        amount: parseFloat(sale.total_amount),
      }));
  }, [filteredData]);

  const totalSales = useMemo(
    () =>
      filteredData.reduce(
        (sum, sale) => sum + parseFloat(sale.total_amount || 0),
        0
      ),
    [filteredData]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / pagination.rowsPerPage)
  );
  const paginatedData = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.rowsPerPage;
    return filteredData.slice(start, start + pagination.rowsPerPage);
  }, [filteredData, pagination]);

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

    const printWindow = window.open("", "_blank", "width=500,height=400");
    printWindow.document.write(`
      <html>
        <head>
          <title>Sales Report - ${selectedMonthText}</title>
          <style>
        
            body { 
           
          margin: 0;
           font-family: Arial, sans-serif; padding: 20px; }
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

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
    const excelRows = filteredData.flatMap((sale) => {
      const baseInfo = {
        Payment_Method: sale.payment_method || "N/A",
        Sale_Date: new Date(sale.sale_date).toLocaleDateString(),
        Total_Sale: parseFloat(sale.total_amount || 0),
      };

      if (sale.sale_items?.length > 0) {
        return sale.sale_items.map((item) => ({
          ...baseInfo,
          Product: item.medicine_name || "Unknown",
          Quantity: item.quantity,
        }));
      }

      return [
        {
          ...baseInfo,
          Product: "No items",
          Quantity: 0,
        },
      ];
    });

    if (excelRows.length === 0) {
      alert("No sales data to export!");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(excelRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales_Report");
    XLSX.writeFile(wb, `sales-report-${Date.now()}.xlsx`);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="sm:text-lg text-md font-bold text-gray-500 dark:text-gray-200">
          {t("sellreport.SalesReportTitle")}
        </h2>
      </div>
      <div ref={reportRef}>
        <section className="mb-8">
          <p className="text-gray-500 dark:text-gray-300 text-xs">
            {t("sellreport.SalesReportDesc")}
          </p>
          <p className="mt-2 font-semibold text-emerald-600">
            Total Sales (Filtered): ${totalSales.toFixed(2)}
          </p>
        </section>
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
        </div>
        <div className="flex gap-4 mt-6">
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

            <button
              onClick={handlePrintTable}
              className="px-4 py-2 text-green-600 underline"
            >
              🖨 Print Report
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 text-blue-600 underline"
            >
              ⬇ PDF
            </button>
            <button
              onClick={handleDownloadExcel}
              className="px-4 py-2 text-emerald-600 underline"
            >
              ⬇ Excel
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 sm:p-6 sm:shadow-md dark:shadow-gray-700 rounded-lg mt-6">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-6">
            {t("sellreport.SalesRecords")}
          </h3>
          <table
            id="sales-report-table"
            className="w-full bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="px-4 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                  Payment Type
                </th>
                <th className="px-4 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                  Sale Date
                </th>
                <th className="px-4 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-gray-400 dark:text-gray-300 text-md">
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
                        {index === 0 && (
                          <>
                            <td
                              className="px-4 py-4 text-gray-500 dark:text-gray-300"
                              rowSpan={sale.sale_items.length}
                            >
                              {sale.payment_method || "N/A"}
                            </td>
                            <td
                              className="px-4 py-4 text-gray-500 dark:text-gray-300"
                              rowSpan={sale.sale_items.length}
                            >
                              {new Date(sale.sale_date).toLocaleDateString()}
                            </td>
                            <td
                              className="px-4 py-4 text-gray-500 dark:text-gray-300"
                              rowSpan={sale.sale_items.length}
                            >
                              ${parseFloat(sale.total_amount || 0).toFixed(2)}
                            </td>
                          </>
                        )}
                        <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                          {item.medicine_name || "Unknown"}
                        </td>
                        <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                          {item.quantity}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={sale.id}>
                      <td className="px-4 py-4 text-gray-500 dark:text-gray-300">
                        {sale.payment_method || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-gray-500 dark:text-gray-300">
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-gray-500 dark:text-gray-300">
                        ${parseFloat(sale.total_amount || 0).toFixed(2)}
                      </td>
                      <td
                        colSpan="2"
                        className="px-4 py-4 text-gray-500 dark:text-gray-300"
                      >
                        No items
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-300"
                  >
                    No sales found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="hidden sm:flex items-center gap-2">
          <label
            htmlFor="rowsPerPage"
            className="text-gray-400 dark:text-gray-300 text-md"
          >
            Rows per page
          </label>
          <select
            id="rowsPerPage"
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
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
            Previous
          </button>
          <span className="text-gray-400 dark:text-gray-300 text-md">
            Page {pagination.currentPage} of {totalPages}
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
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellReport;
