"use client"

import {
    clearNotification,
    createFlag,
    deleteFlag,
    fetchFlags,
    setSearchTerm,
    toggleFlagStatus,
    updateFlag
} from '../../../redux/flagSlice';
import { Flag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toast from './../SharedUI/Toast';
import SearchBar from './../SharedUI/SearchBar';
import FlagsGrid from './FlagsGrid';
import FlagFormModal from './FlagFormModal';
import DeleteConfirmModal from './../BrandManagement/DeleteConfirmModal';


export default function FlagManagement() {
    const dispatch = useDispatch();
    const {
        filteredFlags = [],
        loading = false,
        notification = null,
        searchTerm = ''
    } = useSelector((state) => state.flags || {});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingFlag, setEditingFlag] = useState(null);
    const [deletingFlag, setDeletingFlag] = useState(null);

    useEffect(() => {
        dispatch(fetchFlags());
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
        if (editingFlag) {
            await dispatch(updateFlag({ id: editingFlag._id, flagData: formData }));
        } else {
            await dispatch(createFlag(formData));
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (!deletingFlag) return;
        await dispatch(deleteFlag(deletingFlag._id));
        closeDeleteModal();
    };

    const handleToggleStatus = async (flag) => {
        await dispatch(toggleFlagStatus(flag));
    };

    const handleSearch = (term) => {
        dispatch(setSearchTerm(term));
    };

    const openModal = (flag = null) => {
        setEditingFlag(flag);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFlag(null);
    };

    const openDeleteModal = (flag) => {
        setDeletingFlag(flag);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingFlag(null);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
            <Toast notification={notification} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-linear-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        Flag Management
                    </h1>
                    <p className="text-gray-600">Manage product flags and badges</p>
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    onAddClick={() => openModal()}
                    placeholder="Search flags..."
                    addButtonText="Add Flag"
                    addButtonIcon={Flag}
                    buttonClassName="bg-gradient-to-r from-red-600 to-orange-600"
                />

                <FlagsGrid
                    flags={filteredFlags}
                    loading={loading}
                    onEdit={openModal}
                    onDelete={openDeleteModal}
                    onToggleStatus={handleToggleStatus}
                />
            </div>

            <FlagFormModal
                isOpen={isModalOpen}
                editingFlag={editingFlag}
                onClose={closeModal}
                onSubmit={handleFormSubmit}
                loading={loading}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                brand={deletingFlag}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                loading={loading}
            />
        </div>
    );
}