import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Get authentication header with Bearer token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create a new medicine
export const createMedicine = async (medicineData) => {
  try {
    const response = await axios.post(`${API_URL}/medicines`, medicineData, {
      headers: getAuthHeader(),
    });
    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create medicine" };
  }
};

export const getAllMedicines = async () => {
  try {
    const response = await axios.get(`${API_URL}/medicines`, {
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
      "Error fetching medicines:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch medicines" };
  }
};

// Toggle medicine active status
export const toggleProductStatus = async (medicineId) => {
  try {
    const response = await axios.put(
      `${API_URL}/medicines/${medicineId}/toggle-status`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to toggle medicine status:", error);
    throw error.response?.data || { message: "Toggle failed" };
  }
};
