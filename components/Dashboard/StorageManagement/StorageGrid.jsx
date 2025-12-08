import StorageCard from './StorageCard';

const StorageGrid = ({ storage, loading, onEdit, onDelete, onToggleStatus }) => {
    if (loading && storage.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (storage.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <p className="text-gray-500 text-lg">No storage configurations found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storage.map((item) => (
                <StorageCard
                    key={item._id}
                    storage={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                />
            ))}
        </div>
    );
};

export default StorageGrid;
