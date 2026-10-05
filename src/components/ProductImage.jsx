import './ProductImage.css';

export default function ProductImage({ product, size = 'md', className = '' }) {
  const sizeClass = `product-img-${size}`;
  const emoji = product.emoji || '📦';
  return (
    <div className={`product-img-wrap ${sizeClass} ${className}`} style={{ background: product.gradient }}>
      <div className="product-img-inner">
        <div className="product-img-icon">{emoji}</div>
        <div className="product-img-name" style={{ color: product.accentColor }}>{product.name}</div>
      </div>
      <div className="product-img-glow" style={{ background: product.accentColor }} />
    </div>
  );
}
