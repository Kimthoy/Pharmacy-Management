import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
const USE_CENTS = true;

const api = axios.create({ baseURL: API_URL });

// Attach bearer token automatically (from localStorage)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize axios/Laravel errors so callers can rely on err.message
const normErr = (error, fallback = "Request failed") => {
  const res = error?.response?.data;
  if (!res) return { message: fallback };
  if (typeof res === "string") return { message: res };
  return { message: res.message || fallback, errors: res.errors };
};

// Convert UI price (float string) to server int cents if required
const toServerPrice = (price) => {
  const p = Number(price);
  if (Number.isNaN(p) || p < 0) return 0;
  return USE_CENTS ? Math.round(p * 100) : p;
};

/**
 * GET /retail-stocks
 * params: { page?, perPage?, ...filters }
 * returns: { data, meta, links? }
 */
export const getRetailStocks = async (params = {}) => {
  try {
    const { data } = await api.get("/retail-stocks", { params });
    return {
      data: data?.data ?? [],
      meta: data?.meta ?? {},
      links: data?.links ?? undefined,
    };
  } catch (error) {
    throw normErr(error, "Failed to fetch retail stocks");
  }
};

/**
 * POST /retail-stocks
 * body: { stock_id:number, quantity:number, price:number|decimal, tablet?:number, capsule?:number }
 * This is your "transfer to retail" call.
 */
export const createRetailStock = async (data) => {
  try {
    // get logged-in user_id from token payload or localStorage
    const userId = localStorage.getItem("user_id"); // <- you need to store this at login

    const payload = {
      ...data,
      user_id: userId, // backend will use this
    };

    const response = await axios.post(`${API_URL}/retail-stocks`, payload, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
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
    const { data } = await api.get(`/retail-stocks/${id}`);
    return data?.data ?? data;
  } catch (error) {
    throw normErr(error, "Failed to fetch retail stock");
  }
};

/**
 * DELETE /retail-stocks/{id}
 * returns: { message } or resource
 */
export const deleteRetailStock = async (id) => {
  try {
    const { data } = await api.delete(`/retail-stocks/${id}`);
    return data;
  } catch (error) {
    throw normErr(error, "Failed to delete retail stock");
  }
};

const retailStockService = {
  getRetailStocks,
  createRetailStock,
  getRetailStockById,
  deleteRetailStock,
};

export default retailStockService;
