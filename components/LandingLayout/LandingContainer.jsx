"use client"
import LandingHero from "./LandingHero"
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, User, Heart, ChevronRight, Star, Truck, Shield, Zap } from 'lucide-react';


const LandingContainer = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = [
        { name: 'Electronics', image: '📱', color: 'from-blue-500 to-purple-600' },
        { name: 'Fashion', image: '👔', color: 'from-pink-500 to-rose-600' },
        { name: 'Home & Living', image: '🏠', color: 'from-green-500 to-emerald-600' },
        { name: 'Sports', image: '⚽', color: 'from-orange-500 to-red-600' }
    ];

    const products = [
        { id: 1, name: 'Premium Wireless Headphones', price: 299, rating: 4.8, image: '🎧' },
        { id: 2, name: 'Smart Watch Pro', price: 399, rating: 4.9, image: '⌚' },
        { id: 3, name: 'Designer Backpack', price: 149, rating: 4.7, image: '🎒' },
        { id: 4, name: 'Vintage Sunglasses', price: 199, rating: 4.6, image: '🕶️' }
    ];
    return (
        <div>
            {/* <LandingHero /> */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Navbar */}
                <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            {/* Logo */}
                            <div className="flex items-center space-x-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                    S
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent py-4">
                                    সব কিছু
                                </span>
                            </div>

                            {/* Desktop Menu */}
                            <div className="hidden md:flex items-center space-x-8">
                                <a href="#" className="text-gray-700 hover:text-violet-600 transition font-medium">Home</a>
                                <a href="#" className="text-gray-700 hover:text-violet-600 transition font-medium">Shop</a>
                                <a href="#" className="text-gray-700 hover:text-violet-600 transition font-medium">Categories</a>
                                <a href="#" className="text-gray-700 hover:text-violet-600 transition font-medium">About</a>
                                <a href="#" className="text-gray-700 hover:text-violet-600 transition font-medium">Contact</a>
                            </div>

                            {/* Icons */}
                            <div className="flex items-center space-x-4">
                                <button className="p-2 hover:bg-gray-100 rounded-full transition">
                                    <Search className="w-5 h-5 text-gray-700" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition">
                                    <User className="w-5 h-5 text-gray-700" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition">
                                    <Heart className="w-5 h-5 text-gray-700" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition relative">
                                    <ShoppingCart className="w-5 h-5 text-gray-700" />
                                    <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                                </button>
                                <button
                                    className="md:hidden p-2"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                >
                                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-white border-t">
                            <div className="px-4 py-3 space-y-3">
                                <a href="#" className="block text-gray-700 hover:text-violet-600 transition font-medium">Home</a>
                                <a href="#" className="block text-gray-700 hover:text-violet-600 transition font-medium">Shop</a>
                                <a href="#" className="block text-gray-700 hover:text-violet-600 transition font-medium">Categories</a>
                                <a href="#" className="block text-gray-700 hover:text-violet-600 transition font-medium">About</a>
                                <a href="#" className="block text-gray-700 hover:text-violet-600 transition font-medium">Contact</a>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                       <LandingHero />
                    </div>
                </div>

                {/* Features */}
                <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="flex items-start space-x-4 p-6 rounded-xl hover:shadow-lg transition">
                                <div className="p-3 bg-violet-100 rounded-lg">
                                    <Truck className="w-6 h-6 text-violet-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
                                    <p className="text-gray-600">On orders over $100</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-6 rounded-xl hover:shadow-lg transition">
                                <div className="p-3 bg-indigo-100 rounded-lg">
                                    <Shield className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
                                    <p className="text-gray-600">100% secure transactions</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-6 rounded-xl hover:shadow-lg transition">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Zap className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
                                    <p className="text-gray-600">Same-day dispatch</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl font-bold text-center mb-12">Shop by Category</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((cat, idx) => (
                                <div
                                    key={idx}
                                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-64"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition`}></div>
                                    <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
                                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition">{cat.image}</div>
                                        <h3 className="text-2xl font-bold">{cat.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Featured Products */}
                <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                                >
                                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-48 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
                                        {product.image}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                        <div className="flex items-center mb-3">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-violet-600">${product.price}</span>
                                            <button className="p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition">
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-600 to-indigo-600">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h2 className="text-4xl font-bold mb-4">Join Our Newsletter</h2>
                        <p className="text-xl mb-8 opacity-90">Get exclusive deals and updates delivered to your inbox</p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                            />
                            <button className="px-8 py-4 bg-white text-violet-600 rounded-full font-semibold hover:shadow-lg transition">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                        S
                                    </div>
                                    <span className="text-2xl font-bold text-white"> সব কিছু</span>
                                </div>
                                <p className="text-sm">Your one-stop destination for premium products and unbeatable prices.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-4">Shop</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition">All Products</a></li>
                                    <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
                                    <li><a href="#" className="hover:text-white transition">Best Sellers</a></li>
                                    <li><a href="#" className="hover:text-white transition">Sale</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-4">Company</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition">About Us</a></li>
                                    <li><a href="#" className="hover:text-white transition">Contact</a></li>
                                    <li><a href="#" className="hover:text-white transition">Careers</a></li>
                                    <li><a href="#" className="hover:text-white transition">Blog</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-4">Support</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                                    <li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
                                    <li><a href="#" className="hover:text-white transition">Returns</a></li>
                                    <li><a href="#" className="hover:text-white transition">Track Order</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm">© 2024  সব কিছু. All rights reserved.</p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <a href="#" className="hover:text-white transition">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default LandingContainer
