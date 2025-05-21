import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { useNavigate, Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";

// Static data for testing
const mockUsers = [
  {
    email: "admin@example.com",
    password: "admin123",
    user: {
      name: "Admin User",
      email: "admin@example.com",
      profile_picture: "https://example.com/admin.jpg",
      role: "admin",
      contact: "+1234567890",
      join_date: "2024-01-01",
    },
    token: "mock-admin-token-123",
  },
  {
    email: "cashier@example.com",
    password: "cashier123",
    user: {
      name: "Cashier User",
      email: "cashier@example.com",
      profile_picture: "./user-1.jpg",
      role: "cashier",
      contact: "+0987654321",
      join_date: "2024-02-01",
    },
    token: "mock-cashier-token-456",
  },
];

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
      // Simulate API call with static data
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        const response = {
          data: {
            token: user.token,
            user: user.user,
          },
        };

        if (response.data.token) {
          const userData = {
            name: response.data.user?.name || "User",
            email: response.data.user?.email || email,
            profile_picture: response.data.user?.profile_picture || "",
            role: response.data.user?.role || "Pharmacist",
            contact: response.data.user?.contact || "",
            join_date:
              response.data.user?.join_date ||
              new Date().toISOString().split("T")[0],
          };
          login(userData, response.data.token);

          if (userData.role.toLowerCase() === "admin") {
            navigate("/dashboard");
          } else if (userData.role.toLowerCase() === "cashier") {
            navigate("/saledashboard");
          } else {
            setError(t("login.invalidRole"));
            return;
          }

          alert(t("login.success"));
        } else {
          throw new Error(t("login.noToken"));
        }
      } else {
        throw new Error(t("login.invalidCredentials"));
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      setError(error.message || t("login.invalidCredentials"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-khmer">
      {/* Login Form */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
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
              <a href="#" className="font-medium text-blue-600 hover:underline">
                {t("login.lostPassword")}
              </a>
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
          ពេលវេលា: 07:14 PM +07, ថ្ងៃចន្ទ, 19 ឧសភា 2025
        </p>
      </div>

      {/* Footer */}
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
              <a href="#" className="hover:underline">
                {t("footer.home")}
              </a>
              <a href="#" className="hover:underline">
                {t("footer.about")}
              </a>
              <a href="#" className="hover:underline">
                {t("footer.shop")}
              </a>
              <a href="#" className="hover:underline">
                {t("footer.contact")}
              </a>
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
