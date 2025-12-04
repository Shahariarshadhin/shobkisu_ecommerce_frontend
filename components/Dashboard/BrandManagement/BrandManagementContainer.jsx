"use client"
import React, { useState, useEffect } from 'react';
import BrandFormModal from './BrandFormModal';
import BrandsGrid from './BrandsGrid';
import DeleteConfirmModal from './DeleteConfirmModal';
import SearchBar from '../SharedUI/SearchBar';
import Toast from '../SharedUI/Toast';



const API_BASE_URL = 'http://localhost:5000/api/brands';

export default function BrandManagement() {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deletingBrand, setDeletingBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    const filtered = brands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [searchTerm, brands]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      if (data.success) {
        setBrands(data.data);
        setFilteredBrands(data.data);
      }
    } catch (error) {
      showNotification('Failed to fetch brands', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleStatus = async (brand) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${brand._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brand, isActive: !brand.isActive })
      });

      const data = await response.json();

      if (data.success) {
        showNotification(
          `Brand ${!brand.isActive ? 'activated' : 'deactivated'} successfully!`,
          'success'
        );
        fetchBrands();
      } else {
        showNotification(data.message || 'Failed to update status', 'error');
      }
    } catch (error) {
      showNotification('An error occurred', 'error');
    }
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);

    try {
      const url = editingBrand ? `${API_BASE_URL}/${editingBrand._id}` : API_BASE_URL;
      const method = editingBrand ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showNotification(
          editingBrand ? 'Brand updated successfully!' : 'Brand created successfully!',
          'success'
        );
        fetchBrands();
        closeModal();
      } else {
        showNotification(data.message || 'Operation failed', 'error');
      }
    } catch (error) {
      showNotification('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBrand) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${deletingBrand._id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Brand deleted successfully!', 'success');
        fetchBrands();
        setIsDeleteModalOpen(false);
        setDeletingBrand(null);
      } else {
        showNotification(data.message || 'Delete failed', 'error');
      }
    } catch (error) {
      showNotification('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <Toast notification={notification} />

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#a34610]">
            Brand Management
          </h1>
          <p className="text-gray-600">Manage your brands with ease</p>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
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