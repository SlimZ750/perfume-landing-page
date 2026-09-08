/**
 * The landing page content model.  Keeping this model in one place lets the
 * public site render sensible defaults before a Supabase project is configured.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  image: string;
  additionalImages: string[];
  benefits: string[];
  quantity: number;
  stock: number;
  inStock: boolean;
}

export interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: number;
  name: string;
  city: string;
  text: string;
  rating: number;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  whatsapp: string;
  image: string;
}

export interface OfferContent {
  enabled: boolean;
  title: string;
  description: string;
  price: number;
  oldPrice: number | null;
  ctaText: string;
  image: string;
}

export interface ContactContent {
  phone: string;
  whatsappNumber: string;
  instagram: string;
  email: string;
  address: string;
}

export interface DeliveryContent {
  title: string;
  description: string;
  areas: string;
  fee: string;
}

export interface PaymentContent {
  title: string;
  methods: string[];
}

export interface StoreContent {
  storeName: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  phone: string;
  instagram: string;
  currency: string;
  currencySymbol: string;
  products: Product[];
  benefits: Benefit[];
  testimonials: Testimonial[];
  /** Kept as a compatibility alias for existing integrations. */
  reviews: Testimonial[];
  reviewStats: {
    totalCustomers: number;
    averageRating: number;
  };
  hero: HeroContent;
  offer: OfferContent;
  faq: FAQItem[];
  contact: ContactContent;
  delivery: DeliveryContent;
  payment: PaymentContent;
  navigation: Array<{ name: string; href: string }>;
  whatsappMessages: {
    general: string;
    orderTemplate: (orderData: OrderData) => string;
  };
}

export interface OrderData {
  product: string;
  price: number;
  quantity: number;
  total: number;
  name: string;
  phone: string;
  address: string;
}

const testimonials: Testimonial[] = [
  { id: 1, name: 'سارة', city: 'الدار البيضاء', text: 'العطر رائع جداً والرائحة تدوم لفترة طويلة. أكيد سأطلب مرة أخرى.', rating: 5 },
  { id: 2, name: 'محمد', city: 'الرباط', text: 'الجودة أفضل مما توقعت، والتوصيل كان سريعاً.', rating: 5 },
  { id: 3, name: 'ياسمين', city: 'مراكش', text: 'رائحة فخمة جداً والسعر مناسب مقارنة بالجودة.', rating: 5 },
  { id: 4, name: 'عبدالله', city: 'فاس', text: 'خدمة ممتازة وعطر يستحق السعر. راضي جداً عن الشراء.', rating: 5 },
  { id: 5, name: 'فاطمة', city: 'أكادير', text: 'التعامل محترف والعطر جودة عالية. شكراً لكم.', rating: 5 },
];

