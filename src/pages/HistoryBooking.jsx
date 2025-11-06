// HistoryBooking.jsx - Updated version with admin support
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings, fetchAdminBookings, removeBooking } from '../store/slices/bookingSlice';
import { FaCalendar, FaUsers, FaHome, FaTrash, FaStar, FaCheckCircle, FaEye } from 'react-icons/fa';

const HistoryBooking = ({ adminView = false }) => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector(state => state.booking);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);

  useEffect(() => {
    if (adminView) {
      // Fetch all bookings for admin
      dispatch(fetchAdminBookings());
    } else {
      // Fetch only user's bookings for regular users
      dispatch(fetchUserBookings({ status: 'completed' }));
    }
  }, [dispatch, adminView]);

  // Filter bookings based on user type
  const completedBookings = adminView 
    ? bookings.filter(booking => booking.status === 'completed')
    : bookings.filter(booking => 
        booking.status === 'completed' && booking.hiddenFromUser !== true
      );

  const handleRemoveBooking = async (bookingId) => {
    try {
      await dispatch(removeBooking(bookingId)).unwrap();
      setShowDeleteConfirm(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Failed to remove booking:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">Error loading bookings: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {adminView ? 'All Completed Bookings' : 'Booking History'}
        </h1>
        <p className="text-gray-600 mt-2">
          {adminView ? 'All completed farmhouse stays across the platform' : 'Your completed farmhouse stays'}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <FaCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Completed Stays</p>
              <p className="text-2xl font-bold text-gray-900">{completedBookings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <FaCalendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Nights</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedBookings.reduce((total, booking) => total + (booking.pricing?.totalNights || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <FaUsers className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedBookings.reduce((total, booking) => total + (booking.guests?.adults || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg mr-4">
              <FaStar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Reviews Given</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedBookings.filter(booking => booking.review).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div className="bg-white rounded-lg shadow-sm">
        {completedBookings.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No completed bookings yet</p>
            <p className="text-gray-400 mt-2">
              {adminView ? 'No completed stays across the platform' : 'Your completed stays will appear here'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {completedBookings.map((booking) => (
              <div key={booking._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  {/* Farmhouse Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={booking.farmhouse?.images?.[0]?.url || '/api/placeholder/120/90'}
                      alt={booking.farmhouse?.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {booking.farmhouse?.name}
                          </h3>
                          <div className="flex items-center mt-1 space-x-4">
                            <span className="flex items-center text-sm text-gray-600">
                              <FaCalendar className="h-4 w-4 mr-1" />
                              {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                            </span>
                            <span className="flex items-center text-sm text-gray-600">
                              <FaUsers className="h-4 w-4 mr-1" />
                              {booking.guests?.adults || 0} adults
                              {booking.guests?.children ? `, ${booking.guests.children} children` : ''}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(booking.pricing?.totalAmount || 0)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.pricing?.totalNights || 0} night{booking.pricing?.totalNights !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Admin-only user info */}
                      {adminView && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Guest:</span>
                              <p>{booking.user?.name} ({booking.user?.email})</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Contact:</span>
                              <p>{booking.contactInfo?.phone || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Room Type and Booking Details */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium text-gray-700">Room Type:</span>
                          <p className="capitalize">{booking.room?.type || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Booking ID:</span>
                          <p className="font-mono text-xs">{booking._id}</p>
                        </div>
                        {!adminView && (
                          <div>
                            <span className="font-medium text-gray-700">Contact:</span>
                            <p>{booking.contactInfo?.phone || 'N/A'}</p>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">Completed:</span>
                          <p>{new Date(booking.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {booking.specialRequests && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-700 text-sm">Special Requests:</span>
                          <p className="text-sm text-gray-600 mt-1">{booking.specialRequests}</p>
                        </div>
                      )}

                      {/* Review Status */}
                      <div className="mt-3">
                        {booking.review ? (
                          <div className="flex items-center">
                            <FaStar className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-700">
                              Rated {booking.review.rating}/5
                            </span>
                            {booking.review.comment && (
                              <span className="text-sm text-gray-500 ml-2">
                                - "{booking.review.comment}"
                              </span>
                            )}
                          </div>
                        ) : (
                          !adminView && (
                            <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                              <FaStar className="h-4 w-4 mr-1" />
                              Add Review
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4 lg:w-32">
                    {/* View Details Button - Admin only */}
                    {adminView && (
                      <button
                        onClick={() => setViewDetails(booking)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        <FaEye className="h-3 w-3 mr-1" />
                        View Details
                      </button>
                    )}
                    
                    {/* Remove button - shows for both admin and users */}
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDeleteConfirm(true);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      <FaTrash className="h-3 w-3 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Remove Booking
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove this booking from your history? 
              This action cannot be undone.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-medium text-gray-900">{selectedBooking.farmhouse?.name}</p>
              <p className="text-sm text-gray-600">
                {formatDate(selectedBooking.checkIn)} - {formatDate(selectedBooking.checkOut)}
              </p>
              {adminView && (
                <p className="text-sm text-gray-600">
                  Guest: {selectedBooking.user?.name}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveBooking(selectedBooking._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Remove Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal - Admin only */}
      {viewDetails && adminView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setViewDetails(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Farmhouse Information</h4>
                  <p className="text-sm text-gray-600">{viewDetails.farmhouse?.name}</p>
                  <p className="text-sm text-gray-600">{viewDetails.farmhouse?.address?.city}, {viewDetails.farmhouse?.address?.state}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Guest Information</h4>
                  <p className="text-sm text-gray-600">{viewDetails.user?.name}</p>
                  <p className="text-sm text-gray-600">{viewDetails.user?.email}</p>
                  <p className="text-sm text-gray-600">{viewDetails.contactInfo?.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Booking Details</h4>
                  <p className="text-sm text-gray-600">Dates: {formatDate(viewDetails.checkIn)} - {formatDate(viewDetails.checkOut)}</p>
                  <p className="text-sm text-gray-600">Nights: {viewDetails.pricing?.totalNights}</p>
                  <p className="text-sm text-gray-600">Room: {viewDetails.room?.type}</p>
                  <p className="text-sm text-gray-600">Guests: {viewDetails.guests?.adults} adults, {viewDetails.guests?.children || 0} children</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Payment Information</h4>
                  <p className="text-sm text-gray-600">Total: {formatCurrency(viewDetails.pricing?.totalAmount || 0)}</p>
                  <p className="text-sm text-gray-600">Status: {viewDetails.payment?.status || 'N/A'}</p>
                </div>
              </div>

              {viewDetails.specialRequests && (
                <div>
                  <h4 className="font-medium text-gray-700">Special Requests</h4>
                  <p className="text-sm text-gray-600">{viewDetails.specialRequests}</p>
                </div>
              )}

              {viewDetails.review && (
                <div>
                  <h4 className="font-medium text-gray-700">Guest Review</h4>
                  <div className="flex items-center">
                    <FaStar className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-700">{viewDetails.review.rating}/5</span>
                  </div>
                  {viewDetails.review.comment && (
                    <p className="text-sm text-gray-600 mt-1">"{viewDetails.review.comment}"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryBooking;