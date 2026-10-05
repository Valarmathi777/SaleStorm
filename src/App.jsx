import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ToastProvider } from './hooks/useToast';
import { InventoryProvider } from './hooks/useInventory';
import { CartProvider } from './hooks/useCart';
import { ReservationProvider } from './hooks/useReservation';
import { AuthProvider } from './hooks/useAuth';

import Navbar from './components/Navbar';
import ToastContainer from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import FlashSale from './pages/FlashSale';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import LiveSystem from './pages/LiveSystem';
import AdminDashboard from './pages/AdminDashboard';

import './styles/globals.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <InventoryProvider>
            <ReservationProvider>
              <CartProvider>
                <Navbar />
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />

                  {/* Protected (logged-in users) */}
                  <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/flash-sale" element={<ProtectedRoute><FlashSale /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                  <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="/order-tracking/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
                  <Route path="/live-system" element={<ProtectedRoute><LiveSystem /></ProtectedRoute>} />

                  {/* Admin only */}
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                </Routes>
                <ToastContainer />
              </CartProvider>
            </ReservationProvider>
          </InventoryProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
