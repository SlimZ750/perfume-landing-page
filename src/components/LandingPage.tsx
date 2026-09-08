import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import ErrorBoundary from './ErrorBoundary';
import Header from './Header';
import Hero from './Hero';
import Products from './Products';
import Benefits from './Benefits';
import Reviews from './Reviews';
import OrderForm from './OrderForm';
import FloatingWhatsApp from './FloatingWhatsApp';
import Footer from './Footer';
import Offer from './Offer';
import FAQ from './FAQ';
import { Product } from '../config/store';
const LandingPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedProducts((previous) => previous.some((item) => item.id === product.id) ? previous : [...previous, product]);
  };
  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-cream text-charcoal" dir="rtl">
        <Header onOrderClick={() => scrollTo('#order')} />
        <main>
          <Hero onOrderClick={() => scrollTo('#order')} onDiscoverClick={() => scrollTo('#products')} />
          <Products onProductSelect={handleProductSelect} selectedProducts={selectedProducts} />
          <Offer />
          <Benefits />
          <Reviews />
          <OrderForm selectedProduct={selectedProduct} onProductChange={setSelectedProduct} />
          <FAQ />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
      <Analytics />
    </ErrorBoundary>
  );
};

export default LandingPage;
