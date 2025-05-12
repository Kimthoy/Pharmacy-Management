import  { useMemo, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const MEDICINES = [
  {
    id: 1,
    medicine_name: "P7865",
    percentage: 90,
    amount: 899,
    categories: "Tablets",
    date: "2024-03-15",
  },
  {
    id: 1,
    medicine_name: "P7865",
    percentage: 56,
    amount: 939,
    categories: "Tablets",
    date: "2024-03-15",
  },
  {
    id: 1,
    medicine_name: "P7865",
    amount: 987,
    percentage: 87,
    categories: "Tablets",
    date: "2024-03-15",
  },
  {
    id: 1,
    medicine_name: "P7865",
    percentage: 45,
    amount: 779,
    categories: "Tablets",
    date: "2024-03-15",
  },
  {
    id: 1,
    medicine_name: "P7865",
    percentage: 76,
    amount: 232,
    categories: "Tablets",
    date: "2024-03-15",
  },
  {
    id: 1,
    medicine_name: "P7865",
    percentage: 65,
    amount: 205,
    categories: "Tablets",
    date: "2024-03-15",
  },
  {
    id: 1,
    medicine_name: "P7865",
    percentage: 43,
    amount: 797,
    categories: "Tablets",
    date: "2024-03-15",
  },
  {
    id: 1,
    medicine_name: "P7865",
    amount: 876,
    percentage: 30,
    categories: "Tablets",
    date: "2024-03-15",
  },
];

const SellReport = () => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    startDate: "",
    endDate: "",
    reason: "",
    status: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 5,
  });
  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };
  // Memoized filtered data
  const filteredData = useMemo(() => {
    return MEDICINES.filter((med) => {
      const matchesSearch = med.medicine_name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
      const dateMatch =
        (!filters.startDate ||
          new Date(med.date) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(med.date) <= new Date(filters.endDate));
   

      return matchesSearch && dateMatch ;
    });
  }, [filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pagination.rowsPerPage);
  const paginatedData = filteredData.slice(
    (pagination.currentPage - 1) * pagination.rowsPerPage,
    pagination.currentPage * pagination.rowsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Sales Report Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Sales Report</h2>
        <p className="text-gray-500">
          Here is the sales report of this Month. Monthly sales performance
          overview
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Total Sales Card */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Total Sales</h3>
              <p className="text-3xl font-bold text-emerald-600">$74,958.49</p>
              <p className="text-gray-500">Last month: $7,395.37</p>
            </div>
            <button className="text-emerald-600 hover:underline">
              View Report
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Weekly Progress</p>
            <p className="text-2xl font-bold text-emerald-600">$1,338.72</p>
            <p className="flex items-center text-green-500">
              ↑ 4.63% <span className="text-gray-400 ml-1">vs. last week</span>
            </p>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MEDICINES}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Medicine Sales Card */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Most Sold Medicine</h3>
            <select className="border p-2 rounded-md text-sm focus:outline-emerald-500">
              <option>30 Days</option>
              <option>7 Days</option>
              <option>24 Hours</option>
            </select>
          </div>

          {/* Medicine progress bars */}
          {MEDICINES.map((med) => (
            <div key={med.id} className="mb-4">
              <div className="flex justify-between text-sm">
                <span>{med.categories}</span>
                <span>{med.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
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

      {/* Customer List Section */}
      <div className="bg-white p-6 shadow-md rounded-lg mt-6">
        <h3 className="text-xl font-semibold mb-6">Customer Lists</h3>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by ID..."
            className="border p-2 rounded-md focus:outline-emerald-500"
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
            }
          />

          <div className="flex gap-4">
            <div>
              <label className="block text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                className="border p-2 rounded-md focus:outline-emerald-500"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                className="border p-2 rounded-md focus:outline-emerald-500"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* Customer table */}
        <table className="w-full bg-white shadow-md rounded-lg border">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-gray-400">
                Medicine Name
              </th>
              <th className="px-6 py-3 text-left text-gray-400">
                Total Sales Amount (USD)
              </th>
              <th className="px-6 py-3 text-left text-gray-400">Categtory</th>
              <th className="px-6 py-3 text-left text-gray-400">
                Sales Quantity
              </th>
              <th className="px-6 py-3 text-left text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((med) => {
              return (
                <tr key={med.id} className="border-b">
                  <td className="px-6 py-4 font-medium">
                    <span>{med.medicine_name}</span>
                  </td>
                  <td className="px-6 font-semibold text-gray-500 py-4">
                    {" "}
                    <div>{med.amount}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{med.categories}</td>

                  <td className="px-6 py-4 text-gray-500 font-bold">
                    {med.amount}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{med.date}</td>
                  <td className="px-6 py-4">
                    <FaEllipsisH className="text-gray-500 hover:text-emerald-600 cursor-pointer" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <select
            className="border p-2 rounded-md focus:outline-emerald-500"
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

          <div className="flex items-center gap-3">
            <button
              className="text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 py-1 rounded border border-emerald-600"
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
            <span>
              Page {pagination.currentPage} of {totalPages}
            </span>
            <button
              className="text-emerald-600 hover:bg-emerald-500 hover:text-white px-3 py-1 rounded border border-emerald-600"
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
    </div>
  );
};

export default SellReport;
