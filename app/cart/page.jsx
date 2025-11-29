'use client'
import { useSelector, useDispatch } from 'react-redux'
import { incrementQuantity, decrementQuantity, removeItem, clearCart } from '../../redux/cartSlice'
import Link from 'next/link'

export default function CartPage() {
  const items = useSelector(state => state.cart.items)
  const dispatch = useDispatch()
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  return (
    <div className="container">
      <div className="title">Cart</div>
      {items.length === 0 && <p>Your cart is empty.</p>}
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map(i => (
          <div key={i.id} className="card row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="subtitle">{i.title}</div>
              <div>${i.price} × {i.quantity}</div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn secondary" onClick={() => dispatch(decrementQuantity(i.id))}>–</button>
              <button className="btn secondary" onClick={() => dispatch(incrementQuantity(i.id))}>+</button>
              <button className="btn" onClick={() => dispatch(removeItem(i.id))}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div className="subtitle">Total</div>
            <div className="price">${total.toFixed(2)}</div>
          </div>
          <div className="row" style={{ gap: 8, marginTop: 8 }}>
            <button className="btn secondary" onClick={() => dispatch(clearCart())}>Clear cart</button>
            <Link href="/checkout"><button className="btn">Checkout</button></Link>
          </div>
        </div>
      )}
    </div>
  )
}
