import axios from "axios";
import { toast } from "react-toastify";

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
    return response.data;
  } catch (error) {
    toast.error("Failed to create stock");
    throw error.response?.data || { message: "Failed to create stock" };
  }
};

export const getAllStocks = async () => {
  try {
    const response = await axios.get(`${API_URL}/stocks`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch stocks");
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
    toast.error("Failed to update stock");
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
    toast.error("Failed to delete stock");
    throw error.response?.data || { message: "Failed to delete stock" };
  }
};
