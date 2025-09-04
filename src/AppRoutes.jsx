// AppRoutes.jsx
import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Auth pages (standalone)
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected layout and pages
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";

// Sale (standalone page)
import Sale from "./pages/sale/Sale";

// Optional simple Forbidden page (or replace with your own component)
const Forbidden = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="p-8 rounded-xl border">
      <h1 className="text-xl font-bold mb-2">403 - មិនមានសិទ្ធិ</h1>
      <p>អ្នកមិនមានសិទ្ធិចូលទំព័រនេះទេ។</p>
    </div>
  </div>
);

// Standalone layout to mirror your Login look/feel (no TopBar/Sidebar)
const StandaloneLayout = ({ children }) => (
  <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900">
    <div className="container mx-auto p-4 sm:p-8">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left brand panel (optional) */}
        <section className="hidden lg:flex relative items-center justify-center p-6">
          <div className="absolute inset-6 rounded-3xl bg-emerald-600/10 blur-[70px] pointer-events-none" />
          <div className="relative z-10 max-w-lg">
            <h1 className="text-4xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
              ហាងឱសថ បញ្ញារិទ្ធ
            </h1>
            <p className="mt-4 text-lg text-gray-700/80 dark:text-gray-300">
              ទំព័រលក់ឯករាជ្យ ស្អាត និងឆាប់រហ័ស។
            </p>
          </div>
        </section>

        {/* Right card with the page content */}
        <section className="flex items-center justify-center">
          <div className="w-full max-w-3xl rounded-3xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 p-6 sm:p-8">
            {children}
          </div>
        </section>
      </div>
    </div>
  </div>
);

// Your original protected layout (TopBar + Sidebar)
const ProtectedLayout = ({ children }) => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar />
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  </div>
);

// Small helpers
const AdminRoute = ({ isAuthenticated, role, children }) =>
  !isAuthenticated ? (
    <Navigate to="/login" replace />
  ) : role === "admin" ? (
    children
  ) : (
    <Navigate to="/403" replace />
  );

const CashierRoute = ({ isAuthenticated, role, children }) =>
  !isAuthenticated ? (
    <Navigate to="/login" replace />
  ) : role === "cashier" ? (
    children
  ) : (
    <Navigate to="/403" replace />
  );

const AppRoutes = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const role = user?.role;

  return (
    <Routes>
      {/* Auth (standalone) */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
      />

      {/* Default route: send to the right home by role */}
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : role === "cashier" ? (
            <Navigate to="/sale" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />

      {/* Cashier stand-alone SALE page */}
      <Route
        path="/sale"
        element={
          <CashierRoute isAuthenticated={!!isAuthenticated} role={role}>
            <StandaloneLayout>
              <Sale />
            </StandaloneLayout>
          </CashierRoute>
        }
      />

      {/* Admin dashboard (with app chrome) */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute isAuthenticated={!!isAuthenticated} role={role}>
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          </AdminRoute>
        }
      />

      <Route path="/403" element={<Forbidden />} />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
