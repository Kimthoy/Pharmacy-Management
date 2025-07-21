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
        setItems(res);
      } catch (err) {
        console.error("Fetch failed:", err);
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
      {/* ✅ Go back to Supplies page */}
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Supply Item List</h1>
        <Link
          to="/supplies"
          className="text-green-500 hover:underline font-medium"
        >
          Go to Supplies →
        </Link>
      </div>

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
          {items.length > 0 ? (
            items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-gray-50 even:bg-slate-200">
                {/* ✅ Index */}
                <td className="border px-4 py-2">{idx + 1}</td>

                <td className="border px-4 py-2">
                  <Link
                    to="/supplies"
                    state={{ highlightedSupplyId: item.supply?.supply_id }}
                    className="text-blue-500 hover:underline"
                  >
                    {item.supply?.supply_id || "N/A"}
                  </Link>
                </td>

                <td className="border px-4 py-2">
                  <Link
                    to="/listofmedicine"
                    state={{ highlightedBarcode: item.medicine?.barcode }}
                    className="text-blue-500 hover:underline"
                  >
                    {item.medicine?.barcode ||
                      item.medicine?.medicine_name ||
                      "N/A"}
                  </Link>
                </td>

                {/* ✅ Quantity */}
                <td className="border px-4 py-2">
                  {item.supply_quantity ?? "N/A"}
                </td>

                {/* ✅ Unit Price */}
                <td className="border px-4 py-2">
                  {item.unit_price ? `$${item.unit_price}` : "N/A"}
                </td>

                {/* ✅ Expire Date */}
                <td className="border px-4 py-2">
                  {item.expire_date
                    ? new Date(item.expire_date).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="border px-4 py-4 text-center text-gray-500"
              >
                No supply items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SupplyItem;
