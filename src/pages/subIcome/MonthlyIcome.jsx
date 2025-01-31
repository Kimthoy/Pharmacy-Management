import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
const MonthlyIncome = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="flex  space-x-4 ">
          <button className="bg-gray-100  shadow-md text-blue-500 px-4 py-2 rounded-md  hover:bg-blue-200 flex items-center">
            <span className="me-3">
              <img src="images/graph.png" width="26px" alt="" />
            </span>
            Run stock Analysis
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Item
          </button>
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly</h2>

      {/* Filter and Sort Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search ..."
          className="w-full md:w-1/3 p-2 outline-none bg-gray-100  rounded-full shadow-md"
        />
        <div className="flex space-x-4 justify-center p-2">
          <div className=" flex justify-center align-middle">
            <p className="p-2 ">Pay by</p>
            <select className="p-2 outline-none bg-gray-100 rounded-full shadow-md">
              <option>QR Code</option>
              <option>Cash</option>
            </select>
          </div>

          <div className="flex justify-center align-middle text-center bg-gray-100 rounded-full shadow-md">
            <div>
              <p className="p-3 ml-1">Sort by |</p>
            </div>
            <div>
              <select className="p-3 bg-transparent rounded-lg font-bold outline-none">
                <option>Most Recent</option>
                <option>Oldest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <td className="p-4 m-2">
                <input type="checkbox" name="" id="" />
              </td>
              <td className="p-4 m-2">Medicine Name</td>
              <td className="p-4 m-2">Unit Price</td>
              <td className="p-4 m-2">Retails Price</td>
              <td className="p-4 m-2">Date</td>
              <td className="p-4 m-2">Quantity</td>
              <td className="p-4 m-2">Photo</td>
              <td className="p-4 m-2">Total Price</td>
              <td className="p-4 m-2">Status</td>
              <td className="p-4 m-2"></td>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4 m-2">
                <input type="checkbox" name="" id="" />
              </td>
              <td className="p-4 m-2">Glass Plate</td>
              <td className="p-4 m-2">100.00</td>
              <td className="p-4 m-2">00.00</td>
              <td className="p-4 m-2">26 Jan 2024</td>
              <td className="p-4 m-2">1.00</td>

              <td className="p-4 m-2">
                <img src="images/qrcode.png" width="50px" alt="" />
              </td>
              <td className="p-4 m-2">+ 100.00</td>
              <td className="p-4 m-2 text-green-500 ">
                <div className="bg-green-200 text-center d-flex align-middle p-2 rounded-full">
                  Paid
                </div>
              </td>

              <td>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                    />
                  </svg>
                </a>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-4 m-2">
                <input type="checkbox" name="" id="" />
              </td>
              <td className="p-4 m-2">Glass Plate</td>
              <td className="p-4 m-2">100.00</td>
              <td className="p-4 m-2">00.00</td>
              <td className="p-4 m-2">26 Jan 2024</td>
              <td className="p-4 m-2">1.00</td>

              <td className="p-4 m-2">
                <img src="images/qrcode.png" width="50px" alt="" />
              </td>
              <td className="p-4 m-2">+ 100.00</td>
              <td className="p-4 m-2 text-green-500 ">
                <div className="bg-green-200 text-center d-flex align-middle p-2 rounded-full">
                  Paid
                </div>
              </td>

              <td>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                    />
                  </svg>
                </a>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-4 m-2">
                <input type="checkbox" name="" id="" />
              </td>
              <td className="p-4 m-2">Glass Plate</td>
              <td className="p-4 m-2">100.00</td>
              <td className="p-4 m-2">00.00</td>
              <td className="p-4 m-2">26 Jan 2024</td>
              <td className="p-4 m-2">1.00</td>

              <td className="p-4 m-2">
                <img src="images/qrcode.png" width="50px" alt="" />
              </td>
              <td className="p-4 m-2">+ 100.00</td>
              <td className="p-4 m-2 text-green-500 ">
                <div className="bg-green-200 text-center d-flex align-middle p-2 rounded-full">
                  Paid
                </div>
              </td>

              <td>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                    />
                  </svg>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyIncome;
