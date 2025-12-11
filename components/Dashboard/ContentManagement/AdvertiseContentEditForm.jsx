"use client"

import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, ImageIcon, Video, FileText } from 'lucide-react';

const AdvertiseContentEditForm = ({ content, onClose, onSaved }) => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        thumbImage: '',
        regularImages: ['', '', '', ''],
        videos: ['', ''],
        discountShows: [{ text: '', isActive: true }],
        offerEndTime: '',
        section1: { title: '', content: '', isActive: false },
        section2: { title: '', content: '', isActive: false },
        section3: { title: '', content: '', isActive: false },
        section4: { title: '', content: '', isActive: false },
        section5: { title: '', content: '', isActive: false }
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (content) {
            const normalizedDiscounts = (content.discountShows || [{ text: '', isActive: true }]).map(d => 
                typeof d === 'string' ? { text: d, isActive: true } : d
            );
            
            setFormData({
                title: content.title || '',
                slug: content.slug || '',
                thumbImage: content.thumbImage || '',
                regularImages: content.regularImages || ['', '', '', ''],
                videos: content.videos || ['', ''],
                discountShows: normalizedDiscounts,
                offerEndTime: content.offerEndTime ? new Date(content.offerEndTime).toISOString().slice(0, 16) : '',
                section1: content.section1 || { title: '', content: '', isActive: false },
                section2: content.section2 || { title: '', content: '', isActive: false },
                section3: content.section3 || { title: '', content: '', isActive: false },
                section4: content.section4 || { title: '', content: '', isActive: false },
                section5: content.section5 || { title: '', content: '', isActive: false }
            });
        }
    }, [content]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const cleanedData = {
                ...formData,
                regularImages: formData.regularImages.filter(img => img.trim() !== ''),
                videos: formData.videos.filter(v => v.trim() !== ''),
                discountShows: formData.discountShows.filter(d => d.text && d.text.trim() !== '')
            };

            const response = await fetch(`${API_BASE_URL}/advertise-contents/${content._id || content.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('✅ Content updated successfully!');
                
                // Wait 1.5 seconds to show success message, then close and refresh
                setTimeout(() => {
                    onSaved && onSaved();
                }, 1500);
            } else {
                setError(data.message || 'Failed to update content');
            }
        } catch (err) {
            console.error('Error updating content:', err);
            setError('Network error while updating content');
        } finally {
            setLoading(false);
        }
    };

    const handleArrayChange = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const handleDiscountChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            discountShows: prev.discountShows.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const addDiscount = () => {
        setFormData(prev => ({
            ...prev,
            discountShows: [...prev.discountShows, { text: '', isActive: true }]
        }));
    };

    const removeDiscount = (index) => {
        setFormData(prev => ({
            ...prev,
            discountShows: prev.discountShows.filter((_, i) => i !== index)
        }));
    };

    const handleSectionChange = (sectionKey, field, value) => {
        setFormData(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                [field]: value
            }
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Advertise Content</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
                            ❌ {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2 animate-pulse">
                            {success}
                        </div>
                    )}

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Offer End Time *
                            </label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.offerEndTime}
                                onChange={(e) => setFormData(prev => ({ ...prev, offerEndTime: e.target.value }))}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            📷 Thumbnail Image URL
                        </label>
                        <input
                            type="url"
                            value={formData.thumbImage}
                            onChange={(e) => setFormData(prev => ({ ...prev, thumbImage: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.thumbImage && (
                            <img src={formData.thumbImage} alt="Thumbnail preview" className="mt-2 h-32 rounded object-cover" />
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            🖼️ Regular Images (up to 4)
                        </label>
                        {formData.regularImages.map((img, idx) => (
                            <input
                                key={idx}
                                type="url"
                                value={img}
                                onChange={(e) => handleArrayChange('regularImages', idx, e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                                placeholder={`Image ${idx + 1} URL`}
                            />
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            🎥 Videos (up to 2)
                        </label>
                        {formData.videos.map((video, idx) => (
                            <input
                                key={idx}
                                type="url"
                                value={video}
                                onChange={(e) => handleArrayChange('videos', idx, e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                                placeholder={`Video ${idx + 1} URL`}
                            />
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            🏷️ Discount Tags
                        </label>
                        {formData.discountShows.map((discount, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={discount.text || ''}
                                    onChange={(e) => handleDiscountChange(idx, 'text', e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 50% OFF"
                                />
                                <label className="flex items-center gap-2 px-3 border border-gray-300 rounded-lg">
                                    <input
                                        type="checkbox"
                                        checked={discount.isActive !== false}
                                        onChange={(e) => handleDiscountChange(idx, 'isActive', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Active</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => removeDiscount(idx)}
                                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addDiscount}
                            className="mt-2 text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                        >
                            ➕ Add Discount Tag
                        </button>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            📝 Content Sections
                        </label>
                        {['section1', 'section2', 'section3', 'section4', 'section5'].map((sectionKey, idx) => (
                            <div key={sectionKey} className="border border-gray-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-gray-700">Section {idx + 1}</h4>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData[sectionKey].isActive}
                                            onChange={(e) => handleSectionChange(sectionKey, 'isActive', e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-gray-600">Active</span>
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    value={formData[sectionKey].title}
                                    onChange={(e) => handleSectionChange(sectionKey, 'title', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Section Title"
                                />
                                <textarea
                                    value={formData[sectionKey].content}
                                    onChange={(e) => handleSectionChange(sectionKey, 'content', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Section Content"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Updating...
                                </>
                            ) : success ? (
                                <>✅ Updated!</>
                            ) : (
                                <>💾 Update Content</>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdvertiseContentEditForm;