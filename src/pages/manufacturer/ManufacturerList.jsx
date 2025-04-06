import React, { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
// import { FaSquarePlus } from "react-icons/fa6";

const medicines = [
  {
    manufacturer_id: "#M-35",
    company: "Healthcare",
    email: "info@softnio.com",
    phone: "+811 847-4958",
    address: "Stoeng Meanchey ,Phnom Penh",
    balance: 7868.55,
    status: "active",
  },
];
const getStatus = (status) => {
  if (status === "active") return { text: "Active", color: "text-green-400" };

  return { text: "InActive", color: "text-red-400" };
};

const Manufacturerlist = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch = med.manufacturer_id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredMedicines.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedMedicines = filteredMedicines.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };
  //check amount input
  // const [amount, setAmount] = useState("");

  // const handleChange = (e) => {
  //   const value = e.target.value;
  //   // Regex to allow only double (floating-point) numbers
  //   if (/^\d*\.?\d*$/.test(value)) {
  //     setAmount(value);
  //   }
  // };
  return (
    <div className="p-6 bg-white shadow-md rounded-md overflow-x-auto">
      <div>
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-500">
            Manufacturer Lists
          </h2>
          <p className="text-gray-400 text-sm mb-5">
            You have total 30 Manufacturer for Pharmacy.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleForm}
          className="border hover:border-emerald-400 hover:text-emerald-400 text-gray-400 px-4 py-2 rounded-md  transition float-end"
        >
          + Add Manufacturer
        </button>
      </div>
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 relative">
            <h2 className="text-xl font-bold ">Add Manufacturer</h2>
            <p className="text-gray-500 mb-4">
              The manufacturer must be fill all this field.
            </p>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
                <div className="flex flex-col">
                  <label htmlFor="" className="mb-2">
                    Company
                  </label>

                  <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    // value={medicine.medicine_name}
                    // onChange={handleChange}
                    className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="" className="mb-2 font-medium ">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Email"
                    name="phone"
                    // value={medicine.price}
                    // onChange={handleChange}
                    className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="" className="mb-2">
                    Phone
                  </label>

                  <input
                    type="text"
                    placeholder="Phone"
                    name="phone"
                    // value={medicine.price}
                    // onChange={handleChange}
                    className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="" className="mb-2">
                    Address
                  </label>

                  <input
                    type="text"
                    placeholder="Address"
                    name="address"
                    // value={medicine.weight}
                    // onChange={handleChange}
                    className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="" className="mb-2">
                    Balance
                  </label>

                  <input
                    type="text"
                    placeholder="Balance"
                    name="balance"
                    // value={medicine.price}
                    // onChange={handleChange}
                    className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="" className="mb-2">
                    Status
                  </label>

                  <select
                    className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                    // onChange={handleChange}
                    // value={medicine.status}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-emerald-400 text-white px-2 py-2 mt-5 rounded-md w-full md:w-auto shadow-md active:shadow-none"
                >
                  Add Manufacturer
                </button>
                <button
                  type="button"
                  onClick={toggleForm}
                  className=" text-gray-400 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Find ID ..."
          className="border p-2 rounded-md focus:outline-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse bg-white shadow-md rounded-lg">
          <thead className="border">
            <tr>
              <td className="p-3 text-left text-gray-400 font-light text-[13px]">
                Manufacturer ID
              </td>
              <td className="p-3 text-left text-gray-400 font-light text-[13px]">
                Company
              </td>
              <td className="p-3 text-left text-gray-400 font-light text-[13px]">
                Phone
              </td>
              <td className="p-3 text-left text-gray-400 font-light text-[13px]">
                Address
              </td>
              <td className="p-3 text-left text-gray-400 font-light text-[13px]">
                Balance (USD)
              </td>
              <td className="p-3 text-left text-gray-400 font-light text-[13px]">
                Status
              </td>
              <td className="p-3 text-left text-gray-400">
                <FaEllipsisH className="hover:text-green-600 text-xl cursor-pointer"></FaEllipsisH>
              </td>
            </tr>
          </thead>
          <tbody className="border">
            {selectedMedicines.map((med, index) => {
              const { text, color } = getStatus(med.status);
              return (
                <tr key={index} className="border text-sm sm:text-base ">
                  <td className="p-3 text-[13px]  text-green-400 cursor-pointer hover:underline ">
                    {med.manufacturer_id}
                  </td>
                  <td className="p-3 text-[13px] text-gray-400">
                    {med.company}
                    <br />
                    {med.email}
                  </td>
                  <td className="p-3 text-[13px] text-gray-400">{med.phone}</td>
                  <td className="p-3 text-[13px] text-gray-400">
                    {med.address}
                  </td>
                  <td className="p-3 text-[13px] text-gray-400">
                    {med.balance}
                  </td>
                  <td className={`px-6 py-2 font-light text-xs  ${color}`}>
                    {text}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 font-light text-[13px]">
            Rows per page:
          </span>
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
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded-md text-gray-400 font-light text-[13px]"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="text-gray-400 font-light text-[13px]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border rounded-md text-gray-400 font-light text-[13px]"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default Manufacturerlist;
