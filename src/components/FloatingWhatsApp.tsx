import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppLink } from '../config/store';
import { useLandingContent } from '../context/LandingContentContext';

const FloatingWhatsApp: React.FC = () => {
  const { content } = useLandingContent();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show button after a delay when page loads
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Show tooltip periodically to draw attention
    const tooltipTimer = setInterval(() => {
      if (!isExpanded) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
      }
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(tooltipTimer);
    };
  }, [isExpanded]);

  const handleWhatsAppClick = () => {
    const message = content.whatsappMessages.general;
    const whatsappUrl = getWhatsAppLink(message, content.whatsappNumber);
    window.open(whatsappUrl, '_blank');
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 left-6 z-[9999]">
        {/* Tooltip */}
        {showTooltip && !isExpanded && (
          <div className="absolute bottom-full left-0 mb-4 animate-bounce">
            <div className="bg-white rounded-lg shadow-xl p-3 max-w-xs border border-gray-200 relative">
              <div className="text-sm text-charcoal font-medium text-right">
                💬 هل تحتاج مساعدة؟
              </div>
              <div className="text-xs text-gray-600 mt-1 text-right">
                تواصل معنا عبر واتساب
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
            </div>
          </div>
        )}

        {/* Expanded Chat Widget */}
        {isExpanded && (
          <div className="absolute bottom-full left-0 mb-4 w-80 max-w-[calc(100vw-3rem)] animate-scale-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-green-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <div className="font-semibold">{content.storeName}</div>
                      <div className="text-xs opacity-90">متجر العطور الفاخرة</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="space-y-4">
                  {/* Welcome Message */}
                  <div className="bg-gray-100 rounded-2xl p-3 text-right">
                    <div className="text-sm text-charcoal">
                      مرحباً! 👋
                      <br />
                      كيف يمكننا مساعدتك اليوم؟
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={handleWhatsAppClick}
                      className="w-full text-right p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm text-charcoal"
                    >
                      📦 الاستفسار عن العطور المتوفرة
                    </button>
                    
                    <button
                      onClick={() => {
                        const element = document.querySelector('#order');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                          setIsExpanded(false);
                        }
                      }}
                      className="w-full text-right p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm text-charcoal"
                    >
                      🛍️ أريد تقديم طلب
                    </button>

                    <button
                      onClick={handleWhatsAppClick}
                      className="w-full text-right p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm text-charcoal"
                    >
                      🚚 الاستفسار عن التوصيل
                    </button>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    تواصل عبر واتساب
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 float-animation hover:scale-110 active:scale-95 ${
            isExpanded ? 'w-12 h-12' : 'w-14 h-14 md:w-auto md:h-14 md:px-4'
          }`}
          aria-label="تواصل عبر واتساب"
        >
          {isExpanded ? (
            <X size={24} />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <MessageCircle size={24} className="flex-shrink-0" />
              <span className="hidden md:block text-sm font-semibold whitespace-nowrap">
                اطلب عبر واتساب
              </span>
            </div>
          )}
        </button>

        {/* Ripple Effect */}
        {!isExpanded && (
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
        )}
      </div>

      {/* Backdrop for expanded state */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default FloatingWhatsApp;