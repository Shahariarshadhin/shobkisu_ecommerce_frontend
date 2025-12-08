"use client"
import {
    clearNotification,
    createColor,
    deleteColor,
    fetchColors,
    setSearchTerm,
    toggleColorStatus,
    updateColor
} from '../../../redux/colorSlice';
import { Palette } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../SharedUI/Toast';
import SearchBar from '../SharedUI/SearchBar';
import ColorsGrid from './ColorsGrid';
import ColorFormModal from './ColorFormModal';
import DeleteConfirmModal from '../BrandManagement/DeleteConfirmModal';

export default function ColorManagement() {
  const dispatch = useDispatch();
  const { filteredColors, loading, notification } = useSelector((state) => state.colors);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [deletingColor, setDeletingColor] = useState(null);

  useEffect(() => {
    dispatch(fetchColors());
  }, [dispatch]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  const handleFormSubmit = async (formData) => {
    if (editingColor) {
      await dispatch(updateColor({ id: editingColor._id, colorData: formData }));
    } else {
      await dispatch(createColor(formData));
    }
    closeModal();
  };

  const handleDelete = async () => {
    if (!deletingColor) return;
    await dispatch(deleteColor(deletingColor._id));
    closeDeleteModal();
  };

  const handleToggleStatus = async (color) => {
    await dispatch(toggleColorStatus(color));
  };

  const handleSearch = (term) => {
    dispatch(setSearchTerm(term));
  };

  const openModal = (color = null) => {
    setEditingColor(color);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingColor(null);
  };

  const openDeleteModal = (color) => {
    setDeletingColor(color);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingColor(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-6">
      <Toast notification={notification} />

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Color Management
          </h1>
          <p className="text-gray-600">Manage your product colors with ease</p>
        </div>

        <SearchBar
          searchTerm={useSelector((state) => state.colors.searchTerm)}
          onSearchChange={handleSearch}
          onAddClick={() => openModal()}
          placeholder="Search colors or hex codes..."
          addButtonText="Add Color"
          addButtonIcon={Palette}
          buttonClassName="bg-gradient-to-r from-pink-600 to-rose-600"
        />

        <ColorsGrid
          colors={filteredColors}
          loading={loading}
          onEdit={openModal}
          onDelete={openDeleteModal}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <ColorFormModal
        isOpen={isModalOpen}
        editingColor={editingColor}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        loading={loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        color={deletingColor}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}