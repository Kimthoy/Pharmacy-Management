import axios from "axios";

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
    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create suppliers" };
  }
};
export const getAllSupplier = async () => {
  try {
    const response = await axios.get(`${API_URL}/suppliers`, {
      headers: getAuthHeader(),
    });

    // Log the whole response to see its structure
    console.log("API response:", response.data);

    // If response.data contains `{ data: [...] }`
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  } catch (error) {
    console.error(
      "Error fetching suppliers:",
      error.response?.data || error.message
    );
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
    if (error.response?.data) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
};
export const deleteSupplier = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/suppliers/${id}`, {
      headers: getAuthHeader(),
    });

    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
};
 