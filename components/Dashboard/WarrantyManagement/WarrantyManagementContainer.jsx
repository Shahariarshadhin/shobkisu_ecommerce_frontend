"use client"

import {
    clearNotification,
    createWarranty,
    deleteWarranty,
    fetchWarranties,
    setSearchTerm,
    toggleWarrantyStatus,
    updateWarranty
} from '../../../redux/warrantySlice';
import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../SharedUI/Toast';
import SearchBar from '../SharedUI/SearchBar';
import WarrantiesGrid from './WarrantiesGrid';
import WarrantyFormModal from './WarrantyFormModal';
import DeleteConfirmModal from '../BrandManagement/DeleteConfirmModal';

export default function WarrantyManagement() {
    const dispatch = useDispatch();
    const {
        filteredWarranties = [],
        loading = false,
        notification = null,
        searchTerm = ''
    } = useSelector((state) => state.warranties || {});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingWarranty, setEditingWarranty] = useState(null);
    const [deletingWarranty, setDeletingWarranty] = useState(null);

    useEffect(() => {
        dispatch(fetchWarranties());
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
        if (editingWarranty) {
            await dispatch(updateWarranty({ id: editingWarranty._id, warrantyData: formData }));
        } else {
            await dispatch(createWarranty(formData));
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (!deletingWarranty) return;
        await dispatch(deleteWarranty(deletingWarranty._id));
        closeDeleteModal();
    };

    const handleToggleStatus = async (warranty) => {
        await dispatch(toggleWarrantyStatus(warranty));
    };

    const handleSearch = (term) => {
        dispatch(setSearchTerm(term));
    };

    const openModal = (warranty = null) => {
        setEditingWarranty(warranty);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingWarranty(null);
    };

    const openDeleteModal = (warranty) => {
        setDeletingWarranty(warranty);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingWarranty(null);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-cyan-50 p-6">
            <Toast notification={notification} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                       <h1 className="text-4xl font-bold text-[#a34610] mb-2">
                        Warranty Management
                    </h1>
                    <p className="text-gray-600">Manage warranty types and durations</p>
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    onAddClick={() => openModal()}
                    placeholder="Search warranties..."
                    addButtonText="Add Warranty"
                    addButtonIcon={Shield}
                      buttonClassName="bg-linear-to-br from-[#C8AF9C] to-[#a34610]"
                />

                <WarrantiesGrid
                    warranties={filteredWarranties}
                    loading={loading}
                    onEdit={openModal}
                    onDelete={openDeleteModal}
                    onToggleStatus={handleToggleStatus}
                />
            </div>

            <WarrantyFormModal
                isOpen={isModalOpen}
                editingWarranty={editingWarranty}
                onClose={closeModal}
                onSubmit={handleFormSubmit}
                loading={loading}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                warranty={deletingWarranty}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                loading={loading}
            />
        </div>
    );
}