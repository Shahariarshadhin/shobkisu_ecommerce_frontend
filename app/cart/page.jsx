'use client'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { removeItem, incrementQuantity, decrementQuantity, clearCart } from '../../redux/cartSlice';
import { closeCart } from '../../redux/uiSlice';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const isOpen = useSelector((state) => state.ui.cartOpen);
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.pricing?.sellingPrice || 0);
    return sum + (price * item.quantity);
  }, 0);

  const tax = subtotal * 0.05; // 5% tax
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over $500
  const discount = appliedCoupon ? (subtotal * appliedCoupon.percent / 100) : 0;
  const total = subtotal + tax + shipping - discount;

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const handleIncrement = (itemId) => {
    dispatch(incrementQuantity(itemId));
  };

  const handleDecrement = (itemId) => {
    dispatch(decrementQuantity(itemId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      setAppliedCoupon(null);
    }
  };

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleApplyCoupon = () => {
    if (couponCode === 'SAVE10') {
      setAppliedCoupon({ code: couponCode, percent: 10 });
    } else if (couponCode === 'SAVE20') {
      setAppliedCoupon({ code: couponCode, percent: 20 });
    } else {
      alert('Invalid coupon code. Try SAVE10 or SAVE20');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    dispatch(closeCart());
    router.push('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="flex items-center gap-3 text-white">
            <ShoppingBag size={24} />
            <div>
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <p className="text-sm text-white/80">{cartItems.length} items</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to get started!</p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.thumbnailImage || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.brandId?.name} • {item.modelId?.name}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                          <button
                            onClick={() => handleDecrement(item._id)}
                            className="text-gray-600 hover:text-purple-600 p-1 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-semibold min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item._id)}
                            className="text-gray-600 hover:text-purple-600 p-1 transition-colors"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-lg font-bold text-purple-600">
                          ${(parseFloat(item.pricing?.sellingPrice || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Stock Warning */}
                      {item.stock < 5 && item.stock > 0 && (
                        <p className="text-xs text-orange-600 mt-1">
                          Only {item.stock} left in stock!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              {cartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            {/* Coupon Section */}
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <span className="text-sm text-green-700 font-medium">
                    Coupon "{appliedCoupon.code}" applied! ({appliedCoupon.percent}% off)
                  </span>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-green-700 hover:text-green-900"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-purple-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              {shipping === 0 ? '🎉 You get free shipping!' : `Free shipping on orders over $500`}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
