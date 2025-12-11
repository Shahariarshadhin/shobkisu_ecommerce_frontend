import React from 'react';
import { Edit2, Trash2, Smartphone } from 'lucide-react';

const SimCard = ({ sim, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="h-2 bg-linear-to-br from-[#C8AF9C] to-[#a34610]"></div>
      <div className="p-6">
        <div className="w-16 h-16 mb-4 bg-linear-to-br from-indigo-100 to-violet-100 rounded-xl flex items-center justify-center">
          <Smartphone className="text-indigo-600" size={32} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">{sim.type}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {sim.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggleStatus(sim)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              sim.isActive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {sim.isActive ? 'Active' : 'Inactive'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(sim)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit SIM"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(sim)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete SIM"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimCard;