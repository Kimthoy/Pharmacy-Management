import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createSale = async (saleData) => {
  try {
    const response = await axios.post(`${API_URL}/sales`, saleData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const serverError = error.response?.data;

    console.error("Error creating sale:", serverError || error.message);

    // Clean and descriptive error feedback
    throw {
      message:
        serverError?.error ||
        serverError?.message ||
        "Failed to create sale. Please try again.",
    };
  }
};
export const getAllSale = async () => {
  try {
    const response = await axios.get(`${API_URL}/sales`, {
      headers: getAuthHeader(), // likely returning { Authorization: 'Bearer ...' }
    });
    return response.data;
  } catch (error) {
    console.error("Fetch sales error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch sale" };
  }
};

