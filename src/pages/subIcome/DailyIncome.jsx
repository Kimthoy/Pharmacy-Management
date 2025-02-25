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
  // GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
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
// import { green } from "@mui/material/colors";

// Exchange rate constant
const EXCHANGE_RATE = 4100;

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
    name: randomTraderName(),
    usd: 20.5,
    // khr: 25000,
    quantity: 2,
    joinDate: randomCreatedDate(),
    total: (20.5 * 2).toFixed(2), // Initial total calculation
    status: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    usd: 15.0,
    // khr: 10000,
    quantity: 3,
    joinDate: randomCreatedDate(),
    total: (15.0 * 3).toFixed(2), // Initial total calculation
    status: randomRole(),
  },
];

// Custom Toolbar Component
function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: "",
        usd: 0, // Default value
        // khr: 0, // Default value
        quantity: 0, // Default value
        joinDate: randomCreatedDate(),
        total: "0.00", // Default total
        status: randomRole(),
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  // Export to Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(props.rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "report.xlsx");
  };

  // Export to PDF
  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "ID",
          "Name",
          "USD",
          //   "KHR",
          "Quantity",
          "Join Date",
          "Total Price",
          "Status",
        ],
      ],
      body: props.rows.map((row) => [
        row.id,
        row.name,
        row.usd,
        // row.khr,
        row.quantity,
        row.joinDate.toISOString().split("T")[0], // Format date
        row.total,
        row.status,
      ]),
    });
    doc.save("report.pdf");
  };

  return (
    <Box sx={{ margin: 4 }}>
      <Button
        onClick={handleClick}
        startIcon={<AddIcon />}
        variant="contained"
        color="success"
      >
        Add New Row
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleExportToExcel}
        startIcon={<SaveIcon />}
        sx={{ marginLeft: 2 }}
      >
        Export to Excel
      </Button>
      <Button
        variant="contained"
        color="warning"
        onClick={handleExportToPDF}
        startIcon={<SaveIcon />}
        sx={{ marginLeft: 2 }}
      >
        Export to PDF
      </Button>
    </Box>
  );
}

