import React from "react";

const InventoryDashboard = () => {
  const suppliers = [
    { id: 1, company_name: "ABC Co.", phone: "123456789", address: "123 St" },
  ];

  const medicines = [
    { id: 1, name: "Paracetamol", size: "500mg", description: "Pain reliever" },
  ];

  const supplies = [
    {
      id: 1,
      invoice_id: "INV001",
      invoice_date: "2024-01-01",
      supplier: suppliers[0],
    },
  ];

  const supplyItems = [
    {
      id: 1,
      supply_id: 1,
      medicine: medicines[0],
      supply_quantity: 50,
      expire_date: "2026-01-01",
      unit_price: 0.5,
    },
  ];

  const stocks = [{ id: 1, medicine: medicines[0], quantity: 150 }];

  const stockMovements = [
    {
      id: 1,
      medicine: medicines[0],
      quantity: 50,
      type: "in",
      date: "2024-01-01",
    },
  ];

  return (
    <div className="p-4 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Suppliers</h2>
        <table className="table-auto border w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Company</th>
              <th className="border px-2 py-1">Phone</th>
              <th className="border px-2 py-1">Address</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td className="border px-2 py-1">{s.id}</td>
                <td className="border px-2 py-1">{s.company_name}</td>
                <td className="border px-2 py-1">{s.phone}</td>
                <td className="border px-2 py-1">{s.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Medicines</h2>
        <table className="table-auto border w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Size</th>
              <th className="border px-2 py-1">Description</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.id}>
                <td className="border px-2 py-1">{m.id}</td>
                <td className="border px-2 py-1">{m.name}</td>
                <td className="border px-2 py-1">{m.size}</td>
                <td className="border px-2 py-1">{m.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Supplies</h2>
        <table className="table-auto border w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Invoice</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((s) => (
              <tr key={s.id}>
                <td className="border px-2 py-1">{s.id}</td>
                <td className="border px-2 py-1">{s.invoice_id}</td>
                <td className="border px-2 py-1">{s.invoice_date}</td>
                <td className="border px-2 py-1">{s.supplier.company_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Supply Items</h2>
        <table className="table-auto border w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Medicine</th>
              <th className="border px-2 py-1">Quantity</th>
              <th className="border px-2 py-1">Unit Price</th>
              <th className="border px-2 py-1">Expire Date</th>
            </tr>
          </thead>
          <tbody>
            {supplyItems.map((i) => (
              <tr key={i.id}>
                <td className="border px-2 py-1">{i.medicine.name}</td>
                <td className="border px-2 py-1">{i.supply_quantity}</td>
                <td className="border px-2 py-1">${i.unit_price}</td>
                <td className="border px-2 py-1">{i.expire_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Stocks</h2>
        <table className="table-auto border w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Medicine</th>
              <th className="border px-2 py-1">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s.id}>
                <td className="border px-2 py-1">{s.medicine.name}</td>
                <td className="border px-2 py-1">{s.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Stock Movements</h2>
        <table className="table-auto border w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Medicine</th>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Quantity</th>
              <th className="border px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {stockMovements.map((m) => (
              <tr key={m.id}>
                <td className="border px-2 py-1">{m.medicine.name}</td>
                <td className="border px-2 py-1">{m.type}</td>
                <td className="border px-2 py-1">{m.quantity}</td>
                <td className="border px-2 py-1">{m.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryDashboard;
