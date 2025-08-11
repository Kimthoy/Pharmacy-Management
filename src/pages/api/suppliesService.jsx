import axios from "axios";
import { toast } from "react-toastify"; 

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createSupply = async (suppliesData) => {
  try {
    const response = await axios.post(`${API_URL}/supplies`, suppliesData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    toast.error("Failed to create supplies");
    throw error.response?.data || { message: "Failed to create supplies" };
  }
};

export const getAllSupply = async () => {
  try {
    const response = await axios.get(`${API_URL}/supplies`, {
      headers: getAuthHeader(),
    });
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  } catch (error) {
    toast.error("Failed to fetch supplies");
    throw error.response?.data || { message: "Failed to fetch supplies" };
  }
};

export const updateSupply = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/supplies/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    toast.error("Failed to update supply");
    throw error.response?.data || { message: "Failed to update supply" };
  }
};

export const deleteSupply = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/supplies/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    toast.error("Failed to delete supply");
    throw error.response?.data || { message: "Failed to delete supply" };
  }
};
