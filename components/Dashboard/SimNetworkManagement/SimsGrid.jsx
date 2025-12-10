import SimCard from './SimCard';

const SimsGrid = ({ sims, loading, onEdit, onDelete, onToggleStatus }) => {
  if (loading && sims.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (sims.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
        <p className="text-gray-500 text-lg">No SIM types found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sims.map((sim) => (
        <SimCard
          key={sim._id}
          sim={sim}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

export default SimsGrid;