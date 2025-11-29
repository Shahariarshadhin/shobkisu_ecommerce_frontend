'use client'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../../redux/cartSlice'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export default function CheckoutPage() {
  const items = useSelector(state => state.cart.items)
  const dispatch = useDispatch()
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [status, setStatus] = React.useState('')

  const submitOrder = async () => {
    setStatus('Submitting...')
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address, items, total }),
      })
      if (!res.ok) throw new Error('Failed')
      dispatch(clearCart())
      setStatus('Order placed')
    } catch (e) {
      setStatus('Failed to submit')
    }
  }

  return (
    <div className="container">
      <div className="title">Checkout</div>
      <div className="card">
        <div className="subtitle">Customer details</div>
        <div style={{ display: 'grid', gap: 10 }}>
          <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          <input className="input" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
        </div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="subtitle">Total</div>
          <div className="price">${total.toFixed(2)}</div>
        </div>
        <button className="btn" style={{ marginTop: 8 }} onClick={submitOrder}>Submit</button>
        {status && <div style={{ marginTop: 8 }}>{status}</div>}
      </div>
    </div>
  )
}
