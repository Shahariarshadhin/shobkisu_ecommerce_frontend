"use client"
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { fetchActiveLayouts } from '../../redux/homepageProductLayoutSlice';
import { useCartActions } from '../../hooks/useCartActions';

export default function HomepageProductSections() {
  const dispatch = useDispatch();
  const { activeLayouts = [], loading = false } = useSelector(
    (state) => state.homepageLayout || {}
  );
  const { handleAddToCart } = useCartActions();

  useEffect(() => {
    dispatch(fetchActiveLayouts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (activeLayouts.length === 0) {
    return null;
  }

  return (
    <div className="py-8 space-y-16">
      {activeLayouts.map((layout) => {
        if (!layout.products || layout.products.length === 0) return null;

        return (
          <section key={layout._id} className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                      {layout.flagId?.type}
                    </h2>
                    {layout.flagId?.description && (
                      <p className="text-gray-600">{layout.flagId.description}</p>
                    )}
                  </div>
                  <button className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2">
                    View All
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="h-1 w-20 bg-gradient-to-br from-[#C8AF9C] to-[#a34610] rounded-full mt-4"></div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {layout.products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onAddToCart }) {
  const getDiscountPercentage = () => {
    if (product.pricing?.originalPrice && product.pricing?.sellingPrice) {
      const discount = Math.round(
        ((product.pricing.originalPrice - product.pricing.sellingPrice) /
          product.pricing.originalPrice) *
          100
      );
      return discount > 0 ? discount : null;
    }
    return null;
  };

  const discount = getDiscountPercentage();

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group relative">
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
          -{discount}%
        </div>
      )}

      {/* Stock Badge */}
      {product.stock <= 5 && product.stock > 0 && (
        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
          Only {product.stock} left
        </div>
      )}

      {product.stock === 0 && (
        <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
          Out of Stock
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        {product.thumbnailImage ? (
          <img
            src={product.thumbnailImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="text-gray-300" size={64} />
          </div>
        )}
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Brand & Model */}
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
          {product.brandId?.name && <span>{product.brandId.name}</span>}
          {product.brandId?.name && product.modelId?.name && <span>•</span>}
          {product.modelId?.name && <span>{product.modelId.name}</span>}
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.0)</span>
        </div>

        {/* Product Details */}
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
          {product.deviceConditionId && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {product.deviceConditionId.name}
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-purple-600">
              ${product.pricing?.sellingPrice?.toFixed(2)}
            </span>
            {product.pricing?.originalPrice &&
              product.pricing.originalPrice > product.pricing.sellingPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.pricing.originalPrice.toFixed(2)}
                </span>
              )}
          </div>
          {product.pricing?.discountPrice && (
            <span className="text-xs text-green-600 font-medium">
              Save ${(product.pricing.originalPrice - product.pricing.sellingPrice).toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            product.stock === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'border border-[#a34610] hover:bg-[#a34610] text-[#a34610] hover:text-white'
          }`}
        >
          <ShoppingCart size={18} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}