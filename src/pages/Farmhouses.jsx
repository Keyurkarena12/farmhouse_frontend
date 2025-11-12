// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchFarmhouses, setSearchParams } from '../store/slices/farmhouseSlice';
// import { FaSearch, FaMapMarkerAlt, FaStar, FaFilter } from 'react-icons/fa';

// const Farmhouses = () => {
//   const [showFilters, setShowFilters] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { farmhouses, loading, searchParams } = useSelector(state => state.farmhouse);

//   useEffect(() => {
//     dispatch(fetchFarmhouses(searchParams));
//   }, [dispatch, searchParams]);

//   const handleSearchChange = (e) => {
//     dispatch(setSearchParams({ [e.target.name]: e.target.value }));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     dispatch(fetchFarmhouses(searchParams));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Farmhouse</h1>
          
//           {/* Search Bar */}
//           <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm p-6 mb-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="md:col-span-2">
//                 <div className="relative">
//                   <FaSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                   <input
//                     type="text"
//                     name="search"
//                     value={searchParams.search}
//                     onChange={handleSearchChange}
//                     placeholder="Search farmhouses..."
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <input
//                   type="text"
//                   name="city"
//                   value={searchParams.city}
//                   onChange={handleSearchChange}
//                   placeholder="City"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 />
//               </div>
              
//               <div className="flex space-x-2">
//                 <button
//                   type="submit"
//                   className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
//                 >
//                   Search
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <FaFilter className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* Results */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {loading ? (
//             Array.from({ length: 6 }).map((_, index) => (
//               <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
//                 <div className="h-64 bg-gray-300"></div>
//                 <div className="p-6">
//                   <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                   <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
//                   <div className="h-4 bg-gray-300 rounded mb-4"></div>
//                   <div className="flex justify-between items-center">
//                     <div className="h-6 bg-gray-300 rounded w-20"></div>
//                     <div className="h-8 bg-gray-300 rounded w-24"></div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : farmhouses.length > 0 ? (
//             farmhouses.map((farmhouse) => (
//               <div key={farmhouse._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
//                 <div className="relative h-64">
//                   <img
//                     src={farmhouse.images?.[0]?.url || '/api/placeholder/400/300'}
//                     alt={farmhouse.name}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center space-x-1">
//                     <FaStar className="h-4 w-4 text-yellow-400" />
//                     <span className="text-sm font-semibold">{farmhouse.ratings?.average || 0}</span>
//                   </div>
//                 </div>
                
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                     {farmhouse.name}
//                   </h3>
//                   <p className="text-gray-600 mb-4 line-clamp-2">
//                     {farmhouse.description}
//                   </p>
                  
//                   <div className="flex items-center text-gray-500 mb-4">
//                     <FaMapMarkerAlt className="h-4 w-4 mr-2" />
//                     <span className="text-sm">
//                       {farmhouse.address?.city}, {farmhouse.address?.state}
//                     </span>
//                   </div>
                  
//                   <div className="flex items-center justify-between">
//                     <div className="text-2xl font-bold text-green-600">
//                       ₹{farmhouse.pricing?.basePrice || 0}
//                       <span className="text-sm font-normal text-gray-500">/night</span>
//                     </div>
//                     <button
//                     onClick={() => navigate(`/farmhouse/${farmhouse._id}`)}
//                     className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-12">
//               <div className="text-gray-500 text-lg">No farmhouses found matching your criteria.</div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Farmhouses;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFarmhouses, setSearchParams } from '../store/slices/farmhouseSlice';
import { FaSearch, FaMapMarkerAlt, FaStar, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Farmhouses = () => {
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { farmhouses, loading, searchParams, totalPages, currentPage } = useSelector(state => state.farmhouse);

  // Local state for pagination
  const [page, setPage] = useState(1);
  const limit = 6; // Show only 6 per page

  useEffect(() => {
    dispatch(fetchFarmhouses({ ...searchParams, page, limit }));
  }, [dispatch, searchParams, page]);

  const handleSearchChange = (e) => {
    dispatch(setSearchParams({ [e.target.name]: e.target.value }));
    setPage(1); // Reset to first page on search
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(fetchFarmhouses({ ...searchParams, page: 1, limit }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Farmhouse</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    value={searchParams.search || ''}
                    onChange={handleSearchChange}
                    placeholder="Search farmhouses..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  name="city"
                  value={searchParams.city || ''}
                  onChange={handleSearchChange}
                  placeholder="City"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaFilter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Count */}
        {!loading && farmhouses.length > 0 && (
          <div className="mb-4 text-gray-700">
            Showing <span className="font-semibold">{farmhouses.length}</span> of{' '}
            <span className="font-semibold">{totalPages * limit}</span> farmhouses
          </div>
        )}

        {/* Farmhouses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="h-8 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))
          ) : farmhouses.length > 0 ? (
            farmhouses.map((farmhouse) => (
              <div key={farmhouse._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
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
                    <button
                      onClick={() => navigate(`/farmhouse/${farmhouse._id}`)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">No farmhouses found matching your criteria.</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="mt-10 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors ${
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              <FaChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  page === pageNum
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors ${
                page === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              <span>Next</span>
              <FaChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Farmhouses;