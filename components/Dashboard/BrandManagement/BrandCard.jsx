import { Edit2, Trash2 } from 'lucide-react';

const BrandCard = ({ brand, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="h-2 bg-gradient-to-br from-[#C8AF9C] to-[#a34610]"></div>
      <div className="p-6">
        {brand.logo && (
          <div className="w-16 h-16 mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-800 mb-2">{brand.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {brand.description || 'No description available'}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggleStatus(brand)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              brand.isActive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {brand.isActive ? 'Active' : 'Inactive'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(brand)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit brand"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(brand)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete brand"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCard;