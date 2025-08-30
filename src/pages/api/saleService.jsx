import axios from "axios";

// Make sure API_URL always ends with /api
let API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
if (!API_URL.endsWith("/api")) {
  API_URL = API_URL.replace(/\/+$/, "") + "/api";
}

// Helper to attach token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
const parseAxiosError = (error, fallback = "Request failed") => {
  if (!error?.response)
    return { message: "Network error. Please check API server." };

  const { status, data } = error.response;
  // validation errors
  if (data?.errors && typeof data.errors === "object") {
    const flat = Object.values(data.errors).flat().join(" ");
    return { status, message: flat || data.message || fallback };
  }

  return {
    status,
    message:
      data?.error || data?.message || `${fallback} with status ${status}`,
  };
};
export const buildSalePayload = ({
  saleDate = new Date().toISOString().slice(0, 10),
  paymentMethod = "cash",
  items = [], // normal medicines
  saleRetailItems = [], // packages
  extra = {},
} = {}) => {

  const payload = {
    sale_date: saleDate,
    payment_method: paymentMethod,
    ...(items?.length ? { items } : {}),
    ...(saleRetailItems?.length ? { sale_retail_items: saleRetailItems } : {}),
    ...extra,
  };
  return payload;
};
export const createSale = async (saleData) => {
  try {
    const { data } = await axios.post(`${API_URL}/sales`, saleData, {
      headers: {
        ...getAuthHeader(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    throw parseAxiosError(error, "Sale request");
  }
};
export const getAllSale = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/sales`, {
      headers: getAuthHeader(),
    });

    // Laravel Resource collections usually wrap the array in { data: [...] }
    const rows = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : [];

    // Normalize field names so your UI has consistent keys
    return rows.map((s) => ({
      id: s.id,
      sale_date: s.sale_date ?? s.saleDate ?? null,
      payment_method: s.payment_method ?? s.paymentMethod ?? null,
      total_amount: Number(s.total_amount ?? s.totalAmount ?? 0),
      user: s.user ?? null,

      // items from relationships (support snakeCase, camelCase, or a flat "items")
      sale_items: s.sale_items ?? s.saleItems ?? s.items ?? [],
      sale_retail_items: s.sale_retail_items ?? s.saleRetailItems ?? [],
    }));
  } catch (error) {
    if (error?.response) {
      const { status, data } = error.response;
      const msg =
        (data?.errors && Object.values(data.errors).flat().join(" ")) ||
        data?.message ||
        `Request failed with status ${status}`;
      throw { status, message: msg };
    }
    throw { message: "Network error. Please check API server." };
  }
};