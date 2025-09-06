// src/pages/apiOrderService.jsx
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function adminListOrders(params = {}) {
  const res = await axios.get(`${API_URL}/orders`, {
    params,
    headers: { ...getAuthHeader() },
  });
  // expect {data: [...], meta: {current_page, last_page, ...}}
  return res.data;
}

export async function adminGetOrder(id) {
  const res = await axios.get(`${API_URL}/orders/${id}`, {
    headers: { ...getAuthHeader() },
  });
  return res.data?.data || res.data;
}

export async function adminUpdateOrderStatus(id, status) {
  const res = await axios.patch(
    `${API_URL}/orders/${id}/status`,
    { status },
    { headers: { ...getAuthHeader() } }
  );
  return res.data?.data || res.data;
}

export async function adminDeleteOrder(id) {
  const res = await axios.delete(`${API_URL}/orders/${id}`, {
    headers: { ...getAuthHeader() },
  });
  return res.data;
}
