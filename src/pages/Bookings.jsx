import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings, removeBooking } from '../store/slices/bookingSlice';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle, FaTrash } from 'react-icons/fa';

const Bookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector(state => state.booking);
  const [retryCount, setRetryCount] = useState(0);
  const [removingBookingId, setRemovingBookingId] = useState(null);

  useEffect(() => {
    console.log('Bookings component mounted, fetching bookings...');
    dispatch(fetchUserBookings());
  }, [dispatch, retryCount]);

  const handleRetry = () => {
    console.log('Retrying to fetch bookings...');
    setRetryCount(prev => prev + 1);
  };

  // CORRECT: Allow removal for completed, rejected, or cancelled
  const canRemove = (booking) => ['completed', 'rejected', 'cancelled'].includes(booking.status);



  const handleRemoveBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to remove this booking from your list?')) {
      return;
    }

    setRemovingBookingId(bookingId);
    try {
      console.log('Removing booking:', bookingId);
      const result = await dispatch(removeBooking(bookingId)).unwrap();
      console.log('Remove booking result:', result);

      // REFRESH LIST AFTER REMOVAL
      dispatch(fetchUserBookings());

      alert('Booking removed successfully!');
    } catch (error) {
      console.error('Failed to remove booking:', error); 
      alert(`Failed to remove booking: ${error.message || 'Please try again.'}`);
    } finally {
      setRemovingBookingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FaCheckCircle className="h-4 w-4" />;
      case 'cancelled':
      case 'rejected':
        return <FaTimesCircle className="h-4 w-4" />;
      default:
        return <FaClock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getCancellationInfo = (booking) => {
    if (!booking.cancellation) return null;

    const cancelledBy = booking.cancellation.cancelledBy;
    const reason = booking.cancellation.reason;
    const refundAmount = booking.cancellation.refundAmount;

    let actionText = '';
    let refundText = '';

    if (cancelledBy === 'owner') {
      if (booking.status === 'rejected') {
        actionText = 'This booking was rejected by the farmhouse owner';
      } else {
        actionText = 'This booking was cancelled by the farmhouse owner';
      }
    } else if (cancelledBy === 'user') {
      actionText = 'You cancelled this booking';
    }

    if (refundAmount > 0) {
      refundText = `Refund amount: ₹${refundAmount.toLocaleString()}`;
    } else {
      refundText = 'No refund applicable';
    }

    return { actionText, reason, refundText };
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600">Manage your farmhouse bookings</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600">Manage your farmhouse bookings</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaExclamationTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load bookings</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
              <a
                href="/farmhouses"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Browse Farmhouses
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Manage your farmhouse bookings</p>
          {bookings.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaCalendarAlt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h2>
            <p className="text-gray-600 mb-6">Start exploring farmhouses and make your first booking!</p>
            <a
              href="/farmhouses"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Farmhouses
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const cancellationInfo = getCancellationInfo(booking);
              // FIXED: Use the correct canRemove function from outside
              const isRemovable = canRemove(booking);

              return (
                <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {booking.farmhouse?.name}
                      </h3>
                      <div className="flex items-center text-gray-500 mb-2">
                        <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                        <span>
                          {booking.farmhouse?.address?.city}, {booking.farmhouse?.address?.state}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <FaCalendarAlt className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-2">{getStatusText(booking.status)}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mt-2">
                        ₹{booking.pricing?.totalAmount?.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.pricing?.totalNights} night{booking.pricing?.totalNights > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Cancellation/Rejection Information */}
                  {cancellationInfo && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start">
                        <FaInfoCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-red-800 font-medium text-sm mb-1">
                            {cancellationInfo.actionText}
                          </p>
                          {cancellationInfo.reason && (
                            <p className="text-red-700 text-sm mb-1">
                              <span className="font-medium">Reason: </span>
                              {cancellationInfo.reason}
                            </p>
                          )}
                          {cancellationInfo.refundText && (
                            <p className="text-red-700 text-sm">
                              {cancellationInfo.refundText}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Room Type:</span>
                        <p className="font-medium">{booking.room?.name || booking.room?.type}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Guests:</span>
                        <p className="font-medium">
                          {booking.guests?.adults} Adult{booking.guests?.adults > 1 ? 's' : ''}
                          {booking.guests?.children > 0 && `, ${booking.guests.children} Child${booking.guests.children > 1 ? 'ren' : ''}`}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Booking ID:</span>
                        <p className="font-mono text-xs text-gray-600">{booking._id}</p>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-500 text-sm">Special Requests:</span>
                        <p className="text-gray-700 text-sm mt-1">{booking.specialRequests}</p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-4 items-center">
                      {booking.status === 'confirmed' && (
                        <>
                          <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                            Cancel Booking
                          </button>
                          <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                            View Details
                          </button>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            Contact Support
                          </button>
                        </>
                      )}

                      {(booking.status === 'cancelled' || booking.status === 'rejected') && (
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Book Again
                        </button>
                      )}

                      {/* Remove Button - Now shows for completed, rejected, cancelled */}
                      {isRemovable && (
                        <button
                          onClick={() => handleRemoveBooking(booking._id)}
                          disabled={removingBookingId === booking._id}
                          className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                        >
                          <FaTrash className="h-3 w-3" />
                          <span>
                            {removingBookingId === booking._id ? 'Removing...' : 'Remove from List'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;