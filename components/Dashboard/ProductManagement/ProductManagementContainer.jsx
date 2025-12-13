
"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ShoppingBag } from 'lucide-react';
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
import ProductsGrid from './ProductsGrid';


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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
            <Toast notification={notification} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Product Management
                    </h1>
                    <p className="text-gray-600">Manage your product inventory</p>
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    onAddClick={() => router.push('/dashboard/products/create-product')}
                    placeholder="Search products, brands, or models..."
                    addButtonText="Add Product"
                    addButtonIcon={ShoppingBag}
                    buttonClassName="bg-gradient-to-r from-purple-600 to-pink-600"
                />

                <ProductsGrid
                    products={filteredProducts}
                    loading={loading}
                    onEdit={(product) => router.push(`/products/edit-product/${product._id}`)}
                    onDelete={openDeleteModal}
                    onToggleStatus={handleToggleStatus}
                />

                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <button
                            onClick={() => dispatch(fetchProducts({ page: currentPage - 1, limit: 12 }))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 bg-white border rounded-lg">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => dispatch(fetchProducts({ page: currentPage + 1, limit: 12 }))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-50"
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
