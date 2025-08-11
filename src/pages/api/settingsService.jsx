import axios from "axios";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllSettings = async () => {
  try {
    const response = await axios.post(`${API_URL}/backup/run`, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const serverError = error.response?.data;
    throw {
      message:
        serverError?.error ||
        serverError?.message ||
        "Failed to fetch settings. Please try again.",
    };
  }
};

export const updateSetting = async (key, value) => {
  return axios.put(
    `${API_URL}/settings/${key}`,
    { value },
    { headers: getAuthHeader() }
  );
};

export const runBackup = async () => {
  const res = await axios.post(
    `${API_URL}/backup/run`,
    {},
    {
      headers: getAuthHeader(),
    }
  );
  return res.data;
};

export const getBackupList = async () => {
  const res = await axios.get(`${API_URL}/backups`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getAuditLogs = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({ page, ...filters }).toString();
  const response = await axios.get(`${API_URL}/audit-logs?${params}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const clearAuditLogs = async () => {
  const res = await axios.delete(`${API_URL}/audit-logs/clear`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const downloadBackup = async (fileName) => {
  try {
    const response = await fetch(`${API_URL}/backup/download/${fileName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download backup");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    toast.error("Download failed. Please try again.");
  }
};
