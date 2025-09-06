import { useEffect, useMemo, useState } from "react";
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

// helpers for filtering/sorting
const rowDateValue = (r) => {
  const v = r?.returned_at || r?.created_at;
  const ts = Date.parse(v || "");
  return Number.isFinite(ts) ? ts : null;
};

export default function ReturnsTable() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // NEW: filters
  const [filters, setFilters] = useState({
    search: "",
    startDate: "", // yyyy-mm-dd
    endDate: "", // yyyy-mm-dd
    sortBy: "date", // date | name | qty
    sortDir: "desc", // asc | desc
  });

  const load = async () => {
    try {
      setLoading(true);
      const list = await getReturns();
      setRows(asArray(list));
      setErr("");
    } catch (e) {
      setErr(e.message || "Failed to load returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Build filtered + sorted view
  const filteredSorted = useMemo(() => {
    let out = rows;

    // search by medicine name
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      out = out.filter((r) => {
        const name = (r?.medicine?.medicine_name || r?.medicine?.name || "")
          .toString()
          .toLowerCase();
        return name.includes(q);
      });
    }

    // date range filter
    if (filters.startDate) {
      const startTs = Date.parse(filters.startDate + "T00:00:00");
      out = out.filter((r) => {
        const ts = rowDateValue(r);
        return ts == null ? false : ts >= startTs;
      });
    }
    if (filters.endDate) {
      // include whole end day
      const endTs = Date.parse(filters.endDate + "T23:59:59.999");
      out = out.filter((r) => {
        const ts = rowDateValue(r);
        return ts == null ? false : ts <= endTs;
      });
    }

    // sorting
    const dir = filters.sortDir === "desc" ? -1 : 1;
    const sortKey = filters.sortBy;

    const getKey = (r) => {
      switch (sortKey) {
        case "name":
          return (r?.medicine?.medicine_name || r?.medicine?.name || "")
            .toString()
            .toLowerCase();
        case "qty":
          return Number(r?.quantity ?? 0);
        case "date":
        default:
          return rowDateValue(r) ?? 0;
      }
    };

    return [...out].sort((a, b) => {
      const A = getKey(a);
      const B = getKey(b);
      if (sortKey === "name") {
        return String(A).localeCompare(String(B)) * dir;
      }
      return (Number(A) - Number(B)) * dir;
    });
  }, [rows, filters]);

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
        <div className="flex flex-wrap gap-2">
          {/* FILTER BAR */}
          <input
            type="text"
            placeholder="Search medicine…"
            className="border rounded px-2 py-1"
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
          />
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((f) => ({ ...f, startDate: e.target.value }))
            }
          />
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((f) => ({ ...f, endDate: e.target.value }))
            }
          />
          <select
            className="border rounded px-2 py-1"
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sortBy: e.target.value }))
            }
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="qty">Qty</option>
          </select>
          <select
            className="border rounded px-2 py-1"
            value={filters.sortDir}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sortDir: e.target.value }))
            }
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
          <button
            onClick={() =>
              setFilters({
                search: "",
                startDate: "",
                endDate: "",
                sortBy: "date",
                sortDir: "desc",
              })
            }
            className="px-3 py-1 rounded border"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Mobile: card list */}
      <ul className="md:hidden space-y-3">
        {filteredSorted.map((r) => {
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
              {filteredSorted.map((r) => (
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
