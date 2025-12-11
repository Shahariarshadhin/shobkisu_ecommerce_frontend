"use client"
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const WarrantyFormModal = ({ isOpen, editingWarranty, onClose, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        duration: '',
        type: '',
        description: '',
        isActive: true
    });

    // Common warranty durations
    const durationOptions = [
        '30 Days', '60 Days', '90 Days',
        '6 Months', '1 Year', '2 Years', '3 Years', '5 Years',
        'Lifetime', 'No Warranty'
    ];

    // Common warranty types
    const typeOptions = [
        'Manufacturer Warranty',
        'Extended Warranty',
        'Limited Warranty',
        'Full Warranty',
        'International Warranty',
        'Seller Warranty',
        'Service Warranty',
        'Parts & Labor'
    ];

    useEffect(() => {
        if (editingWarranty) {
            setFormData({
                duration: editingWarranty.duration,
                type: editingWarranty.type,
                description: editingWarranty.description || '',
                isActive: editingWarranty.isActive
            });
        } else {
            setFormData({ duration: '', type: '', description: '', isActive: true });
        }
    }, [editingWarranty, isOpen]);

    const handleSubmit = () => {
        if (formData.duration.trim() && formData.type.trim()) {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingWarranty ? 'Edit Warranty' : 'Add New Warranty'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration *
                        </label>
                        <select
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Select duration</option>
                            {durationOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type *
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Select type</option>
                            {typeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter warranty details"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-sky-600 rounded focus:ring-2 focus:ring-sky-500"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            Active
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.duration.trim() || !formData.type.trim()}
                            className="flex-1 px-4 py-2 bg-linear-to-br from-[#C8AF9C] to-[#a34610] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : editingWarranty ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarrantyFormModal;