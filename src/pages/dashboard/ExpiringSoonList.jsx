import { useEffect, useState } from "react";
import { getExpiringSoonItems } from "../api/supplyItemService";

const ExpiringSoonList = () => {
  const [expiringList, setExpiringList] = useState([]);
  const [expiredList, setExpiredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpiringSoon = async () => {
      try {
        const items = await getExpiringSoonItems();
        const today = new Date();
        const expiringSoon = [];
        const expired = [];
        items.forEach((item) => {
          const expireDate = new Date(item.expire_date);
          if (expireDate < today) {
            expired.push(item);
          } else {
            expiringSoon.push(item);
          }
        });

        setExpiringList(expiringSoon);
        setExpiredList(expired);
      } catch (err) {
        setError("Failed to fetch expiring soon medicines");
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringSoon();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
        <p className="text-gray-500">⏳ Loading expiring medicines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mb-7 bg-red-50 dark:bg-gray-800 p-4 rounded shadow-lg">
      <h3 className="text-lg font-bold text-red-600 dark:text-gray-200 mb-3">
        Medicines Expiring Soon
      </h3>

      {expiringList.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          ✅ No medicines expiring soon!
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="p-2 text-left">Medicine</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Expire Date</th>
            </tr>
          </thead>
          <tbody>
            {expiringList.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-300 dark:border-gray-700"
              >
                <td className="p-2 text-gray-700 dark:text-gray-200">
                  {item.medicine?.medicine_name || "Unknown Medicine"}
                </td>
                <td className="p-2 text-gray-700 dark:text-gray-200">
                  {item.supply_quantity}
                </td>
                <td className="p-2 text-red-600 dark:text-red-400">
                  {new Date(item.expire_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpiringSoonList;
