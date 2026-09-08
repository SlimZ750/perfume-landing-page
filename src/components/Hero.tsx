import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLandingContent } from '../context/LandingContentContext';

interface HeroProps {
  onOrderClick: () => void;
  onDiscoverClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOrderClick, onDiscoverClick }) => {
  const { content } = useLandingContent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToProducts = () => {
    const element = document.querySelector('#products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-white to-champagne">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-gold/20" />
        </svg>
      </div>

      <div className="container-max section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen pt-20">
          {/* Content */}
          <div className={`text-center lg:text-right transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-charcoal leading-tight mb-6">
              <span className="bg-gradient-to-r from-gold to-yellow-600 bg-clip-text text-transparent">
                {content.hero.title.split('...')[0]}...
              </span>
              <br />
              <span className="text-charcoal">
                {content.hero.title.includes('...') ? content.hero.title.split('...')[1].trim() : content.hero.title}
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {content.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onOrderClick}
                className={`btn-primary text-lg px-8 py-4 transition-all duration-700 delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {content.hero.ctaText}
              </button>
              <button
                onClick={onDiscoverClick}
                className={`btn-secondary text-lg px-8 py-4 transition-all duration-700 delay-600 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                اكتشف العطور
              </button>
            </div>

            {/* Trust Indicators */}
            <div className={`mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex items-center gap-2">
                <span className="stars text-base">{Array.from({length: 5}, (_, i) => '⭐').join('')}</span>
                <span>{content.reviewStats.averageRating}/5 من آراء العملاء</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
              <div>
                +{content.reviewStats.totalCustomers} عميل سعيد
              </div>
            </div>
          </div>

          {/* Product Visual */}
          <div className={`relative transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative max-w-md mx-auto">
              {/* Main Product Image */}
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="aspect-[3/4] bg-gradient-to-br from-gold/20 to-champagne/30 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Real Product Image */}
                  <img
                    src={content.hero.image || '/images/royal-oud.jpg'}
                    alt={content.hero.title}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      // Fallback to SVG if image doesn't load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const svgFallback = target.nextElementSibling as HTMLElement;
                      if (svgFallback) svgFallback.style.display = 'block';
                    }}
                  />
                  {/* Fallback SVG */}
                  <svg 
                    className="w-32 h-48 text-gold/60 hidden" 
                    fill="currentColor" 
                    viewBox="0 0 100 140"
                    style={{ display: 'none' }}
                  >
                    <rect x="35" y="20" width="30" height="100" rx="5" className="text-gold/40"/>
                    <rect x="30" y="15" width="40" height="8" rx="4" className="text-gold/60"/>
                    <rect x="42" y="5" width="16" height="15" rx="2" className="text-gold/50"/>
                    <circle cx="50" cy="10" r="3" className="text-gold"/>
                  </svg>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-gold rounded-full animate-pulse"></div>
                  <div className="absolute bottom-8 left-6 w-1 h-1 bg-gold rounded-full animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-gold rounded-full animate-pulse delay-500"></div>
                </div>
                
                {/* Product Badge */}
                <div className="absolute -top-3 -right-3 bg-gold text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  جديد
                </div>
              </div>

              {/* Floating Secondary Products */}
              <div className="absolute -top-4 -left-4 w-16 h-20 bg-white rounded-xl shadow-lg border border-gray-100 p-2 animate-float">
                <div className="w-full h-full bg-gradient-to-br from-champagne to-gold/20 rounded-lg"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-20 bg-white rounded-xl shadow-lg border border-gray-100 p-2 animate-float delay-1000">
                <div className="w-full h-full bg-gradient-to-br from-gold/20 to-champagne rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <button
          onClick={scrollToProducts}
          className="flex flex-col items-center text-gold hover:text-yellow-600 transition-colors duration-300 group"
          aria-label="انتقل إلى المنتجات"
        >
          <span className="text-sm mb-2">اكتشف المزيد</span>
          <ChevronDown size={20} className="animate-bounce group-hover:animate-pulse" />
        </button>
      </div>
    </section>
  );
};

export default Hero;