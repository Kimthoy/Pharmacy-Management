import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbarExport,
} from "@mui/x-data-grid";
import * as XLSX from "xlsx"; // For Excel export
import jsPDF from "jspdf"; // For PDF export
import "jspdf-autotable"; // Plugin for table support in jsPDF
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from "@mui/x-data-grid-generator";

// Sample roles for the grid
const roles = ["Paid", "Not Paid", "Pending"];

// Function to generate random role
const randomRole = () => {
  return randomArrayItem(roles);
};

// Initial rows for the grid
const initialRows = [
  {
    id: randomId(),
    month: randomCreatedDate(),
    usd: 20.5,
    khr: 25000,
    quantity: 2,
    status: randomRole(),
  },
  {
    id: randomId(),
    month: randomCreatedDate(),
    usd: 15.0,
    khr: 10000,
    quantity: 3,
    status: randomRole(),
  },
];

// Main Component
export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  // Columns definition
  const columns = [
    {
      field: "month",
      headerName: "Month",
      visibility: true,
      width: 150,
      editable: true,
    },
    {
      field: "usd",
      headerName: "USD",
      type: "number",
      width: 80,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "khr",
      headerName: "KHR",
      type: "number",
      width: 80,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      width: 80,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    // {
    //   field: "joinDate",
    //   headerName: "Date",
    //   type: "date",
    //   width: 120,
    //   editable: true,
    // },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 85,
    //   editable: true,
    //   type: "singleSelect",
    //   valueOptions: ["Paid", "Not Paid", "Pending"],
    // },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      {/* Filters and Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search ..."
          className="w-full md:w-1/3 p-2 outline-none bg-gray-100 rounded-full shadow-md"
        />
        <div className="flex space-x-4 justify-center p-2">
          <div className="flex justify-center align-middle">
            <p className="p-2">Pay by</p>
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

      {/* DataGrid */}
      <DataGrid
        rows={rows}
      
         columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        // onRowModesModelChange={handleRowModesModelChange}
        // onRowEditStop={handleRowEditStop}
        // processRowUpdate={processRowUpdate}
        // slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, rows },
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
      />
    </Box>
  );
}
