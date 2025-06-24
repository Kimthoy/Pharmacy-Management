import { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useTranslation } from "../../hooks/useTranslation";
import { RiTableView } from "react-icons/ri";

const customers = [
  {
    customer: "Abu Bin Ishtiyak",
    email: "larson@example.com",
    cus_id: "#P7865",
    phone: "+928 73 292",
    item: "Omidon10mg",
    quantity: "10pcs",
    amount: 20.55,
    status: "active",
    category: "Tablet",
    date: "2024-03-15",
  },
  {
    customer: "Abu Bin Ishtiyak",
    email: "larson@example.com",
    cus_id: "#P7865",
    phone: "+928 73 292",
    item: "Omidon10mg",
    quantity: "10pcs",
    amount: 20.55,
    status: "Inactive",
    category: "Tablet",
    date: "2024-03-15",
  },
];

const CustomerList = () => {
  const { t } = useTranslation();

  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMenu = (index) => setOpenMenu(openMenu === index ? null : index);

  const filteredCustomers = (customers || []).filter((cus) => {
    const matchesSearch = (cus?.customer || "")
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const getStatus = (status) => {
    if (status === "active")
      return {
        text: t("customerlist.StatusActive"),
        color: "text-green-400 dark:text-green-300",
      };
    return {
      text: t("customerlist.StatusInactive"),
      color: "text-red-400 dark:text-red-300",
    };
  };

  return (
    <div className="p-3 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 rounded-md">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">
          {t("customerlist.CustomerListTitle")}
        </h2>
        <input
          type="text"
          placeholder={t("customerlist.SearchPlaceholder")}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[420px] w-full bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
            <tr>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                {t("customerlist.Customer")}
              </th>
              {/* Only show ID on mobile */}
              <th className="block sm:hidden px-4 py-2 text-left whitespace-nowrap">
                {t("customerlist.ID")}
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                {t("customerlist.Phone")}
              </th>
              {/* Show these only on larger screens */}
              <th className="hidden sm:table-cell px-4 py-2 text-left whitespace-nowrap">
                {t("customerlist.PurchaseDetails")}
              </th>
              <th className="hidden sm:table-cell px-4 py-2 text-left whitespace-nowrap">
                {t("customerlist.Amount")}
              </th>
              <th className="hidden sm:table-cell px-4 py-2 text-left whitespace-nowrap">
                {t("customerlist.Status")}
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                {t("customerlist.Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 dark:text-gray-200">
            {selectedCustomers.map((cus, index) => {
              const { text, color } = getStatus(cus.status);
              return (
                <tr
                  key={index}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-3">
                    {cus.customer}
                    <br />
                    <span className="text-xs text-gray-400">{cus.email}</span>
                  </td>

                  {/* ID on mobile only */}
                  <td className="block sm:hidden px-4 py-3 text-green-500">
                    {cus.cus_id}
                  </td>

                  <td className="px-4 py-3">{cus.phone}</td>

                  {/* Desktop only cells */}
                  <td className="hidden sm:table-cell px-4 py-3">
                    {cus.item} <br /> {cus.quantity}
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 font-semibold">
                    ${cus.amount}
                  </td>
                  <td className={`hidden sm:table-cell px-4 py-3 ${color}`}>
                    {text}
                  </td>

                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => toggleMenu(index)}
                      className="text-xl text-gray-400 hover:text-green-500"
                    >
                      <FaEllipsisH />
                    </button>
                    {openMenu === index && (
                      <div className="absolute right-16 top-5 mt-2 z-50 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded shadow-md">
                        <a
                          href="/insertcustomer"
                          className="flex items-center px-4 py-2 text-sm hover:bg-green-100 dark:hover:bg-green-600"
                        >
                          <RiTableView className="mr-2" />{" "}
                          {t("customerlist.View")}
                        </a>
                        <a
                          href="/insertcustomer"
                          className="flex items-center px-4 py-2 text-sm hover:bg-green-100 dark:hover:bg-green-600"
                        >
                          <BiEdit className="mr-2" /> {t("customerlist.Edit")}
                        </a>
                        <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-100 dark:hover:bg-red-600">
                          <BiTrash className="mr-2" />
                          {t("customerlist.Remove")}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <select
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-md dark:bg-gray-700 dark:text-gray-200"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setCurrentPage(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
        <div className="flex items-center space-x-2">
          <button
            className="text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 px-3 py-1 rounded-md hover:text-white hover:bg-green-500 dark:hover:bg-green-400 disabled:opacity-50"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            {t("customerlist.Previous")}
          </button>
          <span className="text-gray-600 dark:text-gray-300 text-sm">
            {t("customerlist.Page")} {currentPage} {t("customerlist.Of")}{" "}
            {totalPages}
          </span>
          <button
            className="text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 px-3 py-1 rounded-md hover:text-white hover:bg-green-500 dark:hover:bg-green-400 disabled:opacity-50"
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            {t("customerlist.Next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
