import React, { useEffect, useState } from "react";
import { getAuditLogs, clearAuditLogs } from "../api/settingsService";

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ user_id: "", event: "" });
  const [meta, setMeta] = useState({});

  const fetchLogs = async (pageNumber = 1, newFilters = filters) => {
    setLoading(true);
    try {
      const data = await getAuditLogs(pageNumber, newFilters);
      setLogs(data.data);
      setMeta({
        current_page: data.current_page,
        last_page: data.last_page,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm("⚠️ Are you sure you want to clear ALL logs?")) return;
    await clearAuditLogs();
    fetchLogs();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => fetchLogs(1, filters);

  return (
    <div className="max-w-5xl mx-auto mt-6 bg-transparent dark:bg-gray-800 p-4 rounded">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Audit Logs
        </h2>
        <button
          onClick={handleClearLogs}
          className="text-red-600 dark:text-red-400 px-3 py-1 rounded hover:underline"
        >
          Clear Logs
        </button>
      </div>

      {/* Filter Inputs */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          name="user_id"
          placeholder="Filter by User ID"
          value={filters.user_id}
          onChange={handleFilterChange}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded w-40 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        />
        <input
          type="text"
          name="event"
          placeholder="Filter by Event"
          value={filters.event}
          onChange={handleFilterChange}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded w-40 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        />
        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Apply
        </button>
      </div>

      {/* Loading / Empty / Table */}
      {loading ? (
        <p className="text-center py-4 text-gray-600 dark:text-gray-300">
          ⏳ Loading logs...
        </p>
      ) : logs.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No logs found
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300 dark:border-gray-600">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <tr>
                <th className="p-2 border dark:border-gray-600">#</th>
                <th className="p-2 border dark:border-gray-600">User</th>
                <th className="p-2 border dark:border-gray-600">Event</th>
                <th className="p-2 border dark:border-gray-600">Old → New</th>
                <th className="p-2 border dark:border-gray-600">IP</th>
                <th className="p-2 border dark:border-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-2 text-gray-800 dark:text-gray-200">
                    {log.id}
                  </td>
                  <td className="p-2 text-gray-800 dark:text-gray-200">
                    {log.user?.name || "Unknown"} (ID: {log.user_id})
                  </td>
                  <td className="p-2 text-gray-800 dark:text-gray-200">
                    {log.event}
                  </td>
                  <td className="p-2 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    <pre>
                      {JSON.stringify(log.old_values)} →{" "}
                      {JSON.stringify(log.new_values)}
                    </pre>
                  </td>
                  <td className="p-2 text-gray-800 dark:text-gray-200">
                    {log.ip_address}
                  </td>
                  <td className="p-2 text-gray-800 dark:text-gray-200">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-gray-700 dark:text-gray-300">
            <button
              disabled={meta.current_page <= 1}
              onClick={() => fetchLogs(meta.current_page - 1)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {meta.current_page} / {meta.last_page}
            </span>
            <button
              disabled={meta.current_page >= meta.last_page}
              onClick={() => fetchLogs(meta.current_page + 1)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogPage;
