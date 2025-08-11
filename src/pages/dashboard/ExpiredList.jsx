const ExpiredList = ({ expiredList }) => {
  const safeList = Array.isArray(expiredList) ? expiredList : [];
  if (safeList.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
        No expired medicines!
      </div>
    );
  }

  return (
    <div className="bg-red-50 mb-6 dark:bg-gray-800 p-4 rounded shadow-lg">
      <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-3">
        Expired Medicines
      </h3>

      <table className="w-full text-sm">
        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          <tr>
            <th className="p-2 text-left">Medicine</th>
            <th className="p-2 text-left">Quantity</th>
            <th className="p-2 text-left">Expired On</th>
          </tr>
        </thead>
        <tbody>
          {safeList.map((item, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-300 dark:border-gray-700"
            >
              <td className="p-2 text-gray-700 dark:text-gray-200">
                {item.medicine?.medicine_name || "Unknown"}
              </td>
              <td className="p-2 text-gray-700 dark:text-gray-200">
                {item.supply_quantity || "N/A"}
              </td>
              <td className="p-2 text-red-600 dark:text-red-400">
                {item.expire_date
                  ? new Date(item.expire_date).toLocaleDateString()
                  : "No date"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpiredList;
