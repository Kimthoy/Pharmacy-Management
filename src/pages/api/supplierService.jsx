import axios from "axios";
import { toast } from "react-toastify"; 

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createSupplier = async (supplier) => {
  try {
    const response = await axios.post(`${API_URL}/suppliers`, supplier, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    toast.error("Failed to create supplier");
    throw error.response?.data || { message: "Failed to create supplier" };
  }
};

export const getAllSupplier = async () => {
  try {
    const response = await axios.get(`${API_URL}/suppliers`, {
      headers: getAuthHeader(),
    });

    const result = response.data;

    if (Array.isArray(result)) return result;
    if (Array.isArray(result.data)) return result.data;

    return [];
  } catch (error) {
    toast.error("Failed to fetch suppliers");
    throw error.response?.data || { message: "Failed to fetch suppliers" };
  }
};

export const updateSupplier = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/suppliers/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    toast.error("Failed to update supplier");
    throw error.response?.data || { message: "Failed to update supplier" };
  }
};

export const deleteSupplier = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/suppliers/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    toast.error("Failed to delete supplier");
    return false;
  }
};
