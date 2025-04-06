import { useState } from "react";
import React from "react";

const AddWastageReturn = () => {
  //check amount input
  const [amount, setAmount] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    // Regex to allow only double (floating-point) numbers
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };
  return (
    <>
      <div className="p-4 bg-white rounded-md shadow-md w-full max-w-6xl mx-auto">
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-lg font-semibold">Add Manufacturer Return</h1>
            <p className="text-gray-600">
              You can add a manufacturer return by fill these field.
            </p>
          </div>
        </div>

        {/* onSubmit={handleSubmit} */}
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Company
              </label>

              <input
                type="text"
                name="Company"
                placeholder="Company"
                // value={medicine.medicine_name}
                // onChange={handleChange}
                className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Email
              </label>

              <input
                type="text"
                placeholder="Email"
                name="email"
                // value={medicine.price}
                // onChange={handleChange}
                className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="mb-2 font-medium ">
                Phone
              </label>

              <input
                type="text"
                placeholder="Phone"
                name="Phone"
                // value={medicine.price}
                // onChange={handleChange}
                className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Product Name
              </label>

              <input
                type="text"
                placeholder="Product Name"
                name="productname"
                // value={medicine.price}
                // onChange={handleChange}
                className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Generic Name
              </label>

              <input
                type="text"
                placeholder="Generic Name"
                name="genericname"
                // value={medicine.weight}
                // onChange={handleChange}
                className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Category
              </label>

              <select
                className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                // onChange={handleChange}
                // value={medicine.status}
                required
              >
                <option value="tablet">Tablet</option>
                <option value="syrub">Syrub</option>
                <option value="vitamin">Vitamin</option>
                <option value="inhealer">Inhealer</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Invoice No
              </label>

              <input
                type="text"
                name="invoiceno"
                // onChange={handleChange}
                // value={medicine.generic_name}
                placeholder="Invoice No"
                className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="amount" className="mb-2">
                Amount
              </label>

              <input
                type="text"
                name="amount"
                value={amount}
                onChange={handleChange}
                placeholder="Amount"
                className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Reason
              </label>

              <select
                className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                // onChange={handleChange}
                // value={medicine.status}
                required
              >
                <option value="Worng Medication<">Worng Medication</option>
                <option value="Worng Dispensing<">Worng Dispensing</option>
                <option value="Subsidence Symptoms">Subsidence Symptoms</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                // onChange={handleChange}
                // value={medicine.generic_name}
                placeholder=" Quantity"
                className="border border-gray-400   px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Date
              </label>

              <input
                type="date"
                name="date"
                // onChange={handleChange}
                // value={medicine.generic_name}
                placeholder="Date"
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

            <div className="flex flex-col ">
              <label htmlFor="" className="mb-2">
                Description
              </label>
              <textarea
                placeholder="Description"
                name="description"
                // onChange={handleChange}
                // value={medicine.medicine_detail}
                required
                className="border border-gray-400 w-[580px] h-[200px]  px-2 text-sm py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
              ></textarea>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 rounded-md w-full md:w-auto shadow-md active:shadow-none"
            >
              Add Return
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default AddWastageReturn;
