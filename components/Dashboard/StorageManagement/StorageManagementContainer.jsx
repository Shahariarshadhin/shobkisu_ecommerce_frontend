"use client"

import {
    clearNotification,
    createStorage,
    deleteStorage,
    fetchStorage,
    setSearchTerm,
    toggleStorageStatus,
    updateStorage
} from '../../../redux/storageSlice';
import { HardDrive } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../SharedUI/Toast';
import SearchBar from '../SharedUI/SearchBar';
import StorageGrid from './StorageGrid';
import StorageFormModal from './StorageFormModal';
import DeleteConfirmModal from '../BrandManagement/DeleteConfirmModal';


export default function StorageManagement() {
    const dispatch = useDispatch();

    // Get entire storage state
    const storageState = useSelector((state) => state.storage);
    
    // Destructure with safe fallbacks
    const {
        storage = [],
        filteredStorage = [],
        loading = false,
        notification = null,
        searchTerm = ''
    } = storageState || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingStorage, setEditingStorage] = useState(null);
    const [deletingStorage, setDeletingStorage] = useState(null);

    useEffect(() => {
        dispatch(fetchStorage());
    }, [dispatch]);

    // Debug logging
    useEffect(() => {
        // console.log('🔍 Storage State Debug:', {
        //     storageCount: storage.length,
        //     filteredCount: filteredStorage.length,
        //     searchTerm,
        //     loading,
        //     storage,
        //     filteredStorage
        // });
    }, [storage, filteredStorage, loading, searchTerm]);

    const handleFormSubmit = async (formData) => {
        // console.log('📝 Submitting form data:', formData);
        try {
            if (editingStorage) {
                await dispatch(updateStorage({ id: editingStorage._id, storageData: formData })).unwrap();
            } else {
                await dispatch(createStorage(formData)).unwrap();
            }
            closeModal();
        } catch (error) {
            console.error('❌ Error submitting form:', error);
        }
    };

    const handleDelete = async () => {
        if (!deletingStorage) return;
        try {
            await dispatch(deleteStorage(deletingStorage._id)).unwrap();
            closeDeleteModal();
        } catch (error) {
            console.error('❌ Error deleting storage:', error);
        }
    };

    const handleToggleStatus = async (storage) => {
        try {
            await dispatch(toggleStorageStatus(storage)).unwrap();
        } catch (error) {
            console.error('❌ Error toggling status:', error);
        }
    };

    const handleSearch = (term) => {
        console.log('🔎 Search term changed:', term);
        dispatch(setSearchTerm(term));
    };

    const openModal = (storage = null) => {
        setEditingStorage(storage);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingStorage(null);
    };

    const openDeleteModal = (storage) => {
        setDeletingStorage(storage);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingStorage(null);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
            <Toast notification={notification} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                     <h1 className="text-4xl font-bold text-[#a34610] mb-2">
                        Storage Management
                    </h1>
                    <p className="text-gray-600">Manage RAM and ROM configurations</p>
                    
                   
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    onAddClick={() => openModal()}
                    placeholder="Search RAM or ROM..."
                    addButtonText="Add Storage"
                    addButtonIcon={HardDrive}
                     buttonClassName="bg-linear-to-br from-[#C8AF9C] to-[#a34610]"
                />

                <StorageGrid
                    storage={filteredStorage}
                    loading={loading}
                    onEdit={openModal}
                    onDelete={openDeleteModal}
                    onToggleStatus={handleToggleStatus}
                />
            </div>

            <StorageFormModal
                isOpen={isModalOpen}
                editingStorage={editingStorage}
                onClose={closeModal}
                onSubmit={handleFormSubmit}
                loading={loading}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                storage={deletingStorage}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                loading={loading}
            />
        </div>
    );
}