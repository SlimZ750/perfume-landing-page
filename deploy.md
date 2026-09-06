# Deployment Guide for عطر Perfume Store

## Quick Setup Instructions

### 1. Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### 2. Installation
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### 3. Configuration
Before going live, update these settings in `src/config/store.ts`:

**CRITICAL - Must Change:**
- `whatsappNumber`: Replace `'212612345678'` with your actual WhatsApp Business number
- `phone`: Update with your business phone number
- `instagram`: Replace with your actual Instagram handle

**Product Information:**
- Update product names, descriptions, and prices
- Replace placeholder product images
- Adjust stock status based on availability

### 4. Build for Production
```bash
# Create optimized production build
npm run build

# The build folder will contain your deployable files
```

### 5. Hosting Options

#### Vercel (required for the Google Sheets endpoint)
1. Push code to the GitHub repository.
2. Import the repository into Vercel.
3. Set the build command to `npm run build`.
4. Set the output directory to `build`.
5. Add `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY` in Vercel for Production, Preview, and Development.
6. Redeploy after changing environment variables.

#### Option C: Traditional Web Hosting
1. Run `npm run build`
2. Upload contents of `build` folder to your web server
3. Configure server to serve `index.html` for all routes

### 6. Domain & SSL
- Point your custom domain to the hosting platform
- SSL certificates are automatically provided by most hosting platforms

### 7. Testing Checklist

Before going live, test:
- [ ] WhatsApp links work with your number
- [ ] All product information is correct
- [ ] Prices are accurate in MAD
- [ ] Mobile responsiveness on different devices
- [ ] Order form validation
- [ ] Arabic text displays correctly
- [ ] All CTAs redirect properly

### 8. Performance Optimization

The site is already optimized with:
- Lazy loading animations
- Compressed images
- Minimal JavaScript bundle
- Mobile-first responsive design
- Arabic font optimization

### 9. Maintenance

#### Updating Products
Edit `src/config/store.ts`:
```typescript
products: [
  {
    id: 1,
    name: 'عطر جديد',
    description: 'وصف العطر',
    price: 299,
    oldPrice: 349,
    rating: 5,
    image: '/images/new-perfume.jpg',
    inStock: true,
  },
  // Add more products...
]
```

#### Updating Contact Information
```typescript
whatsappNumber: '212XXXXXXXXX', // Your WhatsApp Business number
phone: '+212 XXX XXX XXX',
instagram: '@your_handle',
```

### 10. Marketing Integration

#### Google Analytics
Add to `public/index.html` before closing `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

#### Facebook Pixel
Add Facebook Pixel code to `public/index.html`

### 11. SEO Optimization

Update `public/index.html`:
- Meta description
- Keywords
- Open Graph tags for social sharing

### 12. Security Notes

- WhatsApp number is only used for redirects, not stored
- No user data is collected or stored
- All communications happen through WhatsApp
- HTTPS is enforced by hosting platforms

### 13. Support & Maintenance

For ongoing support:
1. Regular price updates in configuration
2. Product inventory management
3. Customer review updates
4. Seasonal promotional changes

The website is designed to be easily maintainable without technical expertise after initial setup.