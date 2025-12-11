import React from 'react';
import { Edit2, Trash2, Package } from 'lucide-react';

const ModelCard = ({ model, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="h-2  bg-linear-to-br from-[#C8AF9C] to-[#a34610]"></div>
      <div className="p-6">
        <div className="w-16 h-16 mb-4 bg-linear-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
          <Package className="text-blue-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">{model.name}</h3>
        <p className="text-sm text-gray-500 mb-2">
          Brand: <span className="font-medium text-gray-700">{model.brandId?.name || 'N/A'}</span>
        </p>
        {model.releaseYear && (
          <p className="text-sm text-gray-600 mb-4">
            Released: {model.releaseYear}
          </p>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggleStatus(model)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              model.isActive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {model.isActive ? 'Active' : 'Inactive'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(model)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit model"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(model)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete model"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;