import React, { useState } from "react";
import { FaSort, FaCog, FaFilter } from "react-icons/fa";

const InvoiceList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const originalInvoiceList = [
    {
      id: "#746F5K2",
      date: "23 Jan 2019, 10:45pm",
      amount: "$2300.00",
      status: "Complete",
    },
    {
      id: "#546H74W",
      date: "12 Jan 2020, 10:45pm",
      amount: "$120.00",
      status: "Pending",
    },
    {
      id: "#87X6A44",
      date: "26 Dec 2019, 12:15 pm",
      amount: "$560.00",
      status: "Complete",
    },
    {
      id: "#986G531",
      date: "21 Jan 2019, 6:12 am",
      amount: "$3654.00",
      status: "Cancelled",
    },
    {
      id: "#326T4M9",
      date: "21 Jan 2019, 6:12 am",
      amount: "$200.00",
      status: "Complete",
    },
    {
      id: "#746F5K2",
      date: "23 Jan 2019, 10:45pm",
      amount: "$2300.00",
      status: "Complete",
    },
    {
      id: "#546H74W",
      date: "12 Jan 2020, 10:45pm",
      amount: "$120.00",
      status: "Pending",
    },
    {
      id: "#87X6A44",
      date: "26 Dec 2019, 12:15 pm",
      amount: "$560.00",
      status: "Complete",
    },
    {
      id: "#546H74W",
      date: "12 Jan 2020, 10:45pm",
      amount: "$120.00",
      status: "Pending",
    },
    {
      id: "#87X6A44",
      date: "26 Dec 2019, 12:15 pm",
      amount: "$560.00",
      status: "Complete",
    },
  ];

  const [invoiceList, setInvoiceList] = useState(originalInvoiceList);

  // Filter by status
  const filterInvoices = (status) => {
    if (status === "All") {
      setInvoiceList(originalInvoiceList);
    } else {
      const filteredList = originalInvoiceList.filter(
        (item) => item.status === status
      );
      setInvoiceList(filteredList);
    }
    setSelectedFilter(status);
    setShowFilter(false);
    setCurrentPage(1);
  };

  // Sort by date
  const sortedList = [...invoiceList].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Search by ORDER ID
  const filteredList = sortedList.filter((item) =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">
          Invoices <br />
          <span className="text-sm font-normal text-gray-400">
            You have total {invoiceList.length} invoices.
          </span>
        </h1>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition">
          + Add Invoice
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">All Invoice</h2>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search by ORDER ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-3 py-2 rounded-md shadow-sm focus:outline-green-500 outline outline-green-300"
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-white px-4 py-2 rounded-md shadow-sm flex items-center space-x-2 outline outline-green-300"
            >
              <FaSort />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="bg-white px-4 py-2 rounded-md shadow-sm flex items-center space-x-2 outline outline-green-300"
              >
                <FaFilter />
              </button>
              {showFilter && (
                <div className="absolute top-12 right-0 bg-white shadow-md rounded-md w-40 p-2">
                  <button
                    onClick={() => filterInvoices("All")}
                    className="block w-full text-left px-4 py-2 text-green-500 hover:bg-green-100 rounded-md"
                  >
                    All
                  </button>
                  <button
                    onClick={() => filterInvoices("Complete")}
                    className="block w-full text-left px-4 py-2 text-green-500 hover:bg-green-100 rounded-md"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => filterInvoices("Pending")}
                    className="block w-full text-left px-4 py-2 text-green-500 hover:bg-green-100 rounded-md"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => filterInvoices("Cancelled")}
                    className="block w-full text-left px-4 py-2 text-green-500 hover:bg-green-100 rounded-md"
                  >
                    Cancelled
                  </button>
                </div>
              )}
            </div>
            <button className="bg-white px-4 py-2 rounded-md shadow-sm flex items-center space-x-2 outline outline-green-300">
              <FaCog />
            </button>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300 text-gray-700">
          <thead>
            <tr className="bg-gray-200 text-gray-500 text-center">
              <th className="p-3 border">ORDER ID</th>
              <th className="p-3 border">DATE</th>
              <th className="p-3 border">AMOUNT</th>
              <th className="p-3 border">STATUS</th>
              <th className="p-3 border">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length > 0 ? (
              paginatedList.map((item, index) => (
                <tr key={index} className="border text-center">
                  <td className="p-3 border text-green-500 cursor-pointer">
                    {item.id}
                  </td>
                  <td className="p-3 border text-gray-400">{item.date}</td>
                  <td className="p-3 border text-gray-800">{item.amount}</td>
                  <td className="p-3 border text-gray-400">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        item.status === "Complete"
                          ? "bg-green-500"
                          : item.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></span>{" "}
                    {item.status}
                  </td>
                  <td className="p-3 border text-gray-400">
                    <button className="text-blue-500 hover:text-blue-700">
                      ⏰ View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-3 border text-center text-gray-500"
                >
                  No invoice records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <div className="px-4 py-2 flex justify-between">
            <label>
              <span className="text-gray-400">Show</span>
              <select
                className="m-3 border p-1 focus:outline-green-500"
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
          <div className="flex items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="outline outline-green-500 px-3 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="m-3">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="outline outline-green-500 px-3 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
