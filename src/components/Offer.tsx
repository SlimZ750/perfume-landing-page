import React from 'react';
import { Tag } from 'lucide-react';
import { formatPrice } from '../config/store';
import { useLandingContent } from '../context/LandingContentContext';

const Offer: React.FC = () => {
  const { content } = useLandingContent();
  if (!content.offer.enabled) return null;
  return <section className="py-12 bg-gradient-to-r from-gold to-yellow-600 text-white" aria-label="العرض الخاص">
    <div className="container-max section-padding flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4"><Tag size={32} /><div><h2 className="text-2xl font-bold">{content.offer.title}</h2><p className="mt-1 text-white/90">{content.offer.description}</p></div></div>
      <div className="flex items-center gap-4"><span className="text-3xl font-bold">{formatPrice(content.offer.price, content.currencySymbol)}</span>{content.offer.oldPrice && <span className="line-through text-white/70">{formatPrice(content.offer.oldPrice, content.currencySymbol)}</span>}<button onClick={() => document.querySelector('#order')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-charcoal px-5 py-3 rounded-lg font-bold">{content.offer.ctaText}</button></div>
    </div>
  </section>;
};

export default Offer;
