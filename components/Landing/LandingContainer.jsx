"use client"
import { Shield, Truck, Zap } from 'lucide-react';
import Image from "next/image";
import LandingHero from "./LandingHero";


const LandingContainer = () => {


    const categories = [
        { name: 'Home Decor', image: '🏠', color: 'bg-[#D0B9A7]' },
        { name: 'Fashion', image: '👔', color: 'bg-[#D0B9A7]' },
        { name: 'Food', image: '🍔', color: 'bg-[#D0B9A7]' },
        { name: 'Toys', image: '⚽', color: 'bg-[#D0B9A7]' }
    ];

    const products = [
        { id: 1, name: 'Premium Wireless Headphones', price: 299, rating: 4.8, image: '/assets/Products/rickshaw.png' },
        { id: 2, name: 'Smart Watch Pro', price: 399, rating: 4.9, image: '/assets/Products/tempu.png' },
        { id: 3, name: 'Designer Backpack', price: 149, rating: 4.7, image: '/assets/Products/lamp.png' },
        // { id: 4, name: 'Vintage Sunglasses', price: 199, rating: 4.6, image: '🕶️' }
    ];
    return (
        <div>
            {/* <LandingHero /> */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Navbar */}


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
                                    <div className={`absolute inset-0 ${cat.color} opacity-90 group-hover:opacity-100 transition`}></div>
                                    <div className="relative h-full flex flex-col items-center justify-center text-white p-6">
                                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition">{cat.image}</div>
                                        <h3 className="text-2xl font-bold text-[#a34610]">{cat.name}</h3>
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
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                                >
                                    <div className="w-full h-full">
                                        {/* {product.image} */}
                                        <Image className="w-full h-full" src={product.image} alt={product.name} width={1000} height={1000} />
                                    </div>
                                    {/* <div className="p-6">
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
                                    </div> */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Newsletter */}
                {/* <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-600 to-indigo-600">
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
                </div> */}

                {/* Footer */}

            </div>
        </div>
    )
}

export default LandingContainer
