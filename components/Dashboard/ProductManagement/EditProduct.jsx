"use client"

import { fetchBrands } from '../../../redux/brandSlice';
import { fetchModels } from '../../../redux/modelSlice';
import { fetchColors } from '../../../redux/colorSlice';
import { fetchStorage } from '../../../redux/storageSlice';
import { fetchSims } from '../../../redux/simSlice';
import { fetchDeviceConditions } from '../../../redux/deviceConditionSlice';
import { fetchWarranties } from '../../../redux/warrantySlice';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../SharedUI/Toast';
import { updateProduct, fetchProductById, clearNotification } from '../../../redux/productSlice';

export default function EditProduct() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useDispatch();
    const productId = params.id;

    const { loading, notification, currentProduct } = useSelector((state) => state.products);
    const { brands = [] } = useSelector((state) => state.brands || {});
    const { models = [] } = useSelector((state) => state.models || {});
    const { colors = [] } = useSelector((state) => state.colors || {});
    const { storage = [] } = useSelector((state) => state.storage || {});
    const { sims = [] } = useSelector((state) => state.sims || {});
    const { conditions = [] } = useSelector((state) => state.deviceConditions || {});
    const { warranties = [] } = useSelector((state) => state.warranties || {});

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        fullDescription: '',
        brandId: '',
        modelId: '',
        colorId: '',
        storageId: '',
        simId: '',
        deviceConditionId: '',
        warrantyId: '',
        pricing: {
            originalPrice: '',
            discountPrice: '',
            costPrice: '',
            sellingPrice: ''
        },
        coupon: {
            code: '',
            discountPercent: '',
            discountAmount: '',
            validFrom: '',
            validTo: '',
            maxUses: '',
            usedCount: 0
        },
        stock: 0,
        weight: '',
        freeShipping: false,
        thumbnailImage: '',
        images: [''],
        video: {
            url: '',
            platform: 'youtube'
        },
        specifications: [{ label: '', value: '' }],
        seo: {
            metaTitle: '',
            metaKeywords: [''],
            metaDescription: ''
        },
        sku: '',
        isActive: true,
        fieldConfig: {
            showDescription: true,
            showFullDescription: true,
            showBrand: true,
            showModel: true,
            showColor: true,
            showStorage: true,
            showSim: true,
            showDeviceCondition: true,
            showWarranty: true,
            showOriginalPrice: true,
            showDiscountPrice: true,
            showCostPrice: false,
            showCoupon: false,
            showWeight: true,
            showFreeShipping: true,
            showVideo: false,
            showSpecifications: true,
            showSEO: true
        }
    });

    useEffect(() => {
        dispatch(fetchBrands());
        dispatch(fetchModels());
        dispatch(fetchColors());
        dispatch(fetchStorage());
        dispatch(fetchSims());
        dispatch(fetchDeviceConditions());
        dispatch(fetchWarranties());
        
        if (productId) {
            dispatch(fetchProductById(productId));
        }
    }, [dispatch, productId]);

    useEffect(() => {
        if (currentProduct && currentProduct._id === productId) {
            setFormData({
                name: currentProduct.name || '',
                description: currentProduct.description || '',
                fullDescription: currentProduct.fullDescription || '',
                brandId: currentProduct.brandId?._id || currentProduct.brandId || '',
                modelId: currentProduct.modelId?._id || currentProduct.modelId || '',
                colorId: currentProduct.colorId?._id || currentProduct.colorId || '',
                storageId: currentProduct.storageId?._id || currentProduct.storageId || '',
                simId: currentProduct.simId?._id || currentProduct.simId || '',
                deviceConditionId: currentProduct.deviceConditionId?._id || currentProduct.deviceConditionId || '',
                warrantyId: currentProduct.warrantyId?._id || currentProduct.warrantyId || '',
                pricing: {
                    originalPrice: currentProduct.pricing?.originalPrice || '',
                    discountPrice: currentProduct.pricing?.discountPrice || '',
                    costPrice: currentProduct.pricing?.costPrice || '',
                    sellingPrice: currentProduct.pricing?.sellingPrice || ''
                },
                coupon: {
                    code: currentProduct.coupon?.code || '',
                    discountPercent: currentProduct.coupon?.discountPercent || '',
                    discountAmount: currentProduct.coupon?.discountAmount || '',
                    validFrom: currentProduct.coupon?.validFrom ? new Date(currentProduct.coupon.validFrom).toISOString().slice(0, 16) : '',
                    validTo: currentProduct.coupon?.validTo ? new Date(currentProduct.coupon.validTo).toISOString().slice(0, 16) : '',
                    maxUses: currentProduct.coupon?.maxUses || '',
                    usedCount: currentProduct.coupon?.usedCount || 0
                },
                stock: currentProduct.stock || 0,
                weight: currentProduct.weight || '',
                freeShipping: currentProduct.freeShipping || false,
                thumbnailImage: currentProduct.thumbnailImage || '',
                images: currentProduct.images?.length > 0 ? currentProduct.images : [''],
                video: {
                    url: currentProduct.video?.url || '',
                    platform: currentProduct.video?.platform || 'youtube'
                },
                specifications: currentProduct.specifications?.length > 0 ? currentProduct.specifications : [{ label: '', value: '' }],
                seo: {
                    metaTitle: currentProduct.seo?.metaTitle || '',
                    metaKeywords: currentProduct.seo?.metaKeywords?.length > 0 ? currentProduct.seo.metaKeywords : [''],
                    metaDescription: currentProduct.seo?.metaDescription || ''
                },
                sku: currentProduct.sku || '',
                isActive: currentProduct.isActive !== undefined ? currentProduct.isActive : true,
                fieldConfig: currentProduct.fieldConfig || {
                    showDescription: true,
                    showFullDescription: true,
                    showBrand: true,
                    showModel: true,
                    showColor: true,
                    showStorage: true,
                    showSim: true,
                    showDeviceCondition: true,
                    showWarranty: true,
                    showOriginalPrice: true,
                    showDiscountPrice: true,
                    showCostPrice: false,
                    showCoupon: false,
                    showWeight: true,
                    showFreeShipping: true,
                    showVideo: false,
                    showSpecifications: true,
                    showSEO: true
                }
            });
        }
    }, [currentProduct, productId]);

    useEffect(() => {
        if (notification?.type === 'success') {
            const timer = setTimeout(() => {
                dispatch(clearNotification());
                router.push('/dashboard/products');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [notification, dispatch, router]);

    const filteredModels = models.filter(m =>
        m.brandId?._id === formData.brandId || m.brandId === formData.brandId
    );

    const toggleField = (fieldName) => {
        setFormData({
            ...formData,
            fieldConfig: {
                ...formData.fieldConfig,
                [fieldName]: !formData.fieldConfig[fieldName]
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(updateProduct({ id: productId, productData: formData }));
    };

    const addImage = () => {
        setFormData({
            ...formData,
            images: [...formData.images, '']
        });
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const updateImage = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addSpecification = () => {
        setFormData({
            ...formData,
            specifications: [...formData.specifications, { label: '', value: '' }]
        });
    };

    const removeSpecification = (index) => {
        const newSpecs = formData.specifications.filter((_, i) => i !== index);
        setFormData({ ...formData, specifications: newSpecs });
    };

    const updateSpecification = (index, field, value) => {
        const newSpecs = [...formData.specifications];
        newSpecs[index][field] = value;
        setFormData({ ...formData, specifications: newSpecs });
    };

    const addKeyword = () => {
        setFormData({
            ...formData,
            seo: {
                ...formData.seo,
                metaKeywords: [...formData.seo.metaKeywords, '']
            }
        });
    };

    const removeKeyword = (index) => {
        const newKeywords = formData.seo.metaKeywords.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            seo: { ...formData.seo, metaKeywords: newKeywords }
        });
    };

    const updateKeyword = (index, value) => {
        const newKeywords = [...formData.seo.metaKeywords];
        newKeywords[index] = value;
        setFormData({
            ...formData,
            seo: { ...formData.seo, metaKeywords: newKeywords }
        });
    };

    const FieldToggle = ({ fieldName, label }) => (
        <button
            type="button"
            onClick={() => toggleField(fieldName)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${formData.fieldConfig[fieldName]
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
            title={`${formData.fieldConfig[fieldName] ? 'Deactivate' : 'Activate'} ${label}`}
        >
            {formData.fieldConfig[fieldName] ? (
                <>
                    <Eye size={14} />
                    Active
                </>
            ) : (
                <>
                    <EyeOff size={14} />
                    Inactive
                </>
            )}
        </button>
    );

    const isFormValid = () => {
        const requiredFields = {
            name: formData.name,
            sellingPrice: formData.pricing.sellingPrice
        };

        if (formData.fieldConfig.showBrand && !formData.brandId) return false;
        if (formData.fieldConfig.showModel && !formData.modelId) return false;
        if (formData.fieldConfig.showColor && !formData.colorId) return false;
        if (formData.fieldConfig.showStorage && !formData.storageId) return false;
        if (formData.fieldConfig.showSim && !formData.simId) return false;
        if (formData.fieldConfig.showDeviceCondition && !formData.deviceConditionId) return false;
        if (formData.fieldConfig.showWarranty && !formData.warrantyId) return false;

        return requiredFields.name && requiredFields.sellingPrice;
    };

    if (loading && !currentProduct) {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
            {notification && <Toast notification={notification} />}

            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => router.push('/dashboard/products')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
                >
                    <ArrowLeft size={20} />
                    Back to Products
                </button>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-[#a34610] mb-2">
                        Edit Product
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="border-b pb-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter product name"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <FieldToggle fieldName="showDescription" label="Description" />
                                    </div>
                                    {formData.fieldConfig.showDescription && (
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter short description"
                                        />
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Full Description</label>
                                        <FieldToggle fieldName="showFullDescription" label="Full Description" />
                                    </div>
                                    {formData.fieldConfig.showFullDescription && (
                                        <textarea
                                            value={formData.fullDescription}
                                            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                                            rows={5}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter detailed description"
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                                        <input
                                            type="text"
                                            value={formData.sku}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="Product SKU"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image URL</label>
                                        <input
                                            type="text"
                                            value={formData.thumbnailImage}
                                            onChange={(e) => setFormData({ ...formData, thumbnailImage: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="border-b pb-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Product Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Brand</label>
                                        <FieldToggle fieldName="showBrand" label="Brand" />
                                    </div>
                                    {formData.fieldConfig.showBrand && (
                                        <select
                                            value={formData.brandId}
                                            onChange={(e) => setFormData({ ...formData, brandId: e.target.value, modelId: '' })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Select Brand</option>
                                            {brands.filter(b => b.isActive).map((brand) => (
                                                <option key={brand._id} value={brand._id}>{brand.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Model</label>
                                        <FieldToggle fieldName="showModel" label="Model" />
                                    </div>
                                    {formData.fieldConfig.showModel && (
                                        <select
                                            value={formData.modelId}
                                            onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            disabled={!formData.brandId}
                                        >
                                            <option value="">Select Model</option>
                                            {filteredModels.filter(m => m.isActive).map((model) => (
                                                <option key={model._id} value={model._id}>{model.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Color</label>
                                        <FieldToggle fieldName="showColor" label="Color" />
                                    </div>
                                    {formData.fieldConfig.showColor && (
                                        <select
                                            value={formData.colorId}
                                            onChange={(e) => setFormData({ ...formData, colorId: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Select Color</option>
                                            {colors.filter(c => c.isActive).map((color) => (
                                                <option key={color._id} value={color._id}>{color.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Storage</label>
                                        <FieldToggle fieldName="showStorage" label="Storage" />
                                    </div>
                                    {formData.fieldConfig.showStorage && (
                                        <select
                                            value={formData.storageId}
                                            onChange={(e) => setFormData({ ...formData, storageId: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Select Storage</option>
                                            {storage.filter(s => s.isActive).map((stor) => (
                                                <option key={stor._id} value={stor._id}>{stor.ram}/{stor.rom}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">SIM Type</label>
                                        <FieldToggle fieldName="showSim" label="SIM Type" />
                                    </div>
                                    {formData.fieldConfig.showSim && (
                                        <select
                                            value={formData.simId}
                                            onChange={(e) => setFormData({ ...formData, simId: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Select SIM</option>
                                            {sims.filter(s => s.isActive).map((sim) => (
                                                <option key={sim._id} value={sim._id}>{sim.type}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Device Condition</label>
                                        <FieldToggle fieldName="showDeviceCondition" label="Device Condition" />
                                    </div>
                                    {formData.fieldConfig.showDeviceCondition && (
                                        <select
                                            value={formData.deviceConditionId}
                                            onChange={(e) => setFormData({ ...formData, deviceConditionId: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Select Condition</option>
                                            {conditions.filter(c => c.isActive).map((condition) => (
                                                <option key={condition._id} value={condition._id}>{condition.condition}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Warranty</label>
                                        <FieldToggle fieldName="showWarranty" label="Warranty" />
                                    </div>
                                    {formData.fieldConfig.showWarranty && (
                                        <select
                                            value={formData.warrantyId}
                                            onChange={(e) => setFormData({ ...formData, warrantyId: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Select Warranty</option>
                                            {warranties.filter(w => w.isActive).map((warranty) => (
                                                <option key={warranty._id} value={warranty._id}>
                                                    {warranty.duration} - {warranty.type}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="border-b pb-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Pricing</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Original Price</label>
                                        <FieldToggle fieldName="showOriginalPrice" label="Original Price" />
                                    </div>
                                    {formData.fieldConfig.showOriginalPrice && (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.pricing.originalPrice}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                pricing: { ...formData.pricing, originalPrice: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="0.00"
                                        />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Discount Price</label>
                                        <FieldToggle fieldName="showDiscountPrice" label="Discount Price" />
                                    </div>
                                    {formData.fieldConfig.showDiscountPrice && (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.pricing.discountPrice}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                pricing: { ...formData.pricing, discountPrice: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="0.00"
                                        />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Cost Price</label>
                                        <FieldToggle fieldName="showCostPrice" label="Cost Price" />
                                    </div>
                                    {formData.fieldConfig.showCostPrice && (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.pricing.costPrice}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                pricing: { ...formData.pricing, costPrice: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="0.00"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.pricing.sellingPrice}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            pricing: { ...formData.pricing, sellingPrice: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Coupon */}
                        <div className="border-b pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-700">Coupon</h2>
                                <FieldToggle fieldName="showCoupon" label="Coupon" />
                            </div>
                            {formData.fieldConfig.showCoupon && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                                        <input
                                            type="text"
                                            value={formData.coupon.code}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                coupon: { ...formData.coupon, code: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="SAVE20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percent (%)</label>
                                        <input
                                            type="number"
                                            value={formData.coupon.discountPercent}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                coupon: { ...formData.coupon, discountPercent: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Discount Amount</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.coupon.discountAmount}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                coupon: { ...formData.coupon, discountAmount: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="10.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Uses</label>
                                        <input
                                            type="number"
                                            value={formData.coupon.maxUses}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                coupon: { ...formData.coupon, maxUses: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.coupon.validFrom}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                coupon: { ...formData.coupon, validFrom: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Valid To</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.coupon.validTo}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                coupon: { ...formData.coupon, validTo: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stock & Shipping */}
                        <div className="border-b pb-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Stock & Shipping</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                                        <FieldToggle fieldName="showWeight" label="Weight" />
                                    </div>
                                    {formData.fieldConfig.showWeight && (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.weight}
                                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="0.5"
                                        />
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="freeShipping"
                                                checked={formData.freeShipping}
                                                onChange={(e) => setFormData({ ...formData, freeShipping: e.target.checked })}
                                                className="w-4 h-4 text-purple-600 rounded"
                                                disabled={!formData.fieldConfig.showFreeShipping}
                                            />
                                            <label htmlFor="freeShipping" className="text-sm font-medium text-gray-700">
                                                Free Shipping
                                            </label>
                                        </div>
                                        <FieldToggle fieldName="showFreeShipping" label="Free Shipping" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="border-b pb-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Media</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={img}
                                                onChange={(e) => updateImage(index, e.target.value)}
                                                className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                                placeholder="https://..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addImage}
                                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                    >
                                        Add Image
                                    </button>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Product Video</label>
                                        <FieldToggle fieldName="showVideo" label="Video" />
                                    </div>
                                    {formData.fieldConfig.showVideo && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                                                <input
                                                    type="text"
                                                    value={formData.video.url}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        video: { ...formData.video, url: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                                    placeholder="https://youtube.com/..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                                                <select
                                                    value={formData.video.platform}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        video: { ...formData.video, platform: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                                >
                                                    <option value="youtube">YouTube</option>
                                                    <option value="vimeo">Vimeo</option>
                                                    <option value="custom">Custom</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="border-b pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-700">Specifications</h2>
                                <FieldToggle fieldName="showSpecifications" label="Specifications" />
                            </div>
                            {formData.fieldConfig.showSpecifications && (
                                <div className="space-y-2">
                                    {formData.specifications.map((spec, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={spec.label}
                                                onChange={(e) => updateSpecification(index, 'label', e.target.value)}
                                                className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                                placeholder="Label (e.g., Screen Size)"
                                            />
                                            <input
                                                type="text"
                                                value={spec.value}
                                                onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                                                className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                                placeholder="Value (e.g., 6.7 inches)"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSpecification(index)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addSpecification}
                                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                    >
                                        Add Specification
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* SEO */}
                        <div className="border-b pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-700">SEO</h2>
                                <FieldToggle fieldName="showSEO" label="SEO" />
                            </div>
                            {formData.fieldConfig.showSEO && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                                        <input
                                            type="text"
                                            value={formData.seo.metaTitle}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                seo: { ...formData.seo, metaTitle: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="SEO optimized title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                                        <textarea
                                            value={formData.seo.metaDescription}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                seo: { ...formData.seo, metaDescription: e.target.value }
                                            })}
                                            rows={3}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                            placeholder="SEO meta description"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                                        {formData.seo.metaKeywords.map((keyword, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={keyword}
                                                    onChange={(e) => updateKeyword(index, e.target.value)}
                                                    className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
                                                    placeholder="Keyword"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeKeyword(index)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addKeyword}
                                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                        >
                                            Add Keyword
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-purple-600 rounded"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                    Active Product
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard/products')}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !isFormValid()}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
                            >
                                <Save size={20} />
                                {loading ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}