import axios from "axios";
const token = localStorage.getItem("token");
export const login = async (email, password) => {
  const res = await axios.post("/api/login", { email, password });
  const token = res.data.token;
  localStorage.setItem("token", token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return res.data;
};

export const logout = async () => {
  await axios.post("/api/logout");
  localStorage.removeItem("token");
  delete axios.defaults.headers.common["Authorization"];
};
