import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Helpers
 */
const appendIfPresent = (fd, key, value) => {
  if (value !== undefined && value !== null && value !== "") {
    fd.append(key, value);
  }
};

const appendUnitsArray = (fd, units = []) => {
  // Expect shape: [{ unit_id, strips_per_box?, tablets_per_box? }, ...]
  units.forEach((u, idx) => {
    fd.append(`units[${idx}][unit_id]`, String(u.unit_id));
    if (
      u.strips_per_box !== undefined &&
      u.strips_per_box !== null &&
      u.strips_per_box !== ""
    ) {
      fd.append(`units[${idx}][strips_per_box]`, String(u.strips_per_box));
    }
    if (
      u.tablets_per_box !== undefined &&
      u.tablets_per_box !== null &&
      u.tablets_per_box !== ""
    ) {
      fd.append(`units[${idx}][tablets_per_box]`, String(u.tablets_per_box));
    }
  });
};

/**
 * CREATE
 * - Caller must pass FormData or a plain object.
 * - If passing FormData, we post it directly.
 * - Your React AddMedicine already builds the correct FormData (including units[]).
 */
export const createMedicine = async (medicineData) => {
  try {
    const response = await axios.post(`${API_URL}/medicines`, medicineData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create medicine" };
  }
};

/**
 * LIST
 */
export const getAllMedicines = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_URL}/medicines`, {
      headers: getAuthHeader(),
      params: { page, perPage },
    });

    const rawData = response.data.data || [];

    const formatted = rawData.map((item) => ({
      ...item,
      name: item.medicine_name,
      price:
        item.price !== undefined && item.price !== null
          ? parseFloat(item.price)
          : null,
      image: item.image || "",
    }));

    return {
      data: formatted,
      meta: response.data.meta || {},
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch medicines" };
  }
};

/**
 * GET ONE
 */
export const getMedicineById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/medicines/${id}`, {
      headers: getAuthHeader(),
    });
    // Laravel Resource returns { data: {...} }
    return response.data.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch medicine"
    );
  }
};

/**
 * UPDATE
 * - Accept a POJO `data` with the same shape your backend expects:
 *   {
 *     medicine_name?, barcode?, price?, weight?, medicine_detail?, manufacturer?, origin?, purchase?, quantity?,
 *     category_ids?: number[],
 *     units?: [{ unit_id: number, strips_per_box?: number, tablets_per_box?: number }],
 *     imageFile?: File
 *   }
 * - We build FormData (supports file + arrays) and send as method override PUT.
 */
export const updateMedicine = async (id, data) => {
  try {
    const formData = new FormData();

    // Base fields (optional on update; backend uses sometimes|required)
    appendIfPresent(formData, "medicine_name", data.medicine_name);
    appendIfPresent(formData, "price", data.price);
    appendIfPresent(formData, "weight", data.weight);
    appendIfPresent(formData, "barcode", data.barcode);
    appendIfPresent(formData, "medicine_detail", data.medicine_detail);
    appendIfPresent(formData, "manufacturer", data.manufacturer);
    appendIfPresent(formData, "origin", data.origin);
    appendIfPresent(formData, "purchase", data.purchase);
    appendIfPresent(formData, "quantity", data.quantity);

    // Categories
    (data.category_ids ?? []).forEach((catId) => {
      formData.append("category_ids[]", catId);
    });

    // Units (UNIFIED payload with pivot fields)
    if (Array.isArray(data.units)) {
      appendUnitsArray(formData, data.units);
    } else if (Array.isArray(data.unit_ids)) {
      // Fallback: if someone still passes unit_ids only, convert to units[]
      data.unit_ids.forEach((uId, idx) => {
        formData.append(`units[${idx}][unit_id]`, String(uId));
      });
      // If you want to pass box fields here, supply data.strips_per_box/tablets_per_box too.
      if (data.strips_per_box !== undefined) {
        formData.append(
          `units[0][strips_per_box]`,
          String(data.strips_per_box)
        );
      }
      if (data.tablets_per_box !== undefined) {
        formData.append(
          `units[0][tablets_per_box]`,
          String(data.tablets_per_box)
        );
      }
    }

    // Image
    if (data.imageFile) {
      formData.append("image", data.imageFile);
    }

    // Using method override for PUT so PHP/Laravel handles files smoothly
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
    throw error.response?.data || { message: "Failed to update medicine" };
  }
};

/**
 * DELETE
 */
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
