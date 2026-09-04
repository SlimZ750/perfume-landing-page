# Adding Your Perfume Images 📸

## Step 1: Prepare Your Images
- **Recommended size**: 400x400 pixels (square)
- **Format**: JPG or PNG
- **Quality**: High quality but under 200KB each
- **Background**: White or transparent works best

## Step 2: Copy Images to Project
Place your perfume images in the `public/images/` folder with these exact names:

```
public/images/
├── royal-oud.jpg     ← Your first perfume (Royal Oud)
├── elegance.jpg      ← Your second perfume (Élégance)
├── noir.jpg          ← Your third perfume (Noir)
└── velvet.jpg        ← Your fourth perfume (Velvet)
```

## Step 3: Hero Section Image
The hero section now shows `royal-oud.jpg` by default. If you want to use a different product image in the hero section, edit `src/components/Hero.tsx` and change this line:

```javascript
<img src="/images/your-hero-image.jpg" alt="اسم العطر" />
```

## Step 4: Adding More Products
If you have more than 4 products, edit `src/config/store.ts` and add more products to the array:

```typescript
{
  id: 5,
  name: 'عطر جديد',
  description: 'وصف العطر الجديد',
  price: 320,
  oldPrice: 350,
  rating: 5,
  image: '/images/new-perfume.jpg',
  inStock: true,
}
```

## Current Product Names:
1. **Royal Oud** → `royal-oud.jpg`
2. **Élégance** → `elegance.jpg`
3. **Noir** → `noir.jpg`
4. **Velvet** → `velvet.jpg`

## If Your Image Names Are Different:
Tell me what your image files are called and I'll update the code to match them!

Example: If your files are:
- `perfume1.jpg`
- `perfume2.jpg`
- etc.

I can update the configuration to use your file names.