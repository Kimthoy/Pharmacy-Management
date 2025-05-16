import React, { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

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
  const { theme } = useTheme();
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
    <div className="p-3 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 rounded-md overflow-x-auto">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {t("customerlist.CustomerListTitle")}
        </h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder={t("customerlist.SearchPlaceholder")}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:outline-green-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <thead className="border border-gray-200 dark:border-gray-600">
            <tr>
              <td className="px-6 py-2 text-left text-gray-400 dark:text-gray-300">
                {t("customerlist.Customer")}
              </td>
              <td className="px-6 py-2 text-left text-gray-400 dark:text-gray-300">
                {t("customerlist.ID")}
              </td>
              <td className="px-6 py-2 text-left text-gray-400 dark:text-gray-300">
                {t("customerlist.Phone")}
              </td>
              <td className="px-6 py-2 text-left text-gray-400 dark:text-gray-300">
                {t("customerlist.PurchaseDetails")}
              </td>
              <td className="px-6 py-2 text-left text-gray-400 dark:text-gray-300">
                {t("customerlist.Amount")}
              </td>
              <td className="px-6 py-2 text-left text-gray-400 dark:text-gray-300">
                {t("customerlist.Status")}
              </td>
              <td className="p-3 text-left text-gray-400 dark:text-gray-300">
                {t("customerlist.Actions")}
              </td>
            </tr>
          </thead>
          <tbody className="border border-gray-200 dark:border-gray-600">
            {selectedCustomers.map((cus, index) => {
              const { text, color } = getStatus(cus.status);
              return (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-600 text-sm"
                >
                  <td className="px-6 py-6 font-medium text-gray-400 dark:text-gray-300">
                    {cus.customer}
                    <br />
                    <span className="font-normal">{cus.email}</span>
                  </td>
                  <td className="px-6 py-2 text-green-400 dark:text-green-300 font-semibold">
                    <span className="hover:cursor-pointer hover:underline active:cursor-grabbing">
                      {cus.cus_id}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-gray-400 dark:text-gray-300">
                    {cus.phone}
                  </td>
                  <td className="px-6 py-2 text-gray-400 dark:text-gray-300">
                    {t("customerlist.Item")}: {cus.item}
                    <br />
                    {t("customerlist.Quantity")}: {cus.quantity}
                  </td>
                  <td className="px-6 py-2 text-gray-600 dark:text-gray-200">
                    <span className="font-bold">{cus.amount}</span> $
                  </td>
                  <td className={`px-6 py-2 ${color}`}>{text}</td>
                  <td className="p-3 relative">
                    <button
                      className="hover:text-green-400 dark:hover:text-green-300 text-gray-400 dark:text-gray-300 text-xl"
                      onClick={() => toggleMenu(index)}
                    >
                      <FaEllipsisH />
                    </button>
                    {openMenu === index && (
                      <div className="absolute right-14 top-10 w-36 bg-gray-100 dark:bg-gray-800 rounded-md shadow-md dark:shadow-gray-700 border border-gray-200 dark:border-gray-600">
                        <a
                          href="/insertcustomer"
                          className="flex w-full py-2 text-gray-600 dark:text-gray-200 hover:bg-green-400 dark:hover:bg-green-500 hover:text-white dark:hover:text-white rounded-md"
                        >
                          <BiEdit className="w-10" /> {t("customerlist.Edit")}
                        </a>
                        <button className="flex w-full py-2 text-gray-600 dark:text-gray-200 hover:bg-green-400 dark:hover:bg-green-500 hover:text-white dark:hover:text-white rounded-md">
                          <BiTrash className="w-10" />{" "}
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

      <div className="flex flex-wrap justify-between mt-4">
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
            className="text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 px-2 rounded-[5px] hover:text-white hover:bg-green-500 dark:hover:bg-green-400 hover:border-none disabled:opacity-50"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            {t("customerlist.Previous")}
          </button>
          <span className="text-gray-600 dark:text-gray-300">
            {t("customerlist.Page")} {currentPage} {t("customerlist.Of")}{" "}
            {totalPages}
          </span>
          <button
            className="text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 px-2 rounded-[5px] hover:text-white hover:bg-green-500 dark:hover:bg-green-400 hover:border-none disabled:opacity-50"
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
