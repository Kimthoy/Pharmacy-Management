import React, { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { BiEdit, BiTrash } from "react-icons/bi";

const medicines = [
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

const MedicineList = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMenu = (index) => setOpenMenu(openMenu === index ? null : index);

  const filteredMedicines = (medicines || []).filter((med) => {
    const matchesSearch = (med?.customer || "")
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase());

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredMedicines.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedMedicines = filteredMedicines.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const getStatus = (status) => {
    if (status === "active") return { text: "Active", color: "text-green-400" };

    return { text: "InActive", color: "text-red-400" };
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] bg-white shadow-md rounded-lg border">
          <thead className="border">
            <tr>
              <td className="px-6 py-2 text-left text-gray-400">Customer</td>
              <td className="px-6 py-2 text-left text-gray-400">ID</td>
              <td className="px-6 py-2 text-left text-gray-400">Phone</td>
              <td className="px-6 py-2 text-left text-gray-400">
                Purchase Details
              </td>
              <td className="px-6 py-2 text-left text-gray-400">Amount</td>
              <td className="px-6 py-2 text-left text-gray-400">Status</td>
              <td className="p-3 text-left text-gray-400">
                <FaEllipsisH className="hover:text-green-600 text-xl cursor-pointer"></FaEllipsisH>
              </td>
            </tr>
          </thead>
          <tbody className="border">
            {selectedMedicines.map((med, index) => {
              const { text, color } = getStatus(med.status);
              return (
                <tr key={index} className="border-b text-sm">
                  <td className="px-6 py-6 font-medium text-gray-400">
                    {med.customer}
                    <br />
                    <span className="font-normal">{med.email}</span>
                  </td>
                  <td>
                    <td className="px-6 py-2 text-green-400  font-semibold ">
                      <span className="hover:cursor-pointer hover:underline active:cursor-grabbing">
                        {med.cus_id}
                      </span>
                    </td>
                  </td>
                  <td className="px-6 py-2 text-gray-400">{med.phone}</td>
                  <td className="px-6 py-2 text-gray-400">
                    Item: {med.item}
                    <br />
                    Quantity: {med.quantity}
                  </td>
                  <td className="px-6 py-2 text-gray-600">
                    <span className="font-bold">{med.amount}</span> $
                  </td>
                  <td className={`px-6 py-2  ${color}`}>{text}</td>
                  <td className="p-3 relative">
                    <button
                      className="hover:text-green-600 text-xl"
                      onClick={() => toggleMenu(index)}
                    >
                      <FaEllipsisH className="text-gray-400 hover:text-green-400" />
                    </button>
                    {openMenu === index && (
                      <div className="absolute right-14 top-10 w-36 bg-gray-100 rounded-md shadow-md">
                        <a
                          href="/insertcustomer"
                          className="flex w-full py-2 hover:bg-green-400 rounded-md hover:text-white"
                        >
                          <BiEdit className="w-10" /> Edit
                        </a>
                        <button className="flex w-full py-2 hover:bg-green-400 rounded-md hover:text-white">
                          <BiTrash className="w-10" /> Remove
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

      <div className="flex justify-between mt-4">
        <select
          className="border p-2 rounded-md"
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

export default MedicineList;
