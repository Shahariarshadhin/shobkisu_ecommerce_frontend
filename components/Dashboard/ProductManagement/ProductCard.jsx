import { Edit2, Trash2, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete, onToggleStatus }) => {
  const getDiscountBadge = () => {
    if (product.pricing?.originalPrice && product.pricing?.discountPrice) {
      const discount = Math.round(
        ((product.pricing.originalPrice - product.pricing.discountPrice) / 
        product.pricing.originalPrice) * 100
      );
      return discount > 0 ? discount : null;
    }
    return null;
  };

  const discount = getDiscountBadge();

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
      {discount && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
          -{discount}%
        </div>
      )}
      <div className="h-2 bg-linear-to-r from-purple-600 to-pink-600"></div>
      
      <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.thumbnailImage ? (
          <img 
            src={product.thumbnailImage} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ShoppingBag className="text-gray-300" size={64} />
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
          <span>{product.brandId?.name}</span>
          <span>•</span>
          <span>{product.modelId?.name}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {product.colorId && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {product.colorId.name}
            </span>
          )}
          {product.storageId && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {product.storageId.ram}/{product.storageId.rom}
            </span>
          )}
        </div>
        
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-purple-600">
              ${product.pricing?.sellingPrice?.toFixed(2)}
            </span>
            {product.pricing?.originalPrice && product.pricing.originalPrice > product.pricing.sellingPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.pricing.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        <div className="mb-3">
          <span className={`text-xs font-medium ${
            product.stock > 10 ? 'text-green-600' : 
            product.stock > 0 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={() => onToggleStatus(product)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
              product.isActive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {product.isActive ? 'Active' : 'Inactive'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit product"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete product"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;