
import { List, Tally2, Tally3, Tally4, Tally5 } from 'lucide-react';

export default function ViewModeSelector({ viewMode, onChange }) {
    const viewModes = [
        { id: 'list', icon: List, label: 'List View' },
        { id: 'grid-2', icon: Tally2, label: '2 Columns', showNumber: true },
        { id: 'grid-3', icon: Tally3, label: '3 Columns', showNumber: true },
        { id: 'grid-4', icon: Tally4, label: '4 Columns', showNumber: true },
        { id: 'grid-5', icon: Tally5, label: '5 Columns', showNumber: true }
    ];

    return (
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-md p-1">
            {viewModes.map(({ id, icon: Icon, label, showNumber }) => (
                <button
                    key={id}
                    onClick={() => onChange(id)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all ${
                        viewMode === id
                            ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title={label}
                >
                    <Icon size={18} />
                    {showNumber && (
                        <span className="text-xs hidden sm:inline">
                            {id.split('-')[1]}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}