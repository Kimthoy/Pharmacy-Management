// src/pages/admin/orders/AdminOrderDetail.jsx
import React, { useEffect, useState } from "react";
import {
  adminGetOrder,
  adminUpdateOrderStatus,
} from "../api/adminOrderService";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Badge = ({ children }) => (
  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
    {children}
  </span>
);

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminGetOrder(id);
      setOrder(data);
      setStatus(data?.status || "");
    } catch (e) {
      console.error(e);
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateStatus = async () => {
    try {
      await adminUpdateOrderStatus(id, status);
      toast.success("Status updated");
      load();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-4">Loading…</div>;
  if (!order) return <div className="p-4">Order not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Order #{order.id}</h1>
        <Link
          to="/admin/orders"
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Customer</div>
          <div className="font-medium">
            {order.customer_name || order.user?.name || "—"}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Payment</div>
          <div className="font-medium">{order.payment_method || "—"}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-gray-500 text-sm">Total</div>
          <div className="font-medium">
            ${Number(order.total_usd || 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow mt-3">
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">Status</div>
          <Badge>{order.status || "—"}</Badge>
          <select
            className="ml-auto border rounded px-3 h-9"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {[
              "pending",
              "paid",
              "processing",
              "shipped",
              "completed",
              "canceled",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            className="px-3 h-9 rounded bg-emerald-600 text-white"
            onClick={updateStatus}
          >
            Update
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow mt-3 overflow-x-auto">
        <div className="text-sm font-semibold mb-2">Items</div>
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
                  ${Number(it.unit_price_usd || it.price_usd || 0).toFixed(2)}
                </td>
                <td className="px-3 py-2">
                  ${Number(it.subtotal_usd || 0).toFixed(2)}
                </td>
              </tr>
            ))}
            {(!order.items || order.items.length === 0) && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan="4">
                  No items
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-left" autoClose={1300} />
    </div>
  );
}
