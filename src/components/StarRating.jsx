import { Star } from 'lucide-react';

export default function StarRating({ rating, reviews }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={14} fill={i <= Math.round(rating) ? '#eab308' : 'none'} color={i <= Math.round(rating) ? '#eab308' : '#4a6080'} />
        ))}
      </div>
      <span style={{ color: '#eab308', fontWeight: 700, fontSize: '0.85rem' }}>{rating}</span>
      {reviews && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({reviews.toLocaleString()})</span>}
    </div>
  );
}
