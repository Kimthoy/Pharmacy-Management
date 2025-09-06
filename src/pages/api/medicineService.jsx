import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ------------------------------ helpers ------------------------------ */
const appendIfPresent = (fd, key, value) => {
  if (value !== undefined && value !== null && value !== "") {
    fd.append(key, value);
  }
};

/* ------------------------------ CREATE ------------------------------- */
export const createMedicine = async (medicineData) => {
  try {
    const res = await axios.post(`${API_URL}/medicines`, medicineData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to create medicine";
    throw new Error(errMsg);
  }
};

/* -------------------------------- LIST ------------------------------- */
export const getAllMedicines = async (page = 1, perPage = 10) => {
  try {
    const res = await axios.get(`${API_URL}/medicines`, {
      headers: getAuthHeader(),
      params: { page, perPage },
    });

    const raw = res.data.data || [];
    const formatted = raw.map((item) => ({
      ...item,
      name: item.medicine_name,
      price:
        item.price !== undefined && item.price !== null
          ? parseFloat(item.price)
          : null,
      image: item.image || "",
    }));

    return { data: formatted, meta: res.data.meta || {} };
  } catch (error) {
    console.error(
      "getAllMedicines error:",
      error.response?.data || error.message
    );
    const errMsg = error.response?.data?.message || "Failed to fetch medicines";
    throw new Error(errMsg);
  }
};

/* ------------------------------- GET ONE ----------------------------- */
export const getMedicineById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/medicines/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data.data;
  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch medicine";
    throw new Error(errMsg);
  }
};

/* ------------------------------ UPDATE ------------------------------- */
export const updateMedicine = async (id, data) => {
  try {
    const fd = new FormData();

    appendIfPresent(fd, "medicine_name", data.medicine_name);
    appendIfPresent(fd, "price", data.price);
    appendIfPresent(fd, "weight", data.weight);
    appendIfPresent(fd, "barcode", data.barcode);
    appendIfPresent(fd, "medicine_detail", data.medicine_detail);
    appendIfPresent(fd, "quantity", data.quantity);

    (data.category_ids ?? []).forEach((catId) => {
      fd.append("category_ids[]", catId);
    });

    (data.unit_ids ?? []).forEach((uId) => {
      fd.append("unit_ids[]", String(uId));
    });

    if (data.imageFile) {
      fd.append("image", data.imageFile);
    }

    const res = await axios.post(`${API_URL}/medicines/${id}?_method=PUT`, fd, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to update medicine";
    throw new Error(errMsg);
  }
};

/* ------------------------------- DELETE ------------------------------ */
export const deleteMedicine = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/medicines/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || "Network error";
    throw new Error(errMsg);
  }
};
