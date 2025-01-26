import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "../../components/ui/Table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../../components/ui/Select";

const ListOfMedicine = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const [selectedGroup, setSelectedGroup] = useState(""); // State for selected option

  const handleGroupChange = (value) => {
    setSelectedGroup(value);
    setDropdownOpen(false); // Close dropdown when an item is selected
  };

  // Modified to pass medicine details via state
  const handleViewDetails = (medicine) => {
    navigate("/MedicineDetails", { state: { medicine } }); // Passing the entire medicine object
  };

  return (
    <div className="p-4">
      <Card className="shadow-md">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">List of Medicines (298)</h2>
            <Button variant="primary">+ Add New Item</Button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            List of medicines available for sales.
          </p>

          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search Medicine Inventory..."
              className="flex-1"
            />
            <Select>
              <SelectTrigger
                className="w-52"
                onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown visibility
              >
                {selectedGroup || "- Select Group -"}
              </SelectTrigger>
              {dropdownOpen && (
                <SelectContent>
                  <SelectItem
                    value="generic"
                    onClick={() => handleGroupChange("Generic Medicine")}
                  >
                    Generic Medicine
                  </SelectItem>
                  <SelectItem
                    value="diabetes"
                    onClick={() => handleGroupChange("diabetes")}
                  >
                    Diabetes
                  </SelectItem>
                </SelectContent>
              )}
            </Select>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Medicine Name</TableCell>
                <TableCell>Medicine ID</TableCell>
                <TableCell>Group Name</TableCell>
                <TableCell>Stock in Qty</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                {
                  name: "Augmentin 625 Duo Tablet",
                  id: "D06ID232435454",
                  group: "Generic Medicine",
                  stock: 350,
                },
                {
                  name: "Azithral 500 Tablet",
                  id: "D06ID232435451",
                  group: "Generic Medicine",
                  stock: 20,
                },
                {
                  name: "Ascoril LS Syrup",
                  id: "D06ID232435452",
                  group: "Diabetes",
                  stock: 85,
                },
                {
                  name: "Azee 500 Tablet",
                  id: "D06ID232435450",
                  group: "Generic Medicine",
                  stock: 75,
                },
                {
                  name: "Allegra 120mg Tablet",
                  id: "D06ID232435455",
                  group: "Diabetes",
                  stock: 44,
                },
                {
                  name: "Alex Syrup",
                  id: "D06ID232435456",
                  group: "Generic Medicine",
                  stock: 65,
                },
                {
                  name: "Amoxyclav 625 Tablet",
                  id: "D06ID232435457",
                  group: "Generic Medicine",
                  stock: 150,
                },
                {
                  name: "Avil 25 Tablet",
                  id: "D06ID232435458",
                  group: "Generic Medicine",
                  stock: 270,
                },
              ].map((medicine, index) => (
                <TableRow key={index}>
                  <TableCell>{medicine.name}</TableCell>
                  <TableCell>{medicine.id}</TableCell>
                  <TableCell>{medicine.group}</TableCell>
                  <TableCell>{medicine.stock}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => handleViewDetails(medicine)}
                    >
                      View Full Detail »
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm">Showing 1 - 8 results of 298</p>
            <div>
              <Button variant="secondary ">Page 01</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListOfMedicine;
