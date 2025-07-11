import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createStock = async (stockData) => {
  try {
    const response = await axios.post(`${API_URL}/stocks`, stockData, {
      headers: getAuthHeader(),
    });
    console.log("Stock created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Create stock error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create stock" };
  }
};

export const getAllStocks = async () => {
  try {
    const response = await axios.get(`${API_URL}/stocks`, {
      headers: getAuthHeader(),
    });
    return response.data; // return full response.data object
  } catch (error) {
    console.error("Fetch stocks error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch stocks" };
  }
};

export const updateStock = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/stocks/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Update stock error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update stock" };
  }
};

export const deleteStock = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/stocks/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Delete stock error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete stock" };
  }
};
