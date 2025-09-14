
require('dotenv').config();
require('./utils/bigint.util'); 
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const webhookRoutes = require('./routes/webhook.routes');

const allowedOrigins = [
  'http://localhost:3001',              // Your local frontend
  'https://bc66035cdf72.ngrok-free.app' // Your ngrok URL (for Shopify)
];
const authRoutes = require('./routes/auth.routes');
const shopifyRoutes = require('./routes/shopify.routes');
const tenantRoutes = require('./routes/tenant.routes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(cookieParser());


app.use('/api/webhooks', webhookRoutes);
app.use('/api/shopify', shopifyRoutes.webhookRouter);

app.use(express.json());


// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/shopify', shopifyRoutes.router);
app.use('/api/tenants', tenantRoutes);

// --- HEALTH CHECK ROUTE ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// --- SERVER STARTUP ---
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

