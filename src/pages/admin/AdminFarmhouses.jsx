// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchFarmhouses,
//   createFarmhouse,
//   updateFarmhouse,
//   deleteFarmhouse,
//   clearError,
// } from "../../store/slices/farmhouseSlice";
// import { toast } from "react-toastify";

// // ================================
// // 🏡 AdminFarmhouses Component
// // ================================
// const AdminFarmhouses = () => {
//   const dispatch = useDispatch();
//   const { farmhouses, loading, error } = useSelector((state) => state.farmhouse);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     city: "",
//     state: "",
//     pricePerNight: "",
//     image: "",
//   });
//   const [editId, setEditId] = useState(null);

//   // Fetch all farmhouses
//   useEffect(() => {
//     dispatch(fetchFarmhouses());
//   }, [dispatch]);

//   // Handle error toast
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   // Open modal for add/edit
//   const openModal = (farmhouse = null) => {
//     if (farmhouse) {
//       setIsEditing(true);
//       setEditId(farmhouse._id);
//       setFormData({
//         name: farmhouse.name || "",
//         city: farmhouse.city || "",
//         state: farmhouse.state || "",
//         pricePerNight: farmhouse.pricePerNight || "",
//         image: farmhouse.images?.[0] || "",
//       });
//     } else {
//       setIsEditing(false);
//       setEditId(null);
//       setFormData({
//         name: "",
//         city: "",
//         state: "",
//         pricePerNight: "",
//         image: "",
//       });
//     }
//     setIsModalOpen(true);
//   };

//   // Handle form change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Submit form (add or edit)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.city || !formData.state || !formData.pricePerNight) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     const payload = {
//       name: formData.name,
//       city: formData.city,
//       state: formData.state,
//       pricePerNight: Number(formData.pricePerNight),
//       images: formData.image ? [formData.image] : [],
//     };

//     try {
//       if (isEditing) {
//         await dispatch(updateFarmhouse({ id: editId, data: payload })).unwrap();
//         toast.success("Farmhouse updated successfully!");
//       } else {
//         await dispatch(createFarmhouse(payload)).unwrap();
//         toast.success("Farmhouse created successfully!");
//       }
//       setIsModalOpen(false);
//       dispatch(fetchFarmhouses());
//     } catch (err) {
//       toast.error("Operation failed!");
//     }
//   };

//   // Delete farmhouse
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this farmhouse?")) return;
//     try {
//       await dispatch(deleteFarmhouse(id)).unwrap();
//       toast.success("Farmhouse deleted successfully!");
//     } catch (err) {
//       toast.error("Failed to delete farmhouse");
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">🏡 Manage Farmhouses</h1>
//         <button
//           onClick={() => openModal()}
//           className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
//         >
//           + Add Farmhouse
//         </button>
//       </div>

//       {/* Loading */}
//       {loading && <div className="text-center text-gray-600 text-lg">Loading...</div>}

//       {/* Table */}
//       {!loading && farmhouses?.length > 0 && (
//         <div className="overflow-x-auto shadow-md rounded-lg bg-white">
//           <table className="min-w-full border border-gray-200">
//             <thead className="bg-gray-100 border-b">
//               <tr>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
//                 <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {farmhouses.map((farmhouse) => (
//                 <tr key={farmhouse._id} className="border-b hover:bg-gray-50 transition">
//                   <td className="px-4 py-3">
//                     <img
//                       src={farmhouse.images?.[0] || "https://via.placeholder.com/100x70?text=No+Image"}
//                       alt={farmhouse.name}
//                       className="w-24 h-16 object-cover rounded-md"
//                     />
//                   </td>
//                   <td className="px-4 py-3 font-medium text-gray-800">{farmhouse.name}</td>
//                   <td className="px-4 py-3 text-gray-600">{farmhouse.city || "N/A"}</td>
//                   <td className="px-4 py-3 text-gray-600">{farmhouse.state || "N/A"}</td>
//                   <td className="px-4 py-3 text-gray-600">₹{farmhouse.pricePerNight || 0}</td>
//                   <td className="px-4 py-3">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => openModal(farmhouse)}
//                         className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(farmhouse._id)}
//                         className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* No data */}
//       {!loading && farmhouses?.length === 0 && (
//         <div className="text-center text-gray-500 mt-10">No farmhouses found.</div>
//       )}

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/40  z-50">
//           <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
//             <h2 className="text-xl font-semibold mb-4">
//               {isEditing ? "Edit Farmhouse" : "Add Farmhouse"}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">City</label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">State</label>
//                 <input
//                   type="text"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Price per Night (₹)</label>
//                 <input
//                   type="number"
//                   name="pricePerNight"
//                   value={formData.pricePerNight}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Image URL</label>
//                 <input
//                   type="text"
//                   name="image"
//                   value={formData.image}
//                   onChange={handleChange}
//                   placeholder="https://example.com/farmhouse.jpg"
//                   className="w-full border border-gray-300 rounded-md p-2"
//                 />
//               </div>

//               <div className="flex justify-end space-x-3 mt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
//                 >
//                   {isEditing ? "Update" : "Create"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminFarmhouses;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFarmhouses,
  createFarmhouse,
  updateFarmhouse,
  deleteFarmhouse,
  clearError,
} from "../../store/slices/farmhouseSlice";
import { toast } from "react-toastify";

