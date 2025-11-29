import Link from 'next/link'
import { products } from '../../data/products'

export default function ProductsPage() {
  return (
    <div className="container">
      <div className="title">Products</div>
      <div className="grid grid-2" style={{ marginTop: 12 }}>
        {products.map(p => (
          <div key={p.id} className="card">
            <div className="subtitle">{p.title}</div>
            <div className="price">${p.price}</div>
            <p>{p.shortDescription}</p>
            <div className="row" style={{ gap: 8 }}>
              <Link href={`/products/${p.id}`}><button className="btn">View</button></Link>
              <Link href={`/advertise/${p.id}`}><button className="btn secondary">Advertise</button></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
