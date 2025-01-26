import React from "react";
import { useLocation } from "react-router-dom";

const MedicineDetails = () => {
  const location = useLocation();
  const { medicine } = location.state || {}; // Retrieve passed medicine data

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Medicine Details</h2>
      {medicine ? (
        <div className="mt-4">
          <p>
            <strong>Name:</strong> {medicine.name}
          </p>
          <p>
            <strong>ID:</strong> {medicine.id}
          </p>
          <p>
            <strong>Group:</strong> {medicine.group}
          </p>
          <p>
            <strong>Stock Quantity:</strong> {medicine.stock}
          </p>
          {/* Add more fields or a detailed view here */}
        </div>
      ) : (
        <p>No medicine data available.</p>
      )}
    </div>
  );
};

export default MedicineDetails;
