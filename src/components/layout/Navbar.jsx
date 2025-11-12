import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaCalendarAlt, FaChartBar, FaUserShield, FaBuilding } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsProfileOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Function to get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return { path: '/admin/dashboard', label: 'Admin Dashboard', icon: FaUserShield };
      case 'owner':
        return { path: '/owner/dashboard', label: 'Owner Dashboard', icon: FaBuilding };
      case 'user':
      default:
        return { path: '/dashboard', label: 'Dashboard', icon: FaChartBar };
    }
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaHome className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-800">FarmhouseBooking</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link to="/farmhouses" className="text-gray-700 hover:text-green-600 transition-colors">
              Farmhouses
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/bookings" className="text-gray-700 hover:text-green-600 transition-colors">
                  My Bookings
                </Link>
                {dashboardLink && (
                  <Link
                    to={dashboardLink.path}
                    className="text-gray-700 hover:text-green-600 transition-colors flex items-center space-x-1"
                  >
                    <dashboardLink.icon className="h-4 w-4" />
                    <span>{dashboardLink.label}</span>
                  </Link>
                )}
                {/* Additional role-specific links */}
                {/* {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-green-600 transition-colors">
                    Admin Panel
                  </Link>
                )} */}
                {user?.role === 'owner' && (
                  <Link to="/owner/farmhouses" className="text-gray-700 hover:text-green-600 transition-colors">
                    My Farmhouses
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
               

                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "Profile"}
                      className="h-8 w-8 rounded-full object-cover border border-green-600"
                    />
                  ) : (
                    <FaUser className="h-5 w-5 text-gray-600" />
                  )}

                  <span>{user?.name}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {user?.role}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    {dashboardLink && (
                      <Link
                        to={dashboardLink.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {dashboardLink.label}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/farmhouses"
                className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Farmhouses
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/bookings"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  {dashboardLink && (
                    <Link
                      to={dashboardLink.path}
                      className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {dashboardLink.label}
                    </Link>
                  )}
                  {/* Additional role-specific links for mobile */}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  {user?.role === 'owner' && (
                    <Link
                      to="/owner/farmhouses"
                      className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Farmhouses
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Role: <span className="capitalize">{user?.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;