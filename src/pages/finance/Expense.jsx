import { useState } from "react";
import { FaSort, FaCog, FaSun, FaMoon } from "react-icons/fa";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

const Expense = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const originalExpenseList = [
    {
      category: "Pharmacy Rent",
      id: "#746F5K2",
      date: "23 Jan 2019",
      head: "Building rent",
      amount: "$2300.00",
    },
    {
      category: "EKG/ECG Machines",
      id: "#546H74W",
      date: "12 Jan 2020",
      head: "Equipements",
      amount: "$3020.00",
    },
    {
      category: "Vitamin C",
      id: "#87X6A44",
      date: "26 Dec 2019",
      head: "Manufacturing Cost",
      amount: "$560.00",
    },
    {
      category: "Electricity Bill",
      id: "#986G531",
      date: "21 Jan 2019",
      head: "Electricity Charges",
      amount: "$5540.00",
    },
    {
      category: "Tablet",
      id: "#326T4M9",
      date: "21 Jan 2019",
      head: "Manufacturing Cost",
      amount: "$1200.00",
    },
    {
      category: "Syrup",
      id: "#746F5K2",
      date: "23 Jan 2019",
      head: "Manufacturing Cost",
      amount: "$3350.99",
    },
    {
      category: "Desc Bill",
      id: "#546H74W",
      date: "24 Jan 2019",
      head: "Electricity Charges",
      amount: "$5550.00",
    },
    {
      category: "Inhealer",
      id: "#87X6A44",
      date: "25 Jan 2019",
      head: "Manufacturing Cost",
      amount: "$8000.00",
    },
    {
      category: "Mask",
      id: "#60X6A45",
      date: "26 Jan 2019",
      head: "Entitlements",
      amount: "$7050.00",
    },
  ];

  const [expenseList, setExpenseList] = useState(originalExpenseList);

  const filterExpense = (days) => {
    if (days === "All") {
      setSelectedFilter("All");
      setExpenseList(originalExpenseList);
    } else {
      const today = new Date();
      const filteredList = originalExpenseList.filter((item) => {
        const itemDate = new Date(item.date);
        return (today - itemDate) / (1000 * 60 * 60 * 24) <= days;
      });
      setSelectedFilter(`${days} Days`);
      setExpenseList(filteredList);
    }
    setShowFilter(false);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const sortedList = [...expenseList].sort((a, b) => {
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
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-700 dark:text-gray-200">
            {t("expenses.ExpenseDashboard")}
          </h1>
          <span className="text-xs font-normal text-gray-400 dark:text-gray-300">
            {t("expenses.ExpenseDashboardDesc")}
          </span>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={toggleTheme}
            className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-[4px] dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          <div className="relative">
            <button
              className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-4 py-2 rounded-[4px] dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
              onClick={() => setShowFilter(!showFilter)}
            >
              {t("expenses.ExpenseDashboardFilteredBy")}: {selectedFilter}
            </button>
            {showFilter && (
              <div className="absolute top-[100%] mt-1 left-0 min-w-[160px] bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-[4px] p-2 z-[100]">
                <button
                  onClick={() => filterExpense("All")}
                  className="block w-full text-left px-4 py-2 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600 rounded-[4px] text-xs"
                >
                  {t("expenses.filterOptions.all")}
                </button>
                <button
                  onClick={() => filterExpense(3)}
                  className="block w-full text-left px-4 py-2 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600 rounded-[4px] text-xs"
                >
                  {t("expenses.filterOptions.last3Days")}
                </button>
                <button
                  onClick={() => filterExpense(7)}
                  className="block w-full text-left px-4 py-2 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600 rounded-[4px] text-xs"
                >
                  {t("expenses.filterOptions.last7Days")}
                </button>
              </div>
            )}
          </div>
          <button className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-4 py-2 rounded-[4px] dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition">
            {t("expenses.addExpense")}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 grid gap-2 p-4 rounded-lg shadow-md dark:shadow-gray-700 text-center hover:shadow-emerald-200 dark:hover:shadow-emerald-600 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400 dark:text-gray-300">
            {t("expenses.summaryCards.electricity")}
          </h2>
          <p className="font-bold text-gray-800 dark:text-gray-200">$7,955</p>
          <p className="text-emerald-500 dark:text-emerald-400">
            ↑ 2.23% vs. last month
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 grid gap-2 p-4 rounded-lg shadow-md dark:shadow-gray-700 text-center hover:shadow-emerald-200 dark:hover:shadow-emerald-600 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400 dark:text-gray-300">
            {t("expenses.summaryCards.equipment")}
          </h2>
          <p className="font-bold text-gray-800 dark:text-gray-200">$8,830</p>
          <p className="text-red-500 dark:text-red-400">
            ↓ 1.12% vs. last month
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 grid gap-2 p-4 rounded-lg shadow-md dark:shadow-gray-700 text-center hover:shadow-emerald-200 dark:hover:shadow-emerald-600 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400 dark:text-gray-300">
            {t("expenses.summaryCards.maintenance")}
          </h2>
          <p className="font-bold text-gray-800 dark:text-gray-200">$8,974</p>
          <p className="text-emerald-500 dark:text-emerald-400">
            ↑ 1.36% vs. last month
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 grid gap-2 p-4 rounded-lg shadow-md dark:shadow-gray-700 text-center hover:shadow-emerald-200 dark:hover:shadow-emerald-600 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400 dark:text-gray-300">
            {t("expenses.summaryCards.manufacture")}
          </h2>
          <p className="font-bold text-gray-800 dark:text-gray-200">$30,485</p>
          <p className="text-emerald-500 dark:text-emerald-400">
            ↑ 1.34% vs. last month
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-700 border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">
            {t("expenses.expensesList")}
          </h2>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder={t("expenses.searchPlaceholder")}
              value={searchQuery}
              onChange={handleSearch}
              className="text-xs border border-gray-400 dark:border-gray-600 px-3 py-2 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-white dark:bg-gray-700 px-4 py-2 rounded-[4px] shadow-md dark:shadow-gray-600 flex items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600"
            >
              <FaSort />
            </button>
            <button className="bg-white dark:bg-gray-700 px-4 py-2 rounded-[4px] shadow-md dark:shadow-gray-600 flex items-center space-x-2 border border-gray-400 dark:border-gray-600 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600">
              <FaCog />
            </button>
          </div>
        </div>
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-center">
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("expenses.category")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("expenses.invoiceId")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("expenses.date")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("expenses.expenseHead")}
              </th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">
                {t("expenses.amount")}
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
                  {t("expenses.noRecords")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 dark:text-gray-300 text-xs">
              {t("expenses.show")}
            </span>
            <select
              className="text-xs border border-gray-400 dark:border-gray-600 px-2 py-2 rounded-[4px] font-light focus:outline-emerald-400 focus:border-emerald-700 dark:bg-gray-700 dark:text-gray-200"
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
              {t("expenses.entries")}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-[4px] dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition disabled:opacity-50"
            >
              {t("expenses.previous")}
            </button>
            <span className="text-gray-700 dark:text-gray-200 text-xs">
              {t("expenses.page")} {currentPage} {t("expenses.of")} {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="text-xs text-emerald-500 dark:text-emerald-400 border border-emerald-500 dark:border-emerald-400 px-3 py-2 rounded-[4px] dark:hover:text-white hover:text-white hover:bg-emerald-500 dark:hover:bg-emerald-400 transition disabled:opacity-50"
            >
              {t("expenses.next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;
