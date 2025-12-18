"use client"
import { ShoppingCart, Filter, Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openCart } from '../../../../redux/uiSlice';

export default function ProductHeader({ 
    searchTerm, 
    onSearchChange, 
    cartItemsCount, 
    activeFiltersCount, 
    onToggleFilters 
}) {
    const dispatch = useDispatch();

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Shop Products
                    </h1>

                    <div className="flex-1 max-w-xl relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products, brands, SKU..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => dispatch(openCart())}
                            className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                            <ShoppingCart size={20} />
                            <span className="hidden sm:inline">Cart</span>
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold animate-pulse">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={onToggleFilters}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            <Filter size={20} />
                            {activeFiltersCount > 0 && (
                                <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}