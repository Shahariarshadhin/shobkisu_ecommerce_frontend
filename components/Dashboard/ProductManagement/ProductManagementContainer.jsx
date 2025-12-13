"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ShoppingBag, Grid3x3, List, Edit2, Trash2, Eye, EyeOff, Package } from 'lucide-react';
import {
    clearNotification,
    deleteProduct,
    fetchProducts,
    setSearchTerm,
    toggleProductStatus
} from '../../../redux/productSlice';
import DeleteConfirmModal from '../BrandManagement/DeleteConfirmModal';
import SearchBar from '../SharedUI/SearchBar';
import Toast from '../SharedUI/Toast';

export default function ProductManagement() {
    const router = useRouter();
    const dispatch = useDispatch();
    const {
        filteredProducts = [],
        loading = false,
        notification = null,
        searchTerm = '',
        currentPage = 1,
        totalPages = 1
    } = useSelector((state) => state.products || {});

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'table' or 'table'

    useEffect(() => {
        dispatch(fetchProducts({ page: currentPage, limit: 12 }));
    }, [dispatch, currentPage]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                dispatch(clearNotification());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification, dispatch]);

    const handleDelete = async () => {
        if (!deletingProduct) return;
        await dispatch(deleteProduct(deletingProduct._id));
        dispatch(fetchProducts({ page: currentPage, limit: 12 }));
        closeDeleteModal();
    };

    const handleToggleStatus = async (product) => {
        await dispatch(toggleProductStatus(product._id));
        dispatch(fetchProducts({ page: currentPage, limit: 12 }));
    };

    const handleSearch = (term) => {
        dispatch(setSearchTerm(term));
    };

    const openDeleteModal = (product) => {
        setDeletingProduct(product);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingProduct(null);
    };

    // Table View Component
    const TableView = () => (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Product
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Original Price
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Discount Price
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Selling Price
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {product.thumbnailImage ? (
                                                    <img
                                                        src={product.thumbnailImage}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="text-gray-400" size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {product.brandId?.name} • {product.modelId?.name}
                                                </p>
                                                {product.sku && (
                                                    <p className="text-xs text-gray-400">SKU: {product.sku}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-700 font-medium">
                                            ${product.pricing?.originalPrice || '0.00'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-green-600 font-medium">
                                            ${product.pricing?.discountPrice || '0.00'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-purple-600 font-semibold text-lg">
                                            ${product.pricing?.sellingPrice || '0.00'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.stock > 10
                                                ? 'bg-green-100 text-green-800'
                                                : product.stock > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(product)}
                                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${product.isActive
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                        >
                                            {product.isActive ? (
                                                <>
                                                    <Eye size={14} />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff size={14} />
                                                    Inactive
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => router.push(`/dashboard/products/edit-products/${product._id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(product)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Grid View Component
    const GridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
                <div className="col-span-full flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                    No products found
                </div>
            ) : (
                filteredProducts.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        {/* Product Image */}
                        <div className="relative h-48 bg-gray-100">
                            {product.thumbnailImage ? (
                                <img
                                    src={product.thumbnailImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="text-gray-400" size={48} />
                                </div>
                            )}
                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                                <button
                                    onClick={() => handleToggleStatus(product)}
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${product.isActive
                                            ? 'bg-green-100/90 text-green-700 hover:bg-green-200/90'
                                            : 'bg-red-100/90 text-red-700 hover:bg-red-200/90'
                                        }`}
                                >
                                    {product.isActive ? (
                                        <>
                                            <Eye size={12} />
                                            Active
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff size={12} />
                                            Inactive
                                        </>
                                    )}
                                </button>
                            </div>
                            {/* Stock Badge */}
                            <div className="absolute bottom-3 left-3">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${product.stock > 10
                                        ? 'bg-green-100/90 text-green-800'
                                        : product.stock > 0
                                            ? 'bg-yellow-100/90 text-yellow-800'
                                            : 'bg-red-100/90 text-red-800'
                                    }`}>
                                    {product.stock} in stock
                                </span>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-1 truncate" title={product.name}>
                                {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3 truncate">
                                {product.brandId?.name} • {product.modelId?.name}
                            </p>

                            {/* SKU */}
                            {product.sku && (
                                <p className="text-xs text-gray-400 mb-3">SKU: {product.sku}</p>
                            )}

                            {/* Pricing */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Original:</span>
                                    <span className="text-sm font-medium text-gray-700">
                                        ${product.pricing?.originalPrice || '0.00'}
                                    </span>
                                </div>
                                {product.pricing?.discountPrice && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">Discount:</span>
                                        <span className="text-sm font-medium text-green-600">
                                            ${product.pricing.discountPrice}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <span className="text-sm font-semibold text-gray-700">Selling Price:</span>
                                    <span className="text-xl font-bold text-purple-600">
                                        ${product.pricing?.sellingPrice || '0.00'}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.push(`/dashboard/products/edit-product/${product._id}`)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <Edit2 size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => openDeleteModal(product)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
            <Toast notification={notification} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                     <h1 className="text-4xl font-bold text-[#a34610] mb-2">
                        Product Management
                    </h1>
                    <p className="text-gray-600">Manage your product inventory</p>
                </div>

                {/* Search Bar with View Toggle */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1 w-full">
                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={handleSearch}
                            onAddClick={() => router.push('/dashboard/products/create-product')}
                            placeholder="Search products, brands, or models..."
                            addButtonText="Add Product"
                            addButtonIcon={ShoppingBag}
                            buttonClassName="bg-linear-to-br from-[#C8AF9C] to-[#a34610]"
                        />
                    </div>

                    {/* View Toggle */}

                </div>
                <div className="flex bg-white rounded-lg shadow-md my-4">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'grid'
                                ? 'bg-linear-to-br from-[#C8AF9C] to-[#a34610] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Grid3x3 size={18} />
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'table'
                                ? 'bg-linear-to-br from-[#C8AF9C] to-[#a34610] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <List size={18} />
                        Table
                    </button>
                </div>

                {/* Render View Based on Mode */}
                {viewMode === 'table' ? <TableView /> : <GridView />}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <button
                            onClick={() => dispatch(fetchProducts({ page: currentPage - 1, limit: 12 }))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-white border rounded-lg font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => dispatch(fetchProducts({ page: currentPage + 1, limit: 12 }))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                brand={deletingProduct}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                loading={loading}
            />
        </div>
    );
}