import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      if (!response.data.access_token) {
        throw new Error(t("login.noToken"));
      }

      const userData = {
        name: response.data.user.username || "User",
        email: response.data.user.email || email,
        profile_picture: "", // No profile_picture from backend, set empty string or default
        role: response.data.user.role || "Pharmacist",
        contact: response.data.user.phone || "", // Backend uses phone instead of contact
        join_date: response.data.user.created_at
          ? response.data.user.created_at.split(" ")[0]
          : new Date().toISOString().split("T")[0],
      };

      // Store token in localStorage and set in axios headers
      const token = response.data.access_token;
      localStorage.setItem("token", token); // Persist token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Save user data and token via AuthContext
      login(userData, token);

      // Redirect based on role
      const role = userData.role.toLowerCase();
      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "cashier") {
        navigate("/saledashboard");
      } else {
        setError(t("login.invalidRole"));
        return;
      }

      alert(t("login.success"));
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      setError(
        error.response?.data?.message === "Unauthenticated"
          ? t("login.invalidCredentials")
          : error.response?.data?.message ||
              error.message ||
              t("login.genericError")
      );
    }
  };

  // Dynamic time display
  const currentTime = new Date().toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Phnom_Penh",
  });
  const currentDate = new Date().toLocaleDateString("km-KH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-khmer">
      <div className="w-full max-w-md mt-4 p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {t("login.signIn")}
        </h2>
        <p className="text-center text-gray-600">
          or{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            {t("login.createAccount")}
          </Link>
        </p>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t("login.email")} *
            </label>
            <input
              type="email"
              id="email"
              required
              autoComplete="off"
              placeholder={t("login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {t("login.password")} *
            </label>
            <input
              type="password"
              id="password"
              required
              autoComplete="new-password"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-900"
              >
                {t("login.rememberMe")}
              </label>
            </div>
            <div className="text-sm">
              <button className="font-medium text-blue-600 hover:underline">
                {t("login.lostPassword")}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {t("login.signIn")}
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center">
          {t("login.currentTime", {
            time: currentTime,
            date: currentDate,
          })}
        </p>
      </div>

      <footer className="mt-8 w-full bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <FaPinterestP size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <FaYoutube size={20} />
              </a>
            </div>
            <div className="flex space-x-4 text-sm">
              <Link to="/" className="hover:underline">
                {t("footer.home")}
              </Link>
              <Link to="/about" className="hover:underline">
                {t("footer.about")}
              </Link>
              <Link to="/shop" className="hover:underline">
                {t("footer.shop")}
              </Link>
              <Link to="/contact" className="hover:underline">
                {t("footer.contact")}
              </Link>
            </div>
            <p className="text-sm">
              © 2025 Panharith Pharmacy. {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
