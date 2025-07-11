import { useEffect, useState } from "react";
import { getAllSupplyItems } from "../api/supplyItemService";
import { Link } from "react-router-dom";

const SupplyItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupplyItems = async () => {
      try {
        const res = await getAllSupplyItems();
        setItems(res); // ✅ already returns array
      } catch (err) {
        setError("Failed to fetch supply items.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplyItems();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <Link
        to="/supplies"
        className="float-right text-green-500 hover:underline"
      >
        <a href="">Go Supply</a>
      </Link>
      <h1 className="text-xl font-bold mb-4">Supply Item List</h1>
      <table className="min-w-full table-auto border border-gray-300 rounded-md shadow-sm">
        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Supply ID</th>
            <th className="border px-4 py-2">Medicine</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Unit Price</th>
            <th className="border px-4 py-2">Expire Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{idx + 1}</td>
              <td className="border px-4 py-2 text-blue-600">
                {item.supply?.supply_id || "N/A"}
              </td>
              <td className="border px-4 py-2">
                {item.medicine?.barcode || item.medicine_id}
              </td>
              <td className="border px-4 py-2">{item.supply_quantity}</td>
              <td className="border px-4 py-2">${item.unit_price}</td>
              <td className="border px-4 py-2">
                {item.expire_date
                  ? new Date(item.expire_date).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplyItem;
