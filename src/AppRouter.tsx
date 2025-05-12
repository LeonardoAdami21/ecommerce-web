// AppRouter.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import PrivateRoute from "./context/PrivateRouter";
import AccessDenied from "./pages/AccessDineded";
import CheckoutPage from "./pages/ChekoutPage";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import OrderConfirmationPage from "./pages/OrderConfimationPage";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/RegisterPage";
import Cart from "./components/Cart";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminDashboard from "./components/Dashboard";
import EditProduct from "./components/EditProduct";

const AppRouter: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/products/:id" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/orders"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <CheckoutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                {" "}
                <OrderConfirmationPage />{" "}
              </PrivateRoute>
            }
          />
          <Route
            path="/products/admin/add-product"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminAddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/admin/edit/:id"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <EditProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="*" element={<PageNotFound />} />
          {/* Rotas privadas */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRouter;
