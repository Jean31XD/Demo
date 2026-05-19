import React from 'react';

const ProductCardSkeleton: React.FC = () => (
  <div
    className="product-card"
    aria-hidden="true"
    style={{ pointerEvents: 'none' }}
  >
    {/* Image skeleton */}
    <div className="shimmer" style={{ aspectRatio: '5/4', borderBottom: '1px solid var(--border)' }} />

    {/* Body skeleton */}
    <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
      <div className="shimmer" style={{ height: 10, width: 64, borderRadius: 2 }} />
      <div className="shimmer" style={{ height: 13, width: '80%', borderRadius: 2 }} />
      <div className="shimmer" style={{ height: 13, width: '55%', borderRadius: 2 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <div className="shimmer" style={{ height: 16, width: 72, borderRadius: 2 }} />
        <div className="shimmer" style={{ height: 16, width: 56, borderRadius: 10 }} />
      </div>
    </div>

    {/* Controls skeleton */}
    <div className="shimmer" style={{ height: 38, borderTop: '1px solid var(--border)' }} />
  </div>
);

export default ProductCardSkeleton;
