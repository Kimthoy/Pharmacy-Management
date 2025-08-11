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

    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;

    return [];
  } catch (error) {
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

    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch expiring soon items";
    throw new Error(errorMessage);
  }
};
