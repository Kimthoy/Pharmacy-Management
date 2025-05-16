import { useState } from "react";
import { FaSort, FaCog } from "react-icons/fa";
import { useTranslation } from "../../hooks/useTranslation";

const Expense = () => {
  const { t } = useTranslation();
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-700">
          {t("expenses.ExpenseDashboard")} <br />
          <span className="text-xs font-normal text-gray-400">
            {t("expenses.ExpenseDashboardDesc")}
          </span>
        </h1>

        <div className="relative flex items-center space-x-2">
          <button
            className="bg-white text-green-500 px-4 py-2 rounded-md shadow-sm outline outline-green-500 transition"
            onClick={() => setShowFilter(!showFilter)}
          >
            {t("expenses.ExpenseDashboardFilteredBy")}: {selectedFilter}
          </button>
          {showFilter && (
            <div className="absolute top-12 left-0 bg-white shadow-md rounded-md w-40 p-2">
              <button
                onClick={() => filterExpense("All")}
                className="block w-full text-left px-4 py-2 text-green-500 hover:bg-green-200 rounded-md"
              >
                {t("expenses.filterOptions.all")}
              </button>
              <button
                onClick={() => filterExpense(3)}
                className="block w-full text-left px-4 py-2 text-green-500 hover:bg-green-200 rounded-md"
              >
                {t("expenses.filterOptions.last3Days")}
              </button>
              <button
                onClick={() => filterExpense(7)}
                className="block w-full text-left px-4 py-2 text-green-500 hover:bg-green-200 rounded-md"
              >
                {t("expenses.filterOptions.last7Days")}
              </button>
            </div>
          )}
          <button className="outline text-green-500 px-4 py-2 rounded-md shadow-md hover:bg-green-200 transition">
            {t("expenses.addExpense")}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white grid gap-2 p-4 rounded-lg shadow-md text-center hover:shadow-green-200 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400">
            {t("expenses.summaryCards.electricity")}
          </h2>
          <p className="font-bold">$7,955</p>
          <p className="text-green-500">↑ 2.23% vs. last month</p>
        </div>
        <div className="bg-white grid gap-2 p-4 rounded-lg shadow-md text-center hover:shadow-green-200 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400">
            {" "}
            {t("expenses.summaryCards.equipment")}
          </h2>
          <p className="font-bold">$8,830</p>
          <p className="text-red-500">↓ 1.12% vs. last month</p>
        </div>
        <div className="bg-white grid gap-2 p-4 rounded-lg shadow-md text-center hover:shadow-green-200 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400">
            {t("expenses.summaryCards.maintenance")}
          </h2>
          <p className="font-bold">$8,974</p>
          <p className="text-green-500">↑ 1.36% vs. last month</p>
        </div>
        <div className="bg-white grid gap-2 p-4 rounded-lg shadow-md text-center hover:shadow-green-200 duration-100 ease-in-out">
          <h2 className="text-md font-semibold text-gray-400">
            {t("expenses.summaryCards.manufacture")}
          </h2>
          <p className="font-bold">$30,485</p>
          <p className="text-green-500">↑ 1.34% vs. last month</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between align-middle">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            {t("expenses.expensesList")}
          </h2>

          <div className="flex items-center space-x-3 mb-4">
            <input
              type="text"
              placeholder={t("expenses.searchPlaceholder")}
              value={searchQuery}
              onChange={handleSearch}
              className="border px-3 py-2 rounded-md shadow-sm focus:outline-green-700 outline outline-green-400"
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
              <th className="p-3 border">{t("expenses.category")}</th>
              <th className="p-3 border">{t("expenses.invoiceId")}</th>
              <th className="p-3 border">{t("expenses.date")}</th>
              <th className="p-3 border">{t("expenses.expenseHead")}</th>
              <th className="p-3 border">{t("expenses.amount")}</th>
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
                  className="p-16 border text-center text-gray-500"
                >
                  {t("expenses.noRecords")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between">
          <div className="px-4 py-2 flex justify-between">
            <label>
              <span className="text-gray-400">{t("expenses.show")}</span>
              <select
                className="m-3 border p-1 focus:outline-green-600"
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
              {/* <span className="text-gray-400"> entries</span> */}
            </label>
          </div>
          <div className="flex items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="outline outline-green-600 px-3 rounded disabled:opacity-50"
            >
              {t("expenses.previous")}
            </button>
            <span className="m-3">
              {t("expenses.page")} {currentPage} {t("expenses.of")} {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="outline outline-green-600 px-3 rounded disabled:opacity-50"
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
