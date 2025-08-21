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
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create category" };
  }
};

export const getAllCategory = async () => {
  const res = await axios.get(`${API_URL}/category`, {
    headers: getAuthHeader(),
  });
  return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
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
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
