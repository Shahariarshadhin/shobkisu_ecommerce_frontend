
import { ShoppingCart } from 'lucide-react';

export default function ProductListItem({ product, onAddToCart }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex">
            <div className="relative w-48 h-48 bg-gray-100 flex-shrink-0">
                <img
                    src={product.thumbnailImage || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Out of Stock
                        </span>
                    </div>
                )}
                {product.pricing?.discountPrice && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        SALE
                    </div>
                )}
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">
                                {product.brandId?.name} • {product.modelId?.name}
                            </p>
                            <h3 className="font-bold text-gray-900 text-xl mb-2">
                                {product.name}
                            </h3>
                        </div>
                        <div className="text-right ml-4">
                            {product.pricing?.discountPrice && (
                                <p className="text-sm text-gray-500 line-through">
                                    ${product.pricing.originalPrice}
                                </p>
                            )}
                            <p className="text-2xl font-bold text-purple-600">
                                ${product.pricing?.sellingPrice || '0.00'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600 mb-3">
                        {product.storageId && (
                            <div className="bg-gray-50 px-3 py-2 rounded">
                                <span className="font-semibold">Storage:</span> {product.storageId.ram}/{product.storageId.rom}
                            </div>
                        )}
                        {product.colorId && (
                            <div className="bg-gray-50 px-3 py-2 rounded">
                                <span className="font-semibold">Color:</span> {product.colorId.name}
                            </div>
                        )}
                        {product.conditionId && (
                            <div className="bg-gray-50 px-3 py-2 rounded">
                                <span className="font-semibold">Condition:</span> {product.conditionId.condition}
                            </div>
                        )}
                        {product.warrantyId && (
                            <div className="bg-gray-50 px-3 py-2 rounded">
                                <span className="font-semibold">Warranty:</span> {product.warrantyId.duration}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                    }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>

                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                            product.stock === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'border border-[#a34610] hover:bg-[#a34610] text-[#a34610] hover:text-white'
                        }`}
                    >
                        <ShoppingCart size={20} />
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}