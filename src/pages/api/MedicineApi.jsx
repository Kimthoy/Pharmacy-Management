import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/medicines"; // Laravel API endpoint

// Add Medicine
export const addMedicine = async (medicineData) => {
  try {
    const response = await axios.post(API_URL, medicineData);
    return response.data;
  } catch (error) {
    console.error("Error adding medicine:", error);
    throw error;
  }
};

// Get All Medicines
export const getAllMedicines = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching medicines:", error);
    throw error;
  }
};

// Get Medicine By ID
export const getMedicineById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching medicine:", error);
    throw error;
  }
};

// Update Medicine
export const updateMedicine = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating medicine:", error);
    throw error;
  }
};

// Delete Medicine
export const deleteMedicine = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting medicine:", error);
    throw error;
  }
};
