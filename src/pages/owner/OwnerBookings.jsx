import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerBookings, updateBooking, removeBooking, removeBookingFromOwnerList } from '../../store/slices/bookingSlice';
import { FaTrash, FaInfoCircle } from 'react-icons/fa';

const OwnerBookings = () => {
  const dispatch = useDispatch();
  const { ownerBookings: bookings, loading } = useSelector((state) => state.booking);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removingBookingId, setRemovingBookingId] = useState(null);

  useEffect(() => {
    dispatch(fetchOwnerBookings());
  }, [dispatch]);

  const handleStatusUpdate = async (bookingId, newStatus, reason = '') => {
    try {
      await dispatch(
        updateBooking({ id: bookingId, status: newStatus, reason })
      ).unwrap();

      // REFRESH OWNER LIST
      dispatch(fetchOwnerBookings());
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert(`Failed to update booking: ${error.message || 'Please try again'}`);
    }
  };

  const handleRemoveBooking = async (bookingId) => {
    if (!bookingId) return;

    setRemovingBookingId(bookingId);

    // Optimistic UI - use the correct variable name 'bookings' instead of 'ownerBookings'
    const originalBookings = [...bookings]; // FIX: Changed from ownerBookings to bookings

    // Dispatch optimistic update
    dispatch({
      type: 'booking/removeBookingFromOwnerList/pending'
    });

    try {
      await dispatch(removeBookingFromOwnerList(bookingId)).unwrap();
      // REFRESH LIST (in case something else changed)
      dispatch(fetchOwnerBookings());
    } catch (error) {
      console.error('Failed to remove booking:', error);
      // Revert optimistic update
      dispatch({
        type: 'booking/fetchOwnerBookings/fulfilled',
        payload: originalBookings
      });
    } finally {
      setRemovingBookingId(null);
      setShowRemoveModal(false);
      setSelectedBooking(null);
    }
  };

  const handleRejectBooking = async () => {
    if (!selectedBooking || !rejectReason.trim()) return;

    try {
      await handleStatusUpdate(selectedBooking._id, 'rejected', rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedBooking(null);
    } catch (error) {
      console.error('Failed to reject booking:', error);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking || !cancelReason.trim()) return;

    try {
      await handleStatusUpdate(selectedBooking._id, 'cancelled', cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedBooking(null);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const openRemoveModal = (booking) => {
    setSelectedBooking(booking);
    setShowRemoveModal(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const canRemoveBooking = (booking) => {
    return ['completed', 'rejected', 'cancelled'].includes(booking.status);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage all bookings for your farmhouses</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400 mt-2">Bookings from customers will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Booking Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <img
                        src={booking.farmhouse?.images?.[0]?.url || '/placeholder-farmhouse.jpg'}
                        alt={booking.farmhouse?.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.farmhouse?.name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              Booked by: <span className="font-medium">{booking.user?.name}</span>
                            </p>
                            <p className="text-gray-600 text-sm">
                              Email: <span className="font-medium">{booking.user?.email}</span>
                            </p>
                            <p className="text-gray-600 text-sm">
                              Phone: <span className="font-medium">{booking.user?.phone || 'Not provided'}</span>
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div className="flex sm:items-center sm:justify-end">
                            <span
                              className={`px-3 py-1 text-sm font-medium rounded-full border max-w-max ${getStatusBadgeClass(booking.status)}`}
                            >
                              {getStatusText(booking.status)}
                            </span>
                          </div>

                        </div>


                        {/* Booking Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-gray-500">Dates</p>
                            <p className="font-medium">
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {booking.pricing?.totalNights} nights
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Room Type</p>
                            <p className="font-medium">{booking.room?.type}</p>
                            <p className="text-gray-500 text-xs">
                              {booking.guests?.adults || 0} adults, {booking.guests?.children || 0} children
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total Amount</p>
                            <p className="font-medium text-green-600">
                              ₹{booking.pricing?.totalAmount?.toLocaleString()}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Paid: {booking.payment?.status === 'completed' ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>

                        {/* Special Requests */}
                        {booking.specialRequests && (
                          <div className="mt-3">
                            <p className="text-gray-500 text-sm">Special Requests:</p>
                            <p className="text-gray-700 text-sm">{booking.specialRequests}</p>
                          </div>
                        )}

                        {/* Cancellation/Rejection Reason */}
                        {booking.cancellation?.reason && (
                          <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                            <p className="text-red-700 text-sm">
                              <span className="font-medium">Reason: </span>
                              {booking.cancellation.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 lg:ml-4">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => openRejectModal(booking)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {booking.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'completed')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Mark Complete
                          </button>
                          <button
                            onClick={() => openCancelModal(booking)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {/* Remove from List Button - Alternative location */}
                      {canRemoveBooking(booking) && (
                        <button
                          onClick={() => openRemoveModal(booking)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center space-x-2"
                        >
                          <FaTrash className="h-3 w-3" />
                          <span>Remove</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Booking Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reject Booking
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to reject this booking? The user will be notified and receive a full refund.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this booking..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setSelectedBooking(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectBooking}
                  disabled={!rejectReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Booking Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cancel Booking
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                    setSelectedBooking(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={!cancelReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Booking Modal */}
        {showRemoveModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center mb-4">
                <FaInfoCircle className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Remove Booking
                </h3>
              </div>

              <p className="text-gray-600 mb-4">
                Are you sure you want to remove this booking from your list?
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Farmhouse:</strong> {selectedBooking.farmhouse?.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Guest:</strong> {selectedBooking.user?.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Status:</strong> {getStatusText(selectedBooking.status)}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Dates:</strong> {new Date(selectedBooking.checkIn).toLocaleDateString()} - {new Date(selectedBooking.checkOut).toLocaleDateString()}
                </p>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                This will remove the booking from your management view. The booking record will still be maintained in the system.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRemoveModal(false);
                    setSelectedBooking(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg transition-colors"
                  disabled={removingBookingId}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemoveBooking(selectedBooking._id)}
                  disabled={removingBookingId}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center space-x-2"
                >
                  {removingBookingId ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Removing...</span>
                    </>
                  ) : (
                    <>
                      <FaTrash className="h-4 w-4" />
                      <span>Remove from List</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerBookings;