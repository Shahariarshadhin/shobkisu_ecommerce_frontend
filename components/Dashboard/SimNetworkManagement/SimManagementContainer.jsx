"use client"
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Smartphone } from 'lucide-react';
import {
    clearNotification,
    createSim,
    deleteSim,
    fetchSims,
    setSearchTerm,
    toggleSimStatus,
    updateSim
} from '../../../redux/simSlice';
import Toast from '../SharedUI/Toast';
import SearchBar from '../SharedUI/SearchBar';
import SimsGrid from './SimsGrid';
import SimFormModal from './SimFormModal';
import DeleteConfirmModal from '../BrandManagement/DeleteConfirmModal';

export default function SimManagementContainer() {
    const dispatch = useDispatch();
    const {
        filteredSims = [],
        loading = false,
        notification = null,
        searchTerm = ''
    } = useSelector((state) => state.sims || {});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingSim, setEditingSim] = useState(null);
    const [deletingSim, setDeletingSim] = useState(null);

    useEffect(() => {
        dispatch(fetchSims());
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
        if (editingSim) {
            await dispatch(updateSim({ id: editingSim._id, simData: formData }));
        } else {
            await dispatch(createSim(formData));
        }
        closeModal();
    };

    const handleDelete = async () => {
        if (!deletingSim) return;
        await dispatch(deleteSim(deletingSim._id));
        closeDeleteModal();
    };

    const handleToggleStatus = async (sim) => {
        await dispatch(toggleSimStatus(sim));
    };

    const handleSearch = (term) => {
        dispatch(setSearchTerm(term));
    };

    const openModal = (sim = null) => {
        setEditingSim(sim);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSim(null);
    };

    const openDeleteModal = (sim) => {
        setDeletingSim(sim);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingSim(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 p-6">
            <Toast notification={notification} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        SIM Management
                    </h1>
                    <p className="text-gray-600">Manage SIM card types and configurations</p>
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    onAddClick={() => openModal()}
                    placeholder="Search SIM types..."
                    addButtonText="Add SIM Type"
                    addButtonIcon={Smartphone}
                    buttonClassName="bg-gradient-to-r from-indigo-600 to-violet-600"
                />

                <SimsGrid
                    sims={filteredSims}
                    loading={loading}
                    onEdit={openModal}
                    onDelete={openDeleteModal}
                    onToggleStatus={handleToggleStatus}
                />
            </div>

            <SimFormModal
                isOpen={isModalOpen}
                editingSim={editingSim}
                onClose={closeModal}
                onSubmit={handleFormSubmit}
                loading={loading}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                sim={deletingSim}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                loading={loading}
            />
        </div>
    );
}