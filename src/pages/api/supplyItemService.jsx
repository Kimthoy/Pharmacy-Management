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

// Fetch expiring soon items (accepts params: months & perPage)
// services/supplyItems.js
// services/supplyItemService.js (or wherever this lives)
export const getExpiringSoonItems = async ({
  months = 2,
  perPage = 0,
  inStock = true,        // ⬅️ new param (default: only items still in stock)
} = {}) => {
  try {
    const response = await axios.get(`${API_URL}/supply-items/expiring-soon`, {
      headers: getAuthHeader(),
      params: {
        months,
        per_page: perPage,
        in_stock: inStock ? 1 : 0,   // ⬅️ tell backend to hide zero-stock
      },
    });

    // Normalize any shape: [] | {data: []} | {data: {data: []}}
    const items =
      Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.data?.data)
        ? response.data.data.data
        : [];

    // Extra guard in case the server isn’t updated yet
    return inStock
      ? items.filter((x) => (x?.supply_quantity ?? 0) > 0)
      : items;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
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