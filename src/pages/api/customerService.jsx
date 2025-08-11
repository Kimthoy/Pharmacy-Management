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
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create customer" };
  }
};

export const getAllCustomer = async () => {
  try {
    const response = await axios.get(`${API_URL}/customers`, {
      headers: getAuthHeader(),
    });

    return Array.isArray(response.data)
      ? response.data
      : response.data.data || [];
  } catch (error) {
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

export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/customers/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    return false;
  }
};
