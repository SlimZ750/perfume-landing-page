import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, User, Phone, MapPin, Minus, Plus, MessageCircle, AlertCircle, CheckCircle, X } from 'lucide-react';
import { STORE_CONFIG, Product, formatPrice, getWhatsAppLink } from '../config/store';
import { sendOrderToSheets, OrderData } from '../services/googleSheets';

interface OrderFormProps {
  selectedProduct: Product | null;
  onProductChange: (product: Product | null) => void;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
  selectedProducts: Array<{productId: number; quantity: number}>;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  products?: string;
}

// Move InputField component outside to prevent recreation
const InputField = React.memo<{
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  multiline?: boolean;
}>(({ icon, label, type, value, onChange, placeholder, error, multiline = false }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-charcoal font-semibold">
      {icon}
      {label}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={`input-field resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
      />
    )}
    {error && (
      <div className="flex items-center gap-2 text-red-500 text-sm">
        <AlertCircle size={16} />
        {error}
      </div>
    )}
  </div>
));

const OrderForm: React.FC<OrderFormProps> = ({ selectedProduct, onProductChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [orderId, setOrderId] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    selectedProducts: selectedProduct ? [{productId: selectedProduct.id, quantity: 1}] : [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('#order');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Update form when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      setFormData(prev => {
        const existingIndex = prev.selectedProducts.findIndex(p => p.productId === selectedProduct.id);
        if (existingIndex >= 0) {
          return prev; // Product already selected
        }
        return {
          ...prev,
          selectedProducts: [...prev.selectedProducts, {productId: selectedProduct.id, quantity: 1}]
        };
      });
    }
  }, [selectedProduct]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation - Allow Arabic names with spaces
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'الاسم يجب أن يكون أكثر من حرفين';
    }

    // Phone validation - Only 06 followed by 8 digits
    const cleanPhone = formData.phone.replace(/\s/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^06\d{8}$/.test(cleanPhone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يبدأ بـ 06 ويتكون من 10 أرقام (مثال: 0612345678)';
    }

    // Address validation - Allow longer addresses
    if (!formData.address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'يرجى إدخال عنوان أكثر تفصيلاً';
    }

    // Products validation
    if (formData.selectedProducts.length === 0) {
      newErrors.products = 'يرجى اختيار عطر واحد على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getSelectedProducts = (): Array<Product & {quantity: number}> => {
    return formData.selectedProducts.map(sp => {
      const product = STORE_CONFIG.products.find(p => p.id === sp.productId);
      return product ? { ...product, quantity: sp.quantity } : null;
    }).filter(Boolean) as Array<Product & {quantity: number}>;
  };

  const calculateTotal = (): number => {
    return formData.selectedProducts.reduce((total, sp) => {
      const product = STORE_CONFIG.products.find(p => p.id === sp.productId);
      return total + (product ? product.price * sp.quantity : 0);
    }, 0);
  };

  const handleQuantityChange = (productId: number, change: number) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.map(sp => 
        sp.productId === productId 
          ? { ...sp, quantity: Math.max(1, sp.quantity + change) }
          : sp
      )
    }));
  };

  const handleAddProduct = (productId: number) => {
    const product = STORE_CONFIG.products.find(p => p.id === productId);
    if (!product) return;
    
    setFormData(prev => {
      const existingIndex = prev.selectedProducts.findIndex(p => p.productId === productId);
      if (existingIndex >= 0) {
        // Increase quantity if already selected
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.map(sp => 
            sp.productId === productId 
              ? { ...sp, quantity: sp.quantity + 1 }
              : sp
          )
        };
      } else {
        // Add new product
        return {
          ...prev,
          selectedProducts: [...prev.selectedProducts, {productId, quantity: 1}]
        };
      }
    });
  };

  const handleNameChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, name: value }));
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    // Format phone number as user types
    const cleanValue = value.replace(/\D/g, ''); // Remove non-digits
    if (cleanValue.length <= 10 && (cleanValue.startsWith('06') || cleanValue.length < 2)) {
      setFormData(prev => ({ ...prev, phone: cleanValue }));
    }
  }, []);

  const handleAddressChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, address: value }));
  }, []);

  const handleRemoveProduct = (productId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter(sp => sp.productId !== productId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setOrderStatus('saving');

    const selectedProducts = getSelectedProducts();
    if (selectedProducts.length === 0) return;

    try {
      // Prepare order data for Google Sheets
      const orderData: OrderData = {
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        products: selectedProducts.map(p => ({
          name: p.name,
          quantity: p.quantity,
          price: p.price
        })),
        total: calculateTotal()
      };

      // Save to Google Sheets first
      const generatedOrderId = await sendOrderToSheets(orderData);
      setOrderId(generatedOrderId);
      setOrderStatus('success');

      // Prepare WhatsApp message with order ID
      const orderDetails = selectedProducts.map(product => 
        `🛍️ ${product.name} - ${product.price} درهم × ${product.quantity} = ${product.price * product.quantity} درهم`
      ).join('\n');

      const total = calculateTotal();
      
      const message = `السلام عليكم، أريد تأكيد هذا الطلب من متجر عطر:

📋 رقم الطلب: ${generatedOrderId}
📅 التاريخ: ${new Date().toLocaleDateString('ar-MA')}

${orderDetails}

💵 المجموع الكلي: ${total} درهم

👤 الاسم: ${formData.name}
📞 الهاتف: ${formData.phone}
📍 العنوان: ${formData.address}

أرجو تأكيد الطلب. شكراً.`;

      const whatsappUrl = getWhatsAppLink(message);

      // Show success message briefly
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        setIsSubmitting(false);
        setOrderStatus('idle');
        // Reset form
        setFormData({
          name: '',
          phone: '',
          address: '',
          selectedProducts: []
        });
      }, 3000);

    } catch (error) {
      console.error('Error processing order:', error);
      setOrderStatus('error');
      setIsSubmitting(false);
      
      // Still allow WhatsApp fallback if Google Sheets fails
      setTimeout(() => {
        setOrderStatus('idle');
      }, 3000);
    }
  };

  if (showSuccess) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
        <div className="container-max section-padding">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              تم حفظ طلبك بنجاح! 🎉
            </h3>
            
            {orderId && (
              <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">رقم الطلب</p>
                <p className="text-lg font-bold text-green-700">{orderId}</p>
              </div>
            )}
            
            <p className="text-green-700 mb-6 leading-relaxed">
              تم حفظ طلبك في نظامنا وسيتم تحويلك إلى واتساب لتأكيد الطلب مع فريق المبيعات
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 mb-4">
              <div className="animate-spin w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full"></div>
              <span>جاري التحويل إلى واتساب...</span>
            </div>
            
            <div className="text-xs text-green-600 bg-green-50 p-3 rounded-lg">
              💡 احتفظ برقم الطلب للمتابعة
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (orderStatus === 'error') {
    return (
      <section className="py-20 bg-gradient-to-br from-red-50 to-red-100">
        <div className="container-max section-padding">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-red-800 mb-4">
              حدث خطأ في حفظ الطلب
            </h3>
            
            <p className="text-red-700 mb-6">
              لم نتمكن من حفظ الطلب في النظام. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة عبر واتساب.
            </p>
            
            <button
              onClick={() => {
                setOrderStatus('idle');
                setShowSuccess(false);
              }}
              className="btn-primary mr-3"
            >
              إعادة المحاولة
            </button>
            
            <button
              onClick={() => {
                const whatsappUrl = getWhatsAppLink(STORE_CONFIG.whatsappMessages.general);
                window.open(whatsappUrl, '_blank');
              }}
              className="btn-secondary"
            >
              تواصل عبر واتساب
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="py-20 bg-gradient-to-br from-champagne via-cream to-white">
      <div className="container-max section-padding">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            اطلب عطرك الآن
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            أدخل معلوماتك وسنتواصل معك عبر واتساب لتأكيد طلبك
          </p>
          
          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-gold to-champagne mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">
            {/* Order Form */}
            <div className={`card p-8 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h3 className="text-2xl font-bold text-charcoal mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-gold" />
                معلومات العميل
              </h3>

              <div className="space-y-6">
                <InputField
                  icon={<User size={18} className="text-gold" />}
                  label="الاسم الكامل"
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="أدخل اسمك الكامل"
                  error={errors.name}
                />

                <InputField
                  icon={<Phone size={18} className="text-gold" />}
                  label="رقم الهاتف"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="0612345678"
                  error={errors.phone}
                />

                <InputField
                  icon={<MapPin size={18} className="text-gold" />}
                  label="عنوان التوصيل"
                  type="text"
                  value={formData.address}
                  onChange={handleAddressChange}
                  placeholder="مثال: الرباط، حي الرياض، شارع الحسن الثاني، رقم 123، الطابق الثاني"
                  error={errors.address}
                  multiline
                />

                {/* Product Selection */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-charcoal font-semibold">
                    <ShoppingBag size={18} className="text-gold" />
                    اختر العطور
                  </label>
                  
                  {/* Available Products */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {STORE_CONFIG.products.map(product => {
                      const isSelected = formData.selectedProducts.some(sp => sp.productId === product.id);
                      const selectedProduct = formData.selectedProducts.find(sp => sp.productId === product.id);
                      
                      return (
                        <div
                          key={product.id}
                          className={`border rounded-lg p-3 transition-all duration-200 ${
                            isSelected 
                              ? 'border-gold bg-gold/5' 
                              : 'border-gray-300 hover:border-gold/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{product.name}</h4>
                              <p className="text-xs text-gray-600">{formatPrice(product.price)}</p>
                            </div>
                            {!isSelected ? (
                              <button
                                type="button"
                                onClick={() => handleAddProduct(product.id)}
                                className="text-xs bg-gold text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors"
                              >
                                إضافة
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(product.id, -1)}
                                  className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center text-sm"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="text-sm font-semibold w-6 text-center">
                                  {selectedProduct?.quantity || 0}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(product.id, 1)}
                                  className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center text-sm"
                                >
                                  <Plus size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProduct(product.id)}
                                  className="text-xs bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
                                >
                                  حذف
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {errors.products && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle size={16} />
                      {errors.products}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className={`card p-8 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h3 className="text-2xl font-bold text-charcoal mb-6 flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-gold" />
                ملخص الطلب
              </h3>

              {formData.selectedProducts.length > 0 ? (
                <div className="space-y-4">
                  {/* Selected Products */}
                  <div className="space-y-3">
                    {getSelectedProducts().map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-gold to-champagne rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-charcoal">{product.name}</h4>
                          <p className="text-gray-600 text-sm">{product.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              {formatPrice(product.price)} × {product.quantity}
                            </span>
                            <span className="font-semibold text-gold">
                              {formatPrice(product.price * product.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    {getSelectedProducts().map((product) => (
                      <div key={product.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{product.name} × {product.quantity}</span>
                        <span className="font-semibold">{formatPrice(product.price * product.quantity)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-lg font-bold text-gold border-t border-gray-200 pt-3">
                      <span>المجموع الكلي:</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {orderStatus === 'saving' ? 'جاري حفظ الطلب...' : 'جاري المعالجة...'}
                      </>
                    ) : (
                      <>
                        <MessageCircle size={20} />
                        حفظ الطلب وتأكيد عبر واتساب
                      </>
                    )}
                  </button>

                  {/* Enhanced Info Note */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <div className="flex items-start gap-2">
                      <MessageCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">كيف يعمل النظام:</p>
                        <ul className="text-xs space-y-1 list-disc list-inside">
                          <li>سيتم حفظ طلبك في النظام مع رقم طلب فريد</li>
                          <li>ستتم إعادة توجيهك إلى واتساب لتأكيد الطلب</li>
                          <li>فريق المبيعات سيتواصل معك لتأكيد التفاصيل</li>
                          <li>الدفع عند الاستلام فقط</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>اختر عطراً أو أكثر لعرض ملخص الطلب</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;