// ================================
// 🏡 AdminFarmhouses Component
// ================================
const AdminFarmhouses = () => {
  const dispatch = useDispatch();
  const { farmhouses, loading, error } = useSelector((state) => state.farmhouse);

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
      basePrice: "",
    },
    contact: {
      phone: "",
      email: "",
    },
    imageUrl: "" // New field for single image URL
  });
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); // For image preview

  // Fetch all farmhouses
  useEffect(() => {
    dispatch(fetchFarmhouses());
  }, [dispatch]);

  // Handle error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Open modal for add/edit
  const openModal = (farmhouse = null) => {
    if (farmhouse) {
      setIsEditing(true);
      setEditId(farmhouse._id);
      const primaryImage = farmhouse.images?.find(img => img.isPrimary) || farmhouse.images?.[0];
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
          basePrice: farmhouse.pricing?.basePrice || "",
        },
        contact: {
          phone: farmhouse.contact?.phone || "",
          email: farmhouse.contact?.email || "",
        },
        imageUrl: primaryImage?.url || "" // Set existing image URL
      });
      setImagePreview(primaryImage?.url || "");
    } else {
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
          basePrice: "",
        },
        contact: {
          phone: "",
          email: "",
        },
        imageUrl: ""
      });
      setImagePreview("");
    }
    setIsModalOpen(true);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
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
      
      // Update image preview when image URL changes
      if (name === 'imageUrl') {
        setImagePreview(value);
      }
    }
  };

  // Handle image URL validation and preview
  const handleImageUrlChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, imageUrl: value }));
    setImagePreview(value);
  };

  // Clear image preview
  const clearImagePreview = () => {
    setFormData(prev => ({ ...prev, imageUrl: "" }));
    setImagePreview("");
  };

  // Submit form (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.address.city || 
        !formData.address.state || !formData.pricing.basePrice) {
      toast.error("Please fill all required fields");
      return;
    }

    // Prepare images array
    const images = formData.imageUrl ? [{
      url: formData.imageUrl,
      alt: formData.name,
      isPrimary: true
    }] : [];

    // Simplified payload with only essential fields
    const payload = {
      name: formData.name,
      description: formData.description,
      address: {
        street: formData.address.street || "Not specified",
        city: formData.address.city,
        state: formData.address.state,
        zipCode: formData.address.zipCode || "000000",
        country: formData.address.country
      },
      location: {
        latitude: 0, // Default values
        longitude: 0
      },
      images: images, // Include images in payload
      pricing: {
        basePrice: Number(formData.pricing.basePrice),
        weekendMultiplier: 1.2,
        holidayMultiplier: 1.5,
        cleaningFee: 0,
        securityDeposit: 0
      },
      contact: {
        phone: formData.contact.phone || "+91-0000000000",
        email: formData.contact.email || "owner@example.com",
      },
      amenities: [],
      rooms: [],
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
        await dispatch(updateFarmhouse({ id: editId, data: payload })).unwrap();
        toast.success("Farmhouse updated successfully!");
      } else {
        await dispatch(createFarmhouse(payload)).unwrap();
        toast.success("Farmhouse created successfully!");
      }
      setIsModalOpen(false);
      // Refresh the list
      dispatch(fetchFarmhouses());
    } catch (err) {
      console.error('Operation error:', err);
      toast.error(err || "Operation failed!");
    }
  };

  // Delete farmhouse
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this farmhouse?")) return;
    try {
      await dispatch(deleteFarmhouse(id)).unwrap();
      toast.success("Farmhouse deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete farmhouse");
    }
  };

  // Sample image URLs for quick selection
  const sampleImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFybWhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhcm1ob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZhcm1ob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZhcm1ob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  ];

  const setSampleImage = (url) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
    setImagePreview(url);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🏡 Manage Farmhouses</h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
        >
          + Add Farmhouse
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Table */}
      {!loading && farmhouses?.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg bg-white">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {farmhouses.map((farmhouse) => (
                <tr key={farmhouse._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <img
                      src={farmhouse.images?.[0]?.url || "https://via.placeholder.com/100x70?text=No+Image"}
                      alt={farmhouse.name}
                      className="w-24 h-16 object-cover rounded-md border"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{farmhouse.name}</td>
                  <td className="px-4 py-3 text-gray-600">{farmhouse.address?.city || "N/A"}</td>
                  <td className="px-4 py-3 text-gray-600">{farmhouse.address?.state || "N/A"}</td>
                  <td className="px-4 py-3 text-gray-600">₹{farmhouse.pricing?.basePrice || 0}</td>
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
      )}

      {/* No data */}
      {!loading && farmhouses?.length === 0 && (
        <div className="text-center text-gray-500 mt-10 py-8">
          <div className="text-6xl mb-4">🏡</div>
          <p className="text-lg">No farmhouses found.</p>
          <button
            onClick={() => openModal()}
            className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Create Your First Farmhouse
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Farmhouse" : "Add Farmhouse"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Image Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">📷 Farmhouse Image</h3>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Image Preview</label>
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-48 h-32 object-cover rounded-lg border-2 border-green-500"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/200x150?text=Invalid+URL";
                        }}
                      />
                      <button
                        type="button"
                        onClick={clearImagePreview}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                {/* Image URL Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleImageUrlChange}
                      className="flex-1 border border-gray-300 rounded-md p-2"
                      placeholder="https://example.com/farmhouse-image.jpg"
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={clearImagePreview}
                        className="px-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a valid image URL (jpg, png, webp)
                  </p>
                </div>

                {/* Sample Images */}
                <div>
                  <label className="block text-sm font-medium mb-2">Quick Select Sample Images</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sampleImages.map((url, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                          formData.imageUrl === url ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
                        }`}
                        onClick={() => setSampleImage(url)}
                      >
                        <img
                          src={url}
                          alt={`Sample ${index + 1}`}
                          className="w-full h-20 object-cover hover:opacity-90"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
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

              <div>
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

              {/* Address Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="123456"
                  />
                </div>
              </div>

              {/* Contact Information */}
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

              {/* Form Actions */}
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

export default AdminFarmhouses;