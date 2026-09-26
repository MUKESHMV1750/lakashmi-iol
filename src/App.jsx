import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import OTPVerification from './pages/OTPVerification';
import ResetPassword from './pages/ResetPassword';

// Customer Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import ReturnRequest from './pages/ReturnRequest';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';

// Admin Pages
import AdminDashboard from './admin/Dashboard';
import AdminProducts from './admin/Products';
import AddProduct from './admin/AddProduct';
import EditProduct from './admin/EditProduct';
import AdminCategories from './admin/Categories';
import AdminOrders from './admin/Orders';
import AdminReturns from './admin/Returns';
import AdminCustomers from './admin/Customers';
import AdminCoupons from './admin/Coupons';
import BannerManagement from './admin/BannerManagement';
import AdminReviews from './admin/Reviews';
import AdminReports from './admin/Reports';
import AdminSettings from './admin/Settings';
import UserManagement from './admin/UserManagement';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Redux
import { loadUserFromStorage, getMe } from './redux/slices/authSlice';
import { loadCartFromStorage } from './redux/slices/cartSlice';
import { loadThemeFromStorage } from './redux/slices/themeSlice';

function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    console.log('Connecting to API URL:', import.meta.env.VITE_API_URL);
    dispatch(loadUserFromStorage());
    if (localStorage.getItem('token')) {
      dispatch(getMe());
    }
    dispatch(loadCartFromStorage());
    dispatch(loadThemeFromStorage());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderTracking />} />
          <Route path="/orders/:id/return" element={<ReturnRequest />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/returns" element={<AdminReturns />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/banners" element={<BannerManagement />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
