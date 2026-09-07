import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, Image, Percent, MessageSquare, HelpCircle, Phone, Eye, LogOut, Menu, X, Upload, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { FAQItem, Product, StoreContent, Testimonial, mergeContent } from '../config/store';
import { LandingContentProvider, useLandingContent } from '../context/LandingContentContext';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../components/LandingPage';
import { useStorageUpload } from './useStorageUpload';

type Section = 'overview' | 'product' | 'hero' | 'offer' | 'testimonials' | 'faq' | 'contact' | 'preview';
const navItems: Array<{ id: Section; label: string; icon: React.ReactNode }> = [
  { id: 'overview', label: 'نظرة عامة', icon: <LayoutDashboard size={18} /> },
  { id: 'product', label: 'المنتجات', icon: <Package size={18} /> },
  { id: 'hero', label: 'البانر الرئيسي', icon: <Image size={18} /> },
  { id: 'offer', label: 'العروض', icon: <Percent size={18} /> },
  { id: 'testimonials', label: 'آراء العملاء', icon: <MessageSquare size={18} /> },
  { id: 'faq', label: 'الأسئلة الشائعة', icon: <HelpCircle size={18} /> },
  { id: 'contact', label: 'التواصل والتوصيل', icon: <Phone size={18} /> },
  { id: 'preview', label: 'المعاينة', icon: <Eye size={18} /> },
];

const Field: React.FC<{ label: string; value: string | number; type?: string; onChange: (value: string) => void }> = ({ label, value, type = 'text', onChange }) => (
  <label className="block space-y-1"><span className="text-sm font-semibold text-gray-700">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="input-field" /></label>
);

const ImagePicker: React.FC<{ value: string; onChange: (url: string) => void }> = ({ value, onChange }) => {
  const { upload, uploading } = useStorageUpload();
  const [error, setError] = useState('');
  const choose = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const result = await upload(file);
    if (result.error) setError(result.error);
    else if (result.url) onChange(result.url);
  };
  return <div className="space-y-2"><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="رابط الصورة" className="input-field" /><label className="inline-flex items-center gap-2 text-sm text-gold cursor-pointer"><Upload size={16} />{uploading ? 'جار الرفع...' : 'رفع صورة'}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={choose} /></label>{error && <p className="text-sm text-red-600">{error}</p>}</div>;
};

