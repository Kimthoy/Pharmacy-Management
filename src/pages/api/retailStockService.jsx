import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const USE_CENTS = true; // set false if your API already uses decimal prices

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

// Convert UI price (float string/number) to server int cents if required
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

export const getToretailProduct = async (params = {}) => {
  try {
    const { data } = await api.get("/retail-stocks", { params });
    return data?.data ?? [];
  } catch (error) {
    throw normErr(error, "Failed to fetch retail stocks");
  }
};

/**
 * POST /retail-stocks
 * body: { medicine_id, quantity, price, tablet?, capsule?, price_tablet?, price_capsule? }
 */
export const createRetailStock = async (payload) => {
  try {
    const userId = localStorage.getItem("user_id"); // set this at login
    const body = {
      ...payload,
      user_id: userId ?? undefined,
    };
    if (body.price !== undefined) body.price = toServerPrice(body.price);
    if (body.price_tablet !== undefined)
      body.price_tablet = toServerPrice(body.price_tablet);
    if (body.price_capsule !== undefined)
      body.price_capsule = toServerPrice(body.price_capsule);

    const { data } = await api.post("/retail-stocks", body, {
      headers: { "Content-Type": "application/json" },
    });
    return data?.data ?? data;
  } catch (error) {
    throw normErr(error, "Failed to create retail stock");
  }
};


export const getRetailStockById = async (id) => {
  try {
    const { data } = await api.get(`/retail-stocks/${id}`);
    return data?.data ?? data;
  } catch (error) {
    throw normErr(error, "Failed to fetch retail stock");
  }
};
export const updateRetailStock = async (id, payload) => {
  try {
    // PATCH is the right verb for partial updates
    const { data } = await api.patch(`/retail-stocks/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data?.data ?? data;
  } catch (error) {
    throw normErr(error, "Failed to update retail stock");
  }
};

const retailStockService = {
  getRetailStocks,
  getToretailProduct,
  createRetailStock,
  updateRetailStock,
  getRetailStockById,

};

export default retailStockService;
