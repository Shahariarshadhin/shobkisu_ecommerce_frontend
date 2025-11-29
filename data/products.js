export const products = [
  {
    id: '1',
    title: 'Wireless Headphones X100',
    price: 99.99,
    shortDescription: 'Comfort fit, 30h battery, noise reduction.',
    details: 'Over-ear wireless headphones with balanced sound and lightweight design.',
    faq: [
      { q: 'Does it support Bluetooth 5.3?', a: 'Yes' },
      { q: 'Can I use while charging?', a: 'Yes' },
    ],
    features: [
      'Hybrid noise reduction',
      '30 hours battery life',
      'Fast charging via USB‑C',
    ],
    technicalDetails: {
      drivers: '40mm',
      bluetooth: '5.3',
      weight: '240g',
    },
    reviews: [
      { name: 'Amena', rating: 5, comment: 'Great sound and battery.' },
      { name: 'Rahul', rating: 4, comment: 'Comfortable for long use.' },
    ],
  },
  {
    id: '2',
    title: 'Smartwatch S20',
    price: 129.0,
    shortDescription: 'Heart rate, GPS, waterproof 5ATM.',
    details: 'Fitness smartwatch with AMOLED display and multi‑day battery.',
    faq: [
      { q: 'Works with iOS and Android?', a: 'Yes' },
      { q: 'Battery life?', a: 'Up to 7 days' },
    ],
    features: [
      'AMOLED display',
      'GPS + GLONASS',
      'Sleep tracking',
    ],
    technicalDetails: {
      chipset: 'Dual‑core',
      sensors: 'HRM, SpO2, GPS',
      waterResistance: '5ATM',
    },
    reviews: [
      { name: 'Nadia', rating: 5, comment: 'Accurate tracking.' },
    ],
  },
]
