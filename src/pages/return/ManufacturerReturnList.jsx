import React, { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { read } from "xlsx";
// import { BiEdit, BiTrash } from "react-icons/bi";

const medicines = [
  {
    p_id: "#P7865",
    customer: "Abu Bin Ishtiyak",
    email: "larson@example.com",

    reason: "Expire Date",

    amount: 20.55,
    status: "Active",

    date: "2024-03-15",
  },
  {
    customer: "Abu Bin Ishtiyak",
    email: "larson@example.com",
    p_id: "#P7865",

    reason: "Wrong Drug",

    amount: 20.55,
    status: "Inactive",

    date: "2024-03-15",
  },
  {
    customer: "Abu Bin Ishtiyak",
    email: "larson@example.com",
    p_id: "#P7865",

    reason: "Damaged",

    amount: 20.55,
    status: "Inactive",

    date: "2024-03-15",
  },
];

const ManufacturerReturnList = () => {
  // const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // const toggleMenu = (index) => setOpenMenu(openMenu === index ? null : index);

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
    if (reason === "Expire Date") {
      return {
        text: "Expire Date",
        color: "text-red-600 border p-1 text-xs rounded border-red-600",
      };
    }
    if (reason === "Damaged") {
      return {
        text: "Damaged",
        color: "text-yellow-500 border text-xs p-1 rounded border-yellow-500",
      };
    }
    return {
      text: "Wrong Drug",
      color: "text-green-600 border p-1 text-xs rounded border-green-600",
    };
  };
  const getStatus = (status) => {
    if (status === "Active") {
      return {
        text: "Active",
        color: "text-green-600  text-xs ",
      };
    }

    return {
      text: "InActive",
      color: "text-red-500  text-xs ",
    };
  };

  return (
    <div className="p-3 bg-white shadow-md rounded-md overflow-x-auto">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Customer Lists</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 ">
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 rounded-md focus:outline-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex mb-4">
        <div className="me-2">
          <label htmlFor="" className="me-2 text-gray-400">
            Filter by Choose start date
          </label>
          <input
            type="date"
            className="border p-2 rounded-md focus:outline-green-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="" className="me-2 text-gray-400">
            Choose end date
          </label>
          <input
            type="date"
            className="border p-2 rounded-md focus:outline-green-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-5">
        <select
          className="border  focus:border-green-600 p-2 rounded-md w-[180px]"
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
        >
          <option value="">Filter by Reason</option>
          <option value="Wrong medication">Wrong medication</option>
          <option value="Wrong dispensing">Wrong dispensing</option>
          <option value="Subsidence symptoms">Subsidence symptoms</option>
        </select>

        <select
          className="border p-2 ml-4 rounded-md w-[150px]   focus:border-green-600"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] bg-white shadow-md rounded-lg border">
          <thead className="border">
            <tr>
              <td className="px-6 py-2 text-left text-gray-400">Purchase ID</td>
              <td className="px-6 py-2 text-left text-gray-400">
                Manufacturer
              </td>
              <td className="px-6 py-2 text-left text-gray-400">Date</td>
              <td className="px-6 py-2 text-left text-gray-400">Reason</td>
              <td className="px-6 py-2 text-left text-gray-400">Status</td>
              <td className="px-6 py-2 text-left text-gray-400">Amount</td>

              <td className="p-3 text-left text-gray-400">
                <FaEllipsisH className="hover:text-green-600 text-xl cursor-pointer"></FaEllipsisH>
              </td>
            </tr>
          </thead>
          <tbody className="border">
            {selectedMedicines.map((med, index) => {
              const reason = getReason(med.reason || "Unknown");
              const { text, color } = getStatus(med.status);
              return (
                <tr key={index} className="border-b text-sm">
                  <td className="text-green-600  px-6 py-6 font-medium ">
                    <span className="hover:cursor-pointer hover:underline active:cursor-grabbing">
                      {med.p_id}
                    </span>
                  </td>
                  <td>
                    <td className="px-6 py-2 text-gray-400 text-sm ">
                      <span>
                        {med.customer} <br />
                        <span className="font-normal">{med.email}</span>
                      </span>
                    </td>
                  </td>
                  <td className="px-6 py-2 text-gray-400">{med.date}</td>
                  <td className="px-6 py-2">
                    <span className={` ${reason.color} inline-block px-1`}>
                      {reason.text}
                    </span>
                  </td>
                  <td className={`px-6 py-2  ${color}`}>{text}</td>

                  <td className="px-6 py-2 text-gray-600">
                    <span className="font-bold">{med.amount}</span> $
                  </td>
                  <td className="p-3">
                    <FaEllipsisH className="hover:text-green-600  text-gray-400 text-xl cursor-pointer"></FaEllipsisH>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <select
          className="border p-2 rounded-md border-green-600  focus:border-green-600"
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
        <div>
          <button
            className="text-green-600 border border-green-600 px-2 rounded-[5px] text-center me-3 hover:text-white hover:bg-green-500 hove:border-none"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            {" "}
            Page {currentPage} of {totalPages}{" "}
          </span>
          <button
            className="text-green-600 border border-green-600 px-2 rounded-[5px] text-center ml-3 hover:text-white hover:bg-green-500 hove:border-none"
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerReturnList;
