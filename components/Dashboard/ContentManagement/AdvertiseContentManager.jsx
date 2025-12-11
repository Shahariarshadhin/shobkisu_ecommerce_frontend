"use client"
import { useState } from 'react';
import AdvertiseContentList from './AdvertiseContentList';
import AdvertiseContentEditForm from './AdvertiseContentEditForm';

export default function AdvertiseContentManager() {
    const [editingContent, setEditingContent] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSaved = () => {
        // Trigger refresh immediately
        setRefreshTrigger(prev => prev + 1);
        // Close modal after showing success message
        setTimeout(() => {
            setEditingContent(null);
        }, 100);
    };

    return (
        <div className="p-4">
            <AdvertiseContentList 
                onEdit={(content) => setEditingContent(content)}
                refreshTrigger={refreshTrigger}
            />
            
            {editingContent && (
                <AdvertiseContentEditForm
                    content={editingContent}
                    onClose={() => setEditingContent(null)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}