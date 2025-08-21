import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createUnit = async (unitData) => {
  try {
    const response = await axios.post(`${API_URL}/units`, unitData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create unit" };
  }
};

export const getAllUnits = async () => {
  const res = await axios.get(`${API_URL}/units`, { headers: getAuthHeader() });
  return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
};

export const updateUnit = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/units/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network error" };
  }
};

export const deleteUnit = async (id) => {
  try {
    const response = await fetch(`${API_URL}/units/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete unit");
    }

    return true;
  } catch (error) {
    throw new Error(
      error?.message || "An unexpected error occurred while deleting unit"
    );
  }
};
