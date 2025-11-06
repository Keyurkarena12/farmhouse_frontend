// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchOwnerFarmhouses } from '../../store/slices/farmhouseSlice';
// import { fetchActiveBookingsCount, fetchOwnerBookings, fetchOwnerRatings } from '../../store/slices/bookingSlice';
// import axios from 'axios';

// const OwnerDashboard = () => {
//   const dispatch = useDispatch();
//   const { farmhouses, loading } = useSelector((state) => state.farmhouse);
//   const { user } = useSelector((state) => state.auth);
//    const { activeBookingsCount, loading: bookingsLoading } = useSelector((state) => state.booking);
//   const [selectedFarmhouse, setSelectedFarmhouse] = useState('');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [availabilityData, setAvailabilityData] = useState({});
//   const [savingDates, setSavingDates] = useState(false);
//   const [analyticsTimeRange, setAnalyticsTimeRange] = useState('month'); // month, quarter, year
//   const [analyticsData, setAnalyticsData] = useState(null);


//   // Fetch owner's farmhouses when component mounts
//   useEffect(() => {
//     if (user?.role === 'owner' || user?.role === 'admin') {
//       dispatch(fetchOwnerFarmhouses());
//       dispatch(fetchActiveBookingsCount());
//        dispatch(fetchOwnerRatings());
//       dispatch(fetchOwnerBookings());
//     }
//   }, [dispatch, user]);


//   useEffect(() => {
//     if (farmhouses.length > 0) {
//       dispatch(fetchActiveBookingsCount());
//     }
//   }, [dispatch, farmhouses.length]);

//   // Calculate statistics
//   const totalFarmhouses = farmhouses?.length || 0;
//   // const activeBookings = 0;
//   const totalRevenue = farmhouses.reduce((total, farmhouse) => {
//     return total + (farmhouse.pricing?.basePrice || 0);
//   }, 0);
//   const recentFarmhouses = farmhouses.slice(0, 3);

//   // Calendar functions
//   const getDaysInMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//   };

//   const navigateMonth = (direction) => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
//   };

//   // Fetch blocked dates for selected farmhouse
//   const fetchBlockedDates = async (farmhouseId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/bookings/farmhouse/${farmhouseId}/blocked-dates`
//       );

//       // Convert blocked dates to the format expected by the calendar
//       const blockedDatesMap = {};
//       response.data.blockedDates.forEach(blocked => {
//         const dateString = new Date(blocked.date).toISOString().split('T')[0];
//         blockedDatesMap[dateString] = true;
//       });

//       setAvailabilityData(prev => ({
//         ...prev,
//         [farmhouseId]: blockedDatesMap
//       }));
//     } catch (error) {
//       console.error('Failed to fetch blocked dates:', error);
//     }
//   };

//   // Toggle date availability - FIXED VERSION
//   const toggleDateAvailability = async (date) => {
//     if (!selectedFarmhouse || savingDates) return;

//     const dateString = date.toISOString().split('T')[0];
//     const isCurrentlyBlocked = availabilityData[selectedFarmhouse]?.[dateString];
//     const action = isCurrentlyBlocked ? 'unblock' : 'block';

//     setSavingDates(true);

//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `http://localhost:5000/api/bookings/farmhouse/${selectedFarmhouse}/blocked-dates`,
//         { dates: [dateString], action },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Update local state only after successful API call
//       setAvailabilityData(prev => ({
//         ...prev,
//         [selectedFarmhouse]: {
//           ...prev[selectedFarmhouse],
//           [dateString]: !isCurrentlyBlocked
//         }
//       }));
//     } catch (error) {
//       console.error('Failed to update blocked date:', error);
//       alert('Failed to update date availability: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setSavingDates(false);
//     }
//   };

//   // Bulk update dates - FIXED VERSION
//   const bulkUpdateDates = async (datesToUpdate, action) => {
//     if (!selectedFarmhouse || savingDates) return;

//     setSavingDates(true);

//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `http://localhost:5000/api/bookings/farmhouse/${selectedFarmhouse}/blocked-dates`,
//         { dates: datesToUpdate, action },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Refresh the blocked dates after bulk operation
//       await fetchBlockedDates(selectedFarmhouse);
//     } catch (error) {
//       console.error('Failed to bulk update dates:', error);
//       alert('Failed to update dates: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setSavingDates(false);
//     }
//   };

