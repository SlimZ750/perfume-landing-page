// Store Configuration - Easy to modify store data
export const STORE_CONFIG = {
  // Store Information
  storeName: 'عطر',
  tagline: 'عطرك... عنوان حضورك',
  description: 'اكتشف مجموعة مختارة من العطور الفاخرة التي تمنحك حضوراً لا يُنسى.',

  // Contact Information
  whatsappNumber: '212612345678', // Replace with actual WhatsApp number: Format: 212XXXXXXXXX
  phone: '+212 612 345 678',
  instagram: '@atr_perfumes', // Replace with actual Instagram handle

  // Currency
  currency: 'MAD',
  currencySymbol: 'درهم',

  // Products
  products: [
    {
      id: 1,
      name: 'Bianco Latte',
      description: 'Luxury oud fragrance',
      price: 299,
      oldPrice: null,
      rating: 5,
      image: '/images/Bianco Latte.jpg', // Will use placeholder
      inStock: true,
    },
    {
      id: 2,
      name: '1 Million Exilir',
      description: 'Elegant floral fragrance',
      price: 249,
      oldPrice: 299,
      rating: 5,
      image: '/images/1 Million Parfum.jpg', // Will use placeholder
      inStock: true,
    },
    {
      id: 3,
      name: 'Arabian Tonka',
      description: 'Intense masculine fragrance',
      price: 279,
      oldPrice: null,
      rating: 5,
      image: '/images/Arabian Tonka.jpg', // Will use placeholder
      inStock: true,
    },
    {
      id: 4,
      name: 'Sauvage Dior',
      description: 'Soft and sophisticated fragrance',
      price: 259,
      oldPrice: 289,
      rating: 5,
      image: '/images/Sauvage DIOR.jpg', // Will use placeholder
      inStock: true,
    },
  ],

  // Benefits/Features
  benefits: [
    {
      id: 1,
      title: 'جودة فاخرة',
      description: 'عطور مختارة بعناية بجودة عالية.',
      icon: 'star',
    },
    {
      id: 2,
      title: 'توصيل سريع',
      description: 'نوصل طلبك إلى باب منزلك.',
      icon: 'truck',
    },
    {
      id: 3,
      title: 'دفع عند الاستلام',
      description: 'اطلب الآن وادفع عند استلام المنتج.',
      icon: 'credit-card',
    },
    {
      id: 4,
      title: 'رضا العملاء',
      description: 'تجربة مميزة وآلاف العملاء يثقون بنا.',
      icon: 'heart',
    },
  ],

  // Customer Reviews
  reviews: [
    {
      id: 1,
      name: 'سارة',
      city: 'الدار البيضاء',
      text: 'العطر رائع جداً والرائحة تدوم لفترة طويلة. أكيد سأطلب مرة أخرى.',
      rating: 5,
    },
    {
      id: 2,
      name: 'محمد',
      city: 'الرباط',
      text: 'الجودة أفضل مما توقعت، والتوصيل كان سريعاً.',
      rating: 5,
    },
    {
      id: 3,
      name: 'ياسمين',
      city: 'مراكش',
      text: 'رائحة فخمة جداً والسعر مناسب مقارنة بالجودة.',
      rating: 5,
    },
    {
      id: 4,
      name: 'عبدالله',
      city: 'فاس',
      text: 'خدمة ممتازة وعطر يستحق السعر. راضي جداً عن الشراء.',
      rating: 5,
    },
    {
      id: 5,
      name: 'فاطمة',
      city: 'أكادير',
      text: 'التعامل محترف والعطر جودة عالية. شكراً لكم.',
      rating: 5,
    },
  ],

  // Review Stats
  reviewStats: {
    totalCustomers: 500,
    averageRating: 4.9,
  },

  // Navigation Links
  navigation: [
    { name: 'الرئيسية', href: '#home' },
    { name: 'العطور', href: '#products' },
    { name: 'آراء العملاء', href: '#reviews' },
    { name: 'اطلب الآن', href: '#order' },
  ],

  // WhatsApp Messages
  whatsappMessages: {
    general: 'السلام عليكم، أريد الاستفسار عن العطور المتوفرة في متجر عطر.',
    orderTemplate: (orderData: {
      product: string;
      price: number;
      quantity: number;
      total: number;
      name: string;
      phone: string;
      address: string;
    }) => `السلام عليكم، أريد تأكيد هذا الطلب من متجر عطر:

🛍️ المنتج: ${orderData.product}
💰 السعر: ${orderData.price} درهم
🔢 الكمية: ${orderData.quantity}
💵 المجموع: ${orderData.total} درهم

👤 الاسم: ${orderData.name}
📞 الهاتف: ${orderData.phone}
📍 العنوان: ${orderData.address}

أرجو تأكيد الطلب. شكراً.`,
  },
};

// Utility functions
export const formatPrice = (price: number): string => {
  return `${price} درهم`;
};

export const getWhatsAppLink = (message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodedMessage}`;
};

export const generateStars = (rating: number): string => {
  return '⭐'.repeat(rating);
};

// Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  image: string;
  inStock: boolean;
}

export interface Review {
  id: number;
  name: string;
  city: string;
  text: string;
  rating: number;
}

export interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: string;
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