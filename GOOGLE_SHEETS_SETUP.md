# Google Sheets Order Management Setup 📊

This guide will help you set up automatic order collection and management using Google Sheets.

## Step 1: Create Google Service Account

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create a new project** (or select existing)
3. **Enable Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search "Google Sheets API"
   - Click "Enable"

4. **Create Service Account**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name: `perfume-store-orders`
   - Click "Create and Continue"
   - Skip optional steps, click "Done"

5. **Generate Private Key**:
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create New Key"
   - Choose "JSON" format
   - Download the file (keep it safe!)

## Step 2: Create Google Sheets Document

1. **Create New Sheet**: https://sheets.google.com
2. **Name it**: "Perfume Store Orders"
3. **Share with Service Account**:
   - Click "Share" button
   - Add your service account email (from JSON file)
   - Give "Editor" permissions
   - Click "Send"

4. **Copy Sheet ID**: From URL: 
   `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

## Step 3: Deploy to Netlify

### Environment Variables
Add these to your Netlify environment variables:

```bash
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key content here\n-----END PRIVATE KEY-----"
```

**Important**: The private key should include the `\n` characters as literal text.

### Deploy Steps

1. **Push to GitHub** (if not already done)
2. **Connect to Netlify**:
   - Go to netlify.com
   - Click "New site from Git"
   - Choose your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `build`

3. **Add Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add all three variables above

4. **Deploy!** - Your site will automatically deploy with Google Sheets integration

## Step 4: Alternative Hosting (Vercel)

If using Vercel instead of Netlify:

1. Create `api/orders.js` instead of `netlify/functions/orders.js`
2. Same environment variables
3. Deploy to Vercel

## Step 5: Test the System

1. **Visit your live site**
2. **Fill out the order form**
3. **Submit an order**
4. **Check Google Sheets** - you should see:
   - New row with order data
   - Yellow background for "Pending" status
   - Unique order ID (ORD-2026-XXXX)

## Google Sheets Features

### Automatic Formatting
- **Pending orders**: Yellow background
- **Headers**: Blue background with bold text
- **Auto-generated Order IDs**: ORD-YYYY-NNNN format

### Manual Status Management
Change the "Order Status" column to:
- `Pending` (Yellow background)
- `Confirmed` 
- `Processing`
- `Shipped`
- `Delivered`
- `Cancelled`

### Columns Created
1. **Order ID** - Unique identifier
2. **Date & Time** - Order timestamp
3. **Customer Name** - Customer's name
4. **Phone** - Phone number
5. **Products** - List of ordered products
6. **Quantities** - Product quantities
7. **City** - Extracted from address
8. **Delivery Address** - Full address
9. **Total (MAD)** - Order total in Moroccan Dirham
10. **Order Status** - Current status (starts as "Pending")

## Troubleshooting

### Common Issues

1. **"Missing Google Sheets configuration"**
   - Check environment variables are set correctly
   - Verify the service account JSON is properly formatted

2. **"Permission denied"**
   - Make sure you shared the sheet with the service account email
   - Give "Editor" permissions

3. **"Sheet not found"**
   - Verify the GOOGLE_SHEET_ID is correct
   - Make sure the sheet exists and is accessible

4. **Orders not appearing**
   - Check browser developer console for errors
   - Verify the API endpoint is working: `/api/orders` or `/.netlify/functions/orders`

### Testing the API Directly

You can test the API endpoint directly:

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/orders \
  -H "Content-Type: application/json" \
  -d '{"orderId":"TEST-001","customerName":"Test Customer","phone":"0612345678","products":"Test Product","city":"Test City","deliveryAddress":"Test Address","total":299,"orderStatus":"Pending","dateTime":"2026-01-01 12:00:00"}'
```

## Security Notes

- ✅ Service account credentials are stored securely in environment variables
- ✅ No sensitive data is exposed in frontend code
- ✅ Google Sheets is only accessible to you and the service account
- ✅ All API calls are server-side

## Benefits

- 📊 **Real-time order tracking** in Google Sheets
- 🎯 **Visual status management** with color coding
- 📱 **WhatsApp integration** continues to work
- 🔢 **Unique order IDs** for easy reference
- 📈 **Analytics ready** - export to other tools
- 👥 **Team collaboration** - multiple people can manage orders

Your perfume store now has a professional order management system! 🎉