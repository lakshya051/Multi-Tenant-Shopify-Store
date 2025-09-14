// --- IMPORTS ---
require('dotenv').config();
require('./utils/bigint.util'); // Handles BigInt serialization for JSON responses
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// --- ROUTE IMPORTS ---
const authRoutes = require('./routes/auth.routes');
const shopifyRoutes = require('./routes/shopify.routes');
const tenantRoutes = require('./routes/tenant.routes');

// --- INITIALIZATION ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- CORE MIDDLEWARE ---
// The middleware order is crucial for the app to function correctly.

// 1. CORS: Must come first to handle preflight OPTIONS requests from the browser.
app.use(cors({
    origin: process.env.HOST_URL, // Your Next.js frontend URL
    credentials: true,               // Required for sending cookies across origins
}));

// 2. Cookie Parser: To read cookies from incoming requests.
app.use(cookieParser());

// 3. Webhook Route: This route requires the raw, unparsed request body for HMAC verification,
//    so it must be registered BEFORE the express.json() parser.
app.use('/api/shopify', shopifyRoutes.webhookRouter);

// 4. JSON Parser: This parses JSON bodies for all subsequent routes.
app.use(express.json());


// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/shopify', shopifyRoutes.router);
app.use('/api/tenants', tenantRoutes);

// --- HEALTH CHECK ROUTE ---
// A simple, public endpoint to verify that the server is up and running.
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// --- SERVER STARTUP ---
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

