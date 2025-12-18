import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, isCompact = false }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className={`relative ${isCompact ? 'h-40' : 'h-64'} bg-gray-100`}>
                <img
                    src={product.thumbnailImage || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className={`bg-red-500 text-white px-3 py-1 rounded-full ${isCompact ? 'text-xs' : 'text-sm'} font-semibold`}>
                            Out of Stock
                        </span>
                    </div>
                )}
                {product.pricing?.discountPrice && (
                    <div className={`absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full ${isCompact ? 'text-xs' : 'text-sm'} font-bold`}>
                        SALE
                    </div>
                )}
            </div>

            <div className={isCompact ? 'p-3' : 'p-5'}>
                <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1 truncate">
                        {product.brandId?.name} • {product.modelId?.name}
                    </p>
                    <h3 className={`font-bold text-gray-900 ${isCompact ? 'text-sm' : 'text-lg'} truncate`} title={product.name}>
                        {product.name}
                    </h3>
                </div>

                {!isCompact && (
                    <div className="text-xs text-gray-600 mb-3 space-y-1">
                        {product.storageId && (
                            <p className="truncate">Storage: {product.storageId.ram} / {product.storageId.rom}</p>
                        )}
                        {product.colorId && (
                            <p className="truncate">Color: {product.colorId.name}</p>
                        )}
                        {product.conditionId && (
                            <p className="truncate">Condition: {product.conditionId.condition}</p>
                        )}
                    </div>
                )}

                <div className={isCompact ? 'mb-2' : 'mb-4'}>
                    {product.pricing?.discountPrice && (
                        <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-500 line-through`}>
                            ${product.pricing.originalPrice}
                        </p>
                    )}
                    <p className={`${isCompact ? 'text-lg' : 'text-2xl'} font-bold text-purple-600`}>
                        ${product.pricing?.sellingPrice || '0.00'}
                    </p>
                </div>

                <div className={isCompact ? 'mb-2' : 'mb-4'}>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                    }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                </div>

                <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full flex items-center justify-center gap-2 px-4 ${isCompact ? 'py-2 text-sm' : 'py-3'} rounded-lg font-semibold transition-colors ${
                        product.stock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'border border-[#a34610] hover:bg-[#a34610] text-[#a34610] hover:text-white'
                    }`}
                >
                    <ShoppingCart size={isCompact ? 16 : 20} />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}