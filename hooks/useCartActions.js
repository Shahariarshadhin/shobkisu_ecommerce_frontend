"use client"

import { useDispatch } from 'react-redux';
import { addItem } from '../redux/cartSlice';

export const useCartActions = () => {
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        if (product.stock === 0) {
            alert('This product is out of stock');
            return;
        }

        dispatch(addItem(product));

        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        notification.textContent = '✓ Added to cart!';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2000);
    };

    return { handleAddToCart };
};