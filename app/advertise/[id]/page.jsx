'use client'
import { useMemo, useState, useEffect } from 'react'
import { Package, Phone, MapPin, User, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

// Mock products data
const products = [
  {
    id: '1',
    title: 'প্রিমিয়াম ওয়্যারলেস হেডফোন',
    price: 1490,
    originalPrice: 2990,
    discount: 30,
    shortDescription: 'অ্যাক্টিভ নয়েজ ক্যান্সেলেশন এবং ৩০ ঘন্টা ব্যাটারি লাইফ সহ ক্রিস্টাল-ক্লিয়ার অডিও অভিজ্ঞতা নিন।',
    details: 'এই প্রিমিয়াম ওয়্যারলেস হেডফোনগুলি উন্নত নয়েজ ক্যান্সেলেশন প্রযুক্তি সহ স্টুডিও-মানের সাউন্ড সরবরাহ করে। সঙ্গীত প্রেমী, যাত্রী এবং পেশাদারদের জন্য উপযুক্ত যারা সেরা অডিও অভিজ্ঞতার দাবি রাখেন।',
    features: [
      'অ্যাক্টিভ নয়েজ ক্যান্সেলেশন (ANC)',
      'প্রিমিয়াম ৪০মিমি ড্রাইভার',
      'ব্লুটুথ ৫.০ সংযোগ',
      'ফোল্ডেবল ডিজাইন সহ ক্যারিং কেস',
      'টাচ কন্ট্রোল',
      'মাল্টি-ডিভাইস পেয়ারিং'
    ],
    reviews: [
      { name: 'সারাহ এম.', rating: 5, comment: 'সেরা হেডফোন যা আমি কখনও ব্যবহার করেছি! সাউন্ড কোয়ালিটি অসাধারণ।' },
      { name: 'জন ডি.', rating: 4, comment: 'দুর্দান্ত পণ্য, দীর্ঘ ফ্লাইটের জন্য খুবই আরামদায়ক।' }
    ]
  }
]

const API_BASE = 'http://localhost:5000'

export default function BanglaProductPage() {
  const product = products[0]
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState('')
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date()
    targetDate.setHours(targetDate.getHours() + 24)
    
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now
      
      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const submitOrder = async () => {
    setStatus('অর্ডার প্রসেসিং...')
    try {
      const res = await fetch(`${API_BASE}/api/advertise-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, name, phone, address, quantity }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('অর্ডার সফল হয়েছে! ✓')
      setTimeout(() => setStatus(''), 3000)
    } catch (e) {
      setStatus('অর্ডার ব্যর্থ হয়েছে')
    }
  }

  const totalPrice = product.price * quantity
  const savings = (product.originalPrice - product.price) * quantity

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Countdown */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
            অফারটি শেষ হতে আর বাকি
          </h1>
          <div className="flex justify-center gap-4">
            <div className="bg-teal-800 bg-opacity-50 border-2 border-white rounded-lg px-6 py-4 min-w-[90px]">
              <div className="text-3xl md:text-4xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-sm mt-1">ঘন্টা</div>
            </div>
            <div className="bg-teal-800 bg-opacity-50 border-2 border-white rounded-lg px-6 py-4 min-w-[90px]">
              <div className="text-3xl md:text-4xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-sm mt-1">মিনিট</div>
            </div>
            <div className="bg-teal-800 bg-opacity-50 border-2 border-white rounded-lg px-6 py-4 min-w-[90px]">
              <div className="text-3xl md:text-4xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-sm mt-1">সেকেন্ড</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Product Image Section */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8 mb-8 border-4 border-green-600">
          <div className="bg-white rounded-lg p-6 mb-4">
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg aspect-video flex items-center justify-center">
              <Package className="w-24 h-24 text-gray-400" />
            </div>
          </div>
          
          <div className="text-center mb-4">
            <div className="inline-block bg-yellow-400 text-black font-bold text-4xl px-6 py-2 rounded-lg mb-2">
              {product.discount}%
            </div>
            <div className="text-2xl font-bold text-green-800">ছাড়ে পাচ্ছেন</div>
            <div className="text-lg text-green-700">এখনই অর্ডার করুন</div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-teal-700 text-white rounded-lg overflow-hidden mb-8">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-teal-500 pb-3">
              <span className="text-xl">২০০ মিনি কেজলার মূল্য ১৫৪০ টাকা</span>
            </div>
            <div className="flex justify-between items-center border-b border-teal-500 pb-3">
              <span className="text-xl">বর্তমান অফার মূল্য</span>
              <span className="text-2xl font-bold text-yellow-400">৮৮৮ টাকা</span>
            </div>
            <div className="flex justify-between items-center border-b border-teal-500 pb-3">
              <span className="text-xl">৪০০ মিনি কেজলার মূল্য ৩০৪০ টাকা</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl">বর্তমান অফার মূল্য</span>
              <span className="text-2xl font-bold text-yellow-400">১৬৮৮ টাকা</span>
            </div>
          </div>
          <div className="bg-yellow-400 text-center py-3">
            <span className="text-black font-bold text-xl">[মোবাইল ভেরিফিকেশন চার্জ ফ্রি ]</span>
          </div>
        </div>

        {/* Video Section */}
        <div className="mb-8">
          <div className="bg-red-600 text-white text-center py-2 mb-2 rounded-t-lg">
            <span className="font-bold">▶ ভিডিও দেখুন নিচে</span>
          </div>
          <div className="bg-black aspect-video rounded-b-lg flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-2">▶</div>
              <div>ভিডিও প্লেসহোল্ডার</div>
            </div>
          </div>
        </div>

        {/* Lab Test Report */}
        <div className="mb-8">
          <div className="bg-teal-700 text-white text-center py-3 rounded-t-lg">
            <span className="font-bold text-xl">ল্যাব টেস্ট রিপোর্ট</span>
          </div>
          <div className="bg-gray-100 p-6 rounded-b-lg border-4 border-teal-700">
            <div className="bg-white p-4 rounded">
              <img src="/api/placeholder/400/500" alt="Lab Report" className="w-full" />
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-8">
          <div className="bg-teal-700 text-white text-center py-3 rounded-t-lg">
            <span className="font-bold text-xl">আমাদের অর্গানিক খেজুরের উপকারিতা</span>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-b-lg border-4 border-teal-700">
            <ul className="space-y-3">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-xl">✓</span>
                  <span className="text-gray-800 text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-8">
          <div className="bg-teal-700 text-white text-center py-3 rounded-t-lg">
            <span className="font-bold text-xl">আমাদের উপর কেন আস্থা রাখবেন</span>
          </div>
          <div className="bg-white p-6 rounded-b-lg border-4 border-teal-700">
            <div className="space-y-3 text-gray-800">
              <p className="flex items-start gap-2">
                <span className="text-green-600">►</span>
                <span>পুরো দেশে হোম ডেলিভারি আমরা মানসম্পন্ন পণ্য হোমে পৌঁছে দেই।</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-600">►</span>
                <span>সারাদেশে ক্যাশ অন ডেলিভারি সেবা দিতে পারছি।</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-600">►</span>
                <span>আমাদের হটলাইন নাম্বার দিনের বেলা সবার সময় পণ্য প্রাপ্তির পর টাকা পরিশোধ করুন।</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-600">►</span>
                <span>আমাদের গ্রহনের ৩ দিনের মধ্যে পেমেন্ট করতে হবে পেমেন্ট করার আগ পর্যন্ত আপনি মানি রিসিভ করতে পারবেন।</span>
              </p>
            </div>
          </div>
        </div>

        {/* Video Section 2 */}
        <div className="mb-8">
          <div className="bg-red-600 text-white text-center py-2 mb-2 rounded-t-lg">
            <span className="font-bold">▶ ভিডিও দেখুন নিচে</span>
          </div>
          <div className="bg-teal-700 text-white text-center py-3">
            <span className="font-bold text-xl">গ্রাহকদের মন্তব্য জানুন</span>
          </div>
          <div className="bg-black aspect-video rounded-b-lg flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-2">▶</div>
              <div>ভিডিও প্লেসহোল্ডার</div>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="mb-8">
          <div className="bg-teal-700 text-white text-center py-3 rounded-t-lg">
            <span className="font-bold text-xl">প্রোডাক্টটি অর্ডার করতে</span>
          </div>
          <div className="bg-red-600 text-white text-center py-2">
            <span className="font-bold">📞 01976-509907</span>
          </div>
          <div className="bg-white border-4 border-red-600 rounded-b-lg p-6">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              অথবা অনলাইন অর্ডার করার জন্য নিচের ফর্মটি ফিলাপ করুন
            </h3>
            
            {/* Product Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-3 text-lg">Your Products</label>
              <div className="space-y-3">
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gray-300 w-16 h-16 rounded flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{product.title}</div>
                      <div className="text-sm text-gray-600">Price: ৳ {product.price}</div>
                    </div>
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-300">
                    <span className="font-bold text-gray-700">পরিমাণ:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Details */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Billing details</label>
                <input
                  type="text"
                  placeholder="আপনার নাম *"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-600 outline-none"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="মোবাইল নাম্বার *"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-600 outline-none"
                />
              </div>
              <div>
                <textarea
                  placeholder="সম্পূর্ণ ঠিকানা লিখুন *"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-600 outline-none resize-none"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-lg mb-3">আপনার অর্ডার সামারী</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>
                <div className="flex justify-between font-bold border-b pb-2">
                  <span>{product.title} × {quantity}</span>
                  <span>৳ {totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳ {totalPrice}</span>
                </div>
                <div className="flex justify-between text-green-600 font-bold">
                  <span>সাশ্রয়</span>
                  <span>৳ {savings}</span>
                </div>
                <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-xl text-teal-700">৳ {totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              onClick={submitOrder}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-lg text-xl shadow-lg transition"
            >
              অর্ডার কনফার্ম করুন
            </button>

            {status && (
              <div className={`mt-4 text-center py-3 rounded-lg ${status.includes('সফল') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {status}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 py-6">
          <p className="text-sm text-[#a34610]">©{new Date().getFullYear()}  সব কিছু. All rights reserved.</p>
          <Link href="/" className="text-[#a34610] transition">Home</Link>
        </div>
      </div>
    </div>
  )
}