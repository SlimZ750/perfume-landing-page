import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';

interface HeaderProps {
  onOrderClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOrderClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleOrderClick = () => {
    onOrderClick();
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-max section-padding">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="text-2xl md:text-3xl font-bold text-gold cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => scrollToSection('#home')}
          >
            {STORE_CONFIG.storeName}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            {STORE_CONFIG.navigation.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-charcoal hover:text-gold font-medium transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <button
            onClick={handleOrderClick}
            className="hidden md:block btn-primary text-sm lg:text-base"
          >
            اطلب الآن
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-charcoal hover:text-gold transition-colors duration-200"
            aria-label="فتح القائمة"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md rounded-b-lg mt-2">
            <nav className="flex flex-col space-y-4">
              {STORE_CONFIG.navigation.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-charcoal hover:text-gold font-medium py-2 px-4 text-right transition-colors duration-200 hover:bg-gray-50 rounded-md"
                >
                  {link.name}
                </button>
              ))}
              <button
                onClick={handleOrderClick}
                className="btn-primary mx-4 mt-2 text-center"
              >
                اطلب الآن
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;