import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import Benefits from './components/Benefits';
import Reviews from './components/Reviews';
import OrderForm from './components/OrderForm';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { Product } from './config/store';

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Also manage multiple selection
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev; // Don't add duplicates
      }
      return [...prev, product];
    });
  };

  const handleOrderClick = () => {
    const element = document.querySelector('#order');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDiscoverClick = () => {
    const element = document.querySelector('#products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-cream text-charcoal" dir="rtl">
        {/* Header */}
        <Header onOrderClick={handleOrderClick} />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <Hero 
            onOrderClick={handleOrderClick}
            onDiscoverClick={handleDiscoverClick}
          />

          {/* Products Section */}
          <Products 
            onProductSelect={handleProductSelect}
            selectedProducts={selectedProducts}
          />

          {/* Benefits Section */}
          <Benefits />

          {/* Reviews Section */}
          <Reviews />

          {/* Order Form Section */}
          <OrderForm 
            selectedProduct={selectedProduct}
            onProductChange={setSelectedProduct}
          />
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating WhatsApp Button */}
        <FloatingWhatsApp />
        
        {/* Admin Panel (hidden by default) */}
        <AdminPanel />
      </div>
    </ErrorBoundary>
  );
};

export default App;