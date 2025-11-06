import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import SellProduct from './pages/SellProduct';
import Contact from './pages/Contact'; // ✅ Contact import karein

// Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import SellerDashboard from './pages/seller/SellerDashboard';
import BuyerDashboard from './pages/buyer/BuyerDashboard';

// Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';

// Auth
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="min-h-screen">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/contact" element={<Contact />} /> {/* ✅ Contact route add karein */}

                    {/* Protected Routes */}
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />
                    <Route path="/my-orders" element={
                      <ProtectedRoute>
                        <MyOrders />
                      </ProtectedRoute>
                    } />
                    <Route path="/order/:id" element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/sell-product" element={
                      <ProtectedRoute>
                        <SellProduct />
                      </ProtectedRoute>
                    } />

                    {/* Seller Dashboard */}
                    <Route path="/seller/dashboard" element={
                      <ProtectedRoute requireSeller>
                        <SellerDashboard />
                      </ProtectedRoute>
                    } />

                    {/* Buyer Dashboard */}
                    <Route path="/buyer/dashboard" element={
                      <ProtectedRoute requireBuyer>
                        <BuyerDashboard />
                      </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/products" element={
                      <ProtectedRoute requireAdmin>
                        <AdminProducts />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/orders" element={
                      <ProtectedRoute requireAdmin>
                        <AdminOrders />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                      <ProtectedRoute requireAdmin>
                        <AdminUsers />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/products/add" element={
                      <ProtectedRoute requireAdmin>
                        <AddProduct />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/products/edit/:id" element={
                      <ProtectedRoute requireAdmin>
                        <EditProduct />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
                <Footer />
                <Toaster position="top-right" />
              </div>
            </Router>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;