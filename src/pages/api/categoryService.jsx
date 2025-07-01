import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_URL}/category`, categoryData, {
      headers: getAuthHeader(),
    });
    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create category" };
  }
};
export const getAllCategory = async () => {
  try {
    const response = await axios.get(`${API_URL}/category`, {
      headers: getAuthHeader(),
    });
    console.log("API response:", response.data);
    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  } catch (error) {
    console.error(
      "Error fetching category:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch category" };
  }
};
export const updateCategory = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/category/${id}`, data, {
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

export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${API_URL}/category/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(), // Add this if needed
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

