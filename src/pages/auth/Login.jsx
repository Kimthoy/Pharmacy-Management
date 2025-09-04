import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const weekdays = [
  "អាទិត្យ",
  "ចន្ទ",
  "អង្គារ",
  "ពុធ",
  "ព្រហស្បតិ៍",
  "សុក្រ",
  "សៅរ៍",
];

const months = [
  "មករា",
  "កុម្ភៈ",
  "មីនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆិកា",
  "ធ្នូ",
];

function getKhmerDateString(now) {
  const weekday = weekdays[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `ថ្ងៃ​ ${weekday} ទី ${day} ខែ ${month} ឆ្នាំ ${year}`;
}

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const timeString = now.toLocaleTimeString("km-KH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Phnom_Penh",
      });

      setCurrentTime(timeString);
      setCurrentDate(getKhmerDateString(now));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const API_BASE =
    (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
    "http://localhost:8000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data } = await axios.post(`${API_BASE}/api/login`, {
        email,
        password,
      });

      if (!data?.access_token) {
        throw new Error("មិនអាចចូលបានទេ!");
      }

      const userData = {
        name: data.user?.username || "អ្នកប្រើប្រាស់",
        email: data.user?.email || email,
        profile_picture: "",
        role: data.user?.role || "Pharmacist",
        contact: data.user?.phone || "",
        join_date: data.user?.created_at
          ? String(data.user.created_at).split(" ")[0]
          : new Date().toISOString().split("T")[0],
      };

      const token = data.access_token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const keep = rememberMe ? localStorage : sessionStorage;
      const clear = rememberMe ? sessionStorage : localStorage;
      keep.setItem("token", token);
      keep.setItem("user", JSON.stringify(userData));
      clear.removeItem("token");
      clear.removeItem("user");

      // Save to context
      login(userData, token, rememberMe);

      toast.success("ចូលបាន ដោយជោគជ័យ!");

      // ✅ Navigate based on role
      if (userData.role === "cashier") {
        navigate("/saledashboard");
      } else if (userData.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message === "Unauthenticated"
          ? "អុីម៉ែល ឬ ពាក្យសម្ងាត់ មិនត្រឹមត្រូវ"
          : err.response?.data?.message ||
            err.message ||
            "មានបញ្ហាក្នុងការចូល។";

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* ផ្នែកខាងឆ្វេង */}
      <section className="hidden lg:flex relative items-center justify-center p-10">
        <div className="absolute inset-6 rounded-3xl bg-emerald-600/10 blur-[70px] pointer-events-none" />
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
            ហាងឱសថ បញ្ញារិទ្ធ
          </h1>
          <p className="mt-4 text-lg text-gray-700/80 dark:text-gray-300">
            គ្រប់គ្រងស្តុក ការលក់ និងហិរញ្ញវត្ថុ ក្នុងផ្ទាំងតែមួយ។
          </p>

          <div className="mt-8 rounded-2xl border border-emerald-200/60 dark:border-emerald-700/40 p-5 bg-white/70 dark:bg-gray-900/40 backdrop-blur">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ពេលវេលា: {currentTime} — {currentDate}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4 text-gray-600 dark:text-gray-300">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaPinterestP size={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube size={18} />
            </a>
          </div>

          <p className="mt-10 text-xs text-gray-500 dark:text-gray-400">
            © 2025 ហាងឱសថ បញ្ញារិទ្ធ។ រក្សាសិទ្ធិគ្រប់យ៉ាង។
          </p>
        </div>
      </section>

      {/* ផ្នែកខាងស្តាំ */}
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md rounded-3xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 p-8 sm:p-10">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              ចូលប្រព័ន្ធ
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              សូមបំពេញ អុីម៉ែល និង ពាក្យសម្ងាត់ ដើម្បីចូលប្រើ។
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                អុីម៉ែល *
              </label>
              <input
                type="email"
                id="email"
                autoComplete="username"
                required
                placeholder="បញ្ចូលអុីម៉ែល"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                ពាក្យសម្ងាត់ *
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  required
                  placeholder="បញ្ចូលពាក្យសម្ងាត់"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) => setCapsOn(e.getModifierState("CapsLock"))}
                  className="w-full rounded-xl border px-3 py-2 pr-10 focus:ring-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {capsOn && (
                <p className="mt-1 text-xs text-amber-600">
                  Caps Lock កំពុងដំណើរការ
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-emerald-600"
                />
                <span className="text-sm">ចងចាំខ្ញុំ</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 disabled:opacity-70"
            >
              {isSubmitting && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              ចូលប្រព័ន្ធ
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500 lg:hidden">
            © 2025 ហាងឱសថ បញ្ញារិទ្ធ។ រក្សាសិទ្ធិគ្រប់យ៉ាង។
          </p>
        </div>
      </section>
    </div>
  );
};

export default Login;
