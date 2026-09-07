import React from 'react';
import { MessageCircle, Phone, Instagram, MapPin, Star } from 'lucide-react';
import { getWhatsAppLink } from '../config/store';
import { useLandingContent } from '../context/LandingContentContext';

const Footer: React.FC = () => {
  const { content } = useLandingContent();
  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleWhatsAppClick = () => {
    const message = content.whatsappMessages.general;
    const whatsappUrl = getWhatsAppLink(message, content.whatsappNumber);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="bg-gradient-to-br from-charcoal to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="container-max section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-gold mb-2">
                {content.storeName}
              </h3>
              <p className="text-xl text-gray-300 mb-4">
                {content.tagline}
              </p>
              <p className="text-gray-400 leading-relaxed max-w-md">
                {content.description}
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {content.reviewStats.averageRating}/5 من {content.reviewStats.totalCustomers}+ عميل
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  توصيل مجاني للطلبات فوق 200 درهم
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  دفع عند الاستلام
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  ضمان الجودة 100%
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">
              روابط سريعة
            </h4>
            <nav className="flex flex-col space-y-3">
              {content.navigation.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-gray-400 hover:text-gold transition-colors duration-200 text-right font-medium"
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('#benefits')}
                className="text-gray-400 hover:text-gold transition-colors duration-200 text-right font-medium"
              >
                لماذا عطر؟
              </button>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">
              تواصل معنا
            </h4>
            <div className="space-y-3">
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors duration-200 group"
              >
                <MessageCircle size={18} className="flex-shrink-0" />
                <span>WhatsApp</span>
              </button>
              
              <a
                href={`tel:${content.phone}`}
                className="flex items-center gap-3 text-gray-400 hover:text-gold transition-colors duration-200 group"
              >
                <Phone size={18} className="flex-shrink-0" />
                <span>{content.phone}</span>
              </a>
              
              <a
                href={`https://instagram.com/${content.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-pink-400 transition-colors duration-200 group"
                aria-label="Instagram"
              >
                <Instagram size={18} className="flex-shrink-0" />
                <span>{content.instagram}</span>
              </a>
              
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} className="flex-shrink-0" />
                <span>{content.contact.address}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleWhatsAppClick}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle size={18} />
              اطلب الآن
            </button>
          </div>
        </div>
      </div>

      {/* Popular Products */}
      <div className="border-t border-gray-700">
        <div className="container-max section-padding py-8">
          <h4 className="text-lg font-semibold text-white mb-4 text-center">
            العطور الأكثر طلباً
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.products.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors duration-200 cursor-pointer group"
                onClick={() => scrollToSection('#products')}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold to-champagne rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white group-hover:text-gold transition-colors duration-200">
                    {product.name}
                  </div>
                  <div className="text-xs text-gold">
                    {product.price} درهم
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="container-max section-padding py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center md:text-right">
              © 2026 {content.storeName} — جميع الحقوق محفوظة
            </div>
            
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <button
                onClick={() => {
                  // Handle privacy policy action
                  console.log('Privacy policy clicked');
                }}
                className="hover:text-gray-300 transition-colors duration-200"
              >
                سياسة الخصوصية
              </button>
              <button
                onClick={() => {
                  // Handle terms of service action
                  console.log('Terms of service clicked');
                }}
                className="hover:text-gray-300 transition-colors duration-200"
              >
                شروط الخدمة
              </button>
              <button
                onClick={() => {
                  // Handle return policy action
                  console.log('Return policy clicked');
                }}
                className="hover:text-gray-300 transition-colors duration-200"
              >
                سياسة الإرجاع
              </button>
            </div>
          </div>
          
          {/* Made with note */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-600">
              صُنع بـ ❤️ لتجربة تسوق استثنائية
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;