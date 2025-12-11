import { Edit2, Trash2, Shield, Clock } from 'lucide-react';

const WarrantyCard = ({ warranty, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="h-2 bg-linear-to-br from-[#C8AF9C] to-[#a34610]"></div>
      <div className="p-6">
        <div className="w-16 h-16 mb-4 bg-linear-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center">
          <Shield className="text-sky-600" size={32} />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-gray-500" size={16} />
            <h3 className="text-xl font-bold text-gray-800">{warranty.duration}</h3>
          </div>
          <p className="text-sm font-medium text-sky-600 mb-2">{warranty.type}</p>
          <p className="text-gray-600 text-sm line-clamp-2">
            {warranty.description || 'No description available'}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggleStatus(warranty)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              warranty.isActive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {warranty.isActive ? 'Active' : 'Inactive'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(warranty)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit warranty"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(warranty)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete warranty"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyCard;