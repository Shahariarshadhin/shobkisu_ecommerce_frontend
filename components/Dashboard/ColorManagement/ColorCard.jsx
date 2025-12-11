import { Edit2, Palette, Trash2 } from 'lucide-react';

const ColorCard = ({ color, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
     <div className="h-2 bg-gradient-to-br from-[#C8AF9C] to-[#a34610]"></div>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-16 h-16 rounded-xl shadow-md border-2 border-gray-200 flex items-center justify-center"
            style={{ backgroundColor: color.hexCode || '#cccccc' }}
          >
            {!color.hexCode && <Palette className="text-gray-400" size={24} />}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{color.name}</h3>
            <p className="text-sm text-gray-600 font-mono">
              {color.hexCode || 'No hex code'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggleStatus(color)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              color.isActive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {color.isActive ? 'Active' : 'Inactive'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(color)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit color"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(color)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete color"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorCard;