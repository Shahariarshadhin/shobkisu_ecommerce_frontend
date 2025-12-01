"use client"

import { Image, Save, Tag, Trash2, Video, X, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const CreateAdvertiseContent = ({ onSuccess, onCancel, editContent = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        offerEndTime: '',
        thumbImage: '',
        regularImages: [''],
        videos: [''],
        discountShows: [],
        section1: { title: '', content: '', isActive: true },
        section2: { title: '', content: '', isActive: true },
        section3: { title: '', content: '', isActive: true },
        section4: { title: '', content: '', isActive: true },
        section5: { title: '', content: '', isActive: true }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        if (editContent) {
            setFormData({
                title: editContent.title || '',
                slug: editContent.slug || '',
                offerEndTime: editContent.offerEndTime 
                    ? new Date(editContent.offerEndTime).toISOString().slice(0, 16)
                    : '',
                thumbImage: editContent.thumbImage || '',
                regularImages: editContent.regularImages?.length ? editContent.regularImages : [''],
                videos: editContent.videos?.length ? editContent.videos : [''],
                discountShows: editContent.discountShows?.length ? editContent.discountShows : [],
                section1: editContent.section1 || { title: '', content: '', isActive: true },
                section2: editContent.section2 || { title: '', content: '', isActive: true },
                section3: editContent.section3 || { title: '', content: '', isActive: true },
                section4: editContent.section4 || { title: '', content: '', isActive: true },
                section5: editContent.section5 || { title: '', content: '', isActive: true }
            });
        }
    }, [editContent]);

    // Auto-generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (value) => {
        setFormData(prev => ({
            ...prev,
            title: value,
            slug: prev.slug === generateSlug(prev.title) || !prev.slug 
                ? generateSlug(value) 
                : prev.slug
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');

        if (!formData.title || !formData.offerEndTime || !formData.thumbImage) {
            setError('Please fill in all required fields (Title, Offer End Time, and Thumbnail Image)');
            return;
        }

        const cleanedData = {
            ...formData,
            slug: formData.slug || generateSlug(formData.title),
            regularImages: formData.regularImages.filter(img => img.trim() !== ''),
            videos: formData.videos.filter(video => video.trim() !== ''),
            discountShows: formData.discountShows.filter(d => d.text && d.text.trim() !== '')
        };

        setLoading(true);

        try {
            const method = editContent ? 'PUT' : 'POST';
            const url = editContent 
                ? `${API_BASE_URL}/advertise-contents/${editContent._id || editContent.id}`
                : `${API_BASE_URL}/advertise-contents`;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedData)
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || `Content ${editContent ? 'updated' : 'created'} successfully!`);
                if (onSuccess) onSuccess(data.data);
                
                if (!editContent) {
                    setFormData({
                        title: '',
                        slug: '',
                        offerEndTime: '',
                        thumbImage: '',
                        regularImages: [''],
                        videos: [''],
                        discountShows: [],
                        section1: { title: '', content: '', isActive: true },
                        section2: { title: '', content: '', isActive: true },
                        section3: { title: '', content: '', isActive: true },
                        section4: { title: '', content: '', isActive: true },
                        section5: { title: '', content: '', isActive: true }
                    });
                }
            } else {
                setError(data.message || `Failed to ${editContent ? 'update' : 'create'} content`);
            }
        } catch (err) {
            console.error('Error saving content:', err);
            setError(`Network error: ${err.message}. Please check if the backend server is running.`);
        } finally {
            setLoading(false);
        }
    };

    // Section Management
    const updateSection = (sectionKey, field, value) => {
        setFormData(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                [field]: value
            }
        }));
    };

    const toggleSectionActive = (sectionKey) => {
        setFormData(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                isActive: !prev[sectionKey].isActive
            }
        }));
    };

    // Discount Management
    const addDiscount = () => {
        setFormData(prev => ({
            ...prev,
            discountShows: [...prev.discountShows, { text: '', isActive: true }]
        }));
    };

    const updateDiscount = (index, value) => {
        setFormData(prev => ({
            ...prev,
            discountShows: prev.discountShows.map((discount, i) => 
                i === index ? { ...discount, text: value } : discount
            )
        }));
    };

    const toggleDiscountActive = (index) => {
        setFormData(prev => ({
            ...prev,
            discountShows: prev.discountShows.map((discount, i) => 
                i === index ? { ...discount, isActive: !discount.isActive } : discount
            )
        }));
    };

    const removeDiscount = (index) => {
        setFormData(prev => ({
            ...prev,
            discountShows: prev.discountShows.filter((_, i) => i !== index)
        }));
    };

    // Array field management (images/videos)
    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const updateArrayItem = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const removeArrayItem = (field, index) => {
        if (formData[field].length === 1) return;
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const sections = [
        { key: 'section1', label: 'Section 1' },
        { key: 'section2', label: 'Section 2' },
        { key: 'section3', label: 'Section 3' },
        { key: 'section4', label: 'Section 4' },
        { key: 'section5', label: 'Section 5' }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {editContent ? 'Edit' : 'Create'} Advertise Content
                </h2>
                {onCancel && (
                    <button onClick={onCancel} className="text-gray-500 hover:text-gray-700" type="button">
                        <X size={24} />
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong className="font-bold">Error: </strong>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Black Friday Sale"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="black-friday-sale"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Auto-generated from title. You can customize it.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Offer End Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.offerEndTime}
                            onChange={(e) => setFormData({ ...formData, offerEndTime: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                {/* Thumbnail */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Image size={16} className="inline mr-1" />
                        Thumbnail Image URL <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="url"
                        value={formData.thumbImage}
                        onChange={(e) => setFormData({ ...formData, thumbImage: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                        required
                    />
                    {formData.thumbImage && (
                        <img
                            src={formData.thumbImage}
                            alt="Thumbnail Preview"
                            className="mt-2 w-full h-48 object-cover rounded-lg"
                            onError={(e) => e.target.style.display = 'none'}
                            onLoad={(e) => e.target.style.display = 'block'}
                        />
                    )}
                </div>

                {/* Regular Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Image size={16} className="inline mr-1" />
                        Regular Images
                    </label>
                    {formData.regularImages.map((img, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="url"
                                value={img}
                                onChange={(e) => updateArrayItem('regularImages', index, e.target.value)}
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://example.com/image.jpg"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem('regularImages', index)}
                                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                                disabled={formData.regularImages.length === 1}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('regularImages')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        + Add Another Image
                    </button>
                </div>

                {/* Videos */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Video size={16} className="inline mr-1" />
                        Videos
                    </label>
                    {formData.videos.map((video, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="url"
                                value={video}
                                onChange={(e) => updateArrayItem('videos', index, e.target.value)}
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://example.com/video.mp4"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem('videos', index)}
                                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                                disabled={formData.videos.length === 1}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('videos')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        + Add Another Video
                    </button>
                </div>

                {/* Discount Tags with Active/Inactive */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            <Tag size={16} className="inline mr-1" />
                            Discount Tags
                        </label>
                        <button
                            type="button"
                            onClick={addDiscount}
                            className="flex items-center gap-1 text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                            <Plus size={16} />
                            Add Discount
                        </button>
                    </div>
                    {formData.discountShows.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">No discounts added yet</p>
                    ) : (
                        formData.discountShows.map((discount, index) => (
                            <div key={index} className="flex gap-2 mb-2 items-center">
                                <input
                                    type="text"
                                    value={discount.text}
                                    onChange={(e) => updateDiscount(index, e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="50% OFF"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleDiscountActive(index)}
                                    className={`px-3 py-2 rounded-lg transition ${
                                        discount.isActive 
                                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                                            : 'bg-gray-400 hover:bg-gray-500 text-white'
                                    }`}
                                    title={discount.isActive ? 'Active' : 'Inactive'}
                                >
                                    {discount.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeDiscount(index)}
                                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Content Sections - Each as Separate Field */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Sections</h3>
                    <div className="space-y-4">
                        {sections.map(({ key, label }) => (
                            <div key={key} className={`p-4 rounded-lg border-2 ${
                                formData[key].isActive ? 'bg-white border-blue-200' : 'bg-gray-50 border-gray-300'
                            }`}>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-700">{label}</h4>
                                    <button
                                        type="button"
                                        onClick={() => toggleSectionActive(key)}
                                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition ${
                                            formData[key].isActive 
                                                ? 'bg-green-500 hover:bg-green-600 text-white' 
                                                : 'bg-gray-400 hover:bg-gray-500 text-white'
                                        }`}
                                    >
                                        {formData[key].isActive ? (
                                            <>
                                                <ToggleRight size={18} />
                                                Active
                                            </>
                                        ) : (
                                            <>
                                                <ToggleLeft size={18} />
                                                Inactive
                                            </>
                                        )}
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={formData[key].title}
                                    onChange={(e) => updateSection(key, 'title', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={`${label} Title`}
                                />
                                <textarea
                                    value={formData[key].content}
                                    onChange={(e) => updateSection(key, 'content', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={`${label} Content`}
                                    rows="4"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {loading ? 'Saving...' : (editContent ? 'Update Content' : 'Create Content')}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateAdvertiseContent;