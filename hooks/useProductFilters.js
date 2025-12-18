"use client"

import { useState, useEffect } from 'react';

export const useProductFilters = (products) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedModels, setSelectedModels] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [selectedSims, setSelectedSims] = useState([]);
    const [selectedStorage, setSelectedStorage] = useState([]);
    const [selectedWarranties, setSelectedWarranties] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [sortBy, setSortBy] = useState('featured');
    const [stockFilter, setStockFilter] = useState('all');

    useEffect(() => {
        applyFilters();
    }, [
        products,
        searchTerm,
        selectedBrands,
        selectedModels,
        selectedColors,
        selectedConditions,
        selectedSims,
        selectedStorage,
        selectedWarranties,
        priceRange,
        sortBy,
        stockFilter
    ]);

    const applyFilters = () => {
        let filtered = [...products];
        filtered = filtered.filter(p => p.isActive);

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.brandId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.modelId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedBrands.length > 0) {
            filtered = filtered.filter(p => selectedBrands.includes(p.brandId?._id));
        }
        if (selectedModels.length > 0) {
            filtered = filtered.filter(p => selectedModels.includes(p.modelId?._id));
        }
        if (selectedColors.length > 0) {
            filtered = filtered.filter(p => selectedColors.includes(p.colorId?._id));
        }
        if (selectedConditions.length > 0) {
            filtered = filtered.filter(p => selectedConditions.includes(p.conditionId?._id));
        }
        if (selectedSims.length > 0) {
            filtered = filtered.filter(p => selectedSims.includes(p.simId?._id));
        }
        if (selectedStorage.length > 0) {
            filtered = filtered.filter(p => selectedStorage.includes(p.storageId?._id));
        }
        if (selectedWarranties.length > 0) {
            filtered = filtered.filter(p => selectedWarranties.includes(p.warrantyId?._id));
        }

        filtered = filtered.filter(p => {
            const price = parseFloat(p.pricing?.sellingPrice || 0);
            return price >= priceRange.min && price <= priceRange.max;
        });

        if (stockFilter === 'instock') {
            filtered = filtered.filter(p => p.stock > 0);
        } else if (stockFilter === 'outofstock') {
            filtered = filtered.filter(p => p.stock === 0);
        }

        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => parseFloat(a.pricing?.sellingPrice || 0) - parseFloat(b.pricing?.sellingPrice || 0));
                break;
            case 'price-high':
                filtered.sort((a, b) => parseFloat(b.pricing?.sellingPrice || 0) - parseFloat(a.pricing?.sellingPrice || 0));
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
    };

    const toggleFilter = (filterId, selectedArray, setSelectedArray) => {
        setSelectedArray(prev =>
            prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedBrands([]);
        setSelectedModels([]);
        setSelectedColors([]);
        setSelectedConditions([]);
        setSelectedSims([]);
        setSelectedStorage([]);
        setSelectedWarranties([]);
        setPriceRange({ min: 0, max: 10000 });
        setSortBy('featured');
        setStockFilter('all');
    };

    const activeFiltersCount = 
        selectedBrands.length + 
        selectedModels.length +
        selectedColors.length + 
        selectedConditions.length + 
        selectedSims.length +
        selectedStorage.length + 
        selectedWarranties.length + 
        (stockFilter !== 'all' ? 1 : 0);

    return {
        filteredProducts,
        searchTerm,
        setSearchTerm,
        selectedBrands,
        setSelectedBrands,
        selectedModels,
        setSelectedModels,
        selectedColors,
        setSelectedColors,
        selectedConditions,
        setSelectedConditions,
        selectedSims,
        setSelectedSims,
        selectedStorage,
        setSelectedStorage,
        selectedWarranties,
        setSelectedWarranties,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        stockFilter,
        setStockFilter,
        toggleFilter,
        clearFilters,
        activeFiltersCount
    };
};