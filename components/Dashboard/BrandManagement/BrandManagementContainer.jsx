"use client"
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearNotification,
  createBrand,
  deleteBrand,
  fetchBrands,
  setSearchTerm,
  toggleBrandStatus,
  updateBrand
} from '../../../redux/brandSlice';
import SearchBar from '../SharedUI/SearchBar';
import Toast from '../SharedUI/Toast';
import BrandFormModal from './BrandFormModal';
import BrandsGrid from './BrandsGrid';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function BrandManagementContainer() {
  const dispatch = useDispatch();
  
  // Safe selector with fallback values
  const brandsState = useSelector((state) => state.brands);
  const filteredBrands = brandsState?.filteredBrands || [];
  const loading = brandsState?.loading || false;
  const notification = brandsState?.notification || null;
  const searchTerm = brandsState?.searchTerm || '';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deletingBrand, setDeletingBrand] = useState(null);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  const handleSearchChange = (value) => {
    dispatch(setSearchTerm(value));
  };

  const handleToggleStatus = (brand) => {
    dispatch(toggleBrandStatus(brand));
  };

  const handleFormSubmit = async (formData) => {
    if (editingBrand) {
      await dispatch(updateBrand({ id: editingBrand._id, brandData: formData }));
    } else {
      await dispatch(createBrand(formData));
    }
    closeModal();
  };

  const handleDelete = async () => {
    if (!deletingBrand) return;
    await dispatch(deleteBrand(deletingBrand._id));
    closeDeleteModal();
  };

  const openModal = (brand = null) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
  };

  const openDeleteModal = (brand) => {
    setDeletingBrand(brand);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingBrand(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <Toast notification={notification} />

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#a34610] mb-2">
            Brand Management
          </h1>
          <p className="text-gray-600">Manage your brands with ease</p>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onAddClick={() => openModal()}
          placeholder="Search brands..."
          addButtonText="Add Brand"
        />

        <BrandsGrid
          brands={filteredBrands}
          loading={loading}
          onEdit={openModal}
          onDelete={openDeleteModal}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <BrandFormModal
        isOpen={isModalOpen}
        editingBrand={editingBrand}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        loading={loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        brand={deletingBrand}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}