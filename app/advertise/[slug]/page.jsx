'use client'
import { useMemo, useState, useEffect } from 'react'
import { Package, Phone, MapPin, User, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function DynamicAdvertisePage() {
  const params = useParams()
  const slug = params?.slug || 'default-slug'
  
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [orderStatus, setOrderStatus] = useState('')
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Fetch advertise content by slug
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      setError('')
      
      try {
        const response = await fetch(`${API_BASE_URL}/advertise-contents/slug/${slug}`)
        const data = await response.json()
        
        if (response.ok) {
          setContent(data.data)
        } else {
          setError(data.message || 'Content not found')
        }
      } catch (err) {
        console.error('Error fetching content:', err)
        setError('Failed to load content. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchContent()
  }, [slug])

  // Countdown timer based on offerEndTime
  useEffect(() => {
    if (!content?.offerEndTime) return
    
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const endTime = new Date(content.offerEndTime).getTime()
      const distance = endTime - now
      
      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(interval)
        return
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [content])

  const submitOrder = async () => {
    if (!name || !phone || !address) {
      setOrderStatus('দয়া করে সব তথ্য পূরণ করুন')
      return
    }
    
    setOrderStatus('অর্ডার প্রসেসিং...')
    try {
      const res = await fetch(`${API_BASE_URL}/advertise-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contentId: content._id || content.id,
          contentTitle: content.title,
          contentSlug: content.slug,
          name, 
          phone, 
          address, 
          quantity,
          price: content.price || 0,
          originalPrice: content.originalPrice || 0
        }),
      })
      
      if (!res.ok) throw new Error('Failed')
      
      setOrderStatus('অর্ডার সফল হয়েছে! ✓')
      setTimeout(() => {
        setOrderStatus('')
        setName('')
        setPhone('')
        setAddress('')
        setQuantity(1)
      }, 3000)
    } catch (e) {
      setOrderStatus('অর্ডার ব্যর্থ হয়েছে')
      setTimeout(() => setOrderStatus(''), 3000)
    }
  }

  const totalPrice = (content?.price || 0) * quantity
  const savings = (content?.originalPrice && content.originalPrice > content.price) 
    ? ((content.originalPrice - content.price) * quantity) 
    : 0

  // Get active discounts
  const activeDiscounts = useMemo(() => {
    if (!content?.discountShows) return []
    return content.discountShows
      .filter(d => d.isActive)
      .map(d => d.text)
  }, [content])

  // Get active sections
  const activeSections = useMemo(() => {
    if (!content) return []
    return ['section1', 'section2', 'section3', 'section4', 'section5']
      .map(key => ({ key, data: content[key] }))
      .filter(s => s.data?.isActive && (s.data.title || s.data.content))
  }, [content])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">কন্টেন্ট খুঁজে পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="text-teal-600 hover:underline">হোম পেজে ফিরে যান</Link>
        </div>
      </div>
    )
  }

  const isExpired = content.timeRemaining?.expired || false

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Countdown */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
            {content.title}
          </h1>
          
          {!isExpired && (
            <>
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                অফারটি শেষ হতে আর বাকি
              </h2>
              <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
                {timeLeft.days > 0 && (
                  <div className="bg-teal-800 bg-opacity-50 border-2 border-white rounded-lg px-4 md:px-6 py-3 md:py-4 min-w-[80px] md:min-w-[90px]">
                    <div className="text-2xl md:text-4xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-xs md:text-sm mt-1">দিন</div>
                  </div>
                )}
                <div className="bg-teal-800 bg-opacity-50 border-2 border-white rounded-lg px-4 md:px-6 py-3 md:py-4 min-w-[80px] md:min-w-[90px]">
                  <div className="text-2xl md:text-4xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs md:text-sm mt-1">ঘন্টা</div>
                </div>
                <div className="bg-teal-800 bg-opacity-50 border-2 border-white rounded-lg px-4 md:px-6 py-3 md:py-4 min-w-[80px] md:min-w-[90px]">
                  <div className="text-2xl md:text-4xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs md:text-sm mt-1">মিনিট</div>
                </div>
                <div className="bg-teal-800 bg-opacity-50 border-2 border-white rounded-lg px-4 md:px-6 py-3 md:py-4 min-w-[80px] md:min-w-[90px]">
                  <div className="text-2xl md:text-4xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs md:text-sm mt-1">সেকেন্ড</div>
                </div>
              </div>
            </>
          )}
          
          {isExpired && (
            <div className="text-xl md:text-2xl font-semibold text-red-300 mt-4">
              ⚠️ এই অফারটি শেষ হয়ে গেছে
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Thumbnail Image Section */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 md:p-8 mb-8 border-4 border-green-600">
          <div className="bg-white rounded-lg p-4 md:p-6 mb-4">
            {content.thumbImage ? (
              <img 
                src={content.thumbImage} 
                alt={content.title}
                className="w-full rounded-lg object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available'
                }}
              />
            ) : (
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg aspect-video flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Active Discounts */}
          {activeDiscounts.length > 0 && (
            <div className="text-center mb-4">
              {activeDiscounts.map((discount, idx) => (
                <div key={idx} className="inline-block bg-yellow-400 text-black font-bold text-2xl md:text-4xl px-4 md:px-6 py-2 rounded-lg mb-2 mx-1">
                  {discount}
                </div>
              ))}
              <div className="text-xl md:text-2xl font-bold text-green-800 mt-2">ছাড়ে পাচ্ছেন</div>
              <div className="text-base md:text-lg text-green-700">এখনই অর্ডার করুন</div>
            </div>
          )}
        </div>

        {/* Regular Images Gallery */}
        {content.regularImages && content.regularImages.length > 0 && (
          <div className="mb-8">
            <div className="bg-teal-700 text-white text-center py-3 rounded-t-lg">
              <span className="font-bold text-xl">পণ্যের ছবি</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-b-lg border-4 border-teal-700">
              {content.regularImages.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`Product ${idx + 1}`}
                  className="w-full rounded-lg object-cover aspect-square"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Error'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {content.videos && content.videos.length > 0 && content.videos.some(v => v) && (
          <div className="mb-8">
            <div className="bg-red-600 text-white text-center py-2 mb-2 rounded-t-lg">
              <span className="font-bold">▶ ভিডিও দেখুন নিচে</span>
            </div>
            {content.videos.map((video, idx) => video && (
              <div key={idx} className="bg-black rounded-lg mb-4">
                <video 
                  controls 
                  className="w-full rounded-lg"
                  poster={content.thumbImage}
                >
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Sections */}
        {activeSections.map(({ key, data }) => (
          <div key={key} className="mb-8">
            <div className="bg-teal-700 text-white text-center py-3 rounded-t-lg">
              <span className="font-bold text-xl">{data.title}</span>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-b-lg border-4 border-teal-700">
              <div className="text-gray-800 text-lg whitespace-pre-line">
                {data.content}
              </div>
            </div>
          </div>
        ))}

        {/* Order Form */}
        {!isExpired && (
          <div className="mb-8">
            <div className="bg-teal-700 text-white text-center py-3 rounded-t-lg">
              <span className="font-bold text-xl">প্রোডাক্টটি অর্ডার করতে</span>
            </div>
            <div className="bg-red-600 text-white text-center py-2">
              <span className="font-bold">📞 01976-509907</span>
            </div>
            <div className="bg-white border-4 border-red-600 rounded-b-lg p-4 md:p-6">
              <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
                অথবা অনলাইন অর্ডার করার জন্য নিচের ফর্মটি ফিলাপ করুন
              </h3>
              
              {/* Product Display */}
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-3 text-lg">Your Product</label>
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gray-300 w-16 h-16 rounded flex items-center justify-center overflow-hidden">
                      {content.thumbImage ? (
                        <img src={content.thumbImage} alt={content.title} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-8 h-8 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{content.title}</div>
                      {activeDiscounts.length > 0 && (
                        <div className="text-sm text-red-600 font-semibold">{activeDiscounts[0]}</div>
                      )}
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
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="মোবাইল নাম্বার *"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-600 outline-none"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="সম্পূর্ণ ঠিকানা লিখুন *"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-600 outline-none resize-none"
                    required
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
                    <span>{content.title} × {quantity}</span>
                    <span>৳ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>৳ {totalPrice.toFixed(2)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>সাশ্রয়</span>
                      <span>৳ {savings.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl text-teal-700">৳ {totalPrice.toFixed(2)}</span>
                  </div>
                  {content.originalPrice > content.price && (
                    <div className="text-sm text-gray-600 text-center pt-2">
                      <span className="line-through">৳ {(content.originalPrice * quantity).toFixed(2)}</span>
                      <span className="ml-2 text-green-600 font-semibold">
                        ({Math.round(((content.originalPrice - content.price) / content.originalPrice) * 100)}% ছাড়)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={submitOrder}
                disabled={isExpired}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-lg text-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExpired ? 'অফার শেষ' : 'অর্ডার কনফার্ম করুন'}
              </button>

              {orderStatus && (
                <div className={`mt-4 text-center py-3 rounded-lg font-bold ${orderStatus.includes('সফল') ? 'bg-green-100 text-green-700' : orderStatus.includes('প্রসেসিং') ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                  {orderStatus}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-600 py-6">
          <p className="text-sm text-[#a34610]">©{new Date().getFullYear()} সব কিছু. All rights reserved.</p>
          <Link href="/" className="text-[#a34610] hover:underline transition">Home</Link>
        </div>
      </div>
    </div>
  )
}