"use client"
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const StorageFormModal = ({ isOpen, editingStorage, onClose, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        ram: '',
        rom: '',
        isActive: true
    });

    const [customRAM, setCustomRAM] = useState('');
    const [customROM, setCustomROM] = useState('');

    // Common RAM options
    const ramOptions = ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB', '18GB', '24GB'];

    // Common ROM options
    const romOptions = ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];

    useEffect(() => {
        if (editingStorage) {
            const isCustomRAM = !ramOptions.includes(editingStorage.ram);
            const isCustomROM = !romOptions.includes(editingStorage.rom);

            setFormData({
                ram: isCustomRAM ? 'custom' : editingStorage.ram,
                rom: isCustomROM ? 'custom' : editingStorage.rom,
                isActive: editingStorage.isActive
            });

            if (isCustomRAM) setCustomRAM(editingStorage.ram);
            if (isCustomROM) setCustomROM(editingStorage.rom);
        } else {
            setFormData({ ram: '', rom: '', isActive: true });
            setCustomRAM('');
            setCustomROM('');
        }
    }, [editingStorage, isOpen]);

    const handleSubmit = () => {
        const finalData = {
            ram: formData.ram === 'custom' ? customRAM : formData.ram,
            rom: formData.rom === 'custom' ? customROM : formData.rom,
            isActive: formData.isActive
        };

        if (finalData.ram.trim() && finalData.rom.trim()) {
            onSubmit(finalData);
            // Reset form
            setFormData({ ram: '', rom: '', isActive: true });
            setCustomRAM('');
            setCustomROM('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingStorage ? 'Edit Storage' : 'Add New Storage'}
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
                            RAM *
                        </label>
                        <div className="space-y-2">
                            <select
                                value={formData.ram}
                                onChange={(e) => {
                                    setFormData({ ...formData, ram: e.target.value });
                                    if (e.target.value !== 'custom') {
                                        setCustomRAM('');
                                    }
                                }}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="">Select RAM</option>
                                {ramOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                                <option value="custom">Custom...</option>
                            </select>

                            {formData.ram === 'custom' && (
                                <input
                                    type="text"
                                    placeholder="Enter custom RAM (e.g., 10GB)"
                                    value={customRAM}
                                    onChange={(e) => setCustomRAM(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ROM *
                        </label>
                        <div className="space-y-2">
                            <select
                                value={formData.rom}
                                onChange={(e) => {
                                    setFormData({ ...formData, rom: e.target.value });
                                    if (e.target.value !== 'custom') {
                                        setCustomROM('');
                                    }
                                }}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="">Select ROM</option>
                                {romOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                                <option value="custom">Custom...</option>
                            </select>

                            {formData.rom === 'custom' && (
                                <input
                                    type="text"
                                    placeholder="Enter custom ROM (e.g., 500GB)"
                                    value={customROM}
                                    onChange={(e) => setCustomROM(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
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
                            disabled={
                                loading || 
                                !formData.ram || 
                                !formData.rom || 
                                (formData.ram === 'custom' && !customRAM.trim()) ||
                                (formData.rom === 'custom' && !customROM.trim())
                            }
                            className="flex-1 px-4 py-2 bg-gradient-to-br from-[#C8AF9C] to-[#a34610] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : editingStorage ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StorageFormModal;