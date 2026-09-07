const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const orderData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : '';
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.ORDER_NOTIFICATION_EMAIL || serviceAccountEmail;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!sheetId || !serviceAccountEmail || !privateKey) {
      return res.status(500).json({ error: 'Google Sheets is not configured' });
    }

    const auth = new JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const doc = new GoogleSpreadsheet(sheetId, auth);
    await doc.loadInfo();

    let sheet = doc.sheetsByTitle.Orders;
    if (!sheet) {
      sheet = await doc.addSheet({
        title: 'Orders',
        headerValues: [
          'Order ID',
          'Date & Time',
          'Customer Name',
          'Phone',
          'Products',
          'Quantities',
          'City',
          'Delivery Address',
          'Total (MAD)',
          'Order Status',
        ],
      });
    }

    await sheet.addRow({
      'Order ID': orderData.orderId,
      'Date & Time': orderData.dateTime,
      'Customer Name': orderData.customerName,
      Phone: orderData.phone,
      Products: orderData.products,
      Quantities: orderData.quantities,
      City: orderData.city,
      'Delivery Address': orderData.deliveryAddress,
      'Total (MAD)': orderData.total,
      'Order Status': orderData.orderStatus,
    });

    if (!resendApiKey || !fromEmail) {
      return res.status(500).json({
        error: 'Order saved, but email notifications are not configured',
      });
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + resendApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notificationEmail],
        subject: `New perfume order ${orderData.orderId}`,
        text: [
          'New order received',
          '',
          `Order ID: ${orderData.orderId}`,
          `Date and time: ${orderData.dateTime}`,
          `Full name: ${orderData.customerName}`,
          `Phone: ${orderData.phone}`,
          `City: ${orderData.city}`,
          `Address: ${orderData.deliveryAddress}`,
          `Products: ${orderData.products}`,
          `Quantities: ${orderData.quantities}`,
          `Total: ${orderData.total} MAD`,
          `Status: ${orderData.orderStatus}`,
        ].join('\n'),
      }),
    });

    if (!emailResponse.ok) {
      console.error('Order saved, but email notification failed:', await emailResponse.text());
      return res.status(502).json({ error: 'Order saved, but email notification failed' });
    }

    return res.status(200).json({
      success: true,
      orderId: orderData.orderId,
      message: 'Order saved and email notification sent successfully',
    });
  } catch (error) {
    console.error('Failed to save order:', error);
    return res.status(500).json({
      error: 'Failed to save order',
      details: error.message,
    });
  }
};
