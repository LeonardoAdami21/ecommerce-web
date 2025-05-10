import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import Home from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import AccessDenied from "./pages/AccessDineded";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/products" element={<ProductList />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
