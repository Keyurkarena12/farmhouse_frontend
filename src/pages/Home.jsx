import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFarmhouses } from '../store/slices/farmhouseSlice';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaWifi, FaCar, FaSwimmingPool } from 'react-icons/fa';

const Home = () => {
  const [searchParams, setSearchParams] = useState({
    search: '',
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const dispatch = useDispatch();
  const { farmhouses, loading } = useSelector(state => state.farmhouse);

  useEffect(() => {
    dispatch(fetchFarmhouses({ limit: 6, sortBy: 'ratings.average', sortOrder: 'desc' }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to farmhouses page with search params
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    window.location.href = `/farmhouses?${params.toString()}`;
  };

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 bg-gradient-to-r from-green-600 to-green-800">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block text-green-300">Farmhouse Getaway</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Experience nature, comfort, and unforgettable memories
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-lg p-6 shadow-2xl max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Where to go?
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="city"
                      value={searchParams.city}
                      onChange={handleInputChange}
                      placeholder="Enter city or location"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-2 top-4 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="checkIn"
                      value={searchParams.checkIn}
                      onChange={handleInputChange}
                      className="w-full pl-6 pr-2 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-2 top-4 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="checkOut"
                      value={searchParams.checkOut}
                      onChange={handleInputChange}
                      className="w-full pl-6 pr-2 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      name="guests"
                      value={searchParams.guests}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-green-500 focus:border-transparent"
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25].map(num => (
                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full md:w-auto mt-4 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <FaSearch className="h-5 w-5" />
                <span>Search Farmhouses</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Farmhouses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Farmhouses
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked farmhouses for the perfect countryside experience
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {farmhouses.map((farmhouse) => (
                <div key={farmhouse._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-64">
                    <img
                      src={farmhouse.images?.[0]?.url || '/api/placeholder/400/300'}
                      alt={farmhouse.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center space-x-1">
                      <FaStar className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-semibold">{farmhouse.ratings?.average || 0}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {farmhouse.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {farmhouse.description}
                    </p>
                    
                    <div className="flex items-center text-gray-500 mb-4">
                      <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {farmhouse.address?.city}, {farmhouse.address?.state}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{farmhouse.pricing?.basePrice || 0}
                        <span className="text-sm font-normal text-gray-500">/night</span>
                      </div>
                      <Link
                        to={`/farmhouse/${farmhouse._id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/farmhouses"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              View All Farmhouses
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose FarmhouseBooking?
            </h2>
            <p className="text-xl text-gray-600">
              We make your farmhouse booking experience seamless and memorable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaWifi className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Amenities</h3>
              <p className="text-gray-600">
                Enjoy all the comforts of home with modern amenities in a rustic setting
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Access</h3>
              <p className="text-gray-600">
                Well-connected farmhouses with easy access and parking facilities
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSwimmingPool className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unique Experiences</h3>
              <p className="text-gray-600">
                Create unforgettable memories with unique farmhouse experiences
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
