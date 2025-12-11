import { Plus, Search } from 'lucide-react';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  onAddClick,
  placeholder = "Search...",
  addButtonText = "Add New",
  addButtonIcon: AddIcon = Plus,
  showAddButton = true,
  className = "",
  searchClassName = "",
  buttonClassName = ""
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 mb-6 ${className}`}>
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${searchClassName}`}
        />
      </div>
      {showAddButton && onAddClick && (
        <button
          onClick={onAddClick}
          className={`flex items-center gap-2 px-6 py-3 bg-linear-to-br from-[#C8AF9C] to-[#a34610] text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${buttonClassName}`}
        >
          <AddIcon size={20} />
          {addButtonText}
        </button>
      )}
    </div>
  );
};

export default SearchBar;