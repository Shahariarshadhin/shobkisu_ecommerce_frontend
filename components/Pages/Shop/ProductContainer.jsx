"use client"

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../redux/productSlice';
import { fetchBrands } from '../../../redux/brandSlice';
import { fetchModels } from '../../../redux/modelSlice';
import { fetchColors } from '../../../redux/colorSlice';
import { fetchDeviceConditions } from '../../../redux/deviceConditionSlice';
import { fetchSims } from '../../../redux/simSlice';
import { fetchStorage } from '../../../redux/storageSlice';
import { fetchWarranties } from '../../../redux/warrantySlice';         
import { useProductFilters } from '../../../hooks/useProductFilters';
import { useCartActions } from '../../../hooks/useCartActions';
import ProductHeader from './layout/ProductHeader';
import ProductSidebar from './layout/ProductSidebar';
import ProductGrid from './layout/ProductGrid';
import CartSidebar from '../../../app/cart/page';

export default function ProductContainer() {
    const dispatch = useDispatch();
    const [showFilters, setShowFilters] = useState(false);

    // Redux state
    const { products = [], loading: productsLoading } = useSelector((state) => state.products || {});
    const { brands = [] } = useSelector((state) => state.brands || {});
    const { models = [] } = useSelector((state) => state.models || {});
    const { colors = [] } = useSelector((state) => state.colors || {});
    const { conditions = [] } = useSelector((state) => state.deviceConditions || {});
    const { sims = [] } = useSelector((state) => state.sims || {});
    const { storage = [] } = useSelector((state) => state.storage || {});
    const { warranties = [] } = useSelector((state) => state.warranties || {});
    const cartItems = useSelector((state) => state.cart.items);

    // Custom hooks
    const filterState = useProductFilters(products);
    const { handleAddToCart } = useCartActions();

    // Fetch all data on mount
    useEffect(() => {
        dispatch(fetchProducts({ page: 1, limit: 100 }));
        dispatch(fetchBrands());
        dispatch(fetchModels());
        dispatch(fetchColors());
        dispatch(fetchDeviceConditions());
        dispatch(fetchSims());
        dispatch(fetchStorage());
        dispatch(fetchWarranties());
    }, [dispatch]);

    // Prepare filter data
    const filterData = {
        brands,
        models,
        colors,
        conditions,
        sims,
        storage,
        warranties
    };

    // Prepare filter change handlers
    const onFilterChange = {
        setSelectedBrands: filterState.setSelectedBrands,
        setSelectedModels: filterState.setSelectedModels,
        setSelectedColors: filterState.setSelectedColors,
        setSelectedConditions: filterState.setSelectedConditions,
        setSelectedSims: filterState.setSelectedSims,
        setSelectedStorage: filterState.setSelectedStorage,
        setSelectedWarranties: filterState.setSelectedWarranties,
        setPriceRange: filterState.setPriceRange,
        setSortBy: filterState.setSortBy,
        setStockFilter: filterState.setStockFilter
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
            <ProductHeader
                searchTerm={filterState.searchTerm}
                onSearchChange={filterState.setSearchTerm}
                cartItemsCount={cartItems.length}
                activeFiltersCount={filterState.activeFiltersCount}
                onToggleFilters={() => setShowFilters(!showFilters)}
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8">
                    <ProductSidebar
                        showFilters={showFilters}
                        filterData={filterData}
                        filterState={filterState}
                        onFilterChange={onFilterChange}
                        onClearFilters={filterState.clearFilters}
                        activeFiltersCount={filterState.activeFiltersCount}
                    />

                    <ProductGrid
                        products={filterState.filteredProducts}
                        loading={productsLoading}
                        onAddToCart={handleAddToCart}
                        onClearFilters={filterState.clearFilters}
                    />
                </div>
            </div>

            <CartSidebar />

            <style jsx global>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}