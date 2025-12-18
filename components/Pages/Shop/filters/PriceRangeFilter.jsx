export default function PriceRangeFilter({ priceRange, onChange }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price Range
            </label>
            <div className="space-y-3">
                <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange.max}
                    onChange={(e) => onChange({ ...priceRange, max: parseInt(e.target.value) })}
                    className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                </div>
            </div>
        </div>
    );
}