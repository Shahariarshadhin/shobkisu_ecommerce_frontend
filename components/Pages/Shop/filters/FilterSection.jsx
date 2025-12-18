
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FilterSection({ 
    title, 
    items, 
    selected, 
    onToggle, 
    sectionKey, 
    labelKey = 'name',
    isExpanded,
    onToggleExpand
}) {
    const activeItems = items.filter(item => item.isActive);
    
    if (activeItems.length === 0) return null;

    return (
        <div className="border-b border-gray-200 pb-4">
            <button
                onClick={() => onToggleExpand(sectionKey)}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 mb-2"
            >
                <span>{title}</span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isExpanded && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {activeItems.map(item => (
                        <label 
                            key={item._id} 
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(item._id)}
                                onChange={() => onToggle(item._id)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">
                                {labelKey === 'storage' 
                                    ? `${item.ram} / ${item.rom}` 
                                    : item[labelKey]}
                            </span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}