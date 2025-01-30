import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

const Inventory = () => {
  // // Status badge styling
  // const getStatusBadge = (status) => {
  //   switch (status) {
  //     case "Paid":
  //       return (
  //         <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
  //           Paid
  //         </span>
  //       );
  //     case "Not paid":
  //       return (
  //         <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
  //           Not Paid
  //         </span>
  //       );
  //     default:
  //       return (
  //         <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
  //           Pending
  //         </span>
  //       );
  //   }
  // };

  return (
    <div className="bg-white min-h-screen p-1">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          <p className="text-gray-600">
            List of medicines available for sales.
          </p>
        </div>
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

      {/* Cards Section */}
      <div className=" w-full mb-6 flex justify-evenly bg-gray-100 rounded-s shadow-md ">
        <div className="p-3 flex justify-center   ">
          <div className="me-4">
            {" "}
            <img src="images/outofstock.png" width="40px" alt="" />
          </div>
          <div className="block">
            <p>Out of Stock</p>
            <h2 className="font-bold text-2xl">4</h2>
          </div>
        </div>
        <div className="p-3 flex justify-center ">
          <div className="me-4">
            {" "}
            <img src="images/lowinstock.png" width="40px" alt="" />
          </div>
          <div className="block">
            <div>Low in Stock</div>
            <h2 className="font-bold  text-2xl">4</h2>
          </div>
        </div>
        <div className="p-3 flex justify-center  ">
          <div className="me-4">
            {" "}
            <img src="images/erasers.png" width="40px" alt="" />
          </div>
          <div className="block">
            <div>Highest selling stock</div>
            <p className="font-bold  text-2xl">Eraser</p>
          </div>
        </div>
      </div>

      {/* Inventory Movement Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Inventory Movement
        </h2>

        {/* Filter and Sort Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search ..."
            className="w-full md:w-1/3 p-2 outline-none bg-gray-100  rounded-full shadow-md"
          />
          <div className="flex space-x-4 justify-center p-2">
            <div className=" flex justify-center align-middle">
              <p className="p-2 ">Filter by</p>
              <select className="p-2 outline-none bg-gray-100 rounded-full shadow-md">
                <option>Paid</option>
                <option>Not Paid</option>
                <option>Pending</option>
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
                <td className="p-4 m-2">Channel</td>
                <td className="p-4 m-2">Item</td>
                <td className="p-4 m-2">Date</td>
                <td className="p-4 m-2">Customer</td>
                <td className="p-4 m-2">Quantity</td>
                <td className="p-4 m-2">Quantity After</td>
                <td className="p-4 m-2">Status</td>
                <td className="p-4 m-2"></td>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 m-2">
                  <input type="checkbox" name="" id="" />
                </td>
                <td className="p-4 m-2">
                  <img src="images/medicine.png" width="30px" alt="" />
                </td>
                <td className="p-4 m-2">Glass Plate</td>
                <td className="p-4 m-2">26 Jan 2024</td>
                <td className="p-4 m-2">Vitu Khim</td>
                <td className="p-4 m-2">+ 100.00</td>
                <td className="p-4 m-2">+ 590.00</td>
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
                <td className="p-4 m-2">
                  <img src="images/amazon.png" width="30px" alt="" />
                </td>
                <td className="p-4 m-2">Glass Plate</td>
                <td className="p-4 m-2">26 Jan 2024</td>
                <td className="p-4 m-2">Vitu Khim</td>
                <td className="p-4 m-2">+ 100.00</td>
                <td className="p-4 m-2">+ 590.00</td>
                <td className="p-4 m-2 text-gray-500 ">
                  <div className="bg-gray-200 text-center d-flex align-middle p-2 rounded-full">
                    Pending
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
                <td className="p-4 m-2">
                  <img src="images/amazon.png" width="30px" alt="" />
                </td>
                <td className="p-4 m-2">Glass Plate</td>
                <td className="p-4 m-2">26 Jan 2024</td>
                <td className="p-4 m-2">Vitu Khim</td>
                <td className="p-4 m-2">+ 100.00</td>
                <td className="p-4 m-2">+ 590.00</td>
                <td className="p-4 m-2 text-red-500 ">
                  <div className="bg-red-200 text-center d-flex align-middle p-2 rounded-full">
                    Not Paid
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
    </div>
  );
};

export default Inventory;
