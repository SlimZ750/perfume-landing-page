// Google Sheets Integration Service
export interface OrderData {
  customerName: string;
  phone: string;
  address: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export interface SheetOrderRow {
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

// Generate unique order ID
export const generateOrderId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const timestamp = now.getTime().toString().slice(-4); // Last 4 digits of timestamp
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `ORD-${year}-${timestamp}${random}`;
};

// Extract city from address (simple implementation)
export const extractCity = (address: string): string => {
  const commonCities = [
    'الدار البيضاء', 'الرباط', 'فاس', 'مراكش', 'أكادير', 'طنجة', 
    'وجدة', 'القنيطرة', 'تطوان', 'سلا', 'مكناس', 'الجديدة'
  ];
  
  const addressLower = address.toLowerCase();
  for (const city of commonCities) {
    if (addressLower.includes(city.toLowerCase())) {
      return city;
    }
  }
  
  // Fallback: try to extract first part before comma
  const parts = address.split('،');
  return parts[0].trim() || 'غير محدد';
};

// Send order to Google Sheets via API endpoint
export const sendOrderToSheets = async (orderData: OrderData): Promise<string> => {
  const orderId = generateOrderId();
  const city = extractCity(orderData.address);
  
  const sheetData: SheetOrderRow = {
    orderId,
    dateTime: new Date().toLocaleString('ar-MA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    customerName: orderData.customerName,
    phone: orderData.phone,
    products: orderData.products.map(p => p.name).join(', '),
    quantities: orderData.products.map(p => `${p.name}: ${p.quantity}`).join(', '),
    city,
    deliveryAddress: orderData.address,
    total: orderData.total,
    orderStatus: 'Pending'
  };

  try {
    // Try different API endpoints based on hosting platform
    const endpoints = [
      '/.netlify/functions/orders', // Netlify
      '/api/orders', // Vercel/other platforms
    ];

    let response;
    let lastError;

    for (const endpoint of endpoints) {
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sheetData),
        });

        if (response.ok) break; // Success, exit loop
        
      } catch (error) {
        lastError = error;
        continue; // Try next endpoint
      }
    }

    if (response && response.ok) {
      await response.json(); // Parse response but don't store unused result
      console.log('✅ Order saved to Google Sheets:', orderId);
      return orderId;
    } else {
      throw new Error(`All API endpoints failed. Last error: ${lastError}`);
    }

  } catch (error) {
    console.error('❌ Error sending to Google Sheets:', error);
    
    // Fallback: Save to localStorage for development/testing
    if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(sheetData);
      localStorage.setItem('orders', JSON.stringify(orders));
      console.log('💾 Order saved to localStorage as fallback:', orderId);
    }
    
    // Return order ID even if Google Sheets fails (don't break the user experience)
    return orderId;
  }
};