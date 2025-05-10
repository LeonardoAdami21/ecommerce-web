// AppRouter.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import ProductList from "./components/ProductList";
import AccessDenied from "./pages/AccessDineded";
import PageNotFound from "./pages/PageNotFound";

const AppRouter: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/products" element={<ProductList />} />
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
