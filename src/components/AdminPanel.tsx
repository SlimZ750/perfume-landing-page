import React, { useState, useEffect } from 'react';
import { Package, Eye, Calendar, Phone, MapPin, DollarSign } from 'lucide-react';

interface Order {
  orderId: string;
  dateTime: string;
  customerName: string;
  phone: string;
  products: string;
  quantities: string;
  city: string;
  deliveryAddress: string;
  total: number;
  orderStatus: string;
}

const AdminPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load orders from localStorage (fallback for development)
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Hidden admin panel - accessed via URL parameter or special key combination
  if (!isVisible && !window.location.search.includes('admin=true')) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gold to-champagne p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">إدارة الطلبات</h2>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-white/80 mt-2">
            عدد الطلبات: {orders.length} | آخر تحديث: {new Date().toLocaleTimeString('ar-MA')}
          </p>
        </div>

        {/* Orders List */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl">لا توجد طلبات بعد</p>
              <p className="text-sm">الطلبات ستظهر هنا عند إرسالها من العملاء</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order, index) => (
                <div
                  key={order.orderId}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-wrap items-start justify-between mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-charcoal">
                        {order.orderId}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {order.dateTime}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Customer Info */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-charcoal flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        معلومات العميل
                      </h4>
                      <p className="text-sm"><strong>الاسم:</strong> {order.customerName}</p>
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.phone}
                      </p>
                      <p className="text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {order.city}
                      </p>
                    </div>

                    {/* Products */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-charcoal">المنتجات</h4>
                      <p className="text-sm">{order.products}</p>
                      <p className="text-xs text-gray-600">{order.quantities}</p>
                    </div>

                    {/* Address & Total */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-charcoal">التفاصيل</h4>
                      <p className="text-sm">
                        <strong>العنوان:</strong> {order.deliveryAddress}
                      </p>
                      <p className="text-sm flex items-center gap-1 font-bold text-gold">
                        <DollarSign className="w-4 h-4" />
                        {order.total} درهم
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                    <button
                      onClick={() => {
                        const whatsappUrl = `https://wa.me/${order.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحباً ${order.customerName}، بخصوص طلبك رقم ${order.orderId}`)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="text-xs bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
                    >
                      واتساب
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${order.orderId}\n${order.customerName}\n${order.phone}\n${order.products}\n${order.deliveryAddress}\n${order.total} درهم`);
                      }}
                      className="text-xs bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      نسخ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            💡 للوصول لهذه الصفحة: أضف <code>?admin=true</code> لرابط الموقع
          </p>
          <p className="text-xs text-gray-500 mt-1">
            الطلبات المحفوظة في Google Sheets لن تظهر هنا - هذا فقط للطلبات المحفوظة محلياً
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;