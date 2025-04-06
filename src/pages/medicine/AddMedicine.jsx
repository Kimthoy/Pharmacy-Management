import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
//import axios from "axios";

const AddMedicine = () => {
  const [barcode, setBarcode] = useState("");
  const [openScanner, setOpenScanner] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <>
      <div className="p-4 bg-white rounded-md shadow-md w-full max-w-6xl mx-auto">
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-lg font-semibold">Add Medicine</h1>
            <p className="text-gray-600">
              You can add a medicine by filling this form.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleForm}
            className="text-xs text-emerald-500 border border-emerald-500 px-4 py-2 rounded-md hover:text-white hover:bg-emerald-500 transition"
          >
            Add Supplier
          </button>
        </div>
        {isFormOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 relative">
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={toggleForm}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold ">Add Supplier</h2>
              <p className="text-gray-500 mb-4">
                The supplier must be fill all this field.
              </p>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Supplier Name"
                  className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Pharmacy Name"
                  className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                  required
                />
                <input
                  type="file"
                  className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Invoice ID"
                  className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                  required
                />
                <input
                  type="date"
                  className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                  required
                />
                <div className="col-span-1 md:col-span-2 flex justify-end space-x-3">
                  <button
                    type="submit"
                    className="border text-green-600 hover:text-white hover:bg-green-600 px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="hover:text-red-600 text-gray-400 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* onSubmit={handleSubmit} */}
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Madicine name
              </label>

              <input
                type="text"
                name="medicine_name"
                placeholder="Medicine Name"
                // value={medicine.medicine_name}
                // onChange={handleChange}
                className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Price
              </label>

              <input
                type="text"
                placeholder="Price"
                name="price"
                // value={medicine.price}
                // onChange={handleChange}
                className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                // onChange={handleChange}
                // value={medicine.quantity}
                className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                In Stock Date
              </label>

              <input
                type="date"
                name="in_stock_date"
                // onChange={handleChange}
                // value={medicine.in_stock_date}
                className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Weight
              </label>

              <input
                type="text"
                placeholder="Weight"
                name="weight"
                // value={medicine.weight}
                // onChange={handleChange}
                className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Generic Name
              </label>

              <input
                type="text"
                name="generic_name"
                // onChange={handleChange}
                // value={medicine.generic_name}
                placeholder="Generic Name"
                className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
              />
            </div>

            <div className="flex flex-col relative">
              <label
                htmlFor="barcode"
                className="mb-2 text-sm font-medium text-gray-700"
              >
                Barcode Scan
              </label>

              <div className="border border-gray-400 text-xs font-light focus-within:outline-green-400 focus-within:border-green-700 focus-within:placeholder:text-green-400 z-10 rounded-sm px-6 py-2 cursor-pointer relative">
                <input
                  required
                  id="barcode"
                  type="text"
                  value={barcode} // Connected to state
                  onChange={(e) => setBarcode(e.target.value)}
                  name="barcode_number"
                  placeholder="Scan or enter barcode"
                  className="bg-transparent focus:outline-none w-full"
                />
                <button
                  onClick={() => setOpenScanner(true)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <img
                    src="https://img.icons8.com/ios/50/barcode.png"
                    alt="Scan"
                    width="25px"
                  />
                </button>
              </div>

              {openScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 w-full max-w-md">
                    <div className="relative" style={{ height: "300px" }}>
                      <BarcodeScannerComponent
                        width="100%"
                        height="100%"
                        facingMode="environment"
                        torch={torchOn}
                        onUpdate={(err, result) => {
                          if (result) {
                            setBarcode(result.text); // Updates the input field
                            setOpenScanner(false); // Closes scanner after successful scan
                          }
                          if (err) {
                            console.error("Scanner error:", err);
                          }
                        }}
                      />

                      <button
                        onClick={() => setTorchOn(!torchOn)}
                        className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full"
                      >
                        {torchOn ? "🔦 Flash On" : "💡 Flash Off"}
                      </button>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {barcode && `Scanned: ${barcode}`}
                      </div>
                      <button
                        onClick={() => setOpenScanner(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Close Scanner
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Expire Date
              </label>

              <input
                type="date"
                name="expire_date"
                className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                required
                // value={medicine.expire_date}
                // onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Status
              </label>

              <select
                className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                // onChange={handleChange}
                // value={medicine.status}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="mb-2">
                Cateogry
              </label>

              <select
                className="text-xs border border-gray-400   px-2  py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
                // onChange={handleChange}
                // value={medicine.category}
                required
              >
                <option>Select Category</option>
                <option value="tablet">Tablet</option>
                <option value="syrup">Syrup</option>
                <option value="vitamin">Vitamin</option>
              </select>
            </div>
            <div className="flex flex-col ">
              <label htmlFor="" className="mb-2">
                Medicine Information
              </label>
              <textarea
                placeholder="Medicine Details"
                name="medicine_detail"
                // onChange={handleChange}
                // value={medicine.medicine_detail}
                required
                className="border border-gray-400  w-[580px] h-[200px] px-2 text-xs py-2 rounded-[4px] font-light   focus:outline-green-400  focus:border-green-700 focus:placeholder:text-green-400"
              ></textarea>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-green-500 text-xs text-white px-3 py-3 rounded-md w-full md:w-auto shadow-md active:shadow-none"
            >
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default AddMedicine;
