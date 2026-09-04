import React, { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';

const Reviews: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentReviewSet, setCurrentReviewSet] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('#reviews');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate reviews every 5 seconds
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentReviewSet((prev) => (prev + 1) % Math.ceil(STORE_CONFIG.reviews.length / 3));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Keyboard navigation for review sets
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && isVisible) {
        setCurrentReviewSet((prev) => (prev + 1) % Math.ceil(STORE_CONFIG.reviews.length / 3));
      } else if (event.key === 'ArrowRight' && isVisible) {
        setCurrentReviewSet((prev) => prev === 0 ? Math.ceil(STORE_CONFIG.reviews.length / 3) - 1 : prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  const ReviewCard: React.FC<{ review: any; index: number }> = ({ review, index }) => (
    <div
      className={`card p-8 group hover:shadow-2xl transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      {/* Quote Icon */}
      <div className="mb-6">
        <Quote className="w-8 h-8 text-gold/60 group-hover:text-gold transition-colors duration-300" />
      </div>

      {/* Review Text */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6 text-right">
        "{review.text}"
      </p>

      {/* Rating */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: review.rating }, (_, i) => (
            <Star key={i} size={18} className="fill-gold text-gold" />
          ))}
        </div>
      </div>

      {/* Customer Info */}
      <div className="text-center border-t border-gray-100 pt-6">
        <div className="w-12 h-12 bg-gradient-to-br from-gold to-champagne rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
          {review.name.charAt(0)}
        </div>
        <h4 className="font-semibold text-charcoal group-hover:text-gold transition-colors duration-300">
          {review.name}
        </h4>
        <p className="text-gray-500 text-sm mt-1">
          {review.city}
        </p>
      </div>

      {/* Decorative Element */}
      <div className="w-16 h-1 bg-gradient-to-r from-gold to-transparent mx-auto mt-4 rounded-full group-hover:w-20 transition-all duration-300"></div>
    </div>
  );

  const getVisibleReviews = () => {
    const reviewsPerPage = 3;
    const startIndex = currentReviewSet * reviewsPerPage;
    return STORE_CONFIG.reviews.slice(startIndex, startIndex + reviewsPerPage);
  };

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="container-max section-padding">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            ماذا يقول عملاؤنا؟
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            تجارب حقيقية من عملائنا الكرام في جميع أنحاء المغرب
          </p>
          
          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-gold to-champagne mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Review Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center">
            <div className="text-5xl font-bold text-gold mb-2">
              {STORE_CONFIG.reviewStats.averageRating}
            </div>
            <div className="stars text-2xl mb-2">
              {Array.from({length: 5}, (_, i) => '⭐').join('')}
            </div>
            <div className="text-gray-600">متوسط التقييم</div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold text-gold mb-2">
              +{STORE_CONFIG.reviewStats.totalCustomers}
            </div>
            <div className="text-gray-600 text-lg">عميل سعيد</div>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold text-gold mb-2">98%</div>
            <div className="text-gray-600 text-lg">نسبة الرضا</div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {getVisibleReviews().map((review, index) => (
            <ReviewCard
              key={`${review.id}-${currentReviewSet}`}
              review={review}
              index={index}
            />
          ))}
        </div>

        {/* Review Navigation Dots */}
        <div className="flex justify-center gap-3 mb-12">
          {Array.from({ length: Math.ceil(STORE_CONFIG.reviews.length / 3) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentReviewSet(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentReviewSet
                  ? 'bg-gold shadow-lg scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`عرض مجموعة التقييمات ${i + 1}`}
            />
          ))}
        </div>

        {/* All Reviews Preview */}
        <div className={`bg-gradient-to-br from-cream to-champagne rounded-2xl p-8 transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-2xl font-bold text-charcoal text-center mb-6">
            شاهد جميع التقييمات
          </h3>
          
          {/* Mini Reviews Ticker */}
          <div className="overflow-hidden">
            <div className="flex gap-4 animate-scroll">
              {STORE_CONFIG.reviews.concat(STORE_CONFIG.reviews).map((review, index) => (
                <div
                  key={`ticker-${index}`}
                  className="flex-shrink-0 bg-white rounded-lg p-4 shadow-md min-w-[300px]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-charcoal">{review.name}</div>
                      <div className="text-xs text-gray-500">{review.city}</div>
                    </div>
                    <div className="stars text-sm ml-auto">
                      {Array.from({length: review.rating}, (_, i) => '⭐').join('')}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 text-right line-clamp-2">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-700 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto border border-gray-100">
            <h3 className="text-2xl font-bold text-charcoal mb-4">
              انضم إلى عملائنا السعداء
            </h3>
            <p className="text-gray-600 mb-6">
              جرب عطورنا الفاخرة واكتب تقييمك الخاص بعد التجربة
            </p>
            <button
              onClick={() => {
                const element = document.querySelector('#order');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-primary text-lg px-8 py-4"
            >
              اطلب عطرك الآن
            </button>
          </div>
        </div>
      </div>


    </section>
  );
};

export default Reviews;