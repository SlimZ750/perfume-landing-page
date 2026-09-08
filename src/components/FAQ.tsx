import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLandingContent } from '../context/LandingContentContext';

const FAQ: React.FC = () => {
  const { content } = useLandingContent();
  const [open, setOpen] = useState<number | null>(null);
  if (!content.faq.length) return null;
  return <section className="py-16 bg-cream" id="faq"><div className="container-max section-padding max-w-3xl"><h2 className="text-3xl font-bold text-center mb-8">الأسئلة الشائعة</h2><div className="space-y-3">{content.faq.map((item) => <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden"><button className="w-full flex items-center justify-between p-5 text-right font-semibold" onClick={() => setOpen(open === item.id ? null : item.id)}>{item.question}<ChevronDown className={`transition-transform ${open === item.id ? 'rotate-180' : ''}`} size={20} /></button>{open === item.id && <p className="px-5 pb-5 text-gray-600 leading-relaxed">{item.answer}</p>}</div>)}</div></div></section>;
};

export default FAQ;