const Dashboard: React.FC = () => {
  const { content, save, error: loadError } = useLandingContent();
  const { signOut } = useAuth();
  const [draft, setDraft] = useState<StoreContent>(content);
  const [section, setSection] = useState<Section>('overview');
  const [selectedProductId, setSelectedProductId] = useState(content.products[0]?.id || 0);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setDraft(content); }, [content]);
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const update = (next: StoreContent) => { setDraft(mergeContent(next)); setDirty(true); setFeedback(null); };
  const saveDraft = async () => {
    setSaving(true); setFeedback(null);
    const result = await save(draft);
    setSaving(false);
    if (result.error) setFeedback({ type: 'error', text: result.error });
    else { setDirty(false); setFeedback({ type: 'success', text: 'تم حفظ التغييرات بنجاح.' }); }
  };
  const selectSection = (next: Section) => {
    if (dirty && !window.confirm('لديك تغييرات غير محفوظة. هل تريد المتابعة؟')) return;
    setSection(next); setMobileOpen(false);
  };
  const selectedProduct = draft.products.find((product) => product.id === selectedProductId) || draft.products[0];
  const updateProduct = (changes: Partial<Product>) => {
    if (!selectedProduct) return;
    update({ ...draft, products: draft.products.map((product) => product.id === selectedProduct.id ? { ...product, ...changes } : product) });
  };
  const updateFAQ = (id: number, changes: Partial<FAQItem>) => update({ ...draft, faq: draft.faq.map((item) => item.id === id ? { ...item, ...changes } : item) });
  const updateTestimonial = (id: number, changes: Partial<Testimonial>) => update({ ...draft, testimonials: draft.testimonials.map((item) => item.id === id ? { ...item, ...changes } : item), reviews: draft.testimonials });

  const renderSection = () => {
    if (section === 'preview') return <LandingContentProviderForPreview content={draft} />;
    if (section === 'overview') return <div className="space-y-6"><h1 className="text-3xl font-bold">نظرة عامة</h1><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[['المنتجات', draft.products.length], ['التقييمات', draft.testimonials.length], ['الأسئلة', draft.faq.length], ['المخزون', draft.products.reduce((sum, item) => sum + item.stock, 0)]].map(([label, value]) => <div key={String(label)} className="bg-white rounded-xl p-6 shadow-sm"><p className="text-gray-500">{label}</p><p className="text-3xl font-bold text-gold mt-2">{value}</p></div>)}</div><div className="bg-white rounded-xl p-6"><h2 className="font-bold text-xl mb-2">إدارة آمنة للمحتوى</h2><p className="text-gray-600">يتم حفظ المحتوى في Supabase ولا تظهر أدوات الإدارة للزوار. لا تضع أي مفاتيح سرية في متغيرات React.</p></div></div>;
    if (section === 'product') return <div className="space-y-6"><SectionTitle title="إدارة المنتجات" /><div className="bg-white rounded-xl p-6 space-y-5"><select value={selectedProduct?.id} onChange={(event) => setSelectedProductId(Number(event.target.value))} className="input-field">{draft.products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select>{selectedProduct && <>    <div className="grid md:grid-cols-2 gap-4"><Field label="الاسم" value={selectedProduct.name} onChange={(value) => updateProduct({ name: value })} /><Field label="الوصف" value={selectedProduct.description} onChange={(value) => updateProduct({ description: value })} /><Field label="السعر" type="number" value={selectedProduct.price} onChange={(value) => updateProduct({ price: Number(value) })} /><Field label="السعر القديم" type="number" value={selectedProduct.oldPrice || ''} onChange={(value) => updateProduct({ oldPrice: value ? Number(value) : null })} /><Field label="المخزون" type="number" value={selectedProduct.stock} onChange={(value) => updateProduct({ stock: Number(value), quantity: Number(value), inStock: Number(value) > 0 })} /></div><ImagePicker value={selectedProduct.image} onChange={(image) => updateProduct({ image })} /><label className="block space-y-1"><span className="text-sm font-semibold text-gray-700">صور إضافية (رابط في كل سطر)</span><textarea value={selectedProduct.additionalImages.join('\n')} onChange={(event) => updateProduct({ additionalImages: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })} className="input-field" rows={3} /></label><Field label="مزايا المنتج (مفصولة بفاصلة)" value={selectedProduct.benefits.join(', ')} onChange={(value) => updateProduct({ benefits: value.split(',').map((item) => item.trim()).filter(Boolean) })} /></>}</div></div>;
    if (section === 'hero') return <EditorCard title="البانر الرئيسي"><div className="grid md:grid-cols-2 gap-4"><Field label="العنوان" value={draft.hero.title} onChange={(value) => update({ ...draft, hero: { ...draft.hero, title: value } })} /><Field label="نص الزر" value={draft.hero.ctaText} onChange={(value) => update({ ...draft, hero: { ...draft.hero, ctaText: value } })} /></div><label className="block space-y-1"><span className="text-sm font-semibold">الوصف</span><textarea value={draft.hero.subtitle} onChange={(event) => update({ ...draft, hero: { ...draft.hero, subtitle: event.target.value } })} className="input-field" rows={4} /></label><ImagePicker value={draft.hero.image} onChange={(image) => update({ ...draft, hero: { ...draft.hero, image } })} /></EditorCard>;
    if (section === 'offer') return <EditorCard title="العرض"><label className="flex gap-2 items-center"><input type="checkbox" checked={draft.offer.enabled} onChange={(event) => update({ ...draft, offer: { ...draft.offer, enabled: event.target.checked } })} /> تفعيل العرض</label><div className="grid md:grid-cols-2 gap-4"><Field label="العنوان" value={draft.offer.title} onChange={(value) => update({ ...draft, offer: { ...draft.offer, title: value } })} /><Field label="نص الزر" value={draft.offer.ctaText} onChange={(value) => update({ ...draft, offer: { ...draft.offer, ctaText: value } })} /><Field label="السعر" type="number" value={draft.offer.price} onChange={(value) => update({ ...draft, offer: { ...draft.offer, price: Number(value) } })} /><Field label="السعر القديم" type="number" value={draft.offer.oldPrice || ''} onChange={(value) => update({ ...draft, offer: { ...draft.offer, oldPrice: value ? Number(value) : null } })} /></div><Field label="الوصف" value={draft.offer.description} onChange={(value) => update({ ...draft, offer: { ...draft.offer, description: value } })} /><ImagePicker value={draft.offer.image} onChange={(image) => update({ ...draft, offer: { ...draft.offer, image } })} /></EditorCard>;
    if (section === 'testimonials') return <div className="space-y-4"><SectionTitle title="آراء العملاء" /><button className="btn-secondary" onClick={() => update({ ...draft, testimonials: [...draft.testimonials, { id: Date.now(), name: 'عميل جديد', city: '', text: '', rating: 5 }], reviews: draft.testimonials })}><Plus size={16} className="inline ml-1" /> إضافة تقييم</button>{draft.testimonials.map((item) => <EditorCard key={item.id} title={item.name}><div className="grid md:grid-cols-3 gap-3"><Field label="الاسم" value={item.name} onChange={(value) => updateTestimonial(item.id, { name: value })} /><Field label="المدينة" value={item.city} onChange={(value) => updateTestimonial(item.id, { city: value })} /><Field label="التقييم" type="number" value={item.rating} onChange={(value) => updateTestimonial(item.id, { rating: Number(value) })} /></div><textarea value={item.text} onChange={(event) => updateTestimonial(item.id, { text: event.target.value })} className="input-field mt-3" rows={2} /><button className="text-red-600 text-sm mt-2" onClick={() => update({ ...draft, testimonials: draft.testimonials.filter((entry) => entry.id !== item.id), reviews: draft.testimonials })}><Trash2 size={14} className="inline ml-1" /> حذف</button></EditorCard>)}</div>;
    if (section === 'faq') return <div className="space-y-4"><SectionTitle title="الأسئلة الشائعة" /><button className="btn-secondary" onClick={() => update({ ...draft, faq: [...draft.faq, { id: Date.now(), question: 'سؤال جديد', answer: '' }] })}><Plus size={16} className="inline ml-1" /> إضافة سؤال</button>{draft.faq.map((item, index) => <EditorCard key={item.id} title={`سؤال ${index + 1}`}><Field label="السؤال" value={item.question} onChange={(value) => updateFAQ(item.id, { question: value })} /><textarea value={item.answer} onChange={(event) => updateFAQ(item.id, { answer: event.target.value })} className="input-field mt-3" rows={3} placeholder="الإجابة" /><div className="flex gap-3 mt-3"><button disabled={index === 0} onClick={() => reorderFAQ(draft, index, index - 1, update)}><ChevronUp size={18} /></button><button disabled={index === draft.faq.length - 1} onClick={() => reorderFAQ(draft, index, index + 1, update)}><ChevronDown size={18} /></button><button className="text-red-600 text-sm" onClick={() => update({ ...draft, faq: draft.faq.filter((entry) => entry.id !== item.id) })}><Trash2 size={14} className="inline ml-1" /> حذف</button></div></EditorCard>)}</div>;
    return <div className="space-y-6"><EditorCard title="بيانات التواصل"><div className="grid md:grid-cols-2 gap-4"><Field label="الهاتف" value={draft.contact.phone} onChange={(value) => update({ ...draft, phone: value, contact: { ...draft.contact, phone: value } })} /><Field label="واتساب" value={draft.contact.whatsappNumber} onChange={(value) => update({ ...draft, whatsappNumber: value, contact: { ...draft.contact, whatsappNumber: value }, hero: { ...draft.hero, whatsapp: value } })} /><Field label="إنستغرام" value={draft.contact.instagram} onChange={(value) => update({ ...draft, instagram: value, contact: { ...draft.contact, instagram: value } })} /><Field label="البريد الإلكتروني" value={draft.contact.email} onChange={(value) => update({ ...draft, contact: { ...draft.contact, email: value } })} /><Field label="العنوان" value={draft.contact.address} onChange={(value) => update({ ...draft, contact: { ...draft.contact, address: value } })} /></div></EditorCard><EditorCard title="التوصيل والدفع"><Field label="عنوان التوصيل" value={draft.delivery.title} onChange={(value) => update({ ...draft, delivery: { ...draft.delivery, title: value } })} /><Field label="مناطق التوصيل" value={draft.delivery.areas} onChange={(value) => update({ ...draft, delivery: { ...draft.delivery, areas: value } })} /><Field label="رسوم التوصيل" value={draft.delivery.fee} onChange={(value) => update({ ...draft, delivery: { ...draft.delivery, fee: value } })} /><Field label="طرق الدفع (مفصولة بفاصلة)" value={draft.payment.methods.join(', ')} onChange={(value) => update({ ...draft, payment: { ...draft.payment, methods: value.split(',').map((item) => item.trim()).filter(Boolean) } })} /></EditorCard></div>;
  };

  return <div className="min-h-screen bg-gray-50 flex" dir="rtl">
    <aside className={`fixed inset-y-0 right-0 z-30 w-72 bg-charcoal text-white p-5 transform transition-transform md:relative md:translate-x-0 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}><div className="flex items-center justify-between mb-8"><span className="text-2xl font-bold text-gold">عطر | الإدارة</span><button className="md:hidden" onClick={() => setMobileOpen(false)}><X /></button></div><nav className="space-y-1">{navItems.map((item) => <button key={item.id} onClick={() => selectSection(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg text-right ${section === item.id ? 'bg-gold text-white' : 'text-gray-300 hover:bg-white/10'}`}>{item.icon}{item.label}</button>)}</nav><button onClick={() => void signOut()} className="mt-8 flex items-center gap-3 text-gray-300 hover:text-white p-3"><LogOut size={18} /> تسجيل الخروج</button></aside>
    <section className="flex-1 min-w-0"><header className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-20"><button className="md:hidden" onClick={() => setMobileOpen(true)}><Menu /></button><div className="flex items-center gap-3 mr-auto"><Link to="/" className="text-sm text-gray-500">عرض المتجر</Link><button onClick={() => void saveDraft()} disabled={!dirty || saving} className="btn-primary disabled:opacity-40">{saving ? 'جار الحفظ...' : dirty ? 'حفظ التغييرات' : 'محفوظ'}</button></div></header><main className="p-4 md:p-8 max-w-6xl mx-auto">{loadError && <div className="mb-4 rounded-lg bg-amber-50 text-amber-800 p-3">{loadError}</div>}{feedback && <div className={`mb-4 rounded-lg p-3 ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{feedback.text}</div>}{renderSection()}</main></section>
  </div>;
};

const SectionTitle: React.FC<{ title: string }> = ({ title }) => <h1 className="text-3xl font-bold">{title}</h1>;
const EditorCard: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => <div className="bg-white rounded-xl p-6 shadow-sm space-y-4"><h2 className="text-xl font-bold">{title}</h2>{children}</div>;
const reorderFAQ = (content: StoreContent, from: number, to: number, update: (next: StoreContent) => void) => { const faq = [...content.faq]; const [item] = faq.splice(from, 1); faq.splice(to, 0, item); update({ ...content, faq }); };
const LandingContentProviderForPreview: React.FC<{ content: StoreContent }> = ({ content }) => <LandingContentProvider initialContent={content} loadFromSupabase={false}><LandingPage /></LandingContentProvider>;

export default Dashboard;
