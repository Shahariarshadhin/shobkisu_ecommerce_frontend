'use client'
import { useMemo } from 'react'
import { products } from '../../../data/products'
import { useDispatch } from 'react-redux'
import { addItem, incrementQuantity, decrementQuantity } from '../../../redux/cartSlice'

export default function ProductDetail({ params }) {
  const product = useMemo(() => products.find(p => p.id === params.id), [params.id])
  const dispatch = useDispatch()
  if (!product) return <div className="container">Not found</div>
  return (
    <div className="container">
      <div className="grid grid-2">
        <div className="card">
          <div className="title">{product.title}</div>
          <div className="price">${product.price}</div>
          <p>{product.details}</p>
          <div className="subtitle">Features</div>
          <ul>
            {product.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
        <div className="card">
          <div className="subtitle">Buy</div>
          <button className="btn" onClick={() => dispatch(addItem({ id: product.id, title: product.title, price: product.price }))}>Add to cart</button>
          <div style={{ marginTop: 12 }}>
            <div className="subtitle">Quantity quick adjust</div>
            <div className="row">
              <button className="btn secondary" onClick={() => dispatch(decrementQuantity(product.id))}>–</button>
              <button className="btn secondary" onClick={() => dispatch(incrementQuantity(product.id))}>+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
