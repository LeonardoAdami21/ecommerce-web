import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import About from "./pages/About";
import Cart from "./pages/Cart";
import NotFoundPage from "./pages/NotFoun";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Router>
        <Navbar />
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
