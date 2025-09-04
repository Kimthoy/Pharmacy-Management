// src/services/supplyItems.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Normalize different backend response shapes into a clean array
const extractItemsArray = (payload) => {
  if (Array.isArray(payload)) return payload;

  // Common Laravel API response patterns
  if (Array.isArray(payload?.data)) return payload.data; // resource collection
  if (Array.isArray(payload?.data?.data)) return payload.data.data; // paginator

  return [];
};
const api = axios.create({
  baseURL: "http://localhost:8000/api", // or process.env / import.meta.env
  headers: { Accept: "application/json" },
});

// Fetch all supply items
export const getAllSupplyItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/supply-items`, {
      headers: getAuthHeader(),
    });
    return extractItemsArray(response.data);
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch supply items"
    );
  }
};
api.interceptors.request.use((config) => {
  const token =
    (typeof localStorage !== "undefined" && localStorage.getItem("token")) ||
    (typeof sessionStorage !== "undefined" && sessionStorage.getItem("token"));
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

// --- service function ---
export const getExpiringSoonItems = async ({
  months = 2,
  perPage = 0,
  inStock = true,
} = {}) => {
  try {
    const { data } = await api.get("/supply-items/expiring-soon", {
      params: { months, per_page: perPage, in_stock: inStock ? 1 : 0 },
    });

    const items = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.data)
      ? data.data.data
      : [];

    return inStock ? items.filter((x) => (x?.supply_quantity ?? 0) > 0) : items;
  } catch (error) {
    console.error("❌ getExpiringSoonItems failed:", error);
    throw error;
  }
};

// Client-side fallback: filter expired items from all items
export const getExpiredItemsClientSide = async () => {
  const all = await getAllSupplyItems();
  const today = new Date().setHours(0, 0, 0, 0);
  return all.filter(
    (it) =>
      it.expire_date && new Date(it.expire_date).setHours(0, 0, 0, 0) < today
  );
};
export const returnToManufacturer = async (
  supplyItemId,
  { quantity, reason }
) => {
  const res = await axios.post(
    `${API_URL}/supply-items/${supplyItemId}/return`,
    { quantity, reason },
    { headers: getAuthHeader() }
  );
  return res.data;
};