//   const getDateStatus = (date) => {
//     if (!selectedFarmhouse) return 'available';
//     const dateString = date.toISOString().split('T')[0];
//     return availabilityData[selectedFarmhouse]?.[dateString] ? 'blocked' : 'available';
//   };

//   const isToday = (date) => {
//     const today = new Date();
//     return date.getDate() === today.getDate() &&
//       date.getMonth() === today.getMonth() &&
//       date.getFullYear() === today.getFullYear();
//   };

//   const isPastDate = (date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return date < today;
//   };

//   // Update the farmhouse selection to fetch blocked dates
//   useEffect(() => {
//     if (selectedFarmhouse) {
//       fetchBlockedDates(selectedFarmhouse);
//     }
//   }, [selectedFarmhouse]);

//   const renderCalendar = () => {
//     const daysInMonth = getDaysInMonth(currentDate);
//     const firstDay = getFirstDayOfMonth(currentDate);
//     const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//     const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//     const days = [];

//     // Add empty cells for days before the first day of the month
//     for (let i = 0; i < firstDay; i++) {
//       days.push(<div key={`empty-${i}`} className="h-12"></div>);
//     }

//     // Add cells for each day of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//       const status = getDateStatus(date);
//       const today = isToday(date);
//       const pastDate = isPastDate(date);

//       days.push(
//         <button
//           key={day}
//           onClick={() => !pastDate && !savingDates && toggleDateAvailability(date)}
//           disabled={pastDate || savingDates}
//           className={`
//             h-12 flex items-center justify-center rounded-lg border transition-all
//             ${today ? 'border-green-500 bg-green-50' : 'border-gray-200'}
//             ${pastDate ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
//             ${status === 'blocked' ? 'bg-red-100 border-red-300 text-red-700' : 'bg-white'}
//             ${!pastDate && !savingDates && 'hover:shadow-sm'}
//             ${savingDates ? 'opacity-50' : ''}
//           `}
//         >
//           <div className="text-center">
//             <div className={`font-medium ${today ? 'text-green-700' : ''}`}>{day}</div>
//             {status === 'blocked' && !pastDate && (
//               <div className="text-xs text-red-600 mt-1">Blocked</div>
//             )}
//             {savingDates && (
//               <div className="text-xs text-gray-500 mt-1">Saving...</div>
//             )}
//           </div>
//         </button>
//       );
//     }

