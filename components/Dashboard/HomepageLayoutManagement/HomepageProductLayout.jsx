"use client"
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Layout,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  X,
  Search,
  Edit2,
  Save
} from 'lucide-react';

export default function HomepageLayoutManager() {
  const dispatch = useDispatch();
  
  const homepageLayoutState = useSelector((state) => state.homepageLayout || {});
  const productsState = useSelector((state) => state.products || {});
  const flagsState = useSelector((state) => state.flags || {});
  
  const { 
    layouts = [], 
    loading: layoutLoading = false, 
    notification = null,
    error: layoutError = null
  } = homepageLayoutState;
  
  const { products = [], loading: productsLoading = false } = productsState;
  const { 
    flags = [], 
    loading: flagsLoading = false,
    error: flagsError = null 
  } = flagsState;
  
  const [selectedFlag, setSelectedFlag] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLayout, setEditingLayout] = useState(null);
  const [editDisplayOrder, setEditDisplayOrder] = useState('');

  const fetchAllData = async () => {
    try {
      const { fetchFlags } = await import('../../../redux/flagSlice');
      const { fetchProducts } = await import('../../../redux/productSlice');
      const { fetchLayouts } = await import('../../../redux/homepageProductLayoutSlice');
      
      await dispatch(fetchFlags());
      await dispatch(fetchProducts({ page: 1, limit: 1000 }));
      await dispatch(fetchLayouts());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        import('../../../redux/homepageProductLayoutSlice').then(({ clearNotification }) => {
          dispatch(clearNotification());
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  const handleCreateLayout = async () => {
    if (!selectedFlag) {
      alert('Please select a flag');
      return;
    }

    if (displayOrder === '' || displayOrder < 0) {
      alert('Please enter a valid display order (0 or greater)');
      return;
    }

    const { createLayout, fetchLayouts } = await import('../../../redux/homepageProductLayoutSlice');
    
    await dispatch(createLayout({
      flagId: selectedFlag,
      products: [],
      displayOrder: parseInt(displayOrder)
    }));
    
    setSelectedFlag('');
    setDisplayOrder('');
    dispatch(fetchLayouts());
  };

  const handleDeleteLayout = async (layoutId) => {
    if (confirm('Are you sure you want to delete this layout?')) {
      const { deleteLayout, fetchLayouts } = await import('../../../redux/homepageProductLayoutSlice');
      await dispatch(deleteLayout(layoutId));
      dispatch(fetchLayouts());
    }
  };

  const handleToggleStatus = async (layoutId) => {
    const { toggleLayoutStatus, fetchLayouts } = await import('../../../redux/homepageProductLayoutSlice');
    await dispatch(toggleLayoutStatus(layoutId));
    dispatch(fetchLayouts());
  };

  const openProductModal = (layout) => {
    setSelectedLayout(layout);
    setSelectedProducts(layout.products.map(p => p._id));
    setIsProductModalOpen(true);
  };

  const openEditModal = (layout) => {
    setEditingLayout(layout);
    setEditDisplayOrder(layout.displayOrder.toString());
    setIsEditModalOpen(true);
  };

  const handleProductToggle = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSaveProducts = async () => {
    if (!selectedLayout) return;

    const { addProductsToLayout, removeProductsFromLayout, fetchLayouts } = await import('../../../redux/homepageProductLayoutSlice');

    const currentProductIds = selectedLayout.products.map(p => p._id);
    const productsToAdd = selectedProducts.filter(id => !currentProductIds.includes(id));
    const productsToRemove = currentProductIds.filter(id => !selectedProducts.includes(id));

    if (productsToAdd.length > 0) {
      await dispatch(addProductsToLayout({
        id: selectedLayout._id,
        products: productsToAdd
      }));
    }

    if (productsToRemove.length > 0) {
      await dispatch(removeProductsFromLayout({
        id: selectedLayout._id,
        products: productsToRemove
      }));
    }

    dispatch(fetchLayouts());
    setIsProductModalOpen(false);
    setSelectedLayout(null);
  };

  const handleSaveEdit = async () => {
    if (!editingLayout) return;

    if (editDisplayOrder === '' || editDisplayOrder < 0) {
      alert('Please enter a valid display order (0 or greater)');
      return;
    }

    const { updateLayout, fetchLayouts } = await import('../../../redux/homepageProductLayoutSlice');
    
    await dispatch(updateLayout({
      id: editingLayout._id,
      layoutData: {
        displayOrder: parseInt(editDisplayOrder)
      }
    }));

    dispatch(fetchLayouts());
    setIsEditModalOpen(false);
    setEditingLayout(null);
  };

  const filteredProducts = products.filter(product =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product?.brandId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableFlags = flags.filter(flag => {
    if (!flag.isActive) return false;
    const isUsed = layouts.some(layout => {
      const layoutFlagId = typeof layout.flagId === 'object' ? layout.flagId?._id : layout.flagId;
      return layoutFlagId === flag._id;
    });
    return !isUsed;
  });

  const loading = layoutLoading || productsLoading || flagsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#a34610] mb-2">
            Homepage Layout Settings
          </h1>
          <p className="text-gray-600">Manage product sections on your homepage</p>
        </div>

        {/* Create New Layout */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Section</h2>
          
          {availableFlags.length === 0 ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-orange-700">
              <p className="font-semibold">No available flags</p>
              <p className="text-sm mt-1">
                {flags.length === 0 
                  ? '⚠️ No flags loaded from database.'
                  : 'All active flags are already used in layouts or no flags are active.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Flag
                  </label>
                  <select
                    value={selectedFlag}
                    onChange={(e) => setSelectedFlag(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a flag... ({availableFlags.length} available)</option>
                    {availableFlags.map((flag) => (
                      <option key={flag._id} value={flag._id}>
                        {flag.type || flag.name} {flag.description ? `- ${flag.description}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    placeholder="e.g., 0, 1, 2..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={handleCreateLayout}
                disabled={!selectedFlag || displayOrder === '' || loading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus size={20} />
                Create Section
              </button>
            </div>
          )}
        </div>

        {/* Layouts List */}
        <div className="space-y-4">
          {loading && layouts.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : layouts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Layout className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500 text-lg">No layouts created yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Select a flag and create your first homepage section
              </p>
            </div>
          ) : (
            layouts.map((layout) => (
              <div
                key={layout._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <GripVertical className="text-gray-400 cursor-move" size={24} />
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {layout.flagId?.type || layout.flagId?.name || 'Unknown Flag'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {layout.products?.length || 0} product(s) • Display Order: {layout.displayOrder}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(layout)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                        title="Edit display order"
                      >
                        <Edit2 size={18} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(layout._id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          layout.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {layout.isActive ? (
                          <>
                            <Eye size={18} />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff size={18} />
                            Inactive
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => openProductModal(layout)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Manage Products
                      </button>
                      <button
                        onClick={() => handleDeleteLayout(layout._id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {!layout.products || layout.products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No products added yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {layout.products.map((product) => (
                        <div
                          key={product._id}
                          className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                            {product.thumbnailImage ? (
                              <img
                                src={product.thumbnailImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Layout className="text-gray-400" size={32} />
                              </div>
                            )}
                          </div>
                          <h4 className="font-semibold text-sm text-gray-800 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-600 truncate">
                            {product.brandId?.name}
                          </p>
                          <p className="text-sm font-bold text-purple-600 mt-1">
                            ${product.pricing?.sellingPrice?.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Display Order Modal */}
      {isEditModalOpen && editingLayout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Display Order</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Section: <strong>{editingLayout.flagId?.type || editingLayout.flagId?.name}</strong>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={editDisplayOrder}
                onChange={(e) => setEditDisplayOrder(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 0, 1, 2..."
              />
              <p className="text-xs text-gray-500 mt-2">
                Lower numbers appear first on the homepage
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Selection Modal */}
      {isProductModalOpen && selectedLayout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Select Products for {selectedLayout?.flagId?.type || selectedLayout?.flagId?.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedProducts.length} product(s) selected
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Layout className="mx-auto mb-4 text-gray-400" size={48} />
                  <p>No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => {
                    const isSelected = selectedProducts.includes(product._id);
                    return (
                      <div
                        key={product._id}
                        onClick={() => handleProductToggle(product._id)}
                        className={`cursor-pointer rounded-lg p-3 transition-all ${
                          isSelected
                            ? 'bg-purple-100 ring-2 ring-purple-500'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden relative">
                          {product.thumbnailImage ? (
                            <img
                              src={product.thumbnailImage}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Layout className="text-gray-400" size={32} />
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm text-gray-800 truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                          {product.brandId?.name}
                        </p>
                        <p className="text-sm font-bold text-purple-600 mt-1">
                          ${product.pricing?.sellingPrice?.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProducts}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}