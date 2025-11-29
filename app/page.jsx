import Link from 'next/link'
import LandingContainer from '../components/LandingLayout/LandingContainer'

export default function Home() {
  return (
    <div className="">
      <div className="">
        <LandingContainer />
        <p>Browse products or view an advertise landing page.</p>
        <div className="row" style={{ gap: 12 }}>
          <Link href="/products"><button className="btn">Products</button></Link>
          <Link href="/advertise/1"><button className="btn secondary">Advertise demo</button></Link>
          <Link href="/cart"><button className="btn secondary">Cart</button></Link>
        </div>
      </div>
    </div>
  )
}
