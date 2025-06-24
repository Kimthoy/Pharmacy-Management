import { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "../../hooks/useTranslation";
import { Sun, Moon } from "lucide-react";
const medicines = [
  {
    p_id: "#P7865",
    customer: "Abu Bin Ishtiyak",
    email: "larson@example.com",
    reason: "wrong_medication",
    amount: 20.55,
    status: "Active",
    date: "2024-03-15",
  },
  {
    customer: "Abu Bin Ishtiyak",
    email: "larson@example.com",
    p_id: "#P7865",
    reason: "wrong_dispensing",
    amount: 20.55,
    status: "Inactive",
    date: "2024-03-15",
  },
  {
    customer: "Abu Bin Ishtiyak",
    email: "larson@example.com",
    p_id: "#P7865",
    reason: "subsidence_symptoms",
    amount: 20.55,
    status: "Inactive",
    date: "2024-03-15",
  },
];

const WastageReturnList = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const filteredMedicines = (medicines || []).filter((med) => {
    const matchesSearch = (med?.p_id || "")
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase());
    const matchesDate =
      (!startDate || new Date(med.date) >= new Date(startDate)) &&
      (!endDate || new Date(med.date) <= new Date(endDate));
    const matchesReason = selectedReason ? med.reason === selectedReason : true;
    const matchesStatus = selectedStatus ? med.status === selectedStatus : true;
    return matchesSearch && matchesDate && matchesReason && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMedicines.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedMedicines = filteredMedicines.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const getReason = (reason) => {
    if (reason === "wrong_medication") {
      return {
        text: t("wastageReturnList.reasons.wrongMedication"),
        color: `text-red-600 border p-1 text-xs rounded border-red-600 ${
          theme === "dark" ? "bg-gray-700" : "bg-white"
        }`,
      };
    }
    if (reason === "wrong_dispensing") {
      return {
        text: t("wastageReturnList.reasons.wrongDispensing"),
        color: `text-yellow-500 border p-1 text-xs rounded border-yellow-500 ${
          theme === "dark" ? "bg-gray-700" : "bg-white"
        }`,
      };
    }
    if (reason === "subsidence_symptoms") {
      return {
        text: t("wastageReturnList.reasons.subsidenceSymptoms"),
        color: `text-green-600 border p-1 text-xs rounded border-green-600 ${
          theme === "dark" ? "bg-gray-700" : "bg-white"
        }`,
      };
    }
    return {
      text: t("wastageReturnList.reasons.unknown"),
      color: `text-gray-600 border p-1 text-xs rounded border-gray-600 ${
        theme === "dark" ? "bg-gray-700" : "bg-white"
      }`,
    };
  };

  const getStatus = (status) => {
    if (status === "Active") {
      return {
        text: t("wastageReturnList.statuses.active"),
        color: "text-green-600 text-xs",
      };
    }
    return {
      text: t("wastageReturnList.statuses.inactive"),
      color: "text-red-500 text-xs",
    };
  };

  return (
    <div
      className={` sm:p-3 mb-16 sm:shadow-md sm:rounded-md overflow-x-auto ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-lg font-bold">{t("wastageReturnList.title")}</h2>
       
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder={t("wastageReturnList.searchPlaceholder")}
          className={`border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-400 text-gray-900 placeholder-gray-500"
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label
            htmlFor="startDate"
            className={`me-2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("wastageReturnList.startDateLabel")}
          </label>
          <input
            type="date"
            id="startDate"
            className={`border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-400 text-gray-900"
            }`}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className={`me-2 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("wastageReturnList.endDateLabel")}
          </label>
          <input
            type="date"
            id="endDate"
            className={`border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-400 text-gray-900"
            }`}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-5">
        <select
          className={`border p-2 rounded-md w-[180px] focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-400 text-gray-900"
          }`}
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
        >
          <option value="">{t("wastageReturnList.reasonFilter")}</option>
          <option value="wrong_medication">
            {t("wastageReturnList.reasons.wrongMedication")}
          </option>
          <option value="wrong_dispensing">
            {t("wastageReturnList.reasons.wrongDispensing")}
          </option>
          <option value="subsidence_symptoms">
            {t("wastageReturnList.reasons.subsidenceSymptoms")}
          </option>
        </select>

        <select
          className={`border p-2 rounded-md w-[150px] focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-400 text-gray-900"
          }`}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">{t("wastageReturnList.statusFilter")}</option>
          <option value="Active">
            {t("wastageReturnList.statuses.active")}
          </option>
          <option value="Inactive">
            {t("wastageReturnList.statuses.inactive")}
          </option>
        </select>
      </div>

      <div className="w-[444px]">
        <table
          className={`sm:w-full sm:min-w-[600px] shadow-md rounded-lg border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-600"
              : "bg-white border-gray-200"
          }`}
        >
          <thead
            className={`border-b ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}
          >
            <tr>
              <th className="sm:flex hidden px-5 py-3 text-left text-gray-400">
                {t("wastageReturnList.headers.purchaseId")}
              </th>
              <th className="px-5 py-3 text-left text-gray-400">
                {t("wastageReturnList.headers.customer")}
              </th>
              <th className="sm:flex hidden px-5 py-3 text-left text-gray-400">
                {t("wastageReturnList.headers.date")}
              </th>
              <th className="px-5 py-3 text-left text-gray-400">
                {t("wastageReturnList.headers.reason")}
              </th>
              <th className="px-5 py-3 text-left text-gray-400">
                {t("wastageReturnList.headers.status")}
              </th>
              <th className="sm:flex hidden px-5 py-3 text-left text-gray-400">
                {t("wastageReturnList.headers.amount")}
              </th>
              <th className="p-3 text-left text-gray-400"></th>
            </tr>
          </thead>
          <tbody
            className={`border-t ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}
          >
            {selectedMedicines.map((med, index) => {
              const reason = getReason(med.reason || "Unknown");
              const { text, color } = getStatus(med.status);
              return (
                <tr
                  key={index}
                  className={`border-b ${
                    theme === "dark" ? "border-gray-600" : "border-gray-200"
                  } text-sm`}
                >
                  <td className="sm:flex hidden text-emerald-600 px-6 py-6 font-medium">
                    <span className="hover:cursor-pointer hover:underline active:cursor-grabbing">
                      {med.p_id}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-sm">
                    <span>
                      {med.customer} <br />
                      <span className="sm:flex hidden font-normal">{med.email}</span>
                    </span>
                  </td>
                  <td
                    className={`sm:flex hidden px-5 py-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    {med.date}
                  </td>
                  <td className="px-5  py-3">
                    <span className={`inline-block  ${reason.color}`}>
                      {reason.text}
                    </span>
                  </td>
                  <td className={`px-5 py-3 ${color}`}>{text}</td>
                  <td
                    className={`sm:flex hidden px-5 py-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <span className="font-bold ">{med.amount}</span> $
                  </td>
                  <td className="p-3">
                    <FaEllipsisH
                      className={`text-xl cursor-pointer ${
                        theme === "dark"
                          ? "text-gray-400 hover:text-emerald-500"
                          : "text-gray-400 hover:text-emerald-600"
                      }`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4 items-center">
        <select
          className={`border sm:flex hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-emerald-600 text-gray-900"
          }`}
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
        <div className="flex items-center gap-3">
          <button
            className={`px-2 py-1 rounded-[5px] border text-center hover:text-white hover:bg-emerald-500 hover:border-none ${
              theme === "dark"
                ? "border-gray-600 text-gray-300 disabled:opacity-50"
                : "border-emerald-600 text-emerald-600 disabled:opacity-50"
            }`}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            {t("wastageReturnList.previous")}
          </button>
          <span
            className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
          >
            {t("wastageReturnList.page", {
              current: currentPage,
              total: totalPages,
            })}
          </span>
          <button
            className={`px-2 py-1 rounded-[5px] border text-center hover:text-white hover:bg-emerald-500 hover:border-none ${
              theme === "dark"
                ? "border-gray-600 text-gray-300 disabled:opacity-50"
                : "border-emerald-600 text-emerald-600 disabled:opacity-50"
            }`}
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            {t("wastageReturnList.next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WastageReturnList;
