"use client"

import {
    clearNotification,
    createDeviceCondition,
    deleteDeviceCondition,
    fetchDeviceConditions,
    setSearchTerm,
    toggleDeviceConditionStatus,
    updateDeviceCondition
} from '../../../redux/deviceConditionSlice';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../SharedUI/Toast';
import SearchBar from '../SharedUI/SearchBar';
import DeviceConditionsGrid from './DeviceConditionsGrid';
import DeleteConfirmModal from '../BrandManagement/DeleteConfirmModal';
import DeviceConditionFormModal from './DeviceConditionFormModal';

export default function DeviceConditionManagementContainer() {
    const dispatch = useDispatch();
    const {
        filteredConditions = [],
        loading = false,
        notification = null,
        searchTerm = ''
    } = useSelector((state) => state.deviceConditions || {});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCondition, setEditingCondition] = useState(null);
    const [deletingCondition, setDeletingCondition] = useState(null);

    useEffect(() => {
        dispatch(fetchDeviceConditions());
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
        if (editingCondition) {
            await dispatch(updateDeviceCondition({ id: editingCondition._id, conditionData: formData }));
        } else {
            await dispatch(createDeviceCondition(formData));
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (!deletingCondition) return;
        await dispatch(deleteDeviceCondition(deletingCondition._id));
        closeDeleteModal();
    };

    const handleToggleStatus = async (condition) => {
        await dispatch(toggleDeviceConditionStatus(condition));
    };

    const handleSearch = (term) => {
        dispatch(setSearchTerm(term));
    };

    const openModal = (condition = null) => {
        setEditingCondition(condition);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCondition(null);
    };

    const openDeleteModal = (condition) => {
        setDeletingCondition(condition);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingCondition(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-6">
            <Toast notification={notification} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                     <h1 className="text-4xl font-bold text-[#a34610] mb-2">
                        Device Condition Management
                    </h1>
                    <p className="text-gray-600">Manage device condition types and descriptions</p>
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    onAddClick={() => openModal()}
                    placeholder="Search device conditions..."
                    addButtonText="Add Condition"
                    addButtonIcon={CheckCircle}
                    buttonClassName="bg-gradient-to-br from-[#C8AF9C] to-[#a34610]"
                />

                <DeviceConditionsGrid
                    conditions={filteredConditions}
                    loading={loading}
                    onEdit={openModal}
                    onDelete={openDeleteModal}
                    onToggleStatus={handleToggleStatus}
                />
            </div>

            <DeviceConditionFormModal
                isOpen={isModalOpen}
                editingCondition={editingCondition}
                onClose={closeModal}
                onSubmit={handleFormSubmit}
                loading={loading}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                condition={deletingCondition}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                loading={loading}
            />
        </div>
    );
}