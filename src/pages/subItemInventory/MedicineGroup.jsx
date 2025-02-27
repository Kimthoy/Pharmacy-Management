import React from "react";

const MedicineGroup = () => {
  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Medicine Details</h2>

          {/* Medicine Information */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-xl font-semibold mb-2">Medicine Information</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p>
                <span className="font-semibold">Name:</span> Zimax
              </p>
              <p>
                <span className="font-semibold">Generic Name:</span>{" "}
                Azithromycin
              </p>
              <p>
                <span className="font-semibold">Weight:</span> 500mg
              </p>
              <p>
                <span className="font-semibold">Category:</span> Tablet
              </p>
              <p>
                <span className="font-semibold">Manufacturer:</span> Healthcare
              </p>
              <p>
                <span className="font-semibold">Expire Date:</span> 19/12/2020
              </p>
            </div>
            <p className="mt-2 flex items-center">
              <span className="font-semibold">Popularity:</span>
              <span className="ml-2 text-yellow-500">★★★★★</span>
            </p>
          </div>

          {/* Stock Information */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-xl font-semibold mb-2">Stock</h3>
            <div className="grid grid-cols-3 gap-4 text-gray-700">
              <p>
                <span className="font-semibold">Starting Stock:</span> 230 box
              </p>
              <p>
                <span className="font-semibold">Current Stock:</span> 180 box
              </p>
              <p className="flex items-center">
                <span className="font-semibold">Stock Status:</span>
                <span className="ml-2 px-2 py-1 text-white bg-green-500 rounded">
                  Available
                </span>
              </p>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full text-xs text-white text-center"
                  style={{ width: "75%" }}
                >
                  75%
                </div>
              </div>
            </div>
          </div>

          {/* Price Estimate */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Estimate</h3>
            <div className="grid grid-cols-3 gap-4 text-gray-700">
              <p>
                <span className="font-semibold">Manufacture Price:</span> $50.00
              </p>
              <p>
                <span className="font-semibold">Selling Price:</span> $60.00
              </p>
              <p>
                <span className="font-semibold">Wholesale Price:</span> $55.00
              </p>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => window.history.back()}
            >
              Back to Medicine List
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicineGroup;
