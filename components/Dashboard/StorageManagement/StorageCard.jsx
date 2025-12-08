import { Edit2, HardDrive, Trash2 } from 'lucide-react';

const StorageCard = ({ storage, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-orange-600 to-amber-600"></div>
      <div className="p-6">
        <div className="w-16 h-16 mb-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
          <HardDrive className="text-orange-600" size={32} />
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">RAM:</span>
            <span className="text-lg font-bold text-gray-800">{storage.ram}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">ROM:</span>
            <span className="text-lg font-bold text-gray-800">{storage.rom}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggleStatus(storage)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              storage.isActive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {storage.isActive ? 'Active' : 'Inactive'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(storage)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit storage"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(storage)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete storage"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageCard;