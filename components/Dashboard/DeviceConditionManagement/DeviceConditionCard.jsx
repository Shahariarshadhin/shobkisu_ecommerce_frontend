import React from 'react';
import { Edit2, Trash2, CheckCircle, AlertCircle, Star } from 'lucide-react';

const DeviceConditionCard = ({ condition, onEdit, onDelete, onToggleStatus }) => {
  // Icon based on condition
  const getConditionIcon = () => {
    const conditionLower = condition.condition.toLowerCase();
    if (conditionLower.includes('new') || conditionLower.includes('brand')) {
      return <Star className="text-emerald-600" size={32} />;
    } else if (conditionLower.includes('excellent') || conditionLower.includes('like new')) {
      return <CheckCircle className="text-green-600" size={32} />;
    } else if (conditionLower.includes('good') || conditionLower.includes('fair')) {
      return <CheckCircle className="text-blue-600" size={32} />;
    } else {
      return <AlertCircle className="text-amber-600" size={32} />;
    }
  };

  // Color based on condition
  const getConditionColor = () => {
    const conditionLower = condition.condition.toLowerCase();
    if (conditionLower.includes('new') || conditionLower.includes('brand')) {
      return 'from-emerald-100 to-green-100';
    } else if (conditionLower.includes('excellent') || conditionLower.includes('like new')) {
      return 'from-green-100 to-teal-100';
    } else if (conditionLower.includes('good') || conditionLower.includes('fair')) {
      return 'from-blue-100 to-cyan-100';
    } else {
      return 'from-amber-100 to-yellow-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="h-2 bg-gradient-to-br from-[#C8AF9C] to-[#a34610]"></div>
      <div className="p-6">
        <div className={`w-16 h-16 mb-4 bg-gradient-to-br ${getConditionColor()} rounded-xl flex items-center justify-center`}>
          {getConditionIcon()}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">{condition.condition}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {condition.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggleStatus(condition)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              condition.isActive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {condition.isActive ? 'Active' : 'Inactive'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(condition)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit condition"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(condition)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete condition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceConditionCard;