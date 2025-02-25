import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const Inventory = () => {
  const [barcode, setBarcode] = useState(""); // Stores barcode value
  const [openScanner, setOpenScanner] = useState(false);
  return (
    <div className="p-2  bg-white rounded-md shadow-md">
      <div className="mb-3 p-2">
        <h1 className="font-semibold">Add Medicine</h1>
        <p className="text-gray-600">
          You can add a medicine by fil this field.
        </p>
      </div>
      <div className="flex flex-1 sm:flex-1" id="body">
        <div className="d-flex p-2">
          <div className="mb-2">
            <label htmlFor="">Medicine Name</label>
          </div>

          <input
            type="text"
            placeholder="Madicine Name"
            className="bg-slate-200 rounded-sm shadow-md px-6 py-2 focus:border-none outline-none cursor-pointer"
          />
        </div>
        <div className="d-flex p-2">
          <div className="mb-2">
            <label htmlFor="">Price</label>
          </div>

          <input
            type="text"
            placeholder="Price"
            className="bg-slate-200 rounded-sm shadow-md px-6 py-2 focus:border-none outline-none cursor-pointer"
          />
        </div>
        <div className="d-flex p-2">
          <div className="mb-2">
            <label htmlFor="">Quantity</label>
          </div>

          <input
            type="number"
            defaultValue={`0`}
            className="bg-slate-200 rounded-sm shadow-md px-6 py-2 focus:border-none outline-none cursor-pointer"
          />
        </div>
        <div className="d-flex p-2">
          <div className="mb-2">
            <label htmlFor="">In Stock Date</label>
          </div>

          <input
            type="date"
            defaultValue={`date`}
            className="bg-slate-200 rounded-sm shadow-md px-6 py-2 focus:border-none outline-none cursor-pointer"
          />
        </div>
      </div>
      <div className="flex flex-auto " id="body">
        <div className="d-flex p-2">
          <div className="mb-2">
            <label htmlFor="">Weight</label>
          </div>

          <input
            type="text"
            placeholder="Weight"
            className="bg-slate-200 rounded-sm shadow-md px-6 py-2 focus:border-none outline-none cursor-pointer"
          />
        </div>
        <div className="d-flex p-2">
          <div className="mb-2">
            <label htmlFor="">Generic Name</label>
          </div>

          <input
            type="text"
            placeholder="Generic Name"
            className="bg-slate-200 rounded-sm shadow-md px-6 py-2 focus:border-none outline-none cursor-pointer"
          />
        </div>

        <div
          className="d-flex p-2"
          style={{ flexDirection: "column", alignItems: "center" }}
        >
          <div className="mb-2">
            <label htmlFor="barcode">Barcode Scan</label>
          </div>

          {/* Input field with barcode scan button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative", // Added for pop-up positioning
            }}
          >
            <input
              id="barcode"
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Scan or enter barcode"
              className="bg-slate-200 rounded-sm shadow-md px-6 py-2 focus:border-none outline-none cursor-pointer"
            />
            <button
              onClick={() => setOpenScanner(true)}
              style={{
                marginLeft: "-40px",
                padding: "10px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                position: "absolute",
                right: "5px",
              }}
            >
              <img
                src="https://img.icons8.com/ios/50/barcode.png"
                alt="Scan"
                width="30px"
              />
            </button>
          </div>

          {/* Pop-up Scanner Modal */}
          {openScanner && (
            <div
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.5)", // Dark overlay
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  background: "white",

                  borderRadius: "10px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <h1 className="mb-4 font-semibold">Scan Barcode</h1>
                <BarcodeScannerComponent
                  width={500}
                  onUpdate={(err, result) => {
                    if (result) {
                      setBarcode(result.text); // Store scanned barcode in input
                      setOpenScanner(false); // Close scanner modal
                    }
                  }}
                />
                <button
                  onClick={() => setOpenScanner(false)}
                  style={{
                    marginTop: "10px",

                    background: "transparent",
                    color: "red",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Close Scanner
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="d-flex p-2">
          <div className="mb-2">
            <label htmlFor="">Expire Date</label>
          </div>

          <input
            type="date"
            defaultValue={`date`}
            className="bg-slate-200 rounded-sm shadow-md px-6 py-2 focus:border-none outline-none cursor-pointer"
          />
        </div>
      </div>
      <div className="flex flex-1 sm:flex-1" id="body">
        <div className=" p-2">
          <div className="mb-2">
            <label htmlFor="">Status</label>
          </div>
          <div className="">
            <select class="form-select  bg-slate-200 rounded-sm shadow-md px-6 py-2 focus:border-none outline-none cursor-pointer">
              <option selected value="active">
                Active
              </option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className=" p-2">
          <div className="mb-2">
            <label htmlFor="">Category</label>
          </div>
          <div className="">
            <select class="form-select  bg-slate-200 rounded-sm shadow-md px-8 py-2 focus:border-none outline-none cursor-pointer">
              <option selected>Select -/-</option>
              <option value="Tablet">Tablet</option>
              <option value="Syrub">Syrub</option>
              <option value="Vitamin">Vitanin</option>
            </select>
          </div>
        </div>
      </div>
      <div className="d-flex p-2">
        <div className="mb-2">
          <label htmlFor="">Medicine Details</label>
        </div>

        <textarea
          name="textarea"
          className="bg-slate-200 rounded-sm shadow-md px-6 py-2 focus:border-none outline-none cursor-pointer w-1/2 h-52"
          id=""
        ></textarea>
      </div>

      <div className="p-2">
        <button
          type="submit"
          className="bg-green-400 text-white px-4 py-3 rounded-md shadow-md hover:bg-green-300 active:cursor-wait"
        >
          Add Medicine
        </button>
      </div>
    </div>
  );
};

export default Inventory;
