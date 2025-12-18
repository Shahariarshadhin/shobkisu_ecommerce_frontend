"use client"

import { useState } from 'react';
import { Filter } from 'lucide-react';
import FilterSection from '../filters/FilterSection';
import PriceRangeFilter from '../filters/PriceRangeFilter';
import { SortFilter, StockFilter } from '../filters/SortStockFilters';

export default function ProductSidebar({
    showFilters,
    filterData,
    filterState,
    onFilterChange,
    onClearFilters,
    activeFiltersCount
}) {
    const [expandedSections, setExpandedSections] = useState({
        brands: true,
        models: false,
        colors: false,
        conditions: false,
        sims: false,
        storage: false,
        warranties: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Filter size={20} />
                        Filters
                    </h2>
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={onClearFilters}
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                <div className="space-y-6">
                    <SortFilter 
                        value={filterState.sortBy} 
                        onChange={onFilterChange.setSortBy} 
                    />

                    <StockFilter 
                        value={filterState.stockFilter} 
                        onChange={onFilterChange.setStockFilter} 
                    />

                    <PriceRangeFilter 
                        priceRange={filterState.priceRange} 
                        onChange={onFilterChange.setPriceRange} 
                    />

                    <FilterSection
                        title="Brands"
                        items={filterData.brands}
                        selected={filterState.selectedBrands}
                        onToggle={(id) => filterState.toggleFilter(id, filterState.selectedBrands, onFilterChange.setSelectedBrands)}
                        sectionKey="brands"
                        isExpanded={expandedSections.brands}
                        onToggleExpand={toggleSection}
                    />

                    <FilterSection
                        title="Models"
                        items={filterData.models}
                        selected={filterState.selectedModels}
                        onToggle={(id) => filterState.toggleFilter(id, filterState.selectedModels, onFilterChange.setSelectedModels)}
                        sectionKey="models"
                        isExpanded={expandedSections.models}
                        onToggleExpand={toggleSection}
                    />

                    <FilterSection
                        title="Colors"
                        items={filterData.colors}
                        selected={filterState.selectedColors}
                        onToggle={(id) => filterState.toggleFilter(id, filterState.selectedColors, onFilterChange.setSelectedColors)}
                        sectionKey="colors"
                        isExpanded={expandedSections.colors}
                        onToggleExpand={toggleSection}
                    />

                    <FilterSection
                        title="Condition"
                        items={filterData.conditions}
                        selected={filterState.selectedConditions}
                        onToggle={(id) => filterState.toggleFilter(id, filterState.selectedConditions, onFilterChange.setSelectedConditions)}
                        sectionKey="conditions"
                        labelKey="condition"
                        isExpanded={expandedSections.conditions}
                        onToggleExpand={toggleSection}
                    />

                    <FilterSection
                        title="SIM Type"
                        items={filterData.sims}
                        selected={filterState.selectedSims}
                        onToggle={(id) => filterState.toggleFilter(id, filterState.selectedSims, onFilterChange.setSelectedSims)}
                        sectionKey="sims"
                        labelKey="type"
                        isExpanded={expandedSections.sims}
                        onToggleExpand={toggleSection}
                    />

                    <FilterSection
                        title="Storage"
                        items={filterData.storage}
                        selected={filterState.selectedStorage}
                        onToggle={(id) => filterState.toggleFilter(id, filterState.selectedStorage, onFilterChange.setSelectedStorage)}
                        sectionKey="storage"
                        labelKey="storage"
                        isExpanded={expandedSections.storage}
                        onToggleExpand={toggleSection}
                    />

                    <FilterSection
                        title="Warranty"
                        items={filterData.warranties}
                        selected={filterState.selectedWarranties}
                        onToggle={(id) => filterState.toggleFilter(id, filterState.selectedWarranties, onFilterChange.setSelectedWarranties)}
                        sectionKey="warranties"
                        labelKey="duration"
                        isExpanded={expandedSections.warranties}
                        onToggleExpand={toggleSection}
                    />
                </div>
            </div>
        </aside>
    );
}