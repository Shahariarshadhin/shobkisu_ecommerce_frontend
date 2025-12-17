"use client";
import { X, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { closeCart } from '../../../redux/uiSlice';
import CartComponent from '../../../app/cart/page';

export default function CartModal() {
  const dispatch = useDispatch();
  const { cartOpen } = useSelector((state) => state.ui);
  const cartItems = useSelector((state) => state.cart.items);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart /> Cart ({cartItems.length})
          </h2>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            <CartComponent />
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <button
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
