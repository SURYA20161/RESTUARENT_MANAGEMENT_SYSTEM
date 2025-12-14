import HomePage from "./Home";
import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import Contact from "./components/Contact";
import Monsoon from "./components/Monsoon";
import RequestResetPassword from "./components/home/RequestPasswordReset";
import ResetPasswordPage from "./components/home/ResetPasswordPage";
import About from "./components/About";
import TableBooking from "./components/TableBooking";
import VerifyEmail from "./components/VerifyEmail";
import Checkout from "./components/Checkout";
import ProductDetails from "./components/ProductDetails";
import Category from "./components/category/Category";
import OrderConfirmation from "./components/OrderConfirmation";
import ContactAkash from "./components/ContactAkash";
import Profile from "./components/akshita/Profile";
import UserProfile from "./components/UserProfile";
import UserOrders from "./components/UserOrders";
import UserTableBookings from "./components/UserTableBookings";
import Cart from "./components/Cart";
import QuickActions from "./components/QuickActions";
import Service from "./components/Service";
import Productss from "./components/akshita/Productss";
import toast from 'react-hot-toast';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('user');
    const oauth = urlParams.get('oauth');

    if (token && user && oauth === 'success') {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success('Logged in successfully with Google');

        // Clean up URL parameters
        const newUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.replaceState({}, document.title, newUrl);

        // Navigate based on user role (admin goes to admin dashboard, others to home page)
        if (userData.role === 'admin') {
          window.location.href = `http://localhost:5174/admin-dashboard?token=${token}`;
        } else {
          navigate("/");
          // Scroll to top of the page
          window.scrollTo(0, 0);
        }
      } catch (error) {
        console.error("Error parsing OAuth user data:", error);
        toast.error("Login failed. Please try again.");
      }
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />}/>
      <Route path="/request-reset" element={<RequestResetPassword />}/>
      <Route path="/Register" element={<Signup />}/>
      <Route path="/contact" element={<Contact />}/>
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/table-booking" element={<TableBooking />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/checkout/:userId" element={<Checkout />} />
      <Route path="/product/:productId" element={<ProductDetails />} />
      <Route path="/category" element={<Category />} />
      <Route path="/Order-Confirmation" element={<OrderConfirmation />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/profile-old" element={<Profile />} />
      <Route path="/orders" element={<UserOrders />} />
      <Route path="/user-table-bookings" element={<UserTableBookings />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/services" element={<Service />}/>
      <Route path="/products" element={<Productss />} />
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <AppContent />
      <QuickActions />
      <Toaster/>
    </>
  );
}
