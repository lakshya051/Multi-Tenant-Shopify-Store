const express = require('express');
const router = express.Router();
const webhookRouter = express.Router(); 
const shopifyController = require('../controllers/shopify.controller');

router.get('/install', shopifyController.install);
router.get('/callback', shopifyController.callback);

webhookRouter.post('/webhooks/orders/create', express.raw({ type: 'application/json' }), shopifyController.handleWebhook);

module.exports = { router, webhookRouter };