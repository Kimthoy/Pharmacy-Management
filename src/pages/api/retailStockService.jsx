import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Normalize axios errors so callers can always read err.message
const normErr = (error, fallback = "Request failed") => {
  const res = error?.response?.data;
  if (!res) return { message: fallback };
  if (typeof res === "string") return { message: res };
  return { message: res.message || fallback, errors: res.errors };
};

/**
 * GET /retail-stocks
 * params: { page?, perPage?, ...any filters }
 * returns: { data, meta, links? }
 */
export const getRetailStocks = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/retail-stocks`, {
      headers: getAuthHeader(),
      params,
    });
    const payload = response.data || {};
    // Laravel Resource::collection(paginate()) => { data: [...], meta, links }
    return {
      data: payload.data ?? [],
      meta: payload.meta ?? {},
      links: payload.links ?? undefined,
    };
  } catch (error) {
    throw normErr(error, "Failed to fetch stocks");
  }
};

/**
 * POST /retail-stocks
 * body: { stock_id: number, quantity: number, price_out: number }
 * returns: single resource object
 */
export const createRetailStock = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/retail-stocks`, data, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      // If you use Sanctum cookies instead of Bearer tokens, enable:
      // withCredentials: true,
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    throw normErr(error, "Failed to create retail stock");
  }
};

/**
 * GET /retail-stocks/{id}
 * returns: single resource object
 */
export const getRetailStockById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/retail-stocks/   ${id}`, {
      headers: getAuthHeader(),
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    throw normErr(error, "Failed to fetch retail stock");
  }
};

/**
 * DELETE /retail-stocks/{id}
 * returns: { message } or { data }
 */
export const deleteRetailStock = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/retail-stocks/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw normErr(error, "Failed to delete retail stock");
  }
};

export const retailStockService = {
  getRetailStocks,
  createRetailStock,
  getRetailStockById,
  deleteRetailStock,
};

export default retailStockService;
