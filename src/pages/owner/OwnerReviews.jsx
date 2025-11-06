import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerRatings } from '../../store/slices/bookingSlice';
import { FaStar, FaRegStar, FaUser, FaQuoteLeft } from 'react-icons/fa';

const OwnerReviews = () => {
  const dispatch = useDispatch();
  const { ownerRatings, loading } = useSelector((state) => state.booking);
  const [selectedFarmhouse, setSelectedFarmhouse] = useState('all');

  useEffect(() => {
    dispatch(fetchOwnerRatings());
  }, [dispatch]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      index < Math.floor(rating) ? 
        <FaStar key={index} className="h-4 w-4 text-yellow-400" /> : 
        <FaRegStar key={index} className="h-4 w-4 text-gray-300" />
    ));
  };

  const filteredReviews = selectedFarmhouse === 'all' 
    ? ownerRatings?.recentReviews || []
    : ownerRatings?.recentReviews?.filter(review => review.farmhouse?._id === selectedFarmhouse) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
          <p className="text-gray-600 mt-2">Manage and monitor guest feedback for your farmhouses</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Overall Rating</p>
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {ownerRatings ? renderStars(ownerRatings.overallRating) : renderStars(0)}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {(ownerRatings?.overallRating || 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ownerRatings?.totalReviews || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">🏡</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Farmhouses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ownerRatings?.farmhouses?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Farmhouse Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Guest Reviews</h2>
            <select
              value={selectedFarmhouse}
              onChange={(e) => setSelectedFarmhouse(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Farmhouses</option>
              {ownerRatings?.farmhouses?.map(farmhouse => (
                <option key={farmhouse._id} value={farmhouse._id}>
                  {farmhouse.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {filteredReviews.length > 0 ? (
            <div className="space-y-6">
              {filteredReviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-gray-100 rounded-full p-2 mr-3">
                        <FaUser className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.user?.name || 'Anonymous Guest'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {review.farmhouse?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {renderStars(review.review.rating)}
                      <span className="ml-2 text-sm text-gray-600">
                        {review.review.rating}.0
                      </span>
                    </div>
                  </div>
                  
                  {review.review.comment && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-3">
                      <FaQuoteLeft className="h-4 w-4 text-gray-400 mb-2" />
                      <p className="text-gray-700 italic">{review.review.comment}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-500">
                      Stayed: {new Date(review.checkIn).toLocaleDateString()} - {new Date(review.checkOut).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Reviewed: {new Date(review.review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⭐</div>
              <p className="text-gray-500 text-lg">No reviews yet</p>
              <p className="text-gray-400 mt-2">
                {selectedFarmhouse === 'all' 
                  ? "You haven't received any reviews yet." 
                  : "This farmhouse hasn't received any reviews yet."}
              </p>
            </div>
          )}
        </div>

        {/* Farmhouse Ratings Summary */}
        {ownerRatings?.farmhouses?.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Farmhouse Ratings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownerRatings.farmhouses.map((farmhouse) => (
                <div key={farmhouse._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{farmhouse.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {renderStars(farmhouse.ratings?.average || 0)}
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {(farmhouse.ratings?.average || 0).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {farmhouse.ratings?.count || 0} review{farmhouse.ratings?.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerReviews;

