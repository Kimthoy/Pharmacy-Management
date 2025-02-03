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
    name: randomTraderName(),
    usd: 20.5,
    khr: 25000,
    quantity: 2,
    joinDate: randomCreatedDate(),
    total: (20.5 * 2 + (25000 / 4100) * 2).toFixed(2), // Initial total calculation
    status: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    usd: 15.0,
    khr: 10000,
    quantity: 3,
    joinDate: randomCreatedDate(),
    total: (15.0 * 3 + (10000 / 4100) * 3).toFixed(2), // Initial total calculation
    status: randomRole(),
  },
];

// Custom Toolbar Component
function EditToolbar(props) {
  const { setRows, setRowModesModel, rows } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: "",
        usd: 0, // Default value
        khr: 0, // Default value
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
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "grid_data.xlsx");
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
          "KHR",
          "Quantity",
          "Join Date",
          "Total Price",
          "Status",
        ],
      ],
      body: rows.map((row) => [
        row.id,
        row.name,
        row.usd,
        row.khr,
        row.quantity,
        row.joinDate.toISOString().split("T")[0], // Format date
        row.total,
        row.status,
      ]),
    });
    doc.save("grid_data.pdf");
  };

  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClick}
        sx={{ marginBottom: 4 }}
      >
        Add New Row
      </Button>
      {/* Built-in Export Buttons */}
      {/* <GridToolbarExport /> */}
      {/* Custom Export Buttons */}
      <Button
        variant="contained"
        color="success"
        onClick={handleExportToExcel}
        sx={{ marginBottom: 4 }}
      >
        Export to Excel
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={handleExportToPDF}
        sx={{ marginBottom: 4 }}
      >
        Export to PDF
      </Button>
    </GridToolbarContainer>
  );
}

// Main Component
export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

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
          khrTotal: 0,
          quantityTotal: 0,
        };
      }
      groupedByMonth[monthKey].usdTotal += row.usd || 0;
      groupedByMonth[monthKey].khrTotal += row.khr || 0;
      groupedByMonth[monthKey].quantityTotal += row.quantity || 0;
    });

    return Object.entries(groupedByMonth).map(([month, totals]) => ({
      month,
      usdTotal: totals.usdTotal.toFixed(2),
      khrTotal: totals.khrTotal.toFixed(2),
      quantityTotal: totals.quantityTotal,
    }));
  }, [rows]);

  // Process row update
  const processRowUpdate = (newRow) => {
    // Calculate total dynamically
    const total = (newRow.khr / 4100 + newRow.usd || 0) * newRow.quantity;

    const updatedRow = {
      ...newRow,
      total: total.toFixed(2), // Update total with 2 decimal places
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
    { field: "name", headerName: "Name", width: 150, editable: true },
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
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 400,
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
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, rows },
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
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
                KHR Total
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
                <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                  <div className="flex justify-between">
                    <div>{month.khrTotal}</div>
                    <p className="font-khr font-thin">៛</p>
                  </div>
                </td>
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
