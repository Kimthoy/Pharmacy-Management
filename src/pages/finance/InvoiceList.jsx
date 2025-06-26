import { useState, useRef, useEffect } from "react";
import { FaSort, FaCog, FaFilter, FaSun, FaMoon } from "react-icons/fa";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

const InvoiceList = ({ invoices }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filteredInvoices, setFilteredInvoices] = useState(invoices);

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
  const filterRef = useRef(null);
  const filterInvoices = (status) => {
    if (!Array.isArray(originalInvoiceList)) return;

    setSelectedFilter(status);
    if (status === "All") {
      setInvoiceList(originalInvoiceList);
    } else {
      const filtered = originalInvoiceList.filter(
        (item) => item.status === status
      );
      setInvoiceList(filtered);
    }
    setShowFilter(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const sortedList = [...invoiceList].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const filteredList = sortedList.filter((item) =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="sm:p-6 mb-20 sm:bg-gray-100 dark:bg-gray-900 min-h-screen max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200">
            {t("invoice.title")}
          </h1>
          <span className="text-xs font-normal text-gray-400 dark:text-gray-300">
            {t("invoice.description").replace("{count}", invoiceList.length)}
          </span>
        </div>
        <div className="flex items-center  mt-4 md:mt-0">
          {/* <button
            onClick={toggleTheme}
            className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-lg dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button> */}
          <button className="text-xs sm:text-emerald-500 text-white sm:bg-white bg-emerald-600 dark:text-emerald-400 border sm:border-emerald-500 dark:border-emerald-400 px-4 py-2 rounded-lg dark:hover:text-white hover:text-white sm:hover:bg-emerald-500 dark:hover:bg-emerald-400 transition">
            {t("invoice.addInvoice")}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 sm:p-6 sm:rounded-lg sm:shadow-md dark:shadow-gray-700 sm:border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
            {t("invoice.allInvoices")}
          </h2>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder={t("invoice.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="sm:flex hidden bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-md dark:shadow-gray-600  items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600"
            >
              <FaSort />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-md dark:shadow-gray-600 flex items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600"
              >
                <FaFilter />
              </button>
              {showFilter && (
                <div
                  ref={filterRef}
                  className="absolute top-12 right-0 bg-white dark:bg-gray-700 shadow-md dark:shadow-gray-600 rounded-lg w-40 p-2 z-10"
                >
                  <button
                    onClick={() => filterInvoices("All")}
                    className="block w-full text-left px-4 py-2 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600 rounded-lg text-xs"
                  >
                    {t("invoice.filterAll")}
                  </button>
                  <button
                    onClick={() => filterInvoices("Complete")}
                    className="block w-full text-left px-4 py-2 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600 rounded-lg text-xs"
                  >
                    {t("invoice.filterComplete")}
                  </button>
                  <button
                    onClick={() => filterInvoices("Pending")}
                    className="block w-full text-left px-4 py-2 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600 rounded-lg text-xs"
                  >
                    {t("invoice.filterPending")}
                  </button>
                  <button
                    onClick={() => filterInvoices("Cancelled")}
                    className="block w-full text-left px-4 py-2 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600 rounded-lg text-xs"
                  >
                    {t("invoice.filterCancelled")}
                  </button>
                </div>
              )}
            </div>
            <button className="sm:flex hidden bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-md dark:shadow-gray-600  items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600">
              <FaCog />
            </button>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-center">
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("invoice.orderId")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("invoice.date")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("invoice.amount")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("invoice.status")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("invoice.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length > 0 ? (
              paginatedList.map((item, index) => (
                <tr
                  key={index}
                  className="border border-gray-300 dark:border-gray-600 text-center"
                >
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 cursor-pointer">
                    {item.id}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300">
                    {item.date}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                    {item.amount}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        item.status === "Complete"
                          ? "bg-emerald-500 dark:bg-emerald-400"
                          : item.status === "Pending"
                          ? "bg-yellow-500 dark:bg-yellow-400"
                          : "bg-red-500 dark:bg-red-400"
                      }`}
                    ></span>{" "}
                    {t(`invoice.status${item.status}`)}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300">
                    <button className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs">
                      ⏰ {t("invoice.view")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-16 border border-gray-300 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400"
                >
                  {t("invoice.noRecords")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="sm:flex hidden items-center space-x-2">
            <span className="text-gray-400 dark:text-gray-300 text-xs">
              {t("invoice.show")}
            </span>
            <select
              className="text-xs border border-gray-400 dark:border-gray-600 px-2 py-2 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
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
            <span className="text-gray-400 dark:text-gray-300 text-xs">
              {t("invoice.entries")}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-lg dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition disabled:opacity-50"
            >
              {t("invoice.previous")}
            </button>
            <span className="text-gray-700 dark:text-gray-200 text-xs">
              {t("invoice.page")} {currentPage} {t("invoice.of")} {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-lg dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition disabled:opacity-50"
            >
              {t("invoice.next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
