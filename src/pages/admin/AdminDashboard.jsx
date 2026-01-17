 
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingFarmhouses, approveFarmhouse, rejectFarmhouse, fetchFarmhouses, deleteFarmhouse } from '../../store/slices/farmhouseSlice';
import { fetchAdminStatistics, fetchAllUsers, updateUserRole, deleteUser } from '../../store/slices/adminSlice';
import { fetchAdminBookings, fetchOwnerBookings } from '../../store/slices/bookingSlice';
import { FaCheck, FaTimes, FaClock, FaHome, FaUsers, FaCalendarCheck, FaChartLine, FaSync, FaEdit, FaTrash, FaArrowLeft, FaSearch, FaCalendar, FaStar } from 'react-icons/fa';

// User Management Component
const UserManagement = ({ onClose }) => {
  const dispatch = useDispatch();
  const { users, usersLoading, usersError, usersTotalPages, usersCurrentPage, usersTotal } = useSelector(state => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    dispatch(fetchAllUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(fetchAllUsers({
      page: 1,
      limit: 10,
      search: searchTerm,
      role: roleFilter
    }));
  };

  const handleUpdateRole = async (userId) => {
    if (!newRole) return;

    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      setEditingUser(null);
      setNewRole('');
      dispatch(fetchAllUsers({ page: usersCurrentPage, limit: 10 }));
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        dispatch(fetchAllUsers({ page: usersCurrentPage, limit: 10 }));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const loadPage = (page) => {
    dispatch(fetchAllUsers({
      page,
      limit: 10,
      search: searchTerm,
      role: roleFilter
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <button onClick={onClose} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <FaArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">User Management</h2>
              <p className="text-sm text-gray-600">Manage all platform users</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Total: {usersTotal} users
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="p-4 sm:p-6 overflow-x-auto">
        {usersError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {usersError}
          </div>
        )}

        {usersLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <FaUsers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <>
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs sm:text-sm">
                  <th className="py-3 px-2 sm:px-4 font-medium text-gray-700">User</th>
                  <th className="py-3 px-2 sm:px-4 font-medium text-gray-700">Email</th>
                  <th className="py-3 px-2 sm:px-4 font-medium text-gray-700">Phone</th>
                  <th className="py-3 px-2 sm:px-4 font-medium text-gray-700">Role</th>
                  <th className="py-3 px-2 sm:px-4 font-medium text-gray-700">Joined</th>
                  <th className="py-3 px-2 sm:px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 sm:px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-medium text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3 truncate">
                          <p className="font-medium text-gray-900 truncate">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{user.email}</td>
                    <td className="py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm">{user.phone || 'N/A'}</td>
                    <td className="py-3 px-2 sm:px-4">
                      {editingUser === user._id ? (
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm"
                        >
                          <option value="user">User</option>
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'owner' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                          }`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      <div className="flex space-x-1 sm:space-x-2">
                        {editingUser === user._id ? (
                          <>
                            <button
                              onClick={() => handleUpdateRole(user._id)}
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <FaCheck className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="p-1 text-gray-600 hover:text-gray-800"
                            >
                              <FaTimes className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingUser(user._id);
                                setNewRole(user.role);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id, user.name)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {usersTotalPages > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {Array.from({ length: usersTotalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => loadPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm ${page === usersCurrentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Farmhouse Management Component
const FarmhouseManagement = ({ onClose }) => {
  const dispatch = useDispatch();
  const { farmhouses, loading: farmhousesLoading, error: farmhousesError, totalPages, currentPage, total } = useSelector(state => state.farmhouse);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchFarmhouses({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(fetchFarmhouses({
      page: 1,
      limit: 10,
      search: searchTerm,
      approvalStatus: statusFilter
    }));
  };

  const handleDeleteFarmhouse = async (farmhouseId, farmhouseName) => {
    if (window.confirm(`Are you sure you want to delete farmhouse "${farmhouseName}"? This action cannot be undone.`)) {
      try {
        await dispatch(deleteFarmhouse(farmhouseId)).unwrap();
        dispatch(fetchFarmhouses({
          page: currentPage,
          limit: 10,
          search: searchTerm,
          approvalStatus: statusFilter
        }));
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Failed to delete farmhouse:', error);
        alert(`Failed to delete farmhouse: ${error.message || 'Please try again'}`);
      }
    }
  };

  const loadPage = (page) => {
    dispatch(fetchFarmhouses({
      page,
      limit: 10,
      search: searchTerm,
      approvalStatus: statusFilter
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'approved': { color: 'green', text: 'Approved' },
      'pending': { color: 'yellow', text: 'Pending' },
      'rejected': { color: 'red', text: 'Rejected' }
    };

    const config = statusConfig[status] || { color: 'gray', text: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <button onClick={onClose} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <FaArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Farmhouse Management</h2>
              <p className="text-sm text-gray-600">Manage all farmhouse listings</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Total: {total} farmhouses
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search farmhouses by name, city, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Farmhouses List */}
      <div className="p-4 sm:p-6">
        {farmhousesError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {farmhousesError}
          </div>
        )}

        {farmhousesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading farmhouses...</p>
          </div>
        ) : farmhouses.length === 0 ? (
          <div className="text-center py-8">
            <FaHome className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No farmhouses found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || statusFilter ? 'Try adjusting your search criteria' : 'No farmhouses have been created yet'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {farmhouses.map((farmhouse) => (
                <div key={farmhouse._id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <img
                            src={farmhouse.images?.[0]?.url || '/api/placeholder/200/150'}
                            alt={farmhouse.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                  {farmhouse.name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {getStatusBadge(farmhouse.approvalStatus)}
                                  {farmhouse.featured && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                      Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl sm:text-2xl font-bold text-green-600">
                                  ₹{farmhouse.pricing?.basePrice?.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">per night</p>
                              </div>
                            </div>

                            <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                              {farmhouse.description}
                            </p>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                              <div>
                                <span className="font-medium text-gray-700">Location:</span>
                                <p className="truncate">{farmhouse.address?.city}, {farmhouse.address?.state}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Owner:</span>
                                <p className="truncate">{farmhouse.owner?.name || 'N/A'}</p>
                                <p className="text-xs text-gray-500 truncate">{farmhouse.owner?.email || ''}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Contact:</span>
                                <p>{farmhouse.contact?.phone || 'N/A'}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Created:</span>
                                <p>{new Date(farmhouse.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>

                            {/* Amenities */}
                            {farmhouse.amenities && farmhouse.amenities.length > 0 && (
                              <div className="mt-3">
                                <span className="font-medium text-gray-700 text-sm">Amenities:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {farmhouse.amenities.slice(0, 4).map((amenity, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                      {amenity.name}
                                    </span>
                                  ))}
                                  {farmhouse.amenities.length > 4 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                                      +{farmhouse.amenities.length - 4} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Rooms */}
                            {farmhouse.rooms && farmhouse.rooms.length > 0 && (
                              <div className="mt-3">
                                <span className="font-medium text-gray-700 text-sm">Rooms:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {farmhouse.rooms.map((room, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                      {room.type} (₹{room.pricePerNight}/night)
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col gap-2 lg:w-32">
                          <button
                            onClick={() => alert('Edit functionality coming soon!')}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                          >
                            <FaEdit className="h-3 w-3 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFarmhouse(farmhouse._id, farmhouse.name)}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center"
                          >
                            <FaTrash className="h-3 w-3 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => loadPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm ${page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Booking Management Component
const BookingManagement = ({ onClose }) => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.booking);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAdminBookings());
  }, [dispatch]);

  const completedBookings = bookings.filter(booking => booking.status === 'completed');
  const filteredBookings = completedBookings.filter(booking =>
    booking.farmhouse?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <button onClick={onClose} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <FaArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Completed Bookings</h2>
              <p className="text-sm text-gray-600">All completed bookings across the platform</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Showing: {filteredBookings.length} of {completedBookings.length} completed
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col gap-3">
          <div className="relative flex-1 max-w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by farmhouse, guest name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">
            Total bookings in system: {bookings.length}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="p-4 sm:p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            <strong>Error loading bookings:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading all bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendarCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No completed bookings found</p>
            <p className="text-gray-400 mt-2">
              {searchTerm ? 'Try adjusting your search criteria' : 'There are no completed bookings in the system yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <img
                      src={booking.farmhouse?.images?.[0]?.url || '/api/placeholder/120/90'}
                      alt={booking.farmhouse?.name}
                      className="w-full sm:w-32 sm:h-32 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                            {booking.farmhouse?.name || 'Unknown Farmhouse'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                            <span className="flex items-center">
                              <FaCalendar className="h-4 w-4 mr-1" />
                              {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                            </span>
                            <span className="flex items-center">
                              <FaUsers className="h-4 w-4 mr-1" />
                              {booking.guests?.adults || 0} adults
                              {booking.guests?.children ? `, ${booking.guests.children} children` : ''}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl sm:text-2xl font-bold text-green-600">
                            {formatCurrency(booking.pricing?.totalAmount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.pricing?.totalNights || 0} night{booking.pricing?.totalNights !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium text-gray-700">Guest:</span>
                          <p>{booking.user?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{booking.user?.email || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Room Type:</span>
                          <p className="capitalize">{booking.room?.type || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Contact:</span>
                          <p className="text-sm">
                            {booking.contactInfo?.phone && booking.contactInfo.phone !== '0000'
                              ? booking.contactInfo.phone
                              : booking.user?.phone && booking.user.phone !== '0000'
                                ? booking.user.phone
                                : 'Not provided'
                            }
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 text-sm">
                        <span className="font-medium text-gray-700">Booking ID: </span>
                        <span className="text-gray-600 font-mono">{booking._id}</span>
                      </div>

                      {booking.specialRequests && (
                        <div className="mt-3 text-sm">
                          <span className="font-medium text-gray-700">Special Requests:</span>
                          <p className="text-gray-600 mt-1">{booking.specialRequests}</p>
                        </div>
                      )}

                      {booking.review ? (
                        <div className="mt-3 flex items-center text-sm">
                          <span className="font-medium text-gray-700 mr-2">Guest Review: </span>
                          <FaStar className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-gray-700">
                            {booking.review.rating}/5
                          </span>
                          {booking.review.comment && (
                            <span className="text-gray-500 ml-2">
                              - "{booking.review.comment}"
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3 text-sm text-gray-500">No review submitted</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main AdminDashboard Component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedFarmhouse, setSelectedFarmhouse] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeManagement, setActiveManagement] = useState(null);

  const dispatch = useDispatch();
  const { pendingFarmhouses, loading: farmhousesLoading } = useSelector(state => state.farmhouse);
  const { adminStats, loading: statsLoading, error } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStatistics());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'approvals') {
      dispatch(fetchPendingFarmhouses());
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (!farmhousesLoading) {
      dispatch(fetchAdminStatistics());
    }
  }, [farmhousesLoading, dispatch]);

  const handleRefreshStats = () => {
    dispatch(fetchAdminStatistics());
  };

  const handleStatCardClick = (type) => {
    setActiveManagement(type);
    setActiveTab('overview');
  };

  const handleCloseManagement = () => {
    setActiveManagement(null);
    dispatch(fetchAdminStatistics());
  };

  const handleApprove = async (farmhouseId) => {
    try {
      await dispatch(approveFarmhouse(farmhouseId)).unwrap();
      dispatch(fetchPendingFarmhouses());
      dispatch(fetchAdminStatistics());
      alert('Farmhouse approved successfully!');
    } catch (error) {
      console.error('Failed to approve farmhouse:', error);
      alert(`Failed to approve farmhouse: ${error.message || 'Please try again'}`);
    }
  };

  const handleReject = async () => {
    if (!selectedFarmhouse || !rejectionReason.trim()) return;

    try {
      await dispatch(rejectFarmhouse({
        id: selectedFarmhouse._id,
        rejectionReason
      })).unwrap();

      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedFarmhouse(null);
      dispatch(fetchPendingFarmhouses());
      dispatch(fetchAdminStatistics());
      alert('Farmhouse rejected successfully!');
    } catch (error) {
      console.error('Failed to reject farmhouse:', error);
      alert(`Failed to reject farmhouse: ${error.message || 'Please try again'}`);
    }
  };

  const openRejectModal = (farmhouse) => {
    setSelectedFarmhouse(farmhouse);
    setShowRejectModal(true);
  };

  if (activeManagement === 'users') return <UserManagement onClose={handleCloseManagement} />;
  if (activeManagement === 'farmhouses') return <FarmhouseManagement onClose={handleCloseManagement} />;
  if (activeManagement === 'bookings') return <BookingManagement onClose={handleCloseManagement} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage platform statistics and farmhouse approvals</p>
          </div>
          <button
            onClick={handleRefreshStats}
            disabled={statsLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
          >
            <FaSync className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
            {statsLoading ? 'Refreshing...' : 'Refresh Stats'}
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div onClick={() => handleStatCardClick('users')} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-3 sm:mr-4">
                  <FaUsers className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Total Users</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mt-1"></div>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {adminStats?.totalUsers?.toLocaleString() || 0}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-blue-600 font-medium">
              Click to manage users →
            </div>
          </div>

          <div onClick={() => handleStatCardClick('farmhouses')} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-3 sm:mr-4">
                  <FaHome className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Total Farmhouses</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mt-1"></div>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {adminStats?.totalFarmhouses?.toLocaleString() || 0}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-green-600 font-medium">
              Click to manage farmhouses →
            </div>
          </div>

          <div onClick={() => handleStatCardClick('bookings')} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-3 sm:mr-4">
                  <FaCalendarCheck className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Total Bookings</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mt-1"></div>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {adminStats?.totalBookings?.toLocaleString() || 0}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-purple-600 font-medium">
              Click to manage bookings →
            </div>
          </div>

          <div onClick={() => setActiveTab('approvals')} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border-l-4 border-yellow-500 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg mr-3 sm:mr-4">
                  <FaClock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Pending Approvals</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mt-1"></div>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {adminStats?.pendingApprovals?.toLocaleString() || 0}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-yellow-600 font-medium">
              Click to review approvals →
            </div>
          </div>
        </div>

            {/* Error Display */}
      {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <FaTimes className="h-5 w-5 mr-2" />
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
               <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <FaChartLine className="h-4 w-4 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('approvals')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${activeTab === 'approvals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Pending Approvals
                {adminStats?.pendingApprovals > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    {adminStats.pendingApprovals}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
         {/* Tab Content */}
         {activeTab === 'overview' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Current Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="text-gray-600">Registered Users</span>
                    <span className="font-bold text-blue-600">{adminStats?.totalUsers?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="text-gray-600">Farmhouse Listings</span>
                    <span className="font-bold text-green-600">{adminStats?.totalFarmhouses?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="font-bold text-purple-600">{adminStats?.totalBookings?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="text-gray-600">Pending Approvals</span>
                    <span className="font-bold text-yellow-600">{adminStats?.pendingApprovals?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaClock className="h-5 w-5 text-yellow-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Review Pending Approvals</p>
                        <p className="text-sm text-gray-500">
                          {adminStats?.pendingApprovals || 0} farmhouse(s) waiting for review
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleStatCardClick('users')}
                    className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                  >
                    <div className="flex items-center">
                      <FaUsers className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Manage Users</p>
                        <p className="text-sm text-gray-500">View and manage user accounts</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleRefreshStats}
                    disabled={statsLoading}
                    className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center">
                      <FaSync className={`h-5 w-5 text-purple-500 mr-3 ${statsLoading ? 'animate-spin' : ''}`} />
                      <div>
                        <p className="font-medium text-gray-900">Refresh Statistics</p>
                        <p className="text-sm text-gray-500">Update dashboard with latest data</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Pending Farmhouse Approvals</h2>
                  <p className="text-gray-600 mt-1">Review and approve new farmhouse listings submitted by owners.</p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <span className="text-sm text-gray-500">
                    Showing {pendingFarmhouses.length} of {adminStats?.pendingApprovals || 0} pending
                  </span>
                </div>
              </div>
            </div>

            {farmhousesLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading pending farmhouses...</p>
              </div>
            ) : pendingFarmhouses.length === 0 ? (
              <div className="p-12 text-center">
                <FaCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No pending approvals</p>
                <p className="text-gray-400 mt-2">All farmhouse submissions have been reviewed and processed.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pendingFarmhouses.map((farmhouse) => (
                  <div key={farmhouse._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <img
                          src={farmhouse.images?.[0]?.url || '/api/placeholder/150/150'}
                          alt={farmhouse.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {farmhouse.name}
                          </h3>
                          <p className="text-gray-600 mt-1 line-clamp-2">
                            {farmhouse.description}
                          </p>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500">
                            <div>
                              <span className="font-medium">Location:</span> {farmhouse.address?.city}, {farmhouse.address?.state}
                            </div>
                            <div>
                              <span className="font-medium">Owner:</span> {farmhouse.owner?.name} ({farmhouse.owner?.email})
                            </div>
                            <div>
                              <span className="font-medium">Price:</span> ₹{farmhouse.pricing?.basePrice?.toLocaleString()}/night
                            </div>
                            <div>
                              <span className="font-medium">Submitted:</span> {new Date(farmhouse.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs font-mono bg-gray-100 p-1 rounded inline-block">
                              <span className="font-medium">ID:</span> {farmhouse._id}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4 lg:w-48">
                        <button
                          onClick={() => handleApprove(farmhouse._id)}
                          disabled={farmhousesLoading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center disabled:opacity-50"
                        >
                          <FaCheck className="h-4 w-4 mr-2" />
                          {farmhousesLoading ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => openRejectModal(farmhouse)}
                          disabled={farmhousesLoading}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center disabled:opacity-50"
                        >
                          <FaTimes className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      {/* Reject Modal */}
         {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reject Farmhouse
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to reject "<span className="font-medium">{selectedFarmhouse?.name}</span>"? The owner will be notified.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a clear reason for rejecting this farmhouse..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows="3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setSelectedFarmhouse(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || farmhousesLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {farmhousesLoading ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;