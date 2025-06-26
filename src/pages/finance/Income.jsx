import { useState, useEffect, useRef } from "react";
import { FaSort, FaCog, FaSun, FaMoon } from "react-icons/fa";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

const Income = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
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
  const filterRef = useRef(null);
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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
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
    <div className="sm:p-6 mb-20 sm:bg-gray-100 dark:bg-gray-900 min-h-screen max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-700 dark:text-gray-200">
            {t("income.IncomeDashboard")}
          </h1>
          <span className="text-md font-normal text-gray-400 dark:text-gray-300">
            {t("income.IncomeDashboardDesc")}
          </span>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={toggleTheme}
            className="text-md sm:flex hidden text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-lg dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          <div className="relative">
            <button
              className="text-md sm:text-emerald-500 bg-emerald-500 text-white dark:text-emerald-400 border sm:border-emerald-500 dark:border-emerald-400 px-4 py-2 rounded-lg dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
              onClick={() => setShowFilter(!showFilter)}
            >
              {t("income.IncomeDashboardFilteredBy")}: {selectedFilter}
            </button>
            {showFilter && (
              <div
                ref={filterRef}
                className="absolute top-[100%] mt-1 left-0 min-w-[160px] bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg p-2 z-[100]"
              >
                <button
                  onClick={() => filterIncome("All")}
                  className="block w-full text-left px-4 py-2 text-emerald-500 dark:text-emerald-400 sm:hover:bg-emerald-100 dark:hover:bg-emerald-600 rounded-lg text-md hover:bg-emerald-600 hover:text-white"
                >
                  {t("income.filterOptions.all")}
                </button>
                <button
                  onClick={() => filterIncome(3)}
                  className="block w-full text-left px-4 py-2 text-emerald-500 dark:text-emerald-400 sm:hover:bg-emerald-100 dark:hover:bg-emerald-600 rounded-lg text-md hover:bg-emerald-600 hover:text-white"
                >
                  {t("income.filterOptions.last3Days")}
                </button>
                <button
                  onClick={() => filterIncome(7)}
                  className="block w-full text-left px-4 py-2 text-emerald-500 dark:text-emerald-400 sm:hover:bg-emerald-100 dark:hover:bg-emerald-600 rounded-lg text-md hover:bg-emerald-600 hover:text-white"
                >
                  {t("income.filterOptions.last7Days")}
                </button>
              </div>
            )}
          </div>
          <button className="text-md sm:text-emerald-500 text-white bg-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-4 py-2 rounded-lg dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition">
            {t("income.addIncome")}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 grid gap-2 p-4 sm:rounded-lg sm:shadow-md shadow-lg dark:shadow-gray-700 text-center sm:hover:shadow-emerald-200 sm:dark:hover:shadow-emerald-600 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400 dark:text-gray-300">
            {t("income.summaryCards.todaysIncome")}
          </h2>
          <p className="font-bold text-gray-800 dark:text-gray-200">$10,945</p>
          <p className="text-emerald-500 dark:text-emerald-400">
            ↑ 4.63% {t("income.summaryCards.vsYesterday")}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 grid gap-2 p-4 sm:rounded-lg sm:shadow-md shadow-lg dark:shadow-gray-700 text-center sm:hover:shadow-emerald-200 dark:hover:shadow-emerald-600 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400 dark:text-gray-300">
            {t("income.summaryCards.thisWeekIncome")}
          </h2>
          <p className="font-bold text-gray-800 dark:text-gray-200">$12,338</p>
          <p className="text-red-500 dark:text-red-400">
            ↓ 2.34% {t("income.summaryCards.vsLastWeek")}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 grid gap-2 p-4 sm:rounded-lg sm:shadow-md shadow-lg dark:shadow-gray-700 text-center sm:hover:shadow-emerald-200 dark:hover:shadow-emerald-600 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400 dark:text-gray-300">
            {t("income.summaryCards.vsLastMonth")}
          </h2>
          <p className="font-bold text-gray-800 dark:text-gray-200">$20,847</p>
          <p className="text-emerald-500 dark:text-emerald-400">
            ↑ 4.63% {t("income.summaryCards.vsLastMonth")}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 grid gap-2 p-4 sm:rounded-lg sm:shadow-md shadow-lg dark:shadow-gray-700 text-center sm:hover:shadow-emerald-200 dark:hover:shadow-emerald-600 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400 dark:text-gray-300">
            {t("income.summaryCards.thisYearIncome")}
          </h2>
          <p className="font-bold text-gray-800 dark:text-gray-200">$23,485</p>
          <p className="text-emerald-500 dark:text-emerald-400">
            ↑ 1.34% {t("income.summaryCards.vsLastYear")}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-700 border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">
            {t("income.incomeList")}
          </h2>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder={t("income.searchPlaceholder")}
              value={searchQuery}
              onChange={handleSearch}
              className="text-md border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="sm:flex hidden bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-md dark:shadow-gray-600  items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600"
            >
              <FaSort />
            </button>
            <button className="sm:flex hidden bg-white dark:bg-gray-700 px-4 py-2 rounded-lg shadow-md dark:shadow-gray-600  items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600">
              <FaCog />
            </button>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-center">
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("income.category")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("income.invoiceId")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("income.date")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("income.incomeHead")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("income.amount")}
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
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300">
                    {item.category}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 cursor-pointer">
                    {item.id}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300">
                    {item.date}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300">
                    {item.head}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                    {item.amount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-16 border border-gray-300 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400"
                >
                  {t("income.noRecords")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="sm:flex hidden items-center space-x-2">
            <span className="text-gray-400 dark:text-gray-300 text-md">
              {t("income.show")}
            </span>
            <select
              className="text-md border border-gray-400 dark:border-gray-600 px-2 py-2 rounded-lg font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
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
            <span className="text-gray-400 dark:text-gray-300 text-md">
              {t("income.entries")}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="text-md text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-lg dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition disabled:opacity-50"
            >
              {t("income.previous")}
            </button>
            <span className="text-gray-700 dark:text-gray-200 text-md">
              {t("income.page")} {currentPage} {t("income.of")} {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="text-md text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-lg dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition disabled:opacity-50"
            >
              {t("income.next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;
