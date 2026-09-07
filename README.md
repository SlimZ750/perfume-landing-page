# عطر - Premium Arabic Perfume Store 🌹

A luxury Arabic RTL e-commerce landing page built with React, TypeScript, and Tailwind CSS, optimized for mobile-first Moroccan perfume retail with WhatsApp integration.

## ✨ Features

- 🏪 Premium Brand Design with Arabic typography
- 📱 Mobile-First responsive design
- 🇲🇦 Complete Arabic RTL layout
- 💬 WhatsApp Business integration
- 🛍️ Interactive product showcase
- ⭐ Customer reviews system
- 📝 Arabic order form with validation
- ♿ WCAG accessibility compliant

## 🚀 Quick Start

```bash
npm install
npm start
npm run build
```

## ⚙️ Supabase setup

The public landing page works with the typed defaults in `src/config/store.ts` when
Supabase is not configured. The dashboard is available at `/admin/login` and
requires Supabase Auth; it never renders the old insecure `AdminPanel` or uses a
URL parameter as a security boundary.

1. Create a Supabase project and enable **Email** sign-in under Authentication.
2. Run `supabase/migrations/001_landing_content.sql` in the SQL editor.
3. Create a user under Authentication → Users and insert its UUID into
   `public.profiles` as `role = 'admin'` (the SQL file includes the statement).
4. Copy `.env.example` to `.env.local` and set:

   ```text
   REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
   ```

   Only the public anon key belongs in the React app. Never expose a
   `service_role` key or Google/Resend secrets in `REACT_APP_*` variables.
5. Start the app and sign in at `/admin/login`. Content saved from the dashboard
   is stored as JSON in `landing_pages`; public users can only read published
   content. Images are validated (image type, max 5MB) and uploaded to the
   `landing-images` Storage bucket.

The existing Vercel order endpoint remains unchanged. Keep its Google Sheets and
Resend variables server-only in Vercel; replace any example values with your
project's secrets in the Vercel dashboard.

## 📱 Mobile Optimized

Built mobile-first for Moroccan customers with touch-friendly interactions and WhatsApp integration.

---

Built with ❤️ for Arabic e-commerce