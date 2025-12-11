"use client"

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const ColorFormModal = ({ isOpen, editingColor, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    hexCode: '#000000',
    isActive: true
  });

  useEffect(() => {
    if (editingColor) {
      setFormData({
        name: editingColor.name,
        hexCode: editingColor.hexCode || '#000000',
        isActive: editingColor.isActive
      });
    } else {
      setFormData({ name: '', hexCode: '#000000', isActive: true });
    }
  }, [editingColor, isOpen]);

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingColor ? 'Edit Color' : 'Add New Color'}
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
              Color Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter color name (e.g., Red, Blue)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hex Code
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={formData.hexCode}
                onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={formData.hexCode}
                onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 font-mono"
                placeholder="#000000"
                maxLength={7}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Click the color box or enter hex code</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-pink-600 rounded focus:ring-2 focus:ring-pink-500"
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
              disabled={loading || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-linear-to-br from-[#C8AF9C] to-[#a34610] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : editingColor ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorFormModal;