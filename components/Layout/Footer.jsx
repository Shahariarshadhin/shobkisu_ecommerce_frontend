
const Footer = () => {
    return (
        <div>
            <footer className="bg-[#D0B9A7] text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                
                                <span className="text-2xl font-bold text-[#a34610]">সব কিছু</span>
                            </div>
                            <p className="text-sm text-[#a34610]">আপনার পছন্দের পন্যটি আপনার কাছে পৌঁছে যাক সবকিছু হতে</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-[#a34610] mb-4">Shop</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-[#a34610] transition">All Products</a></li>
                                <li><a href="#" className="text-[#a34610] transition">New Arrivals</a></li>
                                <li><a href="#" className="text-[#a34610] transition">Best Sellers</a></li>
                                <li><a href="#" className="text-[#a34610] transition">Sale</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-[#a34610] mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-[#a34610] transition">About Us</a></li>
                                <li><a href="#" className="text-[#a34610] transition">Contact</a></li>
                                <li><a href="#" className="text-[#a34610] transition">Careers</a></li>
                                <li><a href="#" className="text-[#a34610] transition">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-[#a34610] mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-[#a34610] transition">Help Center</a></li>
                                <li><a href="#" className="text-[#a34610] transition">Shipping Info</a></li>
                                <li><a href="#" className="text-[#a34610] transition">Returns</a></li>
                                <li><a href="#" className="text-[#a34610] transition">Track Order</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-[#a34610]">© 2024  সব কিছু. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-[#a34610] transition">Privacy Policy</a>
                            <a href="#" className="text-[#a34610] transition">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer
