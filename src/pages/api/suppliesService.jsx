import axios from "axios";

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
    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create supplies" };
  }
};

export const getAllSupply = async () => {
  try {
    const response = await axios.get(`${API_URL}/supplies`, {
      headers: getAuthHeader(),
    });
    console.log("API response:", response.data);
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  } catch (error) {
    console.error(
      "Error fetching supplies:",
      error.response?.data || error.message
    );
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
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
};

export const deleteSupply = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/supplies/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data; 
  } catch (error) {
    console.error("Delete error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete supply" };
  }
};
 