// Main Component
export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [usdInput, setUsdInput] = React.useState(""); // USD input state
  const [khrInput, setKhrInput] = React.useState("");
  const [convertedValue, setConvertedValue] = React.useState(""); // Converted value state

  const handleUsdInputChange = (event) => {
    const usdValue = event.target.value;
    // Ensure the value is not less than 0
    if (parseFloat(usdValue) < 0) {
      setUsdInput("0"); // Reset to 0 if the value is negative
      setConvertedValue("0.00 KHR"); // Reset converted value as well
      return;
    }

    // Update KHR input state

    setUsdInput(usdValue);
    if (usdValue.trim() === "") {
      setConvertedValue("");
      return;
    }
    const khrValue = (parseFloat(usdValue) * EXCHANGE_RATE).toFixed(2);
    setConvertedValue(`${khrValue} KHR`);
  };

  // Handle KHR input change
  const handleKhrInputChange = (event) => {
    const khrValue = event.target.value;
    // Ensure the value is not less than 0
    if (parseFloat(khrValue) < 0) {
      setKhrInput("0"); // Reset to 0 if the value is negative
      setConvertedValue("0.00 USD"); // Reset converted value as well
      return;
    }

    // Update KHR input state

    setKhrInput(khrValue);
    if (khrValue.trim() === "") {
      setConvertedValue("");
      return;
    }
    const usdValue = (parseFloat(khrValue) / EXCHANGE_RATE).toFixed(2);
    setConvertedValue(`${usdValue} USD`);
  };

  // Handle row edit stop
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  // Handle edit click
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  // Handle save click
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  // Handle delete click
  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  // Handle cancel click
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  // Group rows by month and calculate totals
  const monthlyTotals = React.useMemo(() => {
    const groupedByMonth = {};
    rows.forEach((row) => {
      const monthKey = row.joinDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!groupedByMonth[monthKey]) {
        groupedByMonth[monthKey] = {
          usdTotal: 0,

          quantityTotal: 0,
        };
      }
      groupedByMonth[monthKey].usdTotal += row.usd || 0;

      groupedByMonth[monthKey].quantityTotal += row.quantity || 0;
    });
    return Object.entries(groupedByMonth).map(([month, totals]) => ({
      month,
      usdTotal: totals.usdTotal.toFixed(2),

      quantityTotal: totals.quantityTotal,
    }));
  }, [rows]);

  // Process row update
  const processRowUpdate = (newRow) => {
    const total = (newRow.usd || 0) * newRow.quantity || newRow.usd.toFixed(2);
    const updatedRow = {
      ...newRow,
      total,
      isNew: false,
    };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  // Handle row modes model change
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Columns definition
  const columns = [
    {
      field: "name",
      headerName: "Name",
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
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      width: 80,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "joinDate",
      headerName: "Date",
      type: "date",
      width: 120,
      editable: true,
    },
    {
      field: "total",
      headerName: "Total Price",
      type: "number",
      width: 120,
      align: "left",
      headerAlign: "left",
      editable: false, // Total is not editable
    },
    {
      field: "status",
      headerName: "Status",
      width: 85,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Paid", "Not Paid", "Pending"],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "success.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="error"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="primary"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="error"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {/* Currency Conversion Inputs */}
      <Box sx={{ marginBottom: 4 }}>
        <div className="flex justify-evenly">
          <table className="shadow-md shadow-gray-200 rounded-m text-green-400 bg-green-50 outline-green-400 noto-sans-symbols">
            <tr>
              <th style={{ padding: "12px" }}>
                <label>
                  Enter USD :
                  <input
                    className="p-2 ml-2 rounded-md "
                    type="number"
                    value={usdInput}
                    onChange={handleUsdInputChange}
                    placeholder=" Enter USD"
                  />
                </label>
              </th>
            </tr>
            <tr>
              <th style={{ padding: "12px" }}>
                <label>
                  Enter KHR :
                  <input
                    className="p-2 ml-2 rounded-md"
                    type="number"
                    value={khrInput}
                    onChange={handleKhrInputChange}
                    placeholder=" Enter KHR"
                  />
                </label>
              </th>
            </tr>
            <tr>
              <td style={{ padding: "12px" }}>
                <label>
                  <div className="font-bold">Exchange Currency rate :</div>
                  <div className="bg-white p-3 mt-4 rounded-md text-black">
                    {convertedValue || "No exchange currency yet."}
                  </div>
                </label>
              </td>
            </tr>
          </table>

          <img
            src="./images/logo.png"
            width="230px"
            height="140px"
            alt="images"
          />
        </div>
      </Box>

      {/* Filters and Search Section */}
      <Box sx={{ marginBottom: 4 }}>
        Pay by QR Code | Cash | Sort by Most Recent | Oldest
      </Box>

      {/* DataGrid */}
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onRowModesModelChange={handleRowModesModelChange}
        slots={{
          toolbar: () => (
            <EditToolbar
              setRows={setRows}
              setRowModesModel={setRowModesModel}
              rows={rows}
            />
          ),
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, rows },
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 50]}
        checkboxSelection
        disableRowSelectionOnClick
      />

      {/* Monthly Totals Section */}
      <Box sx={{ marginTop: 2 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                Month
              </th>
              <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                USD Total
              </th>

              <th style={{ border: "1px solid #ddd", padding: "12px" }}>
                Quantity Total
              </th>
            </tr>
          </thead>
          <tbody>
            {monthlyTotals.map((month, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  {month.month}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  <div className="flex justify-between">
                    <div> {month.usdTotal}</div>
                    <div>$</div>
                  </div>
                </td>
                {/* <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  <div className="flex justify-between">
                    <div>{month.khrTotal}</div>
                    <p className="font-khr font-thin">៛</p>
                  </div>
                </td> */}
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  {month.quantityTotal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
