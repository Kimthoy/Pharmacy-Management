import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getSession = async () => {
  try {
    const response = await axios.get(`${API_URL}/login-sessions`, {
      headers: getAuthHeader(),
    });

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch login sessions";
  }
};
