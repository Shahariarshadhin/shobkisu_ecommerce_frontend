"use client"

import { Image, Save, Tag, Trash2, Video, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const CreateAdvertiseContent = ({ onSuccess, onCancel, editContent = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        offerEndTime: '',
        thumbImage: '',
        regularImages: [''],
        videos: [''],
        discountShows: [''],
        sections: {
            section1: { title: '', content: '' },
            section2: { title: '', content: '' },
            section3: { title: '', content: '' },
            section4: { title: '', content: '' },
            section5: { title: '', content: '' }
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Backend API URL - Change this to your actual backend URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        if (editContent) {
            setFormData({
                title: editContent.title || '',
                offerEndTime: editContent.offerEndTime 
                    ? new Date(editContent.offerEndTime).toISOString().slice(0, 16)
                    : '',
                thumbImage: editContent.thumbImage || '',
                regularImages: editContent.regularImages?.length ? editContent.regularImages : [''],
                videos: editContent.videos?.length ? editContent.videos : [''],
                discountShows: editContent.discountShows?.length ? editContent.discountShows : [''],
                sections: editContent.sections || {
                    section1: { title: '', content: '' },
                    section2: { title: '', content: '' },
                    section3: { title: '', content: '' },
                    section4: { title: '', content: '' },
                    section5: { title: '', content: '' }
                }
            });
        }
    }, [editContent]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');

        // Validation
        if (!formData.title || !formData.offerEndTime || !formData.thumbImage) {
            setError('Please fill in all required fields (Title, Offer End Time, and Thumbnail Image)');
            return;
        }

        // Filter out empty strings from arrays
        const cleanedData = {
            ...formData,
            regularImages: formData.regularImages.filter(img => img.trim() !== ''),
            videos: formData.videos.filter(video => video.trim() !== ''),
            discountShows: formData.discountShows.filter(discount => discount.trim() !== ''),
            // Clean sections - only include sections with content
            sections: Object.entries(formData.sections).reduce((acc, [key, value]) => {
                if (value.title || value.content) {
                    acc[key] = value;
                }
                return acc;
            }, {})
        };

        setLoading(true);

        try {
            const method = editContent ? 'PUT' : 'POST';
            const url = editContent 
                ? `${API_BASE_URL}/advertise-contents/${editContent._id || editContent.id}`
                : `${API_BASE_URL}/advertise-contents`;

            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedData)
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message
                alert(data.message || `Content ${editContent ? 'updated' : 'created'} successfully!`);
                
                // Call onSuccess callback if provided
                if (onSuccess) {
                    onSuccess(data.data);
                }
                
                // Reset form if creating new content
                if (!editContent) {
                    setFormData({
                        title: '',
                        offerEndTime: '',
                        thumbImage: '',
                        regularImages: [''],
                        videos: [''],
                        discountShows: [''],
                        sections: {
                            section1: { title: '', content: '' },
                            section2: { title: '', content: '' },
                            section3: { title: '', content: '' },
                            section4: { title: '', content: '' },
                            section5: { title: '', content: '' }
                        }
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

    const updateSection = (sectionKey, field, value) => {
        setFormData(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [sectionKey]: {
                    ...prev.sections[sectionKey],
                    [field]: value
                }
            }
        }));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {editContent ? 'Edit' : 'Create'} Advertise Content
                </h2>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700"
                        type="button"
                    >
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
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Black Friday Sale"
                            required
                        />
                    </div>

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
                            onError={(e) => {
                                e.target.style.display = 'none';
                                setError('Failed to load thumbnail image. Please check the URL.');
                            }}
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

                {/* Discount Shows */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Tag size={16} className="inline mr-1" />
                        Discount Tags
                    </label>
                    {formData.discountShows.map((discount, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={discount}
                                onChange={(e) => updateArrayItem('discountShows', index, e.target.value)}
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="50% OFF"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem('discountShows', index)}
                                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                                disabled={formData.discountShows.length === 1}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('discountShows')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        + Add Another Discount Tag
                    </button>
                </div>

                {/* Content Sections */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Sections</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((num) => {
                            const sectionKey = `section${num}`;
                            return (
                                <div key={sectionKey} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="font-medium text-gray-700 mb-3">Section {num}</h4>
                                    <input
                                        type="text"
                                        value={formData.sections[sectionKey].title}
                                        onChange={(e) => updateSection(sectionKey, 'title', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Section Title"
                                    />
                                    <textarea
                                        value={formData.sections[sectionKey].content}
                                        onChange={(e) => updateSection(sectionKey, 'content', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Section Content"
                                        rows="4"
                                    />
                                </div>
                            );
                        })}
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