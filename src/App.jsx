import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Farmhouses from './pages/Farmhouses';
import FarmhouseDetail from './pages/FarmhouseDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import ProtectedRoute, { OwnerProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminProtectedRoute } from './components/auth/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminFarmhouses from './pages/admin/AdminFarmhouses';
import './App.css';
import OwnerFarmhouses from './pages/owner/ownerFarmhouses';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import { useEffect } from 'react';
import { getCurrentUser } from './store/slices/authSlice';
import OwnerBookings from './pages/owner/OwnerBookings';
import OwnerReviews from './pages/owner/OwnerReviews';

const queryClient = new QueryClient();

// ✅ Separate component banao jo auth check kare
function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // ✅ Page refresh par user data fetch karo
    dispatch(getCurrentUser());
  }, [dispatch]);



  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          {/* ✅ Single Routes component - sab routes ek jagah */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/farmhouses" element={<Farmhouses />} />
            <Route path="/farmhouse/:id" element={<FarmhouseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Owner Routes */}
            <Route path="/owner/dashboard" element={
              <OwnerProtectedRoute>
                <OwnerDashboard />
              </OwnerProtectedRoute>
            } />
            <Route path="/owner/farmhouses" element={
              <OwnerProtectedRoute>
                <OwnerFarmhouses />
              </OwnerProtectedRoute>
            } />
            <Route path="/owner/bookings" element={
              <OwnerProtectedRoute>
                <OwnerBookings />
              </OwnerProtectedRoute>
            } />

            <Route path="/owner/reviews" element={
              <OwnerProtectedRoute>
                <OwnerReviews />
              </OwnerProtectedRoute>
            } />


            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <AdminProtectedRoute>
                <AdminUsers />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/farmhouses" element={
              <AdminProtectedRoute>
                <AdminFarmhouses />
              </AdminProtectedRoute>
            } />

            {/* Fallback Route */}
            <Route path="*" element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                  <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                  <a
                    href="/"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;