export const DEFAULT_CONTENT: StoreContent = {
  storeName: 'عطر',
  tagline: 'عطرك... عنوان حضورك',
  description: 'اكتشف مجموعة مختارة من العطور الفاخرة التي تمنحك حضوراً لا يُنسى.',
  whatsappNumber: '212612345678',
  phone: '+212 612 345 678',
  instagram: '@atr_perfumes',
  currency: 'MAD',
  currencySymbol: 'درهم',
  products: [
    { id: 1, name: 'Bianco Latte', description: 'Luxury oud fragrance', price: 299, oldPrice: null, rating: 5, image: '/images/Bianco Latte.jpg', additionalImages: [], benefits: [], quantity: 10, stock: 10, inStock: true },
    { id: 2, name: '1 Million Exilir', description: 'Elegant floral fragrance', price: 249, oldPrice: 299, rating: 5, image: '/images/1 Million Parfum.jpg', additionalImages: [], benefits: [], quantity: 10, stock: 10, inStock: true },
    { id: 3, name: 'Arabian Tonka', description: 'Intense masculine fragrance', price: 279, oldPrice: null, rating: 5, image: '/images/Arabian Tonka.jpg', additionalImages: [], benefits: [], quantity: 10, stock: 10, inStock: true },
    { id: 4, name: 'Sauvage Dior', description: 'Soft and sophisticated fragrance', price: 259, oldPrice: 289, rating: 5, image: '/images/Sauvage DIOR.jpg', additionalImages: [], benefits: [], quantity: 10, stock: 10, inStock: true },
  ],
  benefits: [
    { id: 1, title: 'جودة فاخرة', description: 'عطور مختارة بعناية بجودة عالية.', icon: 'star' },
    { id: 2, title: 'توصيل سريع', description: 'نوصل طلبك إلى باب منزلك.', icon: 'truck' },
    { id: 3, title: 'دفع عند الاستلام', description: 'اطلب الآن وادفع عند استلام المنتج.', icon: 'credit-card' },
    { id: 4, title: 'رضا العملاء', description: 'تجربة مميزة وآلاف العملاء يثقون بنا.', icon: 'heart' },
  ],
  testimonials,
  reviews: testimonials,
  reviewStats: { totalCustomers: 500, averageRating: 4.9 },
  hero: {
    title: 'عطرك... عنوان حضورك',
    subtitle: 'اكتشف مجموعة مختارة من العطور الفاخرة التي تمنحك حضوراً لا يُنسى.',
    ctaText: 'اطلب الآن',
    whatsapp: '212612345678',
    image: '/images/royal-oud.jpg',
  },
  offer: {
    enabled: true,
    title: 'عرض خاص لفترة محدودة',
    description: 'استفد من أسعارنا المميزة اليوم.',
    price: 199,
    oldPrice: 249,
    ctaText: 'استفد من العرض',
    image: '',
  },
  faq: [
    { id: 1, question: 'هل الدفع عند الاستلام متاح؟', answer: 'نعم، الدفع عند الاستلام متاح في جميع أنحاء المغرب.' },
    { id: 2, question: 'كم يستغرق التوصيل؟', answer: 'عادةً يصل الطلب خلال 1 إلى 3 أيام عمل.' },
  ],
  contact: { phone: '+212 612 345 678', whatsappNumber: '212612345678', instagram: '@atr_perfumes', email: '', address: 'جميع أنحاء المغرب' },
  delivery: { title: 'توصيل سريع وآمن', description: 'نوصّل طلبك إلى باب منزلك بعناية.', areas: 'جميع أنحاء المغرب', fee: 'مجاني للطلبات فوق 200 درهم' },
  payment: { title: 'طرق دفع مرنة', methods: ['الدفع عند الاستلام'] },
  navigation: [
    { name: 'الرئيسية', href: '#home' },
    { name: 'العطور', href: '#products' },
    { name: 'آراء العملاء', href: '#reviews' },
    { name: 'اطلب الآن', href: '#order' },
  ],
  whatsappMessages: {
    general: 'السلام عليكم، أريد الاستفسار عن العطور المتوفرة في متجر عطر.',
    orderTemplate: (orderData) => `السلام عليكم، أريد تأكيد هذا الطلب من متجر عطر:\n\n🛍️ المنتج: ${orderData.product}\n💰 السعر: ${orderData.price} درهم\n🔢 الكمية: ${orderData.quantity}\n💵 المجموع: ${orderData.total} درهم\n\n👤 الاسم: ${orderData.name}\n📞 الهاتف: ${orderData.phone}\n📍 العنوان: ${orderData.address}\n\nأرجو تأكيد الطلب. شكراً.`,
  },
};

/** Ensures partial rows from Supabase can never break the public page. */
export const mergeContent = (value?: Partial<StoreContent> | null): StoreContent => {
  const merged = { ...DEFAULT_CONTENT, ...(value || {}) } as StoreContent;
  merged.products = (value?.products || DEFAULT_CONTENT.products).map((product) => ({
    ...DEFAULT_CONTENT.products.find((item) => item.id === product.id),
    ...product,
    additionalImages: product.additionalImages || [],
    benefits: product.benefits || [],
    stock: product.stock ?? product.quantity ?? 0,
    quantity: product.quantity ?? product.stock ?? 0,
    inStock: product.inStock ?? ((product.stock ?? product.quantity ?? 0) > 0),
  }));
  merged.testimonials = value?.testimonials || value?.reviews || DEFAULT_CONTENT.testimonials;
  merged.reviews = merged.testimonials;
  merged.hero = { ...DEFAULT_CONTENT.hero, ...(value?.hero || {}) };
  merged.offer = { ...DEFAULT_CONTENT.offer, ...(value?.offer || {}) };
  merged.contact = { ...DEFAULT_CONTENT.contact, ...(value?.contact || {}) };
  merged.delivery = { ...DEFAULT_CONTENT.delivery, ...(value?.delivery || {}) };
  merged.payment = { ...DEFAULT_CONTENT.payment, ...(value?.payment || {}) };
  merged.whatsappMessages = { ...DEFAULT_CONTENT.whatsappMessages, ...(value?.whatsappMessages || {}) };
  merged.faq = value?.faq || DEFAULT_CONTENT.faq;
  return merged;
};

export const STORE_CONFIG = DEFAULT_CONTENT;

export const formatPrice = (price: number, symbol = DEFAULT_CONTENT.currencySymbol): string => `${price} ${symbol}`;

export const getWhatsAppLink = (message: string, number = DEFAULT_CONTENT.whatsappNumber): string =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export const generateStars = (rating: number): string => '⭐'.repeat(rating);
