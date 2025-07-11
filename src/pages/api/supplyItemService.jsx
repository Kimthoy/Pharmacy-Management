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
    console.log("API response:", response.data);
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  } catch (error) {
    console.error(
      "Error fetching supply-items:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch supply-items" };
  }
};