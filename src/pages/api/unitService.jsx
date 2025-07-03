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
    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create unit" };
  }
};

export const getAllUnits = async () => {
  try {
    const response = await axios.get(`${API_URL}/units`, {
      headers: getAuthHeader(),
    });
    console.log("API response:", response.data);
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  } catch (error) {
    console.error(
      "Error fetching units:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch units" };
  }
};

export const updateUnit = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/units/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
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
      alert(data.message || "Failed to delete");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Delete error:", error);
    alert("An error occurred");
    return false;
  }
};
