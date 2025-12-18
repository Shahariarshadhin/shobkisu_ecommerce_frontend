
export function SortFilter({ value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
            >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
            </select>
        </div>
    );
}


export function StockFilter({ value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Availability
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
            >
                <option value="all">All Products</option>
                <option value="instock">In Stock</option>
                <option value="outofstock">Out of Stock</option>
            </select>
        </div>
    );
}