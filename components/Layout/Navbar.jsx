"use client"
import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';


const Navbar = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#C8AF9C] shadow-lg' : 'bg-[#D0B9A7]'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="w-16 h-16">
                                <Image className='w-full h-full rounded-lg' src="/assets/Logo/shobkisulogo.png" alt="logo" width={100} height={100} />
                            </div>
                            <span className="text-2xl font-bold text-[#a34610] py-4">
                                সব কিছু
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#" className="text-[#a34610] hover:text-violet-600 transition font-bold">Home</a>
                            <a href="/products" className="text-[#a34610] hover:text-violet-600 transition font-bold">Shop</a>
                            <a href="#" className="text-[#a34610] hover:text-violet-600 transition font-bold">Categories</a>
                            <a href="#" className="text-[#a34610] hover:text-violet-600 transition font-bold">About</a>
                            <a href="#" className="text-[#a34610] hover:text-violet-600 transition font-bold">Contact</a>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-4">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition">
                                <Search className="w-5 h-5 text-[#a34610]" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition">
                                <User className="w-5 h-5 text-[#a34610]" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition">
                                <Heart className="w-5 h-5 text-[#a34610]" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition relative">
                                <ShoppingCart className="w-5 h-5 text-[#a34610]" />
                                <span className="absolute -top-1 -right-1 bg-[#a34610] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
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
                            <a href="#" className="block text-[#a34610] hover:text-violet-600 transition font-medium">Home</a>
                            <a href="#" className="block text-[#a34610] hover:text-violet-600 transition font-medium">Shop</a>
                            <a href="#" className="block text-[#a34610] hover:text-violet-600 transition font-medium">Categories</a>
                            <a href="#" className="block text-[#a34610] hover:text-violet-600 transition font-medium">About</a>
                            <a href="#" className="block text-[#a34610] hover:text-violet-600 transition font-medium">Contact</a>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    )
}

export default Navbar
