import React, { useEffect, useState } from 'react';
import { Star, ShoppingBag } from 'lucide-react';
import { STORE_CONFIG, Product, formatPrice, generateStars } from '../config/store';

interface ProductsProps {
  onProductSelect: (product: Product) => void;
  selectedProducts?: Product[];
}

const Products: React.FC<ProductsProps> = ({ onProductSelect, selectedProducts = [] }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('#products');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
    const [imageError, setImageError] = useState(false);
    const isSelected = selectedProducts.some(p => p.id === product.id);

    const handleOrderClick = () => {
      onProductSelect(product);
      if (!multiSelectMode) {
        // Scroll to order form only in single select mode
        const element = document.querySelector('#order');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    return (
      <div
        className={`card p-6 group transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } ${isSelected ? 'ring-2 ring-gold bg-gold/5' : ''}`}
        style={{ animationDelay: `${index * 150}ms` }}
      >
        {/* Product Image */}
        <div className="relative mb-6 overflow-hidden rounded-xl">
          <div className="aspect-square bg-gradient-to-br from-champagne to-gold/20 rounded-xl flex items-center justify-center relative">
            {!imageError ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
            ) : (
              /* Perfume Bottle Placeholder SVG */
              <svg className="w-24 h-32 text-gold/60 group-hover:scale-110 transition-transform duration-500" fill="currentColor" viewBox="0 0 100 140">
                <rect x="35" y="25" width="30" height="90" rx="5" className="text-gold/40"/>
                <rect x="30" y="20" width="40" height="8" rx="4" className="text-gold/60"/>
                <rect x="42" y="10" width="16" height="15" rx="2" className="text-gold/50"/>
                <circle cx="50" cy="15" r="3" className="text-gold"/>
                <rect x="38" y="35" width="24" height="4" rx="2" className="text-gold/30"/>
                <rect x="40" y="45" width="20" height="2" rx="1" className="text-gold/20"/>
              </svg>
            )}
            
            {/* Discount Badge */}
            {product.oldPrice && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                خصم
              </div>
            )}

            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold bg-black/70 px-4 py-2 rounded-lg">
                  غير متوفر
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="text-center">
          {/* Product Name */}
          <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: product.rating }, (_, i) => (
                <Star key={i} size={16} className="fill-gold text-gold" />
              ))}
            </div>
            <span className="text-sm text-gray-500 mr-2">({product.rating}.0)</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-gold">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            {product.oldPrice && (
              <div className="text-sm text-green-600 font-semibold mt-1">
                وفر {formatPrice(product.oldPrice - product.price)}
              </div>
            )}
          </div>

          {/* Order Button */}
          <button
            onClick={handleOrderClick}
            disabled={!product.inStock}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              product.inStock
                ? isSelected 
                  ? 'bg-gold text-white hover:bg-yellow-600'
                  : 'btn-primary hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingBag size={18} />
            {!product.inStock 
              ? 'غير متوفر' 
              : isSelected 
                ? 'مُختار ✓' 
                : multiSelectMode 
                  ? 'اختيار' 
                  : 'اطلب الآن'
            }
          </button>
        </div>
      </div>
    );
  };

  return (
    <section id="products" className="py-20 bg-white">
      <div className="container-max section-padding">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            اكتشف عطورنا
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            مجموعة مختارة من أفضل العطور الفاخرة التي تناسب جميع الأذواق
          </p>
          
          {/* Multi-select Toggle */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={multiSelectMode}
                onChange={(e) => setMultiSelectMode(e.target.checked)}
                className="w-4 h-4 text-gold bg-gray-100 border-gray-300 rounded focus:ring-gold focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">
                اختيار عطور متعددة
              </span>
            </label>
            {selectedProducts.length > 0 && (
              <div className="bg-gold text-white px-3 py-1 rounded-full text-sm">
                {selectedProducts.length} منتج مُختار
              </div>
            )}
          </div>
          
          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-gold to-champagne mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STORE_CONFIG.products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-lg text-gray-600 mb-6">
            لم تجد ما تبحث عنه؟ تواصل معنا للحصول على استشارة شخصية
          </p>
          <button
            onClick={() => {
              const element = document.querySelector('#order');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-secondary text-lg px-8 py-4"
          >
            تواصل معنا
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;