//     return (
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-semibold text-gray-900">Availability Calendar</h3>
//           <div className="flex items-center space-x-4">
//             <select
//               value={selectedFarmhouse}
//               onChange={(e) => setSelectedFarmhouse(e.target.value)}
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               disabled={savingDates}
//             >
//               <option value="">Select Farmhouse</option>
//               {farmhouses.map(farmhouse => (
//                 <option key={farmhouse._id} value={farmhouse._id}>
//                   {farmhouse.name}
//                 </option>
//               ))}
//             </select>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => navigateMonth(-1)}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 disabled={savingDates}
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <span className="font-semibold text-gray-900 min-w-[140px] text-center">
//                 {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//               </span>
//               <button
//                 onClick={() => navigateMonth(1)}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 disabled={savingDates}
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         {!selectedFarmhouse ? (
//           <div className="text-center py-12">
//             <div className="text-4xl mb-4">📅</div>
//             <p className="text-gray-500 mb-2">Select a farmhouse to manage availability</p>
//             <p className="text-gray-400 text-sm">Choose a farmhouse from the dropdown to block or unblock dates</p>
//           </div>
//         ) : (
//           <>
//             {/* Calendar Header */}
//             <div className="grid grid-cols-7 gap-2 mb-4">
//               {dayNames.map(day => (
//                 <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
//                   {day}
//                 </div>
//               ))}
//             </div>

//             {/* Calendar Grid */}
//             <div className="grid grid-cols-7 gap-2">
//               {days}
//             </div>

//             {/* Legend */}
//             <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-200">
//               <div className="flex items-center space-x-2">
//                 <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
//                 <span className="text-sm text-gray-600">Available</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
//                 <span className="text-sm text-gray-600">Blocked</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-4 h-4 bg-green-50 border border-green-500 rounded"></div>
//                 <span className="text-sm text-gray-600">Today</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
//                 <span className="text-sm text-gray-600">Past Date</span>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
//               <div className="text-sm text-gray-600">
//                 {savingDates ? 'Saving changes...' : 'Click on dates to toggle availability'}
//               </div>
//               <div className="flex space-x-3">
//                 <button
//                   onClick={async () => {
//                     // Block weekends for current month
//                     const year = currentDate.getFullYear();
//                     const month = currentDate.getMonth();
//                     const daysInMonth = getDaysInMonth(currentDate);
                    
//                     const weekendDates = [];
//                     for (let day = 1; day <= daysInMonth; day++) {
//                       const date = new Date(year, month, day);
//                       if ((date.getDay() === 0 || date.getDay() === 6) && !isPastDate(date)) {
//                         weekendDates.push(date.toISOString().split('T')[0]);
//                       }
//                     }
                    
//                     if (weekendDates.length > 0) {
//                       await bulkUpdateDates(weekendDates, 'block');
//                     }
//                   }}
//                   disabled={savingDates}
//                   className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium disabled:opacity-50"
//                 >
//                   Block Weekends
//                 </button>
//                 <button
//                   onClick={async () => {
//                     // Clear all blocks for current month
//                     const year = currentDate.getFullYear();
//                     const month = currentDate.getMonth();
//                     const daysInMonth = getDaysInMonth(currentDate);
                    
//                     const allDates = [];
//                     for (let day = 1; day <= daysInMonth; day++) {
//                       const date = new Date(year, month, day);
//                       if (!isPastDate(date)) {
//                         allDates.push(date.toISOString().split('T')[0]);
//                       }
//                     }
                    
//                     if (allDates.length > 0) {
//                       await bulkUpdateDates(allDates, 'unblock');
//                     }
//                   }}
//                   disabled={savingDates}
//                   className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium disabled:opacity-50"
//                 >
//                   Clear All Blocks
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     );
//   };

// // Update the farmhouse selection to fetch blocked dates
// useEffect(() => {
//   if (selectedFarmhouse) {
//     fetchBlockedDates(selectedFarmhouse);
//   }
// }, [selectedFarmhouse]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
//           <p className="text-gray-600 mt-2">Manage your farmhouses and bookings</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
//             <div className="flex items-center">
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <span className="text-2xl">🏡</span>
//               </div>
//               <div className="ml-4">
//                 <p className="text-gray-500 text-sm">Total Farmhouses</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {loading ? (
//                     <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
//                   ) : (
//                     totalFarmhouses
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <span className="text-2xl">📅</span>
//               </div>
//               <div className="ml-4">
//                 <p className="text-gray-500 text-sm">Active Bookings</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {bookingsLoading ? (
//                     <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
//                   ) : (
//                     activeBookingsCount
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
//             <div className="flex items-center">
//               <div className="p-3 bg-purple-100 rounded-lg">
//                 <span className="text-2xl">💰</span>
//               </div>
//               <div className="ml-4">
//                 <p className="text-gray-500 text-sm">Total Revenue</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {loading ? (
//                     <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
//                   ) : (
//                     `₹${totalRevenue.toLocaleString()}`
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Calendar Section */}
//         <div className="mb-8">
//           {renderCalendar()}
//         </div>
//          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//            {/* Manage Farmhouses Card */}
//            <Link
//              to="/owner/farmhouses"
//              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-green-300 group"
//            >
//              <div className="flex items-center mb-4">
//                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
//                  <span className="text-2xl">🏡</span>
//                </div>
//                <h3 className="text-xl font-semibold text-gray-900 ml-4">Manage Farmhouses</h3>
//              </div>
//              <p className="text-gray-600 mb-4">
//                Add, edit, or remove your farmhouse listings. Update availability and pricing.
//              </p>
//              <div className="flex items-center text-green-600 font-medium">
//                <span>View Farmhouses</span>
//                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                </svg>
//              </div>
//            </Link>
//            {/* Bookings Management */}
//            <Link
//              to="/owner/bookings"
//              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-blue-300 group"
//            >
//              <div className="flex items-center mb-4">
//                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
//                  <span className="text-2xl">📋</span>
//                </div>
//                <h3 className="text-xl font-semibold text-gray-900 ml-4">Bookings</h3>
//              </div>
//              <p className="text-gray-600 mb-4">
//                View and manage all bookings for your farmhouses. Confirm or cancel reservations.
//              </p>
//              <div className="flex items-center text-blue-600 font-medium">
//                <span>Manage Bookings</span>
//                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                </svg>
//              </div>
//            </Link>
//            {/* Revenue Analytics */}
//            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//              <div className="flex items-center mb-4">
//                <div className="p-3 bg-purple-100 rounded-lg">
//                  <span className="text-2xl">📊</span>
//                </div>
//                <h3 className="text-xl font-semibold text-gray-900 ml-4">Analytics</h3>
//              </div>
//              <p className="text-gray-600 mb-4">
//                View performance metrics, revenue reports, and booking trends for your properties.
//              </p>
//              <button className="text-purple-600 font-medium opacity-50 cursor-not-allowed">
//                Coming Soon
//              </button>
//            </div>
//            {/* Reviews */}
//            <Link
//              to="/owner/reviews"
//              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-yellow-300 group"
//            >
//              <div className="flex items-center mb-4">
//                <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
//                  <span className="text-2xl">⭐</span>
//                </div>
//                <h3 className="text-xl font-semibold text-gray-900 ml-4">Reviews</h3>
//              </div>
//              <p className="text-gray-600 mb-4">
//                Read and respond to guest reviews. Monitor your farmhouse ratings.
//              </p>
//              <div className="flex items-center text-yellow-600 font-medium">
//                <span>View Reviews</span>
//                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                </svg>
//              </div>
//            </Link>
//            {/* Settings */}
//            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//              <div className="flex items-center mb-4">
//                <div className="p-3 bg-gray-100 rounded-lg">
//                  <span className="text-2xl">⚙️</span>
//                </div>
//                <h3 className="text-xl font-semibold text-gray-900 ml-4">Settings</h3>
//              </div>
//              <p className="text-gray-600 mb-4">
//                Configure your account settings, payment methods, and notification preferences.
//              </p>
//              <button className="text-gray-600 font-medium opacity-50 cursor-not-allowed">
//                Coming Soon
//              </button>
//            </div>
//          </div>
//          {/* Recent Activity Section */}
//          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
//            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Farmhouses</h2>
//            {loading ? (
//              <div className="space-y-4">
//                {[1, 2, 3].map((item) => (
//                  <div key={item} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
//                    <div className="bg-gray-200 h-16 w-16 rounded-lg"></div>
//                    <div className="flex-1 space-y-2">
//                      <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
//                      <div className="bg-gray-200 h-3 w-2/3 rounded"></div>
//                    </div>
//                  </div>
//                ))}
//              </div>
//            ) : recentFarmhouses.length > 0 ? (
//              <div className="space-y-4">
//                {recentFarmhouses.map((farmhouse) => (
//                  <div key={farmhouse._id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
//                    <img
//                      src={farmhouse.images?.find(img => img.isPrimary)?.url || farmhouse.images?.[0]?.url || '/placeholder-farmhouse.jpg'}
//                      alt={farmhouse.name}
//                      className="h-16 w-16 object-cover rounded-lg"
//                    />
//                    <div className="flex-1">
//                      <h3 className="font-semibold text-gray-900">{farmhouse.name}</h3>
//                      <p className="text-gray-600 text-sm">
//                        {farmhouse.address?.city}, {farmhouse.address?.state}
//                      </p>
//                      <p className="text-green-600 font-medium">
//                        ₹{farmhouse.pricing?.basePrice?.toLocaleString()}/night
//                      </p>
//                    </div>
//                    <div className={`px-2 py-1 rounded-full text-xs ${farmhouse.isActive
//                      ? 'bg-green-100 text-green-800'
//                      : 'bg-red-100 text-red-800'
//                      }`}>
//                      {farmhouse.isActive ? 'Active' : 'Inactive'}
//                    </div>
//                  </div>
//                ))}
//              </div>
//            ) : (
//              <div className="text-center py-8">
//                <div className="text-4xl mb-4">🏡</div>
//                <p className="text-gray-500">No farmhouses found</p>
//                <p className="text-gray-400 text-sm mt-2">
//                  Get started by adding your first farmhouse listing.
//                </p>
//                <Link
//                  to="/owner/farmhouses"
//                  className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                >
//                  Add Farmhouse
//                </Link>
//              </div>
//            )}
//          </div>

