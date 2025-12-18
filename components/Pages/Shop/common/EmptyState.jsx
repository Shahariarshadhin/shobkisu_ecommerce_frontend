import { Search } from 'lucide-react';

export function EmptyState({ onClearFilters }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
                <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No products found
            </h3>
            <p className="text-gray-500 mb-6">
                Try adjusting your filters or search terms
            </p>
            <button
                onClick={onClearFilters}
                className="px-6 py-2 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
                Clear Filters
            </button>
        </div>
    );
}