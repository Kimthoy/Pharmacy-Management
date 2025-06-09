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
import { mockUsers } from "../../data/mockData"; // Import shared data

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
      
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error(t("login.invalidCredentials"));
      }

     
      if (user.status === "Inactive") {
        throw new Error(t("login.inactiveAccount"));
      }

    
      const response = {
        data: {
          token: user.token,
          user: {
            name: user.name,
            email: user.email,
            profile_picture: user.profile_picture,
            role: user.role,
            contact: user.contact,
            join_date: user.join_date,
          },
        },
      };

      if (response.data.token) {
        const userData = {
          name: response.data.user.name || "User",
          email: response.data.user.email || email,
          profile_picture: response.data.user.profile_picture || "",
          role: response.data.user.role || "Pharmacist",
          contact: response.data.user.contact || "",
          join_date:
            response.data.user.join_date ||
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
    } catch (error) {
      console.error("Login failed:", error.message);
      setError(error.message || t("login.invalidCredentials"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100  flex flex-col items-center justify-center font-khmer">
    
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
              <button  className="font-medium text-blue-600 hover:underline">
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
          ពេលវេលា: 04:34 PM +07, ថ្ងៃពុធ, 21 ឧសភា 2025
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
              <button href="#" className="hover:underline">
                {t("footer.home")}
              </button>
              <button href="#" className="hover:underline">
                {t("footer.about")}
              </button>
              <button href="#" className="hover:underline">
                {t("footer.shop")}
              </button>
              <button href="#" className="hover:underline">
                {t("footer.contact")}
              </button>
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
