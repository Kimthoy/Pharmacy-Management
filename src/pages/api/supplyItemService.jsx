import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllSupplyItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/supply-items`, {
      headers: getAuthHeader(),
    });

    console.log("✅ API response:", response.data);

    // ✅ Safely handle API response
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (Array.isArray(response.data?.data)) {
      return response.data.data;
    }

    console.warn("⚠️ Unexpected API format:", response.data);
    return []; // Return empty array if format is unexpected
  } catch (error) {
    console.error(
      "❌ Error fetching supply-items:",
      error.response?.data || error.message
    );

    // ✅ Always throw an Error (not plain object)
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch supply-items";
    throw new Error(errorMessage);
  }
};
export const getExpiringSoonItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/supply-items/expiring-soon`, {
      headers: getAuthHeader(),
    });

    // ✅ Normalize response: if it's wrapped in { data: [...] }
    const items = Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];

    console.log("✅ Expiring soon items:", items);
    return items;
  } catch (error) {
    console.error(
      "❌ Error fetching expiring soon items:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data || { message: "Failed to fetch expiring soon items" }
    );
  }
};

