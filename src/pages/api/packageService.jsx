import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchPackages = async () => {
  const res = await axios.get(`${API_URL}/packages`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const createPackage = async (data) => {
  const res = await axios.post(`${API_URL}/packages`, data, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.data;
};

export const updatePackage = async (id, data) => {
  const res = await axios.put(`${API_URL}/packages/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.data;
};

export const deletePackage = async (id) => {
  const res = await axios.delete(`${API_URL}/packages/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
