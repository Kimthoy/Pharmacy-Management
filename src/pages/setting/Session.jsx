import { useEffect, useState } from "react";
import { getSession } from "../api/sessionService";

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const result = await getSession();
        setSessions(result);
      } catch (err) {
        setError(err.message || "Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <p className="text-gray-500">⏳ Loading sessions...</p>;

  if (error) return <p className="text-red-500">❌ Error: {error}</p>;

  return (
    <div className="bg-white mb-20 dark:bg-gray-800 p-4 rounded shadow">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
          Logged-In Devices
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Here is the device history that logged in to this website.
        </p>
      </div>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No login sessions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left text-gray-800 dark:text-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-2 hidden sm:table-cell">No.</th>
                <th className="px-4 py-2">Device</th>
                <th className="px-4 py-2">IP Address</th>
                <th className="px-4 py-2">Browser</th>
                <th className="px-4 py-2 hidden sm:table-cell ">OS</th>

                <th className="px-4 py-2 hidden sm:table-cell">Blocked</th>
                <th className="px-4 py-2">Login Time</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, idx) => (
                <tr
                  key={session.id || idx}
                  className="border-b border-gray-200 dark:border-gray-600"
                >
                  <td className="px-4 py-2 hidden sm:table-cell">{idx + 1}</td>
                  <td className="px-4 py-2 ">
                    {session.device_type || "Unknown"}
                  </td>
                  <td className="px-4 py-2">{session.ip_address || "N/A"}</td>
                  <td className="px-4 py-2">{session.browser || "Unknown"}</td>
                  <td
                    className="px-4 py-2 hidden sm:table-cell"
                    title={session.os}
                  >
                    {session.os || "Unknown"}
                  </td>

                  <td className="px-4 py-2 hidden sm:table-cell">
                    {session.is_blocked ? "Yes" : "No"}
                  </td>
                  <td
                    className="px-4 py-2 truncate max-w-12"
                    title={session.logged_in_at}
                  >
                    {session.logged_in_at
                      ? new Date(session.logged_in_at).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SessionList;
