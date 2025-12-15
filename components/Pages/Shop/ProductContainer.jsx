"use client"
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, X, Filter, Search, ChevronDown, ChevronUp, Grid3x3, LayoutGrid, Rows3, List, Tally2, Tally3, Tally4, Tally5  } from 'lucide-react';
import { fetchProducts } from '../../../redux/productSlice';
import { fetchBrands } from '../../../redux/brandSlice';
import { fetchModels } from '../../../redux/modelSlice';
import { fetchColors } from '../../../redux/colorSlice';
import { fetchDeviceConditions } from '../../../redux/deviceConditionSlice';
import { fetchSims } from '../../../redux/simSlice';
import { fetchStorage } from '../../../redux/storageSlice';
import { fetchWarranties } from '../../../redux/warrantySlice'; 

export default function ProductContainer() {
    const dispatch = useDispatch();
    
    // Redux state
    const { products = [], loading: productsLoading } = useSelector((state) => state.products || {});
    const { brands = [] } = useSelector((state) => state.brands || {});
    const { models = [] } = useSelector((state) => state.models || {});
    const { colors = [] } = useSelector((state) => state.colors || {});
    const { conditions = [] } = useSelector((state) => state.deviceConditions || {});
    const { sims = [] } = useSelector((state) => state.sims || {});
    const { storage = [] } = useSelector((state) => state.storage || {});
    const { warranties = [] } = useSelector((state) => state.warranties || {});

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    
    // Filter states
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

    // Filter section collapse states
    const [expandedSections, setExpandedSections] = useState({
        brands: true,
        models: false,
        colors: false,
        conditions: false,
        sims: false,
        storage: false,
        warranties: false
    });

    const [viewMode, setViewMode] = useState('grid-3'); // list, grid-2, grid-3, grid-4, grid-5

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

    useEffect(() => {
        applyFilters();
    }, [products, searchTerm, selectedBrands, selectedModels, selectedColors, 
        selectedConditions, selectedSims, selectedStorage, selectedWarranties,
        priceRange, sortBy, stockFilter]);

    const applyFilters = () => {
        let filtered = [...products];

        // Only show active products
        filtered = filtered.filter(p => p.isActive);

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.brandId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.modelId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Brand filter
        if (selectedBrands.length > 0) {
            filtered = filtered.filter(p => selectedBrands.includes(p.brandId?._id));
        }

        // Model filter
        if (selectedModels.length > 0) {
            filtered = filtered.filter(p => selectedModels.includes(p.modelId?._id));
        }

        // Color filter
        if (selectedColors.length > 0) {
            filtered = filtered.filter(p => selectedColors.includes(p.colorId?._id));
        }

        // Condition filter
        if (selectedConditions.length > 0) {
            filtered = filtered.filter(p => selectedConditions.includes(p.conditionId?._id));
        }

        // SIM filter
        if (selectedSims.length > 0) {
            filtered = filtered.filter(p => selectedSims.includes(p.simId?._id));
        }

        // Storage filter
        if (selectedStorage.length > 0) {
            filtered = filtered.filter(p => selectedStorage.includes(p.storageId?._id));
        }

        // Warranty filter
        if (selectedWarranties.length > 0) {
            filtered = filtered.filter(p => selectedWarranties.includes(p.warrantyId?._id));
        }

        // Price range filter
        filtered = filtered.filter(p => {
            const price = parseFloat(p.pricing?.sellingPrice || 0);
            return price >= priceRange.min && price <= priceRange.max;
        });

        // Stock filter
        if (stockFilter === 'instock') {
            filtered = filtered.filter(p => p.stock > 0);
        } else if (stockFilter === 'outofstock') {
            filtered = filtered.filter(p => p.stock === 0);
        }

        // Sort
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

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
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

    const activeFiltersCount = selectedBrands.length + selectedModels.length + 
        selectedColors.length + selectedConditions.length + selectedSims.length + 
        selectedStorage.length + selectedWarranties.length + (stockFilter !== 'all' ? 1 : 0);

    const FilterSection = ({ title, items, selected, onToggle, sectionKey, labelKey = 'name' }) => {
        const activeItems = items.filter(item => item.isActive);
        if (activeItems.length === 0) return null;

        return (
            <div className="border-b border-gray-200 pb-4">
                <button
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 mb-2"
                >
                    <span>{title}</span>
                    {expandedSections[sectionKey] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSections[sectionKey] && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {activeItems.map(item => (
                            <label key={item._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(item._id)}
                                    onChange={() => onToggle(item._id, selected, onToggle)}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">
                                    {labelKey === 'storage' ? `${item.ram} / ${item.rom}` : item[labelKey]}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        );
    };

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

    const ProductCard = ({ product }) => {
        if (viewMode === 'list') {
            // List View
            return (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex">
                    {/* Product Image */}
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

                    {/* Product Info */}
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

                            {/* Product Details */}
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
                            {/* Stock Info */}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                product.stock > 10
                                    ? 'bg-green-100 text-green-800'
                                    : product.stock > 0
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>

                            {/* Add to Cart Button */}
                            <button
                                disabled={product.stock === 0}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                                    product.stock === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'hover:to-pink-700'
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

        // Grid View (all grid sizes)
        const isCompact = viewMode === 'grid-5';
        
        return (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Product Image */}
                <div className={`relative ${isCompact ? 'h-40' : 'h-64'} bg-gray-100`}>
                    <img
                        src={product.thumbnailImage || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className={`bg-red-500 text-white px-3 py-1 rounded-full ${isCompact ? 'text-xs' : 'text-sm'} font-semibold`}>
                                Out of Stock
                            </span>
                        </div>
                    )}
                    {product.pricing?.discountPrice && (
                        <div className={`absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full ${isCompact ? 'text-xs' : 'text-sm'} font-bold`}>
                            SALE
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className={isCompact ? 'p-3' : 'p-5'}>
                    <div className="mb-2">
                        <p className="text-xs text-gray-500 mb-1 truncate">
                            {product.brandId?.name} • {product.modelId?.name}
                        </p>
                        <h3 className={`font-bold text-gray-900 ${isCompact ? 'text-sm' : 'text-lg'} truncate`} title={product.name}>
                            {product.name}
                        </h3>
                    </div>

                    {/* Product Details - Only show in larger grids */}
                    {!isCompact && (
                        <div className="text-xs text-gray-600 mb-3 space-y-1">
                            {product.storageId && (
                                <p className="truncate">Storage: {product.storageId.ram} / {product.storageId.rom}</p>
                            )}
                            {product.colorId && (
                                <p className="truncate">Color: {product.colorId.name}</p>
                            )}
                            {product.conditionId && (
                                <p className="truncate">Condition: {product.conditionId.condition}</p>
                            )}
                        </div>
                    )}

                    {/* Pricing */}
                    <div className={isCompact ? 'mb-2' : 'mb-4'}>
                        {product.pricing?.discountPrice && (
                            <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-500 line-through`}>
                                ${product.pricing.originalPrice}
                            </p>
                        )}
                        <p className={`${isCompact ? 'text-lg' : 'text-2xl'} font-bold text-purple-600`}>
                            ${product.pricing?.sellingPrice || '0.00'}
                        </p>
                    </div>

                    {/* Stock Info */}
                    <div className={isCompact ? 'mb-2' : 'mb-4'}>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10
                                ? 'bg-green-100 text-green-800'
                                : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        disabled={product.stock === 0}
                        className={`w-full flex items-center justify-center gap-2 px-4 ${isCompact ? 'py-2 text-sm' : 'py-3'} rounded-lg font-semibold transition-colors ${
                            product.stock === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'border border-[#a34610] hover:bg-[#a34610] text-[#a34610] hover:text-white'
                        }`}
                    >
                        <ShoppingCart size={isCompact ? 16 : 20} />
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-rose-50">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold bg-linear-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Shop Products
                        </h1>
                        
                        {/* Search Bar */}
                        <div className="flex-1 max-w-xl relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products, brands, SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Filter size={20} />
                            {activeFiltersCount > 0 && (
                                <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Filter size={20} />
                                    Filters
                                </h2>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="name">Name: A to Z</option>
                                    </select>
                                </div>

                                {/* Stock Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Availability
                                    </label>
                                    <select
                                        value={stockFilter}
                                        onChange={(e) => setStockFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                                    >
                                        <option value="all">All Products</option>
                                        <option value="instock">In Stock</option>
                                        <option value="outofstock">Out of Stock</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price Range
                                    </label>
                                    <div className="space-y-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="10000"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                                            className="w-full"
                                        />
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span>${priceRange.min}</span>
                                            <span>${priceRange.max}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Filter Sections */}
                                <FilterSection
                                    title="Brands"
                                    items={brands}
                                    selected={selectedBrands}
                                    onToggle={(id) => toggleFilter(id, selectedBrands, setSelectedBrands)}
                                    sectionKey="brands"
                                />

                                <FilterSection
                                    title="Models"
                                    items={models}
                                    selected={selectedModels}
                                    onToggle={(id) => toggleFilter(id, selectedModels, setSelectedModels)}
                                    sectionKey="models"
                                />

                                <FilterSection
                                    title="Colors"
                                    items={colors}
                                    selected={selectedColors}
                                    onToggle={(id) => toggleFilter(id, selectedColors, setSelectedColors)}
                                    sectionKey="colors"
                                />

                                <FilterSection
                                    title="Condition"
                                    items={conditions}
                                    selected={selectedConditions}
                                    onToggle={(id) => toggleFilter(id, selectedConditions, setSelectedConditions)}
                                    sectionKey="conditions"
                                    labelKey="condition"
                                />

                                <FilterSection
                                    title="SIM Type"
                                    items={sims}
                                    selected={selectedSims}
                                    onToggle={(id) => toggleFilter(id, selectedSims, setSelectedSims)}
                                    sectionKey="sims"
                                    labelKey="type"
                                />

                                <FilterSection
                                    title="Storage"
                                    items={storage}
                                    selected={selectedStorage}
                                    onToggle={(id) => toggleFilter(id, selectedStorage, setSelectedStorage)}
                                    sectionKey="storage"
                                    labelKey="storage"
                                />

                                <FilterSection
                                    title="Warranty"
                                    items={warranties}
                                    selected={selectedWarranties}
                                    onToggle={(id) => toggleFilter(id, selectedWarranties, setSelectedWarranties)}
                                    sectionKey="warranties"
                                    labelKey="duration"
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {/* Results Header with View Toggle */}
                        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold">{filteredProducts.length}</span> products
                            </p>
                            
                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-2 bg-white rounded-lg shadow-md p-1">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all ${
                                        viewMode === 'list'
                                            ? 'bg-linear-to-br from-purple-600 to-pink-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title="List View"
                                >
                                    <List size={18} />
                                    {/* <span className="hidden sm:inline text-sm"></span> */}
                                </button>
                                <button
                                    onClick={() => setViewMode('grid-2')}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all ${
                                        viewMode === 'grid-2'
                                            ? 'bg-linear-to-br from-purple-600 to-pink-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title="2 Columns"
                                >
                                    <Tally2 size={18} />
                                    {/* <span className="hidden sm:inline text-sm">2</span> */}
                                </button>
                                <button
                                    onClick={() => setViewMode('grid-3')}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all ${
                                        viewMode === 'grid-3'
                                            ? 'bg-linear-to-br from-purple-600 to-pink-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title="3 Columns"
                                >
                                    <Tally3 size={18} />
                                    {/* <span className="hidden sm:inline text-sm">3</span> */}
                                </button>
                                <button
                                    onClick={() => setViewMode('grid-4')}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all ${
                                        viewMode === 'grid-4'
                                            ? 'bg-linear-to-br from-purple-600 to-pink-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title="4 Columns"
                                >
                                    <Tally4 size={18} />
                                    {/* <span className="hidden sm:inline text-sm">4</span> */}
                                </button>
                                <button
                                    onClick={() => setViewMode('grid-5')}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all ${
                                        viewMode === 'grid-5'
                                            ? 'bg-linear-to-br from-purple-600 to-pink-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    title="5 Columns"
                                >
                                    <Tally5 size={18} />
                                    {/* <span className="hidden sm:inline text-sm">5</span> */}
                                </button>
                            </div>
                        </div>

                        {/* Products */}
                        {productsLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-lg">No products found</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className={getGridClass()}>
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}