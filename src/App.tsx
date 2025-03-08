import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NavBar from "./components/NavBar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./store/useUserStore";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";

const App: React.FC = () => {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>

        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/auth/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/auth/register"
            element={!user ? <RegisterPage /> : <Navigate to="/" />}
          />
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to="/auth/login" />}
          />

          <Route
            path="/secret-dashboard"
            element={
              user?.role === "admin" ? (
                <AdminPage />
              ) : (
                <Navigate to="/auth/login" />
              )
            }
          />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
