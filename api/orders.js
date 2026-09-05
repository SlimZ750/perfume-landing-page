const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse order data
    const orderData = JSON.parse(event.body);

    // Google Sheets credentials from environment variables
    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || 'eco-palisade-507600-n5';
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'perfume-store-orders@eco-palisade-507600-n5.iam.gserviceaccount.com';
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDwiZFmeP6blR9Y\ncb/MJycg8Dt9fvzKqlQuSL6Eo6o7AK6NUW1KvFPg6qzsgjeGaWwgyhwKKV20mwdO\n1dcDM3bpTc5qLhrKniLXlkFtbSBWHnoHglPqiktnYnk6CuqiznpKDpfTlR6NOLUq\nauhgvsC7oW99ZUcQzUdSrY/M97wxvYO8I705nTTJF00NIOYdvpQSDs8ARJMGQGqm\nZkjmE7dYBb5ecP2yTsqP8/WU4eg1JB4It3G8Cb1VCltc/2XruyukA9c6ItTP7a9w\nZs/yQDHaLghx2MJzezy1x7md/enrCY1gN+xBEcn64BG7E4uPe8MVYF2vyuw3mP7U\niL8hgeaVAgMBAAECggEAIuwmMxWACcCl02Z4bUCF+s9GI9tLAnWmUS34kzNb5MMd\nlKDs2Dvthassvg3N1/L4Yu5VEdidpToY3oZHeEyBiC/mtx3IgABjmJ9VEnkUh8xW\n9T4jxtqbRgBTD21EUazerl/eBTcSP3irPORWpq0rOFKg6DjLD5JuN3/BcAXLygCs\nzDIxBl9u5Aod1MPBXNJOCR6J/YnewxtSfiFpc5XLLnYeZzA5UvG8D3wDj2n3Bawy\nMcgqXRB0+H8fo0Wb46jmpur8CoxnSzeUJPoNsOZgufBa6tmPFiaPO8rMRnGFTaY6\n1GUXRXpyJ11kdaUEf4AelPByiW2zohj5lcO/m4v6oQKBgQD9ccX9PXmLl5Z1hsuk\nVMu7nbd9c8Zhl1bR1hJBGMbeIFh8/kfCNIyMDw+GaQmVU6pEHN/NTEm2DthX2C+K\nEV5FRpqV61V5sZISBDDvC88FwlUw5OVxuPsfj7uvGWnhFzVsj61m6fIGljXVeFh9\nk6eAFGKGgQ9Xm1lG4xqXnd/KqQKBgQDy9nog71jfJuArXRJy3vBY4xDusrqBedVm\n8mR0JeQx3LrtPFxWf81NS5d8LoV4zKwxobySdTd1UQIzPMfq4rWEI9gvX/SdSbR/\nu041n/nwmRGrQncEOAVxs4MX6PdEOpdIiUyRYN8KPSdm0r1dVtTuoOnWYPUupW8b\nSG6FYJ08DQKBgQCHWhOawxH+ct5vtaVcBc0oTXqJDSONSv2a4vCsw0axqiSX3FUG\nanoE8qYf6kir7xqndaQwR+W1zQfNIi+BVPU7mhFEr4Hek+6moIZho7TUJozIp/XB\nXkD/AgwB31ikVXi6maDJrXcL/XySnMrlhc2WoUxc+N/wsY5kRTUWc8HowQKBgQCx\nrJmHOEEvf0hzra5uHqZ4+iRJyp4lTSlIDX50ibkk1ZxFHN0RzIggPGVdRNAKlPJf\noT07hUi3HDSVr58rH/tJ1MSlcHB8DYhX2GvLP2ASGH4ZVZOfnDAvA+2cMJuSY556\nRx2dOtAgtrP3t6kPdw5kK3yVb3YdVJG5y/A2zX5uiQKBgAqY8Vj9DtfH/lcvEP/n\nyYZG5TXiO75Jqy0Qxsbliipu1djFoAl949Eu3c1y2xrM9yi9CjFV0zypgZdIeBqx\nZ+GsOHSn3n29GC1glXyNPBkb5wYgPdTZ522JFwucwqQQt31LXLUkVrWrm+6ATeYx\nfCsbUArTAm8u3uXHM6uQglpn\n-----END PRIVATE KEY-----\n";

    if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      throw new Error('Missing Google Sheets configuration');
    }

    // Initialize the sheet
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);

    // Authenticate with service account
    await doc.useServiceAccountAuth({
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    });

    // Load the document properties and worksheets
    await doc.loadInfo();

    // Get or create the orders sheet
    let sheet = doc.sheetsByTitle['Orders'];
    if (!sheet) {
      // Create the sheet with headers
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
          'Order Status'
        ]
      });

      // Set header row formatting
      await sheet.loadCells('A1:J1');
      for (let col = 0; col < 10; col++) {
        const cell = sheet.getCell(0, col);
        cell.textFormat = { bold: true };
        cell.backgroundColor = { red: 0.2, green: 0.6, blue: 0.9 };
      }
      await sheet.saveUpdatedCells();
    }

    // Add the new order row
    const newRow = await sheet.addRow({
      'Order ID': orderData.orderId,
      'Date & Time': orderData.dateTime,
      'Customer Name': orderData.customerName,
      'Phone': orderData.phone,
      'Products': orderData.products,
      'Quantities': orderData.quantities,
      'City': orderData.city,
      'Delivery Address': orderData.deliveryAddress,
      'Total (MAD)': orderData.total,
      'Order Status': orderData.orderStatus
    });

    // Format the new row (yellow background for pending status)
    if (orderData.orderStatus === 'Pending') {
      await sheet.loadCells(`A${newRow.rowIndex}:J${newRow.rowIndex}`);
      for (let col = 0; col < 10; col++) {
        const cell = sheet.getCell(newRow.rowIndex - 1, col);
        cell.backgroundColor = { red: 1, green: 1, blue: 0.6 }; // Light yellow
      }
      await sheet.saveUpdatedCells();
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        orderId: orderData.orderId,
        message: 'Order saved successfully'
      }),
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to save order',
        details: error.message
      }),
    };
  }
};