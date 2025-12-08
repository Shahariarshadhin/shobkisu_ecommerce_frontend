"use client"

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
  fetchModels, 
  createModel, 
  updateModel, 
  deleteModel,
  toggleModelStatus,
  setSearchTerm,
  clearNotification 
} from '../../../redux/modelSlice';
import { fetchBrands } from '../../../redux/brandSlice';
import { Package } from 'lucide-react';
import Toast from '../SharedUI/Toast';
import SearchBar from '../SharedUI/SearchBar';
import ModelsGrid from './ModelsGrid';
import ModelFormModal from './ModelFormModal';
import DeleteConfirmModal from '../BrandManagement/DeleteConfirmModal';

export default function ModelManagement() {
  const dispatch = useDispatch();
  const { filteredModels, loading, notification } = useSelector((state) => state.models);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [deletingModel, setDeletingModel] = useState(null);

  useEffect(() => {
    dispatch(fetchModels());
    dispatch(fetchBrands()); // Fetch brands for dropdown
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
    if (editingModel) {
      await dispatch(updateModel({ id: editingModel._id, modelData: formData }));
    } else {
      await dispatch(createModel(formData));
    }
    closeModal();
  };

  const handleDelete = async () => {
    if (!deletingModel) return;
    await dispatch(deleteModel(deletingModel._id));
    closeDeleteModal();
  };

  const handleToggleStatus = async (model) => {
    await dispatch(toggleModelStatus(model));
  };

  const handleSearch = (term) => {
    dispatch(setSearchTerm(term));
  };

  const openModal = (model = null) => {
    setEditingModel(model);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingModel(null);
  };

  const openDeleteModal = (model) => {
    setDeletingModel(model);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingModel(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      <Toast notification={notification} />

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#a34610] mb-2">
            Model Management
          </h1>
          <p className="text-gray-600">Manage your product models with ease</p>
        </div>

        <SearchBar
          searchTerm={useSelector((state) => state.models.searchTerm)}
          onSearchChange={handleSearch}
          onAddClick={() => openModal()}
          placeholder="Search models or brands..."
          addButtonText="Add Model"
          addButtonIcon={Package}
          buttonClassName="bg-gradient-to-br from-[#C8AF9C] to-[#a34610]"
        />

        <ModelsGrid
          models={filteredModels}
          loading={loading}
          onEdit={openModal}
          onDelete={openDeleteModal}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <ModelFormModal
        isOpen={isModalOpen}
        editingModel={editingModel}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        loading={loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        model={deletingModel}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}