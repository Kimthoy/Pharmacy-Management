import { useEffect, useState } from "react";
import { getReturns } from "../api/manuReturnService";

const asArray = (p) =>
  Array.isArray(p)
    ? p
    : Array.isArray(p?.data)
    ? p.data
    : Array.isArray(p?.data?.data)
    ? p.data.data
    : [];

const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
        <h3 className="text-base sm:text-lg font-bold">
          Returns to Manufacturer
        </h3>
        <button
          onClick={load}
          className="self-start sm:self-auto px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
          aria-label="Refresh returns list"
        >
          Refresh
        </button>
      </div>

      {/* Mobile: card list */}
      <ul className="md:hidden space-y-3">
        {rows.map((r) => {
          const date = fmtDate(r.returned_at || r.created_at);
          const med = r?.medicine?.medicine_name || r?.medicine?.name || "—";
          const mfr = r?.supplier?.name || "—";
          const qty = r?.quantity ?? "—";
          const reason = r?.reason || "—";
          const user = r?.user?.name || "—";

          return (
            <li
              key={r.id}
              className="rounded border border-gray-200 dark:border-gray-700 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-500">{date}</span>
                <span className="inline-flex items-center rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 text-xs">
                  Qty: {qty}
                </span>
              </div>

              <div className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                {med}
              </div>

              <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <span className="font-semibold">Manufacturer: </span>
                  <span className="break-words">{mfr}</span>
                </div>
                <div>
                  <span className="font-semibold">Reason: </span>
                  <span className="break-words">{reason}</span>
                </div>
                <div>
                  <span className="font-semibold">Processed By: </span>
                  <span className="break-words">{user}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop/tablet: table */}
      <div className="hidden md:block">
        <div className="overflow-y-scroll -mx-4 md:mx-0">
          <table className="min-w-full text-sm">
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
                  <td className="p-2 whitespace-nowrap">
                    {fmtDate(r.returned_at || r.created_at)}
                  </td>
                  <td className="p-2 max-w-[240px]">
                    <span className="line-clamp-1">
                      {r?.medicine?.medicine_name || r?.medicine?.name || "—"}
                    </span>
                  </td>
                  <td className="p-2 max-w-[240px]">
                    <span className="line-clamp-1">
                      {r?.supplier?.name || "—"}
                    </span>
                  </td>
                  <td className="p-2 whitespace-nowrap">{r?.quantity}</td>
                  <td className="p-2 max-w-[280px]">
                    <span className="line-clamp-1">{r?.reason || "—"}</span>
                  </td>
                  <td className="p-2 max-w-[200px]">
                    <span className="line-clamp-1">{r?.user?.name || "—"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
