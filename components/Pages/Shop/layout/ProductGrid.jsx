"use client"

import { useState } from 'react';
import ViewModeSelector from '../cards/ViewModeSelector';
import ProductCard from '../cards/ProductCard';
import ProductListItem from '../cards/ProductListItem';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';

export default function ProductGrid({ 
    products, 
    loading, 
    onAddToCart, 
    onClearFilters 
}) {
    const [viewMode, setViewMode] = useState('grid-4');

    const getGridClass = () => {
        switch (viewMode) {
            case 'list':
                return 'grid grid-cols-1 gap-4';
            case 'grid-2':
                return 'grid grid-cols-1 sm:grid-cols-2 gap-6';
            case 'grid-3':
                return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
            case 'grid-4':
                return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
            case 'grid-5':
                return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
            default:
                return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
        }
    };

    return (
        <main className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-gray-600">
                    Showing <span className="font-semibold">{products.length}</span> products
                </p>

                <ViewModeSelector viewMode={viewMode} onChange={setViewMode} />
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : products.length === 0 ? (
                <EmptyState onClearFilters={onClearFilters} />
            ) : (
                <div className={getGridClass()}>
                    {products.map(product => (
                        viewMode === 'list' ? (
                            <ProductListItem 
                                key={product._id} 
                                product={product} 
                                onAddToCart={onAddToCart}
                            />
                        ) : (
                            <ProductCard 
                                key={product._id} 
                                product={product} 
                                onAddToCart={onAddToCart}
                                isCompact={viewMode === 'grid-5'}
                            />
                        )
                    ))}
                </div>
            )}
        </main>
    );
}