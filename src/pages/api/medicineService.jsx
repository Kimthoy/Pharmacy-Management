import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createMedicine = async (medicineData) => {
  try {
    const response = await axios.post(`${API_URL}/medicines`, medicineData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create medicine" };
  }
};

export const getAllMedicines = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_URL}/medicines`, {
      headers: getAuthHeader(),
      params: {
        page,
        perPage,
      },
    });

    // Log the entire structure to debug if needed
    console.log("API response:", response.data);

    return {
      data: response.data.data || [],
      meta: response.data.meta || {},
    };
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
export const updateMedicine = async (id, data) => {
  try {
    const formData = new FormData();

    // Append simple fields
    if (data.medicine_name)
      formData.append("medicine_name", data.medicine_name);
    if (data.price) formData.append("price", data.price);
    if (data.weight) formData.append("weight", data.weight);
    if (data.barcode) formData.append("barcode", data.barcode);
    if (data.status) formData.append("status", data.status);
    if (data.medicine_detail)
      formData.append("medicine_detail", data.medicine_detail);

    // ✅ Append category_ids[]
    if (Array.isArray(data.category_ids)) {
      data.category_ids.forEach((id) => formData.append("category_ids[]", id));
    }

    if (Array.isArray(data.unit_ids)) {
      data.unit_ids.forEach((id) => formData.append("unit_ids[]", id));
    }

    // ✅ Append image file
    if (data.imageFile) {
      formData.append("image", data.imageFile);
    }

    // Send with _method override for PUT
    const response = await axios.post(
      `${API_URL}/medicines/${id}?_method=PUT`,
      formData,
      {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Update failed:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update medicine" };
  }
};


export const deleteMedicine = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/medicines/${id}`, {
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
