import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
export const createCustomer = async (customer) => {
  try {
    const response = await axios.post(`${API_URL}/customers/create`, customer, {
      headers: getAuthHeader(),
    });
    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create medicine" };
  }
};
export const getAllCustomer = async () => {
  try {
    const response = await axios.get(`${API_URL}/customers`, {
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
    throw error.response?.data || { message: "Failed to fetch customer" };
  }
};
export const updateCustomer = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/customers/${id}`, data, {
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
export const deleteCustomer = async (id, t) => {
  try {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.message || "Failed to delete");
      return false;
    }

    alert(t("customerlist.DeletedSuccess"));
    return true;
  } catch (error) {
    console.error("Delete error:", error);
    alert("An error occurred");
    return false;
  }
};
