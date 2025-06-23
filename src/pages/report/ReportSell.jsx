import { useMemo, useState, useRef, useEffect } from "react";
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

const SALES_DATA = [
  {
    id: 1,
    medicine_name: "P7865",
    percentage: 90,
    amount: 899,
    category: "Tablets",
    date: "2024-03-15",
  },
  {
    id: 2,
    medicine_name: "Q1234",
    percentage: 56,
    amount: 939,
    category: "Capsules",
    date: "2024-03-16",
  },
  {
    id: 3,
    medicine_name: "R5678",
    percentage: 87,
    amount: 987,
    category: "Syrups",
    date: "2024-03-17",
  },
  {
    id: 4,
    medicine_name: "S9012",
    percentage: 45,
    amount: 779,
    category: "Tablets",
    date: "2024-03-18",
  },
  {
    id: 5,
    medicine_name: "T3456",
    percentage: 76,
    amount: 232,
    category: "Capsules",
    date: "2024-03-19",
  },
  {
    id: 6,
    medicine_name: "U7890",
    percentage: 65,
    amount: 205,
    category: "Syrups",
    date: "2024-03-20",
  },
  {
    id: 7,
    medicine_name: "V2345",
    percentage: 43,
    amount: 797,
    category: "Tablets",
    date: "2024-03-21",
  },
  {
    id: 8,
    medicine_name: "W6789",
    percentage: 30,
    amount: 876,
    category: "Capsules",
    date: "2024-03-22",
  },
];

