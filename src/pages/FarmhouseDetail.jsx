

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFarmhouseById } from "../store/slices/farmhouseSlice";
import { createBooking, fetchUserBookings, submitReview } from "../store/slices/bookingSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaStar,
  FaMapMarkerAlt,
  FaWifi,
  FaSwimmingPool,
  FaUtensils,
  FaBed,
  FaCar,
  FaFire,
  FaCheckCircle,
  FaRegStar,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaEdit,
} from "react-icons/fa";

// Rating Modal Component
const RatingModal = ({ booking, isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.booking);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      await dispatch(submitReview({
        id: booking._id,
        rating,
        comment
      })).unwrap();

      onSubmit();
      onClose();
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert(error || 'Failed to submit review');
    }
  };

  const renderStars = (count, isInteractive = true) => {
    return Array.from({ length: 5 }).map((_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoverRating || rating);

      return (
        <button
          key={index}
          type="button"
          className={`p-1 ${isInteractive ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={() => isInteractive && setRating(starValue)}
          onMouseEnter={() => isInteractive && setHoverRating(starValue)}
          onMouseLeave={() => isInteractive && setHoverRating(0)}
          disabled={!isInteractive || loading}
        >
          {isFilled ? (
            <FaStar className="h-6 w-6 text-yellow-400" />
          ) : (
            <FaRegStar className="h-6 w-6 text-gray-300" />
          )}
        </button>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rate Your Experience
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How was your stay at {booking.farmhouse?.name}?
            </label>
            <div className="flex justify-center mb-2">
              {renderStars(5)}
            </div>
            <p className="text-center text-sm text-gray-500">
              {rating > 0 ? `You rated: ${rating} star${rating > 1 ? 's' : ''}` : 'Select your rating'}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience... What did you like? Any suggestions?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows="4"
              maxLength="500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0 || loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Image Slider Component
const ImageSlider = ({ images, farmhouseName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="mb-8 relative">
        {/* Main Image with Navigation */}
        <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
          <img
            src={images[currentIndex].url}
            alt={`${farmhouseName} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={openModal}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="mt-4">
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${index === currentIndex ? 'border-green-500' : 'border-transparent'
                    }`}
                  onClick={() => goToSlide(index)}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 4 && images.length > 5 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        +{images.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Modal Slider */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-6xl h-full flex items-center">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
            >
              X
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 text-white p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
                >
                  <FaChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 text-white p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 z-10"
                >
                  <FaChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={images[currentIndex].url}
                alt={`${farmhouseName} - Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
                {currentIndex + 1} / {images.length}
              </div>
            )}

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-center space-x-2 overflow-x-auto py-2">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${index === currentIndex ? 'border-white' : 'border-transparent'
                        }`}
                      onClick={() => goToSlide(index)}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Room Selection Modal Component
const RoomSelectionModal = ({ 
  rooms, 
  isOpen, 
  onClose, 
  onSelectRoom, 
  selectedRoomIndex 
}) => {
  const [tempSelectedIndex, setTempSelectedIndex] = useState(selectedRoomIndex);

  const handleConfirmSelection = () => {
    onSelectRoom(tempSelectedIndex);
    onClose();
  };

  const handleClose = () => {
    setTempSelectedIndex(selectedRoomIndex); // Reset to original selection
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Select Room Type</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {rooms.map((room, index) => (
            <div
              key={room._id || index}
              onClick={() => setTempSelectedIndex(index)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                tempSelectedIndex === index
                  ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {room.name}
                    </h3>
                    {tempSelectedIndex === index && (
                      <FaCheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">
                    Capacity: {room.capacity} guests
                  </p>
                  <p className="text-sm text-gray-500">Type: {room.type}</p>
                  {room.description && (
                    <p className="text-gray-700 mt-2 text-sm">{room.description}</p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{room.pricePerNight?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">per night</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={tempSelectedIndex === null}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

const FarmhouseDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentFarmhouse, loading } = useSelector((state) => state.farmhouse);
  const { bookings, loading: bookingLoading } = useSelector((state) => state.booking);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null); // ← FIXED: Use index
  const [specialRequests, setSpecialRequests] = useState("");
  const [message, setMessage] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userCompletedBookings, setUserCompletedBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/bookings/farmhouse/${id}/blocked-dates`
        );
        setBlockedDates(response.data.blockedDates.map(b => b.date));
      } catch (error) {
        console.error('Failed to fetch blocked dates:', error);
      }
    };

    if (id) {
      fetchBlockedDates();
    }
  }, [id]);

  // Fetch farmhouse by ID
  useEffect(() => {
    if (id) dispatch(fetchFarmhouseById(id));
  }, [dispatch, id]);

  // Fetch user bookings
  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  // Filter user's completed bookings for this farmhouse
  useEffect(() => {
    const completedBookings = bookings.filter(booking =>
      booking.farmhouse?._id === id &&
      booking.status === 'completed' &&
      !booking.review?.rating
    );
    setUserCompletedBookings(completedBookings);
  }, [bookings, id]);

  // Default fallback amenities
  const defaultAmenities = [
    { name: "Free Wi-Fi", icon: <FaWifi /> },
    { name: "Swimming Pool", icon: <FaSwimmingPool /> },
    { name: "Restaurant", icon: <FaUtensils /> },
    { name: "Comfortable Beds", icon: <FaBed /> },
    { name: "Parking", icon: <FaCar /> },
    { name: "BBQ Area", icon: <FaFire /> },
  ];

  // Default room options
  const defaultRooms = [
    { name: "Standard Room", type: "standard", capacity: 2, pricePerNight: 2500 },
    { name: "Deluxe Room", type: "deluxe", capacity: 4, pricePerNight: 4000 },
    { name: "Family Suite", type: "suite", capacity: 6, pricePerNight: 6000 },
  ];

  // Check if a date is blocked
  const isDateBlocked = (date) => {
    return blockedDates.some(blockedDate => {
      const blocked = new Date(blockedDate);
      const checkDate = new Date(date);
      return blocked.toDateString() === checkDate.toDateString();
    });
  };

  // Handle room selection from modal
  const handleRoomSelect = (index) => {
    setSelectedRoomIndex(index);
  };

  // Booking Submission
  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      setMessage("Please select check-in and check-out dates.");
      return;
    }

    if (selectedRoomIndex === null) {
      setMessage("Please select a room type.");
      return;
    }

    // Check for blocked dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const datesInRange = [];
    const currentDate = new Date(checkInDate);

    while (currentDate < checkOutDate) {
      datesInRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const hasBlockedDate = datesInRange.some(date => isDateBlocked(date));
    if (hasBlockedDate) {
      setMessage("Selected dates include blocked dates. Please choose different dates.");
      return;
    }

    const selectedRoom = rooms[selectedRoomIndex];

    const bookingData = {
      farmhouseId: id,
      roomType: selectedRoom.type, // ← Send type to backend
      checkIn,
      checkOut,
      guests: { adults: guests, children: 0 },
      specialRequests,
      contactInfo: {
        name: localStorage.getItem("userName") || "Guest",
        email: localStorage.getItem("userEmail") || "guest@example.com",
        phone: localStorage.getItem("userPhone") || "0000000000",
      },
    };

    console.log('Sending booking data:', bookingData);

    try {
      await dispatch(createBooking(bookingData)).unwrap();
      setMessage("Booking successful!");
      // Reset form
      setCheckIn("");
      setCheckOut("");
      setGuests(1);
      setSelectedRoomIndex(null);
      setSpecialRequests("");
    } catch (err) {
      console.error('Booking error:', err);
      setMessage(`${err}`);
    }
  };

  const handleOpenRating = (booking) => {
    setSelectedBooking(booking);
    setShowRatingModal(true);
  };

  const handleRatingSubmitted = () => {
    dispatch(fetchUserBookings());
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      index < Math.floor(rating) ?
        <FaStar key={index} className="h-4 w-4 text-yellow-400" /> :
        <FaRegStar key={index} className="h-4 w-4 text-gray-300" />
    ));
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Not Found
  if (!currentFarmhouse) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Farmhouse not found</h2>
        <p className="text-gray-600">This farmhouse doesn't exist or was removed.</p>
      </div>
    );
  }

  // Images
  const images = currentFarmhouse.images?.length
    ? currentFarmhouse.images
    : [{ url: "/placeholder.jpg" }];

  const amenities = currentFarmhouse.amenities?.length
    ? currentFarmhouse.amenities.map((a) => ({ name: a.name, icon: <FaBed /> }))
    : defaultAmenities;

  const rooms = currentFarmhouse.rooms?.length
    ? currentFarmhouse.rooms
    : defaultRooms;

  // Selected room by index
  const selectedRoom = selectedRoomIndex !== null ? rooms[selectedRoomIndex] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Slider */}
        <ImageSlider images={images} farmhouseName={currentFarmhouse.name} />

        {/* Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Farmhouse Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentFarmhouse.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <FaStar className="text-yellow-400" />
                  <span>{currentFarmhouse.ratings?.average || "4.5"}</span>
                  <span>({currentFarmhouse.ratings?.count || 24} reviews)</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>
                    {currentFarmhouse.address?.city || "Surat"},{" "}
                    {currentFarmhouse.address?.state || "Gujarat"}
                  </span>
                </div>
              </div>
              <p className="text-gray-700">
                {currentFarmhouse.description ||
                  "Enjoy a peaceful and luxurious stay at our farmhouse surrounded by nature, perfect for weekend getaways and celebrations."}
              </p>
            </div>

            {/* User's Completed Bookings */}
            {userCompletedBookings.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Rate Your Previous Stays
                </h2>
                <p className="text-gray-600 mb-6">
                  You've completed stays at this farmhouse. Share your experience to help other travelers!
                </p>

                <div className="space-y-4">
                  {userCompletedBookings.map((booking) => (
                    <div key={booking._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Stay from {new Date(booking.checkIn).toLocaleDateString()} to {new Date(booking.checkOut).toLocaleDateString()}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {booking.room?.type} • {booking.guests?.adults} adults
                          </p>
                          <p className="text-green-600 font-medium">
                            ₹{booking.pricing?.totalAmount?.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4">
                          {booking.review?.rating ? (
                            <div className="text-center">
                              <div className="flex items-center justify-center mb-1">
                                {renderStars(booking.review.rating)}
                              </div>
                              <span className="text-sm text-gray-600">
                                Rated {booking.review.rating}/5
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenRating(booking)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                            >
                              <FaCheckCircle className="h-4 w-4" />
                              <span>Rate Stay</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-700">
                    <span className="text-green-600">{amenity.icon}</span>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
                <button
                  onClick={() => setShowRoomModal(true)}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
                >
                  <FaEdit className="h-4 w-4" />
                  <span>Change Room</span>
                </button>
              </div>
              
              {selectedRoom ? (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        Selected Room: {selectedRoom.name}
                      </h3>
                      <p className="text-green-600">
                        Capacity: {selectedRoom.capacity} guests • 
                        ₹{selectedRoom.pricePerNight?.toLocaleString()} per night
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRoomModal(true)}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 mb-4">Please select a room type to continue with booking.</p>
              )}

              <div className="space-y-4">
                {rooms.map((room, index) => (
                  <div
                    key={room._id || `${room.type}-${index}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoomIndex(index);
                    }}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedRoomIndex === index
                        ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{room.name}</h3>
                        <p className="text-gray-600">
                          Capacity: {room.capacity} guests
                        </p>
                        <p className="text-sm text-gray-500">Type: {room.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{room.pricePerNight?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">per night</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm h-fit sticky top-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-green-600">
                {selectedRoom ? (
                  <>₹{selectedRoom.pricePerNight?.toLocaleString()}</>
                ) : (
                  <>₹{currentFarmhouse.pricing?.basePrice || 2500}</>
                )}
              </div>
              <div className="text-gray-500">per night</div>
            </div>

            <div className="space-y-4">
              {/* Selected Room Display */}
              {selectedRoom && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-green-800 text-sm">
                        {selectedRoom.name}
                      </p>
                      <p className="text-green-600 text-xs">
                        {selectedRoom.capacity} guests
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRoomModal(true)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                />
                {checkIn && isDateBlocked(checkIn) && (
                  <p className="text-red-600 text-sm mt-1">This date is blocked</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                />
                {checkOut && isDateBlocked(checkOut) && (
                  <p className="text-red-600 text-sm mt-1">This date is blocked</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                    <option key={num} value={num}>
                      {num} Guest{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Special requests (optional)"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
              ></textarea>

              <button
                onClick={handleBooking}
                disabled={bookingLoading || selectedRoomIndex === null}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? "Booking..." : "Book Now"}
              </button>

              {message && (
                <p
                  className={`text-center font-medium ${
                    message.includes("Booking successful") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        booking={selectedBooking}
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmitted}
      />

      {/* Room Selection Modal */}
      <RoomSelectionModal
        rooms={rooms}
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        onSelectRoom={handleRoomSelect}
        selectedRoomIndex={selectedRoomIndex}
      />
    </div>
  );
};

export default FarmhouseDetail;