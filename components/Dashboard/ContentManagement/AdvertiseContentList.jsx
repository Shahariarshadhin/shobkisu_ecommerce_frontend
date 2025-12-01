"use client"

import { useEffect, useState } from 'react';
import { Edit, Trash2, Eye, Clock, Calendar, Tag } from 'lucide-react';

const AdvertiseContentList = ({ onEdit }) => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, expired
    const [sortBy, setSortBy] = useState('recent'); // recent, ending-soon

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchContents();
    }, [filter, sortBy]);

    const fetchContents = async () => {
        setLoading(true);
        setError('');

        try {
            let url = `${API_BASE_URL}/advertise-contents`;
            
            // Add query parameters
            const params = new URLSearchParams();
            if (filter === 'active') params.append('status', 'active');
            if (sortBy === 'ending-soon') params.append('sort', 'ending-soon');
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setContents(data.data || []);
            } else {
                setError(data.message || 'Failed to fetch contents');
            }
        } catch (err) {
            console.error('Error fetching contents:', err);
            setError('Network error. Please check if the backend server is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this content?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/advertise-contents/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || 'Content deleted successfully');
                fetchContents(); // Refresh the list
            } else {
                alert(data.message || 'Failed to delete content');
            }
        } catch (err) {
            console.error('Error deleting content:', err);
            alert('Network error while deleting content');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeRemainingDisplay = (timeRemaining) => {
        if (!timeRemaining) return 'N/A';
        
        if (timeRemaining.expired) {
            return <span className="text-red-600 font-semibold">Expired</span>;
        }

        const { days, hours, minutes } = timeRemaining;
        return (
            <span className="text-green-600 font-semibold">
                {days}d {hours}h {minutes}m
            </span>
        );
    };

    // Get active discounts
    const getActiveDiscounts = (discountShows) => {
        if (!discountShows || discountShows.length === 0) return [];
        
        // Handle both old format (array of strings) and new format (array of objects)
        return discountShows
            .filter(discount => {
                if (typeof discount === 'string') return true;
                return discount.isActive !== false; // Show if isActive is true or undefined
            })
            .map(discount => typeof discount === 'string' ? discount : discount.text);
    };

    // Count active sections
    const countActiveSections = (content) => {
        let count = 0;
        ['section1', 'section2', 'section3', 'section4', 'section5'].forEach(key => {
            const section = content[key];
            if (section && section.isActive && (section.title || section.content)) {
                count++;
            }
        });
        return count;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Advertise Contents</h2>
                
                {/* Filters and Sort */}
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mr-2">Filter:</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="active">Active Only</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-gray-700 mr-2">Sort By:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="ending-soon">Ending Soon</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {contents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No advertise contents found.</p>
                    <p className="text-sm mt-2">Create your first content to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contents.map((content) => {
                        const activeDiscounts = getActiveDiscounts(content.discountShows);
                        const activeSectionsCount = countActiveSections(content);
                        
                        return (
                            <div key={content._id || content.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                                {/* Thumbnail */}
                                {content.thumbImage && (
                                    <img
                                        src={content.thumbImage}
                                        alt={content.title}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                        }}
                                    />
                                )}
                                
                                <div className="p-4">
                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                                        {content.title}
                                    </h3>
                                    
                                    {/* Slug */}
                                    {content.slug && (
                                        <p className="text-xs text-gray-500 mb-3 font-mono truncate">
                                            /{content.slug}
                                        </p>
                                    )}
                                    
                                    {/* Active Discount Tags */}
                                    {activeDiscounts.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {activeDiscounts.slice(0, 2).map((discount, idx) => (
                                                <span key={idx} className="bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                                    <Tag size={12} />
                                                    {discount}
                                                </span>
                                            ))}
                                            {activeDiscounts.length > 2 && (
                                                <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                                                    +{activeDiscounts.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Time Info */}
                                    <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <Calendar size={16} className="mr-2" />
                                            <span className="text-xs">Ends: {formatDate(content.offerEndTime)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock size={16} className="mr-2 text-gray-600" />
                                            {getTimeRemainingDisplay(content.timeRemaining)}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-600">
                                        <span className="flex items-center gap-1">
                                            📷 {content.regularImages?.filter(img => img).length || 0} images
                                        </span>
                                        <span className="flex items-center gap-1">
                                            🎥 {content.videos?.filter(v => v).length || 0} videos
                                        </span>
                                        <span className="flex items-center gap-1">
                                            📝 {activeSectionsCount} sections
                                        </span>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(content)}
                                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1 text-sm"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(content._id || content.id)}
                                            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdvertiseContentList;