"use client"
import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openCart } from '../../redux/uiSlice';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => state.cart?.items || []);
    const cartCount = cartItems.length;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCartClick = () => {
        dispatch(openCart());
    };

    return (
        <div>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-linear-to-br from-[#93c7a5] to-[#0e965d] shadow-lg' 
                    : 'bg-white'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-24">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="w-32 h-24">
                                <Image
                                    className='w-full h-full rounded-lg'
                                    src="/assets/Logo/CY4.png"
                                    alt="logo"
                                    width={1000}
                                    height={1000}
                                />
                            </div>
                            {/* <span className="text-2xl font-bold text-black py-4">
                                সব কিছু
                            </span> */}
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#" className="text-black hover:text-violet-600 transition font-bold">Home</a>
                            <a href="/products" className="text-black hover:text-violet-600 transition font-bold">Shop</a>
                            <a href="#" className="text-black hover:text-violet-600 transition font-bold">Categories</a>
                            <a href="#" className="text-black hover:text-violet-600 transition font-bold">About</a>
                            <a href="#" className="text-black hover:text-violet-600 transition font-bold">Contact</a>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-4">
                            <button className="p-2 hover:bg-white/10 rounded-full transition">
                                <Search className="w-5 h-5 text-black" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-full transition">
                                <User className="w-5 h-5 text-black" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-full transition">
                                <Heart className="w-5 h-5 text-black" />
                            </button>
                            <button
                                onClick={handleCartClick}
                                className="p-2 hover:bg-white/10 rounded-full relative transition"
                            >
                                <ShoppingCart className="w-5 h-5 text-black" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-black text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <button
                                className="md:hidden p-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6 text-black" /> 
                                ) : (
                                    <Menu className="w-6 h-6 text-black" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="px-4 py-3 space-y-3">
                            <a href="#" className="block text-gray-700 hover:text-violet-600 transition font-medium">Home</a>
                            <a href="/products" className="block text-gray-700 hover:text-violet-600 transition font-medium">Shop</a>
                            <a href="#" className="block text-gray-700 hover:text-violet-600 transition font-medium">Categories</a>
                            <a href="#" className="block text-gray-700 hover:text-violet-600 transition font-medium">About</a>
                            <a href="#" className="block text-gray-700 hover:text-violet-600 transition font-medium">Contact</a>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    )
}

export default Navbar;