"use client"
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, Truck, User, Mail, Phone, Package, CheckCircle } from 'lucide-react';
import { clearCart } from '../../redux/cartSlice';

export default function CheckoutComponent() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'BD',
    sameAsShipping: true,
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'BD',
    paymentMethod: 'cash_on_delivery',
    customerNotes: ''
  });

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (parseFloat(item.pricing?.sellingPrice || 0) * item.quantity), 0
  );
  const tax = subtotal * 0.05;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep = (currentStep) => {
    switch(currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone;
      case 2:
        return formData.street && formData.city && formData.state && formData.zipCode;
      case 3:
        return formData.paymentMethod;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    
    try {
      const orderData = {
        customerId: '507f1f77bcf86cd799439011',
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        pricing: {
          subtotal,
          tax,
          shippingCost: shipping,
          discount: 0,
          total
        },
        paymentMethod: formData.paymentMethod,
        notes: {
          customer: formData.customerNotes
        }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrderNumber(data.data.orderNumber);
        setOrderSuccess(true);
        dispatch(clearCart());
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      alert(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products before checking out</p>
          <button
            onClick={() => window.location.href = '/products'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Your order number is:</p>
          <p className="text-3xl font-bold text-purple-600 mb-6">{orderNumber}</p>
          <p className="text-sm text-gray-500 mb-6">
            We've sent a confirmation email to {formData.email}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/orders'}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              View My Orders
            </button>
            <button
              onClick={() => window.location.href = '/products'}
              className="w-full px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Information', icon: User },
              { num: 2, label: 'Shipping', icon: Truck },
              { num: 3, label: 'Payment', icon: CreditCard },
              { num: 4, label: 'Review', icon: Package }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className={`flex flex-col items-center flex-1 ${step >= s.num ? 'text-purple-600' : 'text-gray-400'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-2 ${
                    step >= s.num ? 'bg-purple-600 text-white' : 'bg-gray-200'
                  }`}>
                    <s.icon size={24} />
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{s.label}</span>
                </div>
                {idx < 3 && (
                  <div className={`h-1 flex-1 ${step > s.num ? 'bg-purple-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Step 1: Customer Information */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <User size={28} />
                    Customer Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder="+880 1234-567890"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Truck size={28} />
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="123 Main Street, Apt 4B"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder="Dhaka"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          State/Region *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder="Dhaka Division"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder="1200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-gray-50"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <CreditCard size={28} />
                    Payment Method
                  </h2>
                  <div className="space-y-4">
                    {[
                      { value: 'cash_on_delivery', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                      { value: 'credit_card', label: 'Credit Card', desc: 'Visa, Mastercard, Amex' },
                      { value: 'mobile_payment', label: 'Mobile Payment', desc: 'bKash, Nagad, Rocket' },
                      { value: 'bank_transfer', label: 'Bank Transfer', desc: 'Direct bank transfer' }
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === method.value
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={handleChange}
                          className="w-5 h-5 text-purple-600"
                        />
                        <div className="ml-3">
                          <p className="font-semibold text-gray-800">{method.label}</p>
                          <p className="text-sm text-gray-500">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="customerNotes"
                      value={formData.customerNotes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                      placeholder="Any special instructions for your order..."
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review Order */}
              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Package size={28} />
                    Review Your Order
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Customer Information</h3>
                      <p className="text-sm text-gray-600">{formData.name}</p>
                      <p className="text-sm text-gray-600">{formData.email}</p>
                      <p className="text-sm text-gray-600">{formData.phone}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
                      <p className="text-sm text-gray-600">{formData.street}</p>
                      <p className="text-sm text-gray-600">
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                      <p className="text-sm text-gray-600">{formData.country}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Payment Method</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {formData.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item._id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                            <img
                              src={item.thumbnailImage || 'https://via.placeholder.com/60'}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{item.name}</h4>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-purple-600">
                              ${(parseFloat(item.pricing?.sellingPrice || 0) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                )}
                {step < 4 ? (
                  <button
                    onClick={handleNext}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-purple-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-xs text-purple-800">
                  {shipping === 0 
                    ? '🎉 You get free shipping on this order!' 
                    : '💡 Add $' + (500 - subtotal).toFixed(2) + ' more for free shipping!'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}