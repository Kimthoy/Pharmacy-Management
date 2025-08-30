import { useEffect, useState } from "react";
import { getReturns } from "../api/manuReturnService";

const fmt = (v) => {
  const d = v ? new Date(v) : null;
  return d && !isNaN(d) ? d.toLocaleString() : "—";
};

const asArray = (p) =>
  Array.isArray(p)
    ? p
    : Array.isArray(p?.data)
    ? p.data
    : Array.isArray(p?.data?.data)
    ? p.data.data
    : [];

export default function ReturnsTable() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const list = await getReturns();
      setRows(asArray(list));
    } catch (e) {
      setErr(e.message || "Failed to load returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="p-4 text-gray-500">Loading returns…</div>;
  if (err) return <div className="p-4 text-red-600">{err}</div>;

  if (!rows.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
        No transfers/returns yet.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">Returns to Manufacturer</h3>
        <button
          onClick={load}
          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Refresh
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          <tr>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Medicine</th>
            <th className="p-2 text-left">Manufacturer</th>
            <th className="p-2 text-left">Qty</th>
            <th className="p-2 text-left">Reason</th>
            <th className="p-2 text-left">Processed By</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <td className="p-2">{fmt(r.returned_at || r.created_at)}</td>
              <td className="p-2">
                {r?.medicine?.medicine_name || r?.medicine?.name || "—"}
              </td>
              <td className="p-2">{r?.supplier?.name || "—"}</td>
              <td className="p-2">{r?.quantity}</td>
              <td className="p-2">{r?.reason || "—"}</td>
              <td className="p-2">{r?.user?.name || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
