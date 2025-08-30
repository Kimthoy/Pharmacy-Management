import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Normalizers (your Laravel responses wrap data like { status, data: [...] } or { status, data: {...} })
const asArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const asObject = (payload) => payload?.data ?? payload;

/** List all manufacturer returns */
export const getReturns = async (params = {}) => {
  try {
    const res = await axios.get(`${API_URL}/returns`, {
      headers: getAuthHeader(),
      params, // keep for future filters/pagination if you add them
    });
    return asArray(res.data);
  } catch (e) {
    throw new Error(
      e?.response?.data?.message || e?.message || "Failed to fetch returns"
    );
  }
};

/** Get a single return by id */
export const getReturnById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/returns/${id}`, {
      headers: getAuthHeader(),
    });
    return asObject(res.data);
  } catch (e) {
    throw new Error(
      e?.response?.data?.message || e?.message || "Failed to fetch the return"
    );
  }
};

/** Create a manual return record (logging only) */
export const createReturn = async ({
  supply_item_id,
  quantity,
  reason = null,
}) => {
  try {
    const res = await axios.post(
      `${API_URL}/returns`,
      { supply_item_id, quantity, reason },
      { headers: getAuthHeader() }
    );
    return asObject(res.data);
  } catch (e) {
    throw new Error(
      e?.response?.data?.message || e?.message || "Failed to create return"
    );
  }
};