//       </div>
//     </div>
//   );
// };

// export default OwnerDashboard; 

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerFarmhouses } from '../../store/slices/farmhouseSlice';
import { fetchActiveBookingsCount, fetchOwnerBookings, fetchOwnerRatings } from '../../store/slices/bookingSlice';
import axios from 'axios';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const { farmhouses, loading } = useSelector((state) => state.farmhouse);
  const { user } = useSelector((state) => state.auth);
  const { activeBookingsCount, loading: bookingsLoading, ownerRatings, ownerBookings } = useSelector((state) => state.booking);
  const [selectedFarmhouse, setSelectedFarmhouse] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState({});
  const [savingDates, setSavingDates] = useState(false);
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState('month'); // month, quarter, year
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Fetch owner's farmhouses when component mounts
  useEffect(() => {
    if (user?.role === 'owner' || user?.role === 'admin') {
      dispatch(fetchOwnerFarmhouses());
      dispatch(fetchActiveBookingsCount());
      dispatch(fetchOwnerRatings());
      dispatch(fetchOwnerBookings());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (farmhouses.length > 0) {
      dispatch(fetchActiveBookingsCount());
    }
  }, [dispatch, farmhouses.length]);

  // Calculate analytics when data changes
  useEffect(() => {
    if (ownerBookings && farmhouses.length > 0) {
      calculateAnalytics();
    }
  }, [ownerBookings, farmhouses, analyticsTimeRange]);

  const calculateAnalytics = () => {
    if (!ownerBookings || ownerBookings.length === 0) {
      setAnalyticsData(null);
      return;
    }

    const now = new Date();
    let startDate = new Date();

    switch (analyticsTimeRange) {
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    const filteredBookings = ownerBookings.filter(booking => 
      new Date(booking.createdAt) >= startDate
    );

    // Revenue calculations
    const totalRevenue = filteredBookings
      .filter(booking => booking.status === 'completed')
      .reduce((sum, booking) => sum + (booking.pricing?.totalAmount || 0), 0);

    const confirmedRevenue = filteredBookings
      .filter(booking => booking.status === 'confirmed')
      .reduce((sum, booking) => sum + (booking.pricing?.totalAmount || 0), 0);

    // Booking statistics
    const bookingStats = {
      total: filteredBookings.length,
      completed: filteredBookings.filter(b => b.status === 'completed').length,
      confirmed: filteredBookings.filter(b => b.status === 'confirmed').length,
      pending: filteredBookings.filter(b => b.status === 'pending').length,
      cancelled: filteredBookings.filter(b => b.status === 'cancelled').length,
      rejected: filteredBookings.filter(b => b.status === 'rejected').length,
    };

    // Occupancy rate (simplified)
    const totalNights = filteredBookings
      .filter(b => ['completed', 'confirmed'].includes(b.status))
      .reduce((sum, booking) => sum + (booking.pricing?.totalNights || 0), 0);

    const totalPossibleNights = farmhouses.length * 30; // Simplified calculation
    const occupancyRate = totalPossibleNights > 0 ? (totalNights / totalPossibleNights) * 100 : 0;

    // Popular farmhouses
    const farmhousePerformance = farmhouses.map(farmhouse => {
      const farmhouseBookings = filteredBookings.filter(b => b.farmhouse?._id === farmhouse._id);
      const farmhouseRevenue = farmhouseBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0);
      
      const farmhouseConfirmedRevenue = farmhouseBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0);
      
      return {
        id: farmhouse._id,
        name: farmhouse.name,
        bookings: farmhouseBookings.length,
        revenue: farmhouseRevenue + farmhouseConfirmedRevenue,
        completedBookings: farmhouseBookings.filter(b => b.status === 'completed').length,
        confirmedBookings: farmhouseBookings.filter(b => b.status === 'confirmed').length,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // Monthly trends (simplified)
    const monthlyData = [];
    for (let i = 0; i < 6; i++) {
      const month = new Date();
      month.setMonth(now.getMonth() - i);
      const monthKey = month.toLocaleString('default', { month: 'short' });
      
      const monthBookings = filteredBookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate.getMonth() === month.getMonth() && 
               bookingDate.getFullYear() === month.getFullYear();
      });
      
      const monthRevenue = monthBookings
        .filter(b => ['completed', 'confirmed'].includes(b.status))
        .reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0);

      monthlyData.unshift({
        month: monthKey,
        revenue: monthRevenue,
        bookings: monthBookings.length
      });
    }

    setAnalyticsData({
      totalRevenue,
      confirmedRevenue,
      bookingStats,
      occupancyRate,
      farmhousePerformance,
      monthlyData,
      timeRange: analyticsTimeRange
    });
  };

  // Calculate statistics
  const totalFarmhouses = farmhouses?.length || 0;
  const totalRevenue = farmhouses.reduce((total, farmhouse) => {
    return total + (farmhouse.pricing?.basePrice || 0);
  }, 0);
  const recentFarmhouses = farmhouses.slice(0, 3);

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  // Fetch blocked dates for selected farmhouse
  const fetchBlockedDates = async (farmhouseId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bookings/farmhouse/${farmhouseId}/blocked-dates`
      );

      // Convert blocked dates to the format expected by the calendar
      const blockedDatesMap = {};
      response.data.blockedDates.forEach(blocked => {
        const dateString = new Date(blocked.date).toISOString().split('T')[0];
        blockedDatesMap[dateString] = true;
      });

      setAvailabilityData(prev => ({
        ...prev,
        [farmhouseId]: blockedDatesMap
      }));
    } catch (error) {
      console.error('Failed to fetch blocked dates:', error);
    }
  };

  // Toggle date availability
  const toggleDateAvailability = async (date) => {
    if (!selectedFarmhouse || savingDates) return;

    const dateString = date.toISOString().split('T')[0];
    const isCurrentlyBlocked = availabilityData[selectedFarmhouse]?.[dateString];
    const action = isCurrentlyBlocked ? 'unblock' : 'block';

    setSavingDates(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/bookings/farmhouse/${selectedFarmhouse}/blocked-dates`,
        { dates: [dateString], action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state only after successful API call
      setAvailabilityData(prev => ({
        ...prev,
        [selectedFarmhouse]: {
          ...prev[selectedFarmhouse],
          [dateString]: !isCurrentlyBlocked
        }
      }));
    } catch (error) {
      console.error('Failed to update blocked date:', error);
      alert('Failed to update date availability: ' + (error.response?.data?.message || error.message));
    } finally {
      setSavingDates(false);
    }
  };

  // Bulk update dates
  const bulkUpdateDates = async (datesToUpdate, action) => {
    if (!selectedFarmhouse || savingDates) return;

    setSavingDates(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/bookings/farmhouse/${selectedFarmhouse}/blocked-dates`,
        { dates: datesToUpdate, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh the blocked dates after bulk operation
      await fetchBlockedDates(selectedFarmhouse);
    } catch (error) {
      console.error('Failed to bulk update dates:', error);
      alert('Failed to update dates: ' + (error.response?.data?.message || error.message));
    } finally {
      setSavingDates(false);
    }
  };

  const getDateStatus = (date) => {
    if (!selectedFarmhouse) return 'available';
    const dateString = date.toISOString().split('T')[0];
    return availabilityData[selectedFarmhouse]?.[dateString] ? 'blocked' : 'available';
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Update the farmhouse selection to fetch blocked dates
  useEffect(() => {
    if (selectedFarmhouse) {
      fetchBlockedDates(selectedFarmhouse);
    }
  }, [selectedFarmhouse]);

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const status = getDateStatus(date);
      const today = isToday(date);
      const pastDate = isPastDate(date);

      days.push(
        <button
          key={day}
          onClick={() => !pastDate && !savingDates && toggleDateAvailability(date)}
          disabled={pastDate || savingDates}
          className={`
            h-12 flex items-center justify-center rounded-lg border transition-all
            ${today ? 'border-green-500 bg-green-50' : 'border-gray-200'}
            ${pastDate ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
            ${status === 'blocked' ? 'bg-red-100 border-red-300 text-red-700' : 'bg-white'}
            ${!pastDate && !savingDates && 'hover:shadow-sm'}
            ${savingDates ? 'opacity-50' : ''}
          `}
        >
          <div className="text-center">
            <div className={`font-medium ${today ? 'text-green-700' : ''}`}>{day}</div>
            {status === 'blocked' && !pastDate && (
              <div className="text-xs text-red-600 mt-1">Blocked</div>
            )}
          </div>
        </button>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Availability Calendar</h3>
          <div className="flex items-center space-x-4">
            <select
              value={selectedFarmhouse}
              onChange={(e) => setSelectedFarmhouse(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={savingDates}
            >
              <option value="">Select Farmhouse</option>
              {farmhouses.map(farmhouse => (
                <option key={farmhouse._id} value={farmhouse._id}>
                  {farmhouse.name}
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={savingDates}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="font-semibold text-gray-900 min-w-[140px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={savingDates}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {!selectedFarmhouse ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-gray-500 mb-2">Select a farmhouse to manage availability</p>
            <p className="text-gray-400 text-sm">Choose a farmhouse from the dropdown to block or unblock dates</p>
          </div>
        ) : (
          <>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {days}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-sm text-gray-600">Blocked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-50 border border-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Today</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-sm text-gray-600">Past Date</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {savingDates ? 'Saving changes...' : 'Click on dates to toggle availability'}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    // Block weekends for current month
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth();
                    const daysInMonth = getDaysInMonth(currentDate);
                    
                    const weekendDates = [];
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day);
                      if ((date.getDay() === 0 || date.getDay() === 6) && !isPastDate(date)) {
                        weekendDates.push(date.toISOString().split('T')[0]);
                      }
                    }
                    
                    if (weekendDates.length > 0) {
                      await bulkUpdateDates(weekendDates, 'block');
                    }
                  }}
                  disabled={savingDates}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  Block Weekends
                </button>
                <button
                  onClick={async () => {
                    // Clear all blocks for current month
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth();
                    const daysInMonth = getDaysInMonth(currentDate);
                    
                    const allDates = [];
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day);
                      if (!isPastDate(date)) {
                        allDates.push(date.toISOString().split('T')[0]);
                      }
                    }
                    
                    if (allDates.length > 0) {
                      await bulkUpdateDates(allDates, 'unblock');
                    }
                  }}
                  disabled={savingDates}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  Clear All Blocks
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderAnalyticsSection = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 rounded-lg">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 ml-4">Business Analytics</h3>
        </div>
        
        {/* Time Range Selector */}
        <select
          value={analyticsTimeRange}
          onChange={(e) => setAnalyticsTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {!analyticsData ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading analytics data...</p>
          <p className="text-gray-400 text-sm mt-2">We're crunching the numbers for you</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ₹{(analyticsData.totalRevenue + analyticsData.confirmedRevenue).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Revenue</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {analyticsData.bookingStats.total}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Bookings</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(analyticsData.occupancyRate)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Occupancy Rate</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {ownerRatings?.overallRating || '0.0'}
              </div>
              <div className="text-sm text-gray-600 mt-1">Avg Rating</div>
            </div>
          </div>

          {/* Booking Status Distribution */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Booking Status Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { status: 'Completed', count: analyticsData.bookingStats.completed, color: 'bg-green-100 text-green-800 border-green-200' },
                { status: 'Confirmed', count: analyticsData.bookingStats.confirmed, color: 'bg-blue-100 text-blue-800 border-blue-200' },
                { status: 'Pending', count: analyticsData.bookingStats.pending, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                { status: 'Cancelled', count: analyticsData.bookingStats.cancelled, color: 'bg-red-100 text-red-800 border-red-200' }
              ].map((item, index) => (
                <div key={index} className={`p-3 rounded-lg text-center border ${item.color}`}>
                  <div className="text-lg font-bold">{item.count}</div>
                  <div className="text-sm">{item.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Farmhouses */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Top Performing Farmhouses</h4>
            <div className="space-y-3">
              {analyticsData.farmhousePerformance.slice(0, 3).map((farmhouse, index) => (
                <div key={farmhouse.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-500' : 'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{farmhouse.name}</span>
                      <div className="text-sm text-gray-500">
                        {farmhouse.completedBookings} completed • {farmhouse.confirmedBookings} upcoming
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{farmhouse.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{farmhouse.bookings} total bookings</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Completed Revenue</span>
                <span className="font-semibold text-green-600">
                  ₹{analyticsData.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">From {analyticsData.bookingStats.completed} completed bookings</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Upcoming Revenue</span>
                <span className="font-semibold text-blue-600">
                  ₹{analyticsData.confirmedRevenue.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">From {analyticsData.bookingStats.confirmed} confirmed bookings</div>
            </div>
          </div>

          {/* Monthly Trends */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Revenue Trend (Last 6 Months)</h4>
            <div className="space-y-2">
              {analyticsData.monthlyData.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-2 border-b">
                  <span className="font-medium text-gray-700">{month.month}</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{month.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{month.bookings} bookings</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <button 
              onClick={() => setShowAnalytics(false)}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Back to Dashboard
            </button>
            <button className="flex-1 border border-purple-600 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium">
              Export Report
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your farmhouses and bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">🏡</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Farmhouses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    totalFarmhouses
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookingsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    activeBookingsCount
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  ) : (
                    `₹${totalRevenue.toLocaleString()}`
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Show either Calendar or Analytics based on state */}
        {!showAnalytics ? (
          <>
            {/* Calendar Section */}
            <div className="mb-8">
              {renderCalendar()}
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Manage Farmhouses Card */}
              <Link
                to="/owner/farmhouses"
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-green-300 group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl">🏡</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 ml-4">Manage Farmhouses</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Add, edit, or remove your farmhouse listings. Update availability and pricing.
                </p>
                <div className="flex items-center text-green-600 font-medium">
                  <span>View Farmhouses</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* Bookings Management */}
              <Link
                to="/owner/bookings"
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-blue-300 group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 ml-4">Bookings</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  View and manage all bookings for your farmhouses. Confirm or cancel reservations.
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Manage Bookings</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* Analytics Card - Now clickable */}
              <div
                onClick={() => setShowAnalytics(true)}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-purple-300 group cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 ml-4">Analytics</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  View performance metrics, revenue reports, and booking trends for your properties.
                </p>
                <div className="flex items-center text-purple-600 font-medium">
                  <span>View Analytics</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Reviews */}
              <Link
                to="/owner/reviews"
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-yellow-300 group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 ml-4">Reviews</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Read and respond to guest reviews. Monitor your farmhouse ratings.
                </p>
                <div className="flex items-center text-yellow-600 font-medium">
                  <span>View Reviews</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>

              {/* Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 ml-4">Settings</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Configure your account settings, payment methods, and notification preferences.
                </p>
                <button className="text-gray-600 font-medium opacity-50 cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Analytics Section when clicked */
          <div className="mb-8">
            {renderAnalyticsSection()}
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Farmhouses</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="bg-gray-200 h-16 w-16 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-gray-200 h-4 w-1/3 rounded"></div>
                    <div className="bg-gray-200 h-3 w-2/3 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentFarmhouses.length > 0 ? (
            <div className="space-y-4">
              {recentFarmhouses.map((farmhouse) => (
                <div key={farmhouse._id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src={farmhouse.images?.find(img => img.isPrimary)?.url || farmhouse.images?.[0]?.url || '/placeholder-farmhouse.jpg'}
                    alt={farmhouse.name}
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{farmhouse.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {farmhouse.address?.city}, {farmhouse.address?.state}
                    </p>
                    <p className="text-green-600 font-medium">
                      ₹{farmhouse.pricing?.basePrice?.toLocaleString()}/night
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${farmhouse.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {farmhouse.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏡</div>
              <p className="text-gray-500">No farmhouses found</p>
              <p className="text-gray-400 text-sm mt-2">
                Get started by adding your first farmhouse listing.
              </p>
              <Link
                to="/owner/farmhouses"
                className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Farmhouse
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;