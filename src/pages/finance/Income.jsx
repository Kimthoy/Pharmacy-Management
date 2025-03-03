import React, { useState } from "react";
import { FaSort, FaCog } from "react-icons/fa";

const Income = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const originalIncomeList = [
    {
      category: "Tablet",
      id: "#746F5K2",
      date: "2024-02-25",
      head: "Sales Rate",
      amount: "$2300.00",
    },
    {
      category: "Parking",
      id: "#546H74W",
      date: "2024-02-22",
      head: "Parking Charges",
      amount: "$120.00",
    },
    {
      category: "Tablet",
      id: "#746F5K2",
      date: "2024-02-25",
      head: "Sales Rate",
      amount: "$2300.00",
    },
    {
      category: "Parking",
      id: "#546H74W",
      date: "2024-02-22",
      head: "Parking Charges",
      amount: "$120.00",
    },
    {
      category: "Tablet",
      id: "#746F5K2",
      date: "2024-02-25",
      head: "Sales Rate",
      amount: "$2300.00",
    },
    {
      category: "Parking",
      id: "#546H74W",
      date: "2024-02-22",
      head: "Parking Charges",
      amount: "$120.00",
    },
    {
      category: "Pablet",
      id: "#746F5K2",
      date: "2024-02-25",
      head: "Sales Rate",
      amount: "$2300.00",
    },
    {
      category: "Parking",
      id: "#546H74W",
      date: "2024-02-22",
      head: "Parking Charges",
      amount: "$120.00",
    },
    {
      category: "Tablet",
      id: "#746F5K2",
      date: "2024-02-25",
      head: "Sales Rate",
      amount: "$2300.00",
    },
    {
      category: "Parking",
      id: "#546H74W",
      date: "2024-02-22",
      head: "Parking Charges",
      amount: "$120.00",
    },
    {
      category: "Tablet",
      id: "#746F5K2",
      date: "2024-02-25",
      head: "Sales Rate",
      amount: "$2300.00",
    },
    {
      category: "Parking",
      id: "#546H74W",
      date: "2024-02-22",
      head: "Parking Charges",
      amount: "$120.00",
    },
  ];

  const [incomeList, setIncomeList] = useState(originalIncomeList);

  const filterIncome = (days) => {
    if (days === "All") {
      setSelectedFilter("All");
      setIncomeList(originalIncomeList);
    } else {
      const today = new Date();
      const filteredList = originalIncomeList.filter((item) => {
        const itemDate = new Date(item.date);
        return (today - itemDate) / (1000 * 60 * 60 * 24) <= days;
      });
      setSelectedFilter(`${days} Days`);
      setIncomeList(filteredList);
    }
    setShowFilter(false);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const sortedList = [...incomeList].sort((a, b) => {
    return sortOrder === "asc"
      ? a.category.localeCompare(b.category)
      : b.category.localeCompare(a.category);
  });

  const filteredList = sortedList.filter((item) =>
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">
          Income Dashboard <br />
          <span className="text-sm font-normal text-gray-400">
            Manage all income records efficiently.
          </span>
        </h1>

        <div className="relative flex items-center space-x-2">
          <button
            className="bg-white text-green-500 px-4 py-2 rounded-md shadow-sm outline outline-green-500 transition"
            onClick={() => setShowFilter(!showFilter)}
          >
            Filtered By: {selectedFilter}
          </button>
          {showFilter && (
            <div className="absolute top-12 left-0 bg-white shadow-md rounded-md w-40 p-2">
              <button
                onClick={() => filterIncome("All")}
                className="block w-full text-left px-4 py-2 text-green-500 hover:bg-green-200 rounded-md"
              >
                All
              </button>
              <button
                onClick={() => filterIncome(3)}
                className="block w-full text-left px-4 py-2 text-green-500 hover:bg-green-200 rounded-md"
              >
                Last 3 Days
              </button>
              <button
                onClick={() => filterIncome(7)}
                className="block w-full text-left px-4 py-2 text-green-500 hover:bg-green-200 rounded-md"
              >
                Last 7 Days
              </button>
            </div>
          )}
          <button className="outline text-green-500 px-4 py-2 rounded-md shadow-md hover:bg-green-200 transition">
            + Add Income
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white grid gap-2 p-4 rounded-lg shadow-md text-center hover:shadow-green-200 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400">
            Today's Income
          </h2>
          <p className=" font-bold">$10,945</p>
          <p className="text-green-500">↑ 4.63% vs. Yesterday</p>
        </div>
        <div className="bg-white grid gap-2 p-4 rounded-lg shadow-md text-center hover:shadow-green-200 duration-100 ease-in-out">
          <h2 className="text-md  font-semibold text-gray-400">
            This Week Income
          </h2>
          <p className="  font-bold">$12,338</p>
          <p className="text-red-500">↓ 2.34% vs. last week</p>
        </div>
        <div className="bg-white grid gap-2 p-4 rounded-lg shadow-md text-center hover:shadow-green-200 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400">
            This Month Income
          </h2>
          <p className=" font-bold">$20,847</p>
          <p className="text-green-500">↑ 4.63% vs. last Month</p>
        </div>
        <div className="bg-white grid gap-2 p-4 rounded-lg shadow-md text-center hover:shadow-green-200 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400">
            This Year Income
          </h2>
          <p className=" font-bold">$23,485</p>
          <p className="text-green-500">↑ 1.34% vs. last Year</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between align-middle">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Income List</h2>

          <div className=" flex items-center space-x-3 mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={handleSearch}
              className="border px-3 py-2 rounded-md shadow-sm focus:outline-green-700  outline outline-green-400"
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-white px-4 py-3 rounded-md shadow-sm flex items-center space-x-2 outline outline-green-400"
            >
              <FaSort />
            </button>
            <button className="bg-white px-4 py-3 rounded-md shadow-sm flex items-center space-x-2 outline outline-green-400">
              <FaCog />
            </button>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300 text-gray-700">
          <thead>
            <tr className="bg-gray-200 text-gray-500 text-center">
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Invoice ID</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Income Head</th>
              <th className="p-3 border">Amount</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length > 0 ? (
              paginatedList.map((item, index) => (
                <tr key={index} className="border text-center">
                  <td className="p-3 border text-gray-400">{item.category}</td>
                  <td className="p-3 border text-green-500 cursor-pointer">
                    {item.id}
                  </td>
                  <td className="p-3 border text-gray-400">{item.date}</td>
                  <td className="p-3 border text-gray-400">{item.head}</td>
                  <td className="p-3 border text-gray-800">{item.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-3 border text-center text-gray-500"
                >
                  No income records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between">
          <div className="px-4 py-2 flex justify-between">
            <label>
              <span className="text-gray-400">Show</span>
              <select
                className="m-3  border p-1 focus:outline-green-600"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="text-gray-400"> entries</span>
            </label>
          </div>
          <div className="flex  items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="outline outline-green-600 px-3 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="m-3">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className=" outline outline-green-600 px-3  rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;