const SellReport = () => {
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
  const [timePeriod, setTimePeriod] = useState("30 Days");
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500 dark:bg-green-400";
    if (percentage >= 60) return "bg-blue-500 dark:bg-blue-400";
    if (percentage >= 40) return "bg-yellow-500 dark:bg-yellow-400";
    return "bg-red-500 dark:bg-red-400";
  };

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
    return SALES_DATA.filter((med) => {
      const matchesSearch = med.medicine_name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
      const dateMatch =
        (!filters.startDate ||
          new Date(med.date) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(med.date) <= new Date(filters.endDate));
      const categoryMatch =
        !filters.category || med.category === filters.category;
      return matchesSearch && dateMatch && categoryMatch;
    });
  }, [filters]);

  // Filter progress bars by time period
  const filteredProgressData = useMemo(() => {
    const now = new Date();
    let startDate;
    switch (timePeriod) {
      case "30 Days":
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case "7 Days":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "24 Hours":
        startDate = new Date(now.setHours(now.getHours() - 24));
        break;
      default:
        startDate = new Date(0);
    }
    return SALES_DATA.filter((med) => new Date(med.date) >= startDate);
  }, [timePeriod]);

  // Compute total sales
  const totalSales = filteredData.reduce((sum, med) => sum + med.amount, 0);

  // Pagination logic
  const totalPages =
    Math.ceil(filteredData.length / pagination.rowsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (pagination.currentPage - 1) * pagination.rowsPerPage,
    pagination.currentPage * pagination.rowsPerPage
  );

  return (
    <div className="p-6 mb-14 bg-white dark:bg-gray-900 min-h-screen">
      {/* Sales Report Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-200">
          {t("sellreport.SalesReportTitle")}
        </h2>
        <p className="text-gray-500 dark:text-gray-300">
          {t("sellreport.SalesReportDesc")}
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Total Sales Card */}
        <div className="bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-700 rounded-lg">
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {t("sellreport.TotalSales")}
              </h3>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                ${totalSales.toFixed(2)}
              </p>
              <p className="text-gray-500 dark:text-gray-300">
                {t("sellreport.LastMonth")}: $7,395.37
              </p>
            </div>
            <button className="text-emerald-600 dark:text-emerald-400 hover:underline">
              {t("sellreport.ViewReport")}
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-200">
              {t("sellreport.WeeklyProgress")}
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              $1,338.72
            </p>
            <p className="flex items-center text-green-500 dark:text-green-400">
              ↑ 4.63%{" "}
              <span className="text-gray-400 dark:text-gray-300 ml-1">
                {t("sellreport.VsLastWeek")}
              </span>
            </p>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={filteredData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "#4b5563" : "#e5e7eb"}
              />
              <XAxis
                dataKey="date"
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
                dataKey="amount"
                stroke={theme === "dark" ? "#a78bfa" : "#8884d8"}
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Medicine Sales Card */}
        <div className="bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-700 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {t("sellreport.MostSoldMedicine")}
            </h3>
            <select
              id="timePeriod"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md text-sm focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              aria-label={t("sellreport.TimePeriod")}
            >
              <option value="30 Days">{t("sellreport.30Days")}</option>
              <option value="7 Days">{t("sellreport.7Days")}</option>
              <option value="24 Hours">{t("sellreport.24Hours")}</option>
            </select>
          </div>

          {/* Medicine progress bars */}
          {filteredProgressData.map((med) => (
            <div key={med.id} className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-200">
                <span>{med.category}</span>
                <span>{med.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded h-2">
                <div
                  className={`h-2 rounded ${getProgressBarColor(
                    med.percentage
                  )}`}
                  style={{ width: `${med.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Records Section */}
      <div className="bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-700 rounded-lg mt-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          {t("sellreport.SalesRecords")}
        </h3>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label
              htmlFor="search"
              className="block text-gray-400 dark:text-gray-300 mb-1 text-sm"
            >
              {t("sellreport.Search")}
            </label>
            <input
              type="text"
              id="search"
              placeholder={t("sellreport.SearchPlaceholder")}
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
              {t("sellreport.StartDate")}
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
              {t("sellreport.EndDate")}
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
              {t("sellreport.Category")}
            </label>
            <select
              id="category"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-emerald-500 dark:bg-gray-700 dark:text-gray-200"
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              aria-label={t("sellreport.Category")}
            >
              <option value="">{t("sellreport.AllCategories")}</option>
              <option value="Tablets">{t("sellreport.Tablets")}</option>
              <option value="Capsules">{t("sellreport.Capsules")}</option>
              <option value="Syrups">{t("sellreport.Syrups")}</option>
            </select>
          </div>
        </div>

        {/* Sales table */}
        <table className="w-full bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("sellreport.MedicineName")}
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("sellreport.TotalSalesAmount")}
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("sellreport.Category")}
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("sellreport.SalesPercentage")}
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("sellreport.Date")}
              </th>
              <th className="px-6 py-3 text-left text-gray-400 dark:text-gray-300 text-sm">
                {t("sellreport.Actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((med) => (
              <tr
                key={med.id}
                className="border-b border-gray-200 dark:border-gray-600"
              >
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-medium">
                  {med.medicine_name}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-300 font-semibold">
                  ${med.amount}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                  {med.category}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-300 font-bold">
                  {med.percentage}%
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                  {med.date}
                </td>
                <td className="px-6 py-4 relative">
                  <button
                    ref={menuRef}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                    onClick={() =>
                      setOpenMenu(openMenu === med.id ? null : med.id)
                    }
                    aria-label={t("sellreport.Actions")}
                  >
                    <FaEllipsisH />
                  </button>
                  {openMenu === med.id && (
                    <div className="absolute z-10 right-16 top-2 w-36 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-md dark:shadow-gray-700">
                      <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-white">
                        <BiShow className="mr-2" />
                        {t("sellreport.ViewDetails")}
                      </button>
                      <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-white">
                        <BiEdit className="mr-2" />
                        {t("sellreport.Edit")}
                      </button>
                      <button className="flex items-center w-full text-left text-gray-600 dark:text-gray-200 py-2 px-3 hover:rounded-md hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-white">
                        <BiTrash className="mr-2" />
                        {t("sellreport.Delete")}
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
              {t("sellreport.RowsPerPage")}
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
              aria-label={t("sellreport.RowsPerPage")}
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
              {t("sellreport.Previous")}
            </button>
            <span className="text-gray-400 dark:text-gray-300 text-sm">
              {t("sellreport.Page")} {pagination.currentPage}{" "}
              {t("sellreport.Of")} {totalPages}
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
              {t("sellreport.Next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellReport;
