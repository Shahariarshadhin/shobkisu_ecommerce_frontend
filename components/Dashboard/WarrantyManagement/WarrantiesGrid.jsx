import WarrantyCard from './WarrantyCard';

const WarrantiesGrid = ({ warranties, loading, onEdit, onDelete, onToggleStatus }) => {
  if (loading && warranties.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (warranties.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
        <p className="text-gray-500 text-lg">No warranties found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {warranties.map((warranty) => (
        <WarrantyCard
          key={warranty._id}
          warranty={warranty}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

export default WarrantiesGrid;
