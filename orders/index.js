const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for orders
const orders = {};

// This would fetch from the Tours service in a real system
const tourBasePrices = {
    'paris-01': 1200,
    'tokyo-02': 1500,
    'rome-03': 1100,
};

app.post('/orders', (req, res) => {
    const { tourId, customizations } = req.body;
    
    // --- Price Calculation (Server-Side) ---
    // This is crucial for security. Never trust a price sent from the client.
    let totalPrice = tourBasePrices[tourId] || 0;
    // In a real app, you would fetch the full tour details and calculate the price
    // based on the customization IDs, not just assume a fixed price.
    // For this example, we'll just use the base price.

    const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    const newOrder = {
        id: orderId,
        tourId,
        customizations,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
    };

    orders[orderId] = newOrder;
    console.log('Created Order:', newOrder);

    res.status(201).json(newOrder);
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
    console.log(`Orders Service listening on port ${PORT}`);
});