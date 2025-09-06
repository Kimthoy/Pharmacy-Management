// src/pages/admin/orders/AdminOrdersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  adminListOrders,
  adminUpdateOrderStatus,
  adminDeleteOrder,
  adminGetOrder,
} from "../api/adminOrderService";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Inline UI helpers
const StatusBadge = ({ status }) => {
  const map =
    {
      pending: "bg-amber-100 text-amber-800",
      paid: "bg-emerald-100 text-emerald-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-indigo-100 text-indigo-800",
      completed: "bg-green-100 text-green-800",
      canceled: "bg-rose-100 text-rose-800",
      failed: "bg-gray-200 text-gray-700",
    }[String(status || "").toLowerCase()] || "bg-gray-100 text-gray-700";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map}`}>
      {status || "—"}
    </span>
  );
};

const ConfirmModal = ({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <div className="text-lg font-semibold mb-2">{title}</div>
        <div className="text-sm text-gray-600 mb-5">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewModal = ({ open, onClose, order }) => {
  if (!open || !order) return null;
  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold">Order #{order.id}</h2>
          <button
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Customer</div>
            <div className="font-medium">
              {order?.customer?.name || order.users?.username || "—"}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Status</div>
            <StatusBadge status={order.status} />
          </div>
          <div>
            <div className="text-gray-500">Payment</div>
            <div className="font-medium">{order.payment_method || "—"}</div>
          </div>
          <div>
            <div className="text-gray-500">Total</div>
            <div className="font-medium">
              ${Number(order.total_usd || 0).toFixed(2)}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-gray-500">Created</div>
            <div className="font-medium">
              {order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "—"}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold mb-2">Items</div>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2">Product</th>
                  <th className="text-left px-3 py-2">Qty</th>
                  <th className="text-left px-3 py-2">Unit</th>
                  <th className="text-left px-3 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="px-3 py-2">{it.name || it.product_name}</td>
                    <td className="px-3 py-2">{it.qty}</td>
                    <td className="px-3 py-2">
                      $
                      {Number(it.unit_price_usd || it.price_usd || 0).toFixed(
                        2
                      )}
                    </td>
                    <td className="px-3 py-2">
                      ${Number(it.subtotal_usd || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {(!order.items || order.items.length === 0) && (
                  <tr>
                    <td
                      className="px-3 py-6 text-center text-gray-500"
                      colSpan="4"
                    >
                      No items
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Link
            to={`/admin/orders/${order.id}`}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Open detail page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function AdminOrdersPage() {
  const navigate = useNavigate();

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");

  // data
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(false);

  // modals / selection
  const [viewOpen, setViewOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminListOrders({
        page,
        q: q.trim() || undefined,
        status: status || undefined,
        payment_method: payment || undefined,
      });
      const data = res?.data || [];
      const meta = res?.meta || { current_page: 1, last_page: 1 };
      setRows(Array.isArray(data) ? data : []);
      setMeta(meta);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // apply filters
  const onApply = () => fetchData(1);

  const onChangeStatus = async (id, newStatus) => {
    try {
      await adminUpdateOrderStatus(id, newStatus);
      toast.success("Order status updated");
      fetchData(meta.current_page);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    }
  };

  const onDelete = async () => {
    if (!confirmId) return;
    try {
      await adminDeleteOrder(confirmId);
      toast.success("Order deleted");
      setConfirmOpen(false);
      setConfirmId(null);
      const pg =
        rows.length === 1 && meta.current_page > 1
          ? meta.current_page - 1
          : meta.current_page;
      fetchData(pg);
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete order");
    }
  };

  const openView = async (id) => {
    try {
      const ord = await adminGetOrder(id);
      setViewOrder(ord);
      setViewOpen(true);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load order");
    }
  };

  const statuses = [
    "pending",
    "paid",
    "processing",
    "shipped",
    "completed",
    "canceled",
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Orders (Admin)</h1>
        <button
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          onClick={() => fetchData(meta.current_page)}
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-3 shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search order id / customer"
          className="border rounded-lg px-3 h-10"
        />
        <select
          className="border rounded-lg px-3 h-10"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="border rounded-lg px-3 h-10"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option value="">All payment methods</option>
          <option value="cash">cash</option>
          <option value="card">card</option>
          <option value="transfer">transfer</option>
        </select>
        <button
          className="h-10 rounded-lg bg-emerald-600 text-white"
          onClick={onApply}
        >
          Apply
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2">#</th>
              <th className="text-left px-3 py-2">Customer</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Payment</th>
              <th className="text-left px-3 py-2">Total</th>
              <th className="text-left px-3 py-2">Created</th>
              <th className="text-left px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                  No orders
                </td>
              </tr>
            ) : (
              rows.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-3 py-2 font-medium">#{o.id}</td>
                  <td className="px-3 py-2">
                    {o.full_name || o.users?.username || "—"}
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-3 py-2">{o.payment_method || "—"}</td>
                  <td className="px-3 py-2">៛{Number(o.total_khr || 0)} </td>
                  <td className="px-3 py-2">
                    {o.created_at
                      ? new Date(o.created_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                        onClick={() => openView(o.id)}
                      >
                        View
                      </button>
                      <Link
                        className="px-2 py-1 rounded bg-white border hover:bg-gray-50"
                        to={`/admin/orders/${o.id}`}
                      >
                        Detail
                      </Link>
                      <select
                        className="px-2 py-1 border rounded"
                        value={o.status || ""}
                        onChange={(e) => onChangeStatus(o.id, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        className="px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                        onClick={() => {
                          setConfirmId(o.id);
                          setConfirmOpen(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-gray-500">
          Page {meta.current_page || 1} of {meta.last_page || 1}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 h-9 rounded border disabled:opacity-50"
            disabled={(meta.current_page || 1) <= 1}
            onClick={() => fetchData((meta.current_page || 1) - 1)}
          >
            Prev
          </button>
          <button
            className="px-3 h-9 rounded border disabled:opacity-50"
            disabled={(meta.current_page || 1) >= (meta.last_page || 1)}
            onClick={() => fetchData((meta.current_page || 1) + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <ViewModal
        open={viewOpen}
        order={viewOrder}
        onClose={() => {
          setViewOpen(false);
          setViewOrder(null);
        }}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Delete order?"
        message="This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onDelete}
        confirmText="Delete"
      />

      <ToastContainer position="top-left" autoClose={1300} />
    </div>
  );
}
