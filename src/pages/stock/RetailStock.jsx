import React, { useEffect, useMemo, useState } from "react";
import { getRetailStocks, updateRetailStock } from "../api/retailStockService";
import { Link } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";

const USE_CENTS = true;
// how long an item counts as "just added"
const NEW_WINDOW_HOURS = 24;
const DEFAULT_PER_PAGE = 15;

const RetailStockManager = () => {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [draft, setDraft] = useState({
    tablet: "",
    capsule: "",
    price_tablet: "",
    price_capsule: "",
  });

  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
  });

  // --- minimal filters: search + sort ---
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "medicine_name", // medicine_name | quantity | price_tablet | price_capsule | created_at
    sortDir: "asc", // asc | desc
    perPage: DEFAULT_PER_PAGE,
  });

  const { t } = useTranslation();

  // Build params for backend (it will ignore unknown ones)
  const buildRequestParams = (page = 1) => ({
    page,
    perPage: Number(filters.perPage) || DEFAULT_PER_PAGE,
    search: filters.search?.trim() || undefined,
    sort_by: filters.sortBy,
    sort_dir: filters.sortDir,
  });

  const fetchRetailStocks = async (page = 1) => {
    try {
      setLoading(true);
      const params = buildRequestParams(page);
      const res = await getRetailStocks(params);

      setRows(Array.isArray(res.data) ? res.data : []);
      setMeta(
        res.meta || {
          current_page: page,
          last_page: 1,
          per_page: params.perPage,
          total: Array.isArray(res.data) ? res.data.length : 0,
        }
      );
      setMessage("");
    } catch (err) {
      setRows([]);
      setMessage(err?.message || "Failed to load retail stock data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetailStocks(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- helpers ----------
  const formatNumber = (v) =>
    typeof v === "number" ? new Intl.NumberFormat().format(v) : v;

  // show whole-number riel (grouped) without symbol
  const formatMoney = (p) => {
    if (p == null) return "—";
    const num = Number(p);
    if (Number.isNaN(num)) return "—";
    const value = USE_CENTS ? Math.round(num) : Math.round(num);
    return new Intl.NumberFormat("km-KH").format(value);
  };

  const toDisplayPrice = (raw) => {
    if (raw == null || raw === "") return "";
    const num = Number(raw);
    if (Number.isNaN(num)) return "";
    return Math.round(num).toString();
  };

  const fromDisplayPrice = (display) => {
    if (display == null || display === "") return null;
    const clean = String(display).replace(/[^0-9-]/g, "");
    const val = Number(clean);
    if (Number.isNaN(val)) return null;
    return Math.round(val);
  };

  // recently added flag
  const isRecentlyAdded = (iso) => {
    if (!iso) return false;
    const ts = Date.parse(iso);
    if (Number.isNaN(ts)) return false;
    return Date.now() - ts <= NEW_WINDOW_HOURS * 60 * 60 * 1000;
  };

  const beginEdit = (row) => {
    setEditingId(row.id);
    setDraft({
      tablet: String(row.tablet ?? ""),
      capsule: String(row.capsule ?? ""),
      price_tablet: toDisplayPrice(row.price_tablet ?? null),
      price_capsule: toDisplayPrice(row.price_capsule ?? null),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ tablet: "", capsule: "", price_tablet: "", price_capsule: "" });
  };

  const saveRow = async (row) => {
    try {
      setSavingId(row.id);
      setMessage("");

      const payload = {
        tablet: draft.tablet === "" ? null : Number(draft.tablet),
        capsule: draft.capsule === "" ? null : Number(draft.capsule),
        price_tablet: fromDisplayPrice(draft.price_tablet),
        price_capsule: fromDisplayPrice(draft.price_capsule),
      };

      const invalidQty = [payload.tablet, payload.capsule].some(
        (v) => v != null && (!Number.isFinite(v) || v < 0)
      );
      if (invalidQty)
        throw new Error(
          t("retail-stock.InvalidQuantity") || "Invalid quantity"
        );

      const invalidPrice = [payload.price_tablet, payload.price_capsule].some(
        (v) => v != null && (!Number.isFinite(v) || v < 0)
      );
      if (invalidPrice)
        throw new Error(t("retail-stock.InvalidPrice") || "Invalid price");

      await updateRetailStock(row.id, payload);

      // optimistic update
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id
            ? {
                ...r,
                tablet: payload.tablet ?? r.tablet,
                capsule: payload.capsule ?? r.capsule,
                price_tablet: payload.price_tablet ?? r.price_tablet,
                price_capsule: payload.price_capsule ?? r.price_capsule,
              }
            : r
        )
      );

      setEditingId(null);
      setDraft({
        tablet: "",
        capsule: "",
        price_tablet: "",
        price_capsule: "",
      });

      await fetchRetailStocks(meta.current_page || 1);
      setMessage(t("retail-stock.Saved") || "Saved.");
    } catch (err) {
      setMessage(
        err?.message || t("retail-stock.SaveFailed") || "Save failed."
      );
    } finally {
      setSavingId(null);
    }
  };

  const goToPage = (p) => {
    const last = meta?.last_page || 1;
    if (p >= 1 && p <= last) fetchRetailStocks(p);
  };

  // --- client-side fallback for search + sort ---
  const clientFilteredRows = useMemo(() => {
    let out = rows;

    if (filters.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      out = out.filter((r) => {
        const name = (r.medicine?.medicine_name || r.medicine || "")
          .toString()
          .toLowerCase();
        return name.includes(q);
      });
    }

    // sort
    const key = filters.sortBy;
    out = [...out].sort((a, b) => {
      const dir = filters.sortDir === "desc" ? -1 : 1;

      if (key === "medicine_name") {
        const nameA = String(
          a.medicine?.medicine_name || a.medicine || ""
        ).toLowerCase();
        const nameB = String(
          b.medicine?.medicine_name || b.medicine || ""
        ).toLowerCase();
        return nameA.localeCompare(nameB) * dir;
      }

      const va = a[key];
      const vb = b[key];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      return (Number(va) - Number(vb)) * dir;
    });

    return out;
  }, [rows, filters]);

  // ---------- UI ----------
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t("retail-stock.RetailStockManager") || "Retail Stock Manager"}
      </h1>

      {message && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          {message}
        </div>
      )}

      {/* Simple filter bar: Search + Sort */}
      <div className="border rounded-lg p-3 mb-4 bg-white border-green-600 flex flex-wrap items-center gap-3">
        <input
          type="text"
          className="border rounded px-2 py-1 flex-1 focus:outline-none "
          placeholder={
            t("retail-stock.SearchPlaceholder") || "Search medicine..."
          }
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
        />

        <label className="text-sm">
          {t("retail-stock.SortBy") || "Sort by"}
        </label>
        <select
          className="border rounded px-2 py-1"
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((f) => ({ ...f, sortBy: e.target.value }))
          }
        >
          <option value="medicine_name">
            {t("retail-stock.Medicine") || "Medicine Name"}
          </option>
          <option value="quantity">
            {t("retail-stock.Quantity") || "Transfer Quantity"}
          </option>
          <option value="price_tablet">
            {t("retail-stock.PriceTablet") || "Price / Tablet"}
          </option>
          <option value="price_capsule">
            {t("retail-stock.PriceCapsule") || "Price / Capsule"}
          </option>
        </select>

        <select
          className="border rounded px-2 py-1"
          value={filters.sortDir}
          onChange={(e) =>
            setFilters((f) => ({ ...f, sortDir: e.target.value }))
          }
        >
          <option value="asc">{t("retail-stock.Asc") || "Ascending"}</option>
          <option value="desc">{t("retail-stock.Desc") || "Descending"}</option>
        </select>
      </div>

      {/* Desktop / Tablet table */}
      <div className="hidden md:block overflow-x-auto border rounded-lg mb-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-600 text-slate-100">
              <th className="border p-2 dark:text-slate-100 text-left">
                {t("retail-stock.Medicine") || "Medicine Name"}
              </th>
              <th className="border p-2 dark:text-slate-100 text-right">
                {t("retail-stock.Quantity") || "Transfer Quantity"}
              </th>
              <th className="border p-2 dark:text-slate-100 text-right">
                {t("retail-stock.Tablet") || "Tablet/box"}
              </th>
              <th className="border p-2 dark:text-slate-100 text-right">
                {t("retail-stock.Capsule") || "Capsule/box"}
              </th>
              <th className="border p-2 dark:text-slate-100 text-right">
                {t("retail-stock.PriceTablet") || "Price / Tablet"}
              </th>
              <th className="border p-2 dark:text-slate-100 text-right">
                {t("retail-stock.PriceCapsule") || "Price / Capsule"}
              </th>
              <th className="border p-2 dark:text-slate-100">
                {t("retail-stock.Actions") || "Actions"}
              </th>
            </tr>
          </thead>
          <tbody>
            {clientFilteredRows.length > 0 ? (
              clientFilteredRows.map((item) => {
                const medicineName =
                  item.medicine && typeof item.medicine === "object"
                    ? item.medicine.medicine_name
                    : item.medicine || "Unknown";
                const qty = Number(item.quantity ?? 0);
                const tablet = Number(item.tablet ?? 0);
                const capsule = Number(item.capsule ?? 0);
                const priceTablet = item.price_tablet ?? null;
                const priceCapsule = item.price_capsule ?? null;
                const isEditing = editingId === item.id;
                const isNew = isRecentlyAdded(item.created_at);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-600"
                  >
                    <td className="border p-2 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <Link
                          to="/stocklist"
                          state={{ highlightedRetailStock: item.id }}
                          className="text-green-600 hover:underline dark:text-slate-200"
                        >
                          {medicineName}
                        </Link>
                        {isNew && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 font-semibold">
                            {t("retail-stock.New") || "ថ្មី"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border p-2 dark:text-slate-100 text-right">
                      {formatNumber(qty)}
                    </td>
                    <td className="border p-2 dark:text-slate-100 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          className="w-24 border border-green-600 rounded px-2 py-1"
                          value={draft.tablet}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, tablet: e.target.value }))
                          }
                          min={0}
                        />
                      ) : (
                        formatNumber(tablet)
                      )}
                    </td>
                    <td className="border p-2 dark:text-slate-100 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          className="w-24 border border-green-600 rounded px-2 py-1"
                          value={draft.capsule}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, capsule: e.target.value }))
                          }
                          min={0}
                        />
                      ) : (
                        formatNumber(capsule)
                      )}
                    </td>
                    <td className="border p-2 dark:text-slate-100 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          step="1"
                          className="w-28 border border-green-600 rounded px-2 py-1"
                          value={draft.price_tablet}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              price_tablet: e.target.value,
                            }))
                          }
                          min={0}
                          placeholder="0"
                        />
                      ) : priceTablet == null ? (
                        "—"
                      ) : (
                        formatMoney(priceTablet)
                      )}
                    </td>
                    <td className="border p-2 dark:text-slate-100 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          step="1"
                          className="w-28 border border-green-600 rounded px-2 py-1"
                          value={draft.price_capsule}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              price_capsule: e.target.value,
                            }))
                          }
                          min={0}
                          placeholder="0"
                        />
                      ) : priceCapsule == null ? (
                        "—"
                      ) : (
                        formatMoney(priceCapsule)
                      )}
                    </td>
                    <td className="border p-2 dark:text-slate-100 whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            className="px-3 py-1 border rounded bg-green-600 text-white disabled:opacity-50"
                            onClick={() => saveRow(item)}
                            disabled={savingId === item.id}
                          >
                            {savingId === item.id
                              ? t("retail-stock.Saving") || "Saving…"
                              : t("retail-stock.Save") || "Save"}
                          </button>
                          <button
                            className="px-3 py-1 border rounded disabled:opacity-50"
                            onClick={cancelEdit}
                            disabled={savingId === item.id}
                          >
                            {t("retail-stock.Cancel") || "Cancel"}
                          </button>
                        </div>
                      ) : (
                        <div className="text-right">
                          <button
                            className="px-3 py-1 border rounded"
                            onClick={() => beginEdit(item)}
                          >
                            {t("retail-stock.Edit") || "Edit"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  {t("retail-stock.NotFound") || "No retail stock found."} .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3 mb-6">
        {clientFilteredRows.length > 0 ? (
          clientFilteredRows.map((item) => {
            const medicineName =
              item.medicine && typeof item.medicine === "object"
                ? item.medicine.medicine_name
                : item.medicine || "Unknown";
            const qty = Number(item.quantity ?? 0);
            const tablet = Number(item.tablet ?? 0);
            const capsule = Number(item.capsule ?? 0);
            const priceTablet = item.price_tablet ?? null;
            const priceCapsule = item.price_capsule ?? null;
            const isEditing = editingId === item.id;
            const isNew = isRecentlyAdded(item.created_at);

            return (
              <div
                key={item.id}
                className="border rounded-lg p-3 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Link
                      to="/stocklist"
                      state={{ highlightedRetailStock: item.id }}
                      className="text-blue-600 font-medium"
                    >
                      {medicineName}
                    </Link>
                    {isNew && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 font-semibold">
                        {t("retail-stock.New") || "ថ្មី"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {t("retail-stock.Quantity") || "Transfer Quantity"}:{" "}
                    {formatNumber(qty)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <div className="text-xs text-gray-500">
                      {t("retail-stock.Tablet") || "Tablet/box"}
                    </div>
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-full border border-green-600 rounded px-2 py-1"
                        value={draft.tablet}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, tablet: e.target.value }))
                        }
                        min={0}
                      />
                    ) : (
                      <div className="font-medium">{formatNumber(tablet)}</div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">
                      {t("retail-stock.Capsule") || "Capsule/box"}
                    </div>
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-full border border-green-600 rounded px-2 py-1"
                        value={draft.capsule}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, capsule: e.target.value }))
                        }
                        min={0}
                      />
                    ) : (
                      <div className="font-medium">{formatNumber(capsule)}</div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">
                      {t("retail-stock.PriceTablet") || "Price / Tablet"}
                    </div>
                    {isEditing ? (
                      <input
                        type="number"
                        step="1"
                        className="w-full border border-green-600 rounded px-2 py-1"
                        value={draft.price_tablet}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            price_tablet: e.target.value,
                          }))
                        }
                        min={0}
                        placeholder="0"
                      />
                    ) : (
                      <div className="font-medium">
                        {priceTablet == null ? "—" : formatMoney(priceTablet)}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">
                      {t("retail-stock.PriceCapsule") || "Price / Capsule"}
                    </div>
                    {isEditing ? (
                      <input
                        type="number"
                        step="1"
                        className="w-full border border-green-600 rounded px-2 py-1"
                        value={draft.price_capsule}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            price_capsule: e.target.value,
                          }))
                        }
                        min={0}
                        placeholder="0"
                      />
                    ) : (
                      <div className="font-medium">
                        {priceCapsule == null ? "—" : formatMoney(priceCapsule)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end gap-2">
                  {isEditing ? (
                    <>
                      <button
                        className="px-3 py-1 border rounded bg-green-600 text-white disabled:opacity-50"
                        onClick={() => saveRow(item)}
                        disabled={savingId === item.id}
                      >
                        {savingId === item.id
                          ? t("retail-stock.Saving") || "Saving…"
                          : t("retail-stock.Save") || "Save"}
                      </button>
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={cancelEdit}
                        disabled={savingId === item.id}
                      >
                        {t("retail-stock.Cancel") || "Cancel"}
                      </button>
                    </>
                  ) : (
                    <button
                      className="px-3 py-1 border rounded"
                      onClick={() => beginEdit(item)}
                    >
                      {t("retail-stock.Edit") || "Edit"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-6">
            {t("retail-stock.NotFound") || "No retail stock found."} .
          </div>
        )}
      </div>

      {/* Simple pagination */}
      <div className="flex items-center justify-between">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => goToPage((meta.current_page || 1) - 1)}
          disabled={(meta.current_page || 1) <= 1 || loading}
        >
          {t("retail-stock.Prev") || "Prev"}
        </button>
        <div className="text-sm">
          {t("retail-stock.Page") || "Page"} {meta.current_page || 1}{" "}
          {t("retail-stock.of") || "of"} {meta.last_page || 1}
          {typeof meta.total === "number" ? (
            <span className="text-gray-500">
              {" "}
              • {meta.total} {t("retail-stock.Items") || "items"}
            </span>
          ) : null}
        </div>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => goToPage((meta.current_page || 1) + 1)}
          disabled={
            (meta.current_page || 1) >= (meta.last_page || 1) || loading
          }
        >
          {t("retail-stock.Next") || "Next"}
        </button>
      </div>
    </div>
  );
};

export default RetailStockManager;
