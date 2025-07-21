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

    const rawData = response.data.data || [];

    const formatted = rawData.map((item) => ({
      ...item,
      name: item.medicine_name,
      price: parseFloat(item.price), // ensure it's a number
      image: item.image || "", // fallback if missing
    }));

    return {
      data: formatted,
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

    console.log("Updating medicine:", data); // ✅ Debug payload

    // Always send fields, even empty
    formData.append("medicine_name", data.medicine_name ?? "");
    formData.append("price", data.price ?? "");
    formData.append("weight", data.weight ?? "");
    formData.append("barcode", data.barcode ?? "");
    formData.append("medicine_detail", data.medicine_detail ?? "");

    // Always send arrays
    (data.category_ids ?? []).forEach((catId) =>
      formData.append("category_ids[]", catId)
    );
    (data.unit_ids ?? []).forEach((unitId) =>
      formData.append("unit_ids[]", unitId)
    );

    if (data.imageFile) {
      formData.append("image", data.imageFile);
    }

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
