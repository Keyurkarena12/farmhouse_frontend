import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../store/slices/authSlice';
import { fetchUserBookings } from '../store/slices/bookingSlice';
import { FaHome, FaCalendarCheck, FaMapMarkerAlt, FaStar, FaClock, FaRupeeSign } from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { bookings } = useSelector((state) => state.booking);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingTrips: 0,
    completedStays: 0,
    totalSpent: 0
  });

  useEffect(() => {
    if (!user && !loading) {
      dispatch(getCurrentUser());
    }
    if (user) {
      dispatch(fetchUserBookings());
    }
  }, [dispatch, user, loading]);

  // Calculate stats from bookings
  useEffect(() => {
    if (bookings && bookings.length > 0) {
      const totalBookings = bookings.length;
      const upcomingTrips = bookings.filter(booking => 
        new Date(booking.checkIn) > new Date() && booking.status === 'confirmed'
      ).length;
      const completedStays = bookings.filter(booking => 
        booking.status === 'completed'
      ).length;
      const totalSpent = bookings
        .filter(booking => booking.status === 'completed')
        .reduce((sum, booking) => sum + (booking.pricing?.totalAmount || 0), 0);

      setStats({
        totalBookings,
        upcomingTrips,
        completedStays,
        totalSpent
      });
    }
  }, [bookings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Please log in to view your dashboard.
      </div>
    );
  }

  // Get upcoming trips for display
  const upcomingTrips = bookings?.filter(booking => 
    new Date(booking.checkIn) > new Date() && booking.status === 'confirmed'
  ).slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farmhouse Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Ready for your next farmhouse getaway?</p>
        </div>

        {/* Stats Cards - Farmhouse Focused */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Bookings */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FaHome className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Trips */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaCalendarCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Trips</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingTrips}</p>
              </div>
            </div>
          </div>

          {/* Completed Stays */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaStar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Stays</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedStays}</p>
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaRupeeSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Trips Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaCalendarCheck className="h-5 w-5 text-blue-600 mr-2" />
              Upcoming Farmhouse Trips
            </h2>
            {upcomingTrips.length > 0 ? (
              <div className="space-y-4">
                {upcomingTrips.map((booking) => (
                  <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.farmhouse?.name}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                          <span>{booking.farmhouse?.address?.city}</span>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <FaClock className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">₹{booking.pricing?.totalAmount?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{booking.pricing?.totalNights} nights</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCalendarCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming farmhouse trips</p>
                <p className="text-gray-400 text-sm mt-2">Book your next countryside escape!</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                <div className="flex items-center">
                  <FaHome className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Explore Farmhouses</p>
                    <p className="text-sm text-gray-500">Discover new countryside destinations</p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex items-center">
                  <FaCalendarCheck className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">My Bookings</p>
                    <p className="text-sm text-gray-500">View all your farmhouse reservations</p>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                <div className="flex items-center">
                  <FaStar className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Write Reviews</p>
                    <p className="text-sm text-gray-500">Share your farmhouse experiences</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity - Farmhouse Theme */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Farmhouse Travel Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Popular Destinations</h3>
              <p className="text-gray-600 text-sm">Explore trending farmhouse locations based on your travel history.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Seasonal Recommendations</h3>
              <p className="text-gray-600 text-sm">Get personalized farmhouse suggestions for the current season.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
