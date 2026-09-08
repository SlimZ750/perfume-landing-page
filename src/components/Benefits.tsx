import React, { useEffect, useState } from 'react';
import { Star, Truck, CreditCard, Heart, Shield, Clock, Award, Users } from 'lucide-react';
import { useLandingContent } from '../context/LandingContentContext';

const Benefits: React.FC = () => {
  const { content } = useLandingContent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('#benefits');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      star: <Star className="w-8 h-8" />,
      truck: <Truck className="w-8 h-8" />,
      'credit-card': <CreditCard className="w-8 h-8" />,
      heart: <Heart className="w-8 h-8" />,
      shield: <Shield className="w-8 h-8" />,
      clock: <Clock className="w-8 h-8" />,
      award: <Award className="w-8 h-8" />,
      users: <Users className="w-8 h-8" />,
    };
    return icons[iconName] || <Star className="w-8 h-8" />;
  };

  const BenefitCard: React.FC<{ benefit: any; index: number }> = ({ benefit, index }) => (
    <div
      className={`card p-8 text-center group hover:shadow-2xl transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Icon Container */}
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gold to-champagne rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
        {getIcon(benefit.icon)}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-charcoal mb-4 group-hover:text-gold transition-colors duration-300">
        {benefit.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {benefit.description}
      </p>

      {/* Decorative Element */}
      <div className="w-12 h-1 bg-gradient-to-r from-gold to-transparent mx-auto mt-4 rounded-full group-hover:w-16 transition-all duration-300"></div>
    </div>
  );

  return (
    <section id="benefits" className="py-20 bg-gradient-to-br from-cream via-white to-champagne">
      <div className="container-max section-padding">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            لماذا تختار عطر؟
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نقدم لك تجربة تسوق استثنائية مع ضمان الجودة والخدمة المميزة
          </p>
          
          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-gold to-champagne mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {content.benefits.map((benefit, index) => (
            <BenefitCard
              key={benefit.id}
              benefit={benefit}
              index={index}
            />
          ))}
        </div>

        {/* Additional Trust Elements */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Statistics */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">+{content.reviewStats.totalCustomers}</div>
            <div className="text-gray-600">عميل سعيد</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">{content.reviewStats.averageRating}</div>
            <div className="text-gray-600">متوسط التقييم</div>
            <div className="stars text-lg mt-1">{Array.from({length: 5}, (_, i) => '⭐').join('')}</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-gold mb-2">100%</div>
            <div className="text-gray-600">ضمان الجودة</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-700 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto border border-gray-100">
            <h3 className="text-2xl font-bold text-charcoal mb-4">
              جاهز لاختيار عطرك؟
            </h3>
            <p className="text-gray-600 mb-6">
              اجعل حضورك لا يُنسى مع مجموعتنا المتميزة من العطور الفاخرة
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
              اطلب الآن عبر واتساب
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;