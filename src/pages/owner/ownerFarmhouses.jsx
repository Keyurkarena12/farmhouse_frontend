import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOwnerFarmhouses,
  createFarmhouse,
  updateFarmhouse,
  deleteFarmhouse,
  clearError,
} from "../../store/slices/farmhouseSlice";
import { toast } from "react-toastify";

const OwnerFarmhouses = () => {
  const dispatch = useDispatch();
  const { farmhouses, loading, error } = useSelector((state) => state.farmhouse);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    },
    pricing: {
      basePrice: ""
    },
    contact: {
      phone: "",
      email: ""
    },
    images: [],
    rooms: [],
    amenities: []
  });
  const [editId, setEditId] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  // Room management
  const [currentRoom, setCurrentRoom] = useState({
    type: "single",
    name: "",
    capacity: 1,
    pricePerNight: "",
    description: "",
    amenities: []
  });

  // Amenity management
  const [currentAmenity, setCurrentAmenity] = useState({
    name: "",
    icon: "",
    category: "basic"
  });

  const isOwner = user?.role === 'owner' || user?.role === 'admin';

  useEffect(() => {
    if (isOwner) {
      dispatch(fetchOwnerFarmhouses());
    }
  }, [dispatch, isOwner]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Room type options based on your schema
  const roomTypes = [
    { value: "single", label: "Single Room" },
    { value: "double", label: "Double Room" },
    { value: "family", label: "Family Room" },
    { value: "suite", label: "Suite" },
    { value: "villa", label: "Villa" }
  ];

  // Amenity categories
  const amenityCategories = [
    { value: "basic", label: "Basic" },
    { value: "comfort", label: "Comfort" },
    { value: "luxury", label: "Luxury" },
    { value: "outdoor", label: "Outdoor" },
    { value: "kitchen", label: "Kitchen" },
    { value: "bathroom", label: "Bathroom" }
  ];

  // Common amenities for quick add
  const commonAmenities = [
    { name: "Free Wi-Fi", icon: "📶", category: "basic" },
    { name: "Swimming Pool", icon: "🏊", category: "luxury" },
    { name: "Parking", icon: "🅿️", category: "basic" },
    { name: "Air Conditioning", icon: "❄️", category: "comfort" },
    { name: "Restaurant", icon: "🍽️", category: "comfort" },
    { name: "Garden", icon: "🌳", category: "outdoor" },
    { name: "BBQ Area", icon: "🔥", category: "outdoor" },
    { name: "Room Service", icon: "🛎️", category: "luxury" },
    { name: "TV", icon: "📺", category: "comfort" },
    { name: "Hot Water", icon: "🚿", category: "basic" }
  ];

  if (!isOwner) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You need to be a farmhouse owner to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const openModal = (farmhouse = null) => {
    console.log('🔄 openModal called with:', {
      farmhouse,
      user,
      hasFarmhouse: !!farmhouse,
      farmhouseId: farmhouse?._id,
      farmhouseOwner: farmhouse?.owner,
      userId: user?.id, // ✅ FIXED: Using id instead of _id
      userRole: user?.role
    });

    if (farmhouse) {
      // ✅ FIXED: Use user.id instead of user._id
      const isOwnFarmhouse = farmhouse.owner?._id === user?.id ||
        farmhouse.owner?._id?.toString() === user?.id?.toString();

      console.log('🔍 Ownership check:', {
        isOwnFarmhouse,
        farmhouseOwnerId: farmhouse.owner?._id,
        userId: user?.id, // ✅ FIXED: Using id instead of _id
        userRole: user?.role,
        stringComparison: farmhouse.owner?._id?.toString() === user?.id?.toString()
      });

      if (!isOwnFarmhouse && user?.role !== 'admin') {
        console.log('❌ Ownership check failed');
        toast.error("You can only edit your own farmhouses");
        return;
      }

      console.log('✅ Ownership check passed, opening edit modal');
      setIsEditing(true);
      setEditId(farmhouse._id);

      setFormData({
        name: farmhouse.name || "",
        description: farmhouse.description || "",
        address: {
          street: farmhouse.address?.street || "",
          city: farmhouse.address?.city || "",
          state: farmhouse.address?.state || "",
          zipCode: farmhouse.address?.zipCode || "",
          country: farmhouse.address?.country || "India"
        },
        pricing: {
          basePrice: farmhouse.pricing?.basePrice || ""
        },
        contact: {
          phone: farmhouse.contact?.phone || "",
          email: farmhouse.contact?.email || ""
        },
        images: farmhouse.images || [],
        rooms: farmhouse.rooms || [],
        amenities: farmhouse.amenities || []
      });
    } else {
      console.log('➕ Opening create modal');
      setIsEditing(false);
      setEditId(null);
      setFormData({
        name: "",
        description: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "India"
        },
        pricing: {
          basePrice: ""
        },
        contact: {
          phone: "",
          email: ""
        },
        images: [],
        rooms: [],
        amenities: []
      });
    }

    setCurrentImageUrl("");
    setCurrentRoom({
      type: "single",
      name: "",
      capacity: 1,
      pricePerNight: "",
      description: "",
      amenities: []
    });
    setCurrentAmenity({
      name: "",
      icon: "",
      category: "basic"
    });

    console.log('🎯 Setting modal open to true');
    setIsModalOpen(true);
    console.log('✅ Modal should be open now');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Room Management Functions
  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoom(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'pricePerNight' ? Number(value) : value
    }));
  };

  const addRoom = () => {
    if (!currentRoom.name.trim()) {
      toast.error("Room name is required");
      return;
    }
    if (!currentRoom.pricePerNight || currentRoom.pricePerNight <= 0) {
      toast.error("Valid price per night is required");
      return;
    }

    const newRoom = {
      type: currentRoom.type,
      name: currentRoom.name.trim(),
      capacity: currentRoom.capacity,
      pricePerNight: currentRoom.pricePerNight,
      description: currentRoom.description || "",
      amenities: currentRoom.amenities,
      isAvailable: true
    };

    setFormData(prev => ({
      ...prev,
      rooms: [...prev.rooms, newRoom]
    }));

    setCurrentRoom({
      type: "single",
      name: "",
      capacity: 1,
      pricePerNight: "",
      description: "",
      amenities: []
    });

    toast.success("Room added successfully!");
  };

  const removeRoom = (index) => {
    const newRooms = [...formData.rooms];
    newRooms.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      rooms: newRooms
    }));
  };

  // Amenity Management Functions
  const handleAmenityChange = (e) => {
    const { name, value } = e.target;
    setCurrentAmenity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addAmenity = () => {
    if (!currentAmenity.name.trim()) {
      toast.error("Amenity name is required");
      return;
    }

    const newAmenity = {
      name: currentAmenity.name.trim(),
      icon: currentAmenity.icon || "🏠",
      category: currentAmenity.category
    };

    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, newAmenity]
    }));

    setCurrentAmenity({
      name: "",
      icon: "",
      category: "basic"
    });

    toast.success("Amenity added successfully!");
  };

  const addCommonAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, amenity]
    }));
    toast.success(`Added ${amenity.name}`);
  };

  const removeAmenity = (index) => {
    const newAmenities = [...formData.amenities];
    newAmenities.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      amenities: newAmenities
    }));
  };

  // Image Management Functions
  const addImage = () => {
    if (!currentImageUrl.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }

    const newImage = {
      url: currentImageUrl,
      alt: formData.name || "Farmhouse image",
      isPrimary: formData.images.length === 0
    };

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImage]
    }));

    setCurrentImageUrl("");
    toast.success("Image added successfully!");
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);

    if (newImages.length > 0 && index === 0) {
      newImages[0].isPrimary = true;
    }

    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const setPrimaryImage = (index) => {
    const newImages = formData.images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));

    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enhanced validation
    if (!formData.name?.trim()) {
      toast.error("Farmhouse name is required");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.address?.city?.trim()) {
      toast.error("City is required");
      return;
    }
    if (!formData.address?.state?.trim()) {
      toast.error("State is required");
      return;
    }
    if (!formData.pricing?.basePrice || isNaN(formData.pricing.basePrice) || Number(formData.pricing.basePrice) <= 0) {
      toast.error("Valid base price is required");
      return;
    }
    if (formData.images.length === 0) {
      toast.error("At least one image is required");
      return;
    }
    if (formData.rooms.length === 0) {
      toast.error("At least one room type is required");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      address: {
        street: formData.address.street?.trim() || "Not specified",
        city: formData.address.city.trim(),
        state: formData.address.state.trim(),
        zipCode: formData.address.zipCode?.trim() || "000000",
        country: formData.address.country || "India"
      },
      location: {
        latitude: 0,
        longitude: 0
      },
      images: formData.images.map(img => ({
        url: img.url,
        alt: img.alt || "Farmhouse image",
        isPrimary: img.isPrimary
      })),
      rooms: formData.rooms,
      amenities: formData.amenities,
      pricing: {
        basePrice: Number(formData.pricing.basePrice),
        weekendMultiplier: 1.2,
        holidayMultiplier: 1.5,
        cleaningFee: 0,
        securityDeposit: 0
      },
      contact: {
        phone: formData.contact.phone?.trim() || "+91-0000000000",
        email: formData.contact.email?.trim() || "owner@example.com"
      },
      availability: {
        checkInTime: "15:00",
        checkOutTime: "11:00",
        minimumStay: 1,
        maximumStay: 30,
        advanceBookingDays: 365,
        blockedDates: []
      },
      policies: {
        cancellation: {
          freeCancellation: true,
          freeCancellationDays: 7,
          partialRefundDays: 3
        },
        houseRules: ["No smoking", "No pets", "Check-in after 3 PM"],
        petPolicy: "Not allowed",
        smokingPolicy: "Not allowed"
      }
    };

    try {
      if (isEditing) {
        if (!editId) {
          toast.error("Invalid farmhouse ID");
          return;
        }
        await dispatch(updateFarmhouse({ id: editId, data: payload })).unwrap();
        toast.success("Farmhouse updated successfully!");
      } else {
        await dispatch(createFarmhouse(payload)).unwrap();
        toast.success("Farmhouse created successfully!");
      }
      setIsModalOpen(false);
      dispatch(fetchOwnerFarmhouses());
    } catch (err) {
      const errorMessage = err?.errors?.join(', ') || err || "Operation failed";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Invalid farmhouse ID");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this farmhouse?")) return;
    try {
      await dispatch(deleteFarmhouse(id)).unwrap();
      toast.success("Farmhouse deleted successfully!");
    } catch (err) {
      const errorMessage = err?.errors?.join(', ') || err || "Failed to delete farmhouse";
      toast.error(errorMessage);
    }
  };

  // Sample images for quick add
  const sampleImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  ];

  const addSampleImage = (url) => {
    const newImage = {
      url: url,
      alt: formData.name || "Farmhouse image",
      isPrimary: formData.images.length === 0
    };

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImage]
    }));

    toast.success("Sample image added!");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏡 Manage Your Farmhouses</h1>
          <p className="text-gray-600">
            Logged in as: <span className="font-semibold capitalize">{user?.name}</span>
            ({user?.role})
          </p>
          <p className="text-sm text-green-600 mt-1">
            You can see and manage only your farmhouses
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
        >
          + Add Farmhouse
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      )}


     {!loading && farmhouses?.length > 0 && (
  <div className="bg-white rounded-lg shadow-md">

    {/* Header badge */}
    <div className="p-4 bg-green-50 border-b">
      <p className="text-green-700 font-medium">
        Showing your {farmhouses.length} farmhouse{farmhouses.length > 1 ? 's' : ''}
      </p>
    </div>

    {/* ==================== DESKTOP TABLE (≥768px) ==================== */}
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Images</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rooms</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Approval Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {farmhouses.map((farmhouse) => (
            <tr key={farmhouse._id} className="border-b hover:bg-gray-50 transition">
              {/* Images */}
              <td className="px-4 py-3">
                <div className="flex space-x-1">
                  {farmhouse.images?.slice(0, 3).map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={img.alt}
                      className="w-16 h-12 object-cover rounded-md border"
                    />
                  ))}
                  {farmhouse.images?.length > 3 && (
                    <div className="w-16 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                      +{farmhouse.images.length - 3}
                    </div>
                  )}
                </div>
              </td>

              {/* Other columns */}
              <td className="px-4 py-3 font-medium text-gray-800">{farmhouse.name}</td>
              <td className="px-4 py-3 text-gray-600">{farmhouse.address?.city || "N/A"}</td>
              <td className="px-4 py-3 text-gray-600">{farmhouse.address?.state || "N/A"}</td>
              <td className="px-4 py-3 text-gray-600">₹{farmhouse.pricing?.basePrice || 0}</td>
              <td className="px-4 py-3 text-gray-600">{farmhouse.rooms?.length || 0} types</td>

              {/* Approval Status with Tooltip */}
              <td className="px-4 py-3">
                <div className="relative group inline-block">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      farmhouse.approvalStatus === 'approved'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : farmhouse.approvalStatus === 'rejected'
                        ? 'bg-red-100 text-red-800 border border-red-200 cursor-help'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}
                  >
                    {farmhouse.approvalStatus === 'approved' && 'Approved'}
                    {farmhouse.approvalStatus === 'rejected' && 'Rejected'}
                    {farmhouse.approvalStatus === 'pending' && 'Pending'}
                  </span>

                  {/* Reject Reason Tooltip */}
                  {farmhouse.approvalStatus === 'rejected' && farmhouse.approvalDetails?.rejectionReason && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-red-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-normal text-center pointer-events-none">
                      <div className="font-semibold mb-1">Rejection Reason:</div>
                      <div>{farmhouse.approvalDetails.rejectionReason}</div>
                      {farmhouse.approvalDetails?.notes && (
                        <div className="mt-1 border-t border-red-400 pt-1 text-red-100">
                          <strong>Note:</strong> {farmhouse.approvalDetails.notes}
                        </div>
                      )}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-600"></div>
                    </div>
                  )}

                  {/* Pending Tooltip */}
                  {farmhouse.approvalStatus === 'pending' && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-yellow-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                      Waiting for admin approval
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-yellow-600"></div>
                    </div>
                  )}
                </div>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(farmhouse)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(farmhouse._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* ==================== MOBILE CARD VIEW (<768px) ==================== */}
    <div className="block md:hidden">
      {farmhouses.map((farmhouse) => (
        <div key={farmhouse._id} className="border-b p-4 hover:bg-gray-50 transition">
          {/* Images – horizontal scroll */}
          <div className="flex space-x-2 mb-3 overflow-x-auto pb-1">
            {farmhouse.images?.slice(0, 5).map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.alt}
                className="w-20 h-16 object-cover rounded-md border flex-shrink-0"
              />
            ))}
            {farmhouse.images?.length > 5 && (
              <div className="w-20 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600 flex-shrink-0">
                +{farmhouse.images.length - 5}
              </div>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium text-gray-800">{farmhouse.name}</div>
            <div className="text-right">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  farmhouse.approvalStatus === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : farmhouse.approvalStatus === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {farmhouse.approvalStatus === 'approved' && 'Approved'}
                {farmhouse.approvalStatus === 'rejected' && 'Rejected'}
                {farmhouse.approvalStatus === 'pending' && 'Pending'}
              </span>
            </div>

            <div className="text-gray-600">
              {farmhouse.address?.city || "N/A"}, {farmhouse.address?.state || "N/A"}
            </div>
            <div className="text-gray-600 text-right">
              ₹{farmhouse.pricing?.basePrice || 0}
            </div>

            <div className="text-gray-600">
              {farmhouse.rooms?.length || 0} room type{farmhouse.rooms?.length !== 1 ? "s" : ""}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => openModal(farmhouse)}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(farmhouse._id)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

  </div>
)}


      {!loading && farmhouses?.length === 0 && (
        <div className="text-center text-gray-500 mt-10 py-8">
          <div className="text-6xl mb-4">🏡</div>
          <h2 className="text-xl font-semibold mb-2">No Farmhouses Found</h2>
          <p className="text-gray-600 mb-4">
            You haven't created any farmhouses yet. Start by adding your first farmhouse!
          </p>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Create Your First Farmhouse
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white w-full max-w-6xl p-6 rounded-lg shadow-lg relative max-h-[95vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Farmhouse" : "Add Farmhouse"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Basic Information Section */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-3">🏡 Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                      placeholder="Farmhouse Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Base Price (₹) *</label>
                    <input
                      type="number"
                      name="pricing.basePrice"
                      value={formData.pricing.basePrice}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                      placeholder="1000"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-md p-2"
                    required
                    placeholder="Describe your farmhouse features, amenities, and surroundings..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State *</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>

              {/* Rooms Section */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-3">🛏️ Room Types</h3>

                {/* Add Room Form */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-3">Add New Room Type</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Room Type</label>
                      <select
                        name="type"
                        value={currentRoom.type}
                        onChange={handleRoomChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      >
                        {roomTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Room Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={currentRoom.name}
                        onChange={handleRoomChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        placeholder="e.g., Deluxe Room"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Capacity</label>
                      <input
                        type="number"
                        name="capacity"
                        value={currentRoom.capacity}
                        onChange={handleRoomChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        min="1"
                        max="20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Price/Night (₹) *</label>
                      <input
                        type="number"
                        name="pricePerNight"
                        value={currentRoom.pricePerNight}
                        onChange={handleRoomChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        placeholder="2500"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-medium mb-1">Description</label>
                    <input
                      type="text"
                      name="description"
                      value={currentRoom.description}
                      onChange={handleRoomChange}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Room features and details..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addRoom}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                  >
                    + Add Room
                  </button>
                </div>

                {/* Rooms List */}
                {formData.rooms.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium">Added Rooms ({formData.rooms.length})</h4>
                    {formData.rooms.map((room, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border">
                        <div>
                          <div className="font-medium">{room.name}</div>
                          <div className="text-sm text-gray-600">
                            Type: {roomTypes.find(t => t.value === room.type)?.label} |
                            Capacity: {room.capacity} guests |
                            Price: ₹{room.pricePerNight}/night
                          </div>
                          {room.description && (
                            <div className="text-xs text-gray-500 mt-1">{room.description}</div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRoom(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No rooms added yet. Add at least one room type.
                  </div>
                )}
              </div>

              {/* Amenities Section */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-3">⭐ Amenities</h3>

                {/* Add Amenity Form */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-3">Add New Amenity</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Amenity Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={currentAmenity.name}
                        onChange={handleAmenityChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        placeholder="e.g., Swimming Pool"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Icon (Emoji)</label>
                      <input
                        type="text"
                        name="icon"
                        value={currentAmenity.icon}
                        onChange={handleAmenityChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        placeholder="🏊"
                        maxLength="2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Category</label>
                      <select
                        name="category"
                        value={currentAmenity.category}
                        onChange={handleAmenityChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                      >
                        {amenityCategories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                  >
                    + Add Amenity
                  </button>
                </div>

                {/* Quick Add Common Amenities */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Quick Add Common Amenities</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {commonAmenities.map((amenity, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addCommonAmenity(amenity)}
                        className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md text-sm hover:bg-green-50 transition-colors"
                      >
                        <span>{amenity.icon}</span>
                        <span>{amenity.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities List */}
                {formData.amenities.length > 0 ? (
                  <div>
                    <h4 className="font-medium mb-2">Added Amenities ({formData.amenities.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {formData.amenities.map((amenity, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded border">
                          <div className="flex items-center space-x-2">
                            <span>{amenity.icon}</span>
                            <span className="font-medium">{amenity.name}</span>
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {amenity.category}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAmenity(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No amenities added yet. Add amenities to attract more guests.
                  </div>
                )}
              </div>

              {/* Images Section */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-3">📷 Farmhouse Images</h3>

                {formData.images.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Current Images ({formData.images.length})</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img.url}
                            alt={img.alt}
                            className={`w-full h-24 object-cover rounded-lg border-2 ${img.isPrimary ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'
                              }`}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150x100?text=Invalid+URL";
                            }}
                          />
                          {img.isPrimary && (
                            <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                              Primary
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(index)}
                              className="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600"
                              disabled={img.isPrimary}
                            >
                              {img.isPrimary ? '✓' : 'Set Primary'}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Add New Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={currentImageUrl}
                      onChange={(e) => setCurrentImageUrl(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md p-2"
                      placeholder="https://example.com/farmhouse-image.jpg"
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Add Image
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quick Add Sample Images</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sampleImages.map((url, index) => (
                      <div
                        key={index}
                        className="cursor-pointer border-2 border-gray-200 rounded-lg overflow-hidden hover:border-green-500 transition-all"
                        onClick={() => addSampleImage(url)}
                      >
                        <img
                          src={url}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-20 object-cover hover:opacity-90"
                        />
                        <div className="text-center text-xs py-1 bg-gray-100 hover:bg-green-100 transition-colors">
                          Add This
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-3">📞 Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Phone</label>
                    <input
                      type="text"
                      name="contact.phone"
                      value={formData.contact.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="+91-9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Email</label>
                    <input
                      type="email"
                      name="contact.email"
                      value={formData.contact.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="owner@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  {isEditing ? "Update Farmhouse" : "Create Farmhouse"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerFarmhouses;